import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMeetingAvailability,
  getMyAvailability,
  setMyAvailability,
  getAvailabilitySummary,
} from "../controllers/availability.controller";

const router = express.Router();

// Meeting-level availability list
router.get("/:meetingId", authenticate, getMeetingAvailability);
router.get("/:meetingId/summary", authenticate, getAvailabilitySummary);

// Current user availability for a meeting
router.get("/:meetingId/me", authenticate, getMyAvailability);
router.patch("/:meetingId/me", authenticate, setMyAvailability);

export default router;
