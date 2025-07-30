-- ===============================================
-- SUPABASE CRON JOB - ACTUALIZACIÓN MENSUAL OA
-- ===============================================
-- Job Supabase cron mensual compara oa_code → inserta los nuevos y marca deprecated_at

-- Habilitar extensión pg_cron en Supabase (solo admin)
-- SELECT cron.schedule('oa-monthly-update', '0 2 1 * *', 'SELECT update_oa_mineduc_monthly();');

-- ===============================================
-- FUNCIÓN DE ACTUALIZACIÓN OA MENSUAL
-- ===============================================

CREATE OR REPLACE FUNCTION update_oa_mineduc_monthly()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    update_stats JSON;
    new_oa_count INTEGER := 0;
    deprecated_count INTEGER := 0;
    updated_count INTEGER := 0;
    start_time TIMESTAMP := NOW();
    processing_log TEXT := '';
    temp_table_exists BOOLEAN := FALSE;
BEGIN
    -- Log inicio del proceso
    processing_log := processing_log || 'Iniciando actualización OA mensual: ' || start_time::TEXT || E'\n';
    
    -- Verificar si existe tabla temporal con datos nuevos de MINEDUC
    -- Esta tabla debe ser populada externamente via el pipeline Python
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'temp_oa_mineduc_import'
    ) INTO temp_table_exists;
    
    IF NOT temp_table_exists THEN
        processing_log := processing_log || 'ADVERTENCIA: No se encontró tabla temp_oa_mineduc_import. Ejecutar pipeline Python primero.' || E'\n';
        
        -- Crear tabla temporal vacía para evitar errores
        CREATE TEMP TABLE temp_oa_mineduc_import (
            oa_code VARCHAR(50),
            oa_desc TEXT,
            oa_short_desc VARCHAR(255),
            grade_code VARCHAR(10),
            subject_code VARCHAR(10),
            bloom_level VARCHAR(20),
            cog_skill VARCHAR(50),
            oa_version VARCHAR(10),
            semester INTEGER,
            complexity_level INTEGER,
            estimated_hours INTEGER,
            ministerial_priority VARCHAR(20),
            is_transversal BOOLEAN,
            source_url TEXT,
            scraped_at TIMESTAMP
        );
        
        RETURN json_build_object(
            'success', false,
            'message', 'Tabla de importación no encontrada',
            'new_oa_count', 0,
            'deprecated_count', 0,
            'updated_count', 0,
            'processing_log', processing_log,
            'execution_time_seconds', EXTRACT(EPOCH FROM (NOW() - start_time))
        );
    END IF;
    
    processing_log := processing_log || 'Tabla de importación encontrada. Iniciando procesamiento...' || E'\n';
    
    -- 1. INSERTAR NUEVOS OA que no existen en learning_objectives
    WITH new_oa_candidates AS (
        SELECT DISTINCT
            temp.oa_code,
            temp.oa_desc,
            temp.oa_short_desc,
            temp.grade_code,
            (SELECT subject_id FROM subjects WHERE subject_code = temp.subject_code) as subject_id,
            temp.bloom_level,
            temp.cog_skill,
            temp.oa_version,
            temp.semester,
            temp.complexity_level,
            temp.estimated_hours,
            COALESCE(temp.ministerial_priority, 'normal') as ministerial_priority,
            COALESCE(temp.is_transversal, false) as is_transversal,
            temp.source_url,
            temp.scraped_at
        FROM temp_oa_mineduc_import temp
        WHERE temp.oa_code IS NOT NULL 
          AND temp.oa_desc IS NOT NULL
          AND temp.subject_code IS NOT NULL
          AND NOT EXISTS (
              SELECT 1 FROM learning_objectives lo 
              WHERE lo.oa_code = temp.oa_code
          )
    ),
    inserted_oa AS (
        INSERT INTO learning_objectives (
            oa_code, oa_desc, oa_short_desc, grade_code, subject_id,
            bloom_level, oa_version, semester, complexity_level, 
            estimated_hours, prerequisites, is_transversal, ministerial_priority,
            created_at, updated_at
        )
        SELECT 
            oa_code, oa_desc, oa_short_desc, grade_code, subject_id,
            bloom_level, oa_version, semester, complexity_level,
            estimated_hours, '[]'::jsonb, is_transversal, ministerial_priority,
            NOW(), NOW()
        FROM new_oa_candidates
        WHERE subject_id IS NOT NULL
        RETURNING oa_id, oa_code
    )
    SELECT COUNT(*) FROM inserted_oa INTO new_oa_count;
    
    processing_log := processing_log || 'Nuevos OA insertados: ' || new_oa_count || E'\n';
    
    -- 2. ACTUALIZAR OA EXISTENTES si han cambiado
    WITH updated_oa AS (
        UPDATE learning_objectives lo
        SET 
            oa_desc = temp.oa_desc,
            oa_short_desc = temp.oa_short_desc,
            bloom_level = temp.bloom_level,
            complexity_level = temp.complexity_level,
            estimated_hours = temp.estimated_hours,
            ministerial_priority = COALESCE(temp.ministerial_priority, lo.ministerial_priority),
            updated_at = NOW()
        FROM temp_oa_mineduc_import temp
        WHERE lo.oa_code = temp.oa_code
          AND lo.deprecated_at IS NULL
          AND (
              lo.oa_desc != temp.oa_desc OR
              lo.bloom_level != temp.bloom_level OR
              lo.complexity_level != temp.complexity_level OR
              lo.ministerial_priority != COALESCE(temp.ministerial_priority, 'normal')
          )
        RETURNING lo.oa_id, lo.oa_code
    )
    SELECT COUNT(*) FROM updated_oa INTO updated_count;
    
    processing_log := processing_log || 'OA actualizados: ' || updated_count || E'\n';
    
    -- 3. MARCAR COMO DEPRECATED OA que ya no están en MINEDUC
    -- Solo los que tienen más de 6 meses sin aparecer en importaciones
    WITH deprecated_oa AS (
        UPDATE learning_objectives lo
        SET 
            deprecated_at = NOW(),
            updated_at = NOW()
        WHERE lo.deprecated_at IS NULL
          AND lo.oa_version = '2023'  -- Solo versión actual
          AND NOT EXISTS (
              SELECT 1 FROM temp_oa_mineduc_import temp 
              WHERE temp.oa_code = lo.oa_code
          )
          AND lo.created_at < (NOW() - INTERVAL '6 months')  -- Gracia de 6 meses
        RETURNING lo.oa_id, lo.oa_code
    )
    SELECT COUNT(*) FROM deprecated_oa INTO deprecated_count;
    
    processing_log := processing_log || 'OA marcados como deprecated: ' || deprecated_count || E'\n';
    
    -- 4. LIMPIAR TABLA TEMPORAL
    DROP TABLE IF EXISTS temp_oa_mineduc_import;
    processing_log := processing_log || 'Tabla temporal limpiada.' || E'\n';
    
    -- 5. ACTUALIZAR ESTADÍSTICAS DE TABLAS
    ANALYZE learning_objectives;
    ANALYZE subjects;
    
    processing_log := processing_log || 'Actualización OA completada: ' || NOW()::TEXT || E'\n';
    
    -- Retornar estadísticas del proceso
    SELECT json_build_object(
        'success', true,
        'message', 'Actualización OA mensual completada exitosamente',
        'new_oa_count', new_oa_count,
        'deprecated_count', deprecated_count,
        'updated_count', updated_count,
        'processing_log', processing_log,
        'execution_time_seconds', EXTRACT(EPOCH FROM (NOW() - start_time)),
        'next_execution', 'Primer día del próximo mes a las 02:00'
    ) INTO update_stats;
    
    RETURN update_stats;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error
        processing_log := processing_log || 'ERROR: ' || SQLERRM || E'\n';
        
        -- Limpiar tabla temporal en caso de error
        DROP TABLE IF EXISTS temp_oa_mineduc_import;
        
        RETURN json_build_object(
            'success', false,
            'message', 'Error en actualización OA mensual',
            'error', SQLERRM,
            'new_oa_count', new_oa_count,
            'deprecated_count', deprecated_count,
            'updated_count', updated_count,
            'processing_log', processing_log,
            'execution_time_seconds', EXTRACT(EPOCH FROM (NOW() - start_time))
        );
