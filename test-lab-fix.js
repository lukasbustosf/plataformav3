const axios = require('axios');

const VERCEL_URL = 'https://plataformav3.vercel.app';

async function testLabFix() {
  console.log('🔍 Probando fix de rutas de lab...');
  
  try {
    // Test 1: Lab activities
    console.log('\n1. Probando lab activities...');
    const activitiesResponse = await axios.get(`${VERCEL_URL}/lab/activities`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    console.log('✅ Lab activities exitoso:', {
      status: activitiesResponse.status,
      dataLength: activitiesResponse.data?.data?.length || 0,
      success: activitiesResponse.data?.success
    });
    
    // Test 2: Lab materials
    console.log('\n2. Probando lab materials...');
    const materialsResponse = await axios.get(`${VERCEL_URL}/lab/materials`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    console.log('✅ Lab materials exitoso:', {
      status: materialsResponse.status,
      dataLength: materialsResponse.data?.data?.length || 0,
      success: materialsResponse.data?.success
    });
    
    console.log('\n🎉 Fix de rutas de lab funcionando correctamente!');
    console.log('📝 Las URLs ahora son correctas:');
    console.log('   - /lab/activities');
    console.log('   - /lab/materials');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('URL intentada:', error.config?.url);
    }
  }
}

testLabFix(); 