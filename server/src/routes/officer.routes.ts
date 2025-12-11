import express from "express";
import {
  getOfficers,
  updateOfficer,
  searchNonOfficers,
} from "../controllers/officer.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/search", protect, searchNonOfficers);
router.get("/", protect, getOfficers);
router.put("/:id", protect, updateOfficer);

export default router;
