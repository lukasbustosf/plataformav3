const axios = require('axios');

async function testBackendDirect() {
  try {
    console.log('🎯 Probando directamente el backend en puerto 5000...');
    
    const response = await axios.post('http://localhost:5000/api/evaluation/gamified', {
      class_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "TEST DIRECTO - Números del 10 al 20",
      description: "Prueba directa",
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
      timeout: 5000
    });

    console.log('✅ ÉXITO - Respuesta del backend:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📝 Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

console.log('🧪 PRUEBA DIRECTA DEL BACKEND');
console.log('='.repeat(40));
testBackendDirect(); 