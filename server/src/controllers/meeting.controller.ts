import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Meeting, { IMeeting } from "../models/meeting";

interface CreateMeetingBody {
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[]; // YYYY-MM-DD
  startTime: string; // "HH:MM AM/PM"
  endTime: string; // "HH:MM AM/PM"
  timeLimit?: string; // optional
}

export const createMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
      return;
    }

    const {
      title,
      agenda,
      departments = [],
      selectedDates = [],
      startTime,
      endTime,
      timeLimit = "No Limit",
    } = req.body as Partial<CreateMeetingBody>;

    if (
      !title ||
      !agenda ||
      !startTime ||
      !endTime ||
      !Array.isArray(selectedDates) ||
      selectedDates.length === 0
    ) {
      res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
      return;
    }

    const meeting = await Meeting.create({
      title,
      agenda,
      departments,
      selectedDates,
      startTime,
      endTime,
      timeLimit,
      createdBy: new mongoose.Types.ObjectId(userId),
      isPublished: true,
    });

    await meeting.populate("createdBy", "firstName lastName studentNumber");

    res
      .status(201)
      .json({ success: true, message: "Meeting created", data: meeting });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create meeting",
      error: (error as Error).message,
    });
  }
};

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const { upcoming, me, q } = req.query as Record<string, string>;

    const query: any = {};
    if (me === "true" && req.user?.id) {
      query.createdBy = req.user.id;
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { agenda: { $regex: q, $options: "i" } },
      ];
    }

    // Fetch all meetings first
    let meetings = await Meeting.find(query).sort({ createdAt: -1 }).lean();

    console.log(
      `[GET /meetings] Found ${meetings.length} total meetings in DB.`
    );

    if (upcoming === "true") {
      // Use local date string (Philippines time)
      const today = new Date();
      // 'en-CA' gives YYYY-MM-DD format
      const todayStr = today.toLocaleDateString("en-CA");

      console.log(`[Filtering] Checking for meetings on or after: ${todayStr}`);

      meetings = meetings.filter((m) => {
        // --- FIX IS HERE ---
        // We fallback to [] if selectedDates is undefined or null
        const dates = m.selectedDates || [];

        // Check if ANY selected date is in the future or today
        return dates.some((d) => d >= todayStr);
      });

      console.log(
        `[Filtering] ${meetings.length} meetings remain after filter.`
      );
    }

    res.json({ success: true, data: meetings });
  } catch (error) {
    console.error("Error in getMeetings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
      error: (error as Error).message,
    });
  }
};

export const getMeetingById = async (req: Request, res: Response) => {
  try {
    const meeting = await Meeting.findById(req.params.id).populate(
      "createdBy",
      "firstName lastName studentNumber"
    );
    if (!meeting) {
      res.status(404).json({ success: false, message: "Meeting not found" });
      return;
    }
    res.json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
      error: (error as Error).message,
    });
  }
};

export const updateMeeting = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      res.status(404).json({ success: false, message: "Meeting not found" });
      return;
    }

    // Only creator can update
    if (!userId || meeting.createdBy.toString() !== userId) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }

    const allowed: (keyof IMeeting)[] = [
      "title",
      "agenda",
      "departments",
      "selectedDates",
      "startTime",
      "endTime",
      "timeLimit",
      "isPublished",
    ] as any;

    for (const key of allowed) {
      if (key in req.body) {
        // @ts-ignore
        meeting[key] = req.body[key];
      }
    }

    await meeting.save();
    res.json({ success: true, message: "Meeting updated", data: meeting });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update meeting",
      error: (error as Error).message,
    });
  }
};

export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      res.status(404).json({ success: false, message: "Meeting not found" });
      return;
    }
    if (!userId || meeting.createdBy.toString() !== userId) {
      res.status(403).json({ success: false, message: "Forbidden" });
      return;
    }
    await meeting.deleteOne();
    res.json({ success: true, message: "Meeting deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
      error: (error as Error).message,
    });
  }
};
