"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const meeting_controller_1 = require("../controllers/meeting.controller");
const router = express_1.default.Router();
// Public
router.get("/", meeting_controller_1.getMeetings);
router.get("/:id", meeting_controller_1.getMeetingById);
// Protected (officers/faculty create & manage)
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("council-officer", "committee-officer", "faculty"), meeting_controller_1.createMeeting);
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("council-officer", "committee-officer", "faculty"), meeting_controller_1.updateMeeting);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("council-officer", "committee-officer", "faculty"), meeting_controller_1.deleteMeeting);
exports.default = router;
