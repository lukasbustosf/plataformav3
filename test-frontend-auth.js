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

async function testFrontendAuth() {
  console.log('🚀 DIAGNÓSTICO DE AUTENTICACIÓN DEL FRONTEND');
  console.log('='.repeat(60));
  
  const CLIENT_URL = 'http://localhost:3000';
  const API_URL = 'http://localhost:5000';
  
  try {
    console.log('\n🔍 Probando página de actividades del profesor:');
    const response1 = await makeRequest(`${CLIENT_URL}/teacher/labs/activities`);
    console.log('✅ Status:', response1.status);
    if (response1.status === 200) {
      console.log('✅ La página se carga correctamente');
    } else {
      console.log('❌ La página no se carga');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando API desde el frontend:');
    const response2 = await makeRequest(`${API_URL}/api/lab/activities`);
    console.log('✅ Status:', response2.status);
    const data = JSON.parse(response2.data);
    console.log('📊 Actividades encontradas:', data.data?.length || 0);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🎯 DIAGNÓSTICO:');
  console.log('1. Si la página se carga pero no muestra actividades: problema de autenticación del frontend');
  console.log('2. Si la página no se carga: problema del servidor Next.js');
  console.log('3. Si la API funciona pero el frontend no: problema de configuración del cliente');
}

testFrontendAuth().catch(console.error); 