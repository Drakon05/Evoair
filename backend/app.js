import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import pinoHttp from 'pino-http';
import crypto from 'crypto';
import mongoose from 'mongoose';

import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; // Existing routes

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS (Strict allowed origin)
app.use(cors({ origin: env.CORS_ORIGIN }));

// 3. Request Logging & Tracing
app.use(
  pinoHttp({
    logger,
    genReqId: () => crypto.randomUUID(),
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
      if (res.statusCode >= 500 || err) return 'error';
      return 'info';
    },
  })
);

// 4. Rate Limiting will go here (Phase 3)

// 5. Body Parsing with strict limits (DoS protection)
// Note: Webhook raw parsing (Phase 6) will be inserted BEFORE this in the future
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Data Sanitization against NoSQL query injection
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  if (req.params) mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  // Express 5 makes req.query a getter, so we sanitize its properties in place
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      req.query[key] = mongoSanitize.sanitize(req.query[key], { replaceWith: '_' });
    }
  }
  next();
});

// 7. Response Compression
app.use(compression());

// --- ROUTES ---

// Health check endpoint (Real DB ping)
app.get('/health', async (req, res) => {
  try {
    // Ping MongoDB to check if it's actually alive
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ status: 'OK', message: 'Healthy', db: 'Connected' });
  } catch (error) {
    logger.error('Health check failed: DB not responding');
    res.status(503).json({ status: 'ERROR', message: 'Service Unavailable', db: 'Disconnected' });
  }
});

// Initialize Passport for Auth
app.use(passport.initialize());

// API Versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);

// Catch-all for unknown routes
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

export default app;
