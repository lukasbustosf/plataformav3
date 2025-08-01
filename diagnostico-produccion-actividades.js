const axios = require('axios');

console.log('🔍 DIAGNÓSTICO DE ACTIVIDADES EN PRODUCCIÓN');
console.log('==========================================\n');

const BASE_URL = 'https://plataformav3.vercel.app';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n${description}...`);
    console.log(`URL: ${BASE_URL}${endpoint}`);
    
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Produccion/1.0'
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

async function runDiagnostic() {
  console.log('1️⃣ Probando rutas de API...');
  
  // Test 1: API directa
  await testEndpoint('/api/lab/activities', 'API directa /api/lab/activities');
  
  // Test 2: Ruta /lab
  await testEndpoint('/lab/activities', 'Ruta /lab/activities');
  
  // Test 3: Ruta con autenticación simulada
  console.log('\n2️⃣ Probando con headers de autenticación...');
  try {
    const response = await axios.get(`${BASE_URL}/lab/activities`, {
      headers: {
        'Authorization': 'Bearer demo-token',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    console.log('✅ Con autenticación simulada:', response.status);
    console.log('📊 Datos:', response.data);
  } catch (error) {
    console.log('❌ Error con auth:', error.message);
  }
  
  // Test 4: Verificar configuración de Vercel
  console.log('\n3️⃣ Verificando configuración de Vercel...');
  try {
    const vercelResponse = await axios.get(`${BASE_URL}/api/health`, {
      timeout: 5000
    });
    console.log('✅ Health check:', vercelResponse.status);
  } catch (error) {
    console.log('❌ Health check falló:', error.message);
  }
  
  console.log('\n🔍 DIAGNÓSTICO COMPLETADO');
  console.log('==========================');
}

runDiagnostic().catch(console.error); 