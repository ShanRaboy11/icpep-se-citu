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
    reportEvent,
} from '../controllers/event.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';
import { rateLimit } from '../utils/rate-limit';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/tag/:tag', getEventsByTag);
// Open to anyone, so cap how many reports one caller can send.
const reportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many reports. Please try again later.',
});
router.post('/:id/report', reportRateLimit, reportEvent);
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