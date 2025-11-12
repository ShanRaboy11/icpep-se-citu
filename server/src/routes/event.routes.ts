import express from 'express';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    togglePublishStatus,
    getEventsByTag,
    getMyEvents,
} from '../controllers/event.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/tag/:tag', getEventsByTag);
router.get('/:id', getEventById);

// Protected routes (require authentication)
// Get user's own events - MUST be before /:id to avoid conflicts
router.get('/my/events', authenticate, getMyEvents);

// Create event (officers/faculty only)
router.post(
    '/',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    // Accept multiple images (field name: 'images'). Limit to 6 files.
    upload.array('images', 6),
    createEvent
);

// Update event
router.patch(
    '/:id',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    // Accept multiple images for update as well
    upload.array('images', 6),
    updateEvent
);

// Delete event
router.delete(
    '/:id',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    deleteEvent
);

// Toggle publish status
router.patch(
    '/:id/publish',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    togglePublishStatus
);

export default router;