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
    generateToken() {
        return jsonwebtoken_1.default.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET || "JWT_SECRET", {
            expiresIn: "24h",
        });
    }
    generateRefreshToken() {
        return jsonwebtoken_1.default.sign({ id: this.id, email: this.email }, process.env.REFRESH_TOKEN_SECRET || "REFRESH_SECRET", {
            expiresIn: "7d",
        });
    }
    async validatePassword(password) {
        return bcryptjs_1.default.compare(password, this.password);
    }
    toJSON() {
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
    }, {
        sequelize,
        tableName: "users",
    });
    // Hash password before saving
    User.beforeCreate(async (user) => {
        user.password = await bcryptjs_1.default.hash(user.password, 10);
    });
};
exports.initUserModel = initUserModel;
exports.default = User;
//# sourceMappingURL=user.model.js.map