#!/usr/bin/env node
/**
 * 🔧 EDU21 - Integración SEGURA de Contenido 1° Básico
 * Versión 2.0 - Sin problemas de formato, integración directa y controlada
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 === INICIANDO INTEGRACIÓN SEGURA DE CONTENIDO 1° BÁSICO ===');

// ===== FUNCIONES DE UTILIDAD =====
function backupFile(filePath) {
  const backupPath = filePath + '.backup_' + Date.now();
  fs.copyFileSync(filePath, backupPath);
  console.log(`✅ Backup creado: ${backupPath}`);
  return backupPath;
}

function addSkinsToFile() {
  const skinFilePath = path.join(__dirname, '../services/skinSystemData.js');
  console.log(`📝 Procesando archivo: ${skinFilePath}`);
  
  // Crear backup antes de modificar
  backupFile(skinFilePath);
  
  // Leer el archivo actual
  let content = fs.readFileSync(skinFilePath, 'utf8');
  
  // Agregar los nuevos arrays de skins ANTES de la clase
  const newSkinsArrays = `
// 🎯 SKINS ESPECÍFICOS PARA 1° BÁSICO
const SKINS_1B_ENG01 = [
  {
    id: 'skin-1b-001',
    engine_id: 'ENG01',
    name: '🐄 Granja Divertida - Counter',
    description: 'Conteo con animales de granja para 1° básico',
    category: 'animals',
    subject: 'MAT',
    grades: ['1B'],
    theme: {
      primary_color: '#F59E0B',
      secondary_color: '#92400E',
      accent_color: '#FDE047',
      background: 'linear-gradient(135deg, #92400e, #f59e0b)',
      font_family: 'Fredoka One',
      animations: 'farm_bounce'
    },
    elements: {
      counters: ['🐄', '🐷', '🐔', '🐑', '🐰'],
      number_line_style: 'farm_path',
      progress_indicators: 'farm_progression',
      sound_effects: 'farm_sounds',
      visual_effects: 'hay_particles'
    },
    engine_config: {
      animation_speed: 'slow',
      counter_style: 'bouncing_animals',
      number_display: 'large_friendly_font',
      interaction_feedback: 'farm_sound_visual',
      difficulty_level: 'beginner',
      simplified_ui: true,
      large_buttons: true,
      high_contrast: true
    },
    preview_url: '/previews/1b-farm-fun.jpg',
    active: true,
    created_at: new Date().toISOString()
  }
];

const SKINS_1B_ENG02 = [
  {
    id: 'skin-1b-002',
    engine_id: 'ENG02',
    name: '🦊 Amigos del Bosque - Drag Drop',
    description: 'Drag & drop con animales del bosque para 1° básico',
    category: 'nature',
    subject: 'MAT',
    grades: ['1B'],
    theme: {
      primary_color: '#16A34A',
      secondary_color: '#14532D',
      accent_color: '#84CC16',
      background: 'linear-gradient(135deg, #14532d, #16a34a)',
      font_family: 'Comfortaa',
      animations: 'forest_breeze'
    },
    elements: {
      numbers: ['🦊', '🐻', '🦝', '🐿️', '🦉'],
      drag_zones: 'forest_clearings',
      progress_indicators: 'leaf_trail',
      sound_effects: 'forest_sounds',
      visual_effects: 'falling_leaves'
    },
    engine_config: {
      drag_sensitivity: 'high',
      drop_zone_style: 'highlighted_forest_areas',
      number_display: 'large_friendly_font',
      interaction_feedback: 'nature_sound_visual',
      difficulty_level: 'beginner',
      simplified_ui: true,
      large_buttons: true,
      high_contrast: true
    },
    preview_url: '/previews/1b-forest-friends.jpg',
    active: true,
    created_at: new Date().toISOString()
  }
];

const SKINS_1B_ENG05 = [
  {
    id: 'skin-1b-003',
    engine_id: 'ENG05',
    name: '🐠 Mundo Submarino - Text Recognition',
    description: 'Reconocimiento de texto con tema submarino para 1° básico',
    category: 'ocean',
    subject: 'LEN',
    grades: ['1B'],
    theme: {
      primary_color: '#3498DB',
      secondary_color: '#1ABC9C',
      accent_color: '#F1C40F',
      background: 'linear-gradient(135deg, #1abc9c, #3498db)',
      font_family: 'Comfortaa',
      animations: 'wave_motion'
    },
    elements: {
      letters: ['🐠', '🐙', '🐟', '🐢', '⭐'],
      text_display: 'underwater_bubble',
      progress_indicators: 'bubble_trail',
      sound_effects: 'ocean_ambience',
      visual_effects: 'bubble_particles'
    },
    engine_config: {
      text_size: 'extra_large',
      recognition_sensitivity: 'high',
      feedback_style: 'ocean_glow',
      interaction_feedback: 'splash_visual',
      difficulty_level: 'beginner',
      simplified_ui: true,
      large_buttons: true,
      high_contrast: true
    },
    preview_url: '/previews/1b-underwater-world.jpg',
    active: true,
    created_at: new Date().toISOString()
  }
];

`;

  // Insertar antes de la clase SkinSystemService
  const classPosition = content.indexOf('class SkinSystemService');
  if (classPosition === -1) {
    throw new Error('No se encontró la clase SkinSystemService');
  }
  
  const beforeClass = content.substring(0, classPosition);
  const fromClass = content.substring(classPosition);
  
  content = beforeClass + newSkinsArrays + fromClass;
  
  // Actualizar el constructor para incluir los nuevos arrays
  content = content.replace(
    'this.allSkins = [',
    `this.allSkins = [
      ...SKINS_1B_ENG01,
      ...SKINS_1B_ENG02,
      ...SKINS_1B_ENG05,`
  );
  
  // Escribir el archivo actualizado
  fs.writeFileSync(skinFilePath, content, 'utf8');
  console.log('✅ Skins de 1° básico agregados correctamente');
}

function addGamesToFile() {
  const gameFilePath = path.join(__dirname, '../services/allGameDemos.js');
  console.log(`📝 Procesando archivo: ${gameFilePath}`);
  
  // Crear backup antes de modificar
  backupFile(gameFilePath);
  
  // Leer el archivo actual
  let content = fs.readFileSync(gameFilePath, 'utf8');
  
  // Agregar juegos nuevos al array existente
  const newGames = `  // 🎯 JUEGOS DE 1° BÁSICO - MATEMÁTICAS
  {
    quiz_id: '1b-math-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🧮 Contar del 1 al 20 - 1° Básico',
    description: 'Juego de conteo básico con números del 1 al 20',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 10,
    active: true,
    created_at: new Date().toISOString(),
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    game_mechanics: {
      type: 'counting_progression',
      engine_features: ['number_line', 'visual_counting', 'progression_tracking'],
      interaction_style: 'click_and_count',
      simplified_ui: true,
      large_buttons: true,
      audio_support: true,
      visual_hints: true
    },
    questions: [
      {
        question_id: '1b-q-1',
        question_order: 1,
        stem_md: '¿Cuál número viene después del 5?',
        type: 'multiple_choice',
        options_json: ['4', '6', '7', '8'],
        correct_answer: '6',
        explanation: '¡Muy bien! 6 es el número que viene después del 5.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
  // 🎯 JUEGOS DE 1° BÁSICO - LENGUAJE
  {
    quiz_id: '1b-lang-001',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📚 Reconocer Letras - 1° Básico',
    description: 'Juego de reconocimiento de letras del abecedario',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 10,
    active: true,
    created_at: new Date().toISOString(),
    engine_id: 'ENG05',
    engine_name: 'Text Recognition',
    game_mechanics: {
      type: 'text_recognition',
      engine_features: ['text_display', 'letter_recognition', 'visual_cues'],
      interaction_style: 'click_and_select',
      simplified_ui: true,
      large_buttons: true,
      audio_support: true,
      visual_hints: true
    },
    questions: [
      {
        question_id: '1b-q-lang-1',
        question_order: 1,
        stem_md: '¿Cuál es la primera letra del abecedario?',
        type: 'multiple_choice',
        options_json: ['A', 'B', 'C', 'D'],
        correct_answer: 'A',
        explanation: '¡Correcto! A es la primera letra del abecedario.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },`;
  
  // Insertar antes del cierre del array allDemoQuizzes
  const closingBracket = content.lastIndexOf('];');
  if (closingBracket === -1) {
    throw new Error('No se encontró el cierre del array allDemoQuizzes');
  }
  
  const beforeClosing = content.substring(0, closingBracket);
  const afterClosing = content.substring(closingBracket);
  
  content = beforeClosing + newGames + '\n' + afterClosing;
  
  // Escribir el archivo actualizado
  fs.writeFileSync(gameFilePath, content, 'utf8');
  console.log('✅ Juegos de 1° básico agregados correctamente');
}

// ===== EJECUCIÓN PRINCIPAL =====
async function main() {
  try {
    console.log('📊 Paso 1: Agregando skins de 1° básico...');
    addSkinsToFile();
    
    console.log('🎮 Paso 2: Agregando juegos de 1° básico...');
    addGamesToFile();
    
    console.log('🎉 === INTEGRACIÓN COMPLETADA EXITOSAMENTE ===');
    console.log('');
    console.log('📈 RESUMEN:');
    console.log('✅ 3 skins nuevos para 1° básico agregados');
    console.log('✅ 2 juegos nuevos para 1° básico agregados');
    console.log('✅ Archivos de backup creados automáticamente');
    console.log('');
    console.log('🔄 PRÓXIMO PASO: Reinicia el servidor para ver los cambios');
    console.log('   cd server && npm start');
    
  } catch (error) {
    console.error('❌ Error durante la integración:', error.message);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main, addSkinsToFile, addGamesToFile }; 
