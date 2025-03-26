import { Request, Response, NextFunction } from "express";
import Subscription from "../models/subscription.model";

export const subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, plan, startDate, endDate, price } = req.body;

    console.log("Incoming subscription data:", {
      userId,
      plan,
      startDate,
      endDate,
      price,
    });

    const existing = await Subscription.findOne({ where: { userId } });

    if (existing) {
      res.status(400).json({ message: "Already subscribed" });
      return;
    }

    const subscription = await Subscription.create({
      userId,
      plan,
      startDate,
      endDate,
      price,
    });

    res.status(201).json(subscription);
  } catch (error: any) {
    console.error("Subscription creation error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sub = await Subscription.findOne({
      where: { userId: req.params.userId },
    });

    if (!sub) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }

    res.status(200).json(sub);
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await Subscription.destroy({
      where: { userId: req.params.userId },
    });

    if (deleted === 0) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
};