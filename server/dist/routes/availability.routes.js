"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const availability_controller_1 = require("../controllers/availability.controller");
const router = express_1.default.Router();
// Meeting-level availability list (public read)
router.get("/:meetingId", availability_controller_1.getMeetingAvailability);
router.get("/:meetingId/summary", availability_controller_1.getAvailabilitySummary);
// Current user availability for a meeting
router.get("/:meetingId/me", auth_middleware_1.authenticate, availability_controller_1.getMyAvailability);
router.patch("/:meetingId/me", auth_middleware_1.authenticate, availability_controller_1.setMyAvailability);
exports.default = router;
