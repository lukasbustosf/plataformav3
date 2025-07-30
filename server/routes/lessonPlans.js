const express = require('express');
const router = express.Router();
const { supabase } = require('../database/supabase');
const { authenticateToken } = require('../middleware/auth');

// ===============================================
// LESSON PLAN CRUD OPERATIONS
// ===============================================

// Get lesson plans for a class
router.get('/class/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { 
            startDate, 
            endDate, 
            status,
            unitId,
            limit = 50,
            offset = 0 
        } = req.query;

        let query = supabase
            .from('lesson_plans')
            .select(`
                *,
                classes(class_name, grade_code, subject_id, subjects(subject_name)),
                units(unit_title, unit_number),
                creator:users!lesson_plans_creator_id_fkey(first_name, last_name),
                approver:users!lesson_plans_approved_by_fkey(first_name, last_name),
                lesson_resources(*)
            `)
            .eq('class_id', classId)
            .eq('school_id', req.user.school_id)
            .order('plan_date', { ascending: false });

        if (startDate) {
            query = query.gte('plan_date', startDate);
        }

        if (endDate) {
            query = query.lte('plan_date', endDate);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (unitId) {
            query = query.eq('unit_id', unitId);
        }

        const { data: lessonPlans, error } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            success: true,
            data: lessonPlans
        });

    } catch (error) {
        console.error('Lesson plans fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lesson plans'
        });
    }
});

// Get a specific lesson plan
router.get('/:planId', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;

        const { data: lessonPlan, error } = await supabase
            .from('lesson_plans')
            .select(`
                *,
                classes(
                    class_name, 
                    grade_code, 
                    subject_id, 
                    subjects(subject_name, subject_code),
                    grade_levels(grade_name)
                ),
                units(unit_title, unit_number, unit_description),
                creator:users!lesson_plans_creator_id_fkey(first_name, last_name, email),
                approver:users!lesson_plans_approved_by_fkey(first_name, last_name, email),
                lesson_resources(
                    *,
                    quizzes(title, description)
                )
            `)
            .eq('plan_id', planId)
            .eq('school_id', req.user.school_id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    error: 'Lesson plan not found'
                });
            }
            throw error;
        }

        // Get associated learning objectives
        if (lessonPlan.oa_ids && lessonPlan.oa_ids.length > 0) {
            const { data: objectives } = await supabase
                .from('learning_objectives')
                .select('*')
                .in('oa_id', lessonPlan.oa_ids);
            
            lessonPlan.learning_objectives = objectives || [];
        } else {
            lessonPlan.learning_objectives = [];
        }

        res.json({
            success: true,
            data: lessonPlan
        });

    } catch (error) {
        console.error('Lesson plan fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch lesson plan'
        });
    }
});

