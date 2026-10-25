import { CookieOptions, Request, Response } from "express";
import { getCookieDomain, getCookieSameSite, getCookieSecure, getJwtExpiresMs } from "../../config/env";

export const SESSION_COOKIE = "authToken";

const baseOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: getCookieSecure(),
  sameSite: getCookieSameSite(),
  domain: getCookieDomain(),
  path: "/",
});

export const setSessionCookie = (res: Response, token: string) => {
  res.cookie(SESSION_COOKIE, token, { ...baseOptions(), maxAge: getJwtExpiresMs() });
};

export const clearSessionCookie = (res: Response) => {
  res.clearCookie(SESSION_COOKIE, baseOptions());
};

export const readToken = (req: Request): string | undefined => {
  const cookie = req.cookies?.[SESSION_COOKIE];
  if (typeof cookie === "string" && cookie) return cookie;
  const header = req.headers["authorization"];
  return header ? header.split(" ")[1] : undefined;
};
