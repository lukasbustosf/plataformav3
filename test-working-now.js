const axios = require('axios');

console.log('🧪 PRUEBA FINAL - SERVIDOR SIN SUPABASE');
console.log('='.repeat(50));

async function testNow() {
  try {
    console.log('🎯 Creando evaluación gamificada...');
    
    // Crear evaluación
    const createResponse = await axios.post('http://localhost:5000/api/evaluation/gamified', {
      class_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "PRUEBA FINAL - Números del 10 al 20",
      description: "Prueba del arreglo transformedQuestions",
      difficulty: "easy",
      grade_level: "1B",
      subject: "matemáticas",
      topic: "conteo",
      question_count: 3,
      content_source: "mineduc",
      content_tags: ["conteo"],
      skin_theme: "farm",
      game_format: 1,
      engine_id: "ENG01",
      time_limit_minutes: 10,
      auto_grade: true
    }, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAzIiwic2Nob29sX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6InRlYWNoZXIiLCJmaXJzdF9uYW1lIjoiUHJvZmVzb3IiLCJsYXN0X25hbWUiOiJEZW1vIiwiZW1haWwiOiJwcm9mZXNvckBkZW1vLmNvbSIsImlhdCI6MTczNjg3MzIwMH0.fL8X5_aB2tH8j9pN4vQ2c6D3mE9iL7nU0oY1kR3wP5X',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (createResponse.data.success) {
      const gameId = createResponse.data.data.session_id;
      console.log('✅ CREACIÓN EXITOSA');
      console.log(`📋 Game ID: ${gameId}`);

      // Esperar un momento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Probar acceso como estudiante
      console.log('\n🎮 Probando acceso al juego...');
      const gameResponse = await axios.get(`http://localhost:5000/api/game/${gameId}`, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDA0Iiwic2Nob29sX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6InN0dWRlbnQiLCJmaXJzdF9uYW1lIjoiRXN0dWRpYW50ZSIsImxhc3RfbmFtZSI6IkRlbW8iLCJlbWFpbCI6ImVzdHVkaWFudGVAZGVtby5jb20iLCJpYXQiOjE3MzY4NzMyMDB9.bC9Y6_dM3lF1k4qP2vT8n7E0hJ4iL5oU9yX2nK6wR8D'
        },
        timeout: 10000
      });

      console.log('✅ ACCESO AL JUEGO EXITOSO');
      console.log(`🎨 Transformación aplicada: ${gameResponse.data.session.content_transformed || 'NO'}`);
      
      if (gameResponse.data.session.transformation_applied) {
        console.log(`🔄 Tipo: ${gameResponse.data.session.transformation_applied.content_type}`);
        console.log(`🎯 Skin: ${gameResponse.data.session.transformation_applied.skin_name}`);
      }

      console.log('\n🎉 ÉXITO TOTAL: Error "transformedQuestions is not defined" ARREGLADO');

    } else {
      console.log('❌ Error:', createResponse.data);
    }

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.response?.data) {
      console.log('📊 Response:', error.response.data);
    }
  }
}

testNow(); 