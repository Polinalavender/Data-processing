// src/config/database.config.ts
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const databaseConfig = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "JWT_SECRET",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "netflix-clone",
    dialect: "postgres",
    // Only set SSL in prod. Locally, leave it off.
    dialectOptions: isProd
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
  },
};
