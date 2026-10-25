import { Request, Response } from "express";
import AuditLog from "../models/auditLog";
import { respondWithError } from "../utils/http-error";

// @desc    List audit records, newest first
// @route   GET /api/audit
// @access  Private (admin)
export const getAuditLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "50"), 10) || 50, 1), 200);
    const action = typeof req.query.action === "string" ? req.query.action : undefined;
    const filter = action ? { action } : {};

    const [entries, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("actor", "studentNumber firstName lastName role")
        .populate("target", "studentNumber firstName lastName role")
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: entries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    respondWithError(res, error, "Error fetching audit log");
  }
};
