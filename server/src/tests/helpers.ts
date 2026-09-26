import { Request, Response } from "express";

export const mockRes = () => {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
    on() {
      return res;
    },
  };
  return res as typeof res & Response;
};

export const mockReq = (overrides: Record<string, unknown> = {}) =>
  ({ headers: {}, params: {}, body: {}, ...overrides }) as unknown as Request;
