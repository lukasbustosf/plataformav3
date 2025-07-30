const express = require('express');
const router = express.Router();
const { supabase } = require('../database/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');
const logger = require('../utils/logger');
const crypto = require('crypto');
const { Parser } = require('json2csv');

// ===============================================
// DAILY CLASS CONTROL
// ===============================================

// Get daily controls for a class
router.get('/daily-control/class/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { 
            startDate, 
            endDate, 
            status,
            limit = 50,
            offset = 0 
        } = req.query;

        let query = supabase
            .from('daily_class_control')
            .select(`
                *,
                classes(class_name, grade_code, subjects(subject_name)),
                teacher:users!daily_class_control_teacher_id_fkey(first_name, last_name),
                lesson_plans(plan_title, oa_ids)
            `)
            .eq('class_id', classId)
            .eq('school_id', req.user.school_id)
            .order('class_date', { ascending: false });

        if (startDate) {
            query = query.gte('class_date', startDate);
        }

        if (endDate) {
            query = query.lte('class_date', endDate);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data: controls, error } = await query
            .range(offset, offset + limit - 1);

        if (error) throw error;

        res.json({
            success: true,
            data: controls
        });

    } catch (error) {
        console.error('Daily controls fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch daily controls'
        });
    }
});

// Get specific daily control
router.get('/daily-control/:controlId', authenticateToken, async (req, res) => {
    try {
        const { controlId } = req.params;

        const { data: control, error } = await supabase
            .from('daily_class_control')
            .select(`
                *,
                classes(
                    class_name, 
                    grade_code, 
                    subjects(subject_name, subject_code),
                    grade_levels(grade_name)
                ),
                teacher:users!daily_class_control_teacher_id_fkey(first_name, last_name, email),
                lesson_plans(plan_title, oa_ids, inicio_md, desarrollo_md, cierre_md),
                attendance(
                    *,
                    students:users!attendance_student_id_fkey(first_name, last_name, rut)
                )
            `)
            .eq('control_id', controlId)
            .eq('school_id', req.user.school_id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    error: 'Daily control not found'
                });
            }
            throw error;
        }

        res.json({
            success: true,
            data: control
        });

    } catch (error) {
        console.error('Daily control fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch daily control'
        });
    }
});

// Create daily control
router.post('/daily-control', authenticateToken, async (req, res) => {
    try {
        const {
            class_id,
            lesson_plan_id,
            class_date,
            start_time,
            end_time,
            lesson_topic,
            lesson_summary = '',
            activities_completed = [],
            general_observations = '',
            disciplinary_notes = '',
            pedagogical_notes = ''
        } = req.body;

        // Validate required fields
        if (!class_id || !class_date || !lesson_topic) {
            return res.status(400).json({
                success: false,
                error: 'Class ID, date, and lesson topic are required'
            });
        }

        // Verify class belongs to user's school and user can create controls
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

        // Check permissions
        const canCreate = 
            req.user.role === 'TEACHER' && 
            (classData.teacher_id === req.user.user_id || classData.co_teacher_id === req.user.user_id) ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canCreate) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to create daily controls for this class'
            });
        }

        // Check for duplicate control on same date
        const { data: existing } = await supabase
            .from('daily_class_control')
            .select('control_id')
            .eq('class_id', class_id)
            .eq('class_date', class_date)
            .single();

        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'A daily control already exists for this class on this date'
            });
        }

        // Get student count for the class
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('student_id')
            .eq('class_id', class_id)
            .eq('status', 'active');

        const totalStudents = enrollments?.length || 0;

        // Create daily control
        const { data: control, error: controlError } = await supabase
            .from('daily_class_control')
            .insert({
                school_id: req.user.school_id,
                class_id,
                lesson_plan_id,
                teacher_id: req.user.user_id,
                class_date,
                start_time,
                end_time,
                lesson_topic,
                lesson_summary,
                activities_completed,
                total_students: totalStudents,
                present_count: 0,
                absent_count: 0,
                late_count: 0,
                justified_count: 0,
                general_observations,
                disciplinary_notes,
                pedagogical_notes,
                status: 'draft'
            })
            .select()
            .single();

        if (controlError) throw controlError;

        res.status(201).json({
            success: true,
            data: control
        });

    } catch (error) {
        console.error('Daily control creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create daily control'
        });
    }
});

