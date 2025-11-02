"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.changePassword = exports.logout = exports.getMe = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const sendTokenResponse = (user, statusCode, res) => {
    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        // This should ideally be caught earlier in your app's startup or config check
        console.error("CRITICAL ERROR: JWT_SECRET is not defined!");
        res.status(500).json({
            success: false,
            message: 'Server configuration error: JWT secret missing.',
        });
        return; // Exit to prevent further errors
    }
    // Generate the token INSIDE this function where 'user' is available
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role, membershipStatus: user.membershipStatus }, // Include relevant user data
    jwtSecret, // Use the non-null secret
    { expiresIn: '1h' } // Token expires in 1 hour
    );
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days for the cookie
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'lax',
    };
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token, // Send the token in the JSON response as well
        data: {
            id: user._id,
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
        },
    });
};
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { studentNumber, password } = req.body;

        console.log('🔐 Login attempt received');
        console.log('📋 Student Number:', studentNumber);
        console.log('🔑 Password provided:', !!password);
        console.log('🔑 Password length:', password?.length);

        // Validate input
        if (!studentNumber || !password) {
            console.log('❌ Validation failed: Missing credentials');
            res.status(400).json({
                success: false,
                message: 'Please provide student number and password',
            });
            return;
        }

        // Find user by student number and include password
        console.log('🔍 Searching for user:', studentNumber.toUpperCase());
        const user = await user_1.default.findOne({ studentNumber: studentNumber.toUpperCase() })
            .select('+password +firstLogin');

        console.log('👤 User found:', !!user);
        
        if (user) {
            console.log('📝 User details:');
            console.log('  - Student Number:', user.studentNumber);
            console.log('  - Has password field:', !!user.password);
            console.log('  - Password starts with $2:', user.password?.startsWith('$2'));
            console.log('  - Is Active:', user.isActive);
            console.log('  - First Login:', user.firstLogin);
        }

        if (!user) {
            console.log('❌ User not found');
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        // Check if user is active
        if (!user.isActive) {
            console.log('❌ User is inactive');
            res.status(401).json({
                success: false,
                message: 'Your account has been deactivated. Please contact an administrator.',
            });
            return;
        }

        // Check password
        console.log('🔐 Comparing passwords...');
        console.log('  - Input password:', password);
        console.log('  - Stored hash (first 20 chars):', user.password?.substring(0, 20));
        
        const isPasswordMatch = await user.comparePassword(password);
        console.log('✅ Password match result:', isPasswordMatch);

        if (!isPasswordMatch) {
            console.log('❌ Password mismatch');
            res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
            return;
        }

        console.log('✅ Login successful! Sending token...');
        // Send token response
        sendTokenResponse(user, 200, res);
    }
    catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message,
        });
    }
};

exports.login = login;
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await user_1.default.findById(req.user?.id)
            .populate('registeredBy', 'firstName lastName middleName');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message,
        });
    }
};
exports.getMe = getMe;
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};
exports.logout = logout;
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: 'Please provide current and new password',
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
        // Get user with password
        const user = await user_1.default.findById(req.user?.id).select('+password +firstLogin');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Check current password
        const isPasswordMatch = await user.comparePassword(currentPassword);
        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
            return;
        }
        // Update password
        user.password = newPassword;
        user.firstLogin = false; // Mark that user has changed password
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
exports.changePassword = changePassword;
// @desc    Reset password (admin only)
// @route   PUT /api/auth/reset-password/:id
// @access  Private/Admin
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword = '123456' } = req.body;
        const user = await user_1.default.findById(id).select('+firstLogin');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        // Reset password
        user.password = newPassword;
        user.firstLogin = true; // Force password change on next login
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message,
        });
    }
};
exports.resetPassword = resetPassword;
