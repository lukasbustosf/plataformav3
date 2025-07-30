const express = require('express');
const Joi = require('joi');
const { supabase } = require('../database/supabase');
const { requireRole } = require('../middleware/auth');
const { gameRateLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const { mockGameData } = require('../services/mockGameData');
const { transformGameContentWithSkin } = require('../services/dynamicSkinContentTransformer');

const router = express.Router();

// Educational engines available - Focus on 6 core pedagogical engines
const EDUCATIONAL_ENGINES = [
  'ENG01', // Counter/Number Line - Math counting and number operations
  'ENG02', // Drag-Drop Numbers - Interactive math manipulation
  'ENG05', // Text Recognition - Reading and letter recognition
  'ENG06', // Letter-Sound Matching - Phonetics and pronunciation
  'ENG07', // Reading Fluency - Comprehension and fluency tracking
  'ENG09'  // Life Cycle Simulation - Science processes and ecosystems
];

// Validation schemas - ENGINE-FOCUSED
const gameCreateSchema = Joi.object({
  quiz_id: Joi.string().uuid().required(),
  engine_id: Joi.string().valid(...EDUCATIONAL_ENGINES).required(), // Engine IS the format
  settings: Joi.object({
    max_players: Joi.number().integer().min(1).max(100).default(30),
    time_limit: Joi.number().integer().min(30).max(3600).default(300),
    show_correct_answers: Joi.boolean().default(true),
    shuffle_questions: Joi.boolean().default(true),
    shuffle_options: Joi.boolean().default(true),
    allow_late_join: Joi.boolean().default(false),
    accessibility_mode: Joi.boolean().default(false),
    tts_enabled: Joi.boolean().default(false),
    skin_theme: Joi.string().default('default')
  }).default({})
});

const joinGameSchema = Joi.object({
  session_code: Joi.string().length(6).required()
});

// GET /api/game - List all game sessions for the school
router.get('/', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    // Mock data for development when supabase is null
    if (!supabase) {
      const { mockGameData } = require('../services/mockGameData');
      
      // For demo mode, don't filter by school_id to get all demo games
      // This allows the demo games to be visible regardless of the user's school_id
      console.log(`🔍 Fetching game sessions for school_id: ${req.school_id}`);
      const mockResult = mockGameData.getGameSessions({});
      
      console.log(`🎮 Total sessions returned: ${mockResult.data.length}`);
      console.log(`🎮 Demo games after filtering: ${mockResult.data.filter(g => g.settings_json?.demo).length}`);
      
      return res.json({
        sessions: mockResult.data,
        total: mockResult.data.length
      });
    }

    const { data: sessions, error } = await supabase
      .from('game_sessions')
      .select(`
        session_id,
        quiz_id,
        format,
        status,
        title,
        settings_json,
        created_at,
        started_at,
        finished_at,
        hosts:users!game_sessions_host_id_fkey (
          user_id,
          first_name,
          last_name
        ),
        quizzes (
          quiz_id,
          title,
          description
        ),
        _count:game_participants(count)
      `)
      .eq('school_id', req.school_id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      sessions: sessions || [],
      total: sessions?.length || 0
    });

  } catch (error) {
    logger.error('List game sessions error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve game sessions',
        code: 'SESSIONS_FETCH_ERROR'
      }
    });
  }
});

// GET /api/game/demos - Get all demo game sessions (public endpoint)
router.get('/demos', async (req, res) => {
  try {
    console.log('🎮 GET /api/game/demos called');
    
    // Always return demo sessions from mock data
    const { mockGameData } = require('../services/mockGameData');
    const mockResult = mockGameData.getGameSessions({});
    
    // Filter only demo sessions
    const demoSessions = mockResult.data.filter(session => 
      session.join_code?.startsWith('DEMO') || 
      session.settings_json?.demo === true ||
      session.title?.includes('Demo')
    );
    
    console.log(`🎮 Returning ${demoSessions.length} demo sessions`);
    
    res.json({
      sessions: demoSessions,
      total: demoSessions.length
    });

  } catch (error) {
    logger.error('Get demo sessions error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve demo sessions',
        code: 'DEMOS_FETCH_ERROR'
      }
    });
  }
});

// POST /api/game/debug/add-session - Add session for testing (debug endpoint)
router.post('/debug/add-session', (req, res) => {
  try {
    const sessionData = req.body;
    console.log(`🐛 DEBUG: Adding session ${sessionData.session_id} to mockGameData`);
    
    // Add session to mock data
    mockGameData.addGameSession(sessionData);
    
    res.json({
      success: true,
      message: 'Session added successfully',
      session_id: sessionData.session_id
    });
  } catch (error) {
    console.error('❌ Error adding debug session:', error);
    res.status(500).json({
      error: 'Failed to add session',
      details: error.message
    });
  }
});

