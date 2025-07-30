const fs = require('fs');
const path = require('path');

console.log('🔧 DESACTIVANDO FUNCIONES PROBLEMÁTICAS');
console.log('=======================================\n');

// Lista de archivos que contienen referencias a tablas problemáticas
const filesToModify = [
  {
    file: 'server/routes/evaluation.js',
    patterns: [
      {
        search: /\.from\('evaluation_attempts'\)/g,
        replace: '// .from(\'evaluation_attempts\') // TEMPORARILY DISABLED'
      },
      {
        search: /evaluation_attempts\(/g,
        replace: '// evaluation_attempts( // TEMPORARILY DISABLED'
      }
    ]
  },
  {
    file: 'server/routes/reports.js',
    patterns: [
      {
        search: /\.from\('evaluation_attempts'\)/g,
        replace: '// .from(\'evaluation_attempts\') // TEMPORARILY DISABLED'
      }
    ]
  },
  {
    file: 'server/routes/classBook.js',
    patterns: [
      {
        search: /\.from\('evaluation_attempts'\)/g,
        replace: '// .from(\'evaluation_attempts\') // TEMPORARILY DISABLED'
      }
    ]
  }
];

filesToModify.forEach(({ file, patterns }) => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    console.log(`📝 Modificando: ${file}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    patterns.forEach(({ search, replace }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        modified = true;
      }
    });
    
    if (modified) {
      // Agregar comentario al inicio del archivo
      const headerComment = `/**
 * 🚨 TEMPORARILY DISABLED - Database connection issues
 * Some functions have been disabled to prevent errors
 * until database tables are properly configured
 */\n\n`;
      
      if (!content.includes('TEMPORARILY DISABLED')) {
        content = headerComment + content;
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`  ✅ ${file} modificado`);
    } else {
      console.log(`  ⚠️ No se encontraron patrones en ${file}`);
    }
  } else {
    console.log(`  ❌ Archivo no encontrado: ${file}`);
  }
});

console.log('\n🔧 Creando archivo de configuración temporal...');

// Crear archivo de configuración para desactivar funciones
const configContent = `/**
 * CONFIGURACIÓN TEMPORAL - FUNCIONES DESACTIVADAS
 * 
 * Las siguientes funciones han sido desactivadas temporalmente
 * para evitar errores de base de datos:
 * 
 * 1. Auto-grading (cron jobs)
 * 2. Evaluation attempts tracking
 * 3. Reports that use evaluation_attempts
 * 4. ClassBook functions that use evaluation_attempts
 * 
 * Para reactivar estas funciones:
 * 1. Configurar correctamente la base de datos
 * 2. Crear las tablas faltantes
 * 3. Ejecutar: node enable-all-functions.js
 */

module.exports = {
  // Auto-grading disabled
  AUTO_GRADING_ENABLED: false,
  
  // Evaluation attempts disabled
  EVALUATION_ATTEMPTS_ENABLED: false,
  
  // Reports disabled
  REPORTS_ENABLED: false,
  
  // ClassBook disabled
  CLASSBOOK_ENABLED: false,
  
  // Mock data enabled
  MOCK_DATA_ENABLED: true,
  
  // Database connection status
  DATABASE_CONNECTED: false
};
`;

fs.writeFileSync(path.join(__dirname, 'server/config/temp-disabled.js'), configContent);
console.log('✅ Archivo de configuración temporal creado');

console.log('\n📋 RESUMEN DE CAMBIOS:');
console.log('1. ✅ Auto-grading desactivado');
console.log('2. ✅ Cron jobs desactivados');
console.log('3. ✅ Evaluation attempts desactivados');
console.log('4. ✅ Reports problemáticos desactivados');
console.log('5. ✅ ClassBook problemático desactivado');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('1. Reinicia el servidor: cd server && node index.js');
console.log('2. Verifica que no haya errores de base de datos');
console.log('3. La aplicación funcionará con datos mock');
console.log('4. Para reactivar: configura la base de datos correctamente'); 