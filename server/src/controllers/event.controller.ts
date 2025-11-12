import { Request, Response, NextFunction } from 'express';
import Event, { IEvent } from '../models/event';
import { uploadToCloudinary, deleteFromCloudinary, uploadMultipleToCloudinary } from '../utils/cloudinary';
import mongoose from 'mongoose';

// Properly extend Request to include Multer file
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

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

        const multerFiles = (req as any).files as Express.Multer.File[] | undefined;
        const singleFile = (req as any).file as Express.Multer.File | undefined;

        if (Array.isArray(multerFiles) && multerFiles.length > 0) {
            try {
                console.log(`📷 Uploading ${multerFiles.length} images to Cloudinary...`);
                const buffers = multerFiles.map((f) => ({ buffer: f.buffer }));
                const results = await uploadMultipleToCloudinary(buffers, 'events');
                galleryImages = results.map((r) => (r as any).secure_url).filter(Boolean);
                console.log('✅ Images uploaded:', galleryImages);
            } catch (uploadError) {
                console.error('❌ Cloudinary multiple upload failed:', uploadError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload images',
                    error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                });
                return;
            }
        } else if (singleFile) {
            // Backwards compatible: if a single file was uploaded under req.file
            try {
                console.log('📷 Uploading single cover image to Cloudinary...');
                const result = await uploadToCloudinary(singleFile.buffer, 'events');
                galleryImages = [result.secure_url];
                console.log('✅ Image uploaded:', result.secure_url);
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
        let parsedTags, parsedAdmissions, parsedTargetAudience;
        
        try {
            parsedTags = tags ? JSON.parse(tags) : [];
            parsedAdmissions = admissions ? JSON.parse(admissions) : [];
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

        console.log('📝 Creating event with data:', {
            title,
            author,
            eventDate,
            isPublished: isPublished === 'true' || isPublished === true,
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

        const eventData = {
            title,
            description,
            content,
            author,
            tags: parsedTags,
            priority,
            targetAudience: parsedTargetAudience,
            isPublished: isPublished === 'true' || isPublished === true,
            publishDate: publishDate || Date.now(),
            expiryDate,
            eventDate: new Date(eventDate),
            time,
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
        };

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
        const reqFiles = (req as any).files as Express.Multer.File[] | undefined;
        const reqSingle = (req as any).file as Express.Multer.File | undefined;
        if (Array.isArray(reqFiles) && reqFiles.length > 0) {
            try {
                console.log(`📷 Uploading ${reqFiles.length} images for update...`);
                const buffers = reqFiles.map((f) => ({ buffer: f.buffer }));
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
            const result = await uploadToCloudinary(reqSingle.buffer, 'events');
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

        // Convert date strings to Date objects
        if (req.body.eventDate) req.body.eventDate = new Date(req.body.eventDate);
        if (req.body.registrationStart) req.body.registrationStart = new Date(req.body.registrationStart);
        if (req.body.registrationEnd) req.body.registrationEnd = new Date(req.body.registrationEnd);

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            req.body,
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