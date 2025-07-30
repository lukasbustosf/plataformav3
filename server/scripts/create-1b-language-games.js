#!/usr/bin/env node
/**
 * 🎮 EDU21 - Generador de Juegos de Lenguaje para 1° Básico
 * Usa engines ENG05 (Text Recognition), ENG06 (Letter-Sound Matching) y ENG07 (Reading Fluency)
 * Mapea OA específicos de LE01OA01-LE01OA26
 */

const { v4: uuidv4 } = require('uuid');

// ===== CONFIGURACIÓN DE ENGINES PARA 1B LENGUAJE =====
const ENGINES_1B_LANGUAGE = {
  'ENG05': {
    name: 'Text Recognition',
    mechanics: ['text_recognition', 'pattern_matching', 'letter_identification', 'word_building'],
    formats: ['word_builder', 'hangman_visual', 'drag_drop_sorting'],
    ideal_oa: ['LE01OA03', 'LE01OA04', 'LE01OA13', 'LE01OA14'], // Conciencia fonológica, letra-sonido, escritura
    config: {
      text_complexity: 'simple_words', // Para 1B palabras simples
      letter_support: true,
      visual_cues: true,
      tts_enabled: true
    }
  },
  'ENG06': {
    name: 'Letter-Sound Matching',
    mechanics: ['phonetic_matching', 'audio_recognition', 'sound_synthesis', 'letter_sound_mapping'],
    formats: ['color_match', 'memory_flip', 'picture_bingo'],
    ideal_oa: ['LE01OA03', 'LE01OA04', 'LE01OA26'], // Conciencia fonológica, correspondencia, recitación
    config: {
      phonetic_precision: 'basic_sounds',
      audio_quality: 'high_fidelity',
      visual_feedback: true,
      pronunciation_practice: true
    }
  },
  'ENG07': {
    name: 'Reading Fluency',
    mechanics: ['reading_tracking', 'fluency_measurement', 'comprehension_check', 'pace_control'],
    formats: ['story_path', 'escape_room_mini', 'trivia_lightning'],
    ideal_oa: ['LE01OA05', 'LE01OA06', 'LE01OA07', 'LE01OA08'], // Fluidez, comprensión, literatura
    config: {
      text_length: 'short_sentences',
      reading_speed_target: 'age_appropriate',
      comprehension_level: 'basic',
      visual_support: true
    }
  }
};

// ===== OA ESPECÍFICOS DE LENGUAJE 1B (LOS MÁS IMPORTANTES) =====
const LANGUAGE_1B_OA = [
  {
    code: 'LE01OA01',
    title: 'Reconocer textos escritos',
    description: 'Reconocer que los textos transmiten mensajes y tienen un propósito',
    bloom: 'Recordar',
    complexity: 1,
    engine: 'ENG05',
    content_focus: 'text_purpose_recognition'
  },
  {
    code: 'LE01OA02',
    title: 'Palabras como unidades',
    description: 'Reconocer palabras separadas por espacios en el texto',
    bloom: 'Recordar',
    complexity: 1,
    engine: 'ENG05',
    content_focus: 'word_separation'
  },
  {
    code: 'LE01OA03',
    title: 'Conciencia fonológica',
    description: 'Identificar sonidos, separar y combinar fonemas y sílabas',
    bloom: 'Recordar',
    complexity: 2,
    engine: 'ENG06',
    content_focus: 'phonological_awareness'
  },
  {
    code: 'LE01OA04',
    title: 'Correspondencia letra-sonido',
    description: 'Leer aplicando conocimiento letra-sonido (sílabas, dígrafos)',
    bloom: 'Recordar',
    complexity: 2,
    engine: 'ENG06',
    content_focus: 'letter_sound_correspondence'
  },
  {
    code: 'LE01OA05',
    title: 'Leer en voz alta',
    description: 'Leer textos breves en voz alta para adquirir fluidez',
    bloom: 'Recordar',
    complexity: 2,
    engine: 'ENG07',
    content_focus: 'reading_fluency'
  },
  {
    code: 'LE01OA06',
    title: 'Comprensión lectora',
    description: 'Comprender textos aplicando estrategias de comprensión',
    bloom: 'Comprender',
    complexity: 3,
    engine: 'ENG07',
    content_focus: 'reading_comprehension'
  },
  {
    code: 'LE01OA07',
    title: 'Repertorio literario',
    description: 'Leer independientemente y ampliar repertorio literario',
    bloom: 'Recordar',
    complexity: 2,
    engine: 'ENG07',
    content_focus: 'literary_repertoire'
  },
  {
    code: 'LE01OA08',
    title: 'Comprender narraciones',
    description: 'Comprender narraciones sobre temas familiares',
    bloom: 'Comprender',
    complexity: 3,
    engine: 'ENG07',
    content_focus: 'narrative_comprehension'
  },
  {
    code: 'LE01OA13',
    title: 'Experimentar escritura',
    description: 'Experimentar con escritura para comunicar ideas y sentimientos',
    bloom: 'Recordar',
    complexity: 2,
    engine: 'ENG05',
    content_focus: 'writing_experimentation'
  },
  {
    code: 'LE01OA14',
    title: 'Escribir oraciones',
    description: 'Escribir oraciones completas para transmitir mensajes',
    bloom: 'Recordar',
    complexity: 2,
    engine: 'ENG05',
    content_focus: 'sentence_writing'
  }
];

