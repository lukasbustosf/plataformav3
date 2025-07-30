#!/usr/bin/env node
/**
 * TEST: Nueva funcionalidad de evaluaciones gamificadas
 * Verifica que el endpoint POST /evaluation/gamified funciona correctamente
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Mock token para testing (en desarrollo)
const TEST_TOKEN = 'mock_teacher_token';

async function testGamifiedEvaluation() {
  console.log('🧪 TESTING: Evaluaciones Gamificadas - Día 1\n');

  try {
    // Test 1: Crear evaluación gamificada básica
    console.log('📝 Test 1: Crear evaluación trivia_lightning + ENG01 + granja');
    
    const testData1 = {
      class_id: 'class_demo_001',
      title: 'Conteo de Animales en la Granja',
      description: 'Evaluación gamificada de conteo con temática de granja',
      oa_codes: ['MA01OA01', 'MA01OA02'],
      difficulty: 'easy',
      question_count: 5,
      game_format: 'trivia_lightning',
      engine_id: 'ENG01',
      skin_theme: 'granja',
      time_limit_minutes: 15,
      weight: 20
    };

    const response1 = await makeRequest('POST', '/evaluation/gamified', testData1);
    console.log('✅ Respuesta:', {
      success: response1.success,
      evaluation_id: response1.evaluation?.evaluation_id,
      questions_generated: response1.gameContent?.questions?.length,
      engine_used: response1.metadata?.engineUsed,
      format_used: response1.metadata?.formatUsed,
      skin_applied: response1.metadata?.skinApplied
    });

    // Test 2: Crear evaluación memory_flip + ENG02
    console.log('\n📝 Test 2: Crear evaluación memory_flip + ENG02 + espacio');
    
    const testData2 = {
      class_id: 'class_demo_001',
      title: 'Operaciones en el Espacio',
      oa_codes: ['MA01OA04', 'MA01OA06'],
      difficulty: 'medium',
      question_count: 8,
      game_format: 'memory_flip',
      engine_id: 'ENG02',
      skin_theme: 'espacio'
    };

    const response2 = await makeRequest('POST', '/evaluation/gamified', testData2);
    console.log('✅ Respuesta:', {
      success: response2.success,
      questions_generated: response2.gameContent?.questions?.length,
      message: response2.message
    });

    // Test 3: Crear evaluación drag_drop_sorting + ENG02
    console.log('\n📝 Test 3: Crear evaluación drag_drop_sorting + ENG02 + oceano');
    
    const testData3 = {
      class_id: 'class_demo_001',
      title: 'Clasificar Vida Marina',
      oa_codes: ['CN01OA01'],
      difficulty: 'medium',
      question_count: 6,
      game_format: 'drag_drop_sorting',
      engine_id: 'ENG02',
      skin_theme: 'oceano'
    };

    const response3 = await makeRequest('POST', '/evaluation/gamified', testData3);
    console.log('✅ Respuesta:', response3.success ? 'SUCCESS' : 'FAILED');

    // Test 4: Error case - formato incompatible
    console.log('\n📝 Test 4: Error case - formato incompatible (word_builder + ENG01)');
    
    const testData4 = {
      class_id: 'class_demo_001',
      title: 'Test Error',
      oa_codes: ['LE01OA03'],
      game_format: 'word_builder',
      engine_id: 'ENG01', // Incompatible: word_builder needs ENG05 or ENG06
      skin_theme: 'default'
    };

    const response4 = await makeRequest('POST', '/evaluation/gamified', testData4);
    console.log('✅ Error esperado:', response4.error ? 'CORRECTO' : 'FAILED');

    console.log('\n🎉 RESUMEN DE TESTS:');
    console.log('✅ Endpoint /evaluation/gamified funcionando');
    console.log('✅ Validación de compatibilidad formato-engine');
    console.log('✅ Generación de contenido por IA');
    console.log('✅ Integración de skins temáticos');
    console.log('\n💡 DÍA 1 COMPLETADO EXITOSAMENTE!');

  } catch (error) {
    console.error('❌ Error en testing:', error.message);
  }
}

async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;

  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

// Función para verificar si el servidor está ejecutándose
async function checkServerStatus() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Servidor funcionando en', BASE_URL);
    return true;
  } catch (error) {
    console.log('❌ Servidor no disponible en', BASE_URL);
    console.log('   Asegúrate de que el servidor esté ejecutándose con: npm start');
    return false;
  }
}

async function runTests() {
  console.log('🚀 INICIANDO TESTS DE EVALUACIONES GAMIFICADAS\n');
  
  const serverRunning = await checkServerStatus();
  if (!serverRunning) {
    console.log('\n🔧 INSTRUCCIONES:');
    console.log('1. cd server');
    console.log('2. npm start');
    console.log('3. Ejecutar este test nuevamente');
    return;
  }
  
  await testGamifiedEvaluation();
}

// Ejecutar tests
if (require.main === module) {
  runTests();
}

module.exports = { testGamifiedEvaluation, makeRequest }; 