// src/config/database.ts
import { Dialect } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL não definida");
}

export default {
  // aqui você passa a string completa para o Sequelize
  url,

  // força Postgres (em Railway sempre é Postgres)
  dialect: "postgres" as Dialect,

  // opcionalmente mantenha pool, retry, define, timezone etc.
  define: { charset: "utf8mb4", collate: "utf8mb4_bin" },
  timezone: "-03:00",
  logging: false,
  pool: { max: 20, min: 1, acquire: 0, idle: 30_000, evict: 1000 * 60 * 5 },
  retry: { max: 3, timeout: 30_000, match: [ /ETIMEDOUT/ ] },
};
