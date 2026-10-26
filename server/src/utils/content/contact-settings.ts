export const SOCIAL_PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "threads",
  "linkedin",
  "discord",
  "github",
  "telegram",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface ContactSettings {
  contactEmail: string;
  secondaryEmail: string;
  socialLinks: SocialLink[];
}

export const DEFAULT_CONTACT: ContactSettings = {
  contactEmail: "icpepse@cit.edu",
  secondaryEmail: "",
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/cituicpep" },
    { platform: "tiktok", url: "https://tiktok.com/@icpep.se.citu" },
  ],
};

const MAX_LINKS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseHttpsUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

export const resolveContact = (stored: {
  contactEmail?: string;
  secondaryEmail?: string;
  socialLinks?: { platform: string; url: string }[] | null;
}): ContactSettings => ({
  contactEmail: stored.contactEmail || DEFAULT_CONTACT.contactEmail,
  secondaryEmail: stored.secondaryEmail || "",
  socialLinks: stored.socialLinks
    ? stored.socialLinks.map(({ platform, url }) => ({ platform: platform as SocialPlatform, url }))
    : DEFAULT_CONTACT.socialLinks,
});

export const parseContactUpdate = (
  body: Record<string, unknown>
): { values: Partial<ContactSettings> } | { error: string } => {
  const values: Partial<ContactSettings> = {};

  if (body.contactEmail !== undefined) {
    const email = String(body.contactEmail).trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) return { error: "Enter a valid official email" };
    values.contactEmail = email;
  }

  if (body.secondaryEmail !== undefined) {
    const email = String(body.secondaryEmail).trim().toLowerCase();
    if (email && !EMAIL_PATTERN.test(email)) return { error: "Enter a valid secondary email" };
    values.secondaryEmail = email;
  }

  if (body.socialLinks !== undefined) {
    if (!Array.isArray(body.socialLinks) || body.socialLinks.length > MAX_LINKS) {
      return { error: `Add up to ${MAX_LINKS} social links` };
    }
    const links: SocialLink[] = [];
    for (const entry of body.socialLinks) {
      const platform = String((entry as { platform?: unknown })?.platform ?? "");
      const raw = String((entry as { url?: unknown })?.url ?? "").trim();
      if (!raw) continue;
      if (!(SOCIAL_PLATFORMS as readonly string[]).includes(platform)) {
        return { error: "Pick a platform for every link" };
      }
      const url = parseHttpsUrl(raw);
      if (!url) return { error: "Every social link must be a full https:// link" };
      links.push({ platform: platform as SocialPlatform, url });
    }
    values.socialLinks = links;
  }

  return { values };
};
