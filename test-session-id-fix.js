const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3000';

async function testSessionIdFix() {
  console.log('\n🧪 === TESTING SESSION ID FIX ===');
  
  try {
    console.log('\n1️⃣ Creando evaluación gamificada...');
    
    // Crear evaluación gamificada
    const evalResponse = await fetch(`${BASE_URL}/api/evaluation/gamified`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token-teacher'
      },
      body: JSON.stringify({
        title: 'Test Session ID Fix',
        subject: 'Matemáticas',
        grade: '1B',
        engine_id: 'ENG01',
        engine_config: {
          difficulty: 'easy',
          range: { min: 1, max: 10 }
        },
        skin_theme: 'granja',
        time_limit_minutes: 15,
        questions: [
          {
            text: 'Cuenta de 1 a 5',
            type: 'counter',
            correct_answer: '5',
            points: 10
          }
        ]
      })
    });
    
    if (!evalResponse.ok) {
      throw new Error(`Error creating evaluation: ${evalResponse.status}`);
    }
    
    const evalData = await evalResponse.json();
    console.log('✅ Evaluación creada:', evalData.evaluation_id);
    
    console.log('\n2️⃣ Iniciando sesión de juego...');
    
    // Crear sesión de juego
    const gameResponse = await fetch(`${BASE_URL}/api/evaluation/gamified/${evalData.evaluation_id}/start-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    
    if (!gameResponse.ok) {
      throw new Error(`Error starting game: ${gameResponse.status}`);
    }
    
    const gameData = await gameResponse.json();
    const sessionId = gameData.gameSession.session_id;
    console.log('✅ Sesión de juego creada:', sessionId);
    
    console.log('\n3️⃣ Probando GET con ID completo...');
    
    // Test GET con ID completo (con prefijo)
    const getResponse1 = await fetch(`${BASE_URL}/api/game/${sessionId}`, {
      headers: {
        'Authorization': 'Bearer demo-token-student'
      }
    });
    
    console.log(`GET /api/game/${sessionId}: ${getResponse1.status}`);
    
    if (getResponse1.ok) {
      const data1 = await getResponse1.json();
      console.log('✅ ÉXITO con ID completo:', data1.session.title);
    } else {
      console.log('❌ FALLÓ con ID completo');
    }
    
    console.log('\n4️⃣ Probando GET sin prefijo...');
    
    // Test GET sin prefijo (esto era lo que fallaba)
    const idSinPrefijo = sessionId.replace('game_', '');
    const getResponse2 = await fetch(`${BASE_URL}/api/game/${idSinPrefijo}`, {
      headers: {
        'Authorization': 'Bearer demo-token-student'
      }
    });
    
    console.log(`GET /api/game/${idSinPrefijo}: ${getResponse2.status}`);
    
    if (getResponse2.ok) {
      const data2 = await getResponse2.json();
      console.log('✅ ÉXITO sin prefijo:', data2.session.title);
    } else {
      console.log('❌ FALLÓ sin prefijo');
    }
    
    console.log('\n5️⃣ Probando POST start con ambos IDs...');
    
    // Test POST start con ID completo
    const startResponse1 = await fetch(`${BASE_URL}/api/game/${sessionId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    
    console.log(`POST /api/game/${sessionId}/start: ${startResponse1.status}`);
    
    if (startResponse1.ok) {
      console.log('✅ START funciona con ID completo');
    } else {
      console.log('❌ START falla con ID completo');
    }
    
    // Test POST start sin prefijo
    const startResponse2 = await fetch(`${BASE_URL}/api/game/${idSinPrefijo}/start`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    
    console.log(`POST /api/game/${idSinPrefijo}/start: ${startResponse2.status}`);
    
    if (startResponse2.ok) {
      console.log('✅ START funciona sin prefijo');
    } else {
      console.log('❌ START falla sin prefijo');
    }
    
    console.log('\n🎯 RESULTADO DEL TEST:');
    console.log(`📋 Evaluación ID: ${evalData.evaluation_id}`);
    console.log(`🎮 Sesión ID completo: ${sessionId}`);
    console.log(`🎮 Sesión ID sin prefijo: ${idSinPrefijo}`);
    console.log(`🌐 URL Estudiante: ${FRONTEND_URL}/student/games/${idSinPrefijo}/play`);
    console.log(`🌐 URL Alternativa: ${FRONTEND_URL}/student/games/${sessionId}/play`);
    
  } catch (error) {
    console.error('💥 ERROR en test:', error.message);
  }
}

// Ejecutar el test
testSessionIdFix(); 