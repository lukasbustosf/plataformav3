#!/usr/bin/env python3
"""
PLAN PILOTO: TESTING CON 3 COLEGIOS
Script para crear plan detallado de testing piloto usando:
- 847 OA completos
- 6 engines básicos
- 90 skins MAT/LEN
- 3 colegios seleccionados estratégicamente
"""

import json
import uuid
from datetime import datetime, timedelta

def create_pilot_schools():
    """Define los 3 colegios para el piloto estratégico"""
    
    schools = [
        {
            "school_id": "PILOT_001",
            "name": "Colegio Público Santiago Centro",
            "type": "público_municipal",
            "location": "Santiago Centro, RM",
            "socioeconomic_level": "medio",
            "tech_infrastructure": "básica",
            "students_count": 450,
            "teachers_count": 18,
            "pilot_focus": "accesibilidad_inclusión",
            "target_grades": ["1B", "2B", "3B"],
            "target_subjects": ["MAT", "LEN"],
            "special_characteristics": [
                "Estudiantes con NEE",
                "Conectividad variable",
                "Docentes con experiencia tecnológica mixta",
                "Infraestructura básica pero funcional"
            ],
            "pilot_coordinator": {
                "name": "Prof. María González",
                "role": "Jefa UTP",
                "email": "m.gonzalez@escola.santiago.cl",
                "phone": "+56912345001"
            },
            "selected_teachers": [
                {"name": "Ana Torres", "grade": "1B", "subject": "MAT", "tech_level": "básico"},
                {"name": "Carlos Ruiz", "grade": "2B", "subject": "LEN", "tech_level": "intermedio"},
                {"name": "Elena Morales", "grade": "3B", "subject": "MAT", "tech_level": "básico"}
            ],
            "pilot_metrics": {
                "target_students": 90,
                "sessions_per_week": 3,
                "duration_weeks": 8,
                "engines_to_test": ["ENG01", "ENG05"],
                "skins_to_test": ["high_appeal", "easy_medium"]
            }
        },
        {
            "school_id": "PILOT_002",
            "name": "Colegio Particular Subvencionado Las Condes",
            "type": "particular_subvencionado",
            "location": "Las Condes, RM",
            "socioeconomic_level": "medio_alto",
            "tech_infrastructure": "avanzada",
            "students_count": 320,
            "teachers_count": 14,
            "pilot_focus": "rendimiento_académico",
            "target_grades": ["2B", "3B", "4B"],
            "target_subjects": ["MAT", "LEN", "CN"],
            "special_characteristics": [
                "Alta conectividad",
                "Tablets disponibles",
                "Docentes tech-savvy",
                "Padres comprometidos digitalmente"
            ],
            "pilot_coordinator": {
                "name": "Prof. Roberto Sánchez",
                "role": "Director Académico",
                "email": "r.sanchez@colegiolascondes.cl",
                "phone": "+56912345002"
            },
            "selected_teachers": [
                {"name": "Patricia Luna", "grade": "2B", "subject": "MAT", "tech_level": "avanzado"},
                {"name": "Miguel Vargas", "grade": "3B", "subject": "LEN", "tech_level": "avanzado"},
                {"name": "Sofía Castro", "grade": "4B", "subject": "CN", "tech_level": "intermedio"}
            ],
            "pilot_metrics": {
                "target_students": 75,
                "sessions_per_week": 4,
                "duration_weeks": 8,
                "engines_to_test": ["ENG01", "ENG02", "ENG05", "ENG09"],
                "skins_to_test": ["all_difficulties", "high_medium_appeal"]
            }
        },
        {
            "school_id": "PILOT_003",
            "name": "Escuela Rural Melipilla",
            "type": "público_rural",
            "location": "Melipilla, RM",
            "socioeconomic_level": "medio_bajo",
            "tech_infrastructure": "limitada",
            "students_count": 180,
            "teachers_count": 8,
            "pilot_focus": "equidad_digital",
            "target_grades": ["1B", "2B"],
            "target_subjects": ["MAT", "LEN"],
            "special_characteristics": [
                "Conectividad intermitente",
                "Pocos dispositivos",
                "Multigrado",
                "Contexto rural específico"
            ],
            "pilot_coordinator": {
                "name": "Prof. Carmen Díaz",
                "role": "Directora",
                "email": "c.diaz@escuela.melipilla.cl",
                "phone": "+56912345003"
            },
            "selected_teachers": [
                {"name": "Juan Pérez", "grade": "1B", "subject": "MAT", "tech_level": "básico"},
                {"name": "Laura Medina", "grade": "1B", "subject": "LEN", "tech_level": "básico"},
                {"name": "Andrés Silva", "grade": "2B", "subject": "MAT", "tech_level": "intermedio"}
            ],
            "pilot_metrics": {
                "target_students": 45,
                "sessions_per_week": 2,
                "duration_weeks": 10,
                "engines_to_test": ["ENG01", "ENG05"],
                "skins_to_test": ["high_appeal", "easy_only"]
            }
        }
    ]
    
    return schools

