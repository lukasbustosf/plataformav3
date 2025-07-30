// 🎮 EDU21 - Demos Restantes (DEMO11 a DEMO24)
// Continuación de los datos demo para completar todos los formatos

const remainingQuizzes = [
  // DEMO11 - Escape Room Mini
  {
    quiz_id: 'quiz-escape-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🚪 Escape Room Mini - Historia de Chile',
    description: 'Resuelve pistas históricas para escapar',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 25,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-escape-001',
        question_order: 1,
        stem_md: 'Pista 1: ¿En qué año se independizó Chile?',
        type: 'multiple_choice',
        options_json: ['1810', '1818', '1820', '1815'],
        correct_answer: '1818',
        explanation: 'Chile se independizó en 1818.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-escape-002',
        question_order: 2,
        stem_md: 'Pista 2: ¿Quién fue el primer presidente de Chile?',
        type: 'multiple_choice',
        options_json: ['Bernardo O\'Higgins', 'José Miguel Carrera', 'Manuel Blanco Encalada', 'Ramón Freire'],
        correct_answer: 'Manuel Blanco Encalada',
        explanation: 'Manuel Blanco Encalada fue el primer presidente.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-escape-003',
        question_order: 3,
        stem_md: 'Pista 3: ¿Cuál es la capital de Chile?',
        type: 'multiple_choice',
        options_json: ['Valparaíso', 'Santiago', 'Concepción', 'La Serena'],
        correct_answer: 'Santiago',
        explanation: 'Santiago es la capital de Chile.',
        points: 3,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
  // DEMO12 - Story Path
  {
    quiz_id: 'quiz-story-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📖 Historia Interactiva - La Aventura del Bosque',
    description: 'Elige tu camino en esta aventura educativa',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 20,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-story-001',
        question_order: 1,
        stem_md: 'Estás en el bosque y ves dos caminos. ¿Cuál eliges?',
        type: 'multiple_choice',
        options_json: ['Camino de la izquierda (rocoso)', 'Camino de la derecha (con flores)', 'Regresar', 'Esperar'],
        correct_answer: 'Camino de la derecha (con flores)',
        explanation: 'El camino con flores es más seguro para continuar.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      },
      {
        question_id: 'q-story-002',
        question_order: 2,
        stem_md: 'Encuentras un arroyo. ¿Cómo lo cruzas?',
        type: 'multiple_choice',
        options_json: ['Saltar', 'Usar piedras', 'Buscar un puente', 'Dar la vuelta'],
        correct_answer: 'Usar piedras',
        explanation: 'Usar piedras es la forma más segura de cruzar.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      },
      {
        question_id: 'q-story-003',
        question_order: 3,
        stem_md: 'Ves un animal herido. ¿Qué haces?',
        type: 'multiple_choice',
        options_json: ['Ayudarlo', 'Ignorarlo', 'Huir', 'Llamar ayuda'],
        correct_answer: 'Llamar ayuda',
        explanation: 'Llamar ayuda es lo más responsable.',
        points: 4,
        difficulty: 'hard',
        bloom_level: 'Evaluar'
      }
    ]
  },
  // DEMO13 - Crossword
  {
    quiz_id: 'quiz-crossword-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🧩 Crucigrama - Geografía de Chile',
    description: 'Completa el crucigrama con conocimientos geográficos',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 18,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-cross-001',
        question_order: 1,
        stem_md: 'Horizontal 1: Desierto más árido del mundo (7 letras)',
        type: 'multiple_choice',
        options_json: ['ATACAMA', 'SAHARA', 'GOBI', 'KALAHARI'],
        correct_answer: 'ATACAMA',
        explanation: 'El desierto de Atacama es el más árido del mundo.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-cross-002',
        question_order: 2,
        stem_md: 'Vertical 2: Cordillera principal de Chile (5 letras)',
        type: 'multiple_choice',
        options_json: ['ANDES', 'ALPES', 'ROCAS', 'ATLAS'],
        correct_answer: 'ANDES',
        explanation: 'La cordillera de los Andes recorre Chile.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-cross-003',
        question_order: 3,
        stem_md: 'Horizontal 3: Océano que baña las costas chilenas (8 letras)',
        type: 'multiple_choice',
        options_json: ['PACIFICO', 'ATLANTICO', 'INDICO', 'ARTICO'],
        correct_answer: 'PACIFICO',
        explanation: 'El océano Pacífico baña las costas de Chile.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
  // DEMO14 - Debate Cards
  {
    quiz_id: 'quiz-debate-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🗣️ Debate Cards - Medio Ambiente',
    description: 'Debate sobre temas ambientales con cartas de argumentos',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 30,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-debate-001',
        question_order: 1,
        stem_md: 'Posición: ¿Deberían prohibirse los plásticos de un solo uso?',
        type: 'multiple_choice',
        options_json: ['A favor - Contamina océanos', 'En contra - Costo económico', 'Neutral - Alternativas graduales', 'Abstención'],
        correct_answer: 'A favor - Contamina océanos',
        explanation: 'Los plásticos de un solo uso son una amenaza para el medio ambiente.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Evaluar'
      },
      {
        question_id: 'q-debate-002',
        question_order: 2,
        stem_md: 'Argumento: ¿Cuál es el principal beneficio de la energía solar?',
        type: 'multiple_choice',
        options_json: ['Renovable', 'Barata', 'Silenciosa', 'Fácil instalación'],
        correct_answer: 'Renovable',
        explanation: 'La energía solar es una fuente renovable e inagotable.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      },
      {
        question_id: 'q-debate-003',
        question_order: 3,
        stem_md: 'Contraargumento: ¿Cuál es la principal dificultad del reciclaje?',
        type: 'multiple_choice',
        options_json: ['Costo de procesamiento', 'Falta de educación', 'Tecnología limitada', 'Resistencia social'],
        correct_answer: 'Falta de educación',
        explanation: 'La educación es clave para mejorar las tasas de reciclaje.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      }
    ]
  },
  // DEMO15 - Coding Puzzle
  {
    quiz_id: 'quiz-coding-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '💻 Puzzle de Programación - Lógica Básica',
    description: 'Resuelve problemas de lógica y programación visual',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 30,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-code-001',
        question_order: 1,
        stem_md: 'Completa: if (x > 5) { print("Mayor") } else { print("___") }',
        type: 'multiple_choice',
        options_json: ['Menor', 'Igual', 'Menor o igual', 'Error'],
        correct_answer: 'Menor o igual',
        explanation: 'Si x no es mayor que 5, entonces es menor o igual.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-code-002',
        question_order: 2,
        stem_md: 'Secuencia: ¿Qué imprime este bucle? for i in [1,2,3]: print(i*2)',
        type: 'multiple_choice',
        options_json: ['1,2,3', '2,4,6', '3,6,9', '1,4,9'],
        correct_answer: '2,4,6',
        explanation: 'El bucle multiplica cada número por 2.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-code-003',
        question_order: 3,
        stem_md: 'Función: ¿Cuál función suma dos números?',
        type: 'multiple_choice',
        options_json: ['def suma(a,b): return a+b', 'def suma(a,b): return a*b', 'def suma(a,b): return a-b', 'def suma(a,b): return a/b'],
        correct_answer: 'def suma(a,b): return a+b',
        explanation: 'La función suma devuelve la suma de a y b.',
        points: 3,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
  // DEMO16 - Timeline Builder
  {
    quiz_id: 'quiz-timeline-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📅 Constructor de Línea de Tiempo - Revolución Industrial',
    description: 'Ordena eventos históricos en una línea temporal',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 20,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-time-001',
        question_order: 1,
        stem_md: 'Orden: ¿Cuándo se inventó la máquina de vapor?',
        type: 'multiple_choice',
        options_json: ['1712', '1750', '1780', '1800'],
        correct_answer: '1712',
        explanation: 'Thomas Newcomen inventó la máquina de vapor en 1712.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-time-002',
        question_order: 2,
        stem_md: 'Secuencia: ¿Qué vino después de la máquina de vapor?',
        type: 'multiple_choice',
        options_json: ['Ferrocarril', 'Telégrafo', 'Electricidad', 'Automóvil'],
        correct_answer: 'Ferrocarril',
        explanation: 'El ferrocarril fue posible gracias a la máquina de vapor.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Comprender'
      },
      {
        question_id: 'q-time-003',
        question_order: 3,
        stem_md: 'Impacto: ¿Cuál fue el principal efecto de la Revolución Industrial?',
        type: 'multiple_choice',
        options_json: ['Urbanización', 'Mejor salud', 'Menor trabajo', 'Más ocio'],
        correct_answer: 'Urbanización',
        explanation: 'La Revolución Industrial causó migración masiva a ciudades.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      }
    ]
  },
  // DEMO17 - Advanced Escape Room
  {
    quiz_id: 'quiz-advanced-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🏰 Escape Room Avanzado - Laboratorio Científico',
    description: 'Resuelve múltiples puzzles científicos para escapar del laboratorio',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 40,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-adv-001',
        question_order: 1,
        stem_md: 'Puzzle 1: ¿Cuál es la fórmula química del agua?',
        type: 'multiple_choice',
        options_json: ['H2O', 'CO2', 'O2', 'H2O2'],
        correct_answer: 'H2O',
        explanation: 'H2O es la fórmula química del agua.',
        points: 3,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-adv-002',
        question_order: 2,
        stem_md: 'Puzzle 2: Si mezclas ácido y base, ¿qué se forma?',
        type: 'multiple_choice',
        options_json: ['Sal y agua', 'Gas tóxico', 'Explosión', 'Nada'],
        correct_answer: 'Sal y agua',
        explanation: 'La neutralización ácido-base produce sal y agua.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Comprender'
      },
      {
        question_id: 'q-adv-003',
        question_order: 3,
        stem_md: 'Puzzle 3: ¿Qué proceso permite a las plantas producir oxígeno?',
        type: 'multiple_choice',
        options_json: ['Respiración', 'Fotosíntesis', 'Transpiración', 'Germinación'],
        correct_answer: 'Fotosíntesis',
        explanation: 'La fotosíntesis convierte CO2 y H2O en glucosa y O2.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Comprender'
      }
    ]
  }
];

