import Announcement from '../models/announcement';
import Event from '../models/event';
import { notifyTargetAudience } from './notification';

/**
 * Publishes scheduled announcements and events whose publishDate has arrived.
 * Runs in-process and polls the database periodically (every 30s).
 */
export function startAnnouncementScheduler(intervalMs = 30_000) {
    // A tick that runs longer than the interval must not overlap the next one,
    // or the same still-unpublished items would be published and notified twice.
    let running = false;

    const publishDue = async () => {
        if (running) return;
        running = true;

        try {
            const now = new Date();

            const dueAnnouncements = await Announcement.find({
                isPublished: false,
                scheduled: true,
                publishDate: { $lte: now },
            });

            for (const ann of dueAnnouncements) {
                try {
                    const hasImage = (ann.imageUrl && ann.imageUrl.length > 0) || (ann.galleryImages && ann.galleryImages.length > 0);
                    if (!hasImage) continue;

                    ann.isPublished = true;
                    ann.scheduled = false;
                    if (!ann.publishDate) ann.publishDate = new Date();
                    await ann.save();

                    await notifyTargetAudience(
                        ann.targetAudience || ["all"],
                        `[ANNOUNCEMENT] ${ann.title}`,
                        `New announcement: ${ann.title}`,
                        "announcement",
                        ann._id,
                        "Announcement",
                        `/announcements/${ann._id}`
                    );
                } catch {
                    // One bad announcement must not block the rest.
                }
            }

            const dueEvents = await Event.find({
                isPublished: false,
                scheduled: true,
                publishDate: { $lte: now },
            });

            for (const evt of dueEvents) {
                try {
                    const hasImage = (evt.coverImage && evt.coverImage.length > 0) || (evt.galleryImages && evt.galleryImages.length > 0);
                    if (!hasImage) continue;

                    evt.isPublished = true;
                    evt.scheduled = false;
                    if (!evt.publishDate) evt.publishDate = new Date();
                    await evt.save();

                    await notifyTargetAudience(
                        evt.targetAudience || ["all"],
                        `[NEW] ${evt.title}`,
                        `New event: ${evt.title}`,
                        "event",
                        evt._id,
                        "Event",
                        `/events/${evt._id}`
                    );
                } catch {
                    // One bad event must not block the rest.
                }
            }
        } catch {
            // A failed tick (e.g. the database is briefly unreachable) is retried on the next one.
        } finally {
            running = false;
        }
    };

    void publishDue();
    const handle = setInterval(publishDue, intervalMs);

    return () => clearInterval(handle);
}

export default startAnnouncementScheduler;
