import { describe, it, expect } from "vitest";
import { hashResetCode, resetCodeMatches } from "../utils/auth/reset-code";

describe("reset codes", () => {
  it("never stores the code itself", () => {
    expect(hashResetCode("123456")).not.toContain("123456");
  });

  it("matches only the right code", () => {
    const stored = hashResetCode("123456");
    expect(resetCodeMatches(stored, "123456")).toBe(true);
    expect(resetCodeMatches(stored, "123457")).toBe(false);
    expect(resetCodeMatches(undefined, "123456")).toBe(false);
  });
});
