import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const findById = vi.fn();
vi.mock("../models/user", () => ({ default: { findById: (id: string) => findById(id) } }));

import {
  authenticateToken,
  authorizeRole,
  authorizeSelfOrRoles,
} from "../middleware/auth.middleware";
import { mockReq, mockRes } from "./helpers";

const ID = "64b7f0c2a3b4c5d6e7f80912";
const sign = (payload: object, secret = process.env.JWT_SECRET!) =>
  jwt.sign(payload, secret, { expiresIn: "1h" });
const bearer = (token: string) => mockReq({ headers: { authorization: `Bearer ${token}` } });
const account = (value: unknown) =>
  findById.mockReturnValue({ select: () => ({ lean: async () => value }) });

beforeEach(() => findById.mockReset());

describe("authenticateToken", () => {
  it("rejects a request with no token", async () => {
    const res = mockRes();
    await authenticateToken(mockReq(), res, vi.fn());
    expect(res.statusCode).toBe(401);
  });

  it("rejects a token signed with another secret", async () => {
    const res = mockRes();
    await authenticateToken(
      bearer(sign({ id: ID, role: "admin" }, "some-other-secret-value")),
      res,
      vi.fn(),
    );
    expect(res.statusCode).toBe(403);
  });

  it("rejects a token whose id is not a valid object id", async () => {
    const res = mockRes();
    await authenticateToken(bearer(sign({ id: "nope", role: "admin" })), res, vi.fn());
    expect(res.statusCode).toBe(403);
  });

  it("rejects a deactivated account, with a message that clears the client session", async () => {
    account({ role: "student", isActive: false });
    const res = mockRes();
    const next = vi.fn();
    await authenticateToken(bearer(sign({ id: ID, role: "student" })), res, next);
    expect(res.statusCode).toBe(401);
    expect((res.body as { message: string }).message.toLowerCase()).toContain("token");
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an account that no longer exists", async () => {
    account(null);
    const res = mockRes();
    await authenticateToken(bearer(sign({ id: ID, role: "admin" })), res, vi.fn());
    expect(res.statusCode).toBe(401);
  });

  it("rejects a token issued before the password was reset", async () => {
    account({ role: "student", isActive: true, tokenVersion: 2 });
    const res = mockRes();
    const next = vi.fn();
    await authenticateToken(bearer(sign({ id: ID, role: "student", tv: 1 })), res, next);
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts a token whose version matches, and older tokens without one", async () => {
    account({ role: "student", isActive: true, tokenVersion: 0 });
    const next = vi.fn();
    await authenticateToken(bearer(sign({ id: ID, role: "student" })), mockRes(), next);
    expect(next).toHaveBeenCalledTimes(1);
    account({ role: "student", isActive: true, tokenVersion: 3 });
    await authenticateToken(bearer(sign({ id: ID, role: "student", tv: 3 })), mockRes(), next);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it("uses the current role, not the one in the token", async () => {
    account({ role: "student", isActive: true });
    const req = bearer(sign({ id: ID, role: "admin" }));
    const next = vi.fn();
    await authenticateToken(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user?.role).toBe("student");
  });
});

describe("authorizeRole", () => {
  const run = (role: string, ...allowed: string[]) => {
    const res = mockRes();
    const next = vi.fn();
    authorizeRole(...allowed)(mockReq({ user: { id: ID, role } }), res, next);
    return { res, next };
  };

  it("lets an allowed role through", () => {
    expect(run("council-officer", "council-officer").next).toHaveBeenCalled();
  });

  it("lets admins through everywhere", () => {
    expect(run("admin", "council-officer").next).toHaveBeenCalled();
  });

  it("blocks other roles", () => {
    const { res, next } = run("student", "council-officer");
    expect(res.statusCode).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("blocks an unauthenticated request", () => {
    const res = mockRes();
    authorizeRole("student")(mockReq(), res, vi.fn());
    expect(res.statusCode).toBe(401);
  });
});

describe("authorizeSelfOrRoles", () => {
  it("lets a user act on their own record", () => {
    const next = vi.fn();
    authorizeSelfOrRoles("council-officer")(
      mockReq({ user: { id: ID, role: "student" }, params: { id: ID } }),
      mockRes(),
      next,
    );
    expect(next).toHaveBeenCalled();
  });

  it("blocks a student acting on someone else", () => {
    const res = mockRes();
    authorizeSelfOrRoles("council-officer")(
      mockReq({ user: { id: ID, role: "student" }, params: { id: "other" } }),
      res,
      vi.fn(),
    );
    expect(res.statusCode).toBe(403);
  });
});
