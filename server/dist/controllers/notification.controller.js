"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const mongoose_1 = __importDefault(require("mongoose"));
const availability_1 = __importDefault(require("../models/availability"));
const announcement_1 = __importDefault(require("../models/announcement"));
const event_1 = __importDefault(require("../models/event"));
const meeting_1 = __importDefault(require("../models/meeting"));
const user_1 = __importDefault(require("../models/user"));
// Get all notifications for the current user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const { page = 1, limit = 20, filter = "all" } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // 1. Fetch existing notifications
        const query = { recipient: userId };
        if (filter !== "all") {
            if (filter === "event") {
                query.type = "event";
            }
            else if (filter === "announcement") {
                query.type = "announcement";
            }
            else if (filter === "others") {
                query.type = { $in: ["membership", "system", "rsvp"] };
            }
        }
        const existingNotifications = await notification_1.default.find(query)
            .sort({ createdAt: -1 })
            .lean();
        // Set of relatedIds to avoid duplicates
        const existingRelatedIds = new Set(existingNotifications
            .filter((n) => n.relatedId)
            .map((n) => n.relatedId.toString()));
        // 2. Fetch Pending Availability (Commeet)
        let pendingAvailability = [];
        if (filter === "all" || filter === "others") {
            const availabilities = await availability_1.default.find({
                user: userId,
                slots: { $size: 0 }, // Empty slots means pending
            })
                .populate("meeting", "title")
                .lean();
            pendingAvailability = availabilities
                .filter((a) => a.meeting && !existingRelatedIds.has(a.meeting._id.toString()))
                .map((a) => ({
                _id: a.meeting._id, // Use meeting ID as notification ID for virtual ones
                recipient: userId,
                type: "rsvp",
                title: "[COMMEET] Availability Request",
                message: `Please add your availability schedule for the meeting: ${a.meeting.title}. Status: Pending`,
                relatedId: a.meeting._id,
                relatedModel: "Meeting",
                isRead: false,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
                isVirtual: true, // Flag to identify virtual notifications
            }));
        }
        // 3. Fetch Recent Announcements (last 30 days)
        let recentAnnouncements = [];
        if (filter === "all" || filter === "announcement") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const announcements = await announcement_1.default.find({
                isPublished: true,
                createdAt: { $gte: thirtyDaysAgo },
            })
                .sort({ createdAt: -1 })
                .lean();
            recentAnnouncements = announcements
                .filter((a) => !existingRelatedIds.has(a._id.toString()))
                .map((a) => ({
                _id: a._id,
                recipient: userId,
                type: "announcement",
                title: `[ANNOUNCEMENT] ${a.title}`,
                message: `New announcement: ${a.title}`,
                relatedId: a._id,
                relatedModel: "Announcement",
                isRead: false, // Virtual ones are always unread unless we track them
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
                isVirtual: true,
            }));
        }
        // 4. Fetch Upcoming Events
        let upcomingEvents = [];
        if (filter === "all" || filter === "event") {
            const events = await event_1.default.find({
                isPublished: true,
                eventDate: { $gte: new Date() },
            })
                .sort({ createdAt: -1 })
                .lean();
            upcomingEvents = events
                .filter((e) => !existingRelatedIds.has(e._id.toString()))
                .map((e) => ({
                _id: e._id,
                recipient: userId,
                type: "event",
                title: `[NEW] ${e.title}`,
                message: `New event: ${e.title}`,
                relatedId: e._id,
                relatedModel: "Event",
                isRead: false,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                isVirtual: true,
            }));
        }
        // 5. Virtual Membership Status Notification
        // Check if we should show a membership status reminder
        let membershipNotification = null;
        if (filter === "all" || filter === "others") {
            // Check if there's already a recent membership notification in the list
            const hasMembershipNotif = existingNotifications.some((n) => n.type === "membership");
            if (!hasMembershipNotif) {
                const user = await user_1.default.findById(userId);
                if (user) {
                    const isMember = user.membershipStatus.isMember;
                    const today = new Date();
                    // Use user ID as relatedId for membership status
                    // But we need to be careful not to duplicate if they already read it
                    // Since we checked existingNotifications (which are from DB), if it's not there,
                    // it means either they never got one, or they deleted it.
                    // If they marked it as read, it WOULD be in existingNotifications (unless we filter by unread only somewhere else, but here we fetch all for the user)
                    if (!isMember) {
                        membershipNotification = {
                            _id: user._id, // Use user ID as the ID for this virtual notification
                            recipient: userId,
                            type: "membership",
                            title: "[MEMBERSHIP] Become a Member!",
                            message: "Unlock exclusive benefits by becoming an official ICPEP-SE member today.",
                            relatedId: user._id,
                            relatedModel: "Membership",
                            isRead: false,
                            createdAt: today,
                            updatedAt: today,
                            isVirtual: true,
                        };
                    }
                    else {
                        membershipNotification = {
                            _id: user._id,
                            recipient: userId,
                            type: "membership",
                            title: "[MEMBERSHIP] Membership Active",
                            message: `You are a verified member as of ${today.toLocaleDateString()}.`,
                            relatedId: user._id,
                            relatedModel: "Membership",
                            isRead: false,
                            createdAt: today,
                            updatedAt: today,
                            isVirtual: true,
                        };
                    }
                }
            }
        }
        // 6. Merge and Sort
        const allNotifications = [
            ...existingNotifications,
            ...pendingAvailability,
            ...recentAnnouncements,
            ...upcomingEvents,
            ...(membershipNotification ? [membershipNotification] : []),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        // Pagination
        const total = allNotifications.length;
        const paginatedNotifications = allNotifications.slice(skip, skip + limitNum);
        // Unread Count (Virtuals are considered unread)
        const unreadCount = existingNotifications.filter((n) => !n.isRead).length +
            pendingAvailability.length +
            recentAnnouncements.length +
            upcomingEvents.length +
            (membershipNotification ? 1 : 0);
        res.status(200).json({
            success: true,
            data: paginatedNotifications,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
            unreadCount,
        });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching notifications",
            error: error.message,
        });
    }
};
exports.getNotifications = getNotifications;
// Mark a notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
            return;
        }
        // Try to find existing notification first
        let notification = await notification_1.default.findOneAndUpdate({ _id: id, recipient: userId }, { isRead: true, readAt: new Date() }, { new: true });
        // If not found, it might be a virtual notification
        if (!notification) {
            // Check if it corresponds to a Meeting (Availability), Announcement, or Event
            // We use the ID passed as the relatedId
            const relatedId = id;
            // Check Meeting (Availability)
            const meeting = await meeting_1.default.findById(relatedId);
            if (meeting) {
                notification = await notification_1.default.create({
                    recipient: userId,
                    type: "rsvp",
                    title: "[COMMEET] Availability Request",
                    message: `Please add your availability schedule for the meeting: ${meeting.title}. Status: Pending`,
                    relatedId: meeting._id,
                    relatedModel: "Meeting",
                    isRead: true,
                    readAt: new Date(),
                    createdAt: meeting.createdAt, // Preserve original date
                });
            }
            else {
                // Check Announcement
                const announcement = await announcement_1.default.findById(relatedId);
                if (announcement) {
                    notification = await notification_1.default.create({
                        recipient: userId,
                        type: "announcement",
                        title: `[ANNOUNCEMENT] ${announcement.title}`,
                        message: `New announcement: ${announcement.title}`,
                        relatedId: announcement._id,
                        relatedModel: "Announcement",
                        isRead: true,
                        readAt: new Date(),
                        createdAt: announcement.createdAt, // Preserve original date
                    });
                }
                else {
                    // Check Event
                    const event = await event_1.default.findById(relatedId);
                    if (event) {
                        notification = await notification_1.default.create({
                            recipient: userId,
                            type: "event",
                            title: `[NEW] ${event.title}`,
                            message: `New event: ${event.title}`,
                            relatedId: event._id,
                            relatedModel: "Event",
                            isRead: true,
                            readAt: new Date(),
                            createdAt: event.createdAt, // Preserve original date
                        });
                    }
                }
            }
            // Check Membership (Virtual)
            if (!notification && relatedId === userId) {
                const user = await user_1.default.findById(userId);
                if (user) {
                    const isMember = user.membershipStatus.isMember;
                    const today = new Date();
                    notification = await notification_1.default.create({
                        recipient: userId,
                        type: "membership",
                        title: isMember
                            ? "[MEMBERSHIP] Membership Active"
                            : "[MEMBERSHIP] Become a Member!",
                        message: isMember
                            ? `You are a verified member as of ${today.toLocaleDateString()}.`
                            : "Unlock exclusive benefits by becoming an official ICPEP-SE member today.",
                        relatedId: user._id,
                        relatedModel: "Membership",
                        isRead: true,
                        readAt: today,
                        createdAt: today,
                    });
                }
            }
        }
        if (!notification) {
            res.status(404).json({
                success: false,
                message: "Notification not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    }
    catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            message: "Error marking notification as read",
            error: error.message,
        });
    }
};
exports.markAsRead = markAsRead;
// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        await notification_1.default.updateMany({ recipient: userId, isRead: false }, { isRead: true, readAt: new Date() });
        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    }
    catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({
            success: false,
            message: "Error marking all notifications as read",
            error: error.message,
        });
    }
};
exports.markAllAsRead = markAllAsRead;
// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
            return;
        }
        const notification = await notification_1.default.findOneAndDelete({
            _id: id,
            recipient: userId,
        });
        if (!notification) {
            res.status(404).json({
                success: false,
                message: "Notification not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Notification deleted",
        });
    }
    catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting notification",
            error: error.message,
        });
    }
};
exports.deleteNotification = deleteNotification;
