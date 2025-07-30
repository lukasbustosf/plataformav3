#!/usr/bin/env node
/**
 * TEST SIMPLE: Verificar que el servidor y endpoint /api/evaluation/gamified funciona
 */

const http = require('http');

const testData = {
  class_id: 'class_demo_001',
  title: 'Test Evaluación Gamificada',
  description: 'Test del nuevo endpoint',
  oa_codes: ['MA01OA01'],
  difficulty: 'easy',
  question_count: 3,
  game_format: 'trivia_lightning',
  engine_id: 'ENG01',
  skin_theme: 'granja'
};

const postData = JSON.stringify(testData);

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

console.log('🧪 TESTING: Evaluación Gamificada - Test Simple');
console.log('📝 Enviando request a:', `http://localhost:5000${options.path}`);
console.log('🔐 Usando token: demo-token-teacher');
console.log('📊 Datos:', { 
  format: testData.game_format, 
  engine: testData.engine_id, 
  skin: testData.skin_theme 
});

const req = http.request(options, (res) => {
  console.log(`\n📡 Status: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n✅ RESPUESTA:');
      console.log('   Success:', response.success);
      console.log('   Message:', response.message);
      console.log('   Evaluation ID:', response.evaluation?.evaluation_id);
      console.log('   Questions Generated:', response.gameContent?.questions?.length || 0);
      console.log('   Engine Used:', response.metadata?.engineUsed);
      console.log('   Format Used:', response.metadata?.formatUsed);
      
      if (response.success) {
        console.log('\n🎉 TEST EXITOSO - ¡Evaluaciones gamificadas funcionando!');
        console.log('🎮 Engine:', response.metadata?.engineUsed || response.evaluation?.engine_id);
        console.log('🎨 Skin:', response.metadata?.skinApplied || response.evaluation?.skin_theme);
        console.log('📋 Preguntas generadas:', response.gameContent?.questions?.length || 0);
      } else {
        console.log('\n❌ Test falló:', response.error);
      }
    } catch (error) {
      console.log('\n📄 Respuesta raw:', data);
      console.log('\n❌ Error parsing JSON:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Error de conexión:', error.message);
  console.log('\n🔧 Asegúrate de que el servidor esté corriendo:');
  console.log('   cd server && npm start');
});

req.write(postData);
req.end(); 