import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { register, login, currentUser } from "../controllers/user.controller";
  
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/currentUser", authMiddleware, currentUser);

export const userRouter = router;