import express from 'express';
import {
  createMembershipTier,
  getMembershipTiers,
  getAllMembershipTiers,
  updateMembershipTier,
  deleteMembershipTier,
} from '../controllers/membershipTier.controller';
import {
  getMembershipSettings,
  updateMembershipSettings,
} from '../controllers/membershipSettings.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Tiers — public list, admin-protected list, plain-JSON CRUD (no images)
router.get('/tiers', getMembershipTiers);
router.get('/tiers/admin', authenticateToken, authorizeRoles('council-officer'), getAllMembershipTiers);
router.post('/tiers', authenticateToken, authorizeRoles('council-officer'), createMembershipTier);
router.put('/tiers/:id', authenticateToken, authorizeRoles('council-officer'), updateMembershipTier);
router.delete('/tiers/:id', authenticateToken, authorizeRoles('council-officer'), deleteMembershipTier);

// Settings — singleton (isOpen + registrationUrl)
router.get('/settings', getMembershipSettings);
router.put('/settings', authenticateToken, authorizeRoles('council-officer'), updateMembershipSettings);

export default router;
