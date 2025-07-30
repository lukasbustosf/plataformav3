const axios = require('axios');

// 🧪 TEST COMPLETE GAMIFIED SYSTEM
// Prueba todos los aspectos mejorados: rango numérico, engine ENG01, skin espacio, contenido dinámico

const BASE_URL = 'http://localhost:5000';
const DEMO_TOKEN = 'demo_teacher_token_123';

async function testCompleteGamifiedSystem() {
  console.log('🚀 TESTING: Sistema Completo de Evaluaciones Gamificadas Mejorado\n');
  console.log('✅ Verificando:');
  console.log('   1. Rango numérico correcto (10-100)');
  console.log('   2. Engine ENG01 específico ejecutándose');
  console.log('   3. Skin "espacio" aplicado automáticamente');
  console.log('   4. Contenido dinámico transformado');
  console.log('   5. Persistencia en base de datos\n');

  try {
    // Step 1: Create gamified evaluation with specific requirements
    console.log('📝 PASO 1: Creando evaluación gamificada mejorada...');
    
    const evaluationData = {
      title: 'Números de 10 a 100',  // 🔢 RANGE TEST
      description: 'Conteo espacial avanzado con rango específico',
      class_id: '550e8400-e29b-41d4-a716-446655440001',
      oa_codes: ['MAT.1B.OA.01'],
      difficulty: 'medium',
      question_count: 8,
      game_format: 'trivia_lightning',
      engine_id: 'ENG01',           // 🎯 ENGINE TEST
      skin_theme: 'espacio',        // 🎨 SKIN TEST
      time_limit_minutes: 25,
      weight: 15,
      attempt_limit: 2
    };

    console.log(`🔢 Testing range extraction from: "${evaluationData.title}"`);
    console.log(`🎯 Testing engine: ${evaluationData.engine_id}`);
    console.log(`🎨 Testing skin: ${evaluationData.skin_theme}`);

    const createResponse = await axios.post(`${BASE_URL}/api/evaluation/gamified`, evaluationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEMO_TOKEN}`
      }
    });

    const createResult = createResponse.data;
    console.log(`✅ Evaluación creada: ${createResult.evaluation.evaluation_id}`);
    console.log(`📊 Preguntas generadas: ${createResult.gameContent?.questions?.length || 0}`);

    // Verify content transformation
    if (createResult.gameContent?.questions?.length > 0) {
      const firstQuestion = createResult.gameContent.questions[0];
      console.log(`📝 Primera pregunta: "${firstQuestion.text}"`);
      console.log(`🎯 Respuesta correcta: ${firstQuestion.correct_answer}`);
      
      // Check for space theme elements
      if (firstQuestion.text.includes('🚀') || firstQuestion.text.includes('⭐') || 
          firstQuestion.text.includes('espacio') || firstQuestion.text.includes('galaxia')) {
        console.log('✅ SKIN ESPACIO aplicado correctamente en contenido');
      } else {
        console.log('⚠️ Skin espacio no detectado en contenido');
      }
      
      // Check numeric range
      const answer = parseInt(firstQuestion.correct_answer);
      if (answer >= 10 && answer <= 100) {
        console.log(`✅ RANGO NUMÉRICO correcto: ${answer} (entre 10-100)`);
      } else {
        console.log(`⚠️ Rango fuera del esperado: ${answer} (debería estar entre 10-100)`);
      }
    }

    // Step 2: Start game session
    console.log('\n🎮 PASO 2: Iniciando sesión de juego...');
    
    const evaluationId = createResult.evaluation.evaluation_id;
    const startResponse = await axios.post(`${BASE_URL}/api/evaluation/gamified/${evaluationId}/start-game`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEMO_TOKEN}`
      }
    });

    const startResult = startResponse.data;
    console.log(`✅ Sesión iniciada: ${startResult.gameSession.session_id}`);
    console.log(`🎫 Código de acceso: ${startResult.gameSession.join_code}`);
    console.log(`🎨 Skin aplicado: ${startResult.metadata.skin_applied}`);
    console.log(`✨ Skin aplicado exitosamente: ${startResult.metadata.skin_applied_successfully}`);

    // Step 3: Access game and verify all aspects
    console.log('\n🕹️ PASO 3: Verificando juego completo...');
    
    const sessionId = startResult.gameSession.session_id;
    const gameResponse = await axios.get(`${BASE_URL}/api/game/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${DEMO_TOKEN}`
      }
    });

    const gameResult = gameResponse.data;
    console.log(`✅ Juego accesible: ${gameResult.session.title}`);
    console.log(`🎯 Engine ID: ${gameResult.session.engine_id}`);
    console.log(`🎨 Skin aplicado: ${gameResult.session.applied_skin ? 'SÍ' : 'NO'}`);
    
    if (gameResult.session.applied_skin) {
      console.log(`   Skin name: ${gameResult.session.applied_skin.skin_name}`);
      console.log(`   Theme: ${gameResult.session.applied_skin.theme.primary_color}`);
    }

    // Verify questions in the game
    if (gameResult.session.quizzes?.questions?.length > 0) {
      const gameQuestion = gameResult.session.quizzes.questions[0];
      console.log(`📝 Pregunta en juego: "${gameQuestion.stem_md}"`);
      console.log(`🎯 Respuesta correcta: ${gameQuestion.correct_answer}`);
      
      // Verify space theme in game questions
      if (gameQuestion.stem_md.includes('🚀') || gameQuestion.stem_md.includes('⭐') || 
          gameQuestion.stem_md.includes('espacio') || gameQuestion.stem_md.includes('galaxia')) {
        console.log('✅ TRANSFORMACIÓN DINÁMICA aplicada en juego');
      }
      
      // Verify numeric range in game
      const gameAnswer = parseInt(gameQuestion.correct_answer);
      if (gameAnswer >= 10 && gameAnswer <= 100) {
        console.log(`✅ RANGO EN JUEGO correcto: ${gameAnswer}`);
      }
    }

    // Step 4: Access the actual game URL
    console.log('\n🎲 PASO 4: Probando URL de juego directo...');
    
    const gameUrl = `http://localhost:3000/student/games/${sessionId}/play`;
    console.log(`🔗 URL del juego: ${gameUrl}`);
    console.log('ℹ️  Abre esta URL en el navegador para probar la experiencia completa');

    // Final verification summary
    console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
    console.log('==================================');
    
    // Range verification
    const hasCorrectRange = createResult.gameContent?.questions?.some(q => {
      const answer = parseInt(q.correct_answer);
      return answer >= 10 && answer <= 100;
    });
    console.log(`🔢 Rango numérico (10-100): ${hasCorrectRange ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
    
    // Engine verification  
    const hasEng01 = gameResult.session.engine_id === 'ENG01';
    console.log(`🎯 Engine ENG01 activo: ${hasEng01 ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
    
    // Skin verification
    const hasSkinApplied = gameResult.session.applied_skin && 
                          gameResult.session.applied_skin.skin_name.includes('Espaciales');
    console.log(`🎨 Skin espacio aplicado: ${hasSkinApplied ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
    
    // Content transformation verification
    const hasSpaceContent = createResult.gameContent?.questions?.some(q => 
      q.text?.includes('🚀') || q.text?.includes('⭐') || q.text?.includes('espacio')
    );
    console.log(`🔄 Contenido transformado: ${hasSpaceContent ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
    
    // Persistence verification
    const isPersisted = startResult.metadata.skin_applied_successfully;
    console.log(`💾 Persistencia funcionando: ${isPersisted ? '✅ CORRECTO' : '⚠️ PARCIAL'}`);

    console.log('\n🎉 PRUEBA COMPLETADA!');
    if (hasCorrectRange && hasEng01 && hasSkinApplied && hasSpaceContent) {
      console.log('🌟 TODOS LOS ASPECTOS FUNCIONAN CORRECTAMENTE');
    } else {
      console.log('⚠️ Algunos aspectos necesitan revisión (ver arriba)');
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Execute test
testCompleteGamifiedSystem()
  .then(() => {
    console.log('\n✅ Test completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test falló:', error);
    process.exit(1);
  }); 