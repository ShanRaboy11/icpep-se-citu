import { describe, it, expect } from "vitest";
import { validatePassword } from "../app/login/page";

describe("Password Validator", () => {
  it("validates a strong password meeting all criteria", () => {
    const result = validatePassword("Admin@12345");
    expect(result.isValid).toBe(true);
    expect(result.checks.length).toBe(true);
    expect(result.checks.uppercase).toBe(true);
    expect(result.checks.lowercase).toBe(true);
    expect(result.checks.number).toBe(true);
    expect(result.checks.special).toBe(true);
  });

  it("fails if password is too short (<8 chars)", () => {
    const result = validatePassword("Aa1@");
    expect(result.isValid).toBe(false);
    expect(result.checks.length).toBe(false);
  });

  it("fails if missing uppercase", () => {
    const result = validatePassword("password@123");
    expect(result.isValid).toBe(false);
    expect(result.checks.uppercase).toBe(false);
  });

  it("fails if missing lowercase", () => {
    const result = validatePassword("PASSWORD@123");
    expect(result.isValid).toBe(false);
    expect(result.checks.lowercase).toBe(false);
  });

  it("fails if missing number", () => {
    const result = validatePassword("Password@Special");
    expect(result.isValid).toBe(false);
    expect(result.checks.number).toBe(false);
  });

  it("fails if missing special character", () => {
    const result = validatePassword("Password12345");
    expect(result.isValid).toBe(false);
    expect(result.checks.special).toBe(false);
  });
});
