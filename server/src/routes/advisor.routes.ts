import express from 'express';
import { createAdvisor, getAdvisors, getAllAdvisors, updateAdvisor, deleteAdvisor } from '../controllers/advisor.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getAdvisors);

// Protected routes (council officers and admins/developers only)
router.get('/admin', authenticateToken, authorizeRoles('council-officer'), getAllAdvisors);
router.post('/', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), createAdvisor);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), updateAdvisor);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteAdvisor);

export default router;
