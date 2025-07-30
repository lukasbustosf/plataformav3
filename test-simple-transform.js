const axios = require('axios');

console.log('🧪 PRUEBA SIMPLE DE TRANSFORMACIÓN');
console.log('='.repeat(50));

async function testSimple() {
  try {
    console.log('🎯 Probando endpoint de evaluación gamificada...');
    
    const response = await axios.post('http://localhost:3000/api/evaluation/gamified', {
      class_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "TEST SIMPLE - Números del 10 al 20",
      description: "Prueba simple",
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

    if (response.data.success) {
      console.log('✅ EVALUACIÓN CREADA EXITOSAMENTE');
      console.log(`📋 ID: ${response.data.data.session_id}`);
      console.log(`🎨 Skin: ${response.data.data.applied_skin || 'Sin skin'}`);
      console.log('✅ Error "transformedQuestions is not defined" NO APARECIÓ');
    } else {
      console.log('❌ Error en respuesta:', response.data);
    }

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📝 Data:', error.response.data);
    }
  }
}

testSimple(); 