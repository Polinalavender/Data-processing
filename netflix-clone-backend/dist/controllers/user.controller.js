"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const sequelize_1 = require("sequelize");
const register = async (req, res, next) => {
    try {
        const newUser = user_model_1.default.build({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || "Junior",
            language: req.body.language || "en",
            accountActivation: req.body.accountActivation ?? false,
            status: req.body.status || "active",
        });
        const user = await newUser.save();
        const token = user.generateToken();
        const refreshToken = user.generateRefreshToken();
        // Update refresh token in database
        user.refreshToken = refreshToken;
        await user.save();
        res.status(201).json({ user, token });
    }
    catch (error) {
        if (error instanceof sequelize_1.ValidationError) {
            const errorMessages = error.errors.map((err) => err.message);
            res.status(422).json({
                status: "fail",
                message: "Validation Error",
                errors: errorMessages,
            });
            return;
        }
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const user = await user_model_1.default.findOne({
            where: { email: req.body.email },
            attributes: { include: ["password", "refreshToken"] },
        });
        const errors = { emailOrPassword: "Invalid email or password" };
        if (!user) {
            res.status(422).json(errors);
            return;
        }
        const isPasswordAuthentic = await user.validatePassword(req.body.password);
        if (!isPasswordAuthentic) {
            res.status(422).json(errors);
            return;
        }
        const token = user.generateToken();
        const refreshToken = user.generateRefreshToken();
        // Update refresh token in database
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({ user, refreshToken, token });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const currentUser = async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    }
    catch (error) {
        next(error);
    }
};
exports.currentUser = currentUser;
//# sourceMappingURL=user.controller.js.map