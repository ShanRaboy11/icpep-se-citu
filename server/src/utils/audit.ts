import mongoose from "mongoose";
import AuditLog from "../models/auditLog";

interface AuditEntry {
  action: string;
  actorId?: string | mongoose.Types.ObjectId | null;
  targetId?: string | mongoose.Types.ObjectId | null;
  details?: Record<string, unknown>;
}

const asObjectId = (value?: string | mongoose.Types.ObjectId | null) =>
  value && mongoose.isValidObjectId(value) ? value : null;

// Sensitive actions leave a record of who did what to whom. A failure to write
// it must never break the request that triggered it.
export const recordAudit = async (entry: AuditEntry): Promise<void> => {
  try {
    await AuditLog.create({
      action: entry.action,
      actor: asObjectId(entry.actorId),
      target: asObjectId(entry.targetId),
      details: entry.details ?? {},
    });
  } catch {
    // intentionally ignored
  }
};
