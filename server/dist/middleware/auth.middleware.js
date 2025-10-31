"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFirstLogin = exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;
        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Or check for token in cookies
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.',
            });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        // Check if user still exists
        const user = await user_1.default.findById(decoded.id).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User no longer exists',
            });
            return;
        }
        // Check if user is active
        if (!user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
            return;
        }
        // Attach user to request
        req.user = {
            id: user._id.toString(),
            role: user.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
            error: error.message,
        });
    }
};
exports.protect = protect;
// Restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
            return;
        }
        next();
    };
};
exports.restrictTo = restrictTo;
// Optional: Check if it's the user's first login
const checkFirstLogin = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }
        const user = await user_1.default.findById(req.user.id).select('+firstLogin');
        if (user?.firstLogin) {
            res.status(403).json({
                success: false,
                message: 'Please change your password before proceeding',
                firstLogin: true,
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking first login status',
            error: error.message,
        });
    }
};
exports.checkFirstLogin = checkFirstLogin;
