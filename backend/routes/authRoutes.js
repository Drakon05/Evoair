import express from 'express';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Strict rate limiting for auth routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: { status: 'error', message: 'Too many auth attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authLimiter, authController.refresh);

// Protected route example
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  authController.getMe
);

export default router;
