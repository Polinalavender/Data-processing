import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { IUserRequest } from "../interfaces/user-auth.interface";
import { IUserAttributes } from "../interfaces/user.interface";

const authMiddleware = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Authorization header is missing" });
      return;
    }

    const jwtToken = authHeader.split(" ").pop();

    if (!jwtToken) {
      res.status(401).json({ message: "Token is missing" });
      return;
    }

    const decodedData = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET || "JWT_SECRET"
    ) as { id: string; email: string };

    const user = await User.findOne({ where: { id: decodedData.id } });

    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = user.toJSON() as IUserAttributes;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};

export default authMiddleware;
