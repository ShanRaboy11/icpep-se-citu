import { Request, Response, NextFunction } from 'express';
import Announcement, { IAnnouncement } from '../models/announcement';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import mongoose from 'mongoose';

// Properly extend Request to include Multer file
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

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

        // Handle image upload if present
        let imageUrl: string | null = null;
        if (req.file) {
            try {
                console.log('📷 Uploading image to Cloudinary...');
                console.log('📷 File size:', req.file.size, 'bytes');
                console.log('📷 File type:', req.file.mimetype);
                
                const result = await uploadToCloudinary(req.file.buffer, 'announcements');
                imageUrl = result.secure_url;
                console.log('✅ Image uploaded:', imageUrl);
            } catch (uploadError) {
                console.error('❌ Cloudinary upload failed:', uploadError);
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload image',
                    error: uploadError instanceof Error ? uploadError.message : 'Unknown error'
                });
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
            isPublished: isPublished === 'true' || isPublished === true,
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

        const announcementData = {
            title,
            description,
            content,
            author,
            type,
            priority,
            targetAudience: parsedTargetAudience,
            isPublished: isPublished === 'true' || isPublished === true,
            publishDate: publishDate || Date.now(),
            expiryDate,
            time,
            location,
            organizer,
            contact,
            attendees,
            agenda: parsedAgenda,
            awardees: parsedAwardees,
            imageUrl,
            attachments: parsedAttachments,
        };

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

        // Handle new image upload
        if (req.file) {
            // Delete old image if exists
            if (announcement.imageUrl) {
                await deleteFromCloudinary(announcement.imageUrl);
            }
            const result = await uploadToCloudinary(req.file.buffer, 'announcements');
            req.body.imageUrl = result.secure_url;
        }

        // Parse arrays if they are strings
        if (req.body.agenda && typeof req.body.agenda === 'string') {
            req.body.agenda = JSON.parse(req.body.agenda);
        }
        if (req.body.awardees && typeof req.body.awardees === 'string') {
            req.body.awardees = JSON.parse(req.body.awardees);
        }
        if (req.body.attachments && typeof req.body.attachments === 'string') {
            req.body.attachments = JSON.parse(req.body.attachments);
        }
        if (req.body.targetAudience && typeof req.body.targetAudience === 'string') {
            req.body.targetAudience = JSON.parse(req.body.targetAudience);
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            id,
            req.body,
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

        // Delete image from cloudinary if exists
        if (announcement.imageUrl) {
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