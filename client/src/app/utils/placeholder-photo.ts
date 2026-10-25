const WOMAN = "/placeholders/woman.avif";
const MAN = "/placeholders/man.avif";
const NEUTRAL = "/placeholders/placeholder-avatar.svg";

export const placeholderPhoto = (_seed: string, gender?: string | null): string => {
  if (gender === "male") return MAN;
  if (gender === "female") return WOMAN;
  return NEUTRAL;
};