// ===== GENERADOR DE JUEGOS DE LENGUAJE =====
function generateLanguageGame(oa) {
  const engine = ENGINES_1B_LANGUAGE[oa.engine];
  const gameFormats = engine.formats;
  
  // Seleccionar formato óptimo según el OA
  let selectedFormat = gameFormats[0]; // Default
  
  if (oa.content_focus === 'phonological_awareness') {
    selectedFormat = 'color_match'; // Visual + auditivo
  } else if (oa.content_focus === 'letter_sound_correspondence') {
    selectedFormat = 'memory_flip'; // Asociación
  } else if (oa.content_focus === 'reading_fluency') {
    selectedFormat = 'story_path'; // Narrativa
  } else if (oa.content_focus === 'writing_experimentation') {
    selectedFormat = 'word_builder'; // Construcción
  } else if (oa.content_focus === 'reading_comprehension') {
    selectedFormat = 'trivia_lightning'; // Comprensión rápida
  }

  const game = {
    game_id: `1b-language-${oa.code.toLowerCase()}`,
    oa_code: oa.code,
    title: `📚 ${oa.title}`,
    description: `Juego de ${oa.description} usando ${engine.name}`,
    engine_id: oa.engine,
    engine_name: engine.name,
    format: selectedFormat,
    grade: '1B',
    subject: 'LEN',
    bloom_level: oa.bloom,
    complexity: oa.complexity,
    estimated_duration: 10, // minutos
    max_players: 25,
    settings: {
      engine_config: engine.config,
      game_mechanics: engine.mechanics,
      difficulty: 'beginner',
      tts_enabled: true, // ¡Esencial para lenguaje!
      accessibility: {
        keyboard_navigation: true,
        high_contrast: true,
        audio_support: true,
        visual_cues: true
      }
    },
    questions: generateLanguageQuestions(oa),
    created_for: 'primero_basico',
    created_at: new Date().toISOString()
  };

  return game;
}