// Create new lesson plan
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            class_id,
            unit_id,
            plan_title,
            plan_date,
            duration_minutes = 90,
            lesson_number,
            oa_ids = [],
            custom_objectives = [],
            inicio_md = '',
            desarrollo_md = '',
            cierre_md = '',
            evaluation_md = '',
            methodology = '',
            differentiation_strategies = '',
            materials_needed = [],
            homework_assigned = '',
            resources = []
        } = req.body;

        // Validate required fields
        if (!class_id || !plan_title || !plan_date) {
            return res.status(400).json({
                success: false,
                error: 'Class ID, title, and date are required'
            });
        }

        // Verify class belongs to user's school
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select('class_id, teacher_id, co_teacher_id')
            .eq('class_id', class_id)
            .eq('school_id', req.user.school_id)
            .single();

        if (classError || !classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        // Check if user can create lesson plans for this class
        const canCreate = 
            req.user.role === 'TEACHER' && 
            (classData.teacher_id === req.user.user_id || classData.co_teacher_id === req.user.user_id) ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canCreate) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to create lesson plans for this class'
            });
        }

        // Check for duplicate lesson plan on same date
        const { data: existing } = await supabase
            .from('lesson_plans')
            .select('plan_id')
            .eq('class_id', class_id)
            .eq('plan_date', plan_date)
            .single();

        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'A lesson plan already exists for this class on this date'
            });
        }

        // Create lesson plan
        const { data: lessonPlan, error: planError } = await supabase
            .from('lesson_plans')
            .insert({
                school_id: req.user.school_id,
                class_id,
                unit_id,
                creator_id: req.user.user_id,
                plan_title,
                plan_date,
                duration_minutes,
                lesson_number,
                oa_ids,
                custom_objectives,
                inicio_md,
                desarrollo_md,
                cierre_md,
                evaluation_md,
                methodology,
                differentiation_strategies,
                materials_needed,
                homework_assigned,
                status: 'draft'
            })
            .select()
            .single();

        if (planError) throw planError;

        // Add resources if provided
        if (resources && resources.length > 0) {
            const resourcesWithPlanId = resources.map(resource => ({
                ...resource,
                plan_id: lessonPlan.plan_id
            }));

            const { error: resourceError } = await supabase
                .from('lesson_resources')
                .insert(resourcesWithPlanId);

            if (resourceError) {
                console.error('Resource creation error:', resourceError);
                // Don't fail the lesson plan creation, just log the error
            }
        }

        res.status(201).json({
            success: true,
            data: lessonPlan
        });

    } catch (error) {
        console.error('Lesson plan creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create lesson plan'
        });
    }
});

// Update lesson plan
router.put('/:planId', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;
        const updates = req.body;

        // Get existing lesson plan
        const { data: existing, error: fetchError } = await supabase
            .from('lesson_plans')
            .select('creator_id, status, school_id')
            .eq('plan_id', planId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({
                success: false,
                error: 'Lesson plan not found'
            });
        }

        // Check permissions
        const canEdit = 
            existing.creator_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canEdit) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to edit this lesson plan'
            });
        }

        // Don't allow editing approved plans unless admin
        if (existing.status === 'approved' && !['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Cannot edit approved lesson plans'
            });
        }

        // Prepare update object (exclude sensitive fields)
        const allowedUpdates = {
            plan_title: updates.plan_title,
            plan_date: updates.plan_date,
            duration_minutes: updates.duration_minutes,
            lesson_number: updates.lesson_number,
            oa_ids: updates.oa_ids,
            custom_objectives: updates.custom_objectives,
            inicio_md: updates.inicio_md,
            desarrollo_md: updates.desarrollo_md,
            cierre_md: updates.cierre_md,
            evaluation_md: updates.evaluation_md,
            methodology: updates.methodology,
            differentiation_strategies: updates.differentiation_strategies,
            materials_needed: updates.materials_needed,
            homework_assigned: updates.homework_assigned,
            ai_suggestions: updates.ai_suggestions
        };

        // Remove undefined values
        Object.keys(allowedUpdates).forEach(key => {
            if (allowedUpdates[key] === undefined) {
                delete allowedUpdates[key];
            }
        });

        // Update lesson plan
        const { data: updatedPlan, error: updateError } = await supabase
            .from('lesson_plans')
            .update(allowedUpdates)
            .eq('plan_id', planId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: updatedPlan
        });

    } catch (error) {
        console.error('Lesson plan update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update lesson plan'
        });
    }
});

// Submit lesson plan for approval
router.post('/:planId/submit', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;

        // Get lesson plan
        const { data: lessonPlan, error: fetchError } = await supabase
            .from('lesson_plans')
            .select('creator_id, status, school_id')
            .eq('plan_id', planId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !lessonPlan) {
            return res.status(404).json({
                success: false,
                error: 'Lesson plan not found'
            });
        }

        // Check permissions
        if (lessonPlan.creator_id !== req.user.user_id && !['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'You can only submit your own lesson plans'
            });
        }

        // Check current status
        if (lessonPlan.status !== 'draft') {
            return res.status(400).json({
                success: false,
                error: 'Only draft lesson plans can be submitted'
            });
        }

        // Update status
        const { data: updated, error: updateError } = await supabase
            .from('lesson_plans')
            .update({
                status: 'submitted',
                submitted_at: new Date().toISOString()
            })
            .eq('plan_id', planId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: updated
        });

    } catch (error) {
        console.error('Lesson plan submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit lesson plan'
        });
    }
});

