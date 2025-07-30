// 📚 CONTENIDO MATEMÁTICO 1° BÁSICO - OBJETIVOS DE APRENDIZAJE
// Basado en el currículum nacional chileno para 1° básico

const FIRST_GRADE_MATH_CONTENT = {
  // 🔢 OA1: Contar números del 0 al 20
  counting_0_to_20: {
    engine_id: 'ENG01',
    learning_objective: 'OA1 - Contar números del 0 al 20 de uno en uno',
    questions: [
      {
        id: 'count-1b-001',
        type: 'counting',
        stem: '¿Cuántos pollitos hay en la granja?',
        visual: '🐔🐔🐔',
        correct_answer: 3,
        options: [2, 3, 4, 5],
        farm_narrative: 'Cuenta los pollitos que están en el corral',
        explanation: 'Hay 3 pollitos. ¡Pío, pío, pío!'
      },
      {
        id: 'count-1b-002',
        type: 'counting',
        stem: '¿Cuántas vacas puedes contar?',
        visual: '🐄🐄🐄🐄🐄',
        correct_answer: 5,
        options: [4, 5, 6, 7],
        farm_narrative: 'Las vacas están pastando en el campo',
        explanation: 'Son 5 vacas. ¡Muuu!'
      },
      {
        id: 'count-1b-003',
        type: 'counting',
        stem: '¿Cuántos cerditos ves?',
        visual: '🐷🐷',
        correct_answer: 2,
        options: [1, 2, 3, 4],
        farm_narrative: 'Los cerditos están jugando en el barro',
        explanation: 'Hay 2 cerditos. ¡Oink, oink!'
      },
      {
        id: 'count-1b-004',
        type: 'counting',
        stem: '¿Cuántas ovejas hay en el rebaño?',
        visual: '🐑🐑🐑🐑🐑🐑🐑',
        correct_answer: 7,
        options: [6, 7, 8, 9],
        farm_narrative: 'Las ovejas están descansando bajo el árbol',
        explanation: 'Son 7 ovejas. ¡Beee!'
      }
    ]
  },

  // 🔢 OA2: Representar números del 0 al 20
  number_representation: {
    engine_id: 'ENG01',
    learning_objective: 'OA2 - Representar números del 0 al 20',
    questions: [
      {
        id: 'repr-1b-001',
        type: 'number_recognition',
        stem: 'Encuentra el número que representa esta cantidad',
        visual: '🐔🐔🐔🐔',
        correct_answer: '4',
        options: ['3', '4', '5', '6'],
        farm_narrative: 'Cuenta los pollitos y encuentra su número',
        explanation: '4 pollitos = número 4'
      },
      {
        id: 'repr-1b-002',
        type: 'number_recognition',
        stem: '¿Qué número muestra esta imagen?',
        visual: '🐄🐄🐄🐄🐄🐄',
        correct_answer: '6',
        options: ['5', '6', '7', '8'],
        farm_narrative: 'Las vacas forman el número con su cantidad',
        explanation: '6 vacas = número 6'
      }
    ]
  },

  // ➕ OA3: Adición básica hasta 10
  basic_addition: {
    engine_id: 'ENG02',
    learning_objective: 'OA3 - Componer y descomponer números hasta 10',
    questions: [
      {
        id: 'add-1b-001',
        type: 'addition',
        stem: 'En la granja hay 2 pollitos y llegan 1 más. ¿Cuántos hay ahora?',
        visual: '🐔🐔 + 🐔 = ?',
        operation: '2 + 1',
        correct_answer: 3,
        options: [2, 3, 4, 5],
        farm_narrative: 'Los pollitos se reúnen en el corral',
        explanation: '2 pollitos + 1 pollito = 3 pollitos'
      },
      {
        id: 'add-1b-002',
        type: 'addition',
        stem: 'Había 3 cerditos y llegaron 2 más. ¿Cuántos cerditos hay en total?',
        visual: '🐷🐷🐷 + 🐷🐷 = ?',
        operation: '3 + 2',
        correct_answer: 5,
        options: [4, 5, 6, 7],
        farm_narrative: 'Todos los cerditos se juntan a jugar',
        explanation: '3 cerditos + 2 cerditos = 5 cerditos'
      }
    ]
  },

  // ➖ OA4: Substracción básica hasta 10
  basic_subtraction: {
    engine_id: 'ENG02',
    learning_objective: 'OA4 - Resolver problemas de sustracción hasta 10',
    questions: [
      {
        id: 'sub-1b-001',
        type: 'subtraction',
        stem: 'Había 5 ovejas en el campo y 2 se fueron a dormir. ¿Cuántas quedan?',
        visual: '🐑🐑🐑🐑🐑 - 🐑🐑 = ?',
        operation: '5 - 2',
        correct_answer: 3,
        options: [2, 3, 4, 5],
        farm_narrative: 'Algunas ovejas se van a descansar',
        explanation: '5 ovejas - 2 ovejas = 3 ovejas'
      }
    ]
  },

  // 📏 OA5: Comparar cantidades
  comparing_numbers: {
    engine_id: 'ENG01',
    learning_objective: 'OA5 - Comparar cantidades usando mayor, menor e igual',
    questions: [
      {
        id: 'comp-1b-001',
        type: 'comparison',
        stem: '¿Dónde hay MÁS animales?',
        visual_a: '🐔🐔🐔',
        visual_b: '🐄🐄🐄🐄🐄',
        correct_answer: 'B',
        options: ['A (pollitos)', 'B (vacas)', 'Igual'],
        farm_narrative: 'Compara los grupos de animales',
        explanation: '5 vacas es más que 3 pollitos'
      }
    ]
  }
};

// 🎯 GENERADOR DE SESIONES PARA 1° BÁSICO
function generateFirstGradeSession(topic = 'counting_0_to_20') {
  const content = FIRST_GRADE_MATH_CONTENT[topic];
  if (!content) {
    throw new Error(`Tópico ${topic} no encontrado para 1° básico`);
  }

  return {
    session_id: `1b-math-${topic}-${Date.now()}`,
    title: `Matemáticas 1° Básico: ${content.learning_objective}`,
    description: `Juego educativo basado en objetivos de aprendizaje del MINEDUC`,
    engine_id: content.engine_id,
    grade: '1B',
    subject: 'MAT',
    questions: content.questions.map((q, index) => ({
      question_id: q.id,
      question_order: index + 1,
      stem_md: q.stem,
      type: 'multiple_choice',
      options_json: q.options,
      correct_answer: q.correct_answer.toString(),
      explanation: q.explanation,
      points: 10,
      difficulty: 'easy',
      bloom_level: 'Recordar',
      farm_context: {
        visual: q.visual,
        narrative: q.farm_narrative,
        operation: q.operation || null
      }
    })),
    farm_theme: true,
    age_appropriate: true,
    learning_focus: content.learning_objective
  };
}

// 📝 CONTENIDO ESPECÍFICO PARA GAME-DEMO-001
const GAME_DEMO_001_CONTENT = generateFirstGradeSession('counting_0_to_20');

module.exports = {
  FIRST_GRADE_MATH_CONTENT,
  generateFirstGradeSession,
  GAME_DEMO_001_CONTENT
}; 
