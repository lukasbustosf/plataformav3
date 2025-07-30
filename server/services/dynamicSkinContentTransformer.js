// 🎨 DYNAMIC SKIN CONTENT TRANSFORMER
// Transforma automáticamente el contenido del juego basado en el skin aplicado

const SKIN_CONTENT_TRANSFORMERS = {
  'skin-1b-farm': {
    skin_name: '🐄 Granja 1° Básico',
    engine_id: 'ENG01',
    content_type: 'counting_farm_animals',
    
    // 🔄 TRANSFORMATION RULES
    transformQuestion: (originalQuestion, questionIndex, targetRange = [1, 10]) => {
      const farmAnimals = [
        { emoji: '🐔', name: 'pollitos', sound: 'pío pío', action: 'están en el corral' },
        { emoji: '🐄', name: 'vacas', sound: 'muuu', action: 'pastando en el campo' },
        { emoji: '🐷', name: 'cerditos', sound: 'oink oink', action: 'jugando en el barro' },
        { emoji: '🐑', name: 'ovejas', sound: 'beee', action: 'descansando bajo el árbol' },
        { emoji: '🐰', name: 'conejitos', sound: 'hop hop', action: 'saltando por el prado' }
      ];
      
      const animal = farmAnimals[questionIndex % farmAnimals.length];
      // Use dynamic range if provided
      const [minRange, maxRange] = targetRange;
      const count = Math.max(minRange, Math.min(maxRange, minRange + questionIndex));
      
      return {
        question_id: `farm-${originalQuestion.question_id}`,
        question_order: originalQuestion.question_order,
        stem_md: `${animal.emoji} ¿Cuántos ${animal.name} hay?`,
        type: 'multiple_choice',
        options_json: [
          `${count - 1}`,
          `${count}`,
          `${count + 1}`,
          `${count + 2}`
        ],
        correct_answer: `${count}`,
        explanation: `¡Correcto! Hay ${count} ${animal.name}. ${animal.sound}!`,
        points: originalQuestion.points,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        // 🐄 FARM CONTEXT INTEGRATION
        farm_context: {
          visual: animal.emoji.repeat(count),
          narrative: `Cuenta los ${animal.name} que ${animal.action}`,
          animal_sound: animal.sound,
          operation: `conteo_${count}`
        }
      };
    },
    
    // 🎨 VISUAL THEME TRANSFORMATION
    transformVisualElements: (originalElements) => {
      return {
        ...originalElements,
        background_theme: 'farm_landscape',
        color_scheme: {
          primary: '#F59E0B',      // Orange
          secondary: '#92400E',    // Brown
          accent: '#FDE047',       // Yellow
          success: '#10B981',      // Green
          error: '#EF4444'         // Red
        },
        animations: {
          background: 'gentle_farm_breeze',
          feedback_correct: 'farm_celebration',
          feedback_incorrect: 'encouraging_farm_sounds'
        }
      };
    },
    
    // 🔊 AUDIO TRANSFORMATION
    transformAudioFeedback: (isCorrect, context) => {
      if (isCorrect) {
        return `¡Excelente! ${context.explanation} - ${context.farm_context?.animal_sound}!`;
      } else {
        return `Vamos a contar de nuevo juntos. ${context.farm_context?.narrative}.`;
      }
    }
  },
  
  'skin-math-001': {
    skin_name: '🚀 Números Espaciales',
    engine_id: 'ENG01',
    content_type: 'space_counting',
    
    transformQuestion: (originalQuestion, questionIndex, targetRange = [1, 10]) => {
      console.log(`🚀 SPACE TRANSFORMER - Q${questionIndex}: targetRange = [${targetRange[0]}, ${targetRange[1]}]`);
      
      const spaceObjects = [
        { emoji: '🚀', name: 'cohetes', action: 'despegando', location: 'en la galaxia' },
        { emoji: '⭐', name: 'estrellas', action: 'brillando', location: 'en el cielo nocturno' },
        { emoji: '🛸', name: 'naves', action: 'navegando', location: 'por el espacio' },
        { emoji: '👽', name: 'alienígenas', action: 'explorando', location: 'en Marte' },
        { emoji: '🪐', name: 'planetas', action: 'orbitando', location: 'en el sistema solar' }
      ];
      
      const object = spaceObjects[questionIndex % spaceObjects.length];
      
      // Better distribution for large ranges
      const [minRange, maxRange] = targetRange;
      const rangeSize = maxRange - minRange + 1;
      
      let count;
      if (rangeSize <= 20) {
        // Small range: sequential
        count = minRange + questionIndex;
        if (count > maxRange) count = maxRange;
      } else {
        // Large range: distributed segments
        const segmentSize = Math.ceil(rangeSize / 10);
        const segmentStart = minRange + (questionIndex * segmentSize);
        count = Math.min(segmentStart, maxRange);
      }
      
      console.log(`🚀 SPACE TRANSFORMER - Q${questionIndex}: calculated count = ${count}`);
      
      return {
        question_id: `space-${originalQuestion.question_id || questionIndex}`,
        question_order: originalQuestion.question_order || questionIndex,
        stem_md: `${object.emoji} ¿Cuántos ${object.name} ves ${object.location}?`,
        type: 'multiple_choice',
        options_json: [
          `${Math.max(1, count - 1)}`,
          `${count}`,
          `${count + 1}`,
          `${count + 2}`
        ],
        correct_answer: `${count}`,
        explanation: `¡Fantástico! Son ${count} ${object.name} ${object.action} ${object.location}.`,
        points: originalQuestion.points || 10,
        difficulty: 'easy',
        bloom_level: 'Recordar',
        // 🚀 SPACE CONTEXT INTEGRATION
        space_context: {
          visual: object.emoji.repeat(Math.min(count, 10)), // Limit visual elements
          narrative: `Cuenta los ${object.name} que están ${object.action} ${object.location}`,
          theme_sound: 'space_ambient',
          cosmic_number: count,
          space_location: object.location
        }
      };
    }
  }
};

