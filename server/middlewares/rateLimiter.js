import rateLimit from 'express-rate-limit';

// Global limiter — applies to every request
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per window per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

// Auth limiter — login / register (strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                   // 10 attempts per 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

// Contact form limiter — prevent message spam
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // 5 messages per hour
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Message limit reached. Please try again later.',
  },
});

// API read limiter — public GET endpoints (moderate)
export const apiReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,                  // 100 reads per 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

// API write limiter — admin CUD operations
export const apiWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,                   // 50 writes per 15 min
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});