// Approve/reject lesson plan
router.post('/:planId/approve', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;
        const { approved, feedback = '' } = req.body;

        // Check permissions - only admins can approve
        if (!['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions to approve lesson plans'
            });
        }

        // Get lesson plan
        const { data: lessonPlan, error: fetchError } = await supabase
            .from('lesson_plans')
            .select('status, school_id')
            .eq('plan_id', planId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !lessonPlan) {
            return res.status(404).json({
                success: false,
                error: 'Lesson plan not found'
            });
        }

        // Check current status
        if (lessonPlan.status !== 'submitted') {
            return res.status(400).json({
                success: false,
                error: 'Only submitted lesson plans can be approved/rejected'
            });
        }

        // Update lesson plan
        const updates = {
            status: approved ? 'approved' : 'draft',
            approved_by: approved ? req.user.user_id : null,
            approved_at: approved ? new Date().toISOString() : null
        };

        if (feedback) {
            updates.completion_notes = feedback;
        }

        const { data: updated, error: updateError } = await supabase
            .from('lesson_plans')
            .update(updates)
            .eq('plan_id', planId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: updated
        });

    } catch (error) {
        console.error('Lesson plan approval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process approval'
        });
    }
});

// Delete lesson plan
router.delete('/:planId', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;

        // Get lesson plan
        const { data: lessonPlan, error: fetchError } = await supabase
            .from('lesson_plans')
            .select('creator_id, status, school_id')
            .eq('plan_id', planId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !lessonPlan) {
            return res.status(404).json({
                success: false,
                error: 'Lesson plan not found'
            });
        }

        // Check permissions
        const canDelete = 
            lessonPlan.creator_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this lesson plan'
            });
        }

        // Don't allow deleting completed lesson plans
        if (lessonPlan.status === 'completed') {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete completed lesson plans'
            });
        }

        // Delete lesson plan (resources will be deleted by CASCADE)
        const { error: deleteError } = await supabase
            .from('lesson_plans')
            .delete()
            .eq('plan_id', planId);

        if (deleteError) throw deleteError;

        res.json({
            success: true,
            message: 'Lesson plan deleted successfully'
        });

    } catch (error) {
        console.error('Lesson plan deletion error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete lesson plan'
        });
    }
});

// ===============================================
// LESSON RESOURCES MANAGEMENT
// ===============================================

// Add resource to lesson plan
router.post('/:planId/resources', authenticateToken, async (req, res) => {
    try {
        const { planId } = req.params;
        const {
            resource_type,
            resource_title,
            resource_description = '',
            file_url,
            quiz_id,
            external_url,
            resource_order = 1,
            is_required = false,
            estimated_time_minutes
        } = req.body;

        // Validate required fields
        if (!resource_type || !resource_title) {
            return res.status(400).json({
                success: false,
                error: 'Resource type and title are required'
            });
        }

        // Verify lesson plan exists and user has access
        const { data: lessonPlan, error: planError } = await supabase
            .from('lesson_plans')
            .select('creator_id, school_id')
            .eq('plan_id', planId)
            .eq('school_id', req.user.school_id)
            .single();

        if (planError || !lessonPlan) {
            return res.status(404).json({
                success: false,
                error: 'Lesson plan not found'
            });
        }

        // Check permissions
        const canAdd = 
            lessonPlan.creator_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canAdd) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to add resources to this lesson plan'
            });
        }

        // Create resource
        const { data: resource, error: resourceError } = await supabase
            .from('lesson_resources')
            .insert({
                plan_id: planId,
                resource_type,
                resource_title,
                resource_description,
                file_url,
                quiz_id,
                external_url,
                resource_order,
                is_required,
                estimated_time_minutes
            })
            .select()
            .single();

        if (resourceError) throw resourceError;

        res.status(201).json({
            success: true,
            data: resource
        });

    } catch (error) {
        console.error('Resource creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add resource'
        });
    }
});

