import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  actor?: mongoose.Types.ObjectId | null;
  target?: mongoose.Types.ObjectId | null;
  details?: Record<string, unknown>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", default: null },
    target: { type: Schema.Types.ObjectId, ref: "User", default: null },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Keep a year of history, then let MongoDB drop it.
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export default mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
