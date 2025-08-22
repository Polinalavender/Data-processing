import { Request, Response, NextFunction } from "express";
import express from "express";
import User from "../models/user.model";
import { ValidationError } from "sequelize";
import { IUserRequest, ILoginRequestBody, IRegisterRequestBody } from "../interfaces/user-auth.interface";
import Subscription from "../models/subscription.model";

const MAX_FAILED_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000;

export const register = async (
  req: Request<{}, {}, IRegisterRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = User.build({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "Junior",
      language: req.body.language || "en",
      accountActivation: req.body.accountActivation ?? false,
      status: (req.body.status as "active" | "inactive") || "active",
      referredBy: req.body.referredBy || null,
      hasReferralBonus: false,
    });

    if (!newUser) {
      throw new Error("Invalid user data");
    }

    const user = await newUser.save();

    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    if (user.referredBy) {
      const referrer = await User.findByPk(user.referredBy);

      if (referrer && !referrer.hasReferralBonus) {
        await user.update({ hasReferralBonus: true });
        await referrer.update({ hasReferralBonus: true });

        const referrerSubscription = await Subscription.findOne({
          where: { userId: referrer.id },
        });

        if (referrerSubscription && referrerSubscription.price > 2) {
          await referrerSubscription.update({
            price: referrerSubscription.price - 2,
          });
        } else {
          console.log("Referrer already received the maximum discount or no paid subscription.");
        }

        console.log(`Referral bonus applied: ${user.email} & ${referrer.email}`);
      }
    }

    res.status(201).json({ user, token, refreshToken });
    return;
  } catch (error) {
    if (error instanceof ValidationError) {
      const errorMessages = error.errors.map((err) => err.message);
      res.status(422).json({
        status: "fail",
        message: "Validation Error",
        errors: errorMessages,
      });
      return;
    }
    console.error(error);
    res.status(400).json({ message: "Registration failed", error: (error as Error).message });
    return;
  }
};

export const login = async (
  req: Request<{}, {}, ILoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({
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
      return;
    }

    const isPasswordAuthentic = await user.validatePassword(req.body.password);
    if (!isPasswordAuthentic) {
      user.failedAttempts += 1;
      await user.update({ failedAttempts: user.failedAttempts });

      if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        await user.update({ lockUntil: user.lockUntil });
      }

      await user.save();
      res.status(422).json(errors);
      return;
    }

    // Success: reset counters
    user.failedAttempts = 0;
    user.lockUntil = null;

    // Rotate refresh token on login for consistency with register
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ user, token, refreshToken });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Login failed", error: (error as Error).message });
    return;
  }
};

/**
 * Return the currently authenticated user.
 * Assumes an auth middleware puts the user id on req.user.id (adapt if different).
 */
export const currentUser = async (req: IUserRequest, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to fetch current user", error: (error as Error).message });
    return;
  }
};

/**
 * Fetch a user by :id route param (public or protected depending on your routes).
 */
export const getUserById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to fetch user", error: (error as Error).message });
    return;
  }
};
