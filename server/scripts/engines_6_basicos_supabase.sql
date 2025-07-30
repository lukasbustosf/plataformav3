-- ===============================================
-- CREACIÓN: 6 ENGINES BÁSICOS PRIORITARIOS EDU21
-- Fecha: 2025-07-08 12:24:18
-- Versión: 1.0
-- ===============================================

-- Crear tabla de engines si no existe
CREATE TABLE IF NOT EXISTS game_engine (
    engine_id varchar(10) PRIMARY KEY,
    code varchar(50) UNIQUE NOT NULL,
    name varchar(100) NOT NULL,
    version varchar(10) DEFAULT '1.0',
    description text,
    subject_affinity text[], -- Array de asignaturas
    recommended_grades text[], -- Array de grados
    bloom_levels text[], -- Array de niveles Bloom
    cognitive_skills text[], -- Array de habilidades cognitivas
    game_mechanics jsonb, -- Configuración de mecánicas
    technical_config jsonb, -- Configuración técnica
    learning_objectives text[], -- Array de códigos OA
    difficulty_scaling jsonb, -- Configuración de dificultad
    status varchar(20) DEFAULT 'development',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    created_by varchar(50) DEFAULT 'system'
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_game_engine_subject ON game_engine USING GIN (subject_affinity);
CREATE INDEX IF NOT EXISTS idx_game_engine_grades ON game_engine USING GIN (recommended_grades);
CREATE INDEX IF NOT EXISTS idx_game_engine_bloom ON game_engine USING GIN (bloom_levels);
CREATE INDEX IF NOT EXISTS idx_game_engine_status ON game_engine(status);

-- Insertar 6 engines básicos


INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG01',
    'COUNTER',
    'Counter/Number Line',
    '1.0',
    'Motor de juegos de conteo y línea numérica con progresión visual',
    ARRAY['MAT'],
    ARRAY['1B', '2B', '3B'],
    ARRAY['Recordar', 'Comprender', 'Aplicar'],
    ARRAY['memoria_trabajo', 'procesamiento_visual', 'atencion_selectiva'],
    '{"core_actions": ["count", "increment", "decrement", "position_on_line"], "visual_elements": ["number_line", "counters", "progress_bar"], "interaction_types": ["click", "drag", "keyboard_input"], "feedback_system": "immediate_visual_audio"}'::jsonb,
    '{"max_range": 100, "min_range": 0, "step_size": 1, "animation_speed": "medium", "sound_effects": true, "accessibility": {"keyboard_navigation": true, "screen_reader": true, "high_contrast": true, "tts_support": true}}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA01OA03', 'MA02OA01', 'MA02OA02', 'MA03OA01'],
    '{"easy": {"range": [1, 10], "step": 1}, "medium": {"range": [1, 50], "step": [1, 2, 5]}, "hard": {"range": [1, 100], "step": [1, 2, 5, 10]}}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();


INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG02',
    'DRAG_DROP_NUM',
    'Drag-Drop Numbers',
    '1.0',
    'Motor de arrastrar y soltar para operaciones matemáticas y ordenamiento',
    ARRAY['MAT'],
    ARRAY['1B', '2B', '3B', '4B'],
    ARRAY['Comprender', 'Aplicar'],
    ARRAY['coordinacion_motora', 'razonamiento_logico', 'flexibilidad_mental'],
    '{"core_actions": ["drag", "drop", "sort", "group", "match"], "visual_elements": ["number_cards", "drop_zones", "sorting_containers"], "interaction_types": ["drag_drop", "touch", "keyboard_alternative"], "feedback_system": "snap_feedback_with_validation"}'::jsonb,
    '{"max_items": 12, "drag_sensitivity": "medium", "drop_zone_tolerance": "generous", "auto_arrange": true, "collision_detection": true, "accessibility": {"keyboard_navigation": true, "screen_reader": true, "drag_alternatives": true, "focus_management": true}}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04', 'MA02OA09', 'MA03OA09', 'MA04OA02'],
    '{"easy": {"items": 4, "operations": ["sort_ascending"]}, "medium": {"items": 8, "operations": ["sort", "group_by_property"]}, "hard": {"items": 12, "operations": ["complex_sort", "multi_criteria"]}}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();


INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG05',
    'TEXT_RECOG',
    'Text Recognition',
    '1.0',
    'Motor de reconocimiento de textos, letras y palabras con análisis fonético',
    ARRAY['LEN', 'ING_PROP'],
    ARRAY['1B', '2B', '3B'],
    ARRAY['Recordar', 'Comprender'],
    ARRAY['procesamiento_visual', 'comprension_verbal', 'memoria_trabajo'],
    '{"core_actions": ["identify", "select", "match", "trace", "pronounce"], "visual_elements": ["letter_cards", "word_bubbles", "text_highlight"], "interaction_types": ["click", "touch", "voice_input", "trace"], "feedback_system": "multi_modal_confirmation"}'::jsonb,
    '{"font_scaling": [12, 16, 20, 24], "color_themes": ["high_contrast", "pastel", "dark_mode"], "animation_types": ["fade", "bounce", "pulse"], "voice_recognition": true, "accessibility": {"dyslexia_friendly": true, "font_options": ["OpenDyslexic", "Arial", "Comic Sans"], "letter_spacing": "adjustable", "line_height": "adjustable"}}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE01OA03', 'LE02OA03', 'LE03OA03'],
    '{"easy": {"type": "single_letters", "count": 5}, "medium": {"type": "simple_words", "count": 8}, "hard": {"type": "complex_words", "count": 12}}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();


INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG06',
    'LETTER_SOUND',
    'Letter-Sound Matching',
    '1.0',
    'Motor de asociación letra-sonido con síntesis de voz y análisis fonológico',
    ARRAY['LEN', 'ING_PROP'],
    ARRAY['1B', '2B'],
    ARRAY['Recordar', 'Comprender', 'Aplicar'],
    ARRAY['procesamiento_auditivo', 'memoria_trabajo', 'atencion_selectiva'],
    '{"core_actions": ["listen", "match", "repeat", "identify", "synthesize"], "visual_elements": ["phoneme_symbols", "mouth_animations", "sound_waves"], "interaction_types": ["audio_play", "voice_record", "click_match"], "feedback_system": "audio_visual_phonetic"}'::jsonb,
    '{"tts_engine": "advanced_phonetic", "voice_profiles": ["child_friendly", "clear_pronunciation"], "audio_quality": "high_fidelity", "recording_capability": true, "accessibility": {"hearing_impaired": true, "visual_phonics": true, "vibration_feedback": true, "captions": true}}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04', 'EN01OA03', 'EN01OA04'],
    '{"easy": {"phonemes": "vowels", "count": 5}, "medium": {"phonemes": "consonants", "count": 10}, "hard": {"phonemes": "complex_combinations", "count": 15}}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();


INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG07',
    'READING_FLUENCY',
    'Reading Fluency',
    '1.0',
    'Motor de desarrollo de fluidez lectora con seguimiento de velocidad y comprensión',
    ARRAY['LEN'],
    ARRAY['2B', '3B', '4B'],
    ARRAY['Comprender', 'Aplicar'],
    ARRAY['comprension_verbal', 'atencion_selectiva', 'memoria_trabajo'],
    '{"core_actions": ["read_aloud", "track_speed", "comprehension_check", "repeat"], "visual_elements": ["text_highlighting", "progress_meter", "speed_indicator"], "interaction_types": ["voice_recording", "pace_control", "comprehension_quiz"], "feedback_system": "real_time_analytics"}'::jsonb,
    '{"speech_recognition": true, "wpm_tracking": true, "comprehension_metrics": true, "difficulty_adjustment": "adaptive", "accessibility": {"reading_disabilities": true, "font_customization": true, "reading_ruler": true, "pace_adjustment": true}}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE03OA05', 'LE04OA01', 'LE04OA05'],
    '{"easy": {"text_length": "short_sentences", "wpm_target": 30}, "medium": {"text_length": "paragraphs", "wpm_target": 60}, "hard": {"text_length": "full_stories", "wpm_target": 90}}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();


INSERT INTO game_engine (
    engine_id, code, name, version, description,
    subject_affinity, recommended_grades, bloom_levels, cognitive_skills,
    game_mechanics, technical_config, learning_objectives, difficulty_scaling,
    status
) VALUES (
    'ENG09',
    'LIFE_CYCLE',
    'Life Cycle Simulator',
    '1.0',
    'Motor de simulación de ciclos de vida con interacciones ecológicas',
    ARRAY['CN'],
    ARRAY['1B', '2B', '3B', '4B'],
    ARRAY['Comprender', 'Aplicar', 'Analizar'],
    ARRAY['razonamiento_logico', 'procesamiento_visual', 'memoria_trabajo'],
    '{"core_actions": ["observe", "sequence", "predict", "interact", "experiment"], "visual_elements": ["3d_models", "time_progression", "environment_simulation"], "interaction_types": ["timeline_control", "environment_modification", "observation"], "feedback_system": "scientific_discovery"}'::jsonb,
    '{"simulation_speed": "variable", "visual_fidelity": "educational_realistic", "interaction_complexity": "age_appropriate", "data_collection": true, "accessibility": {"motion_sensitivity": true, "simplified_controls": true, "audio_descriptions": true, "static_alternatives": true}}'::jsonb,
    ARRAY['CN01OA01', 'CN01OA02', 'CN02OA01', 'CN03OA01', 'CN04OA01'],
    '{"easy": {"organisms": "simple_plants", "stages": 3}, "medium": {"organisms": "animals", "stages": 4}, "hard": {"organisms": "complex_ecosystems", "stages": 6}}'::jsonb,
    'ready_for_development'
)
ON CONFLICT (engine_id) DO UPDATE SET
    description = EXCLUDED.description,
    game_mechanics = EXCLUDED.game_mechanics,
    technical_config = EXCLUDED.technical_config,
    learning_objectives = EXCLUDED.learning_objectives,
    difficulty_scaling = EXCLUDED.difficulty_scaling,
    updated_at = now();


-- Verificaciones y estadísticas
SELECT 
    '🎮 ENGINES CREADOS' as status,
    COUNT(*) as total_engines
FROM game_engine 
WHERE status = 'ready_for_development';

SELECT 
    'Distribución por asignatura' as metric,
    unnest(subject_affinity) as subject,
    COUNT(*) as engine_count
FROM game_engine 
WHERE status = 'ready_for_development'
GROUP BY unnest(subject_affinity)
ORDER BY engine_count DESC;

SELECT 
    'Cobertura por grado' as metric,
    unnest(recommended_grades) as grade,
    COUNT(*) as engine_count
FROM game_engine 
WHERE status = 'ready_for_development'
GROUP BY unnest(recommended_grades)
ORDER BY grade;

-- Crear tabla de relación engine-OA para mapeo
CREATE TABLE IF NOT EXISTS engine_learning_objective (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    engine_id varchar(10) REFERENCES game_engine(engine_id),
    oa_code varchar(20),
    compatibility_score decimal(3,2) DEFAULT 0.90,
    recommended_difficulty varchar(20) DEFAULT 'medium',
    estimated_playtime_minutes integer DEFAULT 15,
    created_at timestamp DEFAULT now()
);

-- Poblar relaciones engine-OA
INSERT INTO engine_learning_objective (engine_id, oa_code, compatibility_score, recommended_difficulty)
SELECT 
    e.engine_id,
    unnest(e.learning_objectives) as oa_code,
    0.95,
    'medium'
FROM game_engine e
WHERE e.status = 'ready_for_development'
ON CONFLICT DO NOTHING;

-- Resumen final
SELECT 
    '🚀 ENGINES IMPLEMENTADOS' as status,
    COUNT(DISTINCT e.engine_id) as engines,
    COUNT(DISTINCT elo.oa_code) as oa_cubiertos,
    COUNT(*) as total_relaciones
FROM game_engine e
LEFT JOIN engine_learning_objective elo ON e.engine_id = elo.engine_id
WHERE e.status = 'ready_for_development';
