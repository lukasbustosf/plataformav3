const axios = require('axios');

console.log('🔍 DIAGNÓSTICO COMPLETO DE PRODUCCIÓN');
console.log('=======================================\n');

const RAILWAY_URL = 'https://plataformav3-production.up.railway.app';
const VERCEL_URL = 'https://plataformav3.vercel.app';

async function testEndpoint(baseUrl, endpoint, description) {
  try {
    console.log(`\n${description}...`);
    console.log(`URL: ${baseUrl}${endpoint}`);
    
    const response = await axios.get(`${baseUrl}${endpoint}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Completo/1.0',
        'Authorization': 'Bearer demo-token'
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

async function runCompleteDiagnostic() {
  console.log('1️⃣ PROBANDO RAILWAY DIRECTAMENTE...');
  
  // Test 1: Railway API directa
  await testEndpoint(RAILWAY_URL, '/api/lab/activities', 'Railway API directa /api/lab/activities');
  
  // Test 2: Railway /lab (que no debería existir)
  await testEndpoint(RAILWAY_URL, '/lab/activities', 'Railway /lab/activities (debería fallar)');
  
  // Test 3: Railway materials
  await testEndpoint(RAILWAY_URL, '/api/lab/materials', 'Railway API materials');
  
  // Test 4: Railway /lab materials (que no debería existir)
  await testEndpoint(RAILWAY_URL, '/lab/materials', 'Railway /lab/materials (debería fallar)');
  
  console.log('\n2️⃣ PROBANDO VERCEL CON REDIRECCIÓN...');
  
  // Test 5: Vercel con redirección
  await testEndpoint(VERCEL_URL, '/api/lab/activities', 'Vercel redirigido a Railway');
  
  // Test 6: Vercel /lab con redirección
  await testEndpoint(VERCEL_URL, '/lab/activities', 'Vercel /lab redirigido a Railway');
  
  console.log('\n3️⃣ VERIFICANDO CONFIGURACIÓN...');
  
  // Test 7: Health check Railway
  try {
    const healthResponse = await axios.get(`${RAILWAY_URL}/health`, {
      timeout: 5000
    });
    console.log('✅ Railway Health check:', healthResponse.status);
  } catch (error) {
    console.log('❌ Railway Health check falló:', error.message);
  }
  
  // Test 8: Verificar CORS
  console.log('\n4️⃣ VERIFICANDO CORS...');
  try {
    const corsResponse = await axios.get(`${RAILWAY_URL}/api/lab/activities`, {
      timeout: 5000,
      headers: {
        'Origin': 'https://plataformav3.vercel.app',
        'User-Agent': 'CORS-Test/1.0'
      }
    });
    console.log('✅ CORS funciona:', corsResponse.status);
  } catch (error) {
    console.log('❌ CORS falló:', error.message);
  }
  
  console.log('\n🔍 DIAGNÓSTICO COMPLETADO');
  console.log('==========================');
  console.log('\n📋 RESUMEN:');
  console.log('- Railway /api/lab/activities: DEBE funcionar');
  console.log('- Railway /lab/activities: DEBE fallar (404)');
  console.log('- Vercel /api/lab/activities: DEBE redirigir a Railway');
  console.log('- Vercel /lab/activities: DEBE redirigir a Railway');
}

runCompleteDiagnostic().catch(console.error); 