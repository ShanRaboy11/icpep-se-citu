/*
import express, { Request, Response } from 'express';
import Event from '../models/event';
import { authMiddleware } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/events/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
    }
});

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private (Officers/Admin)
router.post(
    '/',
    authMiddleware,
    upload.fields([
        { name: 'bannerImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 }
    ]),
    async (req: Request, res: Response) => {
        try {
            const {
                title,
                description,
                details,
                tags,
                eventType,
                date,
                endDate,
                mode,
                location,
                venue,
                capacity,
                rsvpDeadline,
                organizerName,
                organizerRole,
                isPublished,
                requiresApproval,
                rsvpLink,
                // Admission/pricing
                admissions,
                // Registration
                registrationRequired,
                registrationStart,
                registrationEnd,
            } = req.body;

            // Validate required fields
            if (!title || !description || !date || !mode || !location) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields: title, description, date, mode, location'
                });
            }

            // Handle file uploads
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            let bannerImageUrl = '';
            let galleryImageUrls: string[] = [];

            if (files?.bannerImage) {
                bannerImageUrl = `/uploads/events/${files.bannerImage[0].filename}`;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Banner image is required'
                });
            }

            if (files?.galleryImages) {
                galleryImageUrls = files.galleryImages.map(
                    file => `/uploads/events/${file.filename}`
                );
            }

            // Parse tags if provided
            let parsedTags: string[] = [];
            if (tags) {
                try {
                    parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
                } catch (error) {
                    parsedTags = [tags];
                }
            }

            // Parse details if provided
            let parsedDetails: any[] = [];
            if (details) {
                try {
                    parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
                } catch (error) {
                    console.error('Error parsing details:', error);
                }
            }

            // Parse admissions if provided
            let parsedAdmissions: any[] = [];
            if (admissions) {
                try {
                    parsedAdmissions = typeof admissions === 'string' ? JSON.parse(admissions) : admissions;
                } catch (error) {
                    console.error('Error parsing admissions:', error);
                }
            }

            // Create organizer object if provided
            let organizerData = undefined;
            if (organizerName) {
                organizerData = {
                    name: organizerName,
                    role: organizerRole || '',
                };
            }

            // Create event object
            const eventData: any = {
                title,
                description,
                date: new Date(date),
                mode,
                location,
                bannerImageUrl,
                isPublished: isPublished === 'true' || isPublished === true,
                requiresApproval: requiresApproval === 'true' || requiresApproval === true,
            };

            // Add optional fields
            if (endDate) eventData.endDate = new Date(endDate);
            if (venue) eventData.venue = venue;
            if (capacity) eventData.capacity = Number(capacity);
            if (rsvpDeadline) eventData.rsvpDeadline = new Date(rsvpDeadline);
            if (eventType) eventData.eventType = eventType;
            if (parsedTags.length > 0) eventData.tags = parsedTags;
            if (parsedDetails.length > 0) eventData.details = parsedDetails;
            if (galleryImageUrls.length > 0) eventData.galleryImageUrls = galleryImageUrls;
            if (organizerData) eventData.organizer = organizerData;

            // Add registration fields to details
            if (registrationRequired === 'true' || registrationRequired === true) {
                if (!eventData.details) eventData.details = [];
                
                eventData.details.push({
                    title: 'Registration',
                    content: `Registration opens: ${new Date(registrationStart).toLocaleString()}\nRegistration closes: ${new Date(registrationEnd).toLocaleString()}`
                });

                if (registrationStart) eventData.rsvpDeadline = new Date(registrationEnd);
            }

            // Add admissions to details
            if (parsedAdmissions.length > 0) {
                if (!eventData.details) eventData.details = [];
                
                const admissionContent = parsedAdmissions
                    .map(a => `${a.category}: ${a.price}`)
                    .join('\n');

                eventData.details.push({
                    title: 'Admission',
                    content: admissionContent
                });
            }

            // Add RSVP link to details
            if (rsvpLink) {
                if (!eventData.details) eventData.details = [];
                
                eventData.details.push({
                    title: 'RSVP Link',
                    content: rsvpLink
                });
            }

            // Create event
            const event = new Event(eventData);
            await event.save();

            return res.status(201).json({
                success: true,
                message: 'Event created successfully',
                data: event
            });

        } catch (error: any) {
            console.error('Error creating event:', error);
            return res.status(500).json({
                success: false,
                message: 'Error creating event',
                error: error.message
            });
        }
    }
);

/**
 * @route   GET /api/events
 * @desc    Get all events with filters
 * @access  Public
router.get('/', async (req: Request, res: Response) => {
    try {
        const { 
            eventType, 
            isPublished, 
            status, 
            limit = 20, 
            page = 1,
            tags 
        } = req.query;

        const query: any = {};

        if (eventType) query.eventType = eventType;
        if (isPublished !== undefined) query.isPublished = isPublished === 'true';
        if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };

        const skip = (Number(page) - 1) * Number(limit);

        let events = await Event.find(query)
            .sort({ date: -1 })
            .limit(Number(limit))
            .skip(skip);

        // Filter by status if provided (using virtual)
        if (status) {
            events = events.filter(event => event.status === status);
        }

        const total = await Event.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: events,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });

    } catch (error: any) {
        console.error('Error fetching events:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Public
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('participants.user', 'name email')
            .populate('organizerUsers', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: event
        });

    } catch (error: any) {
        console.error('Error fetching event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/events/:id/rsvp
 * @desc    RSVP to an event
 * @access  Private
router.post('/:id/rsvp', authMiddleware, async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event has ended
        if (event.status === 'Ended') {
            return res.status(400).json({
                success: false,
                message: 'Cannot RSVP to a past event'
            });
        }

        // Check if RSVP deadline has passed
        if (event.rsvpDeadline && new Date() > event.rsvpDeadline) {
            return res.status(400).json({
                success: false,
                message: 'RSVP deadline has passed'
            });
        }

        // Check if user already RSVP'd
        const existingRSVP = event.participants.find(
            p => p.user.toString() === req.user?.id
        );

        if (existingRSVP) {
            return res.status(400).json({
                success: false,
                message: 'You have already RSVP\'d to this event'
            });
        }

        // Check capacity
        if (event.capacity && event.participants.length >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is at full capacity'
            });
        }

        // Add participant
        event.participants.push({
            user: req.user!.id,
            status: event.requiresApproval ? 'pending' : 'approved',
            rsvpDate: new Date()
        });

        await event.save();

        return res.status(200).json({
            success: true,
            message: event.requiresApproval 
                ? 'RSVP submitted. Awaiting approval.' 
                : 'Successfully RSVP\'d to event',
            data: event
        });

    } catch (error: any) {
        console.error('Error RSVP\'ing to event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error RSVP\'ing to event',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private (Officers/Admin)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Update event
        Object.assign(event, req.body);
        await event.save();

        return res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });

    } catch (error: any) {
        console.error('Error updating event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (Officers/Admin)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting event:', error);
        return res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
});
//export default router;
*/