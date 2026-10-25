const BACKSLASH = String.fromCharCode(92);

// JSON.stringify leaves "<" alone, so content such as "</script>" in a title would end the script tag early.
export const jsonLd = (value: unknown): string => JSON.stringify(value).replace(/</g, `${BACKSLASH}u003c`);
