import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";

const findOneSettings = vi.fn();
const findByIdUser = vi.fn();
vi.mock("../models/siteSettings", () => ({
  default: { findOne: () => ({ lean: () => findOneSettings() }) },
}));
vi.mock("../models/user", () => ({
  default: { findById: (id: string) => ({ select: () => ({ lean: () => findByIdUser(id) }) }) },
}));

import { enforceMaintenanceMode } from "../middleware/maintenance.middleware";
import { mockReq, mockRes } from "./helpers";

const ADMIN_ID = "64b7f0c2a3b4c5d6e7f80912";
const sign = (payload: object) => jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
const bearer = (token: string) => mockReq({ headers: { authorization: `Bearer ${token}` }, path: "/api/events" });

beforeEach(() => {
  findOneSettings.mockReset();
  findByIdUser.mockReset();
});

describe("enforceMaintenanceMode", () => {
  it("lets requests through when maintenance mode is off", async () => {
    findOneSettings.mockResolvedValue({ maintenanceMode: false });
    const next = vi.fn();
    await enforceMaintenanceMode(mockReq({ path: "/api/events" }), mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("suspends an anonymous request during maintenance", async () => {
    findOneSettings.mockResolvedValue({
      maintenanceMode: true,
      maintenanceMessage: "Down for maintenance.",
    });
    const res = mockRes();
    const next = vi.fn();
    await enforceMaintenanceMode(mockReq({ path: "/api/events" }), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(503);
    expect((res.body as { message: string }).message).toBe("Down for maintenance.");
  });

  it("suspends a non-admin's request even with a valid token", async () => {
    findOneSettings.mockResolvedValue({ maintenanceMode: true, maintenanceMessage: "x" });
    findByIdUser.mockResolvedValue({ role: "council-officer", isActive: true });
    const res = mockRes();
    const next = vi.fn();
    await enforceMaintenanceMode(bearer(sign({ id: ADMIN_ID })), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(503);
  });

  it("lets an active admin through", async () => {
    findOneSettings.mockResolvedValue({ maintenanceMode: true, maintenanceMessage: "x" });
    findByIdUser.mockResolvedValue({ role: "admin", isActive: true });
    const next = vi.fn();
    await enforceMaintenanceMode(bearer(sign({ id: ADMIN_ID })), mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("suspends a deactivated admin's request", async () => {
    findOneSettings.mockResolvedValue({ maintenanceMode: true, maintenanceMessage: "x" });
    findByIdUser.mockResolvedValue({ role: "admin", isActive: false });
    const res = mockRes();
    const next = vi.fn();
    await enforceMaintenanceMode(bearer(sign({ id: ADMIN_ID })), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(503);
  });

  it("ignores a token signed with the wrong secret", async () => {
    findOneSettings.mockResolvedValue({ maintenanceMode: true, maintenanceMessage: "x" });
    const res = mockRes();
    const next = vi.fn();
    const badToken = jwt.sign({ id: ADMIN_ID }, "some-other-secret", { expiresIn: "1h" });
    await enforceMaintenanceMode(bearer(badToken), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(503);
  });

  it("exempts auth and site-settings routes so admins can still log in and toggle it off", async () => {
    findOneSettings.mockResolvedValue({ maintenanceMode: true, maintenanceMessage: "x" });
    for (const path of ["/api/auth/login", "/api/site/settings"]) {
      const next = vi.fn();
      await enforceMaintenanceMode(mockReq({ path }), mockRes(), next);
      expect(next).toHaveBeenCalled();
    }
  });

  it("ignores non-api paths entirely", async () => {
    const next = vi.fn();
    await enforceMaintenanceMode(mockReq({ path: "/health" }), mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(findOneSettings).not.toHaveBeenCalled();
  });

  it("fails open if the settings lookup throws", async () => {
    findOneSettings.mockRejectedValue(new Error("db down"));
    const next = vi.fn();
    await enforceMaintenanceMode(mockReq({ path: "/api/events" }), mockRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
