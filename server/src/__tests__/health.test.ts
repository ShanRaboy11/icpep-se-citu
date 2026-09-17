import request from "supertest";
import app from "../index";

describe("Health & Root API Endpoints", () => {
  it("GET / returns 200 with API status and endpoints", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.endpoints).toBeDefined();
  });

  it("GET /health returns 200 and healthy status", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("healthy");
  });

  it("GET /api returns 200 with available route list", async () => {
    const res = await request(app).get("/api");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.availableRoutes)).toBe(true);
    expect(res.body.availableRoutes).toContain("/api/auth");
  });

  it("GET /unknown-route returns 404", async () => {
    const res = await request(app).get("/unknown-nonexistent-path");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
