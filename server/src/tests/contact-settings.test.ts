import { describe, it, expect } from "vitest";
import { DEFAULT_CONTACT, parseContactUpdate, resolveContact } from "../utils/content/contact-settings";

describe("resolveContact", () => {
  it("falls back to the chapter defaults until links have been saved", () => {
    expect(resolveContact({})).toEqual(DEFAULT_CONTACT);
    expect(resolveContact({ contactEmail: "new@cit.edu" })).toEqual({
      ...DEFAULT_CONTACT,
      contactEmail: "new@cit.edu",
    });
  });

  it("keeps an emptied list of links empty", () => {
    expect(resolveContact({ socialLinks: [] }).socialLinks).toEqual([]);
  });
});

describe("parseContactUpdate", () => {
  it("accepts a valid email and tidies it", () => {
    expect(parseContactUpdate({ contactEmail: "  ICPEP@cit.edu " })).toEqual({
      values: { contactEmail: "icpep@cit.edu" },
    });
  });

  it("requires the official email", () => {
    expect(parseContactUpdate({ contactEmail: "" })).toHaveProperty("error");
    expect(parseContactUpdate({ contactEmail: "not-an-email" })).toHaveProperty("error");
  });

  it("allows an empty secondary email but not a bad one", () => {
    expect(parseContactUpdate({ secondaryEmail: "" })).toEqual({ values: { secondaryEmail: "" } });
    expect(parseContactUpdate({ secondaryEmail: "nope" })).toHaveProperty("error");
  });

  it("accepts social links on any supported platform", () => {
    expect(
      parseContactUpdate({
        socialLinks: [
          { platform: "instagram", url: "https://instagram.com/icpep" },
          { platform: "github", url: "https://github.com/icpep" },
        ],
      })
    ).toEqual({
      values: {
        socialLinks: [
          { platform: "instagram", url: "https://instagram.com/icpep" },
          { platform: "github", url: "https://github.com/icpep" },
        ],
      },
    });
  });

  it("drops blank rows and rejects bad links", () => {
    expect(parseContactUpdate({ socialLinks: [{ platform: "x", url: "  " }] })).toEqual({
      values: { socialLinks: [] },
    });
    expect(parseContactUpdate({ socialLinks: [{ platform: "x", url: "http://x.com/a" }] })).toHaveProperty("error");
    expect(parseContactUpdate({ socialLinks: [{ platform: "x", url: "javascript:alert(1)" }] })).toHaveProperty("error");
    expect(parseContactUpdate({ socialLinks: [{ platform: "myspace", url: "https://a.com" }] })).toHaveProperty("error");
  });

  it("limits how many links can be added", () => {
    const many = Array.from({ length: 13 }, () => ({ platform: "x", url: "https://x.com/a" }));
    expect(parseContactUpdate({ socialLinks: many })).toHaveProperty("error");
  });

  it("ignores fields it wasn't given", () => {
    expect(parseContactUpdate({})).toEqual({ values: {} });
  });
});
