const axios = require('axios');

async function probarSesionesOA1() {
  console.log('🧪 PROBANDO SESIONES OA1 FINALES');
  console.log('='.repeat(50));
  
  const sesionesOA1 = [
    {
      id: 'oa1-pollitos-demo',
      nombre: '🐣 OA1 Nivel 1: Pollitos Pequeños (1-5)',
      url: 'http://localhost:3000/student/games/oa1-pollitos-demo/play'
    },
    {
      id: 'oa1-gallinas-demo',
      nombre: '🐔 OA1 Nivel 2: Gallinas Medianas (1-10)',
      url: 'http://localhost:3000/student/games/oa1-gallinas-demo/play'
    },
    {
      id: 'oa1-vacas-demo',
      nombre: '🐄 OA1 Nivel 3: Vacas Grandes (1-20)',
      url: 'http://localhost:3000/student/games/oa1-vacas-demo/play'
    },
    {
      id: 'oa1-granjero-demo',
      nombre: '🚜 OA1 Nivel 4: Granjero Experto (Patrones)',
      url: 'http://localhost:3000/student/games/oa1-granjero-demo/play'
    }
  ];
  
  console.log('📋 SESIONES A PROBAR:');
  sesionesOA1.forEach((sesion, i) => {
    console.log(`${i + 1}. ${sesion.nombre}`);
    console.log(`   🔗 ${sesion.url}`);
    console.log(`   🎯 ID: ${sesion.id}`);
    console.log('');
  });
  
  console.log('🔍 VERIFICANDO BACKEND:');
  
  for (const sesion of sesionesOA1) {
    try {
      console.log(`\n📡 Probando: ${sesion.nombre}`);
      
      const response = await axios.get(`http://localhost:5000/api/game/${sesion.id}`, {
        headers: {
          'Authorization': 'Bearer demo-token-student'
        }
      });
      
      if (response.status === 200) {
        const data = response.data;
        console.log(`✅ ÉXITO: ${sesion.id}`);
        console.log(`   📋 Título: ${data.session?.title}`);
        console.log(`   📊 Status: ${data.session?.status}`);
        console.log(`   🎮 Engine: ${data.session?.engine_id}`);
        console.log(`   🌾 Specialized Component: ${data.session?.settings_json?.specialized_component}`);
        console.log(`   🎯 Demo: ${data.session?.settings_json?.demo}`);
        console.log(`   🔓 Public Access: ${data.session?.settings_json?.public_access}`);
        console.log(`   ❓ Preguntas: ${data.session?.quizzes?.questions?.length || 0}`);
      } else {
        console.log(`❌ ERROR: ${sesion.id} - Status: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${sesion.id}`);
      console.log(`   📄 Mensaje: ${error.response?.data?.error?.message || error.message}`);
      console.log(`   🔢 Código: ${error.response?.status || 'NO_STATUS'}`);
    }
  }
  
  console.log('\n🎯 RESULTADOS:');
  console.log('Si ves ✅ ÉXITO en todas las sesiones, significa que:');
  console.log('1. Las sesiones están disponibles en el backend');
  console.log('2. No hay problemas de autenticación');
  console.log('3. Los datos están correctamente estructurados');
  console.log('4. El componente FarmCountingGameOA1 será detectado');
  
  console.log('\n🎮 URLS LISTAS PARA PROBAR:');
  sesionesOA1.forEach((sesion, i) => {
    console.log(`${i + 1}. ${sesion.url}`);
  });
  
  console.log('\n✅ Prueba completada');
}

probarSesionesOA1(); 