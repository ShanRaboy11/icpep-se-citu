// Philippine school year typically starts mid-year (~June/July), so anything
// from June onward counts as the start of that year's academic year. The
// month is read in Philippine time so the server and browsers always agree.
// Mirrors server/src/utils/academic-year.ts.
export const getCurrentAcademicYear = (): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return month >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};
