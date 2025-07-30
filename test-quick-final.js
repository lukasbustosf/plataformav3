const axios = require('axios');

async function quickTest() {
  try {
    console.log('🎯 Verificando servidor...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Servidor funcionando:', health.data.status);

    console.log('\n🎯 Probando evaluación...');
    const response = await axios.post('http://localhost:5000/api/evaluation/gamified', {
      class_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "TEST - Números del 1 al 5",
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
      }
    });

    console.log('✅ RESPUESTA:', response.data);

  } catch (error) {
    console.log('❌ ERROR:', error.message);
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📝 Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

quickTest(); 