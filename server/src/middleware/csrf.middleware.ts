import { NextFunction, Request, Response } from "express";
import { SESSION_COOKIE } from "../utils/auth/session-cookie";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const CSRF_HEADER = "x-requested-with";

// A browser sends the login cookie on cross-site requests too, but a page on
// another site can't add a custom header without passing our CORS check. So a
// cookie-authenticated change must carry the header our own client always sends.
export const requireCsrfHeader = (req: Request, res: Response, next: NextFunction) => {
  if (SAFE_METHODS.has(req.method) || !req.cookies?.[SESSION_COOKIE] || req.headers["authorization"]) {
    return next();
  }
  if (!req.headers[CSRF_HEADER]) {
    res.status(403).json({ success: false, message: "Missing request header." });
    return;
  }
  next();
};