// GET /api/game/engines - Get available educational engines
router.get('/engines', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const engines = EDUCATIONAL_ENGINES.map(engineId => ({
      id: engineId,
      name: getEngineName(engineId),
      description: getEngineDescription(engineId),
      subject_affinity: getEngineSubjects(engineId),
      recommended_grades: getEngineGrades(engineId),
      min_questions: 3,
      max_players: 50
    }));

    res.json({ engines });
  } catch (error) {
    logger.error('Get educational engines error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve educational engines',
        code: 'ENGINES_ERROR'
      }
    });
  }
});

// POST /api/game/join/:code - Join game with code
router.post('/join/:code', requireRole('STUDENT', 'TEACHER'), async (req, res) => {
  try {
    const { code } = req.params;
    const { student_id } = req.body;

    // Check if it's a demo game first
    const { mockGameData } = require('../services/mockGameData');
    const demoSession = mockGameData.getDemoSession(code);
    
    if (demoSession) {
      // For demo games, just return the session info
      return res.json({
        game_id: demoSession.session_id,
        session: demoSession,
        message: 'Joined demo game successfully'
      });
    }

    // If not demo, try to find real game session
    const { data: session, error } = await supabase
      .from('game_sessions')
      .select(`
        session_id,
        quiz_id,
        format,
        status,
        settings_json,
        hosts:users!game_sessions_host_id_fkey (
          user_id,
          first_name,
          last_name
        ),
        quizzes (
          quiz_id,
          title,
          description
        )
      `)
      .eq('join_code', code.toUpperCase())
      .eq('school_id', req.school_id)
      .single();

    if (error || !session) {
      return res.status(404).json({
        error: {
          message: 'Game code not found or game not available',
          code: 'INVALID_GAME_CODE'
        }
      });
    }

    // Check if game is joinable
    if (!['waiting', 'active'].includes(session.status)) {
      return res.status(400).json({
        error: {
          message: 'Game is not available for joining',
          code: 'GAME_NOT_JOINABLE'
        }
      });
    }

    res.json({
      game_id: session.session_id,
      session,
      message: 'Game found successfully'
    });

  } catch (error) {
    logger.error('Join game with code error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to join game',
        code: 'JOIN_GAME_ERROR'
      }
    });
  }
});

// POST /api/game - Create new game session from quiz
router.post('/', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { error, value } = gameCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: 'Game validation failed',
          details: error.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const { quiz_id, format, settings } = value;

    // Mock data for development when supabase is null
    if (!supabase) {
      const mockResult = mockGameData.createGameSession({
        quiz_id,
        school_id: req.school_id,
        host_id: req.user.user_id,
        format,
        settings
      });
      
      if (mockResult.error) {
        return res.status(404).json({
          error: {
            message: mockResult.error.message,
            code: 'QUIZ_NOT_FOUND'
          }
        });
      }
      
      logger.info(`Mock game session created: ${mockResult.data.session_id} by user: ${req.user.user_id}`);
      
      return res.status(201).json({
        message: 'Game session created successfully',
        session: mockResult.data
      });
    }

    // Verify quiz exists and user has access
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('quiz_id, title, author_id, school_id, questions(question_id)')
      .eq('quiz_id', quiz_id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found or inactive',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    // Check permissions
    if (quiz.author_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Permission denied',
          code: 'QUIZ_ACCESS_DENIED'
        }
      });
    }

    // Generate session code
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Create game session
    const { data: gameSession, error: sessionError } = await supabase
      .from('game_sessions')
      .insert({
        school_id: req.school_id,
        quiz_id,
        host_id: req.user.user_id,
        format,
        status: 'waiting',
        settings_json: {
          ...settings,
          session_code: sessionCode,
          total_questions: quiz.questions?.length || 0
        }
      })
      .select('session_id, format, status, settings_json, created_at')
      .single();

    if (sessionError) {
      throw sessionError;
    }

    logger.info(`Game session created: ${gameSession.session_id} by user: ${req.user.user_id}`);

    res.status(201).json({
      message: 'Game session created successfully',
      session: {
        ...gameSession,
        quiz_title: quiz.title,
        session_code: sessionCode
      }
    });

  } catch (error) {
    logger.error('Create game session error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create game session',
        code: 'GAME_CREATE_ERROR'
      }
    });
  }
});

