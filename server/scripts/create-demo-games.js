const { supabaseAdmin } = require('../database/supabase');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { getQuestionsForFormat } = require('./demo-questions-data');

/**
 * Creates comprehensive demo games for all 24 game formats
 * Each game format gets optimized quiz data and demo game sessions
 */

const GAME_FORMATS = [
  // Basic Games (G-01 to G-09)
  { id: 'trivia_lightning', name: 'Trivia Lightning', questionType: 'rapid_mcq' },
  { id: 'color_match', name: 'Color Match', questionType: 'color_visual' },
  { id: 'memory_flip', name: 'Memory Flip', questionType: 'pair_matching' },
  { id: 'picture_bingo', name: 'Picture Bingo', questionType: 'image_recognition' },
  { id: 'drag_drop_sorting', name: 'Drag & Drop Sorting', questionType: 'classification' },
  { id: 'number_line_race', name: 'Número-Línea Race', questionType: 'math_operations' },
  { id: 'word_builder', name: 'Word Builder', questionType: 'spelling_construction' },
  { id: 'word_search', name: 'Sopa de Letras', questionType: 'vocabulary_words' },
  { id: 'hangman_visual', name: 'Hangman Visual', questionType: 'word_guessing' },
  
  // Advanced Games (G-10 to G-16)
  { id: 'escape_room_mini', name: 'Escape Room Mini', questionType: 'sequential_puzzles' },
  { id: 'story_path', name: 'Story Path', questionType: 'narrative_choices' },
  { id: 'board_race', name: 'Board Race', questionType: 'general_knowledge' },
  { id: 'crossword', name: 'Crossword', questionType: 'definition_clues' },
  { id: 'word_search_duel', name: 'Word Search Duel', questionType: 'competitive_vocab' },
  { id: 'timed_equation_duel', name: 'Timed Equation Duel', questionType: 'math_speed' },
  { id: 'mystery_box_reveal', name: 'Mystery Box Reveal', questionType: 'progressive_hints' },
  
  // Critical Thinking (G-17 to G-24)
  { id: 'debate_cards', name: 'Debate Cards', questionType: 'argument_positions' },
  { id: 'case_study_sprint', name: 'Case Study Sprint', questionType: 'scenario_analysis' },
  { id: 'simulation_tycoon', name: 'Simulation Tycoon', questionType: 'decision_making' },
  { id: 'coding_puzzle', name: 'Coding Puzzle', questionType: 'programming_logic' },
  { id: 'data_lab', name: 'Data Lab', questionType: 'data_interpretation' },
  { id: 'timeline_builder', name: 'Timeline Builder', questionType: 'chronological_sequence' },
  { id: 'argument_map', name: 'Argument Map', questionType: 'logical_relationships' },
  { id: 'advanced_escape_room', name: 'Advanced Escape Room', questionType: 'complex_multi_step' }
];

async function createDemoGames() {
  try {
    logger.info('🎮 Creating comprehensive demo games for all 24 formats...');
    
    // Check if we have a real database
    if (!supabaseAdmin) {
      logger.info('⚠️ Running in mock mode - demo games will be created in memory only');
      // In mock mode, we'll use the school_id that frontend expects
      const schoolId = '550e8400-e29b-41d4-a716-446655440000';
      const teacherId = 'teacher-123';
      
      // Create demo games in mock mode
      for (const format of GAME_FORMATS) {
        await createFormatDemoMock(schoolId, teacherId, format);
      }
      
      logger.info('✅ All 24 demo games created successfully in mock mode!');
      logger.info('🚀 In production, access them at: http://localhost:3000/teacher/demo-games');
      return;
    }
    
    // Get demo school and teacher
    const { data: school } = await supabaseAdmin
      .from('schools')
      .select('school_id')
      .eq('school_code', 'DEMO001')
      .single();
      
    const { data: teacher } = await supabaseAdmin
      .from('users')
      .select('user_id')
      .eq('email', 'teacher@demo.edu21.cl')
      .single();
      
    if (!school || !teacher) {
      throw new Error('Demo school or teacher not found. Run demo-data.js first.');
    }
    
    const schoolId = school.school_id;
    const teacherId = teacher.user_id;
    
    // Create demo quizzes and game sessions for each format
    for (const format of GAME_FORMATS) {
      await createFormatDemo(schoolId, teacherId, format);
    }
    
    logger.info('✅ All 24 demo games created successfully!');
    logger.info('🚀 Access them at: http://localhost:3000/teacher/games');
    
  } catch (error) {
    logger.error('❌ Error creating demo games:', error);
    throw error;
  }
}

async function createFormatDemo(schoolId, teacherId, format) {
  try {
    logger.info(`Creating demo for ${format.name}...`);
    
    // Create quiz optimized for this format
    const quiz = await createOptimizedQuiz(schoolId, teacherId, format);
    
    // Create game session
    const gameSession = await createGameSession(schoolId, teacherId, quiz.quiz_id, format);
    
    logger.info(`✅ Created ${format.name} - Quiz: ${quiz.quiz_id}, Game: ${gameSession.session_id}`);
    
  } catch (error) {
    logger.error(`❌ Error creating demo for ${format.name}:`, error);
  }
}

