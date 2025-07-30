const express = require('express');
const { supabase } = require('../database/supabase'); // Import Supabase client
const { authenticateToken, requireRole } = require('../middleware/auth'); // Import auth middleware
const router = express.Router();

// GET all questions from question_bank
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { user } = req;
        // Fetch questions where is_validated is true (global questions) OR author_id is the current user's ID
        const { data: questions, error } = await supabase
            .from('question_bank')
            .select('*')
            .or(`is_validated.eq.true,author_id.eq.${user.user_id}`);

        if (error) {
            console.error('Error fetching questions from question_bank:', error);
            return res.status(500).json({ message: 'Error al cargar preguntas del banco' });
        }
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error in GET /question-bank:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST a new question to question_bank
router.post('/', authenticateToken, requireRole(['teacher', 'admin_escolar']), async (req, res) => {
    const { user } = req;
    const {
        question_text,
        question_type,
        options_json,
        correct_answer,
        explanation_text,
        oa_id,
        skill_tags,
        bloom_level,
        difficulty_score,
        is_validated = false, // Default to false for new questions
        is_ai_generated = false // Default to false for manually created questions
    } = req.body;

    // Basic validation
    if (!question_text || !question_type || !oa_id || !bloom_level || !difficulty_score) {
        return res.status(400).json({ message: 'Faltan campos obligatorios para crear la pregunta.' });
    }

    try {
        const { data, error } = await supabase
            .from('question_bank')
            .insert(
                {
                    question_text,
                    question_type,
                    options_json,
                    correct_answer,
                    explanation_text,
                    oa_id,
                    skill_tags,
                    bloom_level,
                    difficulty_score,
                    is_validated,
                    is_ai_generated,
                    author_id: user.user_id // Set author to the current user
                }
            )
            .select()
            .single();

        if (error) {
            console.error('Error inserting question into question_bank:', error);
            return res.status(500).json({ message: 'Error al guardar la pregunta en el banco' });
        }
        res.status(201).json(data);
    } catch (error) {
        console.error('Error in POST /question-bank:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// DELETE a question from question_bank
router.delete('/:id', authenticateToken, requireRole(['teacher', 'admin_escolar']), async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    try {
        // Ensure only the author or an admin can delete the question
        const { data: question, error: fetchError } = await supabase
            .from('question_bank')
            .select('author_id')
            .eq('question_id', id)
            .single();

        if (fetchError || !question) {
            return res.status(404).json({ message: 'Pregunta no encontrada.' });
        }

        if (question.author_id !== user.user_id && user.role.toLowerCase() !== 'admin_escolar' && user.role.toLowerCase() !== 'super_admin_full') {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta pregunta.' });
        }

        const { error } = await supabase
            .from('question_bank')
            .delete()
            .eq('question_id', id);

        if (error) {
            console.error('Error deleting question from question_bank:', error);
            return res.status(500).json({ message: 'Error al eliminar la pregunta del banco' });
        }
        res.status(200).json({ message: 'Pregunta eliminada exitosamente.' });
    } catch (error) {
        console.error('Error in DELETE /question-bank/:id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT (update) a question in question_bank
router.put('/:id', authenticateToken, requireRole(['teacher', 'admin_escolar']), async (req, res) => {
    const { id } = req.params;
    const { user } = req;
    const updatedFields = req.body;

    try {
        // Ensure only the author or an admin can update the question
        const { data: question, error: fetchError } = await supabase
            .from('question_bank')
            .select('author_id')
            .eq('question_id', id)
            .single();

        if (fetchError || !question) {
            return res.status(404).json({ message: 'Pregunta no encontrada.' });
        }

        if (question.author_id !== user.user_id && user.role.toLowerCase() !== 'admin_escolar' && user.role.toLowerCase() !== 'super_admin_full') {
            return res.status(403).json({ message: 'No tienes permiso para editar esta pregunta.' });
        }

        const { data, error } = await supabase
            .from('question_bank')
            .update(updatedFields)
            .eq('question_id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating question in question_bank:', error);
            return res.status(500).json({ message: 'Error al actualizar la pregunta en el banco' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in PUT /question-bank/:id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;