import express from "express";
import {
  subscribe,
  getSubscription,
  unsubscribe,
} from "../controllers/subscription.controller";

const router = express.Router();

router.post("/", subscribe);
router.get("/:userId", getSubscription);
router.delete("/:userId", unsubscribe);

export const subscriptionRouter = router;
