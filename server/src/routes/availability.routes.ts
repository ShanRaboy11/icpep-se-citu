import express from "express";
import { validateObjectId } from "../middleware/validate-id";
import { authenticate, optionalAuth } from "../middleware/auth.middleware";
import {
  getMeetingAvailability,
  getMyAvailability,
  setMyAvailability,
  getAvailabilitySummary,
} from "../controllers/availability.controller";

const router = express.Router();
router.param("meetingId", validateObjectId);

// Meeting-level availability list (public read)
router.get("/:meetingId", optionalAuth, getMeetingAvailability);
router.get("/:meetingId/summary", getAvailabilitySummary);

// Current user availability for a meeting
router.get("/:meetingId/me", authenticate, getMyAvailability);
router.patch("/:meetingId/me", authenticate, setMyAvailability);

export default router;
