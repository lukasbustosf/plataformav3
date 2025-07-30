#!/usr/bin/env node
/**
 * 🔍 DEBUG SINGLETON TEST
 * Verificar si hay problemas con la instancia singleton
 */

console.log('🔍 === DEBUG SINGLETON TEST ===\n');

// Simular lo que hace el servidor
const { mockGameData } = require('./server/services/mockGameData');

console.log('🧪 Probando mockGameData directamente...');

// 1. Verificar estado inicial
console.log(`📊 Estado inicial: ${mockGameData.gameSessions.length} sesiones`);

// 2. Crear una sesión de prueba directamente
const testSession = {
  session_id: 'test_direct_' + Date.now(),
  quiz_id: 'test_quiz_123',
  school_id: '550e8400-e29b-41d4-a716-446655440000',
  host_id: 'teacher-123',
  join_code: 'TEST01',
  title: 'Test Direct Session',
  description: 'Sesión de prueba directa',
  format: 'trivia_lightning',
  status: 'waiting',
  settings_json: {
    max_players: 30,
    time_limit: 300
  },
  created_at: new Date().toISOString(),
  participants: [],
  
  // Datos del quiz
  quizzes: {
    quiz_id: 'test_quiz_123',
    title: 'Test Quiz',
    description: 'Quiz de prueba',
    questions: [
      {
        question_id: 'q1',
        question_order: 1,
        stem_md: '¿Cuánto es 2 + 2?',
        type: 'multiple_choice',
        options_json: ['3', '4', '5', '6'],
        correct_answer: '4',
        explanation: '2 + 2 = 4',
        points: 10
      }
    ]
  }
};

console.log('\n💾 Añadiendo sesión directamente...');
const addResult = mockGameData.addGameSession(testSession);
console.log(`✅ Sesión añadida: ${testSession.session_id}`);

// 3. Verificar estado después de añadir
console.log(`📊 Estado después de añadir: ${mockGameData.gameSessions.length} sesiones`);

// 4. Buscar la sesión inmediatamente
console.log('\n🔍 Buscando sesión inmediatamente...');
const searchResult = mockGameData.getGameSessionById(testSession.session_id, testSession.school_id);

if (searchResult && searchResult.data) {
  console.log(`✅ ÉXITO: Sesión encontrada directamente`);
  console.log(`   Título: ${searchResult.data.title}`);
} else {
  console.log(`❌ FALLO: Sesión NO encontrada directamente`);
  console.log(`   Error: ${searchResult?.error?.message || 'Unknown error'}`);
}

// 5. Listar todas las sesiones para verificar
console.log('\n📋 Listando todas las sesiones actuales:');
mockGameData.gameSessions.forEach((session, index) => {
  console.log(`   ${index}: ${session.session_id} (${session.title}) - School: ${session.school_id}`);
});

// 6. Buscar con school_id incorrecto para probar filtro
console.log('\n🔍 Probando búsqueda con school_id incorrecto...');
const wrongSchoolResult = mockGameData.getGameSessionById(testSession.session_id, 'wrong-school-id');

if (wrongSchoolResult && wrongSchoolResult.data) {
  console.log(`❌ PROBLEMA: Encontró sesión con school_id incorrecto`);
} else {
  console.log(`✅ CORRECTO: No encontró sesión con school_id incorrecto`);
}

console.log('\n📊 RESUMEN:');
console.log(`   Total sesiones en memoria: ${mockGameData.gameSessions.length}`);
console.log(`   Búsqueda directa: ${searchResult?.data ? 'ÉXITO' : 'FALLO'}`);
console.log(`   Filtro school_id: ${wrongSchoolResult?.data ? 'FALLO' : 'ÉXITO'}`);
console.log('\n🏁 Test de singleton completado'); 