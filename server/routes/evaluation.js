const express = require('express');
const { supabase } = require('../database/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { mockGameData } = require('../services/mockGameData'); // ✅ Import global
const router = express.Router();

// Temporary storage for gamified evaluations (until database is fully working)
const gamifiedEvaluationsStore = new Map();

// ================================
// LEARNING OBJECTIVES (OA) SEARCH
// ================================

/**
 * GET /evaluation/search-oa
 * Search learning objectives by grade, subject, and text
 */
router.get('/search-oa', authenticateToken, async (req, res) => {
    try {
        const { 
            grade_code, 
            subject_id, 
            search = '', 
            semester,
            bloom_level,
            limit = 20 
        } = req.query;

        // Build the query
        let query = supabase
            .from('learning_objectives')
            .select(`
                oa_id,
                oa_code,
                oa_desc,
                oa_short_desc,
                bloom_level,
                semester,
                complexity_level,
                estimated_hours,
                grade_levels!inner(grade_name),
                subjects!inner(subject_name, subject_color)
            `)
            .is('deprecated_at', null);

        // Apply filters
        if (grade_code) {
            query = query.eq('grade_code', grade_code);
        }

        if (subject_id) {
            query = query.eq('subject_id', subject_id);
        }

        if (semester) {
            query = query.eq('semester', parseInt(semester));
        }

        if (bloom_level) {
            query = query.eq('bloom_level', bloom_level);
        }

        // Text search
        if (search.trim()) {
            query = query.or(`oa_desc.ilike.%${search}%,oa_short_desc.ilike.%${search}%,oa_code.ilike.%${search}%`);
        }

        // Order and limit
        query = query.order('oa_code').limit(parseInt(limit));

        const { data: oas, error } = await query;

        if (error) throw error;

        // Group by subject for better organization
        const groupedOAs = oas.reduce((acc, oa) => {
            const subjectName = oa.subjects?.subject_name || 'Sin materia';
            if (!acc[subjectName]) {
                acc[subjectName] = {
                    subject_name: subjectName,
                    subject_color: oa.subjects?.subject_color,
                    oas: []
                };
            }
            acc[subjectName].oas.push(oa);
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                oas: oas || [],
                grouped: groupedOAs,
                total: oas?.length || 0,
                filters: {
                    grade_code,
                    subject_id,
                    search,
                    semester,
                    bloom_level
                }
            }
        });

    } catch (error) {
        console.error('Search OAs error:', error);
        res.status(500).json({
            success: false,
            error: 'Error al buscar objetivos de aprendizaje',
            details: error.message
        });
    }
});

// ================================
// EVALUATION MANAGEMENT ROUTES
// ================================

