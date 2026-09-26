import { rateLimit, studentNumberKey } from "../utils/rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const tooMany = "Too many attempts. Please try again later.";

export const loginLimiterByIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 30,
  message: tooMany,
  skipSuccessful: true,
});

export const loginLimiterByAccount = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 8,
  message: tooMany,
  key: studentNumberKey,
  skipSuccessful: true,
});

export const forgotPasswordLimiterByIp = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many reset requests. Please try again later.",
});

export const forgotPasswordLimiterByAccount = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many reset requests. Please try again later.",
  key: studentNumberKey,
});

export const resetCodeLimiterByIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 30,
  message: tooMany,
});

export const resetCodeLimiterByAccount = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 5,
  message: tooMany,
  key: studentNumberKey,
});
