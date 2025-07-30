const http = require('http');

function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
}

async function testFrontendActivities() {
  console.log('🚀 PRUEBA DEL FRONTEND CON ACTIVIDADES');
  console.log('='.repeat(50));
  
  const CLIENT_URL = 'http://localhost:3000';
  
  try {
    console.log('\n🔍 Probando página de actividades del profesor:');
    const response1 = await makeRequest(`${CLIENT_URL}/teacher/labs/activities`);
    console.log('Status:', response1.status);
    if (response1.status === 200) {
      console.log('✅ La página se carga correctamente');
      // Buscar si hay errores en la consola del navegador
      if (response1.data.includes('error') || response1.data.includes('Error')) {
        console.log('⚠️ Se detectaron errores en la página');
      }
    } else {
      console.log('❌ La página no se carga');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando API de actividades desde el frontend:');
    const response2 = await makeRequest(`${CLIENT_URL}/api/lab/activities`);
    console.log('Status:', response2.status);
    if (response2.status === 200) {
      const data = JSON.parse(response2.data);
      console.log('✅ API de actividades funciona');
      console.log('📊 Actividades encontradas:', data.data?.length || 0);
    } else {
      console.log('❌ Error en API de actividades:', response2.data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando API de materiales desde el frontend:');
    const response3 = await makeRequest(`${CLIENT_URL}/api/lab/materials`);
    console.log('Status:', response3.status);
    if (response3.status === 200) {
      const data = JSON.parse(response3.data);
      console.log('✅ API de materiales funciona');
      console.log('📊 Materiales encontrados:', data.data?.length || 0);
    } else {
      console.log('❌ Error en API de materiales:', response3.data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🎯 DIAGNÓSTICO:');
  console.log('1. Si la página se carga pero no muestra actividades: problema de autenticación del frontend');
  console.log('2. Si la página no se carga: problema del servidor Next.js');
  console.log('3. Si la API funciona pero el frontend no: problema de configuración del cliente');
}

testFrontendActivities().catch(console.error); 