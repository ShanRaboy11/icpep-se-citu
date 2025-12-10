import { Request, Response, NextFunction } from 'express';
import Event, { IEvent } from '../models/event';
import { uploadToCloudinary, deleteFromCloudinary, uploadMultipleToCloudinary } from '../utils/cloudinary';
import mongoose from 'mongoose';

// Local Multer file shape (avoid relying on global Express.Multer augmentation)
type MulterFile = MulterLocal.MulterFile;

// Multer-aware request type without extending Express.Request (avoids
// incompatible declaration issues when other libs augment Request)
type MulterRequest = Request & {
    file?: MulterFile;
    files?: MulterFile[] | { [fieldname: string]: MulterFile[] };
};

// Define query type for better type safety
interface EventQuery {
    tags?: { $in: string[] };
    isPublished?: boolean;
    targetAudience?: { $in: string[] };
    priority?: string;
    eventDate?: { $gte?: Date; $lte?: Date };
    $or?: Array<Record<string, unknown>>;
}

interface UserEventQuery {
    author: string;
    isPublished?: boolean;
}

// Create a new event
export const createEvent = async (
    req: MulterRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('🔵 CREATE EVENT - START');
        console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
        console.log('📷 File present:', !!req.file);
        console.log('👤 User:', req.user);

        const {
            title,
            description,
            content,
            tags,
            priority,
            targetAudience,
            isPublished,
            publishDate,
            expiryDate,
            eventDate,
            time,
            location,
            organizer,
            contact,
            rsvpLink,
            admissions,
            registrationRequired,
            registrationStart,
            registrationEnd,
            mode,
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

        // Handle image uploads (support multiple files under field 'images')
        let coverImage: string | null = null;
        let galleryImages: string[] = [];

        const multerFiles = (req as any).files as MulterFile[] | undefined;
        const singleFile = (req as any).file as MulterFile | undefined;

        if (Array.isArray(multerFiles) && multerFiles.length > 0) {
            try {
                console.log(`📷 Uploading ${multerFiles.length} images to Cloudinary...`);
                        const buffers = multerFiles
                            .filter((f) => !!f.buffer)
                            .map((f) => ({ buffer: f.buffer as Buffer }));
                        if (buffers.length === 0) {
                            throw new Error('No file buffers available for upload');
                        }
                        const results = await uploadMultipleToCloudinary(buffers, 'events');
                galleryImages = results.map((r) => (r as any).secure_url).filter(Boolean);
                console.log('✅ Images uploaded:', galleryImages);
                // Ensure coverImage is set to first uploaded image if not already
                if (!coverImage && galleryImages.length > 0) {
                    coverImage = galleryImages[0];
                }
            } catch (uploadError) {
                console.error('❌ Cloudinary multiple upload failed:', uploadError);
                console.error('Attempting individual uploads as fallback...');
                // Try uploading individually to get partial results
                try {
                    for (const f of multerFiles) {
                        try {
                            if (!f.buffer) {
                                console.warn('Skipping file with empty buffer during fallback upload');
                                continue;
                            }
                            const singleResult = await uploadToCloudinary(f.buffer as Buffer, 'events');
                            const url = (singleResult as any).secure_url;
                            if (url) galleryImages.push(url);
                            if (!coverImage && url) coverImage = url;
                        } catch (singleErr) {
                            console.error('Failed uploading one file in fallback:', singleErr);
                            // continue with others
                        }
                    }

                    if (galleryImages.length === 0) {
                        // nothing uploaded successfully
                        res.status(500).json({
                            success: false,
                            message: 'Failed to upload images',
                            error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                        });
                        return;
                    }
                    console.log('✅ Fallback uploaded images:', galleryImages);
                } catch (fallbackErr) {
                    console.error('❌ Fallback upload also failed:', fallbackErr);
                    res.status(500).json({
                        success: false,
                        message: 'Failed to upload images',
                        error: fallbackErr instanceof Error ? fallbackErr.message : 'Unknown error'
                    });
                    return;
                }
            }
        } else if (singleFile) {
            // Backwards compatible: if a single file was uploaded under req.file
            try {
                console.log('📷 Uploading single cover image to Cloudinary...');
                const buf = singleFile.buffer as Buffer | undefined;
                if (!buf) {
                    res.status(400).json({ success: false, message: 'Uploaded file has no data' });
                    return;
                }
                const result = await uploadToCloudinary(buf, 'events');
                const url = (result as any).secure_url;
                galleryImages = url ? [url] : [];
                coverImage = url || coverImage;
                console.log('✅ Image uploaded:', url);
            } catch (uploadError) {
                console.error('❌ Cloudinary upload failed:', uploadError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload cover image',
                    error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                });
                return;
            }
        }

        // Parse arrays/objects if sent as strings
        let parsedTags, parsedAdmissions, parsedTargetAudience, parsedDetails;
        
        try {
            parsedTags = tags ? JSON.parse(tags) : [];
            parsedAdmissions = admissions ? JSON.parse(admissions) : [];
            parsedTargetAudience = targetAudience ? JSON.parse(targetAudience) : ['all'];
            parsedDetails = (req.body.details && typeof req.body.details === 'string') ? JSON.parse(req.body.details) : req.body.details;
        } catch (parseError) {
            console.error('❌ JSON parsing failed:', parseError);
            res.status(400).json({
                success: false,
                message: 'Invalid JSON data in request',
                error: parseError instanceof Error ? parseError.message : 'Unknown error'
            });
            return;
        }

        console.log('📝 Creating event with data:', {
            title,
            author,
            eventDate,
            isPublished: String(isPublished) === 'true',
            targetAudience: parsedTargetAudience,
            hasCoverImage: !!coverImage,
        });

        // Validate required fields
        if (!title || !description || !content || !eventDate) {
            console.error('❌ Missing required fields');
            res.status(400).json({
                success: false,
                message: 'Missing required fields: title, description, content, or eventDate'
            });
            return;
        }

        const eventData: any = {
            title,
            description,
            content,
            author,
            tags: parsedTags,
            priority,
            targetAudience: parsedTargetAudience,
            isPublished: String(isPublished) === 'true',
            publishDate: publishDate || Date.now(),
            expiryDate,
            eventDate: new Date(eventDate),
            time,
            mode: mode || 'Onsite',
            location,
            organizer,
            contact,
            rsvpLink,
            admissions: parsedAdmissions,
            registrationRequired: registrationRequired === 'true' || registrationRequired === true,
            registrationStart: registrationStart ? new Date(registrationStart) : undefined,
            registrationEnd: registrationEnd ? new Date(registrationEnd) : undefined,
            coverImage: coverImage || (galleryImages.length > 0 ? galleryImages[0] : null),
            galleryImages,
            details: parsedDetails,
        };

        // If a publishDate exists and it's in the future, ensure event remains unpublished until scheduler runs
        // BUT if the user explicitly set isPublished=false (draft), respect that regardless of date.
        const parsedPublishDate = publishDate ? new Date(publishDate) : undefined;
        if (eventData.isPublished && parsedPublishDate && parsedPublishDate > new Date()) {
            eventData.isPublished = false;
            eventData.scheduled = true;
        } else if (!eventData.isPublished) {
            eventData.scheduled = false;
        }

        console.log('💾 Saving to database...');
        const event = await Event.create(eventData);

        console.log('👥 Populating author...');
        await event.populate('author', 'firstName lastName studentNumber');

        console.log('✅ Event created successfully:', event._id);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event,
        });
    } catch (error) {
        console.error('❌ FATAL ERROR in createEvent:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: error instanceof Error ? error.message : 'Unknown error',
            ...(process.env.NODE_ENV === 'development' && {
                stack: error instanceof Error ? error.stack : undefined
            })
        });
    }
};

