"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Search and stats routes (before /:id)
router.get('/search', auth_middleware_1.protect, user_controller_1.searchUsers);
router.get('/stats', auth_middleware_1.protect, user_controller_1.getUserStats);
// Bulk upload route - MUST be before /:id routes!
router.post('/bulk-upload', auth_middleware_1.protect, user_controller_1.bulkUploadUsers);
// Standard CRUD routes
router.get('/', auth_middleware_1.protect, user_controller_1.getAllUsers);
router.post('/', auth_middleware_1.protect, user_controller_1.createUser);
// Dynamic routes with :id parameter MUST come last
router.get('/:id', auth_middleware_1.protect, user_controller_1.getUserById);
router.put('/:id', auth_middleware_1.protect, user_controller_1.updateUser);
router.patch('/:id/toggle-status', auth_middleware_1.protect, user_controller_1.toggleUserStatus);
router.delete('/:id', auth_middleware_1.protect, user_controller_1.deleteUser);
exports.default = router;
