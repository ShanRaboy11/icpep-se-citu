import express, { RequestHandler } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  bulkUploadUsers,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserStats,
  searchUsers,
} from '../controllers/user.controller';

// Import your authentication middleware
// import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

// IMPORTANT: Specific routes MUST come BEFORE dynamic routes (/:id)
// The order matters because Express matches routes from top to bottom

// Search and stats routes (before /:id)
router.get('/search', searchUsers);
router.get('/stats', getUserStats);

// Bulk upload route - MUST be before /:id routes!
router.post('/bulk-upload', bulkUploadUsers as RequestHandler);

// Standard CRUD routes
router.get('/', getAllUsers);
router.post('/', createUser as RequestHandler);

// Dynamic routes with :id parameter MUST come last
// These will match any path segment, so they should be at the end
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;