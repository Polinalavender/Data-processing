import express from "express";
import {
  createProfile,
  getProfilesByUser,
  deleteProfile,
} from "../controllers/profile.controller";

const router = express.Router();

router.post("/", createProfile); // Create new profile
router.get("/user/:userId", getProfilesByUser); // Get profiles for a user
router.delete("/:profileId", deleteProfile); // Delete profile

export const profileRouter = router;
