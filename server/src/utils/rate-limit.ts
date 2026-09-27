import { Request, Response, NextFunction } from "express";

// A small in-memory limiter, enough to stop one caller from flooding an open
// endpoint or guessing credentials. It resets when the server restarts.
// `key` picks what is counted (default: the client IP); `skipSuccessful`
// stops requests that ended in a 2xx/3xx from counting against the caller.
export const rateLimit = (options: {
  windowMs: number;
  max: number;
  message: string;
  key?: (req: Request) => string | undefined;
  skipSuccessful?: boolean;
}) => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = options.key?.(req) || req.ip || "unknown";

    for (const [id, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(id);
    }

    const entry = hits.get(key) ?? { count: 0, resetAt: now + options.windowMs };
    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > options.max) {
      res.status(429).json({ success: false, message: options.message });
      return;
    }

    if (options.skipSuccessful) {
      res.on("finish", () => {
        if (res.statusCode < 400 && entry.count > 0) entry.count -= 1;
      });
    }
    next();
  };
};

export const studentNumberKey = (req: Request): string | undefined => {
  const value = req.body?.studentNumber;
  return typeof value === "string" && value.trim()
    ? `sn:${value.trim().toUpperCase()}`
    : undefined;
};
