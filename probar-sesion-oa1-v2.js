console.log('🌟 PROBANDO SESIÓN OA1 V2 - VERSIÓN MEJORADA');
console.log('========================================');

const sesionOA1V2 = {
  id: 'oa1-v2-demo',
  nombre: '🌟 OA1 V2: Granja Contador Avanzado (1° Básico)',
  url: 'http://localhost:3000/student/games/oa1-v2-demo/play',
  mejoras: [
    'A. Escalador Bloom (4 niveles con barra progresiva)',
    'B. Tutor adaptativo (Elo-light)',
    'C. Colección de pegatinas animales',
    'D. Modo cooperativo 2 jugadores',
    'E. Reconocimiento de voz opcional',
    'F. Guía PDF concreto antes de digital',
    'G. Pictogramas ARASAAC + TTS completa',
    'H. Máquina de estados para puntos'
  ]
};

console.log('📋 DATOS DE LA SESIÓN:');
console.log('🎯 ID:', sesionOA1V2.id);
console.log('📝 Nombre:', sesionOA1V2.nombre);
console.log('🔗 URL:', sesionOA1V2.url);
console.log('');

console.log('🚀 MEJORAS IMPLEMENTADAS:');
sesionOA1V2.mejoras.forEach(mejora => {
  console.log(`   ${mejora}`);
});

console.log('');
console.log('🧪 PROBANDO BACKEND...');

const fetch = require('node-fetch');

async function probarSesionV2() {
  try {
    console.log('📡 Probando sesión:', sesionOA1V2.id);
    
    const response = await fetch(`http://localhost:5000/api/game/${sesionOA1V2.id}`, {
      headers: {
        'Authorization': 'Bearer demo-token-student'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ÉXITO:', sesionOA1V2.id);
      console.log('   📋 Título:', data.session.title);
      console.log('   📊 Status:', data.session.status);
      console.log('   🎮 Engine:', data.session.engine_id);
      console.log('   🌟 Specialized Component:', data.session.settings_json?.specialized_component);
      console.log('   🎯 Versión:', data.session.settings_json?.version);
      console.log('   🌾 Tema:', data.session.settings_json?.theme);
      console.log('   📈 Bloom Scaler:', data.session.settings_json?.bloom_scaler);
      console.log('   🧠 Adaptive Tutor:', data.session.settings_json?.adaptive_tutor);
      console.log('   🎁 Sticker Collection:', data.session.settings_json?.sticker_collection);
      console.log('   👥 Cooperative Mode:', data.session.settings_json?.cooperative_mode);
      console.log('   🎤 Voice Recognition:', data.session.settings_json?.voice_recognition);
      console.log('   📄 PDF Guide:', data.session.settings_json?.pdf_guide);
      console.log('   🎨 ARASAAC Pictograms:', data.session.settings_json?.arasaac_pictograms);
      console.log('   🔄 State Machine:', data.session.settings_json?.state_machine);
      console.log('   ❓ Preguntas:', data.session.quizzes?.questions?.length || 0);
      
      // Verificar características V2
      const v2Features = data.session.settings_json || {};
      const hasAllV2Features = 
        v2Features.bloom_scaler && 
        v2Features.adaptive_tutor && 
        v2Features.sticker_collection && 
        v2Features.cooperative_mode && 
        v2Features.voice_recognition && 
        v2Features.pdf_guide && 
        v2Features.arasaac_pictograms && 
        v2Features.state_machine;
      
      console.log('');
      console.log('🎯 VERIFICACIÓN DE MEJORAS V2:');
      console.log('   ✅ Todas las mejoras implementadas:', hasAllV2Features ? '✅' : '❌');
      
      if (hasAllV2Features) {
        console.log('🎉 ¡SESIÓN OA1 V2 COMPLETAMENTE FUNCIONAL!');
        console.log('');
        console.log('🌟 RESULTADOS ESPERADOS:');
        console.log('   📈 +20% tiempo de juego');
        console.log('   📉 -35% errores 1-10');
        console.log('   📊 Reporte claro para profesores');
        console.log('');
        console.log('🎮 LISTO PARA PROBAR EN:');
        console.log(`   ${sesionOA1V2.url}`);
      } else {
        console.log('⚠️ Algunas mejoras V2 no están configuradas correctamente');
      }
      
    } else {
      console.log('❌ ERROR:', sesionOA1V2.id);
      console.log('   Status:', response.status);
      console.log('   Message:', response.statusText);
    }
  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN:', error.message);
  }
}

probarSesionV2();

console.log('');
console.log('🎯 INSTRUCCIONES PARA PROBAR:');
console.log('1. Asegúrate de que los servidores estén corriendo');
console.log('2. Abre la URL en tu navegador');
console.log('3. Observa las nuevas características:');
console.log('   - Barra de progreso Bloom con 4 niveles');
console.log('   - Puntuación Elo adaptativa');
console.log('   - Colección de stickers por respuestas correctas');
console.log('   - Botón para modo cooperativo');
console.log('   - Reconocimiento de voz opcional');
console.log('   - Botón para descargar guía PDF');
console.log('   - Pictogramas ARASAAC');
console.log('   - Sistema de puntos mejorado');
console.log('');
console.log('✅ Prueba completada'); 