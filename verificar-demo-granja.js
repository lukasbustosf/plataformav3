#!/usr/bin/env node

const axios = require('axios');

async function verificarDemoGranja() {
  console.log('🔍 VERIFICANDO DEMO GRANJA EXISTENTE');
  console.log('=' .repeat(50));

  try {
    // Obtener datos del demo de granja
    const response = await axios.get('http://localhost:5000/api/game/demo-001', {
      headers: { 'Authorization': 'Bearer demo_token' }
    });

    const session = response.data.session;
    
    console.log('\n📊 DATOS DEL DEMO:');
    console.log(`Título: "${session.title}"`);
    console.log(`Engine ID: ${session.engine_id}`);
    console.log(`Formato: ${session.format}`);
    console.log(`Settings:`, JSON.stringify(session.settings_json, null, 2));
    
    // Aplicar lógica de detección exacta del frontend
    const titleContainsGranja = session.title?.toLowerCase().includes('granja');
    const titleContainsFarm = session.title?.toLowerCase().includes('farm');
    const farmThemeTrue = session.settings_json?.farm_theme === true;
    const grade1B = session.settings_json?.grade_level === '1B';
    
    console.log('\n🎨 ANÁLISIS DE DETECCIÓN:');
    console.log(`✅ Título contiene 'granja': ${titleContainsGranja}`);
    console.log(`✅ Título contiene 'farm': ${titleContainsFarm}`);
    console.log(`✅ farm_theme === true: ${farmThemeTrue}`);
    console.log(`✅ grade_level === '1B': ${grade1B}`);
    
    const shouldUseFarmTheme = titleContainsGranja || titleContainsFarm || farmThemeTrue || grade1B;
    
    console.log(`\n🎯 RESULTADO:`);
    console.log(`Debería usar FarmCountingGame: ${shouldUseFarmTheme ? '✅ SÍ' : '❌ NO'}`);
    console.log(`Componente esperado: ${shouldUseFarmTheme ? 'FarmCountingGame' : 'NumberLineRace'}`);
    
    if (shouldUseFarmTheme) {
      console.log('\n🎉 ¡EL DEMO DEBERÍA ACTIVAR FARMCOUNTINGGAME!');
      console.log('Si no lo ves, el problema está en el frontend');
    } else {
      console.log('\n⚠️ El demo NO cumple criterios para FarmCountingGame');
      console.log('Necesitamos arreglar la configuración del demo');
    }
    
    // Mostrar preguntas del demo
    if (session.quizzes?.questions) {
      console.log('\n📝 PREGUNTAS DEL DEMO:');
      session.quizzes.questions.slice(0, 3).forEach((q, i) => {
        console.log(`Q${i+1}: "${q.stem_md || q.text}"`);
      });
    }
    
    console.log(`\n🌐 URL para probar: http://localhost:3000/student/games/demo-001/play`);
    
    return { session, shouldUseFarmTheme };

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

// Ejecutar
verificarDemoGranja().then(result => {
  if (result) {
    console.log('\n' + '='.repeat(50));
    if (result.shouldUseFarmTheme) {
      console.log('✅ El demo DEBERÍA mostrar FarmCountingGame');
      console.log('Si ves NumberLineRace, hay problema en el frontend');
    } else {
      console.log('❌ El demo NO activará FarmCountingGame');
      console.log('Necesitamos configurar farm_theme: true o grade_level: "1B"');
    }
  }
}); 