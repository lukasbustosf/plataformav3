#!/usr/bin/env node
/**
 * 🔍 DEBUG TIMING DE ALMACENAMIENTO
 * Verificar el estado de mockGameData antes y después de crear sesiones
 */

console.log('🔍 === DEBUG TIMING DE ALMACENAMIENTO ===\n');

async function debugStorageTiming() {
  console.log('📊 PASO 0: Estado inicial de mockGameData...');
  
  // Verificar estado inicial
  try {
    const response = await fetch('http://localhost:5000/api/game/game-demo-001', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer demo-token-student'
      }
    });
    
    console.log(`📊 Demo game accesible: ${response.ok ? 'SÍ' : 'NO'}`);
  } catch (error) {
    console.error('❌ Error verificando demo game:', error.message);
  }

  // 1. Crear evaluación y sesión paso a paso
  console.log('\n📋 PASO 1: Crear evaluación...');
  const createResponse = await fetch('http://localhost:5000/api/evaluation/gamified', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token'
    },
    body: JSON.stringify({
      class_id: 'test-class-debug',
      title: 'Debug Timing Test',
      description: 'Test timing',
      oa_codes: ['MA01-OA01'],
      difficulty: 'easy',
      question_count: 2,
      game_format: 'ENG01',
      engine_id: 'ENG01',
      skin_theme: 'granja',
      time_limit_minutes: 30
    })
  });

  if (!createResponse.ok) {
    console.error('❌ FALLO: No se pudo crear evaluación');
    return;
  }

  const createResult = await createResponse.json();
  const evaluationId = createResult.evaluation.evaluation_id;
  console.log(`✅ Evaluación creada: ${evaluationId}`);

  // 2. Crear sesión de juego
  console.log('\n🎮 PASO 2: Crear sesión de juego...');
  console.log('🕐 Timestamp ANTES de crear sesión:', new Date().toISOString());
  
  const startResponse = await fetch(`http://localhost:5000/api/evaluation/gamified/${evaluationId}/start-game`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token'
    }
  });

  if (!startResponse.ok) {
    console.error('❌ FALLO: No se pudo crear sesión');
    return;
  }

  const startResult = await startResponse.json();
  const sessionId = startResult.gameSession.session_id;
  console.log(`✅ Sesión creada: ${sessionId}`);
  console.log('🕐 Timestamp DESPUÉS de crear sesión:', new Date().toISOString());

  // 3. INMEDIATAMENTE verificar con diferentes endpoints
  console.log('\n🔍 PASO 3: Verificación INMEDIATA...');
  
  // 3a. Verificar con GET completo
  console.log('🔍 3a. GET completo con ID completo...');
  const fullGetResponse = await fetch(`http://localhost:5000/api/game/${sessionId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer demo-token-student'
    }
  });
  console.log(`   Response status: ${fullGetResponse.status}`);
  
  if (fullGetResponse.ok) {
    const result = await fullGetResponse.json();
    console.log(`   ✅ ÉXITO: Título "${result.session.title}"`);
  } else {
    const error = await fullGetResponse.json();
    console.log(`   ❌ FALLO: ${error.error?.message}`);
  }

  // 3b. Verificar solo con el número (como lo hace el frontend)
  const numberOnly = sessionId.replace('game_', '');
  console.log(`🔍 3b. GET solo con número: ${numberOnly}...`);
  const numberGetResponse = await fetch(`http://localhost:5000/api/game/${numberOnly}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer demo-token-student'
    }
  });
  console.log(`   Response status: ${numberGetResponse.status}`);
  
  if (numberGetResponse.ok) {
    const result = await numberGetResponse.json();
    console.log(`   ✅ ÉXITO: Título "${result.session.title}"`);
  } else {
    const error = await numberGetResponse.json();
    console.log(`   ❌ FALLO: ${error.error?.message}`);
  }

  // 4. Esperar y verificar de nuevo
  console.log('\n⏰ PASO 4: Esperar 3 segundos y reverificar...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const retryResponse = await fetch(`http://localhost:5000/api/game/${sessionId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer demo-token-student'
    }
  });
  console.log(`📡 Retry response status: ${retryResponse.status}`);
  
  if (retryResponse.ok) {
    const retryResult = await retryResponse.json();
    console.log(`✅ DESPUÉS DE ESPERAR: Título "${retryResult.session.title}"`);
  } else {
    const error = await retryResponse.json();
    console.log(`❌ DESPUÉS DE ESPERAR: ${error.error?.message}`);
  }

  console.log('\n📊 RESUMEN DEL DEBUG:');
  console.log(`   Evaluación: ${evaluationId ? 'CREADA' : 'FALLA'}`);
  console.log(`   Sesión: ${sessionId ? 'CREADA' : 'FALLA'}`);
  console.log(`   Acceso inmediato (ID completo): ${fullGetResponse.ok ? 'ÉXITO' : 'FALLA'}`);
  console.log(`   Acceso inmediato (solo número): ${numberGetResponse.ok ? 'ÉXITO' : 'FALLA'}`);
  console.log(`   Acceso después de esperar: ${retryResponse.ok ? 'ÉXITO' : 'FALLA'}`);
}

// Ejecutar
debugStorageTiming().then(() => {
  console.log('\n🏁 Debug de timing completado');
}).catch(console.error); 