// GET /api/game/:id - Get game session details  
router.get('/:id', requireRole('TEACHER', 'ADMIN_ESCOLAR', 'STUDENT'), async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🎮 SIMPLE GET /api/game/${id}`);

    // Import skin system service to check for applied skins
    const { skinSystemService } = require('../services/skinSystemData');

    // SOLUCIÓN DIRECTA - Mock data siempre CON ENGINES
    if (true) { // Forzar modo mock siempre
      console.log(`🔧 FORCED MOCK MODE for ${id}`);
      
      // Mapeo Engine → Demo específico para conectar engines con demos
      const ENGINE_DEMO_MAPPING = {
        'game-demo-001': { engine_id: 'ENG01', engine_name: 'Counter/Number Line' },
        'game-demo-002': { engine_id: 'ENG01', engine_name: 'Counter/Number Line' },
        'game-demo-003': { engine_id: 'ENG02', engine_name: 'Drag-Drop Numbers' },
        'game-demo-004': { engine_id: 'ENG02', engine_name: 'Drag-Drop Numbers' },
        'game-demo-005': { engine_id: 'ENG02', engine_name: 'Drag-Drop Numbers' },
        'game-demo-006': { engine_id: 'ENG02', engine_name: 'Drag-Drop Numbers' },
        'game-demo-007': { engine_id: 'ENG05', engine_name: 'Text Recognition' },
        'game-demo-008': { engine_id: 'ENG05', engine_name: 'Text Recognition' },
        'game-demo-009': { engine_id: 'ENG05', engine_name: 'Text Recognition' },
        'game-demo-010': { engine_id: 'ENG06', engine_name: 'Letter-Sound Matching' },
        'game-demo-011': { engine_id: 'ENG06', engine_name: 'Letter-Sound Matching' },
        'game-demo-012': { engine_id: 'ENG01', engine_name: 'Counter/Number Line' },
        'game-demo-013': { engine_id: 'ENG06', engine_name: 'Letter-Sound Matching' },
        'game-demo-014': { engine_id: 'ENG07', engine_name: 'Reading Fluency' },
        'game-demo-015': { engine_id: 'ENG02', engine_name: 'Drag-Drop Numbers' },
        'game-demo-016': { engine_id: 'ENG02', engine_name: 'Drag-Drop Numbers' },
        'game-demo-017': { engine_id: 'ENG07', engine_name: 'Reading Fluency' },
        'game-demo-018': { engine_id: 'ENG07', engine_name: 'Reading Fluency' },
        'game-demo-019': { engine_id: 'ENG09', engine_name: 'Life Cycle Simulator' },
        'game-demo-020': { engine_id: 'ENG09', engine_name: 'Life Cycle Simulator' },
        'game-demo-021': { engine_id: 'ENG09', engine_name: 'Life Cycle Simulator' },
        'game-demo-022': { engine_id: 'ENG06', engine_name: 'Letter-Sound Matching' },
        'game-demo-023': { engine_id: 'ENG07', engine_name: 'Reading Fluency' },
        'game-demo-024': { engine_id: 'ENG05', engine_name: 'Text Recognition' }
      };
      
      // Crear respuesta directa para game-demo-001 hasta game-demo-024
      if (id.startsWith('game-demo-')) {
        const gameNumber = id.replace('game-demo-', '').padStart(3, '0'); // Mantener formato 001, 002, etc.
        const numericNumber = parseInt(gameNumber); // Para cálculos
        
        // Obtener engine específico para este demo
        const engineInfo = ENGINE_DEMO_MAPPING[id] || { engine_id: 'ENG01', engine_name: 'Counter/Number Line' };
        
        // 🎨 CHECK FOR APPLIED SKIN
        const appliedSkinResult = skinSystemService.getAppliedSkin(id);
        let appliedSkin = null;
        if (appliedSkinResult.success) {
          appliedSkin = appliedSkinResult.data;
          console.log(`🎨 FOUND APPLIED SKIN for ${id}:`, appliedSkin.skin_name);
        } else {
          console.log(`🎨 NO SKIN APPLIED for ${id}`);
        }
        
        // 🎯 TRY TO USE MOCK GAME DATA FIRST (for proper educational content)
        try {
          const { mockGameData: mockData } = require('../services/mockGameData');
          const sessionResult = mockData.getGameSessionById(id, req.school_id);
          
          if (sessionResult && sessionResult.quiz_id) {
            const quizResult = mockData.getQuizById(sessionResult.quiz_id, sessionResult.school_id);
            
            if (quizResult && quizResult.data) {
              console.log(`🎯 USING EDUCATIONAL CONTENT from mockGameData for ${id}`);
              console.log(`📚 Quiz: ${quizResult.data.title}`);
              console.log(`📝 Questions: ${quizResult.data.questions.length}`);
              
              const session = {
                session_id: id,
                quiz_id: sessionResult.quiz_id,
                school_id: sessionResult.school_id,
                host_id: sessionResult.host_id,
                join_code: sessionResult.join_code || `DEMO${gameNumber}`,
                title: sessionResult.title,
                description: sessionResult.description || `Juego demo ${gameNumber} - Formato ${sessionResult.format}`,
                format: sessionResult.format,
                status: sessionResult.status,
                // 🎮 ENGINE INTEGRACIÓN COMPLETA
                engine_id: sessionResult.engine_id || engineInfo.engine_id,
                engine_name: sessionResult.engine_name || engineInfo.engine_name,
                // 🎨 SKIN INTEGRATION
                applied_skin: appliedSkin,
                settings_json: {
                  ...sessionResult.settings_json,
                  // 🎨 Add skin config if applied
                  skin_config: appliedSkin ? appliedSkin.engine_config : null
                },
                created_at: sessionResult.created_at,
                quizzes: {
                  quiz_id: quizResult.data.quiz_id,
                  title: quizResult.data.title,
                  description: quizResult.data.description,
                  questions: quizResult.data.questions.map(q => ({
                    question_id: q.question_id,
                    question_order: q.question_order,
                    stem_md: q.stem_md,
                    type: q.type,
                    options_json: q.options_json,
                    correct_answer: q.correct_answer,
                    explanation: q.explanation,
                    points: q.points,
                    difficulty: q.difficulty,
                    bloom_level: q.bloom_level,
                    // 🐄 Farm context for skin integration
                    farm_context: q.farm_context
                  }))
                },
                hosts: {
                  user_id: '550e8400-e29b-41d4-a716-446655440003',
                  first_name: 'Profesor',
                  last_name: 'Demo'
                },
                game_participants: []
              };
              
              console.log(`✅ RETURNING EDUCATIONAL session for ${id}: ${session.title}`);
              if (appliedSkin) {
                console.log(`🎨 WITH APPLIED SKIN: ${appliedSkin.skin_name}`);
                
                // 🔄 APPLY DYNAMIC CONTENT TRANSFORMATION
                console.log(`🔄 APPLYING DYNAMIC TRANSFORMATION...`);
                
                try {
                  // Extract numeric context from session title if available
                  let numericContext = null;
                  if (session.title) {
                    const aiService = require('../services/aiService');
                    numericContext = aiService.extractNumericContext(session.title);
                    console.log(`🔢 EXTRACTED NUMERIC CONTEXT:`, numericContext);
                  }
                  
                  const transformedSession = transformGameContentWithSkin(session, appliedSkin, numericContext);
                  
                  if (transformedSession && transformedSession.content_transformed) {
                    console.log(`✨ CONTENT DYNAMICALLY TRANSFORMED!`);
                    console.log(`📝 Questions transformed to: ${transformedSession.transformation_applied.content_type}`);
                    return res.json({ session: transformedSession });
                  }
                } catch (transformError) {
                  console.log(`⚠️ ERROR IN DYNAMIC TRANSFORMATION:`, transformError.message);
                  console.log(`🔄 Continuing with original session...`);
                }
              }
              return res.json({ session });
            }
          }
        } catch (error) {
          console.log(`⚠️ MockGameData not available, using fallback for ${id}:`, error.message);
        }
        
        // 🔄 FALLBACK: Use dynamic generation only if educational content not available
        console.log(`🔄 USING FALLBACK dynamic generation for ${id}`);
        
        // Diferentes formatos de juego según el número
        const gameFormats = ['trivia_lightning', 'color_match', 'memory_flip', 'picture_bingo', 'drag_drop_sorting', 'number_line_race'];
        const currentFormat = gameFormats[(numericNumber - 1) % gameFormats.length];
        
        // Configuraciones específicas de engine
        const engineConfigs = {
          'ENG01': {
            number_line_range: [0, 20],
            visual_counters: true,
            progression_style: 'step_by_step',
            animation_speed: 'medium'
          },
          'ENG02': {
            drag_sensitivity: 'medium',
            drop_zone_tolerance: 'generous',
            drag_feedback: 'haptic_visual',
            auto_arrange: true
          },
          'ENG05': {
            text_recognition_mode: 'phonetic',
            difficulty_scaling: 'adaptive',
            visual_support: true,
            tts_enabled: true
          },
          'ENG06': {
            phonetic_matching: 'precise',
            audio_quality: 'high_fidelity',
            voice_recording: true,
            pronunciation_feedback: true
          },
          'ENG07': {
            reading_speed_tracking: true,
            comprehension_checks: true,
            fluency_metrics: ['wpm', 'accuracy', 'expression'],
            difficulty_progression: 'auto'
          },
          'ENG09': {
            simulation_speed: 'variable',
            ecosystem_complexity: 'age_appropriate',
            interaction_types: ['observe', 'manipulate', 'predict'],
            scientific_accuracy: 'educational'
          }
        };
        
        const session = {
          session_id: id,
          quiz_id: `${id}-quiz`,
          school_id: req.school_id,
          host_id: '550e8400-e29b-41d4-a716-446655440003',
          join_code: `DEMO${gameNumber}`,
          title: `Demo Game ${gameNumber}`,
          description: `Juego demo ${gameNumber} - Formato ${currentFormat}`,
          format: currentFormat,
          status: 'active',
          // 🎮 ENGINE INTEGRACIÓN COMPLETA
          engine_id: engineInfo.engine_id,
          engine_name: engineInfo.engine_name,
          // 🎨 SKIN INTEGRATION
          applied_skin: appliedSkin,
          settings_json: {
            demo: true,
            max_players: 30,
            time_limit: 300,
            // Configuración específica del engine
            engine_config: engineConfigs[engineInfo.engine_id] || {},
            // Configuración específica del skin (si está aplicado)
            skin_config: appliedSkin ? appliedSkin.engine_config : null
          },
          created_at: new Date().toISOString(),
          quizzes: {
            quiz_id: `${id}-quiz`,
            title: `Demo Game ${gameNumber}`,
            description: `Quiz demo ${gameNumber} - ${currentFormat}`,
            questions: [
              {
                question_id: `q1-${id}`,
                question_order: 1,
                stem_md: `Pregunta 1 del Demo ${gameNumber}: ¿Cuánto es ${numericNumber} + ${numericNumber}?`,
                type: 'multiple_choice',
                options_json: [
                  `${numericNumber * 2 - 1}`, 
                  `${numericNumber * 2}`, 
                  `${numericNumber * 2 + 1}`, 
                  `${numericNumber * 2 + 2}`
                ],
                correct_answer: `${numericNumber * 2}`,
                explanation: `${numericNumber} + ${numericNumber} = ${numericNumber * 2}`,
                points: 10,
                difficulty: 'easy',
                bloom_level: 'Recordar'
              },
              {
                question_id: `q2-${id}`,
                question_order: 2,
                stem_md: `Pregunta 2 del Demo ${gameNumber}: ¿Cuánto es ${numericNumber} × 3?`,
                type: 'multiple_choice',
                options_json: [
                  `${numericNumber * 3 - 2}`, 
                  `${numericNumber * 3}`, 
                  `${numericNumber * 3 + 2}`, 
                  `${numericNumber * 3 + 4}`
                ],
                correct_answer: `${numericNumber * 3}`,
                explanation: `${numericNumber} × 3 = ${numericNumber * 3}`,
                points: 10,
                difficulty: 'medium',
                bloom_level: 'Aplicar'
              }
            ]
          },
          hosts: {
            user_id: '550e8400-e29b-41d4-a716-446655440003',
            first_name: 'Profesor',
            last_name: 'Demo'
          },
          game_participants: []
        };
        
        console.log(`✅ RETURNING fallback session for ${id}: ${session.title}`);
        if (appliedSkin) {
          console.log(`🎨 WITH APPLIED SKIN: ${appliedSkin.skin_name}`);
          
          // 🔄 APPLY DYNAMIC CONTENT TRANSFORMATION TO FALLBACK
          console.log(`🔄 APPLYING DYNAMIC TRANSFORMATION TO FALLBACK...`);
          
          try {
            // Extract numeric context from session title if available
            let numericContext = null;
            if (session.title) {
              const aiService = require('../services/aiService');
              numericContext = aiService.extractNumericContext(session.title);
              console.log(`🔢 EXTRACTED NUMERIC CONTEXT:`, numericContext);
            }
            
            const transformedSession = transformGameContentWithSkin(session, appliedSkin, numericContext);
            
            if (transformedSession && transformedSession.content_transformed) {
              console.log(`✨ FALLBACK CONTENT DYNAMICALLY TRANSFORMED!`);
              console.log(`📝 Questions transformed to: ${transformedSession.transformation_applied.content_type}`);
              return res.json({ session: transformedSession });
            }
          } catch (transformError) {
            console.log(`⚠️ ERROR IN FALLBACK DYNAMIC TRANSFORMATION:`, transformError.message);
            console.log(`🔄 Continuing with original fallback session...`);
          }
        }
        return res.json({ session });
      }
      
      // Si no es un game-demo estático, buscar en mockGameData
      console.log(`🔍 No es game-demo estático, buscando ${id} en mockGameData...`);

      // 🚨 **SOLUCIÓN DEFINITIVA**: Añadir lógica para crear dinámicamente sesiones de OA1
      if (id.startsWith('oa1-mat-')) {
        console.log(`🌱 Creating dynamic demo session for OA1 game: ${id}`);
        const bloomLevel = id.replace('oa1-mat-', '');
        
        const difficultyMap = {
          'recordar': 'basico',
          'comprender': 'basico',
          'aplicar': 'intermedio',
          'analyze': 'intermedio',
          'evaluar': 'avanzado',
          'crear': 'avanzado'
        };
        const difficultyLevel = difficultyMap[bloomLevel] || 'basico';

        const session = {
          session_id: id,
          quiz_id: `oa1-mat-quiz-${bloomLevel}`,
          school_id: req.school_id || '550e8400-e29b-41d4-a716-446655440001',
          host_id: '550e8400-e29b-41d4-a716-446655440003',
          join_code: `OA1${bloomLevel.substring(0, 3).toUpperCase()}`,
          title: `OA1 Matemáticas - Nivel: ${bloomLevel.charAt(0).toUpperCase() + bloomLevel.slice(1)}`,
          description: `Juego de conteo para el OA1 de 1º Básico, nivel de Bloom: ${bloomLevel}.`,
          format: 'custom',
          status: 'active',
          engine_id: 'ENG01',
          engine_name: 'Counter/Number Line',
          settings_json: {
            demo: true,
            max_players: 1,
            time_limit: 999,
            theme: 'granja_oa1_v2',
            version: '2.0',
            specialized_component: `FarmCountingGameOA1${bloomLevel.charAt(0).toUpperCase() + bloomLevel.slice(1)}`,
            difficultyLevel: difficultyLevel
          },
          created_at: new Date().toISOString(),
          quizzes: {
            quiz_id: `oa1-mat-quiz-${bloomLevel}`,
            title: `Quiz para OA1 - ${bloomLevel}`,
            questions: [
              {
                question_id: `q1-${id}`,
                stem_md: `Actividad de ${bloomLevel} para el OA1.`,
                type: 'info',
                options_json: [],
                correct_answer: '',
              }
            ]
          },
           hosts: {
              user_id: '550e8400-e29b-41d4-a716-446655440003',
              first_name: 'Profesor',
              last_name: 'Demo'
            },
        };
        console.log(`✅ RETURNING dynamic OA1 session for ${id} with difficulty: ${difficultyLevel}`);
        return res.json({ session });
      }
      
      console.log(`🔍 DEBUG GET: mockGameData available: ${mockGameData ? 'YES' : 'NO'}`);
      console.log(`🔍 DEBUG GET: Total sessions in mockGameData: ${mockGameData?.gameSessions?.length || 'UNKNOWN'}`);
      
      try {
        console.log(`🔄 Calling mockGameData.getGameSessionById for ${id}...`);
        
        // 🚨 FIX: Buscar con y sin prefijo "game_" para manejar sesiones gamificadas
        let mockResult = mockGameData.getGameSessionById(id, req.school_id);
        
        // Si no se encuentra y el ID no tiene prefijo "game_", intentar con prefijo
        if ((!mockResult || mockResult.error) && !id.startsWith('game_')) {
          console.log(`🔄 No encontrado con ID original, intentando con prefijo: game_${id}`);
          mockResult = mockGameData.getGameSessionById(`game_${id}`, req.school_id);
        }
        
        // Si no se encuentra y el ID tiene prefijo "game_", intentar sin prefijo  
        if ((!mockResult || mockResult.error) && id.startsWith('game_')) {
          console.log(`🔄 No encontrado con prefijo, intentando sin prefijo: ${id.replace('game_', '')}`);
          mockResult = mockGameData.getGameSessionById(id.replace('game_', ''), req.school_id);
        }
        
        console.log(`🔍 Search result:`, {
          hasData: !!mockResult?.data,
          hasError: !!mockResult?.error,
          errorMessage: mockResult?.error?.message
        });
        
        if (mockResult && mockResult.data && !mockResult.error) {
          console.log(`✅ ENCONTRADO en mockGameData: ${mockResult.data.title}`);
          
          const session = mockResult.data;
          
          // Check for applied skin
          const { skinSystemService } = require('../services/skinSystemData');
          const appliedSkinResult = skinSystemService.getAppliedSkin(id);
          let appliedSkin = null;
          if (appliedSkinResult.success) {
            appliedSkin = appliedSkinResult.data;
            console.log(`🎨 FOUND APPLIED SKIN for ${id}:`, appliedSkin.skin_name);
          }
          
          // Add applied skin to session
          session.applied_skin = appliedSkin;
          if (appliedSkin) {
            session.settings_json = {
              ...session.settings_json,
              skin_config: appliedSkin.engine_config
            };
          }
          
          // Apply dynamic content transformation if skin is applied
          if (appliedSkin) {
            console.log(`🔄 APPLYING DYNAMIC TRANSFORMATION...`);
            
            try {
              // Extract numeric context from session title if available
              let numericContext = null;
              if (session.title) {
                const aiService = require('../services/aiService');
                numericContext = aiService.extractNumericContext(session.title);
                console.log(`🔢 EXTRACTED NUMERIC CONTEXT:`, numericContext);
              }
              
              const transformedSession = transformGameContentWithSkin(session, appliedSkin, numericContext);
              
              if (transformedSession && transformedSession.content_transformed) {
                console.log(`✨ CONTENT DYNAMICALLY TRANSFORMED!`);
                console.log(`📝 Questions transformed to: ${transformedSession.transformation_applied.content_type}`);
                return res.json({ session: transformedSession });
              }
            } catch (transformError) {
              console.log(`⚠️ ERROR IN DYNAMIC TRANSFORMATION:`, transformError.message);
              console.log(`🔄 Continuing with original session...`);
            }
          }
          
          return res.json({ session });
        } else {
          console.log(`❌ NO encontrado en mockGameData: ${mockResult?.error?.message || 'No data'}`);
        }
      } catch (error) {
        console.log(`⚠️ Error buscando en mockGameData:`, error.message);
      }
      
      // Si no se encuentra en ningún lado, devolver error
      return res.status(404).json({
        error: {
          message: 'Game session not found',
          code: 'SESSION_NOT_FOUND'
        }
      });
    }

    const { data: session, error } = await supabase
      .from('game_sessions')
      .select(`
        session_id,
        quiz_id,
        format,
        status,
        settings_json,
        started_at,
        finished_at,
        created_at,
        hosts:users!game_sessions_host_id_fkey (
          user_id,
          first_name,
          last_name
        ),
        quizzes (
          quiz_id,
          title,
          description,
          time_limit_minutes,
          questions (
            question_id,
            question_order,
            stem_md,
            type,
            options_json,
            ${req.user.role !== 'STUDENT' ? 'correct_answer,' : ''}
            points,
            difficulty
          )
        ),
        game_participants (
          user_id,
          score,
          accuracy,
          time_ms,
          joined_at,
          users (
            user_id,
            first_name,
            last_name
          )
        )
      `)
      .eq('session_id', id)
      .eq('school_id', req.school_id)
      .single();

    if (error || !session) {
      return res.status(404).json({
        error: {
          message: 'Game session not found',
          code: 'SESSION_NOT_FOUND'
        }
      });
    }

    // Sort questions by order
    if (session.quizzes?.questions) {
      session.quizzes.questions.sort((a, b) => a.question_order - b.question_order);
    }

    // Sort participants by score (descending)
    if (session.game_participants) {
      session.game_participants.sort((a, b) => b.score - a.score);
    }

    res.json({
      session
    });

  } catch (error) {
    logger.error('Get game session error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve game session',
        code: 'SESSION_FETCH_ERROR'
      }
    });
  }
});

// POST /api/game/:id/start - Start game session
router.post('/:id/start', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀🚀🚀 POST START ENDPOINT - Game ID: ${id}`);
    
    // SOLUCIÓN UNIVERSAL: usar mockGameData.startGameSession para todos los juegos
    const { mockGameData } = require('../services/mockGameData');
    
    console.log(`🎮 STARTING GAME SESSION: ${id}`);
    
    // Para evaluaciones gamificadas, usar lógica flexible con school_id
    const mockResult = mockGameData.startGameSession(id, req.school_id, req.user.user_id);
    
    if (mockResult.error) {
      console.log(`❌ Failed to start: ${mockResult.error.message}`);
      return res.status(404).json({
        error: {
          message: mockResult.error.message,
          code: 'SESSION_START_ERROR'
        }
      });
    }
    
    console.log(`✅ Game session ${id} started successfully!`);
    console.log(`✅ New status: ${mockResult.data.status}`);
    logger.info(`Game session started: ${id} by user: ${req.user.user_id}`);
    
    return res.json({
      message: 'Game session started successfully',
      session: mockResult.data
    });

  } catch (error) {
    console.error(`💥 ERROR in POST /start:`, error);
    logger.error('Start game session error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to start game session',
        code: 'SESSION_START_ERROR'
      }
    });
  }
});

