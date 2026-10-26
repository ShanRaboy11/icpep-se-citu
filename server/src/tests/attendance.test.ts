import { describe, it, expect } from "vitest";
import { MAX_ATTENDEES, parseAttendance } from "../utils/content/attendance";

describe("parseAttendance", () => {
  it("accepts a list or its JSON string and trims entries", () => {
    const entries = [{ name: " Fuentes, Kent Mark L. ", position: " President " }];
    const expected = { values: [{ name: "Fuentes, Kent Mark L.", position: "President" }] };
    expect(parseAttendance(entries)).toEqual(expected);
    expect(parseAttendance(JSON.stringify(entries))).toEqual(expected);
  });

  it("drops duplicate entries", () => {
    const entry = { name: "Tausa, Farah Mae D.", position: "VP Internal" };
    expect(parseAttendance([entry, { ...entry }])).toEqual({ values: [entry] });
  });

  it("rejects anything that is not a list of named people", () => {
    expect("error" in parseAttendance("not json")).toBe(true);
    expect("error" in parseAttendance({ name: "x" })).toBe(true);
    expect("error" in parseAttendance([{ name: "  ", position: "x" }])).toBe(true);
    expect(
      "error" in parseAttendance(Array.from({ length: MAX_ATTENDEES + 1 }, (_, i) => ({ name: `p${i}`, position: "" }))),
    ).toBe(true);
  });
});
