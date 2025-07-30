const fs = require('fs');
const path = require('path');

console.log('🔧 VERIFICACIÓN Y CORRECCIÓN DE CREDENCIALES SUPABASE');
console.log('=====================================================\n');

const envPath = path.join(__dirname, 'server', '.env');

// Verificar si existe el archivo .env
if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo server/.env no existe');
    console.log('📝 Creando archivo .env con estructura básica...');
    
    const envContent = `# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Frontend URL for notifications
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado');
} else {
    console.log('✅ Archivo server/.env existe');
    
    // Leer contenido del archivo
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    console.log('\n📋 Variables de entorno actuales:');
    const requiredVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY', 
        'SUPABASE_SERVICE_ROLE_KEY',
        'OPENAI_API_KEY'
    ];
    
    let missingVars = [];
    requiredVars.forEach(varName => {
        const hasVar = lines.some(line => line.startsWith(varName + '='));
        console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`);
        if (!hasVar) {
            missingVars.push(varName);
        }
    });
    
    if (missingVars.length > 0) {
        console.log(`\n⚠️ Variables faltantes: ${missingVars.join(', ')}`);
        console.log('\n🔧 Para obtener las credenciales de Supabase:');
        console.log('1. Ve a: https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a Settings > API');
        console.log('4. Copia:');
        console.log('   - Project URL (SUPABASE_URL)');
        console.log('   - anon public (SUPABASE_ANON_KEY)');
        console.log('   - service_role secret (SUPABASE_SERVICE_ROLE_KEY)');
        console.log('\n5. Edita el archivo server/.env y reemplaza los valores');
    } else {
        console.log('\n✅ Todas las variables requeridas están configuradas');
    }
}

console.log('\n🔍 Verificando formato de URL de Supabase...');
try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const supabaseUrlMatch = envContent.match(/SUPABASE_URL=(.+)/);
    
    if (supabaseUrlMatch) {
        const url = supabaseUrlMatch[1].trim();
        if (url.includes('supabase.co')) {
            console.log('✅ URL de Supabase tiene formato correcto');
        } else {
            console.log('⚠️ URL de Supabase no parece ser válida');
            console.log(`   URL actual: ${url}`);
        }
    }
} catch (error) {
    console.log('❌ Error leyendo archivo .env');
}

console.log('\n📝 INSTRUCCIONES PARA CORREGIR:');
console.log('1. Verifica que tu proyecto de Supabase esté activo');
console.log('2. Obtén las credenciales correctas desde el dashboard');
console.log('3. Actualiza el archivo server/.env');
console.log('4. Ejecuta: node server/test-db-connection.js');
console.log('5. Si funciona, reinicia el servidor: cd server && node index.js'); 