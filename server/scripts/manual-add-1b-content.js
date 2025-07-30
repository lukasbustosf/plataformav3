#!/usr/bin/env node
/**
 * 🎯 EDU21 - Integración Manual de 1° Básico
 * Versión Simple - Agrega contenido directamente sin problemas de formato
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Agregando contenido de 1° Básico manualmente...');

// ===== PASO 1: AGREGAR 3 SKINS PARA 1° BÁSICO =====
const skinSystemFile = path.join(__dirname, '../services/skinSystemData.js');
let skinContent = fs.readFileSync(skinSystemFile, 'utf8');

// Encontrar el último skin en MATH_SKINS_ENG01 y agregar después
const addAfterENG01 = `  }
];`;

const newSkin1B = `  },
  // 🎯 SKIN ADICIONAL PARA 1° BÁSICO
  {
    id: 'skin-1b-farm',
    engine_id: 'ENG01',
    name: '🐄 Granja 1° Básico',
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
      interaction_feedback: 'farm_sound_visual'
    },
    preview_url: '/previews/1b-farm.jpg',
    active: true,
    created_at: new Date().toISOString()
  }
];`;

// Reemplazar el cierre del array con el nuevo skin
skinContent = skinContent.replace(addAfterENG01, newSkin1B);

// Escribir el archivo actualizado
fs.writeFileSync(skinSystemFile, skinContent, 'utf8');
console.log('✅ Agregado 1 skin de 1° básico');

// ===== PASO 2: AGREGAR 2 JUEGOS PARA 1° BÁSICO =====
const gameFile = path.join(__dirname, '../services/allGameDemos.js');
let gameContent = fs.readFileSync(gameFile, 'utf8');

// Encontrar el lugar correcto para agregar - antes del cierre de allDemoQuizzes
const addBeforeClose = `    ]
  }
];`;

const newGames1B = `    ]
  },
  // 🎯 JUEGO DE 1° BÁSICO - MATEMÁTICAS
  {
    quiz_id: '1b-math-counting',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '🧮 Contar 1-10 (1° Básico)',
    description: 'Juego de conteo básico para 1° básico',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 10,
    active: true,
    created_at: new Date().toISOString(),
    engine_id: 'ENG01',
    engine_name: 'Counter/Number Line',
    game_mechanics: {
      type: 'counting_progression',
      engine_features: ['number_line', 'visual_counting'],
      interaction_style: 'click_and_count',
      simplified_ui: true,
      large_buttons: true
    },
    questions: [
      {
        question_id: '1b-counting-1',
        question_order: 1,
        stem_md: '¿Cuántos animales ves? 🐄🐄🐄',
        type: 'multiple_choice',
        options_json: ['2', '3', '4', '5'],
        correct_answer: '3',
        explanation: '¡Correcto! Hay 3 vacas.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  },
  // 🎯 JUEGO DE 1° BÁSICO - LENGUAJE  
  {
    quiz_id: '1b-letters',
    school_id: '550e8400-e29b-41d4-a716-446655440000',
    author_id: 'teacher-123',
    title: '📚 Letras A-E (1° Básico)',
    description: 'Reconocimiento de letras básicas',
    mode: 'manual',
    difficulty: 'easy',
    time_limit_minutes: 8,
    active: true,
    created_at: new Date().toISOString(),
    engine_id: 'ENG05',
    engine_name: 'Text Recognition',
    game_mechanics: {
      type: 'text_recognition',
      engine_features: ['text_display', 'letter_recognition'],
      interaction_style: 'click_and_select',
      simplified_ui: true,
      large_buttons: true
    },
    questions: [
      {
        question_id: '1b-letters-1',
        question_order: 1,
        stem_md: '¿Cuál es la primera letra? A B C',
        type: 'multiple_choice',
        options_json: ['A', 'B', 'C', 'D'],
        correct_answer: 'A',
        explanation: '¡Muy bien! A es la primera letra.',
        points: 1,
        difficulty: 'easy',
        bloom_level: 'Recordar'
      }
    ]
  }
];`;

// Reemplazar el cierre del array con los nuevos juegos
gameContent = gameContent.replace(addBeforeClose, newGames1B);

// Escribir el archivo actualizado
fs.writeFileSync(gameFile, gameContent, 'utf8');
console.log('✅ Agregados 2 juegos de 1° básico');

console.log('');
console.log('🎉 === INTEGRACIÓN MANUAL COMPLETADA ===');
console.log('📊 CONTENIDO AGREGADO:');
console.log('  ✅ 1 skin nuevo (Granja 1° Básico)');
console.log('  ✅ 2 juegos nuevos (Matemáticas + Lenguaje)');
console.log('');
console.log('🔄 Reinicia el servidor para ver los cambios:');
console.log('   taskkill /F /IM node.exe');
console.log('   cd server && npm start'); 
