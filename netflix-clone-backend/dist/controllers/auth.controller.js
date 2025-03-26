"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken = async (req, res, next) => {
    try {
        const { id, email, refreshToken } = req.body;
        if (!id || !email || !refreshToken) {
            // id, email, and refresh token are required
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const user = await user_model_1.default.findOne({ where: { id } });
        if (!user) {
            // User does not exist
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET", (err, decoded) => {
            if (err || !decoded) {
                res.status(403).json({ message: "Invalid refresh token" });
                return;
            }
            const payload = decoded;
            if (payload.id !== user.id || payload.email !== user.email) {
                res.status(403).json({ message: "Token payload mismatch" });
                return;
            }
            const token = user.generateToken();
            const newRefreshToken = user.generateRefreshToken();
            user.refreshToken = newRefreshToken;
            user.save();
            res.status(200).json({ token });
        });
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map