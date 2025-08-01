const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL() {
  try {
    console.log('🚀 Iniciando creación de tablas para experiencias gamificadas...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'create-gamified-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Archivo SQL leído correctamente');
    
    // Ejecutar el SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      
      // Si el RPC no existe, intentar con query directo
      console.log('🔄 Intentando método alternativo...');
      
      // Dividir el SQL en comandos individuales
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);
      
      for (const command of commands) {
        if (command.trim()) {
          console.log(`📝 Ejecutando: ${command.substring(0, 50)}...`);
          
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command });
          
          if (cmdError) {
            console.error(`❌ Error en comando: ${cmdError.message}`);
          } else {
            console.log('✅ Comando ejecutado correctamente');
          }
        }
      }
    } else {
      console.log('✅ SQL ejecutado correctamente');
    }
    
    // Verificar que las tablas se crearon
    console.log('🔍 Verificando creación de tablas...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['gamified_experiences', 'experience_sessions', 'family_participation']);
    
    if (tablesError) {
      console.error('❌ Error verificando tablas:', tablesError);
    } else {
      console.log('📊 Tablas encontradas:', tables.map(t => t.table_name));
      
      if (tables.length === 3) {
        console.log('✅ Todas las tablas creadas correctamente');
      } else {
        console.log('⚠️ Algunas tablas no se crearon:', tables.length, 'de 3');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar el script
executeSQL().then(() => {
  console.log('🎉 Proceso completado');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Error fatal:', error);
  process.exit(1);
}); 