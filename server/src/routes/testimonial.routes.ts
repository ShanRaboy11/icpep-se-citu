import express from 'express';
import { createTestimonial, getTestimonials } from '../controllers/testimonial.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Protected routes (add auth middleware if needed later)
router.post('/', upload.single('image'), createTestimonial);

export default router;
