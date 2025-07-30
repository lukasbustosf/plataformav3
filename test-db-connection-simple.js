const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, 'server/.env') });

console.log('🔍 Verificando conexión a Supabase...\n');

// Verificar variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('📋 Variables de entorno:');
console.log(`  SUPABASE_URL: ${supabaseUrl ? '✅ Configurado' : '❌ No configurado'}`);
console.log(`  SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Configurado' : '❌ No configurado'}`);

if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Variables de entorno faltantes. Verifica el archivo server/.env');
    process.exit(1);
}

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseKey);

// Probar conexión
async function testConnection() {
    try {
        console.log('\n🔌 Probando conexión...');
        
        // Intentar una consulta simple
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (error) {
            console.log(`❌ Error de conexión: ${error.message}`);
            console.log(`   Código: ${error.code}`);
            console.log(`   Detalles: ${error.details}`);
        } else {
            console.log('✅ Conexión exitosa a Supabase');
            console.log(`   Datos recibidos: ${JSON.stringify(data)}`);
        }
        
    } catch (err) {
        console.log(`❌ Error de red: ${err.message}`);
    }
}

testConnection(); 