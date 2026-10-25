import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/user';
import { getJwtSecret } from '../config/env';
import { readToken } from '../utils/auth/session-cookie';

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

// Until a new account has set its own password, the only things its token can
// do are set that password, look itself up and sign out.
const FIRST_LOGIN_ALLOWED_PATHS = new Set([
  '/api/auth/first-login-password',
  '/api/auth/change-password',
  '/api/auth/me',
  '/api/auth/logout',
]);

// Verifies the JWT, then checks the account behind it: a deactivated or
// deleted user is rejected, and the role is the current one from the database
// rather than whatever the token was issued with.
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = readToken(req);

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
    const account = await User.findById(decoded.id)
      .select('role isActive tokenVersion +firstLogin')
      .lean();

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

    const path = req.originalUrl.split('?')[0].replace(/\/+$/, '');
    if (account.firstLogin && !FIRST_LOGIN_ALLOWED_PATHS.has(path)) {
      return res.status(403).json({
        success: false,
        message: 'Please set a new password before continuing.',
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

// Like authenticateToken, but never rejects: public routes use it to tell
// staff apart from anonymous visitors (drafts, private fields). An invalid,
// expired or revoked token just leaves req.user unset.
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = readToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    if (!mongoose.isValidObjectId(decoded.id)) return next();
    const account = await User.findById(decoded.id).select('role isActive tokenVersion').lean();
    if (
      account &&
      account.isActive &&
      (decoded.tv ?? 0) === (account.tokenVersion ?? 0)
    ) {
      req.user = { ...decoded, role: account.role };
    }
  } catch {
    // anonymous — fine for a public route
  }
  next();
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