import { Request, Response, NextFunction } from "express";
import Watchlist from "../models/watchlist.model";

// Add to watchlist
export const addToWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Watchlist.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// Get watchlist
export const getWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const list = await Watchlist.findAll({ where: { profileId: req.params.profileId } });
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await Watchlist.destroy({ where: { watchlistId: req.params.watchlistId } });

    if (!deleted) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    res.status(200).json({ message: "Removed from watchlist" });
  } catch (error) {
    next(error);
  }
};
