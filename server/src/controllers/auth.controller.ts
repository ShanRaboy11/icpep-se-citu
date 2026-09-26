import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { validatePassword } from "../utils/password_validator";
import { sendNotification } from "../utils/notification";
import sendEmail from "../utils/email";
import { DEVELOPER_STUDENT_NUMBERS } from "../config/developers";
import { getJwtSecret, getJwtExpiresIn } from "../config/env";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Generate JWT Token
const generateToken = (userId: string, role: string, tokenVersion = 0): string => {
  return jwt.sign({ id: userId, role, tv: tokenVersion }, getJwtSecret(), {
    expiresIn: getJwtExpiresIn() as jwt.SignOptions["expiresIn"],
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { studentNumber, password } = req.body;

    // Validation
    if (!studentNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide student number and password",
      });
    }

    // Find user and include password and firstLogin fields
    const user = await User.findOne({
      studentNumber: studentNumber.toUpperCase(),
    }).select("+password +firstLogin");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Self-healing developer protection: dev team accounts should always
    // be admin and active, even if something elsewhere ever changed that
    // (e.g. an Excel roster sync deactivating them for not being on the
    // student list, or an accidental role change via the Users admin
    // page). Runs after the password check so this can't be triggered by
    // anyone who doesn't already know the account's real password.
    if (DEVELOPER_STUDENT_NUMBERS.includes(user.studentNumber)) {
      let healed = false;
      if (user.role !== "admin") {
        user.role = "admin";
        healed = true;
      }
      if (!user.isActive) {
        user.isActive = true;
        healed = true;
      }
      if (healed) {
        await user.save({ validateBeforeSave: false });
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated. Please contact an administrator.",
      });
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.role, user.tokenVersion);

    // Prepare user data (exclude sensitive fields)
    const userData = {
      _id: user._id,
      studentNumber: user.studentNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      fullName: user.fullName,
      role: user.role,
      position: user.position,
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
      message: "Login successful",
      token,
      user: userData,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Change password on first login
// @route   POST /api/auth/first-login-password
// @access  Private
export const firstLoginPasswordChange = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
      return;
    }

    // Validate password strength
    const validation = validatePassword(newPassword);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: validation.errors,
      });
      return;
    }

    // Get user with password
    const user = await User.findById(req.user?.id).select(
      "+password +firstLogin"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if this is actually a first login
    if (!user.firstLogin) {
      res.status(400).json({
        success: false,
        message: "This endpoint is only for first login password change",
      });
      return;
    }

    // Update password
    user.password = newPassword;
    user.firstLogin = false;
    user.$locals.keepSessions = true;
    await user.save();

    // Send notification
    await sendNotification(
      user._id,
      "[PROFILE] Password Updated",
      "Your password has been successfully updated.",
      "system",
      user._id,
      null
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// @desc    Change password (regular password change - requires current password)
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
      return;
    }

    // Validate password strength
    const validation = validatePassword(newPassword);

    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: validation.errors,
      });
      return;
    }

    // Find user
    const user = await User.findById(req.user?.id).select(
      "+password +firstLogin"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    // Update password
    user.password = newPassword;
    user.firstLogin = false;
    user.$locals.keepSessions = true;
    await user.save();

    // Send notification
    await sendNotification(
      user._id,
      "[PROFILE] Password Updated",
      "Your password has been successfully updated.",
      "system",
      user._id,
      null
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error during password change",
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Helper to generate 6-digit code
const generateResetCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { studentNumber } = req.body;

    if (!studentNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide your student number",
      });
    }

    const user = await User.findOne({ studentNumber: studentNumber.toUpperCase() });

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

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create message
    const message = `You requested a password reset. Here is your verification code: ${resetCode}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Here is your verification code:</p>
      <h2 style="font-size: 32px; letter-spacing: 5px; color: #007bff;">${resetCode}</h2>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not make this request, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Code - ICpEP SE',
        message: message,
        html: html
      });

      res.status(200).json({
        success: true,
        message: "Email sent",
        email: user.email // sending back partially masked email could be good for UX if needed
      });
    } catch {
      user.resetPasswordCode = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }

  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Verify Reset Code
// @route   POST /api/auth/verify-code
// @access  Public
export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { studentNumber, code } = req.body;

    if (!studentNumber || !code) {
      return res.status(400).json({
        success: false,
        message: "Please provide student number and code",
      });
    }

    const user = await User.findOne({
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
    });

  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { studentNumber, code, password } = req.body;

    if (!studentNumber || !code || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findOne({
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
    // user.firstLogin = false; 

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

