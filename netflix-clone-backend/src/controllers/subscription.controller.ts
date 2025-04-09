import { Request, Response, NextFunction } from "express";
import Subscription from "../models/subscription.model";
import User from "../models/user.model";

export const subscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { userId, plan, startDate, endDate, price } = req.body;

    console.log("Incoming subscription data:", {
      userId,
      plan,
      startDate,
      endDate,
      price,
    });

    const parsedStartDate = new Date(startDate);

    if (plan === "FREE") {
      const enforcedEndDate = new Date(parsedStartDate);
      enforcedEndDate.setDate(enforcedEndDate.getDate() + 7);
      endDate = enforcedEndDate;
      price = 0.0;
    }

    const existing = await Subscription.findOne({ where: { userId } });

    if (existing) {
      if (existing.plan === "FREE" && plan !== "FREE") {
        await existing.destroy();
      } else {
        res.status(400).json({ message: "Already subscribed" });
        return;
      }
    }

    const subscription = await Subscription.create({
      userId,
      plan,
      startDate: parsedStartDate,
      endDate,
      price,
    });

    const user = await User.findByPk(userId);

    if (
      user &&
      user.referredBy &&
      !user.hasReferralBonus &&
      plan !== "FREE"
    ) {
      const referrer = await User.findByPk(user.referredBy);

      if (referrer && !referrer.hasReferralBonus) {
        const referrerSubscription = await Subscription.findOne({
          where: { userId: referrer.id },
        });

        if (referrerSubscription && referrerSubscription.plan !== "FREE") {
          await subscription.update({
            price: Math.max(0, subscription.price - 2),
          });

          await referrerSubscription.update({
            price: Math.max(0, referrerSubscription.price - 2),
          });

          await user.update({ hasReferralBonus: true });
          await referrer.update({ hasReferralBonus: true });

          console.log(`Referral bonus applied: ${user.email} & ${referrer.email}`);
        }
      }
    }

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

