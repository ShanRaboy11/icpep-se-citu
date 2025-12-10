import express from 'express';
import { createSponsor, getSponsors, getAllSponsors } from '../controllers/sponsor.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getSponsors);

// Protected routes
router.get('/admin', authenticateToken, getAllSponsors);
router.post('/', upload.single('image'), createSponsor);

export default router;
