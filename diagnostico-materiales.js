const axios = require('axios');

console.log('🔍 DIAGNÓSTICO: MATERIALES DE LABORATORIO');
console.log('==========================================\n');

const RAILWAY_URL = 'https://plataformav3-production.up.railway.app';
const LOCAL_URL = 'http://localhost:5000';

async function testMaterials(baseUrl, description) {
  try {
    console.log(`\n${description}...`);
    console.log(`URL: ${baseUrl}/lab/materials`);
    
    const response = await axios.get(`${baseUrl}/lab/materials`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Materiales/1.0'
      }
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Datos recibidos:`, response.data);
    
    if (response.data && response.data.data) {
      console.log(`📋 Cantidad de materiales: ${response.data.data.length}`);
      console.log(`📋 Materiales disponibles:`);
      response.data.data.forEach((material: any, index: number) => {
        console.log(`   ${index + 1}. ID: ${material.id} - Nombre: ${material.name} - Código: ${material.internal_code}`);
      });
    } else if (response.data && Array.isArray(response.data)) {
      console.log(`📋 Cantidad de materiales: ${response.data.length}`);
      console.log(`📋 Materiales disponibles:`);
      response.data.forEach((material: any, index: number) => {
        console.log(`   ${index + 1}. ID: ${material.id} - Nombre: ${material.name} - Código: ${material.internal_code}`);
      });
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

async function runMaterialsDiagnostic() {
  console.log('1️⃣ PROBANDO MATERIALES EN LOCAL...');
  await testMaterials(LOCAL_URL, 'Local /lab/materials');
  
  console.log('\n2️⃣ PROBANDO MATERIALES EN RAILWAY...');
  await testMaterials(RAILWAY_URL, 'Railway /lab/materials');
  
  console.log('\n3️⃣ PROBANDO MATERIALES EN VERCEL...');
  try {
    const vercelResponse = await axios.get('https://plataformav3.vercel.app/lab/materials', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Materiales/1.0'
      }
    });
    console.log('✅ Vercel /lab/materials:', vercelResponse.status);
    console.log('📊 Datos:', vercelResponse.data);
  } catch (error) {
    console.log('❌ Vercel /lab/materials falló:', error.message);
  }
  
  console.log('\n🔍 DIAGNÓSTICO COMPLETADO');
  console.log('==========================');
  console.log('\n📋 POSIBLES PROBLEMAS:');
  console.log('- Si local funciona pero Railway no: Problema de base de datos');
  console.log('- Si Railway funciona pero frontend no: Problema de API');
  console.log('- Si no hay materiales: Necesitas crear materiales primero');
}

runMaterialsDiagnostic().catch(console.error); 