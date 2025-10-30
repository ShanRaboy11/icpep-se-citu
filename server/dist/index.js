"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}
// MongoDB connection function
const connectDB = async () => {
    try {
        // Validate environment variables
        if (!process.env.MONGO_URI) {
            throw new Error('❌ MONGO_URI environment variable is not defined!');
        }
        if (typeof process.env.MONGO_URI !== 'string') {
            throw new Error('❌ MONGO_URI must be a valid string!');
        }
        // Connect to MongoDB
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        // Connection event listeners
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};
// Connect to database
connectDB();
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected',
    });
});
// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 ICPEP CITU API Server',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            api: '/api',
        },
    });
});
// API base route
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'ICPEP CITU API',
        version: '1.0.0',
        availableRoutes: [
            '/api/auth',
            '/api/users',
            '/api/announcements',
            '/api/events',
            '/api/memberships',
            '/api/notifications',
            '/api/officers',
            '/api/faculty',
            '/api/partners',
            '/api/testimonials',
            '/api/faqs',
            '/api/availability',
            '/api/meetings',
        ],
    });
});
// TODO: Add your routes here
// import authRoutes from './routes/auth.routes.js';
// import userRoutes from './routes/user.routes.js';
// import announcementRoutes from './routes/announcement.routes.js';
// etc...
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/announcements', announcementRoutes);
// etc...
// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
    });
});
// Global error handler - must be last
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`📍 MongoDB: ${mongoose_1.default.connection.readyState === 1 ? '✅ Connected' : '⏳ Connecting...'}`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('💤 HTTP server closed');
        mongoose_1.default.connection.close(false).then(() => {
            console.log('💤 MongoDB connection closed');
            process.exit(0);
        });
    });
});
process.on('SIGINT', () => {
    console.log('👋 SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('💤 HTTP server closed');
        mongoose_1.default.connection.close(false).then(() => {
            console.log('💤 MongoDB connection closed');
            process.exit(0);
        });
    });
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    console.error(err.stack);
    // Close server & exit process
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
});
exports.default = app;
