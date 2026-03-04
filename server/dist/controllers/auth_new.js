"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyResetCode = exports.forgotPassword = void 0;
const user_1 = __importDefault(require("../models/user")); // Removed IUser unless used
const email_1 = __importDefault(require("../utils/email"));
// Helper to generate 6-digit code
const generateResetCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { studentNumber } = req.body;
        if (!studentNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide your student number",
            });
        }
        const user = await user_1.default.findOne({ studentNumber: studentNumber.toUpperCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.email) {
            return res.status(400).json({
                success: false,
                message: "No email address associated with your account. Please contact an administrator.",
            });
        }
        // Generate reset code
        const resetCode = generateResetCode();
        // Hash code before saving to database (optional security measure, but good practice)
        // For simplicity, we might store plain code if it's short lived, but let's hash it and compare.
        // However, user needs to input the plain code. If we hash it, we can't show it to them?
        // No, we send the plain code, save the hash. When they submit plain code, we hash and compare.
        // Actually, for 6-digit code usually we store as is or hash. Let's start simple: store as is. 
        // Wait, prompt says "institutional email which is an outlook email".
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save({ validateBeforeSave: false });
        // Create message (You can customize this HTML template)
        const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Here is your verification code:</p>
      <h2 style="font-size: 32px; letter-spacing: 5px; color: #007bff;">${resetCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not make this request, please ignore this email.</p>
    `;
        try {
            await (0, email_1.default)({
                email: user.email,
                subject: 'Password Reset Code - ICpEP SE',
                message: `Your password reset code is: ${resetCode}`,
                html: message
            });
            res.status(200).json({
                success: true,
                message: "Email sent",
                email: user.email // sending back partially masked email could be good for UX
            });
        }
        catch (error) {
            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Email could not be sent",
            });
        }
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.forgotPassword = forgotPassword;
// @desc    Verify Reset Code
// @route   POST /api/auth/verify-code
// @access  Public
const verifyResetCode = async (req, res) => {
    try {
        const { studentNumber, code } = req.body;
        if (!studentNumber || !code) {
            return res.status(400).json({
                success: false,
                message: "Please provide student number and code",
            });
        }
        const user = await user_1.default.findOne({
            studentNumber: studentNumber.toUpperCase(),
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired code",
            });
        }
        res.status(200).json({
            success: true,
            message: "Code verified",
            resetToken: user.resetPasswordCode // Can serve as a temporary token for the next step
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.verifyResetCode = verifyResetCode;
// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { studentNumber, code, password } = req.body;
        if (!studentNumber || !code || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }
        const user = await user_1.default.findOne({
            studentNumber: studentNumber.toUpperCase(),
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired code",
            });
        }
        // Set new password
        user.password = password;
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;
        // If they were locked out due to first login, this effectively handles it if we don't check firstLogin.
        // If we want to mark firstLogin as false after reset? Maybe.
        // user.firstLogin = false; 
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.resetPassword = resetPassword;
