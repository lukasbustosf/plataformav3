/**
 * Validación de datos para actividades de laboratorio
 */

const VALID_AGE_RANGES = ['3-4', '4-5', '5-6', '6-7'];
const VALID_BLOOM_LEVELS = ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'];
const VALID_CATEGORIES = [
  'logica_matematica',
  'ciencias_naturales', 
  'lenguaje_comunicacion',
  'pensamiento_critico',
  'desarrollo_psicomotor',
  'desarrollo_socioemocional'
];
const VALID_METHODOLOGIES = [
  'montessori',
  'reggio_emilia',
  'waldorf',
  'freinet',
  'abp',
  'observacion_directa',
  'experimentacion',
  'juego_simbolico'
];

/**
 * Valida datos de una actividad de laboratorio
 * @param {object} activityData - Datos de la actividad
 * @returns {object} - Resultado de validación
 */
function validateActivityData(activityData) {
  const errors = [];
  
  // Validar título
  if (!activityData.title || typeof activityData.title !== 'string' || activityData.title.trim().length === 0) {
    errors.push('El título es requerido y debe ser un texto válido');
  } else if (activityData.title.length > 200) {
    errors.push('El título no puede exceder 200 caracteres');
  }
  
  // Validar descripción
  if (!activityData.description || typeof activityData.description !== 'string' || activityData.description.trim().length === 0) {
    errors.push('La descripción es requerida');
  } else if (activityData.description.length > 1000) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }
  
  // Validar rango de edad
  if (!activityData.age_range || !VALID_AGE_RANGES.includes(activityData.age_range)) {
    errors.push(`El rango de edad debe ser uno de: ${VALID_AGE_RANGES.join(', ')}`);
  }
  
  // Validar duración estimada
  if (activityData.estimated_duration !== undefined) {
    if (typeof activityData.estimated_duration !== 'number' || activityData.estimated_duration <= 0) {
      errors.push('La duración estimada debe ser un número positivo');
    } else if (activityData.estimated_duration > 180) {
      errors.push('La duración estimada no puede exceder 180 minutos');
    }
  }
  
  // Validar materiales necesarios
  if (activityData.materials_needed && !Array.isArray(activityData.materials_needed)) {
    errors.push('Los materiales necesarios deben ser un array');
  }
  
  // Validar alineación OA
  if (activityData.oa_alignment && typeof activityData.oa_alignment !== 'string') {
    errors.push('La alineación OA debe ser un texto');
  } else if (activityData.oa_alignment && !activityData.oa_alignment.match(/^OA\.\d{2}$/)) {
    errors.push('La alineación OA debe tener el formato "OA.XX" (ej: OA.01)');
  }
  
  // Validar nivel Bloom
  if (activityData.bloom_level && !VALID_BLOOM_LEVELS.includes(activityData.bloom_level)) {
    errors.push(`El nivel Bloom debe ser uno de: ${VALID_BLOOM_LEVELS.join(', ')}`);
  }
  
  // Validar categoría
  if (activityData.category && !VALID_CATEGORIES.includes(activityData.category)) {
    errors.push(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`);
  }
  
  // Validar metodología
  if (activityData.methodology && !VALID_METHODOLOGIES.includes(activityData.methodology)) {
    errors.push(`La metodología debe ser una de: ${VALID_METHODOLOGIES.join(', ')}`);
  }
  
  // Validar instrucciones paso a paso
  if (activityData.step_instructions && !Array.isArray(activityData.step_instructions)) {
    errors.push('Las instrucciones paso a paso deben ser un array');
  } else if (activityData.step_instructions) {
    activityData.step_instructions.forEach((step, index) => {
      if (typeof step !== 'string' || step.trim().length === 0) {
        errors.push(`El paso ${index + 1} debe ser un texto válido`);
      }
    });
  }
  
  // Validar recursos multimedia
  if (activityData.multimedia_resources && !Array.isArray(activityData.multimedia_resources)) {
    errors.push('Los recursos multimedia deben ser un array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida datos de un producto de laboratorio
 * @param {object} productData - Datos del producto
 * @returns {object} - Resultado de validación
 */
function validateProductData(productData) {
  const errors = [];
  
  // Validar nombre
  if (!productData.name || typeof productData.name !== 'string' || productData.name.trim().length === 0) {
    errors.push('El nombre es requerido y debe ser un texto válido');
  } else if (productData.name.length > 150) {
    errors.push('El nombre no puede exceder 150 caracteres');
  }
  
  // Validar descripción
  if (productData.description && productData.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres');
  }
  
  // Validar categoría
  if (!productData.category || !VALID_CATEGORIES.includes(productData.category)) {
    errors.push(`La categoría debe ser una de: ${VALID_CATEGORIES.join(', ')}`);
  }
  
  // Validar edades objetivo
  if (productData.target_ages && !Array.isArray(productData.target_ages)) {
    errors.push('Las edades objetivo deben ser un array');
  } else if (productData.target_ages) {
    const invalidAges = productData.target_ages.filter(age => !VALID_AGE_RANGES.includes(age));
    if (invalidAges.length > 0) {
      errors.push(`Edades objetivo inválidas: ${invalidAges.join(', ')}`);
    }
  }
  
  // Validar metodología
  if (productData.methodology && !VALID_METHODOLOGIES.includes(productData.methodology)) {
    errors.push(`La metodología debe ser una de: ${VALID_METHODOLOGIES.join(', ')}`);
  }
  
  // Validar especificaciones técnicas
  if (productData.technical_specs && typeof productData.technical_specs !== 'object') {
    errors.push('Las especificaciones técnicas deben ser un objeto');
  }
  
  // Validar consideraciones de seguridad
  if (productData.safety_considerations && !Array.isArray(productData.safety_considerations)) {
    errors.push('Las consideraciones de seguridad deben ser un array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida datos de ejecución de actividad
 * @param {object} executionData - Datos de ejecución
 * @returns {object} - Resultado de validación
 */
function validateExecutionData(executionData) {
  const errors = [];
  
  // Validar ID de actividad
  if (!executionData.activity_id || typeof executionData.activity_id !== 'number') {
    errors.push('El ID de actividad es requerido y debe ser un número');
  }
  
  // Validar IDs de estudiantes
  if (!executionData.student_ids || !Array.isArray(executionData.student_ids)) {
    errors.push('Los IDs de estudiantes son requeridos y deben ser un array');
  } else if (executionData.student_ids.length === 0) {
    errors.push('Debe haber al menos un estudiante');
  } else if (executionData.student_ids.length > 50) {
    errors.push('No pueden participar más de 50 estudiantes en una actividad');
  }
  
  // Validar materiales utilizados
  if (executionData.materials_used && !Array.isArray(executionData.materials_used)) {
    errors.push('Los materiales utilizados deben ser un array');
  } else if (executionData.materials_used) {
    executionData.materials_used.forEach((material, index) => {
      if (!material.id || typeof material.id !== 'number') {
        errors.push(`Material ${index + 1}: ID requerido`);
      }
      if (material.quantity !== undefined && (typeof material.quantity !== 'number' || material.quantity < 0)) {
        errors.push(`Material ${index + 1}: cantidad debe ser un número no negativo`);
      }
    });
  }
  
  // Validar duración
  if (executionData.duration_minutes !== undefined) {
    if (typeof executionData.duration_minutes !== 'number' || executionData.duration_minutes <= 0) {
      errors.push('La duración debe ser un número positivo');
    } else if (executionData.duration_minutes > 300) {
      errors.push('La duración no puede exceder 300 minutos');
    }
  }
  
  // Validar observaciones
  if (executionData.observations && executionData.observations.length > 2000) {
    errors.push('Las observaciones no pueden exceder 2000 caracteres');
  }
  
  // Validar evaluación de efectividad
  if (executionData.effectiveness_rating !== undefined) {
    if (typeof executionData.effectiveness_rating !== 'number' || 
        executionData.effectiveness_rating < 1 || 
        executionData.effectiveness_rating > 5) {
      errors.push('La evaluación de efectividad debe ser un número entre 1 y 5');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida datos de evidencia
 * @param {object} evidenceData - Datos de evidencia
 * @returns {object} - Resultado de validación
 */
function validateEvidenceData(evidenceData) {
  const errors = [];
  
  // Validar ID de log de actividad
  if (!evidenceData.activity_log_id || typeof evidenceData.activity_log_id !== 'number') {
    errors.push('El ID de log de actividad es requerido');
  }
  
  // Validar tipo de evidencia
  const validTypes = ['foto', 'video', 'audio', 'documento'];
  if (!evidenceData.evidence_type || !validTypes.includes(evidenceData.evidence_type)) {
    errors.push(`El tipo de evidencia debe ser uno de: ${validTypes.join(', ')}`);
  }
  
  // Validar descripción
  if (evidenceData.description && evidenceData.description.length > 500) {
    errors.push('La descripción no puede exceder 500 caracteres');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida filtros de búsqueda
 * @param {object} filters - Filtros de búsqueda
 * @returns {object} - Resultado de validación
 */
function validateSearchFilters(filters) {
  const errors = [];
  
  // Validar rango de edad
  if (filters.age_range && !VALID_AGE_RANGES.includes(filters.age_range)) {
    errors.push(`Rango de edad inválido: ${filters.age_range}`);
  }
  
  // Validar nivel Bloom
  if (filters.bloom_level && !VALID_BLOOM_LEVELS.includes(filters.bloom_level)) {
    errors.push(`Nivel Bloom inválido: ${filters.bloom_level}`);
  }
  
  // Validar categoría
  if (filters.category && !VALID_CATEGORIES.includes(filters.category)) {
    errors.push(`Categoría inválida: ${filters.category}`);
  }
  
  // Validar metodología
  if (filters.methodology && !VALID_METHODOLOGIES.includes(filters.methodology)) {
    errors.push(`Metodología inválida: ${filters.methodology}`);
  }
  
  // Validar paginación
  if (filters.page !== undefined) {
    if (typeof filters.page !== 'number' || filters.page < 1) {
      errors.push('La página debe ser un número mayor a 0');
    }
  }
  
  if (filters.limit !== undefined) {
    if (typeof filters.limit !== 'number' || filters.limit < 1 || filters.limit > 100) {
      errors.push('El límite debe ser un número entre 1 y 100');
    }
  }
  
  // Validar fechas
  if (filters.date_from && !isValidDate(filters.date_from)) {
    errors.push('Fecha desde inválida');
  }
  
  if (filters.date_to && !isValidDate(filters.date_to)) {
    errors.push('Fecha hasta inválida');
  }
  
  if (filters.date_from && filters.date_to && new Date(filters.date_from) > new Date(filters.date_to)) {
    errors.push('La fecha desde no puede ser posterior a la fecha hasta');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida formato de fecha
 * @param {string} dateString - Fecha en formato string
 * @returns {boolean} - Si la fecha es válida
 */
function isValidDate(dateString) {
  if (typeof dateString !== 'string') return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Sanitiza texto eliminando caracteres peligrosos
 * @param {string} text - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+\s*=/gi, ''); // Remover event handlers
}

/**
 * Valida estructura de datos recursivamente
 * @param {any} data - Datos a validar
 * @param {object} schema - Esquema de validación
 * @returns {object} - Resultado de validación
 */
function validateSchema(data, schema) {
  const errors = [];
  
  function validateField(value, fieldSchema, path = '') {
    if (fieldSchema.required && (value === undefined || value === null)) {
      errors.push(`Campo requerido faltante: ${path}`);
      return;
    }
    
    if (value === undefined || value === null) return;
    
    // Validar tipo
    if (fieldSchema.type && typeof value !== fieldSchema.type) {
      errors.push(`Tipo incorrecto en ${path}: esperado ${fieldSchema.type}, recibido ${typeof value}`);
      return;
    }
    
    // Validar longitud para strings
    if (fieldSchema.type === 'string') {
      if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
        errors.push(`${path} muy corto: mínimo ${fieldSchema.minLength} caracteres`);
      }
      if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
        errors.push(`${path} muy largo: máximo ${fieldSchema.maxLength} caracteres`);
      }
    }
    
    // Validar rangos para números
    if (fieldSchema.type === 'number') {
      if (fieldSchema.min !== undefined && value < fieldSchema.min) {
        errors.push(`${path} muy pequeño: mínimo ${fieldSchema.min}`);
      }
      if (fieldSchema.max !== undefined && value > fieldSchema.max) {
        errors.push(`${path} muy grande: máximo ${fieldSchema.max}`);
      }
    }
    
    // Validar arrays
    if (fieldSchema.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push(`${path} debe ser un array`);
        return;
      }
      if (fieldSchema.items) {
        value.forEach((item, index) => {
          validateField(item, fieldSchema.items, `${path}[${index}]`);
        });
      }
    }
    
    // Validar objetos
    if (fieldSchema.type === 'object' && fieldSchema.properties) {
      Object.keys(fieldSchema.properties).forEach(key => {
        validateField(value[key], fieldSchema.properties[key], `${path}.${key}`);
      });
    }
    
    // Validar enum
    if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
      errors.push(`${path} debe ser uno de: ${fieldSchema.enum.join(', ')}`);
    }
  }
  
  if (schema.properties) {
    Object.keys(schema.properties).forEach(key => {
      validateField(data[key], schema.properties[key], key);
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateActivityData,
  validateProductData,
  validateExecutionData,
  validateEvidenceData,
  validateSearchFilters,
  validateSchema,
  sanitizeText,
  isValidDate,
  VALID_AGE_RANGES,
  VALID_BLOOM_LEVELS,
  VALID_CATEGORIES,
  VALID_METHODOLOGIES
}; 