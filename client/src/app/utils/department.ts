// "Committee on Internal Affairs" -> "Internal Affairs",
// "Research and Development Committee" -> "Research and Development".
export const shortDepartmentName = (name?: string | null): string =>
  (name ?? "")
    .replace(/^Committee on\s+/i, "")
    .replace(/\s+Committee$/i, "")
    .trim();
