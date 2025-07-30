const fetch = require('node-fetch');

async function createManualSession() {
  console.log('🎮 === CREATING MANUAL GAME SESSION ===');
  
  const evaluationId = 'eval_gamified_1752523912945'; // Del test anterior
  
  try {
    console.log(`\n🚀 Creating game session from evaluation: ${evaluationId}`);
    
    const response = await fetch(`http://localhost:5000/api/evaluation/gamified/${evaluationId}/start-game`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer demo-token-teacher',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Game session created successfully!');
      console.log(`🎮 Session ID: ${result.gameSession.session_id}`);
      console.log(`🔗 Join Code: ${result.gameSession.join_code}`);
      console.log(`📝 Title: ${result.gameSession.title}`);
      
      const sessionId = result.gameSession.session_id;
      const studentId = sessionId.replace('game_', '');
      
      console.log('\n🎯 URLs for testing:');
      console.log(`👨‍🏫 Teacher Lobby: http://localhost:3000/teacher/game/${sessionId}/lobby`);
      console.log(`👨‍🎓 Student Game: http://localhost:3000/student/games/${studentId}/play`);
      console.log(`🔗 Join Code: ${result.gameSession.join_code}`);
      
      // Test student access
      console.log(`\n🧪 Testing student access...`);
      const studentResponse = await fetch(`http://localhost:5000/api/game/${studentId}`, {
        headers: {
          'Authorization': 'Bearer demo-token-student'
        }
      });

      if (studentResponse.ok) {
        const studentData = await studentResponse.json();
        console.log(`✅ Student can access: ${studentData.session.title}`);
        console.log(`🔢 Engine ID: ${studentData.session.engine_id}`);
        console.log(`🎨 Skin applied: ${studentData.session.applied_skin?.skin_name || 'No skin'}`);
        
        if (studentData.session.engine_id === 'ENG01') {
          console.log(`🎉 SUCCESS: ENG01 PURE is working!`);
        }
      } else {
        console.log(`❌ Student access failed: ${studentResponse.status}`);
      }
      
    } else {
      const error = await response.text();
      console.log(`❌ Failed to create session: ${response.status} - ${error}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createManualSession(); 