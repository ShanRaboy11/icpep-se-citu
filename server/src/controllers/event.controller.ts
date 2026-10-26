import { Request, Response, NextFunction } from "express";
import Event from "../models/event";
import { canManagePost } from "../utils/auth/ownership";
import { escapeHtml } from "../utils/content/html";
import { listVisibility, canViewItem } from "../utils/auth/visibility";
import { pickFields } from "../utils/pick";
import { getOrCreateSettings } from "./siteSettings.controller";
import { resolveContact } from "../utils/content/contact-settings";
import { sanitizeRichText, isBlankRichText } from "../utils/content/rich-text";
import { isRsvpOpen } from "../utils/rsvp";

const EVENT_EDITABLE_FIELDS = [
  "title", "description", "content", "tags", "priority", "targetAudience",
  "isPublished", "publishDate", "expiryDate", "eventDate", "time", "location",
  "organizer", "contact", "rsvpLink", "admissions", "registrationRequired",
  "registrationStart", "registrationEnd", "mode", "details", "galleryImages",
  "coverImage",
] as const;

import {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
} from "../utils/media/cloudinary";
import mongoose from "mongoose";
import { notifyTargetAudience } from "../utils/notification";
import sendEmail from "../utils/mail/email";
import { respondWithError } from "../utils/http-error";

// Local Multer file shape (avoid relying on global Express.Multer augmentation)
type MulterFile = Express.Multer.File;

// Multer-aware request type without extending Express.Request (avoids
// incompatible declaration issues when other libs augment Request)
type MulterRequest = Request & {
  file?: MulterFile;
  files?: MulterFile[] | { [fieldname: string]: MulterFile[] };
};

// Define query type for better type safety
interface EventQuery {
  tags?: { $in: string[] };
  isPublished?: boolean;
  targetAudience?: { $in: string[] };
  priority?: string;
  eventDate?: { $gte?: Date; $lte?: Date };
  $or?: Array<Record<string, unknown>>;
  $and?: Array<Record<string, unknown>>;
}

interface UserEventQuery {
  author: string;
  isPublished?: boolean;
}

