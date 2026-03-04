"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAnnouncementScheduler = startAnnouncementScheduler;
const announcement_1 = __importDefault(require("../models/announcement"));
const event_1 = __importDefault(require("../models/event"));
const notification_1 = require("./notification");
/**
 * Start a simple scheduler that publishes announcements whose publishDate has arrived.
 * This runs in-process and polls the database periodically (every 30s).
 * It will only publish announcements that have a publishDate <= now and are not yet published.
 */
function startAnnouncementScheduler(intervalMs = 30000) {
    console.log('🕒 Starting announcement scheduler (interval:', intervalMs, 'ms)');
    const publishDue = async () => {
        try {
            const now = new Date();
            // Find announcements scheduled for publish at or before now that are not published
            const dueAnnouncements = await announcement_1.default.find({
                isPublished: false,
                scheduled: true,
                publishDate: { $lte: now },
            });
            if (dueAnnouncements && dueAnnouncements.length > 0) {
                for (const ann of dueAnnouncements) {
                    try {
                        const hasImage = (ann.imageUrl && ann.imageUrl.length > 0) || (ann.galleryImages && ann.galleryImages.length > 0);
                        if (!hasImage) {
                            console.warn('🟠 Skipping publish for announcement', ann._id, '— at least one image is required (imageUrl or galleryImages)');
                            continue;
                        }
                        ann.isPublished = true;
                        ann.scheduled = false;
                        // If publishDate was missing, set it to now (but normally it will be set)
                        if (!ann.publishDate)
                            ann.publishDate = new Date();
                        await ann.save();
                        console.log('✅ Published scheduled announcement', ann._id, 'at', new Date().toISOString());
                        // Notify target audience
                        await (0, notification_1.notifyTargetAudience)(ann.targetAudience || ["all"], `[ANNOUNCEMENT] ${ann.title}`, `New announcement: ${ann.title}`, "announcement", ann._id, "Announcement", `/announcements/${ann._id}`);
                    }
                    catch (err) {
                        console.error('❌ Failed to publish scheduled announcement', ann._id, err);
                    }
                }
            }
            // Find events scheduled for publish at or before now that are not published
            const dueEvents = await event_1.default.find({
                isPublished: false,
                scheduled: true,
                publishDate: { $lte: now },
            });
            if (dueEvents && dueEvents.length > 0) {
                for (const evt of dueEvents) {
                    try {
                        const hasImage = (evt.coverImage && evt.coverImage.length > 0) || (evt.galleryImages && evt.galleryImages.length > 0);
                        if (!hasImage) {
                            console.warn('🟠 Skipping publish for event', evt._id, '— at least one image is required (coverImage or galleryImages)');
                            continue;
                        }
                        evt.isPublished = true;
                        evt.scheduled = false;
                        // If publishDate was missing, set it to now (but normally it will be set)
                        if (!evt.publishDate)
                            evt.publishDate = new Date();
                        await evt.save();
                        console.log('✅ Published scheduled event', evt._id, 'at', new Date().toISOString());
                        // Notify target audience
                        await (0, notification_1.notifyTargetAudience)(evt.targetAudience || ["all"], `[NEW] ${evt.title}`, `New event: ${evt.title}`, "event", evt._id, "Event", `/events/${evt._id}`);
                    }
                    catch (err) {
                        console.error('❌ Failed to publish scheduled event', evt._id, err);
                    }
                }
            }
        }
        catch (err) {
            console.error('❌ Scheduler error:', err);
        }
    };
    // Run immediately then on interval
    publishDue().catch((e) => console.error(e));
    const handle = setInterval(publishDue, intervalMs);
    // Provide a way to stop the scheduler if needed
    return () => clearInterval(handle);
}
exports.default = startAnnouncementScheduler;
