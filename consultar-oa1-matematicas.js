const { supabase } = require('./server/database/supabase');
const logger = require('./server/utils/logger');

async function consultarOA1Matematicas() {
  try {
    logger.info('🔍 Consultando información del OA1 de Matemáticas 1° básico...');

    // Consultar el OA1 específico
    const { data: oa1, error: oaError } = await supabase
      .from('learning_objective')
      .select('*')
      .eq('oa_code', 'MA01OA01')
      .single();

    if (oaError) {
      logger.error('❌ Error al consultar OA1:', oaError.message);
      throw oaError;
    }

    logger.info('✅ Información del OA1 encontrada:');
    logger.info(`📋 Código: ${oa1.oa_code}`);
    logger.info(`📝 Descripción: ${oa1.oa_desc}`);
    logger.info(`🎯 Nivel Bloom: ${oa1.bloom_level}`);
    logger.info(`🧠 Habilidad Cognitiva: ${oa1.cog_skill}`);
    logger.info(`📚 Grado: ${oa1.grade_code}`);
    logger.info(`📖 Asignatura: ${oa1.subject_code}`);
    logger.info(`⏱️ Horas Estimadas: ${oa1.estimated_hours}`);
    logger.info(`📊 Nivel de Complejidad: ${oa1.complexity_level}`);
    logger.info(`🎯 Prioridad Ministerial: ${oa1.ministerial_priority}`);
    logger.info(`🔄 Transversal: ${oa1.is_transversal}`);

    // Consultar todos los OA de Matemáticas 1° básico para contexto
    const { data: oasMatematicas, error: oasError } = await supabase
      .from('learning_objective')
      .select('oa_code, oa_desc, bloom_level, complexity_level')
      .eq('subject_code', 'MAT')
      .eq('grade_code', '1B')
      .order('oa_code');

    if (oasError) {
      logger.error('❌ Error al consultar OAs de Matemáticas:', oasError.message);
      throw oasError;
    }

    logger.info('\n📚 Contexto - Todos los OA de Matemáticas 1° básico:');
    oasMatematicas.forEach((oa, index) => {
      logger.info(`${index + 1}. ${oa.oa_code}: ${oa.oa_desc.substring(0, 80)}...`);
      logger.info(`   Bloom: ${oa.bloom_level} | Complejidad: ${oa.complexity_level}`);
    });

    // Consultar experiencias existentes relacionadas con MA01OA01
    const { data: experiencias, error: expError } = await supabase
      .from('game_engines')
      .select('engine_id, engine_name, oa_codes, difficulty_level, estimated_duration')
      .contains('oa_codes', ['MA01OA01']);

    if (expError) {
      logger.warn('⚠️ No se pudieron consultar experiencias existentes:', expError.message);
    } else {
      logger.info('\n🎮 Experiencias existentes relacionadas con MA01OA01:');
      if (experiencias && experiencias.length > 0) {
        experiencias.forEach((exp, index) => {
          logger.info(`${index + 1}. ${exp.engine_name}`);
          logger.info(`   ID: ${exp.engine_id} | Dificultad: ${exp.difficulty_level} | Duración: ${exp.estimated_duration} min`);
        });
      } else {
        logger.info('   No hay experiencias existentes para este OA');
      }
    }

    // Análisis para el plan de implementación
    logger.info('\n🎯 ANÁLISIS PARA PLAN DE IMPLEMENTACIÓN:');
    logger.info('==========================================');
    
    // 1. Objetivos específicos de aprendizaje
    logger.info('\n📋 1. OBJETIVOS ESPECÍFICOS DE APRENDIZAJE:');
    logger.info(`   • Contar números del 0 al 100`);
    logger.info(`   • Progresiones: de 1 en 1, de 2 en 2, de 5 en 5, de 10 en 10`);
    logger.info(`   • Dirección: hacia adelante y hacia atrás`);
    logger.info(`   • Punto de partida: cualquier número menor que 100`);

    // 2. Indicadores de evaluación
    logger.info('\n📊 2. INDICADORES DE EVALUACIÓN:');
    logger.info(`   • Nivel Bloom: ${oa1.bloom_level} (Recordar)`);
    logger.info(`   • Habilidad Cognitiva: ${oa1.cog_skill} (mantener)`);
    logger.info(`   • Nivel de Complejidad: ${oa1.complexity_level}/5`);
    logger.info(`   • Horas Estimadas: ${oa1.estimated_hours} horas`);

    // 3. Habilidades que debe desarrollar
    logger.info('\n🧠 3. HABILIDADES A DESARROLLAR:');
    logger.info(`   • Secuenciación numérica`);
    logger.info(`   • Patrones de conteo`);
    logger.info(`   • Flexibilidad mental (hacia adelante/atrás)`);
    logger.info(`   • Memoria de secuencias`);
    logger.info(`   • Reconocimiento de patrones`);

    // 4. Contenidos específicos
    logger.info('\n📚 4. CONTENIDOS ESPECÍFICOS:');
    logger.info(`   • Números del 0 al 100`);
    logger.info(`   • Progresiones aritméticas`);
    logger.info(`   • Conteo regresivo`);
    logger.info(`   • Patrones numéricos`);

    // 5. Relación con otros OAs
    logger.info('\n🔗 5. RELACIÓN CON OTROS OAs:');
    const oasRelacionados = oasMatematicas.filter(oa => 
      oa.oa_code !== 'MA01OA01' && 
      (oa.oa_code.includes('OA02') || oa.oa_code.includes('OA03'))
    );
    oasRelacionados.forEach(oa => {
      logger.info(`   • ${oa.oa_code}: ${oa.oa_desc.substring(0, 60)}...`);
    });

    // 6. Recomendaciones para las 6 experiencias
    logger.info('\n🎮 6. RECOMENDACIONES PARA LAS 6 EXPERIENCIAS:');
    logger.info('   Experiencia 1 (Discovery Learning):');
    logger.info('   • Exploración libre de secuencias numéricas');
    logger.info('   • Descubrimiento de patrones de conteo');
    
    logger.info('   Experiencia 2 (Project-Based Learning):');
    logger.info('   • Proyecto: "Construir una escalera numérica"');
    logger.info('   • Colaboración para crear secuencias');
    
    logger.info('   Experiencia 3 (Multi-Device Interactive):');
    logger.info('   • Gestos para contar en diferentes dispositivos');
    logger.info('   • Interacción táctil con números');
    
    logger.info('   Experiencia 4 (Adaptive Learning):');
    logger.info('   • Adaptación automática de dificultad');
    logger.info('   • Personalización de secuencias');
    
    logger.info('   Experiencia 5 (Inquiry-Based Learning):');
    logger.info('   • Investigación de patrones numéricos');
    logger.info('   • Formulación de hipótesis sobre secuencias');
    
    logger.info('   Experiencia 6 (Collaborative Learning):');
    logger.info('   • Trabajo en equipo para contar');
    logger.info('   • Construcción colectiva de secuencias');

    logger.info('\n✅ Consulta completada exitosamente');
    return oa1;

  } catch (error) {
    logger.error('🚨 Error en la consulta:', error.message);
    throw error;
  }
}

// Ejecutar la consulta
consultarOA1Matematicas(); 