-- =====================================================
-- CREACIÓN DE TABLAS PARA EXPERIENCIAS GAMIFICADAS
-- =====================================================

-- Tabla para experiencias gamificadas
CREATE TABLE IF NOT EXISTS public.gamified_experiences (
    experience_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oa_id VARCHAR(50) NOT NULL,
    experience_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    settings_json JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para sesiones de experiencias
CREATE TABLE IF NOT EXISTS public.experience_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES public.gamified_experiences(experience_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES public.schools(school_id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    progress_json JSONB DEFAULT '{}',
    rewards_json JSONB DEFAULT '{}',
    metadata_json JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para participación familiar
CREATE TABLE IF NOT EXISTS public.family_participation (
    participation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.experience_sessions(session_id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER,
    details_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para gamified_experiences
CREATE INDEX IF NOT EXISTS idx_gamified_experiences_oa_id ON public.gamified_experiences(oa_id);
CREATE INDEX IF NOT EXISTS idx_gamified_experiences_active ON public.gamified_experiences(active);
CREATE INDEX IF NOT EXISTS idx_gamified_experiences_type ON public.gamified_experiences(experience_type);

-- Índices para experience_sessions
CREATE INDEX IF NOT EXISTS idx_experience_sessions_user_id ON public.experience_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_experience_id ON public.experience_sessions(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_school_id ON public.experience_sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_status ON public.experience_sessions(status);
CREATE INDEX IF NOT EXISTS idx_experience_sessions_start_time ON public.experience_sessions(start_time);

-- Índices para family_participation
CREATE INDEX IF NOT EXISTS idx_family_participation_session_id ON public.family_participation(session_id);
CREATE INDEX IF NOT EXISTS idx_family_participation_guardian_id ON public.family_participation(guardian_id);
CREATE INDEX IF NOT EXISTS idx_family_participation_student_id ON public.family_participation(student_id);
CREATE INDEX IF NOT EXISTS idx_family_participation_activity_type ON public.family_participation(activity_type);

-- =====================================================
-- TRIGGERS PARA updated_at
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
    BEFORE UPDATE ON public.gamified_experiences
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
    BEFORE UPDATE ON public.experience_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_experience_sessions_updated_at();

-- =====================================================
-- DATOS INICIALES DE PRUEBA
-- =====================================================

-- Insertar experiencia de prueba para OA1 Matemáticas
INSERT INTO public.gamified_experiences (
    oa_id,
    experience_type,
    title,
    description,
    settings_json
) VALUES (
    'MA01OA01',
    'Discovery_Learning',
    'Descubriendo la Ruta Numérica',
    'Experiencia gamificada para aprender a contar del 0 al 100 a través del descubrimiento de patrones numéricos',
    '{
        "min_number": 0,
        "max_number": 100,
        "worlds": [
            {
                "id": "world_1",
                "name": "Mundo de los Números Pequeños",
                "range": [0, 20],
                "challenges": ["conteo_basico", "identificacion", "secuencias"]
            },
            {
                "id": "world_2", 
                "name": "Mundo de las Decenas",
                "range": [21, 50],
                "challenges": ["agrupacion", "patrones", "comparacion"]
            },
            {
                "id": "world_3",
                "name": "Mundo de los Números Grandes", 
                "range": [51, 100],
                "challenges": ["secuencias_avanzadas", "aplicacion", "creacion"]
            }
        ],
        "tools": ["calculadora_virtual", "patron_visual", "ayuda_audio"],
        "rewards": {
            "album_items": ["numero_1", "numero_10", "numero_50", "numero_100"],
            "achievements": ["contador_novato", "patron_explorador", "secuencia_maestro"],
            "tools_unlock": ["calculadora_avanzada", "patron_interactivo"]
        }
    }'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.gamified_experiences IS 'Almacena las experiencias gamificadas disponibles por OA';
COMMENT ON TABLE public.experience_sessions IS 'Registra las sesiones individuales de estudiantes en experiencias gamificadas';
COMMENT ON TABLE public.family_participation IS 'Registra la participación de apoderados en actividades familiares';

COMMENT ON COLUMN public.gamified_experiences.oa_id IS 'Código del Objetivo de Aprendizaje (ej: MA01OA01)';
COMMENT ON COLUMN public.gamified_experiences.experience_type IS 'Tipo de experiencia (Discovery_Learning, Project_Based_Learning, etc.)';
COMMENT ON COLUMN public.gamified_experiences.settings_json IS 'Configuración específica de la experiencia en formato JSON';
COMMENT ON COLUMN public.experience_sessions.progress_json IS 'Progreso del estudiante en la experiencia';
COMMENT ON COLUMN public.experience_sessions.rewards_json IS 'Recompensas obtenidas por el estudiante';
COMMENT ON COLUMN public.experience_sessions.metadata_json IS 'Métricas detalladas de engagement y aprendizaje'; 