/**
 * POST /evaluation
 * Create new evaluation (quiz/exam/task/gamified)
 * User Story: P1-T-10, P1-T-11
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const {
      class_id,
      quiz_id,
      title,
      description,
      type, // 'quiz', 'exam', 'task', 'gamified'
      mode = 'manual', // 'manual', 'ai'
      weight = 0.0,
      total_points = 100,
      grading_scale,
      rubric_json = {},
      attempt_limit = 1,
      time_limit_minutes,
      serious = false, // Lockdown mode
      allow_review = true,
      available_from,
      available_until,
      due_date,
      // New fields for gamified evaluations
      game_format,
      engine_id,
      skin_theme,
      engine_config = {}
    } = req.body;

    // Validate permissions
    if (!['teacher', 'admin_escolar'].includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Validate gamified evaluation requirements - ENGINE-FOCUSED
    if (type === 'gamified') {
      if (!engine_id) {
        return res.status(400).json({ 
          error: 'Gamified evaluations require engine_id (engine IS the format)' 
        });
      }
      
      const validGameTemplates = ['FarmCountingGameOA1Analyze', 'Oa1MatAplicarGame']; // Add more as they are created
      
      if (!validGameTemplates.includes(engine_id)) {
        return res.status(400).json({ 
          error: `Invalid game template ID. Valid templates are: ${validGameTemplates.join(', ')}` 
        });
      }
      
      // AUTO-SET game_format to engine_id (engines ARE the formats)
      game_format = engine_id;
    }

    // Default Chilean grading scale (1-7)
    const defaultGradingScale = {
      "1": 0, "2": 20, "3": 40, "4": 55, 
      "5": 70, "6": 85, "7": 100
    };

    const evaluationData = {
      school_id: user.school_id,
      class_id,
      teacher_id: user.user_id,
      quiz_id: quiz_id || null,
      title,
      description,
      type,
      mode,
      weight,
      total_points,
      grading_scale: grading_scale || defaultGradingScale,
      rubric_json,
      attempt_limit,
      time_limit_minutes,
      serious,
      allow_review,
      available_from,
      available_until,
      due_date,
      status: 'draft',
      // Add gamified fields
      game_format: type === 'gamified' ? game_format : null,
      engine_id: type === 'gamified' ? engine_id : null,
      skin_theme: type === 'gamified' ? skin_theme : null,
      engine_config: type === 'gamified' ? engine_config : {}
    };

    // Generate a proper UUID for evaluation_id
    const evaluationId = `eval_gamified_${Date.now()}`;
    
    const evaluation = {
      evaluation_id: evaluationId,
      ...evaluationData,
      created_at: new Date().toISOString()
    };

    res.status(201).json({ 
      success: true, 
      evaluation,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} evaluation created successfully` 
    });

  } catch (error) {
    console.error('Error creating evaluation:', error);
    res.status(500).json({ error: 'Failed to create evaluation' });
  }
});

/**
 * GET /evaluation/:id
 * Get evaluation details
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    console.log(`🔍 GET /api/evaluation/${id} - Fetching evaluation details`);

    // For gamified evaluations, check temporary storage first
    if (id.startsWith('eval_gamified_')) {
      console.log(`🔍 GET /api/evaluation/${id} - Fetching evaluation details`);
      console.log(`🔍 Looking for gamified evaluation ${id} in temporary storage`);
      console.log(`📊 Current storage size: ${gamifiedEvaluationsStore.size} evaluations`);
      console.log(`🗂️ Available keys: [${Array.from(gamifiedEvaluationsStore.keys()).join(', ')}]`);
      
      // Check temporary storage for real data
      if (gamifiedEvaluationsStore.has(id)) {
        const storedEvaluation = gamifiedEvaluationsStore.get(id);
        console.log(`✅ FOUND EVALUATION IN STORAGE:`, {
          id: storedEvaluation.evaluation_id,
          title: storedEvaluation.title,
          questionCount: storedEvaluation.questions?.length,
          hasQuestions: !!storedEvaluation.questions,
          firstQuestionText: storedEvaluation.questions?.[0]?.text,
          firstQuestionAnswer: storedEvaluation.questions?.[0]?.correct_answer
        });
        return res.json({ evaluation: storedEvaluation });
      }
      
      // Fallback to mock data if not found in storage
      console.log(`❌ EVALUATION ${id} NOT FOUND in temporary storage`);
      console.log(`🔍 Exact key match test: ${gamifiedEvaluationsStore.has(id)}`);
      console.log(`⚠️ Using fallback mock data`);
      const mockEvaluation = {
        evaluation_id: id,
        id: id,
        eval_id: id,
        title: "Evaluación no encontrada",
        description: "Esta evaluación no se encontró en el almacén temporal",
        type: "gamified",
        mode: "ai",
        difficulty: "easy",
        game_format: "trivia_lightning",
        engine_id: "ENG01",
        skin_theme: "granja",
        is_gamified: true,
        question_count: 3,
        time_limit_minutes: 30,
        status: "published",
        created_at: new Date().toISOString(),
        school_id: user.school_id,
        class_id: "mock-class-1",
        creator_id: user.user_id,
        questions: [
          {
            id: 1,
            question: "¿Cuántos pollitos hay en la imagen?",
            type: "multiple_choice",
            options: ["2", "3", "4", "5"],
            correctAnswer: "3",
            points: 10
          },
          {
            id: 2,
            question: "¿Qué animal dice 'muu'?",
            type: "multiple_choice", 
            options: ["Cerdo", "Vaca", "Oveja", "Gallina"],
            correctAnswer: "Vaca",
            points: 10
          },
          {
            id: 3,
            question: "Cuenta las manzanas en el árbol",
            type: "short_answer",
            correctAnswer: "5",
            points: 10
          }
        ],
        engine_config: {
          theme: "granja",
          difficulty_level: "easy",
          content_focus: ["counting", "animals", "farm"]
        }
      };

      console.log(`📦 Returning fallback evaluation for ${id}`);
      return res.json({ evaluation: mockEvaluation });
    }

    // Try database lookup for non-gamified evaluations
    try {
      const { data: evaluation, error } = await supabase
        .from('evaluations')
        .select(`*`)
        .eq('evaluation_id', id)
        .eq('school_id', user.school_id)
        .single();

      if (error) {
        console.log(`⚠️  Database lookup failed: ${error.message}, using mock mode`);
        return res.status(404).json({ error: 'Evaluation not found' });
      }
      
      if (!evaluation) {
        return res.status(404).json({ error: 'Evaluation not found' });
      }

      console.log(`✅ Found evaluation in DB: ${evaluation.title}`);
      res.json({ 
        evaluation: {
          ...evaluation,
          id: evaluation.evaluation_id,
          eval_id: evaluation.evaluation_id
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(404).json({ error: 'Evaluation not found' });
    }

  } catch (error) {
    console.error('Error fetching evaluation:', error);
    res.status(500).json({ error: 'Failed to fetch evaluation' });
  }
});

/**
 * POST /evaluation/:id/launch
 * Launch evaluation and create attempt token
 * User Story: P1-T-07 (Lockdown mode)
 */
router.post('/:id/launch', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { student_id } = req.body;

    // Get evaluation details
    const { data: evaluation, error: evalError } = await supabase
      .from('evaluations')
      .select('*')
      .eq('evaluation_id', id)
      .eq('school_id', user.school_id)
      .single();

    if (evalError) throw evalError;
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }

    if (evaluation.status !== 'published') {
      return res.status(400).json({ error: 'Evaluation is not published' });
    }

    // Check if within available time window
    const now = new Date();
    if (evaluation.available_from && new Date(evaluation.available_from) > now) {
      return res.status(400).json({ error: 'Evaluation not yet available' });
    }
    if (evaluation.available_until && new Date(evaluation.available_until) < now) {
      return res.status(400).json({ error: 'Evaluation is no longer available' });
    }

    // Check existing attempts
    const targetStudentId = student_id || user.user_id;
    const { data: existingAttempts, error: attemptError } = await supabase
      // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED
      .select('*')
      .eq('eval_id', id)
      .eq('student_id', targetStudentId);

    if (attemptError) throw attemptError;

    if (existingAttempts.length >= evaluation.attempt_limit) {
      return res.status(400).json({ error: 'Maximum attempts reached' });
    }

    // Generate anti-cheat seed for lockdown mode
    const antiCheatSeed = evaluation.serious ? 
      Math.random().toString(36).substring(2, 15) : null;

    // Create new attempt
    const attemptData = {
      eval_id: id,
      student_id: targetStudentId,
      attempt_number: existingAttempts.length + 1,
      max_score: evaluation.total_points,
      proctored: evaluation.serious,
      anti_cheat_seed: antiCheatSeed,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      status: 'in_progress'
    };

    const { data: attempt, error } = await supabase
      // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED
      .insert(attemptData)
      .select('*')
      .single();

    if (error) throw error;

    res.json({ 
      success: true, 
      attempt_id: attempt.attempt_id,
      evaluation: {
        ...evaluation,
        lockdown_mode: evaluation.serious,
        shuffle_seed: antiCheatSeed
      }
    });

  } catch (error) {
    console.error('Error launching evaluation:', error);
    res.status(500).json({ error: 'Failed to launch evaluation' });
  }
});

