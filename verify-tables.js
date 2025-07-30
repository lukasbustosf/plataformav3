#!/usr/bin/env node
/**
 * DIAGNÓSTICO: Verificar tablas y estructura en Supabase
 * Identifica exactamente qué tablas existen y su estructura
 */

const { createClient } = require('@supabase/supabase-js');

// Credenciales de Supabase del proyecto
const SUPABASE_URL = 'https://jximjwzcivxnoirejlpc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aW1qd3pjaXZ4bm9pcmVqbHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY1MDcwNSwiZXhwIjoyMDY3MjI2NzA1fQ.SFd5SgXYxHH1SNa4a368vupVTJ6rfl_Z8oEC5jdRr4g';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkTablesStructure() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DE LA BASE DE DATOS\n');
  
  // Verificar tabla evaluations
  console.log('1. Verificando tabla EVALUATIONS:');
  try {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('🔧 La tabla evaluations NO existe o no es accesible\n');
    } else {
      console.log('✅ Tabla evaluations existe');
      if (data && data.length > 0) {
        console.log('📊 Columnas encontradas:', Object.keys(data[0]));
      } else {
        console.log('📊 Tabla vacía, no se pueden ver columnas');
      }
      console.log('');
    }
  } catch (err) {
    console.log('❌ Error de conexión:', err.message);
  }

  // Verificar otras tablas relacionadas
  const tablesToCheck = ['quizzes', 'users', 'classes', 'schools'];
  
  for (const table of tablesToCheck) {
    console.log(`2. Verificando tabla ${table.toUpperCase()}:`);
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ Error:', error.message);
      } else {
        console.log('✅ Tabla existe');
        if (data && data.length > 0) {
          console.log('📊 Columnas:', Object.keys(data[0]).join(', '));
        }
      }
    } catch (err) {
      console.log('❌ Error:', err.message);
    }
    console.log('');
  }
}

async function generateCorrectSQL() {
  console.log('📋 SQL CORRECTO PARA EJECUTAR EN SUPABASE:');
  console.log('');
  console.log('=====================================');
  
  const sql = `-- PASO 1: Crear tabla evaluations si no existe
CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL,
    class_id UUID NOT NULL,
    creator_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'quiz',
    mode VARCHAR(20) NOT NULL DEFAULT 'manual',
    difficulty VARCHAR(20) DEFAULT 'medium',
    time_limit INTEGER DEFAULT 30,
    question_count INTEGER DEFAULT 10,
    total_points INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'draft',
    subject VARCHAR(100),
    grade_level VARCHAR(10)
);

-- PASO 2: Agregar columnas gamificadas
ALTER TABLE evaluations 
ADD COLUMN IF NOT EXISTS game_format VARCHAR(50),
ADD COLUMN IF NOT EXISTS engine_id VARCHAR(20),
ADD COLUMN IF NOT EXISTS skin_theme VARCHAR(50),
ADD COLUMN IF NOT EXISTS engine_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS is_gamified BOOLEAN DEFAULT false;

-- PASO 3: Crear índices
CREATE INDEX IF NOT EXISTS idx_evaluations_game_format ON evaluations(game_format);
CREATE INDEX IF NOT EXISTS idx_evaluations_engine_id ON evaluations(engine_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_skin_theme ON evaluations(skin_theme);
CREATE INDEX IF NOT EXISTS idx_evaluations_is_gamified ON evaluations(is_gamified);

-- PASO 4: Verificar resultado
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'evaluations' 
ORDER BY column_name;`;

  console.log(sql);
  console.log('=====================================');
  console.log('');
  console.log('📝 INSTRUCCIONES:');
  console.log('1. Ve a: https://supabase.com/dashboard/project/jximjwzcivxnoirejlpc');
  console.log('2. Click "SQL Editor"');
  console.log('3. Copia y pega TODO el SQL de arriba');
  console.log('4. Click "Run"');
  console.log('5. Verifica que aparezcan las columnas al final');
}

async function main() {
  await checkTablesStructure();
  await generateCorrectSQL();
}

main().catch(console.error); 