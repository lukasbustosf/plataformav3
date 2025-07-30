#!/usr/bin/env node
/**
 * 🧪 EDU21 - Testing COMPLETO de la Experiencia 1° Básico
 * Integra juegos + skins + engines para validar toda la experiencia
 */

const mathGames = require('./create-1b-math-games');
const languageGames = require('./create-1b-language-games');
const skins1B = require('./create-1b-skins');

// ===== TESTING COMPLETO =====
async function testComplete1BExperience() {
  console.log('🎮 === TESTING COMPLETO EXPERIENCIA 1° BÁSICO ===');
  console.log('');
  
  // 1. Generar todo el contenido
  console.log('📊 Generando contenido...');
  const mathResults = mathGames.generateAll1BMathGames();
  const languageResults = languageGames.generateAll1BLanguageGames();
  const skinsResults = skins1B.generateAll1BSkins();
  
  const allGames = [...mathResults, ...languageResults];
  
  console.log(`✅ ${mathResults.length} juegos de matemáticas`);
  console.log(`✅ ${languageResults.length} juegos de lenguaje`);
  console.log(`✅ ${skinsResults.length} skins temáticos`);
  console.log(`📊 TOTAL: ${allGames.length} juegos + ${skinsResults.length} skins`);
  console.log('');
  
  // 2. Análisis de cobertura
  console.log('🎯 === ANÁLISIS DE COBERTURA ===');
  
  // Engines cubiertos
  const gameEngines = [...new Set(allGames.map(g => g.engine_id))];
  const skinEngines = [...new Set(skinsResults.map(s => s.engine_id))];
  const allEngines = [...new Set([...gameEngines, ...skinEngines])];
  
  console.log(`🎮 Engines con juegos: ${gameEngines.join(', ')}`);
  console.log(`🎨 Engines con skins: ${skinEngines.join(', ')}`);
  console.log(`🎯 Engines totales: ${allEngines.join(', ')}`);
  console.log('');
  
  // Verificar compatibilidad juego-skin
  const compatibilityResults = [];
  allGames.forEach(game => {
    const availableSkins = skinsResults.filter(skin => skin.engine_id === game.engine_id);
    compatibilityResults.push({
      game: game.game_id,
      engine: game.engine_id,
      available_skins: availableSkins.length,
      skin_themes: availableSkins.map(s => s.theme.display_name)
    });
  });
  
  console.log('🔗 === COMPATIBILIDAD JUEGO-SKIN ===');
  compatibilityResults.forEach(result => {
    const status = result.available_skins >= 3 ? '✅' : result.available_skins >= 1 ? '⚠️' : '❌';
    console.log(`${status} ${result.game}`);
    console.log(`   🎯 Engine: ${result.engine}`);
    console.log(`   🎨 Skins disponibles: ${result.available_skins}`);
    console.log(`   🎭 Temas: ${result.skin_themes.join(', ')}`);
    console.log('');
  });
  
  // 3. Simulación de experiencia de estudiante
  console.log('👶 === SIMULACIÓN EXPERIENCIA ESTUDIANTE ===');
  console.log('');
  
  // Escenario: Estudiante de 1B entra a matemáticas
  console.log('📚 ESCENARIO 1: Estudiante hace matemáticas (conteo)');
  const mathGame = allGames.find(g => g.engine_id === 'ENG01');
  const mathSkins = skinsResults.filter(s => s.engine_id === 'ENG01');
  
  if (mathGame && mathSkins.length > 0) {
    console.log(`   🎮 Juego: ${mathGame.title}`);
    console.log(`   📝 OA: ${mathGame.oa_code}`);
    console.log(`   🎨 Skins disponibles: ${mathSkins.length}`);
    console.log(`   🎭 Opciones de tema:`);
    mathSkins.forEach(skin => {
      console.log(`      • ${skin.theme.display_name}: ${skin.visual_config.characters.join(' ')}`);
    });
    console.log(`   ✅ EXPERIENCIA COMPLETA DISPONIBLE`);
  } else {
    console.log(`   ❌ FALTA CONTENIDO`);
  }
  console.log('');
  
  // Escenario: Estudiante hace lenguaje (fonética)
  console.log('📖 ESCENARIO 2: Estudiante hace lenguaje (sonidos)');
  const langGame = allGames.find(g => g.engine_id === 'ENG06');
  const langSkins = skinsResults.filter(s => s.engine_id === 'ENG06');
  
  if (langGame && langSkins.length > 0) {
    console.log(`   🎮 Juego: ${langGame.title}`);
    console.log(`   📝 OA: ${langGame.oa_code}`);
    console.log(`   🎨 Skins disponibles: ${langSkins.length}`);
    console.log(`   🎭 Opciones de tema:`);
    langSkins.forEach(skin => {
      console.log(`      • ${skin.theme.display_name}: ${skin.visual_config.characters.join(' ')}`);
    });
    console.log(`   ✅ EXPERIENCIA COMPLETA DISPONIBLE`);
  } else {
    console.log(`   ❌ FALTA CONTENIDO`);
  }
  console.log('');
  
  // 4. Recomendaciones específicas de testing
  console.log('🔬 === PLAN DE TESTING RECOMENDADO ===');
  console.log('');
  
  console.log('1️⃣ TESTING TÉCNICO:');
  console.log('   • Probar cada engine con sus skins');
  console.log('   • Verificar que los juegos cargan correctamente');
  console.log('   • Comprobar que las preguntas se muestran bien');
  console.log('   • Validar que el TTS funciona (especialmente lenguaje)');
  console.log('');
  
  console.log('2️⃣ TESTING PEDAGÓGICO:');
  console.log('   • Probar con 3-5 niños de 1° básico reales');
  console.log('   • Observar qué temas prefieren');
  console.log('   • Medir tiempo de atención por juego');
  console.log('   • Evaluar si entienden las instrucciones');
  console.log('');
  
  console.log('3️⃣ TESTING DE USABILIDAD:');
  console.log('   • ¿Los botones son suficientemente grandes?');
  console.log('   • ¿Los colores son apropiados?');
  console.log('   • ¿Los personajes motivan o distraen?');
  console.log('   • ¿El feedback es claro y positivo?');
  console.log('');
  
  // 5. URLs para testing manual
  console.log('🌐 === URLs PARA TESTING MANUAL ===');
  console.log('');
  console.log('Abre tu navegador y prueba:');
  console.log('');
  console.log('📊 Dashboard general:');
  console.log('   http://localhost:3000/student/dashboard');
  console.log('');
  console.log('🎮 Juegos específicos (ejemplos):');
  allGames.slice(0, 5).forEach(game => {
    console.log(`   http://localhost:3000/student/games/${game.game_id}/play`);
  });
  console.log('');
  console.log('🎨 Gestión de skins:');
  console.log('   http://localhost:3000/teacher/skins');
  console.log('');
  
  // 6. Checklist final
  console.log('✅ === CHECKLIST DE TESTING ===');
  console.log('');
  console.log('□ Servidor corriendo (puerto 5000)');
  console.log('□ Cliente corriendo (puerto 3000)');
  console.log('□ Base de datos conectada');
  console.log('□ Juegos de matemáticas funcionan');
  console.log('□ Juegos de lenguaje funcionan');
  console.log('□ Skins se cargan correctamente');
  console.log('□ TTS funciona para preguntas de audio');
  console.log('□ Navegación entre juegos fluida');
  console.log('□ Feedback positivo y motivador');
  console.log('');
  
  return {
    games: allGames.length,
    skins: skinsResults.length,
    engines_covered: allEngines.length,
    compatibility_score: (compatibilityResults.filter(r => r.available_skins >= 1).length / compatibilityResults.length) * 100
  };
}

// Exportar funciones
module.exports = {
  testComplete1BExperience
};

// Ejecutar si se llama directamente
if (require.main === module) {
  testComplete1BExperience()
    .then(results => {
      console.log('🏆 === RESULTADO FINAL ===');
      console.log(`📊 ${results.games} juegos + ${results.skins} skins`);
      console.log(`🎯 ${results.engines_covered} engines cubiertos`);
      console.log(`🔗 ${results.compatibility_score.toFixed(1)}% juegos tienen skins`);
      console.log('');
      console.log('🚀 ¡TODO LISTO PARA PROBAR CON ESTUDIANTES DE 1° BÁSICO!');
      console.log('');
      console.log('💡 PRÓXIMO PASO: Abre http://localhost:3000 y prueba los juegos');
    })
    .catch(error => {
      console.error('❌ Error durante el testing:', error);
      process.exit(1);
    });
} 
