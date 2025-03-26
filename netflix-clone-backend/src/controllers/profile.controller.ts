import { Request, Response, NextFunction } from "express";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import { IProfileCreationAttributes } from "../interfaces/profile.interface";

// Create a profile (limit to 4 per user)
export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      name,
      age,
      language,
      preferences,
    }: IProfileCreationAttributes = req.body;

    const count = await Profile.count({ where: { userId } });
    if (count >= 4) {
      res
        .status(400)
        .json({ message: "User can have a maximum of 4 profiles." });
      return;
    }

    const profile = await Profile.create({
      userId,
      name,
      age,
      language: language || 'en',
      preferences: preferences || '',
    });

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

// Get all profiles for a user
export const getProfilesByUser = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profiles = await Profile.findAll({
      where: { userId: req.params.userId },
    });

    res.status(200).json(profiles);
  } catch (error) {
    next(error);
  }
};

// Delete a profile
export const deleteProfile = async (
  req: Request<{ profileId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await Profile.destroy({
      where: { profileId: req.params.profileId },
    });

    if (!deleted) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    next(error);
  }
};
