"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
// Import your authentication middleware
// import { protect, restrictTo } from '../middleware/auth.middleware';
const router = express_1.default.Router();
// IMPORTANT: Specific routes MUST come BEFORE dynamic routes (/:id)
// The order matters because Express matches routes from top to bottom
// Search and stats routes (before /:id)
router.get('/search', user_controller_1.searchUsers);
router.get('/stats', user_controller_1.getUserStats);
// Bulk upload route - MUST be before /:id routes!
router.post('/bulk-upload', user_controller_1.bulkUploadUsers);
// Standard CRUD routes
router.get('/', user_controller_1.getAllUsers);
router.post('/', user_controller_1.createUser);
// Dynamic routes with :id parameter MUST come last
// These will match any path segment, so they should be at the end
router.get('/:id', user_controller_1.getUserById);
router.put('/:id', user_controller_1.updateUser);
router.patch('/:id/toggle-status', user_controller_1.toggleUserStatus);
router.delete('/:id', user_controller_1.deleteUser);
exports.default = router;
