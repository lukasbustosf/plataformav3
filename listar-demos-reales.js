#!/usr/bin/env node

const axios = require('axios');

async function listarDemosReales() {
  console.log('📋 LISTANDO DEMOS REALES DISPONIBLES');
  console.log('=' .repeat(50));

  try {
    // Obtener lista de demos
    const demosResponse = await axios.get('http://localhost:5000/api/game/demos');
    const demos = demosResponse.data.sessions || [];
    
    console.log(`\nTotal demos encontrados: ${demos.length}\n`);
    
    for (let index = 0; index < demos.length; index++) {
      const demo = demos[index];
      console.log(`${index + 1}. ID: ${demo.session_id}`);
      console.log(`   Título: "${demo.title}"`);
      console.log(`   Engine: ${demo.engine_id || 'N/A'}`);
      console.log(`   Format: ${demo.format}`);
      
      // Verificar si es tema granja
      const hasGranja = demo.title?.toLowerCase().includes('granja') || 
                        demo.title?.toLowerCase().includes('farm') ||
                        demo.settings_json?.farm_theme === true;
      
      if (hasGranja) {
        console.log(`   🐄 TEMA GRANJA: SÍ`);
        
        // Mostrar URL para estudiante
        const studentId = demo.session_id.replace('game-', '').replace('game_', '');
        const studentUrl = `http://localhost:3000/student/games/${studentId}/play`;
        console.log(`   🌐 URL estudiante: ${studentUrl}`);
        
        // Intentar obtener datos completos
        console.log(`   🔍 Intentando obtener datos completos...`);
        
        try {
          const fullResponse = await axios.get(`http://localhost:5000/api/game/${studentId}`, {
            headers: { 'Authorization': 'Bearer demo_token' }
          });
          
          const session = fullResponse.data.session;
          
          // Verificar criterios de detección
          const titleContainsGranja = session.title?.toLowerCase().includes('granja');
          const farmThemeTrue = session.settings_json?.farm_theme === true;
          const grade1B = session.settings_json?.grade_level === '1B';
          const shouldUseFarmTheme = titleContainsGranja || farmThemeTrue || grade1B;
          
          console.log(`   ✅ Título con 'granja': ${titleContainsGranja}`);
          console.log(`   ✅ farm_theme: ${farmThemeTrue}`);
          console.log(`   ✅ grade_level 1B: ${grade1B}`);
          console.log(`   🎯 Activará FarmCountingGame: ${shouldUseFarmTheme ? 'SÍ' : 'NO'}`);
          
        } catch (err) {
          console.log(`   ❌ Error obteniendo datos: ${err.message}`);
        }
      }
      
      console.log(''); // Línea en blanco
    }
    
    // Buscar específicamente demos de granja
    const farmDemos = demos.filter(d => 
      d.title?.toLowerCase().includes('granja') || 
      d.title?.toLowerCase().includes('farm') ||
      d.settings_json?.farm_theme === true
    );
    
    console.log('\n🐄 RESUMEN DEMOS DE GRANJA:');
    console.log(`Demos con tema granja: ${farmDemos.length}`);
    
    if (farmDemos.length > 0) {
      console.log('\nDemos de granja disponibles para probar:');
      farmDemos.forEach(demo => {
        const studentId = demo.session_id.replace('game-', '').replace('game_', '');
        const url = `http://localhost:3000/student/games/${studentId}/play`;
        console.log(`- ${demo.title}`);
        console.log(`  URL: ${url}`);
      });
    } else {
      console.log('\n❌ NO se encontraron demos con tema granja configurado');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Ejecutar
listarDemosReales(); 