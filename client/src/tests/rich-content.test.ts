import { describe, it, expect } from "vitest";
import {
  isHtml,
  plainLength,
  plainTextToHtml,
  sanitizeRichText,
} from "../app/components/content/rich-content";

describe("rich content helpers", () => {
  it("tells markup from legacy plain text", () => {
    expect(isHtml("<p>hi</p>")).toBe(true);
    expect(isHtml("just text\nwith a newline")).toBe(false);
  });

  it("turns legacy plain text into escaped paragraphs", () => {
    expect(plainTextToHtml("a & b\nline two\n\nnext")).toBe(
      "<p>a &amp; b<br>line two</p><p>next</p>",
    );
  });

  it("counts characters without the markup", () => {
    expect(plainLength("<p><strong>abc</strong></p>")).toBe(3);
    expect(plainLength("abcd")).toBe(4);
  });

  it("strips scripts and handlers but keeps formatting", () => {
    const out = sanitizeRichText(
      '<p onclick="x()"><strong>ok</strong></p><script>alert(1)</script>',
    );
    expect(out).toBe("<p><strong>ok</strong></p>");
  });
});
