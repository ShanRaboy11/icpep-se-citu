export const MAX_FAQS = 8;
export const MAX_FAQ_QUESTION = 120;
export const MAX_FAQ_ANSWER = 500;
export const SITE_PHOTO_SLOTS = 3;

export const SITE_PHOTO_FIELDS = {
  join: 'joinPhotos',
  about: 'aboutPhotos',
} as const;

export type SitePhotoSection = keyof typeof SITE_PHOTO_FIELDS;

export const isSitePhotoSection = (value: unknown): value is SitePhotoSection =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(SITE_PHOTO_FIELDS, value);

export const normalizePhotos = (photos?: string[] | null): string[] =>
  Array.from({ length: SITE_PHOTO_SLOTS }, (_, i) => (typeof photos?.[i] === 'string' ? photos[i] : ''));

export const parsePhotoSlot = (value: unknown): number | null => {
  const slot = Number(value);
  return Number.isInteger(slot) && slot >= 0 && slot < SITE_PHOTO_SLOTS ? slot : null;
};

interface FaqInput {
  question?: unknown;
  answer?: unknown;
}

export const parseFaqInput = (
  body: FaqInput,
  { partial }: { partial: boolean }
): { values: { question?: string; answer?: string } } | { error: string } => {
  const values: { question?: string; answer?: string } = {};

  const fields = [
    ['question', 'The question', MAX_FAQ_QUESTION],
    ['answer', 'The answer', MAX_FAQ_ANSWER],
  ] as const;

  for (const [key, label, max] of fields) {
    const raw = body[key];
    if (raw === undefined && partial) continue;
    if (typeof raw !== 'string' || !raw.trim()) return { error: `${label} is required` };
    const text = raw.trim();
    if (text.length > max) return { error: `${label} must be ${max} characters or fewer` };
    values[key] = text;
  }

  return { values };
};
