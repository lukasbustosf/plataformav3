const axios = require('axios');

console.log('🔍 DIAGNÓSTICO DEFINITIVO - ACTIVIDADES LAB');
console.log('============================================\n');

const RAILWAY_URL = 'https://plataformav3-production.up.railway.app';
const VERCEL_URL = 'https://plataformav3.vercel.app';

async function testEndpoint(baseUrl, endpoint, description, headers = {}) {
  try {
    console.log(`\n${description}...`);
    console.log(`URL: ${baseUrl}${endpoint}`);
    
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Definitivo/1.0',
        ...headers
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

async function runDefinitiveDiagnostic() {
  console.log('1️⃣ PROBANDO RAILWAY SIN AUTENTICACIÓN...');
  
  // Test 1: Railway /lab/activities (sin auth)
  await testEndpoint(RAILWAY_URL, '/lab/activities', 'Railway /lab/activities (sin auth)');
  
  // Test 2: Railway /api/lab/activities (sin auth)
  await testEndpoint(RAILWAY_URL, '/api/lab/activities', 'Railway /api/lab/activities (sin auth)');
  
  // Test 3: Railway /lab/materials (sin auth)
  await testEndpoint(RAILWAY_URL, '/lab/materials', 'Railway /lab/materials (sin auth)');
  
  console.log('\n2️⃣ PROBANDO CON TOKEN DEMO...');
  
  // Test 4: Con token demo
  await testEndpoint(RAILWAY_URL, '/lab/activities', 'Railway con token demo', {
    'Authorization': 'Bearer demo-token-teacher-1'
  });
  
  console.log('\n3️⃣ PROBANDO VERCEL CON REDIRECCIÓN...');
  
  // Test 5: Vercel redirigido
  await testEndpoint(VERCEL_URL, '/lab/activities', 'Vercel /lab/activities redirigido');
  
  // Test 6: Vercel API redirigido
  await testEndpoint(VERCEL_URL, '/api/lab/activities', 'Vercel /api/lab/activities redirigido');
  
  console.log('\n4️⃣ VERIFICANDO CONFIGURACIÓN DE RUTAS...');
  
  // Test 7: Health check
  try {
    const healthResponse = await axios.get(`${RAILWAY_URL}/health`, {
      timeout: 5000
    });
    console.log('✅ Railway Health check:', healthResponse.status);
  } catch (error) {
    console.log('❌ Railway Health check falló:', error.message);
  }
  
  // Test 8: Verificar todas las rutas disponibles
  console.log('\n5️⃣ VERIFICANDO RUTAS DISPONIBLES...');
  const testRoutes = [
    '/lab/activities',
    '/api/lab/activities', 
    '/lab/materials',
    '/api/lab/materials',
    '/api/lab/activities/1',
    '/lab/activities/1'
  ];
  
  for (const route of testRoutes) {
    try {
      const response = await axios.get(`${RAILWAY_URL}${route}`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Route-Test/1.0'
        }
      });
      console.log(`✅ ${route}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${route}: ${error.response?.status || error.message}`);
    }
  }
  
  console.log('\n🔍 DIAGNÓSTICO DEFINITIVO COMPLETADO');
  console.log('=======================================');
  console.log('\n📋 RESUMEN DEL PROBLEMA:');
  console.log('- Si /lab/activities funciona: El problema está en el frontend');
  console.log('- Si /lab/activities falla: El problema está en el backend');
  console.log('- Si Vercel redirige mal: El problema está en vercel.json');
}

runDefinitiveDiagnostic().catch(console.error); 