// Update daily control
router.put('/daily-control/:controlId', authenticateToken, async (req, res) => {
    try {
        const { controlId } = req.params;
        const updates = req.body;

        // Get existing control
        const { data: existing, error: fetchError } = await supabase
            .from('daily_class_control')
            .select('teacher_id, status, school_id')
            .eq('control_id', controlId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !existing) {
            return res.status(404).json({
                success: false,
                error: 'Daily control not found'
            });
        }

        // Check permissions
        const canEdit = 
            existing.teacher_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canEdit) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to edit this daily control'
            });
        }

        // Don't allow editing signed controls unless admin
        if (existing.status === 'signed' && !['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Cannot edit signed daily controls'
            });
        }

        // Prepare update object
        const allowedUpdates = {
            lesson_plan_id: updates.lesson_plan_id,
            start_time: updates.start_time,
            end_time: updates.end_time,
            lesson_topic: updates.lesson_topic,
            lesson_summary: updates.lesson_summary,
            activities_completed: updates.activities_completed,
            general_observations: updates.general_observations,
            disciplinary_notes: updates.disciplinary_notes,
            pedagogical_notes: updates.pedagogical_notes
        };

        // Remove undefined values
        Object.keys(allowedUpdates).forEach(key => {
            if (allowedUpdates[key] === undefined) {
                delete allowedUpdates[key];
            }
        });

        // Update control
        const { data: updated, error: updateError } = await supabase
            .from('daily_class_control')
            .update(allowedUpdates)
            .eq('control_id', controlId)
            .select()
            .single();

        if (updateError) throw updateError;

        res.json({
            success: true,
            data: updated
        });

    } catch (error) {
        console.error('Daily control update error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update daily control'
        });
    }
});

// Complete and sign daily control
router.post('/daily-control/:controlId/complete', authenticateToken, async (req, res) => {
    try {
        const { controlId } = req.params;

        // Get control with attendance data
        const { data: control, error: fetchError } = await supabase
            .from('daily_class_control')
            .select(`
                *,
                attendance(status)
            `)
            .eq('control_id', controlId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !control) {
            return res.status(404).json({
                success: false,
                error: 'Daily control not found'
            });
        }

        // Check permissions
        const canComplete = 
            control.teacher_id === req.user.user_id ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canComplete) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to complete this daily control'
            });
        }

        // Validate required fields
        if (!control.lesson_topic || control.lesson_topic.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Lesson topic must be at least 10 characters long'
            });
        }

        // Auto-complete attendance summary
        const attendanceSummary = {
            total_students: control.attendance.length,
            present: control.attendance.filter(a => a.status === 'present').length,
            absent: control.attendance.filter(a => a.status === 'absent').length,
            late: control.attendance.filter(a => a.status === 'late').length,
            justified: control.attendance.filter(a => a.status === 'justified').length
        };

        // Update control as completed
        const { error: updateError } = await supabase
            .from('daily_class_control')
            .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                attendance_summary: attendanceSummary
            })
            .eq('control_id', controlId);

        if (updateError) {
            throw updateError;
        }

        res.json({
            success: true,
            data: {
                control_id: controlId,
                status: 'completed',
                attendance_summary: attendanceSummary,
                ready_for_signature: true
            }
        });

    } catch (error) {
        logger.error('Failed to complete daily control:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to complete daily control'
        });
    }
});

// ===============================================
// ATTENDANCE MANAGEMENT
// ===============================================

