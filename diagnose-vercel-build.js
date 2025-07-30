const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO VERCEL BUILD');
console.log('============================\n');

// Verificar estructura de archivos
const clientFiles = [
  'client/package.json',
  'client/next.config.js',
  'client/tsconfig.json',
  'client/src/app/page.tsx',
  'client/src/store/auth.ts'
];

console.log('📁 Verificando archivos del cliente:');
clientFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  
  if (exists && file.endsWith('.json')) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`     📄 ${file} - Válido`);
    } catch (e) {
      console.log(`     ❌ ${file} - JSON inválido: ${e.message}`);
    }
  }
});

// Verificar .vercelignore
console.log('\n📋 Verificando .vercelignore:');
if (fs.existsSync('.vercelignore')) {
  const ignoreContent = fs.readFileSync('.vercelignore', 'utf8');
  const ignorePatterns = ignoreContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  console.log('  Patrones de ignore:');
  ignorePatterns.forEach(pattern => {
    console.log(`    - ${pattern}`);
  });
} else {
  console.log('  ❌ .vercelignore no existe');
}

// Verificar vercel.json
console.log('\n⚙️ Verificando vercel.json:');
if (fs.existsSync('vercel.json')) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    console.log('  ✅ vercel.json válido:');
    console.log(`    ${JSON.stringify(vercelConfig, null, 2)}`);
  } catch (e) {
    console.log(`  ❌ vercel.json inválido: ${e.message}`);
  }
} else {
  console.log('  ❌ vercel.json no existe');
}

console.log('\n🔧 Recomendaciones:');
console.log('1. Asegúrate de que Root Directory esté configurado como "client" en Vercel');
console.log('2. Verifica que no haya archivos importantes siendo ignorados por .vercelignore');
console.log('3. Confirma que client/package.json tenga todas las dependencias necesarias');
console.log('4. Revisa los logs de build en Vercel para errores específicos'); 