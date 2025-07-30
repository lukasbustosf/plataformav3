const express = require('express');
const { supabase } = require('../database/supabase');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Datos mock temporales para desarrollo
const MOCK_OAS = [
    {
        oa_id: '550e8400-e29b-41d4-a716-446655440020',
        oa_code: 'MA01-OA01',
        oa_desc: 'Contar números del 0 al 20 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 20.',
        oa_short_desc: 'Contar números del 0 al 20',
        bloom_level: 'Recordar',
        semester: 1,
        complexity_level: 1,
        estimated_hours: 8,
        grade_code: '1B',
        subject_id: '550e8400-e29b-41d4-a716-446655440030',
        grade_levels: { grade_name: '1° Básico' },
        subjects: { subject_name: 'Matemática', subject_color: '#3B82F6' }
    },
    {
        oa_id: '550e8400-e29b-41d4-a716-446655440021',
        oa_code: 'MA01-OA02',
        oa_desc: 'Identificar el orden de los elementos de una secuencia, utilizando números ordinales del primero (1°) al décimo (10°).',
        oa_short_desc: 'Números ordinales 1° al 10°',
        bloom_level: 'Comprender',
        semester: 1,
        complexity_level: 2,
        estimated_hours: 6,
        grade_code: '1B',
        subject_id: '550e8400-e29b-41d4-a716-446655440030',
        grade_levels: { grade_name: '1° Básico' },
        subjects: { subject_name: 'Matemática', subject_color: '#3B82F6' }
    },
    {
        oa_id: '550e8400-e29b-41d4-a716-446655440022',
        oa_code: 'LE01-OA01',
        oa_desc: 'Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un propósito.',
        oa_short_desc: 'Propósito de los textos escritos',
        bloom_level: 'Comprender',
        semester: 1,
        complexity_level: 1,
        estimated_hours: 4,
        grade_code: '1B',
        subject_id: '550e8400-e29b-41d4-a716-446655440031',
        grade_levels: { grade_name: '1° Básico' },
        subjects: { subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' }
    },
    {
        oa_id: '550e8400-e29b-41d4-a716-446655440023',
        oa_code: 'CN02-OA01',
        oa_desc: 'Reconocer y observar, por medio de la exploración, que los seres vivos crecen, responden a estímulos del medio.',
        oa_short_desc: 'Características de los seres vivos',
        bloom_level: 'Comprender',
        semester: 1,
        complexity_level: 2,
        estimated_hours: 8,
        grade_code: '2B',
        subject_id: '550e8400-e29b-41d4-a716-446655440032',
        grade_levels: { grade_name: '2° Básico' },
        subjects: { subject_name: 'Ciencias Naturales', subject_color: '#10B981' }
    }
];

const MOCK_GRADES = [
    { grade_code: '1B', grade_name: '1° Básico' },
    { grade_code: '2B', grade_name: '2° Básico' },
    { grade_code: '3B', grade_name: '3° Básico' },
    { grade_code: '4B', grade_name: '4° Básico' },
    { grade_code: '5B', grade_name: '5° Básico' },
    { grade_code: '6B', grade_name: '6° Básico' },
    { grade_code: '7B', grade_name: '7° Básico' },
    { grade_code: '8B', grade_name: '8° Básico' },
    { grade_code: '1M', grade_name: '1° Medio' },
    { grade_code: '2M', grade_name: '2° Medio' },
    { grade_code: '3M', grade_name: '3° Medio' },
    { grade_code: '4M', grade_name: '4° Medio' }
];

const MOCK_SUBJECTS = [
    { subject_id: '550e8400-e29b-41d4-a716-446655440030', subject_code: 'MAT', subject_name: 'Matemática', subject_color: '#3B82F6' },
    { subject_id: '550e8400-e29b-41d4-a716-446655440031', subject_code: 'LEN', subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' },
    { subject_id: '550e8400-e29b-41d4-a716-446655440032', subject_code: 'CN', subject_name: 'Ciencias Naturales', subject_color: '#10B981' },
    { subject_id: '550e8400-e29b-41d4-a716-446655440033', subject_code: 'HIS', subject_name: 'Historia, Geografía y Cs. Sociales', subject_color: '#F59E0B' }
];

// ================================
// LEARNING OBJECTIVES (OA) ROUTES
// ================================

/**
 * GET /api/oa/search
 * Search learning objectives by grade, subject, and text
 */
router.get('/search', authenticateToken, async (req, res) => {
    try {
        const { 
            grade_code, 
            subject_id, 
            search = '', 
            semester,
            bloom_level,
            limit = 50 
        } = req.query;

        console.log('🔍 Searching OAs with filters:', { grade_code, subject_id, search, semester, bloom_level });

        let oas = [];
        let usedMockData = false;

        // Si Supabase está configurado, intentar buscar primero
        if (supabase) {
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
                    grade_code,
                    subject_id,
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
                const searchTerm = search.trim();
                query = query.or(`oa_desc.ilike.%${searchTerm}%,oa_short_desc.ilike.%${searchTerm}%,oa_code.ilike.%${searchTerm}%`);
            }

            // Order and limit
            query = query.order('oa_code').limit(parseInt(limit));

            const { data: supabaseOAs, error } = await query;

            if (!error && supabaseOAs && supabaseOAs.length > 0) {
                oas = supabaseOAs;
                console.log(`✅ Found ${oas.length} OAs from Supabase`);
            } else {
                console.log('⚠️  No OAs found in Supabase, using mock data as fallback');
                usedMockData = true;
            }
        } else {
            console.log('⚠️  Supabase not configured, using mock data');
            usedMockData = true;
        }

        // Si no hay datos de Supabase o Supabase no está configurado, usar datos mock
        if (usedMockData) {
            let filteredOAs = [...MOCK_OAS];

            // Aplicar filtros a datos mock
            if (grade_code) {
                filteredOAs = filteredOAs.filter(oa => oa.grade_code === grade_code);
            }
            if (subject_id) {
                filteredOAs = filteredOAs.filter(oa => oa.subject_id === subject_id);
            }
            if (semester) {
                filteredOAs = filteredOAs.filter(oa => oa.semester === parseInt(semester));
            }
            if (bloom_level) {
                filteredOAs = filteredOAs.filter(oa => oa.bloom_level === bloom_level);
            }
            if (search.trim()) {
                const searchTerm = search.toLowerCase();
                filteredOAs = filteredOAs.filter(oa => 
                    oa.oa_desc.toLowerCase().includes(searchTerm) ||
                    oa.oa_short_desc.toLowerCase().includes(searchTerm) ||
                    oa.oa_code.toLowerCase().includes(searchTerm)
                );
            }

            // Limitar resultados
            oas = filteredOAs.slice(0, parseInt(limit));
            console.log(`✅ Found ${oas.length} mock OAs`);
        }

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
                },
                mockData: usedMockData
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

/**
 * GET /api/oa/grades
 * Get all grade levels
 */
router.get('/grades', authenticateToken, async (req, res) => {
    try {
        // Si Supabase no está configurado, usar datos mock
        if (!supabase) {
            console.log('⚠️  Using mock grades data');
            return res.json({
                success: true,
                data: MOCK_GRADES
            });
        }

        const { data: grades, error } = await supabase
            .from('grade_levels')
            .select('grade_code, grade_name')
            .order('grade_code');

        if (error) throw error;

        res.json({
            success: true,
            data: grades || []
        });

    } catch (error) {
        console.error('Get grades error:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener grados',
            details: error.message
        });
    }
});

/**
 * GET /api/oa/subjects
 * Get all subjects
 */
router.get('/subjects', authenticateToken, async (req, res) => {
    try {
        // Si Supabase no está configurado, usar datos mock
        if (!supabase) {
            console.log('⚠️  Using mock subjects data');
            return res.json({
                success: true,
                data: MOCK_SUBJECTS
            });
        }

        const { data: subjects, error } = await supabase
            .from('subjects')
            .select('subject_id, subject_code, subject_name, subject_color, department')
            .order('subject_name');

        if (error) throw error;

        res.json({
            success: true,
            data: subjects || []
        });

    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener materias',
            details: error.message
        });
    }
});

module.exports = router; 
