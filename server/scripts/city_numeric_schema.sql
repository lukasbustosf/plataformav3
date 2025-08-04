-- =====================================================
-- ESQUEMA DE BASE DE DATOS: CIUDAD NUMÉRICA
-- Experiencia gamificada: "Diseña tu Ciudad Numérica"
-- OA: MA01OA01 - Conteo y numeración hasta 100
-- =====================================================

-- Tabla para proyectos de ciudad
CREATE TABLE IF NOT EXISTS city_projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID, -- Referencia opcional a experience_sessions
    city_name VARCHAR(100) DEFAULT 'Mi Ciudad Numérica',
    current_district VARCHAR(50) DEFAULT 'residential',
    total_buildings INTEGER DEFAULT 0,
    total_roads INTEGER DEFAULT 0,
    total_parks INTEGER DEFAULT 0,
    city_layout JSONB DEFAULT '{}',
    progress_percentage INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para componentes de construcción
CREATE TABLE IF NOT EXISTS city_components (
    component_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES city_projects(project_id) ON DELETE CASCADE,
    component_type VARCHAR(50) NOT NULL, -- 'building', 'road', 'park'
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    number_value INTEGER NOT NULL,
    sequence_order INTEGER,
    district_type VARCHAR(50), -- 'residential', 'commercial', 'park'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para distritos y progresión
CREATE TABLE IF NOT EXISTS city_districts (
    district_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES city_projects(project_id) ON DELETE CASCADE,
    district_name VARCHAR(100) NOT NULL,
    district_type VARCHAR(50) NOT NULL, -- 'residential', 'commercial', 'park'
    required_buildings INTEGER DEFAULT 0,
    required_roads INTEGER DEFAULT 0,
    required_parks INTEGER DEFAULT 0,
    sequence_challenge JSONB DEFAULT '{}',
    is_completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP,
    unlock_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para logros y recompensas de ciudad
CREATE TABLE IF NOT EXISTS city_achievements (
    achievement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES city_projects(project_id) ON DELETE CASCADE,
    achievement_type VARCHAR(50) NOT NULL, -- 'district_complete', 'sequence_perfect', 'city_complete'
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT,
    icon VARCHAR(10),
    is_earned BOOLEAN DEFAULT FALSE,
    earned_date TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para participación familiar en ciudad
CREATE TABLE IF NOT EXISTS city_family_participation (
    participation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES city_projects(project_id) ON DELETE CASCADE,
    guardian_id UUID REFERENCES users(user_id),
    student_id UUID REFERENCES users(user_id),
    activity_type VARCHAR(50) NOT NULL, -- 'collaboration', 'celebration', 'planning'
    duration_minutes INTEGER,
    details_json JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para city_projects
CREATE INDEX IF NOT EXISTS idx_city_projects_session_id ON city_projects(session_id);
CREATE INDEX IF NOT EXISTS idx_city_projects_current_district ON city_projects(current_district);
CREATE INDEX IF NOT EXISTS idx_city_projects_is_completed ON city_projects(is_completed);

-- Índices para city_components
CREATE INDEX IF NOT EXISTS idx_city_components_project_id ON city_components(project_id);
CREATE INDEX IF NOT EXISTS idx_city_components_type ON city_components(component_type);
CREATE INDEX IF NOT EXISTS idx_city_components_district ON city_components(district_type);
CREATE INDEX IF NOT EXISTS idx_city_components_position ON city_components(position_x, position_y);

-- Índices para city_districts
CREATE INDEX IF NOT EXISTS idx_city_districts_project_id ON city_districts(project_id);
CREATE INDEX IF NOT EXISTS idx_city_districts_type ON city_districts(district_type);
CREATE INDEX IF NOT EXISTS idx_city_districts_completed ON city_districts(is_completed);

-- Índices para city_achievements
CREATE INDEX IF NOT EXISTS idx_city_achievements_project_id ON city_achievements(project_id);
CREATE INDEX IF NOT EXISTS idx_city_achievements_type ON city_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_city_achievements_earned ON city_achievements(is_earned);

-- Índices para city_family_participation
CREATE INDEX IF NOT EXISTS idx_city_family_project_id ON city_family_participation(project_id);
CREATE INDEX IF NOT EXISTS idx_city_family_guardian_id ON city_family_participation(guardian_id);
CREATE INDEX IF NOT EXISTS idx_city_family_student_id ON city_family_participation(student_id);

-- =====================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================

-- Trigger para actualizar updated_at en city_projects
CREATE OR REPLACE FUNCTION update_city_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_city_projects_updated_at
    BEFORE UPDATE ON city_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_city_projects_updated_at();

-- Trigger para actualizar progreso de ciudad
CREATE OR REPLACE FUNCTION update_city_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar contadores en city_projects
    UPDATE city_projects 
    SET 
        total_buildings = (
            SELECT COUNT(*) 
            FROM city_components 
            WHERE project_id = NEW.project_id AND component_type = 'building'
        ),
        total_roads = (
            SELECT COUNT(*) 
            FROM city_components 
            WHERE project_id = NEW.project_id AND component_type = 'road'
        ),
        total_parks = (
            SELECT COUNT(*) 
            FROM city_components 
            WHERE project_id = NEW.project_id AND component_type = 'park'
        ),
        updated_at = NOW()
    WHERE project_id = NEW.project_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_city_progress
    AFTER INSERT OR UPDATE OR DELETE ON city_components
    FOR EACH ROW
    EXECUTE FUNCTION update_city_progress();

-- =====================================================
-- DATOS INICIALES DE PRUEBA
-- =====================================================

-- NOTA: Los datos de prueba se crearán automáticamente cuando se cree un proyecto
-- a través de la aplicación. No es necesario insertar datos de prueba aquí.

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE city_projects IS 'Proyectos de ciudad numérica para OA1 de Matemáticas';
COMMENT ON TABLE city_components IS 'Componentes individuales de construcción (edificios, carreteras, parques)';
COMMENT ON TABLE city_districts IS 'Distritos de la ciudad con desafíos específicos de secuencias numéricas';
COMMENT ON TABLE city_achievements IS 'Logros y recompensas obtenidas en la construcción de la ciudad';
COMMENT ON TABLE city_family_participation IS 'Participación de familiares en actividades de la ciudad';

COMMENT ON COLUMN city_projects.current_district IS 'Distrito actual en construcción (residential, commercial, park)';
COMMENT ON COLUMN city_components.number_value IS 'Valor numérico del componente para validación de secuencias';
COMMENT ON COLUMN city_components.sequence_order IS 'Orden en la secuencia numérica del distrito';
COMMENT ON COLUMN city_districts.sequence_challenge IS 'Configuración del desafío de secuencia numérica para el distrito'; 