#!/usr/bin/env node
/**
 * Test Supabase Connection
 */

const { createClient } = require('@supabase/supabase-js');

// Credenciales de Supabase del proyecto
const SUPABASE_URL = 'https://jximjwzcivxnoirejlpc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4aW1qd3pjaXZ4bm9pcmVqbHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY1MDcwNSwiZXhwIjoyMDY3MjI2NzA1fQ.SFd5SgXYxHH1SNa4a368vupVTJ6rfl_Z8oEC5jdRr4g';

// Inicializar cliente de Supabase con permisos de administrador
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testConnection() {
  console.log('🔧 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
        sql: 'SELECT 1;'
      });
      
      if (error) {
        console.error('❌ Connection test failed:', error);
      } else {
        console.log('✅ Connection test successful:', data);
      }
    
  } catch (error) {
    console.error('💥 Fatal error during connection test:', error);
  }
}

testConnection();
