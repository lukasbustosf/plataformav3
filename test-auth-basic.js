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

async function testAuth() {
  console.log('🚀 DIAGNÓSTICO DE AUTENTICACIÓN DEL LABORATORIO');
  console.log('='.repeat(60));
  
  const LOCAL_API_URL = 'http://localhost:5000/api/lab/activities';
  
  try {
    console.log('\n🔍 Probando sin token:');
    const response1 = await makeRequest(LOCAL_API_URL);
    console.log('✅ Status:', response1.status);
    console.log('📊 Data:', response1.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando con token demo:');
    const response2 = await makeRequest(LOCAL_API_URL, {
      'Authorization': 'Bearer demo-token-teacher-123'
    });
    console.log('✅ Status:', response2.status);
    console.log('📊 Data:', response2.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  try {
    console.log('\n🔍 Probando con token admin:');
    const response3 = await makeRequest(LOCAL_API_URL, {
      'Authorization': 'Bearer demo-token-admin-789'
    });
    console.log('✅ Status:', response3.status);
    console.log('📊 Data:', response3.data.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testAuth().catch(console.error); 