/**
 * POST /evaluation/:id/submit
 * Submit evaluation attempt
 */
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { attempt_id, responses } = req.body;

    // Verify attempt belongs to user
    const { data: attempt, error: attemptError } = await supabase
      // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED
      .select('*')
      .eq('attempt_id', attempt_id)
      .eq('eval_id', id)
      .eq('student_id', user.user_id)
      .single();

    if (attemptError) throw attemptError;
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.status !== 'in_progress') {
      return res.status(400).json({ error: 'Attempt already submitted' });
    }

    // Calculate time taken
    const timeTaken = Math.floor((new Date() - new Date(attempt.started_at)) / 60000); // minutes

    // Process responses and calculate score
    let totalScore = 0;
    let totalPossible = 0;

    for (const response of responses) {
      const { question_id, response_text, response_json } = response;

      // Get question details for scoring
      const { data: question } = await supabase
        .from('questions')
        .select('*')
        .eq('question_id', question_id)
        .single();

      if (question) {
        const isCorrect = checkAnswer(question, response_text, response_json);
        const pointsEarned = isCorrect ? question.points : 0;

        totalScore += pointsEarned;
        totalPossible += question.points;

        // Save individual response
        await supabase
          .from('question_responses')
          .insert({
            attempt_id,
            question_id,
            response_text,
            response_json,
            is_correct: isCorrect,
            points_earned: pointsEarned
          });
      }
    }

    const percentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

    // Update attempt
    const { error: updateError } = await supabase
      // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED
      .update({
        score_raw: totalScore,
        percentage,
        finished_at: new Date().toISOString(),
        time_taken_minutes: timeTaken,
        status: 'submitted',
        auto_graded: true
      })
      .eq('attempt_id', attempt_id);

    if (updateError) throw updateError;

    // Get evaluation for grading scale
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('grading_scale')
      .eq('eval_id', id)
      .single();

    // Calculate Chilean grade (1-7)
    const nota10 = calculateChileanGrade(percentage, evaluation.grading_scale);

    // Create gradebook entry
    await supabase
      .from('gradebook_entries')
      .insert({
        school_id: user.school_id,
        class_id: attempt.class_id || null,
        student_id: user.user_id,
        eval_id: id,
        nota_10: nota10,
        score_raw: totalScore,
        percentage,
        recorded_by: user.user_id
      });

    res.json({ 
      success: true, 
      score: totalScore,
      total_possible: totalPossible,
      percentage,
      grade: nota10,
      message: 'Evaluation submitted successfully' 
    });

  } catch (error) {
    console.error('Error submitting evaluation:', error);
    res.status(500).json({ error: 'Failed to submit evaluation' });
  }
});

/**
 * POST /evaluation/:id/grade
 * Manual grading (for essays/tasks)
 * User Story: P1-T-11
 */
router.post('/:id/grade', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { student_id, score, feedback, attempt_id } = req.body;

    // Validate teacher permissions
    if (!['teacher', 'admin_escolar'].includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Update attempt
    const { error: attemptError } = await supabase
      // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED
      .update({
        score_raw: score,
        status: 'graded',
        finished_at: new Date().toISOString()
      })
      .eq('attempt_id', attempt_id);

    if (attemptError) throw attemptError;

    // Get evaluation for grading scale
    const { data: evaluation } = await supabase
      .from('evaluations')
      .select('grading_scale, total_points, class_id')
      .eq('eval_id', id)
      .single();

    const percentage = (score / evaluation.total_points) * 100;
    const nota10 = calculateChileanGrade(percentage, evaluation.grading_scale);

    // Update or create gradebook entry
    const { error: gradebookError } = await supabase
      .from('gradebook_entries')
      .upsert({
        school_id: user.school_id,
        class_id: evaluation.class_id,
        student_id,
        eval_id: id,
        nota_10: nota10,
        score_raw: score,
        percentage,
        notes: feedback,
        recorded_by: user.user_id
      });

    if (gradebookError) throw gradebookError;

    res.json({ 
      success: true, 
      grade: nota10,
      message: 'Evaluation graded successfully' 
    });

  } catch (error) {
    console.error('Error grading evaluation:', error);
    res.status(500).json({ error: 'Failed to grade evaluation' });
  }
});

/**
 * GET /evaluation/:id/report
 * Generate evaluation report (PDF/CSV)
 */
router.get('/:id/report', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { format = 'json' } = req.query;

    // Get evaluation with attempts and grades
    const { data: evaluation, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        // // evaluation_attempts( // TEMPORARILY DISABLED // TEMPORARILY DISABLED
          *,
          users!evaluation_attempts_student_id_fkey(first_name, last_name, email)
        ),
        gradebook_entries(
          *,
          users!gradebook_entries_student_id_fkey(first_name, last_name)
        )
      `)
      .eq('eval_id', id)
      .eq('school_id', user.school_id)
      .single();

    if (error) throw error;

    // Calculate statistics
    const attempts = evaluation.evaluation_attempts || [];
    const grades = evaluation.gradebook_entries || [];
    
    const stats = {
      total_students: grades.length,
      average_grade: grades.length > 0 ? 
        grades.reduce((sum, g) => sum + g.nota_10, 0) / grades.length : 0,
      completion_rate: attempts.filter(a => a.status === 'submitted' || a.status === 'graded').length / attempts.length,
      grade_distribution: calculateGradeDistribution(grades)
    };

    const report = {
      evaluation,
      statistics: stats,
      attempts,
      grades
    };

    if (format === 'csv') {
      // Generate CSV format
      const csv = generateCSVReport(report);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="evaluation_${id}_report.csv"`);
      return res.send(csv);
    }

    res.json({ report });

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/**
 * GET /evaluations
 * List evaluations for teacher/class
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { class_id, status, type } = req.query;

    let query = supabase
      .from('evaluations')
      .select(`
        *,
        classes(class_name, grade_code),
        quizzes(title),
        // // evaluation_attempts( // TEMPORARILY DISABLED // TEMPORARILY DISABLEDattempt_id),
        gradebook_entries(nota_10)
      `)
      .eq('school_id', user.school_id);

    if (user.role === 'teacher') {
      query = query.eq('teacher_id', user.user_id);
    }

    if (class_id) query = query.eq('class_id', class_id);
    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);

    const { data: evaluations, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ evaluations });

  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

// ===============================================
// GAMIFIED EVALUATIONS ENDPOINTS
// ===============================================

/**
 * POST /evaluation/gamified
 * Create gamified evaluation with AI content generation
 * Teacher selects: OA + grade + format + engine + skin → AI generates game content
 */
