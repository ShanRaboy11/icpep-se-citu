import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { validateObjectId } from "../middleware/validate-id";

const run = (value: string) => {
  const status = vi.fn().mockReturnThis();
  const json = vi.fn();
  const next = vi.fn();
  validateObjectId({} as Request, { status, json } as unknown as Response, next, value);
  return { status, json, next };
};

describe("validateObjectId", () => {
  it("passes a real ObjectId through", () => {
    const { next, status } = run("507f1f77bcf86cd799439011");
    expect(next).toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
  });

  it("answers 400 for a malformed id", () => {
    const { next, status } = run("not-an-id");
    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(400);
  });
});
