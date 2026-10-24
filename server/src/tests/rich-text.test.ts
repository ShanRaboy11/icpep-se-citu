import { describe, it, expect } from "vitest";
import { sanitizeRichText, isBlankRichText } from "../utils/content/rich-text";

describe("sanitizeRichText", () => {
  it("keeps basic formatting", () => {
    const html = "<p><strong>Bold</strong> <em>italic</em> <u>under</u></p><ul><li>one</li></ul><ol><li>two</li></ol>";
    expect(sanitizeRichText(html)).toBe(html);
  });

  it("drops scripts, event handlers and styles", () => {
    const out = sanitizeRichText('<p onclick="x()" style="color:red">hi</p><script>alert(1)</script><img src=x onerror=alert(1)>');
    expect(out).toBe("<p>hi</p>");
  });

  it("only allows http, https and mailto links and hardens them", () => {
    const out = sanitizeRichText('<a href="javascript:alert(1)">bad</a><a href="https://example.com">ok</a>');
    expect(out).not.toContain("javascript:");
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it("leaves legacy plain text alone", () => {
    expect(sanitizeRichText("Q&A at 5pm\nBring ID")).toBe("Q&A at 5pm\nBring ID");
  });
});

describe("isBlankRichText", () => {
  it("treats empty markup as blank", () => {
    expect(isBlankRichText("<p></p>")).toBe(true);
    expect(isBlankRichText("<p>&nbsp;</p><p><br></p>")).toBe(true);
  });

  it("treats real text as not blank", () => {
    expect(isBlankRichText("<p>hello</p>")).toBe(false);
    expect(isBlankRichText("plain text")).toBe(false);
  });
});
