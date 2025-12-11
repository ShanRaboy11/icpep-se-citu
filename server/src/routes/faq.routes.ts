import express from 'express';
import { createFAQ, getFAQs, getAllFAQs, updateFAQ, deleteFAQ } from '../controllers/faq.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', getFAQs);

// Protected routes
router.get('/admin', authenticateToken, authorizeRoles('admin', 'council-officer'), getAllFAQs);
router.post('/', authenticateToken, authorizeRoles('admin', 'council-officer'), createFAQ);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'council-officer'), updateFAQ);
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'council-officer'), deleteFAQ);

export default router;
