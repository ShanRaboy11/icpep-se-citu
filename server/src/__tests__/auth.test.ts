import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../index";
import User from "../models/user";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth Controller & Admin Seeding", () => {
  it("POST /api/auth/login fails when studentNumber or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ studentNumber: "ADMIN-001" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/auth/login fails with 401 when user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ studentNumber: "NONEXISTENT", password: "SomePassword@123" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("seeds an admin and successfully logs in", async () => {
    // Create an admin user directly
    const admin = new User({
      studentNumber: "ADMIN-001",
      firstName: "Super",
      lastName: "Admin",
      email: "admin@example.com",
      password: "Admin@Password123",
      role: "admin",
      isActive: true,
      firstLogin: false,
    });
    await admin.save();

    // Verify login with correct credentials
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ studentNumber: "ADMIN-001", password: "Admin@Password123" });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.token).toBeDefined();
    expect(loginRes.body.user.role).toBe("admin");

    const token = loginRes.body.token;

    // Verify accessing protected /api/auth/me with the token
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.data.studentNumber).toBe("ADMIN-001");
  });

  it("rejects unauthorized access to protected routes without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
