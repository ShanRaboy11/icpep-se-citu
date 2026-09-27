import express, { RequestHandler } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  bulkUploadUsers,
  syncDeleteUsers,
  syncUpsertBatch,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserStats,
  searchUsers,
} from '../controllers/user.controller';

import { protect, authorizeRoles, authorizeSelfOrRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Search and stats routes (before /:id) — exposes the full student
// directory, so council officers and admins/developers only.
router.get('/search', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, searchUsers);
router.get('/stats', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, getUserStats);

// Bulk upload route - MUST be before /:id routes! (Users admin page only)
router.post('/bulk-upload', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, bulkUploadUsers as RequestHandler);
router.post('/sync-delete', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, syncDeleteUsers as RequestHandler);
router.post('/sync-upsert-batch', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, syncUpsertBatch as RequestHandler);

// Standard CRUD routes
// GET '/' is open to any logged-in user, but non-officers only ever get a
// trimmed, officers-only view (ComMeet availability) — see getAllUsers.
router.get('/', protect as RequestHandler, getAllUsers);
router.post('/', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, createUser as RequestHandler);

// Dynamic routes with :id parameter MUST come last
router.get('/:id', protect as RequestHandler, authorizeSelfOrRoles('council-officer') as RequestHandler, getUserById);
// A user can always update their own record (e.g. Profile page); updating
// someone else's requires council-officer/admin.
router.put('/:id', protect as RequestHandler, authorizeSelfOrRoles('council-officer') as RequestHandler, updateUser);
router.patch('/:id/toggle-status', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, toggleUserStatus);
router.delete('/:id', protect as RequestHandler, authorizeRoles('council-officer') as RequestHandler, deleteUser);

export default router;