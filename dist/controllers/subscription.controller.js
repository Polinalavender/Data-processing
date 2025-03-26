"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribe = exports.getSubscription = exports.subscribe = void 0;
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const subscribe = async (req, res, next) => {
    try {
        const { userId, plan, startDate, endDate, price } = req.body;
        console.log("Incoming subscription data:", {
            userId,
            plan,
            startDate,
            endDate,
            price,
        });
        const existing = await subscription_model_1.default.findOne({ where: { userId } });
        if (existing) {
            res.status(400).json({ message: "Already subscribed" });
            return;
        }
        const subscription = await subscription_model_1.default.create({
            userId,
            plan,
            startDate,
            endDate,
            price,
        });
        res.status(201).json(subscription);
    }
    catch (error) {
        console.error("Subscription creation error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
exports.subscribe = subscribe;
const getSubscription = async (req, res, next) => {
    try {
        const sub = await subscription_model_1.default.findOne({
            where: { userId: req.params.userId },
        });
        if (!sub) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        res.status(200).json(sub);
    }
    catch (error) {
        next(error);
    }
};
exports.getSubscription = getSubscription;
const unsubscribe = async (req, res, next) => {
    try {
        const deleted = await subscription_model_1.default.destroy({
            where: { userId: req.params.userId },
        });
        if (deleted === 0) {
            res.status(404).json({ message: "Subscription not found" });
            return;
        }
        res.status(200).json({ message: "Unsubscribed successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.unsubscribe = unsubscribe;
//# sourceMappingURL=subscription.controller.js.map