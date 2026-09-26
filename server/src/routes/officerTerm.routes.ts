import express from 'express';
import {
  createOfficerTerm,
  getOfficerTerms,
  getOfficerTermYears,
  getAllOfficerTerms,
  updateOfficerTerm,
  deleteOfficerTerm,
} from '../controllers/officerTerm.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/years', getOfficerTermYears);
router.get('/', getOfficerTerms);

// Protected routes (council officers and admins/developers only)
router.get('/admin', authenticateToken, authorizeRoles('council-officer'), getAllOfficerTerms);
router.post('/', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), createOfficerTerm);
router.put('/:id', authenticateToken, authorizeRoles('council-officer'), upload.single('image'), updateOfficerTerm);
router.delete('/:id', authenticateToken, authorizeRoles('council-officer'), deleteOfficerTerm);

export default router;
