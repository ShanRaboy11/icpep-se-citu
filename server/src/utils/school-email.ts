import { getSchoolEmailDomain } from "../config/env";

const slug = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const buildSchoolEmail = (firstName: string, lastName: string): string | null => {
  const first = slug(firstName ?? "");
  const last = slug(lastName ?? "");
  return first && last ? `${first}.${last}@${getSchoolEmailDomain()}` : null;
};
