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

import { protect } from '../middleware/auth.middleware'; 

const router = express.Router();

// Search and stats routes (before /:id)
router.get('/search', protect as RequestHandler, searchUsers); 
router.get('/stats', protect as RequestHandler, getUserStats); 

// Bulk upload route - MUST be before /:id routes!
router.post('/bulk-upload', protect as RequestHandler, bulkUploadUsers as RequestHandler); 

// Standard CRUD routes
router.get('/', protect as RequestHandler, getAllUsers); 
router.post('/', protect as RequestHandler, createUser as RequestHandler); 

// Dynamic routes with :id parameter MUST come last
router.get('/:id', protect as RequestHandler, getUserById); 
router.put('/:id', protect as RequestHandler, updateUser); 
router.patch('/:id/toggle-status', protect as RequestHandler, toggleUserStatus); 
router.delete('/:id', protect as RequestHandler, deleteUser); 

export default router;