def create_pilot_timeline():
    """Crea el cronograma detallado del piloto"""
    
    start_date = datetime(2025, 8, 1)  # Inicio en agosto 2025
    
    timeline = {
        "fase_preparacion": {
            "duration": "4 semanas",
            "start_date": start_date.strftime('%Y-%m-%d'),
            "end_date": (start_date + timedelta(weeks=4)).strftime('%Y-%m-%d'),
            "activities": [
                {
                    "activity": "Configuración técnica Supabase",
                    "duration": "1 semana",
                    "responsible": "Equipo Técnico EDU21",
                    "deliverables": [
                        "847 OA cargados en producción",
                        "6 engines básicos implementados",
                        "90 skins desplegados",
                        "Dashboard analytics configurado"
                    ]
                },
                {
                    "activity": "Capacitación docentes",
                    "duration": "2 semanas",
                    "responsible": "Equipo Pedagógico EDU21",
                    "deliverables": [
                        "9 docentes capacitados",
                        "Manuales de uso entregados",
                        "Credenciales de acceso asignadas",
                        "Plan de acompañamiento definido"
                    ]
                },
                {
                    "activity": "Setup técnico colegios",
                    "duration": "2 semanas",
                    "responsible": "Soporte Técnico EDU21",
                    "deliverables": [
                        "Conectividad validada",
                        "Dispositivos configurados",
                        "Aplicación instalada",
                        "Tests de conectividad completados"
                    ]
                },
                {
                    "activity": "Selección contenidos piloto",
                    "duration": "1 semana",
                    "responsible": "Equipo Curricular EDU21",
                    "deliverables": [
                        "OA prioritarios seleccionados por colegio",
                        "Skins asignadas por contexto",
                        "Secuencias didácticas diseñadas",
                        "Instrumentos de evaluación preparados"
                    ]
                }
            ]
        },
        "fase_implementacion": {
            "duration": "8-10 semanas",
            "start_date": (start_date + timedelta(weeks=4)).strftime('%Y-%m-%d'),
            "end_date": (start_date + timedelta(weeks=14)).strftime('%Y-%m-%d'),
            "activities": [
                {
                    "activity": "Piloto intensivo",
                    "duration": "8-10 semanas",
                    "responsible": "Docentes + Acompañamiento EDU21",
                    "weekly_structure": {
                        "sessions_per_week": "2-4 según colegio",
                        "session_duration": "45 minutos",
                        "subjects_covered": "MAT, LEN, CN",
                        "students_per_session": "15-30"
                    },
                    "monitoring": [
                        "Observación de clases semanal",
                        "Entrevistas docentes quincenales",
                        "Focus groups estudiantes mensuales",
                        "Analytics automático diario"
                    ]
                }
            ]
        },
        "fase_evaluacion": {
            "duration": "3 semanas",
            "start_date": (start_date + timedelta(weeks=14)).strftime('%Y-%m-%d'),
            "end_date": (start_date + timedelta(weeks=17)).strftime('%Y-%m-%d'),
            "activities": [
                {
                    "activity": "Análisis de resultados",
                    "duration": "2 semanas",
                    "responsible": "Equipo Analytics EDU21",
                    "deliverables": [
                        "Reporte de engagement por colegio",
                        "Análisis de rendimiento académico",
                        "Evaluación de usabilidad",
                        "Identificación de mejoras críticas"
                    ]
                },
                {
                    "activity": "Presentación de resultados",
                    "duration": "1 semana",
                    "responsible": "Equipo Ejecutivo EDU21",
                    "deliverables": [
                        "Presentación ejecutiva",
                        "Recomendaciones de refinamiento",
                        "Roadmap de escalamiento",
                        "Casos de éxito documentados"
                    ]
                }
            ]
        }
    }
    
    return timeline

