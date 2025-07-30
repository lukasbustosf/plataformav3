const express = require('express');
const router = express.Router();
const { supabase } = require('../database/supabase');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService'); // Import the email service

// This file will now primarily handle the assignment of evaluations to classes/students
// and related student-specific views like assignments.
// Evaluation creation and general evaluation details are handled in evaluation.js

/**
 * POST /my-evaluations/assign
 * Assigns an evaluation to one or more classes, creates a game session, and notifies students.
 */
router.post('/assign', authenticateToken, requireRole(['teacher', 'admin_escolar']), async (req, res) => {
    try {
        const { user } = req;
        const { evaluationId, classIds, dueDate, engineId } = req.body;

        if (!evaluationId || !classIds || !Array.isArray(classIds) || classIds.length === 0 || !dueDate || !engineId) {
            return res.status(400).json({ message: 'Missing required fields: evaluationId, classIds, dueDate, and engineId' });
        }

        // 1. Fetch evaluation details to get title, description, etc.
        const { data: evaluation, error: evalError } = await supabase
            .from('evaluations')
            .select('*')
            .eq('eval_id', evaluationId)
            .single();

        if (evalError || !evaluation) {
            console.error('Error fetching evaluation:', evalError);
            return res.status(404).json({ message: 'Evaluation not found.' });
        }

        const gameSessionIds = [];
        for (const classId of classIds) {
            // 2. Create a game_session for each assigned class
            // This links the evaluation to a specific class and provides a unique session ID for students
            const { data: gameSession, error: gameSessionError } = await supabase
                .from('game_sessions')
                .insert({
                    evaluation_id: evaluation.eval_id,
                    class_id: classId,
                    teacher_id: user.user_id,
                    due_date: dueDate,
                    status: 'assigned', // or 'pending', 'ready'
                    game_template_id: engineId, // Store the game template ID here
                    // Add other relevant fields from evaluation if needed, e.g., title, description
                    title: evaluation.title,
                    description: evaluation.description,
                })
                .select()
                .single();

            if (gameSessionError) {
                console.error(`Error creating game session for class ${classId}:`, gameSessionError);
                // Continue to next class or throw error
                throw new Error(`Failed to create game session for class ${classId}`);
            }
            gameSessionIds.push(gameSession.session_id);

            // 3. Fetch students in the current class
            const { data: students, error: studentsError } = await supabase
                .from('student_classes')
                .select('user_id, users(email, first_name, last_name)')
                .eq('class_id', classId);

            if (studentsError) {
                console.error(`Error fetching students for class ${classId}:`, studentsError);
                continue; // Continue to next class even if student fetch fails for one
            }

            // 4. Send email notification to each student
            for (const student of students) {
                const studentEmail = student.users?.email;
                const studentName = student.users?.first_name || 'Estimado estudiante';
                const evaluationLink = `${process.env.FRONTEND_URL}/student/evaluation/${gameSession.session_id}`; // Ensure FRONTEND_URL is set in .env

                if (studentEmail) {
                    const subject = `¡Nueva Evaluación Asignada: ${evaluation.title}!`;
                    const text = `Hola ${studentName},

El profesor ${user.first_name} ${user.last_name} te ha asignado una nueva evaluación: "${evaluation.title}".

Fecha límite: ${new Date(dueDate).toLocaleDateString()}

¡Haz clic aquí para comenzar: ${evaluationLink}

¡Mucho éxito!`;
                    const html = `<p>Hola ${studentName},</p>
                                  <p>El profesor ${user.first_name} ${user.last_name} te ha asignado una nueva evaluación: <strong>${evaluation.title}</strong>.</p>
                                  <p><strong>Fecha límite:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
                                  <p>¡Haz clic <a href="${evaluationLink}">aquí</a> para comenzar!</p>
                                  <p>¡Mucho éxito!</p>`;
                    
                    await sendEmail(studentEmail, subject, text, html);

                    // 5. Insert in-platform notification
                    await supabase
                        .from('notifications')
                        .insert({
                            user_id: student.user_id,
                            title: `Nueva Evaluación: ${evaluation.title}`,
                            message: `El profesor ${user.first_name} ${user.last_name} te ha asignado una nueva evaluación. Fecha límite: ${new Date(dueDate).toLocaleDateString()}`,
                            link: evaluationLink,
                        });
                }
            }
        }

        res.status(201).json({
            success: true,
            message: 'Evaluación asignada y notificaciones enviadas exitosamente.',
            gameSessionIds: gameSessionIds,
        });

    } catch (error) {
        console.error('Error assigning evaluation:', error);
        res.status(500).json({ message: error.message || 'Internal server error during assignment.' });
    }
});

/**
 * GET /my-evaluations/student-assignments/:studentId
 * Get all assigned evaluations for a specific student.
 */
router.get('/student-assignments/:studentId', authenticateToken, requireRole(['student']), async (req, res) => {
    try {
        const { studentId } = req.params;

        // Fetch game sessions assigned to classes the student belongs to
        const { data: studentClasses, error: studentClassesError } = await supabase
            .from('student_classes')
            .select('class_id')
            .eq('user_id', studentId);

        if (studentClassesError) {
            console.error('Error fetching student classes:', studentClassesError);
            return res.status(500).json({ message: 'Error fetching student classes.' });
        }

        const classIds = studentClasses.map(sc => sc.class_id);

        const { data: gameSessions, error: gameSessionsError } = await supabase
            .from('game_sessions')
            .select('session_id, evaluation_id, title, description, due_date, status, game_template_id')
            .in('class_id', classIds)
            .order('due_date', { ascending: true });

        if (gameSessionsError) {
            console.error('Error fetching game sessions for student:', gameSessionsError);
            return res.status(500).json({ message: 'Error fetching student assignments.' });
        }

        // Transform game sessions into assignment format for the calendar
        const assignments = gameSessions.map(session => ({
            id: session.session_id, // Use session_id as the assignment ID
            evaluationId: session.evaluation_id,
            title: session.title,
            description: session.description,
            dueDate: session.due_date,
            gameSessionId: session.session_id, // This is the key for the frontend link
            type: 'evaluation', // Indicate it's an evaluation for the calendar component
        }));

        res.status(200).json(assignments);

    } catch (error) {
        console.error('Error fetching student assignments:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Placeholder for other my-evaluations routes if needed, but they should ideally
// be handled by evaluation.js or other specific routes.
// For now, we'll only keep the assignment and student-assignments routes.

module.exports = router;
