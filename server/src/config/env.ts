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
export const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || "7d";

// New accounts start on this password until they change it at first login.
// In production it has to be set deliberately: the built-in fallback is a
// publicly known value.
export const getDefaultPassword = (): string => {
  const configured = process.env.DEFAULT_PASSWORD;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("DEFAULT_PASSWORD must be set in production.");
  }
  return "123456";
};
