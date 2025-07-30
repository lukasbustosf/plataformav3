ALTER TABLE question_bank
ADD COLUMN is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN question_bank.is_ai_generated IS 'Indica si la pregunta fue generada automáticamente por un modelo de IA.';
