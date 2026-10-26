import { describe, it, expect } from "vitest";
import { isRsvpOpen } from "../utils/rsvp";

describe("isRsvpOpen", () => {
  const start = new Date("2026-11-10T14:00:00+08:00");

  it("is open before the event and through the rest of that day", () => {
    expect(isRsvpOpen({ eventDate: start }, new Date("2026-11-01T00:00:00+08:00"))).toBe(true);
    expect(isRsvpOpen({ eventDate: start }, new Date("2026-11-10T20:00:00+08:00"))).toBe(true);
  });

  it("closes a day after the start when there is no end date", () => {
    expect(isRsvpOpen({ eventDate: start }, new Date("2026-11-11T15:00:00+08:00"))).toBe(false);
  });

  it("uses the end date when one is set", () => {
    const expiry = new Date("2026-11-12T18:00:00+08:00");
    expect(isRsvpOpen({ eventDate: start, expiryDate: expiry }, new Date("2026-11-12T10:00:00+08:00"))).toBe(true);
    expect(isRsvpOpen({ eventDate: start, expiryDate: expiry }, new Date("2026-11-12T19:00:00+08:00"))).toBe(false);
  });
});
