"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getCurrentUser = exports.changePassword = exports.firstLoginPasswordChange = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const password_validator_1 = require("../utils/password_validator");
// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Generate JWT Token
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { studentNumber, password } = req.body;
        // Validation
        if (!studentNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide student number and password',
            });
        }
        // Find user and include password and firstLogin fields
        const user = await user_1.default.findOne({
            studentNumber: studentNumber.toUpperCase()
        }).select('+password +firstLogin');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact an administrator.',
            });
        }
        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
        // Generate token
        const token = generateToken(user._id.toString(), user.role);
        // Prepare user data (exclude sensitive fields)
        const userData = {
            _id: user._id,
            studentNumber: user.studentNumber,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            fullName: user.fullName,
            role: user.role,
            yearLevel: user.yearLevel,
            membershipStatus: user.membershipStatus,
            profilePicture: user.profilePicture,
            isActive: user.isActive,
            firstLogin: user.firstLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userData,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
};
exports.login = login;
// @desc    Change password on first login
// @route   POST /api/auth/first-login-password
// @access  Private
const firstLoginPasswordChange = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide new password',
            });
            return;
        }
        // Validate password strength
        const validation = (0, password_validator_1.validatePassword)(newPassword);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Password does not meet security requirements',
                errors: validation.errors,
            });
            return;
        }
        // Get user with password
        const user = await user_1.default.findById(req.user?.id).select('+password +firstLogin');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Check if this is actually a first login
        if (!user.firstLogin) {
            res.status(400).json({
                success: false,
                message: 'This endpoint is only for first login password change',
            });
            return;
        }
        // Update password
        user.password = newPassword;
        user.firstLogin = false;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message,
        });
    }
};
exports.firstLoginPasswordChange = firstLoginPasswordChange;
// @desc    Change password (regular password change - requires current password)
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        // Validation
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide current password and new password',
            });
            return;
        }
        // Validate password strength
        const validation = (0, password_validator_1.validatePassword)(newPassword);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Password does not meet security requirements',
                errors: validation.errors,
            });
            return;
        }
        // Find user
        const user = await user_1.default.findById(req.user?.id).select('+password +firstLogin');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Verify current password
        const isPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isPasswordCorrect) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
            return;
        }
        // Update password
        user.password = newPassword;
        user.firstLogin = false;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change',
            error: error.message,
        });
    }
};
exports.changePassword = changePassword;
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await user_1.default.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};
exports.getCurrentUser = getCurrentUser;
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
exports.logout = logout;
