import { describe, it, expect } from "vitest";
import { shortDepartmentName } from "../app/utils/department";

describe("shortDepartmentName", () => {
  it("drops the 'Committee on' prefix and 'Committee' suffix", () => {
    expect(shortDepartmentName("Committee on Internal Affairs")).toBe("Internal Affairs");
    expect(shortDepartmentName("Research and Development Committee")).toBe(
      "Research and Development",
    );
  });

  it("leaves other names alone and tolerates missing input", () => {
    expect(shortDepartmentName("Executive Council")).toBe("Executive Council");
    expect(shortDepartmentName(null)).toBe("");
    expect(shortDepartmentName(undefined)).toBe("");
  });
});
