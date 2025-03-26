import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlist.controller";

const router = express.Router();

router.post("/", addToWatchlist); // Add film to watchlist
router.get("/:profileId", getWatchlist); // Get watchlist by profile
router.delete("/:watchlistId", removeFromWatchlist); // Remove item

export const watchlistRouter = router;
