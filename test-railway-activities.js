const axios = require('axios');

console.log('🔍 VERIFICANDO ACTIVIDADES EN RAILWAY');
console.log('=====================================\n');

const RAILWAY_URL = 'https://plataformav3-production.up.railway.app';

async function testRailwayEndpoint(endpoint, description) {
  try {
    console.log(`\n${description}...`);
    console.log(`URL: ${RAILWAY_URL}${endpoint}`);
    
    const response = await axios.get(`${RAILWAY_URL}${endpoint}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Test-Railway/1.0'
      }
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Datos recibidos:`, response.data);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`📋 Cantidad de actividades: ${response.data.length}`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data:`, error.response.data);
    }
    return false;
  }
}

async function runRailwayTest() {
  console.log('1️⃣ Probando Railway directamente...');
  
  // Test 1: API directa
  await testRailwayEndpoint('/api/lab/activities', 'API directa /api/lab/activities');
  
  // Test 2: Health check
  console.log('\n2️⃣ Probando health check...');
  try {
    const healthResponse = await axios.get(`${RAILWAY_URL}/health`, {
      timeout: 5000
    });
    console.log('✅ Health check:', healthResponse.status);
  } catch (error) {
    console.log('❌ Health check falló:', error.message);
  }
  
  console.log('\n🔍 VERIFICACIÓN COMPLETADA');
  console.log('==========================');
}

runRailwayTest().catch(console.error); 