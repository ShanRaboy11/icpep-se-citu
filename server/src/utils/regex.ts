// Escapes user input so it is matched literally inside a RegExp / $regex.
export const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
