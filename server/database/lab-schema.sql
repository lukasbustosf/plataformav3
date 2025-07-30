-- MÓDULO III - LABORATORIOS MÓVILES
-- Esquema de base de datos completo

-- Tipos ENUM
CREATE TYPE lab_product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE lab_material_status AS ENUM ('draft', 'active', 'out_of_stock', 'discontinued');
CREATE TYPE activity_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE cycle_enum AS ENUM ('PK', 'K1', 'K2', '1B', '2B', '3B', '4B', '5B', '6B');
CREATE TYPE bloom_level_enum AS ENUM ('recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear');
CREATE TYPE evidence_type_enum AS ENUM ('photo', 'video', 'audio', 'document');

-- Productos/Kits de laboratorio
CREATE TABLE lab_product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,                    -- "Lab Móvil Párvulo"
    code TEXT UNIQUE NOT NULL,             -- "lab_parvulo"
    description TEXT,
    target_cycles cycle_enum[],            -- {"PK", "K1", "K2"}
    cover_image_url TEXT,
    price_clp INTEGER,                     -- Precio en pesos chilenos
    specifications JSONB DEFAULT '{}',     -- Especificaciones técnicas
    status lab_product_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Materiales individuales dentro de cada producto
CREATE TABLE lab_material (
    id SERIAL PRIMARY KEY,
    lab_product_id UUID REFERENCES lab_product(id) ON DELETE CASCADE,
    name TEXT NOT NULL,                    -- "Bloques lógicos Dienes"
    internal_code TEXT UNIQUE NOT NULL,    -- "BLD-001"
    specifications JSONB DEFAULT '{}',     -- {"pieces": 48, "material": "wood", "colors": ["red", "blue", "yellow"]}
    cover_image_url TEXT,
    quantity_per_kit INTEGER DEFAULT 1,
    weight_grams INTEGER,
    dimensions JSONB,                      -- {"length_cm": 10, "width_cm": 8, "height_cm": 5}
    safety_info JSONB,                     -- {"age_min": 3, "certifications": ["CE", "ASTM"]}
    status lab_material_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Actividades pedagógicas con material concreto
CREATE TABLE lab_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_product_id UUID REFERENCES lab_product(id) ON DELETE CASCADE,
    title TEXT NOT NULL,                   -- "Clasificando formas y colores"
    slug TEXT UNIQUE NOT NULL,             -- "clasificando-formas-colores"
    description TEXT,                      -- Descripción breve
    oa_ids TEXT[],                         -- {"PK_MAT_OA1", "PK_MAT_OA3"}
    bloom_level bloom_level_enum,          -- 'recordar', 'comprender', 'aplicar', etc.
    target_cycle cycle_enum,               -- 'PK', 'K1', 'K2', etc.
    duration_minutes INTEGER,              -- 35
    group_size INTEGER,                    -- 8
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5), -- 1=muy fácil, 5=muy difícil
    cover_image_url TEXT,
    steps_markdown TEXT,                   -- Guía paso a paso en Markdown
    video_url TEXT,                        -- YouTube, Vimeo, etc.
    resource_urls TEXT[],                  -- Links adicionales (PDFs, presentaciones)
    required_material_ids INTEGER[],       -- IDs de materiales necesarios
    assessment_markdown TEXT,              -- Guía de evaluación rápida
    learning_objectives TEXT[],            -- Objetivos específicos de aprendizaje
    preparation_time_minutes INTEGER DEFAULT 5, -- Tiempo de preparación
    cleanup_time_minutes INTEGER DEFAULT 5,     -- Tiempo de limpieza
    author TEXT,                           -- "María Paz Fuentes"
    reviewed_by TEXT,                      -- Revisor pedagógico
    tags TEXT[],                           -- Etiquetas para búsqueda
    status activity_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Registro de uso de actividades por docentes
