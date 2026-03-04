"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("../controllers/faq.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.get('/', faq_controller_1.getFAQs);
// Protected routes
router.get('/admin', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), faq_controller_1.getAllFAQs);
router.post('/', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), faq_controller_1.createFAQ);
router.put('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), faq_controller_1.updateFAQ);
router.delete('/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), faq_controller_1.deleteFAQ);
exports.default = router;
