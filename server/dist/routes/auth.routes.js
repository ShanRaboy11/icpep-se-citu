"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// @route   POST /api/auth/login
// @desc    Login user with student number and password
// @access  Public
router.post('/login', auth_controller_1.login);
// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', auth_controller_1.logout);
// @route   POST /api/auth/first-login-password
// @desc    Change password on first login
// @access  Private (requires valid token)
router.post('/first-login-password', auth_middleware_1.authenticateToken, auth_controller_1.firstLoginPasswordChange);
// @route   POST /api/auth/change-password
// @desc    Change password (regular password change)
// @access  Private (requires valid token)
router.post('/change-password', auth_middleware_1.authenticateToken, auth_controller_1.changePassword);
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private (requires valid token)
router.get('/me', auth_middleware_1.authenticateToken, auth_controller_1.getCurrentUser);
exports.default = router;
