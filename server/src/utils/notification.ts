import mongoose from "mongoose";
import Notification from "../models/notification";
import User from "../models/user";

export const sendNotification = async (
  recipientId: string | mongoose.Types.ObjectId,
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null,
  link?: string
) => {
  try {
    await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      link,
    });
  } catch {
  }
};

export const sendBulkNotifications = async (
  recipientIds: (string | mongoose.Types.ObjectId)[],
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null,
  link?: string
) => {
  try {
    if (recipientIds.length === 0) {
      return;
    }


    const notifications = recipientIds.map((recipient) => ({
      recipient,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      link,
    }));

    await Notification.insertMany(notifications);
  } catch {
  }
};

export const notifyAllUsers = async (
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null,
  link?: string
) => {
  try {
    const users = await User.find({ isActive: true }, "_id");

    const recipientIds = users.map((user) => user._id);
    await sendBulkNotifications(
      recipientIds,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      link
    );
  } catch {
  }
};

export const notifyTargetAudience = async (
  targetAudience: string[],
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null,
  link?: string
) => {
  try {

    // If 'all' is in the target audience, notify everyone
    if (targetAudience.includes("all")) {
      await notifyAllUsers(title, message, type, relatedId, relatedModel, link);
      return;
    }

    const queryConditions: any[] = [{ isActive: true }];
    const audienceConditions: any[] = [];

    if (targetAudience.includes("members")) {
      audienceConditions.push({ "membershipStatus.isMember": true });
    }

    if (targetAudience.includes("officers")) {
      audienceConditions.push({ role: { $in: ["council-officer", "committee-officer"] } });
    }

    if (targetAudience.includes("faculty")) {
      audienceConditions.push({ role: "faculty" });
    }

    // If we have specific audience conditions, combine them with OR
    if (audienceConditions.length > 0) {
      queryConditions.push({ $or: audienceConditions });
    } else {
      // If target audience is empty or invalid, maybe define fallback? 
      // For now, if provided but no match logic, we might match nothing or everything.
      // Assuming empty targetAudience means no one if not 'all'.
      return;
    }
    
    // Combine all conditions with AND
    const finalQuery = { $and: queryConditions };

    const users = await User.find(finalQuery, "_id");

    if (users.length === 0) return;

    const recipientIds = users.map((user) => user._id);
    await sendBulkNotifications(
      recipientIds,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      link
    );

  } catch {
  }
};

type AudienceViewer = {
  role: string;
  membershipStatus?: { isMember?: boolean };
} | null;

// The same audience rules notifyTargetAudience uses, for content someone can
// see without having been sent a notification (e.g. the virtual ones).
export const isInTargetAudience = (
  targetAudience: string[] | undefined,
  viewer: AudienceViewer
): boolean => {
  const audience =
    targetAudience && targetAudience.length > 0 ? targetAudience : ["all"];
  if (audience.includes("all")) return true;
  if (!viewer) return false;

  return (
    (audience.includes("members") && !!viewer.membershipStatus?.isMember) ||
    (audience.includes("officers") &&
      (viewer.role === "council-officer" ||
        viewer.role === "committee-officer")) ||
    (audience.includes("faculty") && viewer.role === "faculty")
  );
};
