import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import SiteSettings from '../models/siteSettings';
import User from '../models/user';
import { getJwtSecret } from '../config/env';

// Routes that stay reachable even while the site is suspended: auth (so an
// admin can still log in) and the settings endpoint itself (so the toggle
// can be read and switched back off).
const EXEMPT_PREFIXES = ['/api/auth', '/api/site'];

// While maintenance mode is on, every other API route is suspended for
// everyone except an active admin. This is the real enforcement — the
// frontend's maintenance screen is only a convenience, since a client-side
// check can always be bypassed by calling the API directly.
export const enforceMaintenanceMode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.path.startsWith('/api')) return next();
  if (EXEMPT_PREFIXES.some((prefix) => req.path.startsWith(prefix))) return next();

  try {
    const settings = await SiteSettings.findOne().lean();
    if (!settings?.maintenanceMode) return next();

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = jwt.verify(token, getJwtSecret()) as { id: string };
        const account = await User.findById(decoded.id).select('role isActive').lean();
        if (account?.isActive && account.role === 'admin') {
          return next();
        }
      } catch {
        // Invalid/expired token — falls through to the 503 below.
      }
    }

    res.status(503).json({
      success: false,
      maintenanceMode: true,
      message: settings.maintenanceMessage,
    });
  } catch {
    // Don't let a settings-lookup hiccup take the whole site down; fail
    // open rather than closed.
    next();
  }
};
