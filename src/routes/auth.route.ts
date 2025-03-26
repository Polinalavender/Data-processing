import express from "express";
import { refreshToken } from "../controllers/auth.controller";

const router = express.Router();

router.post("/refresh-token", refreshToken);

export const authRouter = router;