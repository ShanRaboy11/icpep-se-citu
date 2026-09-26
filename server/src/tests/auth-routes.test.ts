import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import express from "express";
import type { AddressInfo } from "net";
import type { Server } from "http";

const { respond } = vi.hoisted(() => {
  type Res = { status: (code: number) => { json: (body: unknown) => void } };
  return {
    respond: (status: number) => (_req: unknown, res: Res) =>
      res.status(status).json({ success: false }),
  };
});

vi.mock("../controllers/auth.controller", () => ({
  login: respond(401),
  logout: respond(200),
  forgotPassword: respond(200),
  verifyResetCode: respond(400),
  resetPassword: respond(400),
  changePassword: respond(200),
  firstLoginPasswordChange: respond(200),
  getCurrentUser: respond(200),
}));
vi.mock("../models/user", () => ({ default: {} }));

import authRoutes from "../routes/auth.routes";

let server: Server;
let base: string;

beforeAll(() => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);
  server = app.listen(0);
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/auth`;
});

afterAll(() => {
  server.close();
});

const post = (path: string, body: object) =>
  fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const statuses = async (path: string, body: object, times: number) => {
  const out: number[] = [];
  for (let i = 0; i < times; i++) out.push((await post(path, body)).status);
  return out;
};

describe("auth route rate limits", () => {
  it("locks an account after repeated failed logins, without locking others", async () => {
    const result = await statuses("/login", { studentNumber: "23-0000-001", password: "x" }, 10);
    expect(result.slice(0, 8).every((s) => s === 401)).toBe(true);
    expect(result.slice(8)).toEqual([429, 429]);
    const other = await post("/login", { studentNumber: "23-0000-002", password: "x" });
    expect(other.status).toBe(401);
  });

  it("limits reset-code guessing per account", async () => {
    const result = await statuses("/verify-code", { studentNumber: "23-0000-003", code: "000000" }, 7);
    expect(result.slice(0, 5).every((s) => s === 400)).toBe(true);
    expect(result.slice(5)).toEqual([429, 429]);
  });

  it("limits reset emails per account", async () => {
    const result = await statuses("/forgot-password", { studentNumber: "23-0000-004" }, 5);
    expect(result).toEqual([200, 200, 200, 429, 429]);
  });
});
