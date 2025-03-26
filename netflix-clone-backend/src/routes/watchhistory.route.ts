import express from "express";
import { trackWatch, getHistoryByProfile } from "../controllers/watchhistory.controller";

const router = express.Router();

router.post("/", trackWatch); // Track watch
router.get("/profile/:profileId", getHistoryByProfile); // Get history by profile

export const watchHistoryRouter = router;