// Take attendance for a class on a specific date
router.post('/attendance', authenticateToken, async (req, res) => {
    try {
        const {
            class_id,
            attendance_date,
            attendance_records = []
        } = req.body;

        // Validate required fields
        if (!class_id || !attendance_date || !Array.isArray(attendance_records)) {
            return res.status(400).json({
                success: false,
                error: 'Class ID, date, and attendance records are required'
            });
        }

        // Verify class access
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

        // Check permissions
        const canTakeAttendance = 
            req.user.role === 'TEACHER' && 
            (classData.teacher_id === req.user.user_id || classData.co_teacher_id === req.user.user_id) ||
            ['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL'].includes(req.user.role);

        if (!canTakeAttendance) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to take attendance for this class'
            });
        }

        // Get or create daily control for this date
        let { data: dailyControl } = await supabase
            .from('daily_class_control')
            .select('control_id')
            .eq('class_id', class_id)
            .eq('class_date', attendance_date)
            .single();

        if (!dailyControl) {
            const { data: newControl, error: controlError } = await supabase
                .from('daily_class_control')
                .insert({
                    school_id: req.user.school_id,
                    class_id,
                    teacher_id: req.user.user_id,
                    class_date: attendance_date,
                    lesson_topic: 'Clase del día',
                    status: 'draft'
                })
                .select('control_id')
                .single();

            if (controlError) throw controlError;
            dailyControl = newControl;
        }

        // Prepare attendance records with additional data
        const attendanceData = attendance_records.map(record => ({
            school_id: req.user.school_id,
            class_id,
            student_id: record.student_id,
            daily_control_id: dailyControl.control_id,
            attendance_date,
            status: record.status || 'present',
            arrival_time: record.arrival_time || null,
            departure_time: record.departure_time || null,
            minutes_late: record.minutes_late || 0,
            justification_reason: record.justification_reason || null,
            teacher_notes: record.teacher_notes || null,
            recorded_by: req.user.user_id
        }));

        // Delete existing attendance for this date and insert new records
        await supabase
            .from('attendance')
            .delete()
            .eq('class_id', class_id)
            .eq('attendance_date', attendance_date);

        const { data: savedAttendance, error: attendanceError } = await supabase
            .from('attendance')
            .insert(attendanceData)
            .select();

        if (attendanceError) throw attendanceError;

        res.json({
            success: true,
            data: savedAttendance,
            message: 'Attendance recorded successfully'
        });

    } catch (error) {
        console.error('Attendance recording error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to record attendance'
        });
    }
});

// Get attendance for a class and date range
router.get('/attendance/class/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { 
            startDate, 
            endDate, 
            studentId,
            status 
        } = req.query;

        let query = supabase
            .from('attendance')
            .select(`
                *,
                students:users!attendance_student_id_fkey(first_name, last_name, rut),
                daily_class_control(lesson_topic, status)
            `)
            .eq('class_id', classId)
            .eq('school_id', req.user.school_id)
            .order('attendance_date', { ascending: false });

        if (startDate) {
            query = query.gte('attendance_date', startDate);
        }

        if (endDate) {
            query = query.lte('attendance_date', endDate);
        }

        if (studentId) {
            query = query.eq('student_id', studentId);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data: attendance, error } = await query;

        if (error) throw error;

        res.json({
            success: true,
            data: attendance
        });

    } catch (error) {
        console.error('Attendance fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch attendance'
        });
    }
});

