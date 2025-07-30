-- ===============================================
-- CATÁLOGO: 90 SKINS COMPLETOS MAT + LEN
-- Fecha: 2025-07-08 12:26:58
-- Total: 45 MAT + 45 LEN = 90 skins
-- ===============================================

-- Crear tabla de skins si no existe
CREATE TABLE IF NOT EXISTS game_skin (
    skin_id varchar(20) PRIMARY KEY,
    engine_id varchar(10) REFERENCES game_engine(engine_id),
    engine_code varchar(50) NOT NULL,
    name varchar(150) NOT NULL,
    description text,
    theme varchar(50) NOT NULL,
    subject varchar(10) NOT NULL,
    recommended_grades text[], -- Array de grados
    bloom_level varchar(20) NOT NULL,
    difficulty varchar(20) DEFAULT 'medium',
    visual_config jsonb, -- Configuración visual
    gameplay_config jsonb, -- Configuración de juego
    learning_objectives text[], -- Array de códigos OA
    appeal_rating varchar(20) DEFAULT 'medium',
    estimated_dev_time varchar(20) DEFAULT '3 days',
    assets_needed jsonb, -- Assets requeridos
    status varchar(20) DEFAULT 'design',
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now(),
    version varchar(10) DEFAULT '1.0'
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_game_skin_engine ON game_skin(engine_id);
CREATE INDEX IF NOT EXISTS idx_game_skin_subject ON game_skin(subject);
CREATE INDEX IF NOT EXISTS idx_game_skin_theme ON game_skin(theme);
CREATE INDEX IF NOT EXISTS idx_game_skin_difficulty ON game_skin(difficulty);
CREATE INDEX IF NOT EXISTS idx_game_skin_grades ON game_skin USING GIN (recommended_grades);
CREATE INDEX IF NOT EXISTS idx_game_skin_appeal ON game_skin(appeal_rating);

-- Insertar 90 skins completos


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_001',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Easy 1',
    'Conteo con perros del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "perros", "ui_complexity": "simple"}'::jsonb,
    '{"max_count": 10, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_002',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Easy 2',
    'Conteo con gatos del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "pattern", "animation_style": "bounce", "element_style": "gatos", "ui_complexity": "simple"}'::jsonb,
    '{"max_count": 10, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_003',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Easy 3',
    'Conteo con pájaros del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "pájaros", "ui_complexity": "simple"}'::jsonb,
    '{"max_count": 10, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_004',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Easy 4',
    'Conteo con peces del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "pattern", "animation_style": "bounce", "element_style": "peces", "ui_complexity": "simple"}'::jsonb,
    '{"max_count": 10, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_005',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Easy 5',
    'Conteo con insectos del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "insectos", "ui_complexity": "simple"}'::jsonb,
    '{"max_count": 10, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_006',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Medium 1',
    'Conteo con perros del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "perros", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 50, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_007',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Medium 2',
    'Conteo con gatos del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "pattern", "animation_style": "bounce", "element_style": "gatos", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 50, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_008',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Medium 3',
    'Conteo con pájaros del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "pájaros", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 50, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_009',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Medium 4',
    'Conteo con peces del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "pattern", "animation_style": "bounce", "element_style": "peces", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 50, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_010',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Medium 5',
    'Conteo con insectos del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "insectos", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 50, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_011',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Hard 1',
    'Conteo con perros del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "perros", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 100, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": false}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_012',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Hard 2',
    'Conteo con gatos del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "pattern", "animation_style": "bounce", "element_style": "gatos", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 100, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": false}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_013',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Hard 3',
    'Conteo con pájaros del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "pájaros", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 100, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": false}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_014',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Hard 4',
    'Conteo con peces del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "pattern", "animation_style": "bounce", "element_style": "peces", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 100, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": false}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_015',
    'ENG01',
    'COUNTER',
    'Reino Animal - Contador Hard 5',
    'Conteo con insectos del reino animal',
    'animales',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B6B", "secondary_color": "#4ECDC4", "accent_color": "#45B7D1", "background_style": "gradient", "animation_style": "bounce", "element_style": "insectos", "ui_complexity": "detailed"}'::jsonb,
    '{"max_count": 100, "counting_style": "visual_objects", "feedback_type": "immediate_positive", "sound_effects": true, "voice_narration": true, "hint_system": false}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA02', 'MA02OA01'],
    'high',
    '3 days',
    '{"sprites": 15, "sounds": 8, "animations": 6, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_016',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Easy 1',
    'Arrastrar y soltar pelotas ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "pelotas", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 4, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_017',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Easy 2',
    'Arrastrar y soltar uniformes ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "uniformes", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 4, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_018',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Easy 3',
    'Arrastrar y soltar medallas ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "medallas", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 4, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_019',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Easy 4',
    'Arrastrar y soltar campos ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "campos", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 4, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_020',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Easy 5',
    'Arrastrar y soltar equipos ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "equipos", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 4, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_021',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Medium 1',
    'Arrastrar y soltar pelotas ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "pelotas", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 8, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_022',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Medium 2',
    'Arrastrar y soltar uniformes ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "uniformes", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 8, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_023',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Medium 3',
    'Arrastrar y soltar medallas ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "medallas", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 8, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_024',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Medium 4',
    'Arrastrar y soltar campos ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "campos", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 8, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_025',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Medium 5',
    'Arrastrar y soltar equipos ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "equipos", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 8, "drag_sensitivity": "child_friendly", "snap_assistance": true, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_026',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Hard 1',
    'Arrastrar y soltar pelotas ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "pelotas", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 12, "drag_sensitivity": "child_friendly", "snap_assistance": false, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_027',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Hard 2',
    'Arrastrar y soltar uniformes ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "uniformes", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 12, "drag_sensitivity": "child_friendly", "snap_assistance": false, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_028',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Hard 3',
    'Arrastrar y soltar medallas ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "medallas", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 12, "drag_sensitivity": "child_friendly", "snap_assistance": false, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_029',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Hard 4',
    'Arrastrar y soltar campos ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "campos", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 12, "drag_sensitivity": "child_friendly", "snap_assistance": false, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_030',
    'ENG02',
    'DRAG_DROP_NUM',
    'Mundo Deportivo - Arrastrar Hard 5',
    'Arrastrar y soltar equipos ordenadamente',
    'deportes',
    'MAT',
    ARRAY['1B', '2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#FF9500", "secondary_color": "#00B894", "accent_color": "#0984E3", "background_style": "illustrated", "animation_style": "smooth_drag", "element_style": "equipos", "drop_zone_style": "highlighted_areas"}'::jsonb,
    '{"max_items": 12, "drag_sensitivity": "child_friendly", "snap_assistance": false, "operation_types": ["sort", "group", "match"], "feedback_type": "visual_audio_combined", "celebration_animation": true}'::jsonb,
    ARRAY['MA01OA04', 'MA01OA09', 'MA02OA04'],
    'medium',
    '4 days',
    '{"sprites": 20, "sounds": 10, "animations": 8, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_031',
    'ENG01',
    'COUNTER',
    'Chef en Acción - Especial 1',
    'Skin especial de chef en acción con elementos únicos',
    'cocina',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#E17055", "secondary_color": "#FDCB6E", "accent_color": "#00B894", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "frutas", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_032',
    'ENG02',
    'DRAG_DROP_NUM',
    'Aventura Pirata - Especial 2',
    'Skin especial de aventura pirata con elementos únicos',
    'piratas',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#8B4513", "secondary_color": "#FFD700", "accent_color": "#000080", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "tesoros", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_033',
    'ENG01',
    'COUNTER',
    'Gran Circo - Especial 3',
    'Skin especial de gran circo con elementos únicos',
    'circo',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#FF0000", "secondary_color": "#FFD700", "accent_color": "#FF1493", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "trapecistas", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_034',
    'ENG02',
    'DRAG_DROP_NUM',
    'Chef en Acción - Especial 4',
    'Skin especial de chef en acción con elementos únicos',
    'cocina',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#E17055", "secondary_color": "#FDCB6E", "accent_color": "#00B894", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "utensilios", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_035',
    'ENG01',
    'COUNTER',
    'Aventura Pirata - Especial 5',
    'Skin especial de aventura pirata con elementos únicos',
    'piratas',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#8B4513", "secondary_color": "#FFD700", "accent_color": "#000080", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "islas", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_036',
    'ENG02',
    'DRAG_DROP_NUM',
    'Gran Circo - Especial 6',
    'Skin especial de gran circo con elementos únicos',
    'circo',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#FF0000", "secondary_color": "#FFD700", "accent_color": "#FF1493", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "payasos", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_037',
    'ENG01',
    'COUNTER',
    'Chef en Acción - Especial 7',
    'Skin especial de chef en acción con elementos únicos',
    'cocina',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#E17055", "secondary_color": "#FDCB6E", "accent_color": "#00B894", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "verduras", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_038',
    'ENG02',
    'DRAG_DROP_NUM',
    'Aventura Pirata - Especial 8',
    'Skin especial de aventura pirata con elementos únicos',
    'piratas',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#8B4513", "secondary_color": "#FFD700", "accent_color": "#000080", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "mapas", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_039',
    'ENG01',
    'COUNTER',
    'Gran Circo - Especial 9',
    'Skin especial de gran circo con elementos únicos',
    'circo',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#FF0000", "secondary_color": "#FFD700", "accent_color": "#FF1493", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "malabares", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_040',
    'ENG02',
    'DRAG_DROP_NUM',
    'Chef en Acción - Especial 10',
    'Skin especial de chef en acción con elementos únicos',
    'cocina',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#E17055", "secondary_color": "#FDCB6E", "accent_color": "#00B894", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "recetas", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_041',
    'ENG01',
    'COUNTER',
    'Aventura Pirata - Especial 11',
    'Skin especial de aventura pirata con elementos únicos',
    'piratas',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#8B4513", "secondary_color": "#FFD700", "accent_color": "#000080", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "barcos", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_042',
    'ENG02',
    'DRAG_DROP_NUM',
    'Gran Circo - Especial 12',
    'Skin especial de gran circo con elementos únicos',
    'circo',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#FF0000", "secondary_color": "#FFD700", "accent_color": "#FF1493", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "leones", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_043',
    'ENG01',
    'COUNTER',
    'Chef en Acción - Especial 13',
    'Skin especial de chef en acción con elementos únicos',
    'cocina',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#E17055", "secondary_color": "#FDCB6E", "accent_color": "#00B894", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "pasteles", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_044',
    'ENG02',
    'DRAG_DROP_NUM',
    'Aventura Pirata - Especial 14',
    'Skin especial de aventura pirata con elementos únicos',
    'piratas',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#8B4513", "secondary_color": "#FFD700", "accent_color": "#000080", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "loros", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_MAT_045',
    'ENG01',
    'COUNTER',
    'Gran Circo - Especial 15',
    'Skin especial de gran circo con elementos únicos',
    'circo',
    'MAT',
    ARRAY['1B', '2B', '3B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#FF0000", "secondary_color": "#FFD700", "accent_color": "#FF1493", "background_style": "immersive", "animation_style": "theme_specific", "element_style": "carpa", "special_effects": true}'::jsonb,
    '{"hybrid_mechanics": true, "difficulty_adaptive": true, "reward_system": "advanced", "social_features": true, "progression_tracking": true}'::jsonb,
    ARRAY['MA01OA01', 'MA01OA04', 'MA02OA01'],
    'high',
    '5 days',
    '{"sprites": 25, "sounds": 12, "animations": 10, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_001',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Easy 1',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "princesas", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "letters", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_002',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Easy 2',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "dragones", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "letters", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_003',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Easy 3',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "castillos", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "letters", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_004',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Easy 4',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "bosques", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "letters", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_005',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Easy 5',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Recordar',
    'easy',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "hadas", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "letters", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_006',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Medium 1',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "princesas", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "words", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_007',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Medium 2',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "dragones", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "words", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_008',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Medium 3',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "castillos", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "words", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_009',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Medium 4',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "bosques", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "words", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_010',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Medium 5',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'medium',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "hadas", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "words", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_011',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Hard 1',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "princesas", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "sentences", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_012',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Hard 2',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "dragones", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "sentences", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_013',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Hard 3',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "castillos", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "sentences", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_014',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Hard 4',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "bosques", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "sentences", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_015',
    'ENG05',
    'TEXT_RECOG',
    'Mundo de Cuentos - Reconocer Hard 5',
    'Reconocimiento de letras y palabras en el mundo de cuentos',
    'cuentos',
    'LEN',
    ARRAY['1B', '2B', '3B'],
    'Comprender',
    'hard',
    '{"primary_color": "#FF6B9D", "secondary_color": "#C44569", "accent_color": "#F8B500", "background_style": "storybook", "animation_style": "gentle_fade", "element_style": "hadas", "typography": "child_friendly", "font_scaling": true}'::jsonb,
    '{"text_complexity": "sentences", "recognition_type": "visual_matching", "hint_system": "progressive", "audio_support": true, "dyslexia_friendly": true, "feedback_type": "encouraging"}'::jsonb,
    ARRAY['LE01OA01', 'LE01OA02', 'LE02OA03'],
    'high',
    '4 days',
    '{"sprites": 18, "sounds": 15, "animations": 8, "fonts": 3, "backgrounds": 3}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_016',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Easy 1',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'easy',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "notas", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "vowels", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_017',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Easy 2',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'easy',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "instrumentos", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "vowels", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_018',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Easy 3',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'easy',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "partituras", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "vowels", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_019',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Easy 4',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'easy',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "micrófonos", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "vowels", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_020',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Easy 5',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'easy',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "escenarios", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "vowels", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_021',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Medium 1',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'medium',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "notas", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "consonants", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_022',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Medium 2',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'medium',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "instrumentos", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "consonants", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_023',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Medium 3',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'medium',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "partituras", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "consonants", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_024',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Medium 4',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'medium',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "micrófonos", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "consonants", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_025',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Medium 5',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Recordar',
    'medium',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "escenarios", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "consonants", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_026',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Hard 1',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Comprender',
    'hard',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "notas", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "combinations", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_027',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Hard 2',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Comprender',
    'hard',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "instrumentos", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "combinations", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_028',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Hard 3',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Comprender',
    'hard',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "partituras", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "combinations", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_029',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Hard 4',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Comprender',
    'hard',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "micrófonos", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "combinations", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_030',
    'ENG06',
    'LETTER_SOUND',
    'Letras Musicales - Sonidos Hard 5',
    'Asociación letra-sonido en el contexto de letras musicales',
    'musicales',
    'LEN',
    ARRAY['1B', '2B'],
    'Comprender',
    'hard',
    '{"primary_color": "#9370DB", "secondary_color": "#FF69B4", "accent_color": "#FFD700", "background_style": "interactive", "animation_style": "sound_waves", "element_style": "escenarios", "phonetic_visualization": true}'::jsonb,
    '{"phoneme_complexity": "combinations", "audio_quality": "crystal_clear", "voice_variety": true, "recording_capability": true, "pronunciation_feedback": "real_time", "hearing_impaired_support": true}'::jsonb,
    ARRAY['LE01OA03', 'LE01OA04', 'LE02OA04'],
    'high',
    '5 days',
    '{"sprites": 20, "sounds": 25, "animations": 12, "voice_clips": 50, "backgrounds": 2}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_031',
    'ENG07',
    'READING_FLUENCY',
    'Cocina de Palabras - Fluidez Easy 1',
    'Desarrollo de fluidez lectora en el ambiente de cocina de palabras',
    'cocina_letras',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF4500", "secondary_color": "#FFFF00", "accent_color": "#32CD32", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "recetas", "reading_aids": true}'::jsonb,
    '{"text_length": "sentences", "wpm_target": 30, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_032',
    'ENG07',
    'READING_FLUENCY',
    'Laboratorio Lingüístico - Fluidez Medium 1',
    'Desarrollo de fluidez lectora en el ambiente de laboratorio lingüístico',
    'laboratorio',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#4169E1", "secondary_color": "#32CD32", "accent_color": "#FF6347", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "fórmulas", "reading_aids": true}'::jsonb,
    '{"text_length": "paragraphs", "wpm_target": 60, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_033',
    'ENG07',
    'READING_FLUENCY',
    'Gran Teatro - Fluidez Hard 1',
    'Desarrollo de fluidez lectora en el ambiente de gran teatro',
    'teatro',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#8B0000", "secondary_color": "#FFD700", "accent_color": "#4B0082", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "máscaras", "reading_aids": true}'::jsonb,
    '{"text_length": "stories", "wpm_target": 90, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'high',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_034',
    'ENG07',
    'READING_FLUENCY',
    'Cocina de Palabras - Fluidez Easy 2',
    'Desarrollo de fluidez lectora en el ambiente de cocina de palabras',
    'cocina_letras',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF4500", "secondary_color": "#FFFF00", "accent_color": "#32CD32", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "cucharas", "reading_aids": true}'::jsonb,
    '{"text_length": "sentences", "wpm_target": 30, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_035',
    'ENG07',
    'READING_FLUENCY',
    'Laboratorio Lingüístico - Fluidez Medium 2',
    'Desarrollo de fluidez lectora en el ambiente de laboratorio lingüístico',
    'laboratorio',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#4169E1", "secondary_color": "#32CD32", "accent_color": "#FF6347", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "cristales", "reading_aids": true}'::jsonb,
    '{"text_length": "paragraphs", "wpm_target": 60, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_036',
    'ENG07',
    'READING_FLUENCY',
    'Gran Teatro - Fluidez Hard 2',
    'Desarrollo de fluidez lectora en el ambiente de gran teatro',
    'teatro',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#8B0000", "secondary_color": "#FFD700", "accent_color": "#4B0082", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "escenarios", "reading_aids": true}'::jsonb,
    '{"text_length": "stories", "wpm_target": 90, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'high',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_037',
    'ENG07',
    'READING_FLUENCY',
    'Cocina de Palabras - Fluidez Easy 3',
    'Desarrollo de fluidez lectora en el ambiente de cocina de palabras',
    'cocina_letras',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF4500", "secondary_color": "#FFFF00", "accent_color": "#32CD32", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "ingredientes", "reading_aids": true}'::jsonb,
    '{"text_length": "sentences", "wpm_target": 30, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_038',
    'ENG07',
    'READING_FLUENCY',
    'Laboratorio Lingüístico - Fluidez Medium 3',
    'Desarrollo de fluidez lectora en el ambiente de laboratorio lingüístico',
    'laboratorio',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#4169E1", "secondary_color": "#32CD32", "accent_color": "#FF6347", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "microscopios", "reading_aids": true}'::jsonb,
    '{"text_length": "paragraphs", "wpm_target": 60, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_039',
    'ENG07',
    'READING_FLUENCY',
    'Gran Teatro - Fluidez Hard 3',
    'Desarrollo de fluidez lectora en el ambiente de gran teatro',
    'teatro',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#8B0000", "secondary_color": "#FFD700", "accent_color": "#4B0082", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "vestuarios", "reading_aids": true}'::jsonb,
    '{"text_length": "stories", "wpm_target": 90, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'high',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_040',
    'ENG07',
    'READING_FLUENCY',
    'Cocina de Palabras - Fluidez Easy 4',
    'Desarrollo de fluidez lectora en el ambiente de cocina de palabras',
    'cocina_letras',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF4500", "secondary_color": "#FFFF00", "accent_color": "#32CD32", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "hornos", "reading_aids": true}'::jsonb,
    '{"text_length": "sentences", "wpm_target": 30, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_041',
    'ENG07',
    'READING_FLUENCY',
    'Laboratorio Lingüístico - Fluidez Medium 4',
    'Desarrollo de fluidez lectora en el ambiente de laboratorio lingüístico',
    'laboratorio',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#4169E1", "secondary_color": "#32CD32", "accent_color": "#FF6347", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "tubos", "reading_aids": true}'::jsonb,
    '{"text_length": "paragraphs", "wpm_target": 60, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_042',
    'ENG07',
    'READING_FLUENCY',
    'Gran Teatro - Fluidez Hard 4',
    'Desarrollo de fluidez lectora en el ambiente de gran teatro',
    'teatro',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#8B0000", "secondary_color": "#FFD700", "accent_color": "#4B0082", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "telones", "reading_aids": true}'::jsonb,
    '{"text_length": "stories", "wpm_target": 90, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'high',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_043',
    'ENG07',
    'READING_FLUENCY',
    'Cocina de Palabras - Fluidez Easy 5',
    'Desarrollo de fluidez lectora en el ambiente de cocina de palabras',
    'cocina_letras',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Comprender',
    'easy',
    '{"primary_color": "#FF4500", "secondary_color": "#FFFF00", "accent_color": "#32CD32", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "ollas", "reading_aids": true}'::jsonb,
    '{"text_length": "sentences", "wpm_target": 30, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_044',
    'ENG07',
    'READING_FLUENCY',
    'Laboratorio Lingüístico - Fluidez Medium 5',
    'Desarrollo de fluidez lectora en el ambiente de laboratorio lingüístico',
    'laboratorio',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'medium',
    '{"primary_color": "#4169E1", "secondary_color": "#32CD32", "accent_color": "#FF6347", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "experimentos", "reading_aids": true}'::jsonb,
    '{"text_length": "paragraphs", "wpm_target": 60, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'medium',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


INSERT INTO game_skin (
    skin_id, engine_id, engine_code, name, description, theme, subject,
    recommended_grades, bloom_level, difficulty, visual_config, gameplay_config,
    learning_objectives, appeal_rating, estimated_dev_time, assets_needed, status
) VALUES (
    'SKIN_LEN_045',
    'ENG07',
    'READING_FLUENCY',
    'Gran Teatro - Fluidez Hard 5',
    'Desarrollo de fluidez lectora en el ambiente de gran teatro',
    'teatro',
    'LEN',
    ARRAY['2B', '3B', '4B'],
    'Aplicar',
    'hard',
    '{"primary_color": "#8B0000", "secondary_color": "#FFD700", "accent_color": "#4B0082", "background_style": "immersive_environment", "animation_style": "text_highlighting", "element_style": "luces", "reading_aids": true}'::jsonb,
    '{"text_length": "stories", "wpm_target": 90, "comprehension_checks": true, "adaptive_difficulty": true, "progress_visualization": "detailed", "social_reading": true}'::jsonb,
    ARRAY['LE02OA05', 'LE03OA01', 'LE04OA01'],
    'high',
    '6 days',
    '{"sprites": 22, "sounds": 18, "animations": 15, "text_content": 100, "backgrounds": 4}'::jsonb,
    'ready_for_design'
)
ON CONFLICT (skin_id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    visual_config = EXCLUDED.visual_config,
    gameplay_config = EXCLUDED.gameplay_config,
    updated_at = now();


-- Estadísticas y verificaciones
SELECT 
    '🎨 SKINS CREADOS' as status,
    COUNT(*) as total_skins
FROM game_skin 
WHERE status = 'ready_for_design';

SELECT 
    'Distribución por asignatura' as metric,
    subject,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY subject
ORDER BY skin_count DESC;

SELECT 
    'Distribución por engine' as metric,
    engine_code,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY engine_code
ORDER BY skin_count DESC;

SELECT 
    'Distribución por temática' as metric,
    theme,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY theme
ORDER BY skin_count DESC;

SELECT 
    'Distribución por dificultad' as metric,
    difficulty,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'easy' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'hard' THEN 3
    END;

SELECT 
    'Distribución por appeal' as metric,
    appeal_rating,
    COUNT(*) as skin_count
FROM game_skin 
WHERE status = 'ready_for_design'
GROUP BY appeal_rating
ORDER BY 
    CASE appeal_rating 
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
    END;

-- Estimación de desarrollo
SELECT 
    'Tiempo total estimado' as metric,
    SUM(
        CASE estimated_dev_time
            WHEN '3 days' THEN 3
            WHEN '4 days' THEN 4
            WHEN '5 days' THEN 5
            WHEN '6 days' THEN 6
            ELSE 4
        END
    ) as total_days,
    ROUND(
        SUM(
            CASE estimated_dev_time
                WHEN '3 days' THEN 3
                WHEN '4 days' THEN 4
                WHEN '5 days' THEN 5
                WHEN '6 days' THEN 6
                ELSE 4
            END
        ) / 22.0, 1
    ) as total_months_1_designer,
    ROUND(
        SUM(
            CASE estimated_dev_time
                WHEN '3 days' THEN 3
                WHEN '4 days' THEN 4
                WHEN '5 days' THEN 5
                WHEN '6 days' THEN 6
                ELSE 4
            END
        ) / 66.0, 1
    ) as total_months_3_designers
FROM game_skin 
WHERE status = 'ready_for_design';

-- Assets totales requeridos
SELECT 
    'Assets totales' as metric,
    SUM((assets_needed->>'sprites')::int) as total_sprites,
    SUM((assets_needed->>'sounds')::int) as total_sounds,
    SUM((assets_needed->>'animations')::int) as total_animations,
    COALESCE(SUM((assets_needed->>'backgrounds')::int), 0) as total_backgrounds
FROM game_skin 
WHERE status = 'ready_for_design';

-- Resumen ejecutivo final
SELECT 
    '🎯 CATÁLOGO COMPLETO' as status,
    COUNT(*) as total_skins,
    COUNT(DISTINCT engine_id) as engines_covered,
    COUNT(DISTINCT theme) as themes_available,
    COUNT(DISTINCT subject) as subjects_covered
FROM game_skin 
WHERE status = 'ready_for_design';
