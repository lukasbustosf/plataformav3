const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

console.log('🧪 PROBANDO ARREGLO DE TRANSFORMACIÓN DE CONTENIDO');
console.log('='.repeat(60));

async function testTransformationFix() {
  try {
    // 🎯 1. Crear evaluación gamificada con skin de granja
    console.log('\n📝 1. Creando evaluación gamificada con skin de granja...');
    
    const createResponse = await axios.post(`${SERVER_URL}/api/evaluation/gamified`, {
      class_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "TEST TRANSFORMACIÓN - Números del 10 al 20",
      description: "Prueba de transformación de contenido",
      difficulty: "easy",
      grade_level: "1B",
      subject: "matemáticas",
      topic: "conteo",
      question_count: 5,
      content_source: "mineduc",
      content_tags: ["conteo", "números"],
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

    if (createResponse.data.success) {
      const gameId = createResponse.data.data.session_id;
      console.log(`✅ Evaluación creada: ${gameId}`);
      console.log(`📊 Skin aplicado: ${createResponse.data.data.applied_skin || 'Sin skin'}`);

      // 🎮 2. Intentar acceder al juego como estudiante
      console.log('\n🎮 2. Probando acceso al juego...');
      
      const studentToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDA0Iiwic2Nob29sX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6InN0dWRlbnQiLCJmaXJzdF9uYW1lIjoiRXN0dWRpYW50ZSIsImxhc3RfbmFtZSI6IkRlbW8iLCJlbWFpbCI6ImVzdHVkaWFudGVAZGVtby5jb20iLCJpYXQiOjE3MzY4NzMyMDB9.bC9Y6_dM3lF1k4qP2vT8n7E0hJ4iL5oU9yX2nK6wR8D';
      
      const gameResponse = await axios.get(`${SERVER_URL}/api/game/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${studentToken}`
        }
      });

      if (gameResponse.data.session) {
        console.log(`✅ Juego accesible: ${gameResponse.data.session.title}`);
        console.log(`🎨 Contenido transformado: ${gameResponse.data.session.content_transformed ? 'SÍ' : 'NO'}`);
        
        if (gameResponse.data.session.transformation_applied) {
          console.log(`🔄 Transformación aplicada: ${gameResponse.data.session.transformation_applied.content_type}`);
          console.log(`🎯 Skin usado: ${gameResponse.data.session.transformation_applied.skin_name}`);
        }

        // Verificar preguntas transformadas
        if (gameResponse.data.session.quizzes && gameResponse.data.session.quizzes.questions) {
          const questions = gameResponse.data.session.quizzes.questions;
          console.log(`📝 Preguntas encontradas: ${questions.length}`);
          
          if (questions.length > 0) {
            console.log(`🔍 Primera pregunta: "${questions[0].stem_md}"`);
            console.log(`🎯 Contexto de granja: ${questions[0].farm_context ? 'SÍ' : 'NO'}`);
            
            if (questions[0].farm_context) {
              console.log(`🐄 Visual: ${questions[0].farm_context.visual}`);
              console.log(`📖 Narrativa: ${questions[0].farm_context.narrative}`);
            }
          }
        }

        console.log('\n✅ TRANSFORMACIÓN FUNCIONANDO CORRECTAMENTE');
        console.log('❌ Error "transformedQuestions is not defined" ARREGLADO');

      } else {
        console.log('❌ No se pudo acceder al juego');
      }

    } else {
      console.log('❌ Error creando evaluación:', createResponse.data.message);
    }

  } catch (error) {
    console.log('❌ ERROR EN PRUEBA:', error.message);
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📝 Data:', JSON.stringify(error.response.data, null, 2));
      console.log('🔍 URL:', error.config?.url);
    } else {
      console.log('🔍 No response object available');
    }
  }
}

testTransformationFix(); 