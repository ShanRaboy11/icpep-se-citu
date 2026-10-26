import { describe, it, expect, vi, beforeEach } from "vitest";

const find = vi.fn();
const findFaculty = vi.fn();
vi.mock("../models/advisor", () => ({
  default: Object.assign(vi.fn(), { find: (...a: unknown[]) => find(...a) }),
}));
vi.mock("../models/faculty", () => ({
  default: { findById: () => ({ select: () => findFaculty() }) },
}));

import { getAdvisors, createAdvisor } from "../controllers/advisor.controller";
import { mockReq, mockRes } from "./helpers";

const doc = (value: Record<string, unknown>) => ({ toObject: () => value });

beforeEach(() => {
  find.mockReset();
  findFaculty.mockReset();
});

describe("advisors", () => {
  it("takes name, photo and gender from the linked faculty member", async () => {
    find.mockReturnValue({
      populate: () => ({
        sort: async () => [
          doc({
            name: "Old Name",
            image: "old.png",
            gender: null,
            position: "Adviser",
            faculty: { _id: "f1", name: "Lindl Enario", image: "", gender: "male" },
          }),
        ],
      }),
    });
    const res = mockRes();
    await getAdvisors(mockReq({ query: {} }), res);
    const [advisor] = (res.body as { data: Record<string, unknown>[] }).data;
    expect(advisor).toMatchObject({ name: "Lindl Enario", gender: "male", faculty: "f1" });
    expect(advisor.image).toBe("old.png");
  });

  it("keeps an unlinked advisor's own details", async () => {
    find.mockReturnValue({
      populate: () => ({
        sort: async () => [doc({ name: "Legacy Adviser", image: "a.png", gender: "female", faculty: null })],
      }),
    });
    const res = mockRes();
    await getAdvisors(mockReq({ query: {} }), res);
    const [advisor] = (res.body as { data: Record<string, unknown>[] }).data;
    expect(advisor).toMatchObject({ name: "Legacy Adviser", image: "a.png", gender: "female", faculty: null });
  });

  it("refuses an advisor with neither a faculty member nor a name", async () => {
    findFaculty.mockResolvedValue(null);
    const res = mockRes();
    await createAdvisor(mockReq({ body: { position: "Adviser", yearRange: "2025" } }), res);
    expect(res.statusCode).toBe(400);
  });
});
