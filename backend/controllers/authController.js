import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import Joi from 'joi';

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username can only contain letters and numbers',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot be longer than 30 characters',
    'any.required': 'Username is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'any.required': 'Please confirm your password'
  })
});

const loginSchema = Joi.object({
  login: Joi.string()
    .required()
    .min(3)
    .max(255)
    .messages({
      'string.empty': 'Email or username is required',
      'string.min': 'Email or username must be at least 3 characters long',
      'string.max': 'Email or username is too long',
      'any.required': 'Email or username is required'
    }),
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

export const register = async (req, res) => {
  try {
    console.log(' Registration attempt from IP:', req.ip);
    
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        success: false,
        message: errorMessages[0],
        errors: errorMessages
      });
    }

    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email) || await User.findByUsername(username);
    if (existingUser) {
      console.log(' User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email or username' 
      });
    }

    // Create user
    const userId = await User.create({ username, email, password });
    
    console.log(' User registered successfully:', email);
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: { id: userId, username, email }
    });
  } catch (error) {
    console.error(' Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log(' Login attempt from IP:', req.ip);
    
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ 
        success: false,
        message: errorMessages[0],
        errors: errorMessages
      });
    }

    const { login: loginInput, password } = req.body;

    // Additional custom validation for email format if it looks like email
    if (loginInput.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginInput)) {
        console.log(' Invalid email format:', loginInput);
        return res.status(400).json({ 
          success: false,
          message: 'Please enter a valid email address'
        });
      }
    }

    // Find user by email or username
    let user = await User.findByEmail(loginInput);
    if (!user) {
      user = await User.findByUsername(loginInput);
    }

    if (!user) {
      console.log(' User not found:', loginInput);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email/username or password' 
      });
    }

    console.log(' User found:', user.email);

    // Validate password
    const isValidPassword = await User.validatePassword(password, user.password);
    if (!isValidPassword) {
      console.log(' Invalid password for user:', user.email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email/username or password' 
      });
    }

    console.log(' Password valid for user:', user.email);

    // Generate token
    const token = generateToken(user.id);

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    // Send success response
    const response = {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };

    console.log(' Login successful for user:', user.email);
    res.json(response);

  } catch (error) {
    console.error(' Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

export const logout = (req, res) => {
  console.log(' Logout request from IP:', req.ip);
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.json({ 
    success: true,
    message: 'Logout successful' 
  });
};

export const getMe = async (req, res) => {
  try {
    console.log('🔍 Get user info for ID:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
};

export const checkSession = async (req, res) => {
  try {
    console.log(' Session check for user ID:', req.user.id);
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Session expired'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      },
      message: 'Session is valid'
    });
  } catch (error) {
    console.error('❌ Session check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};