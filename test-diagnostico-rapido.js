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

async function diagnosticoRapido() {
  console.log('🚀 DIAGNÓSTICO RÁPIDO ACTIVIDADES LAB');
  console.log('='.repeat(50));
  
  let problemas = [];
  
  // 1. Verificar servidor backend
  console.log('\n🔍 1. Verificando servidor backend...');
  try {
    const response = await makeRequest('http://localhost:5000/api/lab/activities', {
      'Authorization': 'Bearer demo-token-teacher-123'
    });
    if (response.status === 200) {
      console.log('✅ Backend funcionando correctamente');
      const data = JSON.parse(response.data);
      console.log(`📊 Actividades encontradas: ${data.data?.length || 0}`);
    } else {
      console.log('⚠️ Backend responde pero con error:', response.status);
      problemas.push('Backend con error de autenticación');
    }
  } catch (error) {
    console.log('❌ Backend no responde');
    problemas.push('Servidor backend no está corriendo');
  }
  
  // 2. Verificar frontend
  console.log('\n🔍 2. Verificando frontend...');
  try {
    const response = await makeRequest('http://localhost:3000/teacher/labs/activities');
    if (response.status === 200) {
      console.log('✅ Frontend funcionando correctamente');
    } else {
      console.log('⚠️ Frontend responde pero con error:', response.status);
      problemas.push('Frontend con error');
    }
  } catch (error) {
    console.log('❌ Frontend no responde');
    problemas.push('Servidor frontend no está corriendo');
  }
  
  // 3. Verificar configuración del servidor
  console.log('\n🔍 3. Verificando configuración del servidor...');
  try {
    const response = await makeRequest('http://localhost:5000/api/lab/activities');
    if (response.status === 401) {
      console.log('✅ Autenticación requerida (correcto)');
    } else if (response.status === 200) {
      console.log('⚠️ Servidor acepta requests sin autenticación');
      problemas.push('Configuración de autenticación incorrecta');
    } else {
      console.log('❌ Error inesperado:', response.status);
      problemas.push('Error en configuración del servidor');
    }
  } catch (error) {
    console.log('❌ No se puede verificar configuración');
  }
  
  // Resumen
  console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
  console.log('='.repeat(50));
  
  if (problemas.length === 0) {
    console.log('✅ TODO FUNCIONANDO CORRECTAMENTE');
    console.log('\n💡 Para ver las actividades:');
    console.log('1. Ve a http://localhost:3000/login');
    console.log('2. Usa: teacher@demo.edu21.cl / demo123');
    console.log('3. Ve a http://localhost:3000/teacher/labs/activities');
  } else {
    console.log('❌ PROBLEMAS DETECTADOS:');
    problemas.forEach((problema, index) => {
      console.log(`${index + 1}. ${problema}`);
    });
    
    console.log('\n🔧 SOLUCIONES RÁPIDAS:');
    console.log('1. Verificar que server/.env tenga NODE_ENV=development');
    console.log('2. Verificar que DATABASE_URL esté configurada');
    console.log('3. Reiniciar servidor: cd server && node index.js');
    console.log('4. Verificar que el frontend use api.client.get()');
  }
}

diagnosticoRapido().catch(console.error); 