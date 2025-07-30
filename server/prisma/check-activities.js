const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function checkActivities() {
  try {
    console.log('🔍 Verificando actividades en la base de datos...\n');
    
    const activities = await prisma.lab_activity.findMany({
      select: {
        title: true,
        resource_urls: true,
        video_url: true,
        cover_image_url: true,
        slug: true
      }
    });
    
    console.log(`📊 Total de actividades encontradas: ${activities.length}\n`);
    
    activities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.title}`);
      console.log(`   Slug: ${activity.slug}`);
      console.log(`   Recursos (${activity.resource_urls?.length || 0}):`);
      if (activity.resource_urls && activity.resource_urls.length > 0) {
        activity.resource_urls.forEach((url, i) => {
          console.log(`     ${i + 1}. ${url}`);
        });
      } else {
        console.log('     ❌ No hay recursos');
      }
      console.log(`   Video: ${activity.video_url || '❌ No hay video'}`);
      console.log(`   Imagen: ${activity.cover_image_url || '❌ No hay imagen'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkActivities(); 