// ===== GENERADOR DE PREGUNTAS DE LENGUAJE =====
function generateLanguageQuestions(oa) {
  const questions = [];
  
  switch(oa.content_focus) {
    case 'text_purpose_recognition':
      // LE01OA01 - Reconocer propósito de textos
      questions.push(
        {
          id: uuidv4(),
          question: "¿Para qué sirve este cartel?",
          type: "image_selection",
          image_description: "Cartel de 'PARE' en la calle",
          options: ["Para decorar", "Para parar los autos", "Para jugar", "Para contar"],
          correct_answer: "Para parar los autos",
          feedback: "¡Correcto! Los carteles nos dan información importante.",
          engine_data: { text_type: "instructional_sign", purpose: "traffic_control" }
        },
        {
          id: uuidv4(),
          question: "¿Qué tipo de texto es este?",
          type: "text_classification",
          text_sample: "Había una vez un ratón...",
          options: ["Cuento", "Receta", "Lista", "Carta"],
          correct_answer: "Cuento",
          feedback: "¡Excelente! 'Había una vez...' nos dice que es un cuento.",
          engine_data: { text_type: "narrative", genre: "fairy_tale" }
        }
      );
      break;
      
    case 'word_separation':
      // LE01OA02 - Palabras separadas por espacios
      questions.push(
        {
          id: uuidv4(),
          question: "¿Cuántas palabras hay? 'Mi gato come'",
          type: "word_counting",
          text: "Mi gato come",
          options: ["2", "3", "4", "5"],
          correct_answer: "3",
          feedback: "¡Muy bien! Las palabras son: Mi - gato - come",
          engine_data: { word_count: 3, sentence: "Mi gato come" }
        }
      );
      break;
      
    case 'phonological_awareness':
      // LE01OA03 - Conciencia fonológica
      questions.push(
        {
          id: uuidv4(),
          question: "¿Con qué sonido empieza 'MESA'?",
          type: "sound_identification",
          word: "MESA",
          audio_cue: "/sounds/m-sound.mp3", // Audio del sonido M
          options: ["M", "E", "S", "A"],
          correct_answer: "M",
          feedback: "¡Perfecto! MESA empieza con el sonido M.",
          engine_data: { word: "mesa", initial_sound: "m", phoneme_position: "initial" }
        },
        {
          id: uuidv4(),
          question: "Divide en sílabas: CA-SA",
          type: "syllable_division",
          word: "CASA",
          options: ["CA-SA", "C-ASA", "CAS-A", "C-A-S-A"],
          correct_answer: "CA-SA",
          feedback: "¡Genial! CASA se divide en CA-SA (2 sílabas).",
          engine_data: { word: "casa", syllables: ["ca", "sa"], syllable_count: 2 }
        }
      );
      break;
      
    case 'letter_sound_correspondence':
      // LE01OA04 - Correspondencia letra-sonido
      questions.push(
        {
          id: uuidv4(),
          question: "¿Qué letra hace el sonido /s/?",
          type: "sound_to_letter",
          audio_cue: "/sounds/s-sound.mp3",
          options: ["S", "C", "Z", "X"],
          correct_answer: "S",
          feedback: "¡Correcto! La letra S hace el sonido /s/.",
          engine_data: { sound: "/s/", letter: "S", phoneme_type: "consonant" }
        },
        {
          id: uuidv4(),
          question: "Lee esta palabra: MAMA",
          type: "word_reading",
          word_display: "MAMA",
          options: ["MAMA", "PAPA", "NANA", "LALA"],
          correct_answer: "MAMA",
          feedback: "¡Excelente lectura! Es MAMA.",
          engine_data: { word: "mama", complexity: "simple_cv", syllable_pattern: "CV-CV" }
        }
      );
      break;
      
    case 'reading_fluency':
      // LE01OA05 - Fluidez lectora
      questions.push(
        {
          id: uuidv4(),
          question: "Lee en voz alta: 'El sol sale'",
          type: "reading_aloud",
          text: "El sol sale",
          instruction: "Lee con voz clara y pausada",
          evaluation_criteria: ["pronunciation", "pace", "clarity"],
          feedback: "¡Muy bien! Tu lectura fue clara.",
          engine_data: { text: "El sol sale", difficulty: "beginner", word_count: 3 }
        }
      );
      break;
      
    case 'reading_comprehension':
      // LE01OA06 - Comprensión lectora
      questions.push(
        {
          id: uuidv4(),
          question: "Lee: 'Ana tiene un perro. El perro es café.' ¿De qué color es el perro?",
          type: "reading_comprehension",
          text: "Ana tiene un perro. El perro es café.",
          options: ["Negro", "Café", "Blanco", "Gris"],
          correct_answer: "Café",
          feedback: "¡Correcto! El texto dice que el perro es café.",
          engine_data: { text_length: "short", comprehension_type: "literal", detail: "color" }
        }
      );
      break;
      
    case 'literary_repertoire':
      // LE01OA07 - Repertorio literario
      questions.push(
        {
          id: uuidv4(),
          question: "¿Qué tipo de historia es 'Los Tres Cerditos'?",
          type: "literary_classification",
          story_title: "Los Tres Cerditos",
          options: ["Cuento", "Poema", "Canción", "Carta"],
          correct_answer: "Cuento",
          feedback: "¡Excelente! Los Tres Cerditos es un cuento clásico.",
          engine_data: { story: "tres_cerditos", genre: "folk_tale", classification: "narrative" }
        }
      );
      break;
      
    case 'narrative_comprehension':
      // LE01OA08 - Comprensión de narraciones
      questions.push(
        {
          id: uuidv4(),
          question: "En el cuento, ¿quién sopló las casas?",
          type: "story_comprehension",
          story_context: "Cuento de Los Tres Cerditos",
          options: ["Los cerditos", "El lobo", "El viento", "Nadie"],
          correct_answer: "El lobo",
          feedback: "¡Perfecto! El lobo sopló las casas de los cerditos.",
          engine_data: { story: "tres_cerditos", question_type: "character_action", comprehension_level: "literal" }
        }
      );
      break;
      
    case 'writing_experimentation':
      // LE01OA13 - Experimentar con escritura
      questions.push(
        {
          id: uuidv4(),
          question: "Escribe tu nombre:",
          type: "writing_practice",
          instruction: "Usa las letras para escribir tu nombre",
          available_letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
          feedback: "¡Muy bien! Escribiste tu nombre.",
          engine_data: { activity_type: "name_writing", complexity: "personal_identification" }
        }
      );
      break;
      
    case 'sentence_writing':
      // LE01OA14 - Escribir oraciones
      questions.push(
        {
          id: uuidv4(),
          question: "Ordena las palabras: 'gato - el - come'",
          type: "sentence_construction",
          words: ["gato", "el", "come"],
          correct_order: ["el", "gato", "come"],
          feedback: "¡Excelente! La oración correcta es: 'El gato come'",
          engine_data: { sentence_type: "simple", structure: "subject_verb", word_count: 3 }
        }
      );
      break;
  }
  
  return questions;
}

