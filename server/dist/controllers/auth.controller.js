"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.firstLoginPasswordChange = exports.getCurrentUser = exports.changePassword = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
// JWT Secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Generate JWT Token
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
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
        const token = generateToken(user._id, user.role);
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
// @desc    Change password (first login or password reset)
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        // Validation
        if (!userId || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide user ID and new password',
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long',
            });
        }
        if (newPassword === '123456') {
            return res.status(400).json({
                success: false,
                message: 'Please choose a different password from the default',
            });
        }
        // Find user
        const user = await user_1.default.findById(userId).select('+password +firstLogin');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        // Update password and set firstLogin to false
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
        });
    }
};
exports.changePassword = changePassword;
// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
    try {
        // req.user is set by the auth middleware
        const userId = req.user.userId;
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
// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Public
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
        if (newPassword.length < 6) {
            res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
            return;
        }
        if (newPassword === '123456') {
            res.status(400).json({
                success: false,
                message: 'Please choose a different password from the default',
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
const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
exports.logout = logout;
