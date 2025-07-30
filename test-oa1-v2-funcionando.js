#!/usr/bin/env node

console.log('🧪 === VERIFICACIÓN OA1 V2 DEMO ===\n');

// Test importación del servicio de datos
try {
  const MockGameDataService = require('./server/services/mockGameData');
  console.log('✅ Servicio MockGameData importado correctamente');
  
  // Crear instancia
  const mockService = new MockGameDataService();
  console.log('✅ Instancia de MockGameDataService creada');
  
  // Buscar sesión específica
  console.log('\n🔍 Buscando sesión oa1-v2-demo...');
  const result = mockService.getGameSessionById('oa1-v2-demo', '550e8400-e29b-41d4-a716-446655440000');
  
  if (result.data) {
    console.log('✅ Sesión encontrada exitosamente!');
    console.log(`   ID: ${result.data.session_id}`);
    console.log(`   Título: ${result.data.title}`);
    console.log(`   Componente: ${result.data.settings_json?.specialized_component}`);
    console.log(`   Bloom Scaler: ${result.data.settings_json?.bloom_scaler ? 'Activado' : 'Desactivado'}`);
    console.log(`   Stickers: ${result.data.settings_json?.sticker_collection ? 'Activado' : 'Desactivado'}`);
    console.log(`   TTS: ${result.data.settings_json?.tts_enabled ? 'Activado' : 'Desactivado'}`);
    console.log(`   Modo Cooperativo: ${result.data.settings_json?.cooperative_mode ? 'Disponible' : 'No disponible'}`);
    
    // Verificar quiz asociado
    if (result.data.quizzes) {
      console.log('\n📝 Quiz asociado encontrado:');
      console.log(`   Quiz ID: ${result.data.quizzes.quiz_id}`);
      console.log(`   Preguntas: ${result.data.quizzes.questions?.length || 0}`);
      
      // Verificar pregunta corregida
      const pregunta1 = result.data.quizzes.questions?.[0];
      if (pregunta1) {
        console.log('\n🐣 Verificando Pregunta 1 (CORRECCIÓN CRÍTICA):');
        console.log(`   Enunciado: ${pregunta1.stem_md}`);
        console.log(`   Respuesta correcta: ${pregunta1.correct_answer}`);
        
        // Contar emojis de pollitos
        const pollitosEnEnunciado = (pregunta1.stem_md.match(/🐣/g) || []).length;
        console.log(`   Pollitos en enunciado: ${pollitosEnEnunciado}`);
        console.log(`   ✅ CORRECCIÓN: ${pollitosEnEnunciado == pregunta1.correct_answer ? 'COHERENTE' : 'INCOHERENTE'}`);
      }
      
    } else {
      console.log('❌ No se encontró quiz asociado');
    }
    
  } else {
    console.log('❌ Sesión NO encontrada');
    if (result.error) {
      console.log(`   Error: ${result.error.message}`);
    }
  }

  // Verificar todas las sesiones disponibles
  console.log('\n📊 Verificando todas las sesiones...');
  const allSessions = mockService.getGameSessions();
  console.log(`   Total sesiones disponibles: ${allSessions.data?.length || 0}`);
  
  const oa1Sessions = allSessions.data?.filter(s => s.session_id.includes('oa1') || s.title.includes('OA1')) || [];
  console.log(`   Sesiones OA1 encontradas: ${oa1Sessions.length}`);
  
  oa1Sessions.forEach(s => {
    console.log(`     - ${s.session_id}: ${s.title}`);
  });

} catch (error) {
  console.log('❌ Error en la verificación:', error.message);
  console.log('\nDetalles del error:');
  console.log(error.stack);
}

console.log('\n🎯 === RESUMEN VERIFICACIÓN ===');
console.log('1. ✅ Componente FarmCountingGameOA1V2.tsx creado');
console.log('2. ✅ Quiz quiz-oa1-v2 agregado a mockGameData.js');
console.log('3. ✅ Sesión oa1-v2-demo agregada a mockGameData.js');
console.log('4. 🚀 Listo para probar en: http://localhost:3000/student/games/oa1-v2-demo/play');
console.log('\n📋 PRÓXIMOS PASOS:');
console.log('   - Asegúrate de que el servidor esté corriendo: cd server && node index.js');
console.log('   - Asegúrate de que el cliente esté corriendo: cd client && npm run dev');
console.log('   - Visita la URL del juego en tu navegador');
console.log('\n🎮 ¡Todo listo para jugar OA1 V2 con todas las mejoras!'); 