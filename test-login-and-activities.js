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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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

async function testLoginAndActivities() {
  console.log('🚀 PRUEBA DE LOGIN Y ACTIVIDADES');
  console.log('='.repeat(50));
  
  try {
    // 1. Simular login del profesor
    console.log('\n1️⃣ Simulando login del profesor...');
    const loginData = {
      email: 'profesor@demo.edu21.cl',
      password: 'password123'
    };
    
    const loginResponse = await makeRequest('http://localhost:5000/api/auth/login', {
      method: 'POST',
      body: loginData
    });
    
    console.log('Login Status:', loginResponse.status);
    console.log('Login Response:', loginResponse.data);
    
    if (loginResponse.status !== 200) {
      console.log('❌ Error en login');
      return;
    }
    
    const loginResult = JSON.parse(loginResponse.data);
    const token = loginResult.token;
    
    console.log('✅ Login exitoso');
    console.log('Token:', token.substring(0, 30) + '...');
    
    // 2. Probar la API de actividades con el token
    console.log('\n2️⃣ Probando API de actividades con token...');
    const activitiesResponse = await makeRequest('http://localhost:5000/api/lab/activities', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Activities Status:', activitiesResponse.status);
    
    if (activitiesResponse.status === 200) {
      const activitiesData = JSON.parse(activitiesResponse.data);
      console.log('✅ API de actividades funciona');
      console.log('Total actividades:', activitiesData.data?.length || 0);
      
      if (activitiesData.data && activitiesData.data.length > 0) {
        console.log('\n📋 Actividades encontradas:');
        activitiesData.data.forEach((activity, index) => {
          console.log(`${index + 1}. ${activity.title} (${activity.status})`);
        });
      } else {
        console.log('\n❌ No se encontraron actividades en la base de datos');
      }
    } else {
      console.log('❌ Error en API de actividades:', activitiesResponse.data);
    }
    
    // 3. Probar la página del frontend
    console.log('\n3️⃣ Probando página del frontend...');
    const frontendResponse = await makeRequest('http://localhost:3000/teacher/labs/activities');
    console.log('Frontend Status:', frontendResponse.status);
    
    if (frontendResponse.status === 200) {
      console.log('✅ Página del frontend se carga correctamente');
    } else {
      console.log('❌ Error en página del frontend');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
  
  console.log('\n🎯 RESUMEN:');
  console.log('- Si el login funciona pero la API no: problema de autenticación');
  console.log('- Si la API funciona pero el frontend no: problema del cliente');
  console.log('- Si todo funciona pero no hay actividades: problema de base de datos');
}

testLoginAndActivities().catch(console.error); 