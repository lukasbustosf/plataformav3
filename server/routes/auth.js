const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { supabase, supabaseAdmin } = require('../database/supabase');
const { generateToken, authenticateToken, decodeToken } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

const router = express.Router();

// GET /api/auth/status - Check authentication status
router.get('/status', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: {
          message: 'No token provided',
          code: 'NO_TOKEN'
        }
      });
    }
    
    // Verify token
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      });
    }
    
    res.json({
      status: 'authenticated',
      user: {
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
        school_id: decoded.school_id
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Error in auth status endpoint:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
});

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  school_code: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).max(100).required(),
  last_name: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('ADMIN_ESCOLAR', 'TEACHER', 'STUDENT', 'GUARDIAN').required()
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: error.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const { email, password } = value;

    // Mock users for development when database is not available
    const mockUsers = {
      'admin@demo.edu21.cl': {
        user_id: 'mock-admin-id',
        school_id: 'mock-school-id',
        email: 'admin@demo.edu21.cl',
        password_hash: '$2a$10$mock.hash.for.demo123', // demo123
        first_name: 'Admin',
        last_name: 'Demo',
        role: 'ADMIN_ESCOLAR',
        active: true,
        last_login: null,
        schools: {
          school_id: 'mock-school-id',
          school_name: 'Colegio Demo EDU21',
          school_code: 'DEMO001',
          active: true
        }
      },
      'teacher@demo.edu21.cl': {
        user_id: 'mock-teacher-id',
        school_id: 'mock-school-id',
        email: 'teacher@demo.edu21.cl',
        password_hash: '$2a$10$mock.hash.for.demo123',
        first_name: 'Profesor',
        last_name: 'Demo',
        role: 'TEACHER',
        active: true,
        last_login: null,
        schools: {
          school_id: 'mock-school-id',
          school_name: 'Colegio Demo EDU21',
          school_code: 'DEMO001',
          active: true
        }
      },
      'estudiante@demo.edu21.cl': {
        user_id: 'mock-student-id',
        school_id: 'mock-school-id',
        email: 'estudiante@demo.edu21.cl',
        password_hash: '$2a$10$mock.hash.for.demo123',
        first_name: 'Estudiante',
        last_name: 'Demo',
        role: 'STUDENT',
        active: true,
        last_login: null,
        schools: {
          school_id: 'mock-school-id',
          school_name: 'Colegio Demo EDU21',
          school_code: 'DEMO001',
          active: true
        }
      },
      'profesor@demo.edu21.cl': {
        user_id: 'mock-teacher2-id',
        school_id: 'mock-school-id',
        email: 'profesor@demo.edu21.cl',
        password_hash: '$2a$10$mock.hash.for.demo123',
        first_name: 'Profesor',
        last_name: 'Demo',
        role: 'TEACHER',
        active: true,
        last_login: null,
        schools: {
          school_id: 'mock-school-id',
          school_name: 'Colegio Demo EDU21',
          school_code: 'DEMO001',
          active: true
        }
      }
    };

    // Check if this is a mock user first (for development)
    let user = null;
    let userError = null;

    if (mockUsers[email]) {
      // Use mock user directly
      logger.warn('Using mock authentication for development');
      user = mockUsers[email];
      userError = null;
    } else {
      // Try database for non-mock users
      try {
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select(`
            user_id,
            school_id,
            email,
            password_hash,
            first_name,
            last_name,
            role,
            active,
            last_login,
            schools (
              school_id,
              school_name,
              school_code,
              active
            )
          `)
          .eq('email', email)
          .eq('active', true)
          .single();
        
        user = dbUser;
        userError = dbError;
      } catch (error) {
        logger.warn('Database connection failed:', error.message);
        userError = error;
      }
    }

    if (userError || !user) {
      logger.warn(`Login attempt failed for email: ${email} - User not found`);
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Check if school is active
    if (!user.schools?.active) {
      return res.status(403).json({
        error: {
          message: 'School account is inactive',
          code: 'INACTIVE_SCHOOL'
        }
      });
    }

    // Verify password
    let passwordMatch = false;
    
    // For mock users, check if password is 'demo123'
    if (user.password_hash === '$2a$10$mock.hash.for.demo123') {
      passwordMatch = password === 'demo123';
    } else {
      // Real bcrypt comparison for actual database users
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    }
    
    if (!passwordMatch) {
      logger.warn(`Login attempt failed for email: ${email} - Invalid password`);
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        }
      });
    }

    // Update last login (skip for mock users)
    if (user.password_hash !== '$2a$10$mock.hash.for.demo123') {
      try {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', user.user_id);
      } catch (error) {
        logger.warn('Failed to update last_login:', error.message);
      }
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove sensitive data before sending response
    const { password_hash, ...userResponse } = user;

    logger.info(`Successful login for user: ${user.user_id}, role: ${user.role}`);

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
      expires_in: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Login service error',
        code: 'LOGIN_ERROR'
      }
    });
  }
});

