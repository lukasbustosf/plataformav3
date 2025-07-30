#!/usr/bin/env node
/**
 * 🎨 EDU21 - Generador de Skins para 1° Básico
 * Crea skins temáticos apropiados para niños de 6-7 años
 * Enfoque en colores brillantes, personajes amigables y temas familiares
 */

const { v4: uuidv4 } = require('uuid');

// ===== TEMAS APROPIADOS PARA 1° BÁSICO =====
const THEMES_1B = {
  // Temas que les encantan a los niños de 6-7 años
  animals_farm: {
    name: 'Granja Divertida',
    description: 'Animales de la granja que ayudan a aprender',
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'],
    characters: ['🐄', '🐷', '🐔', '🐑', '🐰'],
    appeal: 'familiar, seguro, conocido'
  },
  forest_friends: {
    name: 'Amigos del Bosque',
    description: 'Aventuras con animales del bosque',
    colors: ['#2ECC71', '#F39C12', '#E74C3C', '#9B59B6'],
    characters: ['🦊', '🐻', '🦝', '🐿️', '🦉'],
    appeal: 'aventura, naturaleza'
  },
  underwater_world: {
    name: 'Mundo Submarino',
    description: 'Explora el océano con peces amigables',
    colors: ['#3498DB', '#1ABC9C', '#F1C40F', '#E67E22'],
    characters: ['🐠', '🐙', '🐟', '🐢', '⭐'],
    appeal: 'misterio, exploración'
  },
  space_adventure: {
    name: 'Aventura Espacial',
    description: 'Viaja por el espacio con aliens amigables',
    colors: ['#8E44AD', '#3498DB', '#F39C12', '#E74C3C'],
    characters: ['🚀', '👽', '🌟', '🪐', '🌙'],
    appeal: 'fantasía, exploración'
  },
  fairy_tale: {
    name: 'Cuentos de Hadas',
    description: 'Mundo mágico con princesas y castillos',
    colors: ['#E91E63', '#9C27B0', '#F06292', '#FFB74D'],
    characters: ['👸', '🏰', '🦄', '🌈', '⭐'],
    appeal: 'magia, fantasía'
  },
  dinosaur_park: {
    name: 'Parque de Dinosaurios',
    description: 'Aprende con dinosaurios amigables',
    colors: ['#4CAF50', '#FF9800', '#795548', '#607D8B'],
    characters: ['🦕', '🦖', '🥚', '🌴', '🏔️'],
    appeal: 'aventura, prehistoria'
  }
};

// ===== CONFIGURACIÓN DE SKINS POR ENGINE =====
const SKINS_1B_CONFIG = {
  // Engines de Matemáticas
  'ENG01': {
    engine_name: 'Counter/Number Line',
    needed_skins: 3, // Ya tiene 7, pero necesitamos específicos para 1B
    optimal_themes: ['animals_farm', 'forest_friends', 'space_adventure'],
    ui_elements: {
      number_line: 'visual_track',
      counters: 'character_tokens',
      background: 'themed_landscape',
      feedback: 'character_reactions'
    }
  },
  'ENG02': {
    engine_name: 'Drag-Drop Numbers',
    needed_skins: 4, // Solo tiene 2, necesita más
    optimal_themes: ['underwater_world', 'fairy_tale', 'dinosaur_park', 'forest_friends'],
    ui_elements: {
      drag_items: 'themed_objects',
      drop_zones: 'themed_containers',
      background: 'immersive_environment',
      feedback: 'character_celebrations'
    }
  },
  
  // Engines de Lenguaje (CRÍTICOS - solo tienen 1 skin cada uno)
  'ENG05': {
    engine_name: 'Text Recognition',
    needed_skins: 5, // Solo tiene 1, necesita muchos más
    optimal_themes: ['animals_farm', 'forest_friends', 'fairy_tale', 'space_adventure', 'underwater_world'],
    ui_elements: {
      text_display: 'story_book_style',
      letter_cards: 'themed_tiles',
      background: 'reading_environment',
      feedback: 'character_encouragement'
    }
  },
  'ENG06': {
    engine_name: 'Letter-Sound Matching',
    needed_skins: 4, // Solo tiene 1, necesita más
    optimal_themes: ['animals_farm', 'forest_friends', 'fairy_tale', 'dinosaur_park'],
    ui_elements: {
      sound_buttons: 'character_speakers',
      letter_display: 'magical_letters',
      background: 'sound_landscape',
      feedback: 'audio_visual_celebration'
    }
  },
  'ENG07': {
    engine_name: 'Reading Fluency',
    needed_skins: 4, // Solo tiene 1, necesita más
    optimal_themes: ['fairy_tale', 'forest_friends', 'space_adventure', 'underwater_world'],
    ui_elements: {
      text_flow: 'story_progression',
      reading_cursor: 'character_guide',
      background: 'narrative_setting',
      feedback: 'story_rewards'
    }
  }
};

