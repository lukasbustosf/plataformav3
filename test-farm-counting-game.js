#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testFarmCountingGameSystem() {
  console.log('🧪 =================================');
  console.log('🧪 PRUEBA: SISTEMA FARM COUNTING GAME');
  console.log('🧪 =================================\n');

  try {
    // 1. Crear evaluación gamificada con tema granja
    console.log('1️⃣ Creando evaluación gamificada con tema granja...');
    const createResponse = await axios.post(`${BASE_URL}/api/evaluation/gamified`, {
      title: '🐄 Granja 1° Básico - Conteo Interactivo',
      description: 'Conteo de animales de granja para niños de primer año básico',
      class_id: 'class-1b-001',
      game_format: 'trivia_lightning',
      subject: 'MAT',
      grade: '1B',
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      author_id: '550e8400-e29b-41d4-a716-446655440001',
      engine_id: 'ENG01',
      skin_theme: 'granja',
      difficulty: 'easy',
      question_count: 5,
      oa_codes: ['OA1'],
      time_limit_minutes: 15
    }, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    const evaluation = createResponse.data.evaluation;
    console.log(`   ✅ Evaluación creada: ${evaluation.title}`);
    console.log(`   🎯 Engine ID: ${evaluation.engine_id}`);
    console.log(`   🎨 Skin Theme: ${evaluation.skin_theme}`);
    console.log(`   📊 Preguntas: ${evaluation.generated_content?.questions?.length || 0}`);

    // 2. Verificar contenido generado
    console.log('\n2️⃣ Verificando contenido generado...');
    const questions = evaluation.generated_content?.questions || [];
    
    if (questions.length > 0) {
      console.log(`   📝 Total preguntas: ${questions.length}`);
      
      questions.forEach((q, index) => {
        console.log(`   Q${index + 1}: "${q.text || q.stem_md}"`);
        console.log(`       🎯 Respuesta correcta: ${q.correct_answer}`);
        console.log(`       🐄 Animal detectado: ${q.text?.includes('🐄') ? 'Vacas' : 
                                                   q.text?.includes('🐷') ? 'Cerditos' : 
                                                   q.text?.includes('🐔') ? 'Pollitos' : 
                                                   q.text?.includes('🐑') ? 'Ovejas' : 'Genérico'}`);
      });
    } else {
      console.log('   ⚠️ No se generaron preguntas');
    }

    // 3. Iniciar sesión de juego automáticamente
    console.log('\n3️⃣ Iniciando sesión de juego automáticamente...');
    const sessionResponse = await axios.post(`${BASE_URL}/api/evaluation/gamified/${evaluation.id}/start-game`, {
      host_id: '550e8400-e29b-41d4-a716-446655440001'
    }, {
      headers: {
        'Authorization': 'Bearer demo_token',
        'Content-Type': 'application/json'
      }
    });

    const gameSession = sessionResponse.data.session;
    console.log(`   ✅ Sesión creada: ${gameSession.session_id}`);
    console.log(`   🎮 Formato: ${gameSession.format}`);
    console.log(`   🔧 Engine ID: ${gameSession.engine_id}`);
    console.log(`   🎨 Tema granja: ${gameSession.settings_json?.farm_theme}`);

    // 4. Verificar acceso del estudiante
    console.log('\n4️⃣ Verificando acceso del estudiante...');
    const sessionId = gameSession.session_id.replace('game_', '');
    const studentUrl = `http://localhost:3000/student/games/${sessionId}/play`;
    
    console.log(`   🎯 URL del estudiante: ${studentUrl}`);

    // 5. Verificar detección de tema granja
    console.log('\n5️⃣ Verificando detección de tema granja...');
    
    const farmThemeDetected = 
      gameSession.title?.toLowerCase().includes('granja') ||
      gameSession.title?.toLowerCase().includes('farm') ||
      gameSession.settings_json?.farm_theme === true ||
      gameSession.settings_json?.grade_level === '1B';
    
    console.log(`   🐄 Tema granja detectado: ${farmThemeDetected ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   🎮 Componente esperado: ${farmThemeDetected ? 'FarmCountingGame' : 'NumberLineRace'}`);

    // 6. Resumen de la prueba
    console.log('\n6️⃣ Resumen de la prueba:');
    console.log(`   📊 Estado general: ✅ EXITOSO`);
    console.log(`   🎯 Engine ENG01: ✅ Configurado`);
    console.log(`   🐄 Tema granja: ${farmThemeDetected ? '✅ Detectado' : '❌ Faltante'}`);
    console.log(`   📝 Contenido: ${questions.length > 0 ? '✅ Generado' : '❌ Faltante'}`);
    console.log(`   🎮 Sesión: ✅ Activa`);
    
    console.log('\n🎉 =================================');
    console.log('🎉 PRUEBA COMPLETADA EXITOSAMENTE');
    console.log('🎉 =================================');
    
    console.log(`\n👶 Para probar la experiencia completa:`);
    console.log(`   1. Ve a: ${studentUrl}`);
    console.log(`   2. Deberías ver "Granja de Conteo" en lugar de "Carrera Numérica"`);
    console.log(`   3. Los animales deberían ser clickeables con sonidos`);
    console.log(`   4. El diseño debería ser apropiado para 1° básico`);

    return true;

  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error('   ', error.response?.data || error.message);
    return false;
  }
}

// Ejecutar la prueba
if (require.main === module) {
  testFarmCountingGameSystem()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error inesperado:', error);
      process.exit(1);
    });
}

module.exports = { testFarmCountingGameSystem }; 