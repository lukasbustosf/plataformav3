const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Configuración para desarrollo local
const LOCAL_CONFIG = {
  development: true,
  mockDatabase: true,
  autoLoadDemos: true,
  gameFormats: [
    'trivia_lightning', 'color_match', 'memory_flip', 'picture_bingo',
    'drag_drop_sorting', 'number_line_race', 'word_builder', 'word_search',
    'hangman_visual', 'escape_room_mini', 'story_path', 'board_race',
    'crossword', 'word_search_duel', 'timed_equation_duel', 'mystery_box_reveal',
    'debate_cards', 'case_study_sprint', 'simulation_tycoon', 'coding_puzzle',
    'data_lab', 'timeline_builder', 'argument_map', 'advanced_escape_room'
  ]
};

// Datos demo en memoria para desarrollo
const LOCAL_DEMO_DATA = {
  school: {
    school_id: '550e8400-e29b-41d4-a716-446655440001',
    school_name: 'Colegio Demo EDU21',
    school_code: 'DEMO001',
    active: true
  },
  users: [
    {
      user_id: '550e8400-e29b-41d4-a716-446655440002',
      school_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'admin@demo.edu21.cl',
      password: 'demo123',
      first_name: 'Admin',
      last_name: 'Demo',
      role: 'ADMIN_ESCOLAR',
      active: true
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440003',
      school_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'teacher@demo.edu21.cl',
      password: 'demo123',
      first_name: 'Profesor',
      last_name: 'Demo',
      role: 'TEACHER',
      active: true
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440004',
      school_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'estudiante1@demo.edu21.cl',
      password: 'demo123',
      first_name: 'Ana',
      last_name: 'Estudiante',
      role: 'STUDENT',
      active: true
    }
  ],
  games: []
};

// Crear todos los 24 juegos demo automáticamente
function generateDemoGames() {
  const games = [];
  const formats = LOCAL_CONFIG.gameFormats;
  
  for (let i = 0; i < 24; i++) {
    const gameNumber = String(i + 1).padStart(3, '0');
    const format = formats[i % formats.length];
    
    games.push({
      game_id: `game-demo-${gameNumber.toLowerCase()}`,
      code: `DEMO${gameNumber}`,
      title: `Demo Game ${gameNumber}`,
      description: `Juego demo ${gameNumber} formato ${format}`,
      format: format,
      host_id: '550e8400-e29b-41d4-a716-446655440003', // teacher
      school_id: '550e8400-e29b-41d4-a716-446655440001',
      status: 'active',
      max_players: 30,
      created_at: new Date().toISOString(),
      settings: {
        subject: i % 2 === 0 ? 'MAT' : 'LEN',
        grade: '5B',
        difficulty: 'medium',
        time_limit: 300,
        auto_advance: true
      },
      questions: generateQuestionsForFormat(format, gameNumber)
    });
  }
  
  LOCAL_DEMO_DATA.games = games;
  return games;
}

function generateQuestionsForFormat(format, gameNumber) {
  const baseQuestions = [
    {
      question_id: `q1-demo-${gameNumber}`,
      text: `Pregunta 1 del Demo ${gameNumber}`,
      type: 'multiple_choice',
      options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      correct_answer: 'Opción A',
      points: 10,
      explanation: 'Esta es la respuesta correcta porque...'
    },
    {
      question_id: `q2-demo-${gameNumber}`,
      text: `Pregunta 2 del Demo ${gameNumber}`,
      type: 'multiple_choice',
      options: ['Respuesta 1', 'Respuesta 2', 'Respuesta 3', 'Respuesta 4'],
      correct_answer: 'Respuesta 2',
      points: 10,
      explanation: 'La opción 2 es correcta debido a...'
    }
  ];
  
  return baseQuestions;
}

// Configurar datos automáticamente
function setupLocalDevelopment() {
  try {
    logger.info('🚀 Configurando desarrollo local automático...');
    
    // Generar juegos demo
    const games = generateDemoGames();
    logger.info(`✅ ${games.length} juegos demo generados automáticamente`);
    
    // DEBUG: Verificar que los juegos se crearon correctamente
    console.log('🔍 DEBUG: Verificando juegos generados:');
    console.log(`   LOCAL_DEMO_DATA.games.length: ${LOCAL_DEMO_DATA.games.length}`);
    if (LOCAL_DEMO_DATA.games.length > 0) {
      console.log(`   Primer juego: ${LOCAL_DEMO_DATA.games[0].game_id} - ${LOCAL_DEMO_DATA.games[0].title}`);
      console.log(`   Último juego: ${LOCAL_DEMO_DATA.games[LOCAL_DEMO_DATA.games.length - 1].game_id}`);
    }
    
    // Crear directorio de uploads si no existe
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    logger.info('✅ Desarrollo local configurado exitosamente');
    logger.info(`✅ Datos demo cargados: ${LOCAL_DEMO_DATA.users.length} usuarios, ${LOCAL_DEMO_DATA.games.length} juegos`);
    
    return LOCAL_DEMO_DATA;
    
  } catch (error) {
    logger.error('❌ Error configurando desarrollo local:', error);
    return null;
  }
}

// Exportar funciones y datos
module.exports = {
  LOCAL_CONFIG,
  LOCAL_DEMO_DATA,
  setupLocalDevelopment,
  generateDemoGames,
  
  // Mock functions para reemplazar llamadas a Supabase
  mockSupabaseCall: (table, operation, data) => {
    logger.info(`Mock DB: ${operation} on ${table}`, data ? Object.keys(data) : '');
    
    switch (table) {
      case 'game_sessions':
        if (operation === 'select') {
          return { data: LOCAL_DEMO_DATA.games, error: null };
        }
        break;
      case 'users':
        if (operation === 'select') {
          return { data: LOCAL_DEMO_DATA.users, error: null };
        }
        break;
      default:
        return { data: [], error: null };
    }
  }
}; 
