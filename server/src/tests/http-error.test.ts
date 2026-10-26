import { describe, it, expect } from "vitest";
import mongoose from "mongoose";
import { mapError } from "../utils/http-error";

describe("mapError", () => {
  it("treats a failed validation as the caller's mistake", () => {
    const error = new mongoose.Error.ValidationError();
    error.addError("accentColor", new mongoose.Error.ValidatorError({ message: "accentColor is not a valid color", path: "accentColor" }));
    expect(mapError(error, "Failed")).toEqual({ status: 400, message: "accentColor is not a valid color" });
  });

  it("answers 400 for a bad id and 409 for a duplicate", () => {
    expect(mapError(new mongoose.Error.CastError("ObjectId", "x", "_id"), "Failed").status).toBe(400);
    expect(mapError({ code: 11000 }, "Failed")).toEqual({ status: 409, message: "That already exists" });
  });

  it("keeps the fallback 500 for anything unexpected", () => {
    expect(mapError(new Error("boom"), "Failed to save")).toEqual({ status: 500, message: "Failed to save" });
  });
});
