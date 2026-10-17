import express from 'express';
import { getSiteSettings, updateSiteSettings } from '../controllers/siteSettings.controller';
import { getPublicStats } from '../controllers/stats.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public — the maintenance gate on the frontend (and anyone else) needs to
// read this without being logged in.
router.get('/settings', getSiteSettings);
router.get('/stats', getPublicStats);

// Admin only — flips maintenance mode for the whole site.
router.put('/settings', authenticateToken, authorizeRoles('admin'), updateSiteSettings);

export default router;
