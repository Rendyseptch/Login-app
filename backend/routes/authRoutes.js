import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  checkSession 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { loginRateLimiter, registerRateLimiter, getRateLimitStatus } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting
router.post('/register', registerRateLimiter, register);
router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);
router.get('/check-session', authenticateToken, checkSession);

// Route untuk monitoring rate limit status (opsional, hapus di production)
router.get('/rate-limit-status', (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  res.json({
    success: true,
    data: getRateLimitStatus()
  });
});

export default router;