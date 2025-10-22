import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Dashboard!',
    user: req.user
  });
});

export default router;