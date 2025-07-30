-- ===============================================
-- CONFIGURACIÓN: PILOTO 3 COLEGIOS EDU21
-- Fecha: 2025-07-08 12:31:55
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
    '{"name": "Prof. María González", "role": "Jefa UTP", "email": "m.gonzalez@escola.santiago.cl"}'::jsonb,
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
    '{"name": "Prof. Roberto Sánchez", "role": "Director Académico", "email": "r.sanchez@colegiolascondes.cl"}'::jsonb,
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
    '{"name": "Prof. Carmen Díaz", "role": "Directora", "email": "c.diaz@escuela.melipilla.cl"}'::jsonb,
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
