const { mockGameData } = require('./server/services/mockGameData');

async function crearSesionesOA1Directo() {
  console.log('🚀 CREANDO SESIONES OA1 DIRECTAMENTE EN MOCKGAMEDATA');
  
  const timestamp = Date.now();
  const sesiones = [
    {
      id: `oa1_pollitos_${timestamp}`,
      title: '🐣 OA1 Nivel 1: Pollitos Pequeños (1-5)',
      description: 'Nivel 1: Conteo básico del 1 al 5 con pollitos',
      oa_code: 'MAT.1B.OA.01',
      bloom_level: 'Recordar',
      game_level: 1,
      max_number: 5,
      theme: 'granja_oa1'
    },
    {
      id: `oa1_gallinas_${timestamp + 1}`,
      title: '🐔 OA1 Nivel 2: Gallinas Medianas (1-10)',
      description: 'Nivel 2: Conteo y correspondencia del 1 al 10',
      oa_code: 'MAT.1B.OA.01',
      bloom_level: 'Comprender',
      game_level: 2,
      max_number: 10,
      theme: 'granja_oa1'
    },
    {
      id: `oa1_vacas_${timestamp + 2}`,
      title: '🐄 OA1 Nivel 3: Vacas Grandes (1-20)',
      description: 'Nivel 3: Conteo avanzado del 1 al 20',
      oa_code: 'MAT.1B.OA.01',
      bloom_level: 'Aplicar',
      game_level: 3,
      max_number: 20,
      theme: 'granja_oa1'
    },
    {
      id: `oa1_granjero_${timestamp + 3}`,
      title: '🚜 OA1 Nivel 4: Granjero Experto (Patrones)',
      description: 'Nivel 4: Conteo por patrones (2 en 2, 5 en 5)',
      oa_code: 'MAT.1B.OA.01',
      bloom_level: 'Analizar',
      game_level: 4,
      max_number: 20,
      theme: 'granja_oa1'
    }
  ];

  console.log(`📊 Sesiones antes de agregar: ${mockGameData.getGameSessions({}).data.length}`);
  
  sesiones.forEach(sesion => {
    console.log(`\n📝 Creando sesión: ${sesion.title}`);
    
    const sessionData = {
      session_id: sesion.id,
      title: sesion.title,
      description: sesion.description,
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      teacher_id: '550e8400-e29b-41d4-a716-446655440003',
      class_id: '550e8400-e29b-41d4-a716-446655440001',
      host_id: '550e8400-e29b-41d4-a716-446655440003',
      status: 'active', // Cambiar a 'active' para que se pueda acceder inmediatamente
      format: 'ENG01',
      engine_id: 'ENG01',
      settings_json: {
        engine_id: 'ENG01',
        skin: '🐄 Granja 1° Básico',
        oa_code: sesion.oa_code,
        bloom_level: sesion.bloom_level,
        game_level: sesion.game_level,
        max_number: sesion.max_number,
        theme: sesion.theme,
        specialized_component: 'FarmCountingGameOA1',
        farm_theme: true,
        grade_level: '1B',
        time_limit: 30,
        demo: true // Marcar como demo para facilitar acceso
      },
      join_code: 'OA' + Math.floor(1000 + Math.random() * 9000),
      max_players: 30,
      time_limit: 600,
      created_at: new Date().toISOString(),
      
      // Agregar quiz directamente
      quiz_id: `quiz_${sesion.id}`,
      quizzes: {
        quiz_id: `quiz_${sesion.id}`,
        title: sesion.title,
        description: sesion.description,
        questions: generateSpecificQuestions(sesion.game_level, sesion.max_number)
      }
    };

    // Agregar sesión directamente
    mockGameData.addGameSession(sessionData);
    
    console.log(`✅ Sesión agregada: ${sesion.id}`);
    console.log(`   📍 URL: http://localhost:3000/student/games/${sesion.id}/play`);
    console.log(`   🎮 Join Code: ${sessionData.join_code}`);
    console.log(`   📊 Status: ${sessionData.status}`);
  });

  console.log(`\n📊 Sesiones después de agregar: ${mockGameData.getGameSessions({}).data.length}`);
  
  // Verificar que las sesiones se agregaron correctamente
  console.log('\n🔍 VERIFICANDO SESIONES AGREGADAS:');
  sesiones.forEach(sesion => {
    const found = mockGameData.getGameSessionById(sesion.id, '550e8400-e29b-41d4-a716-446655440000');
    console.log(`   ${sesion.id}: ${found ? '✅ ENCONTRADO' : '❌ NO ENCONTRADO'}`);
    if (found) {
      console.log(`      Título: ${found.title}`);
      console.log(`      Status: ${found.status}`);
    }
  });
  
  console.log('\n🎉 SESIONES OA1 CREADAS DIRECTAMENTE');
  console.log('✅ Todas las sesiones están listas para probar');
}

