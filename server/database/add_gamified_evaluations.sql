-- ===============================================
-- AGREGAR SOPORTE PARA EVALUACIONES GAMIFICADAS
-- Modificaciones al sistema existente - Día 1
-- ===============================================

-- 1. Modificar tipo de evaluación para incluir 'gamified'
ALTER TABLE evaluations 
DROP CONSTRAINT IF EXISTS evaluations_type_check;

ALTER TABLE evaluations 
ADD CONSTRAINT evaluations_type_check 
CHECK (type IN ('quiz', 'exam', 'task', 'gamified'));

-- 2. Agregar campos específicos para evaluaciones gamificadas
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS game_format VARCHAR(50),
ADD COLUMN IF NOT EXISTS engine_id VARCHAR(10),
ADD COLUMN IF NOT EXISTS skin_theme VARCHAR(50),
ADD COLUMN IF NOT EXISTS engine_config JSONB DEFAULT '{}';

-- 3. Agregar índices para optimizar consultas de juegos
CREATE INDEX IF NOT EXISTS idx_evaluations_game_format ON evaluations(game_format);
CREATE INDEX IF NOT EXISTS idx_evaluations_engine_id ON evaluations(engine_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_type_gamified ON evaluations(type) WHERE type = 'gamified';

-- 4. Comentarios para documentación
COMMENT ON COLUMN evaluations.game_format IS 'Formato de juego: trivia_lightning, memory_flip, drag_drop_sorting, etc. (24 formatos disponibles)';
COMMENT ON COLUMN evaluations.engine_id IS 'Engine educativo: ENG01, ENG02, ENG05, etc. que procesará el contenido';
COMMENT ON COLUMN evaluations.skin_theme IS 'Tema visual: granja, espacio, oceano, etc. para contextualización';
COMMENT ON COLUMN evaluations.engine_config IS 'Configuración específica del engine en formato JSON';

-- 5. Validaciones adicionales para consistency
ALTER TABLE evaluations 
ADD CONSTRAINT check_gamified_has_format 
CHECK (
  (type != 'gamified') OR 
  (type = 'gamified' AND game_format IS NOT NULL AND engine_id IS NOT NULL)
);

-- 6. Datos de referencia: Formatos de juego válidos (para futuras validaciones)
CREATE TABLE IF NOT EXISTS game_formats (
    format_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    recommended_cycles TEXT[],
    compatible_engines VARCHAR(10)[],
    max_players INTEGER DEFAULT 30,
    estimated_duration_minutes INTEGER,
    category VARCHAR(20) CHECK (category IN ('basic', 'advanced', 'expert')),
    accessibility_features TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Insertar los 24 formatos de juego básicos
INSERT INTO game_formats (format_id, name, description, difficulty_level, recommended_cycles, compatible_engines, category, estimated_duration_minutes) VALUES
-- Basic Games (G-01 to G-09)
('trivia_lightning', 'Trivia Lightning', 'Preguntas rápidas MCQ con puntuación por tiempo', 'easy', ARRAY['PreK','1B','2B','3B','4B'], ARRAY['ENG01','ENG02','ENG05'], 'basic', 15),
('color_match', 'Color Match', 'Seleccionar color/figura que coincide con pregunta', 'easy', ARRAY['PreK','1B'], ARRAY['ENG01','ENG05'], 'basic', 10),
('memory_flip', 'Memory Flip', 'Parear cartas pregunta-respuesta', 'medium', ARRAY['1B','2B','3B'], ARRAY['ENG02','ENG05','ENG06'], 'basic', 12),
('picture_bingo', 'Picture Bingo', 'Cartón 3x3 con imágenes, teacher canta preguntas', 'medium', ARRAY['1B','2B','3B','4B'], ARRAY['ENG01','ENG05'], 'basic', 20),
('drag_drop_sorting', 'Drag & Drop Sorting', 'Arrastrar fichas al contenedor correcto', 'medium', ARRAY['2B','3B','4B','5B'], ARRAY['ENG02','ENG09'], 'basic', 15),
('number_line_race', 'Number Line Race', 'Resolver operación y avanzar en línea numérica', 'medium', ARRAY['2B','3B','4B','5B'], ARRAY['ENG01','ENG02'], 'basic', 18),
('word_builder', 'Word Builder', 'Arrastrar letras para formar palabra', 'medium', ARRAY['1B','2B','3B'], ARRAY['ENG05','ENG06'], 'basic', 12),
('word_search', 'Word Search', 'Encontrar palabras escondidas en sopa de letras', 'medium', ARRAY['3B','4B','5B','6B'], ARRAY['ENG05','ENG07'], 'basic', 15),
('hangman_visual', 'Hangman Visual', 'Adivinar palabra con pistas visuales', 'medium', ARRAY['2B','3B','4B','5B','6B'], ARRAY['ENG05','ENG06'], 'basic', 10),

-- Advanced Games (G-10 to G-16)  
('escape_room_mini', 'Escape Room Mini', 'Resolver 3 acertijos secuenciales', 'hard', ARRAY['3B','4B','5B','6B'], ARRAY['ENG02','ENG05','ENG09'], 'advanced', 25),
('story_path', 'Story Path', 'Narrativa ramificada con decisiones múltiples', 'hard', ARRAY['3B','4B','5B','6B','7B','8B'], ARRAY['ENG05','ENG07'], 'advanced', 30),
('board_race', 'Board Race', 'Tirar dado virtual y avanzar respondiendo', 'medium', ARRAY['2B','3B','4B','5B','6B'], ARRAY['ENG01','ENG02','ENG05'], 'basic', 22),
('crossword', 'Crossword', 'Rellenar crucigrama con pistas', 'hard', ARRAY['4B','5B','6B','7B','8B'], ARRAY['ENG05','ENG07'], 'advanced', 25),
('word_search_duel', 'Word Search Duel', 'Competencia de sopas de letras', 'hard', ARRAY['4B','5B','6B','7B','8B'], ARRAY['ENG05','ENG07'], 'advanced', 20),
('timed_equation_duel', 'Timed Equation Duel', 'Duelo de ecuaciones matemáticas', 'hard', ARRAY['4B','5B','6B','7B','8B'], ARRAY['ENG01','ENG02'], 'advanced', 15),
('mystery_box_reveal', 'Mystery Box Reveal', 'Descubrir contenido con pistas progresivas', 'medium', ARRAY['3B','4B','5B','6B'], ARRAY['ENG05','ENG09'], 'advanced', 18);

-- 8. Datos de referencia: Engines educativos válidos
CREATE TABLE IF NOT EXISTS educational_engines (
    engine_id VARCHAR(10) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    subject_affinity TEXT[],
    recommended_grades TEXT[],
    mechanics TEXT[],
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'development', 'deprecated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Insertar los 6 engines básicos
INSERT INTO educational_engines (engine_id, code, name, description, subject_affinity, recommended_grades, mechanics) VALUES
('ENG01', 'COUNTER', 'Counter/Number Line', 'Sistema interactivo de conteo y líneas numéricas', ARRAY['MAT'], ARRAY['1B','2B','3B'], ARRAY['count','increment','position_on_line']),
('ENG02', 'DRAG_DROP_NUM', 'Drag-Drop Numbers', 'Engine de arrastrar y soltar para operaciones matemáticas', ARRAY['MAT'], ARRAY['1B','2B','3B','4B'], ARRAY['drag','drop','sort','group']),
('ENG05', 'TEXT_RECOG', 'Text Recognition', 'Reconocimiento de patrones de texto y lectura', ARRAY['LEN'], ARRAY['1B','2B','3B'], ARRAY['text_recognition','pattern_matching','letter_id']),
('ENG06', 'LETTER_SOUND', 'Letter-Sound Matching', 'Correspondencia letra-sonido y fonética', ARRAY['LEN'], ARRAY['1B','2B','3B'], ARRAY['phonetic_matching','audio_recognition','sound_synthesis']),
('ENG07', 'READING_FLUENCY', 'Reading Fluency', 'Análisis de fluidez lectora y comprensión', ARRAY['LEN'], ARRAY['1B','2B','3B'], ARRAY['reading_tracking','fluency_measurement','comprehension']),
('ENG09', 'LIFE_CYCLE', 'Life Cycle Simulation', 'Simulaciones de ciclos de vida y ecosistemas', ARRAY['CN'], ARRAY['1B','2B','3B','4B','5B','6B'], ARRAY['simulation','ecosystem','observation']);

-- 10. Datos de referencia: Skins temáticos válidos
CREATE TABLE IF NOT EXISTS skin_themes (
    theme_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    visual_elements TEXT[],
    color_palette VARCHAR(10)[],
    age_appropriate_grades TEXT[],
    cultural_context VARCHAR(50),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Insertar skins básicos  
INSERT INTO skin_themes (theme_id, name, description, visual_elements, color_palette, age_appropriate_grades, cultural_context) VALUES
('granja', 'Granja Chilena', 'Animales de granja y contexto rural chileno', ARRAY['🐄','🐷','🐔','🐑','🐰','🌾','🚜'], ARRAY['#FF6B35','#F7931E','#FFD700','#8B4513'], ARRAY['1B','2B','3B'], 'rural_chileno'),
('espacio', 'Exploración Espacial', 'Planetas, estrellas y aventuras espaciales', ARRAY['🚀','⭐','🪐','🌟','👨‍🚀','🛸'], ARRAY['#1E3A8A','#7C3AED','#EC4899','#F59E0B'], ARRAY['2B','3B','4B','5B'], 'universal'),
('oceano', 'Océano Pacífico', 'Vida marina del océano chileno', ARRAY['🐠','🐙','⚓','🌊','🐋','🦀'], ARRAY['#0EA5E9','#06B6D4','#10B981','#3B82F6'], ARRAY['1B','2B','3B','4B'], 'marino_chileno'),
('bosque', 'Bosque Nativo', 'Flora y fauna del bosque chileno', ARRAY['🌲','🦌','🐺','🍄','🌿','🦅'], ARRAY['#16A34A','#65A30D','#CA8A04','#DC2626'], ARRAY['2B','3B','4B','5B'], 'bosque_chileno'),
('ciudad', 'Ciudad Moderna', 'Vida urbana y tecnología', ARRAY['🏢','🚗','🚌','👷','🏗️','💻'], ARRAY['#6B7280','#EF4444','#F59E0B','#3B82F6'], ARRAY['3B','4B','5B','6B'], 'urbano');

-- 12. Verificación final: Mostrar cambios realizados
SELECT 
    'Tabla evaluations modificada' as status,
    COUNT(*) as registros_existentes
FROM evaluations;

SELECT 
    'Formatos de juego creados' as status,
    COUNT(*) as total_formatos
FROM game_formats;

SELECT 
    'Engines educativos creados' as status,
    COUNT(*) as total_engines  
FROM educational_engines;

SELECT 
    'Skins temáticos creados' as status,
    COUNT(*) as total_skins
FROM skin_themes; 