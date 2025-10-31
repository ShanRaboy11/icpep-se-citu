import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT Token
const generateToken = (userId: string, role: string): string => {
    return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
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
                message: 'Please provide student number and password',
            });
        }

        // Find user and include password and firstLogin fields
        const user = await User.findOne({
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
            firstLogin: user.firstLogin, // Important for password change flow
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

// @desc    Change password on first login
// @route   POST /api/auth/first-login-password
// @access  Private
export const firstLoginPasswordChange = async (req: AuthRequest, res: Response): Promise<void> => {
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
    const user = await User.findById(req.user?.id).select('+password +firstLogin');

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
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

    const user = await User.findById(userId).select('-password');

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
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};