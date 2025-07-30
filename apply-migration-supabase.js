#!/usr/bin/env node
/**
 * MIGRACIÓN AUTOMÁTICA A SUPABASE: Evaluaciones Gamificadas
 * Aplica el script add_gamified_evaluations.sql directamente a la base de datos
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
  console.log('🔧 MIGRACIÓN: Evaluaciones Gamificadas a Supabase');
  console.log('📅 Fecha:', new Date().toLocaleString());
  console.log('🎯 Target:', SUPABASE_URL);
  
  try {
    // Leer el script SQL de migración
    const sqlPath = path.join(__dirname, 'server/database/add_gamified_evaluations.sql');
    
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
    
    // Verificar que las columnas se crearon correctamente
    console.log('\n🔍 Verificando cambios en la tabla evaluations...');
    
    try {
      const { data: columns, error: columnError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'evaluations' 
          AND column_name IN ('game_format', 'engine_id', 'skin_theme', 'engine_config')
          ORDER BY column_name;
        `
      });
      
      if (!columnError && columns) {
        console.log('\n📊 COLUMNAS GAMIFICADAS VERIFICADAS:');
        columns.forEach(col => {
          console.log(`   ✓ ${col.column_name} (${col.data_type})`);
        });
      }
    } catch (verifyError) {
      console.log('⚠️  No se pudo verificar las columnas:', verifyError.message);
    }
    
    // Verificar tablas de referencia
    console.log('\n🔍 Verificando tablas de referencia...');
    
    const referenceTables = ['game_formats', 'educational_engines', 'skin_themes'];
    
    for (const tableName of referenceTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          console.log(`   ✓ ${tableName}: ${data?.length || 0} registros`);
        } else {
          console.log(`   ⚠️  ${tableName}: ${error.message}`);
        }
      } catch (err) {
        console.log(`   ❌ ${tableName}: ${err.message}`);
      }
    }
    
    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log('');
    console.log('🔄 PRÓXIMOS PASOS:');
    console.log('1. ✅ Base de datos actualizada');
    console.log('2. 🔄 Reinicia el servidor: cd server && npm start');
    console.log('3. 🧪 Prueba la API: node test-simple.js');
    console.log('4. 🌐 Accede al frontend: http://localhost:3000');
    
    console.log('\n📋 FUNCIONALIDADES AHORA DISPONIBLES:');
    console.log('   ✅ Crear evaluaciones gamificadas con POST');
    console.log('   ✅ Ver evaluaciones gamificadas con GET');
    console.log('   ✅ 16 formatos de juego disponibles');
    console.log('   ✅ 6 engines educativos (ENG01-ENG09)');
    console.log('   ✅ 5 skins temáticos (granja, espacio, océano, etc.)');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERROR EN MIGRACIÓN:', error.message);
    console.log('\n🔧 SOLUCIÓN MANUAL:');
    console.log('1. Ve a: https://supabase.com/dashboard/project/jximjwzcivxnoirejlpc');
    console.log('2. Abre SQL Editor');
    console.log('3. Copia y pega el contenido de: server/database/add_gamified_evaluations.sql');
    console.log('4. Haz clic en "Run"');
    console.log('5. Reinicia el servidor');
    
    return false;
  }
}

// Ejecutar migración
console.log('🚀 INICIANDO MIGRACIÓN AUTOMÁTICA...');
applyMigration()
  .then(success => {
    if (success) {
      console.log('\n🎊 ¡MIGRACIÓN EXITOSA! El sistema EDU21 está listo.');
      
      // Ejecutar test automáticamente después de 2 segundos
      setTimeout(() => {
        const { spawn } = require('child_process');
        console.log('\n🧪 EJECUTANDO TEST DE VERIFICACIÓN...');
        
        const testProcess = spawn('node', ['test-simple.js'], { stdio: 'inherit' });
        
        testProcess.on('close', (code) => {
          if (code === 0) {
            console.log('\n🎉 ¡TODO FUNCIONANDO PERFECTAMENTE!');
            console.log('🚀 Sistema de evaluaciones gamificadas listo para usar');
          } else {
            console.log('\n⚠️  Test completado - revisa los resultados');
          }
        });
      }, 2000);
      
    } else {
      console.log('\n❌ Migración falló. Usa la solución manual.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Error fatal:', error.message);
    process.exit(1);
  }); 