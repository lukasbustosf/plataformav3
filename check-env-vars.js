const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO VARIABLES DE ENTORNO');
console.log('===================================\n');

const envPath = path.join(__dirname, 'server', '.env');

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    
    const vars = {
        'SUPABASE_URL': false,
        'SUPABASE_ANON_KEY': false,
        'SUPABASE_SERVICE_ROLE_KEY': false,
        'OPENAI_API_KEY': false
    };
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, value] = trimmed.split('=');
            if (vars.hasOwnProperty(key)) {
                vars[key] = value && value !== 'your_supabase_url_here' && value !== 'your_supabase_anon_key_here';
            }
        }
    });
    
    console.log('📋 Estado de las variables:');
    Object.entries(vars).forEach(([key, hasValue]) => {
        console.log(`  ${hasValue ? '✅' : '❌'} ${key}`);
    });
    
    const missing = Object.entries(vars).filter(([_, hasValue]) => !hasValue);
    
    if (missing.length > 0) {
        console.log(`\n⚠️ Variables faltantes o con valores por defecto: ${missing.map(([key]) => key).join(', ')}`);
        console.log('\n🔧 Para corregir:');
        console.log('1. Ve a https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto EDU21');
        console.log('3. Ve a Settings > API');
        console.log('4. Copia las credenciales y actualiza server/.env');
    } else {
        console.log('\n✅ Todas las variables están configuradas correctamente');
    }
} else {
    console.log('❌ Archivo server/.env no existe');
} 