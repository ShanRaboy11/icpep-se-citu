import { describe, it, expect, vi, afterEach } from "vitest";
import { getCurrentAcademicYear } from "../app/utils/academic-year";

afterEach(() => vi.useRealTimers());

const at = (iso: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
  return getCurrentAcademicYear();
};

describe("getCurrentAcademicYear", () => {
  it("starts a new academic year in June", () => {
    expect(at("2026-06-15T00:00:00+08:00")).toBe("2026-2027");
    expect(at("2026-12-01T00:00:00+08:00")).toBe("2026-2027");
  });

  it("still counts early-year months toward the previous start", () => {
    expect(at("2026-05-31T12:00:00+08:00")).toBe("2025-2026");
    expect(at("2026-01-10T00:00:00+08:00")).toBe("2025-2026");
  });

  it("reads the month in Philippine time, not the machine's", () => {
    // 2026-05-31 17:00 UTC is already June 1 in Manila
    expect(at("2026-05-31T17:00:00Z")).toBe("2026-2027");
  });
});
