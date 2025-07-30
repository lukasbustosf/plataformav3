#!/usr/bin/env node
/**
 * 🎮 EDU21 - Generador de Juegos de Matemáticas para 1° Básico
 * Usa engines ENG01 (Counter/Number Line) y ENG02 (Drag-Drop Numbers)
 * Mapea OA específicos de MA01OA01-MA01OA20
 */

const { v4: uuidv4 } = require('uuid');

// ===== CONFIGURACIÓN DE ENGINES PARA 1B =====
const ENGINES_1B_MATH = {
  'ENG01': {
    name: 'Counter/Number Line',
    mechanics: ['count', 'increment', 'decrement', 'position_on_line'],
    formats: ['trivia_lightning', 'number_line_race', 'color_match'],
    ideal_oa: ['MA01OA01', 'MA01OA02', 'MA01OA03', 'MA01OA11'], // Conteo, ordinales, lectura números, patrones
    config: {
      max_range: 20, // Para 1B trabajamos 0-20
      min_range: 0,
      step_size: 1,
      difficulty_1b: 'easy'
    }
  },
  'ENG02': {
    name: 'Drag-Drop Numbers',
    mechanics: ['drag', 'drop', 'sort', 'group', 'match'],
    formats: ['drag_drop_sorting', 'memory_flip', 'picture_bingo'],
    ideal_oa: ['MA01OA04', 'MA01OA09', 'MA01OA10', 'MA01OA06'], // Comparar, operaciones, composición
    config: {
      max_items: 6, // Para 1B máximo 6 elementos
      operations: ['sort_ascending', 'simple_addition', 'group_by_value'],
      difficulty_1b: 'easy'
    }
  }
};

// ===== OA ESPECÍFICOS DE MATEMÁTICA 1B =====
const MATH_1B_OA = [
  {
    code: 'MA01OA01',
    title: 'Contar números del 0 al 100',
    description: 'Contar de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10',
    bloom: 'Recordar',
    complexity: 1,
    engine: 'ENG01',
    content_focus: 'counting_sequences'
  },
  {
    code: 'MA01OA02', 
    title: 'Números ordinales 1º al 10º',
    description: 'Identificar orden usando números ordinales',
    bloom: 'Recordar',
    complexity: 1,
    engine: 'ENG01',
    content_focus: 'ordinal_numbers'
  },
  {
    code: 'MA01OA03',
    title: 'Leer números 0 al 20',
    description: 'Representar en forma concreta, pictórica y simbólica',
    bloom: 'Recordar', 
    complexity: 1,
    engine: 'ENG01',
    content_focus: 'number_recognition'
  },
  {
    code: 'MA01OA04',
    title: 'Comparar y ordenar 0-20',
    description: 'De menor a mayor y viceversa con material concreto',
    bloom: 'Comprender',
    complexity: 2,
    engine: 'ENG02',
    content_focus: 'number_comparison'
  },
  {
    code: 'MA01OA06',
    title: 'Componer/descomponer 0-20',
    description: 'De manera aditiva en forma concreta y pictórica',
    bloom: 'Recordar',
    complexity: 1,
    engine: 'ENG02',
    content_focus: 'number_composition'
  },
  {
    code: 'MA01OA09',
    title: 'Adición y sustracción 0-20',
    description: 'Comprender progresivamente las operaciones',
    bloom: 'Aplicar',
    complexity: 3,
    engine: 'ENG02',
    content_focus: 'basic_operations'
  },
  {
    code: 'MA01OA11',
    title: 'Patrones repetitivos',
    description: 'Reconocer, crear y continuar patrones hasta el 20',
    bloom: 'Recordar',
    complexity: 1,
    engine: 'ENG01',
    content_focus: 'pattern_recognition'
  }
];

