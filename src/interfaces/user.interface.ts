import { DataTypes } from "sequelize";

export interface IUserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  language: string;
  accountActivation: boolean;
  status: "active" | "inactive",
  refreshToken?: string | null;
}

export interface IUserCreationAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  language?: string;
  accountActivation?: boolean;
  status?: "active" | "inactive";
  refreshToken?: string | null;
}

export interface IUserMethods {
  generateToken(): string;
  generateRefreshToken(): string;
  validatePassword(password: string): Promise<boolean>;
}