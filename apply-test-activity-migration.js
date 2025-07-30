#!/usr/bin/env node
/**
 * MIGRACIÓN AUTOMÁTICA A SUPABASE: Test Activity
 * Aplica el script add-test-activity.sql directamente a la base de datos
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Credenciales de Supabase del proyecto
const SUPABASE_URL = 'https://jximjwzcivxnoirejlpc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aW1qd3pjaXZ4bm9pcmVqbHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY1MDcwNSwiZXhwIjoyMDY3MjI2NzA1fQ.SFd5SgXYxHH1SNa4a368vupVTJ6rfl_Z8oEC5jdRr4g';

// Inicializar cliente de Supabase con permisos de administrador
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  console.log('🔧 MIGRACIÓN: Test Activity a Supabase');
  console.log('📅 Fecha:', new Date().toLocaleString());
  console.log('🎯 Target:', SUPABASE_URL);
  
  try {
    // Leer el script SQL de migración
    const sqlPath = path.join(__dirname, 'server/database/add-test-activity.sql');
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`Script SQL no encontrado: ${sqlPath}`);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('📝 Script SQL cargado:', (sqlContent.length / 1024).toFixed(1), 'KB');
    
    // Dividir en statements individuales
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log('📊 Ejecutando', statements.length, 'statements SQL...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim()) {
        try {
          console.log(`\n[${i + 1}/${statements.length}] Ejecutando...`);
          
          // Ejecutar statement usando la función exec_sql
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          });
          
          if (error) {
            console.log(`⚠️  Warning en statement ${i + 1}:`, error.message);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1} ejecutado exitosamente`);
            successCount++;
          }
          
          // Pausa pequeña entre statements
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (err) {
          console.log(`❌ Error en statement ${i + 1}:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n🎉 MIGRACIÓN COMPLETADA:');
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`⚠️  Warnings: ${errorCount}`);
    
    if (errorCount > 0) {
        throw new Error('Algunos statements de la migración fallaron.');
    }
    
    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('');
    console.log('🔄 PRÓXIMOS PASOS:');
    console.log('1. ✅ Base de datos actualizada con la actividad de prueba.');
    console.log('2. 🔄 Si el servidor está corriendo, reinícialo para asegurar que todo esté al día.');
    console.log('3. 🌐 Accede al frontend: http://localhost:3000/lab/activity/test-activity');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERROR EN MIGRACIÓN:', error.message);
    console.log('\n🔧 SOLUCIÓN MANUAL:');
    console.log('1. Ve a: https://supabase.com/dashboard/project/jximjwzcivxnoirejlpc');
    console.log('2. Abre SQL Editor');
    console.log('3. Copia y pega el contenido de: server/database/add-test-activity.sql');
    console.log('4. Haz clic en "Run"');
    console.log('5. Reinicia el servidor si es necesario.');
    
    return false;
  }
}

// Ejecutar migración
console.log('🚀 INICIANDO MIGRACIÓN AUTOMÁTICA...');
applyMigration()
  .then(success => {
    if (success) {
      console.log('\n🎊 ¡MIGRACIÓN EXITOSA! La actividad de prueba debería estar disponible.');
    } else {
      console.log('\n❌ Migración falló. Usa la solución manual.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Error fatal:', error.message);
    process.exit(1);
  });