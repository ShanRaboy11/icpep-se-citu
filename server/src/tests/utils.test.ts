import { describe, it, expect } from "vitest";
import { canManagePost } from "../utils/ownership";
import { escapeHtml } from "../utils/html";
import { escapeRegExp } from "../utils/regex";

describe("canManagePost", () => {
  it("lets admins and council officers manage any post", () => {
    expect(canManagePost({ id: "a", role: "admin" }, "b")).toBe(true);
    expect(canManagePost({ id: "a", role: "council-officer" }, "b")).toBe(true);
  });

  it("lets a committee officer manage only their own", () => {
    expect(canManagePost({ id: "a", role: "committee-officer" }, "a")).toBe(true);
    expect(canManagePost({ id: "a", role: "committee-officer" }, "b")).toBe(false);
  });

  it("compares object ids by their string form", () => {
    expect(
      canManagePost({ id: "abc", role: "committee-officer" }, { toString: () => "abc" }),
    ).toBe(true);
  });

  it("denies when there is no user", () => {
    expect(canManagePost(undefined, "a")).toBe(false);
  });
});

describe("escapeHtml", () => {
  it("neutralizes markup and quotes", () => {
    expect(escapeHtml(`<img src=x onerror="a('b')">&`)).toBe(
      "&lt;img src=x onerror=&quot;a(&#39;b&#39;)&quot;&gt;&amp;",
    );
  });
});

describe("escapeRegExp", () => {
  it("matches user input literally", () => {
    const input = "a.b*c(d)[e]+?^$|\\";
    expect(new RegExp(`^${escapeRegExp(input)}$`).test(input)).toBe(true);
    expect(new RegExp(escapeRegExp(".*")).test("anything")).toBe(false);
  });
});
