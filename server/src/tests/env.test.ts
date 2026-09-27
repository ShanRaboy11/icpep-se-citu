import { describe, it, expect, afterEach } from "vitest";
import { getJwtSecret, getDefaultPassword, getJwtExpiresIn } from "../config/env";

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

describe("getDefaultPassword", () => {
  it("uses DEFAULT_PASSWORD when set", () => {
    process.env.DEFAULT_PASSWORD = "Chapter#2026";
    expect(getDefaultPassword()).toBe("Chapter#2026");
  });

  it("falls back when unset outside production", () => {
    delete process.env.DEFAULT_PASSWORD;
    process.env.NODE_ENV = "development";
    expect(getDefaultPassword()).toBe("123456");
  });

  it("refuses the built-in fallback in production", () => {
    delete process.env.DEFAULT_PASSWORD;
    process.env.NODE_ENV = "production";
    expect(() => getDefaultPassword()).toThrow(/DEFAULT_PASSWORD/);
  });

  it("accepts a configured value in production", () => {
    process.env.DEFAULT_PASSWORD = "Chapter#2026";
    process.env.NODE_ENV = "production";
    expect(getDefaultPassword()).toBe("Chapter#2026");
  });
});

describe("getJwtExpiresIn", () => {
  it("defaults to 7 days and can be overridden", () => {
    delete process.env.JWT_EXPIRES_IN;
    expect(getJwtExpiresIn()).toBe("7d");
    process.env.JWT_EXPIRES_IN = "12h";
    expect(getJwtExpiresIn()).toBe("12h");
  });
});
