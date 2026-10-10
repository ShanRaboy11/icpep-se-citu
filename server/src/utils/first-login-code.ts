import crypto from "crypto";
import { getFirstLoginCodeDays } from "../config/env";

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

export const generateFirstLoginCode = (): string => {
  let raw = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    raw += ALPHABET[crypto.randomInt(ALPHABET.length)];
  }
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
};

export const normalizeFirstLoginCode = (input: string): string | null => {
  const raw = String(input).toUpperCase().replace(/[\s-]/g, "");
  return raw.length === CODE_LENGTH && [...raw].every((c) => ALPHABET.includes(c))
    ? `${raw.slice(0, 4)}-${raw.slice(4)}`
    : null;
};

export const issueFirstLoginCode = () => ({
  code: generateFirstLoginCode(),
  expires: new Date(Date.now() + getFirstLoginCodeDays() * 24 * 60 * 60 * 1000),
});
