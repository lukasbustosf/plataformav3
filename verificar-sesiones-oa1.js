const { mockGameData } = require('./server/services/mockGameData');

console.log('🔍 VERIFICANDO SESIONES OA1 EN MOCKGAMEDATA');
console.log('=' .repeat(50));

// Obtener todas las sesiones
const allSessions = mockGameData.getGameSessions({});
console.log(`📊 Total de sesiones: ${allSessions.data.length}`);

// Buscar sesiones OA1
const oa1Sessions = allSessions.data.filter(s => 
  s.session_id?.includes('oa1_') || 
  s.title?.includes('OA1') || 
  s.settings_json?.specialized_component === 'FarmCountingGameOA1'
);

console.log(`🌾 Sesiones OA1 encontradas: ${oa1Sessions.length}`);
console.log('');

if (oa1Sessions.length > 0) {
  oa1Sessions.forEach((session, index) => {
    console.log(`${index + 1}. ${session.title}`);
    console.log(`   📍 ID: ${session.session_id}`);
    console.log(`   🎮 Join Code: ${session.join_code}`);
    console.log(`   📊 Status: ${session.status}`);
    console.log(`   🎯 Specialized Component: ${session.settings_json?.specialized_component}`);
    console.log(`   🌾 Theme: ${session.settings_json?.theme}`);
    console.log(`   📚 Bloom Level: ${session.settings_json?.bloom_level}`);
    console.log(`   🔢 Game Level: ${session.settings_json?.game_level}`);
    console.log('');
  });
} else {
  console.log('❌ No se encontraron sesiones OA1');
  console.log('');
  
  // Mostrar las últimas 10 sesiones para debug
  console.log('🔍 Últimas 10 sesiones creadas:');
  const recent = allSessions.data.slice(-10);
  recent.forEach((session, index) => {
    console.log(`${index + 1}. ${session.title || 'Sin título'}`);
    console.log(`   📍 ID: ${session.session_id}`);
    console.log(`   🎮 Join Code: ${session.join_code}`);
    console.log('');
  });
}

// Probar búsqueda específica
console.log('🔍 PROBANDO BÚSQUEDA ESPECÍFICA');
console.log('=' .repeat(50));

const testIds = [
  'oa1_pollitos_1752528828945',
  'oa1_gallinas_1752528828946', 
  'oa1_vacas_1752528828947',
  'oa1_granjero_1752528828948'
];

testIds.forEach(id => {
  console.log(`🔍 Buscando: ${id}`);
  const result = mockGameData.getGameSessionById(id, '550e8400-e29b-41d4-a716-446655440000');
  console.log(`   Resultado: ${result ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO'}`);
  if (result) {
    console.log(`   Título: ${result.title}`);
    console.log(`   Status: ${result.status}`);
  }
  console.log('');
});

console.log('✅ Verificación completada'); 