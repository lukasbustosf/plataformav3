-- FUNCIONES SQL PARA EL MÓDULO DE LABORATORIOS
-- Funciones para dashboard y métricas

-- ============================================================================
-- FUNCIÓN: Mapa de calor de uso por curso
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_usage_heatmap(
    p_school_id UUID,
    p_start_date TIMESTAMP
)
RETURNS TABLE (
    course_id UUID,
    course_name TEXT,
    course_level TEXT,
    total_activities INTEGER,
    executed_activities INTEGER,
    usage_percentage DECIMAL(5,2),
    last_execution TIMESTAMP,
    avg_rating DECIMAL(3,2),
    total_executions INTEGER,
    unique_teachers INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH course_stats AS (
        SELECT 
            c.id as course_id,
            c.name as course_name,
            c.level as course_level,
            COUNT(DISTINCT la.id) as total_available_activities,
            COUNT(DISTINCT log.activity_id) as executed_activities,
            COUNT(log.id) as total_executions,
            COUNT(DISTINCT log.teacher_id) as unique_teachers,
            MAX(log.execution_date) as last_execution,
            AVG(log.success_rating) as avg_rating
        FROM courses c
        LEFT JOIN lab_activity_log log ON c.id = log.course_id 
            AND log.execution_date >= p_start_date
        CROSS JOIN lab_activity la 
            WHERE la.status = 'active'
            AND c.school_id = p_school_id
        GROUP BY c.id, c.name, c.level
    )
    SELECT 
        cs.course_id,
        cs.course_name,
        cs.course_level,
        cs.total_available_activities::INTEGER,
        cs.executed_activities::INTEGER,
        CASE 
            WHEN cs.total_available_activities > 0 THEN 
                ROUND((cs.executed_activities::DECIMAL / cs.total_available_activities * 100), 2)
            ELSE 0
        END as usage_percentage,
        cs.last_execution,
        ROUND(cs.avg_rating, 2) as avg_rating,
        cs.total_executions::INTEGER,
        cs.unique_teachers::INTEGER
    FROM course_stats cs
    ORDER BY usage_percentage DESC, cs.course_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: Correlación uso de laboratorio vs progreso OA
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_oa_correlation(
    p_school_id UUID,
    p_start_date TIMESTAMP
)
RETURNS TABLE (
    course_id UUID,
    course_name TEXT,
    lab_usage_pct DECIMAL(5,2),
    oa_mastery_pct DECIMAL(5,2),
    total_lab_executions INTEGER,
    total_oa_evaluations INTEGER,
    correlation_points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH lab_usage AS (
        SELECT 
            log.course_id,
            COUNT(DISTINCT log.activity_id) as activities_used,
            COUNT(log.id) as total_executions,
            (SELECT COUNT(*) FROM lab_activity WHERE status = 'active') as total_activities
        FROM lab_activity_log log
        WHERE log.school_id = p_school_id
        AND log.execution_date >= p_start_date
        GROUP BY log.course_id
    ),
    oa_progress AS (
        SELECT 
            ges.course_id,
            COUNT(DISTINCT ges.oa_code) as oa_evaluated,
            AVG(
                CASE 
                    WHEN ges.percentage_completed >= 80 THEN 1 
                    ELSE 0 
                END
            ) * 100 as mastery_percentage,
            COUNT(ges.id) as total_evaluations
        FROM gamified_evaluation_sessions ges
        WHERE ges.school_id = p_school_id
        AND ges.created_at >= p_start_date
        AND ges.status = 'completed'
        GROUP BY ges.course_id
    )
    SELECT 
        c.id as course_id,
        c.name as course_name,
        COALESCE(
            ROUND((lu.activities_used::DECIMAL / lu.total_activities * 100), 2), 
            0
        ) as lab_usage_pct,
        COALESCE(ROUND(op.mastery_percentage, 2), 0) as oa_mastery_pct,
        COALESCE(lu.total_executions, 0)::INTEGER as total_lab_executions,
        COALESCE(op.total_evaluations, 0)::INTEGER as total_oa_evaluations,
        CASE 
            WHEN lu.activities_used > 0 AND op.oa_evaluated > 0 THEN 1 
            ELSE 0 
        END::INTEGER as correlation_points
    FROM courses c
    LEFT JOIN lab_usage lu ON c.id = lu.course_id
    LEFT JOIN oa_progress op ON c.id = op.course_id
    WHERE c.school_id = p_school_id
    AND (lu.activities_used > 0 OR op.oa_evaluated > 0)
    ORDER BY lab_usage_pct DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: Estadísticas generales de uso
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_usage_stats(
    p_school_id UUID,
    p_start_date TIMESTAMP
)
RETURNS TABLE (
    total_executions INTEGER,
    unique_activities INTEGER,
    unique_teachers INTEGER,
    unique_courses INTEGER,
    avg_success_rating DECIMAL(3,2),
    avg_duration_minutes DECIMAL(5,2),
    total_evidence_count INTEGER,
    activities_with_evidence_pct DECIMAL(5,2),
    repeat_usage_rate DECIMAL(5,2),
    material_active_ratio DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH base_stats AS (
        SELECT 
            COUNT(log.id) as total_executions,
            COUNT(DISTINCT log.activity_id) as unique_activities,
            COUNT(DISTINCT log.teacher_id) as unique_teachers,
            COUNT(DISTINCT log.course_id) as unique_courses,
            AVG(log.success_rating) as avg_success_rating,
            AVG(log.duration_actual_minutes) as avg_duration_minutes
        FROM lab_activity_log log
        WHERE log.school_id = p_school_id
        AND log.execution_date >= p_start_date
    ),
    evidence_stats AS (
        SELECT 
            COUNT(e.id) as total_evidence_count,
            COUNT(DISTINCT log.id) as logs_with_evidence
        FROM lab_activity_log log
        LEFT JOIN lab_evidence e ON log.id = e.activity_log_id
        WHERE log.school_id = p_school_id
        AND log.execution_date >= p_start_date
    ),
    repeat_stats AS (
        SELECT 
            COUNT(CASE WHEN execution_count > 1 THEN 1 END) as repeat_activities,
            COUNT(*) as total_activity_teacher_pairs
        FROM (
            SELECT 
                log.activity_id,
                log.teacher_id,
                COUNT(log.id) as execution_count
            FROM lab_activity_log log
            WHERE log.school_id = p_school_id
            AND log.execution_date >= p_start_date
            GROUP BY log.activity_id, log.teacher_id
        ) activity_teacher_counts
    ),
    material_stats AS (
        SELECT 
            COUNT(*) as total_activities,
            bs.unique_activities as used_activities
        FROM lab_activity la, base_stats bs
        WHERE la.status = 'active'
        GROUP BY bs.unique_activities
    )
    SELECT 
        bs.total_executions::INTEGER,
        bs.unique_activities::INTEGER,
        bs.unique_teachers::INTEGER,
        bs.unique_courses::INTEGER,
        ROUND(bs.avg_success_rating, 2) as avg_success_rating,
        ROUND(bs.avg_duration_minutes, 2) as avg_duration_minutes,
        es.total_evidence_count::INTEGER,
        CASE 
            WHEN bs.total_executions > 0 THEN 
                ROUND((es.logs_with_evidence::DECIMAL / bs.total_executions * 100), 2)
            ELSE 0
        END as activities_with_evidence_pct,
        CASE 
            WHEN rs.total_activity_teacher_pairs > 0 THEN 
                ROUND((rs.repeat_activities::DECIMAL / rs.total_activity_teacher_pairs * 100), 2)
            ELSE 0
        END as repeat_usage_rate,
        CASE 
            WHEN ms.total_activities > 0 THEN 
                ROUND((ms.used_activities::DECIMAL / ms.total_activities * 100), 2)
            ELSE 0
        END as material_active_ratio
    FROM base_stats bs, evidence_stats es, repeat_stats rs, material_stats ms;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: Estadísticas de docentes
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_teacher_stats(
    p_school_id UUID,
    p_start_date TIMESTAMP
)
RETURNS TABLE (
    total_teachers INTEGER,
    active_teachers INTEGER,
    avg_activities_per_teacher DECIMAL(5,2),
    avg_executions_per_teacher DECIMAL(5,2),
    teachers_with_evidence INTEGER,
    teacher_engagement_score DECIMAL(5,2),
    top_teacher_name TEXT,
    top_teacher_executions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH teacher_stats AS (
        SELECT 
            log.teacher_id,
            p.full_name,
            COUNT(DISTINCT log.activity_id) as activities_used,
            COUNT(log.id) as total_executions,
            COUNT(DISTINCT e.id) as evidence_count,
            AVG(log.success_rating) as avg_rating
        FROM lab_activity_log log
        JOIN profiles p ON log.teacher_id = p.id
        LEFT JOIN lab_evidence e ON log.id = e.activity_log_id
        WHERE log.school_id = p_school_id
        AND log.execution_date >= p_start_date
        GROUP BY log.teacher_id, p.full_name
    ),
    aggregated_stats AS (
        SELECT 
            COUNT(*) as active_teachers,
            AVG(activities_used) as avg_activities_per_teacher,
            AVG(total_executions) as avg_executions_per_teacher,
            COUNT(CASE WHEN evidence_count > 0 THEN 1 END) as teachers_with_evidence,
            AVG(
                CASE 
                    WHEN activities_used > 0 THEN 
                        (activities_used * avg_rating * (evidence_count + 1)) / 25.0
                    ELSE 0 
                END
            ) as teacher_engagement_score
        FROM teacher_stats
    ),
    top_teacher AS (
        SELECT 
            full_name,
            total_executions
        FROM teacher_stats
        ORDER BY total_executions DESC, activities_used DESC
        LIMIT 1
    ),
    total_teacher_count AS (
        SELECT COUNT(*) as total_teachers
        FROM profiles p
        WHERE p.school_id = p_school_id
        AND p.role IN ('teacher', 'coordinator')
    )
    SELECT 
        ttc.total_teachers::INTEGER,
        COALESCE(ast.active_teachers, 0)::INTEGER,
        ROUND(COALESCE(ast.avg_activities_per_teacher, 0), 2),
        ROUND(COALESCE(ast.avg_executions_per_teacher, 0), 2),
        COALESCE(ast.teachers_with_evidence, 0)::INTEGER,
        ROUND(COALESCE(ast.teacher_engagement_score, 0), 2),
        COALESCE(tt.full_name, 'N/A') as top_teacher_name,
        COALESCE(tt.total_executions, 0)::INTEGER
    FROM total_teacher_count ttc
    LEFT JOIN aggregated_stats ast ON true
    LEFT JOIN top_teacher tt ON true;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: Estadísticas de evidencias
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_evidence_stats(
    p_school_id UUID,
    p_start_date TIMESTAMP
)
RETURNS TABLE (
    total_evidence_count INTEGER,
    photo_count INTEGER,
    video_count INTEGER,
    avg_evidence_per_execution DECIMAL(5,2),
    evidence_approval_rate DECIMAL(5,2),
    student_work_percentage DECIMAL(5,2),
    featured_evidence_count INTEGER,
    evidence_integrity_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH evidence_stats AS (
        SELECT 
            COUNT(e.id) as total_evidence,
            COUNT(CASE WHEN e.file_type = 'photo' THEN 1 END) as photo_count,
            COUNT(CASE WHEN e.file_type = 'video' THEN 1 END) as video_count,
            COUNT(CASE WHEN e.is_approved = true THEN 1 END) as approved_count,
            COUNT(CASE WHEN e.is_approved IS NOT NULL THEN 1 END) as reviewed_count,
            COUNT(CASE WHEN e.is_student_work = true THEN 1 END) as student_work_count,
            COUNT(CASE WHEN e.is_featured = true THEN 1 END) as featured_count,
            COUNT(CASE WHEN e.file_size_bytes > 0 AND e.file_name IS NOT NULL THEN 1 END) as valid_files
        FROM lab_evidence e
        JOIN lab_activity_log log ON e.activity_log_id = log.id
        WHERE log.school_id = p_school_id
        AND log.execution_date >= p_start_date
    ),
    execution_count AS (
        SELECT COUNT(id) as total_executions
        FROM lab_activity_log
        WHERE school_id = p_school_id
        AND execution_date >= p_start_date
    )
    SELECT 
        es.total_evidence::INTEGER,
        es.photo_count::INTEGER,
        es.video_count::INTEGER,
        CASE 
            WHEN ec.total_executions > 0 THEN 
                ROUND((es.total_evidence::DECIMAL / ec.total_executions), 2)
            ELSE 0
        END as avg_evidence_per_execution,
        CASE 
            WHEN es.reviewed_count > 0 THEN 
                ROUND((es.approved_count::DECIMAL / es.reviewed_count * 100), 2)
            ELSE 0
        END as evidence_approval_rate,
        CASE 
            WHEN es.total_evidence > 0 THEN 
                ROUND((es.student_work_count::DECIMAL / es.total_evidence * 100), 2)
            ELSE 0
        END as student_work_percentage,
        es.featured_count::INTEGER,
        CASE 
            WHEN es.total_evidence > 0 THEN 
                ROUND((es.valid_files::DECIMAL / es.total_evidence * 100), 2)
            ELSE 0
        END as evidence_integrity_score
    FROM evidence_stats es, execution_count ec;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: Datos de tendencia semanal
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_trend_data(
    p_school_id UUID,
    p_weeks INTEGER DEFAULT 12
)
RETURNS TABLE (
    week_start DATE,
    week_number INTEGER,
    total_executions INTEGER,
    unique_activities INTEGER,
    unique_teachers INTEGER,
    avg_success_rating DECIMAL(3,2),
    evidence_count INTEGER,
    new_teachers INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE week_series AS (
        SELECT 
            (DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' * (p_weeks - 1))::DATE as week_start,
            1 as week_number
        UNION ALL
        SELECT 
            (week_start + INTERVAL '1 week')::DATE,
            week_number + 1
        FROM week_series
        WHERE week_number < p_weeks
    ),
    weekly_stats AS (
        SELECT 
            DATE_TRUNC('week', log.execution_date)::DATE as week_start,
            COUNT(log.id) as total_executions,
            COUNT(DISTINCT log.activity_id) as unique_activities,
            COUNT(DISTINCT log.teacher_id) as unique_teachers,
            AVG(log.success_rating) as avg_success_rating,
            COUNT(e.id) as evidence_count
        FROM lab_activity_log log
        LEFT JOIN lab_evidence e ON log.id = e.activity_log_id
        WHERE log.school_id = p_school_id
        AND log.execution_date >= (CURRENT_DATE - INTERVAL '1 week' * p_weeks)
        GROUP BY DATE_TRUNC('week', log.execution_date)
    ),
    teacher_firsts AS (
        SELECT 
            DATE_TRUNC('week', first_execution)::DATE as week_start,
            COUNT(*) as new_teachers
        FROM (
            SELECT 
                teacher_id,
                MIN(execution_date) as first_execution
            FROM lab_activity_log
            WHERE school_id = p_school_id
            GROUP BY teacher_id
        ) first_executions
        WHERE first_execution >= (CURRENT_DATE - INTERVAL '1 week' * p_weeks)
        GROUP BY DATE_TRUNC('week', first_execution)
    )
    SELECT 
        ws.week_start,
        ws.week_number,
        COALESCE(wst.total_executions, 0)::INTEGER,
        COALESCE(wst.unique_activities, 0)::INTEGER,
        COALESCE(wst.unique_teachers, 0)::INTEGER,
        ROUND(COALESCE(wst.avg_success_rating, 0), 2),
        COALESCE(wst.evidence_count, 0)::INTEGER,
        COALESCE(tf.new_teachers, 0)::INTEGER
    FROM week_series ws
    LEFT JOIN weekly_stats wst ON ws.week_start = wst.week_start
    LEFT JOIN teacher_firsts tf ON ws.week_start = tf.week_start
    ORDER BY ws.week_start;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: Health check del módulo
-- ============================================================================
CREATE OR REPLACE FUNCTION get_lab_health_metrics(
    p_school_id UUID DEFAULT NULL
)
RETURNS TABLE (
    metric_name TEXT,
    metric_value DECIMAL(10,2),
    metric_unit TEXT,
    status TEXT,
    threshold_value DECIMAL(10,2),
    last_calculated TIMESTAMP
) AS $$
DECLARE
    calc_time TIMESTAMP := NOW();
BEGIN
    RETURN QUERY
    WITH current_stats AS (
        SELECT 
            COUNT(DISTINCT log.teacher_id) as active_teachers_7d,
            COUNT(DISTINCT log.activity_id) as activities_used_30d,
            COUNT(log.id) as total_executions_30d,
            AVG(EXTRACT(EPOCH FROM (log.created_at - log.execution_date))/60) as avg_registration_lag_min,
            COUNT(e.id)::DECIMAL / NULLIF(COUNT(log.id), 0) as evidence_per_execution,
            AVG(log.success_rating) as avg_success_rating,
            COUNT(CASE WHEN e.file_size_bytes > 0 THEN 1 END)::DECIMAL / NULLIF(COUNT(e.id), 0) * 100 as evidence_integrity_pct
        FROM lab_activity_log log
        LEFT JOIN lab_evidence e ON log.id = e.activity_log_id
        WHERE (p_school_id IS NULL OR log.school_id = p_school_id)
        AND log.execution_date >= (calc_time - INTERVAL '30 days')
    ),
    activity_totals AS (
        SELECT COUNT(*) as total_activities
        FROM lab_activity 
        WHERE status = 'active'
    )
    SELECT 
        metric,
        value,
        unit,
        CASE 
            WHEN metric = 'active_daily_teachers' AND value >= 5 THEN 'healthy'
            WHEN metric = 'active_daily_teachers' AND value >= 2 THEN 'warning'
            WHEN metric = 'active_daily_teachers' THEN 'critical'
            
            WHEN metric = 'material_active_ratio' AND value >= 60 THEN 'healthy'
            WHEN metric = 'material_active_ratio' AND value >= 40 THEN 'warning'
            WHEN metric = 'material_active_ratio' THEN 'critical'
            
            WHEN metric = 'avg_registration_lag' AND value <= 60 THEN 'healthy'
            WHEN metric = 'avg_registration_lag' AND value <= 120 THEN 'warning'
            WHEN metric = 'avg_registration_lag' THEN 'critical'
            
            WHEN metric = 'evidence_integrity_score' AND value >= 90 THEN 'healthy'
            WHEN metric = 'evidence_integrity_score' AND value >= 70 THEN 'warning'
            WHEN metric = 'evidence_integrity_score' THEN 'critical'
            
            WHEN metric = 'avg_success_rating' AND value >= 4.0 THEN 'healthy'
            WHEN metric = 'avg_success_rating' AND value >= 3.0 THEN 'warning'
            WHEN metric = 'avg_success_rating' THEN 'critical'
            
            ELSE 'unknown'
        END as status,
        threshold,
        calc_time as last_calculated
    FROM (
        VALUES 
            ('active_daily_teachers', COALESCE(cs.active_teachers_7d / 7.0, 0), 'teachers/day', 5.0),
            ('material_active_ratio', COALESCE((cs.activities_used_30d::DECIMAL / at.total_activities * 100), 0), 'percent', 60.0),
            ('avg_registration_lag', COALESCE(cs.avg_registration_lag_min, 0), 'minutes', 60.0),
            ('evidence_integrity_score', COALESCE(cs.evidence_integrity_pct, 0), 'percent', 90.0),
            ('avg_success_rating', COALESCE(cs.avg_success_rating, 0), 'rating', 4.0),
            ('evidence_per_execution', COALESCE(cs.evidence_per_execution, 0), 'files', 1.0)
    ) AS metrics(metric, value, unit, threshold)
    CROSS JOIN current_stats cs
    CROSS JOIN activity_totals at;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER FUNCTIONS para mantenimiento automático
-- ============================================================================

-- Función para limpiar logs antiguos (>2 años)
CREATE OR REPLACE FUNCTION cleanup_old_lab_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM lab_activity_log 
    WHERE execution_date < (NOW() - INTERVAL '2 years');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log la limpieza
    INSERT INTO audit_log (
        table_name, 
        action, 
        details, 
        created_at
    ) VALUES (
        'lab_activity_log',
        'CLEANUP',
        jsonb_build_object('deleted_count', deleted_count, 'retention_period', '2 years'),
        NOW()
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Función para recalcular métricas agregadas
CREATE OR REPLACE FUNCTION refresh_lab_activity_metrics()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Actualizar métricas de actividades que han tenido cambios recientes
    WITH recent_activities AS (
        SELECT DISTINCT activity_id
        FROM lab_activity_log
        WHERE created_at >= (NOW() - INTERVAL '24 hours')
    ),
    updated_metrics AS (
        UPDATE lab_activity_metrics 
        SET 
            total_executions = (
                SELECT COUNT(*) 
                FROM lab_activity_log 
                WHERE activity_id = lab_activity_metrics.activity_id
            ),
            unique_teachers = (
                SELECT COUNT(DISTINCT teacher_id) 
                FROM lab_activity_log 
                WHERE activity_id = lab_activity_metrics.activity_id
            ),
            unique_schools = (
                SELECT COUNT(DISTINCT school_id) 
                FROM lab_activity_log 
                WHERE activity_id = lab_activity_metrics.activity_id
            ),
            avg_rating = (
                SELECT AVG(success_rating)::DECIMAL(3,2)
                FROM lab_activity_log 
                WHERE activity_id = lab_activity_metrics.activity_id 
                AND success_rating IS NOT NULL
            ),
            trend_7d = (
                SELECT 
                    COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY week) 
                FROM (
                    SELECT 
                        DATE_TRUNC('week', execution_date) as week,
                        COUNT(*) 
                    FROM lab_activity_log 
                    WHERE activity_id = lab_activity_metrics.activity_id
                    AND execution_date >= (NOW() - INTERVAL '14 days')
                    GROUP BY DATE_TRUNC('week', execution_date)
                    ORDER BY week DESC
                    LIMIT 2
                ) weekly_counts
                LIMIT 1
            ),
            updated_at = NOW()
        WHERE activity_id IN (SELECT activity_id FROM recent_activities)
        RETURNING activity_id
    )
    SELECT COUNT(*) INTO updated_count FROM updated_metrics;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql; 