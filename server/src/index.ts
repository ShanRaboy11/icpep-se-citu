import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// MongoDB connection function
const connectDB = async (): Promise<void> => {
  try {
    // Validate environment variables
    if (!process.env.MONGO_URI) {
      throw new Error('❌ MONGO_URI environment variable is not defined!');
    }

    if (typeof process.env.MONGO_URI !== 'string') {
      throw new Error('❌ MONGO_URI must be a valid string!');
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', (error as Error).message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
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
app.get('/api', (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler - must be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
  console.log(`📍 MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⏳ Connecting...'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('💤 HTTP server closed');
    mongoose.connection.close(false).then(() => {
      console.log('💤 MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('💤 HTTP server closed');
    mongoose.connection.close(false).then(() => {
      console.log('💤 MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

export default app;