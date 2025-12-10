import express from 'express';
import { createTestimonial, getTestimonials, getAllTestimonials } from '../controllers/testimonial.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Protected routes
router.get('/admin', authenticateToken, getAllTestimonials);
router.post('/', upload.single('image'), createTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
