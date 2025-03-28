import { Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
