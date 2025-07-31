const axios = require('axios');

// Simular el entorno de producción
process.env.NODE_ENV = 'production';

// Simular la configuración de Next.js
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

console.log('🔍 Debug de URL base...');
console.log('NEXT_PUBLIC_API_URL:', NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Simular la construcción de URLs como lo hace el frontend
const baseURL = NEXT_PUBLIC_API_URL;
const endpoint = '/lab/activities';

console.log('\n📝 URLs construidas:');
console.log('Base URL:', baseURL);
console.log('Endpoint:', endpoint);
console.log('URL completa:', `${baseURL}${endpoint}`);

// Probar diferentes configuraciones
const testConfigs = [
  {
    name: 'Configuración actual (fallback)',
    baseURL: 'http://localhost:5000',
    endpoint: '/lab/activities'
  },
  {
    name: 'Configuración correcta (Vercel)',
    baseURL: 'https://plataformav3.vercel.app',
    endpoint: '/lab/activities'
  },
  {
    name: 'Configuración directa (Railway)',
    baseURL: 'https://plataforma-edu21-production.up.railway.app',
    endpoint: '/api/lab/activities'
  }
];

console.log('\n🧪 Probando diferentes configuraciones:');
testConfigs.forEach((config, index) => {
  console.log(`\n${index + 1}. ${config.name}`);
  console.log(`   Base URL: ${config.baseURL}`);
  console.log(`   Endpoint: ${config.endpoint}`);
  console.log(`   URL completa: ${config.baseURL}${config.endpoint}`);
});

console.log('\n💡 Solución recomendada:');
console.log('Configurar NEXT_PUBLIC_API_URL=https://plataformav3.vercel.app en Vercel'); 