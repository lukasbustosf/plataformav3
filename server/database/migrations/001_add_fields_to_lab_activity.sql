-- Migración para añadir campos de asignatura, nivel e indicadores a las actividades de laboratorio.

ALTER TABLE public.lab_activity
ADD COLUMN IF NOT EXISTS subject VARCHAR(255),
ADD COLUMN IF NOT EXISTS grade_level VARCHAR(255),
ADD COLUMN IF NOT EXISTS indicators_markdown TEXT;

-- Comentario:
-- subject: Almacena la asignatura principal de la actividad (ej. "Ciencias Naturales").
-- grade_level: Almacena el nivel educativo al que se dirige (ej. "Pre-Kínder").
-- indicators_markdown: Almacena los indicadores de evaluación específicos en formato Markdown.
