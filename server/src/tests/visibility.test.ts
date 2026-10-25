import { describe, it, expect } from "vitest";
import { listVisibility, canViewItem } from "../utils/auth/visibility";

const COUNCIL = { id: "64b7f0c2a3b4c5d6e7f80001", role: "council-officer" };
const COMMITTEE = { id: "64b7f0c2a3b4c5d6e7f80002", role: "committee-officer" };
const STUDENT = { id: "64b7f0c2a3b4c5d6e7f80003", role: "student" };
const ADMIN = { id: "64b7f0c2a3b4c5d6e7f80004", role: "admin" };

describe("listVisibility", () => {
  it("anonymous visitors only get published items, whatever they ask for", () => {
    expect(listVisibility(undefined, "false")).toEqual({ isPublished: true });
    expect(listVisibility(undefined)).toEqual({ isPublished: true });
  });

  it("students only get published items", () => {
    expect(listVisibility(STUDENT)).toEqual({
      $or: [{ isPublished: true }, { author: STUDENT.id }],
    });
  });

  it("committee officers get published items plus their own drafts", () => {
    expect(listVisibility(COMMITTEE)).toEqual({
      $or: [{ isPublished: true }, { author: COMMITTEE.id }],
    });
  });

  it("council officers and admins see everything by default", () => {
    expect(listVisibility(COUNCIL)).toEqual({});
    expect(listVisibility(ADMIN)).toEqual({});
  });

  it("council officers and admins can filter by isPublished when they ask", () => {
    expect(listVisibility(COUNCIL, "false")).toEqual({ isPublished: false });
    expect(listVisibility(ADMIN, "true")).toEqual({ isPublished: true });
  });
});

describe("canViewItem", () => {
  it("anyone can view a published item", () => {
    expect(canViewItem(undefined, { isPublished: true, author: "x" })).toBe(true);
  });

  it("a draft is hidden from anonymous visitors and students", () => {
    const draft = { isPublished: false, author: COMMITTEE.id };
    expect(canViewItem(undefined, draft)).toBe(false);
    expect(canViewItem(STUDENT, draft)).toBe(false);
  });

  it("a committee officer can view their own draft but not someone else's", () => {
    expect(canViewItem(COMMITTEE, { isPublished: false, author: COMMITTEE.id })).toBe(true);
    expect(canViewItem(COMMITTEE, { isPublished: false, author: COUNCIL.id })).toBe(false);
  });

  it("council officers and admins can view any draft", () => {
    const draft = { isPublished: false, author: COMMITTEE.id };
    expect(canViewItem(COUNCIL, draft)).toBe(true);
    expect(canViewItem(ADMIN, draft)).toBe(true);
  });

  it("reads a populated author document's _id", () => {
    const draft = { isPublished: false, author: { _id: COMMITTEE.id, firstName: "A" } };
    expect(canViewItem(COMMITTEE, draft)).toBe(true);
    expect(canViewItem(STUDENT, draft)).toBe(false);
  });
});
