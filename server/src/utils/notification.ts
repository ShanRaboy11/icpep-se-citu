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
