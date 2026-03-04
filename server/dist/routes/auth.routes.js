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
// @route   POST /api/auth/forgot-password
// @desc    Request password reset code
// @access  Public
router.post('/forgot-password', auth_controller_1.forgotPassword);
// @route   POST /api/auth/verify-code
// @desc    Verify reset code
// @access  Public
router.post('/verify-code', auth_controller_1.verifyResetCode);
// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', auth_controller_1.resetPassword);
// @route   POST /api/auth/first-login-password
// @desc    Change password on first login (no current password required)
// @access  Private (requires valid token)
router.post('/first-login-password', auth_middleware_1.authenticateToken, auth_controller_1.firstLoginPasswordChange);
// @route   POST /api/auth/change-password
// @desc    Change password (requires current password)
// @access  Private (requires valid token)
router.post('/change-password', auth_middleware_1.authenticateToken, auth_controller_1.changePassword);
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private (requires valid token)
router.get('/me', auth_middleware_1.authenticateToken, auth_controller_1.getCurrentUser);
exports.default = router;
