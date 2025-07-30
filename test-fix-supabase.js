const fetch = require('node-fetch');

async function testSupabaseFix() {
  console.log('🧪 === TESTING SUPABASE FIX ===');
  
  const evalData = {
    class_id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Test Supabase Fix",
    subject: "Matemáticas",
    grade: "1B",
    game_format: "ENG01",
    engine_id: "ENG01",
    engine_config: {
      difficulty: "easy",
      range: { min: 1, max: 10 }
    },
    skin_theme: "granja",
    time_limit_minutes: 15,
    oa_codes: ["MA01-OA01"],
    questions: [
      {
        text: "Cuenta de 1 a 5",
        type: "counter",
        correct_answer: "5",
        points: 10
      }
    ]
  };

  const headers = {
    "Authorization": "Bearer demo-token-teacher",
    "Content-Type": "application/json"
  };

  try {
    console.log('🚀 Creando evaluación gamificada...');
    
    const response = await fetch('http://localhost:5000/api/evaluation/gamified', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(evalData)
    });
    
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ ¡ÉXITO! Evaluación creada:', result.evaluation_id);
      console.log('🎮 Game Format:', result.game_format);
      console.log('🔧 Engine ID:', result.engine_id);
      console.log('🎨 Skin Theme:', result.skin_theme);
      console.log('📝 Questions:', result.questions?.length || 0);
    } else {
      const error = await response.text();
      console.log('❌ Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSupabaseFix(); 