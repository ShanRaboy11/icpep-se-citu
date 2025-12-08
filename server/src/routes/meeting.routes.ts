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

// Public
router.get("/", getMeetings);
router.get("/:id", getMeetingById);

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
