const fetch = require('node-fetch');

async function testAuth(endpoint, apiUrl, description) {
  console.log(`\n🔍 Probando ${description}:`);
  console.log(`URL: ${apiUrl}${endpoint}`);
  
  try {
    // Test 1: Sin token
    console.log('\n1️⃣ Sin token:');
    const response1 = await fetch(`${apiUrl}${endpoint}`);
    console.log('✅ Status:', response1.status);
    const data1 = await response1.text();
    console.log('📊 Data:', data1.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    // Test 2: Con token demo
    console.log('\n2️⃣ Con token demo:');
    const response2 = await fetch(`${apiUrl}${endpoint}`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher-123'
      }
    });
    console.log('✅ Status:', response2.status);
    const data2 = await response2.json();
    console.log('📊 Data count:', data2?.data?.length || 'No data');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    // Test 3: Con token demo admin
    console.log('\n3️⃣ Con token demo admin:');
    const response3 = await fetch(`${apiUrl}${endpoint}`, {
      headers: {
        'Authorization': 'Bearer demo-token-admin-789'
      }
    });
    console.log('✅ Status:', response3.status);
    const data3 = await response3.json();
    console.log('📊 Data count:', data3?.data?.length || 'No data');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function diagnoseAuth() {
  console.log('🚀 DIAGNÓSTICO DE AUTENTICACIÓN DEL LABORATORIO');
  console.log('='.repeat(60));
  
  const LOCAL_API_URL = 'http://localhost:5000';
  const PRODUCTION_API_URL = 'https://edu21-server-production.up.railway.app';
  
  // Test activities endpoint
  await testAuth('/api/lab/activities', LOCAL_API_URL, 'ACTIVIDADES (LOCAL)');
  await testAuth('/api/lab/activities', PRODUCTION_API_URL, 'ACTIVIDADES (PRODUCCIÓN)');
  
  console.log('\n🎯 RESUMEN:');
  console.log('- Si LOCAL funciona pero PRODUCCIÓN no: problema de configuración de producción');
  console.log('- Si ambos fallan: problema de autenticación general');
  console.log('- Si ambos funcionan: problema del frontend');
}

diagnoseAuth().catch(console.error); 