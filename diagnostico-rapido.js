const axios = require('axios');

console.log('🚨 DIAGNÓSTICO RÁPIDO - ACTIVIDADES LAB');
console.log('=========================================\n');

const RAILWAY_URL = 'https://plataformav3-production.up.railway.app';
const VERCEL_URL = 'https://plataformav3.vercel.app';

async function quickTest() {
  console.log('🔍 Verificando estado actual...\n');
  
  const tests = [
    { name: 'Railway Health', url: `${RAILWAY_URL}/health` },
    { name: 'Railway Activities', url: `${RAILWAY_URL}/lab/activities` },
    { name: 'Railway Materials', url: `${RAILWAY_URL}/lab/materials` },
    { name: 'Vercel Activities', url: `${VERCEL_URL}/lab/activities` },
    { name: 'Vercel API Activities', url: `${VERCEL_URL}/api/lab/activities` }
  ];
  
  for (const test of tests) {
    try {
      const response = await axios.get(test.url, {
        timeout: 5000,
        headers: { 'User-Agent': 'Quick-Diagnostic/1.0' }
      });
      
      if (response.status === 200) {
        console.log(`✅ ${test.name}: OK (${response.status})`);
        
        // Si es activities, mostrar cantidad
        if (test.name.includes('Activities') && response.data) {
          const activities = response.data.data || response.data;
          if (Array.isArray(activities)) {
            console.log(`   📋 Actividades encontradas: ${activities.length}`);
          }
        }
      } else {
        console.log(`⚠️  ${test.name}: Status ${response.status}`);
      }
    } catch (error) {
      const status = error.response?.status || 'ERROR';
      const message = error.response?.data?.message || error.message;
      console.log(`❌ ${test.name}: ${status} - ${message}`);
    }
  }
  
  console.log('\n📋 RESUMEN RÁPIDO:');
  console.log('==================');
  console.log('✅ Si Railway Health funciona: Backend OK');
  console.log('✅ Si Railway Activities funciona: Rutas OK');
  console.log('✅ Si Vercel Activities funciona: Frontend OK');
  console.log('❌ Si algo falla: Revisar DOCUMENTACION_ACTIVIDADES_LAB.md');
  
  console.log('\n🚀 COMANDOS ÚTILES:');
  console.log('==================');
  console.log('node diagnostico-definitivo.js    # Diagnóstico completo');
  console.log('node diagnostico-actividades-local.js    # Solo local');
  console.log('node diagnostico-produccion-actividades.js    # Solo producción');
}

quickTest().catch(console.error); 