// POST /api/auth/register
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: error.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const { school_code, email, password, first_name, last_name, role } = value;

    // Check if school exists and is active
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('school_id, school_name, active')
      .eq('school_code', school_code)
      .eq('active', true)
      .single();

    if (schoolError || !school) {
      return res.status(400).json({
        error: {
          message: 'Invalid or inactive school code',
          code: 'INVALID_SCHOOL_CODE'
        }
      });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: 'Email already registered',
          code: 'EMAIL_EXISTS'
        }
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        school_id: school.school_id,
        email,
        password_hash,
        first_name,
        last_name,
        role
      })
      .select(`
        user_id,
        school_id,
        email,
        first_name,
        last_name,
        role,
        created_at
      `)
      .single();

    if (createError) {
      logger.error('User creation failed:', createError);
      return res.status(500).json({
        error: {
          message: 'User registration failed',
          code: 'REGISTRATION_ERROR'
        }
      });
    }

    // Generate JWT token
    const userWithSchool = {
      ...newUser,
      schools: school
    };
    const token = generateToken(userWithSchool);

    logger.info(`New user registered: ${newUser.user_id}, role: ${newUser.role}, school: ${school.school_name}`);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        ...newUser,
        schools: school
      },
      expires_in: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      error: {
        message: 'Registration service error',
        code: 'REGISTRATION_ERROR'
      }
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Return current user info (already loaded in authenticateToken middleware)
    const { password_hash, ...userResponse } = req.user;
    
    res.json({
      user: userResponse
    });
  } catch (error) {
    logger.error('Get user info error:', error);
    res.status(500).json({
      error: {
        message: 'User info service error',
        code: 'USER_INFO_ERROR'
      }
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        error: {
          message: 'Refresh token required',
          code: 'NO_REFRESH_TOKEN'
        }
      });
    }

    // For now, we'll use the same token for refresh
    // In production, you might want to implement separate refresh tokens
    const decoded = decodeToken(refresh_token);
    
    if (!decoded) {
      return res.status(401).json({
        error: {
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        }
      });
    }

    // Get updated user info
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        user_id,
        school_id,
        email,
        first_name,
        last_name,
        role,
        active,
        schools (
          school_id,
          school_name,
          school_code,
          active
        )
      `)
      .eq('user_id', decoded.user_id)
      .eq('active', true)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: {
          message: 'User not found or inactive',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({
      message: 'Token refreshed successfully',
      token: newToken,
      expires_in: process.env.JWT_EXPIRES_IN || '7d'
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({
      error: {
        message: 'Token refresh service error',
        code: 'REFRESH_ERROR'
      }
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more sophisticated implementation, you might want to blacklist the token
    logger.info(`User logged out: ${req.user.user_id}`);
    
    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      error: {
        message: 'Logout service error',
        code: 'LOGOUT_ERROR'
      }
    });
  }
});

module.exports = router; 
