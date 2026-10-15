import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Strict rate limiting for auth endpoints (register and login)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: 'error',
    message: 'Too many auth attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate-limited endpoints (Rule 1)
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

// Non rate-limited endpoints
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