// ===== GENERADOR DE JUEGOS POR OA =====
function generateMathGame(oa) {
  const engine = ENGINES_1B_MATH[oa.engine];
  const gameFormats = engine.formats;
  
  // Seleccionar formato óptimo según el OA
  let selectedFormat = gameFormats[0]; // Default
  
  if (oa.content_focus === 'counting_sequences') {
    selectedFormat = 'number_line_race';
  } else if (oa.content_focus === 'number_comparison') {
    selectedFormat = 'drag_drop_sorting';
  } else if (oa.content_focus === 'basic_operations') {
    selectedFormat = 'trivia_lightning';
  }

  const game = {
    game_id: `1b-math-${oa.code.toLowerCase()}`,
    oa_code: oa.code,
    title: `🧮 ${oa.title}`,
    description: `Juego de ${oa.description} usando ${engine.name}`,
    engine_id: oa.engine,
    engine_name: engine.name,
    format: selectedFormat,
    grade: '1B',
    subject: 'MAT',
    bloom_level: oa.bloom,
    complexity: oa.complexity,
    estimated_duration: 10, // minutos
    max_players: 25,
    settings: {
      engine_config: engine.config,
      game_mechanics: engine.mechanics,
      difficulty: 'beginner',
      tts_enabled: true,
      accessibility: {
        keyboard_navigation: true,
        high_contrast: true,
        large_buttons: true
      }
    },
    questions: generateQuestionsForOA(oa),
    created_for: 'primero_basico',
    created_at: new Date().toISOString()
  };

  return game;
}

// ===== GENERADOR DE PREGUNTAS POR OA =====
function generateQuestionsForOA(oa) {
  const questions = [];
  
  switch(oa.content_focus) {
    case 'counting_sequences':
      // MA01OA01 - Contar secuencias
      questions.push(
        {
          id: uuidv4(),
          question: "¿Cuál número viene después del 5?",
          type: "multiple_choice",
          options: ["4", "6", "7", "8"],
          correct_answer: "6",
          feedback: "¡Correcto! Después del 5 viene el 6.",
          engine_data: { number_line_position: 5, next_step: 6 }
        },
        {
          id: uuidv4(),
          question: "Cuenta de 2 en 2: 2, 4, 6, ¿?",
          type: "multiple_choice", 
          options: ["7", "8", "9", "10"],
          correct_answer: "8",
          feedback: "¡Excelente! Siguiendo la secuencia de 2 en 2: 2, 4, 6, 8",
          engine_data: { sequence_type: "by_2", current_position: 6 }
        }
      );
      break;
      
    case 'ordinal_numbers':
      // MA01OA02 - Números ordinales
      questions.push(
        {
          id: uuidv4(),
          question: "¿Quién está en SEGUNDO lugar?",
          type: "image_selection",
          image_description: "Tres niños en fila",
          options: ["Niño A (1º)", "Niño B (2º)", "Niño C (3º)"],
          correct_answer: "Niño B (2º)",
          feedback: "¡Muy bien! El segundo lugar es después del primero.",
          engine_data: { ordinal_position: 2, total_positions: 3 }
        }
      );
      break;
      
    case 'number_recognition':
      // MA01OA03 - Leer números 0-20
      questions.push(
        {
          id: uuidv4(),
          question: "¿Qué número ves?",
          type: "image_to_text",
          image_description: "Número 15 grande y claro",
          options: ["13", "14", "15", "16"],
          correct_answer: "15",
          feedback: "¡Perfecto! Es el número quince (15).",
          engine_data: { number_value: 15, representation: "symbolic" }
        }
      );
      break;
      
    case 'number_comparison':
      // MA01OA04 - Comparar y ordenar
      questions.push(
        {
          id: uuidv4(),
          question: "Ordena de MENOR a MAYOR",
          type: "drag_drop",
          items: ["8", "3", "12", "7"],
          correct_order: ["3", "7", "8", "12"],
          feedback: "¡Genial! El orden correcto es: 3, 7, 8, 12",
          engine_data: { sort_type: "ascending", max_value: 20 }
        }
      );
      break;
      
    case 'number_composition':
      // MA01OA06 - Componer/descomponer
      questions.push(
        {
          id: uuidv4(),
          question: "10 se puede formar con:",
          type: "multiple_choice",
          options: ["5 + 5", "6 + 3", "7 + 3", "Todas las anteriores"],
          correct_answer: "Todas las anteriores",
          feedback: "¡Excelente! Hay muchas formas de formar el 10.",
          engine_data: { target_number: 10, composition_type: "additive" }
        }
      );
      break;
      
    case 'basic_operations':
      // MA01OA09 - Adición y sustracción
      questions.push(
        {
          id: uuidv4(),
          question: "3 + 4 = ?",
          type: "number_input",
          correct_answer: "7",
          feedback: "¡Correcto! 3 más 4 es igual a 7.",
          engine_data: { operation: "addition", operand1: 3, operand2: 4 }
        },
        {
          id: uuidv4(),
          question: "8 - 3 = ?", 
          type: "number_input",
          correct_answer: "5",
          feedback: "¡Muy bien! 8 menos 3 es igual a 5.",
          engine_data: { operation: "subtraction", operand1: 8, operand2: 3 }
        }
      );
      break;
      
    case 'pattern_recognition':
      // MA01OA11 - Patrones
      questions.push(
        {
          id: uuidv4(),
          question: "¿Qué sigue? 🔴🔵🔴🔵🔴__",
          type: "pattern_completion",
          pattern: ["🔴", "🔵", "🔴", "🔵", "🔴"],
          options: ["🔴", "🔵", "🟡", "🟢"],
          correct_answer: "🔵",
          feedback: "¡Perfecto! El patrón continúa con azul (🔵).",
          engine_data: { pattern_type: "alternating", sequence_length: 2 }
        }
      );
      break;
  }
  
  return questions;
}

