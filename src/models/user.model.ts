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

  generateToken(): string {
    return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET || "JWT_SECRET", {
      expiresIn: "24h",
    });
  }

  generateRefreshToken(): string {
    return jwt.sign({ id: this.id, email: this.email }, process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET", {
      expiresIn: "7d",
    });
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password);
  }

  toJSON() {
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
    },
    {
      sequelize,
      tableName: "users",
    }
  );

  // Hash password before saving
  User.beforeCreate(async (user) => {
    user.password = await bcryptjs.hash(user.password, 10);
  });
};

export default User;