// POST /api/game/:id/end - End game session
router.post('/:id/end', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get session and verify host permissions
    const { data: session, error } = await supabase
      .from('game_sessions')
      .select('session_id, host_id, status')
      .eq('session_id', id)
      .eq('school_id', req.school_id)
      .single();

    if (error || !session) {
      return res.status(404).json({
        error: {
          message: 'Game session not found',
          code: 'SESSION_NOT_FOUND'
        }
      });
    }

    // Check if user is host
    if (session.host_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Only the host can end the game',
          code: 'HOST_PERMISSION_REQUIRED'
        }
      });
    }

    // Update session status to finished
    const { data: updatedSession, error: updateError } = await supabase
      .from('game_sessions')
      .update({
        status: 'finished',
        finished_at: new Date().toISOString()
      })
      .eq('session_id', id)
      .select('session_id, status, finished_at')
      .single();

    if (updateError) {
      throw updateError;
    }

    logger.info(`Game session ended: ${id} by user: ${req.user.user_id}`);

    res.json({
      message: 'Game session ended successfully',
      session: updatedSession
    });

  } catch (error) {
    logger.error('End game session error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to end game session',
        code: 'SESSION_END_ERROR'
      }
    });
  }
});

// POST /api/game/join - Join game session using session code
router.post('/join', gameRateLimiter, requireRole('STUDENT', 'TEACHER'), async (req, res) => {
  try {
    // Validate input
    const { error, value } = joinGameSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: 'Join game validation failed',
          details: error.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    const { session_code } = value;

    // Find session by code
    const { data: session, error: sessionError } = await supabase
      .from('game_sessions')
      .select(`
        session_id,
        quiz_id,
        format,
        status,
        settings_json,
        host_id
      `)
      .eq('school_id', req.school_id)
      .filter('settings_json->>session_code', 'eq', session_code)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({
        error: {
          message: 'Invalid session code',
          code: 'INVALID_SESSION_CODE'
        }
      });
    }

    // Check if session allows joining
    if (session.status === 'finished') {
      return res.status(400).json({
        error: {
          message: 'Game session has already finished',
          code: 'SESSION_FINISHED'
        }
      });
    }

    if (session.status === 'active' && !session.settings_json?.allow_late_join) {
      return res.status(400).json({
        error: {
          message: 'Game has already started and late join is not allowed',
          code: 'LATE_JOIN_DISABLED'
        }
      });
    }

    // Check if user is already a participant
    const { data: existingParticipant } = await supabase
      .from('game_participants')
      .select('user_id')
      .eq('session_id', session.session_id)
      .eq('user_id', req.user.user_id)
      .single();

    if (existingParticipant) {
      return res.status(400).json({
        error: {
          message: 'You are already participating in this game',
          code: 'ALREADY_PARTICIPATING'
        }
      });
    }

    // Check max players limit
    const { data: currentParticipants } = await supabase
      .from('game_participants')
      .select('user_id')
      .eq('session_id', session.session_id);

    const maxPlayers = session.settings_json?.max_players || 30;
    if (currentParticipants && currentParticipants.length >= maxPlayers) {
      return res.status(400).json({
        error: {
          message: 'Game session is full',
          code: 'SESSION_FULL'
        }
      });
    }

    // Add user as participant
    const { data: participant, error: participantError } = await supabase
      .from('game_participants')
      .insert({
        session_id: session.session_id,
        user_id: req.user.user_id,
        score: 0,
        accuracy: 0,
        time_ms: 0
      })
      .select(`
        session_id,
        user_id,
        score,
        joined_at,
        users (
          user_id,
          first_name,
          last_name
        )
      `)
      .single();

    if (participantError) {
      throw participantError;
    }

    logger.info(`User joined game session: ${session.session_id}, user: ${req.user.user_id}`);

    res.status(201).json({
      message: 'Successfully joined game session',
      session: {
        session_id: session.session_id,
        format: session.format,
        status: session.status
      },
      participant
    });

  } catch (error) {
    logger.error('Join game session error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to join game session',
        code: 'JOIN_GAME_ERROR'
      }
    });
  }
});

