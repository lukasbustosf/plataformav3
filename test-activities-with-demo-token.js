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

async function testActivitiesWithDemoToken() {
  console.log('🚀 PRUEBA DE ACTIVIDADES CON TOKEN DEMO');
  console.log('='.repeat(50));
  
  const demoTokens = [
    'demo-token-teacher-123',
    'demo-token-admin-789',
    'demo-token-superadmin-999',
    'demo-token-bienestar-456'
  ];
  
  for (const token of demoTokens) {
    console.log(`\n🔍 Probando con token: ${token}`);
    
    try {
      const response = await makeRequest('http://localhost:5000/api/lab/activities', {
        'Authorization': `Bearer ${token}`
      });
      
      console.log('Status:', response.status);
      
      if (response.status === 200) {
        const data = JSON.parse(response.data);
        console.log('✅ Éxito!');
        console.log('Total actividades:', data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
          console.log('\n📋 Actividades encontradas:');
          data.data.forEach((activity, index) => {
            console.log(`${index + 1}. ${activity.title} (${activity.status})`);
          });
        } else {
          console.log('\n❌ No se encontraron actividades');
        }
        break; // Si funciona, no necesitamos probar más tokens
      } else {
        console.log('❌ Error:', response.data);
      }
    } catch (error) {
      console.log('❌ Error de conexión:', error.message);
    }
  }
  
  console.log('\n🎯 CONCLUSIÓN:');
  console.log('- Si algún token funciona: el problema es de autenticación del frontend');
  console.log('- Si ningún token funciona: el problema es del backend');
  console.log('- Si no hay actividades: el problema es de la base de datos');
}

testActivitiesWithDemoToken().catch(console.error); 