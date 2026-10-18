// "Committee on Internal Affairs" -> "Internal Affairs",
// "Research and Development Committee" -> "Research and Development".
export const shortDepartmentName = (name?: string | null): string =>
  (name ?? "")
    .replace(/^Committee on\s+/i, "")
    .replace(/\s+Committee$/i, "")
    .trim();

const SHORT_POSITIONS: Record<string, string> = {
  "assistant head": "Asst. Head",
  "committee head": "Head",
};

export const shortPositionTitle = (position?: string | null): string => {
  const title = (position ?? "").trim();
  return SHORT_POSITIONS[title.toLowerCase()] ?? title;
};