router.post('/gamified', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const {
      class_id,
      title,
      description,
      oa_codes = [],
      difficulty = 'medium',
      question_count = 10,
      game_format,
      engine_id,
      skin_theme = 'default',
      time_limit_minutes = 30,
      weight = 10,
      attempt_limit = 1,
      manual_question_ids = [] // ✅ NEW: Accept manual question IDs
    } = req.body;

    // Validate permissions
    const userRole = user.role?.toLowerCase();
    if (!['teacher', 'admin_escolar'].includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Validate required fields
    if (!class_id || !title || !game_format || !engine_id) {
      return res.status(400).json({ 
        error: 'Required fields: class_id, title, game_format, engine_id' 
      });
    }

    // If no manual questions are provided, OA codes are required for AI generation
    if (manual_question_ids.length === 0 && oa_codes.length === 0) {
      return res.status(400).json({ 
        error: 'At least one learning objective (OA) or one manual question is required.' 
      });
    }

    console.log(`🎮 Creating gamified evaluation: ${game_format} + ${engine_id} + ${skin_theme}`);
    console.log(` MANUAL QUESTIONS: ${manual_question_ids.length}`);
    console.log(` AI-TARGETED OAs: ${oa_codes.join(', ')}`);

    let finalQuestions = [];
    let processingTime = 'N/A';

    // --- 1. Fetch Manual Questions ---
    if (manual_question_ids.length > 0) {
      console.log(`🔍 Fetching ${manual_question_ids.length} manual questions from question_bank...`);
      const { data: manualQuestions, error: manualError } = await supabase
        .from('question_bank')
        .select('*')
        .in('question_id', manual_question_ids);

      if (manualError) {
        console.error('❌ Error fetching manual questions:', manualError);
        return res.status(500).json({ error: 'Failed to fetch manual questions', details: manualError.message });
      }

      // ✅ Adapt fetched questions to the format expected by the game engine
      finalQuestions = manualQuestions.map(q => ({
        id: q.question_id,
        text: q.question_text,
        options: q.options_json,
        correct_answer: q.correct_answer,
        explanation: q.explanation_text,
        points: q.points || 10, // Default points
        type: q.question_type,
        bloom_level: q.bloom_level,
        source: 'manual'
      }));
      console.log(`✅ Successfully fetched ${finalQuestions.length} manual questions.`);
    }

    // --- 2. Generate AI Questions (if needed) ---
    const remainingQuestionsCount = question_count - finalQuestions.length;
    if (remainingQuestionsCount > 0 && oa_codes.length > 0) {
      console.log(`🤖 Need to generate ${remainingQuestionsCount} additional questions with AI...`);
      const aiService = require('../services/aiService');
      
      const gameContent = await aiService.generateGameContent({
        gameFormat: game_format,
        engineId: engine_id,
        title: title,
        description: description,
        oaCodes: oa_codes,
        difficulty: difficulty,
        questionCount: remainingQuestionsCount, // Generate only the remainder
        skinTheme: skin_theme,
        schoolId: user.school_id,
        userId: user.user_id
      });

      processingTime = gameContent.processingTime || 'N/A';
      const aiQuestions = gameContent.questions || [];

      // --- Save AI-generated questions to question_bank ---
      if (aiQuestions.length > 0) {
        console.log(`💾 Saving ${aiQuestions.length} AI-generated questions to question_bank...`);
        const questionsToInsert = aiQuestions.map(q => ({
          question_text: q.text || q.question,
          question_type: q.type || 'multiple_choice', // Default type
          options_json: q.options || [],
          correct_answer: q.correct_answer || q.correctAnswer,
          explanation_text: q.explanation || '',
          oa_id: q.oa_id || oa_codes[0] || 'N/A', // Use AI-provided OA or first requested OA
          skill_tags: q.skill_tags || [],
          bloom_level: q.bloom_level || 'Aplicar', // Use AI-provided Bloom or default
          difficulty_score: mapDifficultyToScore(q.difficulty || difficulty),
          is_validated: false, // AI-generated questions need manual validation
          is_ai_generated: true,
          author_id: user.user_id // Teacher who generated them
        }));

        const { data: insertedQuestions, error: insertError } = await supabase
          .from('question_bank')
          .insert(questionsToInsert)
          .select('question_id'); // Select only the IDs of inserted questions

        if (insertError) {
          console.error('❌ Error saving AI-generated questions to question_bank:', insertError);
          // Continue without saving to DB, but log the error
        } else {
          console.log(`✅ Successfully saved ${insertedQuestions.length} AI-generated questions to question_bank.`);
          // Update aiQuestions with the new question_ids from the database
          aiQuestions.forEach((q, index) => {
            if (insertedQuestions[index]) {
              q.id = insertedQuestions[index].question_id; // Assign the new UUID
            }
            q.source = 'ai'; // Mark AI questions
          });
        }
      }

      finalQuestions = [...finalQuestions, ...aiQuestions];
      console.log(`✅ AI generated ${aiQuestions.length} questions. Total questions now: ${finalQuestions.length}`);
    }

    // --- 3. Create Evaluation Record ---
    const evaluationData = {
      evaluation_id: 'eval_gamified_' + Date.now(),
      school_id: user.school_id,
      class_id: class_id,
      teacher_id: user.user_id,
      title: title,
      description: description || `Evaluación gamificada: ${game_format} con ${engine_id}`,
      type: 'gamified',
      mode: manual_question_ids.length > 0 ? (oa_codes.length > 0 ? 'hybrid' : 'manual') : 'ai',
      weight: weight,
      total_points: finalQuestions.length * 10, // Based on final question count
      attempt_limit: attempt_limit,
      time_limit_minutes: time_limit_minutes,
      game_format: game_format,
      engine_id: engine_id,
      skin_theme: skin_theme,
      engine_config: {
        difficulty: difficulty,
        requestedQuestionCount: question_count,
        actualQuestionCount: finalQuestions.length,
        skinTheme: skin_theme,
        oaCodes: oa_codes,
        manualQuestionIds: manual_question_ids, // For traceability
        generatedAt: new Date().toISOString(),
        aiGeneratedContent: remainingQuestionsCount > 0
      },
      status: 'draft',
      created_at: new Date().toISOString()
    };

    // --- 4. Persist Evaluation to DB (optional, for now) ---
    console.log(`💾 Saving evaluation ${evaluationData.evaluation_id} to database`);
    // 🚨 FIX: Check if Supabase is available before using it
    if (supabase && supabase.from) {
      const { data: savedEvaluation, error: saveError } = await supabase
        .from('evaluations')
        .insert([{
          eval_id: evaluationData.evaluation_id,
          school_id: evaluationData.school_id,
          class_id: evaluationData.class_id,
          teacher_id: evaluationData.teacher_id,
          title: evaluationData.title,
          description: evaluationData.description,
          type: evaluationData.type,
          mode: evaluationData.mode,
          weight: evaluationData.weight,
          total_points: evaluationData.total_points,
          attempt_limit: evaluationData.attempt_limit,
          time_limit_minutes: evaluationData.time_limit_minutes,
          status: evaluationData.status,
          created_at: evaluationData.created_at,
          // 🎮 GAMIFIED FIELDS - Include all required fields
          game_format: evaluationData.game_format,
          engine_id: evaluationData.engine_id,
          skin_theme: evaluationData.skin_theme,
          engine_config: evaluationData.engine_config
        }])
        .select()
        .single();

      if (saveError) {
        console.error('❌ Error saving evaluation to database:', saveError);
        console.log('⚠️ Continuing with mock data - evaluation still functional');
      } else {
        console.log(`✅ Evaluation saved successfully with ID: ${savedEvaluation.eval_id}`);
      }
    } else {
      console.log('⚠️ Supabase not available, using mock mode only');
      console.log(`✅ Evaluation ${evaluationData.evaluation_id} created in mock mode`);
    }

    console.log(`✅ Generated ${finalQuestions.length || 0} questions for ${game_format}`);

    // 🎨 APPLY DYNAMIC CONTENT TRANSFORMATION based on skin
    let transformedQuestions = [...finalQuestions]; // Use the combined list
    console.log(`🔄 TRANSFORMATION CHECK: skin_theme="${skin_theme}", questions.length=${transformedQuestions.length}`);
    
    if (skin_theme && skin_theme !== 'default' && transformedQuestions.length > 0) {
      console.log(`🔄 APPLYING CONTENT TRANSFORMATION for skin: ${skin_theme}`);
      
      try {
        const { transformGameContentWithSkin } = require('../services/dynamicSkinContentTransformer');
        const { skinSystemService } = require('../services/skinSystemData');
        
        // Find the correct skin ID
        let skinId = null;
        const allSkinsResult = skinSystemService.getAllSkins();
        if (allSkinsResult.success) {
          const matchingSkin = allSkinsResult.data.find(skin => 
            skin.category === skin_theme || 
            skin.name.toLowerCase().includes(skin_theme) ||
            skin.id.includes(skin_theme)
          );
          
          if (matchingSkin) {
            skinId = matchingSkin.id;
          } else if (skin_theme === 'espacio') {
            skinId = 'skin-math-001';
          } else if (skin_theme === 'granja') {
            skinId = 'skin-1b-farm';
          }
        }
        
        if (skinId) {
          // Create mock session structure for transformation
          const mockSession = {
            quizzes: {
              questions: transformedQuestions.map((q, index) => ({
                question_id: q.id || `q${index}`,
                question_order: index + 1,
                stem_md: q.text || q.question,
                type: q.type || 'multiple_choice',
                options_json: q.options || [],
                correct_answer: q.correct_answer || q.correctAnswer,
                explanation: q.explanation || '',
                points: q.points || 10,
                difficulty: q.difficulty || difficulty,
                bloom_level: q.bloom_level || 'Aplicar'
              }))
            }
          };
          
                     // Apply transformation with REAL numeric context from title
           const aiService = require('../services/aiService');
           const realNumericContext = aiService.extractNumericContext(title);
           console.log(`🔢 REAL NUMERIC CONTEXT for transformation:`, realNumericContext);
           
           const transformedSession = transformGameContentWithSkin(mockSession, { skin_id: skinId }, realNumericContext);
          
          if (transformedSession.content_transformed) {
            transformedQuestions = transformedSession.quizzes.questions.map(q => ({
              id: q.question_id,
              text: q.stem_md,
              options: q.options_json,
              correct_answer: q.correct_answer,
              explanation: q.explanation,
              points: q.points,
              engine_data: {
                engine_id: engine_id,
                counting_target: parseInt(q.correct_answer),
                visual_support: true,
                numeric_context: `números de ${title}`
              },
              skin_context: q.space_context || q.farm_context || {}
            }));
            
            console.log(`✨ CONTENT TRANSFORMED! Questions now use ${skin_theme} theme`);
            console.log(`📝 Sample question: "${transformedQuestions[0]?.text}"`);
          }
        }
        
      } catch (transformError) {
        console.error('🔄 Error applying content transformation:', transformError);
        // Continue with original questions
      }
    }

    // --- 6. Store Complete Evaluation in Memory ---
    const completeEvaluationData = {
      ...evaluationData,
      questions: transformedQuestions,
      id: evaluationData.evaluation_id,
      eval_id: evaluationData.evaluation_id,
      question_count: transformedQuestions.length,
      total_points: transformedQuestions.length * 10
    };
    
    gamifiedEvaluationsStore.set(evaluationData.evaluation_id, completeEvaluationData);
    console.log(`✅ SUCCESSFULLY stored evaluation ${evaluationData.evaluation_id} with ${transformedQuestions.length} questions`);

    // --- 7. Send Response ---
    res.status(201).json({
      success: true,
      evaluation: evaluationData,
      message: `Gamified evaluation created successfully with ${finalQuestions.length} questions`,
      metadata: {
        aiGenerated: remainingQuestionsCount > 0,
        manualQuestions: manual_question_ids.length,
        totalQuestions: finalQuestions.length,
        processingTime: processingTime,
        engineUsed: engine_id,
        skinApplied: skin_theme
      }
    });

  } catch (error) {
    console.error('❌ Error creating gamified evaluation:', error);
    res.status(500).json({ 
      error: 'Failed to create gamified evaluation',
      details: error.message 
    });
  }
});

