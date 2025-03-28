import express from "express";
import {
  createProfile,
  getProfilesByUser,
  deleteProfile,
  updateProfile
} from "../controllers/profile.controller";

const router = express.Router();

router.post("/", createProfile); // Create new profile
router.get("/:userId", getProfilesByUser); // Get profiles for a user
router.delete("/:profileId", deleteProfile); // Delete profile
router.put("/:profileId", updateProfile); // Update profile (fixed route)

export const profileRouter = router;