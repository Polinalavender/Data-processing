"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ message: "Authorization header is missing" });
            return;
        }
        const jwtToken = authHeader.split(" ").pop();
        if (!jwtToken) {
            res.status(401).json({ message: "Token is missing" });
            return;
        }
        const decodedData = jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET || "JWT_SECRET");
        const user = await user_model_1.default.findOne({ where: { id: decodedData.id } });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        req.user = user.toJSON();
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map