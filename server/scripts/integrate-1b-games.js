#!/usr/bin/env node
/**
 * 🎮 EDU21 - Integrador de Juegos 1° Básico al Sistema
 * Convierte y agrega nuestros 17 juegos de 1B al sistema de demos existente
 */

const fs = require('fs');
const path = require('path');
const gamesMath1B = require('./create-1b-math-games');
const gamesLang1B = require('./create-1b-language-games');

// ===== CONVERTIR NUESTROS JUEGOS AL FORMATO DEL SISTEMA =====
function convertGameToSystemFormat(game1B, index) {
  return {
    // ID único para el sistema
    quiz_id: `1b-game-${index.toString().padStart(3, '0')}`,
    school_id: '550e8400-e29b-41d4-a716-446655440000', // Demo school
    author_id: 'teacher-123', // Demo teacher
    
    // Información básica del juego
    title: `🎯 ${game1B.title}`,
    description: `${game1B.description} (Diseñado para 1° Básico)`,
    mode: 'manual',
    difficulty: 'easy', // Específico para 1B
    time_limit_minutes: Math.min(game1B.estimated_duration, 15), // Max 15 min para 1B
    active: true,
    created_at: new Date().toISOString(),
    
    // 🎮 INTEGRACIÓN CON ENGINES
    engine_id: game1B.engine_id,
    engine_name: game1B.engine_name,
    game_mechanics: {
      type: mapEngineToMechanics(game1B.engine_id),
      engine_features: getEngineFeatures(game1B.engine_id),
      interaction_style: getInteractionStyle(game1B.engine_id),
      // Específico para 1° básico
      simplified_ui: true,
      large_buttons: true,
      audio_support: true,
      visual_hints: true
    },
    
    // 📚 INFORMACIÓN PEDAGÓGICA
    educational_info: {
      grade_level: '1B',
      subject_code: game1B.subject,
      oa_codes: game1B.oa_alignment,
      bloom_levels: game1B.questions.map(q => q.bloom_level),
      complexity_avg: game1B.complexity_level,
      skills_developed: game1B.skills_developed || []
    },
    
    // 🔧 CONFIGURACIÓN ESPECÍFICA PARA 1B
    grade_config: {
      reading_support: game1B.subject === 'LEN', // TTS para lenguaje
      number_range: game1B.subject === 'MAT' ? '1-20' : null,
      font_size: 'large',
      button_spacing: 'wide',
      animation_speed: 'slow',
      error_patience: 3, // 3 intentos antes de mostrar ayuda
      celebration_level: 'high' // Muchas celebraciones para motivar
    },
    
    // ❓ PREGUNTAS DEL JUEGO
    questions: game1B.questions.map((q, qIndex) => ({
      question_id: `1b-q-${index}-${qIndex + 1}`,
      question_order: qIndex + 1,
      stem_md: q.question,
      type: 'multiple_choice',
      options_json: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation || generateExplanation(q),
      points: Math.min(q.points || 1, 2), // Max 2 puntos para 1B
      difficulty: 'easy',
      bloom_level: q.bloom_level || 'Recordar',
      // Configuración específica para 1B
      audio_enabled: game1B.subject === 'LEN',
      visual_hints: true,
      retry_allowed: true
    }))
  };
}

// ===== FUNCIONES DE MAPEO =====
function mapEngineToMechanics(engineId) {
  const mapping = {
    'ENG01': 'counting_progression',
    'ENG02': 'drag_drop_sorting', 
    'ENG05': 'text_recognition',
    'ENG06': 'audio_visual_matching',
    'ENG07': 'reading_progression'
  };
  return mapping[engineId] || 'generic_quiz';
}

function getEngineFeatures(engineId) {
  const features = {
    'ENG01': ['number_line', 'visual_counting', 'progression_tracking'],
    'ENG02': ['drag_drop', 'visual_sorting', 'immediate_feedback'],
    'ENG05': ['text_display', 'letter_recognition', 'visual_cues'],
    'ENG06': ['audio_playback', 'sound_matching', 'phonetic_support'],
    'ENG07': ['reading_flow', 'comprehension_check', 'fluency_tracking']
  };
  return features[engineId] || ['basic_interaction'];
}

function getInteractionStyle(engineId) {
  const styles = {
    'ENG01': 'click_and_count',
    'ENG02': 'drag_and_drop',
    'ENG05': 'click_and_select',
    'ENG06': 'listen_and_match',
    'ENG07': 'read_and_respond'
  };
  return styles[engineId] || 'click_interaction';
}

function generateExplanation(question) {
  return `¡Muy bien! ${question.correct_answer} es la respuesta correcta.`;
}

