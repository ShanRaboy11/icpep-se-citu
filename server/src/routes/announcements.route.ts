import express from 'express';
import {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
    togglePublishStatus,
    getAnnouncementsByType,
    getMyAnnouncements,
} from '../controllers/announcement.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getAnnouncements);
router.get('/type/:type', getAnnouncementsByType);
router.get('/:id', getAnnouncementById);

// Protected routes (require authentication)
// Get user's own announcements - MUST be before /:id to avoid conflicts
router.get('/my/announcements', authenticate, getMyAnnouncements);

// Create announcement (officers/faculty only)
router.post(
    '/',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    // Accept multiple images for announcements (field name: 'images')
    upload.array('images', 6),
    createAnnouncement
);

// Update announcement
router.patch(
    '/:id',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    upload.array('images', 6),
    updateAnnouncement
);

// Delete announcement
router.delete(
    '/:id',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    deleteAnnouncement
);

// Toggle publish status
router.patch(
    '/:id/publish',
    authenticate,
    authorizeRoles('council-officer', 'committee-officer', 'faculty'),
    togglePublishStatus
);

export default router;