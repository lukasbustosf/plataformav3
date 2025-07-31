const axios = require('axios');

const VERCEL_URL = 'https://plataformav3.vercel.app';

async function monitorDeploy() {
  console.log('🔍 Monitoreando deploy de Vercel...');
  console.log('⏳ Esto puede tomar 2-3 minutos...');
  
  let attempts = 0;
  const maxAttempts = 30; // 5 minutos (10 segundos por intento)
  
  const checkDeploy = async () => {
    attempts++;
    console.log(`\n🔄 Intento ${attempts}/${maxAttempts}...`);
    
    try {
      // Probar la ruta de lab activities
      const response = await axios.get(`${VERCEL_URL}/lab/activities`, {
        headers: {
          'Authorization': 'Bearer demo-token-teacher'
        },
        timeout: 5000
      });
      
      if (response.status === 200) {
        console.log('✅ Deploy completado! Las rutas /lab/* están funcionando correctamente.');
        console.log('📊 Datos recibidos:', {
          status: response.status,
          dataLength: response.data?.data?.length || 0,
          success: response.data?.success
        });
        return true;
      }
      
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log('⏳ Timeout - Reintentando...');
      } else if (error.response?.status === 404) {
        console.log('⏳ Deploy aún en progreso (404)...');
      } else {
        console.log(`⏳ Error temporal: ${error.message}`);
      }
    }
    
    return false;
  };
  
  // Intentar cada 10 segundos
  const interval = setInterval(async () => {
    const success = await checkDeploy();
    
    if (success || attempts >= maxAttempts) {
      clearInterval(interval);
      
      if (!success) {
        console.log('\n❌ Timeout: El deploy no se completó en el tiempo esperado.');
        console.log('💡 Verifica manualmente en: https://plataformav3.vercel.app/teacher/labs/activities');
      }
    }
  }, 10000);
  
  // Primera verificación inmediata
  const initialSuccess = await checkDeploy();
  if (initialSuccess) {
    clearInterval(interval);
  }
}

monitorDeploy(); 