def create_content_assignment():
    """Asigna contenidos específicos por colegio"""
    
    content_map = {
        "PILOT_001": {  # Colegio Público Santiago Centro
            "focus": "Accesibilidad e Inclusión",
            "oa_selection": {
                "MAT": [
                    "MA01OA01", "MA01OA02", "MA01OA03",  # Conteo básico
                    "MA02OA01", "MA02OA02",              # Números hasta 50
                    "MA03OA01"                           # Números hasta 100
                ],
                "LEN": [
                    "LE01OA01", "LE01OA02", "LE01OA03",  # Reconocimiento de letras
                    "LE02OA03", "LE02OA04",              # Conciencia fonológica
                    "LE03OA01"                           # Lectura comprensiva
                ]
            },
            "engine_assignment": {
                "ENG01": {"priority": "alta", "usage": "40%"},
                "ENG05": {"priority": "alta", "usage": "60%"}
            },
            "skin_selection": {
                "MAT": ["Reino Animal", "Chef en Acción", "Naturaleza Viva"],
                "LEN": ["Mundo de Cuentos", "Gran Biblioteca", "Jardín de Letras"]
            },
            "special_adaptations": [
                "Skins con alto contraste activadas",
                "TTS habilitado por defecto",
                "Tiempo extendido para NEE",
                "Navegación por teclado disponible"
            ]
        },
        "PILOT_002": {  # Colegio Particular Subvencionado Las Condes
            "focus": "Rendimiento Académico Avanzado",
            "oa_selection": {
                "MAT": [
                    "MA02OA01", "MA02OA04", "MA02OA09",  # Operaciones básicas
                    "MA03OA09", "MA03OA01",              # Operaciones avanzadas
                    "MA04OA02", "MA04OA01"               # Matemática 4to
                ],
                "LEN": [
                    "LE02OA05", "LE03OA01", "LE03OA05",  # Fluidez lectora
                    "LE04OA01", "LE04OA05"               # Comprensión avanzada
                ],
                "CN": [
                    "CN01OA01", "CN02OA01", "CN03OA01"   # Ciencias básicas
                ]
            },
            "engine_assignment": {
                "ENG01": {"priority": "media", "usage": "25%"},
                "ENG02": {"priority": "alta", "usage": "30%"},
                "ENG05": {"priority": "media", "usage": "25%"},
                "ENG09": {"priority": "alta", "usage": "20%"}
            },
            "skin_selection": {
                "MAT": ["Aventura Espacial", "Mundo Fantástico", "Aventura Pirata"],
                "LEN": ["Detective de Palabras", "Letras Musicales", "Gran Teatro"],
                "CN": ["Laboratorio Lingüístico"]
            },
            "special_features": [
                "Modo competitivo habilitado",
                "Analytics avanzados para docentes",
                "Progresión acelerada disponible",
                "Retos adicionales activados"
            ]
        },
        "PILOT_003": {  # Escuela Rural Melipilla
            "focus": "Equidad Digital y Contexto Rural",
            "oa_selection": {
                "MAT": [
                    "MA01OA01", "MA01OA02", "MA01OA04",  # Fundamentos básicos
                    "MA02OA01", "MA02OA04"               # Progresión natural
                ],
                "LEN": [
                    "LE01OA01", "LE01OA03", "LE01OA04",  # Lectoescritura inicial
                    "LE02OA03", "LE02OA04"               # Consolidación fonética
                ]
            },
            "engine_assignment": {
                "ENG01": {"priority": "alta", "usage": "60%"},
                "ENG05": {"priority": "alta", "usage": "40%"}
            },
            "skin_selection": {
                "MAT": ["Reino Animal", "Naturaleza Viva", "Cocina de Palabras"],
                "LEN": ["Jardín de Letras", "Mundo de Cuentos", "Gran Biblioteca"]
            },
            "rural_adaptations": [
                "Modo offline disponible",
                "Sincronización automática",
                "Contenidos contextualizados rurales",
                "Menor consumo de datos"
            ]
        }
    }
    
    return content_map

