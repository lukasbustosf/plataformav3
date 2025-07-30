const express = require('express');
const Joi = require('joi');
const { supabase } = require('../database/supabase');
const { requireRole, requireSchoolAccess } = require('../middleware/auth');
const logger = require('../utils/logger');
const { mockGameData } = require('../services/mockGameData');

const router = express.Router();

// Validation schemas
const quizCreateSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).allow(''),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  time_limit_minutes: Joi.number().integer().min(5).max(180).default(30),
  metadata_json: Joi.object().default({})
});

const questionSchema = Joi.object({
  question_order: Joi.number().integer().min(1).required(),
  stem_md: Joi.string().min(5).required(),
  type: Joi.string().valid('multiple_choice', 'true_false', 'short_answer', 'essay').required(),
  options_json: Joi.array().when('type', {
    is: Joi.string().valid('multiple_choice', 'true_false'),
    then: Joi.array().min(2).max(6).required(),
    otherwise: Joi.array().default([])
  }),
  correct_answer: Joi.string().required(),
  points: Joi.number().integer().min(1).max(10).default(1),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  oa_ids: Joi.array().items(Joi.string().uuid()).default([])
});

const quizUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().max(1000).allow(''),
  difficulty: Joi.string().valid('easy', 'medium', 'hard'),
  time_limit_minutes: Joi.number().integer().min(5).max(180),
  metadata_json: Joi.object()
});

// GET /api/quiz - List quizzes with filtering
router.get('/', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      difficulty,
      author_id,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Mock data for development when supabase is null
    if (!supabase) {
      const mockResult = mockGameData.getQuizzes({
        school_id: req.school_id,
        author_id: author_id,
        limit: parseInt(limit)
      });
      
      if (mockResult.error) {
        throw new Error(mockResult.error.message);
      }
      
      const quizzesWithCount = mockResult.data.quizzes.map(quiz => ({
        ...quiz,
        authors: { 
          user_id: quiz.author_id, 
          first_name: 'Profesor', 
          last_name: 'Demo' 
        },
        question_count: quiz.questions?.length || 0,
        questions: undefined
      }));
      
      // Apply search filter if provided
      let filteredQuizzes = quizzesWithCount;
      if (search) {
        filteredQuizzes = quizzesWithCount.filter(quiz => 
          quiz.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      // Apply difficulty filter if provided
      if (difficulty) {
        filteredQuizzes = filteredQuizzes.filter(quiz => quiz.difficulty === difficulty);
      }
      
      return res.json({
        quizzes: filteredQuizzes,
        pagination: { 
          page: parseInt(page), 
          limit: parseInt(limit), 
          total: filteredQuizzes.length, 
          total_pages: Math.ceil(filteredQuizzes.length / parseInt(limit))
        }
      });
    }

    // Build query
    let query = supabase
      .from('quizzes')
      .select(`
        quiz_id,
        title,
        description,
        mode,
        difficulty,
        time_limit_minutes,
        created_at,
        updated_at,
        authors:users!quizzes_author_id_fkey (
          user_id,
          first_name,
          last_name
        ),
        questions (
          question_id
        )
      `)
      .eq('school_id', req.school_id)
      .eq('active', true);

    // Apply filters
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      query = query.eq('difficulty', difficulty);
    }
    if (author_id) {
      query = query.eq('author_id', author_id);
    }

    // Apply sorting and pagination
    query = query
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(offset, offset + parseInt(limit) - 1);

    const { data: quizzes, error, count } = await query;

    if (error) {
      throw error;
    }

    // Add question count to each quiz
    const quizzesWithCount = quizzes.map(quiz => ({
      ...quiz,
      question_count: quiz.questions?.length || 0,
      questions: undefined // Remove questions array, just keep count
    }));

    res.json({
      quizzes: quizzesWithCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || quizzes.length,
        total_pages: Math.ceil((count || quizzes.length) / parseInt(limit))
      }
    });

  } catch (error) {
    logger.error('Get quizzes error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve quizzes',
        code: 'QUIZ_FETCH_ERROR'
      }
    });
  }
});

