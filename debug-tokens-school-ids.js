#!/usr/bin/env node
/**
 * 🔍 DEBUG TOKENS Y SCHOOL_IDS
 * Verificar exactamente qué tokens y school_ids se usan en cada request
 */

console.log('🔍 === DEBUG TOKENS Y SCHOOL_IDS ===\n');

async function debugTokensAndSchoolIds() {
  console.log('🎯 COMPARANDO TOKENS USADOS EN CADA ENDPOINT...');
  
  // Tokens que usamos
  const TEACHER_TOKEN = 'demo-token';
  const STUDENT_TOKEN = 'demo-token-student';
  
  console.log(`📝 Teacher token: "${TEACHER_TOKEN}"`);
  console.log(`📝 Student token: "${STUDENT_TOKEN}"`);
  
  console.log('\n🔍 VERIFICANDO QUE SCHOOL_IDS SON DEVUELTOS POR CADA TOKEN...');
  
  // 1. Verificar qué school_id devuelve el token de teacher
  console.log('\n1️⃣ Testing teacher token...');
  try {
    const teacherResponse = await fetch('http://localhost:5000/api/evaluation/search-oa?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEACHER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📡 Teacher token response: ${teacherResponse.status}`);
    
    if (teacherResponse.ok) {
      console.log('✅ Teacher token válido');
    } else {
      const error = await teacherResponse.json();
      console.log('❌ Teacher token error:', error);
    }
  } catch (error) {
    console.error('❌ Teacher token fetch error:', error.message);
  }
  
  // 2. Verificar qué school_id devuelve el token de student  
  console.log('\n2️⃣ Testing student token...');
  try {
    const studentResponse = await fetch('http://localhost:5000/api/game/game-demo-001', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STUDENT_TOKEN}`
      }
    });
    
    console.log(`📡 Student token response: ${studentResponse.status}`);
    
    if (studentResponse.ok) {
      console.log('✅ Student token válido');
    } else {
      const error = await studentResponse.json();
      console.log('❌ Student token error:', error);
    }
  } catch (error) {
    console.error('❌ Student token fetch error:', error.message);
  }
  
  // 3. Simular el flujo completo paso a paso
  console.log('\n🎯 SIMULANDO FLUJO COMPLETO CON LOGGING...');
  
  // 3a. Crear evaluación con teacher token
  console.log('\n3a. Creando evaluación con teacher token...');
  let evaluationId, sessionId;
  
  try {
    const createResponse = await fetch('http://localhost:5000/api/evaluation/gamified', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEACHER_TOKEN}`
      },
      body: JSON.stringify({
        class_id: 'debug-tokens-class',
        title: 'Debug Tokens - Números del 1 al 5',
        description: 'Test tokens',
        oa_codes: ['MA01-OA01'],
        difficulty: 'easy',
        question_count: 2,
        game_format: 'ENG01',
        engine_id: 'ENG01',
        skin_theme: 'granja',
        time_limit_minutes: 30
      })
    });

    if (createResponse.ok) {
      const createResult = await createResponse.json();
      evaluationId = createResult.evaluation.evaluation_id;
      console.log(`✅ Evaluación creada con teacher token: ${evaluationId}`);
    } else {
      const error = await createResponse.json();
      console.error('❌ Error creando evaluación:', error);
      return;
    }
  } catch (error) {
    console.error('❌ Fetch error creando evaluación:', error.message);
    return;
  }
  
  // 3b. Crear sesión con teacher token
  console.log('\n3b. Creando sesión con teacher token...');
  
  try {
    const startResponse = await fetch(`http://localhost:5000/api/evaluation/gamified/${evaluationId}/start-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEACHER_TOKEN}`
      }
    });

    if (startResponse.ok) {
      const startResult = await startResponse.json();
      sessionId = startResult.gameSession.session_id;
      console.log(`✅ Sesión creada con teacher token: ${sessionId}`);
    } else {
      const error = await startResponse.json();
      console.error('❌ Error creando sesión:', error);
      return;
    }
  } catch (error) {
    console.error('❌ Fetch error creando sesión:', error.message);
    return;
  }
  
  // 3c. Intentar acceder con student token (el flujo normal)
  console.log('\n3c. Intentando acceder con student token...');
  
  try {
    const accessResponse = await fetch(`http://localhost:5000/api/game/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STUDENT_TOKEN}`
      }
    });

    console.log(`📡 Access response status: ${accessResponse.status}`);
    
    if (accessResponse.ok) {
      const accessResult = await accessResponse.json();
      console.log(`✅ ÉXITO: Acceso con student token funcionó`);
      console.log(`   Título: ${accessResult.session.title}`);
    } else {
      const error = await accessResponse.json();
      console.log(`❌ FALLO: Error accediendo con student token`);
      console.log(`   Error: ${error.error?.message || error.message}`);
    }
  } catch (error) {
    console.error('❌ Fetch error accediendo con student token:', error.message);
  }
  
  // 3d. Intentar acceder con teacher token (para comparar)
  console.log('\n3d. Intentando acceder con teacher token para comparar...');
  
  try {
    const teacherAccessResponse = await fetch(`http://localhost:5000/api/game/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TEACHER_TOKEN}`
      }
    });

    console.log(`📡 Teacher access response status: ${teacherAccessResponse.status}`);
    
    if (teacherAccessResponse.ok) {
      const teacherAccessResult = await teacherAccessResponse.json();
      console.log(`✅ ÉXITO: Acceso con teacher token funcionó`);
      console.log(`   Título: ${teacherAccessResult.session.title}`);
    } else {
      const error = await teacherAccessResponse.json();
      console.log(`❌ FALLO: Error accediendo con teacher token`);
      console.log(`   Error: ${error.error?.message || error.message}`);
    }
  } catch (error) {
    console.error('❌ Fetch error accediendo con teacher token:', error.message);
  }
  
  console.log('\n📊 RESUMEN DE TOKENS:');
  console.log(`   Evaluación creada: ${evaluationId ? 'SÍ' : 'NO'}`);
  console.log(`   Sesión creada: ${sessionId ? 'SÍ' : 'NO'}`);
  console.log(`   Tokens usados:`);
  console.log(`     - Crear eval/sesión: "${TEACHER_TOKEN}"`);
  console.log(`     - Acceder al juego: "${STUDENT_TOKEN}"`);
}

// Ejecutar
debugTokensAndSchoolIds().then(() => {
  console.log('\n🏁 Debug de tokens completado');
}).catch(console.error); 