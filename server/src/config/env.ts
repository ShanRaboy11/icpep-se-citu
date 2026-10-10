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
