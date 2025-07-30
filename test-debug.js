#!/usr/bin/env node
/**
 * TEST DEBUG: Diagnosticar el error 500 en evaluaciones gamificadas
 */

const http = require('http');

// Test simple sin IA para verificar qué componente falla
const testData = {
  class_id: 'class_demo_001',
  title: 'Test Debug Simple',
  description: 'Test para diagnosticar errores',
  oa_codes: ['MA01OA01'],
  difficulty: 'easy',
  question_count: 1, // Mínimo para reducir complejidad
  game_format: 'trivia_lightning',
  engine_id: 'ENG01',
  skin_theme: 'granja'
};

function makeRequest(data, callback) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/evaluation/gamified',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token-teacher',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        callback(null, { status: res.statusCode, response });
      } catch (error) {
        callback(null, { status: res.statusCode, rawResponse: responseData, parseError: error.message });
      }
    });
  });

  req.on('error', (error) => {
    callback(error, null);
  });

  req.write(postData);
  req.end();
}

async function runDiagnosticTests() {
  console.log('🔍 DIAGNÓSTICO: Error 500 en Evaluaciones Gamificadas\n');

  // Test 1: Verificar conectividad básica
  console.log('📡 Test 1: Verificar que el servidor responde');
  try {
    const healthReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/health',
      method: 'GET'
    }, (res) => {
      console.log(`   ✅ Servidor responde: ${res.statusCode}`);
      
      // Test 2: Probar endpoint gamificado
      setTimeout(() => {
        console.log('\n🎮 Test 2: Probar endpoint gamificado');
        makeRequest(testData, (error, result) => {
          if (error) {
            console.log(`   ❌ Error de conexión: ${error.message}`);
            return;
          }
          
          console.log(`   📡 Status: ${result.status}`);
          
          if (result.response) {
            console.log('   📋 Respuesta estructurada:');
            console.log(`      Success: ${result.response.success}`);
            console.log(`      Error: ${result.response.error}`);
            console.log(`      Details: ${result.response.details}`);
            
            if (result.response.evaluation) {
              console.log(`      Evaluation ID: ${result.response.evaluation.evaluation_id}`);
            }
            
            if (result.response.gameContent) {
              console.log(`      Questions: ${result.response.gameContent.questions?.length || 0}`);
            }
          } else {
            console.log('   📄 Respuesta raw:', result.rawResponse);
            console.log('   ❌ Parse error:', result.parseError);
          }
          
          // Análisis del error
          console.log('\n🔬 ANÁLISIS:');
          if (result.status === 500) {
            console.log('   🚨 Error 500 = Problema interno del servidor');
            console.log('   💡 Posibles causas:');
            console.log('      - Error en aiService.generateGameContent()');
            console.log('      - Falta API key de OpenAI');
            console.log('      - Error en la validación de compatibilidad');
            console.log('      - Problema con dependencias (OpenAI client)');
            
            if (result.response?.details) {
              console.log(`   🔍 Detalle específico: ${result.response.details}`);
            }
          }
          
          console.log('\n🛠️ RECOMENDACIONES:');
          console.log('   1. Verificar logs del servidor (consola donde ejecutaste npm start)');
          console.log('   2. Verificar que la API key de OpenAI esté configurada');
          console.log('   3. Revisar que no falten dependencias npm');
        });
      }, 1000);
    });
    
    healthReq.on('error', (error) => {
      console.log(`   ❌ Servidor no disponible: ${error.message}`);
    });
    
    healthReq.end();
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

runDiagnosticTests(); 