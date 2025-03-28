import { Request, Response, NextFunction } from "express";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import { IProfileCreationAttributes } from "../interfaces/profile.interface";

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
      photoUrl
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
      photoUrl: photoUrl || '',
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Create Profile Error:', error);
    next(error);
  }
};

export const getProfilesByUser = async (
  req: Request<{ userId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId, 10);

    const profiles = await Profile.findAll({
      where: { userId },
      raw: true,
    });

    if (profiles.length === 0) {
      res.status(404).json({ message: "No profiles found for this user" });
      return;
    }

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Get Profiles Error:', error);
    next(error);
  }
};

export const deleteProfile = async (
  req: Request<{ profileId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profileId = parseInt(req.params.profileId, 10);
    
    const deleted = await Profile.destroy({
      where: { profileId },
    });

    if (!deleted) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(200).json({ message: "Profile deleted" });
  } catch (error) {
    console.error('Delete Profile Error:', error);
    next(error);
  }
};

export const updateProfile = async (
  req: Request<{ profileId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profileId = parseInt(req.params.profileId, 10);
    const { name, age, language, preferences, photoUrl } = req.body;

    const profile = await Profile.findByPk(profileId);

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const updatedProfile = await profile.update({
      name,
      age,
      language: language || 'en',
      preferences: preferences || '',
      photoUrl: photoUrl || profile.photoUrl
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Update Profile Error:', error);
    next(error);
  }
};