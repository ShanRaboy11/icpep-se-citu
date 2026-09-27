import { describe, it, expect, vi } from "vitest";
import { rateLimit, studentNumberKey } from "../utils/rate-limit";
import { mockReq, mockRes } from "./helpers";

const options = { windowMs: 1000, max: 2, message: "slow down" };

describe("rateLimit", () => {
  it("blocks a caller after max requests", () => {
    const limit = rateLimit(options);
    const next = vi.fn();
    for (let i = 0; i < 2; i++) limit(mockReq({ ip: "1.1.1.1" }), mockRes(), next);
    const blocked = mockRes();
    limit(mockReq({ ip: "1.1.1.1" }), blocked, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(blocked.statusCode).toBe(429);
  });

  it("counts callers separately", () => {
    const limit = rateLimit(options);
    const next = vi.fn();
    for (let i = 0; i < 3; i++) limit(mockReq({ ip: "1.1.1.1" }), mockRes(), next);
    limit(mockReq({ ip: "2.2.2.2" }), mockRes(), next);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it("starts a new window once the old one expires", () => {
    vi.useFakeTimers();
    const limit = rateLimit(options);
    const next = vi.fn();
    for (let i = 0; i < 3; i++) limit(mockReq({ ip: "1.1.1.1" }), mockRes(), next);
    vi.advanceTimersByTime(1500);
    limit(mockReq({ ip: "1.1.1.1" }), mockRes(), next);
    vi.useRealTimers();
    expect(next).toHaveBeenCalledTimes(3);
  });

  it("uses a custom key", () => {
    const limit = rateLimit({ ...options, key: studentNumberKey });
    const next = vi.fn();
    for (let i = 0; i < 3; i++) {
      limit(
        mockReq({ ip: `9.9.9.${i}`, body: { studentNumber: "23-1111-111" } }),
        mockRes(),
        next,
      );
    }
    expect(next).toHaveBeenCalledTimes(2);
  });

  it("does not count successful requests when skipSuccessful is set", () => {
    const limit = rateLimit({ ...options, skipSuccessful: true });
    const next = vi.fn();
    for (let i = 0; i < 5; i++) {
      let finish: () => void = () => {};
      const res = mockRes();
      res.on = ((_event: string, cb: () => void) => {
        finish = cb;
        return res;
      }) as typeof res.on;
      limit(mockReq({ ip: "1.1.1.1" }), res, next);
      res.statusCode = 200;
      finish();
    }
    expect(next).toHaveBeenCalledTimes(5);
  });
});

describe("studentNumberKey", () => {
  it("normalizes case and ignores non-strings", () => {
    expect(studentNumberKey(mockReq({ body: { studentNumber: " 23-1111-111 " } }))).toBe(
      "sn:23-1111-111",
    );
    expect(studentNumberKey(mockReq({ body: { studentNumber: { $ne: "" } } }))).toBeUndefined();
    expect(studentNumberKey(mockReq({ body: {} }))).toBeUndefined();
  });
});
