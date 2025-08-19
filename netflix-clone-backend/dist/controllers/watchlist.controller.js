import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlist.controller";

const router = express.Router();

router.post("/", addToWatchlist);
router.get("/:profileId", getWatchlist);
router.delete("/:watchlistId", removeFromWatchlist);

export const watchlistRouter = router;
