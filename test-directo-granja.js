#!/usr/bin/env node

const axios = require('axios');

async function testDirecto() {
  console.log('🔍 TEST DIRECTO - VERIFICANDO SISTEMA');
  console.log('=' .repeat(40));

  try {
    // 1. Verificar engines
    console.log('\n1️⃣ Verificando engines disponibles...');
    const enginesResponse = await axios.get('http://localhost:5000/api/game/engines', {
      headers: { 'Authorization': 'Bearer demo_token' }
    });
    
    console.log('Engines:', enginesResponse.data.engines?.map(e => e.id).join(', '));

    // 2. Verificar demos  
    console.log('\n2️⃣ Verificando demos...');
    const demosResponse = await axios.get('http://localhost:5000/api/game/demos');
    const demos = demosResponse.data.sessions || [];
    
    console.log(`Total demos: ${demos.length}`);
    
    // Buscar demos con granja
    const farmDemos = demos.filter(d => 
      d.title?.toLowerCase().includes('granja') || 
      d.settings_json?.farm_theme === true
    );
    
    console.log(`Demos con granja: ${farmDemos.length}`);
    if (farmDemos.length > 0) {
      farmDemos.forEach(d => {
        console.log(`- ${d.session_id}: ${d.title}`);
      });
    }

    // 3. Usar demo existente de granja si existe
    if (farmDemos.length > 0) {
      const farmDemo = farmDemos[0];
      const testUrl = `http://localhost:3000/student/games/${farmDemo.session_id.replace('game-', '')}/play`;
      
      console.log('\n3️⃣ Demo de granja encontrado:');
      console.log(`URL: ${testUrl}`);
      console.log(`Título: ${farmDemo.title}`);
      console.log(`Engine: ${farmDemo.engine_id}`);
      
      return { success: true, url: testUrl, demo: farmDemo };
    }

    // 4. Crear sesión simple si no hay demos
    console.log('\n4️⃣ Creando sesión de prueba simple...');
    const sessionId = `1752${Date.now().toString().slice(-6)}`;
    
    const simpleRequest = {
      session_id: `game_${sessionId}`,
      title: '🐄 Granja - Prueba Simple',
      engine_id: 'ENG01',
      format: 'trivia_lightning',
      settings_json: {
        farm_theme: true,
        grade_level: '1B'
      },
      status: 'active'
    };

    await axios.post('http://localhost:5000/api/game/debug/add-session', simpleRequest, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    const testUrl = `http://localhost:3000/student/games/${sessionId}/play`;
    console.log(`✅ Sesión creada: ${testUrl}`);
    
    return { success: true, url: testUrl, sessionId };

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

// Ejecutar
testDirecto().then(result => {
  if (result.success) {
    console.log('\n🎉 PRUEBA COMPLETADA');
    console.log(`Ve a: ${result.url}`);
    console.log('Deberías ver componente FarmCountingGame si la detección funciona');
  } else {
    console.log('\n❌ PRUEBA FALLÓ');
  }
}); 