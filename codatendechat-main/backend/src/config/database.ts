// src/config/database.ts
import "../bootstrap";
import { Dialect } from "sequelize";

const config = {
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_bin",
  },
  dialect: process.env.DB_DIALECT as Dialect,
  timezone: "-03:00",
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME!,
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  logging:
    process.env.DB_DEBUG === "true"
      ? (msg: string) =>
          console.log(`[Sequelize] ${new Date().toISOString()}: ${msg}`)
      : false,
  pool: {
    max: 20,
    min: 1,
    acquire: 0,
    idle: 30000,
    evict: 1000 * 60 * 5,
  },
  retry: {
    max: 3,
    timeout: 30000,
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

export default config;
