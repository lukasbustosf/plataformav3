/**
 * Sistema de permisos para el módulo de laboratorios móviles
 */

// Definición de roles y sus permisos
const ROLE_PERMISSIONS = {
  // Admin EDU21 - Acceso total
  admin_edu21: {
    // Gestión de productos y materiales
    create_product: true,
    edit_product: true,
    delete_product: true,
    view_products: true,
    manage_materials: true,
    
    // Gestión de actividades
    create_activity: true,
    edit_activity: true,
    delete_activity: true,
    view_activities: true,
    execute_activity: true,
    
    // Evidencias y logs
    upload_evidence: true,
    view_evidence: true,
    delete_evidence: true,
    view_activity_logs: true,
    export_logs: true,
    
    // Reportes y dashboard
    view_reports: true,
    view_dashboard: true,
    view_analytics: true,
    export_reports: true,
    
    // Configuración y administración
    admin_settings: true,
    manage_users: true,
    system_config: true,
    
    // Métricas y correlaciones
    view_metrics: true,
    calculate_correlations: true,
    
    // Bulk operations
    bulk_import: true,
    bulk_export: true
  },

  // Sostenedor/Dirección - Vista ejecutiva y gestión estratégica
  sostenedor: {
    // Solo lectura de productos
    view_products: true,
    
    // Vista limitada de actividades
    view_activities: true,
    
    // Solo visualización de evidencias
    view_evidence: true,
    view_activity_logs: true,
    
    // Acceso completo a reportes ejecutivos
    view_reports: true,
    view_dashboard: true,
    view_analytics: true,
    export_reports: true,
    
    // Sin acceso a configuración del sistema
    admin_settings: false,
    manage_users: false,
    system_config: false,
    
    // Acceso a métricas de alto nivel
    view_metrics: true,
    calculate_correlations: true,
    
    // Exportación de datos
    bulk_export: true
  },

  // Coordinador PIE/Mentor ABP - Gestión pedagógica completa
  coordinador_pie: {
    // Gestión completa de productos (excepto eliminación)
    create_product: true,
    edit_product: true,
    delete_product: false,
    view_products: true,
    manage_materials: true,
    
    // Gestión completa de actividades
    create_activity: true,
    edit_activity: true,
    delete_activity: false,
    view_activities: true,
    execute_activity: true,
    
    // Gestión de evidencias
    upload_evidence: true,
    view_evidence: true,
    delete_evidence: false,
    view_activity_logs: true,
    export_logs: true,
    
    // Reportes pedagógicos
    view_reports: true,
    view_dashboard: true,
    view_analytics: true,
    export_reports: true,
    
    // Sin acceso a administración del sistema
    admin_settings: false,
    manage_users: false,
    system_config: false,
    
    // Métricas pedagógicas
    view_metrics: true,
    calculate_correlations: true,
    
    // Exportación limitada
    bulk_export: false
  },

  // Docente - Ejecución y registro de actividades
  docente: {
    // Solo lectura de productos
    view_products: true,
    manage_materials: false,
    
    // Vista y ejecución de actividades (sin crear/editar)
    create_activity: false,
    edit_activity: false,
    delete_activity: false,
    view_activities: true,
    execute_activity: true,
    
    // Gestión básica de evidencias
    upload_evidence: true,
    view_evidence: true,
    delete_evidence: false,
    view_activity_logs: true,
    export_logs: false,
    
    // Reportes básicos
    view_reports: true,
    view_dashboard: false,
    view_analytics: false,
    export_reports: false,
    
    // Sin acceso administrativo
    admin_settings: false,
    manage_users: false,
    system_config: false,
    
    // Métricas básicas
    view_metrics: false,
    calculate_correlations: false,
    
    // Sin exportación masiva
    bulk_export: false
  },

  // Estudiante (futuro) - Solo visualización
  estudiante: {
    // Vista muy limitada
    view_products: false,
    view_activities: true, // Solo actividades asignadas
    view_evidence: true,   // Solo sus propias evidencias
    view_reports: false,
    
    // Sin permisos de gestión
    create_activity: false,
    edit_activity: false,
    execute_activity: false,
    upload_evidence: false,
    
    // Sin acceso administrativo
    admin_settings: false,
    view_dashboard: false,
    view_analytics: false
  }
};

