// Officer names come from freeform User signup fields (or manually-typed
// archive entries), so casing is inconsistent — some ALL CAPS, some already
// fine. This normalizes to sentence/title case and builds the display
// convention used across the officer pages: "Last Name, First Name M.I."

// Title-cases every word, without disturbing punctuation/spacing — so an
// already comma-formatted "dela cruz, juan m." becomes "Dela Cruz, Juan M."
// rather than being reflowed. Handles accented Latin letters (e.g. ñ).
export const toTitleCase = (str: string): string =>
  (str || "")
    .toLowerCase()
    .replace(/(^|[\s\-.,'])([a-zà-ÿ])/gi, (_match, sep, char) => sep + char.toUpperCase());

export const formatOfficerName = (
  firstName?: string,
  lastName?: string,
  middleName?: string,
): string => {
  const first = toTitleCase(firstName?.trim() || "");
  const last = toTitleCase(lastName?.trim() || "");
  const middleInitial = middleName?.trim()
    ? ` ${middleName.trim().charAt(0).toUpperCase()}.`
    : "";
  return `${last}, ${first}${middleInitial}`;
};
