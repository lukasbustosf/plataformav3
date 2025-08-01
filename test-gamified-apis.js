const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testGamifiedAPIs() {
    console.log('🧪 Probando APIs de Experiencias Gamificadas...\n');

    try {
        // 1. Probar GET /api/experiences
        console.log('1️⃣ Probando GET /api/experiences...');
        const experiencesResponse = await axios.get(`${BASE_URL}/experiences`);
        console.log('✅ Experiencias encontradas:', experiencesResponse.data.length);
        console.log('📋 Primera experiencia:', experiencesResponse.data[0]?.title || 'No hay experiencias');
        console.log('');

        // 2. Probar GET /api/experiences/:id (si hay experiencias)
        if (experiencesResponse.data.length > 0) {
            const firstExperience = experiencesResponse.data[0];
            console.log('2️⃣ Probando GET /api/experiences/:id...');
            const experienceResponse = await axios.get(`${BASE_URL}/experiences/${firstExperience.experience_id}`);
            console.log('✅ Experiencia obtenida:', experienceResponse.data.title);
            console.log('📊 Configuración:', Object.keys(experienceResponse.data.settings_json || {}));
            console.log('');
        }

        // 3. Probar POST /api/experiences/:id/session
        if (experiencesResponse.data.length > 0) {
            const firstExperience = experiencesResponse.data[0];
            console.log('3️⃣ Probando POST /api/experiences/:id/session...');
            const sessionData = {
                user_id: 'test-user-id',
                school_id: 'test-school-id'
            };
            const sessionResponse = await axios.post(`${BASE_URL}/experiences/${firstExperience.experience_id}/session`, sessionData);
            console.log('✅ Sesión creada:', sessionResponse.data.session_id);
            console.log('📊 Estado inicial:', sessionResponse.data.progress_json);
            console.log('');
        }

        console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
        console.log('🚀 Las APIs están funcionando correctamente.');

    } catch (error) {
        console.error('❌ Error en las pruebas:', error.message);
        if (error.response) {
            console.error('📊 Status:', error.response.status);
            console.error('📋 Data:', error.response.data);
        }
    }
}

// Ejecutar las pruebas
testGamifiedAPIs(); 