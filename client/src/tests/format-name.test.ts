import { describe, it, expect } from "vitest";
import { toTitleCase, formatOfficerName } from "../app/officers/utils/format-name";

describe("toTitleCase", () => {
  it("fixes all-caps and all-lowercase names", () => {
    expect(toTitleCase("JUAN DELA CRUZ")).toBe("Juan Dela Cruz");
    expect(toTitleCase("maria clara")).toBe("Maria Clara");
  });

  it("capitalizes after hyphens, apostrophes, periods and commas", () => {
    expect(toTitleCase("o'brien-smith")).toBe("O'Brien-Smith");
    expect(toTitleCase("dela cruz, juan m.")).toBe("Dela Cruz, Juan M.");
  });

  it("handles accented letters and empty input", () => {
    expect(toTitleCase("PEÑA")).toBe("Peña");
    expect(toTitleCase("")).toBe("");
    expect(toTitleCase(undefined as unknown as string)).toBe("");
  });
});

describe("formatOfficerName", () => {
  it("builds 'Last, First M.' from messy input", () => {
    expect(formatOfficerName("JUAN", "DELA CRUZ", "Miguel")).toBe("Dela Cruz, Juan M.");
  });

  it("omits the middle initial when there is none", () => {
    expect(formatOfficerName("juan", "cruz")).toBe("Cruz, Juan");
    expect(formatOfficerName("juan", "cruz", "  ")).toBe("Cruz, Juan");
  });
});