async function createOptimizedQuiz(schoolId, teacherId, format) {
  const quizId = uuidv4();
  
  // Create quiz
  const { data: quiz, error: quizError } = await supabaseAdmin
    .from('quizzes')
    .insert({
      quiz_id: quizId,
      school_id: schoolId,
      author_id: teacherId,
      title: `🎮 Demo: ${format.name}`,
      description: `Quiz optimizado para el formato de juego ${format.name}`,
      mode: 'manual',
      difficulty: getDifficultyForFormat(format.id),
      time_limit_minutes: 20,
      metadata_json: {
        demo: true,
        format: format.id,
        optimized_for: format.questionType
      }
    })
    .select()
    .single();
    
  if (quizError) throw quizError;
  
  // Create questions optimized for this format
  const questions = getQuestionsForFormat(format);
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    await supabaseAdmin
      .from('questions')
      .insert({
        question_id: uuidv4(),
        quiz_id: quizId,
        question_order: i + 1,
        stem_md: question.stem,
        type: question.type,
        options_json: question.options,
        correct_answer: question.correct,
        explanation: question.explanation,
        points: question.points || 1,
        difficulty: question.difficulty || 'medium',
        bloom_level: question.bloom || 'Aplicar'
      });
  }
  
  return quiz;
}

async function createGameSession(schoolId, teacherId, quizId, format) {
  const { data: gameSession, error } = await supabaseAdmin
    .from('game_sessions')
    .insert({
      session_id: uuidv4(),
      school_id: schoolId,
      quiz_id: quizId,
      host_id: teacherId,
      format: format.id,
      title: `🎮 Demo: ${format.name}`,
      max_participants: getMaxParticipants(format.id),
      settings_json: getOptimalSettings(format.id),
      game_mode: 'practice',
      time_per_question: getTimePerQuestion(format.id),
      show_correct_answers: true,
      randomize_questions: false,
      accessibility_enabled: true,
      tts_enabled: true,
      status: 'waiting'
    })
    .select()
    .single();
    
  if (error) throw error;
  return gameSession;
}

function getDifficultyForFormat(formatId) {
  const difficultyMap = {
    'trivia_lightning': 'easy',
    'color_match': 'easy',
    'memory_flip': 'medium',
    'picture_bingo': 'easy',
    'drag_drop_sorting': 'medium',
    'number_line_race': 'medium',
    'word_builder': 'medium',
    'word_search': 'medium',
    'hangman_visual': 'medium',
    'escape_room_mini': 'hard',
    'story_path': 'medium',
    'board_race': 'medium',
    'crossword': 'hard',
    'word_search_duel': 'hard',
    'timed_equation_duel': 'hard',
    'mystery_box_reveal': 'medium',
    'debate_cards': 'hard',
    'case_study_sprint': 'hard',
    'simulation_tycoon': 'hard',
    'coding_puzzle': 'hard',
    'data_lab': 'hard',
    'timeline_builder': 'medium',
    'argument_map': 'hard',
    'advanced_escape_room': 'hard'
  };
  return difficultyMap[formatId] || 'medium';
}

function getMaxParticipants(formatId) {
  const participantMap = {
    'trivia_lightning': 30,
    'color_match': 25,
    'memory_flip': 20,
    'picture_bingo': 35,
    'drag_drop_sorting': 20,
    'number_line_race': 25,
    'word_builder': 20,
    'word_search': 25,
    'hangman_visual': 15,
    'escape_room_mini': 10,
    'story_path': 20,
    'board_race': 30,
    'crossword': 15,
    'word_search_duel': 20,
    'timed_equation_duel': 25,
    'mystery_box_reveal': 20,
    'debate_cards': 15,
    'case_study_sprint': 12,
    'simulation_tycoon': 8,
    'coding_puzzle': 15,
    'data_lab': 10,
    'timeline_builder': 20,
    'argument_map': 12,
    'advanced_escape_room': 6
  };
  return participantMap[formatId] || 20;
}

function getTimePerQuestion(formatId) {
  const timeMap = {
    'trivia_lightning': 15,
    'color_match': 10,
    'memory_flip': 25,
    'picture_bingo': 30,
    'drag_drop_sorting': 30,
    'number_line_race': 20,
    'word_builder': 25,
    'word_search': 45,
    'hangman_visual': 30,
    'escape_room_mini': 60,
    'story_path': 45,
    'board_race': 25,
    'crossword': 60,
    'word_search_duel': 30,
    'timed_equation_duel': 15,
    'mystery_box_reveal': 20,
    'debate_cards': 90,
    'case_study_sprint': 120,
    'simulation_tycoon': 180,
    'coding_puzzle': 120,
    'data_lab': 90,
    'timeline_builder': 60,
    'argument_map': 90,
    'advanced_escape_room': 300
  };
  return timeMap[formatId] || 30;
}

