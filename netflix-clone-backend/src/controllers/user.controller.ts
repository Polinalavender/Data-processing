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
    const newUser = User.build({ // Create a new user object
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "Junior",
      language: req.body.language || "en",
      accountActivation: req.body.accountActivation ?? false,
      status: (req.body.status as "active" | "inactive") || "active",
      referredBy: req.body.referredBy || null, // Referral code field
      hasReferralBonus: false, // Initially set to false
    });

    const user = await newUser.save();
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; // Save refresh token
    await user.save();

    if (user.referredBy) { // Check if the user was referred by someone
      const referrer = await User.findByPk(user.referredBy);

      // If the referrer exists and has not yet received the referral bonus, apply the bonus
      if (referrer && !referrer.hasReferralBonus) {
        await user.update({ hasReferralBonus: true });
        await referrer.update({ hasReferralBonus: true });

        // Check if the referrer has a paid subscription and apply the €2 discount
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
    next(error);
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
    }

    const isPasswordAuthentic = await user.validatePassword(req.body.password);
    if (!isPasswordAuthentic) {
      user.failedAttempts += 1; // Increment failed login attempts
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
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateBonusByUserId = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.referredBy && !user.hasReferralBonus) {
      const referrer = await User.findByPk(user.referredBy);

      if (referrer && !referrer.hasReferralBonus) {
        // Apply €2 discount
        await user.update({ hasReferralBonus: true });
        await referrer.update({ hasReferralBonus: true });

        console.log(`Referral bonus applied: ${user.email} & ${referrer.email}`);
      }
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}