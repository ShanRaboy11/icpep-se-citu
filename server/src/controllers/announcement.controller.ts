import { Request, Response, NextFunction } from 'express';
import Announcement, { IAnnouncement } from '../models/announcement';
import { uploadToCloudinary, uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import mongoose from 'mongoose';

// Local Multer file shape (avoid relying on global Express.Multer augmentation)
type MulterFile = MulterLocal.MulterFile;

// Multer-aware request type without extending Express.Request to avoid
// incompatible augmentation issues across different @types packages.
type MulterRequest = Request & {
    file?: MulterFile;
    files?: MulterFile[] | { [fieldname: string]: MulterFile[] };
};

// Define query type for better type safety
interface AnnouncementQuery {
    type?: string;
    isPublished?: boolean;
    targetAudience?: { $in: string[] };
    priority?: string;
    $or?: Array<Record<string, unknown>>;
}

interface UserAnnouncementQuery {
    author: string;
    isPublished?: boolean;
}

// Create a new announcement
export const createAnnouncement = async (
    req: MulterRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('🔵 CREATE ANNOUNCEMENT - START');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    console.log('📷 File present:', !!req.file);
    console.log('📷 Files present:', !!req.files && req.files.length);
        console.log('👤 User:', req.user);

        const {
            title,
            description,
            content,
            type,
            priority,
            targetAudience,
            isPublished,
            publishDate,
            date,
            expiryDate,
            time,
            location,
            organizer,
            contact,
            attendees,
            agenda,
            awardees,
            attachments,
        } = req.body;

        // Get author from authenticated user
        const author = req.user?.id;

        if (!author) {
            console.error('❌ No author ID found');
            res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
            return;
        }

        // Handle image upload(s) if present
        let imageUrl: string | null = null;
        let galleryImages: string[] | undefined = undefined;

        // Normalize multer files (can be array or object of arrays)
        const filesArray: MulterFile[] = Array.isArray(req.files)
            ? (req.files as MulterFile[])
            : req.files && typeof req.files === 'object'
                ? Object.values(req.files as { [key: string]: MulterFile[] }).flat()
                : [];

        if (filesArray.length > 0) {
            try {
                console.log(`📷 Uploading ${filesArray.length} image(s) to Cloudinary...`);
            const results = await uploadMultipleToCloudinary(filesArray as { buffer: Buffer }[], 'announcements');
                const urls = results.map((r) => r.secure_url).filter(Boolean) as string[];
                if (urls.length > 0) {
                    imageUrl = urls[0];
                    galleryImages = urls;
                }
                console.log('✅ Images uploaded:', urls);
            } catch (uploadError) {
                console.error('❌ Cloudinary upload failed:', uploadError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload image(s)',
                    error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                });
                return;
            }
        } else if (req.file) {
            // Backwards compatibility for single-file uploads
            try {
                const fileBuf = (req.file as MulterFile).buffer;
                if (!fileBuf) {
                    res.status(400).json({ success: false, message: 'Uploaded file has no data' });
                    return;
                }
                const result = await uploadToCloudinary(fileBuf, 'announcements');
                imageUrl = result.secure_url;
                galleryImages = imageUrl ? [imageUrl] : undefined;
                console.log('✅ Image uploaded (single):', imageUrl);
            } catch (uploadError) {
                console.error('❌ Cloudinary upload failed:', uploadError);
                res.status(500).json({ success: false, message: 'Failed to upload image', error: uploadError instanceof Error ? uploadError.message : 'Unknown error' });
                return;
            }
        }

        // Parse arrays if sent as strings with error handling
        let parsedAgenda, parsedAwardees, parsedAttachments, parsedTargetAudience;
        
        try {
            parsedAgenda = agenda ? JSON.parse(agenda) : undefined;
            parsedAwardees = awardees ? JSON.parse(awardees) : undefined;
            parsedAttachments = attachments ? JSON.parse(attachments) : undefined;
            parsedTargetAudience = targetAudience ? JSON.parse(targetAudience) : ['all'];
        } catch (parseError) {
            console.error('❌ JSON parsing failed:', parseError);
            res.status(400).json({
                success: false,
                message: 'Invalid JSON data in request',
                error: parseError instanceof Error ? parseError.message : 'Unknown error'
            });
            return;
        }

        console.log('📝 Creating announcement with data:', {
            title,
            type,
            author,
            isPublished: String(isPublished) === 'true',
            targetAudience: parsedTargetAudience,
            hasImage: !!imageUrl,
        });

        // Validate required fields
        if (!title || !description || !content) {
            console.error('❌ Missing required fields');
            res.status(400).json({
                success: false,
                message: 'Missing required fields: title, description, or content'
            });
            return;
        }

    // Parse and normalize publishDate and date into Dates (if provided)
    const now = new Date();
    const parsedPublishDate = publishDate ? new Date(publishDate) : undefined;
    const parsedDate = date ? new Date(date) : undefined;

        const announcementData: any = {
            title,
            description,
            content,
            author,
            type,
            priority,
            targetAudience: parsedTargetAudience,
            // store a Date if provided, otherwise default to now
            publishDate: parsedPublishDate ?? new Date(),
            date: parsedDate ?? undefined,
            // initial isPublished flag based on incoming value; may be overridden below if scheduling
            isPublished: String(isPublished) === 'true',
            expiryDate,
            time,
            location,
            organizer,
            contact,
            attendees,
            agenda: parsedAgenda,
            awardees: parsedAwardees,
            imageUrl,
            galleryImages,
            attachments: parsedAttachments,
        };

        // If a publishDate exists and it's in the future, ensure announcement remains unpublished until scheduler runs
        // BUT if the user explicitly set isPublished=false (draft), respect that regardless of date.
        // The logic below ensures that if it's a draft, it stays a draft.
        // If it's meant to be published, we check if it's scheduled for the future.
        if (announcementData.isPublished && parsedPublishDate && parsedPublishDate > now) {
            announcementData.isPublished = false;
            announcementData.scheduled = true;
        } else if (!announcementData.isPublished) {
            announcementData.scheduled = false;
        }

        console.log('📝 Final announcement data (publishDate/isPublished):', {
            publishDate: announcementData.publishDate,
            isPublished: announcementData.isPublished,
            scheduled: announcementData.scheduled,
        });

        // Enforce that published announcements must have at least one featured image
        const willBePublished = announcementData.isPublished === true;
        if (willBePublished && (!announcementData.imageUrl && (!announcementData.galleryImages || announcementData.galleryImages.length === 0))) {
            console.error('❌ Attempted to publish announcement without a featured image');
            res.status(400).json({ success: false, message: 'A featured image is required when publishing an announcement.' });
            return;
        }

        console.log('💾 Saving to database...');
        const announcement = await Announcement.create(announcementData);

        console.log('👥 Populating author...');
        await announcement.populate('author', 'firstName lastName studentNumber');

        console.log('✅ Announcement created successfully:', announcement._id);

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: announcement,
        });
    } catch (error) {
        console.error('❌ FATAL ERROR in createAnnouncement:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        
        // Send error response
        res.status(500).json({
            success: false,
            message: 'Failed to create announcement',
            error: error instanceof Error ? error.message : 'Unknown error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: error instanceof Error ? error.stack : undefined
            })
        });
    }
};