CREATE TABLE lab_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES lab_activity(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(school_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    execution_date TIMESTAMP NOT NULL,
    student_count INTEGER NOT NULL,
    duration_actual_minutes INTEGER,       -- Duración real vs planificada
    preparation_time_actual INTEGER,       -- Tiempo real de preparación
    success_rating INTEGER CHECK (success_rating BETWEEN 1 AND 5), -- 1=muy mal, 5=excelente
    engagement_rating INTEGER CHECK (engagement_rating BETWEEN 1 AND 5), -- Nivel de engagement estudiantes
    difficulty_perceived INTEGER CHECK (difficulty_perceived BETWEEN 1 AND 5), -- Dificultad percibida
    notes TEXT,                           -- Observaciones del docente
    challenges_faced TEXT[],              -- Desafíos específicos encontrados
    student_feedback TEXT,                -- Feedback directo de estudiantes
    would_repeat BOOLEAN,                 -- ¿Repetiría la actividad?
    location TEXT DEFAULT 'classroom',    -- 'classroom', 'outdoor', 'library', etc.
    weather_conditions TEXT,              -- Para actividades outdoor
    adaptations_made TEXT,                -- Adaptaciones realizadas
    created_at TIMESTAMP DEFAULT NOW()
);

-- Evidencias multimedia de las actividades
CREATE TABLE lab_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_log_id UUID REFERENCES lab_activity_log(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type evidence_type_enum NOT NULL,
    file_size_bytes INTEGER,
    file_name TEXT,
    mime_type TEXT,
    description TEXT,
    capture_timestamp TIMESTAMP,          -- Momento de captura (puede diferir de upload)
    is_student_work BOOLEAN DEFAULT false, -- ¿Es trabajo de estudiante?
    student_names TEXT[],                 -- Nombres si es trabajo específico
    is_approved BOOLEAN DEFAULT NULL,     -- Para moderación (null=pendiente)
    approved_by UUID REFERENCES users(user_id),
    approval_notes TEXT,
    is_featured BOOLEAN DEFAULT false,    -- Para destacar en galería
    privacy_level TEXT DEFAULT 'school',  -- 'public', 'school', 'teacher'
    created_at TIMESTAMP DEFAULT NOW()
);

-- Favoritos de actividades por docente
CREATE TABLE lab_activity_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    activity_id UUID REFERENCES lab_activity(id) ON DELETE CASCADE,
    notes TEXT,                           -- Notas personales del docente
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(teacher_id, activity_id)
);

