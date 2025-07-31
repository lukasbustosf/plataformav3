const axios = require('axios');

const RAILWAY_URL = 'https://plataforma-edu21-production.up.railway.app';

async function testRailwayConnection() {
  console.log('🔍 Probando conectividad con Railway...');
  
  try {
    // Test 1: Health check
    console.log('\n1. Probando health check...');
    const healthResponse = await axios.get(`${RAILWAY_URL}/health`);
    console.log('✅ Health check exitoso:', healthResponse.data);
    
    // Test 2: Lab activities endpoint
    console.log('\n2. Probando endpoint de lab activities...');
    const activitiesResponse = await axios.get(`${RAILWAY_URL}/api/lab/activities`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    console.log('✅ Lab activities exitoso:', {
      status: activitiesResponse.status,
      dataLength: activitiesResponse.data?.data?.length || 0,
      success: activitiesResponse.data?.success
    });
    
    // Test 3: Lab materials endpoint
    console.log('\n3. Probando endpoint de lab materials...');
    const materialsResponse = await axios.get(`${RAILWAY_URL}/api/lab/materials`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    console.log('✅ Lab materials exitoso:', {
      status: materialsResponse.status,
      dataLength: materialsResponse.data?.data?.length || 0,
      success: materialsResponse.data?.success
    });
    
    console.log('\n🎉 Todos los tests pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testRailwayConnection(); 