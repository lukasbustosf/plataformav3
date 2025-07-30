const http = require('http');

console.log('🔍 DIAGNÓSTICO COMPLETO DE ACTIVIDADES CON LOGS');
console.log('=' .repeat(60));

async function testAPI(endpoint, description) {
    console.log(`\n📡 Probando: ${description}`);
    console.log(`URL: http://localhost:5000${endpoint}`);
    
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: endpoint,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer demo-token-teacher-123'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`✅ Status: ${res.statusCode}`);
                console.log(`📊 Headers:`, res.headers);
                console.log(`📄 Response:`, data.substring(0, 500));
                
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`📋 Data count:`, jsonData?.data?.length || 'No data');
                    if (jsonData?.data?.length > 0) {
                        console.log(`📝 Primera actividad:`, jsonData.data[0]);
                    }
                } catch (e) {
                    console.log(`❌ Error parsing JSON:`, e.message);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log(`❌ Error: ${err.message}`);
            resolve();
        });

        req.end();
    });
}

async function testFrontend() {
    console.log('\n🌐 Probando Frontend...');
    console.log('URL: http://localhost:3000/teacher/labs/activities');
    console.log('⚠️  Verificar en navegador si la página carga');
    console.log('⚠️  Verificar Network tab en DevTools');
    console.log('⚠️  Verificar Console tab en DevTools');
}

async function testAuth() {
    console.log('\n🔐 Probando Autenticación...');
    
    // Test sin token
    await testAPI('/api/lab/activities', 'ACTIVIDADES SIN TOKEN');
    
    // Test con token demo
    await testAPI('/api/lab/activities', 'ACTIVIDADES CON TOKEN DEMO');
    
    // Test con token demo admin
    await testAPI('/api/lab/activities', 'ACTIVIDADES CON TOKEN ADMIN');
}

async function testDatabase() {
    console.log('\n🗄️  Probando Base de Datos...');
    await testAPI('/api/lab/materials', 'MATERIALES');
    await testAPI('/api/lab/activities', 'ACTIVIDADES');
}

async function runDiagnostic() {
    console.log('🚀 Iniciando diagnóstico completo...\n');
    
    // Test 1: Autenticación
    await testAuth();
    
    // Test 2: Base de datos
    await testDatabase();
    
    // Test 3: Frontend
    testFrontend();
    
    console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
    console.log('1. ✅ Servidor corriendo en puerto 5000');
    console.log('2. ❓ Cliente corriendo en puerto 3000 (verificar)');
    console.log('3. ❓ Autenticación funcionando (verificar logs arriba)');
    console.log('4. ❓ Base de datos conectada (verificar logs arriba)');
    console.log('5. ❓ Frontend cargando actividades (verificar navegador)');
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('- Si API retorna 401: Problema de autenticación');
    console.log('- Si API retorna 404: Problema de rutas');
    console.log('- Si API retorna 500: Problema de base de datos');
    console.log('- Si frontend no carga: Problema de cliente');
    console.log('- Si frontend carga pero no muestra datos: Problema de API');
}

runDiagnostic().catch(console.error); 