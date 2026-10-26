export type Gender = "male" | "female";

export const parseGender = (value: unknown): Gender | null =>
  value === "male" || value === "female" ? value : null;