const remainingSessions = [
  // DEMO11 - Escape Room Mini
  {
    session_id: 'game-demo-011',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-escape-001',
    host_id: 'teacher-123',
    format: 'escape_room_mini',
    status: 'waiting',
    title: '🚪 Escape Room Mini - Historia Demo',
    join_code: 'DEMO11',
    settings_json: {
      max_players: 15,
      time_limit: 1500,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO12 - Story Path
  {
    session_id: 'game-demo-012',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-story-001',
    host_id: 'teacher-123',
    format: 'story_path',
    status: 'waiting',
    title: '📖 Historia Interactiva - Aventura Demo',
    join_code: 'DEMO12',
    settings_json: {
      max_players: 20,
      time_limit: 1200,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: false,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO13 - Crossword
  {
    session_id: 'game-demo-013',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-crossword-001',
    host_id: 'teacher-123',
    format: 'crossword',
    status: 'waiting',
    title: '🧩 Crucigrama - Geografía Demo',
    join_code: 'DEMO13',
    settings_json: {
      max_players: 25,
      time_limit: 1080,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: false,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO14 - Debate Cards
  {
    session_id: 'game-demo-014',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-debate-001',
    host_id: 'teacher-123',
    format: 'debate_cards',
    status: 'waiting',
    title: '🗣️ Debate Cards - Medio Ambiente Demo',
    join_code: 'DEMO14',
    settings_json: {
      max_players: 20,
      time_limit: 1800,
      show_correct_answers: false,
      shuffle_questions: false,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO15 - Coding Puzzle
  {
    session_id: 'game-demo-015',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-coding-001',
    host_id: 'teacher-123',
    format: 'coding_puzzle',
    status: 'waiting',
    title: '💻 Puzzle de Programación - Lógica Demo',
    join_code: 'DEMO15',
    settings_json: {
      max_players: 18,
      time_limit: 1800,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO16 - Timeline Builder
  {
    session_id: 'game-demo-016',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-timeline-001',
    host_id: 'teacher-123',
    format: 'timeline_builder',
    status: 'waiting',
    title: '📅 Timeline Builder - Revolución Demo',
    join_code: 'DEMO16',
    settings_json: {
      max_players: 25,
      time_limit: 1200,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO17 - Advanced Escape Room
  {
    session_id: 'game-demo-017',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-advanced-001',
    host_id: 'teacher-123',
    format: 'advanced_escape_room',
    status: 'waiting',
    title: '🏰 Escape Room Avanzado - Laboratorio Demo',
    join_code: 'DEMO17',
    settings_json: {
      max_players: 10,
      time_limit: 2400,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  }
];

module.exports = {
  remainingQuizzes,
  remainingSessions
}; 
