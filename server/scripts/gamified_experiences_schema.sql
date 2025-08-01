-- =====================================================
-- ESQUEMA PARA EXPERIENCIAS GAMIFICADAS EDU21
-- =====================================================

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLA: gamified_experiences
-- =====================================================
CREATE TABLE IF NOT EXISTS gamified_experiences (
    experience_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    oa_id UUID NOT NULL REFERENCES learning_objectives(oa_id) ON DELETE CASCADE,
    experience_type VARCHAR(50) NOT NULL CHECK (experience_type IN (
        'Discovery Learning',
        'Project-Based Learning', 
        'Multi-Device Interactive',
        'Adaptive Learning',
        'Inquiry-Based Learning',
        'Collaborative Learning'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    settings_json JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: experience_sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS experience_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id UUID NOT NULL REFERENCES gamified_experiences(experience_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(school_id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    progress_json JSONB DEFAULT '{}',
    rewards_json JSONB DEFAULT '{}',
    metadata_json JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLA: family_participation
-- =====================================================
CREATE TABLE IF NOT EXISTS family_participation (
    participation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES experience_sessions(session_id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
        'Modo Aventura Familiar',
        'Compartir Descubrimientos',
        'Actividad Sin Pantalla',
        'Celebración de Logros',
        'Ayuda con Tareas'
    )),
    duration_minutes INTEGER,
    details_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para gamified_experiences
CREATE INDEX IF NOT EXISTS idx_gamified_experiences_oa_id ON gamified_experiences(oa_id);
CREATE INDEX IF NOT EXISTS idx_gamified_experiences_type ON gamified_experiences(experience_type);
CREATE INDEX IF NOT EXISTS idx_gamified_experiences_active ON gamified_experiences(active);

-- Índices para experience_sessions
CREATE INDEX IF NOT EXISTS idx_experience_sessions_experience_id ON experience_sessions(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_user_id ON experience_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_school_id ON experience_sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_status ON experience_sessions(status);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_start_time ON experience_sessions(start_time);

-- Índices para family_participation
CREATE INDEX IF NOT EXISTS idx_family_participation_session_id ON family_participation(session_id);
CREATE INDEX IF NOT EXISTS idx_family_participation_guardian_id ON family_participation(guardian_id);
CREATE INDEX IF NOT EXISTS idx_family_participation_student_id ON family_participation(student_id);
CREATE INDEX IF NOT EXISTS idx_family_participation_activity_type ON family_participation(activity_type);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Trigger para gamified_experiences
CREATE OR REPLACE FUNCTION update_gamified_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gamified_experiences_updated_at
    BEFORE UPDATE ON gamified_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_gamified_experiences_updated_at();

-- Trigger para experience_sessions
CREATE OR REPLACE FUNCTION update_experience_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_experience_sessions_updated_at
    BEFORE UPDATE ON experience_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_experience_sessions_updated_at();

-- =====================================================
-- DATOS INICIALES PARA OA1 MATEMÁTICAS
-- =====================================================

-- Insertar la experiencia "Descubriendo la Ruta Numérica" para OA1
INSERT INTO gamified_experiences (
    oa_id,
    experience_type,
    title,
    description,
    settings_json
) VALUES (
    (SELECT oa_id FROM learning_objectives WHERE oa_code = 'MA01OA01' LIMIT 1),
    'Discovery Learning',
    'Descubriendo la Ruta Numérica',
    'Experiencia gamificada para aprender conteo del 0 al 100 a través de descubrimiento de patrones numéricos',
    '{
        "numberRange": "0-100",
        "patterns": ["de 1 en 1", "de 2 en 2", "de 5 en 5", "de 10 en 10"],
        "worlds": [
            {
                "id": "bosque_decenas",
                "name": "Bosque de las Decenas",
                "range": "0-20",
                "pattern": "de 1 en 1"
            },
            {
                "id": "rio_cincos", 
                "name": "Río de los Cincos",
                "range": "0-50",
                "pattern": "de 5 en 5"
            },
            {
                "id": "montana_cientos",
                "name": "Montaña de los Cientos", 
                "range": "0-100",
                "pattern": "de 10 en 10"
            }
        ],
        "tools": [
            {
                "id": "calculadora_patrones",
                "name": "Calculadora de Patrones",
                "description": "Herramienta para descubrir reglas numéricas",
                "unlocked": false
            },
            {
                "id": "microscopio_numerico",
                "name": "Microscopio Numérico",
                "description": "Herramienta para analizar secuencias",
                "unlocked": false
            }
        ],
        "rewards": [
            {
                "id": "gema_numerica",
                "name": "Gema Numérica",
                "description": "Coleccionable por descubrimientos",
                "type": "album_item"
            },
            {
                "id": "medalla_descubrimiento",
                "name": "Medalla de Descubrimiento",
                "description": "Reconocimiento por patrones encontrados",
                "type": "achievement"
            }
        ]
    }'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE gamified_experiences IS 'Almacena las experiencias gamificadas por OA';
COMMENT ON TABLE experience_sessions IS 'Registra las sesiones individuales de cada estudiante en experiencias gamificadas';
COMMENT ON TABLE family_participation IS 'Registra la participación de apoderados en actividades familiares';

COMMENT ON COLUMN gamified_experiences.settings_json IS 'Configuración específica de la experiencia (mundos, herramientas, recompensas)';
COMMENT ON COLUMN experience_sessions.progress_json IS 'Progreso específico del estudiante (mundos completados, patrones dominados)';
COMMENT ON COLUMN experience_sessions.rewards_json IS 'Recompensas obtenidas por el estudiante';
COMMENT ON COLUMN experience_sessions.metadata_json IS 'Métricas detalladas de engagement y aprendizaje';
COMMENT ON COLUMN family_participation.details_json IS 'Detalles específicos de la actividad familiar';

-- =====================================================
-- VISTAS ÚTILES PARA CONSULTAS
-- =====================================================

-- Vista para progreso de estudiantes por OA
CREATE OR REPLACE VIEW student_oa_progress AS
SELECT 
    u.user_id,
    u.first_name,
    u.last_name,
    s.school_name,
    lo.oa_code,
    lo.oa_desc,
    ge.experience_type,
    ge.title as experience_title,
    es.session_id,
    es.start_time,
    es.status,
    es.progress_json,
    es.rewards_json
FROM users u
JOIN schools s ON u.school_id = s.school_id
JOIN experience_sessions es ON u.user_id = es.user_id
JOIN gamified_experiences ge ON es.experience_id = ge.experience_id
JOIN learning_objectives lo ON ge.oa_id = lo.oa_id
WHERE u.role = 'STUDENT'
ORDER BY u.last_name, u.first_name, es.start_time DESC;

-- Vista para participación familiar
CREATE OR REPLACE VIEW family_activity_summary AS
SELECT 
    fp.participation_id,
    guardian.first_name as guardian_name,
    guardian.last_name as guardian_last_name,
    student.first_name as student_name,
    student.last_name as student_last_name,
    fp.activity_type,
    fp.duration_minutes,
    fp.created_at,
    ge.title as experience_title,
    lo.oa_code
FROM family_participation fp
JOIN users guardian ON fp.guardian_id = guardian.user_id
JOIN users student ON fp.student_id = student.user_id
JOIN experience_sessions es ON fp.session_id = es.session_id
JOIN gamified_experiences ge ON es.experience_id = ge.experience_id
JOIN learning_objectives lo ON ge.oa_id = lo.oa_id
ORDER BY fp.created_at DESC; 