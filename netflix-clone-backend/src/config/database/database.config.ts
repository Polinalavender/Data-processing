import { Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production" || process.env.DB_SSL === "true";

export const databaseConfig = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "netflix-clone",
    dialect: "postgres" as Dialect,
    dialectOptions: isProd
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {}, // no SSL locally
  },
};
