import { describe, it, expect, vi } from "vitest";
import authService from "../app/services/auth";
import axios from "axios";

describe("Auth Service", () => {
  it("exports a singleton instance with changePassword method", () => {
    expect(authService).toBeDefined();
    expect(typeof authService.changePassword).toBe("function");
  });

  it("handles changePassword network failure gracefully", async () => {
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error("Network Error"));

    await expect(
      authService.changePassword("OldPass@123", "NewPass@123")
    ).rejects.toThrow("Network Error");
  });
});
