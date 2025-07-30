async function globalTeardown(config) {
  console.log('🧹 Limpieza después de tests E2E del módulo de laboratorios...');
  
  try {
    // Aquí podrías limpiar datos de prueba si es necesario
    // Para un entorno de desarrollo, generalmente no es necesario
    
    console.log('✅ Teardown global completado');
  } catch (error) {
    console.error('❌ Error en teardown global:', error);
  }
}

module.exports = globalTeardown; 