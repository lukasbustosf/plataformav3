const { supabase } = require('../database/supabase');

// Permission matrix for P1 compliance
const ROLE_PERMISSIONS = {
  SUPER_ADMIN_FULL: [
    'school.manage', 'user.manage', 'ai_budget.manage', 'system.admin',
    'quiz.manage', 'evaluation.manage', 'lockdown.global', 'impersonate.any'
  ],
  ADMIN_ESCOLAR: [
    'curriculum.manage', 'timetable.manage', 'lesson_plan.view', 'oa_report.generate',
    'gradebook.view', 'attendance.manage', 'evaluation.manage', 'class.manage'
  ],
  BIENESTAR_ESCOLAR: [
    'pai.create', 'risk_student.manage', 'support_case.manage', 'bienestar.dashboard'
  ],
  TEACHER: [
    'quiz.create', 'quiz.update', 'quiz.delete', 'game.create', 'evaluation.create',
    'lesson_plan.create', 'attendance.take', 'gradebook.update', 'ai_service.use'
  ],
  STUDENT: [
    'quiz.attempt', 'game.play', 'evaluation.attempt', 'profile.view'
  ],
  GUARDIAN: [
    'student_progress.view', 'attendance.view', 'gradebook.view', 'messages.receive'
  ],
  SOSTENEDOR: [
    'school.view', 'ai_budget.view', 'dashboard.executive', 'bloom_analytics.view',
    'financial.view', 'benchmarking.view'
  ]
};

// Resource-level permissions
const RESOURCE_PERMISSIONS = {
  quiz: {
    create: ['TEACHER', 'ADMIN_ESCOLAR'],
    read: ['TEACHER', 'STUDENT', 'ADMIN_ESCOLAR', 'GUARDIAN'],
    update: ['TEACHER', 'ADMIN_ESCOLAR'],
    delete: ['TEACHER', 'ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'],
    ai_generate: ['TEACHER', 'ADMIN_ESCOLAR']
  },
  evaluation: {
    create: ['TEACHER', 'ADMIN_ESCOLAR'],
    launch: ['TEACHER', 'ADMIN_ESCOLAR'],
    grade: ['TEACHER', 'ADMIN_ESCOLAR'],
    view_results: ['TEACHER', 'ADMIN_ESCOLAR', 'STUDENT', 'GUARDIAN']
  },
  ai_service: {
    use: ['TEACHER', 'ADMIN_ESCOLAR'],
    budget_manage: ['SUPER_ADMIN_FULL', 'SOSTENEDOR'],
    cost_view: ['TEACHER', 'ADMIN_ESCOLAR', 'SOSTENEDOR']
  },
  pai: {
    create: ['BIENESTAR_ESCOLAR'],
    view: ['BIENESTAR_ESCOLAR', 'ADMIN_ESCOLAR', 'TEACHER'],
    sign: ['BIENESTAR_ESCOLAR', 'ADMIN_ESCOLAR']
  },
  lesson_plan: {
    create: ['TEACHER'],
    view: ['TEACHER', 'ADMIN_ESCOLAR'],
    approve: ['ADMIN_ESCOLAR']
  }
};

/**
 * Check if user has permission for specific action
 */
function hasPermission(userRole, permission) {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check resource-level permission
 */
function hasResourcePermission(userRole, resource, action) {
  const resourcePerms = RESOURCE_PERMISSIONS[resource];
  if (!resourcePerms || !resourcePerms[action]) {
    return false;
  }
  return resourcePerms[action].includes(userRole);
}

/**
 * Check if user owns resource or has elevated permissions
 */
async function checkResourceOwnership(userId, resourceType, resourceId, userRole) {
  // Super admins can access everything
  if (userRole === 'SUPER_ADMIN_FULL') {
    return true;
  }

  try {
    let query;
    
    switch (resourceType) {
      case 'quiz':
        query = supabase
          .from('quizzes')
          .select('author_id, school_id')
          .eq('quiz_id', resourceId)
          .single();
        break;
      
      case 'evaluation':
        query = supabase
          .from('evaluations')
          .select('teacher_id, school_id')
          .eq('eval_id', resourceId)
          .single();
        break;
      
      case 'lesson_plan':
        query = supabase
          .from('lesson_plans')
          .select('creator_id, school_id')
          .eq('plan_id', resourceId)
          .single();
        break;
      
      default:
        return false;
    }

    const { data, error } = await query;
    
    if (error || !data) {
      return false;
    }

    // Check ownership
    const ownerField = resourceType === 'evaluation' ? 'teacher_id' : 
                      resourceType === 'lesson_plan' ? 'creator_id' : 'author_id';
    
    return data[ownerField] === userId;
    
  } catch (error) {
    console.error('Resource ownership check error:', error);
    return false;
  }
}

/**
 * RBAC Middleware for route protection
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        error: `Insufficient permissions. Required: ${permission}`
      });
    }

    next();
  };
}

/**
 * Resource-level RBAC middleware
 */
function requireResourcePermission(resource, action) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!hasResourcePermission(req.user.role, resource, action)) {
      return res.status(403).json({
        success: false,
        error: `Insufficient permissions for ${resource}.${action}`
      });
    }

    next();
  };
}

/**
 * Ownership-based RBAC middleware
 */
function requireOwnership(resourceType, resourceIdParam = 'id') {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const resourceId = req.params[resourceIdParam];
    
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        error: 'Resource ID required'
      });
    }

    const hasAccess = await checkResourceOwnership(
      req.user.user_id,
      resourceType,
      resourceId,
      req.user.role
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'You do not own this resource or lack permissions'
      });
    }

    next();
  };
}

/**
 * School-level access control
 */
function requireSameSchool(req, res, next) {
  // Add school_id filter to queries automatically
  req.schoolFilter = { school_id: req.user.school_id };
  next();
}

/**
 * P1 Compliance: Time-based access control for PAI creation
 */
function requireTimeLimit(maxMinutes = 5) {
  return (req, res, next) => {
    req.startTime = Date.now();
    req.timeLimit = maxMinutes * 60 * 1000; // Convert to milliseconds
    next();
  };
}

/**
 * Validate P1 compliance for operations
 */
function validateP1Compliance(feature) {
  return (req, res, next) => {
    // P1 feature validation logic
    const p1Features = {
      'pai_creation': {
        timeLimit: 5 * 60 * 1000, // 5 minutes
        requiredRole: 'BIENESTAR_ESCOLAR'
      },
      'quiz_generation': {
        maxDuration: 60 * 1000, // 60 seconds
        requiredOAAlignment: 0.95
      },
      'lockdown_mode': {
        requiredRole: ['TEACHER', 'ADMIN_ESCOLAR'],
        auditRequired: true
      }
    };

    const featureConfig = p1Features[feature];
    if (!featureConfig) {
      return next();
    }

    // Validate role
    if (featureConfig.requiredRole) {
      const allowedRoles = Array.isArray(featureConfig.requiredRole) 
        ? featureConfig.requiredRole 
        : [featureConfig.requiredRole];
      
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: `P1 Compliance: Role ${req.user.role} not authorized for ${feature}`
        });
      }
    }

    // Add P1 metadata to request
    req.p1Compliance = {
      feature,
      config: featureConfig,
      startTime: Date.now()
    };

    next();
  };
}

module.exports = {
  hasPermission,
  hasResourcePermission,
  checkResourceOwnership,
  requirePermission,
  requireResourcePermission,
  requireOwnership,
  requireSameSchool,
  requireTimeLimit,
  validateP1Compliance,
  ROLE_PERMISSIONS,
  RESOURCE_PERMISSIONS
}; 
