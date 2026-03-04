"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const partner_controller_1 = require("../controllers/partner.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Public routes
router.get('/', partner_controller_1.getPartners);
// Protected routes (require authentication and admin/officer role)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), upload.single('logo'), partner_controller_1.createPartner);
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), upload.single('logo'), partner_controller_1.updatePartner);
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)('admin', 'council-officer'), partner_controller_1.deletePartner);
exports.default = router;
