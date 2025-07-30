#!/usr/bin/env node

const axios = require('axios');

async function crearDemoGranjaFinal() {
  console.log('🐄 DEMO GRANJA FINAL - DEBE FUNCIONAR');
  console.log('=' .repeat(50));

  try {
    // Usar formato de ID que sabemos que funciona
    const timestamp = Date.now();
    const sessionId = `game_${timestamp}`;
    console.log(`🆔 ID de sesión: ${sessionId}`);
    
    const demoData = {
      session_id: sessionId,
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      quiz_id: 'granja-final',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      format: 'trivia_lightning',
      status: 'active',
      
      // ✅ CRITERIO #1: Título con "granja"
      title: '🐄 Granja 1° Básico - Conteo de Animales',
      description: 'Demo funcional de granja',
      join_code: 'FARM01',
      
      engine_id: 'ENG01',
      engine_name: 'Counter/Number Line',
      
      settings_json: {
        demo: true,
        max_players: 30,
        time_limit: 600,
        show_correct_answers: true,
        
        // ✅ CRITERIO #2: farm_theme = true
        farm_theme: true,
        
        // ✅ CRITERIO #3: grade_level = '1B'
        grade_level: '1B',
        
        engine_config: {
          number_line_range: '1 10',
          visual_counters: true
        },
        tts_enabled: true
      },
      
      quizzes: {
        questions: [
          {
            question_id: 'farm-q1',
            question_order: 1,
            stem_md: '🐔 ¿Cuántos pollitos ves en el corral?',
            type: 'multiple_choice',
            options_json: ['2', '3', '4', '5'],
            correct_answer: '3',
            explanation: '¡Correcto! Hay 3 pollitos. ¡Pío pío!',
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
          }
        ]
      },
      participants: []
    };

    // 1. Crear la sesión
    console.log('\n📝 Creando sesión...');
    await axios.post('http://localhost:5000/api/game/debug/add-session', demoData, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Sesión creada');

    // 2. Verificar acceso con el ID correcto
    const studentId = timestamp.toString(); // Sin prefijo game_
    console.log(`\n🔍 Verificando acceso con ID: ${studentId}`);
    
    const response = await axios.get(`http://localhost:5000/api/game/${studentId}`, {
      headers: { 'Authorization': 'Bearer demo_token' }
    });

    const session = response.data.session;
    console.log('✅ Acceso exitoso!');
    
    // 3. Verificar criterios de detección
    console.log('\n🎨 VERIFICACIÓN DE CRITERIOS:');
    const titleGranja = session.title?.toLowerCase().includes('granja');
    const farmTheme = session.settings_json?.farm_theme === true;
    const grade1B = session.settings_json?.grade_level === '1B';
    
    console.log(`📊 Título: "${session.title}"`);
    console.log(`✅ Contiene 'granja': ${titleGranja}`);
    console.log(`✅ farm_theme: ${farmTheme}`);
    console.log(`✅ grade_level '1B': ${grade1B}`);
    
    const shouldUseFarmTheme = titleGranja || farmTheme || grade1B;
    console.log(`\n🎯 RESULTADO: Activará FarmCountingGame = ${shouldUseFarmTheme ? 'SÍ ✅' : 'NO ❌'}`);
    
    // 4. Mostrar URL final
    const finalUrl = `http://localhost:3000/student/games/${studentId}/play`;
    
    console.log('\n🎉 ================================');
    console.log('🎉 DEMO GRANJA LISTO');
    console.log('🎉 ================================');
    console.log(`\n🌐 URL: ${finalUrl}`);
    console.log('\n📋 QUÉ ESPERAR:');
    if (shouldUseFarmTheme) {
      console.log('✅ Título: "Granja de Conteo"');
      console.log('✅ Fondo: Verde con elementos de granja');
      console.log('✅ Animales: Clickeables con sonidos');
      console.log('✅ Componente: FarmCountingGame');
    } else {
      console.log('❌ Se verá NumberLineRace genérico');
    }
    
    console.log('\n🐛 LOGS DE DEBUG:');
    console.log('Abre la consola del navegador (F12) para ver los logs de detección');
    
    return finalUrl;

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    return null;
  }
}

// Ejecutar
crearDemoGranjaFinal().then(url => {
  if (url) {
    console.log(`\n🚀 ¡PRUEBA AHORA! → ${url}`);
  } else {
    console.log('\n💥 Error crítico - no se pudo crear demo');
  }
}); 