-- Colecciones personalizadas de actividades
CREATE TABLE lab_activity_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name TEXT NOT NULL,                   -- "Actividades Matemáticas Kinder"
    description TEXT,
    is_public BOOLEAN DEFAULT false,      -- ¿Visible para otros docentes?
    tags TEXT[],
    color TEXT DEFAULT '#3B82F6',        -- Color para organización visual
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Relación muchos a muchos: colecciones ↔ actividades
CREATE TABLE lab_collection_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES lab_activity_collections(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES lab_activity(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    notes TEXT,                           -- Notas específicas para esta actividad en la colección
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(collection_id, activity_id)
);

-- Métricas agregadas de actividades (para optimizar queries)
CREATE TABLE lab_activity_metrics (
    activity_id UUID REFERENCES lab_activity(id) ON DELETE CASCADE PRIMARY KEY,
    total_executions INTEGER DEFAULT 0,
    unique_teachers INTEGER DEFAULT 0,
    unique_schools INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2),
    avg_duration_minutes DECIMAL(5,2),
    avg_preparation_time DECIMAL(5,2),
    total_evidence_count INTEGER DEFAULT 0,
    last_execution_date TIMESTAMP,
    trend_7d INTEGER DEFAULT 0,           -- Diferencia ejecuciones últimos 7 vs 7 anteriores
    trend_30d INTEGER DEFAULT 0,          -- Diferencia ejecuciones últimos 30 vs 30 anteriores
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sesiones de trabajo colaborativo (futuro)
CREATE TABLE lab_work_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES lab_activity(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(course_id) ON DELETE CASCADE,
    session_name TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    max_groups INTEGER,                   -- Número máximo de grupos
    group_size INTEGER,                   -- Estudiantes por grupo
    is_active BOOLEAN DEFAULT true,
    session_data JSONB DEFAULT '{}',      -- Datos específicos de la sesión
    created_at TIMESTAMP DEFAULT NOW()
);

-- Grupos de trabajo dentro de sesiones
CREATE TABLE lab_work_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES lab_work_sessions(id) ON DELETE CASCADE,
    group_name TEXT,                      -- "Grupo Azul", "Equipo 1"
    student_names TEXT[],                 -- Nombres de estudiantes
    progress_data JSONB DEFAULT '{}',     -- Progreso específico del grupo
    final_result JSONB,                   -- Resultado final del grupo
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_lab_activity_oa_ids ON lab_activity USING GIN (oa_ids);
CREATE INDEX idx_lab_activity_bloom_cycle ON lab_activity (bloom_level, target_cycle);
CREATE INDEX idx_lab_activity_status ON lab_activity (status) WHERE status = 'active';
CREATE INDEX idx_lab_activity_log_date ON lab_activity_log (execution_date DESC);
CREATE INDEX idx_lab_activity_log_teacher ON lab_activity_log (teacher_id, execution_date DESC);
CREATE INDEX idx_lab_activity_log_school ON lab_activity_log (school_id, execution_date DESC);
CREATE INDEX idx_lab_evidence_type ON lab_evidence (file_type);
CREATE INDEX idx_lab_evidence_approved ON lab_evidence (is_approved) WHERE is_approved IS NOT NULL;

-- Triggers para actualizar métricas
CREATE OR REPLACE FUNCTION update_lab_activity_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar métricas cuando se inserta/actualiza un log
    INSERT INTO lab_activity_metrics (activity_id) 
    VALUES (NEW.activity_id)
    ON CONFLICT (activity_id) DO NOTHING;
    
    UPDATE lab_activity_metrics 
    SET 
        total_executions = (
            SELECT COUNT(*) 
            FROM lab_activity_log 
            WHERE activity_id = NEW.activity_id
        ),
        unique_teachers = (
            SELECT COUNT(DISTINCT teacher_id) 
            FROM lab_activity_log 
            WHERE activity_id = NEW.activity_id
        ),
        unique_schools = (
            SELECT COUNT(DISTINCT school_id) 
            FROM lab_activity_log 
            WHERE activity_id = NEW.activity_id
        ),
        avg_rating = (
            SELECT AVG(success_rating)::DECIMAL(3,2)
            FROM lab_activity_log 
            WHERE activity_id = NEW.activity_id 
            AND success_rating IS NOT NULL
        ),
        avg_duration_minutes = (
            SELECT AVG(duration_actual_minutes)::DECIMAL(5,2)
            FROM lab_activity_log 
            WHERE activity_id = NEW.activity_id 
            AND duration_actual_minutes IS NOT NULL
        ),
        last_execution_date = (
            SELECT MAX(execution_date)
            FROM lab_activity_log 
            WHERE activity_id = NEW.activity_id
        ),
        updated_at = NOW()
    WHERE activity_id = NEW.activity_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lab_metrics
    AFTER INSERT OR UPDATE ON lab_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION update_lab_activity_metrics();

-- Trigger para actualizar contador de evidencias
CREATE OR REPLACE FUNCTION update_evidence_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE lab_activity_metrics 
    SET 
        total_evidence_count = (
            SELECT COUNT(*) 
            FROM lab_evidence e
            JOIN lab_activity_log l ON e.activity_log_id = l.id
            WHERE l.activity_id = (
                SELECT activity_id 
                FROM lab_activity_log 
                WHERE id = NEW.activity_log_id
            )
        ),
        updated_at = NOW()
    WHERE activity_id = (
        SELECT activity_id 
        FROM lab_activity_log 
        WHERE id = NEW.activity_log_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_evidence_count
    AFTER INSERT OR DELETE ON lab_evidence
    FOR EACH ROW
    EXECUTE FUNCTION update_evidence_count();

-- Políticas RLS (Row Level Security)

-- Productos: lectura para todos los roles educativos
CREATE POLICY p_lab_product_select 
ON lab_product FOR SELECT 
USING (
    status = 'active' AND 
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator', 'admin_escolar', 'sostenedor', 'superadmin')
);

-- Materiales: lectura para todos, CRUD solo superadmin
CREATE POLICY p_lab_material_select 
ON lab_material FOR SELECT 
USING (
    status IN ('active', 'out_of_stock') AND
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator', 'admin_escolar', 'sostenedor', 'superadmin')
);

CREATE POLICY p_lab_material_crud_superadmin
ON lab_material FOR ALL
USING (auth.jwt() ->> 'role' = 'superadmin')
WITH CHECK (auth.jwt() ->> 'role' = 'superadmin');

-- Actividades: lectura para todos los roles educativos
CREATE POLICY p_lab_activity_select 
ON lab_activity FOR SELECT 
USING (
    status = 'active' AND 
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator', 'admin_escolar', 'sostenedor', 'superadmin')
);

-- CRUD actividades: solo superadmin (por ahora)
CREATE POLICY p_lab_activity_crud_superadmin
ON lab_activity FOR ALL
USING (auth.jwt() ->> 'role' = 'superadmin')
WITH CHECK (auth.jwt() ->> 'role' = 'superadmin');

-- Logs: insertar solo el propio docente, leer según contexto
CREATE POLICY p_lab_log_insert 
ON lab_activity_log FOR INSERT 
WITH CHECK (
    (auth.jwt() ->> 'user_id')::uuid = teacher_id AND
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator')
);

CREATE POLICY p_lab_log_select 
ON lab_activity_log FOR SELECT 
USING (
    CASE 
        WHEN auth.jwt() ->> 'role' = 'teacher' THEN 
            (auth.jwt() ->> 'user_id')::uuid = teacher_id
        WHEN auth.jwt() ->> 'role' = 'coordinator' THEN 
            school_id = (auth.jwt() ->> 'school_id')::UUID
        WHEN auth.jwt() ->> 'role' IN ('admin_escolar', 'sostenedor') THEN 
            school_id = (auth.jwt() ->> 'school_id')::UUID OR
            school_id IN (
                SELECT id FROM schools 
                WHERE sostenedor_id = (auth.jwt() ->> 'sostenedor_id')::UUID
            )
        WHEN auth.jwt() ->> 'role' = 'superadmin' THEN true
        ELSE false
    END
);

-- Evidencias: insertar solo el autor del log, leer según contexto
CREATE POLICY p_lab_evidence_insert 
ON lab_evidence FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM lab_activity_log 
        WHERE id = activity_log_id 
        AND teacher_id = (auth.jwt() ->> 'user_id')::uuid
    )
);

