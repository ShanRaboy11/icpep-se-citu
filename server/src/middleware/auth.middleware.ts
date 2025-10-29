import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { AuthRequest } from '../controllers/user.controller';

interface JwtPayload {
  id: string;
  role: string;
}

// Protect routes - verify JWT token
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Or check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.',
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    // Check if user still exists
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Your account has been deactivated',
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
      error: error.message,
    });
  }
};

// Restrict to specific roles
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
      return;
    }
    next();
  };
};

// Optional: Check if it's the user's first login
export const checkFirstLogin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await User.findById(req.user.id).select('+firstLogin');

    if (user?.firstLogin) {
      res.status(403).json({
        success: false,
        message: 'Please change your password before proceeding',
        firstLogin: true,
      });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking first login status',
      error: error.message,
    });
  }
};