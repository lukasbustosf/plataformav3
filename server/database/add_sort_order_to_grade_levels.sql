ALTER TABLE grade_levels
ADD COLUMN sort_order INTEGER;

COMMENT ON COLUMN grade_levels.sort_order IS 'Orden de clasificación para los niveles de grado.';
