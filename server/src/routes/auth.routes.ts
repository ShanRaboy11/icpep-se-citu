import express from 'express';
import {
  login,
  logout,
  getMe,
  changePassword,
  resetPassword,
} from '../controllers/auth.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.use(protect); // All routes after this are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/change-password', changePassword);

// Admin only
router.put('/reset-password/:id', restrictTo('council-officer', 'faculty'), resetPassword);

export default router;