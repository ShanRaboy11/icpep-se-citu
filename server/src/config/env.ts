export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 16 characters.",
    );
  }
  return secret;
};

// How long a login stays valid. Shorter is safer; longer means fewer re-logins.
export const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || "1d";

export const getSchoolEmailDomain = (): string =>
  (process.env.SCHOOL_EMAIL_DOMAIN || "cit.edu").trim().replace(/^@/, "");

export const getFirstLoginCodeDays = (): number => {
  const days = parseInt(process.env.FIRST_LOGIN_CODE_DAYS ?? "", 10);
  return Number.isFinite(days) && days > 0 ? days : 7;
};

const parseDurationMs = (value: string): number | null => {
  const match = value.trim().match(/^(\d+)\s*(s|m|h|d)?$/i);
  if (!match) return null;
  const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[(match[2] ?? "s").toLowerCase() as "s" | "m" | "h" | "d"];
  return Number(match[1]) * unit;
};

export const getJwtExpiresMs = (): number => parseDurationMs(getJwtExpiresIn()) ?? 86_400_000;

// "lax" suits a client and server on the same site. Use "none" (needs HTTPS) when
// the client is on a different domain than the server.
export const getCookieSameSite = (): "lax" | "strict" | "none" => {
  const value = (process.env.COOKIE_SAMESITE || "lax").toLowerCase();
  return value === "strict" || value === "none" ? value : "lax";
};

export const getCookieSecure = (): boolean => {
  if (getCookieSameSite() === "none") return true;
  const value = process.env.COOKIE_SECURE;
  return value === undefined ? process.env.NODE_ENV === "production" : value === "true";
};

export const getCookieDomain = (): string | undefined => process.env.COOKIE_DOMAIN?.trim() || undefined;
