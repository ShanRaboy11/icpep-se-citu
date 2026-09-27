import express from "express";
import {
  getOfficers,
  getPublicOfficers,
  updateOfficer,
  searchNonOfficers,
} from "../controllers/officer.controller";
import { protect, authorizeRoles } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/public", getPublicOfficers);
// Protected routes (council officers and admins/developers only) — this
// exposes the full student directory and can reassign anyone's position,
// so it's not enough to just be logged in.
router.get("/search", protect, authorizeRoles("council-officer"), searchNonOfficers);
router.get("/", protect, authorizeRoles("council-officer"), getOfficers);
router.put("/:id", protect, authorizeRoles("council-officer"), updateOfficer);

export default router;
