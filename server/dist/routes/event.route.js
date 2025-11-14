"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', event_controller_1.getEvents);
router.get('/tag/:tag', event_controller_1.getEventsByTag);
router.get('/:id', event_controller_1.getEventById);
// Protected routes (require authentication)
// Get user's own events - MUST be before /:id to avoid conflicts
router.get('/my/events', auth_middleware_1.authenticate, event_controller_1.getMyEvents);
// Create event (officers/faculty only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), 
// Accept multiple images (field name: 'images'). Limit to 6 files.
upload_middleware_1.upload.array('images', 6), event_controller_1.createEvent);
// Update event
router.patch('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), 
// Accept multiple images for update as well
upload_middleware_1.upload.array('images', 6), event_controller_1.updateEvent);
// Delete event
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), event_controller_1.deleteEvent);
// Toggle publish status
router.patch('/:id/publish', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('council-officer', 'committee-officer', 'faculty'), event_controller_1.togglePublishStatus);
exports.default = router;