// Permisos específicos por contexto
const CONTEXT_PERMISSIONS = {
  // Permisos a nivel de colegio
  school_level: {
    // Usuarios pueden ver solo datos de su colegio
    view_own_school_data: ['docente', 'coordinador_pie'],
    // Usuarios pueden ver datos de múltiples colegios
    view_multi_school_data: ['sostenedor', 'admin_edu21']
  },
  
  // Permisos temporales (horarios de trabajo)
  time_based: {
    // Horario de trabajo (6:00 - 22:00)
    work_hours: {
      start: 6,
      end: 22,
      applies_to: ['docente', 'coordinador_pie']
    }
  }
};

/**
 * Verifica si un usuario tiene un permiso específico
 * @param {object} user - Objeto usuario con role
 * @param {string} permission - Permiso a verificar
 * @returns {boolean} - Si tiene el permiso
 */
function checkLabPermissions(user, permission) {
  if (!user || !user.role) {
    return false;
  }
  
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (!rolePermissions) {
    return false;
  }
  
  return rolePermissions[permission] === true;
}

/**
 * Verifica múltiples permisos para un usuario
 * @param {object} user - Objeto usuario
 * @param {string[]} permissions - Array de permisos
 * @param {string} operator - 'AND' o 'OR' (default: 'AND')
 * @returns {boolean} - Resultado de la verificación
 */
function checkMultiplePermissions(user, permissions, operator = 'AND') {
  if (!Array.isArray(permissions)) {
    return false;
  }
  
  const results = permissions.map(permission => checkLabPermissions(user, permission));
  
  if (operator === 'OR') {
    return results.some(result => result === true);
  }
  
  return results.every(result => result === true);
}

/**
 * Verifica permisos contextuales (escuela, tiempo, etc.)
 * @param {object} user - Objeto usuario
 * @param {string} permission - Permiso base
 * @param {object} context - Contexto adicional
 * @returns {boolean} - Si tiene el permiso en el contexto
 */
