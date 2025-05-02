// src/config/database.ts
import { Dialect } from "sequelize";

// Validações iniciais para garantir que as ENV existam
if (!process.env.DB_DIALECT) {
  throw new Error("Variável de ambiente DB_DIALECT não definida");
}
if (!process.env.DB_HOST) {
  throw new Error("Variável de ambiente DB_HOST não definida");
}
if (!process.env.DB_NAME) {
  throw new Error("Variável de ambiente DB_NAME não definida");
}
if (!process.env.DB_USER) {
  throw new Error("Variável de ambiente DB_USER não definida");
}
if (!process.env.DB_PASS) {
  throw new Error("Variável de ambiente DB_PASS não definida");
}

const databaseConfig = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
  },
  // Aqui garantimos que o dialect sempre virá da ENV
  dialect: process.env.DB_DIALECT as Dialect,
  timezone: "-03:00",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  logging:
    process.env.DB_DEBUG === "true"
      ? (msg: string) =>
          console.log(`[Sequelize] ${new Date().toISOString()}: ${msg}`)
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

export default databaseConfig;
