import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError, UnauthorizedError, ValidationError } from '../utils/errors.js';

export const registerUser = async ({ name, email, password }) => {
  // Check if user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ValidationError('Email is already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  return generateTokens(user);
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return generateTokens(user);
};

export const refreshTokens = async (refreshToken) => {
  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    // Check token version to allow global logout (revocation)
    if (payload.tokenVersion !== user.refreshTokenVersion) {
      throw new UnauthorizedError('Token has been revoked');
    }

    return generateTokens(user);
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { sub: user._id, roles: user.roles },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { sub: user._id, tokenVersion: user.refreshTokenVersion },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    }
  };
};
