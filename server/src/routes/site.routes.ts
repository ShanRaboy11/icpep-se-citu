import express from 'express';
import { getSiteSettings, updateSiteSettings, updatePrimer, updateContact } from '../controllers/siteSettings.controller';
import { getPublicStats } from '../controllers/stats.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import { uploadPdf, MAX_PDF_SIZE_MB } from '../middleware/upload.middleware';

const router = express.Router();

// Public — the maintenance gate on the frontend (and anyone else) needs to
// read this without being logged in.
router.get('/settings', getSiteSettings);
router.get('/stats', getPublicStats);

// Admin only — flips maintenance mode for the whole site.
router.put('/settings', authenticateToken, authorizeRoles('admin'), updateSiteSettings);

router.put('/contact', authenticateToken, authorizeRoles('council-officer'), updateContact);

router.put(
  '/primer',
  authenticateToken,
  authorizeRoles('council-officer'),
  (req, res, next) => {
    uploadPdf.single('file')(req, res, (error) => {
      if (error) {
        res.status(400).json({ success: false, message: `Upload a PDF up to ${MAX_PDF_SIZE_MB}MB` });
        return;
      }
      next();
    });
  },
  updatePrimer
);

export default router;