// Get all events (with filters)
export const getEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            tags,
            isPublished,
            targetAudience,
            priority,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sort = '-eventDate',
        } = req.query;

        const query: EventQuery = {};

        if (tags) query.tags = { $in: (tags as string).split(',') };
        if (isPublished !== undefined) query.isPublished = isPublished === 'true';
        if (targetAudience) query.targetAudience = { $in: [targetAudience as string] };
        if (priority) query.priority = priority as string;

        // Date range filter
        if (startDate || endDate) {
            query.eventDate = {};
            if (startDate) query.eventDate.$gte = new Date(startDate as string);
            if (endDate) query.eventDate.$lte = new Date(endDate as string);
        }

        // Don't show expired events by default
        query.$or = [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: new Date() } },
        ];

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const events = await Event.find(query)
            .populate('author', 'firstName lastName studentNumber')
            .sort(sort as string)
            .skip(skip)
            .limit(limitNum);

        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            data: events,
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

// Get single event by ID
export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid event ID' });
            return;
        }

        const event = await Event.findById(id).populate(
            'author',
            'firstName lastName studentNumber'
        );

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // Increment views
        await event.incrementViews();

        res.status(200).json({
            success: true,
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// Update event
export const updateEvent = async (
    req: MulterRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid event ID' });
            return;
        }

        const event = await Event.findById(id);

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // Handle new cover image upload
        // Handle uploaded files (multiple) during update
        const reqFiles = (req as any).files as MulterFile[] | undefined;
        const reqSingle = (req as any).file as MulterFile | undefined;
        if (Array.isArray(reqFiles) && reqFiles.length > 0) {
            try {
                console.log(`📷 Uploading ${reqFiles.length} images for update...`);
                const buffers = reqFiles
                    .filter((f) => !!f.buffer)
                    .map((f) => ({ buffer: f.buffer as Buffer }));
                if (buffers.length === 0) {
                    throw new Error('No file buffers available for upload');
                }
                const results = await uploadMultipleToCloudinary(buffers, 'events');
                const newUrls = results.map((r) => (r as any).secure_url).filter(Boolean);
                // Preserve existing galleryImages and append new ones
                const existing = Array.isArray(event.galleryImages) ? event.galleryImages : [];
                req.body.galleryImages = JSON.stringify([...existing, ...newUrls]);
                if (!event.coverImage && newUrls.length > 0) req.body.coverImage = newUrls[0];
                console.log('✅ Uploaded and appended images:', newUrls);
            } catch (err) {
                console.error('❌ Failed uploading images on update:', err);
                res.status(500).json({ success: false, message: 'Failed to upload images', error: err instanceof Error ? err.message : undefined });
                return;
            }
        } else if (reqSingle) {
            // Backwards-compatibility for single-file uploads
            if (event.coverImage) {
                await deleteFromCloudinary(event.coverImage);
            }
            const buf = reqSingle.buffer as Buffer | undefined;
            if (!buf) {
                res.status(400).json({ success: false, message: 'Uploaded file has no data' });
                return;
            }
            const result = await uploadToCloudinary(buf, 'events');
            req.body.coverImage = result.secure_url;
        }

        // Parse arrays/objects if they are strings
        if (req.body.tags && typeof req.body.tags === 'string') {
            req.body.tags = JSON.parse(req.body.tags);
        }
        if (req.body.admissions && typeof req.body.admissions === 'string') {
            req.body.admissions = JSON.parse(req.body.admissions);
        }
        if (req.body.targetAudience && typeof req.body.targetAudience === 'string') {
            req.body.targetAudience = JSON.parse(req.body.targetAudience);
        }
        if (req.body.details && typeof req.body.details === 'string') {
            try {
                req.body.details = JSON.parse(req.body.details);
            } catch (e) {
                console.error('❌ Failed to parse details on update:', e);
            }
        }

        // Convert date strings to Date objects
        if (req.body.eventDate) req.body.eventDate = new Date(req.body.eventDate);
        if (req.body.registrationStart) req.body.registrationStart = new Date(req.body.registrationStart);
        if (req.body.registrationEnd) req.body.registrationEnd = new Date(req.body.registrationEnd);

        // If the request is attempting to publish the event, ensure at least one image exists
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

        // Ensure galleryImages is an array if it was stringified
        if (updateData.galleryImages && typeof updateData.galleryImages === 'string') {
            try {
                updateData.galleryImages = JSON.parse(updateData.galleryImages);
            } catch (e) {
                // ignore
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'firstName lastName studentNumber');

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: updatedEvent,
        });
    } catch (error) {
        next(error);
    }
};

