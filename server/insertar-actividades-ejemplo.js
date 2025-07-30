const { PrismaClient } = require('./prisma/generated/prisma');
const prisma = new PrismaClient();

const actividadesEjemplo = [
  {
    id: "act-001",
    title: "El hábitat de los animales",
    slug: "el-habitat-de-los-animales",
    description: "Actividad para reconocer los diferentes hábitats de los animales a través del juego de memorice.",
    cover_image_url: "https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png",
    status: "active",
    target_cycle: "Pre-Kínder",
    duration_minutes: 45,
    subject: "Ciencias Naturales",
    creator_id: "user-lukas-id",
    tags: ["animales", "hábitat", "memorice"],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "act-002",
    title: "Los sonidos mágicos de los animales",
    slug: "los-sonidos-magicos-de-los-animales",
    description: "Actividad para identificar y reproducir los sonidos de diferentes animales.",
    cover_image_url: "https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png",
    status: "active",
    target_cycle: "Kínder",
    duration_minutes: 30,
    subject: "Ciencias Naturales",
    creator_id: "user-lukas-id",
    tags: ["animales", "sonidos", "auditivo"],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "act-003",
    title: "Mi mascota es mi amiga",
    slug: "mi-mascota-es-mi-amiga",
    description: "Actividad para aprender sobre el cuidado y responsabilidad con las mascotas.",
    cover_image_url: "https://i.ibb.co/JjWTcvLz/Captura-de-pantalla-2025-07-27-a-la-s-6-33-48-p-m-removebg-preview.png",
    status: "active",
    target_cycle: "1º Básico",
    duration_minutes: 40,
    subject: "Ciencias Naturales",
    creator_id: "user-lukas-id",
    tags: ["mascotas", "cuidado", "responsabilidad"],
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function insertarActividades() {
  try {
    console.log('🔍 Insertando actividades de ejemplo...\n');
    
    // Primero verificar si ya existen actividades
    const actividadesExistentes = await prisma.lab_activity.findMany({
      select: { id: true, title: true }
    });
    
    console.log(`📊 Actividades existentes: ${actividadesExistentes.length}`);
    
    if (actividadesExistentes.length > 0) {
      console.log('✅ Ya hay actividades en la base de datos');
      actividadesExistentes.forEach((act, index) => {
        console.log(`${index + 1}. ${act.title}`);
      });
      return;
    }
    
    // Insertar actividades de ejemplo
    for (const actividad of actividadesEjemplo) {
      await prisma.lab_activity.create({
        data: actividad
      });
      console.log(`✅ Insertada: ${actividad.title}`);
    }
    
    console.log('\n🎉 Todas las actividades han sido insertadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertarActividades(); 