// Get attendance statistics
router.get('/attendance/stats/class/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { startDate, endDate } = req.query;

        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const periodStart = startDate || thirtyDaysAgo;
        const periodEnd = endDate || today;

        // Get attendance data for period
        const { data: attendance, error } = await supabase
            .from('attendance')
            .select('student_id, status, attendance_date')
            .eq('class_id', classId)
            .eq('school_id', req.user.school_id)
            .gte('attendance_date', periodStart)
            .lte('attendance_date', periodEnd);

        if (error) throw error;

        // Calculate statistics
        const stats = {
            totalDays: 0,
            totalStudents: 0,
            byStatus: {
                present: 0,
                absent: 0,
                late: 0,
                justified: 0,
                excused: 0,
                medical: 0
            },
            byStudent: {},
            byDate: {}
        };

        // Get unique dates and students
        const uniqueDates = new Set();
        const uniqueStudents = new Set();

        attendance.forEach(record => {
            uniqueDates.add(record.attendance_date);
            uniqueStudents.add(record.student_id);
            
            // Count by status
            stats.byStatus[record.status] = (stats.byStatus[record.status] || 0) + 1;
            
            // Count by student
            if (!stats.byStudent[record.student_id]) {
                stats.byStudent[record.student_id] = {
                    present: 0, absent: 0, late: 0, justified: 0, excused: 0, medical: 0
                };
            }
            stats.byStudent[record.student_id][record.status]++;
            
            // Count by date
            if (!stats.byDate[record.attendance_date]) {
                stats.byDate[record.attendance_date] = {
                    present: 0, absent: 0, late: 0, justified: 0, excused: 0, medical: 0
                };
            }
            stats.byDate[record.attendance_date][record.status]++;
        });

        stats.totalDays = uniqueDates.size;
        stats.totalStudents = uniqueStudents.size;

        // Calculate percentages
        const totalRecords = attendance.length;
        stats.percentages = {};
        Object.keys(stats.byStatus).forEach(status => {
            stats.percentages[status] = totalRecords > 0 
                ? Math.round((stats.byStatus[status] / totalRecords) * 100 * 100) / 100
                : 0;
        });

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Attendance stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate attendance statistics'
        });
    }
});

// ===============================================
// CLASS BOOK EXPORTS
// ===============================================

// Export class book data
router.post('/export', authenticateToken, async (req, res) => {
    try {
        const {
            class_id,
            export_type = 'monthly',
            period_start,
            period_end,
            include_signatures = true
        } = req.body;

        // Validate required fields
        if (!class_id || !period_start || !period_end) {
            return res.status(400).json({
                success: false,
                error: 'Class ID, start date, and end date are required'
            });
        }

        // Check permissions
        if (!['ADMIN_ESCOLAR', 'SUPER_ADMIN_FULL', 'TEACHER'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions to export class book data'
            });
        }

        // Get class data
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select(`
                *,
                subjects(subject_name),
                grade_levels(grade_name),
                teacher:users!classes_teacher_id_fkey(first_name, last_name)
            `)
            .eq('class_id', class_id)
            .eq('school_id', req.user.school_id)
            .single();

        if (classError || !classData) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        // Get daily controls for period
        const { data: controls, error: controlsError } = await supabase
            .from('daily_class_control')
            .select(`
                *,
                attendance(
                    *,
                    students:users!attendance_student_id_fkey(first_name, last_name, rut)
                )
            `)
            .eq('class_id', class_id)
            .gte('class_date', period_start)
            .lte('class_date', period_end)
            .order('class_date');

        if (controlsError) throw controlsError;

        // Generate export data
        const exportData = {
            class: classData,
            period: { start: period_start, end: period_end },
            controls: controls || [],
            exportedAt: new Date().toISOString(),
            exportedBy: req.user.user_id,
            totalDays: controls?.length || 0,
            signatures: include_signatures ? controls?.filter(c => c.signature_hash).length || 0 : 0
        };

        // Generate SHA-256 hash for export integrity
        const exportHash = crypto
            .createHash('sha256')
            .update(JSON.stringify(exportData))
            .digest('hex');

        // Save export record
        const { data: exportRecord, error: exportError } = await supabase
            .from('class_book_exports')
            .insert({
                school_id: req.user.school_id,
                class_id,
                exported_by: req.user.user_id,
                export_type,
                period_start,
                period_end,
                csv_file_url: '', // Would be populated after file generation
                sha256_hash: exportHash,
                status: 'generated'
            })
            .select()
            .single();

        if (exportError) throw exportError;

        res.json({
            success: true,
            data: {
                export: exportRecord,
                exportData,
                hash: exportHash
            },
            message: 'Class book exported successfully'
        });

    } catch (error) {
        console.error('Class book export error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export class book'
        });
    }
});

