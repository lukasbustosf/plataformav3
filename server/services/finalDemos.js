// 🎮 EDU21 - Demos Finales (DEMO18 a DEMO24)
// Juegos avanzados para niveles superiores

const finalQuizzes = [
  // DEMO18 - Case Study Sprint
  {
    quiz_id: 'quiz-case-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📊 Estudio de Caso - Empresa Sustentable',
    description: 'Analiza un caso empresarial y toma decisiones rápidas',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 25,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-case-001',
        question_order: 1,
        stem_md: 'Caso: Una empresa tiene pérdidas. ¿Qué analizas primero?',
        type: 'multiple_choice',
        options_json: ['Costos operativos', 'Competencia', 'Satisfacción del cliente', 'Flujo de caja'],
        correct_answer: 'Flujo de caja',
        explanation: 'El flujo de caja es fundamental para la supervivencia empresarial.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Analizar'
      },
      {
        question_id: 'q-case-002',
        question_order: 2,
        stem_md: 'Decisión: La empresa debe reducir costos. ¿Qué propones?',
        type: 'multiple_choice',
        options_json: ['Reducir personal', 'Automatizar procesos', 'Negociar con proveedores', 'Todas las anteriores'],
        correct_answer: 'Automatizar procesos',
        explanation: 'La automatización reduce costos sin afectar el empleo inmediatamente.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Evaluar'
      },
      {
        question_id: 'q-case-003',
        question_order: 3,
        stem_md: 'Estrategia: ¿Cómo medir el éxito de la implementación?',
        type: 'multiple_choice',
        options_json: ['ROI mensual', 'Satisfacción empleados', 'Eficiencia operativa', 'Todas las anteriores'],
        correct_answer: 'Todas las anteriores',
        explanation: 'Un enfoque integral considera múltiples métricas.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Evaluar'
      }
    ]
  },
  // DEMO19 - Simulation Tycoon
  {
    quiz_id: 'quiz-tycoon-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🏭 Simulation Tycoon - Cafetería Escolar',
    description: 'Administra una cafetería escolar tomando decisiones estratégicas',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 35,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-tycoon-001',
        question_order: 1,
        stem_md: 'Turno 1: Tienes $10,000. ¿En qué inviertes?',
        type: 'multiple_choice',
        options_json: ['Mejores ingredientes (+$3,000)', 'Más personal (+$2,500)', 'Publicidad (+$1,500)', 'Equipos (+$4,000)'],
        correct_answer: 'Mejores ingredientes (+$3,000)',
        explanation: 'Mejores ingredientes aumentan la satisfacción del cliente.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-tycoon-002',
        question_order: 2,
        stem_md: 'Turno 2: Las ventas subieron 20%. ¿Qué haces?',
        type: 'multiple_choice',
        options_json: ['Aumentar precios', 'Mantener calidad', 'Expandir menú', 'Ahorrar ganancias'],
        correct_answer: 'Mantener calidad',
        explanation: 'Mantener calidad asegura la fidelidad del cliente.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-tycoon-003',
        question_order: 3,
        stem_md: 'Turno 3: Un competidor abre cerca. ¿Tu estrategia?',
        type: 'multiple_choice',
        options_json: ['Guerra de precios', 'Diferenciación', 'Alianza estratégica', 'Ignorar competencia'],
        correct_answer: 'Diferenciación',
        explanation: 'La diferenciación crea valor único para el cliente.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Crear'
      }
    ]
  },
  // DEMO20 - Word Search Duel
  {
    quiz_id: 'quiz-duel-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '⚔️ Duelo de Palabras - Deportes',
    description: 'Competencia para encontrar palabras de deportes',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 12,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-duel-001',
        question_order: 1,
        stem_md: 'Encuentra rápido: FÚTBOL',
        type: 'multiple_choice',
        options_json: ['Encontrado', 'No encontrado', 'Tiempo agotado', 'Error'],
        correct_answer: 'Encontrado',
        explanation: 'FÚTBOL es el deporte más popular.',
        points: 2,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-duel-002',
        question_order: 2,
        stem_md: 'Encuentra rápido: TENIS',
        type: 'multiple_choice',
        options_json: ['Encontrado', 'No encontrado', 'Tiempo agotado', 'Error'],
        correct_answer: 'Encontrado',
        explanation: 'TENIS se juega con raqueta.',
        points: 2,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-duel-003',
        question_order: 3,
        stem_md: 'Encuentra rápido: BALONCESTO',
        type: 'multiple_choice',
        options_json: ['Encontrado', 'No encontrado', 'Tiempo agotado', 'Error'],
        correct_answer: 'Encontrado',
        explanation: 'BALONCESTO se juega con canasta.',
        points: 3,
        difficulty: 'hard',
        bloom_level: 'Aplicar'
      }
    ]
  },
  // DEMO21 - Data Lab
  {
    quiz_id: 'quiz-data-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📈 Data Lab - Análisis de Calificaciones',
    description: 'Analiza datos de calificaciones y crea visualizaciones',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 28,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-data-001',
        question_order: 1,
        stem_md: 'Datos: [85, 92, 78, 96, 88]. ¿Cuál es la media?',
        type: 'multiple_choice',
        options_json: ['87.8', '88.2', '89.0', '90.1'],
        correct_answer: '87.8',
        explanation: '(85+92+78+96+88)/5 = 87.8',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-data-002',
        question_order: 2,
        stem_md: 'Gráfico: ¿Cuál es mejor para mostrar tendencias en el tiempo?',
        type: 'multiple_choice',
        options_json: ['Gráfico de barras', 'Gráfico de líneas', 'Gráfico circular', 'Histograma'],
        correct_answer: 'Gráfico de líneas',
        explanation: 'Los gráficos de líneas muestran tendencias temporales.',
        points: 3,
        difficulty: 'easy',
        bloom_level: 'Comprender'
      },
      {
        question_id: 'q-data-003',
        question_order: 3,
        stem_md: 'Análisis: Si la mediana es 88 y la media es 87.8, ¿qué indica?',
        type: 'multiple_choice',
        options_json: ['Distribución normal', 'Asimetría izquierda', 'Asimetría derecha', 'Datos atípicos'],
        correct_answer: 'Asimetría izquierda',
        explanation: 'Cuando la mediana > media, hay asimetría hacia la izquierda.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Analizar'
      }
    ]
  },
  // DEMO22 - Timed Equation Duel
  {
    quiz_id: 'quiz-equation-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '⏰ Duelo de Ecuaciones - Matemática Rápida',
    description: 'Resuelve ecuaciones contra el tiempo',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 8,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-eq-001',
        question_order: 1,
        stem_md: 'Resuelve: 2x + 5 = 13',
        type: 'multiple_choice',
        options_json: ['x = 4', 'x = 3', 'x = 5', 'x = 6'],
        correct_answer: 'x = 4',
        explanation: '2x + 5 = 13, entonces 2x = 8, x = 4.',
        points: 4,
        difficulty: 'hard',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-eq-002',
        question_order: 2,
        stem_md: 'Resuelve: 3x - 7 = 8',
        type: 'multiple_choice',
        options_json: ['x = 5', 'x = 4', 'x = 6', 'x = 3'],
        correct_answer: 'x = 5',
        explanation: '3x - 7 = 8, entonces 3x = 15, x = 5.',
        points: 4,
        difficulty: 'hard',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-eq-003',
        question_order: 3,
        stem_md: 'Resuelve: x/2 + 3 = 7',
        type: 'multiple_choice',
        options_json: ['x = 8', 'x = 6', 'x = 10', 'x = 4'],
        correct_answer: 'x = 8',
        explanation: 'x/2 + 3 = 7, entonces x/2 = 4, x = 8.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Aplicar'
      }
    ]
  },
  // DEMO23 - Argument Map
  {
    quiz_id: 'quiz-argument-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🗺️ Mapa de Argumentos - Redes Sociales',
    description: 'Construye un mapa visual de argumentos sobre redes sociales',
    mode: 'manual',
    difficulty: 'hard',
    time_limit_minutes: 25,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-arg-001',
        question_order: 1,
        stem_md: 'Argumento central: ¿Las redes sociales benefician a los jóvenes?',
        type: 'multiple_choice',
        options_json: ['Sí - Conectan personas', 'No - Causan adicción', 'Depende del uso', 'Sin evidencia'],
        correct_answer: 'Depende del uso',
        explanation: 'El impacto depende de cómo se usen las redes sociales.',
        points: 4,
        difficulty: 'medium',
        bloom_level: 'Evaluar'
      },
      {
        question_id: 'q-arg-002',
        question_order: 2,
        stem_md: 'Evidencia: ¿Qué dato apoya el uso positivo?',
        type: 'multiple_choice',
        options_json: ['Facilitan aprendizaje', 'Promueven comparación', 'Generan ansiedad', 'Reducen ejercicio'],
        correct_answer: 'Facilitan aprendizaje',
        explanation: 'Las redes sociales pueden ser herramientas educativas.',
        points: 3,
        difficulty: 'easy',
        bloom_level: 'Comprender'
      },
      {
        question_id: 'q-arg-003',
        question_order: 3,
        stem_md: 'Contraargumento: ¿Qué evidencia muestra riesgos?',
        type: 'multiple_choice',
        options_json: ['Ciberbullying', 'Información falsa', 'Problemas de sueño', 'Todas las anteriores'],
        correct_answer: 'Todas las anteriores',
        explanation: 'Múltiples estudios documentan estos riesgos.',
        points: 5,
        difficulty: 'hard',
        bloom_level: 'Analizar'
      }
    ]
  },
  // DEMO24 - Mystery Box Reveal
  {
    quiz_id: 'quiz-mystery-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🎁 Caja Misteriosa - Inventos',
    description: 'Descubre qué invento se esconde respondiendo preguntas',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 15,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-myst-001',
        question_order: 1,
        stem_md: 'Pista 1: ¿Quién inventó la ampolleta?',
        type: 'multiple_choice',
        options_json: ['Thomas Edison', 'Nikola Tesla', 'Alexander Bell', 'Albert Einstein'],
        correct_answer: 'Thomas Edison',
        explanation: 'Thomas Edison inventó la ampolleta eléctrica.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-myst-002',
        question_order: 2,
        stem_md: 'Pista 2: ¿En qué año se inventó el teléfono?',
        type: 'multiple_choice',
        options_json: ['1876', '1880', '1885', '1890'],
        correct_answer: '1876',
        explanation: 'Alexander Graham Bell inventó el teléfono en 1876.',
        points: 4,
        difficulty: 'hard',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-myst-003',
        question_order: 3,
        stem_md: 'Pista 3: ¿Cuál invento revolucionó la comunicación?',
        type: 'multiple_choice',
        options_json: ['Radio', 'Telégrafo', 'Internet', 'Televisión'],
        correct_answer: 'Internet',
        explanation: 'Internet revolucionó la comunicación mundial.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      }
    ]
  }
];

