const express = require('express');
const { supabase } = require('../database/supabase');
const { requireRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Datos mock para clases de demo
const MOCK_CLASSES = [
  {
    class_id: '550e8400-e29b-41d4-a716-446655440010',
    class_name: '1°A Matemáticas',
    year: 2025,
    created_at: '2025-01-01T00:00:00Z',
    grade_levels: { grade_code: '1B', grade_name: '1° Básico' },
    subjects: { subject_id: '550e8400-e29b-41d4-a716-446655440030', subject_name: 'Matemática', subject_color: '#3B82F6' },
    teachers: { user_id: '550e8400-e29b-41d4-a716-446655440001', first_name: 'María', last_name: 'González' }
  },
  {
    class_id: '550e8400-e29b-41d4-a716-446655440011',
    class_name: '1°B Lenguaje',
    year: 2025,
    created_at: '2025-01-01T00:00:00Z',
    grade_levels: { grade_code: '1B', grade_name: '1° Básico' },
    subjects: { subject_id: '550e8400-e29b-41d4-a716-446655440031', subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' },
    teachers: { user_id: '550e8400-e29b-41d4-a716-446655440001', first_name: 'María', last_name: 'González' }
  },
  {
    class_id: '550e8400-e29b-41d4-a716-446655440012',
    class_name: '2°A Ciencias',
    year: 2025,
    created_at: '2025-01-01T00:00:00Z',
    grade_levels: { grade_code: '2B', grade_name: '2° Básico' },
    subjects: { subject_id: '550e8400-e29b-41d4-a716-446655440032', subject_name: 'Ciencias Naturales', subject_color: '#10B981' },
    teachers: { user_id: '550e8400-e29b-41d4-a716-446655440001', first_name: 'María', last_name: 'González' }
  }
];

// GET /api/class - Get classes for current user
router.get('/', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    let classes = [];
    let usedMockData = false;

    // Si Supabase está configurado, intentar buscar primero
    if (supabase) {
      let query = supabase
        .from('classes')
        .select(`
          class_id,
          class_name,
          year,
          created_at,
          grade_levels (
            grade_code,
            grade_name
          ),
          subjects (
            subject_id,
            subject_name,
            subject_color
          ),
          teachers:users!classes_teacher_id_fkey (
            user_id,
            first_name,
            last_name
          )
        `)
        .eq('school_id', req.school_id)
        .eq('active', true);

      // Teachers can only see their own classes
      if (req.user.role === 'TEACHER') {
        query = query.eq('teacher_id', req.user.user_id);
      }

      query = query.order('class_name');

      const { data: supabaseClasses, error } = await query;

      if (!error && supabaseClasses && supabaseClasses.length > 0) {
        classes = supabaseClasses;
        console.log(`✅ Found ${classes.length} classes from Supabase`);
      } else {
        console.log('⚠️  No classes found in Supabase, using mock data as fallback');
        usedMockData = true;
      }
    } else {
      console.log('⚠️  Supabase not configured, using mock classes');
      usedMockData = true;
    }

    // Si no hay datos de Supabase, usar datos mock
    if (usedMockData) {
      classes = MOCK_CLASSES;
      console.log(`✅ Found ${classes.length} mock classes`);
    }

    res.json({
      classes,
      mockData: usedMockData
    });

  } catch (error) {
    logger.error('Get classes error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve classes',
        code: 'CLASSES_FETCH_ERROR'
      }
    });
  }
});

// GET /api/class/:id - Get single class with students
router.get('/:id', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get class details
    let query = supabase
      .from('classes')
      .select(`
        class_id,
        class_name,
        year,
        teacher_id,
        grade_levels (
          grade_code,
          grade_name
        ),
        subjects (
          subject_id,
          subject_name,
          subject_color
        ),
        teachers:users!classes_teacher_id_fkey (
          user_id,
          first_name,
          last_name
        )
      `)
      .eq('class_id', id)
      .eq('school_id', req.school_id)
      .eq('active', true)
      .single();

    const { data: classData, error: classError } = await query;

    if (classError || !classData) {
      return res.status(404).json({
        error: {
          message: 'Class not found',
          code: 'CLASS_NOT_FOUND'
        }
      });
    }

    // Check permissions
    if (req.user.role === 'TEACHER' && classData.teacher_id !== req.user.user_id) {
      return res.status(403).json({
        error: {
          message: 'Access denied to this class',
          code: 'CLASS_ACCESS_DENIED'
        }
      });
    }

    // Get enrolled students
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select(`
        enrollment_id,
        enrolled_at,
        students:users!enrollments_student_id_fkey (
          user_id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('class_id', id)
      .eq('active', true)
      .order('students(last_name)');

    if (enrollmentError) {
      logger.warn('Failed to get enrollments:', enrollmentError);
    }

    res.json({
      class: {
        ...classData,
        students: enrollments?.map(e => e.students) || []
      }
    });

  } catch (error) {
    logger.error('Get class error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to retrieve class',
        code: 'CLASS_FETCH_ERROR'
      }
    });
  }
});

module.exports = router;