// Get export history
router.get('/exports/class/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;

        const { data: exports, error } = await supabase
            .from('class_book_exports')
            .select(`
                *,
                exporter:users!class_book_exports_exported_by_fkey(first_name, last_name)
            `)
            .eq('class_id', classId)
            .eq('school_id', req.user.school_id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({
            success: true,
            data: exports
        });

    } catch (error) {
        console.error('Export history fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch export history'
        });
    }
});

// ===============================================
// GRADEBOOK CALCULATION ENGINE (P2-A-04)
// ===============================================

// Convert raw scores to Chilean 1.0-7.0 grading scale
function calculateChileanGrade(scoreRaw, totalPoints, gradingScale = 'chilean_1_7') {
    if (gradingScale !== 'chilean_1_7') {
        throw new Error('Only Chilean 1.0-7.0 grading scale is supported for P1 compliance');
    }

    // Chilean grading scale: 1.0 to 7.0
    const percentage = (scoreRaw / totalPoints) * 100;
    
    // Standard Chilean conversion
    let grade;
    if (percentage >= 85) grade = 7.0;
    else if (percentage >= 80) grade = 6.8;
    else if (percentage >= 75) grade = 6.5;
    else if (percentage >= 70) grade = 6.2;
    else if (percentage >= 65) grade = 6.0;
    else if (percentage >= 60) grade = 5.5;
    else if (percentage >= 55) grade = 5.0;
    else if (percentage >= 50) grade = 4.5;
    else if (percentage >= 40) grade = 4.0;
    else if (percentage >= 30) grade = 3.0;
    else if (percentage >= 20) grade = 2.0;
    else grade = 1.0;

    return Number(grade.toFixed(1));
}

// Cron job endpoint for nightly gradebook calculation
router.post('/gradebook/calculate', authenticateToken, async (req, res) => {
    try {
        const { school_id, force_recalculation = false } = req.body;

        logger.info(`Starting gradebook calculation for school: ${school_id}`);

        // Get all pending evaluation attempts
        const { data: attempts, error: attemptsError } = await supabase
            // // .from('evaluation_attempts') // TEMPORARILY DISABLED // TEMPORARILY DISABLED
            .select(`
                attempt_id,
                eval_id,
                student_id,
                score_raw,
                finished_at,
                evaluations (
                    eval_id,
                    total_points,
                    grading_scale,
                    weight,
                    type,
                    class_id
                )
            `)
            .eq('school_id', school_id)
            .not('score_raw', 'is', null)
            .not('finished_at', 'is', null);

        if (attemptsError) {
            throw attemptsError;
        }

        let processedCount = 0;
        let errorCount = 0;

        for (const attempt of attempts) {
            try {
                // Check if gradebook entry already exists
                const { data: existingEntry } = await supabase
                    .from('gradebook_entries')
                    .select('entry_id')
                    .eq('eval_id', attempt.eval_id)
                    .eq('student_id', attempt.student_id)
                    .single();

                if (existingEntry && !force_recalculation) {
                    continue; // Skip if already calculated
                }

                // Calculate Chilean grade
                const chileanGrade = calculateChileanGrade(
                    attempt.score_raw,
                    attempt.evaluations.total_points,
                    attempt.evaluations.grading_scale
                );

                // Insert or update gradebook entry
                const gradebookData = {
                    eval_id: attempt.eval_id,
                    student_id: attempt.student_id,
                    attempt_id: attempt.attempt_id,
                    score_raw: attempt.score_raw,
                    nota_10: chileanGrade,
                    weight: attempt.evaluations.weight,
                    evaluation_type: attempt.evaluations.type,
                    class_id: attempt.evaluations.class_id,
                    school_id: school_id,
                    recorded_at: new Date().toISOString(),
                    calculation_metadata: {
                        algorithm: 'chilean_1_7_standard',
                        percentage: (attempt.score_raw / attempt.evaluations.total_points) * 100,
                        calculation_date: new Date().toISOString()
                    }
                };

                if (existingEntry) {
                    // Update existing
                    const { error: updateError } = await supabase
                        .from('gradebook_entries')
                        .update(gradebookData)
                        .eq('entry_id', existingEntry.entry_id);

                    if (updateError) throw updateError;
                } else {
                    // Insert new
                    const { error: insertError } = await supabase
                        .from('gradebook_entries')
                        .insert(gradebookData);

                    if (insertError) throw insertError;
                }

                processedCount++;

            } catch (entryError) {
                logger.error(`Failed to process attempt ${attempt.attempt_id}:`, entryError);
                errorCount++;
            }
        }

        logger.info(`Gradebook calculation completed. Processed: ${processedCount}, Errors: ${errorCount}`);

        res.json({
            success: true,
            data: {
                processed_count: processedCount,
                error_count: errorCount,
                total_attempts: attempts.length
            }
        });

    } catch (error) {
        logger.error('Gradebook calculation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Gradebook calculation failed'
        });
    }
});

