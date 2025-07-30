const fetch = require('node-fetch');

async function testCompleteFlow() {
  console.log('🧪 === TESTING COMPLETE GAMIFIED FLOW ===');
  
  const BASE_URL = 'http://localhost:5000';
  
  try {
    console.log('\n1️⃣ Creando evaluación gamificada...');
    
    const evalData = {
      class_id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Test Complete Flow",
      subject: "Matemáticas",
      grade: "1B", 
      game_format: "ENG01",
      engine_id: "ENG01",
      engine_config: {
        difficulty: "easy",
        range: { min: 1, max: 10 }
      },
      skin_theme: "granja",
      time_limit_minutes: 15,
      oa_codes: ["MA01-OA01"],
      questions: [
        {
          text: "Cuenta de 1 a 5",
          type: "counter",
          correct_answer: "5",
          points: 10
        }
      ]
    };

    const headers = {
      "Authorization": "Bearer demo-token-teacher",
      "Content-Type": "application/json"
    };

    // Paso 1: Crear evaluación
    const evalResponse = await fetch(`${BASE_URL}/api/evaluation/gamified`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(evalData)
    });
    
    console.log(`📊 Evaluation response status: ${evalResponse.status}`);
    
    if (!evalResponse.ok) {
      const error = await evalResponse.text();
      throw new Error(`Evaluation creation failed: ${error}`);
    }
    
    const evalResult = await evalResponse.json();
    console.log('✅ Evaluación creada:', evalResult.evaluation.evaluation_id);
    
    console.log('\n2️⃣ Creando sesión de juego...');
    
    // Paso 2: Crear sesión de juego
    const gameResponse = await fetch(`${BASE_URL}/api/evaluation/gamified/${evalResult.evaluation.evaluation_id}/start-game`, {
      method: 'POST',
      headers: headers
    });
    
    console.log(`📊 Game session response status: ${gameResponse.status}`);
    
    if (!gameResponse.ok) {
      const error = await gameResponse.text();
      throw new Error(`Game session creation failed: ${error}`);
    }
    
    const gameResult = await gameResponse.json();
    console.log('✅ Sesión de juego creada:', gameResult.gameSession.session_id);
    console.log('🎮 Join Code:', gameResult.gameSession.join_code);
    
    console.log('\n3️⃣ Verificando acceso como estudiante...');
    
    // Paso 3: Verificar que el estudiante puede acceder
    const studentHeaders = {
      "Authorization": "Bearer demo-token-student"
    };
    
    const sessionId = gameResult.gameSession.session_id;
    
    // Probar con ID completo
    const studentResponse1 = await fetch(`${BASE_URL}/api/game/${sessionId}`, {
      headers: studentHeaders
    });
    
    console.log(`📊 Student access (full ID) status: ${studentResponse1.status}`);
    
    // Probar sin prefijo (como hace el frontend)
    const sessionIdWithoutPrefix = sessionId.replace('game_', '');
    const studentResponse2 = await fetch(`${BASE_URL}/api/game/${sessionIdWithoutPrefix}`, {
      headers: studentHeaders
    });
    
    console.log(`📊 Student access (no prefix) status: ${studentResponse2.status}`);
    
    if (studentResponse1.ok || studentResponse2.ok) {
      console.log('✅ Estudiante puede acceder a la sesión');
      
      // Mostrar URLs para prueba manual
      console.log('\n🎯 URLs PARA PROBAR MANUALMENTE:');
      console.log(`🎓 Teacher Lobby: http://localhost:3000/teacher/game/${sessionId}/lobby`);
      console.log(`👨‍🎓 Student Play: http://localhost:3000/student/games/${sessionIdWithoutPrefix}/play`);
      console.log(`🔗 Join Code: ${gameResult.gameSession.join_code}`);
      
    } else {
      console.log('❌ Estudiante NO puede acceder a la sesión');
    }
    
    console.log('\n🎉 ¡FLUJO COMPLETO EXITOSO!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCompleteFlow(); 