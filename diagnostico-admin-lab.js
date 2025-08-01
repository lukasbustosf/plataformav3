const axios = require('axios');

console.log('🔍 DIAGNÓSTICO: ADMIN LAB MANAGEMENT');
console.log('=====================================\n');

const RAILWAY_URL = 'https://plataformav3-production.up.railway.app';
const LOCAL_URL = 'http://localhost:5000';

async function testAdminEndpoints(baseUrl, description) {
  console.log(`\n${description}...`);
  
  // Test /lab/products
  try {
    console.log(`📦 Probando ${baseUrl}/lab/products...`);
    const productsResponse = await axios.get(`${baseUrl}/lab/products`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Admin-Lab/1.0'
      }
    });
    
    console.log(`✅ /lab/products - Status: ${productsResponse.status}`);
    console.log(`📊 Datos recibidos:`, productsResponse.data);
    
    if (productsResponse.data && productsResponse.data.data) {
      console.log(`📋 Cantidad de productos: ${productsResponse.data.data.length}`);
      productsResponse.data.data.forEach((product, index) => {
        console.log(`   ${index + 1}. ID: ${product.id} - Nombre: ${product.name}`);
        if (product.lab_material && product.lab_material.length > 0) {
          console.log(`      📦 Materiales: ${product.lab_material.length}`);
          product.lab_material.forEach((material) => {
            console.log(`         - ${material.name} (ID: ${material.id})`);
          });
        }
      });
    }
  } catch (error) {
    console.log(`❌ /lab/products - Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data:`, error.response.data);
    }
  }
  
  // Test /lab/materials
  try {
    console.log(`\n📋 Probando ${baseUrl}/lab/materials...`);
    const materialsResponse = await axios.get(`${baseUrl}/lab/materials`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Admin-Lab/1.0'
      }
    });
    
    console.log(`✅ /lab/materials - Status: ${materialsResponse.status}`);
    console.log(`📊 Datos recibidos:`, materialsResponse.data);
    
    if (materialsResponse.data && materialsResponse.data.data) {
      console.log(`📋 Cantidad de materiales: ${materialsResponse.data.data.length}`);
      materialsResponse.data.data.forEach((material, index) => {
        console.log(`   ${index + 1}. ID: ${material.id} - Nombre: ${material.name} - Código: ${material.internal_code}`);
      });
    }
  } catch (error) {
    console.log(`❌ /lab/materials - Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data:`, error.response.data);
    }
  }
}

async function testFrontendPages() {
  console.log('\n🌐 PROBANDO PÁGINAS FRONTEND...');
  
  // Test Vercel admin page
  try {
    console.log('\n📱 Probando https://plataformav3.vercel.app/admin/lab-management...');
    const vercelResponse = await axios.get('https://plataformav3.vercel.app/admin/lab-management', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Admin-Lab/1.0'
      }
    });
    console.log('✅ Vercel admin page - Status:', vercelResponse.status);
  } catch (error) {
    console.log('❌ Vercel admin page - Error:', error.message);
  }
  
  // Test Local admin page
  try {
    console.log('\n🏠 Probando http://localhost:3000/admin/lab-management...');
    const localResponse = await axios.get('http://localhost:3000/admin/lab-management', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Diagnostico-Admin-Lab/1.0'
      }
    });
    console.log('✅ Local admin page - Status:', localResponse.status);
  } catch (error) {
    console.log('❌ Local admin page - Error:', error.message);
  }
}

async function runAdminDiagnostic() {
  console.log('1️⃣ PROBANDO ENDPOINTS EN LOCAL...');
  await testAdminEndpoints(LOCAL_URL, 'Local /lab endpoints');
  
  console.log('\n2️⃣ PROBANDO ENDPOINTS EN RAILWAY...');
  await testAdminEndpoints(RAILWAY_URL, 'Railway /lab endpoints');
  
  console.log('\n3️⃣ PROBANDO PÁGINAS FRONTEND...');
  await testFrontendPages();
  
  console.log('\n🔍 DIAGNÓSTICO COMPLETADO');
  console.log('==========================');
  console.log('\n📋 POSIBLES PROBLEMAS:');
  console.log('- Si /lab/products falla: Problema de autenticación o base de datos');
  console.log('- Si /lab/materials falla: Problema de base de datos');
  console.log('- Si frontend falla: Problema de routing o autenticación');
  console.log('- Si no hay datos: Necesitas cargar datos semilla');
}

runAdminDiagnostic().catch(console.error); 