// Create a new event
export const createEvent = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      description,
      content,
      tags,
      priority,
      targetAudience,
      isPublished,
      publishDate,
      expiryDate,
      eventDate,
      time,
      location,
      organizer,
      contact,
      rsvpLink,
      admissions,
      registrationRequired,
      registrationStart,
      registrationEnd,
      mode,
    } = req.body;

    // Get author from authenticated user
    const author = req.user?.id;

    if (!author) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Handle image uploads (support multiple files under field 'images')
    let coverImage: string | null = null;
    let galleryImages: string[] = [];

    const multerFiles = req.files as MulterFile[] | undefined;
    const singleFile = req.file as MulterFile | undefined;

    if (Array.isArray(multerFiles) && multerFiles.length > 0) {
      try {
        const buffers = multerFiles
          .filter((f) => !!f.buffer)
          .map((f) => ({ buffer: f.buffer as Buffer }));
        if (buffers.length === 0) {
          throw new Error("No file buffers available for upload");
        }
        const results = await uploadMultipleToCloudinary(buffers, "events");
        galleryImages = results
          .map((r) => r.secure_url)
          .filter(Boolean);
        // Ensure coverImage is set to first uploaded image if not already
        if (!coverImage && galleryImages.length > 0) {
          coverImage = galleryImages[0];
        }
      } catch {
        // Try uploading individually to get partial results
        try {
          for (const f of multerFiles) {
            try {
              if (!f.buffer) {
                continue;
              }
              const singleResult = await uploadToCloudinary(
                f.buffer as Buffer,
                "events"
              );
              const url = singleResult.secure_url;
              if (url) galleryImages.push(url);
              if (!coverImage && url) coverImage = url;
            } catch {
              // continue with others
            }
          }

          if (galleryImages.length === 0) {
            // nothing uploaded successfully
            res.status(500).json({
              success: false,
              message: "Failed to upload images",
            });
            return;
          }
        } catch (fallbackErr) {
          respondWithError(res, fallbackErr, "Failed to upload images");
          return;
        }
      }
    } else if (singleFile) {
      // Backwards compatible: if a single file was uploaded under req.file
      try {
        const buf = singleFile.buffer as Buffer | undefined;
        if (!buf) {
          res
            .status(400)
            .json({ success: false, message: "Uploaded file has no data" });
          return;
        }
        const result = await uploadToCloudinary(buf, "events");
        const url = result.secure_url;
        galleryImages = url ? [url] : [];
        coverImage = url || coverImage;
      } catch (error) {
        respondWithError(res, error, "Failed to upload cover image");
        return;
      }
    }

    // Parse arrays/objects if sent as strings
    let parsedTags, parsedAdmissions, parsedTargetAudience, parsedDetails;

    try {
      parsedTags = tags ? JSON.parse(tags) : [];
      parsedAdmissions = admissions ? JSON.parse(admissions) : [];
      parsedTargetAudience = targetAudience
        ? JSON.parse(targetAudience)
        : ["all"];
      parsedDetails =
        req.body.details && typeof req.body.details === "string"
          ? JSON.parse(req.body.details)
          : req.body.details;
    } catch {
      res.status(400).json({
        success: false,
        message: "Invalid JSON data in request",
      });
      return;
    }

    // Validate required fields
    if (!title || !description || !content || !eventDate || isBlankRichText(String(content))) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, description, content, or eventDate",
      });
      return;
    }

    const eventData: Record<string, unknown> = {
      title,
      description,
      content: sanitizeRichText(String(content)),
      author,
      tags: parsedTags,
      priority,
      targetAudience: parsedTargetAudience,
      isPublished: String(isPublished) === "true",
      publishDate: publishDate || Date.now(),
      expiryDate,
      eventDate: new Date(eventDate),
      time,
      mode: mode || "Onsite",
      location,
      organizer,
      contact,
      rsvpLink,
      admissions: parsedAdmissions,
      registrationRequired:
        registrationRequired === "true" || registrationRequired === true,
      registrationStart: registrationStart
        ? new Date(registrationStart)
        : undefined,
      registrationEnd: registrationEnd ? new Date(registrationEnd) : undefined,
      coverImage:
        coverImage || (galleryImages.length > 0 ? galleryImages[0] : null),
      galleryImages,
      details: parsedDetails,
    };

    // If a publishDate exists and it's in the future, ensure event remains unpublished until scheduler runs
    // BUT if the user explicitly set isPublished=false (draft), respect that regardless of date.
    const parsedPublishDate = publishDate ? new Date(publishDate) : undefined;
    if (
      eventData.isPublished &&
      parsedPublishDate &&
      parsedPublishDate > new Date()
    ) {
      eventData.isPublished = false;
      eventData.scheduled = true;
    } else if (!eventData.isPublished) {
      eventData.scheduled = false;
    }

    const event = await Event.create(eventData);
    await event.populate("author", "firstName lastName studentNumber");

    // Send notification if published
    if (event.isPublished) {
      await notifyTargetAudience(
        event.targetAudience || ["all"],
        `[NEW] ${event.title}`,
        `New event: ${event.title}`,
        "event",
        event._id,
        "Event",
        `/events/${event._id}`
      );
    }

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to create event",
      ...(process.env.NODE_ENV === "development" && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    });
  }
};

// Get all events (with filters)
export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      tags,
      isPublished,
      targetAudience,
      priority,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = "-eventDate",
    } = req.query;

    const query: EventQuery = {};

    if (tags) query.tags = { $in: (tags as string).split(",") };
    if (targetAudience)
      query.targetAudience = { $in: [targetAudience as string] };
    if (priority) query.priority = priority as string;

    // Date range filter
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) query.eventDate.$gte = new Date(startDate as string);
      if (endDate) query.eventDate.$lte = new Date(endDate as string);
    }

    // Visibility (drafts) and expiry must both hold
    query.$and = [
      listVisibility(req.user, isPublished as string | undefined),
      {
        $or: [
          { expiryDate: { $exists: false } },
          { expiryDate: null },
          { expiryDate: { $gt: new Date() } },
        ],
      },
    ];

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find(query)
      .populate("author", "firstName lastName studentNumber")
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single event by ID
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const event = await Event.findById(id).populate(
      "author",
      "firstName lastName studentNumber"
    );

    // A draft is reported as missing to anyone who can't manage it.
    if (!event || !canViewItem(req.user, event)) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (req.query.countView !== "false") await event.incrementViews();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Update event