def create_evaluation_metrics():
    """Define las métricas de evaluación del piloto"""
    
    metrics = {
        "engagement_metrics": {
            "time_on_platform": {
                "target": "> 15 minutos por sesión",
                "measurement": "Analytics automático",
                "frequency": "Diario"
            },
            "completion_rate": {
                "target": "> 80% actividades completadas",
                "measurement": "Sistema tracking",
                "frequency": "Semanal"
            },
            "return_rate": {
                "target": "> 90% estudiantes retornan",
                "measurement": "Login analytics",
                "frequency": "Semanal"
            },
            "fun_factor": {
                "target": "> 4.0/5.0 en encuestas",
                "measurement": "Encuestas estudiantes",
                "frequency": "Quincenal"
            }
        },
        "learning_metrics": {
            "pre_post_assessment": {
                "target": "> 20% mejora en evaluaciones",
                "measurement": "Pruebas estandarizadas",
                "frequency": "Pre y post piloto"
            },
            "skill_progression": {
                "target": "Progresión natural por OA",
                "measurement": "Analytics de rendimiento",
                "frequency": "Continuo"
            },
            "error_analysis": {
                "target": "< 30% errores recurrentes",
                "measurement": "AI error tracking",
                "frequency": "Semanal"
            },
            "bloom_progression": {
                "target": "Avance en niveles Bloom",
                "measurement": "Análisis cognitivo",
                "frequency": "Mensual"
            }
        },
        "teacher_metrics": {
            "ease_of_use": {
                "target": "> 4.0/5.0 usabilidad",
                "measurement": "Encuestas docentes",
                "frequency": "Quincenal"
            },
            "time_saving": {
                "target": "> 30% reducción prep clase",
                "measurement": "Time tracking",
                "frequency": "Semanal"
            },
            "curriculum_alignment": {
                "target": "> 4.5/5.0 alineación",
                "measurement": "Evaluación curricular",
                "frequency": "Mensual"
            },
            "professional_development": {
                "target": "Mejora competencias digitales",
                "measurement": "Pre/post evaluación",
                "frequency": "Pre y post piloto"
            }
        },
        "technical_metrics": {
            "system_uptime": {
                "target": "> 99% disponibilidad",
                "measurement": "Monitoring automático",
                "frequency": "Continuo"
            },
            "load_times": {
                "target": "< 3 segundos carga",
                "measurement": "Performance monitoring",
                "frequency": "Continuo"
            },
            "error_rate": {
                "target": "< 1% errores críticos",
                "measurement": "Error logging",
                "frequency": "Diario"
            },
            "device_compatibility": {
                "target": "100% dispositivos soportados",
                "measurement": "Compatibility testing",
                "frequency": "Semanal"
            }
        }
    }
    
    return metrics

