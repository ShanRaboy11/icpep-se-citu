import dotenv from "dotenv";

// Load environment variables as early as possible so modules that read process.env
// (e.g., the Cloudinary utility) get the values during module initialization.
dotenv.config();

import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import announcementRoutes from "./routes/announcements.route";
import eventRoutes from "./routes/event.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import sponsorRoutes from "./routes/sponsor.routes";
import meetingRoutes from "./routes/meeting.routes";
import availabilityRoutes from "./routes/availability.routes";
import merchRoutes from "./routes/merch.routes";
import faqRoutes from "./routes/faq.routes";
import notificationRoutes from "./routes/notification.routes";
import officerRoutes from "./routes/officer.routes";
import advisorRoutes from "./routes/advisor.routes";
import facultyRoutes from "./routes/faculty.routes";
import officerTermRoutes from "./routes/officerTerm.routes";
import membershipRoutes from "./routes/membership.routes";
import siteRoutes from "./routes/site.routes";
import startAnnouncementScheduler from "./utils/scheduler";
import { escapeRegExp } from "./utils/regex";
import { getJwtSecret, getDefaultPassword } from "./config/env";
import { enforceMaintenanceMode } from "./middleware/maintenance.middleware";

// Refuse to start without a usable JWT secret (and, in production, a
// deliberate default password for new accounts)
getJwtSecret();
getDefaultPassword();

// Initialize express app
const app: Application = express();

// Behind a reverse proxy (Render, etc.) set TRUST_PROXY=1 so req.ip is the real
// client rather than the proxy; leave it unset when the server is exposed directly.
const trustedProxyHops = parseInt(process.env.TRUST_PROXY ?? "", 10);
if (trustedProxyHops > 0) app.set("trust proxy", trustedProxyHops);

// Middleware must come before routes.
// 1. Body Parser - FIRST. Small by default; the bulk user import sends a whole
// roster as JSON, so only that route gets a larger limit.
app.use("/api/users", express.json({ limit: "10mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 2. Cookie Parser
app.use(cookieParser());

// 3. CORS - Allow multiple origins. Support comma-separated FRONTEND_URL(s)
// and allow vercel subdomains by default (useful for preview deployments).
const defaultOrigins = [
  "http://localhost:3000",
  "https://icpep-se-citu.vercel.app",
];
const envFrontends = (
  process.env.FRONTEND_URL ||
  process.env.FRONTEND_URLS ||
  ""
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = Array.from(
  new Set([...defaultOrigins, ...envFrontends])
);
const allowAllOrigins =
  String(process.env.ALLOW_ALL_ORIGINS || "false").toLowerCase() === "true";
const allowVercelSubdomains =
  String(process.env.ALLOW_VERCEL_SUBDOMAINS ?? "true").toLowerCase() ===
  "true";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like Postman or same-origin server requests)
      if (!origin) return callback(null, true);

      if (allowAllOrigins) {
        return callback(null, true);
      }

      try {
        const originHost = new URL(origin).host;

        // Allow vercel preview subdomains (e.g. *.vercel.app) when enabled
        if (allowVercelSubdomains && originHost.endsWith(".vercel.app")) {
          return callback(null, true);
        }

        // Direct match against configured allowed origins (may include protocol)
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Try matching by host (handles entries like https://example.com)
        for (const allowed of allowedOrigins) {
          try {
            const allowedHost = new URL(allowed).host;
            if (allowedHost === originHost) {
              return callback(null, true);
            }
          } catch {
            // ignore malformed allowed entries
          }
        }

        // Support wildcard-like entries in allowedOrigins using '*' (e.g. *.example.com)
        for (const allowed of allowedOrigins) {
          if (allowed.includes("*")) {
            // Escape everything literally, then turn each '*' into '.*'
            const regexStr = allowed.split("*").map(escapeRegExp).join(".*");
            const re = new RegExp(`^${regexStr}$`);
            if (re.test(origin)) {
              return callback(null, true);
            }
          }
        }
      } catch {
        // If URL parsing fails, fall through to blocked
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 4. Request logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// 5. Maintenance mode — an admin-only switch that suspends the rest of the
// API for everyone else. Sits ahead of every route below.
app.use(enforceMaintenanceMode);

// MongoDB connection function
const connectDB = async (): Promise<void> => {
  try {
    // Validate environment variables
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not defined!");
    }

    if (typeof process.env.MONGO_URI !== "string") {
      throw new Error("MONGO_URI must be a valid string!");
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

  } catch (error) {
    // Nothing works without the database: exit with the error left to Node to print
    process.exitCode = 1;
    throw error;
  }
};

connectDB();

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "ICPEP CITU API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

// API base route
app.get("/api", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "ICPEP CITU API",
    version: "1.0.0",
    availableRoutes: [
      "/api/auth",
      "/api/users",
      "/api/announcements",
      "/api/events",
      "/api/memberships",
      "/api/notifications",
      "/api/officers",
      "/api/faculty",
      "/api/sponsors",
      "/api/testimonials",
      "/api/faqs",
      "/api/availability",
      "/api/meetings",
    ],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/advisors", advisorRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/officer-terms", officerTermRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/merch", merchRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/site", siteRoutes);

// 404 handler - must be after all routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Global error handler - must be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(
    `MongoDB: ${
      mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."
    }`
  );
});

// Start scheduler after successful DB connection
mongoose.connection.once("open", () => {
  startAnnouncementScheduler();
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

export default app;
