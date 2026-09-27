import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Meeting from "../models/meeting";
import { sendBulkNotifications } from "../utils/notification";
import Availability from "../models/availability";
import User from "../models/user";
import { escapeRegExp } from "../utils/regex";

interface CreateMeetingBody {
  title: string;
  agenda: string;
  departments: string[];
  selectedDates: string[]; // YYYY-MM-DD
  startTime: string; // "HH:MM AM/PM"
  endTime: string; // "HH:MM AM/PM"
  timeLimit?: string; // optional
  meetingLink?: string; // optional online meeting URL
}

const EDITABLE_MEETING_FIELDS = [
  "title",
  "agenda",
  "departments",
  "selectedDates",
  "startTime",
  "endTime",
  "timeLimit",
  "isPublished",
] as const;

const INVALID_LINK_MESSAGE = "Meeting link must be a valid http(s) URL";

// Returns the cleaned link ("" when there is none), or null when it isn't a
// valid http(s) URL.
const cleanMeetingLink = (value: unknown): string | null => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const link = value.trim();
  if (!link) return "";
  if (link.length > 2048) return null;
  try {
    const { protocol } = new URL(link);
    return protocol === "http:" || protocol === "https:" ? link : null;
  } catch {
    return null;
  }
};

const HAS_COUNCIL_SEAT = {
  $or: [
    { councilPosition: { $nin: [null, ""] } },
    { role: "council-officer" },
  ],
};
const HAS_COMMITTEE_SEAT = {
  $or: [
    { committeeTitle: { $nin: [null, ""] } },
    { role: "committee-officer" },
  ],
};

// Active officers who belong to the selected departments (the same people
// canSeeMeetingLink lets in), minus whoever is creating the meeting.
const findMeetingAudience = async (
  departments: string[],
  creatorId: string,
) => {
  const conditions: object[] = [];
  if (departments.includes("All Officers")) {
    conditions.push(HAS_COUNCIL_SEAT, HAS_COMMITTEE_SEAT);
  }
  if (departments.includes("Executive Council")) {
    conditions.push(HAS_COUNCIL_SEAT);
  }
  const committees = departments.filter(
    (d) => d !== "All Officers" && d !== "Executive Council",
  );
  if (committees.length > 0) {
    conditions.push({
      $and: [
        HAS_COMMITTEE_SEAT,
        {
          $or: [
            { committeeDepartment: { $in: committees } },
            { department: { $in: committees } },
          ],
        },
      ],
    });
  }
  if (conditions.length === 0) return [];

  const users = await User.find({
    isActive: true,
    _id: { $ne: creatorId },
    $or: conditions,
  })
    .select("_id")
    .lean();
  return users.map((user) => user._id);
};

const loadLinkViewer = async (req: Request) => {
  if (!req.user?.id) return null;
  return User.findById(req.user.id)
    .select("role councilPosition committeeTitle committeeDepartment department")
    .lean();
};

// The link is meant for the meeting's creator, admins, and officers who
// belong to one of the selected departments — not everyone who can list meetings.
const canSeeMeetingLink = (
  viewer: Awaited<ReturnType<typeof loadLinkViewer>>,
  meeting: { createdBy?: any; departments?: string[] },
) => {
  if (!viewer) return false;
  if (viewer.role === "admin") return true;
  if (String(meeting.createdBy?._id ?? meeting.createdBy) === String(viewer._id)) {
    return true;
  }

  const departments = meeting.departments ?? [];
  const isCouncil =
    !!viewer.councilPosition || viewer.role === "council-officer";
  const isCommittee =
    !!viewer.committeeTitle || viewer.role === "committee-officer";
  const committee = viewer.committeeDepartment || viewer.department;

  return (
    ((isCouncil || isCommittee) && departments.includes("All Officers")) ||
    (isCouncil && departments.includes("Executive Council")) ||
    (isCommittee && !!committee && departments.includes(committee))
  );
};

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
      meetingLink,
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

    const cleanedLink = cleanMeetingLink(meetingLink);
    if (cleanedLink === null) {
      res.status(400).json({ success: false, message: INVALID_LINK_MESSAGE });
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
      meetingLink: cleanedLink,
      createdBy: new mongoose.Types.ObjectId(userId),
      isPublished: true,
    });

    await meeting.populate("createdBy", "firstName lastName studentNumber");

    // Ask the officers in the selected departments for their availability
    if (departments.length > 0) {
      const recipients = await findMeetingAudience(departments, userId);

      if (recipients.length > 0) {
        // Pending (empty) records are best-effort; the notification is what matters.
        await Availability.insertMany(
          recipients.map((recipient) => ({
            meeting: meeting._id,
            user: recipient,
            slots: [],
          })),
          { ordered: false },
        ).catch(() => undefined);

        await sendBulkNotifications(
          recipients,
          `[COMMEET] Availability Request`,
          `Please add your availability schedule for the meeting: ${title}. Status: Pending${
            cleanedLink ? ` Meeting link: ${cleanedLink}` : ""
          }`,
          "system",
          meeting._id,
          null,
          `/commeet/schedule?meetingId=${meeting._id}`,
        );
      }
    }

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
        { title: { $regex: escapeRegExp(q.slice(0, 100)), $options: "i" } },
        { agenda: { $regex: escapeRegExp(q.slice(0, 100)), $options: "i" } },
      ];
    }

    // Fetch all meetings first
    let meetings = await Meeting.find(query).sort({ createdAt: -1 }).lean();


    const viewer = await loadLinkViewer(req);

    if (upcoming === "true") {
      // Use local date string (Philippines time)
      const today = new Date();
      // 'en-CA' gives YYYY-MM-DD format
      const todayStr = today.toLocaleDateString("en-CA");


      meetings = meetings.filter((m) => {
        // --- FIX IS HERE ---
        // We fallback to [] if selectedDates is undefined or null
        const dates = m.selectedDates || [];

        // Check if ANY selected date is in the future or today
        return dates.some((d) => d >= todayStr);
      });

    }

    const visibleMeetings = meetings.map((m) =>
      canSeeMeetingLink(viewer, m) ? m : { ...m, meetingLink: undefined },
    );

    res.json({ success: true, data: visibleMeetings });
  } catch (error) {
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
    const data = meeting.toObject();
    if (!canSeeMeetingLink(await loadLinkViewer(req), data)) {
      delete data.meetingLink;
    }

    res.json({ success: true, data });
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

    if ("meetingLink" in req.body) {
      const cleanedLink = cleanMeetingLink(req.body.meetingLink);
      if (cleanedLink === null) {
        res.status(400).json({ success: false, message: INVALID_LINK_MESSAGE });
        return;
      }
      meeting.meetingLink = cleanedLink;
    }

    for (const field of EDITABLE_MEETING_FIELDS) {
      if (field in req.body) {
        meeting.set(field, req.body[field]);
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