// ===== GENERADOR DE SKINS =====
function generateSkin(engineId, theme, index) {
  const engine = SKINS_1B_CONFIG[engineId];
  const themeData = THEMES_1B[theme];
  
  const skin = {
    skin_id: `1b-${engineId.toLowerCase()}-${theme}-v${index + 1}`,
    name: `${themeData.name} - ${engine.engine_name}`,
    description: `Skin de ${themeData.description} optimizado para ${engine.engine_name} en 1° Básico`,
    engine_id: engineId,
    engine_name: engine.engine_name,
    
    // Información del tema
    theme: {
      name: theme,
      display_name: themeData.name,
      target_age: '6-7 años',
      appeal_factors: themeData.appeal
    },
    
    // Configuración visual
    visual_config: {
      primary_colors: themeData.colors,
      characters: themeData.characters,
      ui_elements: engine.ui_elements,
      
      // Específico para 1° Básico
      font_size: 'large', // Niños necesitan texto grande
      contrast: 'high',   // Para facilitar lectura
      animations: 'gentle', // No muy rápidas
      sounds: 'soft',     // Sonidos suaves
      
      // Elementos de UI específicos
      button_style: 'rounded_friendly',
      icon_style: 'cartoon_simple',
      background_complexity: 'low', // No distraer
      character_expressions: 'always_positive'
    },
    
    // Assets necesarios (para desarrollo futuro)
    required_assets: {
      backgrounds: [
        `bg_${theme}_main.png`,
        `bg_${theme}_success.png`,
        `bg_${theme}_thinking.png`
      ],
      characters: themeData.characters.map(char => `char_${theme}_${char.codePointAt(0)}.png`),
      ui_elements: [
        `btn_${theme}_primary.png`,
        `btn_${theme}_secondary.png`,
        `icon_${theme}_correct.png`,
        `icon_${theme}_incorrect.png`,
        `icon_${theme}_hint.png`
      ],
      sounds: [
        `sfx_${theme}_success.mp3`,
        `sfx_${theme}_click.mp3`,
        `sfx_${theme}_transition.mp3`
      ]
    },
    
    // Configuración pedagógica
    pedagogical_features: {
      distraction_level: 'minimal', // Importante para concentración
      motivation_elements: themeData.characters,
      reward_system: 'character_based',
      accessibility: {
        colorblind_friendly: true,
        high_contrast_available: true,
        audio_cues: true,
        simplified_mode: true
      }
    },
    
    // Metadatos
    target_grade: '1B',
    subject_compatibility: engineId.startsWith('ENG01') || engineId.startsWith('ENG02') ? 'MAT' : 'LEN',
    difficulty_level: 'beginner',
    created_for: 'primero_basico_specific',
    created_at: new Date().toISOString()
  };
  
  return skin;
}

