-- Esquema para el Banco de Preguntas Centralizado de EDU21
-- Este diseño permite almacenar preguntas de forma independiente a los juegos,
-- facilitando su reutilización, edición y control de calidad.

CREATE TABLE IF NOT EXISTS question_bank (
    -- Identificador único para cada pregunta
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Contenido de la Pregunta
    question_text TEXT NOT NULL CHECK (char_length(question_text) > 10),
    question_type TEXT NOT NULL DEFAULT 'multiple_choice', -- Ej: 'multiple_choice', 'fill_in_the_blank', 'ordering'
    
    -- Opciones y Respuesta
    options_json JSONB, -- Para 'multiple_choice', un array de objetos: [{ "value": "a", "label": "Opción A" }]
    correct_answer TEXT NOT NULL, -- El valor que corresponde a la respuesta correcta en options_json
    explanation_text TEXT, -- Feedback para el estudiante después de responder

    -- Metadatos Pedagógicos (El corazón del sistema)
    oa_id TEXT NOT NULL, -- ID del Objetivo de Aprendizaje, ej: "MA01OA01"
    skill_tags TEXT[], -- Array de habilidades específicas, ej: ['conteo-hacia-atras', 'secuencias-de-5']
    bloom_level TEXT NOT NULL, -- 'Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'
    
    -- Control de Calidad y Dificultad
    difficulty_score SMALLINT NOT NULL CHECK (difficulty_score BETWEEN 1 AND 5), -- 1: muy fácil, 5: muy difícil
    is_validated BOOLEAN NOT NULL DEFAULT FALSE, -- Un administrador o curador debe aprobar la pregunta
    
    -- Auditoría y Propiedad
    author_id UUID REFERENCES users(user_id),
    validator_id UUID REFERENCES users(user_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger para actualizar automáticamente el campo updated_at
CREATE OR REPLACE TRIGGER set_timestamp
BEFORE UPDATE ON question_bank
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Índices para optimizar las búsquedas más comunes
CREATE INDEX IF NOT EXISTS idx_question_bank_oa_id ON question_bank(oa_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_skill_tags ON question_bank USING GIN(skill_tags);
CREATE INDEX IF NOT EXISTS idx_question_bank_bloom_level ON question_bank(bloom_level);

COMMENT ON TABLE question_bank IS 'Banco central de preguntas para todos los juegos y evaluaciones de la plataforma.';
COMMENT ON COLUMN question_bank.is_validated IS 'Indica si la pregunta ha sido revisada y aprobada para su uso en producción.';