def generate_pilot_implementation_sql():
    """Genera SQL para configurar el piloto en Supabase"""
    
    sql = f"""-- ===============================================
-- CONFIGURACIÓN: PILOTO 3 COLEGIOS EDU21
-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- Duración: 8-10 semanas por colegio
-- ===============================================

-- Crear tabla de colegios piloto
CREATE TABLE IF NOT EXISTS pilot_school (
    school_id varchar(20) PRIMARY KEY,
    name varchar(150) NOT NULL,
    type varchar(50) NOT NULL,
    location varchar(100) NOT NULL,
    socioeconomic_level varchar(50),
    tech_infrastructure varchar(50),
    students_count integer,
    teachers_count integer,
    pilot_focus varchar(100),
    target_grades text[],
    target_subjects text[],
    special_characteristics text[],
    coordinator_info jsonb,
    pilot_metrics jsonb,
    status varchar(30) DEFAULT 'preparing',
    created_at timestamp DEFAULT now()
);

-- Crear tabla de sesiones piloto
CREATE TABLE IF NOT EXISTS pilot_session (
    session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id varchar(20) REFERENCES pilot_school(school_id),
    teacher_name varchar(100) NOT NULL,
    grade varchar(5) NOT NULL,
    subject varchar(10) NOT NULL,
    oa_codes text[], -- OA trabajados en la sesión
    engine_used varchar(10),
    skin_used varchar(20),
    students_count integer,
    session_date date NOT NULL,
    duration_minutes integer DEFAULT 45,
    engagement_score decimal(3,2),
    completion_rate decimal(3,2),
    technical_issues text[],
    teacher_feedback text,
    student_feedback_summary text,
    created_at timestamp DEFAULT now()
);

-- Crear tabla de métricas piloto
CREATE TABLE IF NOT EXISTS pilot_metrics (
    metric_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id varchar(20) REFERENCES pilot_school(school_id),
    metric_type varchar(50) NOT NULL,
    metric_name varchar(100) NOT NULL,
    target_value varchar(50),
    actual_value varchar(50),
    measurement_date date NOT NULL,
    notes text,
    created_at timestamp DEFAULT now()
);

-- Insertar colegios piloto
INSERT INTO pilot_school (
    school_id, name, type, location, socioeconomic_level, 
    tech_infrastructure, students_count, teachers_count, pilot_focus,
    target_grades, target_subjects, coordinator_info, status
) VALUES 
(
    'PILOT_001',
    'Colegio Público Santiago Centro',
    'público_municipal',
    'Santiago Centro, RM',
    'medio',
    'básica',
    450,
    18,
    'accesibilidad_inclusión',
    ARRAY['1B', '2B', '3B'],
    ARRAY['MAT', 'LEN'],
    '{{"name": "Prof. María González", "role": "Jefa UTP", "email": "m.gonzalez@escola.santiago.cl"}}'::jsonb,
    'ready_to_start'
),
(
    'PILOT_002',
    'Colegio Particular Subvencionado Las Condes',
    'particular_subvencionado',
    'Las Condes, RM',
    'medio_alto',
    'avanzada',
    320,
    14,
    'rendimiento_académico',
    ARRAY['2B', '3B', '4B'],
    ARRAY['MAT', 'LEN', 'CN'],
    '{{"name": "Prof. Roberto Sánchez", "role": "Director Académico", "email": "r.sanchez@colegiolascondes.cl"}}'::jsonb,
    'ready_to_start'
),
(
    'PILOT_003',
    'Escuela Rural Melipilla',
    'público_rural',
    'Melipilla, RM',
    'medio_bajo',
    'limitada',
    180,
    8,
    'equidad_digital',
    ARRAY['1B', '2B'],
    ARRAY['MAT', 'LEN'],
    '{{"name": "Prof. Carmen Díaz", "role": "Directora", "email": "c.diaz@escuela.melipilla.cl"}}'::jsonb,
    'ready_to_start'
)
ON CONFLICT (school_id) DO UPDATE SET
    status = EXCLUDED.status,
    pilot_focus = EXCLUDED.pilot_focus;

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_pilot_session_school ON pilot_session(school_id);
CREATE INDEX IF NOT EXISTS idx_pilot_session_date ON pilot_session(session_date);
CREATE INDEX IF NOT EXISTS idx_pilot_session_subject ON pilot_session(subject);
CREATE INDEX IF NOT EXISTS idx_pilot_metrics_school ON pilot_metrics(school_id);
CREATE INDEX IF NOT EXISTS idx_pilot_metrics_type ON pilot_metrics(metric_type);

-- Configurar asignación de contenidos específicos
CREATE TABLE IF NOT EXISTS pilot_content_assignment (
    assignment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id varchar(20) REFERENCES pilot_school(school_id),
    subject varchar(10) NOT NULL,
    oa_code varchar(20) NOT NULL,
    engine_id varchar(10) NOT NULL,
    recommended_skins text[],
    priority varchar(20) DEFAULT 'medium',
    usage_percentage integer DEFAULT 25,
    special_adaptations text[],
    created_at timestamp DEFAULT now()
);

-- Insertar asignaciones de contenido para cada colegio
-- PILOT_001 - Público Santiago (Accesibilidad)
INSERT INTO pilot_content_assignment (school_id, subject, oa_code, engine_id, recommended_skins, priority, usage_percentage, special_adaptations) VALUES
('PILOT_001', 'MAT', 'MA01OA01', 'ENG01', ARRAY['Reino Animal', 'Naturaleza Viva'], 'alta', 40, ARRAY['alto_contraste', 'tts_default', 'tiempo_extendido']),
('PILOT_001', 'MAT', 'MA01OA02', 'ENG01', ARRAY['Reino Animal', 'Chef en Acción'], 'alta', 30, ARRAY['navegacion_teclado', 'tts_default']),
('PILOT_001', 'LEN', 'LE01OA01', 'ENG05', ARRAY['Mundo de Cuentos', 'Jardín de Letras'], 'alta', 60, ARRAY['fuente_dislexia', 'tts_default']),
('PILOT_001', 'LEN', 'LE01OA03', 'ENG05', ARRAY['Gran Biblioteca', 'Jardín de Letras'], 'alta', 40, ARRAY['audio_mejorado', 'contraste_alto']);

-- PILOT_002 - Particular Las Condes (Rendimiento)
INSERT INTO pilot_content_assignment (school_id, subject, oa_code, engine_id, recommended_skins, priority, usage_percentage, special_adaptations) VALUES
('PILOT_002', 'MAT', 'MA02OA04', 'ENG02', ARRAY['Aventura Espacial', 'Mundo Fantástico'], 'alta', 30, ARRAY['modo_competitivo', 'progresion_acelerada']),
('PILOT_002', 'MAT', 'MA03OA09', 'ENG02', ARRAY['Aventura Pirata', 'Mundo Fantástico'], 'alta', 25, ARRAY['retos_adicionales', 'analytics_avanzados']),
('PILOT_002', 'LEN', 'LE03OA01', 'ENG05', ARRAY['Detective de Palabras', 'Gran Teatro'], 'media', 25, ARRAY['evaluacion_continua']),
('PILOT_002', 'CN', 'CN01OA01', 'ENG09', ARRAY['Laboratorio Lingüístico'], 'alta', 20, ARRAY['simulacion_avanzada']);

-- PILOT_003 - Rural Melipilla (Equidad Digital)
INSERT INTO pilot_content_assignment (school_id, subject, oa_code, engine_id, recommended_skins, priority, usage_percentage, special_adaptations) VALUES
('PILOT_003', 'MAT', 'MA01OA01', 'ENG01', ARRAY['Reino Animal', 'Naturaleza Viva'], 'alta', 60, ARRAY['modo_offline', 'sync_automatica', 'bajo_consumo_datos']),
('PILOT_003', 'MAT', 'MA01OA04', 'ENG01', ARRAY['Cocina de Palabras', 'Naturaleza Viva'], 'alta', 40, ARRAY['contexto_rural', 'modo_offline']),
('PILOT_003', 'LEN', 'LE01OA01', 'ENG05', ARRAY['Jardín de Letras', 'Mundo de Cuentos'], 'alta', 40, ARRAY['contexto_rural', 'sync_automatica']),
('PILOT_003', 'LEN', 'LE01OA03', 'ENG05', ARRAY['Gran Biblioteca', 'Jardín de Letras'], 'alta', 35, ARRAY['modo_offline', 'contenido_local']);

-- Configurar métricas de evaluación
CREATE TABLE IF NOT EXISTS pilot_evaluation_framework (
    framework_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category varchar(50) NOT NULL,
    metric_name varchar(100) NOT NULL,
    target_value varchar(50) NOT NULL,
    measurement_method varchar(100) NOT NULL,
    measurement_frequency varchar(50) NOT NULL,
    responsible_team varchar(100),
    created_at timestamp DEFAULT now()
);

-- Insertar framework de evaluación
INSERT INTO pilot_evaluation_framework (category, metric_name, target_value, measurement_method, measurement_frequency, responsible_team) VALUES
('engagement', 'time_on_platform', '> 15 min/sesión', 'Analytics automático', 'Diario', 'Equipo Analytics'),
('engagement', 'completion_rate', '> 80% actividades', 'Sistema tracking', 'Semanal', 'Equipo Analytics'),
('engagement', 'fun_factor', '> 4.0/5.0', 'Encuestas estudiantes', 'Quincenal', 'Equipo Pedagógico'),
('learning', 'pre_post_assessment', '> 20% mejora', 'Pruebas estandarizadas', 'Pre/post piloto', 'Equipo Curricular'),
('learning', 'skill_progression', 'Progresión natural', 'Analytics rendimiento', 'Continuo', 'Equipo Analytics'),
('teacher', 'ease_of_use', '> 4.0/5.0', 'Encuestas docentes', 'Quincenal', 'Equipo UX'),
('teacher', 'time_saving', '> 30% reducción prep', 'Time tracking', 'Semanal', 'Equipo Pedagógico'),
('technical', 'system_uptime', '> 99% disponibilidad', 'Monitoring automático', 'Continuo', 'Equipo DevOps'),
('technical', 'load_times', '< 3 seg carga', 'Performance monitoring', 'Continuo', 'Equipo DevOps');

-- Vista resumen para monitoring del piloto
CREATE OR REPLACE VIEW pilot_dashboard AS
SELECT 
    ps.school_id,
    ps.name as school_name,
    ps.pilot_focus,
    COUNT(DISTINCT sess.session_id) as total_sessions,
    COUNT(DISTINCT sess.teacher_name) as active_teachers,
    AVG(sess.engagement_score) as avg_engagement,
    AVG(sess.completion_rate) as avg_completion,
    COUNT(DISTINCT sess.session_date) as active_days,
    ps.status
FROM pilot_school ps
LEFT JOIN pilot_session sess ON ps.school_id = sess.school_id
GROUP BY ps.school_id, ps.name, ps.pilot_focus, ps.status;

-- Configurar alertas automáticas
CREATE TABLE IF NOT EXISTS pilot_alerts (
    alert_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id varchar(20) REFERENCES pilot_school(school_id),
    alert_type varchar(50) NOT NULL,
    severity varchar(20) DEFAULT 'medium',
    message text NOT NULL,
    triggered_at timestamp DEFAULT now(),
    resolved_at timestamp,
    responsible_team varchar(100)
);

-- Resumen de configuración
SELECT 
    'PILOTO CONFIGURADO' as status,
    COUNT(DISTINCT school_id) as colegios_configurados,
    COUNT(*) as asignaciones_contenido
FROM pilot_content_assignment;

SELECT 
    'MÉTRICAS ESTABLECIDAS' as status,
    COUNT(DISTINCT category) as categorias_metricas,
    COUNT(*) as total_metricas
FROM pilot_evaluation_framework;
"""
    
    return sql

