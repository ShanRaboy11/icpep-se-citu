import Announcement from '../models/announcement';

/**
 * Start a simple scheduler that publishes announcements whose publishDate has arrived.
 * This runs in-process and polls the database periodically (every 30s).
 * It will only publish announcements that have a publishDate <= now and are not yet published.
 */
export function startAnnouncementScheduler(intervalMs = 30_000) {
    console.log('🕒 Starting announcement scheduler (interval:', intervalMs, 'ms)');

    const publishDue = async () => {
        try {
            const now = new Date();
            // Find announcements scheduled for publish at or before now that are not published
            const due = await Announcement.find({
                isPublished: false,
                scheduled: true,
                publishDate: { $lte: now },
            });

            if (!due || due.length === 0) return;

            for (const ann of due) {
                try {
                    const hasImage = (ann.imageUrl && ann.imageUrl.length > 0) || (ann.galleryImages && ann.galleryImages.length > 0);
                    if (!hasImage) {
                        console.warn('🟠 Skipping publish for announcement', ann._id, '— at least one image is required (imageUrl or galleryImages)');
                        continue;
                    }

                    ann.isPublished = true;
                    ann.scheduled = false;
                    // If publishDate was missing, set it to now (but normally it will be set)
                    if (!ann.publishDate) ann.publishDate = new Date();
                    await ann.save();
                    console.log('✅ Published scheduled announcement', ann._id, 'at', new Date().toISOString());
                } catch (err) {
                    console.error('❌ Failed to publish scheduled announcement', ann._id, err);
                }
            }
        } catch (err) {
            console.error('❌ Announcement scheduler error:', err);
        }
    };

    // Run immediately then on interval
    publishDue().catch((e) => console.error(e));
    const handle = setInterval(publishDue, intervalMs);

    // Provide a way to stop the scheduler if needed
    return () => clearInterval(handle);
}

export default startAnnouncementScheduler;