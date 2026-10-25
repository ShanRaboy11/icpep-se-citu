export const timeHours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
export const timeMinutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
export const timePeriods = ["AM", "PM"];

export function parseTimeToPicker(timeStr: string): { hour: string; minute: string; period: string } {
  const fallback = { hour: "08", minute: "00", period: "AM" };
  if (!timeStr) return fallback;
  const ampm = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    return { hour: ampm[1].padStart(2, "0"), minute: ampm[2], period: ampm[3].toUpperCase() };
  }
  const h24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (h24) {
    const h = parseInt(h24[1]);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return { hour: hour12.toString().padStart(2, "0"), minute: h24[2], period };
  }
  return fallback;
}
