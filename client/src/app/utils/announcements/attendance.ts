import { toTitleCase } from "../officers/format-name";
import { departments } from "../officers/officers";
import { committeeRank, councilRank } from "../officers/ranking";
import { shortDepartmentName } from "../department";

const isShouting = (value: string) => value === value.toUpperCase() && /[A-Z]{3,}/.test(value);

export const formatAttendeeName = (name: string) => (isShouting(name) ? toTitleCase(name) : name);

export const formatAttendeePosition = (position?: string) =>
  position && isShouting(position) ? toTitleCase(position) : (position ?? "");

const COUNCIL_GROUP = "Council Officers";
const COMMITTEE_GROUP = "Committee Officers";

const committeeOrder = Object.values(departments)
  .filter((department) => department.title !== "Executive Council")
  .map((department) => shortDepartmentName(department.title).toLowerCase());

export interface AttendanceGroup<T> {
  name: string;
  isCouncil: boolean;
  members: T[];
}

const splitPosition = (position?: string) => {
  const parts = (position ?? "").split(" · ").map((part) => part.trim());
  const committee = parts.find((part) => part.includes(","));
  const council = parts.find((part) => part && !part.includes(","));
  const [title = "", ...department] = (committee ?? "").split(",");
  return { council, title: title.trim(), department: department.join(",").trim() };
};

const groupRank = (name: string) => {
  if (name === COUNCIL_GROUP) return -1;
  const index = committeeOrder.indexOf(shortDepartmentName(name).toLowerCase());
  return index === -1 ? committeeOrder.length : index;
};

const memberRank = (position?: string) => {
  const { council, title } = splitPosition(position);
  return council ? councilRank(council) : committeeRank(title);
};

export function groupAttendance<T extends { name: string; position?: string }>(attendance: T[]): AttendanceGroup<T>[] {
  const groups = new Map<string, T[]>();
  for (const person of attendance) {
    const { council, department } = splitPosition(person.position);
    const key = council ? COUNCIL_GROUP : department || COMMITTEE_GROUP;
    groups.set(key, [...(groups.get(key) ?? []), person]);
  }
  return [...groups]
    .map(([name, members]) => ({
      name,
      isCouncil: name === COUNCIL_GROUP,
      members: [...members].sort(
        (a, b) =>
          memberRank(a.position) - memberRank(b.position) ||
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    }))
    .sort((a, b) => groupRank(a.name) - groupRank(b.name) || a.name.localeCompare(b.name));
}

export function sortAttendance<T extends { name: string; position?: string }>(attendance: T[]): T[] {
  return groupAttendance(attendance).flatMap((group) => group.members);
}

export const groupPosition = (position: string | undefined, isCouncil: boolean) => {
  const { council, title } = splitPosition(position);
  return formatAttendeePosition(isCouncil ? council : title);
};

export const shortPosition = (position?: string) => {
  const { council, title } = splitPosition(position);
  return formatAttendeePosition(council || title);
};