// GET /api/game/:id/results - Get game results
router.get('/:id/results', requireRole('TEACHER', 'ADMIN_ESCOLAR', 'STUDENT'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabase
      .from('game_sessions')
      .select(`
        session_id,
        quiz_id,
        format,
        status,
        started_at,
        finished_at,
        settings_json,
        quizzes (
          title,
          questions (
            question_id
          )
        ),
        game_participants (
          user_id,
          score,
          accuracy,
          time_ms,
          joined_at,
          users (
            user_id,
            first_name,
            last_name
          )
        )
      `)
      .eq('session_id', id)
      .eq('school_id', req.school_id)
      .single();

    if (error || !session) {
      return res.status(404).json({
        error: {
          message: 'Game session not found',
          code: 'SESSION_NOT_FOUND'
        }
      });
    }

    // Calculate results
    const totalQuestions = session.quizzes?.questions?.length || 0;
    const participants = session.game_participants || [];
    
    // Sort participants by score (descending), then by time (ascending)
    participants.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.time_ms - b.time_ms;
    });

    // Add ranking to participants
    participants.forEach((participant, index) => {
      participant.rank = index + 1;
    });

    const results = {
      session_id: session.session_id,
      quiz_title: session.quizzes?.title,
      format: session.format,
      status: session.status,
      started_at: session.started_at,
      finished_at: session.finished_at,
      total_questions: totalQuestions,
      total_participants: participants.length,
      participants: participants.map(p => ({
        rank: p.rank,
        user_id: p.user_id,
        name: `${p.users?.first_name} ${p.users?.last_name}`,
        score: p.score,
        accuracy: p.accuracy,
        time_ms: p.time_ms,
        joined_at: p.joined_at
      }))
    };

    res.json({
      results
    });

  } catch (error) {
    logger.error('Get game results error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve game results',
        code: 'RESULTS_FETCH_ERROR'
      }
    });
  }
});