// Update lesson resource
router.put('/resources/:resourceId', authenticateToken, async (req, res) => {
    try {
        const { resourceId } = req.params;
        const updates = req.body;

        // Get resource and verify access
        const { data: resource, error: fetchError } = await supabase
            .from('lesson_resources')
            .select(`
                *,
                lesson_plans!inner(creator_id, school_id)
            `)
            .eq('resource_id', resourceId)
            .eq('lesson_plans.school_id', req.user.school_id)
            .single();

        if (fetchError || !resource) {
            return res.status(404).json({
                success: false,
                error: 'Resource not found'
            });
        }

        // Check permissions
        const canEdit = 
            resource.lesson_plans.creator_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canEdit) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to edit this resource'
            });
        }

        // Update resource
        const { data: updated, error: updateError } = await supabase
            .from('lesson_resources')
            .update(updates)
            .eq('resource_id', resourceId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: updated
        });

    } catch (error) {
        console.error('Resource update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update resource'
        });
    }
});

// Delete lesson resource
router.delete('/resources/:resourceId', authenticateToken, async (req, res) => {
    try {
        const { resourceId } = req.params;

        // Get resource and verify access
        const { data: resource, error: fetchError } = await supabase
            .from('lesson_resources')
            .select(`
                *,
                lesson_plans!inner(creator_id, school_id)
            `)
            .eq('resource_id', resourceId)
            .eq('lesson_plans.school_id', req.user.school_id)
            .single();

        if (fetchError || !resource) {
            return res.status(404).json({
                success: false,
                error: 'Resource not found'
            });
        }

        // Check permissions
        const canDelete = 
            resource.lesson_plans.creator_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canDelete) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to delete this resource'
            });
        }

        // Delete resource
        const { error: deleteError } = await supabase
            .from('lesson_resources')
            .delete()
            .eq('resource_id', resourceId);

        if (deleteError) throw deleteError;

        res.json({
            success: true,
            message: 'Resource deleted successfully'
        });

    } catch (error) {
        console.error('Resource deletion error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete resource'
        });
    }
});

// ===============================================
// CURRICULUM INTEGRATION
// ===============================================

// Get units for lesson planning
router.get('/units/grade/:gradeCode/subject/:subjectId', authenticateToken, async (req, res) => {
    try {
        const { gradeCode, subjectId } = req.params;
        const { year = new Date().getFullYear() } = req.query;

        const { data: units, error } = await supabase
            .from('units')
            .select(`
                *,
                unit_oa(
                    *,
                    learning_objectives(*)
                )
            `)
            .eq('grade_code', gradeCode)
            .eq('subject_id', subjectId)
            .eq('year', year)
            .order('unit_number');

        if (error) throw error;

        res.json({
            success: true,
            data: units
        });

    } catch (error) {
        console.error('Units fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch curriculum units'
        });
    }
});

// Get learning objectives for lesson planning
router.get('/objectives/grade/:gradeCode/subject/:subjectId', authenticateToken, async (req, res) => {
    try {
        const { gradeCode, subjectId } = req.params;
        const { bloomLevel, semester, search } = req.query;

        let query = supabase
            .from('learning_objectives')
            .select('*')
            .eq('grade_code', gradeCode)
            .eq('subject_id', subjectId)
            .order('oa_code');

        if (bloomLevel) {
            query = query.eq('bloom_level', bloomLevel);
        }

        if (semester) {
            query = query.eq('semester', semester);
        }

        if (search) {
            query = query.or(`oa_desc.ilike.%${search}%,oa_code.ilike.%${search}%`);
        }

        const { data: objectives, error } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data: objectives
        });

    } catch (error) {
        console.error('Objectives fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch learning objectives'
        });
    }
});

module.exports = router; 
