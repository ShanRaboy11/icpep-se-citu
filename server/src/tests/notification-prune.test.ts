import { describe, it, expect, vi, beforeEach } from "vitest";

const { deleteMany } = vi.hoisted(() => ({ deleteMany: vi.fn() }));
vi.mock("../models/notification", () => ({ default: { deleteMany } }));
vi.mock("../models/user", () => ({ default: {} }));

import { pruneNotifications, NOTIFICATION_RETENTION } from "../utils/notification";

const DAY = 24 * 60 * 60 * 1000;

describe("pruneNotifications", () => {
  beforeEach(() => deleteMany.mockReset().mockResolvedValue({ deletedCount: 3 }));

  it("removes old read, dismissed and unread notifications and reports the count", async () => {
    const now = new Date("2026-10-26T00:00:00Z");
    expect(await pruneNotifications(now)).toBe(3);

    const [{ $or }] = deleteMany.mock.calls[0];
    expect($or[0].createdAt.$lt.getTime()).toBe(now.getTime() - NOTIFICATION_RETENTION.readDays * DAY);
    expect($or[1].updatedAt.$lt.getTime()).toBe(now.getTime() - NOTIFICATION_RETENTION.deletedDays * DAY);
    expect($or[2].createdAt.$lt.getTime()).toBe(now.getTime() - NOTIFICATION_RETENTION.anyDays * DAY);
  });
});
