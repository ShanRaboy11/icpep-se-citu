import express from 'express';
import { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } from '../controllers/testimonial.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getTestimonials);

// Protected routes (add auth middleware if needed later)
router.post('/', upload.single('image'), createTestimonial);
router.put('/:id', upload.single('image'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;
