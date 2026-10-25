export const MAX_ATTENDEES = 300;
const MAX_NAME = 120;
const MAX_POSITION = 120;

export interface AttendanceEntry {
  name: string;
  position: string;
}

export const parseAttendance = (
  value: unknown
): { values: AttendanceEntry[] } | { error: string } => {
  let list: unknown = value;
  if (typeof value === "string") {
    try {
      list = JSON.parse(value);
    } catch {
      return { error: "Attendance must be a list" };
    }
  }
  if (!Array.isArray(list)) return { error: "Attendance must be a list" };
  if (list.length > MAX_ATTENDEES) return { error: `Attendance can list up to ${MAX_ATTENDEES} people` };

  const seen = new Set<string>();
  const values: AttendanceEntry[] = [];
  for (const entry of list) {
    const name = typeof entry?.name === "string" ? entry.name.trim() : "";
    const position = typeof entry?.position === "string" ? entry.position.trim() : "";
    if (!name) return { error: "Every attendee needs a name" };
    if (name.length > MAX_NAME || position.length > MAX_POSITION) {
      return { error: "An attendee's name or position is too long" };
    }

    const key = `${name.toLowerCase()}|${position.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    values.push({ name, position });
  }
  return { values };
};
