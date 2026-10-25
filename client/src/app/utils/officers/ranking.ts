const COMMITTEE_ORDER = ["committee head", "head", "assistant head", "secretary", "assistant secretary", "member"];

export const committeeRank = (position: string) => {
  const title = position.trim().toLowerCase().replace(/^asst\.?\s/, "assistant ");
  const index = COMMITTEE_ORDER.indexOf(title);
  return index === -1 ? COMMITTEE_ORDER.length : index;
};

export const councilRank = (position: string) => {
  const text = position.trim().toLowerCase();
  if (/^president\b/.test(text)) return 0;
  if (/\b(vice|vp)\b/.test(text)) {
    if (text.includes("internal")) return 1;
    if (text.includes("external")) return 2;
    return 1.5;
  }
  if (text.includes("assistant") || text.includes("asst")) return 3.5;
  if (text.includes("secretary")) return 3;
  if (text.includes("treasurer")) return 4;
  if (text.includes("auditor")) return 5;
  if (text.includes("public information") || text === "pio") return 6;
  if (text.includes("public relations") || text === "pro") return 7;
  if (text.includes("ssg")) return 8;
  const year = text.match(/^(\d)/);
  if (year) return 9 + Number(year[1]);
  if (text.includes("batch")) return 9;
  return 20;
};
