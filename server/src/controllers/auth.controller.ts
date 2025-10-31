import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { AuthRequest } from './user.controller'; 



const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
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
  const token = jwt.sign(
    { id: user._id, role: user.role, membershipStatus: user.membershipStatus }, // Include relevant user data
    jwtSecret, // Use the non-null secret
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days for the cookie
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'lax' as const,
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
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentNumber, password } = req.body;

    // Validate input
    if (!studentNumber || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide student number and password',
      });
      return;
    }

    // Find user by student number and include password
    const user = await User.findOne({ studentNumber: studentNumber.toUpperCase() })
      .select('+password +firstLogin');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.',
      });
      return;
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id)
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message,
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const user = await User.findById(req.user?.id).select('+password +firstLogin');

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message,
    });
  }
};

// @desc    Reset password (admin only)
// @route   PUT /api/auth/reset-password/:id
// @access  Private/Admin
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword = '123456' } = req.body;

    const user = await User.findById(id).select('+firstLogin');

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message,
    });
  }
};