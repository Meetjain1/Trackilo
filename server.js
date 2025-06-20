/**
 * ⚠️ PROTECTED CODE - DO NOT COPY ⚠️
 * 
 * @author: Meet Jain
 * @github: https://github.com/Meetjain1
 * @project: Trackilo - Job Application Tracking System
 * @copyright: Copyright (c) 2024 Meet Jain. All rights reserved.
 */

import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import securityValidator from './utils/securityCheck.js';
import cors from 'cors';

// db and authenticateUser
import connectDB from './db/connect.js';
import User from './models/User.js';

// routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

// Load env vars first
dotenv.config();

// Debug environment variables
console.log('Environment variables loaded:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL:', process.env.MONGO_URL ? 'Set' : 'Not Set');

const app = express();

// Add this constant at the top after imports
const PRODUCTION_URL = 'https://trackilo.onrender.com';
const DEVELOPMENT_URL = 'http://localhost:5001';

// Trust proxy
app.enable('trust proxy');
app.set('trust proxy', 1);

// Passport configuration
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production'
        ? `${PRODUCTION_URL}/api/v1/auth/google/callback`
        : `${DEVELOPMENT_URL}/api/v1/auth/google/callback`,
      scope: ['profile', 'email'],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          password: Math.random().toString(36).slice(-8),
          googleId: profile.id,
        });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Performance Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// Cache Control Headers
app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|jpg|jpeg|png|gif|ico)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  } else {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// Add health check endpoint before API routes
app.get('/api/v1/auth/check-status', (req, res) => {
  res.status(200).json({ status: 'ok', server: true });
});

// Configure rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased limit
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    return req.ip;
  }
});

const getCurrentUserLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120, // Allow 120 requests per minute for getCurrentUser
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    return req.ip;
  }
});

// Add this before any middleware or route setup
if (!securityValidator.validateEnvironment()) {
  console.error('Security validation failed. Application will not start.');
  process.exit(1);
}

// Enhanced security middleware
const enhancedSecurityMiddleware = (req, res, next) => {
  // Check for suspicious headers
  const suspiciousHeaders = ['x-debug', 'x-override', 'x-hack'];
  if (suspiciousHeaders.some(header => req.headers[header])) {
    return res.status(403).json({ error: 'Unauthorized request pattern detected' });
  }

  // Check request patterns
  if (req.headers['user-agent']?.toLowerCase().includes('postman') ||
      req.headers['user-agent']?.toLowerCase().includes('insomnia')) {
    return res.status(403).json({ error: 'Unauthorized client' });
  }

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "script-src 'self'; " +
    "img-src 'self' data:; " +
    "connect-src 'self' https://trackilo.onrender.com; " +
    "frame-src 'self';"
  );

  next();
};

// Apply enhanced security before other middleware
app.use(enhancedSecurityMiddleware);

// Add this after your existing rate limiters
const advancedSecurityMiddleware = (req, res, next) => {
  if (!securityValidator.isValidEnvironment()) {
    // Enhanced random errors and delays
    setTimeout(() => {
      const errors = [
        { status: 500, message: 'Internal Server Error' },
        { status: 503, message: 'Service Unavailable' },
        { status: 502, message: 'Bad Gateway' },
        { status: 504, message: 'Gateway Timeout' },
        { status: 511, message: 'Network Authentication Required' },
        { status: 418, message: 'I\'m a teapot' },
        { status: 451, message: 'Unavailable For Legal Reasons' }
      ];
      const randomError = errors[Math.floor(Math.random() * errors.length)];
      res.status(randomError.status).json({ 
        error: randomError.message,
        timestamp: new Date().toISOString(),
        path: req.path,
        message: 'Security violation detected. This incident has been logged.'
      });
    }, Math.random() * 3000);
    return;
  }
  next();
};

// Apply advanced security middleware to all routes
app.use(advancedSecurityMiddleware);

// Add session support
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 24 * 60 * 60, // 1 day
    }),
    proxy: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined,
      httpOnly: true
    },
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiting to specific routes
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/getCurrentUser', getCurrentUserLimiter);

// Add CORS configuration before routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://trackilo.onrender.com' : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// Serve static files and handle client routing
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  const buildPath = path.resolve(__dirname, './client/build');
  app.use(express.static(buildPath));
  
  // Serve index.html for all routes except /api
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.redirect('http://localhost:3000');
  });
}

// Error handling middleware should be after all routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

let server;
let isShuttingDown = false;

// Function to find an available port
const findAvailablePort = async (startPort) => {
  const net = await import('net');
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    
    server.listen(startPort, () => {
      server.close();
      resolve(startPort);
    });
  });
};

const gracefulShutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log('Received shutdown signal. Closing HTTP server...');
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  
  console.log('Closing database connection...');
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed successfully');
    }
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
  
  console.log('Graceful shutdown completed');
  process.exit(0);
};

const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URL);
    console.log('MongoDB Connected successfully');

    // Use Render's assigned port or fallback to 10000
    const port = process.env.PORT || 10000;
    
    // Start server
    server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port}`);
      console.log('Node Environment:', process.env.NODE_ENV);
    });

  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  gracefulShutdown();
});

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

start();

/**
 * ⚠️ END OF PROTECTED CODE ⚠️
 * Copyright (c) 2024 Meet Jain
 * All rights reserved.
 */

if (
  process.env.RENDER !== 'true' ||
  process.env.MEETJAIN_PROTECTED !== 'true'
) {
  console.error('\n\n==============================\n⚠️  This project is protected by Meet Jain.\n⚠️  You are not authorized to run this code outside the official deployment.\n⚠️  Exiting...\n==============================\n');
  process.exit(1);
}

// Additional security: Only allow running if MongoDB URI contains your cluster name
const MONGO_CLUSTER = 'ac-lcza1ho-shard'; // Replace with your actual cluster name if different
if (!process.env.MONGO_URL || !process.env.MONGO_URL.includes(MONGO_CLUSTER)) {
  console.error('\n==============================\n⚠️  This project is protected by Meet Jain.\n⚠️  Invalid or missing MongoDB connection string.\n⚠️  Exiting...\n==============================\n');
  process.exit(1);
}

// Optional: Print a warning if the repo URL is not the owner's
const OWNER_REPO = 'https://github.com/Meetjain1/Trackilo';
if (process.env.REPOSITORY_URL && process.env.REPOSITORY_URL !== OWNER_REPO) {
  console.warn('\n==============================\n⚠️  WARNING: This project is not running from the official repository!\n⚠️  Official repo: ' + OWNER_REPO + '\n==============================\n');
}
