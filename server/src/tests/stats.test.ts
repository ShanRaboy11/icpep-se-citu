import { describe, it, expect, vi, beforeEach } from "vitest";

const countUsers = vi.fn();
const countEvents = vi.fn();
vi.mock("../models/user", () => ({ default: { countDocuments: (...a: unknown[]) => countUsers(...a) } }));
vi.mock("../models/event", () => ({ default: { countDocuments: (...a: unknown[]) => countEvents(...a) } }));

import { getPublicStats, resetStatsCache } from "../controllers/stats.controller";
import { mockReq, mockRes } from "./helpers";

beforeEach(() => {
  countUsers.mockReset();
  countEvents.mockReset();
  resetStatsCache();
});

describe("getPublicStats", () => {
  it("counts active members and published events that already happened", async () => {
    countUsers.mockResolvedValue(212);
    countEvents.mockResolvedValue(17);
    const res = mockRes();
    await getPublicStats(mockReq(), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, data: { members: 212, events: 17 } });
    expect(countUsers).toHaveBeenCalledWith({ "membershipStatus.isMember": true });
    expect(countEvents.mock.calls[0][0]).toMatchObject({ isPublished: true });
  });

  it("serves repeat requests from the cache", async () => {
    countUsers.mockResolvedValue(1);
    countEvents.mockResolvedValue(1);
    await getPublicStats(mockReq(), mockRes());
    await getPublicStats(mockReq(), mockRes());
    expect(countUsers).toHaveBeenCalledTimes(1);
  });

  it("reports a failure without leaking details", async () => {
    countUsers.mockRejectedValue(new Error("db exploded"));
    countEvents.mockResolvedValue(0);
    const res = mockRes();
    await getPublicStats(mockReq(), res);
    expect(res.statusCode).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain("exploded");
  });
});
