"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sponsor_controller_1 = require("../controllers/sponsor.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', sponsor_controller_1.getSponsors);
// Protected routes
router.get('/admin', auth_middleware_1.authenticateToken, sponsor_controller_1.getAllSponsors);
router.post('/', upload_middleware_1.upload.single('image'), sponsor_controller_1.createSponsor);
router.put('/:id', upload_middleware_1.upload.single('image'), sponsor_controller_1.updateSponsor);
router.delete('/:id', sponsor_controller_1.deleteSponsor);
exports.default = router;
