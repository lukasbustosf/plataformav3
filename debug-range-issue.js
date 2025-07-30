const axios = require('axios');

// 🔍 DEBUG SPECIFIC: Range Issue
const BASE_URL = 'http://localhost:5000';
const DEMO_TOKEN = 'demo_teacher_token_123';

async function debugRangeIssue() {
  console.log('🔍 DEBUGGING: Rango Numérico Issue\n');
  
  try {
    console.log('📝 Step 1: Creating evaluation with "Números de 10 a 100"...');
    
    const evaluationData = {
      title: 'Números de 10 a 100',
      description: 'Test de rango numérico',
      class_id: '550e8400-e29b-41d4-a716-446655440001',
      oa_codes: ['MAT.1B.OA.01'],
      difficulty: 'medium',
      question_count: 3, // Solo 3 para debug fácil
      game_format: 'trivia_lightning',
      engine_id: 'ENG01',
      skin_theme: 'espacio',
      time_limit_minutes: 25
    };

    console.log(`🔢 Input title: "${evaluationData.title}"`);
    
    const createResponse = await axios.post(`${BASE_URL}/api/evaluation/gamified`, evaluationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEMO_TOKEN}`
      }
    });

    const createResult = createResponse.data;
    console.log(`\n📊 Result Summary:`);
    console.log(`   Evaluation ID: ${createResult.evaluation.evaluation_id}`);
    console.log(`   Questions generated: ${createResult.gameContent?.questions?.length || 0}`);
    
    // Analyze ALL questions
    if (createResult.gameContent?.questions?.length > 0) {
      console.log(`\n🔍 DETAILED QUESTION ANALYSIS:`);
      createResult.gameContent.questions.forEach((q, index) => {
        const answer = parseInt(q.correct_answer);
        console.log(`   Q${index + 1}: "${q.text}"`);
        console.log(`        Answer: ${answer} (${answer >= 10 && answer <= 100 ? '✅ IN RANGE' : '❌ OUT OF RANGE'})`);
        console.log(`        Options: [${q.options.join(', ')}]`);
      });
      
      // Count questions in correct range
      const questionsInRange = createResult.gameContent.questions.filter(q => {
        const answer = parseInt(q.correct_answer);
        return answer >= 10 && answer <= 100;
      });
      
      console.log(`\n📈 RANGE STATISTICS:`);
      console.log(`   Total questions: ${createResult.gameContent.questions.length}`);
      console.log(`   Questions in range (10-100): ${questionsInRange.length}`);
      console.log(`   Percentage in range: ${(questionsInRange.length / createResult.gameContent.questions.length * 100).toFixed(1)}%`);
      
      if (questionsInRange.length === 0) {
        console.log(`❌ PROBLEM: No questions are in the expected range 10-100`);
      } else if (questionsInRange.length < createResult.gameContent.questions.length) {
        console.log(`⚠️ PROBLEM: Only some questions are in the expected range`);
      } else {
        console.log(`✅ SUCCESS: All questions are in the expected range`);
      }
    }
    
    // Also test the public extractNumericContext method directly
    console.log(`\n🧪 TESTING extractNumericContext DIRECTLY:`);
    
    // Test the regex directly
    const title = 'Números de 10 a 100';
    const rangeMatch = title.toLowerCase().match(/(?:números?\s+)?(?:del?\s+)?(\d+)\s+a(?:l)?\s+(\d+)|(\d+)\s*[-–]\s*(\d+)/);
    console.log(`   Input: "${title}"`);
    console.log(`   Regex match: ${rangeMatch ? `[${rangeMatch[1] || rangeMatch[3]}, ${rangeMatch[2] || rangeMatch[4]}]` : 'NO MATCH'}`);
    
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1] || rangeMatch[3]);
      const end = parseInt(rangeMatch[2] || rangeMatch[4]);
      console.log(`   Extracted range: ${start} to ${end}`);
      
      if (start === 10 && end === 100) {
        console.log(`   ✅ Regex extraction is CORRECT`);
      } else {
        console.log(`   ❌ Regex extraction is WRONG (expected: 10 to 100)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugRangeIssue(); 