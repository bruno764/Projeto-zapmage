// src/config/database.ts
import { Dialect } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config(); // carrega as variáveis do .env (LOCAL) ou do Railway

// Desestruturação das variáveis
const {
  DATABASE_URL,
  DB_DIALECT,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_DEBUG,
} = process.env;

// Auxiliar para converter porta
const port = DB_PORT ? parseInt(DB_PORT, 10) : undefined;

export interface IDatabaseConfig {
  // se usar connection string (Railway/Heroku) presente em DATABASE_URL
  url?: string;
  dialect: Dialect;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  define: {
    charset: string;
    collate: string;
  };
  timezone: string;
  logging: boolean | ((sql: string) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
    evict: number;
  };
  retry: {
    max: number;
    timeout: number;
    match: RegExp[];
  };
}

// Configuração base comum
const base: Omit<IDatabaseConfig, "dialect"> = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
  },
  timezone: "-03:00",
  logging:
    DB_DEBUG === "true"
      ? (msg) => console.log(`[Sequelize] ${new Date().toISOString()}: ${msg}`)
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

let config: IDatabaseConfig;

if (DATABASE_URL) {
  // Usando connection string completa (recomendado em produção no Railway)
  config = {
    url: DATABASE_URL,
    dialect: "postgres",
    ...base,
  };
} else {
  // Fallback p/ desenvolver localmente sem URL
  if (!DB_HOST) {
    throw new Error("Variável de ambiente DB_HOST não definida");
  }
  config = {
    dialect: (DB_DIALECT as Dialect) || "postgres",
    host: DB_HOST,
    port,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASS,
    ...base,
  };
}

export default config;
