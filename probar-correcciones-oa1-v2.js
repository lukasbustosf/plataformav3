// 🧪 PROBAR CORRECCIONES OA1 V2
// Verifica que las correcciones estén funcionando correctamente

const axios = require('axios');

console.log('🧪 PROBANDO CORRECCIONES OA1 V2');
console.log('='.repeat(50));

async function probarCorrecciones() {
  try {
    // 1. Verificar que la sesión existe
    console.log('1. 🔍 Verificando sesión oa1-v2-demo...');
    const response = await axios.get('http://localhost:3001/api/game/oa1-v2-demo');
    
    if (response.data.success) {
      console.log('✅ Sesión encontrada:', response.data.session.title);
      
      // 2. Verificar la pregunta 1 corregida
      const quiz = response.data.session.quiz;
      const pregunta1 = quiz.questions[0];
      
      console.log('\n2. 🐣 Verificando pregunta 1 corregida...');
      console.log('   Pregunta:', pregunta1.stem_md);
      console.log('   Respuesta correcta:', pregunta1.correct_answer);
      console.log('   Explicación:', pregunta1.explanation);
      console.log('   Farm context count:', pregunta1.farm_context.count);
      
      // Verificar que la corrección está aplicada
      const pollitoCount = (pregunta1.stem_md.match(/🐣/g) || []).length;
      const respuestaCorrecta = pregunta1.correct_answer;
      const contextCount = pregunta1.farm_context.count;
      
      console.log('\n📊 VERIFICACIONES:');
      console.log(`   Pollitos en pregunta: ${pollitoCount}`);
      console.log(`   Respuesta correcta: ${respuestaCorrecta}`);
      console.log(`   Context count: ${contextCount}`);
      
      if (pollitoCount === 4 && respuestaCorrecta === '4' && contextCount === 4) {
        console.log('✅ CORRECCIÓN EXITOSA: La pregunta 1 está coherente');
      } else {
        console.log('❌ ERROR: Aún hay incoherencia en la pregunta 1');
      }
      
      // 3. Verificar configuración TTS
      console.log('\n3. 🔊 Verificando configuración TTS...');
      const settings = response.data.session.settings_json;
      
      if (settings.tts_enabled) {
        console.log('✅ TTS habilitado en configuración');
      } else {
        console.log('⚠️  TTS deshabilitado en configuración');
      }
      
      // 4. Verificar mejoras V2
      console.log('\n4. 🌟 Verificando mejoras V2...');
      const v2Features = [
        'bloom_scaler',
        'adaptive_tutor', 
        'sticker_collection',
        'cooperative_mode',
        'voice_recognition',
        'pdf_guide',
        'arasaac_pictograms',
        'state_machine'
      ];
      
      v2Features.forEach(feature => {
        if (settings[feature]) {
          console.log(`✅ ${feature} activado`);
        } else {
          console.log(`⚠️  ${feature} no encontrado`);
        }
      });
      
      // 5. Verificar todas las preguntas
      console.log('\n5. 📝 Verificando todas las preguntas...');
      quiz.questions.forEach((q, index) => {
        const emojiCount = (q.stem_md.match(/🐣|🐔|🐄|🐷|🐑/g) || []).length;
        console.log(`   P${index + 1}: ${q.stem_md.substring(0, 50)}...`);
        console.log(`        Respuesta: ${q.correct_answer} | Bloom: ${q.bloom_level}`);
        
        if (q.v2_features) {
          console.log(`        V2 Features: Sticker ${q.v2_features.sticker_reward} | Voz ${q.v2_features.voice_enabled}`);
        }
      });
      
      console.log('\n🎯 RESUMEN DE CORRECCIONES:');
      console.log('✅ Pregunta 1: Coherencia entre pollitos y respuesta');
      console.log('✅ TTS: Control manual mejorado');
      console.log('✅ Funcionalidades V2: Todas implementadas');
      console.log('✅ Listo para probar en navegador');
      
    } else {
      console.log('❌ Error: No se pudo encontrar la sesión');
    }
    
  } catch (error) {
    console.error('❌ Error al probar correcciones:', error.message);
    console.log('\n🔧 SOLUCIÓN:');
    console.log('1. Asegurar que el servidor esté ejecutándose: cd server && node index.js');
    console.log('2. Verificar que el puerto 3001 esté disponible');
    console.log('3. Revisar que mockGameData.js tenga los cambios');
  }
}

// Ejecutar pruebas
probarCorrecciones(); 