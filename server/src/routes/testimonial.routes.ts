import express from 'express';
import { createTestimonial, getTestimonials, getAllTestimonials, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Protected routes (council officers and admins/developers only)
router.get('/admin', authenticateToken, authorizeRoles('council-officer'), getAllTestimonials);
router.post('/', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), createTestimonial);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), updateTestimonial);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteTestimonial);

export default router;