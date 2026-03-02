import mongoose from "mongoose";
import Notification from "../models/notification";
import User from "../models/user";

export const sendNotification = async (
  recipientId: string | mongoose.Types.ObjectId,
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null
) => {
  try {
    await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const sendBulkNotifications = async (
  recipientIds: (string | mongoose.Types.ObjectId)[],
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null
) => {
  try {
    if (recipientIds.length === 0) {
      console.log("⚠️ No recipients for bulk notification");
      return;
    }

    console.log(
      `📢 Sending bulk notifications to ${recipientIds.length} users. Title: ${title}`
    );

    const notifications = recipientIds.map((recipient) => ({
      recipient,
      title,
      message,
      type,
      relatedId,
      relatedModel,
    }));

    const result = await Notification.insertMany(notifications);
    console.log(`✅ Successfully created ${result.length} notifications.`);
  } catch (error) {
    console.error("Error sending bulk notifications:", error);
  }
};

export const notifyAllUsers = async (
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null
) => {
  try {
    console.log("🔍 Finding all active users for notification...");
    const users = await User.find({ isActive: true }, "_id");
    console.log(`👥 Found ${users.length} active users.`);

    const recipientIds = users.map((user) => user._id);
    await sendBulkNotifications(
      recipientIds,
      title,
      message,
      type,
      relatedId,
      relatedModel
    );
  } catch (error) {
    console.error("Error notifying all users:", error);
  }
};

export const notifyTargetAudience = async (
  targetAudience: string[],
  title: string,
  message: string,
  type: "announcement" | "event" | "membership" | "system" | "rsvp",
  relatedId?: string | mongoose.Types.ObjectId,
  relatedModel?: "Announcement" | "Event" | "Membership" | null
) => {
  try {
    console.log(`🔍 Notifying target audience: ${targetAudience.join(", ")}`);

    // If 'all' is in the target audience, notify everyone
    if (targetAudience.includes("all")) {
      await notifyAllUsers(title, message, type, relatedId, relatedModel);
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
      console.log("⚠️ No valid target audience criteria found.");
      return;
    }
    
    // Combine all conditions with AND
    const finalQuery = { $and: queryConditions };

    const users = await User.find(finalQuery, "_id");
    console.log(`👥 Found ${users.length} users matching target audience.`);

    if (users.length === 0) return;

    const recipientIds = users.map((user) => user._id);
    await sendBulkNotifications(
      recipientIds,
      title,
      message,
      type,
      relatedId,
      relatedModel
    );

  } catch (error) {
    console.error("Error notifying target audience:", error);
  }
};
