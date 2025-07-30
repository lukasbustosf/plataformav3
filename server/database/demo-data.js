const { supabaseAdmin } = require('./supabase');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

async function loadDemoData() {
  try {
    // Check if we have real Supabase credentials
    const hasRealDatabase = process.env.SUPABASE_URL && 
                           process.env.SUPABASE_URL !== 'https://placeholder.supabase.co';
    
    if (!hasRealDatabase) {
      logger.info('Demo data loading skipped - using mock authentication mode');
      return;
    }
    
    logger.info('Loading comprehensive demo data for game testing...');
    
    // 1. Create demo school
    const { data: school, error: schoolError } = await supabaseAdmin
      .from('schools')
      .upsert({
        school_id: '550e8400-e29b-41d4-a716-446655440001',
        school_name: 'Colegio Demo EDU21',
        school_code: 'DEMO001',
        address: 'Av. Demo 123, Santiago, Chile',
        phone: '+56912345678',
        email: 'demo@edu21.cl',
        region: 'Metropolitana',
        comuna: 'Santiago',
        rbd: 'DEMO001',
        school_type: 'particular',
        active: true
      }, { 
        onConflict: 'school_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();
      
    if (schoolError) {
      logger.warn('School creation warning:', schoolError.message);
    }
    
    const schoolId = school?.school_id || '550e8400-e29b-41d4-a716-446655440001';
    logger.info(`Demo school ready: ${schoolId}`);
    
    // 2. Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const demoUsers = [
      {
        user_id: '550e8400-e29b-41d4-a716-446655440002',
        school_id: schoolId,
        email: 'admin@demo.edu21.cl',
        password_hash: hashedPassword,
        first_name: 'Admin',
        last_name: 'Demo',
        role: 'ADMIN_ESCOLAR',
        active: true
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440003',
        school_id: schoolId,
        email: 'teacher@demo.edu21.cl',
        password_hash: hashedPassword,
        first_name: 'Profesor',
        last_name: 'Demo',
        role: 'TEACHER',
        active: true
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440004',
        school_id: schoolId,
        email: 'estudiante1@demo.edu21.cl',
        password_hash: hashedPassword,
        first_name: 'Ana',
        last_name: 'Estudiante',
        role: 'STUDENT',
        active: true
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440005',
        school_id: schoolId,
        email: 'estudiante2@demo.edu21.cl',
        password_hash: hashedPassword,
        first_name: 'Carlos',
        last_name: 'Estudiante',
        role: 'STUDENT',
        active: true
      },
      {
        user_id: '550e8400-e29b-41d4-a716-446655440006',
        school_id: schoolId,
        email: 'estudiante3@demo.edu21.cl',
        password_hash: hashedPassword,
        first_name: 'María',
        last_name: 'Estudiante',
        role: 'STUDENT',
        active: true
      }
    ];
    
    for (const user of demoUsers) {
      const { error: userError } = await supabaseAdmin
        .from('users')
        .upsert(user, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });
        
      if (userError) {
        logger.warn(`User creation warning for ${user.email}:`, userError.message);
      }
    }
    
    logger.info('Demo users created');
    
    // 3. Create grade levels and subjects
    const gradeLevels = [
      { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA', age_min: 10, age_max: 11, ciclo: 'Segundo Ciclo' },
      { grade_code: '6B', grade_name: '6° Básico', level_type: 'BASICA', age_min: 11, age_max: 12, ciclo: 'Segundo Ciclo' },
      { grade_code: '7B', grade_name: '7° Básico', level_type: 'BASICA', age_min: 12, age_max: 13, ciclo: 'Segundo Ciclo' },
      { grade_code: '8B', grade_name: '8° Básico', level_type: 'BASICA', age_min: 13, age_max: 14, ciclo: 'Segundo Ciclo' }
    ];
    
    for (const grade of gradeLevels) {
      const { error } = await supabaseAdmin
        .from('grade_levels')
        .upsert(grade, { onConflict: 'grade_code' });
      if (error) logger.warn(`Grade level warning:`, error.message);
    }
    
    const subjects = [
      {
        subject_id: '550e8400-e29b-41d4-a716-446655440010',
        subject_code: 'MAT',
        subject_name: 'Matemática',
        subject_color: '#FF6B35',
        department: 'Ciencias',
        is_core: true,
        min_hours_per_week: 6
      },
      {
        subject_id: '550e8400-e29b-41d4-a716-446655440011',
        subject_code: 'LEN',
        subject_name: 'Lenguaje y Comunicación',
        subject_color: '#4ECDC4',
        department: 'Humanidades',
        is_core: true,
        min_hours_per_week: 6
      },
      {
        subject_id: '550e8400-e29b-41d4-a716-446655440012',
        subject_code: 'CIE',
        subject_name: 'Ciencias Naturales',
        subject_color: '#45B7D1',
        department: 'Ciencias',
        is_core: true,
        min_hours_per_week: 4
      },
      {
        subject_id: '550e8400-e29b-41d4-a716-446655440013',
        subject_code: 'HIS',
        subject_name: 'Historia y Geografía',
        subject_color: '#96CEB4',
        department: 'Humanidades',
        is_core: true,
        min_hours_per_week: 4
      }
    ];
    
    for (const subject of subjects) {
      const { error } = await supabaseAdmin
        .from('subjects')
        .upsert(subject, { onConflict: 'subject_id' });
      if (error) logger.warn(`Subject warning:`, error.message);
    }
    
    logger.info('Grade levels and subjects created');
    
    // 4. Create demo classes
    const demoClasses = [
      {
        class_id: '550e8400-e29b-41d4-a716-446655440020',
        school_id: schoolId,
        class_name: '5° Básico A - Matemática',
        grade_code: '5B',
        subject_id: '550e8400-e29b-41d4-a716-446655440010',
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        year: 2024,
        classroom: 'Aula 15',
        max_students: 30,
        active: true
      },
      {
        class_id: '550e8400-e29b-41d4-a716-446655440021',
        school_id: schoolId,
        class_name: '6° Básico A - Lenguaje',
        grade_code: '6B',
        subject_id: '550e8400-e29b-41d4-a716-446655440011',
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        year: 2024,
        classroom: 'Aula 12',
        max_students: 30,
        active: true
      }
    ];
    
    for (const cls of demoClasses) {
      const { error } = await supabaseAdmin
        .from('classes')
        .upsert(cls, { onConflict: 'class_id' });
      if (error) logger.warn(`Class warning:`, error.message);
    }
    
    // 5. Create comprehensive demo quizzes with questions
    const demoQuizzes = [
      {
        quiz_id: '550e8400-e29b-41d4-a716-446655440030',
        school_id: schoolId,
        author_id: '550e8400-e29b-41d4-a716-446655440003',
        title: '🧮 Matemática Básica - Operaciones',
        description: 'Quiz de matemática básica con operaciones fundamentales para 5° básico',
        mode: 'manual',
        difficulty: 'medium',
        time_limit_minutes: 30,
        active: true,
        questions: [
          {
            question_id: '550e8400-e29b-41d4-a716-446655440031',
            question_order: 1,
            stem_md: '¿Cuál es el resultado de 25 + 17?',
            type: 'multiple_choice',
            options_json: ['40', '42', '43', '45'],
            correct_answer: '42',
            explanation: '25 + 17 = 42. Suma las unidades: 5 + 7 = 12, anota 2 y lleva 1. Suma las decenas: 2 + 1 + 1 = 4.',
            points: 2,
            difficulty: 'easy',
            bloom_level: 'Aplicar'
          },
          {
            question_id: '550e8400-e29b-41d4-a716-446655440032',
            question_order: 2,
            stem_md: '¿Cuánto es 8 × 7?',
            type: 'multiple_choice',
            options_json: ['54', '56', '58', '60'],
            correct_answer: '56',
            explanation: '8 × 7 = 56. Puedes usar la tabla del 8 o sumar 8 veces 7.',
            points: 2,
            difficulty: 'medium',
            bloom_level: 'Recordar'
          },
          {
            question_id: '550e8400-e29b-41d4-a716-446655440033',
            question_order: 3,
            stem_md: 'Si tengo 100 pesos y compro un dulce de 35 pesos, ¿cuánto vuelto recibo?',
            type: 'multiple_choice',
            options_json: ['55 pesos', '65 pesos', '75 pesos', '85 pesos'],
            correct_answer: '65 pesos',
            explanation: '100 - 35 = 65 pesos de vuelto.',
            points: 3,
            difficulty: 'medium',
            bloom_level: 'Aplicar'
          },
          {
            question_id: '550e8400-e29b-41d4-a716-446655440034',
            question_order: 4,
            stem_md: '¿Cuál de estos números es mayor?',
            type: 'multiple_choice',
            options_json: ['1.250', '1.025', '1.520', '1.205'],
            correct_answer: '1.520',
            explanation: 'Para comparar números decimales, compara de izquierda a derecha: 1.520 es el mayor.',
            points: 2,
            difficulty: 'medium',
            bloom_level: 'Analizar'
          },
          {
            question_id: '550e8400-e29b-41d4-a716-446655440035',
            question_order: 5,
            stem_md: '¿Cuántos minutos hay en 2 horas y 30 minutos?',
            type: 'multiple_choice',
            options_json: ['120 minutos', '130 minutos', '140 minutos', '150 minutos'],
            correct_answer: '150 minutos',
            explanation: '2 horas = 120 minutos. 120 + 30 = 150 minutos total.',
            points: 3,
            difficulty: 'medium',
            bloom_level: 'Aplicar'
          }
        ]
      },
      {
        quiz_id: '550e8400-e29b-41d4-a716-446655440040',
        school_id: schoolId,
        author_id: '550e8400-e29b-41d4-a716-446655440003',
        title: '📚 Lenguaje - Comprensión Lectora',
        description: 'Quiz de comprensión lectora y gramática para 6° básico',
        mode: 'manual',
        difficulty: 'medium',
        time_limit_minutes: 25,
        active: true,
        questions: [
          {
            question_id: '550e8400-e29b-41d4-a716-446655440041',
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
            question_id: '550e8400-e29b-41d4-a716-446655440042',
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
            question_id: '550e8400-e29b-41d4-a716-446655440043',
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
            question_id: '550e8400-e29b-41d4-a716-446655440044',
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
            question_id: '550e8400-e29b-41d4-a716-446655440045',
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
        quiz_id: '550e8400-e29b-41d4-a716-446655440050',
        school_id: schoolId,
        author_id: '550e8400-e29b-41d4-a716-446655440003',
        title: '🔬 Ciencias - El Cuerpo Humano',
        description: 'Quiz sobre sistemas del cuerpo humano para educación básica',
        mode: 'manual',
        difficulty: 'medium',
        time_limit_minutes: 20,
        active: true,
        questions: [
          {
            question_id: '550e8400-e29b-41d4-a716-446655440051',
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
            question_id: '550e8400-e29b-41d4-a716-446655440052',
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
            question_id: '550e8400-e29b-41d4-a716-446655440053',
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
            question_id: '550e8400-e29b-41d4-a716-446655440054',
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
        quiz_id: '550e8400-e29b-41d4-a716-446655440060',
        school_id: schoolId,
        author_id: '550e8400-e29b-41d4-a716-446655440003',
        title: '🌍 Historia - Chile y América',
        description: 'Quiz de historia sobre Chile y América para educación básica',
        mode: 'manual',
        difficulty: 'medium',
        time_limit_minutes: 25,
        active: true,
        questions: [
          {
            question_id: '550e8400-e29b-41d4-a716-446655440061',
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
            question_id: '550e8400-e29b-41d4-a716-446655440062',
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
            question_id: '550e8400-e29b-41d4-a716-446655440063',
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
            question_id: '550e8400-e29b-41d4-a716-446655440064',
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
      }
    ];
    
    // Insert quizzes and questions
    for (const quiz of demoQuizzes) {
      const { questions, ...quizData } = quiz;
      
      // Insert quiz
      const { error: quizError } = await supabaseAdmin
        .from('quizzes')
        .upsert(quizData, { onConflict: 'quiz_id' });
        
      if (quizError) {
        logger.warn(`Quiz warning for ${quiz.title}:`, quizError.message);
        continue;
      }
      
      // Insert questions
      for (const question of questions) {
        const { error: questionError } = await supabaseAdmin
          .from('questions')
          .upsert({
            ...question,
            quiz_id: quiz.quiz_id
          }, { onConflict: 'question_id' });
          
        if (questionError) {
          logger.warn(`Question warning:`, questionError.message);
        }
      }
      
      logger.info(`✓ Quiz loaded: ${quiz.title} (${questions.length} questions)`);
    }
    
    // 6. Create demo game sessions (ready to join)
    const demoGameSessions = [
      {
        session_id: '550e8400-e29b-41d4-a716-446655440070',
        school_id: schoolId,
        quiz_id: '550e8400-e29b-41d4-a716-446655440030',
        host_id: '550e8400-e29b-41d4-a716-446655440003',
        format: 'trivia_lightning',
        status: 'waiting',
        settings_json: {
          session_code: 'DEMO01',
          max_players: 30,
          time_limit: 30,
          show_correct_answers: true,
          shuffle_questions: true,
          shuffle_options: true,
          accessibility_mode: true,
          tts_enabled: true,
          total_questions: 5
        },
        title: 'Matemática Básica - Juego Demo'
      },
      {
        session_id: '550e8400-e29b-41d4-a716-446655440071',
        school_id: schoolId,
        quiz_id: '550e8400-e29b-41d4-a716-446655440040',
        host_id: '550e8400-e29b-41d4-a716-446655440003',
        format: 'color_match',
        status: 'waiting',
        settings_json: {
          session_code: 'DEMO02',
          max_players: 25,
          time_limit: 25,
          show_correct_answers: true,
          shuffle_questions: false,
          shuffle_options: true,
          accessibility_mode: true,
          tts_enabled: true,
          total_questions: 5
        },
        title: 'Lenguaje - Color Match Demo'
      },
      {
        session_id: '550e8400-e29b-41d4-a716-446655440072',
        school_id: schoolId,
        quiz_id: '550e8400-e29b-41d4-a716-446655440050',
        host_id: '550e8400-e29b-41d4-a716-446655440003',
        format: 'board_race',
        status: 'waiting',
        settings_json: {
          session_code: 'DEMO03',
          max_players: 20,
          time_limit: 20,
          show_correct_answers: true,
          shuffle_questions: true,
          shuffle_options: false,
          accessibility_mode: true,
          tts_enabled: false,
          total_questions: 4
        },
        title: 'Ciencias - Board Race Demo'
      },
      {
        session_id: 'oa1-mat-evaluar', // Using the game ID as session ID for direct access
        school_id: schoolId,
        quiz_id: '550e8400-e29b-41d4-a716-446655440030', // Re-using math quiz
        host_id: '550e8400-e29b-41d4-a716-446655440003',
        format: 'custom', // Custom format for engine-based games
        engine_id: 'ENG01',
        status: 'active', // Set to active so it can be played directly
        settings_json: {
          session_code: 'OA1EVAL',
          max_players: 1,
          time_limit: 999,
          specialized_component: 'FarmCountingGameOA1Evaluar',
          theme: 'granja_oa1_v2',
          version: '2.0',
          total_questions: 5
        },
        title: 'OA1 MAT - Evaluar (Demo)'
      },
      {
        session_id: 'oa1-mat-crear', // Using the game ID as session ID for direct access
        school_id: schoolId,
        quiz_id: '550e8400-e29b-41d4-a716-446655440030', // Re-using math quiz
        host_id: '550e8400-e29b-41d4-a716-446655440003',
        format: 'custom',
        engine_id: 'ENG01',
        status: 'active', // Set to active so it can be played directly
        settings_json: {
          session_code: 'OA1CREAR',
          max_players: 1,
          time_limit: 999,
          specialized_component: 'FarmCountingGameOA1Crear',
          theme: 'granja_oa1_v2',
          version: '2.0',
          total_questions: 5
        },
        title: 'OA1 MAT - Crear (Demo)'
      }
    ];
    
    for (const session of demoGameSessions) {
      const { error: sessionError } = await supabaseAdmin
        .from('game_sessions')
        .upsert(session, { onConflict: 'session_id' });
        
      if (sessionError) {
        logger.warn(`Game session warning:`, sessionError.message);
      } else {
        logger.info(`✓ Game session ready: ${session.title} (Code: ${session.settings_json.session_code})`);
      }
    }
    
    logger.info('🎮 DEMO DATA LOADED SUCCESSFULLY! 🎮');
    logger.info('');
    logger.info('=== READY TO PLAY GAMES ===');
    logger.info('Login credentials:');
    logger.info('Teacher: teacher@demo.edu21.cl / demo123');
    logger.info('Admin: admin@demo.edu21.cl / demo123');
    logger.info('Students: estudiante1@demo.edu21.cl / demo123');
    logger.info('');
    logger.info('Available Game Sessions:');
    logger.info('• DEMO01 - Matemática Básica (Trivia Lightning)');
    logger.info('• DEMO02 - Lenguaje (Color Match)');
    logger.info('• DEMO03 - Ciencias (Board Race)');
    logger.info('');
    logger.info('Available Quizzes for new games:');
    logger.info('• 🧮 Matemática Básica - Operaciones (5 questions)');
    logger.info('• 📚 Lenguaje - Comprensión Lectora (5 questions)');
    logger.info('• 🔬 Ciencias - El Cuerpo Humano (4 questions)');
    logger.info('• 🌍 Historia - Chile y América (4 questions)');
    logger.info('================================');
    
  } catch (error) {
    logger.error('Demo data loading failed:', error);
    throw error;
  }
}

module.exports = {
  loadDemoData
};