// ===============================================
// DIGITAL SIGNATURE SYSTEM (P2-A-03)
// ===============================================

// Generate SHA-256 hash signature for class book data
function generateClassBookSignature(data, secretKey) {
    const dataString = JSON.stringify(data, Object.keys(data).sort());
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(dataString);
    return hmac.digest('hex');
}

// Sign daily class control
router.post('/daily-control/:controlId/sign', authenticateToken, async (req, res) => {
    try {
        const { controlId } = req.params;
        const { signature_type = 'teacher', notes = '' } = req.body;

        // Get control data
        const { data: control, error: fetchError } = await supabase
            .from('daily_class_control')
            .select(`
                *,
                attendance (*),
                lesson_activities (*),
                gradebook_entries (*)
            `)
            .eq('control_id', controlId)
            .eq('school_id', req.user.school_id)
            .single();

        if (fetchError || !control) {
            return res.status(404).json({
                success: false,
                error: 'Daily control not found'
            });
        }

        // Prepare signature data
        const signatureData = {
            control_id: controlId,
            control_date: control.control_date,
            class_id: control.class_id,
            teacher_id: control.teacher_id,
            lesson_topic: control.lesson_topic,
            attendance_summary: {
                present: control.attendance.filter(a => a.status === 'present').length,
                absent: control.attendance.filter(a => a.status === 'absent').length,
                late: control.attendance.filter(a => a.status === 'late').length
            },
            activities_count: control.lesson_activities.length,
            grades_recorded: control.gradebook_entries.length,
            signature_timestamp: new Date().toISOString(),
            signed_by: req.user.user_id,
            signature_type
        };

        // Generate digital signature
        const secretKey = process.env.CLASS_BOOK_SECRET_KEY || 'edu21-default-secret';
        const digitalSignature = generateClassBookSignature(signatureData, secretKey);

        // Save signature
        const { data: savedSignature, error: signatureError } = await supabase
            .from('class_book_signatures')
            .insert({
                control_id: controlId,
                signature_data: signatureData,
                digital_signature: digitalSignature,
                signature_type,
                signed_by: req.user.user_id,
                signed_at: new Date().toISOString(),
                school_id: req.user.school_id,
                notes,
                algorithm: 'HMAC-SHA256'
            })
            .select()
            .single();

        if (signatureError) {
            throw signatureError;
        }

        // Update control status
        await supabase
            .from('daily_class_control')
            .update({
                status: signature_type === 'director' ? 'director_signed' : 'teacher_signed',
                signed_at: new Date().toISOString()
            })
            .eq('control_id', controlId);

        res.json({
            success: true,
            data: {
                signature_id: savedSignature.signature_id,
                digital_signature: digitalSignature,
                signed_at: savedSignature.signed_at,
                verification_status: 'valid'
            }
        });

    } catch (error) {
        logger.error('Digital signature failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate digital signature'
        });
    }
});