// GET /api/quiz/:id - Get single quiz with questions
router.get('/:id', requireRole('TEACHER', 'ADMIN_ESCOLAR', 'STUDENT'), async (req, res) => {
  try {
    const { id } = req.params;
    const { include_answers = 'false' } = req.query;

    // Get quiz with questions
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        quiz_id,
        title,
        description,
        mode,
        difficulty,
        time_limit_minutes,
        metadata_json,
        created_at,
        updated_at,
        authors:users!quizzes_author_id_fkey (
          user_id,
          first_name,
          last_name
        ),
        questions (
          question_id,
          question_order,
          stem_md,
          type,
          options_json,
          ${include_answers === 'true' ? 'correct_answer,' : ''}
          points,
          difficulty,
          asset_url,
          tts_url,
          question_learning_objectives (
            learning_objectives (
              oa_id,
              oa_code,
              oa_desc,
              bloom_level
            )
          )
        )
      `)
      .eq('quiz_id', id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (error || !quiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    // Check permissions - students can only see quizzes they have access to
    if (req.user.role === 'STUDENT') {
      // Here you might want to check if student is enrolled in a class that has access to this quiz
      // For MVP, we'll allow all students in the school to see quizzes
    }

    // Sort questions by order
    if (quiz.questions) {
      quiz.questions.sort((a, b) => a.question_order - b.question_order);
    }

    res.json({
      quiz
    });

  } catch (error) {
    logger.error('Get quiz error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve quiz',
        code: 'QUIZ_FETCH_ERROR'
      }
    });
  }
});

// POST /api/quiz - Create new quiz
router.post('/', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    // Validate quiz data
    const { error: quizError, value: quizData } = quizCreateSchema.validate(req.body);
    if (quizError) {
      return res.status(400).json({
        error: {
          message: 'Quiz validation failed',
          details: quizError.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Create quiz
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert({
        ...quizData,
        school_id: req.school_id,
        author_id: req.user.user_id,
        mode: 'manual'
      })
      .select(`
        quiz_id,
        title,
        description,
        mode,
        difficulty,
        time_limit_minutes,
        metadata_json,
        created_at
      `)
      .single();

    if (error) {
      throw error;
    }

    logger.info(`Quiz created: ${quiz.quiz_id} by user: ${req.user.user_id}`);

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });

  } catch (error) {
    logger.error('Create quiz error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create quiz',
        code: 'QUIZ_CREATE_ERROR'
      }
    });
  }
});

// PUT /api/quiz/:id - Update quiz
router.put('/:id', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;

    // Validate update data
    const { error: validationError, value: updateData } = quizUpdateSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: {
          message: 'Quiz validation failed',
          details: validationError.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Check if quiz exists and user has permission
    const { data: existingQuiz } = await supabase
      .from('quizzes')
      .select('quiz_id, author_id')
      .eq('quiz_id', id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (!existingQuiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    // Check if user is author or admin
    if (existingQuiz.author_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Permission denied. You can only edit your own quizzes.',
          code: 'QUIZ_EDIT_DENIED'
        }
      });
    }

    // Update quiz
    const { data: updatedQuiz, error } = await supabase
      .from('quizzes')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('quiz_id', id)
      .select(`
        quiz_id,
        title,
        description,
        mode,
        difficulty,
        time_limit_minutes,
        metadata_json,
        updated_at
      `)
      .single();

    if (error) {
      throw error;
    }

    logger.info(`Quiz updated: ${id} by user: ${req.user.user_id}`);

    res.json({
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    });

  } catch (error) {
    logger.error('Update quiz error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update quiz',
        code: 'QUIZ_UPDATE_ERROR'
      }
    });
  }
});

// DELETE /api/quiz/:id - Delete quiz (soft delete)
router.delete('/:id', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if quiz exists and user has permission
    const { data: existingQuiz } = await supabase
      .from('quizzes')
      .select('quiz_id, author_id, title')
      .eq('quiz_id', id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (!existingQuiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    // Check if user is author or admin
    if (existingQuiz.author_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Permission denied. You can only delete your own quizzes.',
          code: 'QUIZ_DELETE_DENIED'
        }
      });
    }

    // Soft delete quiz
    const { error } = await supabase
      .from('quizzes')
      .update({
        active: false,
        updated_at: new Date().toISOString()
      })
      .eq('quiz_id', id);

    if (error) {
      throw error;
    }

    logger.info(`Quiz deleted: ${id} (${existingQuiz.title}) by user: ${req.user.user_id}`);

    res.json({
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    logger.error('Delete quiz error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete quiz',
        code: 'QUIZ_DELETE_ERROR'
      }
    });
  }
});

// POST /api/quiz/:id/questions - Add question to quiz
router.post('/:id/questions', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id: quiz_id } = req.params;

    // Validate question data
    const { error: validationError, value: questionData } = questionSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: {
          message: 'Question validation failed',
          details: validationError.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Check if quiz exists and user has permission
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('quiz_id, author_id')
      .eq('quiz_id', quiz_id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (!quiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    if (quiz.author_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Permission denied',
          code: 'QUIZ_EDIT_DENIED'
        }
      });
    }

    const { oa_ids, ...questionInsertData } = questionData;

    // Create question
    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        ...questionInsertData,
        quiz_id
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Link question to learning objectives if provided
    if (oa_ids && oa_ids.length > 0) {
      const oaLinks = oa_ids.map(oa_id => ({
        question_id: question.question_id,
        oa_id
      }));

      const { error: oaError } = await supabase
        .from('question_learning_objectives')
        .insert(oaLinks);

      if (oaError) {
        logger.warn('Failed to link question to learning objectives:', oaError);
      }
    }

    logger.info(`Question added to quiz: ${quiz_id} by user: ${req.user.user_id}`);

    res.status(201).json({
      message: 'Question added successfully',
      question
    });

  } catch (error) {
    logger.error('Add question error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to add question',
        code: 'QUESTION_CREATE_ERROR'
      }
    });
  }
});

// PUT /api/quiz/:id/questions/:question_id - Update question
router.put('/:id/questions/:question_id', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id: quiz_id, question_id } = req.params;

    // Validate question data
    const { error: validationError, value: questionData } = questionSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: {
          message: 'Question validation failed',
          details: validationError.details[0].message,
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Check permissions
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('quiz_id, author_id')
      .eq('quiz_id', quiz_id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (!quiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    if (quiz.author_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Permission denied',
          code: 'QUIZ_EDIT_DENIED'
        }
      });
    }

    const { oa_ids, ...questionUpdateData } = questionData;

    // Update question
    const { data: question, error } = await supabase
      .from('questions')
      .update(questionUpdateData)
      .eq('question_id', question_id)
      .eq('quiz_id', quiz_id)
      .select('*')
      .single();

    if (error || !question) {
      return res.status(404).json({
        error: {
          message: 'Question not found',
          code: 'QUESTION_NOT_FOUND'
        }
      });
    }

    // Update learning objective links if provided
    if (oa_ids !== undefined) {
      // Remove existing links
      await supabase
        .from('question_learning_objectives')
        .delete()
        .eq('question_id', question_id);

      // Add new links
      if (oa_ids.length > 0) {
        const oaLinks = oa_ids.map(oa_id => ({
          question_id,
          oa_id
        }));

        const { error: oaError } = await supabase
          .from('question_learning_objectives')
          .insert(oaLinks);

        if (oaError) {
          logger.warn('Failed to update question learning objectives:', oaError);
        }
      }
    }

    logger.info(`Question updated: ${question_id} in quiz: ${quiz_id} by user: ${req.user.user_id}`);

    res.json({
      message: 'Question updated successfully',
      question
    });

  } catch (error) {
    logger.error('Update question error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update question',
        code: 'QUESTION_UPDATE_ERROR'
      }
    });
  }
});

// DELETE /api/quiz/:id/questions/:question_id - Delete question
router.delete('/:id/questions/:question_id', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id: quiz_id, question_id } = req.params;

    // Check permissions
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('quiz_id, author_id')
      .eq('quiz_id', quiz_id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    if (!quiz) {
      return res.status(404).json({
        error: {
          message: 'Quiz not found',
          code: 'QUIZ_NOT_FOUND'
        }
      });
    }

    if (quiz.author_id !== req.user.user_id && req.user.role !== 'ADMIN_ESCOLAR') {
      return res.status(403).json({
        error: {
          message: 'Permission denied',
          code: 'QUIZ_EDIT_DENIED'
        }
      });
    }

    // Delete question (this will cascade delete question_learning_objectives)
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('question_id', question_id)
      .eq('quiz_id', quiz_id);

    if (error) {
      throw error;
    }

    logger.info(`Question deleted: ${question_id} from quiz: ${quiz_id} by user: ${req.user.user_id}`);

    res.json({
      message: 'Question deleted successfully'
    });

  } catch (error) {
    logger.error('Delete question error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete question',
        code: 'QUESTION_DELETE_ERROR'
      }
    });
  }
});

module.exports = router; 
