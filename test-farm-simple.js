#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testFarmSimple() {
  console.log('🐄 ================================');
  console.log('🐄 PRUEBA SIMPLE: FARM COUNTING');
  console.log('🐄 ================================\n');

  try {
    // Crear manualmente una sesión con tema granja
    console.log('🔧 Creando sesión manual con tema granja...');
    
    const sessionId = `game_${Date.now()}`;
    const gameData = {
      session_id: sessionId,
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      quiz_id: 'farm-quiz-001',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      format: 'trivia_lightning',
      status: 'active',
      title: '🐄 Granja 1° Básico - Conteo Interactivo',
      description: 'Juego de conteo con animales de granja',
      join_code: 'FARM01',
      engine_id: 'ENG01',
      engine_name: 'Counter/Number Line',
      settings_json: {
        demo: false,
        max_players: 30,
        time_limit: 600,
        show_correct_answers: true,
        farm_theme: true,
        grade_level: '1B',
        engine_config: {
          number_line_range: '1 10',
          visual_counters: true,
          progression_style: 'step_by_step'
        }
      },
      // Preguntas de ejemplo con tema granja
      quizzes: {
        questions: [
          {
            question_id: 'farm-q1',
            question_order: 1,
            stem_md: '🐔 ¿Cuántos pollitos ves en el corral?',
            type: 'multiple_choice',
            options_json: ['2', '3', '4', '5'],
            correct_answer: '3',
            explanation: '¡Correcto! Hay 3 pollitos. ¡Pío pío pío!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar'
          },
          {
            question_id: 'farm-q2',
            question_order: 2,
            stem_md: '🐄 ¿Cuántas vacas hay pastando?',
            type: 'multiple_choice',
            options_json: ['3', '4', '5', '6'],
            correct_answer: '4',
            explanation: '¡Excelente! Son 4 vacas. ¡Muuu!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar'
          },
          {
            question_id: 'farm-q3',
            question_order: 3,
            stem_md: '🐷 ¿Cuántos cerditos están en el barro?',
            type: 'multiple_choice',
            options_json: ['1', '2', '3', '4'],
            correct_answer: '2',
            explanation: '¡Muy bien! Hay 2 cerditos. ¡Oink oink!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar'
          }
        ]
      },
      participants: []
    };

    // Añadir la sesión directamente al mock data
    const addResponse = await axios.post(`${BASE_URL}/api/game/debug/add-session`, gameData, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Sesión agregada: ${sessionId}`);

    // Verificar que se puede acceder
    console.log('\n🔍 Verificando acceso...');
    const testId = sessionId.replace('game_', '');
    const getResponse = await axios.get(`${BASE_URL}/api/game/${testId}`, {
      headers: {
        'Authorization': 'Bearer demo_token'
      }
    });

    const session = getResponse.data.session;
    console.log(`✅ Sesión encontrada: ${session.title}`);
    console.log(`🎯 Engine ID: ${session.engine_id}`);
    console.log(`🐄 Tema granja: ${session.settings_json?.farm_theme}`);
    console.log(`📝 Preguntas: ${session.quizzes?.questions?.length || 0}`);

    // Mostrar URL para el estudiante
    const studentUrl = `http://localhost:3000/student/games/${testId}/play`;
    console.log(`\n🎮 URL del estudiante: ${studentUrl}`);

    // Verificar detección de tema granja
    const farmThemeDetected = 
      session.title?.toLowerCase().includes('granja') ||
      session.title?.toLowerCase().includes('farm') ||
      session.settings_json?.farm_theme === true ||
      session.settings_json?.grade_level === '1B';

    console.log(`\n🎨 Detección de tema:`);
    console.log(`   📊 Título incluye 'granja': ${session.title?.toLowerCase().includes('granja')}`);
    console.log(`   🏫 Grade level es '1B': ${session.settings_json?.grade_level === '1B'}`);
    console.log(`   🐄 farm_theme es true: ${session.settings_json?.farm_theme === true}`);
    console.log(`   ✅ Tema granja detectado: ${farmThemeDetected}`);
    console.log(`   🎮 Componente esperado: ${farmThemeDetected ? 'FarmCountingGame' : 'NumberLineRace'}`);

    console.log('\n🎉 ================================');
    console.log('🎉 PRUEBA COMPLETADA');
    console.log('🎉 ================================');
    
    console.log(`\n👶 Pasos para probar:`);
    console.log(`   1. Ve a: ${studentUrl}`);
    console.log(`   2. Deberías ver "Granja de Conteo" en lugar de "Carrera Numérica"`);
    console.log(`   3. Los animales deberían ser clickeables`);
    console.log(`   4. El fondo debería ser verde con elementos de granja`);

    return sessionId;

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else if (error.request) {
      console.error('   No response received:', error.request);
    } else {
      console.error('   Error:', error.message);
    }
    console.error('   Stack:', error.stack);
    return null;
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testFarmSimple()
    .then((sessionId) => {
      if (sessionId) {
        console.log(`\n✅ Sesión creada exitosamente: ${sessionId}`);
        process.exit(0);
      } else {
        console.log('\n❌ Falló la creación de sesión');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { testFarmSimple }; 