/**
 * GET /evaluation/gamified/:id/play
 * Launch gamified evaluation for student play
 */
router.get('/gamified/:id/play', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    // In production, fetch from database
    // For now, generate mock play session
    const playSession = {
      session_id: 'session_' + Date.now(),
      evaluation_id: id,
      student_id: user.user_id,
      status: 'active',
      started_at: new Date().toISOString(),
      game_state: {
        currentQuestion: 1,
        score: 0,
        timeRemaining: 1800, // 30 minutes
        skinTheme: 'granja'
      }
    };

    res.json({
      success: true,
      playSession: playSession,
      message: 'Gamified evaluation session started'
    });

  } catch (error) {
    console.error('Error launching gamified evaluation:', error);
    res.status(500).json({ error: 'Failed to launch gamified evaluation' });
  }
});

/**
 * POST /evaluation/gamified/:id/start-game
 * Create a game session from a gamified evaluation for teacher-led gameplay
 */
router.post('/gamified/:id/start-game', authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    console.log(`🎮 Creating game session from gamified evaluation: ${id}`);
    console.log(`🔍 DEBUG: mockGameData available: ${mockGameData ? 'YES' : 'NO'}`);
    console.log(`🔍 DEBUG: addGameSession method: ${mockGameData?.addGameSession ? 'YES' : 'NO'}`);
    console.log(`🔍 DEBUG: Current sessions count: ${mockGameData?.gameSessions?.length || 'UNKNOWN'}`);

    // Validate permissions
    const userRole = user.role?.toLowerCase();
    if (!['teacher', 'admin_escolar'].includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Get the gamified evaluation from temporary storage
    console.log(`🔍 Looking for evaluation ${id} in temporary storage`);
    const evaluationData = gamifiedEvaluationsStore.get(id);
    
    if (!evaluationData) {
      console.log(`❌ Evaluation ${id} not found in temporary storage`);
      return res.status(404).json({ error: 'Gamified evaluation not found' });
    }

    console.log(`✅ Found evaluation: ${evaluationData.title} with ${evaluationData.questions?.length || 0} questions`);

    // Generate unique game session ID and join code
    const gameSessionId = `game_${Date.now()}`;
    const joinCode = `GM${Math.floor(1000 + Math.random() * 9000)}`;

    // Create game session data structure compatible with the game system
    const gameSession = {
      session_id: gameSessionId,
      quiz_id: `quiz_${evaluationData.evaluation_id}`, // Create virtual quiz ID
      school_id: evaluationData.school_id,
      host_id: evaluationData.teacher_id,
      class_id: evaluationData.class_id, // Ensure class_id is passed
      join_code: joinCode,
      title: evaluationData.title,
      description: evaluationData.description || `Juego basado en evaluación: ${evaluationData.title}`,
      format: evaluationData.game_format,
      status: 'waiting',
      engine_id: evaluationData.engine_id,
      engine_name: getEngineName(evaluationData.engine_id),
      settings_json: {
        max_players: 30,
        time_limit: 30,
        time_limit_minutes: evaluationData.time_limit_minutes || 30,
        show_correct_answers: true,
        accessibility_mode: true,
        tts_enabled: true,
        difficulty: evaluationData.engine_config?.difficulty || 'medium',
        question_count: evaluationData.questions?.length || 0,
        skin_theme: evaluationData.skin_theme || 'default'
      },
      created_at: new Date().toISOString(),
      
      // Virtual quiz data structure for the game system
      quizzes: {
        quiz_id: `quiz_${evaluationData.evaluation_id}`,
        title: evaluationData.title,
        description: evaluationData.description,
        questions: evaluationData.questions ? evaluationData.questions.map((q, index) => ({
          question_id: q.id || `q_${index}`,
          question_order: index + 1,
          stem_md: q.text || q.question,
          type: q.type || 'multiple_choice',
          options_json: q.options || [],
          correct_answer: q.correct_answer || q.correctAnswer,
          explanation: q.explanation || `Respuesta correcta: ${q.correct_answer || q.correctAnswer}`,
          points: q.points || 10,
          difficulty: q.difficulty || evaluationData.engine_config?.difficulty || 'medium',
          bloom_level: q.bloom_level || 'Aplicar',
          tts_url: null
        })) : []
      },
      
      hosts: {
        user_id: evaluationData.teacher_id,
        first_name: user.first_name || 'Profesor',
        last_name: user.last_name || 'Demo'
      },
      
      game_participants: []
    };

    console.log(`🚀 CHECKPOINT 1: About to store game session in mockGameData`);
    console.log(`🚀 CHECKPOINT 2: mockGameData type: ${typeof mockGameData}`);
    console.log(`🚀 CHECKPOINT 3: addGameSession type: ${typeof mockGameData?.addGameSession}`);
    
    // Store the game session in temporary storage (same as mock games)
    console.log(`💾 Attempting to store game session ${gameSessionId} in mockGameData...`);
    if (mockGameData && mockGameData.addGameSession) {
      console.log(`🔄 EXECUTING mockGameData.addGameSession...`);
      try {
        const addResult = mockGameData.addGameSession(gameSession);
        console.log(`✅ Game session ${gameSessionId} stored in mockGameData successfully`);
        console.log(`📊 Total sessions after adding: ${mockGameData.gameSessions.length}`);
      } catch (error) {
        console.log(`❌ Could not store in mockGameData:`, error.message);
        console.error(error.stack);
      }
    } else {
      console.log(`❌ mockGameData or addGameSession not available`);
      console.log(`   - mockGameData exists: ${mockGameData ? 'YES' : 'NO'}`);
      console.log(`   - addGameSession exists: ${mockGameData?.addGameSession ? 'YES' : 'NO'}`);
    }
    
    console.log(`🚀 CHECKPOINT 4: Storage attempt completed`);

    // 💾 PERSIST TO DATABASE - Save to permanent storage
    try {
      const { gameSessionPersistence } = require('../services/gameSessionPersistence');
      const saveResult = await gameSessionPersistence.saveGameSession(gameSession);
      if (saveResult.success) {
        console.log(`💾 Game session persisted to database: ${gameSessionId}`);
      } else {
        console.log(`⚠️ Failed to persist game session: ${saveResult.error}`);
      }
    } catch (persistError) {
      console.error('💾 Error persisting game session:', persistError);
      // Continue without failing - session still works in memory
    }

    console.log(`✅ Game session created successfully:`, {
      session_id: gameSessionId,
      join_code: joinCode,
      title: evaluationData.title,
      format: evaluationData.game_format,
      questions: evaluationData.questions?.length || 0
    });

    console.log(`🚀 CHECKPOINT 5: About to send response to frontend`);
    
    // 🎨 AUTO-APPLY SKIN if skin_theme is specified
    let skinAppliedSuccessfully = false;
    if (evaluationData.skin_theme && evaluationData.skin_theme !== 'default') {
      console.log(`🎨 AUTO-APPLYING SKIN: ${evaluationData.skin_theme} to game ${gameSessionId}`);
      
      try {
        const { skinSystemService } = require('../services/skinSystemData');
        
        // 🔍 FIND SKIN BY THEME NAME
        let skinId = null;
        const allSkinsResult = skinSystemService.getAllSkins();
        if (allSkinsResult.success) {
          const matchingSkin = allSkinsResult.data.find(skin => 
            skin.category === evaluationData.skin_theme || 
            skin.name.toLowerCase().includes(evaluationData.skin_theme) ||
            skin.id.includes(evaluationData.skin_theme)
          );
          
          if (matchingSkin) {
            skinId = matchingSkin.id;
            console.log(`🎯 FOUND SKIN: ${skinId} (${matchingSkin.name})`);
          } else {
            console.log(`⚠️ NO MATCHING SKIN FOUND for theme: ${evaluationData.skin_theme}`);
            // Try some defaults
            if (evaluationData.skin_theme === 'espacio') {
              skinId = 'skin-math-001'; // Números Espaciales
            } else if (evaluationData.skin_theme === 'granja') {
              skinId = 'skin-1b-farm'; // Granja 1° Básico
            }
          }
        }
        
        if (skinId) {
          const skinResult = skinSystemService.applySkinToGame(skinId, gameSessionId);
          
          if (skinResult.success) {
            console.log(`✅ SKIN AUTO-APPLIED: ${skinResult.message}`);
            skinAppliedSuccessfully = true;
          } else {
            console.log(`⚠️ SKIN AUTO-APPLY FAILED: ${skinResult.error}`);
          }
        } else {
          console.log(`⚠️ NO VALID SKIN ID FOUND for theme: ${evaluationData.skin_theme}`);
        }
        
      } catch (skinError) {
        console.error('🎨 Error auto-applying skin:', skinError);
        // Continue without skin - don't fail the game creation
      }
    }
    
    res.status(201).json({
      success: true,
      gameSession: {
        session_id: gameSessionId,
        join_code: joinCode,
        title: evaluationData.title,
        format: evaluationData.game_format,
        status: 'waiting',
        url: `/teacher/game/${gameSessionId}/lobby`
      },
      message: `Game session created successfully. Join code: ${joinCode}`,
      metadata: {
        questions_count: evaluationData.questions?.length || 0,
        engine_used: evaluationData.engine_id,
        skin_applied: evaluationData.skin_theme,
        skin_applied_successfully: skinAppliedSuccessfully,
        original_evaluation_id: id
      }
    });
    
    console.log(`🚀 CHECKPOINT 6: Response sent successfully to frontend`);

  } catch (error) {
    console.error('❌ Error creating game session from evaluation:', error);
    res.status(500).json({ 
      error: 'Failed to create game session from evaluation',
      details: error.message 
    });
  }
});

