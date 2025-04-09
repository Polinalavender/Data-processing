import { DataTypes, Model, Sequelize } from "sequelize";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUserAttributes, IUserCreationAttributes, IUserMethods } from "../interfaces/user.interface";

class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes, IUserMethods {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare language: string;
  declare accountActivation: boolean;
  declare status: "active" | "inactive";
  declare refreshToken: string | null;
  declare referredBy: number | null;
  declare hasReferralBonus: boolean;
  declare failedAttempts: number;  // Track failed login attempts
  declare lockUntil: Date | null;  // Store lock time if account is blocked

  generateToken(): string {   // Generate JWT token
    return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET || "JWT_SECRET", {
      expiresIn: "24h",
    });
  }

  generateRefreshToken(): string { // Generate refresh token
    return jwt.sign({ id: this.id, email: this.email }, process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET", {
      expiresIn: "7d",
    });
  }

  async validatePassword(password: string): Promise<boolean> { // Validate password
    return bcryptjs.compare(password, this.password);
  }

  toJSON() { // Convert the model to a plain JSON object (without password and refresh token)
    const values = { ...this.get() };
    delete values.password;
    delete values.refreshToken;
    return values;
  }
}

export const initUserModel = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Junior", "Medior", "Senior", "API"),
        allowNull: false,
        defaultValue: "Junior",
      },
      language: {
        type: DataTypes.STRING,
        defaultValue: "en",
      },
      accountActivation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "inactive",
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referredBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hasReferralBonus: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      failedAttempts: {  // Track the number of failed login attempts
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lockUntil: {  // Store the date until which the account is locked
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
    }
  );

  User.beforeCreate(async (user) => { // Hash password before saving
    user.password = await bcryptjs.hash(user.password, 10);
  });

  User.beforeUpdate(async (user) => {  // Reset failed login attempts and unlock user account after successful login
    if (user.failedAttempts > 3 && !user.lockUntil) {
      user.lockUntil = new Date(new Date().getTime() + 15 * 60000);  // 15 minutes lock of the account
    }
  });
};

export default User;
