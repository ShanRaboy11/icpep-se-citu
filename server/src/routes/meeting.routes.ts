import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meeting.controller";

const router = express.Router();

// Any logged-in user can view meetings; the link is only included for the people it is meant for
router.get("/", authenticate, getMeetings);
router.get("/:id", authenticate, getMeetingById);

// Protected (officers/faculty create & manage)
router.post(
  "/",
  authenticate,
  authorizeRoles("council-officer", "committee-officer", "faculty"),
  createMeeting
);
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("council-officer", "committee-officer", "faculty"),
  updateMeeting
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("council-officer", "committee-officer", "faculty"),
  deleteMeeting
);

export default router;
