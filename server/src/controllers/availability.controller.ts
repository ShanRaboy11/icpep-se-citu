import { Request, Response } from "express";
import mongoose from "mongoose";
import Availability from "../models/availability";
import Meeting from "../models/meeting";

export const getMeetingAvailability = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const list = await Availability.find({ meeting: meetingId }).populate(
      "user",
      "firstName lastName studentNumber role"
    );
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
      error: (error as Error).message,
    });
  }
};

export const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
      return;
    }
    const doc = await Availability.findOne({
      meeting: meetingId,
      user: userId,
    });
    res.json({
      success: true,
      data: doc || { meeting: meetingId, user: userId, slots: [] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch my availability",
      error: (error as Error).message,
    });
  }
};

export const setMyAvailability = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user?.id;
    const { slots } = req.body as { slots: string[] };

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
      return;
    }
    if (!Array.isArray(slots)) {
      res.status(400).json({ success: false, message: "Invalid slots" });
      return;
    }

    // Validate meeting and constrain slots within selectedDates and time range
    const meeting = await Meeting.findById(meetingId).lean();
    if (!meeting) {
      res.status(404).json({ success: false, message: "Meeting not found" });
      return;
    }

    // Normalize allowed dates into padded YYYY-MM-DD to avoid UTC/local or padding mismatches
    const padDateKey = (key: string): string => {
      if (!key) return "";
      const parts = key.split("-").map((p) => p.trim());
      if (parts.length !== 3) return key;
      const [y, m, d] = parts;
      const mm = String(parseInt(m, 10)).padStart(2, "0");
      const dd = String(parseInt(d, 10)).padStart(2, "0");
      return `${y}-${mm}-${dd}`;
    };
    const allowedDates = new Set(meeting.selectedDates.map(padDateKey));

    const parseTime = (t: string): number => {
      const [hm, ap] = t.split(" ");
      const [hh, mm] = hm.split(":").map((v) => parseInt(v, 10));
      let hour = hh % 12;
      if (ap.toUpperCase() === "PM") hour += 12;
      return hour * 60 + (mm || 0);
    };
    const startMin = parseTime(meeting.startTime);
    const endMin = parseTime(meeting.endTime);

    const validSlots: string[] = [];
    for (const s of slots) {
      const [dateStr, timeStr] = s.split("|");
      if (!dateStr || !timeStr) continue;
      const normalizedDate = padDateKey(dateStr);
      if (!allowedDates.has(normalizedDate)) continue;
      const [th, tm] = timeStr.split(":").map((v) => parseInt(v, 10));
      if (Number.isNaN(th) || Number.isNaN(tm)) continue;
      const minutes = th * 60 + tm;
      // Enforce end-time exclusivity: slot start must be < endMin
      // Client chooses 30-min starts (:00 or :30). For an end at 17:00,
      // the last valid start is 16:30. Any start at 17:00 or later is invalid.
      if (minutes < startMin || minutes >= endMin) continue;
      validSlots.push(s);
    }

    const doc = await Availability.findOneAndUpdate(
      {
        meeting: new mongoose.Types.ObjectId(meetingId),
        user: new mongoose.Types.ObjectId(userId),
      },
      { $set: { slots: validSlots } },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Availability saved", data: doc });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save availability",
      error: (error as Error).message,
    });
  }
};

export const getAvailabilitySummary = async (req: Request, res: Response) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findById(meetingId).lean();
    if (!meeting) {
      res.status(404).json({ success: false, message: "Meeting not found" });
      return;
    }
    const entries = await Availability.find({ meeting: meetingId }).lean();
    const counts: Record<string, number> = {};
    for (const a of entries) {
      for (const s of a.slots) counts[s] = (counts[s] || 0) + 1;
    }
    res.json({
      success: true,
      data: {
        selectedDates: meeting.selectedDates,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        counts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to summarize availability",
      error: (error as Error).message,
    });
  }
};