// Verify class book signature
router.get('/daily-control/:controlId/verify', authenticateToken, async (req, res) => {
    try {
        const { controlId } = req.params;

        // Get signature data
        const { data: signature, error: sigError } = await supabase
            .from('class_book_signatures')
            .select('*')
            .eq('control_id', controlId)
            .order('signed_at', { ascending: false })
            .limit(1)
            .single();

        if (sigError || !signature) {
            return res.status(404).json({
                success: false,
                error: 'Signature not found'
            });
        }

        // Verify signature
        const secretKey = process.env.CLASS_BOOK_SECRET_KEY || 'edu21-default-secret';
        const expectedSignature = generateClassBookSignature(signature.signature_data, secretKey);
        const isValid = expectedSignature === signature.digital_signature;

        res.json({
            success: true,
            data: {
                signature_id: signature.signature_id,
                is_valid: isValid,
                signed_by: signature.signed_by,
                signed_at: signature.signed_at,
                signature_type: signature.signature_type,
                algorithm: signature.algorithm
            }
        });

    } catch (error) {
        logger.error('Signature verification failed:', error);
        res.status(500).json({
            success: false,
            error: 'Signature verification failed'
        });
    }
});

// ===============================================
// CSV EXPORT WITH LEGAL COMPLIANCE (P2-A-04)
// ===============================================

