"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authorizeRole = exports.authenticate = exports.protect = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log('🔐 Token received:', token ? 'Yes' : 'No');
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log('👤 Decoded token:', decoded);
        console.log('🆔 User ID from token:', decoded.id);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('❌ Token verification failed:', error);
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};
exports.authenticateToken = authenticateToken;
// Alias for authenticateToken
exports.protect = exports.authenticateToken;
exports.authenticate = exports.authenticateToken;
// Middleware to check if user has required role
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
            });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
// Alias for authorizeRole
exports.authorizeRoles = exports.authorizeRole;
