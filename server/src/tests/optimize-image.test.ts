import { describe, it, expect } from "vitest";
import sharp from "sharp";
import { optimizeImage, MAX_UPLOAD_WIDTH, MAX_UPLOAD_HEIGHT } from "../utils/optimize-image";

const photo = (width: number, height: number) =>
  sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#336699",
      noise: { type: "gaussian", mean: 128, sigma: 40 },
    },
  })
    .png()
    .toBuffer();

describe("optimizeImage", () => {
  it("shrinks a large photo to fit the upload box and re-encodes it as AVIF", async () => {
    const original = await photo(3000, 2000);
    const optimized = await optimizeImage(original);
    const meta = await sharp(optimized).metadata();

    expect(optimized.subarray(4, 12).toString("ascii")).toBe("ftypavif");
    expect(meta.width).toBeLessThanOrEqual(MAX_UPLOAD_WIDTH);
    expect(meta.height).toBeLessThanOrEqual(MAX_UPLOAD_HEIGHT);
    expect(optimized.length).toBeLessThan(original.length);
  }, 30_000);

  it("never enlarges a small image", async () => {
    const meta = await sharp(await optimizeImage(await photo(200, 120))).metadata();
    expect(meta.width).toBe(200);
    expect(meta.height).toBe(120);
  });

  it("keeps transparency", async () => {
    const cutout = await sharp({
      create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .png()
      .toBuffer();
    const meta = await sharp(await optimizeImage(cutout)).metadata();
    expect(meta.hasAlpha).toBe(true);
  });

  it("rejects bytes that aren't an image", async () => {
    await expect(optimizeImage(Buffer.from("not an image at all"))).rejects.toThrow();
  });
});
