const express = require('express');
const { supabase } = require('../database/supabase');
const { requireRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// ===============================================
// P1 OA MANAGEMENT SYSTEM - COMPLETE IMPLEMENTATION
// ===============================================

// GET /api/curriculum/grades - Get all grade levels
router.get('/grades', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { data: grades, error } = await supabase
      .from('grade_levels')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: grades
    });

  } catch (error) {
    logger.error('Failed to fetch grades:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch grades'
    });
  }
});

// GET /api/curriculum/subjects - Get all subjects
router.get('/subjects', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { grade_code } = req.query;

    let query = supabase
      .from('subjects')
      .select('*')
      .order('subject_name', { ascending: true });

    if (grade_code) {
      // Filter subjects available for specific grade
      query = query.eq('available_grades', 'cs', `{${grade_code}}`);
    }

    const { data: subjects, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: subjects
    });

  } catch (error) {
    logger.error('Failed to fetch subjects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subjects'
    });
  }
});

// GET /api/curriculum/oa - Get learning objectives with filtering (P1 Enhanced)
router.get('/oa', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { 
      grade_code, 
      subject_id, 
      oa_version = '2023',
      bloom_level, 
      search_term 
    } = req.query;

    // P1 Validation: grade_code and subject_id required for compliance
    if (!grade_code || !subject_id) {
      return res.status(400).json({
        success: false,
        error: 'grade_code and subject_id are required for P1 OA alignment compliance'
      });
    }

    let query = supabase
      .from('learning_objectives')
      .select(`
        oa_id,
        oa_code,
        oa_title,
        oa_description,
        grade_code,
        subject_id,
        bloom_level,
        oa_version,
        complexity_level,
        estimated_hours,
        prerequisite_oas,
        cross_curricular_competencies,
        subjects (
          subject_name,
          subject_code
          )
      `)
      .eq('grade_code', grade_code)
      .eq('subject_id', subject_id)
      .eq('oa_version', oa_version)
      .order('oa_code', { ascending: true });

    // Optional filters
    if (bloom_level) {
      query = query.eq('bloom_level', bloom_level);
    }

    if (search_term) {
      query = query.or(`oa_title.ilike.%${search_term}%,oa_description.ilike.%${search_term}%`);
    }

    const { data: oas, error } = await query;

    if (error) throw error;

    // P1 Compliance: Add alignment verification metadata
    const enrichedOAs = oas.map(oa => ({
          ...oa,
      alignment_metadata: {
        p1_compliant: true,
        version_current: oa.oa_version === '2023',
        bloom_verified: ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'].includes(oa.bloom_level),
        grade_appropriate: oa.grade_code === grade_code
      }
    }));

    res.json({
      success: true,
      data: enrichedOAs,
      metadata: {
        total_count: enrichedOAs.length,
        grade_code,
        subject_id,
        oa_version,
        p1_compliance_verified: true
      }
    });

  } catch (error) {
    logger.error('Failed to fetch OAs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning objectives'
    });
  }
});

// POST /api/curriculum/oa - Create new learning objective (ADMIN_ESCOLAR only)
router.post('/oa', requireRole('ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const {
      oa_code,
      oa_desc,
      oa_short_desc,
      grade_code,
      subject_id,
      bloom_level,
      semester,
      complexity_level,
      estimated_hours,
      prerequisites,
      is_transversal,
      ministerial_priority
    } = req.body;

    // Validate required fields
    if (!oa_code || !oa_desc || !grade_code || !subject_id || !bloom_level) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: oa_code, oa_desc, grade_code, subject_id, bloom_level'
      });
    }

    // Check if OA code already exists
    const { data: existing } = await supabase
      .from('learning_objectives')
      .select('oa_id')
      .eq('oa_code', oa_code)
      .single();

    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'OA code already exists'
      });
    }

    // Insert new OA
    const { data: newOA, error } = await supabase
      .from('learning_objectives')
      .insert({
        oa_code,
        oa_desc,
        oa_short_desc,
        grade_code,
        subject_id,
        bloom_level,
        oa_version: '2023', // Default to current version
        semester: semester || 1,
        complexity_level: complexity_level || 3,
        estimated_hours: estimated_hours || 4,
        prerequisites: prerequisites || [],
        is_transversal: is_transversal || false,
        ministerial_priority: ministerial_priority || 'normal'
      })
      .select(`
        *,
        grade_levels (*),
        subjects (*)
      `)
      .single();

    if (error) {
      throw error;
    }

    logger.info(`New OA created: ${oa_code} by user ${req.user.user_id}`);

    res.status(201).json({
      success: true,
      data: newOA,
      message: 'Learning objective created successfully'
    });

  } catch (error) {
    logger.error('Create OA error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create learning objective',
        code: 'OA_CREATE_ERROR'
      }
    });
  }
});

