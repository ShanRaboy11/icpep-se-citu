import express, { RequestHandler } from "express";
import { getAuditLog } from "../controllers/audit.controller";
import { protect, authorizeRoles } from "../middleware/auth.middleware";

const router = express.Router();

// authorizeRoles() with no roles lets only admin through (admin bypasses the check)
router.get("/", protect as RequestHandler, authorizeRoles() as RequestHandler, getAuditLog);

export default router;