// Get all announcements (with filters)
export const getAnnouncements = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            type,
            isPublished,
            targetAudience,
            priority,
            page = 1,
            limit = 10,
            sort = '-publishDate',
        } = req.query;

        const query: AnnouncementQuery = {};

        if (type) query.type = type as string;
        if (isPublished !== undefined) query.isPublished = isPublished === 'true';
        if (targetAudience) query.targetAudience = { $in: [targetAudience as string] };
        if (priority) query.priority = priority as string;

        // Don't show expired announcements by default
        query.$or = [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } },
        ];

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const announcements = await Announcement.find(query)
            .populate('author', 'firstName lastName studentNumber')
            .sort(sort as string)
            .skip(skip)
            .limit(limitNum);

        const total = await Announcement.countDocuments(query);

        res.status(200).json({
            success: true,
            data: announcements,
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

// Get single announcement by ID
export const getAnnouncementById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }

        const announcement = await Announcement.findById(id).populate(
            'author',
            'firstName lastName studentNumber'
        );

        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }

        // Increment views
        await announcement.incrementViews();

        res.status(200).json({
            success: true,
            data: announcement,
        });
    } catch (error) {
        next(error);
    }
};

// Update announcement
export const updateAnnouncement = async (
    req: MulterRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }

        // Optional: Check if user is the author
        // if (announcement.author.toString() !== userId) {
        //     res.status(403).json({ message: 'Not authorized to update this announcement' });
        //     return;
        // }

        // Handle new image upload(s)
        // Normalize multer files (array or object)
        const incomingFiles: MulterFile[] = Array.isArray(req.files)
            ? (req.files as MulterFile[])
            : req.files && typeof req.files === 'object'
                ? Object.values(req.files as { [key: string]: MulterFile[] }).flat()
                : [];

        if (incomingFiles.length > 0) {
            // Delete old images if they exist
            if (announcement.galleryImages && announcement.galleryImages.length > 0) {
                for (const url of announcement.galleryImages) {
                    try {
                        await deleteFromCloudinary(url);
                    } catch (err) {
                        console.warn('Failed to delete old announcement gallery image:', err);
                    }
                }
            } else if (announcement.imageUrl) {
                try {
                    await deleteFromCloudinary(announcement.imageUrl);
                } catch (err) {
                    console.warn('Failed to delete old announcement image:', err);
                }
            }

            // Upload new files
            const buffers = incomingFiles.filter((f) => !!f.buffer).map((f) => ({ buffer: f.buffer as Buffer }));
            if (buffers.length === 0) {
                res.status(400).json({ success: false, message: 'No valid file data to upload' });
                return;
            }
            const results = await uploadMultipleToCloudinary(buffers, 'announcements');
            const urls = results.map((r) => r.secure_url).filter(Boolean) as string[];
            if (urls.length > 0) {
                req.body.galleryImages = JSON.stringify(urls);
                req.body.imageUrl = urls[0];
            }
        }

        // If the request is attempting to publish the announcement, ensure at least one image exists
        // But if the incoming publishDate is in the future, treat as scheduling (do not publish now)
        const incomingPublishDate = req.body.publishDate ? new Date(req.body.publishDate) : null;
        const requestWantsPublish = String(req.body.isPublished) === 'true';

        // Create a clean update object
        const updateData: any = { ...req.body };

        if (requestWantsPublish && incomingPublishDate && incomingPublishDate > new Date()) {
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
        
        const existingHasImage = (announcement.imageUrl && announcement.imageUrl.length > 0) || (announcement.galleryImages && announcement.galleryImages.length > 0);
        const incomingHasImage = (updateData.imageUrl && String(updateData.imageUrl).length > 0) || (updateData.galleryImages && String(updateData.galleryImages).length > 0);

        if (requestWantsPublish && !existingHasImage && !incomingHasImage) {
            res.status(400).json({ success: false, message: 'A featured image is required to publish an announcement.' });
            return;
        }

        // Parse arrays if they are strings
        if (updateData.agenda && typeof updateData.agenda === 'string') {
            updateData.agenda = JSON.parse(updateData.agenda);
        }
        if (updateData.awardees && typeof updateData.awardees === 'string') {
            updateData.awardees = JSON.parse(updateData.awardees);
        }
        if (updateData.attachments && typeof updateData.attachments === 'string') {
            updateData.attachments = JSON.parse(updateData.attachments);
        }
        if (updateData.targetAudience && typeof updateData.targetAudience === 'string') {
            updateData.targetAudience = JSON.parse(updateData.targetAudience);
        }
        // Parse date string into Date for updates
        if (updateData.date && typeof updateData.date === 'string') {
            try {
                updateData.date = new Date(updateData.date);
            } catch (e) {
                // leave as-is if parsing fails; validation will catch it
            }
        }
        // Ensure galleryImages is an array if it was stringified
        if (updateData.galleryImages && typeof updateData.galleryImages === 'string') {
            try {
                updateData.galleryImages = JSON.parse(updateData.galleryImages);
            } catch (e) {
                // ignore
            }
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'firstName lastName studentNumber');

        res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: updatedAnnouncement,
        });
    } catch (error) {
        next(error);
    }
};

