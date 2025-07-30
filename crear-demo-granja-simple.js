#!/usr/bin/env node

const axios = require('axios');

async function crearDemoGranjaSimple() {
  console.log('🐄 CREANDO DEMO GRANJA SIMPLE');
  console.log('=' .repeat(40));

  try {
    const sessionId = `granja_${Date.now()}`;
    console.log(`🆔 Creando sesión: ${sessionId}`);
    
    // Demo con TODOS los criterios para activar tema granja
    const demoGranja = {
      session_id: sessionId,
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      quiz_id: 'granja-simple',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      format: 'trivia_lightning',
      status: 'active',
      
      // ✅ TÍTULO CON "GRANJA" - Criterio #1
      title: '🐄 Granja 1° Básico - Conteo de Animales',
      description: 'Demo de conteo con animales de granja',
      join_code: 'GRANJA',
      
      engine_id: 'ENG01',
      engine_name: 'Counter/Number Line',
      
      settings_json: {
        demo: true,
        max_players: 30,
        time_limit: 600,
        show_correct_answers: true,
        
        // ✅ CRITERIOS EXPLÍCITOS - Criterios #2 y #3
        farm_theme: true,
        grade_level: '1B',
        
        engine_config: {
          number_line_range: '1 10',
          visual_counters: true,
          progression_style: 'step_by_step'
        },
        tts_enabled: true,
        accessibility_mode: true
      },
      
      // Preguntas de granja
      quizzes: {
        questions: [
          {
            question_id: 'farm-1',
            question_order: 1,
            stem_md: '🐔 ¿Cuántos pollitos ves en el corral?',
            type: 'multiple_choice',
            options_json: ['2', '3', '4', '5'],
            correct_answer: '3',
            explanation: '¡Correcto! Hay 3 pollitos. ¡Pío pío pío!',
            points: 10,
            difficulty: 'easy'
          }
        ]
      },
      participants: []
    };

    // Agregar al sistema
    const response = await axios.post('http://localhost:5000/api/game/debug/add-session', demoGranja, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Demo creado exitosamente');
    
    // Crear URL del estudiante
    const studentId = sessionId.replace('granja_', '');
    const studentUrl = `http://localhost:3000/student/games/${studentId}/play`;
    
    // Verificar que se puede acceder
    console.log('\n🔍 Verificando acceso...');
    const testResponse = await axios.get(`http://localhost:5000/api/game/${studentId}`, {
      headers: { 'Authorization': 'Bearer demo_token' }
    });
    
    const session = testResponse.data.session;
    console.log(`📊 Título: "${session.title}"`);
    console.log(`🎯 Engine: ${session.engine_id}`);
    
    // Verificar criterios de detección
    const titleGranja = session.title?.toLowerCase().includes('granja');
    const farmTheme = session.settings_json?.farm_theme === true;
    const grade1B = session.settings_json?.grade_level === '1B';
    
    console.log('\n🎨 CRITERIOS DE DETECCIÓN:');
    console.log(`✅ Título con 'granja': ${titleGranja}`);
    console.log(`✅ farm_theme: ${farmTheme}`);
    console.log(`✅ grade_level '1B': ${grade1B}`);
    
    const shouldUseFarm = titleGranja || farmTheme || grade1B;
    console.log(`🎯 Activará FarmCountingGame: ${shouldUseFarm ? 'SÍ' : 'NO'}`);
    
    console.log('\n🎉 DEMO LISTO PARA PROBAR:');
    console.log(`🌐 URL: ${studentUrl}`);
    console.log('🐄 Deberías ver: "Granja de Conteo" con fondo verde');
    console.log('🏁 En lugar de: "Carrera Numérica" genérica');
    
    return studentUrl;

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return null;
  }
}

// Ejecutar
crearDemoGranjaSimple().then(url => {
  if (url) {
    console.log(`\n✅ ÉXITO - Ve a: ${url}`);
  } else {
    console.log('\n❌ FALLÓ la creación del demo');
  }
}); 