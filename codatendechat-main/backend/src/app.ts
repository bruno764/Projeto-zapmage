import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";
import { messageQueue, sendScheduledMessages } from "./queues";

// Inicializa Sentry
Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();

// 1) Defina os domínios permitidos para CORS
const allowedOrigins = [
  process.env.FRONTEND_URL as string,  // ex: https://app.atendesolucao.com
  "http://localhost:3000",             // para desenvolvimento local
];

// 2) Middleware de CORS (antes de bodyParser e das rotas)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);         // sem origin (curl, etc) → aceita
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Origin não autorizada pelo CORS"));
    },
    credentials: true,                                // permite cookies e headers de auth
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
// Responde automaticamente preflight OPTIONS
app.options("*", cors());

// 3) Middlewares gerais
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));  // JSON de até 10MB
app.use(Sentry.Handlers.requestHandler());

// 4) Configura filas (se estiver usando)
app.set("queues", {
  messageQueue,
  sendScheduledMessages,
});

// 5) Rotas estáticas (upload, build do front se for o mesmo app)
app.use("/public", express.static(uploadConfig.directory));

// 6) Rotas da aplicação
app.use(routes);

// 7) Handler de erros do Sentry
app.use(Sentry.Handlers.errorHandler());

// 8) Middleware de tratamento de erros customizados
app.use(
  async (err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn(err);
      return res.status(err.statusCode).json({ error: err.message });
    }
    logger.error(err);
    return res.status(500).json({ error: "ERR_INTERNAL_SERVER_ERROR" });
  }
);

export default app;
