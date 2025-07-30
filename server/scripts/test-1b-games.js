#!/usr/bin/env node
/**
 * 🧪 EDU21 - Testing de Juegos de 1° Básico
 * Valida que todos los juegos generados funcionen correctamente con sus engines
 */

const mathGames = require('./create-1b-math-games');
const languageGames = require('./create-1b-language-games');

// ===== VALIDACIONES TÉCNICAS =====
function validateGameStructure(game) {
  const required = ['game_id', 'oa_code', 'title', 'engine_id', 'grade', 'subject', 'questions'];
  const missing = required.filter(field => !game[field]);
  
  return {
    valid: missing.length === 0,
    missing: missing,
    score: ((required.length - missing.length) / required.length) * 100
  };
}

function validateEngineCompatibility(game) {
  const engineFormats = {
    'ENG01': ['trivia_lightning', 'number_line_race', 'color_match'],
    'ENG02': ['drag_drop_sorting', 'memory_flip', 'picture_bingo'],
    'ENG05': ['word_builder', 'hangman_visual', 'drag_drop_sorting'],
    'ENG06': ['color_match', 'memory_flip', 'picture_bingo'],
    'ENG07': ['story_path', 'escape_room_mini', 'trivia_lightning'],
    'ENG09': ['escape_room_mini', 'simulation_tycoon', 'drag_drop_sorting']
  };
  
  const allowedFormats = engineFormats[game.engine_id] || [];
  const isCompatible = allowedFormats.includes(game.format);
  
  return {
    compatible: isCompatible,
    engine: game.engine_id,
    format: game.format,
    allowed_formats: allowedFormats
  };
}

function validateQuestions(questions) {
  let validQuestions = 0;
  let totalQuestions = questions.length;
  
  questions.forEach(q => {
    if (q.question && q.correct_answer && q.options && q.feedback) {
      validQuestions++;
    }
  });
  
  return {
    total: totalQuestions,
    valid: validQuestions,
    percentage: totalQuestions > 0 ? (validQuestions / totalQuestions) * 100 : 0
  };
}

// ===== VALIDACIONES PEDAGÓGICAS =====
function validatePedagogicalAlignment(game) {
  const gradeComplexity = {
    '1B': { min: 1, max: 3 }
  };
  
  const bloomOrder = ['Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'];
  const bloomLevel = bloomOrder.indexOf(game.bloom_level);
  const complexity = game.complexity;
  
  const gradeRange = gradeComplexity[game.grade];
  const complexityOk = complexity >= gradeRange.min && complexity <= gradeRange.max;
  const bloomOk = bloomLevel >= 0 && bloomLevel <= 2; // Para 1B: Recordar, Comprender, Aplicar
  
  return {
    complexity_ok: complexityOk,
    bloom_ok: bloomOk,
    complexity_value: complexity,
    bloom_level: game.bloom_level,
    recommendations: []
  };
}

