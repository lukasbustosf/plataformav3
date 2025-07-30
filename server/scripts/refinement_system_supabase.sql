-- ===============================================
-- SISTEMA DE REFINAMIENTO: FEEDBACK Y MEJORA CONTINUA
-- Fecha: 2025-07-08 12:36:08
-- Propósito: Recolección, análisis y aplicación de feedback
-- ===============================================

-- Tabla principal de feedback de estudiantes
CREATE TABLE IF NOT EXISTS student_feedback (
    feedback_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id varchar(50) NOT NULL,
    school_id varchar(20) REFERENCES pilot_school(school_id),
    session_id uuid,
    game_engine varchar(10),
    game_skin varchar(20),
    oa_code varchar(20),
    collection_method varchar(50) NOT NULL,
    feedback_type varchar(50) NOT NULL,
    
    -- Ratings específicos
    enjoyment_rating integer CHECK (enjoyment_rating >= 1 AND enjoyment_rating <= 5),
    difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    clarity_rating integer CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
    
    -- Feedback textual
    favorite_aspect text,
    difficult_aspect text,
    suggested_improvement text,
    
    -- Metadata
    feedback_date timestamp DEFAULT now(),
    session_duration_minutes integer,
    completion_status varchar(20),
    created_at timestamp DEFAULT now()
);

-- Tabla de feedback de docentes
CREATE TABLE IF NOT EXISTS teacher_feedback (
    feedback_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id varchar(50) NOT NULL,
    school_id varchar(20) REFERENCES pilot_school(school_id),
    class_session_id uuid,
    collection_method varchar(50) NOT NULL,
    
    -- Ratings de clase
    student_engagement_rating integer CHECK (student_engagement_rating >= 1 AND student_engagement_rating <= 5),
    technical_performance_rating integer CHECK (technical_performance_rating >= 1 AND technical_performance_rating <= 5),
    learning_objective_achievement_rating integer CHECK (learning_objective_achievement_rating >= 1 AND learning_objective_achievement_rating <= 5),
    curriculum_alignment_rating integer CHECK (curriculum_alignment_rating >= 1 AND curriculum_alignment_rating <= 5),
    
    -- Feedback cualitativo
    what_worked_well text,
    challenges_encountered text,
    learning_impact_observed text,
    technical_issues text[],
    suggested_improvements text,
    
    -- Contexto
    class_size integer,
    technology_used varchar(100),
    feedback_date timestamp DEFAULT now(),
    created_at timestamp DEFAULT now()
);

-- Tabla de métricas técnicas automáticas
CREATE TABLE IF NOT EXISTS technical_metrics (
    metric_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id varchar(20) REFERENCES pilot_school(school_id),
    session_id uuid,
    metric_type varchar(50) NOT NULL,
    
    -- Métricas de rendimiento
    load_time_seconds decimal(5,2),
    response_time_milliseconds integer,
    error_count integer DEFAULT 0,
    crash_occurred boolean DEFAULT false,
    
    -- Métricas de uso
    session_duration_minutes integer,
    actions_per_minute decimal(5,2),
    feature_usage_count integer,
    help_requests_count integer,
    
    -- Contexto técnico
    device_type varchar(50),
    browser_version varchar(100),
    network_type varchar(50),
    timestamp_recorded timestamp DEFAULT now()
);

-- Tabla de análisis de feedback
CREATE TABLE IF NOT EXISTS feedback_analysis (
    analysis_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_type varchar(50) NOT NULL,
    analysis_period varchar(50) NOT NULL,
    school_filter varchar(20),
    subject_filter varchar(10),
    engine_filter varchar(10),
    
    -- Resultados cuantitativos
    avg_enjoyment_score decimal(3,2),
    avg_difficulty_score decimal(3,2),
    avg_clarity_score decimal(3,2),
    engagement_trend varchar(20),
    completion_rate_percentage decimal(5,2),
    
    -- Insights cualitativos
    top_positive_themes text[],
    top_concern_themes text[],
    recommended_actions text[],
    priority_level varchar(20),
    
    -- Metadata
    analysis_date timestamp DEFAULT now(),
    analyzed_by varchar(100),
    data_points_count integer,
    confidence_level varchar(20)
);

