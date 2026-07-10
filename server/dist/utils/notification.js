"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAllUsers = exports.sendBulkNotifications = exports.sendNotification = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const user_1 = __importDefault(require("../models/user"));
const sendNotification = async (recipientId, title, message, type, relatedId, relatedModel) => {
    try {
        await notification_1.default.create({
            recipient: recipientId,
            title,
            message,
            type,
            relatedId,
            relatedModel,
        });
    }
    catch (error) {
        console.error("Error sending notification:", error);
    }
};
exports.sendNotification = sendNotification;
const sendBulkNotifications = async (recipientIds, title, message, type, relatedId, relatedModel) => {
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
        }));
        const result = await notification_1.default.insertMany(notifications);
        console.log(`✅ Successfully created ${result.length} notifications.`);
    }
    catch (error) {
        console.error("Error sending bulk notifications:", error);
    }
};
exports.sendBulkNotifications = sendBulkNotifications;
const notifyAllUsers = async (title, message, type, relatedId, relatedModel) => {
    try {
        console.log("🔍 Finding all active users for notification...");
        const users = await user_1.default.find({ isActive: true }, "_id");
        console.log(`👥 Found ${users.length} active users.`);
        const recipientIds = users.map((user) => user._id);
        await (0, exports.sendBulkNotifications)(recipientIds, title, message, type, relatedId, relatedModel);
    }
    catch (error) {
        console.error("Error notifying all users:", error);
    }
};
exports.notifyAllUsers = notifyAllUsers;
