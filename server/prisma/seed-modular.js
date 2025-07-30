const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Función para cargar todas las actividades desde archivos individuales
async function loadActivitiesFromFiles() {
  const activitiesDir = path.join(__dirname, 'seed-data', 'activities');
  const activityFiles = fs.readdirSync(activitiesDir)
    .filter(file => file.endsWith('.js'))
    .sort(); // Ordenar para procesar en orden

  const activities = [];
  
  for (const file of activityFiles) {
    try {
      const activityData = require(path.join(activitiesDir, file));
      activities.push(activityData);
      console.log(`✅ Cargado: ${activityData.metadata.title}`);
    } catch (error) {
      console.error(`❌ Error cargando ${file}:`, error.message);
    }
  }
  
  return activities;
}

// Función para crear o actualizar materiales únicos
async function upsertMaterials(activities) {
  const materialsMap = new Map();
  
  // Agrupar materiales por internal_code
  activities.forEach(activity => {
    const material = activity.material;
    if (!materialsMap.has(material.internal_code)) {
      materialsMap.set(material.internal_code, material);
    }
  });
  
  const materials = [];
  
  for (const [internalCode, material] of materialsMap) {
    try {
      const upsertedMaterial = await prisma.lab_material.upsert({
        where: { internal_code: internalCode },
        update: {
          name: material.name,
          quantity_per_kit: material.quantity_per_kit,
        },
        create: {
          name: material.name,
          internal_code: internalCode,
          lab_product_id: '550e8400-e29b-41d4-a716-446655440002', // ID del kit principal
          quantity_per_kit: material.quantity_per_kit,
        },
      });
      
      materials.push(upsertedMaterial);
      console.log(`✅ Material upserted: ${material.name}`);
    } catch (error) {
      console.error(`❌ Error upserting material ${material.name}:`, error.message);
    }
  }
  
  return materials;
}

// Función para crear o actualizar actividades
async function upsertActivities(activities, materials) {
  const materialsMap = new Map(materials.map(m => [m.internal_code, m]));
  
  for (const activityData of activities) {
    try {
      const material = materialsMap.get(activityData.material.internal_code);
      
      if (!material) {
        console.error(`❌ Material no encontrado para actividad: ${activityData.metadata.title}`);
        continue;
      }
      
      const upsertedActivity = await prisma.lab_activity.upsert({
        where: { slug: activityData.metadata.slug },
        update: {
          title: activityData.metadata.title,
          description: activityData.activity.description,
          steps_markdown: activityData.activity.steps_markdown,
          learning_objectives: activityData.activity.learning_objectives,
          indicators_markdown: activityData.activity.indicators_markdown,
          assessment_markdown: activityData.activity.assessment_markdown,
          resource_urls: activityData.activity.resource_urls,
          cover_image_url: activityData.activity.cover_image_url,
          video_url: activityData.activity.video_url,
          oa_ids: activityData.activity.oa_ids,
          duration_minutes: activityData.activity.duration_minutes,
          group_size: activityData.activity.group_size,
          bloom_level: activityData.activity.bloom_level,
          target_cycle: activityData.activity.target_cycle,
          difficulty_level: activityData.activity.difficulty_level,
          subject: activityData.activity.subject,
          grade_level: activityData.activity.grade_level,
          status: activityData.metadata.status,
          lab_material_id: material.id,
        },
        create: {
          id: activityData.metadata.id,
          slug: activityData.metadata.slug,
          title: activityData.metadata.title,
          description: activityData.activity.description,
          steps_markdown: activityData.activity.steps_markdown,
          learning_objectives: activityData.activity.learning_objectives,
          indicators_markdown: activityData.activity.indicators_markdown,
          assessment_markdown: activityData.activity.assessment_markdown,
          resource_urls: activityData.activity.resource_urls,
          cover_image_url: activityData.activity.cover_image_url,
          video_url: activityData.activity.video_url,
          oa_ids: activityData.activity.oa_ids,
          duration_minutes: activityData.activity.duration_minutes,
          group_size: activityData.activity.group_size,
          bloom_level: activityData.activity.bloom_level,
          target_cycle: activityData.activity.target_cycle,
          difficulty_level: activityData.activity.difficulty_level,
          subject: activityData.activity.subject,
          grade_level: activityData.activity.grade_level,
          status: activityData.metadata.status,
          lab_material_id: material.id,
        },
      });
      
      console.log(`✅ Actividad upserted: ${activityData.metadata.title}`);
    } catch (error) {
      console.error(`❌ Error upserting actividad ${activityData.metadata.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando seed modular...');
  
  try {
    // 1. Crear datos básicos (colegio, usuario, kit)
    console.log('\n📚 Creando datos básicos...');
    
    const demoSchool = await prisma.schools.upsert({
      where: { school_code: 'DEMO001' },
      update: {},
      create: {
        school_id: '550e8400-e29b-41d4-a716-446655440000',
        school_name: 'Colegio Demo EDU21',
        school_code: 'DEMO001',
      },
    });
    console.log(`✅ Colegio: ${demoSchool.school_name}`);

    const teacherUser = await prisma.public_users.upsert({
      where: { email: 'profesor@demo.edu21.cl' },
      update: {},
      create: {
        user_id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'profesor@demo.edu21.cl',
        password_hash: 'hashed_password_placeholder',
        first_name: 'María',
        last_name: 'González',
        role: 'TEACHER',
        school_id: demoSchool.school_id,
      },
    });
    console.log(`✅ Usuario: ${teacherUser.email}`);

    const parvuLabKit = await prisma.lab_product.upsert({
      where: { code: 'PARVULAB-01' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Laboratorio movil de Parvulo - ParvuLAB',
        code: 'PARVULAB-01',
        description: 'Kit completo de laboratorio móvil para educación parvularia.',
        target_cycles: ['PK', 'K1', 'K2'],
        status: 'active',
      },
    });
    console.log(`✅ Kit: ${parvuLabKit.name}`);

    // 2. Cargar actividades desde archivos
    console.log('\n📁 Cargando actividades desde archivos...');
    const activities = await loadActivitiesFromFiles();
    console.log(`📊 Total de actividades cargadas: ${activities.length}`);

    // 3. Crear/actualizar materiales
    console.log('\n🔧 Procesando materiales...');
    const materials = await upsertMaterials(activities);

    // 4. Crear/actualizar actividades
    console.log('\n🎯 Procesando actividades...');
    await upsertActivities(activities, materials);

    console.log('\n✅ Seed modular completado exitosamente!');
    console.log(`📈 Resumen:`);
    console.log(`   - Colegios: 1`);
    console.log(`   - Usuarios: 1`);
    console.log(`   - Kits: 1`);
    console.log(`   - Materiales: ${materials.length}`);
    console.log(`   - Actividades: ${activities.length}`);

  } catch (error) {
    console.error('❌ Error en seed modular:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('❌ Error fatal:', e);
      process.exit(1);
    });
}

module.exports = { main, loadActivitiesFromFiles, upsertMaterials, upsertActivities }; 