function getOptimalSettings(formatId) {
  return {
    demo: true,
    accessibility_mode: true,
    tts_enabled: true,
    high_contrast_mode: false,
    large_text_mode: false,
    show_hints: true,
    allow_skip: false,
    format_specific: getFormatSpecificSettings(formatId)
  };
}

function getFormatSpecificSettings(formatId) {
  const settings = {
    'trivia_lightning': { show_timer: true, bonus_points: true },
    'color_match': { color_blind_friendly: true },
    'memory_flip': { card_flip_duration: 1000 },
    'picture_bingo': { grid_size: '3x3' },
    'drag_drop_sorting': { snap_to_grid: true },
    'number_line_race': { show_number_line: true },
    'word_builder': { letter_bank_shuffle: false },
    'word_search': { highlight_found_words: true },
    'hangman_visual': { max_wrong_guesses: 6 },
    'escape_room_mini': { hints_available: 3 },
    'story_path': { save_progress: true },
    'board_race': { show_dice_animation: true },
    'crossword': { show_grid_numbers: true },
    'word_search_duel': { team_mode: true },
    'timed_equation_duel': { show_equation_builder: true },
    'mystery_box_reveal': { reveal_percentage: 20 },
    'debate_cards': { card_selection_time: 30 },
    'case_study_sprint': { case_study_length: 'medium' },
    'simulation_tycoon': { starting_resources: 1000 },
    'coding_puzzle': { syntax_highlighting: true },
    'data_lab': { chart_types: ['bar', 'line', 'pie'] },
    'timeline_builder': { snap_to_dates: true },
    'argument_map': { node_connection_mode: 'drag' },
    'advanced_escape_room': { room_count: 5, puzzle_types: ['logic', 'math', 'pattern', 'word', 'visual'] }
  };
  return settings[formatId] || {};
}

async function createFormatDemoMock(schoolId, teacherId, format) {
  try {
    logger.info(`Creating mock demo for ${format.name}...`);
    
    // Import mock service
    const { mockGameData } = require('../services/mockGameData');
    
    // Create quiz data for mock service
    const quizData = {
      quiz_id: `mock-quiz-${format.id}`,
      school_id: schoolId,
      author_id: teacherId,
      title: `🎮 Demo: ${format.name}`,
      description: `Quiz optimizado para el formato de juego ${format.name}`,
      mode: 'manual',
      difficulty: getDifficultyForFormat(format.id),
      time_limit_minutes: 20,
      active: true,
      created_at: new Date().toISOString(),
      questions: getQuestionsForFormat(format).map((q, i) => ({
        question_id: `mock-q-${format.id}-${i + 1}`,
        question_order: i + 1,
        stem_md: q.stem,
        type: q.type,
        options_json: q.options,
        correct_answer: q.correct,
        explanation: q.explanation,
        points: q.points || 1,
        difficulty: q.difficulty || 'medium',
        bloom_level: q.bloom || 'Aplicar'
      }))
    };
    
    // Add quiz to mock service
    mockGameData.quizzes.push(quizData);
    
    // Create game session using mock service
    const gameResult = mockGameData.createGameSession({
      quiz_id: quizData.quiz_id,
      school_id: schoolId,
      host_id: teacherId,
      format: format.id,
      settings: {
        ...getOptimalSettings(format.id),
        demo: true,
        max_players: getMaxParticipants(format.id),
        time_limit: getTimePerQuestion(format.id)
      }
    });
    
    if (gameResult.error) {
      throw new Error(gameResult.error.message);
    }
    
    // Update the game session title to match demo format  
    const sessionIndex = mockGameData.gameSessions.findIndex(s => s.session_id === gameResult.data.session_id);
    if (sessionIndex !== -1) {
      const demoNumber = String(mockGameData.gameSessions.length).padStart(2, '0');
      mockGameData.gameSessions[sessionIndex].title = `🎮 Demo: ${format.name}`;
      mockGameData.gameSessions[sessionIndex].format = format.id;
      mockGameData.gameSessions[sessionIndex].join_code = `DM${demoNumber}`;
      mockGameData.gameSessions[sessionIndex].settings_json = {
        ...mockGameData.gameSessions[sessionIndex].settings_json,
        demo: true,
        session_code: `DM${demoNumber}`
      };
    }
    
    logger.info(`✅ Mock created ${format.name} - Quiz: ${quizData.quiz_id}, Game: ${gameResult.data.session_id}`);
    
  } catch (error) {
    logger.error(`❌ Error creating mock demo for ${format.name}:`, error);
  }
}

// Export function to be called from other scripts
if (require.main === module) {
  createDemoGames()
    .then(() => {
      logger.info('🎮 Demo games creation completed!');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Demo games creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createDemoGames }; 
