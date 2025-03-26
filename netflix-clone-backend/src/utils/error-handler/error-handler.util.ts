import { Response } from "express";

export const handleError = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  } else {
    console.error("Unknown error occurred.");
    res.status(500).json({ error: "An unknown error occurred." });
  }
};
