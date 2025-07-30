// 🎮 EDU21 - Datos Demo Completos para Todos los 24 Formatos
// Versión 1.0 - Todos los juegos con ejemplos reales y educativos
// ACTUALIZADO: Incluye conexión con engines específicos

// Quizzes adicionales para formatos faltantes CON ENGINES ASIGNADOS
const allDemoQuizzes = [
  // DEMO04 - Memory Flip - ENG02 (Drag-Drop Numbers)
  {
    quiz_id: 'quiz-memory-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🧠 Memory Flip - Verbos y Conjugaciones',
    description: 'Juego de memoria para practicar verbos y sus conjugaciones',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 15,
    active: true,
    created_at: new Date().toISOString(),
    // 🎮 ENGINE INTEGRACIÓN
    engine_id: 'ENG02',
    engine_name: 'Drag-Drop Numbers',
    game_mechanics: {
      type: 'memory_pairs',
      drag_drop_enabled: true,
      interaction_style: 'card_flip_drag',
      engine_features: ['memory_mechanics', 'drag_validation', 'pairing_logic']
    },
    questions: [
      {
        question_id: 'q-mem-001',
        question_order: 1,
        stem_md: 'Conjugación de "comer" en presente yo',
        type: 'multiple_choice',
        options_json: ['como', 'comes', 'come', 'comemos'],
        correct_answer: 'como',
        explanation: 'Yo como es la conjugación correcta en primera persona del singular.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-mem-002',
        question_order: 2,
        stem_md: 'Conjugación de "salir" en futuro tú',
        type: 'multiple_choice',
        options_json: ['saldrás', 'saldrés', 'salirás', 'salistes'],
        correct_answer: 'saldrás',
        explanation: 'Tú saldrás es la conjugación correcta en segunda persona del singular.',
        points: 2,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-mem-003',
        question_order: 3,
        stem_md: 'Conjugación de "escribir" en pretérito él/ella',
        type: 'multiple_choice',
        options_json: ['escribió', 'escribía', 'escribirá', 'escriba'],
        correct_answer: 'escribió',
        explanation: 'Él/ella escribió es la conjugación correcta en pretérito.',
        points: 2,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-mem-004',
        question_order: 4,
        stem_md: 'Conjugación de "vivir" en presente nosotros',
        type: 'multiple_choice',
        options_json: ['vivimos', 'vivemos', 'vivamos', 'viven'],
        correct_answer: 'vivimos',
        explanation: 'Nosotros vivimos es la conjugación correcta en presente.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
  // 🎯 JUEGO DE 1° BÁSICO - MATEMÁTICAS
  {
    quiz_id: '1b-math-counting',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🧮 Contar Animales 1-5 (1° Básico)',
    description: 'Juego de conteo básico con animales para 1° básico',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 10,
    active: true,
    created_at: new Date().toISOString(),
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    game_mechanics: {
      type: 'counting_progression',
      engine_features: ['number_line', 'visual_counting'],
      interaction_style: 'click_and_count',
      simplified_ui: true,
      large_buttons: true
    },
    questions: [
      {
        question_id: '1b-counting-1',
        question_order: 1,
        stem_md: '¿Cuántos patitos ves? 🦆🦆🦆',
        type: 'multiple_choice',
        options_json: ['2', '3', '4', '5'],
        correct_answer: '3',
        explanation: '¡Correcto! Hay 3 patitos.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: '1b-counting-2',
        question_order: 2,
        stem_md: '¿Cuántos pollitos ves? 🐥🐥',
        type: 'multiple_choice',
        options_json: ['1', '2', '3', '4'],
        correct_answer: '2',
        explanation: '¡Muy bien! Hay 2 pollitos.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  }
];

// Sessions demo simplificadas pero completas
const allDemoSessions = [
  {
    session_id: 'game-demo-001',
    quiz_id: 'game-demo-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    teacher_id: 'teacher-123',
    title: '🎯 Quiz Demo 001',
    join_code: 'DEMO01',
    settings_json: {
      max_players: 20,
      time_limit: 300,
      show_correct_answers: true,
      shuffle_questions: true,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 4,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  }
];

module.exports = {
  allDemoQuizzes,
  allDemoSessions
}; 
