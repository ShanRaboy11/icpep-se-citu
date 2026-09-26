// Mirrors client/src/app/officers/utils/format-name.ts — used when
// auto-archiving a live officer assignment so the OfficerTerm record is
// already stored in the correct "Last Name, First Name M.I." display
// convention, in proper sentence case, regardless of how the name was
// originally cased at signup.
export const toTitleCase = (str: string): string =>
  (str || "")
    .toLowerCase()
    .replace(/(^|[\s\-.,'])([a-zà-ÿ])/gi, (_match, sep, char) => sep + char.toUpperCase());

export const formatOfficerName = (
  firstName?: string,
  lastName?: string,
  middleName?: string
): string => {
  const first = toTitleCase(firstName?.trim() || '');
  const last = toTitleCase(lastName?.trim() || '');
  const middleInitial = middleName?.trim()
    ? ` ${middleName.trim().charAt(0).toUpperCase()}.`
    : '';
  return `${last}, ${first}${middleInitial}`;
};