END;
$$;

-- ===============================================
-- FUNCIÓN AUXILIAR PARA PREPARAR IMPORTACIÓN
-- ===============================================

CREATE OR REPLACE FUNCTION prepare_oa_import_table(csv_data TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_stats JSON;
    records_count INTEGER := 0;
BEGIN
    -- Crear tabla temporal si no existe
    DROP TABLE IF EXISTS temp_oa_mineduc_import;
    
    CREATE TEMP TABLE temp_oa_mineduc_import (
        oa_code VARCHAR(50),
        oa_desc TEXT,
        oa_short_desc VARCHAR(255),
        grade_code VARCHAR(10),
        subject_code VARCHAR(10),
        bloom_level VARCHAR(20),
        cog_skill VARCHAR(50),
        oa_version VARCHAR(10) DEFAULT '2023',
        semester INTEGER DEFAULT 1,
        complexity_level INTEGER DEFAULT 3,
        estimated_hours INTEGER DEFAULT 4,
        ministerial_priority VARCHAR(20) DEFAULT 'normal',
        is_transversal BOOLEAN DEFAULT false,
        source_url TEXT,
        scraped_at TIMESTAMP DEFAULT NOW()
    );
    
    -- Esta función será llamada desde el pipeline Python después de cargar CSV
    -- Por ahora solo preparamos la estructura
    
    SELECT COUNT(*) FROM temp_oa_mineduc_import INTO records_count;
    
    SELECT json_build_object(
        'success', true,
        'message', 'Tabla de importación preparada',
        'records_loaded', records_count,
        'table_name', 'temp_oa_mineduc_import'
    ) INTO result_stats;
    
    RETURN result_stats;
END;
$$;

-- ===============================================
-- CONFIGURAR CRON JOB (EJECUTAR MANUALMENTE)
-- ===============================================

-- NOTA: Los siguientes comandos deben ejecutarse manualmente por un administrador de Supabase

-- 1. Programar job mensual (primer día de cada mes a las 02:00)
-- SELECT cron.schedule(
--     'oa-monthly-update',
--     '0 2 1 * *',  -- Cron: minuto hora día mes día_semana
--     'SELECT update_oa_mineduc_monthly();'
-- );

-- 2. Ver jobs programados
-- SELECT * FROM cron.job;

-- 3. Ver historial de ejecuciones
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- 4. Cancelar job si es necesario
-- SELECT cron.unschedule('oa-monthly-update');

-- ===============================================
-- FUNCIÓN DE TESTING MANUAL
-- ===============================================

CREATE OR REPLACE FUNCTION test_oa_update_manual()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    test_result JSON;
BEGIN
    -- Crear datos de prueba
    DROP TABLE IF EXISTS temp_oa_mineduc_import;
    
    CREATE TEMP TABLE temp_oa_mineduc_import (
        oa_code VARCHAR(50),
        oa_desc TEXT,
        oa_short_desc VARCHAR(255),
        grade_code VARCHAR(10),
        subject_code VARCHAR(10),
        bloom_level VARCHAR(20),
        cog_skill VARCHAR(50),
        oa_version VARCHAR(10),
        semester INTEGER,
        complexity_level INTEGER,
        estimated_hours INTEGER,
        ministerial_priority VARCHAR(20),
        is_transversal BOOLEAN,
        source_url TEXT,
        scraped_at TIMESTAMP
    );
    
    -- Insertar datos de prueba
    INSERT INTO temp_oa_mineduc_import (
        oa_code, oa_desc, oa_short_desc, grade_code, subject_code,
        bloom_level, cog_skill, oa_version, semester, complexity_level,
        estimated_hours, ministerial_priority, is_transversal,
        source_url, scraped_at
    ) VALUES 
    (
        'TEST-1B-OA99',
        'Objetivo de aprendizaje de prueba para verificar el pipeline de actualización automática',
        'OA de prueba pipeline',
        '1B',
        'MAT',
        'Aplicar',
        'razonamiento_logico',
        '2023',
        1,
        3,
        4,
        'normal',
        false,
        'https://curriculumnacional.mineduc.cl/test',
        NOW()
    );
    
    -- Ejecutar actualización
    SELECT update_oa_mineduc_monthly() INTO test_result;
    
    RETURN test_result;
END;
$$;

-- ===============================================
-- COMENTARIOS DE USO
-- ===============================================

/*
USO DEL PIPELINE COMPLETO:

1. SCRAPING (manual o automatizado):
   cd server/scripts
   python scrape_oa.py --year 2023 --out oa_raw.csv

2. ENRIQUECIMIENTO:
   python enrich_oa.py --input oa_raw.csv --output oa_enriched.csv

3. CARGA A SUPABASE:
   COPY temp_oa_mineduc_import(oa_code,oa_desc,oa_short_desc,grade_code,subject_code,bloom_level,cog_skill,oa_version,semester,complexity_level,estimated_hours,ministerial_priority,is_transversal)
   FROM 'oa_enriched.csv' WITH CSV HEADER;

4. ACTUALIZACIÓN AUTOMÁTICA:
   SELECT update_oa_mineduc_monthly();

5. TESTING:
   SELECT test_oa_update_manual();

MONITOREO:
- Ver logs de cron: SELECT * FROM cron.job_run_details WHERE jobname = 'oa-monthly-update' ORDER BY start_time DESC;
- Estadísticas OA: SELECT oa_version, COUNT(*) FROM learning_objectives GROUP BY oa_version;
- OA deprecated: SELECT COUNT(*) FROM learning_objectives WHERE deprecated_at IS NOT NULL;
*/ 