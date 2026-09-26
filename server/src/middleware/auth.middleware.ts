import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import { getJwtSecret } from '../config/env';

export interface JwtPayload {
  id: string;
  role: string;
  userId?: string;
  tv?: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Verifies the JWT, then checks the account behind it: a deactivated or
// deleted user is rejected, and the role is the current one from the database
// rather than whatever the token was issued with.
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }

  if (!mongoose.isValidObjectId(decoded.id)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }

  try {
    const account = await User.findById(decoded.id).select('role isActive tokenVersion').lean();

    if (
      !account ||
      !account.isActive ||
      (decoded.tv ?? 0) !== (account.tokenVersion ?? 0)
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: this session is no longer valid.',
      });
    }

    req.user = { ...decoded, role: account.role };
    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Could not verify your session.',
    });
  }
};

// Alias for authenticateToken
export const protect = authenticateToken;
export const authenticate = authenticateToken;

// Middleware to check if user has required role
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Admin role has access to everything
    if (req.user.role === 'admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

// Alias for authorizeRole
export const authorizeRoles = authorizeRole;

// Like authorizeRole, but also lets a user act on their own record
// (req.params.id matching their own id) regardless of role — for routes
// like PUT /users/:id that are shared between self-service profile edits
// and an officer/admin managing someone else's account.
export const authorizeSelfOrRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (req.user.id === req.params.id) {
      return next();
    }

    return authorizeRole(...roles)(req, res, next);
  };
};