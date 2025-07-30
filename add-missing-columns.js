#!/usr/bin/env node
/**
 * SOLUCIÓN ESPECÍFICA: Agregar columnas gamificadas a tabla evaluations existente
 * Solo agrega las columnas faltantes sin modificar la estructura existente
 */

const { createClient } = require('@supabase/supabase-js');

// Credenciales de Supabase del proyecto
const SUPABASE_URL = 'https://jximjwzcivxnoirejlpc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aW1qd3pjaXZ4bm9pcmVqbHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY1MDcwNSwiZXhwIjoyMDY3MjI2NzA1fQ.SFd5SgXYxHH1SNa4a368vupVTJ6rfl_Z8oEC5jdRr4g';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addMissingColumns() {
  console.log('🔧 AGREGANDO COLUMNAS GAMIFICADAS A TABLA EVALUATIONS...');
  
  // SQL para agregar solo las columnas faltantes
  const addColumnsSQL = `
    -- Agregar columnas gamificadas a la tabla evaluations existente
    ALTER TABLE evaluations 
    ADD COLUMN IF NOT EXISTS game_format VARCHAR(50),
    ADD COLUMN IF NOT EXISTS engine_id VARCHAR(20),
    ADD COLUMN IF NOT EXISTS skin_theme VARCHAR(50),
    ADD COLUMN IF NOT EXISTS engine_config JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS is_gamified BOOLEAN DEFAULT false;
    
    -- Crear índices para mejor rendimiento
    CREATE INDEX IF NOT EXISTS idx_evaluations_game_format ON evaluations(game_format);
    CREATE INDEX IF NOT EXISTS idx_evaluations_engine_id ON evaluations(engine_id);
    CREATE INDEX IF NOT EXISTS idx_evaluations_skin_theme ON evaluations(skin_theme);
    CREATE INDEX IF NOT EXISTS idx_evaluations_is_gamified ON evaluations(is_gamified);
  `;

  try {
    console.log('📝 Ejecutando SQL para agregar columnas...');
    
    // Intentar con RPC call
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: addColumnsSQL 
    });

    if (error) {
      console.log('⚠️  RPC no disponible, intentando método alternativo...');
      
      // Método alternativo: usar el cliente de PostgreSQL directamente
      console.log('📋 INSTRUCCIONES PARA EJECUCIÓN MANUAL:');
      console.log('');
      console.log('1. Ve a Supabase Dashboard > SQL Editor');
      console.log('2. Copia y pega este SQL:');
      console.log('');
      console.log('----------------------------------------');
      console.log(addColumnsSQL);
      console.log('----------------------------------------');
      console.log('');
      console.log('3. Click "Run" para ejecutar');
      console.log('4. Reinicia el servidor: npm run dev');
      
      return false;
    }

    console.log('✅ Columnas agregadas exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Mostrar instrucciones manuales como fallback
    console.log('');
    console.log('📋 EJECUTA ESTE SQL MANUALMENTE EN SUPABASE:');
    console.log('');
    console.log('----------------------------------------');
    console.log(addColumnsSQL);
    console.log('----------------------------------------');
    
    return false;
  }
}

async function verifyColumns() {
  console.log('🔍 Verificando estructura de la tabla evaluations...');
  
  try {
    // Intentar hacer una consulta simple para verificar las columnas
    const { data, error } = await supabase
      .from('evaluations')
      .select('evaluation_id, title, game_format, engine_id, skin_theme, engine_config')
      .limit(1);

    if (error) {
      console.log('❌ Error verificando columnas:', error.message);
      return false;
    }

    console.log('✅ Todas las columnas gamificadas están presentes!');
    return true;

  } catch (error) {
    console.log('❌ Error en verificación:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 SOLUCIONANDO ERROR DE COLUMNAS FALTANTES\n');
  
  // Paso 1: Verificar estado actual
  const columnsExist = await verifyColumns();
  
  if (columnsExist) {
    console.log('✅ Las columnas ya existen! El problema puede ser otro.');
    console.log('🔄 Reinicia el servidor: cd server && npm run dev');
    return;
  }
  
  // Paso 2: Agregar columnas faltantes
  const success = await addMissingColumns();
  
  if (success) {
    // Paso 3: Verificar nuevamente
    await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
    const verified = await verifyColumns();
    
    if (verified) {
      console.log('🎉 ¡SOLUCIÓN COMPLETADA!');
      console.log('🔄 Ahora reinicia el servidor: cd server && npm run dev');
    }
  }
}

main().catch(console.error); 