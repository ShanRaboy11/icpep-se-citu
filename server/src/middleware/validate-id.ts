import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const validateObjectId = (req: Request, res: Response, next: NextFunction, value: string): void => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    res.status(400).json({ success: false, message: "Invalid id" });
    return;
  }
  next();
};
