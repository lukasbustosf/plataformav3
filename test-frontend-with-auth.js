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
        'Cookie': 'auth_token=demo-token-teacher-123; user_data=' + encodeURIComponent(JSON.stringify({
          user_id: 'teacher-123',
          school_id: 'school-abc',
          email: 'teacher@demo.edu21.cl',
          first_name: 'María',
          last_name: 'González',
          role: 'TEACHER',
          active: true
        })),
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

async function testFrontendWithAuth() {
  console.log('🚀 PRUEBA DEL FRONTEND CON AUTENTICACIÓN');
  console.log('='.repeat(50));
  
  const CLIENT_URL = 'http://localhost:3000';
  
  try {
    console.log('\n🔍 Probando página de actividades del profesor con token demo:');
    const response1 = await makeRequest(`${CLIENT_URL}/teacher/labs/activities`);
    console.log('Status:', response1.status);
    if (response1.status === 200) {
      console.log('✅ La página se carga correctamente');
      // Buscar si hay errores en la consola del navegador
      if (response1.data.includes('error') || response1.data.includes('Error')) {
        console.log('⚠️ Se detectaron errores en la página');
      }
      // Buscar si hay actividades en la página
      if (response1.data.includes('actividad') || response1.data.includes('activity')) {
        console.log('✅ Se detectaron actividades en la página');
      } else {
        console.log('❌ No se detectaron actividades en la página');
      }
    } else {
      console.log('❌ La página no se carga');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🎯 DIAGNÓSTICO:');
  console.log('1. Si la página se carga pero no muestra actividades: problema de autenticación del frontend');
  console.log('2. Si la página no se carga: problema del servidor Next.js');
  console.log('3. Si la API funciona pero el frontend no: problema de configuración del cliente');
  console.log('\n💡 Para probar manualmente:');
  console.log('1. Ve a http://localhost:3000/login');
  console.log('2. Usa las credenciales demo: teacher@demo.edu21.cl / demo123');
  console.log('3. Ve a http://localhost:3000/teacher/labs/activities');
}

testFrontendWithAuth().catch(console.error); 