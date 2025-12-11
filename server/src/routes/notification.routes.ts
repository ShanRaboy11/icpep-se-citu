import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  resetNotifications,
} from "../controllers/notification.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// All routes are protected
router.use(protect);

router.get("/", getNotifications);
router.delete("/reset", resetNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
