const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Crear un colegio de demostración primero
  const demoSchool = await prisma.schools.upsert({
    where: { school_code: 'DEMO001' },
    update: {},
    create: {
      school_id: '550e8400-e29b-41d4-a716-446655440000',
      school_name: 'Colegio Demo EDU21',
      school_code: 'DEMO001',
    },
  });
  console.log(`Created school: ${demoSchool.school_name}`);

  // Crear el usuario profesor de demostración
  const teacherUser = await prisma.public_users.upsert({
    where: { email: 'profesor@demo.edu21.cl' },
    update: {},
    create: {
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'profesor@demo.edu21.cl',
      password_hash: 'hashed_password_placeholder', // No se usa para login en dev, solo para FK
      first_name: 'María',
      last_name: 'González',
      role: 'TEACHER',
      school_id: demoSchool.school_id,
    },
  });
  console.log(`Created user: ${teacherUser.email}`);

  // 1. Crear el Kit Principal (lab_product)
  const parvuLabKit = await prisma.lab_product.upsert({
    where: { code: 'PARVULAB-01' },
    update: {},
    create: {
      name: 'Laboratorio movil de Parvulo - ParvuLAB',
      code: 'PARVULAB-01',
      description: 'Kit completo de laboratorio móvil para educación parvularia.',
      target_cycles: ['PK', 'K1', 'K2'],
      status: 'active',
    },
  });
  console.log(`Created kit: ${parvuLabKit.name}`);

  // 2. Crear el Material para la actividad del hábitat
  const puzzleAnimales = await prisma.lab_material.upsert({
    where: { internal_code: 'PARVULAB-M05' },
    update: {},
    create: {
      name: 'PUZZLE ANIMALES',
      internal_code: 'PARVULAB-M05',
      lab_product_id: parvuLabKit.id,
      quantity_per_kit: 9,
    },
  });
  console.log(`Created material: ${puzzleAnimales.name}`);

  // 3. Crear la Actividad "El hábitat de los animales"
  const habitatActivity = await prisma.lab_activity.upsert({
    where: { slug: 'el-habitat-de-los-animales' },
    update: {},
    create: {
      id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
      slug: 'el-habitat-de-los-animales',
      title: 'El hábitat de los animales',
      description: 'Instrucción General: La educadora dispone las 9 mesas para realizar grupos...',
      steps_markdown: `Instrucción Específica:\n\nObjetivo de la actividad: Reconocer a través de la observación...`,
      learning_objectives: [
        "OA 7: Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.",
        "OA 1: Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos.",
        "OA 10: Reconocer progresivamente requerimientos esenciales de las prácticas de convivencia democrática, tales como: escucha de opiniones divergentes, el respeto por los demás, de los turnos, de los acuerdos de las mayorías."
      ],
      indicators_markdown: `- Se integra espontáneamente en juegos grupales.\n- Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.\n- Practica algunas normas de convivencia democrática (escucha de opiniones divergentes, el respeto por los demás, los turnos, los acuerdos de la mayoría) ante la sugerencia de un adulto o par.`,
      assessment_markdown: `- ¿Reconoce hábitats de animales?\n- ¿Participa en la actividad grupal?\n- ¿Nombra características de los animales?\n- ¿Respeta turnos y opiniones?`,
      resource_urls: [
        'https://docs.google.com/presentation/d/1oxTbRqWMA0t2uws5YWen2kVdMQB-Eiy0/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
        'https://docs.google.com/presentation/d/1LHrVhtwl77D6IQFTBHXv5ZswkSBc0QtH/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
        'https://drive.google.com/file/d/1qzmZOsGvIkdR9aXBD1C0i5oKxD1EYkqQ/view?usp=drive_link',
        'https://docs.google.com/document/d/1gJUuQ-OdGn_M2P3ju_TKRM0rBn0-yBHD/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
      ],
      cover_image_url: 'https://i.imgur.com/3MTaG0S.png',
      video_url: 'https://www.youtube.com/watch?v=O22z32cnG9s',
      oa_ids: ['OA 7', 'OA 1', 'OA 10'],
      duration_minutes: 45,
      group_size: 4,
      bloom_level: 'comprender',
      target_cycle: 'PK',
      difficulty_level: 2,
      subject: 'Ciencias Naturales',
      grade_level: 'Pre-Kínder',
      status: 'active',
      lab_material_id: puzzleAnimales.id,
    },
  });
  console.log(`Created activity: ${habitatActivity.title}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });