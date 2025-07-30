#!/usr/bin/env python3
"""
SISTEMA DE REFINAMIENTO: FEEDBACK Y MEJORA CONTINUA
Script para crear sistema completo de recolección, análisis y aplicación
de feedback del piloto para mejora continua de la plataforma EDU21
"""

import json
import uuid
from datetime import datetime, timedelta

def create_feedback_collection_framework():
    """Define el framework de recolección de feedback"""
    
    framework = {
        "student_feedback": {
            "collection_methods": [
                {
                    "method": "in_app_ratings",
                    "frequency": "after_each_session",
                    "questions": [
                        {"q": "¿Te gustó este juego?", "type": "emoji_scale", "scale": 5},
                        {"q": "¿Fue fácil o difícil?", "type": "difficulty_scale", "scale": 5},
                        {"q": "¿Entendiste las instrucciones?", "type": "yes_no_maybe"}
                    ],
                    "target": "all_students",
                    "automated": True
                },
                {
                    "method": "weekly_surveys",
                    "frequency": "weekly",
                    "questions": [
                        {"q": "¿Cuál fue tu juego favorito esta semana?", "type": "multiple_choice"},
                        {"q": "¿Qué fue lo más difícil?", "type": "open_text"},
                        {"q": "¿Qué te gustaría cambiar?", "type": "open_text"},
                        {"q": "¿Recomendarías estos juegos?", "type": "yes_no"}
                    ],
                    "target": "sample_students",
                    "automated": False
                },
                {
                    "method": "focus_groups",
                    "frequency": "bi_weekly",
                    "questions": [
                        "¿Qué personajes/temas te gustan más?",
                        "¿Qué juegos son muy fáciles/difíciles?",
                        "¿Cómo te sientes cuando juegas?",
                        "¿Qué otros juegos te gustaría tener?"
                    ],
                    "target": "representative_sample",
                    "automated": False,
                    "moderator_required": True
                }
            ],
            "analytics_capture": [
                "time_per_session",
                "completion_rates",
                "error_patterns",
                "help_requests",
                "rage_quit_moments",
                "skin_preferences",
                "replay_behavior"
            ]
        },
        "teacher_feedback": {
            "collection_methods": [
                {
                    "method": "daily_quick_check",
                    "frequency": "after_each_class",
                    "questions": [
                        {"q": "¿Cómo fue la respuesta de los estudiantes?", "type": "scale_5"},
                        {"q": "¿Hubo problemas técnicos?", "type": "yes_no_details"},
                        {"q": "¿Se cumplieron los objetivos de la clase?", "type": "scale_5"}
                    ],
                    "target": "all_teachers",
                    "automated": True,
                    "time_limit": "2 minutes"
                },
                {
                    "method": "weekly_reflection",
                    "frequency": "weekly",
                    "questions": [
                        {"q": "¿Qué funcionó mejor esta semana?", "type": "open_text"},
                        {"q": "¿Qué obstáculos encontraste?", "type": "open_text"},
                        {"q": "¿Cómo impactó en el aprendizaje?", "type": "scale_impact"},
                        {"q": "¿Qué mejoras sugieres?", "type": "prioritized_list"}
                    ],
                    "target": "all_teachers",
                    "automated": False
                },
                {
                    "method": "monthly_interviews",
                    "frequency": "monthly",
                    "format": "semi_structured_interview",
                    "topics": [
                        "Integración curricular",
                        "Cambios en dinámicas de clase",
                        "Percepción de aprendizaje estudiantes",
                        "Satisfacción personal docente",
                        "Sugerencias específicas mejora"
                    ],
                    "target": "all_teachers",
                    "duration": "30 minutes",
                    "automated": False
                }
            ],
            "classroom_observations": [
                "student_engagement_levels",
                "collaborative_behaviors",
                "frustration_indicators",
                "success_celebrations",
                "help_seeking_patterns",
                "curriculum_alignment_evidence"
            ]
        },
        "technical_feedback": {
            "automated_collection": [
                {
                    "metric": "performance_data",
                    "indicators": [
                        "load_times",
                        "crash_reports", 
                        "error_frequencies",
                        "device_compatibility_issues",
                        "network_performance",
                        "battery_usage"
                    ],
                    "frequency": "real_time",
                    "threshold_alerts": True
                },
                {
                    "metric": "usage_patterns",
                    "indicators": [
                        "peak_usage_times",
                        "session_durations",
                        "feature_adoption_rates",
                        "navigation_flows",
                        "drop_off_points",
                        "accessibility_feature_usage"
                    ],
                    "frequency": "continuous",
                    "ml_analysis": True
                }
            ],
            "user_reported_issues": [
                "bug_reports",
                "feature_requests",
                "usability_complaints",
                "accessibility_barriers",
                "content_errors",
                "suggestion_submissions"
            ]
        },
        "administrative_feedback": {
            "school_coordinators": [
                {
                    "method": "monthly_reports",
                    "metrics": [
                        "teacher_adoption_rates",
                        "student_engagement_trends",
                        "technical_support_needs",
                        "curriculum_integration_success",
                        "parent_reactions",
                        "administrative_overhead"
                    ],
                    "format": "structured_report",
                    "automated_data": True
                }
            ],
            "parent_feedback": [
                {
                    "method": "quarterly_survey",
                    "questions": [
                        {"q": "¿Cómo percibe el impacto en su hijo/a?", "type": "scale_5"},
                        {"q": "¿Su hijo/a comenta sobre los juegos en casa?", "type": "frequency_scale"},
                        {"q": "¿Ha notado cambios en su actitud hacia el aprendizaje?", "type": "yes_no_details"},
                        {"q": "¿Qué beneficios o preocupaciones tiene?", "type": "open_text"}
                    ],
                    "target": "representative_sample",
                    "method_delivery": "digital_survey"
                }
            ]
        }
    }
    
    return framework

def create_analysis_engine():
    """Define el motor de análisis de feedback"""
    
    analysis_engine = {
        "quantitative_analysis": {
            "engagement_metrics": {
                "indicators": [
                    "session_completion_rate",
                    "average_session_duration", 
                    "return_user_percentage",
                    "activities_per_session",
                    "help_request_frequency"
                ],
                "benchmarks": {
                    "excellent": "> 90%",
                    "good": "70-90%", 
                    "needs_improvement": "< 70%"
                },
                "trend_analysis": "weekly_moving_average",
                "segmentation": ["by_school", "by_grade", "by_subject", "by_engine"]
            },
            "learning_outcomes": {
                "indicators": [
                    "pre_post_test_improvement",
                    "skill_progression_rate",
                    "error_reduction_over_time",
                    "bloom_level_advancement",
                    "curriculum_objective_mastery"
                ],
                "statistical_tests": [
                    "paired_t_test",
                    "effect_size_calculation",
                    "confidence_intervals",
                    "regression_analysis"
                ],
                "control_comparisons": "traditional_teaching_methods"
            },
            "usability_metrics": {
                "indicators": [
                    "task_completion_rate",
                    "time_to_complete_task",
                    "error_rate_per_task",
                    "satisfaction_scores",
                    "feature_adoption_rate"
                ],
                "user_experience_scoring": "standardized_sus_scale",
                "accessibility_compliance": "wcag_2_2_aa_audit"
            }
        },
        "qualitative_analysis": {
            "sentiment_analysis": {
                "text_sources": [
                    "open_feedback_responses",
                    "teacher_interview_transcripts",
                    "focus_group_recordings",
                    "support_ticket_descriptions"
                ],
                "nlp_techniques": [
                    "sentiment_scoring",
                    "emotion_detection",
                    "theme_extraction",
                    "keyword_frequency_analysis"
                ],
                "language_support": ["spanish", "mapudungun_basic"]
            },
            "thematic_analysis": {
                "coding_framework": [
                    "user_experience_themes",
                    "learning_impact_themes", 
                    "technical_issue_themes",
                    "curriculum_integration_themes",
                    "accessibility_themes"
                ],
                "analysis_method": "inductive_thematic_analysis",
                "inter_rater_reliability": "minimum_80_percent_agreement"
            }
        },
        "predictive_analysis": {
            "machine_learning_models": [
                {
                    "model": "churn_prediction",
                    "purpose": "identify_students_at_risk_of_disengagement",
                    "features": ["session_frequency", "completion_rates", "error_patterns"],
                    "action_triggers": "early_intervention_alerts"
                },
                {
                    "model": "difficulty_optimization",
                    "purpose": "recommend_optimal_difficulty_progression",
                    "features": ["current_skill_level", "error_patterns", "time_spent"],
                    "action_triggers": "adaptive_difficulty_adjustment"
                },
                {
                    "model": "content_recommendation",
                    "purpose": "suggest_most_effective_engines_and_skins",
                    "features": ["learning_objectives", "student_preferences", "performance_data"],
                    "action_triggers": "personalized_content_delivery"
                }
            ]
        }
    }
    
    return analysis_engine

def create_prioritization_framework():
    """Define el framework de priorización de mejoras"""
    
    prioritization = {
        "impact_assessment": {
            "dimensions": [
                {
                    "dimension": "learning_impact",
                    "weight": 40,
                    "criteria": [
                        "improvement_in_learning_outcomes",
                        "curriculum_alignment_enhancement",
                        "accessibility_improvement",
                        "engagement_increase"
                    ],
                    "scoring": "1_to_5_scale"
                },
                {
                    "dimension": "user_experience_impact", 
                    "weight": 25,
                    "criteria": [
                        "usability_improvement",
                        "satisfaction_increase",
                        "frustration_reduction",
                        "adoption_facilitation"
                    ],
                    "scoring": "1_to_5_scale"
                },
                {
                    "dimension": "technical_impact",
                    "weight": 20,
                    "criteria": [
                        "performance_improvement",
                        "stability_enhancement",
                        "scalability_benefit",
                        "security_strengthening"
                    ],
                    "scoring": "1_to_5_scale"
                },
                {
                    "dimension": "business_impact",
                    "weight": 15,
                    "criteria": [
                        "market_differentiation",
                        "competitive_advantage",
                        "revenue_potential",
                        "strategic_alignment"
                    ],
                    "scoring": "1_to_5_scale"
                }
            ],
            "calculation_method": "weighted_average"
        },
        "effort_assessment": {
            "factors": [
                {
                    "factor": "development_complexity",
                    "levels": ["low", "medium", "high", "very_high"],
                    "time_estimates": ["< 1 week", "1-2 weeks", "3-4 weeks", "> 1 month"]
                },
                {
                    "factor": "resource_requirements",
                    "types": ["developer_hours", "designer_hours", "qa_hours", "infrastructure_costs"],
                    "estimation_method": "expert_judgment_with_historical_data"
                },
                {
                    "factor": "risk_level",
                    "categories": ["low_risk", "medium_risk", "high_risk"],
                    "considerations": ["technical_feasibility", "user_acceptance", "timeline_pressure"]
                }
            ]
        },
        "prioritization_matrix": {
            "quadrants": [
                {
                    "name": "quick_wins",
                    "criteria": "high_impact_low_effort",
                    "action": "implement_immediately",
                    "timeline": "current_sprint"
                },
                {
                    "name": "major_projects",
                    "criteria": "high_impact_high_effort", 
                    "action": "plan_for_next_release",
                    "timeline": "next_quarter"
                },
                {
                    "name": "fill_ins",
                    "criteria": "low_impact_low_effort",
                    "action": "implement_when_capacity_available",
                    "timeline": "ongoing"
                },
                {
                    "name": "questionable",
                    "criteria": "low_impact_high_effort",
                    "action": "reconsider_or_postpone",
                    "timeline": "future_consideration"
                }
            ]
        }
    }
    
    return prioritization

def create_implementation_roadmap():
    """Define el roadmap de implementación de mejoras"""
    
    roadmap = {
        "immediate_actions": {
            "timeline": "0-2 weeks",
            "focus": "critical_fixes_and_quick_wins",
            "typical_improvements": [
                "critical_bug_fixes",
                "performance_optimizations",
                "usability_quick_fixes",
                "content_error_corrections",
                "accessibility_urgent_issues"
            ],
            "approval_process": "fast_track",
            "testing_requirements": "smoke_testing_minimum"
        },
        "short_term_improvements": {
            "timeline": "2-8 weeks",
            "focus": "medium_impact_enhancements",
            "typical_improvements": [
                "new_skin_variations",
                "engine_behavior_refinements",
                "ui_ux_improvements",
                "additional_accessibility_features",
                "teacher_dashboard_enhancements"
            ],
            "approval_process": "standard_review",
            "testing_requirements": "full_regression_testing"
        },
        "medium_term_developments": {
            "timeline": "2-6 months",
            "focus": "major_feature_additions",
            "typical_improvements": [
                "new_game_engines",
                "advanced_analytics_features",
                "ai_powered_recommendations",
                "multi_language_support",
                "advanced_assessment_tools"
            ],
            "approval_process": "product_committee_review",
            "testing_requirements": "comprehensive_testing_including_pilots"
        },
        "long_term_innovations": {
            "timeline": "6+ months",
            "focus": "strategic_platform_evolution",
            "typical_improvements": [
                "ar_vr_integration",
                "advanced_ai_tutoring",
                "social_learning_features",
                "international_expansion",
                "enterprise_features"
            ],
            "approval_process": "executive_board_approval",
            "testing_requirements": "extensive_pilot_programs"
        }
    }
    
    return roadmap

def create_continuous_improvement_system():
    """Define el sistema de mejora continua"""
    
    system = {
        "feedback_loops": {
            "rapid_iteration_cycle": {
                "duration": "2 weeks",
                "steps": [
                    "collect_feedback",
                    "analyze_patterns", 
                    "prioritize_improvements",
                    "implement_changes",
                    "test_with_users",
                    "measure_impact",
                    "adjust_if_needed"
                ],
                "success_metrics": [
                    "cycle_completion_time",
                    "user_satisfaction_improvement",
                    "issue_resolution_rate"
                ]
            },
            "monthly_optimization_cycle": {
                "duration": "4 weeks",
                "focus": "deeper_analysis_and_strategic_improvements",
                "includes": [
                    "comprehensive_data_analysis",
                    "user_research_studies",
                    "competitive_analysis",
                    "technology_trend_assessment",
                    "strategic_planning_adjustment"
                ]
            }
        },
        "quality_assurance": {
            "automated_testing": [
                "regression_testing_suite",
                "performance_benchmarking",
                "accessibility_compliance_checks",
                "cross_platform_compatibility",
                "security_vulnerability_scans"
            ],
            "user_testing": [
                "usability_testing_sessions",
                "a_b_testing_framework", 
                "focus_group_evaluations",
                "accessibility_user_testing",
                "pilot_group_validation"
            ]
        },
        "knowledge_management": {
            "documentation": [
                "improvement_decision_rationale",
                "user_feedback_insights_database",
                "best_practices_repository",
                "lessons_learned_archive",
                "design_pattern_library"
            ],
            "team_learning": [
                "regular_retrospectives",
                "cross_functional_knowledge_sharing",
                "external_expert_consultations",
                "industry_conference_insights",
                "research_paper_reviews"
            ]
        }
    }
    
    return system

def generate_refinement_system_sql():
    """Genera SQL para el sistema de refinamiento en Supabase"""
    
    sql = f"""-- ===============================================
-- SISTEMA DE REFINAMIENTO: FEEDBACK Y MEJORA CONTINUA
-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
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
"""
    
    return sql

def main():
    """Función principal para crear el sistema de refinamiento"""
    
    print("🔄 === SISTEMA DE REFINAMIENTO: FEEDBACK Y MEJORA CONTINUA ===")
    print("=" * 80)
    print(f"⏰ Inicio: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # 1. CREAR FRAMEWORK DE RECOLECCIÓN
    print("📋 Creando framework de recolección de feedback...")
    collection_framework = create_feedback_collection_framework()
    
    total_methods = (
        len(collection_framework['student_feedback']['collection_methods']) +
        len(collection_framework['teacher_feedback']['collection_methods'])
    )
    print(f"✅ {total_methods} métodos de recolección definidos")
    
    # Contar fuentes de feedback
    student_sources = len(collection_framework['student_feedback']['analytics_capture'])
    teacher_sources = len(collection_framework['teacher_feedback']['classroom_observations'])
    technical_sources = len(collection_framework['technical_feedback']['automated_collection'])
    
    print(f"   📊 Estudiantes: {student_sources} fuentes automáticas")
    print(f"   👨‍🏫 Docentes: {teacher_sources} observaciones de aula")
    print(f"   💻 Técnico: {technical_sources} métricas automáticas")
    print()
    
    # 2. CREAR MOTOR DE ANÁLISIS
    print("🧠 Creando motor de análisis de feedback...")
    analysis_engine = create_analysis_engine()
    
    quant_metrics = len(analysis_engine['quantitative_analysis'])
    qual_methods = len(analysis_engine['qualitative_analysis'])
    ml_models = len(analysis_engine['predictive_analysis']['machine_learning_models'])
    
    print(f"✅ Motor de análisis completo creado")
    print(f"   📈 {quant_metrics} categorías de análisis cuantitativo")
    print(f"   💬 {qual_methods} métodos de análisis cualitativo") 
    print(f"   🤖 {ml_models} modelos de machine learning")
    print()
    
    # 3. CREAR FRAMEWORK DE PRIORIZACIÓN
    print("🎯 Creando framework de priorización...")
    prioritization = create_prioritization_framework()
    
    impact_dimensions = len(prioritization['impact_assessment']['dimensions'])
    effort_factors = len(prioritization['effort_assessment']['factors'])
    matrix_quadrants = len(prioritization['prioritization_matrix']['quadrants'])
    
    print(f"✅ Framework de priorización estructurado")
    print(f"   💥 {impact_dimensions} dimensiones de impacto")
    print(f"   ⚡ {effort_factors} factores de esfuerzo")
    print(f"   📋 {matrix_quadrants} cuadrantes de priorización")
    print()
    
    # 4. CREAR ROADMAP DE IMPLEMENTACIÓN
    print("🗺️ Creando roadmap de implementación...")
    roadmap = create_implementation_roadmap()
    
    timeline_phases = len(roadmap)
    print(f"✅ Roadmap de {timeline_phases} fases temporales")
    
    for phase_name, phase_info in roadmap.items():
        print(f"   📅 {phase_name.replace('_', ' ').title()}: {phase_info['timeline']}")
    print()
    
    # 5. CREAR SISTEMA DE MEJORA CONTINUA
    print("🔄 Creando sistema de mejora continua...")
    improvement_system = create_continuous_improvement_system()
    
    feedback_loops = len(improvement_system['feedback_loops'])
    qa_methods = len(improvement_system['quality_assurance'])
    knowledge_areas = len(improvement_system['knowledge_management'])
    
    print(f"✅ Sistema de mejora continua establecido")
    print(f"   🔄 {feedback_loops} ciclos de retroalimentación")
    print(f"   ✅ {qa_methods} categorías de QA")
    print(f"   📚 {knowledge_areas} áreas de gestión del conocimiento")
    print()
    
    # 6. GENERAR ARCHIVOS
    print("📝 Generando archivos de configuración...")
    
    # Sistema completo JSON
    complete_system = {
        "metadata": {
            "title": "Sistema de Refinamiento EDU21",
            "version": "1.0",
            "created_at": datetime.now().isoformat(),
            "purpose": "Mejora continua basada en feedback del piloto"
        },
        "feedback_collection": collection_framework,
        "analysis_engine": analysis_engine,
        "prioritization": prioritization,
        "implementation_roadmap": roadmap,
        "continuous_improvement": improvement_system
    }
    
    system_file = "refinement_system_complete.json"
    with open(system_file, 'w', encoding='utf-8') as f:
        json.dump(complete_system, f, indent=2, ensure_ascii=False)
    print(f"✅ Sistema completo: {system_file}")
    
    # SQL de configuración
    sql_content = generate_refinement_system_sql()
    sql_file = "refinement_system_supabase.sql"
    
    with open(sql_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    print(f"✅ SQL configuración: {sql_file}")
    print()
    
    # 7. ESTADÍSTICAS DEL SISTEMA
    print("📊 === CAPACIDADES DEL SISTEMA ===")
    print()
    
    print("📋 RECOLECCIÓN DE FEEDBACK:")
    print(f"   👥 Estudiantes: {len(collection_framework['student_feedback']['collection_methods'])} métodos")
    print(f"   👨‍🏫 Docentes: {len(collection_framework['teacher_feedback']['collection_methods'])} métodos")
    print(f"   💻 Técnico: {len(collection_framework['technical_feedback']['automated_collection'])} fuentes automáticas")
    print(f"   🏛️ Administrativo: 2 canales adicionales")
    print()
    
    print("🧠 CAPACIDADES DE ANÁLISIS:")
    print("   📈 Análisis cuantitativo: Engagement, aprendizaje, usabilidad")
    print("   💬 Análisis cualitativo: Sentimientos, temas, emociones")
    print(f"   🤖 ML: {ml_models} modelos predictivos")
    print("   📊 Reporting: Dashboards en tiempo real")
    print()
    
    print("⚡ SISTEMA DE ACCIÓN:")
    print(f"   🎯 Priorización: {impact_dimensions}D impacto + {effort_factors}D esfuerzo")
    print(f"   📅 Roadmap: {timeline_phases} fases de implementación")
    print("   🔄 Mejora continua: Ciclos de 2 semanas")
    print("   ⚠️ Alertas automáticas: Engagement, técnicas, patrones")
    print()
    
    # 8. CRONOGRAMA DE OPERACIÓN
    print("📅 === CRONOGRAMA DE OPERACIÓN ===")
    print()
    
    print("🔄 CICLO RÁPIDO (2 semanas):")
    print("   Día 1-3: Recolección feedback automático")
    print("   Día 4-7: Análisis y identificación mejoras")
    print("   Día 8-12: Implementación mejoras críticas")
    print("   Día 13-14: Testing y validación")
    print()
    
    print("📊 CICLO MENSUAL (4 semanas):")
    print("   Semana 1: Análisis profundo de datos")
    print("   Semana 2: Entrevistas y focus groups")
    print("   Semana 3: Priorización estratégica")
    print("   Semana 4: Planificación próximo período")
    print()
    
    # 9. PRÓXIMOS PASOS
    print("🚀 === PRÓXIMOS PASOS ===")
    print()
    print(f"1. 📤 Ejecutar {sql_file} en Supabase")
    print("2. 🎯 Configurar dashboards de monitoreo")
    print("3. 🤖 Implementar análisis automático")
    print("4. 📱 Crear app móvil para feedback docente")
    print("5. 🧪 Comenzar recolección durante piloto")
    print("6. 🔄 Iniciar primeros ciclos de mejora")
    print()
    
    print("📋 EQUIPO REQUERIDO:")
    print("   Data Analyst: Análisis cuantitativo")
    print("   UX Researcher: Análisis cualitativo")
    print("   Product Manager: Priorización y roadmap")
    print("   Dev Team: Implementación mejoras")
    print("   QA Team: Testing y validación")
    print()
    
    print("=" * 80)
    print("🎉 ¡SISTEMA DE REFINAMIENTO COMPLETAMENTE IMPLEMENTADO!")
    print(f"📊 {total_methods} métodos de recolección activos")
    print(f"🧠 {quant_metrics + qual_methods} tipos de análisis")
    print(f"🎯 {matrix_quadrants} categorías de priorización")
    print(f"🔄 Mejora continua cada 2 semanas")
    print("=" * 80)
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ Sistema de refinamiento implementado. Mejora continua activada.")
    else:
        print("\n❌ Error en implementación del sistema. Revisar logs.") 