export const updateEvent = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!canManagePost(req.user, event.author)) {
      res.status(403).json({
        success: false,
        message: "You can only manage your own events",
      });
      return;
    }

    // Handle new cover image upload
    // Handle uploaded files (multiple) during update
    const reqFiles = req.files as MulterFile[] | undefined;
    const reqSingle = req.file as MulterFile | undefined;
    if (Array.isArray(reqFiles) && reqFiles.length > 0) {
      try {
        const buffers = reqFiles
          .filter((f) => !!f.buffer)
          .map((f) => ({ buffer: f.buffer as Buffer }));
        if (buffers.length === 0) {
          throw new Error("No file buffers available for upload");
        }
        const results = await uploadMultipleToCloudinary(buffers, "events");
        const newUrls = results
          .map((r) => r.secure_url)
          .filter(Boolean);
        // Preserve existing galleryImages and append new ones
        const existing = Array.isArray(event.galleryImages)
          ? event.galleryImages
          : [];
        req.body.galleryImages = JSON.stringify([...existing, ...newUrls]);
        if (!event.coverImage && newUrls.length > 0)
          req.body.coverImage = newUrls[0];
      } catch (err) {
        respondWithError(res, err, "Failed to upload images");
        return;
      }
    } else if (reqSingle) {
      // Backwards-compatibility for single-file uploads
      if (event.coverImage) {
        await deleteFromCloudinary(event.coverImage);
      }
      const buf = reqSingle.buffer as Buffer | undefined;
      if (!buf) {
        res
          .status(400)
          .json({ success: false, message: "Uploaded file has no data" });
        return;
      }
      const result = await uploadToCloudinary(buf, "events");
      req.body.coverImage = result.secure_url;
    }

    // Parse arrays/objects if they are strings
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = JSON.parse(req.body.tags);
    }
    if (req.body.admissions && typeof req.body.admissions === "string") {
      req.body.admissions = JSON.parse(req.body.admissions);
    }
    if (
      req.body.targetAudience &&
      typeof req.body.targetAudience === "string"
    ) {
      req.body.targetAudience = JSON.parse(req.body.targetAudience);
    }
    if (req.body.details && typeof req.body.details === "string") {
      try {
        req.body.details = JSON.parse(req.body.details);
      } catch {
      }
    }

    // Convert date strings to Date objects
    if (req.body.eventDate) req.body.eventDate = new Date(req.body.eventDate);
    if (req.body.registrationStart)
      req.body.registrationStart = new Date(req.body.registrationStart);
    if (req.body.registrationEnd)
      req.body.registrationEnd = new Date(req.body.registrationEnd);

    // If the request is attempting to publish the event, ensure at least one image exists
    // But if the incoming publishDate is in the future, treat as scheduling (do not publish now)
    const incomingPublishDate = req.body.publishDate
      ? new Date(req.body.publishDate)
      : null;
    const requestWantsPublish = String(req.body.isPublished) === "true";

    // Only whitelisted fields can change. Authorship, views and ids never do.
    const updateData: Record<string, unknown> = pickFields(req.body, EVENT_EDITABLE_FIELDS);

    if (typeof updateData.content === "string") {
      const content = sanitizeRichText(updateData.content);
      updateData.content = content;
      if (isBlankRichText(content)) {
        res.status(400).json({ success: false, message: "Content cannot be empty" });
        return;
      }
    }

    if (
      requestWantsPublish &&
      incomingPublishDate &&
      incomingPublishDate > new Date()
    ) {
      // ensure we don't publish immediately if scheduled for future
      updateData.isPublished = false;
      updateData.scheduled = true;
    } else if (!requestWantsPublish) {
      updateData.scheduled = false;
      // Explicitly set isPublished to false if it was sent as "false" string or boolean false
      if (req.body.isPublished !== undefined) {
        updateData.isPublished = false;
      }
    } else {
      // Publishing now
      updateData.isPublished = true;
      updateData.scheduled = false;
    }

    // Ensure galleryImages is an array if it was stringified
    if (
      updateData.galleryImages &&
      typeof updateData.galleryImages === "string"
    ) {
      try {
        updateData.galleryImages = JSON.parse(updateData.galleryImages);
      } catch {
        // ignore
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "firstName lastName studentNumber");

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// Delete event
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!canManagePost(req.user, event.author)) {
      res.status(403).json({
        success: false,
        message: "You can only manage your own events",
      });
      return;
    }

    // Delete cover image from cloudinary if exists
    if (event.coverImage) {
      await deleteFromCloudinary(event.coverImage);
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Toggle publish status
export const togglePublishStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!canManagePost(req.user, event.author)) {
      res.status(403).json({
        success: false,
        message: "You can only manage your own events",
      });
      return;
    }

    event.isPublished = !event.isPublished;

    // Set publish date when publishing for the first time
    if (event.isPublished && !event.publishDate) {
      event.publishDate = new Date();
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${
        event.isPublished ? "published" : "unpublished"
      } successfully`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// Get events by tag
export const getEventsByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tag } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find({
      tags: tag,
      isPublished: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } },
      ],
    })
      .populate("author", "firstName lastName studentNumber")
      .sort("-eventDate")
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments({
      tags: tag,
      isPublished: true,
    });

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user's events (drafts and published)
export const getMyEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const query: UserEventQuery = { author: userId };

    if (status === "published") {
      query.isPublished = true;
    } else if (status === "draft") {
      query.isPublished = false;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find(query)
      .populate("author", "firstName lastName studentNumber")
      .sort("-createdAt")
      .skip(skip)
      .limit(limitNum);

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Report an event (sends an email to the organizing chapter's inbox)
export const reportEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid event ID" });
      return;
    }

    if (!reason || !details || !String(details).trim()) {
      res.status(400).json({
        success: false,
        message: "Please provide a reason and details for the report",
      });
      return;
    }

    if (String(reason).length > 200 || String(details).length > 2000) {
      res.status(400).json({
        success: false,
        message: "Report is too long",
      });
      return;
    }

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    const official = resolveContact(await getOrCreateSettings()).contactEmail.toLowerCase();
    const organizer = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(event.contact?.trim() ?? "")
      ? event.contact!.trim().toLowerCase()
      : null;
    const recipients = [...new Set([organizer, official].filter((email): email is string => !!email))];

    const message = `Event reported: ${event.title}\n\nReason: ${reason}\n\nDetails:\n${details}`;
    const html = `
      <h2>Event Reported</h2>
      <p><strong>Event:</strong> ${escapeHtml(event.title)}</p>
      <p><strong>Reason:</strong> ${escapeHtml(reason)}</p>
      <p><strong>Details:</strong></p>
      <p>${escapeHtml(details).replace(/\n/g, "<br/>")}</p>
    `;

    let delivered = 0;
    for (const email of recipients) {
      try {
        await sendEmail({ email, subject: `Event Report: ${event.title}`, message, html });
        delivered += 1;
      } catch {
        continue;
      }
    }

    if (delivered === 0) {
      res.status(502).json({
        success: false,
        message: "The report could not be sent right now. Please try again later.",
      });
      return;
    }

    res.status(200).json({ success: true, message: "Report sent" });
  } catch (error) {
    next(error);
  }
};

const loadRsvpEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: "Invalid event ID" });
    return null;
  }

  const event = await Event.findById(id);
  if (!event || !canViewItem(req.user, event)) {
    res.status(404).json({ success: false, message: "Event not found" });
    return null;
  }
  return event;
};

export const getMyRsvp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await loadRsvpEvent(req, res);
    if (!event) return;

    const rsvped = Boolean(await Event.exists({ _id: event._id, rsvps: req.user?.id }));
    res.status(200).json({ success: true, data: { rsvped, count: event.rsvpCount ?? 0 } });
  } catch (error) {
    next(error);
  }
};

export const rsvpToEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await loadRsvpEvent(req, res);
    if (!event) return;

    if (event.rsvpLink) {
      res.status(400).json({ success: false, message: "Register for this event through its link" });
      return;
    }
    if (!isRsvpOpen(event)) {
      res.status(400).json({ success: false, message: "This event has already ended" });
      return;
    }

    const updated = await Event.findOneAndUpdate(
      { _id: event._id, rsvps: { $ne: req.user?.id } },
      { $addToSet: { rsvps: req.user?.id }, $inc: { rsvpCount: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: { rsvped: true, count: (updated ?? event).rsvpCount ?? 0 },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRsvp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await loadRsvpEvent(req, res);
    if (!event) return;

    const updated = await Event.findOneAndUpdate(
      { _id: event._id, rsvps: req.user?.id },
      { $pull: { rsvps: req.user?.id }, $inc: { rsvpCount: -1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: { rsvped: false, count: Math.max(0, (updated ?? event).rsvpCount ?? 0) },
    });
  } catch (error) {
    next(error);
  }
};