// 🔄 MAIN TRANSFORMER FUNCTION
function transformGameContentWithSkin(gameSession, appliedSkin, numericContext = null) {
  if (!appliedSkin || !appliedSkin.skin_id) {
    return gameSession; // Return original if no skin
  }
  
  const transformer = SKIN_CONTENT_TRANSFORMERS[appliedSkin.skin_id];
  if (!transformer) {
    console.log(`⚠️ No transformer found for skin: ${appliedSkin.skin_id}`);
    return gameSession;
  }
  
  console.log(`🎨 TRANSFORMING CONTENT with skin: ${transformer.skin_name}`);
  if (numericContext) {
    console.log(`🔢 Using numeric context: ${numericContext.range?.[0]} to ${numericContext.range?.[1]}`);
  }
  
  // Transform quiz questions
  let transformedQuestions = [];
  try {
    if (gameSession.quizzes && gameSession.quizzes.questions) {
      const targetRange = numericContext?.range || [1, 10];
      console.log(`🔄 TRANSFORMING ${gameSession.quizzes.questions.length} questions with range [${targetRange[0]}, ${targetRange[1]}]`);
      
      transformedQuestions = gameSession.quizzes.questions.map((question, index) => {
        return transformer.transformQuestion(question, index, targetRange);
      });
      
      gameSession.quizzes.questions = transformedQuestions;
      gameSession.quizzes.title = `${transformer.skin_name} - Conteo Interactivo`;
      gameSession.quizzes.description = `Juego de conteo temático con ${transformer.skin_name}`;
      
      console.log(`✅ Successfully transformed ${transformedQuestions.length} questions`);
    } else {
      console.log(`⚠️ No questions found to transform in gameSession.quizzes`);
    }
  } catch (questionTransformError) {
    console.log(`❌ ERROR transforming questions:`, questionTransformError.message);
    transformedQuestions = []; // Ensure it's still defined even on error
  }
  
  // Transform visual elements
  if (transformer.transformVisualElements) {
    gameSession.visual_theme = transformer.transformVisualElements(gameSession.settings_json);
  }
  
  // Add transformation metadata
  gameSession.content_transformed = true;
  gameSession.transformation_applied = {
    skin_id: appliedSkin.skin_id,
    skin_name: transformer.skin_name,
    content_type: transformer.content_type,
    transformed_at: new Date().toISOString()
  };
  
  console.log(`✅ CONTENT TRANSFORMED: ${transformedQuestions.length} questions converted to ${transformer.content_type}`);
  
  return gameSession;
}

// 🎯 EXPORT FUNCTIONS
module.exports = {
  transformGameContentWithSkin,
  SKIN_CONTENT_TRANSFORMERS
}; 
