const express = require('express');
const router = express.Router();

// Middleware de autenticación (reutilizar del primer juego)
const authenticateUser = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }
    req.user = { user_id: userId };
    next();
};

// Temporalmente usando datos mock para evitar problemas de Prisma
let prisma = null;
try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
} catch (error) {
    console.log('⚠️ Prisma no disponible, usando datos mock para ciudad numérica');
}

// =====================================================
// APIs PARA GESTIÓN DE PROYECTOS DE CIUDAD
// =====================================================

// GET /api/city-numeric/{session_id} - Obtener estado actual del proyecto
router.get('/city-numeric/:sessionId', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!prisma) {
            // Datos mock para pruebas
            const mockProject = {
                project_id: 'mock-city-project-1',
                session_id: sessionId,
                city_name: 'Mi Ciudad Numérica',
                current_district: 'residential',
                total_buildings: 0,
                total_roads: 0,
                total_parks: 0,
                progress_percentage: 0,
                is_completed: false,
                city_layout: {
                    buildings: [],
                    roads: [],
                    parks: []
                }
            };
            
            return res.json({
                success: true,
                project: mockProject
            });
        }

        // Lógica real con Prisma
        const project = await prisma.city_projects.findFirst({
            where: { session_id: sessionId },
            include: {
                city_components: true,
                city_districts: true,
                city_achievements: true
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto de ciudad no encontrado'
            });
        }

        res.json({
            success: true,
            project
        });

    } catch (error) {
        console.error('Error obteniendo proyecto de ciudad:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/city-numeric/{session_id}/create-project - Crear nuevo proyecto
router.post('/city-numeric/:sessionId/create-project', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { city_name = 'Mi Ciudad Numérica' } = req.body;

        if (!prisma) {
            // Mock response
            return res.json({
                success: true,
                project_id: 'mock-city-project-1',
                message: 'Proyecto de ciudad creado exitosamente'
            });
        }

        // Crear proyecto en la base de datos
        const project = await prisma.city_projects.create({
            data: {
                session_id: sessionId,
                city_name,
                current_district: 'residential',
                total_buildings: 0,
                total_roads: 0,
                total_parks: 0,
                progress_percentage: 0,
                is_completed: false
            }
        });

        // Crear distritos por defecto
        const districts = [
            {
                project_id: project.project_id,
                district_name: 'Distrito Residencial',
                district_type: 'residential',
                required_buildings: 20,
                required_roads: 5,
                required_parks: 0,
                sequence_challenge: {
                    pattern: 'consecutive',
                    range: [1, 20],
                    challenge: 'Construye casas en orden del 1 al 20'
                }
            },
            {
                project_id: project.project_id,
                district_name: 'Distrito Comercial',
                district_type: 'commercial',
                required_buildings: 10,
                required_roads: 8,
                required_parks: 0,
                sequence_challenge: {
                    pattern: 'skip_counting',
                    range: [10, 100],
                    step: 10,
                    challenge: 'Construye tiendas contando de 10 en 10'
                }
            },
            {
                project_id: project.project_id,
                district_name: 'Parque Central',
                district_type: 'park',
                required_buildings: 0,
                required_roads: 3,
                required_parks: 5,
                sequence_challenge: {
                    pattern: 'mixed',
                    range: [1, 100],
                    challenge: 'Organiza el parque con números del 1 al 100'
                }
            }
        ];

        await prisma.city_districts.createMany({
            data: districts
        });

        res.json({
            success: true,
            project_id: project.project_id,
            message: 'Proyecto de ciudad creado exitosamente'
        });

    } catch (error) {
        console.error('Error creando proyecto de ciudad:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/city-numeric/{session_id}/add-component - Agregar componente
router.post('/city-numeric/:sessionId/add-component', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { component_type, position_x, position_y, number_value, district_type } = req.body;

        if (!prisma) {
            // Mock response
            return res.json({
                success: true,
                component_id: 'mock-component-1',
                message: 'Componente agregado exitosamente',
                sequence_valid: true
            });
        }

        // Obtener el proyecto actual
        const project = await prisma.city_projects.findFirst({
            where: { session_id: sessionId }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        // Agregar componente
        const component = await prisma.city_components.create({
            data: {
                project_id: project.project_id,
                component_type,
                position_x,
                position_y,
                number_value,
                district_type,
                sequence_order: number_value
            }
        });

        // Validar secuencia
        const sequenceValid = await validateCitySequence(project.project_id, district_type);

        res.json({
            success: true,
            component_id: component.component_id,
            message: 'Componente agregado exitosamente',
            sequence_valid: sequenceValid
        });

    } catch (error) {
        console.error('Error agregando componente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// POST /api/city-numeric/{session_id}/complete-district - Completar distrito
router.post('/city-numeric/:sessionId/complete-district', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { district_type } = req.body;

        if (!prisma) {
            // Mock response
            return res.json({
                success: true,
                message: 'Distrito completado exitosamente',
                next_district: district_type === 'residential' ? 'commercial' : 'park',
                reward: 'Nuevo distrito desbloqueado'
            });
        }

        // Obtener el proyecto
        const project = await prisma.city_projects.findFirst({
            where: { session_id: sessionId }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        // Marcar distrito como completado
        await prisma.city_districts.updateMany({
            where: {
                project_id: project.project_id,
                district_type
            },
            data: {
                is_completed: true,
                completion_date: new Date()
            }
        });

        // Determinar siguiente distrito
        let nextDistrict = null;
        if (district_type === 'residential') {
            nextDistrict = 'commercial';
            await prisma.city_projects.update({
                where: { project_id: project.project_id },
                data: { current_district: 'commercial' }
            });
        } else if (district_type === 'commercial') {
            nextDistrict = 'park';
            await prisma.city_projects.update({
                where: { project_id: project.project_id },
                data: { current_district: 'park' }
            });
        }

        // Crear logro
        await prisma.city_achievements.create({
            data: {
                project_id: project.project_id,
                achievement_type: 'district_complete',
                achievement_name: `Constructor ${district_type === 'residential' ? 'Residencial' : district_type === 'commercial' ? 'Comercial' : 'del Parque'}`,
                achievement_description: `Completaste el distrito ${district_type}`,
                icon: district_type === 'residential' ? '🏠' : district_type === 'commercial' ? '🏪' : '🌳',
                is_earned: true,
                earned_date: new Date()
            }
        });

        res.json({
            success: true,
            message: 'Distrito completado exitosamente',
            next_district: nextDistrict,
            reward: nextDistrict ? 'Nuevo distrito desbloqueado' : '¡Ciudad completa!'
        });

    } catch (error) {
        console.error('Error completando distrito:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// =====================================================
// APIs PARA LÓGICA DE JUEGO
// =====================================================

// POST /api/city-numeric/{session_id}/validate-sequence - Validar secuencia
router.post('/city-numeric/:sessionId/validate-sequence', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { district_type } = req.body;

        if (!prisma) {
            // Mock validation
            const mockValidation = {
                is_valid: true,
                pattern_found: 'consecutive',
                next_number: 6,
                message: '¡Secuencia perfecta!'
            };
            
            return res.json({
                success: true,
                validation: mockValidation
            });
        }

        const project = await prisma.city_projects.findFirst({
            where: { session_id: sessionId }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        // Obtener componentes del distrito
        const components = await prisma.city_components.findMany({
            where: {
                project_id: project.project_id,
                district_type
            },
            orderBy: { number_value: 'asc' }
        });

        // Validar secuencia según el tipo de distrito
        const validation = validateCitySequenceLogic(components, district_type);

        res.json({
            success: true,
            validation
        });

    } catch (error) {
        console.error('Error validando secuencia:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /api/city-numeric/{session_id}/family-view - Vista para familia
router.get('/city-numeric/:sessionId/family-view', authenticateUser, async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!prisma) {
            // Mock family view
            const mockFamilyView = {
                project_summary: {
                    city_name: 'Mi Ciudad Numérica',
                    total_buildings: 5,
                    total_roads: 2,
                    progress_percentage: 25
                },
                family_activities: [
                    {
                        type: 'collaboration',
                        description: 'Ayudó a construir el primer edificio',
                        duration_minutes: 10
                    }
                ],
                suggested_activities: [
                    {
                        title: 'Contador de Objetos',
                        description: 'Contar objetos en casa',
                        difficulty: 'Fácil',
                        duration: '5-10 minutos'
                    }
                ]
            };
            
            return res.json({
                success: true,
                family_view: mockFamilyView
            });
        }

        // Lógica real con Prisma
        const project = await prisma.city_projects.findFirst({
            where: { session_id: sessionId },
            include: {
                city_family_participation: true,
                city_districts: true
            }
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Proyecto no encontrado'
            });
        }

        const familyView = {
            project_summary: {
                city_name: project.city_name,
                total_buildings: project.total_buildings,
                total_roads: project.total_roads,
                progress_percentage: project.progress_percentage
            },
            family_activities: project.city_family_participation,
            suggested_activities: generateSuggestedActivities(project)
        };

        res.json({
            success: true,
            family_view: familyView
        });

    } catch (error) {
        console.error('Error obteniendo vista familiar:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

async function validateCitySequence(projectId, districtType) {
    const components = await prisma.city_components.findMany({
        where: {
            project_id: projectId,
            district_type: districtType
        },
        orderBy: { number_value: 'asc' }
    });

    return validateCitySequenceLogic(components, districtType);
}

function validateCitySequenceLogic(components, districtType) {
    const numbers = components.map(c => c.number_value);
    
    switch (districtType) {
        case 'residential':
            // Secuencia consecutiva del 1 al 20
            return {
                is_valid: numbers.every((num, index) => num === index + 1),
                pattern_found: 'consecutive',
                next_number: numbers.length + 1,
                message: numbers.every((num, index) => num === index + 1) 
                    ? '¡Secuencia perfecta!' 
                    : 'Falta algún número en la secuencia'
            };
            
        case 'commercial':
            // Secuencia de 10 en 10
            return {
                is_valid: numbers.every((num, index) => num === (index + 1) * 10),
                pattern_found: 'skip_counting',
                next_number: (numbers.length + 1) * 10,
                message: numbers.every((num, index) => num === (index + 1) * 10)
                    ? '¡Patrón de 10 en 10 perfecto!'
                    : 'Recuerda contar de 10 en 10'
            };
            
        case 'park':
            // Secuencia mixta del 1 al 100
            return {
                is_valid: numbers.length <= 100 && numbers.every((num, index) => num === index + 1),
                pattern_found: 'mixed',
                next_number: numbers.length + 1,
                message: '¡Excelente organización del parque!'
            };
            
        default:
            return {
                is_valid: false,
                pattern_found: 'unknown',
                next_number: null,
                message: 'Tipo de distrito no reconocido'
            };
    }
}

function generateSuggestedActivities(project) {
    const activities = [
        {
            title: 'Contador de Objetos',
            description: 'Contar objetos en casa (cubiertos, libros, juguetes)',
            difficulty: 'Fácil',
            duration: '5-10 minutos',
            materials: 'Objetos cotidianos'
        },
        {
            title: 'Secuencia de Pasos',
            description: 'Contar pasos mientras camina, de 1 en 1 o de 2 en 2',
            difficulty: 'Medio',
            duration: 'Durante paseos',
            materials: 'Ninguno'
        },
        {
            title: 'Juego de Tienda',
            description: 'Simular una tienda con precios de 10 en 10',
            difficulty: 'Avanzado',
            duration: '15-20 minutos',
            materials: 'Monedas de juguete, productos'
        }
    ];

    // Filtrar actividades según el progreso
    if (project.progress_percentage < 30) {
        return activities.filter(a => a.difficulty === 'Fácil');
    } else if (project.progress_percentage < 70) {
        return activities.filter(a => a.difficulty !== 'Avanzado');
    } else {
        return activities;
    }
}

module.exports = router; 