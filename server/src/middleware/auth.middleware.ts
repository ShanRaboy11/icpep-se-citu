import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface JwtPayload {
  id: string;
  role: string;
  userId?: string; // ✅ Add this to match controller
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Middleware to verify JWT token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔐 Token received:', token ? 'Yes' : 'No'); // ✅ DEBUG LOG

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    console.log('👤 Decoded token:', decoded); // ✅ DEBUG LOG
    console.log('🆔 User ID from token:', decoded.id); // ✅ DEBUG LOG
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error); // ✅ DEBUG LOG
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// Alias for authenticateToken (to match protect naming convention)
export const protect = authenticateToken;

// Middleware to check if user has required role
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
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