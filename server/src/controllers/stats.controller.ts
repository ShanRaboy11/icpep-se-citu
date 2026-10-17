import { Request, Response } from "express";
import User from "../models/user";
import Event from "../models/event";

const CACHE_MS = 5 * 60 * 1000;
let cached: { at: number; data: { members: number; events: number } } | null = null;

export const getPublicStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!cached || Date.now() - cached.at > CACHE_MS) {
      const [members, events] = await Promise.all([
        User.countDocuments({ isActive: true, "membershipStatus.isMember": true }),
        Event.countDocuments({ isPublished: true, eventDate: { $lt: new Date() } }),
      ]);
      cached = { at: Date.now(), data: { members, events } };
    }

    res.status(200).json({ success: true, data: cached.data });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};

export const resetStatsCache = () => {
  cached = null;
};
