#!/usr/bin/env node
/**
 * 🔗 EDU21 - Integrador de Skins 1° Básico al Sistema
 * Convierte y agrega nuestros 20 skins de 1B al archivo skinSystemData.js
 */

const fs = require('fs');
const path = require('path');
const skins1B = require('./create-1b-skins');

// ===== CONVERTIR NUESTROS SKINS AL FORMATO DEL SISTEMA =====
function convertToSystemFormat(skin1B, index) {
  // Convertir nuestro formato al formato del sistema existente
  return {
    id: `skin-1b-${index.toString().padStart(3, '0')}`,
    engine_id: skin1B.engine_id,
    name: skin1B.theme.display_name + ` - ${skin1B.engine_name}`,
    description: skin1B.description,
    category: mapThemeToCategory(skin1B.theme.name),
    subject: skin1B.subject_compatibility,
    grades: ['1B'], // Específico para 1° básico
    
    // Tema visual (convertir nuestros colores al formato sistema)
    theme: {
      primary_color: skin1B.visual_config.primary_colors[0],
      secondary_color: skin1B.visual_config.primary_colors[1] || skin1B.visual_config.primary_colors[0],
      accent_color: skin1B.visual_config.primary_colors[2] || skin1B.visual_config.primary_colors[0],
      background: `linear-gradient(135deg, ${skin1B.visual_config.primary_colors[1] || skin1B.visual_config.primary_colors[0]}, ${skin1B.visual_config.primary_colors[0]})`,
      font_family: mapThemeToFont(skin1B.theme.name),
      animations: mapThemeToAnimation(skin1B.theme.name)
    },
    
    // Elementos visuales específicos
    elements: {
      counters: skin1B.visual_config.characters,
      number_line_style: mapEngineToStyle(skin1B.engine_id, skin1B.theme.name),
      progress_indicators: mapThemeToProgress(skin1B.theme.name),
      sound_effects: mapThemeToSounds(skin1B.theme.name),
      visual_effects: mapThemeToEffects(skin1B.theme.name)
    },
    
    // Configuración del engine (adaptada para 1B)
    engine_config: {
      animation_speed: 'slow', // Más lento para niños de 6-7 años
      counter_style: mapThemeToCounterStyle(skin1B.theme.name),
      number_display: 'large_friendly_font', // Texto grande para 1B
      interaction_feedback: mapThemeToFeedback(skin1B.theme.name),
      // Específico para 1° básico
      difficulty_level: 'beginner',
      simplified_ui: true,
      large_buttons: true,
      high_contrast: true
    },
    
    preview_url: `/previews/1b-${skin1B.theme.name}.jpg`,
    active: true,
    created_at: new Date().toISOString()
  };
}

// ===== FUNCIONES DE MAPEO =====
function mapThemeToCategory(themeName) {
  const mapping = {
    'animals_farm': 'animals',
    'forest_friends': 'nature',
    'underwater_world': 'ocean',
    'space_adventure': 'space',
    'fairy_tale': 'fantasy',
    'dinosaur_park': 'prehistoric'
  };
  return mapping[themeName] || 'educational';
}

function mapThemeToFont(themeName) {
  const mapping = {
    'animals_farm': 'Fredoka One',
    'forest_friends': 'Comfortaa',
    'underwater_world': 'Comfortaa',
    'space_adventure': 'Space Grotesk',
    'fairy_tale': 'Dancing Script',
    'dinosaur_park': 'Creepster'
  };
  return mapping[themeName] || 'Comic Neue';
}

function mapThemeToAnimation(themeName) {
  const mapping = {
    'animals_farm': 'farm_bounce',
    'forest_friends': 'forest_sway',
    'underwater_world': 'wave_motion',
    'space_adventure': 'space_float',
    'fairy_tale': 'magical_sparkle',
    'dinosaur_park': 'dino_stomp'
  };
  return mapping[themeName] || 'gentle_bounce';
}

function mapEngineToStyle(engineId, themeName) {
  const baseStyles = {
    'ENG01': 'number_line_',
    'ENG02': 'drag_drop_',
    'ENG05': 'text_display_',
    'ENG06': 'sound_visual_',
    'ENG07': 'reading_flow_'
  };
  
  const themeStyles = {
    'animals_farm': 'farm_theme',
    'forest_friends': 'forest_theme',
    'underwater_world': 'ocean_theme',
    'space_adventure': 'space_theme',
    'fairy_tale': 'magical_theme',
    'dinosaur_park': 'prehistoric_theme'
  };
  
  return (baseStyles[engineId] || 'generic_') + (themeStyles[themeName] || 'theme');
}

