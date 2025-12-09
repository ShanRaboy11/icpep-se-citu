import { Router } from 'express';
import multer from 'multer';
import { createPartner, getPartners, updatePartner, deletePartner } from '../controllers/partner.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get('/', getPartners);

// Protected routes (require authentication and admin/officer role)
router.post('/', authenticate, authorizeRoles('admin', 'officer'), upload.single('logo'), createPartner);
router.put('/:id', authenticate, authorizeRoles('admin', 'officer'), upload.single('logo'), updatePartner);
router.delete('/:id', authenticate, authorizeRoles('admin', 'officer'), deletePartner);

export default router;