function checkContextualPermissions(user, permission, context = {}) {
  // Verificar permiso base
  if (!checkLabPermissions(user, permission)) {
    return false;
  }
  
  // Verificar restricciones de escuela
  if (context.school_id && user.school_id) {
    const canViewMultipleSchools = CONTEXT_PERMISSIONS.school_level.view_multi_school_data.includes(user.role);
    
    if (!canViewMultipleSchools && user.school_id !== context.school_id) {
      return false;
    }
  }
  
  // Verificar restricciones de tiempo
  if (context.check_time !== false) {
    const timeRestrictions = CONTEXT_PERMISSIONS.time_based.work_hours;
    
    if (timeRestrictions.applies_to.includes(user.role)) {
      const currentHour = new Date().getHours();
      
      if (currentHour < timeRestrictions.start || currentHour >= timeRestrictions.end) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Obtiene todos los permisos de un rol
 * @param {string} role - Rol del usuario
 * @returns {object} - Objeto con todos los permisos
 */
function getRolePermissions(role) {
  return ROLE_PERMISSIONS[role] || {};
}

/**
 * Verifica si un usuario puede acceder a un recurso específico
 * @param {object} user - Usuario
 * @param {string} resource - Tipo de recurso
 * @param {string} action - Acción a realizar
 * @param {object} resourceData - Datos del recurso (opcional)
 * @returns {boolean} - Si puede acceder
 */
function canAccessResource(user, resource, action, resourceData = {}) {
  const permissionMap = {
    'product': {
      'read': 'view_products',
      'create': 'create_product',
      'update': 'edit_product',
      'delete': 'delete_product'
    },
    'activity': {
      'read': 'view_activities',
      'create': 'create_activity',
      'update': 'edit_activity',
      'delete': 'delete_activity',
      'execute': 'execute_activity'
    },
    'evidence': {
      'read': 'view_evidence',
      'create': 'upload_evidence',
      'delete': 'delete_evidence'
    },
    'report': {
      'read': 'view_reports',
      'export': 'export_reports'
    },
    'dashboard': {
      'read': 'view_dashboard'
    },
    'metrics': {
      'read': 'view_metrics',
      'calculate': 'calculate_correlations'
    }
  };
  
  const permission = permissionMap[resource]?.[action];
  if (!permission) {
    return false;
  }
  
  // Verificar permiso contextual
  const context = {
    school_id: resourceData.school_id,
    check_time: resourceData.check_time !== false
  };
  
  return checkContextualPermissions(user, permission, context);
}

/**
 * Filtra una lista de recursos según los permisos del usuario
 * @param {object} user - Usuario
 * @param {array} resources - Lista de recursos
 * @param {string} resourceType - Tipo de recurso
 * @returns {array} - Recursos filtrados
 */
function filterResourcesByPermissions(user, resources, resourceType) {
  if (!Array.isArray(resources)) {
    return [];
  }
  
  return resources.filter(resource => {
    return canAccessResource(user, resourceType, 'read', resource);
  });
}

/**
 * Genera middleware de autorización para Express
 * @param {string} permission - Permiso requerido
 * @param {object} options - Opciones adicionales
 * @returns {function} - Middleware
 */
function requirePermission(permission, options = {}) {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const context = {
      school_id: options.school_id || req.query.school_id || req.body.school_id,
      check_time: options.check_time !== false
    };
    
    if (!checkContextualPermissions(user, permission, context)) {
      return res.status(403).json({
        success: false,
        message: 'Permisos insuficientes para esta acción',
        required_permission: permission
      });
    }
    
    next();
  };
}

/**
 * Middleware para verificar acceso a recursos
 * @param {string} resourceType - Tipo de recurso
 * @param {string} action - Acción a realizar
 * @returns {function} - Middleware
 */
function requireResourceAccess(resourceType, action) {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const resourceData = {
      school_id: req.query.school_id || req.body.school_id,
      ...req.body
    };
    
    if (!canAccessResource(user, resourceType, action, resourceData)) {
      return res.status(403).json({
        success: false,
        message: `No tienes permisos para ${action} ${resourceType}`,
        resource_type: resourceType,
        action: action
      });
    }
    
    next();
  };
}

/**
 * Obtiene resumen de permisos para el frontend
 * @param {object} user - Usuario
 * @returns {object} - Resumen de permisos
 */
function getPermissionsSummary(user) {
  if (!user || !user.role) {
    return {};
  }
  
  const permissions = getRolePermissions(user.role);
  
  // Agrupar permisos por categoría para el frontend
  return {
    products: {
      canView: permissions.view_products,
      canCreate: permissions.create_product,
      canEdit: permissions.edit_product,
      canDelete: permissions.delete_product,
      canManageMaterials: permissions.manage_materials
    },
    activities: {
      canView: permissions.view_activities,
      canCreate: permissions.create_activity,
      canEdit: permissions.edit_activity,
      canDelete: permissions.delete_activity,
      canExecute: permissions.execute_activity
    },
    evidence: {
      canView: permissions.view_evidence,
      canUpload: permissions.upload_evidence,
      canDelete: permissions.delete_evidence
    },
    reports: {
      canView: permissions.view_reports,
      canViewDashboard: permissions.view_dashboard,
      canViewAnalytics: permissions.view_analytics,
      canExport: permissions.export_reports
    },
    admin: {
      canManageUsers: permissions.manage_users,
      canSystemConfig: permissions.system_config,
      canAdminSettings: permissions.admin_settings
    },
    role: user.role,
    school_restrictions: !CONTEXT_PERMISSIONS.school_level.view_multi_school_data.includes(user.role)
  };
}

module.exports = {
  checkLabPermissions,
  checkMultiplePermissions,
  checkContextualPermissions,
  getRolePermissions,
  canAccessResource,
  filterResourcesByPermissions,
  requirePermission,
  requireResourceAccess,
  getPermissionsSummary,
  ROLE_PERMISSIONS,
  CONTEXT_PERMISSIONS
}; 