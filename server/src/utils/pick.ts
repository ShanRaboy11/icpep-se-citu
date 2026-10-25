import mongoose from "mongoose";

// Copies only the listed keys from a request body. Anything not listed (ids,
// authorship, counters, internal flags) is dropped rather than written.
export const pickFields = (
  source: Record<string, unknown>,
  fields: readonly string[]
): Record<string, unknown> =>
  Object.fromEntries(
    fields.filter((field) => field in source).map((field) => [field, source[field]])
  );

export const toObjectId = (value?: string): mongoose.Types.ObjectId | undefined =>
  value && mongoose.isValidObjectId(value) ? new mongoose.Types.ObjectId(value) : undefined;