// Delete announcement
export const deleteAnnouncement = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }

        // Optional: Check if user is the author
        // if (announcement.author.toString() !== userId) {
        //     res.status(403).json({ message: 'Not authorized to delete this announcement' });
        //     return;
        // }

        // Delete image(s) from cloudinary if exist
        if (announcement.galleryImages && announcement.galleryImages.length > 0) {
            for (const url of announcement.galleryImages) {
                try {
                    await deleteFromCloudinary(url);
                } catch (err) {
                    console.warn('Failed to delete announcement gallery image:', err);
                }
            }
        } else if (announcement.imageUrl) {
            await deleteFromCloudinary(announcement.imageUrl);
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Publish/Unpublish announcement
export const togglePublishStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid announcement ID' });
            return;
        }

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            res.status(404).json({ message: 'Announcement not found' });
            return;
        }

        // Optional: Check if user is the author
        // if (announcement.author.toString() !== userId) {
        //     res.status(403).json({ message: 'Not authorized to modify this announcement' });
        //     return;
        // }

        announcement.isPublished = !announcement.isPublished;
        
        // Set publish date when publishing for the first time
        if (announcement.isPublished && !announcement.publishDate) {
            announcement.publishDate = new Date();
        }

        await announcement.save();

        res.status(200).json({
            success: true,
            message: `Announcement ${announcement.isPublished ? 'published' : 'unpublished'} successfully`,
            data: announcement,
        });
    } catch (error) {
        next(error);
    }
};

// Get announcements by type
export const getAnnouncementsByType = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { type } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const announcements = await Announcement.find({
            type,
            isPublished: true,
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } },
            ],
        })
            .populate('author', 'firstName lastName studentNumber')
            .sort('-publishDate')
            .skip(skip)
            .limit(limitNum);

        const total = await Announcement.countDocuments({
            type,
            isPublished: true,
        });

        res.status(200).json({
            success: true,
            data: announcements,
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

// Get user's announcements (drafts and published)
export const getMyAnnouncements = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { page = 1, limit = 10, status } = req.query;

        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const query: UserAnnouncementQuery = { author: userId };
        
        if (status === 'published') {
            query.isPublished = true;
        } else if (status === 'draft') {
            query.isPublished = false;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const announcements = await Announcement.find(query)
            .populate('author', 'firstName lastName studentNumber')
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);

        const total = await Announcement.countDocuments(query);

        res.status(200).json({
            success: true,
            data: announcements,
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