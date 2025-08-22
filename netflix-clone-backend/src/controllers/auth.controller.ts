import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { IRefreshTokenRequestBody } from "../interfaces/user-auth.interface";

export const refreshToken = async (
  req: Request<{}, {}, IRefreshTokenRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, email, refreshToken } = req.body;

    if (!id || !email || !refreshToken) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findOne({ where: { id } });

    if (!user) { // User does not exist
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "REFRESH_TOKEN_SECRET",
      (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err || !decoded) {
          res.status(403).json({ message: "Invalid refresh token" });
          return;
        }

        const payload = decoded as jwt.JwtPayload;
        if (payload.id !== user.id || payload.email !== user.email) {
          res.status(403).json({ message: "Token payload mismatch" });
          return;
        }

        const token = user.generateToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        user.save();

        res.status(200).json({ token });
      }
    );
  } catch (error) {
    next(error);
  }
};