// ===== FUNCIÓN PRINCIPAL =====
function generateAll1BMathGames() {
  console.log('🎮 === GENERANDO JUEGOS DE MATEMÁTICAS 1° BÁSICO ===');
  console.log('');
  
  const allGames = [];
  
  MATH_1B_OA.forEach((oa, index) => {
    console.log(`${index + 1}. Generando juego para ${oa.code}: ${oa.title}`);
    console.log(`   🎯 Engine: ${oa.engine} (${ENGINES_1B_MATH[oa.engine].name})`);
    console.log(`   🎮 Foco: ${oa.content_focus}`);
    
    const game = generateMathGame(oa);
    allGames.push(game);
    
    console.log(`   ✅ Juego creado: ${game.format} con ${game.questions.length} preguntas`);
    console.log('');
  });
  
  // RESUMEN FINAL
  console.log('📊 === RESUMEN DE JUEGOS CREADOS ===');
  console.log(`Total juegos: ${allGames.length}`);
  console.log(`Engines usados: ${[...new Set(allGames.map(g => g.engine_id))].join(', ')}`);
  console.log(`Formatos generados: ${[...new Set(allGames.map(g => g.format))].join(', ')}`);
  console.log('');
  
  // Estadísticas por engine
  const byEngine = allGames.reduce((acc, game) => {
    acc[game.engine_id] = (acc[game.engine_id] || 0) + 1;
    return acc;
  }, {});
  
  console.log('🎯 Distribución por Engine:');
  Object.entries(byEngine).forEach(([engine, count]) => {
    console.log(`   ${engine}: ${count} juegos`);
  });
  console.log('');
  
  // PRÓXIMOS PASOS
  console.log('🚀 === PRÓXIMOS PASOS ===');
  console.log('1. 📤 Cargar estos juegos en la base de datos');
  console.log('2. 🎨 Crear skins específicos para cada engine');
  console.log('3. 🧪 Probar con estudiantes de 1° básico');
  console.log('4. 📖 Generar juegos de lenguaje (ENG05, ENG06, ENG07)');
  console.log('5. 🔬 Agregar juegos de ciencias (ENG09)');
  console.log('');
  
  return allGames;
}

// Exportar para uso externo
module.exports = {
  generateAll1BMathGames,
  generateMathGame,
  ENGINES_1B_MATH,
  MATH_1B_OA
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const games = generateAll1BMathGames();
  
  // Guardar en archivo JSON para revisión
  const fs = require('fs');
  fs.writeFileSync(
    'games-1b-math-generated.json', 
    JSON.stringify(games, null, 2),
    'utf8'
  );
  
  console.log('💾 Juegos guardados en: games-1b-math-generated.json');
} 
