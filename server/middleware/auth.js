const jwt = require('jsonwebtoken');
const { supabase } = require('../database/supabase');
const logger = require('../utils/logger');

// Middleware to authenticate JWT token
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    // HARDCODED USERS FOR DEVELOPMENT - SUPPORT MULTIPLE ROLES
    if (process.env.NODE_ENV === 'development') {
      // Extract role from token if it's a demo token
      let userRole = 'TEACHER'; // default
      if (token && token.startsWith('demo-token-')) {
        console.log('🔍 DEBUG: Token recibido:', token);
        console.log('🔍 DEBUG: Token incluye "superadmin"?', token.includes('superadmin'));
        console.log('🔍 DEBUG: Token incluye "teacher"?', token.includes('teacher'));
        
        if (token.includes('superadmin')) {
          userRole = 'SUPER_ADMIN_FULL';
          console.log('✅ DEBUG: Rol detectado como SUPER_ADMIN_FULL');
        }
        else if (token.includes('bienestar')) {
          userRole = 'BIENESTAR_ESCOLAR';
          console.log('✅ DEBUG: Rol detectado como BIENESTAR_ESCOLAR');
        }
        else if (token.includes('admin')) {
          userRole = 'ADMIN_ESCOLAR';
          console.log('✅ DEBUG: Rol detectado como ADMIN_ESCOLAR');
        }
        else if (token.includes('student')) {
          userRole = 'STUDENT';
          console.log('✅ DEBUG: Rol detectado como STUDENT');
        }
        else if (token.includes('teacher')) {
          userRole = 'TEACHER';
          console.log('✅ DEBUG: Rol detectado como TEACHER');
        }
        else {
          console.log('⚠️ DEBUG: No se detectó ningún rol específico, usando TEACHER por defecto');
        }
        console.log('🔍 DEBUG: Rol final asignado:', userRole);
      }
      
      const hardcodedUsers = {
        'SUPER_ADMIN_FULL': {
          user_id: '550e8400-e29b-41d4-a716-446655440005',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'superadmin@demo.edu21.cl',
          first_name: 'Super',
          last_name: 'Administrador',
          role: 'SUPER_ADMIN_FULL'
        },
        'TEACHER': {
          user_id: '550e8400-e29b-41d4-a716-446655440001',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'profesor@demo.edu21.cl',
          first_name: 'María',
          last_name: 'González',
          role: 'TEACHER'
        },
        'BIENESTAR_ESCOLAR': {
          user_id: '550e8400-e29b-41d4-a716-446655440002',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'bienestar@demo.edu21.cl',
          first_name: 'Ana',
          last_name: 'López',
          role: 'BIENESTAR_ESCOLAR'
        },
        'ADMIN_ESCOLAR': {
          user_id: '550e8400-e29b-41d4-a716-446655440003',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'director@demo.edu21.cl',
          first_name: 'Carlos',
          last_name: 'Ruiz',
          role: 'ADMIN_ESCOLAR'
        },
        'STUDENT': {
          user_id: '550e8400-e29b-41d4-a716-446655440004',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'estudiante@demo.edu21.cl',
          first_name: 'Diego',
          last_name: 'Silva',
          role: 'STUDENT'
        }
      };
      
      const selectedUser = hardcodedUsers[userRole] || hardcodedUsers['TEACHER'];
      
      req.user = {
        ...selectedUser,
        active: true,
        schools: {
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          school_name: 'Colegio Demo EDU21',
          school_code: 'DEMO001',
          active: true
        }
      };
      req.school_id = req.user.school_id;
      return next();
    }

    if (!token) {
      return res.status(401).json({
        error: {
          message: 'Access token required',
          code: 'NO_TOKEN'
        }
      });
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'development_jwt_secret_key_change_in_production';
    const decoded = jwt.verify(token, jwtSecret);
    
    // For development mode, if Supabase is not available, use mock user
    if (!supabase) {
      logger.warn('Supabase not available, using mock authentication for development');
      req.user = {
        user_id: decoded.user_id || 'mock-user-id',
        school_id: decoded.school_id || 'mock-school-id',
        email: decoded.email || 'mock@example.com',
        first_name: decoded.first_name || 'Mock',
        last_name: decoded.last_name || 'User',
        role: decoded.role || 'STUDENT',
        active: true
      };
      req.school_id = req.user.school_id;
      return next();
    }
    
    // Get user details from database
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
      logger.warn(`Authentication failed for token: ${error?.message}`);
      
      // For development, create a mock user if database lookup fails
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Using mock authentication for development');
        req.user = {
          user_id: decoded.user_id || 'mock-user-id',
          school_id: decoded.school_id || 'mock-school-id',
          email: decoded.email || 'mock@example.com',
          first_name: decoded.first_name || 'Mock',
          last_name: decoded.last_name || 'User',
          role: decoded.role || 'STUDENT',
          active: true
        };
        req.school_id = req.user.school_id;
        return next();
      }
      
      return res.status(401).json({
        error: {
          message: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        }
      });
    }

    // Check if school is active (only if schools data exists)
    if (user.schools && !user.schools.active) {
      return res.status(403).json({
        error: {
          message: 'School account is inactive',
          code: 'INACTIVE_SCHOOL'
        }
      });
    }

    // Attach user info to request
    req.user = user;
    req.school_id = user.school_id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          message: 'Invalid token format',
          code: 'MALFORMED_TOKEN'
        }
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          message: 'Token has expired',
          code: 'EXPIRED_TOKEN'
        }
      });
    }

    logger.error('Authentication error:', error);
    
    // For development, provide fallback
    if (process.env.NODE_ENV === 'development') {
      logger.warn('Authentication error in development, using fallback mock user');
      req.user = {
        user_id: 'mock-user-id',
        school_id: 'mock-school-id',
        email: 'mock@example.com',
        first_name: 'Mock',
        last_name: 'User',
        role: 'STUDENT',
        active: true
      };
      req.school_id = req.user.school_id;
      return next();
    }
    
    return res.status(500).json({
      error: {
        message: 'Authentication service error',
        code: 'AUTH_ERROR'
      }
    });
  }
}

