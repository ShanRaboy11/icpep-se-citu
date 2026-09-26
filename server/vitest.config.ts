import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/tests/**/*.test.ts"],
    environment: "node",
    env: { JWT_SECRET: "test-secret-that-is-long-enough" },
  },
});
