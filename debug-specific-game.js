// Script de debug específico para game-demo-001
const { mockGameData } = require('./server/services/mockGameData');
const { setupLocalDevelopment, LOCAL_DEMO_DATA } = require('./server/database/local-config');

console.log('🎮 === DEBUG ESPECÍFICO game-demo-001 ===\n');

// 1. Verificar estado inicial
console.log('1. Estado inicial:');
console.log(`   mockGameData.gameSessions.length: ${mockGameData.gameSessions.length}`);
console.log(`   LOCAL_DEMO_DATA.games.length: ${LOCAL_DEMO_DATA.games.length}`);

// 2. Ejecutar setupLocalDevelopment
console.log('\n2. Ejecutando setupLocalDevelopment...');
const localData = setupLocalDevelopment();
if (localData) {
  console.log(`   ✅ Setup exitoso: ${localData.games.length} juegos`);
  console.log(`   Primer juego: ${localData.games[0]?.game_id}`);
} else {
  console.log('   ❌ Setup falló');
}

// 3. Verificar LOCAL_DEMO_DATA después del setup
console.log('\n3. LOCAL_DEMO_DATA después del setup:');
console.log(`   LOCAL_DEMO_DATA.games.length: ${LOCAL_DEMO_DATA.games.length}`);
if (LOCAL_DEMO_DATA.games.length > 0) {
  console.log('   Primeros 3 juegos:');
  LOCAL_DEMO_DATA.games.slice(0, 3).forEach((game, i) => {
    console.log(`     ${i}: ${game.game_id} - ${game.title}`);
  });
}

// 4. Ejecutar syncWithLocalDemoData
console.log('\n4. Ejecutando syncWithLocalDemoData...');
mockGameData.syncWithLocalDemoData();
console.log(`   Después del sync - mockGameData.gameSessions.length: ${mockGameData.gameSessions.length}`);

// 5. Buscar game-demo-001 específicamente
console.log('\n5. Buscando game-demo-001...');
const result = mockGameData.getGameSessionById('game-demo-001', null);
if (result.data) {
  console.log('   ✅ ENCONTRADO:');
  console.log(`     session_id: ${result.data.session_id}`);
  console.log(`     title: ${result.data.title}`);
  console.log(`     status: ${result.data.status}`);
  console.log(`     format: ${result.data.format}`);
} else {
  console.log('   ❌ NO ENCONTRADO');
  console.log(`     Error: ${result.error?.message}`);
}

// 6. Listar todas las sesiones
console.log('\n6. Todas las sesiones en mockGameData:');
mockGameData.gameSessions.forEach((session, i) => {
  console.log(`   ${i}: ${session.session_id} - ${session.title} (${session.status})`);
});

console.log('\n🏁 Debug completado.'); 