const WOMAN = "/placeholders/woman.avif";
const MAN = "/placeholders/man.avif";

export const placeholderPhoto = (seed: string, gender?: string | null): string => {
  if (gender === "male") return MAN;
  if (gender === "female") return WOMAN;
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 2 === 0 ? WOMAN : MAN;
};
