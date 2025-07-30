// Mock Game Data Service for Development
// Provides ready-to-go games without requiring a real database

// Import all demo data
const { allDemoQuizzes, allDemoSessions } = require('./allGameDemos');
const { remainingQuizzes, remainingSessions } = require('./remainingDemos');
const { finalQuizzes, finalSessions } = require('./finalDemos');
const { LOCAL_DEMO_DATA } = require('../database/local-config');

const mockQuizzes = [
  {
    quiz_id: 'quiz-math-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🐄 Conteo en la Granja - 1° Básico',
    description: 'Juego de conteo con animales de granja para 1° básico (OA1 - MINEDUC)',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 10,
    active: true,
    created_at: new Date().toISOString(),
    // 🎯 ENGINE Y SKIN CONFIGURATION
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    grade_level: '1B',
    farm_theme: true,
    questions: [
      {
        question_id: 'count-1b-001',
        question_order: 1,
        stem_md: '🐔 ¿Cuántos pollitos hay en la granja?',
        type: 'multiple_choice',
        options_json: [2, 3, 4, 5],
        correct_answer: '3',
        explanation: 'Hay 3 pollitos. ¡Pío, pío, pío!',
        points: 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        farm_context: {
          visual: '🐔🐔🐔',
          narrative: 'Cuenta los pollitos que están en el corral',
          animal_sound: 'pío pío'
        }
      },
      {
        question_id: 'count-1b-002',
        question_order: 2,
        stem_md: '🐄 ¿Cuántas vacas puedes contar?',
        type: 'multiple_choice',
        options_json: [4, 5, 6, 7],
        correct_answer: '5',
        explanation: 'Son 5 vacas. ¡Muuu!',
        points: 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        farm_context: {
          visual: '🐄🐄🐄🐄🐄',
          narrative: 'Las vacas están pastando en el campo',
          animal_sound: 'muuu'
        }
      },
      {
        question_id: 'count-1b-003',
        question_order: 3,
        stem_md: '🐷 ¿Cuántos cerditos ves?',
        type: 'multiple_choice',
        options_json: [1, 2, 3, 4],
        correct_answer: '2',
        explanation: 'Hay 2 cerditos. ¡Oink, oink!',
        points: 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        farm_context: {
          visual: '🐷🐷',
          narrative: 'Los cerditos están jugando en el barro',
          animal_sound: 'oink oink'
        }
      },
      {
        question_id: 'count-1b-004',
        question_order: 4,
        stem_md: '🐑 ¿Cuántas ovejas hay en el rebaño?',
        type: 'multiple_choice',
        options_json: [6, 7, 8, 9],
        correct_answer: '7',
        explanation: 'Son 7 ovejas. ¡Beee!',
        points: 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        farm_context: {
          visual: '🐑🐑🐑🐑🐑🐑🐑',
          narrative: 'Las ovejas están descansando bajo el árbol',
          animal_sound: 'beee'
        }
      },
      {
        question_id: 'count-1b-005',
        question_order: 5,
        stem_md: '🐰 ¿Cuántos conejitos saltaron?',
        type: 'multiple_choice',
        options_json: [3, 4, 5, 6],
        correct_answer: '4',
        explanation: 'Saltaron 4 conejitos. ¡Muy bien!',
        points: 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        farm_context: {
          visual: '🐰🐰🐰🐰',
          narrative: 'Los conejitos saltan felices por el prado',
          animal_sound: 'hop hop'
        }
      }
    ]
  },
  {
    quiz_id: 'quiz-lang-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📚 Lenguaje - Comprensión Lectora',
    description: 'Quiz de comprensión lectora y gramática para 6° básico',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 25,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-lang-001',
        question_order: 1,
        stem_md: '¿Cuál de estas palabras es un sustantivo?',
        type: 'multiple_choice',
        options_json: ['correr', 'rápido', 'casa', 'muy'],
        correct_answer: 'casa',
        explanation: 'Un sustantivo es una palabra que nombra personas, animales, cosas o lugares. "Casa" es un sustantivo.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-lang-002',
        question_order: 2,
        stem_md: '¿Cuál es el sinónimo de "alegre"?',
        type: 'multiple_choice',
        options_json: ['triste', 'feliz', 'enojado', 'cansado'],
        correct_answer: 'feliz',
        explanation: 'Sinónimo significa que tiene el mismo significado. "Alegre" y "feliz" significan lo mismo.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Comprender'
      },
      {
        question_id: 'q-lang-003',
        question_order: 3,
        stem_md: 'En la oración "El gato negro saltó", ¿cuál es el adjetivo?',
        type: 'multiple_choice',
        options_json: ['gato', 'negro', 'saltó', 'el'],
        correct_answer: 'negro',
        explanation: 'Un adjetivo describe o califica al sustantivo. "Negro" describe cómo es el gato.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Analizar'
      },
      {
        question_id: 'q-lang-004',
        question_order: 4,
        stem_md: '¿Cuántas sílabas tiene la palabra "mariposa"?',
        type: 'multiple_choice',
        options_json: ['2', '3', '4', '5'],
        correct_answer: '4',
        explanation: 'Ma-ri-po-sa tiene 4 sílabas. Cuenta cada golpe de voz.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Aplicar'
      },
      {
        question_id: 'q-lang-005',
        question_order: 5,
        stem_md: '¿Cuál es el antónimo de "grande"?',
        type: 'multiple_choice',
        options_json: ['enorme', 'pequeño', 'alto', 'ancho'],
        correct_answer: 'pequeño',
        explanation: 'Antónimo significa lo contrario. Lo contrario de "grande" es "pequeño".',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Comprender'
      }
    ]
  },
  {
    quiz_id: 'quiz-sci-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🔬 Ciencias - El Cuerpo Humano',
    description: 'Quiz sobre sistemas del cuerpo humano para educación básica',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 20,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-sci-001',
        question_order: 1,
        stem_md: '¿Cuál es la función principal del corazón?',
        type: 'multiple_choice',
        options_json: ['Respirar', 'Bombear sangre', 'Digerir alimentos', 'Pensar'],
        correct_answer: 'Bombear sangre',
        explanation: 'El corazón es un músculo que bombea sangre por todo el cuerpo.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-sci-002',
        question_order: 2,
        stem_md: '¿Cuántos huesos tiene aproximadamente el cuerpo humano adulto?',
        type: 'multiple_choice',
        options_json: ['150', '206', '300', '400'],
        correct_answer: '206',
        explanation: 'El cuerpo humano adulto tiene aproximadamente 206 huesos.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-sci-003',
        question_order: 3,
        stem_md: '¿Qué órgano se encarga de filtrar la sangre?',
        type: 'multiple_choice',
        options_json: ['Hígado', 'Pulmones', 'Riñones', 'Estómago'],
        correct_answer: 'Riñones',
        explanation: 'Los riñones filtran la sangre y eliminan los desechos a través de la orina.',
        points: 3,
        difficulty: 'medium',
        bloom_level: 'Comprender'
      },
      {
        question_id: 'q-sci-004',
        question_order: 4,
        stem_md: '¿Cuál es el órgano más grande del cuerpo humano?',
        type: 'multiple_choice',
        options_json: ['Cerebro', 'Hígado', 'Piel', 'Pulmones'],
        correct_answer: 'Piel',
        explanation: 'La piel es el órgano más grande del cuerpo y nos protege del exterior.',
        points: 2,
        difficulty: 'medium',
        bloom_level: 'Recordar'
      }
    ]
  },
  {
    quiz_id: 'quiz-hist-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🌍 Historia - Chile y América',
    description: 'Quiz de historia sobre Chile y América para educación básica',
    mode: 'manual',
    difficulty: 'medium',
    time_limit_minutes: 25,
    active: true,
    created_at: new Date().toISOString(),
    questions: [
      {
        question_id: 'q-hist-001',
        question_order: 1,
        stem_md: '¿En qué año se independizó Chile?',
        type: 'multiple_choice',
        options_json: ['1810', '1818', '1820', '1825'],
        correct_answer: '1818',
        explanation: 'Chile declaró su independencia el 12 de febrero de 1818.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-hist-002',
        question_order: 2,
        stem_md: '¿Quién fue el libertador de Chile?',
        type: 'multiple_choice',
        options_json: ['Simón Bolívar', 'José de San Martín', 'Bernardo O\'Higgins', 'Manuel Rodríguez'],
        correct_answer: 'Bernardo O\'Higgins',
        explanation: 'Bernardo O\'Higgins es considerado el Padre de la Patria y libertador de Chile.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-hist-003',
        question_order: 3,
        stem_md: '¿Cuál es la capital de Chile?',
        type: 'multiple_choice',
        options_json: ['Valparaíso', 'Santiago', 'Concepción', 'La Serena'],
        correct_answer: 'Santiago',
        explanation: 'Santiago es la capital y ciudad más poblada de Chile.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      },
      {
        question_id: 'q-hist-004',
        question_order: 4,
        stem_md: '¿Qué océano baña las costas de Chile?',
        type: 'multiple_choice',
        options_json: ['Atlántico', 'Índico', 'Pacífico', 'Ártico'],
        correct_answer: 'Pacífico',
        explanation: 'Chile tiene una extensa costa en el Océano Pacífico.',
        points: 2,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
      // Agregar todos los demos nuevos
    ...allDemoQuizzes,
    ...remainingQuizzes,
    ...finalQuizzes,
    // 🌟 QUIZ OA1 V2 - VERSIÓN MEJORADA ESPECÍFICA
    {
      quiz_id: 'quiz-oa1-v2',
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      author_id: 'teacher-123',
      title: '🌟 OA1 V2: Granja Contador Avanzado (1° Básico)',
      description: 'Versión mejorada con escalador Bloom, tutor adaptativo, stickers y más - MAT.1B.OA.01',
      mode: 'adaptive',
      difficulty: 'progressive',
      time_limit_minutes: 30,
      active: true,
      created_at: new Date().toISOString(),
      engine_id: 'ENG01',
      engine_name: 'Counter/Number Line V2',
      grade_level: '1B',
      farm_theme: true,
      // 🚀 CONFIGURACIONES V2
      version: '2.0',
      bloom_scaler: true,
      adaptive_tutor: true,
      sticker_collection: true,
      cooperative_mode: true,
      voice_recognition: true,
      pdf_guide: true,
      arasaac_pictograms: true,
      state_machine: true,
      questions: [
        // NIVEL 1: RECORDAR (1-5) - CORREGIDO
        {
          question_id: 'oa1-v2-recordar-1',
          question_order: 1,
          stem_md: '🐣 🐣 🐣 🐣 ¿Cuántos pollitos ves? (Cuenta en voz alta)',
          type: 'multiple_choice',
          options_json: [2, 3, 4, 5],
          correct_answer: '4',
          explanation: 'Hay 4 pollitos. ¡Pío, pío, pío, pío!',
          points: 100,
          difficulty: 'easy',
          bloom_level: 'Recordar',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'contar',
            sticker_reward: '🐣',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { count: 4, animal: '🐣', skill: 'conteo_visual_basico' }
        },
        {
          question_id: 'oa1-v2-recordar-2',
          question_order: 2,
          stem_md: '🐤 🐤 ¿Cuántos pollitos amarillos hay?',
          type: 'multiple_choice',
          options_json: [1, 2, 3, 4],
          correct_answer: '2',
          explanation: 'Hay 2 pollitos amarillos. ¡Pío, pío!',
          points: 100,
          difficulty: 'easy',
          bloom_level: 'Recordar',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'dos',
            sticker_reward: '🐤',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { count: 2, animal: '🐤', skill: 'conteo_visual_basico' }
        },
        // NIVEL 2: COMPRENDER (6-10) - MEJORADO CON EMOJIS
        {
          question_id: 'oa1-v2-comprender-1',
          question_order: 3,
          stem_md: '🐔 🐔 🐔 🐔 Si hay 4 gallinas y llega 1 más ➕🐔, ¿cuántas habrá en total?',
          type: 'multiple_choice',
          options_json: [4, 5, 6, 7],
          correct_answer: '5',
          explanation: 'Si hay 4 gallinas y llega 1 más, habrá 5 gallinas en total.',
          points: 150,
          difficulty: 'medium',
          bloom_level: 'Comprender',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'mas',
            sticker_reward: '🐔',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { count: 5, animal: '🐔', skill: 'suma_basica' }
        },
        {
          question_id: 'oa1-v2-comprender-2',
          question_order: 4,
          stem_md: '🐔 🐔 🐔 Si cada gallina pone 2 huevos y hay 3 gallinas, ¿cuántos huevos hay? 🥚🥚 🥚🥚 🥚🥚',
          type: 'multiple_choice',
          options_json: [5, 6, 7, 8],
          correct_answer: '6',
          explanation: 'Si cada gallina pone 2 huevos y hay 3 gallinas, habrá 6 huevos.',
          points: 150,
          difficulty: 'medium',
          bloom_level: 'Comprender',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'multiplicar',
            sticker_reward: '🥚',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { count: 6, animal: '🥚', skill: 'multiplicacion_basica' }
        },
        // NIVEL 3: APLICAR (11-15) - MEJORADO
        {
          question_id: 'oa1-v2-aplicar-1',
          question_order: 5,
          stem_md: '🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄🐄 Si tienes 12 vacas y se van 3 ➖🐄🐄🐄, ¿cuántas quedan?',
          type: 'multiple_choice',
          options_json: [8, 9, 10, 11],
          correct_answer: '9',
          explanation: 'Si tienes 12 vacas y se van 3, quedan 9 vacas.',
          points: 200,
          difficulty: 'hard',
          bloom_level: 'Aplicar',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'menos',
            sticker_reward: '🐄',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { count: 9, animal: '🐄', skill: 'resta_basica' }
        },
        {
          question_id: 'oa1-v2-aplicar-2',
          question_order: 6,
          stem_md: '🥕🥕🥕🥕🥕 🥕🥕🥕🥕🥕 🥕🥕🥕🥕🥕 Si agrupas de 5 en 5 y tienes 3 grupos, ¿cuántas zanahorias hay en total?',
          type: 'multiple_choice',
          options_json: [13, 14, 15, 16],
          correct_answer: '15',
          explanation: 'Si agrupas de 5 en 5 y tienes 3 grupos, hay 15 zanahorias.',
          points: 200,
          difficulty: 'hard',
          bloom_level: 'Aplicar',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'grupo',
            sticker_reward: '🌾',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { count: 15, animal: '🌾', skill: 'agrupacion' }
        },
        // NIVEL 4: ANALIZAR (16-20) - MEJORADO
        {
          question_id: 'oa1-v2-analizar-1',
          question_order: 7,
          stem_md: '🚜 Observa el patrón: 2️⃣, 4️⃣, 6️⃣, 8️⃣, ¿qué número sigue? 🤔',
          type: 'multiple_choice',
          options_json: [9, 10, 11, 12],
          correct_answer: '10',
          explanation: 'El patrón es contar de 2 en 2, así que después del 8 viene el 10.',
          points: 250,
          difficulty: 'expert',
          bloom_level: 'Analizar',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'patron',
            sticker_reward: '🚜',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { pattern: [2, 4, 6, 8], next: 10, skill: 'conteo_por_patrones' }
        },
        {
          question_id: 'oa1-v2-analizar-2',
          question_order: 8,
          stem_md: '🏠 El granjero cuenta hacia atrás: 2️⃣0️⃣ ➡️ 1️⃣8️⃣ ➡️ 1️⃣6️⃣ ➡️ ❓ ¿Qué número sigue?',
          type: 'multiple_choice',
          options_json: [13, 14, 15, 16],
          correct_answer: '14',
          explanation: 'Contando hacia atrás de 2 en 2, después del 16 viene el 14.',
          points: 250,
          difficulty: 'expert',
          bloom_level: 'Analizar',
          v2_features: {
            voice_enabled: true,
            arasaac_pictogram: 'atras',
            sticker_reward: '🏠',
            elo_adjustment: 15,
            cooperative_suitable: true
          },
          farm_context: { pattern: [20, 18, 16], next: 14, skill: 'conteo_regresivo' }
        }
      ]
    }
  ];

const mockGameSessions = [
  {
    session_id: 'game-demo-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-math-001',
    host_id: 'teacher-123',
    format: 'trivia_lightning',
    status: 'active',
    title: '🐄 Conteo en la Granja - 1° Básico',
    description: 'Demo Game 001 - Formato trivia_lightning',
    join_code: 'DEMO001',
    // 🎯 ENGINE CONFIGURATION
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    settings_json: {
      demo: true,
      max_players: 30,
      time_limit: 300,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: false,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 5,
      // 🎯 ENGINE CONFIG
      engine_config: {
        number_line_range: '0 20',
        visual_counters: true,
        progression_style: 'step_by_step',
        animation_speed: 'medium'
      },
      // 🎨 FARM THEME
      farm_theme: true,
      grade_level: '1B'
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  {
    session_id: 'game-demo-002',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-lang-001',
    host_id: 'teacher-123',
    format: 'color_match',
    status: 'waiting',
    title: 'Lenguaje - Color Match Demo',
    join_code: 'DEMO02',
    settings_json: {
      max_players: 25,
      time_limit: 25,
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: true,
      accessibility_mode: true,
      tts_enabled: true,
      total_questions: 5
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  {
    session_id: 'game-demo-003',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-sci-001',
    host_id: 'teacher-123',
    format: 'board_race',
    status: 'waiting',
    title: 'Ciencias - Board Race Demo',
    join_code: 'DEMO03',
    settings_json: {
      max_players: 20,
      time_limit: 20,
      show_correct_answers: true,
      shuffle_questions: true,
      shuffle_options: false,
      accessibility_mode: true,
      tts_enabled: false,
      total_questions: 4
    },
    created_at: new Date().toISOString(),
    participants: []
  },
  // Agregar todas las sesiones demo nuevas
  ...allDemoSessions,
  ...remainingSessions,
  ...finalSessions,
  // 🌟 SESIÓN OA1 V2 - VERSIÓN MEJORADA ESPECÍFICA
  {
    session_id: 'oa1-v2-demo',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    quiz_id: 'quiz-oa1-v2',
    host_id: 'teacher-123',
    format: 'ENG01',
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line V2',
    status: 'active',
    title: '🌟 OA1 V2: Granja Contador Avanzado (1° Básico)',
    description: 'Juego mejorado con escalador Bloom, tutor adaptativo, stickers y más - MAT.1B.OA.01',
    join_code: 'OA1V2',
    settings_json: {
      demo: true,
      public_access: true,
      max_players: 30,
      time_limit: 600, // Más tiempo para experiencia completa
      show_correct_answers: true,
      shuffle_questions: false,
      shuffle_options: false,
      accessibility_mode: true,
      tts_enabled: true,
      // 🎯 CONFIGURACIÓN OA1 V2
      engine_id: 'ENG01',
      skin: '🌟 Granja V2 Avanzada',
      oa_code: 'MAT.1B.OA.01',
      bloom_level: 'Progressivo',
      game_level: 'v2',
      max_number: 20,
      theme: 'granja_oa1_v2',
      specialized_component: 'FarmCountingGameOA1V2',
      farm_theme: true,
      grade_level: '1B',
      // 🚀 MEJORAS V2
      bloom_scaler: true,
      adaptive_tutor: true,
      sticker_collection: true,
      cooperative_mode: true,
      voice_recognition: true,
      pdf_guide: true,
      arasaac_pictograms: true,
      state_machine: true,
      version: '2.0'
    },
    created_at: new Date().toISOString(),
    participants: []
  }
];

// Mock data service functions
class MockGameDataService {
  constructor() {
    console.log('🚀 MockGameDataService constructor iniciado');
    this.quizzes = [...mockQuizzes];
    this.gameSessions = [...mockGameSessions];
    this.nextSessionId = 1000;
    this.persistenceEnabled = false;
    
    console.log(`📊 Constructor: ${this.quizzes.length} quizzes iniciales`);
    console.log(`📊 Constructor: ${this.gameSessions.length} sesiones iniciales`);
    
    // Sincronización automática al inicializar
    console.log('🔄 Ejecutando sincronización automática en constructor...');
    this.syncWithLocalDemoData();
    
    // 💾 Initialize persistence and load from database
    this.initializePersistence();
    
    console.log(`📊 Post-sync: ${this.quizzes.length} quizzes totales`);
    console.log(`📊 Post-sync: ${this.gameSessions.length} sesiones totales`);
  }

  // Quiz operations
  getQuizzes(filters = {}) {
    let filteredQuizzes = this.quizzes.filter(quiz => quiz.active);
    
    if (filters.school_id) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.school_id === filters.school_id);
    }
    
    if (filters.author_id) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.author_id === filters.author_id);
    }
    
    if (filters.limit) {
      filteredQuizzes = filteredQuizzes.slice(0, filters.limit);
    }
    
    return {
      data: { quizzes: filteredQuizzes },
      error: null
    };
  }

  getQuizById(quizId, schoolId) {
    const quiz = this.quizzes.find(q => 
      q.quiz_id === quizId && 
      q.school_id === schoolId && 
      q.active
    );
    
    if (!quiz) {
      return {
        data: null,
        error: { message: 'Quiz not found' }
      };
    }
    
    return {
      data: quiz,
      error: null
    };
  }

  // Game session operations
  createGameSession(sessionData) {
    const quiz = this.quizzes.find(q => 
      q.quiz_id === sessionData.quiz_id && 
      q.school_id === sessionData.school_id &&
      q.active
    );
    
    if (!quiz) {
      return {
        data: null,
        error: { message: 'Quiz not found or inactive' }
      };
    }
    
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newSession = {
      session_id: `game-session-${this.nextSessionId++}`,
      school_id: sessionData.school_id,
      quiz_id: sessionData.quiz_id,
      host_id: sessionData.host_id,
      format: sessionData.format,
      status: 'waiting',
      title: `${quiz.title} - Juego`,
      settings_json: {
        ...sessionData.settings,
        session_code: sessionCode,
        total_questions: quiz.questions.length
      },
      created_at: new Date().toISOString(),
      participants: []
    };
    
    this.gameSessions.push(newSession);
    
    return {
      data: {
        ...newSession,
        quiz_title: quiz.title,
        session_code: sessionCode
      },
      error: null
    };
  }

  getGameSessionById(sessionId, schoolId) {
    console.log(`\n🔍 === BÚSQUEDA DE SESIÓN ===`);
    console.log(`🔍 Buscando sesión: ${sessionId} para school: ${schoolId}`);
    console.log(`📊 Sesiones en this.gameSessions: ${this.gameSessions.length}`);
    
    // Log todas las sesiones disponibles
    this.gameSessions.forEach((s, i) => {
      console.log(`  ${i}: ${s.session_id} (${s.title})`);
    });
    
    // 🚨 FIX: First try to find the session with flexible ID matching
    let session = this.gameSessions.find(s => s.session_id === sessionId);
    console.log(`🔍 Encontrado en this.gameSessions: ${session ? 'SÍ' : 'NO'}`);
    
    // If not found and sessionId doesn't have prefix, try with prefix
    if (!session && !sessionId.startsWith('game_')) {
      console.log(`🔄 No encontrado con ID original, intentando con prefijo: game_${sessionId}`);
      session = this.gameSessions.find(s => s.session_id === `game_${sessionId}`);
      console.log(`🔍 Encontrado con prefijo: ${session ? 'SÍ' : 'NO'}`);
    }
    
    // If not found and sessionId has prefix, try without prefix
    if (!session && sessionId.startsWith('game_')) {
      console.log(`🔄 No encontrado con prefijo, intentando sin prefijo: ${sessionId.replace('game_', '')}`);
      session = this.gameSessions.find(s => s.session_id === sessionId.replace('game_', ''));
      console.log(`🔍 Encontrado sin prefijo: ${session ? 'SÍ' : 'NO'}`);
    }
    
    // Si no se encuentra en sesiones existentes, buscar en datos demo locales
    if (!session && LOCAL_DEMO_DATA && LOCAL_DEMO_DATA.games) {
      console.log(`🔍 LOCAL_DEMO_DATA existe: ${LOCAL_DEMO_DATA ? 'SÍ' : 'NO'}`);
      console.log(`🔍 LOCAL_DEMO_DATA.games existe: ${LOCAL_DEMO_DATA.games ? 'SÍ' : 'NO'}`);
      console.log(`🔍 LOCAL_DEMO_DATA.games.length: ${LOCAL_DEMO_DATA.games ? LOCAL_DEMO_DATA.games.length : 'N/A'}`);
      
      if (LOCAL_DEMO_DATA.games.length > 0) {
        console.log(`🔍 Primeros 3 juegos en LOCAL_DEMO_DATA:`);
        LOCAL_DEMO_DATA.games.slice(0, 3).forEach((g, i) => {
          console.log(`  ${i}: ${g.game_id} - ${g.title}`);
        });
      }
      
      console.log(`🔍 Buscando sessionId: ${sessionId}`);
      console.log(`🔍 Juegos disponibles:`);
      LOCAL_DEMO_DATA.games.forEach((g, i) => {
        console.log(`  ${i}: ${g.game_id}`);
      });
      
      const localDemoGame = LOCAL_DEMO_DATA.games.find(game => 
        game.game_id === sessionId
      );
      
      if (localDemoGame) {
        console.log(`✅ Encontrado en datos demo locales: ${localDemoGame.title}`);
        // Convertir a formato de sesión
        session = {
          session_id: localDemoGame.game_id,
          quiz_id: localDemoGame.game_id + '-quiz',
          school_id: localDemoGame.school_id,
          host_id: localDemoGame.host_id,
          join_code: localDemoGame.code,
          title: localDemoGame.title,
          description: localDemoGame.description,
          format: localDemoGame.format,
          status: 'active', // Cambiado a active para que funcione inmediatamente
          settings_json: {
            ...localDemoGame.settings,
            demo: true,
            max_players: localDemoGame.max_players || 30
          },
          created_at: localDemoGame.created_at,
          participants: localDemoGame.participants || [],
          questions: localDemoGame.questions || []
        };
        console.log(`✅ Sesión convertida con status: ${session.status}`);
      } else {
        console.log(`❌ NO encontrado en datos demo locales`);
      }
    }
    
    console.log(`🎯 Sesión encontrada:`, session ? `${session.session_id} (school: ${session.school_id})` : 'NO ENCONTRADA');
    
    // If not found, return error
    if (!session) {
      console.log('❌ Sesión no encontrada');
      return {
        data: null,
        error: { message: 'Game session not found' }
      };
    }
    
    // Check if it's a demo game
    const isDemoGame = session.title?.includes('Demo') || 
                      session.join_code?.startsWith('DEMO') ||
                      session.quiz_id?.includes('demo') ||
                      session.settings_json?.demo === true;
    
    console.log(`🎮 Es juego demo? ${isDemoGame}`);
    console.log(`  - Título contiene "Demo": ${session.title?.includes('Demo')}`);
    console.log(`  - Join code empieza con "DEMO": ${session.join_code?.startsWith('DEMO')}`);
    console.log(`  - Quiz ID contiene "demo": ${session.quiz_id?.includes('demo')}`);
    console.log(`  - Settings demo: ${session.settings_json?.demo}`);
    
    // For non-demo games, enforce school_id matching (only if schoolId is provided)
    if (!isDemoGame && schoolId && session.school_id !== schoolId) {
      console.log(`❌ No es demo y school_id no coincide: ${session.school_id} != ${schoolId}`);
      return {
        data: null,
        error: { message: 'Game session not found' }
      };
    }
    
    // Buscar quiz asociado
    let quiz = this.quizzes.find(q => q.quiz_id === session.quiz_id);
    
    // Si no se encuentra el quiz y es un demo local, crear un quiz básico
    if (!quiz && session.settings_json?.demo) {
      console.log(`📝 Creando quiz demo para sesión: ${session.session_id}`);
      quiz = {
        quiz_id: session.quiz_id,
        title: session.title || 'Demo Quiz',
        description: session.description || 'Demo quiz automatically generated',
        questions: session.questions || [
          {
            question_id: `q1-${session.session_id}`,
            question_order: 1,
            stem_md: '¿Cuál es 2 + 2?',
            type: 'multiple_choice',
            options_json: ['3', '4', '5', '6'],
            correct_answer: '4',
            explanation: '2 + 2 = 4',
            points: 10,
            difficulty: 'easy',
            bloom_level: 'Recordar'
          },
          {
            question_id: `q2-${session.session_id}`,
            question_order: 2,
            stem_md: '¿Cuánto es 5 × 3?',
            type: 'multiple_choice',
            options_json: ['12', '15', '18', '20'],
            correct_answer: '15',
            explanation: '5 × 3 = 15',
            points: 10,
            difficulty: 'medium',
            bloom_level: 'Aplicar'
          }
        ]
      };
    }
    
    console.log(`📝 Quiz encontrado:`, quiz ? quiz.title : 'NO ENCONTRADO');
    
    return {
      data: {
        ...session,
        quizzes: quiz,
        hosts: {
          user_id: session.host_id,
          first_name: 'Profesor',
          last_name: 'Demo'
        },
        game_participants: session.participants || []
      },
      error: null
    };
  }

  getGameSessions(filters = {}) {
    // Incluir datos demo locales automáticamente
    let allSessions = [...this.gameSessions];
    
    // Agregar los juegos demo locales si están disponibles
    if (LOCAL_DEMO_DATA && LOCAL_DEMO_DATA.games && LOCAL_DEMO_DATA.games.length > 0) {
      // Convertir juegos demo locales a formato de sesión
      const localDemoSessions = LOCAL_DEMO_DATA.games.map(game => ({
        session_id: game.game_id,
        quiz_id: game.game_id + '-quiz',
        school_id: game.school_id,
        host_id: game.host_id,
        join_code: game.code,
        title: game.title,
        description: game.description,
        format: game.format,
        status: game.status || 'waiting',
        settings_json: {
          ...game.settings,
          demo: true,
          max_players: game.max_players || 30
        },
        created_at: game.created_at,
        participants: game.participants || [],
        questions: game.questions || []
      }));
      
      // Agregar sin duplicar
      localDemoSessions.forEach(demoSession => {
        const exists = allSessions.find(s => s.session_id === demoSession.session_id);
        if (!exists) {
          allSessions.push(demoSession);
        }
      });
    }
    
    let filteredSessions = allSessions;
    
    if (filters.school_id) {
      // Para demos, mostrar siempre independientemente del school_id
      filteredSessions = filteredSessions.filter(s => 
        s.school_id === filters.school_id || 
        s.settings_json?.demo === true ||
        s.join_code?.startsWith('DEMO')
      );
    }
    
    if (filters.host_id) {
      filteredSessions = filteredSessions.filter(s => s.host_id === filters.host_id);
    }
    
    if (filters.status) {
      filteredSessions = filteredSessions.filter(s => s.status === filters.status);
    }
    
    return {
      data: filteredSessions,
      error: null
    };
  }

  getDemoSession(code) {
    // Buscar en las sesiones existentes primero
    let session = this.gameSessions.find(session => 
      session.join_code === code.toUpperCase()
    );
    
    // Si no se encuentra, buscar en los datos demo locales
    if (!session && LOCAL_DEMO_DATA && LOCAL_DEMO_DATA.games) {
      const localDemoGame = LOCAL_DEMO_DATA.games.find(game => 
        game.code === code.toUpperCase()
      );
      
      if (localDemoGame) {
        // Convertir a formato de sesión
        session = {
          session_id: localDemoGame.game_id,
          quiz_id: localDemoGame.game_id + '-quiz',
          school_id: localDemoGame.school_id,
          host_id: localDemoGame.host_id,
          join_code: localDemoGame.code,
          title: localDemoGame.title,
          description: localDemoGame.description,
          format: localDemoGame.format,
          status: localDemoGame.status || 'waiting',
          settings_json: {
            ...localDemoGame.settings,
            demo: true,
            max_players: localDemoGame.max_players || 30
          },
          created_at: localDemoGame.created_at,
          participants: localDemoGame.participants || [],
          questions: localDemoGame.questions || []
        };
      }
    }
    
    return session;
  }

  startGameSession(sessionId, schoolId, hostId) {
    console.log(`🚀 Starting game session ${sessionId} for school ${schoolId} by host ${hostId}`);
    
    // 🚨 FIX: Find session - handle with/without "game_" prefix for gamified evaluations
    let sessionIndex = this.gameSessions.findIndex(s => s.session_id === sessionId);
    
    // If not found and sessionId doesn't have prefix, try with prefix
    if (sessionIndex === -1 && !sessionId.startsWith('game_')) {
      console.log(`🔄 No encontrado con ID original, intentando con prefijo: game_${sessionId}`);
      sessionIndex = this.gameSessions.findIndex(s => s.session_id === `game_${sessionId}`);
    }
    
    // If not found and sessionId has prefix, try without prefix
    if (sessionIndex === -1 && sessionId.startsWith('game_')) {
      console.log(`🔄 No encontrado con prefijo, intentando sin prefijo: ${sessionId.replace('game_', '')}`);
      sessionIndex = this.gameSessions.findIndex(s => s.session_id === sessionId.replace('game_', ''));
    }
    
    // If still not found, try with school_id filter for regular games
    if (sessionIndex === -1) {
      sessionIndex = this.gameSessions.findIndex(s => 
        s.session_id === sessionId && 
        s.school_id === schoolId
      );
    }
    
    if (sessionIndex === -1) {
      console.log(`❌ Session ${sessionId} not found in ${this.gameSessions.length} sessions`);
      this.gameSessions.forEach((s, i) => {
        console.log(`  ${i}: ${s.session_id} (school: ${s.school_id})`);
      });
      return {
        data: null,
        error: { message: 'Game session not found' }
      };
    }
    
    const session = this.gameSessions[sessionIndex];
    console.log(`✅ Found session: ${session.session_id} with status: ${session.status}`);
    
    // Skip host validation for demo games and gamified evaluations
    const isDemoGame = session.settings_json?.demo === true || 
                      session.title?.includes('Demo') ||
                      session.quiz_id?.includes('mock-quiz-');
    
    const isGamifiedEvaluation = session.session_id?.startsWith('game_') && 
                                !session.session_id?.includes('demo');
    
    console.log(`🎮 Game type - Demo: ${isDemoGame}, Gamified: ${isGamifiedEvaluation}`);
    
    if (!isDemoGame && !isGamifiedEvaluation && session.host_id !== hostId) {
      console.log(`❌ Host validation failed: ${session.host_id} !== ${hostId}`);
      return {
        data: null,
        error: { message: 'Only the host can start the game' }
      };
    }
    
    // Allow starting games that are in waiting status, or change status to waiting if needed
    if (session.status !== 'waiting' && session.status !== 'active') {
      console.log(`⚠️ Changing status from ${session.status} to waiting for gamified evaluation`);
      session.status = 'waiting';
    }
    
    console.log(`🚀 Starting game session ${sessionId}...`);
    this.gameSessions[sessionIndex] = {
      ...session,
      status: 'active',
      started_at: new Date().toISOString()
    };
    
    console.log(`✅ Game session ${sessionId} started successfully`);
    return {
      data: this.gameSessions[sessionIndex],
      error: null
    };
  }

  joinGameSession(sessionCode, userId) {
    const sessionIndex = this.gameSessions.findIndex(s => 
      s.join_code === sessionCode.toUpperCase()
    );
    
    if (sessionIndex === -1) {
      return {
        data: null,
        error: { message: 'Game session not found with that code' }
      };
    }
    
    const session = this.gameSessions[sessionIndex];
    
    if (session.status !== 'waiting' && session.status !== 'active') {
      return {
        data: null,
        error: { message: 'Game session is not accepting players' }
      };
    }
    
    // Check if user already joined
    const existingParticipant = session.participants.find(p => p.user_id === userId);
    if (existingParticipant) {
      return {
        data: session,
        error: null
      };
    }
    
    // Add participant
    session.participants.push({
      user_id: userId,
      joined_at: new Date().toISOString(),
      score: 0,
      accuracy: 0,
      time_ms: 0
    });
    
    return {
      data: session,
      error: null
    };
  }

  // Utility methods
  reset() {
    this.quizzes = [...mockQuizzes];
    this.gameSessions = [...mockGameSessions];
    this.nextSessionId = 1000;
  }

  // Add method to add new game sessions (for gamified evaluations)
  addGameSession(sessionData) {
    console.log(`💾 Adding new game session: ${sessionData.session_id}`);
    
    // Ensure the session has required fields
    const completeSession = {
      ...sessionData,
      participants: sessionData.participants || [],
      created_at: sessionData.created_at || new Date().toISOString()
    };
    
    // Check if session already exists
    const existingIndex = this.gameSessions.findIndex(s => s.session_id === sessionData.session_id);
    
    if (existingIndex >= 0) {
      // Update existing session
      this.gameSessions[existingIndex] = completeSession;
      console.log(`📝 Updated existing session: ${sessionData.session_id}`);
    } else {
      // Add new session
      this.gameSessions.push(completeSession);
      console.log(`✅ Added new session: ${sessionData.session_id}`);
    }
    
    // 💾 Auto-save to database if persistence is enabled
    if (this.persistenceEnabled) {
      this.autoSaveSession(completeSession);
    }
    
    // Also add associated quiz if provided
    if (sessionData.quizzes) {
      const quizData = {
        quiz_id: sessionData.quiz_id,
        school_id: sessionData.school_id,
        author_id: sessionData.host_id,
        title: sessionData.quizzes.title,
        description: sessionData.quizzes.description,
        mode: 'ai',
        active: true,
        questions: sessionData.quizzes.questions || [],
        created_at: sessionData.created_at || new Date().toISOString()
      };
      
      const existingQuizIndex = this.quizzes.findIndex(q => q.quiz_id === sessionData.quiz_id);
      
      if (existingQuizIndex >= 0) {
        this.quizzes[existingQuizIndex] = quizData;
        console.log(`📝 Updated associated quiz: ${sessionData.quiz_id}`);
      } else {
        this.quizzes.push(quizData);
        console.log(`✅ Added associated quiz: ${sessionData.quiz_id}`);
      }
    }
    
    console.log(`📊 Total sessions now: ${this.gameSessions.length}`);
    console.log(`📊 Total quizzes now: ${this.quizzes.length}`);
    
    return completeSession;
  }

  logStatus() {
    console.log('📊 MockGameDataService Status:');
    console.log(`   - Quizzes: ${this.quizzes.length}`);
    console.log(`   - Game Sessions: ${this.gameSessions.length}`);
    console.log(`   - Demo Sessions: ${this.gameSessions.filter(s => s.title?.includes('Demo') || s.join_code?.startsWith('DEMO')).length}`);
  }

  // Sincronizar con datos demo locales después de setupLocalDevelopment()
  syncWithLocalDemoData() {
    if (LOCAL_DEMO_DATA && LOCAL_DEMO_DATA.games && LOCAL_DEMO_DATA.games.length > 0) {
      console.log('🔄 Sincronizando con datos demo locales...');
      
      // Limpiar sesiones demo existentes para evitar duplicados
      this.gameSessions = this.gameSessions.filter(s => 
        !s.title?.includes('Demo') && 
        !s.join_code?.startsWith('DEMO') &&
        !s.session_id?.includes('game-demo-')
      );
      
      // Limpiar quizzes demo existentes
      this.quizzes = this.quizzes.filter(q => 
        !q.quiz_id?.includes('game-demo-') && 
        !q.title?.includes('Demo')
      );
      
      // Agregar juegos demo locales al MockGameDataService
      LOCAL_DEMO_DATA.games.forEach(game => {
        const session = {
          session_id: game.game_id,
          quiz_id: game.game_id + '-quiz',
          school_id: game.school_id,
          host_id: game.host_id,
          join_code: game.code,
          title: game.title,
          description: game.description,
          format: game.format,
          status: game.status || 'active',
          settings_json: {
            ...game.settings,
            demo: true,
            max_players: game.max_players || 30
          },
          created_at: game.created_at,
          participants: game.participants || []
        };
        
        // Crear quiz asociado
        const quiz = {
          quiz_id: game.game_id + '-quiz',
          title: game.title,
          description: game.description,
          school_id: game.school_id,
          author_id: game.host_id,
          active: true,
          created_at: game.created_at,
          questions: game.questions && game.questions.length > 0 ? 
            game.questions.map((q, index) => ({
              question_id: q.question_id || `q${index + 1}-${game.game_id}`,
              question_order: index + 1,
              stem_md: q.text || q.stem_md || `Pregunta ${index + 1}`,
              type: q.type || 'multiple_choice',
              options_json: q.options || ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
              correct_answer: q.correct_answer || 'Opción A',
              explanation: q.explanation || 'Explicación de la respuesta correcta',
              points: q.points || 10,
              difficulty: q.difficulty || 'medium',
              bloom_level: q.bloom_level || 'Recordar'
            })) : [
              {
                question_id: `q1-${game.game_id}`,
                question_order: 1,
                stem_md: '¿Cuál es 2 + 2?',
                type: 'multiple_choice',
                options_json: ['3', '4', '5', '6'],
                correct_answer: '4',
                explanation: '2 + 2 = 4',
                points: 10,
                difficulty: 'easy',
                bloom_level: 'Recordar'
              },
              {
                question_id: `q2-${game.game_id}`,
                question_order: 2,
                stem_md: '¿Cuánto es 5 × 3?',
                type: 'multiple_choice',
                options_json: ['12', '15', '18', '20'],
                correct_answer: '15',
                explanation: '5 × 3 = 15',
                points: 10,
                difficulty: 'medium',
                bloom_level: 'Aplicar'
              }
            ]
        };
        
        this.gameSessions.push(session);
        this.quizzes.push(quiz);
      });
      
      console.log(`✅ Sincronización completada:`);
      console.log(`   - ${LOCAL_DEMO_DATA.games.length} juegos demo locales agregados`);
      console.log(`   - Total sesiones: ${this.gameSessions.length}`);
      console.log(`   - Total quizzes: ${this.quizzes.length}`);
      console.log(`   - Demo sessions: ${this.gameSessions.filter(s => s.settings_json?.demo).length}`);
    } else {
      console.log('❌ No hay datos demo locales para sincronizar');
    }
  }

  // 💾 PERSISTENCE TEMPORARILY DISABLED FOR TESTING
  async initializePersistence() {
    console.log('🔧 SKIPPING persistence initialization - using mock data only');
    this.persistenceEnabled = false;
    console.log(`📊 Total sessions (mock only): ${this.gameSessions.length}`);
  }

  // 💾 Auto-save session to database (async, don't block)
  async autoSaveSession(session) {
    try {
      const { gameSessionPersistence } = require('./gameSessionPersistence');
      await gameSessionPersistence.saveGameSession(session);
    } catch (error) {
      console.error('💾 Auto-save failed for session:', session.session_id, error);
      // Don't throw - this shouldn't break the main flow
    }
  }
}

// Singleton instance
const mockGameData = new MockGameDataService();

module.exports = {
  mockGameData,
  MockGameDataService
};
