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

async function testProduccion() {
  console.log('🚀 DIAGNÓSTICO PRODUCCIÓN ACTIVIDADES LAB');
  console.log('='.repeat(60));
  
  // Simular entorno de producción
  process.env.NODE_ENV = 'production';
  
  console.log('🔧 Configuración actual:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- Modo:', process.env.NODE_ENV === 'production' ? 'PRODUCCIÓN' : 'DESARROLLO');
  
  const LOCAL_URL = 'http://localhost:5000';
  const PROD_URL = 'https://plataforma-edu21-production.up.railway.app';
  
  console.log('\n📋 PRUEBAS DE PRODUCCIÓN:');
  console.log('='.repeat(60));
  
  // 1. Probar servidor local en modo producción
  console.log('\n🔍 1. Probando servidor local en modo producción...');
  try {
    const response = await makeRequest(`${LOCAL_URL}/api/lab/activities`);
    if (response.status === 401) {
      console.log('✅ Autenticación requerida (correcto para producción)');
    } else if (response.status === 200) {
      console.log('⚠️ Servidor acepta requests sin autenticación (problema)');
    } else {
      console.log('❌ Error inesperado:', response.status);
    }
  } catch (error) {
    console.log('❌ Servidor local no responde');
  }
  
  // 2. Probar tokens demo en producción (deberían fallar)
  console.log('\n🔍 2. Probando tokens demo en producción...');
  try {
    const response = await makeRequest(`${LOCAL_URL}/api/lab/activities`, {
      'Authorization': 'Bearer demo-token-teacher-123'
    });
    if (response.status === 401) {
      console.log('✅ Tokens demo rechazados (correcto para producción)');
    } else if (response.status === 200) {
      console.log('❌ Tokens demo funcionan (PROBLEMA: no deberían funcionar en producción)');
    } else {
      console.log('⚠️ Respuesta inesperada:', response.status);
    }
  } catch (error) {
    console.log('❌ Error al probar tokens demo');
  }
  
  // 3. Probar servidor de producción real
  console.log('\n🔍 3. Probando servidor de producción real...');
  try {
    const response = await makeRequest(`${PROD_URL}/api/lab/activities`);
    console.log('✅ Servidor de producción responde:', response.status);
  } catch (error) {
    console.log('❌ Servidor de producción no responde');
  }
  
  // 4. Verificar configuración del middleware
  console.log('\n🔍 4. Verificando configuración del middleware...');
  console.log('En producción, el middleware debe:');
  console.log('- Rechazar tokens demo');
  console.log('- Solo aceptar JWT válidos de Supabase');
  console.log('- Requerir autenticación real');
  
  // Resumen
  console.log('\n📋 RESUMEN PARA PRODUCCIÓN:');
  console.log('='.repeat(60));
  
  console.log('✅ CONFIGURACIÓN CORRECTA PARA PRODUCCIÓN:');
  console.log('1. NODE_ENV=production');
  console.log('2. Tokens demo deshabilitados');
  console.log('3. Autenticación JWT real requerida');
  console.log('4. Usuarios reales en Supabase');
  
  console.log('\n⚠️ PROBLEMAS COMUNES EN PRODUCCIÓN:');
  console.log('1. Usuarios no pueden loguearse (credenciales demo no funcionan)');
  console.log('2. Error 401 - No autorizado (usuario no logueado)');
  console.log('3. Actividades no se cargan (problema de autenticación)');
  console.log('4. CORS errors (dominios no configurados)');
  
  console.log('\n🔧 SOLUCIONES PARA PRODUCCIÓN:');
  console.log('1. Crear usuarios reales en Supabase');
  console.log('2. Configurar autenticación real');
  console.log('3. Verificar variables de entorno');
  console.log('4. Configurar CORS para dominios de producción');
  
  console.log('\n💡 PARA MIGRAR A PRODUCCIÓN:');
  console.log('1. Cambiar NODE_ENV=production');
  console.log('2. Crear usuarios reales en Supabase');
  console.log('3. Configurar URLs de producción');
  console.log('4. Probar con usuarios reales');
}

testProduccion().catch(console.error); 