import { describe, it, expect } from "vitest";
import { DEFAULT_CONTACT, parseContactUpdate, resolveContact } from "../utils/contact-settings";

describe("resolveContact", () => {
  it("falls back to the chapter defaults for anything not set", () => {
    expect(resolveContact({})).toEqual(DEFAULT_CONTACT);
    expect(resolveContact({ contactEmail: "new@cit.edu" })).toEqual({
      ...DEFAULT_CONTACT,
      contactEmail: "new@cit.edu",
    });
  });
});

describe("parseContactUpdate", () => {
  it("accepts a valid email and https links, and tidies them", () => {
    expect(
      parseContactUpdate({
        contactEmail: "  ICPEP@cit.edu ",
        facebookUrl: "https://facebook.com/icpep",
      })
    ).toEqual({ values: { contactEmail: "icpep@cit.edu", facebookUrl: "https://facebook.com/icpep" } });
  });

  it("rejects a bad email", () => {
    expect(parseContactUpdate({ contactEmail: "not-an-email" })).toHaveProperty("error");
    expect(parseContactUpdate({ secondaryEmail: "nope" })).toHaveProperty("error");
  });

  it("accepts a secondary email and the extra social links", () => {
    expect(
      parseContactUpdate({
        secondaryEmail: "backup@cit.edu",
        instagramUrl: "https://instagram.com/icpep",
        xUrl: "https://x.com/icpep",
        youtubeUrl: "https://youtube.com/@icpep",
        linkedinUrl: "https://linkedin.com/company/icpep",
      })
    ).toEqual({
      values: {
        secondaryEmail: "backup@cit.edu",
        instagramUrl: "https://instagram.com/icpep",
        xUrl: "https://x.com/icpep",
        youtubeUrl: "https://youtube.com/@icpep",
        linkedinUrl: "https://linkedin.com/company/icpep",
      },
    });
  });

  it("keeps the optional links empty until they are set", () => {
    const resolved = resolveContact({});
    expect(resolved.secondaryEmail).toBe("");
    expect(resolved.instagramUrl).toBe("");
  });

  it("rejects links that aren't https", () => {
    expect(parseContactUpdate({ tiktokUrl: "http://tiktok.com/@x" })).toHaveProperty("error");
    expect(parseContactUpdate({ facebookUrl: "javascript:alert(1)" })).toHaveProperty("error");
  });

  it("treats an empty value as a reset to the default", () => {
    expect(parseContactUpdate({ contactEmail: "", tiktokUrl: "" })).toEqual({
      values: { contactEmail: "", tiktokUrl: "" },
    });
  });

  it("ignores fields it wasn't given", () => {
    expect(parseContactUpdate({})).toEqual({ values: {} });
  });
});
