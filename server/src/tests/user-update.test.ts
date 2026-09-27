import { describe, it, expect, vi, beforeEach } from "vitest";

const findById = vi.fn();
const findByIdAndUpdate = vi.fn();
vi.mock("../models/user", () => ({
  default: {
    findById: (id: string) => findById(id),
    findByIdAndUpdate: (...args: unknown[]) => findByIdAndUpdate(...args),
  },
}));
vi.mock("../utils/notification", () => ({ sendNotification: vi.fn() }));

import { updateUser } from "../controllers/user.controller";
import { mockReq, mockRes } from "./helpers";

const ME = "64b7f0c2a3b4c5d6e7f80912";
const OTHER = "64b7f0c2a3b4c5d6e7f80999";
const target = (role = "student") => ({ role, membershipStatus: { isMember: false } });

const update = async (requester: { id: string; role: string }, id: string, body: object) => {
  const res = mockRes();
  await updateUser(mockReq({ user: requester, params: { id }, body }), res);
  return res;
};

const appliedUpdates = () => findByIdAndUpdate.mock.calls[0][1] as Record<string, unknown>;

beforeEach(() => {
  findById.mockReset();
  findByIdAndUpdate.mockReset();
  findByIdAndUpdate.mockReturnValue({
    populate: async () => ({ membershipStatus: { isMember: false } }),
  });
});

describe("updateUser", () => {
  it("only lets people change their own email and year level", async () => {
    findById.mockResolvedValue(target());
    await update({ id: ME, role: "student" }, ME, {
      email: "me@example.com",
      yearLevel: 3,
      role: "council-officer",
      isActive: false,
      password: "hacked",
      studentNumber: "00-0000-000",
    });
    const applied = appliedUpdates();
    expect(applied.email).toBe("me@example.com");
    expect(applied.yearLevel).toBe(3);
    for (const blocked of ["role", "isActive", "password", "studentNumber"]) {
      expect(applied).not.toHaveProperty(blocked);
    }
  });

  it("blocks a student from making themselves admin", async () => {
    findById.mockResolvedValue(target());
    const res = await update({ id: ME, role: "student" }, ME, { role: "admin" });
    expect(res.statusCode).toBe(403);
    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("blocks a non-admin from assigning the admin role", async () => {
    findById.mockResolvedValue(target());
    const res = await update({ id: OTHER, role: "council-officer" }, ME, { role: "admin" });
    expect(res.statusCode).toBe(403);
    expect(findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("blocks a non-admin from editing an admin account", async () => {
    findById.mockResolvedValue(target("admin"));
    const res = await update({ id: OTHER, role: "council-officer" }, ME, { firstName: "X" });
    expect(res.statusCode).toBe(403);
  });

  it("lets officers manage roles and status, but never passwords", async () => {
    findById.mockResolvedValue(target());
    await update({ id: OTHER, role: "council-officer" }, ME, {
      role: "committee-officer",
      isActive: false,
      password: "hacked",
      resetPasswordCode: "123456",
    });
    const applied = appliedUpdates();
    expect(applied.role).toBe("committee-officer");
    expect(applied.isActive).toBe(false);
    expect(applied).not.toHaveProperty("password");
    expect(applied).not.toHaveProperty("resetPasswordCode");
  });

  it("rejects an invalid id", async () => {
    const res = await update({ id: OTHER, role: "admin" }, "nope", {});
    expect(res.statusCode).toBe(400);
  });
});
