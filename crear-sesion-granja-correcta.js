#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function crearSesionGranjaCorrecta() {
  console.log('🐄 =======================================');
  console.log('🐄 CREANDO SESIÓN GRANJA CORRECTA');
  console.log('🐄 =======================================\n');

  try {
    const sessionId = `game_${Date.now()}`;
    
    // Sesión con TODOS los criterios para tema granja
    const granjaSession = {
      session_id: sessionId,
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      quiz_id: 'granja-quiz-correcto',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      format: 'trivia_lightning',
      status: 'active',
      
      // ✅ TÍTULO CON "GRANJA" EXPLÍCITO
      title: '🐄 Granja 1° Básico - Conteo de Animales',
      description: 'Conteo pedagógico con animales de granja para primer año básico',
      join_code: 'GRANJA',
      
      // ✅ ENGINE Y CONFIGURACIÓN CORRECTA
      engine_id: 'ENG01',
      engine_name: 'Counter/Number Line',
      
      settings_json: {
        demo: false,
        max_players: 30,
        time_limit: 600,
        show_correct_answers: true,
        
        // ✅ CRITERIOS EXPLÍCITOS PARA TEMA GRANJA
        farm_theme: true,        // Criterio #1
        grade_level: '1B',       // Criterio #2
        
        // Configuración específica de ENG01
        engine_config: {
          number_line_range: '1 10',
          visual_counters: true,
          progression_style: 'step_by_step',
          animation_speed: 'slow',
          farm_animals: true
        },
        
        // TTS y accesibilidad
        tts_enabled: true,
        accessibility_mode: true
      },
      
      // ✅ PREGUNTAS COHERENTES CON TEMA GRANJA Y CONTEO
      quizzes: {
        questions: [
          {
            question_id: 'granja-count-1',
            question_order: 1,
            stem_md: '🐔 ¿Cuántos pollitos ves en el corral?',
            type: 'multiple_choice',
            options_json: ['2', '3', '4', '5'],
            correct_answer: '3',
            explanation: '¡Correcto! Hay 3 pollitos. ¡Pío pío pío!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar',
            farm_context: {
              animal: 'pollitos',
              location: 'corral',
              sound: 'pío pío'
            }
          },
          {
            question_id: 'granja-count-2',
            question_order: 2,
            stem_md: '🐄 ¿Cuántas vacas están pastando en el campo?',
            type: 'multiple_choice',
            options_json: ['3', '4', '5', '6'],
            correct_answer: '4',
            explanation: '¡Excelente! Son 4 vacas pastando. ¡Muuu!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar',
            farm_context: {
              animal: 'vacas',
              location: 'campo',
              sound: 'muuu'
            }
          },
          {
            question_id: 'granja-count-3',
            question_order: 3,
            stem_md: '🐷 ¿Cuántos cerditos juegan en el barro?',
            type: 'multiple_choice',
            options_json: ['1', '2', '3', '4'],
            correct_answer: '2',
            explanation: '¡Muy bien! Hay 2 cerditos jugando. ¡Oink oink!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar',
            farm_context: {
              animal: 'cerditos',
              location: 'barro',
              sound: 'oink oink'
            }
          },
          {
            question_id: 'granja-count-4',
            question_order: 4,
            stem_md: '🐑 ¿Cuántas ovejas descansan bajo el árbol?',
            type: 'multiple_choice',
            options_json: ['4', '5', '6', '7'],
            correct_answer: '5',
            explanation: '¡Perfecto! Son 5 ovejas descansando. ¡Beee!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar',
            farm_context: {
              animal: 'ovejas',
              location: 'bajo el árbol',
              sound: 'beee'
            }
          },
          {
            question_id: 'granja-count-5',
            question_order: 5,
            stem_md: '🐰 ¿Cuántos conejitos saltan en el prado?',
            type: 'multiple_choice',
            options_json: ['2', '3', '4', '5'],
            correct_answer: '3',
            explanation: '¡Fantástico! Hay 3 conejitos saltando. ¡Hop hop!',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar',
            farm_context: {
              animal: 'conejitos',
              location: 'prado',
              sound: 'hop hop'
            }
          }
        ]
      },
      participants: []
    };

    // Agregar sesión al sistema
    console.log('📝 Agregando sesión con criterios correctos...');
    await axios.post(`${BASE_URL}/api/game/debug/add-session`, granjaSession, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Sesión creada: ${sessionId}`);

    // Verificar que se creó correctamente
    console.log('\n🔍 Verificando detección de tema...');
    const testId = sessionId.replace('game_', '');
    const verifyResponse = await axios.get(`${BASE_URL}/api/game/${testId}`, {
      headers: { 'Authorization': 'Bearer demo_token' }
    });

    const session = verifyResponse.data.session;
    
    // Aplicar la misma lógica de detección que en el frontend
    const titleContainsGranja = session.title?.toLowerCase().includes('granja');
    const titleContainsFarm = session.title?.toLowerCase().includes('farm');
    const farmThemeTrue = session.settings_json?.farm_theme === true;
    const grade1B = session.settings_json?.grade_level === '1B';
    const shouldUseFarmTheme = titleContainsGranja || titleContainsFarm || farmThemeTrue || grade1B;

    console.log('🎨 VERIFICACIÓN DE CRITERIOS:');
    console.log(`   📊 Título: "${session.title}"`);
    console.log(`   🔍 Contiene 'granja': ${titleContainsGranja}`);
    console.log(`   🔍 farm_theme: ${farmThemeTrue}`);
    console.log(`   🔍 grade_level: ${grade1B}`);
    console.log(`   ✅ Debería usar FarmCountingGame: ${shouldUseFarmTheme}`);

    const studentUrl = `http://localhost:3000/student/games/${testId}/play`;
    
    console.log('\n🎮 RESULTADO:');
    console.log(`   URL: ${studentUrl}`);
    console.log(`   Componente esperado: ${shouldUseFarmTheme ? 'FarmCountingGame 🐄' : 'NumberLineRace 🏁'}`);
    console.log(`   Tema visual: Verde con elementos de granja`);
    console.log(`   Animales clickeables: Sí`);

    console.log('\n🎉 =======================================');
    console.log('🎉 SESIÓN GRANJA CREADA CORRECTAMENTE');
    console.log('🎉 =======================================');

    return { sessionId: testId, url: studentUrl, shouldUseFarmTheme };

  } catch (error) {
    console.error('\n❌ ERROR:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   Error:`, error.message);
    }
    return null;
  }
}

// Ejecutar
if (require.main === module) {
  crearSesionGranjaCorrecta()
    .then((result) => {
      if (result && result.shouldUseFarmTheme) {
        console.log(`\n✅ ¡ÉXITO! Ahora deberías ver la granja en: ${result.url}`);
        process.exit(0);
      } else {
        console.log('\n❌ Falló la detección de tema granja');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { crearSesionGranjaCorrecta }; 