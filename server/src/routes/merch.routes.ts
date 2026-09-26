import express from 'express';
import { createMerch, getMerch, updateMerch, deleteMerch } from '../controllers/merch.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getMerch);

// Protected routes (council officers and admins/developers only)
router.post('/', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), createMerch);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), updateMerch);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteMerch);

export default router;
