"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBonusByUserId = exports.getUserById = exports.currentUser = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const sequelize_1 = require("sequelize");
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const MAX_FAILED_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000;
const register = async (req, res, next) => {
    try {
        // Create a new user object
        const newUser = user_model_1.default.build({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || "Junior",
            language: req.body.language || "en",
            accountActivation: req.body.accountActivation ?? false,
            status: req.body.status || "active",
            referredBy: req.body.referredBy || null, // Referral code field
            hasReferralBonus: false, // Initially set to false
        });
        const user = await newUser.save();
        const token = user.generateToken();
        const refreshToken = user.generateRefreshToken();
        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();
        // Referral logic: check if the user was referred by someone
        if (user.referredBy) {
            const referrer = await user_model_1.default.findByPk(user.referredBy);
            // If the referrer exists and has not yet received the referral bonus, apply the bonus
            if (referrer && !referrer.hasReferralBonus) {
                // Update both the new user and the referrer to have a referral bonus
                await user.update({ hasReferralBonus: true });
                await referrer.update({ hasReferralBonus: true });
                // Check if the referrer has a paid subscription and apply the €2 discount
                const referrerSubscription = await subscription_model_1.default.findOne({
                    where: { userId: referrer.id },
                });
                if (referrerSubscription && referrerSubscription.price > 2) {
                    await referrerSubscription.update({
                        price: referrerSubscription.price - 2, // Apply €2 discount
                    });
                }
                else {
                    console.log("Referrer already received the maximum discount or no paid subscription.");
                }
                console.log(`Referral bonus applied: ${user.email} & ${referrer.email}`);
            }
        }
        res.status(201).json({ user, token, refreshToken });
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
        if (user.lockUntil && user.lockUntil > new Date()) {
            const timeRemaining = Math.ceil((user.lockUntil.getTime() - new Date().getTime()) / 1000);
            res.status(403).json({ message: `Account is temporarily locked. Try again in ${timeRemaining} seconds.` });
        }
        const isPasswordAuthentic = await user.validatePassword(req.body.password);
        if (!isPasswordAuthentic) {
            // Increment failed login attempts
            user.failedAttempts += 1;
            await user.update({ failedAttempts: user.failedAttempts });
            // Lock account if failed attempts exceed MAX_FAILED_ATTEMPTS
            if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil = new Date(new Date().getTime() + LOCK_TIME); // Set lock time for 15 minutes
                await user.update({ lockUntil: user.lockUntil });
            }
            await user.save();
            res.status(422).json(errors); // Invalid password
        }
        // Reset failed attempts and lock time on successful login
        user.failedAttempts = 0;
        user.lockUntil = null; // Clear the lock
        await user.save();
        // Generate JWT tokens
        const token = user.generateToken();
        const refreshToken = user.generateRefreshToken();
        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();
        // Send the response with user data and tokens
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
const getUserById = async (req, res, next) => {
    try {
        const user = await user_model_1.default.findByPk(req.params.id);
        if (!user)
            res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserById = getUserById;
const updateBonusByUserId = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        const user = await user_model_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.referredBy && !user.hasReferralBonus) {
            const referrer = await user_model_1.default.findByPk(user.referredBy);
            if (referrer && !referrer.hasReferralBonus) {
                // Apply €2 discount
                await user.update({ hasReferralBonus: true });
                await referrer.update({ hasReferralBonus: true });
                console.log(`Referral bonus applied: ${user.email} & ${referrer.email}`);
            }
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateBonusByUserId = updateBonusByUserId;
//# sourceMappingURL=user.controller.js.map