// Helper function to get engine name
function getEngineName(engineId) {
  const engineNames = {
    'ENG01': 'Counter/Number Line',
    'ENG02': 'Drag-Drop Numbers', 
    'ENG05': 'Text Recognition',
    'ENG06': 'Letter-Sound Matching',
    'ENG07': 'Reading Fluency',
    'ENG09': 'Life Cycle'
  };
  return engineNames[engineId] || `Engine ${engineId}`;
}

// Helper function to map difficulty string to numeric score (1-5)
function mapDifficultyToScore(difficultyString) {
  switch (difficultyString.toLowerCase()) {
    case 'easy': return 1;
    case 'medium': return 3;
    case 'hard': return 5;
    default: return 3; // Default to medium
  }
}

// ================================
// HELPER FUNCTIONS
// ================================

function checkAnswer(question, responseText, responseJson) {
  switch (question.type) {
    case 'multiple_choice':
      return responseText === question.correct_answer;
    case 'true_false':
      return responseText.toLowerCase() === question.correct_answer.toLowerCase();
    case 'short_answer':
      // Simple text matching (can be enhanced with fuzzy matching)
      return responseText.toLowerCase().trim() === question.correct_answer.toLowerCase().trim();
    default:
      return false; // Essays require manual grading
  }
}

function calculateChileanGrade(percentage, gradingScale) {
  // Convert percentage to Chilean 1-7 scale
  const scale = gradingScale || {
    "1": 0, "2": 20, "3": 40, "4": 55, 
    "5": 70, "6": 85, "7": 100
  };

  for (let grade = 7; grade >= 1; grade--) {
    if (percentage >= scale[grade.toString()]) {
      return parseFloat(grade.toFixed(1));
    }
  }
  return 1.0;
}

