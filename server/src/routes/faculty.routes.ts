import express from 'express';
import { validateObjectId } from '../middleware/validate-id';
import { createFaculty, getFaculty, getAllFaculty, updateFaculty, deleteFaculty } from '../controllers/faculty.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();
router.param('id', validateObjectId);

// Public routes
router.get('/', getFaculty);

// Protected routes (council officers and admins/developers only)
router.get('/admin', authenticateToken, authorizeRoles('council-officer'), getAllFaculty);
router.post('/', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), createFaculty);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), updateFaculty);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteFaculty);

export default router;
