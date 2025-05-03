// src/config/database.ts
import { Dialect } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config(); // carrega variáveis de .env (desenvolvimento) ou do ambiente (produção)

// Pega a connection string completa
const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL não definida — configure a variável de ambiente DATABASE_URL no Railway");
}

export default {
  // connection string completa
  url,

  // como estamos usando Postgres no Railway
  dialect: "postgres" as Dialect,

  // configurações adicionais que você já tinha
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
  },
  timezone: "-03:00",
  logging:
    process.env.DB_DEBUG === "true"
      ? (msg: string) => console.log(`[Sequelize] ${new Date().toISOString()}: ${msg}`)
      : false,
  pool: {
    max: 20,
    min: 1,
    acquire: 0,
    idle: 30_000,
    evict: 1000 * 60 * 5,
  },
  retry: {
    max: 3,
    timeout: 30_000,
    match: [
      /Deadlock/i,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeConnectionTimedOutError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionAcquireTimeoutError/,
      /Operation timeout/,
      /ETIMEDOUT/,
    ],
  },
};
