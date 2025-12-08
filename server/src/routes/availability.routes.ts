import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getMeetingAvailability,
  getMyAvailability,
  setMyAvailability,
  getAvailabilitySummary,
} from "../controllers/availability.controller";

const router = express.Router();

// Meeting-level availability list (public read)
router.get("/:meetingId", getMeetingAvailability);
router.get("/:meetingId/summary", getAvailabilitySummary);

// Current user availability for a meeting
router.get("/:meetingId/me", authenticate, getMyAvailability);
router.patch("/:meetingId/me", authenticate, setMyAvailability);

export default router;
