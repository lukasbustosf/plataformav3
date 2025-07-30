#!/usr/bin/env node

const axios = require('axios');

async function verificarAccesoDemo() {
  console.log('🔍 VERIFICANDO ACCESO AL DEMO DE GRANJA');
  console.log('=' .repeat(50));

  try {
    // 1. Verificar endpoints disponibles
    console.log('\n1️⃣ Verificando endpoints disponibles...');
    
    // Probar diferentes variaciones del ID
    const testIds = ['demo-001', 'game-demo-001', '001'];
    
    for (const testId of testIds) {
      try {
        console.log(`   🔍 Probando: /api/game/${testId}`);
        const response = await axios.get(`http://localhost:5000/api/game/${testId}`, {
          headers: { 'Authorization': 'Bearer demo_token' }
        });
        
        console.log(`   ✅ ENCONTRADO: ${testId}`);
        const session = response.data.session;
        console.log(`      Título: "${session.title}"`);
        console.log(`      Engine: ${session.engine_id}`);
        console.log(`      Status: ${session.status}`);
        
        return { id: testId, session };
        
      } catch (error) {
        console.log(`   ❌ No encontrado: ${testId} (${error.response?.status || error.message})`);
      }
    }

    // 2. Si no encontramos nada, buscar en la lista de demos
    console.log('\n2️⃣ Buscando en lista de demos...');
    const demosResponse = await axios.get('http://localhost:5000/api/game/demos');
    const demos = demosResponse.data.sessions || [];
    
    const granjaDemo = demos.find(d => 
      d.title?.toLowerCase().includes('granja') && 
      d.engine_id === 'ENG01'
    );
    
    if (granjaDemo) {
      console.log(`   ✅ Demo de granja encontrado en lista:`);
      console.log(`      ID: ${granjaDemo.session_id}`);
      console.log(`      Título: "${granjaDemo.title}"`);
      console.log(`      Engine: ${granjaDemo.engine_id}`);
      
      // Intentar acceder con el ID real
      const realId = granjaDemo.session_id.replace('game-', '').replace('game_', '');
      try {
        console.log(`   🔍 Intentando acceso con ID real: ${realId}`);
        const response = await axios.get(`http://localhost:5000/api/game/${realId}`, {
          headers: { 'Authorization': 'Bearer demo_token' }
        });
        
        console.log(`   ✅ ACCESO EXITOSO con ID: ${realId}`);
        const correctUrl = `http://localhost:3000/student/games/${realId}/play`;
        console.log(`   🌐 URL correcta: ${correctUrl}`);
        
        return { id: realId, session: response.data.session, url: correctUrl };
        
      } catch (error) {
        console.log(`   ❌ Error accediendo: ${error.response?.status || error.message}`);
      }
    }

    // 3. Crear demo funcional si no existe
    console.log('\n3️⃣ Creando demo funcional...');
    const sessionId = `demo_${Date.now()}`;
    
    const demoData = {
      session_id: sessionId,
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      quiz_id: 'granja-quiz-demo',
      host_id: '550e8400-e29b-41d4-a716-446655440001',
      format: 'trivia_lightning',
      status: 'active',
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
        farm_theme: true,          // ✅ CLAVE PARA ACTIVAR GRANJA
        grade_level: '1B',         // ✅ CLAVE PARA ACTIVAR GRANJA
        engine_config: {
          number_line_range: '1 10',
          visual_counters: true,
          progression_style: 'step_by_step'
        },
        tts_enabled: true,
        accessibility_mode: true
      },
      quizzes: {
        questions: [
          {
            question_id: 'granja-demo-1',
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
            question_id: 'granja-demo-2',
            question_order: 2,
            stem_md: '🐄 ¿Cuántas vacas están pastando?',
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

    await axios.post('http://localhost:5000/api/game/debug/add-session', demoData, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    const newId = sessionId.replace('demo_', '');
    const newUrl = `http://localhost:3000/student/games/${newId}/play`;
    
    console.log(`   ✅ Demo creado exitosamente`);
    console.log(`   🆔 ID: ${newId}`);
    console.log(`   🌐 URL: ${newUrl}`);
    
    return { id: newId, url: newUrl, created: true };

  } catch (error) {
    console.error('\n❌ ERROR GENERAL:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return null;
  }
}

// Ejecutar
verificarAccesoDemo().then(result => {
  if (result) {
    console.log('\n🎉 ================================');
    console.log('🎉 DEMO DE GRANJA DISPONIBLE');
    console.log('🎉 ================================');
    
    if (result.created) {
      console.log('✅ Se creó un nuevo demo funcional');
    } else {
      console.log('✅ Se encontró demo existente');
    }
    
    console.log(`\n🎮 PRUEBA AHORA:`);
    console.log(`   URL: ${result.url || `http://localhost:3000/student/games/${result.id}/play`}`);
    console.log(`   Deberías ver: FarmCountingGame con tema verde`);
    console.log(`   En lugar de: NumberLineRace genérico`);
    
  } else {
    console.log('\n❌ No se pudo crear/encontrar demo de granja');
  }
}); 