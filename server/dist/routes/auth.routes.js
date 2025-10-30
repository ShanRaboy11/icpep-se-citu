"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.post('/login', auth_controller_1.login);
// Protected routes
router.use(auth_middleware_1.protect); // All routes after this are protected
router.get('/me', auth_controller_1.getMe);
router.post('/logout', auth_controller_1.logout);
router.put('/change-password', auth_controller_1.changePassword);
// Admin only
router.put('/reset-password/:id', (0, auth_middleware_1.restrictTo)('council-officer', 'faculty'), auth_controller_1.resetPassword);
exports.default = router;
