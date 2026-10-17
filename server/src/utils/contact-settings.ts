export const DEFAULT_CONTACT = {
  contactEmail: "icpepse@cit.edu",
  secondaryEmail: "",
  facebookUrl: "https://www.facebook.com/cituicpep",
  tiktokUrl: "https://tiktok.com/@icpep.se.citu",
  instagramUrl: "",
  xUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
};

export type ContactSettings = typeof DEFAULT_CONTACT;
type ContactField = keyof ContactSettings;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMAIL_FIELDS: [ContactField, string][] = [
  ["contactEmail", "official email"],
  ["secondaryEmail", "secondary email"],
];

const URL_FIELDS: [ContactField, string][] = [
  ["facebookUrl", "Facebook"],
  ["tiktokUrl", "TikTok"],
  ["instagramUrl", "Instagram"],
  ["xUrl", "X"],
  ["youtubeUrl", "YouTube"],
  ["linkedinUrl", "LinkedIn"],
];

const parseHttpsUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

export const resolveContact = (stored: Partial<Record<ContactField, string>>): ContactSettings => ({
  contactEmail: stored.contactEmail || DEFAULT_CONTACT.contactEmail,
  secondaryEmail: stored.secondaryEmail || "",
  facebookUrl: stored.facebookUrl || DEFAULT_CONTACT.facebookUrl,
  tiktokUrl: stored.tiktokUrl || DEFAULT_CONTACT.tiktokUrl,
  instagramUrl: stored.instagramUrl || "",
  xUrl: stored.xUrl || "",
  youtubeUrl: stored.youtubeUrl || "",
  linkedinUrl: stored.linkedinUrl || "",
});

export const parseContactUpdate = (
  body: Record<string, unknown>
): { values: Partial<ContactSettings> } | { error: string } => {
  const values: Partial<ContactSettings> = {};

  for (const [field, label] of EMAIL_FIELDS) {
    if (body[field] === undefined) continue;
    const email = String(body[field]).trim().toLowerCase();
    if (email && !EMAIL_PATTERN.test(email)) return { error: `Enter a valid ${label}` };
    values[field] = email;
  }

  for (const [field, label] of URL_FIELDS) {
    if (body[field] === undefined) continue;
    const raw = String(body[field]).trim();
    if (!raw) {
      values[field] = "";
      continue;
    }
    const url = parseHttpsUrl(raw);
    if (!url) return { error: `The ${label} link must be a full https:// link` };
    values[field] = url;
  }

  return { values };
};
