const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN Y AUTORIZACIÓN
// =====================================================

const authenticateUser = async (req, res, next) => {
    try {
        // Aquí iría la lógica de autenticación con Supabase
        // Por ahora, asumimos que el user_id viene en el header
        const userId = req.headers['user-id'];
        if (!userId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        
        const user = await prisma.users.findUnique({
            where: { user_id: userId },
            include: { schools: true }
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ error: 'Error de autenticación' });
    }
};

const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        next();
    };
};

// =====================================================
// APIS PARA EXPERIENCIAS GAMIFICADAS
// =====================================================

// GET /api/experiences - Listar experiencias disponibles
router.get('/experiences', authenticateUser, async (req, res) => {
    try {
        const experiences = await prisma.gamified_experiences.findMany({
            where: { active: true },
            include: {
                learning_objectives: {
                    select: {
                        oa_code: true,
                        oa_desc: true,
                        grade_code: true,
                        subjects: {
                            select: {
                                subject_name: true
                            }
                        }
                    }
                }
            }
        });
        
        // Transformar datos para el frontend
        const transformedExperiences = experiences.map(exp => ({
            id: exp.experience_id,
            title: exp.title,
            description: exp.description,
            subject: exp.learning_objectives.subjects.subject_name,
            grade: exp.learning_objectives.grade_code,
            oa_code: exp.learning_objectives.oa_code,
            experience_type: exp.experience_type,
            icon: '🔍', // Por defecto, se puede personalizar
            color: '#4CAF50', // Por defecto, se puede personalizar
            status: 'available', // Por defecto, se puede calcular basado en progreso
            progress: 0 // Por defecto, se puede calcular
        }));
        
        res.json({
            success: true,
            experiences: transformedExperiences
        });
    } catch (error) {
        console.error('Error al obtener experiencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/experiences/{id} - Obtener experiencia específica
router.get('/experiences/:id', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        
        const experience = await prisma.gamified_experiences.findUnique({
            where: { experience_id: id },
            include: {
                learning_objectives: {
                    select: {
                        oa_code: true,
                        oa_desc: true,
                        grade_code: true,
                        subjects: {
                            select: {
                                subject_name: true
                            }
                        }
                    }
                }
            }
        });
        
        if (!experience) {
            return res.status(404).json({ error: 'Experiencia no encontrada' });
        }
        
        res.json({
            success: true,
            experience: {
                id: experience.experience_id,
                title: experience.title,
                description: experience.description,
                subject: experience.learning_objectives.subjects.subject_name,
                grade: experience.learning_objectives.grade_code,
                oa_code: experience.learning_objectives.oa_code,
                experience_type: experience.experience_type,
                settings: experience.settings_json
            }
        });
    } catch (error) {
        console.error('Error al obtener experiencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/experiences/{id}/session - Crear o cargar sesión de experiencia
router.post('/experiences/:id/session', authenticateUser, async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, school_id } = req.body;
        
        // Verificar que la experiencia existe y está activa
        const experience = await prisma.gamified_experiences.findUnique({
            where: { 
                experience_id: id,
                active: true
            }
        });
        
        if (!experience) {
            return res.status(404).json({ error: 'Experiencia no encontrada o inactiva' });
        }
        
        // Buscar sesión existente o crear nueva
        let session = await prisma.experience_sessions.findFirst({
            where: {
                experience_id: id,
                user_id: user_id,
                status: { in: ['active', 'paused'] }
            }
        });
        
        if (!session) {
            // Crear nueva sesión
            session = await prisma.experience_sessions.create({
                data: {
                    experience_id: id,
                    user_id: user_id,
                    school_id: school_id,
                    progress_json: {
                        current_world: 'bosque_decenas',
                        completed_challenges: [],
                        unlocked_tools: [],
                        unlocked_worlds: ['bosque_decenas']
                    },
                    rewards_json: [],
                    metadata_json: {
                        total_actions: 0,
                        patterns_discovered: 0,
                        tools_used: 0,
                        family_activities: 0,
                        achievements_earned: 0
                    },
                    status: 'active'
                }
            });
        }
        
        res.json({
            success: true,
            session_id: session.session_id,
            status: session.status
        });
    } catch (error) {
        console.error('Error al crear/cargar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/experiences/discovery-path/{session_id} - Cargar estado de sesión
router.get('/experiences/discovery-path/:sessionId', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await prisma.experience_sessions.findUnique({
            where: { session_id: sessionId },
            include: {
                gamified_experiences: {
                    include: {
                        learning_objectives: true
                    }
                },
                users: {
                    select: {
                        first_name: true,
                        last_name: true,
                        role: true
                    }
                }
            }
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }
        
        // Verificar que el usuario tiene acceso a esta sesión
        if (session.user_id !== req.user.user_id && req.user.role !== 'TEACHER') {
            return res.status(403).json({ error: 'Acceso denegado a esta sesión' });
        }
        
        res.json({
            success: true,
            data: {
                session_id: session.session_id,
                current_world: session.progress_json.current_world || 'bosque_decenas',
                completed_challenges: session.progress_json.completed_challenges || [],
                unlocked_tools: session.progress_json.unlocked_tools || [],
                rewards: session.rewards_json,
                experience_settings: session.gamified_experiences.settings_json,
                status: session.status
            }
        });
    } catch (error) {
        console.error('Error al cargar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/experiences/discovery-path/{session_id}/action - Registrar interacciones
router.post('/experiences/discovery-path/:sessionId/action', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { action_type, data, timestamp } = req.body;
        
        // Validar tipos de acción permitidos
        const allowedActions = ['hypothesis_test', 'drag_drop', 'voice_command', 'pattern_discovery'];
        if (!allowedActions.includes(action_type)) {
            return res.status(400).json({ error: 'Tipo de acción no válido' });
        }
        
        const session = await prisma.experience_sessions.findUnique({
            where: { session_id: sessionId }
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }
        
        // Verificar acceso
        if (session.user_id !== req.user.user_id && req.user.role !== 'TEACHER') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        
        // Procesar la acción según el tipo
        let feedback = {};
        let progressUpdate = {};
        
        switch (action_type) {
            case 'hypothesis_test':
                feedback = await processHypothesisTest(data, session);
                break;
            case 'drag_drop':
                feedback = await processDragDrop(data, session);
                break;
            case 'voice_command':
                feedback = await processVoiceCommand(data, session);
                break;
            case 'pattern_discovery':
                feedback = await processPatternDiscovery(data, session);
                break;
        }
        
        // Actualizar progreso en la base de datos
        const updatedProgress = {
            ...session.progress_json,
            ...progressUpdate,
            last_action: {
                type: action_type,
                data: data,
                timestamp: timestamp || new Date().toISOString()
            }
        };
        
        await prisma.experience_sessions.update({
            where: { session_id: sessionId },
            data: {
                progress_json: updatedProgress,
                updated_at: new Date()
            }
        });
        
        res.json({
            success: true,
            data: {
                valid: feedback.valid,
                feedback: feedback.message,
                progress_update: progressUpdate,
                rewards: feedback.rewards || []
            }
        });
    } catch (error) {
        console.error('Error al procesar acción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/experiences/discovery-path/{session_id}/complete-challenge - Completar desafío
router.post('/experiences/discovery-path/:sessionId/complete-challenge', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { challenge_id, performance_metrics } = req.body;
        
        const session = await prisma.experience_sessions.findUnique({
            where: { session_id: sessionId },
            include: {
                gamified_experiences: true
            }
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }
        
        // Verificar acceso
        if (session.user_id !== req.user.user_id && req.user.role !== 'TEACHER') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        
        // Actualizar progreso con el desafío completado
        const currentProgress = session.progress_json;
        const completedChallenges = currentProgress.completed_challenges || [];
        
        if (!completedChallenges.includes(challenge_id)) {
            completedChallenges.push(challenge_id);
        }
        
        // Verificar si se puede avanzar al siguiente mundo
        const experienceSettings = session.gamified_experiences.settings_json;
        const currentWorld = currentProgress.current_world || 'bosque_decenas';
        const worlds = experienceSettings.worlds || [];
        
        let nextWorld = null;
        let worldUnlocked = false;
        
        // Lógica para determinar el siguiente mundo
        const worldIndex = worlds.findIndex(w => w.id === currentWorld);
        if (worldIndex >= 0 && worldIndex < worlds.length - 1) {
            const currentWorldData = worlds[worldIndex];
            const challengesInWorld = currentWorldData.challenges || [];
            const completedInWorld = completedChallenges.filter(c => 
                challengesInWorld.includes(c)
            );
            
            if (completedInWorld.length >= challengesInWorld.length * 0.8) {
                nextWorld = worlds[worldIndex + 1].id;
                worldUnlocked = true;
            }
        }
        
        const updatedProgress = {
            ...currentProgress,
            completed_challenges: completedChallenges,
            current_world: nextWorld || currentWorld,
            world_unlocked: worldUnlocked,
            performance_metrics: {
                ...currentProgress.performance_metrics,
                [challenge_id]: performance_metrics
            }
        };
        
        await prisma.experience_sessions.update({
            where: { session_id: sessionId },
            data: {
                progress_json: updatedProgress,
                updated_at: new Date()
            }
        });
        
        res.json({
            success: true,
            data: {
                challenge_completed: true,
                world_unlocked: worldUnlocked,
                next_world: nextWorld,
                rewards: worldUnlocked ? ['new_world_access'] : []
            }
        });
    } catch (error) {
        console.error('Error al completar desafío:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/experiences/discovery-path/{session_id}/claim-reward - Reclamar recompensa
router.post('/experiences/discovery-path/:sessionId/claim-reward', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { reward_type, reward_id } = req.body;
        
        const session = await prisma.experience_sessions.findUnique({
            where: { session_id: sessionId }
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }
        
        // Verificar acceso
        if (session.user_id !== req.user.user_id && req.user.role !== 'TEACHER') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        
        // Actualizar recompensas
        const currentRewards = session.rewards_json;
        const userRewards = currentRewards.user_rewards || [];
        
        if (!userRewards.includes(reward_id)) {
            userRewards.push({
                id: reward_id,
                type: reward_type,
                claimed_at: new Date().toISOString()
            });
        }
        
        const updatedRewards = {
            ...currentRewards,
            user_rewards: userRewards
        };
        
        await prisma.experience_sessions.update({
            where: { session_id: sessionId },
            data: {
                rewards_json: updatedRewards,
                updated_at: new Date()
            }
        });
        
        res.json({
            success: true,
            data: {
                reward_claimed: true,
                reward_id: reward_id,
                reward_type: reward_type
            }
        });
    } catch (error) {
        console.error('Error al reclamar recompensa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// =====================================================
// APIS PARA INTEGRACIÓN FAMILIAR
// =====================================================

// GET /api/family/discovery-path-progress/{student_id} - Progreso para apoderados
router.get('/family/discovery-path-progress/:studentId', authenticateUser, authorizeRole(['GUARDIAN', 'TEACHER']), async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Verificar que el apoderado tiene relación con el estudiante
        if (req.user.role === 'GUARDIAN') {
            // Aquí iría la lógica para verificar la relación familiar
            // Por ahora, asumimos que tiene acceso
        }
        
        const sessions = await prisma.experience_sessions.findMany({
            where: { 
                user_id: studentId,
                gamified_experiences: {
                    experience_type: 'Discovery Learning'
                }
            },
            include: {
                gamified_experiences: {
                    include: {
                        learning_objectives: true
                    }
                },
                users: {
                    select: {
                        first_name: true,
                        last_name: true
                    }
                }
            },
            orderBy: { start_time: 'desc' }
        });
        
        if (sessions.length === 0) {
            return res.json({
                success: true,
                data: {
                    student_name: 'Estudiante',
                    has_progress: false,
                    message: 'No hay progreso registrado aún'
                }
            });
        }
        
        const latestSession = sessions[0];
        const totalSessions = sessions.length;
        const totalTimeSpent = sessions.reduce((total, session) => {
            if (session.end_time && session.start_time) {
                return total + (new Date(session.end_time) - new Date(session.start_time));
            }
            return total;
        }, 0);
        
        res.json({
            success: true,
            data: {
                student_name: `${latestSession.users.first_name} ${latestSession.users.last_name}`,
                has_progress: true,
                current_world: latestSession.progress_json.current_world,
                completed_challenges: latestSession.progress_json.completed_challenges?.length || 0,
                unlocked_tools: latestSession.progress_json.unlocked_tools?.length || 0,
                rewards_earned: latestSession.rewards_json.user_rewards?.length || 0,
                total_sessions: totalSessions,
                total_time_minutes: Math.round(totalTimeSpent / (1000 * 60)),
                recent_activity: sessions.slice(0, 5).map(s => ({
                    date: s.start_time,
                    world: s.progress_json.current_world,
                    status: s.status
                }))
            }
        });
    } catch (error) {
        console.error('Error al obtener progreso familiar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/family/start-adventure-mode - Iniciar modo aventura familiar
router.post('/family/start-adventure-mode', authenticateUser, authorizeRole(['GUARDIAN']), async (req, res) => {
    try {
        const { student_id, activity_type } = req.body;
        
        // Verificar que el estudiante existe y tiene sesiones activas
        const student = await prisma.users.findUnique({
            where: { user_id: student_id },
            include: {
                experience_sessions: {
                    where: {
                        status: 'active',
                        gamified_experiences: {
                            experience_type: 'Discovery Learning'
                        }
                    },
                    include: {
                        gamified_experiences: true
                    }
                }
            }
        });
        
        if (!student) {
            return res.status(404).json({ error: 'Estudiante no encontrado' });
        }
        
        if (student.experience_sessions.length === 0) {
            return res.status(400).json({ error: 'El estudiante no tiene sesiones activas' });
        }
        
        const activeSession = student.experience_sessions[0];
        
        // Crear registro de participación familiar
        const familyParticipation = await prisma.family_participation.create({
            data: {
                session_id: activeSession.session_id,
                guardian_id: req.user.user_id,
                student_id: student_id,
                activity_type: activity_type || 'Modo Aventura Familiar',
                duration_minutes: 0,
                details_json: {
                    started_at: new Date().toISOString(),
                    guardian_name: `${req.user.first_name} ${req.user.last_name}`,
                    student_name: `${student.first_name} ${student.last_name}`
                }
            }
        });
        
        res.json({
            success: true,
            data: {
                session_id: activeSession.session_id,
                participation_id: familyParticipation.participation_id,
                available_activities: [
                    'Exploración conjunta',
                    'Preguntas guía',
                    'Celebración de logros',
                    'Ayuda con patrones'
                ],
                current_world: activeSession.progress_json.current_world,
                experience_title: activeSession.gamified_experiences.title
            }
        });
    } catch (error) {
        console.error('Error al iniciar modo aventura familiar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/family/share-discovery - Compartir descubrimiento
router.post('/family/share-discovery', authenticateUser, authorizeRole(['STUDENT', 'GUARDIAN']), async (req, res) => {
    try {
        const { session_id, discovery_type, details } = req.body;
        
        const session = await prisma.experience_sessions.findUnique({
            where: { session_id: session_id }
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Sesión no encontrada' });
        }
        
        // Verificar acceso
        if (session.user_id !== req.user.user_id && req.user.role !== 'GUARDIAN') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }
        
        // Actualizar progreso con el descubrimiento compartido
        const currentProgress = session.progress_json;
        const sharedDiscoveries = currentProgress.shared_discoveries || [];
        
        const newDiscovery = {
            type: discovery_type,
            details: details,
            shared_at: new Date().toISOString(),
            shared_by: req.user.role
        };
        
        sharedDiscoveries.push(newDiscovery);
        
        await prisma.experience_sessions.update({
            where: { session_id: session_id },
            data: {
                progress_json: {
                    ...currentProgress,
                    shared_discoveries: sharedDiscoveries
                },
                updated_at: new Date()
            }
        });
        
        res.json({
            success: true,
            data: {
                discovery_shared: true,
                discovery_type: discovery_type,
                total_shared: sharedDiscoveries.length
            }
        });
    } catch (error) {
        console.error('Error al compartir descubrimiento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/family/home-activities/{oa_id} - Actividades sugeridas sin pantalla
router.get('/family/home-activities/:oaId', authenticateUser, authorizeRole(['GUARDIAN', 'TEACHER']), async (req, res) => {
    try {
        const { oaId } = req.params;
        
        // Actividades sugeridas basadas en el OA
        const homeActivities = {
            'MA01OA01': [
                {
                    id: 'contar_objetos_casa',
                    title: 'Contar Objetos de la Casa',
                    description: 'Contar objetos cotidianos como juguetes, libros, etc.',
                    difficulty: 'Fácil',
                    materials: 'Objetos de la casa',
                    duration: '10-15 minutos',
                    learning_objective: 'Practicar conteo del 0 al 100'
                },
                {
                    id: 'patrones_numericos',
                    title: 'Descubrir Patrones Numéricos',
                    description: 'Buscar patrones en números de teléfono, direcciones, etc.',
                    difficulty: 'Medio',
                    materials: 'Números de teléfono, direcciones',
                    duration: '15-20 minutos',
                    learning_objective: 'Identificar patrones numéricos'
                },
                {
                    id: 'juego_secuencias',
                    title: 'Juego de Secuencias',
                    description: 'Crear secuencias numéricas y que el otro las complete',
                    difficulty: 'Medio',
                    materials: 'Papel y lápiz',
                    duration: '20-25 minutos',
                    learning_objective: 'Completar secuencias numéricas'
                }
            ]
        };
        
        const activities = homeActivities[oaId] || [];
        
        res.json({
            success: true,
            data: {
                oa_id: oaId,
                activities: activities,
                total_activities: activities.length
            }
        });
    } catch (error) {
        console.error('Error al obtener actividades caseras:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// =====================================================
// FUNCIONES AUXILIARES PARA PROCESAR ACCIONES
// =====================================================

async function processHypothesisTest(data, session) {
    const { hypothesis, pattern, numbers } = data;
    
    // Lógica para validar hipótesis
    let isValid = false;
    let message = '';
    
    // Ejemplo: Validar si la hipótesis sobre el patrón es correcta
    if (pattern === 'de 1 en 1' && numbers && numbers.length > 1) {
        isValid = numbers.every((num, index) => {
            if (index === 0) return true;
            return num === numbers[index - 1] + 1;
        });
    }
    
    if (isValid) {
        message = '¡Excelente! Has descubierto el patrón correctamente.';
    } else {
        message = 'Intenta de nuevo. Observa cuidadosamente los números.';
    }
    
    return {
        valid: isValid,
        message: message,
        rewards: isValid ? ['hypothesis_correct'] : []
    };
}

async function processDragDrop(data, session) {
    const { source, target, numbers } = data;
    
    // Lógica para validar arrastrar y soltar
    let isValid = false;
    let message = '';
    
    // Ejemplo: Validar si los números están en el orden correcto
    if (numbers && numbers.length > 1) {
        isValid = numbers.every((num, index) => {
            if (index === 0) return true;
            return num > numbers[index - 1];
        });
    }
    
    if (isValid) {
        message = '¡Perfecto! Los números están en el orden correcto.';
    } else {
        message = 'Revisa el orden de los números.';
    }
    
    return {
        valid: isValid,
        message: message,
        rewards: isValid ? ['drag_drop_correct'] : []
    };
}

async function processVoiceCommand(data, session) {
    const { command, expected } = data;
    
    // Lógica para procesar comandos de voz
    let isValid = false;
    let message = '';
    
    // Ejemplo: Validar si el comando de voz es correcto
    if (command && expected) {
        isValid = command.toLowerCase().includes(expected.toLowerCase());
    }
    
    if (isValid) {
        message = '¡Excelente pronunciación!';
    } else {
        message = 'Intenta decirlo de nuevo.';
    }
    
    return {
        valid: isValid,
        message: message,
        rewards: isValid ? ['voice_command_correct'] : []
    };
}

async function processPatternDiscovery(data, session) {
    const { pattern, numbers } = data;
    
    // Lógica para validar descubrimiento de patrones
    let isValid = false;
    let message = '';
    
    // Ejemplo: Validar si el patrón descubierto es correcto
    if (pattern && numbers && numbers.length >= 3) {
        const step = numbers[1] - numbers[0];
        isValid = numbers.every((num, index) => {
            if (index === 0) return true;
            return num === numbers[index - 1] + step;
        });
    }
    
    if (isValid) {
        message = '¡Increíble! Has descubierto un patrón numérico.';
    } else {
        message = 'Sigue explorando para encontrar el patrón.';
    }
    
    return {
        valid: isValid,
        message: message,
        rewards: isValid ? ['pattern_discovery'] : []
    };
}

module.exports = router; 