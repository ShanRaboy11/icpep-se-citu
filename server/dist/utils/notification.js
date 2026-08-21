"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyTargetAudience = exports.notifyAllUsers = exports.sendBulkNotifications = exports.sendNotification = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const sendNotification = async (recipientId, title, message, type, relatedId, relatedModel, link) => {
    try {
        await notification_1.default.create({
            recipient: recipientId,
            title,
            message,
            type,
            relatedId,
            relatedModel,
            link,
        });
    }
    catch (error) {
        console.error("Error sending notification:", error);
    }
};
exports.sendNotification = sendNotification;
const sendBulkNotifications = async (recipientIds, title, message, type, relatedId, relatedModel, link) => {
    try {
        if (recipientIds.length === 0) {
            console.log("⚠️ No recipients for bulk notification");
            return;
        }
        console.log(`📢 Sending bulk notifications to ${recipientIds.length} users. Title: ${title}`);
        const notifications = recipientIds.map((recipient) => ({
            recipient,
            title,
            message,
            type,
            relatedId,
            relatedModel,
            link,
        }));
        const result = await notification_1.default.insertMany(notifications);
        console.log(`✅ Successfully created ${result.length} notifications.`);
    }
    catch (error) {
        console.error("Error sending bulk notifications:", error);
    }
};
exports.sendBulkNotifications = sendBulkNotifications;
const notifyAllUsers = async (title, message, type, relatedId, relatedModel, link) => {
    try {
        console.log("🔍 Finding all active users for notification...");
        const users = await user_1.default.find({ isActive: true }, "_id");
        console.log(`👥 Found ${users.length} active users.`);
        const recipientIds = users.map((user) => user._id);
        await (0, exports.sendBulkNotifications)(recipientIds, title, message, type, relatedId, relatedModel, link);
    }
    catch (error) {
        console.error("Error notifying all users:", error);
    }
};
exports.notifyAllUsers = notifyAllUsers;
const notifyTargetAudience = async (targetAudience, title, message, type, relatedId, relatedModel, link) => {
    try {
        console.log(`🔍 Notifying target audience: ${targetAudience.join(", ")}`);
        // If 'all' is in the target audience, notify everyone
        if (targetAudience.includes("all")) {
            await (0, exports.notifyAllUsers)(title, message, type, relatedId, relatedModel, link);
            return;
        }
        const queryConditions = [{ isActive: true }];
        const audienceConditions = [];
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
        }
        else {
            // If target audience is empty or invalid, maybe define fallback? 
            // For now, if provided but no match logic, we might match nothing or everything.
            // Assuming empty targetAudience means no one if not 'all'.
            console.log("⚠️ No valid target audience criteria found.");
            return;
        }
        // Combine all conditions with AND
        const finalQuery = { $and: queryConditions };
        const users = await user_1.default.find(finalQuery, "_id");
        console.log(`👥 Found ${users.length} users matching target audience.`);
        if (users.length === 0)
            return;
        const recipientIds = users.map((user) => user._id);
        await (0, exports.sendBulkNotifications)(recipientIds, title, message, type, relatedId, relatedModel, link);
    }
    catch (error) {
        console.error("Error notifying target audience:", error);
    }
};
exports.notifyTargetAudience = notifyTargetAudience;
