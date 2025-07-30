const { supabase } = require('../database/supabase');

/**
 * Script completo para configurar datos de demo
 * Incluye: escuelas, usuarios, clases, materias, grados y OAs
 */

const DEMO_SCHOOL_ID = '550e8400-e29b-41d4-a716-446655440000';
const DEMO_TEACHER_ID = '550e8400-e29b-41d4-a716-446655440001';

async function setupDemoData() {
  try {
    console.log('🚀 Iniciando configuración de datos de demo...');
    
    if (!supabase) {
      console.log('⚠️  Supabase no configurado - funcionará una vez que agregues las credenciales en server/.env');
      return;
    }

    // 1. Verificar/crear escuela demo
    console.log('🏫 Configurando escuela demo...');
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .upsert({
        school_id: DEMO_SCHOOL_ID,
        school_name: 'Colegio Demo EDU21',
        school_code: 'DEMO001',
        school_type: 'MUNICIPAL',
        address: 'Av. Demo 123, Santiago',
        region: 'Metropolitana',
        comuna: 'Santiago',
        rut: '12345678-9',
        principal_email: 'director@demo.edu21.cl',
        active: true
      }, { onConflict: 'school_id' });

    if (schoolError) console.log('School error:', schoolError);

    // 2. Crear materias si no existen
    console.log('📚 Configurando materias...');
    const subjects = [
      { subject_code: 'MAT', subject_name: 'Matemática', subject_color: '#3B82F6' },
      { subject_code: 'LEN', subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' },
      { subject_code: 'CN', subject_name: 'Ciencias Naturales', subject_color: '#10B981' },
      { subject_code: 'HIS', subject_name: 'Historia, Geografía y Cs. Sociales', subject_color: '#F59E0B' }
    ];

    for (const subject of subjects) {
      await supabase
        .from('subjects')
        .upsert(subject, { onConflict: 'subject_code' });
    }

    // 3. Obtener IDs de materias para usar en clases
    const { data: subjectsData } = await supabase
      .from('subjects')
      .select('subject_id, subject_code');

    const subjectMap = {};
    subjectsData?.forEach(s => {
      subjectMap[s.subject_code] = s.subject_id;
    });

    // 4. Crear usuario profesor demo
    console.log('👨‍🏫 Configurando profesor demo...');
    const { data: teacher, error: teacherError } = await supabase
      .from('users')
      .upsert({
        user_id: DEMO_TEACHER_ID,
        school_id: DEMO_SCHOOL_ID,
        email: 'profesor@demo.edu21.cl',
        first_name: 'María',
        last_name: 'González',
        role: 'TEACHER',
        active: true
      }, { onConflict: 'user_id' });

    if (teacherError) console.log('Teacher error:', teacherError);

    // 5. Crear clases demo
    console.log('🎓 Configurando clases demo...');
    const classes = [
      {
        class_id: '550e8400-e29b-41d4-a716-446655440010',
        class_name: '1°A Matemáticas',
        school_id: DEMO_SCHOOL_ID,
        teacher_id: DEMO_TEACHER_ID,
        subject_id: subjectMap['MAT'],
        grade_code: '1B',
        year: 2025,
        active: true
      },
      {
        class_id: '550e8400-e29b-41d4-a716-446655440011',
        class_name: '1°B Lenguaje',
        school_id: DEMO_SCHOOL_ID,
        teacher_id: DEMO_TEACHER_ID,
        subject_id: subjectMap['LEN'],
        grade_code: '1B',
        year: 2025,
        active: true
      },
      {
        class_id: '550e8400-e29b-41d4-a716-446655440012',
        class_name: '2°A Ciencias',
        school_id: DEMO_SCHOOL_ID,
        teacher_id: DEMO_TEACHER_ID,
        subject_id: subjectMap['CN'],
        grade_code: '2B',
        year: 2025,
        active: true
      }
    ];

    for (const classData of classes) {
      const { error: classError } = await supabase
        .from('classes')
        .upsert(classData, { onConflict: 'class_id' });
      
      if (classError) console.log('Class error:', classError);
    }

    // 6. Crear OAs de ejemplo
    console.log('📋 Configurando Objetivos de Aprendizaje...');
    const oas = [
      // Matemática 1° Básico
      {
        oa_code: 'MA01-OA01',
        oa_desc: 'Contar números del 0 al 20 de 1 en 1, de 2 en 2, de 5 en 5 y de 10 en 10, hacia adelante y hacia atrás, empezando por cualquier número menor que 20.',
        oa_short_desc: 'Contar números del 0 al 20',
        grade_code: '1B',
        subject_id: subjectMap['MAT'],
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
        subject_id: subjectMap['MAT'],
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
        subject_id: subjectMap['MAT'],
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
        subject_id: subjectMap['LEN'],
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
        subject_id: subjectMap['LEN'],
        bloom_level: 'Recordar',
        semester: 1,
        complexity_level: 1,
        estimated_hours: 6
      },
      // Ciencias Naturales 2° Básico
      {
        oa_code: 'CN02-OA01',
        oa_desc: 'Reconocer y observar, por medio de la exploración, que los seres vivos crecen, responden a estímulos del medio, se reproducen y necesitan agua, alimento y aire para vivir.',
        oa_short_desc: 'Características de los seres vivos',
        grade_code: '2B',
        subject_id: subjectMap['CN'],
        bloom_level: 'Comprender',
        semester: 1,
        complexity_level: 2,
        estimated_hours: 8
      }
    ];

    for (const oa of oas) {
      const { error: oaError } = await supabase
        .from('learning_objectives')
        .upsert(oa, { onConflict: 'oa_code' });
      
      if (oaError) console.log('OA error:', oaError);
    }

    console.log('✅ Configuración de datos demo completada!');
    console.log('📊 Datos creados:');
    console.log(`  - 1 escuela: Colegio Demo EDU21`);
    console.log(`  - ${subjects.length} materias`);
    console.log(`  - 1 profesor: María González`);
    console.log(`  - ${classes.length} clases`);
    console.log(`  - ${oas.length} objetivos de aprendizaje`);

  } catch (error) {
    console.error('❌ Error en configuración:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDemoData()
    .then(() => {
      console.log('🎉 Setup completado exitosamente!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Setup falló:', error);
      process.exit(1);
    });
}

module.exports = { setupDemoData }; 
