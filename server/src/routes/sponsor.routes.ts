import express from 'express';
import { createSponsor, getSponsors, getAllSponsors, updateSponsor, deleteSponsor } from '../controllers/sponsor.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getSponsors);

// Protected routes (council officers and admins/developers only)
router.get('/admin', authenticateToken, authorizeRoles('council-officer'), getAllSponsors);
router.post('/', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), createSponsor);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), updateSponsor);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteSponsor);

export default router;
