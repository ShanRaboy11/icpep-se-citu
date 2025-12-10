import express from 'express';
import { createSponsor, getSponsors, getAllSponsors, updateSponsor, deleteSponsor } from '../controllers/sponsor.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getSponsors);

// Protected routes
router.get('/admin', authenticateToken, getAllSponsors);
router.post('/', upload.single('image'), createSponsor);
router.put('/:id', upload.single('image'), updateSponsor);
router.delete('/:id', deleteSponsor);

export default router;
