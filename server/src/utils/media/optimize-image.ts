import sharp from "sharp";

export const MAX_UPLOAD_WIDTH = 1200;
export const MAX_UPLOAD_HEIGHT = 630;

export const optimizeImage = (buffer: Buffer): Promise<Buffer> =>
  sharp(buffer)
    .rotate()
    .resize(MAX_UPLOAD_WIDTH, MAX_UPLOAD_HEIGHT, { fit: "inside", withoutEnlargement: true })
    .avif({ quality: 55, effort: 4 })
    .toBuffer();