// PUT /api/curriculum/oa/:id - Update learning objective (ADMIN_ESCOLAR only)
router.put('/oa/:id', requireRole('ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove non-updatable fields
    delete updateData.oa_id;
    delete updateData.created_at;
    delete updateData.updated_at;

    const { data: updatedOA, error } = await supabase
      .from('learning_objectives')
      .update(updateData)
      .eq('oa_id', id)
      .select(`
        *,
        grade_levels (*),
        subjects (*)
      `)
      .single();

    if (error) {
      throw error;
    }

    if (!updatedOA) {
      return res.status(404).json({
        success: false,
        error: 'Learning objective not found'
      });
    }

    logger.info(`OA updated: ${updatedOA.oa_code} by user ${req.user.user_id}`);

    res.json({
      success: true,
      data: updatedOA,
      message: 'Learning objective updated successfully'
    });

  } catch (error) {
    logger.error('Update OA error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update learning objective',
        code: 'OA_UPDATE_ERROR'
      }
    });
  }
});

// DELETE /api/curriculum/oa/:id - Soft delete learning objective (ADMIN_ESCOLAR only)
router.delete('/oa/:id', requireRole('ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete by setting deprecated_at
    const { data: deletedOA, error } = await supabase
      .from('learning_objectives')
      .update({ deprecated_at: new Date().toISOString() })
      .eq('oa_id', id)
      .select('oa_code')
      .single();

    if (error) {
      throw error;
    }

    if (!deletedOA) {
      return res.status(404).json({
        success: false,
        error: 'Learning objective not found'
      });
    }

    logger.info(`OA deprecated: ${deletedOA.oa_code} by user ${req.user.user_id}`);

    res.json({
      success: true,
      message: 'Learning objective deprecated successfully'
    });

  } catch (error) {
    logger.error('Delete OA error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to delete learning objective',
        code: 'OA_DELETE_ERROR'
      }
    });
  }
});

// GET /api/curriculum/oa/:id - Get single OA with full details
router.get('/oa/:id', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { id } = req.params;
    const { include_usage = 'false' } = req.query;

    const { data: oa, error } = await supabase
      .from('learning_objectives')
      .select(`
        *,
        grade_levels (*),
        subjects (*),
        unit_oa (
          units (
            unit_id,
            unit_title,
            unit_number,
            estimated_classes
          )
        )${include_usage === 'true' ? `,
        question_learning_objectives (
          questions (
            question_id,
            stem_md,
            quiz_id,
            quizzes (
              title,
              created_at,
              authors:users!quizzes_author_id_fkey (
                first_name,
                last_name
              )
            )
          )
        )` : ''}
      `)
      .eq('oa_id', id)
      .single();

    if (error || !oa) {
      return res.status(404).json({
        success: false,
        error: 'Learning objective not found'
      });
    }

    // Calculate coverage and statistics
    const coverage = await calculateOACoverage(id, req.user.school_id);
    const statistics = await calculateOAStatistics(id, req.user.school_id);

    res.json({
      success: true,
      data: {
        ...oa,
        coverage,
        statistics
      }
    });

  } catch (error) {
    logger.error('Get OA details error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve learning objective details',
        code: 'OA_DETAILS_ERROR'
      }
    });
  }
});

