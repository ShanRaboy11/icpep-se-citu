import crypto from "crypto";
import { getJwtSecret } from "../../config/env";

export const MAX_RESET_ATTEMPTS = 5;

// Reset codes are stored hashed, so a database leak doesn't hand out working codes.
export const hashResetCode = (code: string): string =>
  crypto.createHmac("sha256", getJwtSecret()).update(String(code)).digest("hex");

export const resetCodeMatches = (stored: string | undefined, candidate: string): boolean => {
  if (!stored) return false;
  const a = Buffer.from(stored, "hex");
  const b = Buffer.from(hashResetCode(candidate), "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