// Delete event
export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid event ID' });
            return;
        }

        const event = await Event.findById(id);

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // Delete cover image from cloudinary if exists
        if (event.coverImage) {
            await deleteFromCloudinary(event.coverImage);
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Toggle publish status
export const togglePublishStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid event ID' });
            return;
        }

        const event = await Event.findById(id);

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        event.isPublished = !event.isPublished;
        
        // Set publish date when publishing for the first time
        if (event.isPublished && !event.publishDate) {
            event.publishDate = new Date();
        }

        await event.save();

        res.status(200).json({
            success: true,
            message: `Event ${event.isPublished ? 'published' : 'unpublished'} successfully`,
            data: event,
        });
    } catch (error) {
        next(error);
    }
};

// Get events by tag
export const getEventsByTag = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { tag } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const events = await Event.find({
            tags: tag,
            isPublished: true,
            $or: [
                { expiryDate: { $exists: false } },
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } },
            ],
        })
            .populate('author', 'firstName lastName studentNumber')
            .sort('-eventDate')
            .skip(skip)
            .limit(limitNum);

        const total = await Event.countDocuments({
            tags: tag,
            isPublished: true,
        });

        res.status(200).json({
            success: true,
            data: events,
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

// Get user's events (drafts and published)
export const getMyEvents = async (
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

        const query: UserEventQuery = { author: userId };
        
        if (status === 'published') {
            query.isPublished = true;
        } else if (status === 'draft') {
            query.isPublished = false;
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const events = await Event.find(query)
            .populate('author', 'firstName lastName studentNumber')
            .sort('-createdAt')
            .skip(skip)
            .limit(limitNum);

        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            data: events,
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