// ===== TESTING PRINCIPAL =====
async function testAll1BGames() {
  console.log('🧪 === TESTING COMPLETO DE JUEGOS 1° BÁSICO ===');
  console.log('');
  
  // Generar juegos
  const mathResults = mathGames.generateAll1BMathGames();
  const languageResults = languageGames.generateAll1BLanguageGames();
  
  const allGames = [...mathResults, ...languageResults];
  
  console.log(`📊 Testing ${allGames.length} juegos en total...`);
  console.log('');
  
  // ===== RESULTADOS DE TESTING =====
  const testResults = {
    total_games: allGames.length,
    structure_valid: 0,
    engine_compatible: 0,
    questions_valid: 0,
    pedagogy_aligned: 0,
    failed_games: [],
    warnings: [],
    by_engine: {},
    by_subject: {}
  };
  
  // Testing cada juego
  allGames.forEach((game, index) => {
    console.log(`${index + 1}. Testing: ${game.game_id}`);
    
    // 1. Validar estructura
    const structure = validateGameStructure(game);
    if (structure.valid) {
      testResults.structure_valid++;
      console.log(`   ✅ Estructura: ${structure.score.toFixed(1)}%`);
    } else {
      console.log(`   ❌ Estructura incompleta: ${structure.missing.join(', ')}`);
      testResults.failed_games.push({
        game: game.game_id,
        issue: 'structure',
        details: structure.missing
      });
    }
    
    // 2. Validar compatibilidad con engine
    const engineCheck = validateEngineCompatibility(game);
    if (engineCheck.compatible) {
      testResults.engine_compatible++;
      console.log(`   ✅ Engine: ${engineCheck.engine} + ${engineCheck.format}`);
    } else {
      console.log(`   ⚠️  Engine: ${engineCheck.format} no es óptimo para ${engineCheck.engine}`);
      testResults.warnings.push({
        game: game.game_id,
        issue: 'engine_format',
        suggestion: `Usar: ${engineCheck.allowed_formats.join(' o ')}`
      });
    }
    
    // 3. Validar preguntas
    const questionsCheck = validateQuestions(game.questions);
    if (questionsCheck.percentage >= 80) {
      testResults.questions_valid++;
      console.log(`   ✅ Preguntas: ${questionsCheck.valid}/${questionsCheck.total} (${questionsCheck.percentage.toFixed(1)}%)`);
    } else {
      console.log(`   ❌ Preguntas insuficientes: ${questionsCheck.valid}/${questionsCheck.total}`);
      testResults.failed_games.push({
        game: game.game_id,
        issue: 'questions',
        details: `Solo ${questionsCheck.percentage.toFixed(1)}% válidas`
      });
    }
    
    // 4. Validar alineación pedagógica
    const pedagogyCheck = validatePedagogicalAlignment(game);
    if (pedagogyCheck.complexity_ok && pedagogyCheck.bloom_ok) {
      testResults.pedagogy_aligned++;
      console.log(`   ✅ Pedagogía: Nivel ${pedagogyCheck.complexity_value}, ${pedagogyCheck.bloom_level}`);
    } else {
      console.log(`   ⚠️  Pedagogía: Revisar complejidad/Bloom`);
      testResults.warnings.push({
        game: game.game_id,
        issue: 'pedagogy',
        details: `Complejidad: ${pedagogyCheck.complexity_value}, Bloom: ${pedagogyCheck.bloom_level}`
      });
    }
    
    // Estadísticas por engine y materia
    testResults.by_engine[game.engine_id] = (testResults.by_engine[game.engine_id] || 0) + 1;
    testResults.by_subject[game.subject] = (testResults.by_subject[game.subject] || 0) + 1;
    
    console.log('');
  });
  
  // ===== REPORTE FINAL =====
  console.log('📋 === REPORTE FINAL DE TESTING ===');
  console.log('');
  
  const structurePercentage = (testResults.structure_valid / testResults.total_games) * 100;
  const enginePercentage = (testResults.engine_compatible / testResults.total_games) * 100;
  const questionsPercentage = (testResults.questions_valid / testResults.total_games) * 100;
  const pedagogyPercentage = (testResults.pedagogy_aligned / testResults.total_games) * 100;
  
  console.log(`📊 Estructura completa: ${testResults.structure_valid}/${testResults.total_games} (${structurePercentage.toFixed(1)}%)`);
  console.log(`🎯 Engine compatible: ${testResults.engine_compatible}/${testResults.total_games} (${enginePercentage.toFixed(1)}%)`);
  console.log(`❓ Preguntas válidas: ${testResults.questions_valid}/${testResults.total_games} (${questionsPercentage.toFixed(1)}%)`);
  console.log(`📚 Pedagogía alineada: ${testResults.pedagogy_aligned}/${testResults.total_games} (${pedagogyPercentage.toFixed(1)}%)`);
  console.log('');
  
  // Distribución por engine
  console.log('🎯 Distribución por Engine:');
  Object.entries(testResults.by_engine).forEach(([engine, count]) => {
    console.log(`   ${engine}: ${count} juegos`);
  });
  console.log('');
  
  // Distribución por materia
  console.log('📖 Distribución por Materia:');
  Object.entries(testResults.by_subject).forEach(([subject, count]) => {
    console.log(`   ${subject}: ${count} juegos`);
  });
  console.log('');
  
  // Juegos con problemas
  if (testResults.failed_games.length > 0) {
    console.log('❌ Juegos con problemas críticos:');
    testResults.failed_games.forEach(fail => {
      console.log(`   • ${fail.game}: ${fail.issue} - ${fail.details}`);
    });
    console.log('');
  }
  
  // Advertencias
  if (testResults.warnings.length > 0) {
    console.log('⚠️  Advertencias de optimización:');
    testResults.warnings.forEach(warning => {
      console.log(`   • ${warning.game}: ${warning.issue}`);
      if (warning.suggestion) console.log(`     💡 ${warning.suggestion}`);
      if (warning.details) console.log(`     📝 ${warning.details}`);
    });
    console.log('');
  }
  
  // ===== CALIFICACIÓN FINAL =====
  const overallScore = (structurePercentage + enginePercentage + questionsPercentage + pedagogyPercentage) / 4;
  
  console.log('🏆 === CALIFICACIÓN FINAL ===');
  if (overallScore >= 90) {
    console.log(`🥇 EXCELENTE: ${overallScore.toFixed(1)}% - ¡Lista para producción!`);
  } else if (overallScore >= 75) {
    console.log(`🥈 BUENO: ${overallScore.toFixed(1)}% - Requiere ajustes menores`);
  } else if (overallScore >= 60) {
    console.log(`🥉 ACEPTABLE: ${overallScore.toFixed(1)}% - Necesita mejoras`);
  } else {
    console.log(`❌ NECESITA TRABAJO: ${overallScore.toFixed(1)}% - Revisar completamente`);
  }
  
  console.log('');
  console.log('🚀 === RECOMENDACIONES PARA IMPLEMENTACIÓN ===');
  console.log('1. 🎨 Crear skins visuales específicos para cada engine');
  console.log('2. 🔊 Integrar TTS para los juegos de lenguaje [[memory:2645259]]');
  console.log('3. 🧪 Realizar pruebas con estudiantes reales de 1° básico');
  console.log('4. 📊 Implementar analytics de progreso por OA');
  console.log('5. 🔄 Ajustar dificultad basado en datos de uso');
  
  return testResults;
}

// Exportar funciones
module.exports = {
  testAll1BGames,
  validateGameStructure,
  validateEngineCompatibility,
  validateQuestions,
  validatePedagogicalAlignment
};

// Ejecutar si se llama directamente
if (require.main === module) {
  testAll1BGames()
    .then(results => {
      console.log('');
      console.log('✅ Testing completado exitosamente');
    })
    .catch(error => {
      console.error('❌ Error durante el testing:', error);
      process.exit(1);
    });
} 
