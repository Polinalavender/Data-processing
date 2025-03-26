import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { ValidationError } from "sequelize";
import { IUserRequest, ILoginRequestBody, IRegisterRequestBody } from "../interfaces/user-auth.interface";

export const register = async (
  req: Request<{}, {}, IRegisterRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = User.build({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "Junior",
      language: req.body.language || "en",
      accountActivation: req.body.accountActivation ?? false,
      status: (req.body.status as "active" | "inactive") || "active",
    });
    
    const user = await newUser.save();
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof ValidationError) {
      const errorMessages = error.errors.map((err) => err.message);
      res.status(422).json({
        status: "fail",
        message: "Validation Error",
        errors: errorMessages,
      });
      return;
    }
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, ILoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      attributes: { include: ["password", "refreshToken"] },
    });
    const errors = { emailOrPassword: "Invalid email or password" };

    if (!user) {
      res.status(422).json(errors);
      return;
    }

    const isPasswordAuthentic = await user.validatePassword(req.body.password);
    if (!isPasswordAuthentic) {
      res.status(422).json(errors);
      return;
    }
    
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ user, refreshToken, token });
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};