// ===== FUNCIÓN PRINCIPAL =====
async function integrateGames1B() {
  console.log('🎮 === INTEGRANDO JUEGOS 1° BÁSICO AL SISTEMA ===');
  console.log('');
  
  // 1. Generar nuestros juegos de 1B
  const mathGames = gamesMath1B.generateAll1BMathGames();
  const langGames = gamesLang1B.generateAll1BLanguageGames();
  const allGames1B = [...mathGames, ...langGames];
  
  console.log(`📊 Juegos de 1B encontrados:`);
  console.log(`   🧮 Matemáticas: ${mathGames.length} juegos`);
  console.log(`   📚 Lenguaje: ${langGames.length} juegos`);
  console.log(`   📝 Total: ${allGames1B.length} juegos`);
  console.log('');
  
  // 2. Convertir al formato del sistema
  const convertedGames = allGames1B.map((game, index) => 
    convertGameToSystemFormat(game, index + 1)
  );
  
  console.log(`🔄 Juegos convertidos al formato del sistema: ${convertedGames.length}`);
  console.log('');
  
  // 3. Agrupar por subject
  const gamesBySubject = convertedGames.reduce((acc, game) => {
    const subject = game.educational_info.subject_code;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(game);
    return acc;
  }, {});
  
  console.log('📊 Distribución por Materia:');
  Object.entries(gamesBySubject).forEach(([subject, games]) => {
    console.log(`   ${subject}: ${games.length} juegos`);
  });
  console.log('');
  
  // 4. Agrupar por engine
  const gamesByEngine = convertedGames.reduce((acc, game) => {
    if (!acc[game.engine_id]) acc[game.engine_id] = [];
    acc[game.engine_id].push(game);
    return acc;
  }, {});
  
  console.log('📊 Distribución por Engine:');
  Object.entries(gamesByEngine).forEach(([engine, games]) => {
    console.log(`   ${engine}: ${games.length} juegos`);
  });
  console.log('');
  
  // 5. Leer el archivo allGameDemos.js actual
  const demosPath = path.join(__dirname, '../services/allGameDemos.js');
  let currentContent = fs.readFileSync(demosPath, 'utf8');
  
  // 6. Generar código para insertar
  let newGamesCode = '\\n// 🎮 JUEGOS ESPECÍFICOS PARA 1° BÁSICO (Generados automáticamente)\\n';
  newGamesCode += 'const GAMES_1B = [\\n';
  
  convertedGames.forEach((game, index) => {
    newGamesCode += '  {\\n';
    newGamesCode += `    quiz_id: '${game.quiz_id}',\\n`;
    newGamesCode += `    school_id: '${game.school_id}',\\n`;
    newGamesCode += `    author_id: '${game.author_id}',\\n`;
    newGamesCode += `    title: '${game.title}',\\n`;
    newGamesCode += `    description: '${game.description}',\\n`;
    newGamesCode += `    mode: '${game.mode}',\\n`;
    newGamesCode += `    difficulty: '${game.difficulty}',\\n`;
    newGamesCode += `    time_limit_minutes: ${game.time_limit_minutes},\\n`;
    newGamesCode += `    active: ${game.active},\\n`;
    newGamesCode += `    created_at: '${game.created_at}',\\n`;
    newGamesCode += `    engine_id: '${game.engine_id}',\\n`;
    newGamesCode += `    engine_name: '${game.engine_name}',\\n`;
    newGamesCode += `    game_mechanics: ${JSON.stringify(game.game_mechanics, null, 6)},\\n`;
    newGamesCode += `    educational_info: ${JSON.stringify(game.educational_info, null, 6)},\\n`;
    newGamesCode += `    grade_config: ${JSON.stringify(game.grade_config, null, 6)},\\n`;
    newGamesCode += `    questions: ${JSON.stringify(game.questions, null, 6)}\\n`;
    newGamesCode += '  }' + (index < convertedGames.length - 1 ? ',' : '') + '\\n';
  });
  
  newGamesCode += '];\\n';
  
  // 7. Buscar donde insertar (antes de module.exports)
  const exportsIndex = currentContent.indexOf('module.exports');
  if (exportsIndex === -1) {
    throw new Error('No se encontró module.exports en el archivo');
  }
  
  // Insertar nuestros juegos antes de exports
  const beforeExports = currentContent.substring(0, exportsIndex);
  const afterExports = currentContent.substring(exportsIndex);
  
  let newContent = beforeExports + newGamesCode + '\\n' + afterExports;
  
  // 8. Actualizar exports para incluir nuestros juegos
  newContent = newContent.replace(
    /module\.exports = \{([^}]+)\}/,
    (match, current) => {
      return `module.exports = {${current},\\n  GAMES_1B,\\n  getAllDemoQuizzes: () => [...allDemoQuizzes, ...GAMES_1B]\\n}`;
    }
  );
  
  // 9. Guardar el archivo actualizado
  fs.writeFileSync(demosPath, newContent, 'utf8');
  
  console.log('✅ === INTEGRACIÓN COMPLETADA ===');
  console.log(`📁 Archivo actualizado: ${demosPath}`);
  console.log(`🎮 Juegos agregados: ${convertedGames.length}`);
  console.log('');
  
  // 10. Generar resumen para verificación
  console.log('🔍 === VERIFICACIÓN ===');
  console.log('1. Los juegos ahora están disponibles en el sistema');
  console.log('2. Puedes aplicar skins de 1B a estos juegos');
  console.log('3. Cada juego está optimizado para niños de 6-7 años');
  console.log('');
  
  console.log('🎯 Juegos de 1B por engine:');
  Object.entries(gamesByEngine).forEach(([engine, games]) => {
    console.log(`   ${engine}: ${games.length} juegos`);
  });
  
  return {
    total_added: convertedGames.length,
    by_subject: gamesBySubject,
    by_engine: gamesByEngine,
    file_updated: demosPath
  };
}

// Exportar funciones
module.exports = {
  integrateGames1B,
  convertGameToSystemFormat
};

// Ejecutar si se llama directamente
if (require.main === module) {
  integrateGames1B()
    .then(result => {
      console.log('');
      console.log('🎉 ¡JUEGOS DE 1° BÁSICO INTEGRADOS EXITOSAMENTE!');
      console.log('');
      console.log('📋 PRÓXIMOS PASOS:');
      console.log('1. 🔄 Los skins y juegos están listos');
      console.log('2. 🌐 Ve a: http://localhost:3000/teacher/skins');
      console.log('3. 🎮 Ve a: http://localhost:3000/teacher/games o /demos');
      console.log('4. 🧪 Selecciona un juego de 1B y aplica un skin');
    })
    .catch(error => {
      console.error('❌ Error durante la integración:', error);
      process.exit(1);
    });
} 