-- Tabla de mejoras implementadas
CREATE TABLE IF NOT EXISTS improvement_implementations (
    improvement_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title varchar(200) NOT NULL,
    description text NOT NULL,
    improvement_type varchar(50) NOT NULL,
    priority_level varchar(20) NOT NULL,
    
    -- Origen de la mejora
    feedback_sources text[],
    impact_assessment jsonb,
    effort_assessment jsonb,
    
    -- Timeline
    identified_date date NOT NULL,
    planned_start_date date,
    actual_start_date date,
    planned_completion_date date,
    actual_completion_date date,
    
    -- Implementación
    assigned_team varchar(100),
    implementation_status varchar(30) DEFAULT 'planned',
    testing_status varchar(30) DEFAULT 'not_started',
    
    -- Resultados
    success_metrics jsonb,
    measured_impact jsonb,
    user_reaction text,
    
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_student_feedback_school ON student_feedback(school_id);
CREATE INDEX IF NOT EXISTS idx_student_feedback_date ON student_feedback(feedback_date);
CREATE INDEX IF NOT EXISTS idx_student_feedback_engine ON student_feedback(game_engine);
CREATE INDEX IF NOT EXISTS idx_teacher_feedback_school ON teacher_feedback(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_feedback_date ON teacher_feedback(feedback_date);
CREATE INDEX IF NOT EXISTS idx_technical_metrics_type ON technical_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_improvement_status ON improvement_implementations(implementation_status);

-- Vista de dashboard de feedback en tiempo real
CREATE OR REPLACE VIEW feedback_dashboard AS
SELECT 
    sf.school_id,
    ps.name as school_name,
    COUNT(DISTINCT sf.feedback_id) as student_feedback_count,
    COUNT(DISTINCT tf.feedback_id) as teacher_feedback_count,
    AVG(sf.enjoyment_rating) as avg_student_enjoyment,
    AVG(tf.student_engagement_rating) as avg_teacher_perceived_engagement,
    COUNT(DISTINCT tm.metric_id) as technical_data_points,
    AVG(tm.load_time_seconds) as avg_load_time
FROM pilot_school ps
LEFT JOIN student_feedback sf ON ps.school_id = sf.school_id
LEFT JOIN teacher_feedback tf ON ps.school_id = tf.school_id  
LEFT JOIN technical_metrics tm ON ps.school_id = tm.school_id
WHERE sf.feedback_date >= CURRENT_DATE - INTERVAL '7 days'
   OR tf.feedback_date >= CURRENT_DATE - INTERVAL '7 days'
   OR tm.timestamp_recorded >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY sf.school_id, ps.name;

-- Vista de análisis de tendencias
CREATE OR REPLACE VIEW feedback_trends AS
SELECT 
    DATE_TRUNC('week', sf.feedback_date) as week,
    sf.school_id,
    sf.game_engine,
    COUNT(*) as feedback_count,
    AVG(sf.enjoyment_rating) as avg_enjoyment,
    AVG(sf.difficulty_rating) as avg_difficulty,
    AVG(sf.clarity_rating) as avg_clarity,
    COUNT(CASE WHEN sf.completion_status = 'completed' THEN 1 END)::float / COUNT(*) as completion_rate
FROM student_feedback sf
WHERE sf.feedback_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', sf.feedback_date), sf.school_id, sf.game_engine
ORDER BY week DESC, sf.school_id, sf.game_engine;

-- Función para generar alertas automáticas
CREATE OR REPLACE FUNCTION generate_feedback_alerts()
RETURNS TABLE(alert_type text, message text, severity text, school_id text) AS $$
BEGIN
    -- Alerta por engagement bajo
    RETURN QUERY
    SELECT 
        'low_engagement'::text,
        'Engagement promedio por debajo de 3.0 en los últimos 7 días'::text,
        'high'::text,
        fb.school_id::text
    FROM (
        SELECT 
            sf.school_id,
            AVG(sf.enjoyment_rating) as avg_rating
        FROM student_feedback sf
        WHERE sf.feedback_date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY sf.school_id
    ) fb
    WHERE fb.avg_rating < 3.0;
    
    -- Alerta por problemas técnicos frecuentes
    RETURN QUERY
    SELECT 
        'technical_issues'::text,
        'Más de 10 errores técnicos reportados en los últimos 3 días'::text,
        'medium'::text,
        tm.school_id::text
    FROM (
        SELECT 
            tm.school_id,
            SUM(tm.error_count) as total_errors
        FROM technical_metrics tm
        WHERE tm.timestamp_recorded >= CURRENT_DATE - INTERVAL '3 days'
        GROUP BY tm.school_id
    ) tm
    WHERE tm.total_errors > 10;
    
    -- Alerta por feedback negativo recurrente
    RETURN QUERY
    SELECT 
        'negative_feedback_pattern'::text,
        'Patrón de feedback negativo detectado'::text,
        'medium'::text,
        tf.school_id::text
    FROM teacher_feedback tf
    WHERE tf.feedback_date >= CURRENT_DATE - INTERVAL '14 days'
      AND tf.student_engagement_rating < 3
      AND tf.technical_performance_rating < 3
    GROUP BY tf.school_id
    HAVING COUNT(*) >= 3;
    
END;
$$ LANGUAGE plpgsql;

-- Tabla de configuración de sistema de mejora continua
CREATE TABLE IF NOT EXISTS continuous_improvement_config (
    config_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    config_category varchar(50) NOT NULL,
    config_name varchar(100) NOT NULL,
    config_value jsonb NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

-- Insertar configuraciones iniciales
INSERT INTO continuous_improvement_config (config_category, config_name, config_value, description) VALUES
('feedback_collection', 'student_survey_frequency', '"weekly"', 'Frecuencia de encuestas a estudiantes'),
('feedback_collection', 'teacher_interview_frequency', '"monthly"', 'Frecuencia de entrevistas docentes'),
('analysis', 'sentiment_analysis_threshold', '0.7', 'Umbral para análisis de sentimientos'),
('alerts', 'engagement_threshold', '3.0', 'Umbral mínimo de engagement antes de alerta'),
('prioritization', 'impact_weight_learning', '0.4', 'Peso del impacto en aprendizaje'),
('prioritization', 'impact_weight_ux', '0.25', 'Peso del impacto en experiencia de usuario'),
('implementation', 'quick_win_threshold_days', '14', 'Máximo días para considerar quick win');

-- Resumen de configuración del sistema
SELECT 
    'SISTEMA DE REFINAMIENTO CONFIGURADO' as status,
    COUNT(DISTINCT table_name) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('student_feedback', 'teacher_feedback', 'technical_metrics', 'feedback_analysis', 'improvement_implementations');
