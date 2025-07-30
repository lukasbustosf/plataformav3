require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

// --- DATOS DE LA ACTIVIDAD ---
const activityData = {
  // ... (el resto de los datos de la actividad no cambia)
  id: 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 
  slug: 'el-habitat-de-los-animales',
  title: 'El hábitat de los animales',
  description: 'Instrucción General: La educadora dispone las 9 mesas para realizar grupos. Los párvulos se sientan en las mesas, donde tendrán dispuesto los juegos de memorice en el centro con las diferentes tarjetas de animales. La educadora motiva a los párvulos con un vídeo anexo y desarrolla la actividad didáctica con el juego de memorice. El jefe de grupo usa la gorra y es el encargado de: Compartir y repartir el recurso según las indicaciones de la educadora. Entregar la guía de trabajo y materiales a sus compañeros. Recoger y guardar el recurso en el laboratorio.',
  steps_markdown: `Instrucción Específica:

Objetivo de la actividad: Reconocer a través de la observación y de la comparación los diferentes hábitats de los animales.

La educadora para motivar a los párvulos los invita a observar el vídeo anexo del hábitat de los animales.
Luego los invita a observar y a manipular las tarjetas de los diferentes animales del memorice y les conversa acerca de cada uno de los animales que aparecen en las tarjetas, nombrando sus características y destacando donde habitan.
Les solicita a las niñas y a los niños poder colocar las tarjetas según el hábitat que les corresponde en las imágenes que están adjuntas en el PPT, proyectadas en la pizarra o en alguna pared donde los párvulos puedan pegar las tarjetas con los animales, con ayuda de una cinta masking, haciendo corresponder los animales con el hábitat proyectado.
Después de agrupados los animales por hábitats, la educadora, con ayuda de los jefes de grupos, les proporciona los recursos, (papelógrafo, lápices de colores y plumones de colores).
Les solicita a los párvulos escoger unos de los hábitats y representarlo en el papelógrafo junto con los animales del mismo.
Al final cada grupo tendrá un hábitat diferente con su respectiva tarjeta de animalito.

La educadora haciendo referencia a los hábitats pregunta a las niñas y niños:
- ¿Qué es un hábitat?
- ¿En qué lugar vive el conejo?
- ¿Dónde viven las tarántulas?
- ¿Alguno de esos animales pueden vivir con nosotros en casa?
- ¿Cuál de ellos?
- ¿Cuál no podría vivir en nuestras casas?
- ¿Conocen ustedes alguno de estos habitas?

Al terminar, los párvulos muestran sus trabajos y con la ayuda de la educadora los ubican en el panel.
El jefe de grupo se encarga de recoger y guardar el recurso en el laboratorio.`,
  learning_objectives: [
    "OA 7: Describir semejanzas y diferencias respecto a características, necesidades básicas y cambios que ocurren en el proceso de crecimiento, en personas, animales y plantas.",
    "OA 1: Participar en actividades y juegos colaborativos, planificando, acordando estrategias para un propósito común y asumiendo progresivamente responsabilidades en ellos.",
    "OA 10: Reconocer progresivamente requerimientos esenciales de las prácticas de convivencia democrática, tales como: escucha de opiniones divergentes, el respeto por los demás, de los turnos, de los acuerdos de las mayorías."
  ],
  indicators_markdown: `- Se integra espontáneamente en juegos grupales.
- Nombra algunas características de personas, animales y plantas en diferentes etapas de su proceso de crecimiento.
- Practica algunas normas de convivencia democrática (escucha de opiniones divergentes, el respeto por los demás, los turnos, los acuerdos de la mayoría) ante la sugerencia de un adulto o par.`,
  assessment_markdown: `
- ¿Reconoce hábitats de animales?
- ¿Participa en la actividad grupal?
- ¿Nombra características de los animales?
- ¿Respeta turnos y opiniones?
`,
  resource_urls: [
    'https://docs.google.com/presentation/d/1oxTbRqWMA0t2uws5YWen2kVdMQB-Eiy0/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
    'https://docs.google.com/presentation/d/1LHrVhtwl77D6IQFTBHXv5ZswxSBc0QtH/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true',
    'https://drive.google.com/file/d/1qzmZOsGvIkdR9aXBD1C0i5oKxD1EYkqQ/view?usp=drive_link',
    'https://docs.google.com/document/d/1gJUuQ-OdGn_M2P3ju_TKRM0rBn0-yBHD/edit?usp=drive_link&ouid=102711749563636743391&rtpof=true&sd=true'
  ],
  cover_image_url: 'https://i.imgur.com/3MTaG0S.png',
  video_url: 'https://www.youtube.com/watch?v=O22z32cnG9s',
  oa_ids: ['OA 7', 'OA 1', 'OA 10'],
  duration_minutes: 45,
  group_size: 4,
  bloom_level: 'comprender', // recordar, comprender, aplicar, analizar, evaluar, crear
  target_cycle: 'PK', // PK, K1, K2, 1B, etc.
  difficulty_level: 2,
  subject: 'Ciencias Naturales',
  grade_level: 'Pre-Kínder',
  status: 'active' // ¡Importante para que sea visible!
};

async function seedActivity() {
  console.log('--- [DEBUG] Iniciando script de carga ---');
  
  // Validar que las variables de entorno estén cargadas
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  console.log(`[DEBUG] SUPABASE_URL: ${supabaseUrl ? 'Cargada' : 'NO CARGADA'}`);
  console.log(`[DEBUG] SUPABASE_SERVICE_KEY: ${serviceKey ? 'Cargada (termina en ...' + serviceKey.slice(-6) + ')' : 'NO CARGADA'}`);

  if (!supabaseUrl || !serviceKey) {
    console.error('\nError: Las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY son necesarias.');
    console.log('Asegúrate de tener un archivo .env en la carpeta /server con estas variables.');
    console.log('--- [DEBUG] Script finalizado con error ---');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  console.log(`\nIntentando cargar la actividad: "${activityData.title}"...`);

  const { data, error } = await supabase
    .from('lab_activity')
    .upsert(activityData, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('\nError al cargar la actividad:', error.message);
    if (error.details) console.error('Detalles:', error.details);
  } else {
    console.log('\n¡Actividad cargada o actualizada exitosamente!');
    console.log('Datos insertados:', JSON.stringify(data, null, 2));
  }
  
  console.log('--- [DEBUG] Script finalizado ---');
}

seedActivity();
