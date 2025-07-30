const fs = require('fs');
const path = require('path');

// Leer .vercelignore
const vercelignore = fs.readFileSync('.vercelignore', 'utf8');
const ignorePatterns = vercelignore.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log('🔍 DIAGNÓSTICO VERCEL IGNORE');
console.log('============================\n');

console.log('📋 Patrones de .vercelignore:');
ignorePatterns.forEach(pattern => {
  console.log(`  - ${pattern}`);
});

console.log('\n📁 Archivos importantes del cliente:');
const clientFiles = [
  'client/package.json',
  'client/package-lock.json',
  'client/tsconfig.json',
  'client/next.config.js',
  'client/next-env.d.ts',
  'client/src/app/page.tsx',
  'client/src/store/auth.ts'
];

clientFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n🔧 Recomendaciones:');
console.log('1. Verificar que client/package.json existe');
console.log('2. Verificar que client/next.config.js existe');
console.log('3. Verificar que client/src/ existe');
console.log('4. Asegurar que .vercelignore no ignore archivos del cliente'); 