// Helper functions for educational engines
function getEngineName(engineId) {
  const names = {
    'ENG01': 'Counter/Number Line',
    'ENG02': 'Drag-Drop Numbers',
    'ENG05': 'Text Recognition',
    'ENG06': 'Letter-Sound Matching',
    'ENG07': 'Reading Fluency',
    'ENG09': 'Life Cycle Simulation'
  };
  return names[engineId] || `Engine ${engineId}`;
}

function getEngineDescription(engineId) {
  const descriptions = {
    'ENG01': 'Interactive counting and number line operations for math fundamentals',
    'ENG02': 'Drag and drop mechanics for number manipulation and math operations',
    'ENG05': 'Text recognition and pattern matching for reading and letter identification',
    'ENG06': 'Letter-sound correspondence and phonetic matching for early literacy',
    'ENG07': 'Reading fluency tracking and comprehension assessment',
    'ENG09': 'Life cycle simulations and ecosystem interactions for science education'
  };
  return descriptions[engineId] || 'Educational game engine';
}

function getEngineSubjects(engineId) {
  const subjects = {
    'ENG01': ['MAT'],
    'ENG02': ['MAT'],
    'ENG05': ['LEN'],
    'ENG06': ['LEN'],
    'ENG07': ['LEN'],
    'ENG09': ['CN']
  };
  return subjects[engineId] || [];
}

function getEngineGrades(engineId) {
  const grades = {
    'ENG01': ['1B', '2B', '3B'],
    'ENG02': ['1B', '2B', '3B', '4B'],
    'ENG05': ['1B', '2B', '3B'],
    'ENG06': ['1B', '2B', '3B'],
    'ENG07': ['1B', '2B', '3B', '4B'],
    'ENG09': ['1B', '2B', '3B', '4B', '5B', '6B']
  };
  return grades[engineId] || [];
}

module.exports = router; 
