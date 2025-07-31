const axios = require('axios');

const VERCEL_URL = 'https://plataformav3.vercel.app';

async function testVercelFix() {
  console.log('🔍 Probando fix de Vercel para rutas /lab/*...');
  
  try {
    // Test 1: Health check directo a Railway
    console.log('\n1. Probando health check directo a Railway...');
    const healthResponse = await axios.get('https://plataforma-edu21-production.up.railway.app/health');
    console.log('✅ Health check Railway exitoso:', healthResponse.data);
    
    // Test 2: Lab activities a través de Vercel
    console.log('\n2. Probando lab activities a través de Vercel...');
    const activitiesResponse = await axios.get(`${VERCEL_URL}/lab/activities`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    console.log('✅ Lab activities Vercel exitoso:', {
      status: activitiesResponse.status,
      dataLength: activitiesResponse.data?.data?.length || 0,
      success: activitiesResponse.data?.success
    });
    
    // Test 3: Lab materials a través de Vercel
    console.log('\n3. Probando lab materials a través de Vercel...');
    const materialsResponse = await axios.get(`${VERCEL_URL}/lab/materials`, {
      headers: {
        'Authorization': 'Bearer demo-token-teacher'
      }
    });
    console.log('✅ Lab materials Vercel exitoso:', {
      status: materialsResponse.status,
      dataLength: materialsResponse.data?.data?.length || 0,
      success: materialsResponse.data?.success
    });
    
    console.log('\n🎉 Fix de Vercel funcionando correctamente!');
    console.log('📝 Las rutas /lab/* ahora están siendo redirigidas correctamente a Railway');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('URL intentada:', error.config?.url);
    }
  }
}

testVercelFix(); 