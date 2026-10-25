import { describe, it, expect } from "vitest";
import {
  MAX_FAQ_ANSWER,
  MAX_FAQ_QUESTION,
  isSitePhotoSection,
  normalizePhotos,
  parseFaqInput,
  parsePhotoSlot,
} from "../utils/content/site-content";

describe("parseFaqInput", () => {
  it("trims a valid question and answer", () => {
    expect(parseFaqInput({ question: "  How? ", answer: " Like this. " }, { partial: false })).toEqual({
      values: { question: "How?", answer: "Like this." },
    });
  });

  it("requires both fields when creating", () => {
    expect(parseFaqInput({ question: "How?" }, { partial: false })).toEqual({ error: "The answer is required" });
    expect(parseFaqInput({ question: "  ", answer: "x" }, { partial: false })).toEqual({ error: "The question is required" });
  });

  it("lets an update leave fields out", () => {
    expect(parseFaqInput({ answer: "New" }, { partial: true })).toEqual({ values: { answer: "New" } });
    expect(parseFaqInput({}, { partial: true })).toEqual({ values: {} });
  });

  it("rejects text over the length limits", () => {
    expect("error" in parseFaqInput({ question: "q".repeat(MAX_FAQ_QUESTION + 1), answer: "a" }, { partial: false })).toBe(true);
    expect("error" in parseFaqInput({ question: "q", answer: "a".repeat(MAX_FAQ_ANSWER + 1) }, { partial: false })).toBe(true);
    expect("error" in parseFaqInput({ question: "q".repeat(MAX_FAQ_QUESTION), answer: "a".repeat(MAX_FAQ_ANSWER) }, { partial: false })).toBe(false);
  });

  it("rejects non-string values", () => {
    expect("error" in parseFaqInput({ question: 5, answer: "a" }, { partial: false })).toBe(true);
  });
});

describe("isSitePhotoSection", () => {
  it("accepts only the known sections", () => {
    expect(isSitePhotoSection("join")).toBe(true);
    expect(isSitePhotoSection("about")).toBe(true);
    expect(isSitePhotoSection("constructor")).toBe(false);
    expect(isSitePhotoSection(undefined)).toBe(false);
  });
});

describe("photo slots", () => {
  it("always gives one entry per slot, empty meaning the default", () => {
    expect(normalizePhotos(undefined)).toEqual(["", "", ""]);
    expect(normalizePhotos(["a"])).toEqual(["a", "", ""]);
    expect(normalizePhotos(["a", "b", "c", "d"])).toEqual(["a", "b", "c"]);
  });

  it("accepts only slots 0 to 2", () => {
    expect(parsePhotoSlot("0")).toBe(0);
    expect(parsePhotoSlot("2")).toBe(2);
    expect(parsePhotoSlot("3")).toBeNull();
    expect(parsePhotoSlot("-1")).toBeNull();
    expect(parsePhotoSlot("1.5")).toBeNull();
    expect(parsePhotoSlot("abc")).toBeNull();
  });
});