def main():
    """Función principal para crear el plan de piloto"""
    
    print("🧪 === PLAN PILOTO: TESTING CON 3 COLEGIOS ===")
    print("=" * 80)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. CREAR COLEGIOS PILOTO
    print("🏫 Creando perfil de 3 colegios piloto...")
    schools = create_pilot_schools()
    print(f"✅ {len(schools)} colegios seleccionados estratégicamente")
    
    for school in schools:
        print(f"   📍 {school['name']} ({school['type']})")
        print(f"      Focus: {school['pilot_focus']}")
        print(f"      Estudiantes objetivo: {school['pilot_metrics']['target_students']}")
    print()
    
    # 2. CREAR CRONOGRAMA
    print("📅 Creando cronograma de implementación...")
    timeline = create_pilot_timeline()
    print(f"✅ Cronograma de {sum(len(phase['activities']) for phase in timeline.values())} actividades")
    
    for phase_name, phase_info in timeline.items():
        print(f"   📋 {phase_name.replace('_', ' ').title()}: {phase_info['duration']}")
    print()
    
    # 3. ASIGNAR CONTENIDOS
    print("📚 Asignando contenidos específicos...")
    content_map = create_content_assignment()
    print(f"✅ Contenidos asignados para {len(content_map)} colegios")
    
    total_oa = sum(len(content['oa_selection']['MAT']) + len(content['oa_selection'].get('LEN', [])) + len(content['oa_selection'].get('CN', [])) for content in content_map.values())
    print(f"   📊 Total OA en piloto: {total_oa}")
    print()
    
    # 4. DEFINIR MÉTRICAS
    print("📈 Definiendo métricas de evaluación...")
    metrics = create_evaluation_metrics()
    total_metrics = sum(len(category) for category in metrics.values())
    print(f"✅ {total_metrics} métricas definidas en {len(metrics)} categorías")
    
    for category, category_metrics in metrics.items():
        print(f"   📊 {category.replace('_', ' ').title()}: {len(category_metrics)} métricas")
    print()
    
    # 5. GENERAR ARCHIVOS
    print("📝 Generando archivos de configuración...")
    
    # Plan completo JSON
    pilot_plan = {
        "metadata": {
            "title": "Plan Piloto EDU21 - 3 Colegios",
            "version": "1.0",
            "created_at": datetime.now().isoformat(),
            "duration_weeks": "17 semanas total",
            "target_students": sum(school['pilot_metrics']['target_students'] for school in schools),
            "target_teachers": sum(len(school['selected_teachers']) for school in schools)
        },
        "pilot_schools": schools,
        "timeline": timeline,
        "content_assignment": content_map,
        "evaluation_metrics": metrics
    }
    
    plan_file = "pilot_plan_3_colegios.json"
    with open(plan_file, 'w', encoding='utf-8') as f:
        json.dump(pilot_plan, f, indent=2, ensure_ascii=False)
    print(f"✅ Plan completo: {plan_file}")
    
    # SQL de configuración
    sql_content = generate_pilot_implementation_sql()
    sql_file = "pilot_configuracion_supabase.sql"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"✅ SQL configuración: {sql_file}")
    print()
    
    # 6. ESTADÍSTICAS FINALES
    print("📊 === RESUMEN EJECUTIVO PILOTO ===")
    print()
    
    total_students = sum(school['pilot_metrics']['target_students'] for school in schools)
    total_teachers = sum(len(school['selected_teachers']) for school in schools)
    total_sessions = sum(school['pilot_metrics']['sessions_per_week'] * school['pilot_metrics']['duration_weeks'] for school in schools)
    
    print(f"👥 PARTICIPANTES:")
    print(f"   Estudiantes objetivo: {total_students}")
    print(f"   Docentes participantes: {total_teachers}")
    print(f"   Colegios: {len(schools)} (diversidad socioeconómica)")
    print()
    
    print(f"📚 CONTENIDO PILOTO:")
    print(f"   OA total en piloto: {total_oa}")
    print(f"   Engines en uso: 4 de 6 disponibles")
    print(f"   Skins activos: ~30 de 90 disponibles")
    print(f"   Asignaturas: MAT, LEN, CN")
    print()
    
    print(f"⏱️ DURACIÓN Y ALCANCE:")
    print(f"   Duración total: 17 semanas")
    print(f"   Sesiones estimadas: {total_sessions}")
    print(f"   Horas de uso estudiantes: {total_sessions * 0.75} hrs")
    print()
    
    print(f"🎯 FOCOS ESTRATÉGICOS:")
    for school in schools:
        print(f"   {school['name']}: {school['pilot_focus']}")
    print()
    
    print(f"📈 MÉTRICAS DE ÉXITO:")
    print(f"   Engagement: > 15 min/sesión, > 80% completación")
    print(f"   Aprendizaje: > 20% mejora en evaluaciones")
    print(f"   Docentes: > 4.0/5.0 usabilidad, > 30% ahorro tiempo")
    print(f"   Técnicas: > 99% uptime, < 3 seg carga")
    print()
    
    # 7. PRÓXIMOS PASOS
    print("🚀 === PRÓXIMOS PASOS INMEDIATOS ===")
    print()
    print(f"1. 📤 Ejecutar {sql_file} en Supabase")
    print("2. 🤝 Contactar coordinadores de colegios")
    print("3. 📋 Firmar convenios de participación")
    print("4. 👨‍🏫 Capacitar a 9 docentes seleccionados")
    print("5. 🔧 Configurar infraestructura técnica")
    print("6. 🧪 Iniciar piloto en agosto 2025")
    print()
    
    print("📋 ENTREGABLES CLAVE:")
    print("   Semana 1-4: Setup completo y capacitación")
    print("   Semana 5-14: Implementación y monitoring")
    print("   Semana 15-17: Evaluación y recomendaciones")
    print()
    
    print("=" * 80)
    print("🎉 ¡PLAN PILOTO COMPLETAMENTE ESTRUCTURADO!")
    print(f"🏫 {len(schools)} colegios listos para implementación")
    print(f"👥 {total_students} estudiantes impactados")
    print(f"📊 {total_metrics} métricas de evaluación definidas")
    print(f"⏱️ 17 semanas para resultados completos")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Plan piloto completado. Listo para implementación.")
    else:
        print("\n❌ Error en creación del plan. Revisar logs.") 