"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const officer_controller_1 = require("../controllers/officer.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/search", auth_middleware_1.protect, officer_controller_1.searchNonOfficers);
router.get("/", auth_middleware_1.protect, officer_controller_1.getOfficers);
router.put("/:id", auth_middleware_1.protect, officer_controller_1.updateOfficer);
exports.default = router;