// ===== FUNCIÓN PRINCIPAL =====
function generateAll1BLanguageGames() {
  console.log('📚 === GENERANDO JUEGOS DE LENGUAJE 1° BÁSICO ===');
  console.log('');
  
  const allGames = [];
  
  LANGUAGE_1B_OA.forEach((oa, index) => {
    console.log(`${index + 1}. Generando juego para ${oa.code}: ${oa.title}`);
    console.log(`   🎯 Engine: ${oa.engine} (${ENGINES_1B_LANGUAGE[oa.engine].name})`);
    console.log(`   🎮 Foco: ${oa.content_focus}`);
    
    const game = generateLanguageGame(oa);
    allGames.push(game);
    
    console.log(`   ✅ Juego creado: ${game.format} con ${game.questions.length} preguntas`);
    console.log('');
  });
  
  // RESUMEN FINAL
  console.log('📊 === RESUMEN DE JUEGOS DE LENGUAJE ===');
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
  
  // Análisis pedagógico
  console.log('📖 === ANÁLISIS PEDAGÓGICO ===');
  console.log('🔤 ENG05 (Text Recognition): Reconocimiento de letras, palabras y escritura básica');
  console.log('🔊 ENG06 (Letter-Sound): Conciencia fonológica y correspondencia letra-sonido'); 
  console.log('📚 ENG07 (Reading Fluency): Fluidez lectora y comprensión de textos');
  console.log('');
  
  return allGames;
}

// Exportar para uso externo
module.exports = {
  generateAll1BLanguageGames,
  generateLanguageGame,
  ENGINES_1B_LANGUAGE,
  LANGUAGE_1B_OA
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const games = generateAll1BLanguageGames();
  
  // Guardar en archivo JSON para revisión
  const fs = require('fs');
  fs.writeFileSync(
    'games-1b-language-generated.json', 
    JSON.stringify(games, null, 2),
    'utf8'
  );
  
  console.log('💾 Juegos de lenguaje guardados en: games-1b-language-generated.json');
  console.log('');
  console.log('🚀 === PRÓXIMOS PASOS ===');
  console.log('1. 🎨 Crear skins específicos para engines de lenguaje');
  console.log('2. 🔊 Integrar archivos de audio para TTS [[memory:2645259]]');
  console.log('3. 🧪 Probar con estudiantes de 1° básico');
  console.log('4. 🔬 Agregar juegos de ciencias (ENG09)');
  console.log('5. 📤 Cargar todos los juegos en la base de datos');
} 
