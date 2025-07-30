const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function cleanAndReseed() {
  try {
    console.log('🧹 Limpiando actividades antiguas...');
    
    // Eliminar actividades que no tienen recursos (actividades de prueba)
    const deleteResult = await prisma.lab_activity.deleteMany({
      where: {
        OR: [
          { resource_urls: { isEmpty: true } },
          { title: { contains: 'hola' } },
          { title: { contains: 'hoal' } },
          { title: { contains: 'hgola' } }
        ]
      }
    });
    
    console.log(`✅ Eliminadas ${deleteResult.count} actividades antiguas`);
    
    // Verificar actividades restantes
    const remainingActivities = await prisma.lab_activity.findMany({
      select: { title: true, slug: true }
    });
    
    console.log(`\n📊 Actividades restantes: ${remainingActivities.length}`);
    remainingActivities.forEach(activity => {
      console.log(`   - ${activity.title} (${activity.slug})`);
    });
    
    // Si no hay actividades correctas, ejecutar el seed modular
    if (remainingActivities.length === 0) {
      console.log('\n🔄 No hay actividades correctas, ejecutando seed modular...');
      const { main } = require('./seed-modular.js');
      await main();
    } else {
      console.log('\n✅ Las actividades correctas ya están en la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAndReseed(); 