const finalSessions = [
  // DEMO18 - Case Study Sprint
  {
    session_id: 'game-demo-018',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-case-001',
    host_id: 'teacher-123',
    format: 'case_study_sprint',
    status: 'waiting',
    title: '📊 Estudio de Caso - Empresa Demo',
    join_code: 'DEMO18',
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
  // DEMO19 - Simulation Tycoon
  {
    session_id: 'game-demo-019',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-tycoon-001',
    host_id: 'teacher-123',
    format: 'simulation_tycoon',
    status: 'waiting',
    title: '🏭 Simulation Tycoon - Cafetería Demo',
    join_code: 'DEMO19',
    settings_json: {
      max_players: 12,
      time_limit: 2100,
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
  // DEMO20 - Word Search Duel
  {
    session_id: 'game-demo-020',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-duel-001',
    host_id: 'teacher-123',
    format: 'word_search_duel',
    status: 'waiting',
    title: '⚔️ Duelo de Palabras - Deportes Demo',
    join_code: 'DEMO20',
    settings_json: {
      max_players: 30,
      time_limit: 720,
      show_correct_answers: true,
      shuffle_questions: true,
      shuffle_options: false,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO21 - Data Lab
  {
    session_id: 'game-demo-021',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-data-001',
    host_id: 'teacher-123',
    format: 'data_lab',
    status: 'waiting',
    title: '📈 Data Lab - Análisis Demo',
    join_code: 'DEMO21',
    settings_json: {
      max_players: 20,
      time_limit: 1680,
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
  // DEMO22 - Timed Equation Duel
  {
    session_id: 'game-demo-022',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-equation-001',
    host_id: 'teacher-123',
    format: 'timed_equation_duel',
    status: 'waiting',
    title: '⏰ Duelo de Ecuaciones - Matemática Demo',
    join_code: 'DEMO22',
    settings_json: {
      max_players: 25,
      time_limit: 480,
      show_correct_answers: true,
      shuffle_questions: true,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 3,
      demo: true
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // DEMO23 - Argument Map
  {
    session_id: 'game-demo-023',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-argument-001',
    host_id: 'teacher-123',
    format: 'argument_map',
    status: 'waiting',
    title: '🗺️ Mapa de Argumentos - Redes Sociales Demo',
    join_code: 'DEMO23',
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
  // DEMO24 - Mystery Box Reveal
  {
    session_id: 'game-demo-024',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-mystery-001',
    host_id: 'teacher-123',
    format: 'mystery_box_reveal',
    status: 'waiting',
    title: '🎁 Caja Misteriosa - Inventos Demo',
    join_code: 'DEMO24',
    settings_json: {
      max_players: 20,
      time_limit: 900,
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
  finalQuizzes,
  finalSessions
}; 