// ===== FUNCIÓN PRINCIPAL =====
function generateAll1BSkins() {
  console.log('🎨 === GENERANDO SKINS PARA 1° BÁSICO ===');
  console.log('');
  
  const allSkins = [];
  
  // Generar skins para cada engine
  Object.entries(SKINS_1B_CONFIG).forEach(([engineId, config]) => {
    console.log(`🎯 Generando skins para ${engineId} (${config.engine_name})`);
    console.log(`   📊 Necesarios: ${config.needed_skins} skins`);
    
    config.optimal_themes.forEach((theme, index) => {
      if (index < config.needed_skins) { // Solo generar los necesarios
        console.log(`   ${index + 1}. Tema: ${THEMES_1B[theme].name}`);
        
        const skin = generateSkin(engineId, theme, index);
        allSkins.push(skin);
        
        console.log(`      ✅ Skin creado: ${skin.skin_id}`);
        console.log(`      🎨 Colores: ${skin.visual_config.primary_colors.join(', ')}`);
        console.log(`      👥 Personajes: ${skin.visual_config.characters.join(' ')}`);
      }
    });
    
    console.log('');
  });
  
  // ===== RESUMEN FINAL =====
  console.log('📊 === RESUMEN DE SKINS PARA 1° BÁSICO ===');
  console.log(`Total skins generados: ${allSkins.length}`);
  console.log('');
  
  // Por engine
  const byEngine = allSkins.reduce((acc, skin) => {
    acc[skin.engine_id] = (acc[skin.engine_id] || 0) + 1;
    return acc;
  }, {});
  
  console.log('🎯 Distribución por Engine:');
  Object.entries(byEngine).forEach(([engine, count]) => {
    const config = SKINS_1B_CONFIG[engine];
    console.log(`   ${engine}: ${count} skins (${config.engine_name})`);
  });
  console.log('');
  
  // Por tema
  const byTheme = allSkins.reduce((acc, skin) => {
    const theme = skin.theme.name;
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});
  
  console.log('🎭 Distribución por Tema:');
  Object.entries(byTheme).forEach(([theme, count]) => {
    const themeData = THEMES_1B[theme];
    console.log(`   ${themeData.name}: ${count} skins`);
  });
  console.log('');
  
  // ===== ANÁLISIS PEDAGÓGICO =====
  console.log('📚 === ANÁLISIS PEDAGÓGICO ===');
  console.log('✅ Todos los skins están optimizados para niños de 6-7 años');
  console.log('✅ Colores brillantes y contrastantes para facilitar la lectura');
  console.log('✅ Personajes amigables que motivan el aprendizaje');
  console.log('✅ Diseño simple para evitar distracciones');
  console.log('✅ Temas familiares y seguros para la edad');
  console.log('');
  
  // ===== RECOMENDACIONES DE IMPLEMENTACIÓN =====
  console.log('🚀 === PRÓXIMOS PASOS ===');
  console.log('1. 🎨 Crear assets visuales para cada skin');
  console.log('2. 🔊 Integrar efectos de sonido temáticos');
  console.log('3. 🧪 Probar con niños de 1° básico');
  console.log('4. 📊 Medir qué temas prefieren los estudiantes');
  console.log('5. 🔄 Ajustar colores y elementos según feedback');
  console.log('');
  
  return allSkins;
}

// Exportar para uso externo
module.exports = {
  generateAll1BSkins,
  generateSkin,
  THEMES_1B,
  SKINS_1B_CONFIG
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const skins = generateAll1BSkins();
  
  // Guardar en archivo JSON
  const fs = require('fs');
  fs.writeFileSync(
    'skins-1b-generated.json',
    JSON.stringify(skins, null, 2),
    'utf8'
  );
  
  console.log('💾 Skins guardados en: skins-1b-generated.json');
  console.log('');
  console.log('🎯 === RESUMEN EJECUTIVO ===');
  console.log(`📊 ${skins.length} skins nuevos para 1° básico`);
  console.log('🎨 6 temas únicos apropiados para la edad');
  console.log('🎯 5 engines cubiertos (ENG01, ENG02, ENG05, ENG06, ENG07)');
  console.log('🎮 Listos para integrar con juegos de matemáticas y lenguaje');
  console.log('');
  console.log('✨ ¡Ahora puedes probar los juegos con skins apropiados para 1° básico!');
} 
