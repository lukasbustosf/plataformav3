#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function auditoriaSistema() {
  console.log('🔍 ========================================');
  console.log('🔍 AUDITORÍA COMPLETA DEL SISTEMA');
  console.log('🔍 ========================================\n');

  try {
    // 1. Verificar la sesión problemática
    console.log('1️⃣ AUDITANDO SESIÓN PROBLEMÁTICA: 1752524906949');
    console.log('=' .repeat(50));
    
    const sessionResponse = await axios.get(`${BASE_URL}/api/game/1752524906949`, {
      headers: { 'Authorization': 'Bearer demo_token' }
    });
    
    const session = sessionResponse.data.session;
    console.log(`📊 Título: "${session.title}"`);
    console.log(`🎯 Engine ID: ${session.engine_id}`);
    console.log(`🎮 Formato: ${session.format}`);
    console.log(`🎨 Settings farm_theme: ${session.settings_json?.farm_theme}`);
    console.log(`🎓 Grade level: ${session.settings_json?.grade_level}`);
    console.log(`📝 Preguntas: ${session.quizzes?.questions?.length || 0}`);
    
    // Mostrar primeras 3 preguntas
    if (session.quizzes?.questions) {
      console.log('\n📝 CONTENIDO DE LAS PREGUNTAS:');
      session.quizzes.questions.slice(0, 3).forEach((q, i) => {
        console.log(`   Q${i+1}: "${q.stem_md || q.text}"`);
        console.log(`       Respuesta: ${q.correct_answer}`);
        console.log(`       Opciones: ${JSON.stringify(q.options_json)}`);
      });
    }

    // 2. Verificar lógica de detección
    console.log('\n2️⃣ VERIFICACIÓN DE DETECCIÓN DE TEMA');
    console.log('=' .repeat(50));
    
    const titleContainsGranja = session.title?.toLowerCase().includes('granja');
    const titleContainsFarm = session.title?.toLowerCase().includes('farm');
    const farmThemeTrue = session.settings_json?.farm_theme === true;
    const grade1B = session.settings_json?.grade_level === '1B';
    
    console.log(`   🔍 Título contiene 'granja': ${titleContainsGranja}`);
    console.log(`   🔍 Título contiene 'farm': ${titleContainsFarm}`);
    console.log(`   🔍 farm_theme === true: ${farmThemeTrue}`);
    console.log(`   🔍 grade_level === '1B': ${grade1B}`);
    
    const shouldUseFarmTheme = titleContainsGranja || titleContainsFarm || farmThemeTrue || grade1B;
    console.log(`   ✅ ¿Debería usar tema granja?: ${shouldUseFarmTheme}`);
    console.log(`   🎮 Componente que debería renderizar: ${shouldUseFarmTheme ? 'FarmCountingGame' : 'NumberLineRace'}`);

    // 3. Verificar disponibilidad de engines
    console.log('\n3️⃣ ENGINES DISPONIBLES');
    console.log('=' .repeat(50));
    
    const enginesResponse = await axios.get(`${BASE_URL}/api/game/engines`, {
      headers: { 'Authorization': 'Bearer demo_token' }
    });
    
    console.log('   Engines configurados:');
    enginesResponse.data.engines?.forEach(engine => {
      console.log(`   - ${engine.id}: ${engine.name}`);
    });

    // 4. Verificar demos disponibles
    console.log('\n4️⃣ DEMOS DISPONIBLES');
    console.log('=' .repeat(50));
    
    const demosResponse = await axios.get(`${BASE_URL}/api/game/demos`);
    const demos = demosResponse.data.sessions || [];
    
    console.log(`   Total demos: ${demos.length}`);
    demos.slice(0, 5).forEach(demo => {
      console.log(`   - ${demo.session_id}: "${demo.title}"`);
      console.log(`     Engine: ${demo.engine_id || 'N/A'}, Formato: ${demo.format}`);
    });

    // 5. Buscar demos con tema granja
    console.log('\n5️⃣ DEMOS CON TEMA GRANJA');
    console.log('=' .repeat(50));
    
    const farmDemos = demos.filter(demo => 
      demo.title?.toLowerCase().includes('granja') ||
      demo.title?.toLowerCase().includes('farm') ||
      demo.settings_json?.farm_theme === true
    );
    
    if (farmDemos.length > 0) {
      console.log(`   Encontrados ${farmDemos.length} demos con tema granja:`);
      farmDemos.forEach(demo => {
        console.log(`   - ${demo.session_id}: "${demo.title}"`);
        console.log(`     Farm theme: ${demo.settings_json?.farm_theme}`);
      });
    } else {
      console.log('   ❌ NO se encontraron demos con tema granja configurado');
    }

    // 6. Diagnóstico del problema
    console.log('\n6️⃣ DIAGNÓSTICO DEL PROBLEMA');
    console.log('=' .repeat(50));
    
    const problemas = [];
    
    if (!shouldUseFarmTheme) {
      problemas.push('❌ La sesión actual NO cumple criterios para tema granja');
    }
    
    if (session.quizzes?.questions) {
      const hasRelevantContent = session.quizzes.questions.some(q => 
        (q.stem_md || q.text)?.includes('🐄') || 
        (q.stem_md || q.text)?.includes('🐷') || 
        (q.stem_md || q.text)?.includes('🐔')
      );
      
      if (!hasRelevantContent) {
        problemas.push('❌ Las preguntas NO contienen animales de granja');
      }
    }
    
    if (session.title?.includes('numeros del 1 al 100') && session.quizzes?.questions?.[0]?.stem_md?.includes('11 - 9')) {
      problemas.push('❌ Contenido incoherente: título dice conteo pero pregunta es resta');
    }
    
    if (problemas.length > 0) {
      console.log('   PROBLEMAS IDENTIFICADOS:');
      problemas.forEach(problema => console.log(`   ${problema}`));
    } else {
      console.log('   ✅ No se identificaron problemas obvios');
    }

    // 7. Recomendaciones
    console.log('\n7️⃣ RECOMENDACIONES');
    console.log('=' .repeat(50));
    
    console.log('   Para arreglar el sistema:');
    console.log('   1. 🔧 Crear sesión con título explícito "🐄 Granja..."');
    console.log('   2. 🎯 Asegurar engine_id: "ENG01" Y farm_theme: true');
    console.log('   3. 📝 Generar contenido coherente de conteo (no resta)');
    console.log('   4. 🎨 Verificar que la detección funcione en frontend');
    console.log('   5. 🧪 Probar con sesión completamente nueva');

    return session;

  } catch (error) {
    console.error('\n❌ ERROR EN AUDITORÍA:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);
    } else {
      console.error(`   Error:`, error.message);
    }
    return null;
  }
}

// Ejecutar auditoría
if (require.main === module) {
  auditoriaSistema()
    .then((result) => {
      if (result) {
        console.log('\n✅ Auditoría completada');
        process.exit(0);
      } else {
        console.log('\n❌ Auditoría falló');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { auditoriaSistema }; 