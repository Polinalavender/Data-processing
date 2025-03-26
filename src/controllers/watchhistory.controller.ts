import { Request, Response, NextFunction } from "express";
import WatchHistory from "../models/watchhistory.model";

// Add or update watch history
export const trackWatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { profileId, filmId } = req.body;

    const existing = await WatchHistory.findOne({ where: { profileId, filmId } });

    if (existing) {
      existing.watchCount += 1;
      existing.lastWatchedAt = new Date();
      await existing.save();
      res.status(200).json(existing);
    } else {
      const newHistory = await WatchHistory.create({ profileId, filmId, watchCount: 1 });
      res.status(201).json(newHistory);
    }
  } catch (error) {
    next(error);
  }
};

// Get watch history by profile
export const getHistoryByProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const history = await WatchHistory.findAll({ where: { profileId: req.params.profileId } });
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