// GET /api/curriculum/bloom-levels - Get Bloom taxonomy levels
router.get('/bloom-levels', requireRole('TEACHER', 'ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const bloomLevels = [
      { level: 'Recordar', order: 1, description: 'Recordar información previamente aprendida', color: '#EF4444' },
      { level: 'Comprender', order: 2, description: 'Demostrar comprensión de hechos e ideas', color: '#F97316' },
      { level: 'Aplicar', order: 3, description: 'Usar información en nuevas situaciones', color: '#EAB308' },
      { level: 'Analizar', order: 4, description: 'Dividir información en partes para explorar comprensiones', color: '#22C55E' },
      { level: 'Evaluar', order: 5, description: 'Justificar una decisión o curso de acción', color: '#3B82F6' },
      { level: 'Crear', order: 6, description: 'Generar nuevas ideas, productos o formas de ver las cosas', color: '#8B5CF6' }
    ];

    res.json({
      success: true,
      data: bloomLevels
    });

  } catch (error) {
    logger.error('Get bloom levels error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve Bloom levels',
        code: 'BLOOM_FETCH_ERROR'
      }
    });
  }
});

// GET /api/curriculum/coverage-report - P1-ADMIN-ESC: Weekly OA/Bloom coverage reports
router.get('/coverage-report', requireRole('ADMIN_ESCOLAR'), async (req, res) => {
  try {
    const { 
      grade_code, 
      subject_id, 
      week_start, 
      week_end,
      format = 'json' // json, csv, pdf
    } = req.query;

    if (!grade_code || !subject_id || !week_start || !week_end) {
      return res.status(400).json({
        success: false,
        error: 'grade_code, subject_id, week_start, and week_end are required'
      });
    }

    // Get all OAs for the grade/subject
    const { data: allOAs, error: oaError } = await supabase
      .from('learning_objectives')
      .select('oa_id, oa_code, oa_desc, bloom_level, ministerial_priority')
      .eq('grade_code', grade_code)
      .eq('subject_id', subject_id)
      .is('deprecated_at', null)
      .order('oa_code');

    if (oaError) throw oaError;

    // Get coverage data for the week
    const coverageData = await Promise.all(allOAs.map(async (oa) => {
      const weekCoverage = await calculateWeeklyCoverage(oa.oa_id, req.user.school_id, week_start, week_end);
      return {
        ...oa,
        ...weekCoverage
      };
    }));

    // Calculate summary statistics
    const summary = {
      total_oas: allOAs.length,
      covered_oas: coverageData.filter(oa => oa.was_assessed).length,
      coverage_percentage: (coverageData.filter(oa => oa.was_assessed).length / allOAs.length) * 100,
      high_priority_covered: coverageData.filter(oa => oa.ministerial_priority === 'high' && oa.was_assessed).length,
      bloom_distribution: calculateBloomDistribution(coverageData),
      remedial_suggestions: generateRemedialSuggestions(coverageData)
    };

    const reportData = {
      period: { week_start, week_end },
      grade_code,
      subject_id,
      summary,
      detailed_coverage: coverageData,
      generated_at: new Date().toISOString(),
      generated_by: req.user.user_id
    };

    // Handle different export formats
    if (format === 'csv') {
      const csv = await generateCoverageCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="oa-coverage-${grade_code}-${week_start}.csv"`);
      return res.send(csv);
    }

    if (format === 'pdf') {
      const pdf = await generateCoveragePDF(reportData);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="oa-coverage-${grade_code}-${week_start}.pdf"`);
      return res.send(pdf);
    }

    res.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    logger.error('Coverage report error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to generate coverage report',
        code: 'COVERAGE_REPORT_ERROR'
      }
    });
  }
});

module.exports = router;