// Middleware to check if user has required role
function requireRole(...allowedRoles) {
  const roles = allowedRoles.flat().map(role => role.toLowerCase()); // Convertir a minúsculas
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        error: {
          message: 'Authentication required or role not assigned',
          code: 'NO_USER_OR_ROLE'
        }
      });
    }

    const userRole = req.user.role.toLowerCase(); // Convertir a minúsculas

    if (!roles.includes(userRole)) {
      logger.warn(`Access denied. User ${req.user.user_id} with role ${req.user.role} tried to access resource requiring roles: ${roles.join(', ')}`);
      return res.status(403).json({
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required_roles: roles,
          user_role: req.user.role
        }
      });
    }

    next();
  };
}

// Middleware to check if user belongs to specific school (for multi-tenant security)
function requireSchoolAccess(req, res, next) {
  const requestedSchoolId = req.params.school_id || req.body.school_id || req.query.school_id;
  
  // Super admin can access any school
  if (req.user.role === 'SUPER_ADMIN_FULL') {
    return next();
  }
  
  // For other roles, check school access
  if (requestedSchoolId && requestedSchoolId !== req.user.school_id) {
    logger.warn(`School access denied. User ${req.user.user_id} from school ${req.user.school_id} tried to access school ${requestedSchoolId}`);
    return res.status(403).json({
      error: {
        message: 'Access denied to this school',
        code: 'SCHOOL_ACCESS_DENIED'
      }
    });
  }
  
  next();
}

// Helper function to generate JWT token
function generateToken(user) {
  const payload = {
    user_id: user.user_id,
    school_id: user.school_id,
    role: user.role,
    email: user.email,
    iat: Math.floor(Date.now() / 1000)
  };

  // Use a fallback JWT secret for development if env variable is not loaded
  const jwtSecret = process.env.JWT_SECRET || 'development_jwt_secret_key_change_in_production';
  
  if (!process.env.JWT_SECRET) {
    logger.warn('JWT_SECRET not found in environment, using fallback secret for development');
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// Helper function to decode token without verification (for debugging)
function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

module.exports = {
  authenticateToken,
  requireRole,
  requireSchoolAccess,
  generateToken,
  decodeToken
};
