import { describe, it, expect, vi } from "vitest";
import type { Request, Response } from "express";
import { readToken, SESSION_COOKIE } from "../utils/auth/session-cookie";
import { requireCsrfHeader } from "../middleware/csrf.middleware";

const req = (parts: Partial<Request>) => ({ method: "POST", headers: {}, cookies: {}, ...parts }) as Request;

describe("readToken", () => {
  it("prefers the login cookie over a Bearer header", () => {
    expect(readToken(req({ cookies: { [SESSION_COOKIE]: "from-cookie" }, headers: { authorization: "Bearer from-header" } }))).toBe("from-cookie");
  });

  it("falls back to the Bearer header", () => {
    expect(readToken(req({ headers: { authorization: "Bearer from-header" } }))).toBe("from-header");
  });

  it("returns nothing when neither is present", () => {
    expect(readToken(req({}))).toBeUndefined();
  });
});

describe("requireCsrfHeader", () => {
  const run = (request: Request) => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const next = vi.fn();
    requireCsrfHeader(request, { status, json } as unknown as Response, next);
    return { status, next };
  };

  it("blocks a cookie-authenticated change that lacks the header", () => {
    const { status, next } = run(req({ cookies: { [SESSION_COOKIE]: "t" } }));
    expect(status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("lets through the header, reads, Bearer clients and anonymous requests", () => {
    expect(run(req({ cookies: { [SESSION_COOKIE]: "t" }, headers: { "x-requested-with": "XMLHttpRequest" } })).next).toHaveBeenCalled();
    expect(run(req({ method: "GET", cookies: { [SESSION_COOKIE]: "t" } })).next).toHaveBeenCalled();
    expect(run(req({ cookies: { [SESSION_COOKIE]: "t" }, headers: { authorization: "Bearer x" } })).next).toHaveBeenCalled();
    expect(run(req({})).next).toHaveBeenCalled();
  });
});