function generateSpecificQuestions(level, maxNumber) {
  const questions = [];
  
  switch (level) {
    case 1: // Pollitos: Conteo básico 1-5
      for (let i = 1; i <= 3; i++) {
        const count = Math.floor(Math.random() * maxNumber) + 1;
        questions.push({
          question_id: `q${i}`,
          question_order: i,
          stem_md: `¿Cuántos pollitos ves en la granja?`,
          type: 'multiple_choice',
          options_json: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= 5),
          correct_answer: count.toString(),
          explanation: `Hay ${count} pollitos en la granja. Contémoslos uno por uno.`,
          points: 100,
          difficulty: 'easy',
          bloom_level: 'Recordar',
          farm_context: { count: count, animal: '🐣', skill: 'conteo_visual_basico' }
        });
      }
      break;
      
    case 2: // Gallinas: Conteo y correspondencia 1-10
      for (let i = 1; i <= 3; i++) {
        const count = Math.floor(Math.random() * maxNumber) + 1;
        questions.push({
          question_id: `q${i}`,
          question_order: i,
          stem_md: `El granjero cuenta ${count} gallinas. ¿Cuántas son?`,
          type: 'multiple_choice',
          options_json: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= 10),
          correct_answer: count.toString(),
          explanation: `El granjero cuenta ${count} gallinas. Cada gallina es una unidad.`,
          points: 150,
          difficulty: 'medium',
          bloom_level: 'Comprender',
          farm_context: { count: count, animal: '🐔', skill: 'conteo_correspondencia' }
        });
      }
      break;
      
    case 3: // Vacas: Conteo avanzado 1-20
      for (let i = 1; i <= 3; i++) {
        const count = Math.floor(Math.random() * maxNumber) + 1;
        questions.push({
          question_id: `q${i}`,
          question_order: i,
          stem_md: `En el establo hay ${count} vacas. ¿Puedes contarlas todas?`,
          type: 'multiple_choice',
          options_json: [count, count + 2, count - 2, count + 3].filter(n => n > 0 && n <= 20),
          correct_answer: count.toString(),
          explanation: `En el establo hay ${count} vacas. Para números grandes, podemos contar de diferentes maneras.`,
          points: 200,
          difficulty: 'hard',
          bloom_level: 'Aplicar',
          farm_context: { count: count, animal: '🐄', skill: 'conteo_avanzado' }
        });
      }
      break;
      
    case 4: // Granjero: Patrones de conteo
      const patterns = [
        { sequence: [2, 4, 6, 8], next: 10, description: 'de 2 en 2' },
        { sequence: [5, 10, 15], next: 20, description: 'de 5 en 5' },
        { sequence: [10, 8, 6], next: 4, description: 'hacia atrás de 2 en 2' }
      ];
      
      patterns.forEach((pattern, i) => {
        questions.push({
          question_id: `q${i + 1}`,
          question_order: i + 1,
          stem_md: `¿Qué número sigue contando ${pattern.description}? ${pattern.sequence.join(', ')}, ___`,
          type: 'multiple_choice',
          options_json: [pattern.next, pattern.next + 2, pattern.next - 1, pattern.next + 5].filter(n => n > 0 && n <= 20),
          correct_answer: pattern.next.toString(),
          explanation: `Contando ${pattern.description}, el siguiente número es ${pattern.next}.`,
          points: 250,
          difficulty: 'expert',
          bloom_level: 'Analizar',
          farm_context: { pattern: pattern.sequence, next: pattern.next, skill: 'conteo_por_patrones' }
        });
      });
      break;
  }
  
  return questions;
}

// Ejecutar inmediatamente
crearSesionesOA1Directo(); 