function calculateGradeDistribution(grades) {
  const distribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0 };
  
  grades.forEach(grade => {
    const roundedGrade = Math.floor(grade.nota_10).toString();
    if (distribution[roundedGrade] !== undefined) {
      distribution[roundedGrade]++;
    }
  });

  return distribution;
}

function generateCSVReport(report) {
  const headers = ['Student', 'Grade', 'Score', 'Percentage', 'Status', 'Submitted At'];
  const rows = [headers.join(',')];

  report.grades.forEach(grade => {
    const attempt = report.attempts.find(a => a.student_id === grade.student_id);
    const studentName = attempt ? `${attempt.users.first_name} ${attempt.users.last_name}` : 'Unknown';
    
    rows.push([
      studentName,
      grade.nota_10,
      grade.score_raw,
      grade.percentage,
      attempt ? attempt.status : 'Not submitted',
      attempt ? attempt.finished_at : ''
    ].join(','));
  });

  return rows.join('\n');
}

module.exports = router; 

/**
 * POST /evaluation/submit-attempt
 * Submit a student's attempt for a gamified evaluation.
 */
router.post('/submit-attempt', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const { user } = req;
    const { sessionId, score, results } = req.body;

    // 1. Verify the game session exists and belongs to the student's class
    const { data: gameSession, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*, evaluations(*)')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !gameSession) {
      return res.status(404).json({ error: 'Game session not found.' });
    }

    // Basic class verification (can be more robust)
    const { data: studentClass, error: classError } = await supabase
      .from('student_classes')
      .select('class_id')
      .eq('student_id', user.user_id)
      .eq('class_id', gameSession.class_id)
      .single();

    if (classError || !studentClass) {
      return res.status(403).json({ error: 'No tienes permiso para enviar esta evaluación.' });
    }

    // 2. Check if student has already submitted for this session (optional, based on attempt_limit)
    // For now, we'll allow multiple submissions for simplicity, but in a real scenario,
    // you'd check evaluation_attempts table for existing attempts and the evaluation.attempt_limit.

    // 3. Save the attempt details
    const { data: attempt, error: attemptError } = await supabase
      // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED // Assuming this table exists or will be created
      .insert({
        eval_id: gameSession.evaluation_id,
        student_id: user.user_id,
        session_id: sessionId,
        score_raw: score,
        // You might want to store more details from 'results' here, e.g., correct/incorrect count
        // For now, we'll just store the raw score.
        submitted_at: new Date().toISOString(),
        status: 'completed',
      })
      .select()
      .single();

    if (attemptError) {
      console.error('Error saving attempt:', attemptError);
      return res.status(500).json({ error: 'Error al guardar el intento de evaluación.' });
    }

    res.json({
      success: true,
      message: 'Evaluación enviada exitosamente.',
      attemptId: attempt.attempt_id,
    });

  } catch (error) {
    console.error('Error in submit-attempt endpoint:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la evaluación.' });
  }
}); 

