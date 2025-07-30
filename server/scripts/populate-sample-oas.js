const { supabase } = require('../database/supabase');

/**
 * Script para poblar la base de datos con OAs de ejemplo
 * Esto permite que las búsquedas de OA en GameEvaluationCreator funcionen correctamente
 */

const sampleOAs = [
  // Matemática 1° Básico
  {
    oa_code: 'MA01-OA01',
    oa_desc: 'Contar números del 0 al 20 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 20.',
    oa_short_desc: 'Contar números del 0 al 20',
    grade_code: '1B',
    subject_id: null, // Se llenará dinámicamente
    bloom_level: 'Recordar',
    semester: 1,
    complexity_level: 1,
    estimated_hours: 8
  },
  {
    oa_code: 'MA01-OA02',
    oa_desc: 'Identificar el orden de los elementos de una secuencia, utilizando números ordinales del primero (1°) al décimo (10°).',
    oa_short_desc: 'Números ordinales 1° al 10°',
    grade_code: '1B',
    subject_id: null,
    bloom_level: 'Comprender',
    semester: 1,
    complexity_level: 2,
    estimated_hours: 6
  },
  {
    oa_code: 'MA01-OA03',
    oa_desc: 'Leer números del 0 al 20 y representarlos en forma concreta, pictórica y simbólica.',
    oa_short_desc: 'Leer y representar números 0-20',
    grade_code: '1B',
    subject_id: null,
    bloom_level: 'Aplicar',
    semester: 1,
    complexity_level: 2,
    estimated_hours: 10
  },
  // Lenguaje 1° Básico
  {
    oa_code: 'LE01-OA01',
    oa_desc: 'Reconocer que los textos escritos transmiten mensajes y que son escritos por alguien para cumplir un propósito.',
    oa_short_desc: 'Propósito de los textos escritos',
    grade_code: '1B',
    subject_id: null,
    bloom_level: 'Comprender',
    semester: 1,
    complexity_level: 1,
    estimated_hours: 4
  },
  {
    oa_code: 'LE01-OA02',
    oa_desc: 'Reconocer que las palabras son unidades de significado separadas por espacios en el texto escrito.',
    oa_short_desc: 'Palabras como unidades de significado',
    grade_code: '1B',
    subject_id: null,
    bloom_level: 'Recordar',
    semester: 1,
    complexity_level: 1,
    estimated_hours: 6
  },
  // Ciencias Naturales 1° Básico
  {
    oa_code: 'CN01-OA01',
    oa_desc: 'Reconocer y observar, por medio de la exploración, que los seres vivos crecen, responden a estímulos del medio, se reproducen y necesitan agua, alimento y aire para vivir.',
    oa_short_desc: 'Características de los seres vivos',
    grade_code: '1B',
    subject_id: null,
    bloom_level: 'Comprender',
    semester: 1,
    complexity_level: 2,
    estimated_hours: 8
  },
  // Matemática 2° Básico
  {
    oa_code: 'MA02-OA01',
    oa_desc: 'Contar números del 0 al 1000 de 2 en 2, de 5 en 5, de 10 en 10 y de 100 en 100, hacia adelante y hacia atrás, empezando por cualquier número menor que 1000.',
    oa_short_desc: 'Contar números del 0 al 1000',
    grade_code: '2B',
    subject_id: null,
    bloom_level: 'Recordar',
    semester: 1,
    complexity_level: 2,
    estimated_hours: 10
  },
  {
    oa_code: 'MA02-OA02',
    oa_desc: 'Leer números del 0 al 100 y representarlos en forma concreta, pictórica y simbólica.',
    oa_short_desc: 'Leer y representar números 0-100',
    grade_code: '2B',
    subject_id: null,
    bloom_level: 'Aplicar',
    semester: 1,
    complexity_level: 2,
    estimated_hours: 8
  }
];

async function populateOAs() {
  try {
    console.log('🚀 Iniciando población de OAs de ejemplo...');
    
    if (!supabase) {
      console.error('❌ Supabase no está configurado');
      return;
    }

    // Primero, obtener los IDs de las materias
    console.log('📚 Obteniendo materias disponibles...');
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('subject_id, subject_code');

    if (subjectsError) {
      console.error('❌ Error obteniendo materias:', subjectsError);
      return;
    }

    console.log(`✅ Encontradas ${subjects.length} materias`);

    // Mapear códigos de materia a IDs
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject.subject_code] = subject.subject_id;
    });

    // Asignar subject_id a cada OA basado en su código
    const oasWithSubjects = sampleOAs.map(oa => {
      let subjectCode;
      if (oa.oa_code.startsWith('MA')) subjectCode = 'MAT';
      else if (oa.oa_code.startsWith('LE')) subjectCode = 'LEN';
      else if (oa.oa_code.startsWith('CN')) subjectCode = 'CN';
      else subjectCode = 'MAT'; // fallback

      return {
        ...oa,
        subject_id: subjectMap[subjectCode] || subjectMap['MAT']
      };
    });

    // Insertar OAs en la base de datos
    console.log('📝 Insertando OAs de ejemplo...');
    const { data, error } = await supabase
      .from('learning_objectives')
      .upsert(oasWithSubjects, {
        onConflict: 'oa_code',
        ignoreDuplicates: true
      });

    if (error) {
      console.error('❌ Error insertando OAs:', error);
      return;
    }

    console.log(`✅ Successfully populated ${oasWithSubjects.length} sample OAs`);
    
    // Verificar la inserción
    const { data: verifyData, error: verifyError } = await supabase
      .from('learning_objectives')
      .select('oa_code, oa_short_desc, grade_code')
      .in('oa_code', sampleOAs.map(oa => oa.oa_code));

    if (verifyError) {
      console.error('❌ Error verificando inserción:', verifyError);
      return;
    }

    console.log('🔍 OAs insertados:');
    verifyData.forEach(oa => {
      console.log(`  - ${oa.oa_code}: ${oa.oa_short_desc} (${oa.grade_code})`);
    });

    console.log('🎉 ¡Población de OAs completada exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  populateOAs()
    .then(() => {
      console.log('✅ Script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { populateOAs, sampleOAs }; 