CREATE POLICY p_lab_evidence_select 
ON lab_evidence FOR SELECT 
USING (
    privacy_level = 'public' OR
    EXISTS (
        SELECT 1 FROM lab_activity_log l
        WHERE l.id = activity_log_id
        AND (
            CASE 
                WHEN auth.jwt() ->> 'role' = 'teacher' THEN 
                    l.teacher_id = (auth.jwt() ->> 'user_id')::uuid
                WHEN auth.jwt() ->> 'role' IN ('coordinator', 'admin_escolar') THEN 
                    l.school_id = (auth.jwt() ->> 'school_id')::UUID
                WHEN auth.jwt() ->> 'role' = 'sostenedor' THEN 
                    l.school_id IN (
                        SELECT id FROM schools 
                        WHERE sostenedor_id = (auth.jwt() ->> 'sostenedor_id')::UUID
                    )
                WHEN auth.jwt() ->> 'role' = 'superadmin' THEN true
                ELSE false
            END
        )
    )
);

-- Favoritos: solo propios
CREATE POLICY p_lab_favorites_crud 
ON lab_activity_favorites FOR ALL 
USING ((auth.jwt() ->> 'user_id')::uuid = teacher_id)
WITH CHECK ((auth.jwt() ->> 'user_id')::uuid = teacher_id);

-- Colecciones: propias + públicas
CREATE POLICY p_lab_collections_select 
ON lab_activity_collections FOR SELECT 
USING (
    (auth.jwt() ->> 'user_id')::uuid = teacher_id OR 
    (is_public = true AND auth.jwt() ->> 'role' IN ('teacher', 'coordinator'))
);

CREATE POLICY p_lab_collections_crud 
ON lab_activity_collections FOR ALL 
USING ((auth.jwt() ->> 'user_id')::uuid = teacher_id)
WITH CHECK ((auth.jwt() ->> 'user_id')::uuid = teacher_id);

-- Métricas: lectura según contexto
CREATE POLICY p_lab_metrics_select 
ON lab_activity_metrics FOR SELECT 
USING (
    auth.jwt() ->> 'role' IN ('teacher', 'coordinator', 'admin_escolar', 'sostenedor', 'superadmin')
);

-- Habilitar RLS en todas las tablas
ALTER TABLE lab_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_activity_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_activity_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_collection_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_activity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_work_groups ENABLE ROW LEVEL SECURITY;

-- Comentarios para documentación
COMMENT ON TABLE lab_product IS 'Productos/kits de laboratorio móvil disponibles';
COMMENT ON TABLE lab_material IS 'Materiales individuales que componen cada kit';
COMMENT ON TABLE lab_activity IS 'Actividades pedagógicas que usan material concreto';
COMMENT ON TABLE lab_activity_log IS 'Registro de ejecución de actividades por docentes';
COMMENT ON TABLE lab_evidence IS 'Evidencias multimedia (fotos, videos) de las actividades';
COMMENT ON TABLE lab_activity_favorites IS 'Actividades marcadas como favoritas por docentes';
COMMENT ON TABLE lab_activity_collections IS 'Colecciones personalizadas de actividades';
COMMENT ON TABLE lab_activity_metrics IS 'Métricas agregadas para optimizar dashboards';
COMMENT ON TABLE lab_work_sessions IS 'Sesiones de trabajo colaborativo (futuro)';
COMMENT ON TABLE lab_work_groups IS 'Grupos de estudiantes dentro de sesiones'; 