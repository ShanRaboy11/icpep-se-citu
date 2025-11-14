"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcement_controller_1 = require("../controllers/announcement.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', announcement_controller_1.getAnnouncements);
router.get('/type/:type', announcement_controller_1.getAnnouncementsByType);
router.get('/:id', announcement_controller_1.getAnnouncementById);
// Protected routes (require authentication)
// Get user's own announcements - MUST be before /:id to avoid conflicts
router.get('/my/announcements', auth_middleware_1.authenticate, announcement_controller_1.getMyAnnouncements);
// Create announcement (officers/faculty only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), 
// Accept multiple images for announcements (field name: 'images')
upload_middleware_1.upload.array('images', 6), announcement_controller_1.createAnnouncement);
// Update announcement
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), upload_middleware_1.upload.array('images', 6), announcement_controller_1.updateAnnouncement);
// Delete announcement
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), announcement_controller_1.deleteAnnouncement);
// Toggle publish status
router.patch('/:id/publish', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), announcement_controller_1.togglePublishStatus);
exports.default = router;
