import express from 'express';
import { 
  login, 
  changePassword, 
  firstLoginPasswordChange,
  getCurrentUser,
  logout 
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user with student number and password
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', logout);

// @route   POST /api/auth/first-login-password
// @desc    Change password on first login (no current password required)
// @access  Private (requires valid token)
router.post('/first-login-password', authenticateToken, firstLoginPasswordChange);

// @route   POST /api/auth/change-password
// @desc    Change password (requires current password)
// @access  Private (requires valid token)
router.post('/change-password', authenticateToken, changePassword);

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private (requires valid token)
router.get('/me', authenticateToken, getCurrentUser);

export default router;