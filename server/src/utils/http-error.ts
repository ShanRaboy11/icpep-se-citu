import { Response } from "express";
import mongoose from "mongoose";

interface MappedError {
  status: number;
  message: string;
}

export const mapError = (error: unknown, fallback: string): MappedError => {
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((entry) => entry.message);
    return { status: 400, message: messages.join(" ") || "Some fields are invalid" };
  }
  if (error instanceof mongoose.Error.CastError) {
    return { status: 400, message: `Invalid ${error.path}` };
  }
  const code = (error as { code?: number | string } | null)?.code;
  if (code === 11000) {
    return { status: 409, message: "That already exists" };
  }
  if ((error as { name?: string } | null)?.name === "MulterError") {
    return { status: 400, message: (error as Error).message };
  }
  return { status: 500, message: fallback };
};

export const respondWithError = (res: Response, error: unknown, fallback: string): void => {
  const { status, message } = mapError(error, fallback);
  res.status(status).json({ success: false, message });
};
