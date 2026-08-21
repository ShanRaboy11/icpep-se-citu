"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const merch_controller_1 = require("../controllers/merch.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', merch_controller_1.getMerch);
// Protected routes (add auth middleware if needed later)
router.post('/', upload_middleware_1.upload.single('image'), merch_controller_1.createMerch);
router.put('/:id', upload_middleware_1.upload.single('image'), merch_controller_1.updateMerch);
router.delete('/:id', merch_controller_1.deleteMerch);
exports.default = router;
