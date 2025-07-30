const axios = require('axios');

async function crearSesionesOA1() {
  try {
    console.log('🚀 CREANDO SESIONES ESPECÍFICAS PARA OA1 MATEMÁTICAS 1° BÁSICO');
    
    const sesiones = [
      {
        id: `oa1_pollitos_${Date.now()}`,
        title: '🐣 OA1 Nivel 1: Pollitos Pequeños (1-5)',
        description: 'Nivel 1: Conteo básico del 1 al 5 con pollitos',
        oa_code: 'MAT.1B.OA.01',
        bloom_level: 'Recordar',
        game_level: 1,
        max_number: 5,
        theme: 'granja_oa1'
      },
      {
        id: `oa1_gallinas_${Date.now() + 1}`,
        title: '🐔 OA1 Nivel 2: Gallinas Medianas (1-10)',
        description: 'Nivel 2: Conteo y correspondencia del 1 al 10',
        oa_code: 'MAT.1B.OA.01',
        bloom_level: 'Comprender',
        game_level: 2,
        max_number: 10,
        theme: 'granja_oa1'
      },
      {
        id: `oa1_vacas_${Date.now() + 2}`,
        title: '🐄 OA1 Nivel 3: Vacas Grandes (1-20)',
        description: 'Nivel 3: Conteo avanzado del 1 al 20',
        oa_code: 'MAT.1B.OA.01',
        bloom_level: 'Aplicar',
        game_level: 3,
        max_number: 20,
        theme: 'granja_oa1'
      },
      {
        id: `oa1_granjero_${Date.now() + 3}`,
        title: '🚜 OA1 Nivel 4: Granjero Experto (Patrones)',
        description: 'Nivel 4: Conteo por patrones (2 en 2, 5 en 5)',
        oa_code: 'MAT.1B.OA.01',
        bloom_level: 'Analizar',
        game_level: 4,
        max_number: 20,
        theme: 'granja_oa1'
      }
    ];

    const sesionesCreadas = [];

    for (const sesion of sesiones) {
      console.log(`\n📝 Creando sesión: ${sesion.title}`);
      
      const sessionData = {
        session_id: sesion.id,
        game_id: sesion.id, // Mantener ambos por compatibilidad
        title: sesion.title,
        description: sesion.description,
        teacher_id: '550e8400-e29b-41d4-a716-446655440003',
        class_id: '550e8400-e29b-41d4-a716-446655440001',
        status: 'waiting',
        settings_json: {
          engine_id: 'ENG01',
          skin: '🐄 Granja 1° Básico',
          oa_code: sesion.oa_code,
          bloom_level: sesion.bloom_level,
          game_level: sesion.game_level,
          max_number: sesion.max_number,
          theme: sesion.theme,
          specialized_component: 'FarmCountingGameOA1', // Identificador del componente específico
          farm_theme: true,
          grade_level: '1B'
        },
        join_code: 'OA' + Math.floor(1000 + Math.random() * 9000),
        max_players: 30,
        time_limit: 600,
        questions: generateSpecificQuestions(sesion.game_level, sesion.max_number)
      };

      try {
        const response = await axios.post('http://localhost:5000/api/game/debug/add-session', sessionData);
        console.log(`✅ Sesión creada exitosamente:`);
        console.log(`   📍 URL: http://localhost:3000/student/games/${sessionData.game_id}/play`);
        console.log(`   🎮 Join Code: ${sessionData.join_code}`);
        console.log(`   🎯 Nivel: ${sesion.game_level}/4`);
        console.log(`   📚 Bloom: ${sesion.bloom_level}`);
        
        sesionesCreadas.push({
          ...sessionData,
          url: `http://localhost:3000/student/games/${sessionData.game_id}/play`
        });
        
      } catch (error) {
        console.error(`❌ Error creando sesión ${sesion.title}:`);
        console.error(`   📄 Error detallado:`, error.response?.data || error.message);
        console.error(`   🔗 URL intentada: http://localhost:5000/api/game/debug/add-session`);
        console.error(`   📊 Código de estado:`, error.response?.status);
      }
      
      // Pequeña pausa entre creaciones
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Resumen final
    console.log(`\n🎉 RESUMEN DE SESIONES CREADAS:`);
    console.log(`Total de sesiones: ${sesionesCreadas.length}`);
    
    sesionesCreadas.forEach((sesion, index) => {
      console.log(`\n${index + 1}. ${sesion.title}`);
      console.log(`   🔗 ${sesion.url}`);
      console.log(`   🎮 Código: ${sesion.join_code}`);
      console.log(`   📈 Nivel: ${sesion.settings_json.game_level}/4`);
    });

    console.log(`\n✨ ¡Todas las sesiones están listas para probar!`);
    console.log(`📝 Cada nivel progresa en dificultad según OA1 MAT.1B`);
    console.log(`🎯 Taxonomía de Bloom: Recordar → Comprender → Aplicar → Analizar`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

function generateSpecificQuestions(level, maxNumber) {
  const questions = [];
  
  switch (level) {
    case 1: // Pollitos: Conteo básico 1-5
      for (let i = 1; i <= 3; i++) {
        const count = Math.floor(Math.random() * maxNumber) + 1;
        questions.push({
          id: `q${i}`,
          question: `¿Cuántos pollitos ves en la granja?`,
          type: 'counting',
          difficulty: 'easy',
          answer: count.toString(),
          options: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= 5).map(n => n.toString()),
          points: 100,
          metadata: {
            count: count,
            animal: '🐣',
            skill: 'conteo_visual_basico'
          }
        });
      }
      break;
      
    case 2: // Gallinas: Conteo y correspondencia 1-10
      for (let i = 1; i <= 3; i++) {
        const count = Math.floor(Math.random() * maxNumber) + 1;
        questions.push({
          id: `q${i}`,
          question: `El granjero cuenta ${count} gallinas. ¿Cuántas son?`,
          type: 'counting_correspondence',
          difficulty: 'medium',
          answer: count.toString(),
          options: [count, count + 1, count - 1, count + 2].filter(n => n > 0 && n <= 10).map(n => n.toString()),
          points: 150,
          metadata: {
            count: count,
            animal: '🐔',
            skill: 'conteo_correspondencia'
          }
        });
      }
      break;
      
    case 3: // Vacas: Conteo avanzado 1-20
      for (let i = 1; i <= 3; i++) {
        const count = Math.floor(Math.random() * maxNumber) + 1;
        questions.push({
          id: `q${i}`,
          question: `En el establo hay ${count} vacas. ¿Puedes contarlas todas?`,
          type: 'advanced_counting',
          difficulty: 'hard',
          answer: count.toString(),
          options: [count, count + 2, count - 2, count + 3].filter(n => n > 0 && n <= 20).map(n => n.toString()),
          points: 200,
          metadata: {
            count: count,
            animal: '🐄',
            skill: 'conteo_avanzado'
          }
        });
      }
      break;
      
    case 4: // Granjero: Patrones de conteo
      const patterns = [
        { sequence: [2, 4, 6, 8], next: 10, description: 'de 2 en 2' },
        { sequence: [5, 10, 15], next: 20, description: 'de 5 en 5' },
        { sequence: [10, 8, 6], next: 4, description: 'hacia atrás de 2 en 2' }
      ];
      
      patterns.forEach((pattern, i) => {
        questions.push({
          id: `q${i + 1}`,
          question: `¿Qué número sigue contando ${pattern.description}? ${pattern.sequence.join(', ')}, ___`,
          type: 'pattern_counting',
          difficulty: 'expert',
          answer: pattern.next.toString(),
          options: [pattern.next, pattern.next + 2, pattern.next - 1, pattern.next + 5].filter(n => n > 0 && n <= 20).map(n => n.toString()),
          points: 250,
          metadata: {
            pattern: pattern.sequence,
            next: pattern.next,
            skill: 'conteo_por_patrones'
          }
        });
      });
      break;
  }
  
  return questions;
}

// Ejecutar
crearSesionesOA1(); 