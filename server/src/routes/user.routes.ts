import express from 'express';
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

// Public routes (or add auth middleware as needed)
router.get('/search', searchUsers);
router.get('/stats', getUserStats);
router.get('/', getAllUsers);
router.get('/:id', getUserById);

// Protected routes (add your auth middleware)
// Example: router.use(protect); // Protect all routes after this line

router.post('/', createUser);
router.post('/bulk-upload', bulkUploadUsers);
router.put('/:id', updateUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.delete('/:id', deleteUser);

export default router;