function mapThemeToProgress(themeName) {
  const mapping = {
    'animals_farm': 'animal_footprints',
    'forest_friends': 'leaf_trail',
    'underwater_world': 'bubble_trail',
    'space_adventure': 'star_path',
    'fairy_tale': 'sparkle_trail',
    'dinosaur_park': 'fossil_tracks'
  };
  return mapping[themeName] || 'simple_progress';
}

function mapThemeToSounds(themeName) {
  const mapping = {
    'animals_farm': 'farm_sounds',
    'forest_friends': 'forest_ambience',
    'underwater_world': 'ocean_ambience',
    'space_adventure': 'space_themes',
    'fairy_tale': 'magical_chimes',
    'dinosaur_park': 'prehistoric_roars'
  };
  return mapping[themeName] || 'gentle_sounds';
}

function mapThemeToEffects(themeName) {
  const mapping = {
    'animals_farm': 'hay_particles',
    'forest_friends': 'leaf_particles',
    'underwater_world': 'bubble_particles',
    'space_adventure': 'star_particles',
    'fairy_tale': 'magic_sparkles',
    'dinosaur_park': 'dust_clouds'
  };
  return mapping[themeName] || 'gentle_sparkles';
}

function mapThemeToCounterStyle(themeName) {
  const mapping = {
    'animals_farm': 'bouncing_animals',
    'forest_friends': 'swaying_trees',
    'underwater_world': 'swimming_motion',
    'space_adventure': 'floating_space',
    'fairy_tale': 'floating_magical',
    'dinosaur_park': 'stomping_motion'
  };
  return mapping[themeName] || 'gentle_bounce';
}

function mapThemeToFeedback(themeName) {
  const mapping = {
    'animals_farm': 'animal_sound_visual',
    'forest_friends': 'nature_sound_visual',
    'underwater_world': 'splash_visual',
    'space_adventure': 'space_sound_visual',
    'fairy_tale': 'magic_sound_visual',
    'dinosaur_park': 'roar_visual'
  };
  return mapping[themeName] || 'positive_sound_visual';
}

