import express from 'express';
import { validateObjectId } from '../middleware/validate-id';
import { createAdvisor, getAdvisors, getAllAdvisors, updateAdvisor, deleteAdvisor } from '../controllers/advisor.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
router.param('id', validateObjectId);

// Public routes
router.get('/', getAdvisors);

// Protected routes (council officers and admins/developers only)
router.get('/admin', authenticateToken, authorizeRoles('council-officer'), getAllAdvisors);
router.post('/', authenticateToken, authorizeRoles('council-officer'), createAdvisor);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), updateAdvisor);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteAdvisor);

export default router;
