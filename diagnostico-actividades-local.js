const axios = require('axios');

async function diagnosticarActividades() {
  console.log('🔍 DIAGNÓSTICO DE ACTIVIDADES EN LOCAL');
  console.log('=====================================\n');

  try {
    // 1. Probar la API directamente
    console.log('1️⃣ Probando API directa...');
    const apiResponse = await axios.get('http://localhost:5000/api/lab/activities');
    console.log('✅ API directa funciona');
    console.log('📊 Datos recibidos:', apiResponse.data.data?.length || 0, 'actividades');
    
    // 2. Probar con labRequest (como lo hace el frontend)
    console.log('\n2️⃣ Probando con labRequest...');
    const labResponse = await axios.get('http://localhost:5000/lab/activities');
    console.log('✅ LabRequest funciona');
    console.log('📊 Datos recibidos:', labResponse.data.data?.length || 0, 'actividades');
    
    // 3. Comparar las respuestas
    console.log('\n3️⃣ Comparando respuestas...');
    console.log('API directa estructura:', Object.keys(apiResponse.data));
    console.log('LabRequest estructura:', Object.keys(labResponse.data));
    
    // 4. Verificar si hay diferencias en los datos
    const apiActivities = apiResponse.data.data || [];
    const labActivities = labResponse.data.data || [];
    
    console.log('\n4️⃣ Comparando datos...');
    console.log('API directa actividades:', apiActivities.length);
    console.log('LabRequest actividades:', labActivities.length);
    
    if (apiActivities.length !== labActivities.length) {
      console.log('❌ DIFERENCIA ENCONTRADA: Las respuestas tienen diferentes cantidades de actividades');
    } else {
      console.log('✅ Las respuestas tienen la misma cantidad de actividades');
    }
    
    // 5. Verificar la estructura de la primera actividad
    if (apiActivities.length > 0 && labActivities.length > 0) {
      console.log('\n5️⃣ Estructura de la primera actividad:');
      console.log('API directa:', Object.keys(apiActivities[0]));
      console.log('LabRequest:', Object.keys(labActivities[0]));
    }
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

diagnosticarActividades(); 