// ===== FUNCIÓN PRINCIPAL =====
async function integrateSkins1B() {
  console.log('🔗 === INTEGRANDO SKINS 1° BÁSICO AL SISTEMA ===');
  console.log('');
  
  // 1. Generar nuestros skins de 1B
  const skins1BGenerated = skins1B.generateAll1BSkins();
  console.log(`📊 Skins de 1B generados: ${skins1BGenerated.length}`);
  
  // 2. Convertir al formato del sistema
  const convertedSkins = skins1BGenerated.map((skin, index) => 
    convertToSystemFormat(skin, index + 1)
  );
  
  console.log(`🔄 Skins convertidos al formato del sistema: ${convertedSkins.length}`);
  console.log('');
  
  // 3. Leer el archivo skinSystemData.js actual
  const skinSystemPath = path.join(__dirname, '../services/skinSystemData.js');
  let currentContent = fs.readFileSync(skinSystemPath, 'utf8');
  
  // 4. Crear las nuevas constantes para nuestros skins
  const skinsByEngine = convertedSkins.reduce((acc, skin) => {
    if (!acc[skin.engine_id]) acc[skin.engine_id] = [];
    acc[skin.engine_id].push(skin);
    return acc;
  }, {});
  
  console.log('📊 Distribución por Engine:');
  Object.entries(skinsByEngine).forEach(([engine, skins]) => {
    console.log(`   ${engine}: ${skins.length} skins`);
  });
  console.log('');
  
  // 5. Generar código para insertar
  let newSkinsCode = '\\n// 🎨 SKINS ESPECÍFICOS PARA 1° BÁSICO (Generados automáticamente)\\n';
  
  Object.entries(skinsByEngine).forEach(([engineId, skins]) => {
    const varName = `SKINS_1B_${engineId}`;
    newSkinsCode += `\\nconst ${varName} = [\\n`;
    
    skins.forEach((skin, index) => {
      newSkinsCode += '  {\\n';
      newSkinsCode += `    id: '${skin.id}',\\n`;
      newSkinsCode += `    engine_id: '${skin.engine_id}',\\n`;
      newSkinsCode += `    name: '${skin.name}',\\n`;
      newSkinsCode += `    description: '${skin.description}',\\n`;
      newSkinsCode += `    category: '${skin.category}',\\n`;
      newSkinsCode += `    subject: '${skin.subject}',\\n`;
      newSkinsCode += `    grades: ${JSON.stringify(skin.grades)},\\n`;
      newSkinsCode += `    theme: ${JSON.stringify(skin.theme, null, 6)},\\n`;
      newSkinsCode += `    elements: ${JSON.stringify(skin.elements, null, 6)},\\n`;
      newSkinsCode += `    engine_config: ${JSON.stringify(skin.engine_config, null, 6)},\\n`;
      newSkinsCode += `    preview_url: '${skin.preview_url}',\\n`;
      newSkinsCode += `    active: ${skin.active},\\n`;
      newSkinsCode += `    created_at: '${skin.created_at}'\\n`;
      newSkinsCode += '  }' + (index < skins.length - 1 ? ',' : '') + '\\n';
    });
    
    newSkinsCode += '];\\n';
  });
  
  // 6. Buscar el lugar donde insertar (antes de la clase SkinSystemService)
  const classIndex = currentContent.indexOf('class SkinSystemService');
  if (classIndex === -1) {
    throw new Error('No se encontró la clase SkinSystemService en el archivo');
  }
  
  // Insertar nuestros skins antes de la clase
  const beforeClass = currentContent.substring(0, classIndex);
  const afterClass = currentContent.substring(classIndex);
  
  const newContent = beforeClass + newSkinsCode + '\\n' + afterClass;
  
  // 7. Actualizar también el constructor para incluir nuestros skins
  let finalContent = newContent.replace(
    /this\.allSkins = \[(.*?)\];/s,
    (match, current) => {
      const engineVars = Object.keys(skinsByEngine).map(engine => `...SKINS_1B_${engine}`).join(',\\n      ');
      return `this.allSkins = [${current.trim()},\\n      ${engineVars}\\n    ];`;
    }
  );
  
  // 8. Guardar el archivo actualizado
  fs.writeFileSync(skinSystemPath, finalContent, 'utf8');
  
  console.log('✅ === INTEGRACIÓN COMPLETADA ===');
  console.log(`📁 Archivo actualizado: ${skinSystemPath}`);
  console.log(`🎨 Skins agregados: ${convertedSkins.length}`);
  console.log('');
  
  // 9. Generar resumen para verificación
  console.log('🔍 === VERIFICACIÓN ===');
  console.log('1. Reinicia el servidor backend');
  console.log('2. Ve a: http://localhost:3000/teacher/skins');
  console.log('3. Deberías ver 33 skins total (13 originales + 20 nuevos)');
  console.log('4. Filtra por engine ENG05, ENG06, ENG07 para ver los de lenguaje');
  console.log('');
  
  console.log('🎯 Skins de 1B por tema:');
  const byTheme = convertedSkins.reduce((acc, skin) => {
    acc[skin.category] = (acc[skin.category] || 0) + 1;
    return acc;
  }, {});
  
  Object.entries(byTheme).forEach(([theme, count]) => {
    console.log(`   ${theme}: ${count} skins`);
  });
  
  return {
    total_added: convertedSkins.length,
    by_engine: skinsByEngine,
    file_updated: skinSystemPath
  };
}

// Exportar funciones
module.exports = {
  integrateSkins1B,
  convertToSystemFormat
};

// Ejecutar si se llama directamente
if (require.main === module) {
  integrateSkins1B()
    .then(result => {
      console.log('');
      console.log('🎉 ¡SKINS DE 1° BÁSICO INTEGRADOS EXITOSAMENTE!');
      console.log('');
      console.log('📋 PRÓXIMOS PASOS:');
      console.log('1. 🔄 Reinicia el servidor: Ctrl+C y luego npm start');
      console.log('2. 🌐 Abre: http://localhost:3000/teacher/skins');
      console.log('3. 🎮 Crea un juego y aplica un skin de 1B');
      console.log('4. 🧪 Prueba la experiencia completa');
    })
    .catch(error => {
      console.error('❌ Error durante la integración:', error);
      process.exit(1);
    });
} 
