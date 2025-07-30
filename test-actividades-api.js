const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(requestOptions, (res) => {
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

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testActividadesAPI() {
  try {
    console.log('🔍 Probando API de actividades del laboratorio...\n');
    
    // Primero obtener un token de autenticación (simular login)
    console.log('1️⃣ Intentando login...');
    const loginResponse = await makeRequest('http://localhost:5000/api/auth/login', {
      method: 'POST',
      body: {
        email: 'lbustos@edu21.cl',
        password: 'password123'
      }
    });
    
    console.log('Status:', loginResponse.status);
    console.log('Data:', loginResponse.data);
    
    if (loginResponse.status !== 200) {
      console.log('❌ Error en login');
      return;
    }
    
    const loginData = JSON.parse(loginResponse.data);
    const token = loginData.token;
    
    console.log('✅ Login exitoso');
    
    // Probar la API de actividades
    console.log('\n2️⃣ Probando API de actividades...');
    const actividadesResponse = await makeRequest('http://localhost:5000/api/lab/activities', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Status:', actividadesResponse.status);
    console.log('Data:', actividadesResponse.data);
    
    if (actividadesResponse.status !== 200) {
      console.log('❌ Error al obtener actividades');
      return;
    }
    
    const actividadesData = JSON.parse(actividadesResponse.data);
    
    console.log('📊 Respuesta de la API:');
    console.log('Success:', actividadesData.success);
    console.log('Total actividades:', actividadesData.data?.length || 0);
    
    if (actividadesData.data && actividadesData.data.length > 0) {
      console.log('\n📋 Actividades encontradas:');
      actividadesData.data.forEach((actividad, index) => {
        console.log(`${index + 1}. ${actividad.title} (${actividad.status})`);
      });
    } else {
      console.log('\n❌ No se encontraron actividades');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testActividadesAPI(); 