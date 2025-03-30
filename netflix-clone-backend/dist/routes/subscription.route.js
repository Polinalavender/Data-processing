"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRouter = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("../controllers/subscription.controller");
const router = express_1.default.Router();
router.post("/", subscription_controller_1.subscribe);
router.get("/:userId", subscription_controller_1.getSubscription);
router.delete("/:userId", subscription_controller_1.unsubscribe);
exports.subscriptionRouter = router;