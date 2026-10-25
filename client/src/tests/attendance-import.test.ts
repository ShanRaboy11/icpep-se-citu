import { describe, it, expect } from "vitest";
import { matchRows } from "../app/utils/announcements/attendance-import";

const people = [
  { firstName: "Kenji Kurei", lastName: "Boro" },
  { firstName: "Reynaldo Nathaniel", lastName: "Cardoso" },
  { firstName: "Ej Kate", lastName: "Alcover" },
];

describe("matchRows", () => {
  it("matches names written as 'Last, First' or 'First Last', ignoring case and extra columns", () => {
    const rows = ["BORO, KENJI KUREI VP External", "Reynaldo Cardoso 2nd Year", "Someone Else"];
    const { people: matched, unmatched } = matchRows(rows, people);
    expect(matched.map((p) => p.lastName)).toEqual(["Boro", "Cardoso"]);
    expect(unmatched).toBe(1);
  });

  it("ignores a header row and repeated names", () => {
    const { people: matched, unmatched } = matchRows(["Name Position", "Alcover, Ej Kate", "ej kate alcover"], people);
    expect(matched).toHaveLength(1);
    expect(unmatched).toBe(0);
  });
});
