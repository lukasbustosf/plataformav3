const axios = require('axios');

console.log('🔍 DIAGNÓSTICO DE ACTIVIDADES EN PRODUCCIÓN');
console.log('==========================================\n');

const BASE_URL = 'https://plataformav3-production.up.railway.app';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n1️⃣ Probando ${description}...`);
    console.log(`URL: ${BASE_URL}${endpoint}`);
    
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`✅ ${description} funciona`);
    console.log(`Status: ${response.status}`);
    console.log(`Datos: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
    
    return true;
  } catch (error) {
    console.log(`❌ Error en ${description}:`);
    console.log(`Status: ${error.response?.status || 'No response'}`);
    console.log(`Error: ${error.message}`);
    if (error.response?.data) {
      console.log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

async function testFrontendURLs() {
  console.log('\n2️⃣ Probando URLs del frontend...');
  
  const frontendURLs = [
    'https://plataformav3.vercel.app/teacher/labs/activities',
    'https://plataformav3.vercel.app/teacher/labs/activity/quien-come-que'
  ];
  
  for (const url of frontendURLs) {
    try {
      console.log(`\nProbando: ${url}`);
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log(`✅ Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log(`Status: ${error.response?.status || 'No response'}`);
    }
  }
}

async function main() {
  // Test backend endpoints
  await testEndpoint('/api/lab/activities', 'API /api/lab/activities');
  await testEndpoint('/lab/activities', 'API /lab/activities');
  await testEndpoint('/api/lab/materials', 'API /api/lab/materials');
  await testEndpoint('/lab/materials', 'API /lab/materials');
  
  // Test frontend URLs
  await testFrontendURLs();
  
  console.log('\n🎯 RESUMEN:');
  console.log('Si /api/lab/activities funciona pero /lab/activities no,');
  console.log('el problema es que el backend en producción no tiene la nueva ruta /lab');
}

main().catch(console.error); 