// Export class book with digital signatures - LibreOffice ready
router.get('/export/libro-clases/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { 
            start_date, 
            end_date, 
            format = 'csv',
            include_signatures = true 
        } = req.query;

        // Get class information
        const { data: classInfo, error: classError } = await supabase
            .from('classes')
            .select(`
                class_id,
                class_name,
                grade_code,
                subject_name,
                year,
                schools (school_name),
                users!classes_teacher_id_fkey (full_name)
            `)
            .eq('class_id', classId)
            .eq('school_id', req.user.school_id)
            .single();

        if (classError || !classInfo) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }

        // Get all daily controls for the period
        const { data: controls, error: controlsError } = await supabase
            .from('daily_class_control')
            .select(`
                control_id,
                control_date,
                lesson_topic,
                lesson_summary,
                materials_used,
                observations,
                status,
                signed_at,
                attendance (*),
                gradebook_entries (*),
                class_book_signatures (*)
            `)
            .eq('class_id', classId)
            .gte('control_date', start_date)
            .lte('control_date', end_date)
            .order('control_date', { ascending: true });

        if (controlsError) {
            throw controlsError;
        }

        // Get students in class
        const { data: students, error: studentsError } = await supabase
            .from('class_enrollments')
            .select(`
                student_id,
                users (
                    full_name,
                    rut,
                    email
                )
            `)
            .eq('class_id', classId)
            .eq('status', 'active');

        if (studentsError) {
            throw studentsError;
        }

        // Prepare CSV data
        const csvData = [];

        // Header information
        csvData.push({
            'LIBRO DE CLASES DIGITAL': '',
            'Establecimiento': classInfo.schools.school_name,
            'Curso': `${classInfo.grade_code} - ${classInfo.class_name}`,
            'Asignatura': classInfo.subject_name,
            'Año': classInfo.year,
            'Profesor': classInfo.users.full_name,
            'Fecha Exportación': new Date().toLocaleDateString('es-CL'),
            'Período': `${start_date} al ${end_date}`
        });

        // Empty row separator
        csvData.push({});

        // Daily controls data
        for (const control of controls) {
            csvData.push({
                'Fecha': control.control_date,
                'Tema de Clase': control.lesson_topic,
                'Resumen': control.lesson_summary,
                'Materiales': control.materials_used?.join(', ') || '',
                'Observaciones': control.observations || '',
                'Estado': control.status,
                'Firmado': control.signed_at ? 'Sí' : 'No',
                'Presentes': control.attendance.filter(a => a.status === 'present').length,
                'Ausentes': control.attendance.filter(a => a.status === 'absent').length,
                'Atrasados': control.attendance.filter(a => a.status === 'late').length
            });

            // Add signature verification if requested
            if (include_signatures && control.class_book_signatures.length > 0) {
                const signature = control.class_book_signatures[0];
                csvData.push({
                    'Firma Digital': signature.digital_signature,
                    'Firmado por': signature.signed_by,
                    'Fecha Firma': signature.signed_at,
                    'Algoritmo': signature.algorithm,
                    'Tipo': signature.signature_type
                });
            }

            // Empty row separator
            csvData.push({});
        }

        // Generate CSV with proper LibreOffice formatting
        const fields = Object.keys(csvData[0]);
        const opts = {
            fields,
            delimiter: ';', // LibreOffice friendly
            quote: '"',
            header: true,
            encoding: 'utf8'
        };

        const parser = new Parser(opts);
        const csv = parser.parse(csvData);

        // Generate export hash for integrity
        const exportHash = crypto.createHash('sha256').update(csv).digest('hex');

        // Log export for audit trail
        logger.info(`Class book exported: ${classId}, hash: ${exportHash}`);

        // Set response headers
        const filename = `libro-clases-${classInfo.grade_code}-${classInfo.class_name}-${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('X-Export-Hash', exportHash);
        res.setHeader('X-Export-Timestamp', new Date().toISOString());

        res.send(csv);

    } catch (error) {
        logger.error('Class book export failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export class book'
        });
    }
});

// Export gradebook (Libro de Notas) - P2-A-04
router.get('/export/libro-notas/:classId', authenticateToken, async (req, res) => {
    try {
        const { classId } = req.params;
        const { format = 'csv' } = req.query;

        // Get class and gradebook data
        const { data: gradebookData, error: gradebookError } = await supabase
            .from('gradebook_entries')
            .select(`
                entry_id,
                eval_id,
                student_id,
                score_raw,
                nota_10,
                weight,
                evaluation_type,
                recorded_at,
                users (full_name, rut),
                evaluations (title, type, weight, total_points)
            `)
            .eq('class_id', classId)
            .order('student_id')
            .order('recorded_at');

        if (gradebookError) {
            throw gradebookError;
        }

        // Group by student
        const studentGrades = {};
        gradebookData.forEach(entry => {
            if (!studentGrades[entry.student_id]) {
                studentGrades[entry.student_id] = {
                    student_name: entry.users.full_name,
                    student_rut: entry.users.rut,
                    grades: []
                };
            }
            studentGrades[entry.student_id].grades.push({
                evaluation: entry.evaluations.title,
                type: entry.evaluations.type,
                score_raw: entry.score_raw,
                total_points: entry.evaluations.total_points,
                nota_10: entry.nota_10,
                weight: entry.weight,
                recorded_at: entry.recorded_at
            });
        });

        // Prepare CSV data
        const csvData = [];
        
        for (const [studentId, studentData] of Object.entries(studentGrades)) {
            const averageGrade = studentData.grades.reduce((sum, grade) => sum + grade.nota_10, 0) / studentData.grades.length;
            
            csvData.push({
                'RUT': studentData.student_rut,
                'Nombre Completo': studentData.student_name,
                'Promedio': Number(averageGrade.toFixed(1)),
                'Total Evaluaciones': studentData.grades.length
            });

            // Add individual grades
            studentData.grades.forEach(grade => {
                csvData.push({
                    'Evaluación': grade.evaluation,
                    'Tipo': grade.type,
                    'Puntaje': `${grade.score_raw}/${grade.total_points}`,
                    'Nota (1-7)': grade.nota_10,
                    'Ponderación': `${grade.weight}%`,
                    'Fecha': new Date(grade.recorded_at).toLocaleDateString('es-CL')
                });
            });

            csvData.push({}); // Separator
        }

        const parser = new Parser({
            delimiter: ';',
            quote: '"',
            header: true
        });
        const csv = parser.parse(csvData);

        const filename = `libro-notas-${classId}-${new Date().toISOString().split('T')[0]}.csv`;
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.send(csv);

    } catch (error) {
        logger.error('Gradebook export failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export gradebook'
        });
    }
});

module.exports = router; 
