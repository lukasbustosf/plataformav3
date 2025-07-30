const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// 🚨 DEVELOPMENT: Disable rate limiting completely
const isDevelopment = process.env.NODE_ENV !== 'production';

// Basic rate limiter for all requests (DISABLED FOR DEV)
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minute for dev
  max: isDevelopment ? 999999 : (parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000), // UNLIMITED for dev
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000) / 1000)
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment, // 🚨 SKIP ALL RATE LIMITING IN DEV
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(options.statusCode).json(options.message);
  }
});

// Stricter rate limiter for authentication endpoints (DISABLED FOR DEV)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 999999 : 50, // UNLIMITED for dev
  message: {
    error: {
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: 900 // 15 minutes in seconds
    }
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment, // 🚨 SKIP ALL RATE LIMITING IN DEV
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Endpoint: ${req.path}`);
    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiter for game sessions (DISABLED FOR DEV)
const gameRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isDevelopment ? 999999 : 500, // UNLIMITED for dev
  message: {
    error: {
      message: 'Too many game requests, please slow down.',
      code: 'GAME_RATE_LIMIT_EXCEEDED',
      retryAfter: 60
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment, // 🚨 SKIP ALL RATE LIMITING IN DEV
  handler: (req, res, next, options) => {
    logger.warn(`Game rate limit exceeded for IP: ${req.ip}, User: ${req.user?.user_id}`);
    res.status(options.statusCode).json(options.message);
  }
});

// Rate limiter for file uploads (DISABLED FOR DEV)
const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDevelopment ? 999999 : 20, // UNLIMITED for dev
  message: {
    error: {
      message: 'Too many file uploads, please try again later.',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      retryAfter: 3600
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDevelopment, // 🚨 SKIP ALL RATE LIMITING IN DEV
  handler: (req, res, next, options) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}, User: ${req.user?.user_id}`);
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  gameRateLimiter,
  uploadRateLimiter
}; 
