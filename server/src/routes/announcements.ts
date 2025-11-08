import express, { Request, Response } from 'express';
import Announcement from '../models/announcement';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/announcements/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

/**
 * @route   POST /api/announcements
 * @desc    Create a new announcement
 * @access  Private (Officers/Admin)
 */
router.post(
    '/',
    authMiddleware,
    upload.fields([
        { name: 'imageUrl', maxCount: 1 },
        { name: 'attachments', maxCount: 10 }
    ]),
    async (req: Request, res: Response) => {
        try {
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
                scheduleDate,
                scheduleTime,
                // Event/Meeting specific
                date,
                time,
                location,
                organizer,
                contact,
                attendees,
                agenda,
                attendanceLink,
                // Achievement specific
                awardees,
            } = req.body;

            // Validate required fields
            if (!title || !description || !content || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields: title, description, content, type'
                });
            }

            // Handle file uploads
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let imageUrl = null;
            let attachments: any[] = [];

            if (files?.imageUrl) {
                imageUrl = `/uploads/announcements/${files.imageUrl[0].filename}`;
            }

            if (files?.attachments) {
                attachments = files.attachments.map(file => ({
                    name: file.originalname,
                    url: `/uploads/announcements/${file.filename}`,
                    fileType: file.mimetype
                }));
            }

            // Parse awardees if type is Achievement
            let parsedAwardees = [];
            if (type === 'Achievement' && awardees) {
                try {
                    parsedAwardees = typeof awardees === 'string' ? JSON.parse(awardees) : awardees;
                } catch (error) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid awardees format'
                    });
                }
            }

            // Parse agenda if provided
            let parsedAgenda = [];
            if (agenda) {
                try {
                    parsedAgenda = typeof agenda === 'string' ? JSON.parse(agenda) : agenda;
                } catch (error) {
                    parsedAgenda = [agenda];
                }
            }

            // Parse targetAudience
            let parsedTargetAudience = ['all'];
            if (targetAudience) {
                try {
                    parsedTargetAudience = typeof targetAudience === 'string' 
                        ? JSON.parse(targetAudience) 
                        : targetAudience;
                } catch (error) {
                    parsedTargetAudience = [targetAudience];
                }
            }

            // Handle scheduled publishing
            let finalPublishDate = publishDate ? new Date(publishDate) : new Date();
            if (scheduleDate && scheduleTime) {
                finalPublishDate = new Date(`${scheduleDate}T${scheduleTime}`);
            }

            // Create announcement object
            const announcementData: any = {
                title,
                description,
                content,
                author: req.user?.id, // From auth middleware
                type,
                priority: priority || 'normal',
                targetAudience: parsedTargetAudience,
                isPublished: isPublished === 'true' || isPublished === true,
                publishDate: finalPublishDate,
                imageUrl,
                attachments,
            };

            // Add optional fields
            if (expiryDate) announcementData.expiryDate = new Date(expiryDate);
            if (date) announcementData.date = new Date(date);
            if (time) announcementData.time = time;
            if (location) announcementData.location = location;
            if (organizer) announcementData.organizer = organizer;
            if (contact) announcementData.contact = contact;
            if (attendees) announcementData.attendees = attendees;
            if (parsedAgenda.length > 0) announcementData.agenda = parsedAgenda;
            if (parsedAwardees.length > 0) announcementData.awardees = parsedAwardees;

            // Add attendance link for Meeting type
            if (type === 'Meeting' && attendanceLink) {
                if (!announcementData.attachments) announcementData.attachments = [];
                announcementData.attachments.push({
                    name: 'Attendance Sheet',
                    url: attendanceLink,
                    fileType: 'link'
                });
            }

            // Create announcement
            const announcement = new Announcement(announcementData);
            await announcement.save();

            // Populate author info
            await announcement.populate('author', 'name email');

            return res.status(201).json({
                success: true,
                message: 'Announcement created successfully',
                data: announcement
            });

        } catch (error: any) {
            console.error('Error creating announcement:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating announcement',
                error: error.message
            });
        }
    }
);

/**
 * @route   GET /api/announcements
 * @desc    Get all announcements with filters
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const { type, isPublished, targetAudience, limit = 20, page = 1 } = req.query;

        const query: any = {};

        if (type) query.type = type;
        if (isPublished !== undefined) query.isPublished = isPublished === 'true';
        if (targetAudience) query.targetAudience = targetAudience;

        const skip = (Number(page) - 1) * Number(limit);

        const announcements = await Announcement.find(query)
            .populate('author', 'name email')
            .sort({ publishDate: -1 })
            .limit(Number(limit))
            .skip(skip);

        const total = await Announcement.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: announcements,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });

    } catch (error: any) {
        console.error('Error fetching announcements:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching announcements',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/announcements/:id
 * @desc    Get single announcement by ID
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('author', 'name email');

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Increment views
        await announcement.incrementViews();

        return res.status(200).json({
            success: true,
            data: announcement
        });

    } catch (error: any) {
        console.error('Error fetching announcement:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching announcement',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/announcements/:id
 * @desc    Update announcement
 * @access  Private (Officers/Admin)
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Update announcement
        Object.assign(announcement, req.body);
        await announcement.save();

        return res.status(200).json({
            success: true,
            message: 'Announcement updated successfully',
            data: announcement
        });

    } catch (error: any) {
        console.error('Error updating announcement:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating announcement',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/announcements/:id
 * @desc    Delete announcement
 * @access  Private (Officers/Admin)
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting announcement:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting announcement',
            error: error.message
        });
    }
});

export default router;