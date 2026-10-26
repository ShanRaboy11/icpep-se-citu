import { describe, it, expect, vi, beforeEach } from "vitest";

const updateOne = vi.fn();
vi.mock("../models/user", () => ({
  default: { updateOne: (...args: unknown[]) => updateOne(...args) },
}));
const sendEmail = vi.fn();
vi.mock("../utils/mail/email", () => ({ default: (...args: unknown[]) => sendEmail(...args) }));

import { buildSchoolEmail } from "../utils/mail/school-email";
import {
  generateFirstLoginCode,
  normalizeFirstLoginCode,
  issueFirstLoginCode,
} from "../utils/auth/first-login-code";
import { queueFirstLoginEmail, flushFirstLoginEmails } from "../utils/mail/first-login-mail";

describe("buildSchoolEmail", () => {
  it("builds firstname.lastname@cit.edu", () => {
    expect(buildSchoolEmail("Trixie", "Dolera")).toBe("trixie.dolera@cit.edu");
  });

  it("joins multi-word names and suffixes", () => {
    expect(buildSchoolEmail("Mamerto Buenaventura Jr", "Rodrigo")).toBe(
      "mamertobuenaventurajr.rodrigo@cit.edu",
    );
    expect(buildSchoolEmail("Nesserain", "De La Cruz")).toBe("nesserain.delacruz@cit.edu");
  });

  it("drops accents and punctuation", () => {
    expect(buildSchoolEmail("Niño", "O'Brien-Reyes")).toBe("nino.obrienreyes@cit.edu");
  });

  it("gives nothing when a name is empty", () => {
    expect(buildSchoolEmail("", "Dolera")).toBeNull();
    expect(buildSchoolEmail("Trixie", "  ")).toBeNull();
  });
});

describe("first-login codes", () => {
  it("makes readable XXXX-XXXX codes without lookalike characters", () => {
    for (let i = 0; i < 50; i += 1) {
      expect(generateFirstLoginCode()).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
    }
  });

  it("makes different codes", () => {
    const codes = new Set(Array.from({ length: 100 }, generateFirstLoginCode));
    expect(codes.size).toBe(100);
  });

  it("accepts a code typed in lowercase, with spaces or without the dash", () => {
    expect(normalizeFirstLoginCode("abcd-2345")).toBe("ABCD-2345");
    expect(normalizeFirstLoginCode(" abcd 2345 ")).toBe("ABCD-2345");
    expect(normalizeFirstLoginCode("ABCD2345")).toBe("ABCD-2345");
  });

  it("rejects things that aren't codes", () => {
    expect(normalizeFirstLoginCode("hunter2")).toBeNull();
    expect(normalizeFirstLoginCode("ABCD-234O")).toBeNull();
  });

  it("expires in the future", () => {
    expect(issueFirstLoginCode().expires.getTime()).toBeGreaterThan(Date.now());
  });
});

describe("first-login mail queue", () => {
  beforeEach(() => {
    updateOne.mockReset();
    sendEmail.mockReset();
    process.env.FIRST_LOGIN_MAIL_INTERVAL_MS = "0";
  });

  const job = (userId: string) => ({
    userId,
    email: `${userId}@cit.edu`,
    firstName: "Test",
    code: "ABCD-2345",
    expires: new Date(Date.now() + 1000),
  });

  it("marks accounts sent, in order, once the email goes out", async () => {
    sendEmail.mockResolvedValue(undefined);
    queueFirstLoginEmail(job("a"));
    queueFirstLoginEmail(job("b"));
    await flushFirstLoginEmails();
    expect(sendEmail.mock.calls.map((c) => (c[0] as { email: string }).email)).toEqual([
      "a@cit.edu",
      "b@cit.edu",
    ]);
    expect(updateOne).toHaveBeenCalledWith({ _id: "a" }, { firstLoginCodeStatus: "sent" });
  });

  it("marks an account failed and keeps going when one email fails", async () => {
    sendEmail.mockRejectedValueOnce(new Error("smtp down")).mockResolvedValue(undefined);
    updateOne.mockReturnValue(Promise.resolve());
    queueFirstLoginEmail(job("a"));
    queueFirstLoginEmail(job("b"));
    await flushFirstLoginEmails();
    expect(updateOne).toHaveBeenCalledWith({ _id: "a" }, { firstLoginCodeStatus: "failed" });
    expect(updateOne).toHaveBeenCalledWith({ _id: "b" }, { firstLoginCodeStatus: "sent" });
  });

  it("never puts the code anywhere but the email", async () => {
    sendEmail.mockResolvedValue(undefined);
    queueFirstLoginEmail(job("a"));
    await flushFirstLoginEmails();
    expect(JSON.stringify(updateOne.mock.calls)).not.toContain("ABCD-2345");
  });
});
