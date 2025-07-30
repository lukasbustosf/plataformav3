/**
 * CONFIGURACIÓN TEMPORAL - FUNCIONES DESACTIVADAS
 * 
 * Las siguientes funciones han sido desactivadas temporalmente
 * para evitar errores de base de datos:
 * 
 * 1. Auto-grading (cron jobs)
 * 2. Evaluation attempts tracking
 * 3. Reports that use evaluation_attempts
 * 4. ClassBook functions that use evaluation_attempts
 * 
 * Para reactivar estas funciones:
 * 1. Configurar correctamente la base de datos
 * 2. Crear las tablas faltantes
 * 3. Ejecutar: node enable-all-functions.js
 */

module.exports = {
  // Auto-grading disabled
  AUTO_GRADING_ENABLED: false,
  
  // Evaluation attempts disabled
  EVALUATION_ATTEMPTS_ENABLED: false,
  
  // Reports disabled
  REPORTS_ENABLED: false,
  
  // ClassBook disabled
  CLASSBOOK_ENABLED: false,
  
  // Mock data enabled
  MOCK_DATA_ENABLED: true,
  
  // Database connection status
  DATABASE_CONNECTED: false
}; 