import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import crypto from 'crypto';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { checkDbHealth } from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS (Strict allowed origin with credentials)
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

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

// 5. Body Parsing with strict limits (DoS protection) & Cookie Parser
// Note: Webhook raw parsing (Phase 6) will be inserted BEFORE this in the future
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 6. Response Compression
app.use(compression());

// --- ROUTES ---

// Health check endpoint (PostgreSQL ping)
app.get('/health', async (req, res) => {
  try {
    await checkDbHealth();
    res.status(200).json({ status: 'OK', message: 'Healthy', db: 'Connected' });
  } catch (error) {
    logger.error('Health check failed: DB not responding');
    res.status(503).json({ status: 'ERROR', message: 'Service Unavailable', db: 'Disconnected' });
  }
});

// API Versioning
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/orders', orderRoutes);

// Catch-all for unknown routes
app.use(notFoundHandler);

// Centralized Error Handling
app.use(errorHandler);

export default app;
