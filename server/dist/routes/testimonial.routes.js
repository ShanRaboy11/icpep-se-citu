"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const upload_middleware_1 = require("../middleware/upload.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', testimonial_controller_1.getTestimonials);
// Protected routes
router.get('/admin', auth_middleware_1.authenticateToken, testimonial_controller_1.getAllTestimonials);
router.post('/', upload_middleware_1.upload.single('image'), testimonial_controller_1.createTestimonial);
router.put('/:id', auth_middleware_1.authenticateToken, upload_middleware_1.upload.single('image'), testimonial_controller_1.updateTestimonial);
router.delete('/:id', auth_middleware_1.authenticateToken, testimonial_controller_1.deleteTestimonial);
exports.default = router;
