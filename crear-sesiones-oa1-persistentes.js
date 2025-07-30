const { mockGameData } = require('./server/services/mockGameData');

console.log('🚀 CREANDO SESIONES OA1 PERSISTENTES');

// Crear sesiones con IDs fijos y conocidos
const timestamp = Date.now();
const sesiones = [
  {
    id: `oa1_pollitos_${timestamp}`,
    title: '🐣 OA1 Nivel 1: Pollitos Pequeños (1-5)',
    description: 'Nivel 1: Conteo básico del 1 al 5 con pollitos',
    level: 1,
    max_number: 5,
    bloom: 'Recordar'
  },
  {
    id: `oa1_gallinas_${timestamp + 1}`,
    title: '🐔 OA1 Nivel 2: Gallinas Medianas (1-10)',
    description: 'Nivel 2: Conteo y correspondencia del 1 al 10',
    level: 2,
    max_number: 10,
    bloom: 'Comprender'
  },
  {
    id: `oa1_vacas_${timestamp + 2}`,
    title: '🐄 OA1 Nivel 3: Vacas Grandes (1-20)',
    description: 'Nivel 3: Conteo avanzado del 1 al 20',
    level: 3,
    max_number: 20,
    bloom: 'Aplicar'
  },
  {
    id: `oa1_granjero_${timestamp + 3}`,
    title: '🚜 OA1 Nivel 4: Granjero Experto (Patrones)',
    description: 'Nivel 4: Conteo por patrones',
    level: 4,
    max_number: 20,
    bloom: 'Analizar'
  }
];

console.log('📊 Sesiones a crear:');
sesiones.forEach((s, i) => {
  console.log(`${i + 1}. ${s.title} (${s.id})`);
});

// URLs finales
console.log('\n🎮 URLs FINALES:');
sesiones.forEach((s, i) => {
  console.log(`${i + 1}. http://localhost:3000/student/games/${s.id}/play`);
});

// Crear cada sesión
sesiones.forEach(sesion => {
  const sessionData = {
    session_id: sesion.id,
    title: sesion.title,
    description: sesion.description,
    
    // IDs de demo por defecto (no requieren autenticación específica)
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    teacher_id: '550e8400-e29b-41d4-a716-446655440003',
    class_id: '550e8400-e29b-41d4-a716-446655440001',
    host_id: '550e8400-e29b-41d4-a716-446655440003',
    
    // Status activo para acceso inmediato
    status: 'active',
    format: 'ENG01',
    engine_id: 'ENG01',
    
    // Configuración específica para OA1
    settings_json: {
      engine_id: 'ENG01',
      skin: '🐄 Granja 1° Básico',
      oa_code: 'MAT.1B.OA.01',
      bloom_level: sesion.bloom,
      game_level: sesion.level,
      max_number: sesion.max_number,
      theme: 'granja_oa1',
      specialized_component: 'FarmCountingGameOA1',
      farm_theme: true,
      grade_level: '1B',
      time_limit: 30,
      demo: true, // CRUCIAL: Marcar como demo
      public_access: true // Permitir acceso público
    },
    
    join_code: `OA${Math.floor(1000 + Math.random() * 9000)}`,
    max_players: 30,
    time_limit: 600,
    created_at: new Date().toISOString(),
    
    // Quiz asociado
    quiz_id: `quiz_${sesion.id}`,
    quizzes: {
      quiz_id: `quiz_${sesion.id}`,
      title: sesion.title,
      description: sesion.description,
      questions: generateQuestions(sesion.level, sesion.max_number)
    }
  };

  // Agregar al mockGameData
  try {
    mockGameData.addGameSession(sessionData);
    console.log(`✅ Agregada: ${sesion.id}`);
  } catch (error) {
    console.error(`❌ Error agregando ${sesion.id}:`, error.message);
  }
});

// Verificar que se agregaron
console.log('\n🔍 VERIFICANDO SESIONES AGREGADAS:');
const allSessions = mockGameData.getGameSessions({});
const oa1Sessions = allSessions.data.filter(s => s.session_id?.includes('oa1_'));
console.log(`📊 Total sesiones OA1: ${oa1Sessions.length}`);

oa1Sessions.forEach((session, i) => {
  console.log(`${i + 1}. ${session.title} (${session.session_id})`);
  console.log(`   Status: ${session.status}`);
  console.log(`   Demo: ${session.settings_json?.demo}`);
  console.log(`   URL: http://localhost:3000/student/games/${session.session_id}/play`);
});

function generateQuestions(level, maxNumber) {
  const questions = [];
  
  for (let i = 1; i <= 3; i++) {
    const count = Math.floor(Math.random() * maxNumber) + 1;
    
    let questionText = '';
    let animal = '';
    
    switch(level) {
      case 1:
        questionText = `¿Cuántos pollitos ves en la granja?`;
        animal = '🐣';
        break;
      case 2:
        questionText = `El granjero cuenta ${count} gallinas. ¿Cuántas son?`;
        animal = '🐔';
        break;
      case 3:
        questionText = `En el establo hay ${count} vacas. ¿Puedes contarlas?`;
        animal = '🐄';
        break;
      case 4:
        questionText = `¿Qué número sigue en la secuencia?`;
        animal = '🚜';
        break;
    }
    
    questions.push({
      question_id: `q${i}`,
      question_order: i,
      stem_md: questionText,
      type: 'multiple_choice',
      options_json: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= maxNumber),
      correct_answer: count.toString(),
      explanation: `La respuesta correcta es ${count}.`,
      points: 100,
      difficulty: 'easy',
      bloom_level: level === 1 ? 'Recordar' : level === 2 ? 'Comprender' : level === 3 ? 'Aplicar' : 'Analizar',
      farm_context: { 
        count: count, 
        animal: animal, 
        level: level 
      }
    });
  }
  
  return questions;
}

console.log('\n🎉 SESIONES OA1 PERSISTENTES CREADAS');
console.log('✅ Listas para usar sin autenticación especial'); 