const http = require('http');

function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: headers
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

async function testLabRoutes() {
  console.log('🚀 PRUEBA SIMPLE DE RUTAS DEL LABORATORIO');
  console.log('='.repeat(50));
  
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('\n🔍 Probando /api/lab/activities sin token:');
    const response1 = await makeRequest(`${baseUrl}/api/lab/activities`);
    console.log('Status:', response1.status);
    console.log('Data:', response1.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando /api/lab/activities con token demo:');
    const response2 = await makeRequest(`${baseUrl}/api/lab/activities`, {
      'Authorization': 'Bearer demo-token-teacher-123'
    });
    console.log('Status:', response2.status);
    console.log('Data:', response2.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando /api/lab/materials sin token:');
    const response3 = await makeRequest(`${baseUrl}/api/lab/materials`);
    console.log('Status:', response3.status);
    console.log('Data:', response3.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando /api/lab/materials con token demo:');
    const response4 = await makeRequest(`${baseUrl}/api/lab/materials`, {
      'Authorization': 'Bearer demo-token-teacher-123'
    });
    console.log('Status:', response4.status);
    console.log('Data:', response4.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testLabRoutes().catch(console.error); 