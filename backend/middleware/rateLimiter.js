import rateLimit from 'express-rate-limit';


const blockedIPs = new Map();

// Rate limiter untuk login - 5 percobaan per menit per IP
export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 5, // Maksimal 5 percobaan per IP per menit
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 1 minute.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (req, res, next, options) => {
    const ip = req.ip;
    const now = Date.now();
    
    // Track blocked IPs
    if (!blockedIPs.has(ip)) {
      blockedIPs.set(ip, { count: 1, firstAttempt: now });
    } else {
      const ipData = blockedIPs.get(ip);
      ipData.count += 1;
    }
    
    console.log(` Rate limit exceeded for IP: ${ip}, Attempts: ${blockedIPs.get(ip)?.count || 1}`);
    
    res.status(429).json({
      success: false,
      message: options.message,
      retryAfter: Math.ceil(options.windowMs / 1000),
      limit: options.max,
      windowMs: options.windowMs,
      ip: ip
    });
  },
  skipSuccessfulRequests: true, // Tidak hitung request yang berhasil
  skip: (req) => {
    // Skip rate limiting untuk development environment (opsional)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode - Rate limiting skipped for:', req.ip);
      return true;
    }
    return false;
  }
});

// Rate limiter untuk register - 3 percobaan per 15 menit per IP
export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, // Maksimal 3 registrasi per IP per 15 menit
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.log(` Registration rate limit exceeded for IP: ${req.ip}`);
    
    res.status(429).json({
      success: false,
      message: options.message,
      retryAfter: Math.ceil(options.windowMs / 1000),
      limit: options.max,
      windowMs: options.windowMs
    });
  }
});

// Global rate limiter untuk API - 100 request per 15 menit per IP
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, 
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(429).json({
      success: false,
      message: options.message,
      retryAfter: Math.ceil(options.windowMs / 1000),
      limit: options.max,
      windowMs: options.windowMs
    });
  }
});


export const getRateLimitStatus = () => {
  return {
    blockedIPs: Array.from(blockedIPs.entries()).map(([ip, data]) => ({
      ip,
      attempts: data.count,
      firstAttempt: new Date(data.firstAttempt).toISOString(),
      blockedFor: Math.ceil((data.firstAttempt + 60000 - Date.now()) / 1000) // seconds remaining
    }))
  };
};