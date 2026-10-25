import { describe, it, expect, afterEach } from "vitest";
import { getJwtSecret, getJwtExpiresIn, getSchoolEmailDomain, getFirstLoginCodeDays } from "../config/env";

const original = { ...process.env };
afterEach(() => {
  process.env = { ...original };
});

describe("getJwtSecret", () => {
  it("returns the configured secret", () => {
    process.env.JWT_SECRET = "a-secret-that-is-long-enough";
    expect(getJwtSecret()).toBe("a-secret-that-is-long-enough");
  });

  it("refuses to run without a secret", () => {
    delete process.env.JWT_SECRET;
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it("refuses a short secret", () => {
    process.env.JWT_SECRET = "short";
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });
});

describe("first-login settings", () => {
  it("defaults the school email domain and lets it be set", () => {
    delete process.env.SCHOOL_EMAIL_DOMAIN;
    expect(getSchoolEmailDomain()).toBe("cit.edu");
    process.env.SCHOOL_EMAIL_DOMAIN = "@school.example";
    expect(getSchoolEmailDomain()).toBe("school.example");
  });

  it("defaults the code lifetime to 7 days and ignores nonsense", () => {
    delete process.env.FIRST_LOGIN_CODE_DAYS;
    expect(getFirstLoginCodeDays()).toBe(7);
    process.env.FIRST_LOGIN_CODE_DAYS = "3";
    expect(getFirstLoginCodeDays()).toBe(3);
    process.env.FIRST_LOGIN_CODE_DAYS = "abc";
    expect(getFirstLoginCodeDays()).toBe(7);
  });
});

describe("getJwtExpiresIn", () => {
  it("defaults to 1 day and can be overridden", () => {
    delete process.env.JWT_EXPIRES_IN;
    expect(getJwtExpiresIn()).toBe("1d");
    process.env.JWT_EXPIRES_IN = "12h";
    expect(getJwtExpiresIn()).toBe("12h");
  });
});
