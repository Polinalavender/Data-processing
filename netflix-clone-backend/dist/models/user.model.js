"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initUserModel = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class User extends sequelize_1.Model {
    
    generateToken() { // Generate JWT token
        return jsonwebtoken_1.default.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET || "JWT_SECRET", {
            expiresIn: "24h",
        });
    }
   
    generateRefreshToken() {  // Generate refresh token
        return jsonwebtoken_1.default.sign({ id: this.id, email: this.email }, process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET", {
            expiresIn: "7d",
        });
    }

    async validatePassword(password) {
        return bcryptjs_1.default.compare(password, this.password);
    }
    
    toJSON() { // Convert the model to a plain JSON object (without password and refresh token)
        const values = { ...this.get() };
        delete values.password;
        delete values.refreshToken;
        return values;
    }
}
const initUserModel = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM("Junior", "Medior", "Senior", "API"),
            allowNull: false,
            defaultValue: "Junior",
        },
        language: {
            type: sequelize_1.DataTypes.STRING,
            defaultValue: "en",
        },
        accountActivation: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM("active", "inactive"),
            defaultValue: "inactive",
        },
        refreshToken: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        referredBy: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        hasReferralBonus: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        failedAttempts: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        lockUntil: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: "users",
    });

    User.beforeCreate(async (user) => {     // Hash password before saving
        user.password = await bcryptjs_1.default.hash(user.password, 10);
    });
    
    User.beforeUpdate(async (user) => { // Reset failed login attempts and unlock user account after successful login
        if (user.failedAttempts > 3 && !user.lockUntil) {
          
            user.lockUntil = new Date(new Date().getTime() + 15 * 60000);   // Lock the account for 15 minutes if more than 3 failed attempts
        }
    });
};
exports.initUserModel = initUserModel;