/**
 * GET /evaluation/student/:sessionId/play
 * Get all necessary data for a student to play a game session.
 */
router.get('/student/:sessionId/play', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;

    // Similar verification as the details endpoint, can be refactored into a middleware
    const { data: gameSession, error: sessionError } = await supabase
      .from('game_sessions')
      .select('*, evaluations(*)')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !gameSession) {
      return res.status(404).json({ error: 'Game session not found.' });
    }

    // This is a simplified check. In a real scenario, you would have a proper mapping
    // of students to classes to verify enrollment.
    if (gameSession.class_id && user.class_id !== gameSession.class_id) {
        return res.status(403).json({ error: 'You are not authorized to play this game session.' });
    }

    // Fetch questions for the evaluation
    const { data: questions, error: questionsError } = await supabase
      .from('evaluation_questions')
      .select('*, questions(*)')
      .eq('evaluation_id', gameSession.evaluation_id);

    if (questionsError) {
      return res.status(500).json({ error: 'Failed to fetch questions for the evaluation.' });
    }

    res.json({
      success: true,
      gameData: {
        game_template_id: gameSession.evaluations.engine_id, // Using engine_id as the template id
        questions: questions.map(q => q.questions),
        settings: gameSession.evaluations.engine_config,
      },
    });

  } catch (error) {
    console.error('Error fetching game session for play:', error);
    res.status(500).json({ error: 'Failed to fetch game session data.' });
  }
}); 

/**
 * GET /evaluation/student/:sessionId/details
 * Get evaluation details for a student to display on the lobby/ante-sala page.
 */
router.get('/student/:sessionId/details', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const { user } = req;
    const { sessionId } = req.params;

    // 1. Find the game session
    const { data: gameSession, error: sessionError } = await supabase
      .from('game_sessions')
      .select(`
        *,
        evaluations(*),
        users:host_id(first_name, last_name)
      `)
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !gameSession) {
      return res.status(404).json({ error: 'La sesión de evaluación no fue encontrada.' });
    }

    // 2. Verify student is in the class for which the session was created
    const { data: studentClass, error: classError } = await supabase
      .from('student_classes')
      .select('class_id')
      .eq('student_id', user.user_id)
      .eq('class_id', gameSession.class_id)
      .single();

    if (classError || !studentClass) {
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta evaluación.' });
    }

    // 3. Check if the student has already completed this evaluation
    // This logic will be implemented later when we have the attempts table

    // 4. Check if the due date has passed
    if (new Date(gameSession.due_date) < new Date()) {
        return res.status(403).json({ error: 'La fecha límite para esta evaluación ya ha pasado.' });
    }

    // 5. Return the necessary details
    res.json({
      success: true,
      details: {
        title: gameSession.evaluations.title,
        teacherName: `${gameSession.users.first_name} ${gameSession.users.last_name}`,
        questionCount: gameSession.evaluations.question_count || 10, // Fallback
        dueDate: gameSession.due_date,
      },
    });

  } catch (error) {
    console.error('Error fetching evaluation details for student:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener los detalles de la evaluación.' });
  }
});