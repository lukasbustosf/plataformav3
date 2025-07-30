

require('dotenv').config({ path: './server/.env' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Las variables de entorno SUPABASE_URL y SUPABASE_SERVICE_KEY son obligatorias.');
  console.log('Asegúrate de tener un archivo .env en la carpeta /server con las credenciales correctas.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const ACTIVITY_SLUG = 'test-activity';

async function verifyActivity() {
  console.log(`Buscando actividad con slug: "${ACTIVITY_SLUG}"...`);

  try {
    const { data, error } = await supabase
      .from('lab_activity')
      .select('*')
      .eq('slug', ACTIVITY_SLUG)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Ocurrió un error durante la consulta a Supabase:');
      console.error(error);
      return;
    }

    if (data) {
      console.log('\n✅ ¡Actividad encontrada exitosamente! ✅');
      console.log('------------------------------------------');
      console.log('ID:', data.id);
      console.log('Título:', data.title);
      console.log('Slug:', data.slug);
      console.log('Estado:', data.status);
      console.log('------------------------------------------');
      console.log('\nConclusión: La conexión a Supabase y los datos son correctos. El problema podría estar en la capa de la API (rutas, middleware).');
    } else {
      console.log('\n❌ No se encontró la actividad.');
      console.log('------------------------------------------');
      console.log('Posibles causas:');
      console.log('1. El slug no coincide exactamente con "test-activity".');
      console.log('2. El estado de la actividad no es "active".');
      console.log('3. Las variables de entorno en .env apuntan a una base de datos incorrecta.');
      console.log('4. Las políticas de RLS (Row Level Security) podrían estar bloqueando el acceso, aunque es poco probable con la SERVICE_KEY.');
    }
  } catch (err) {
    console.error('Ocurrió un error inesperado al ejecutar el script:', err);
  }
}

verifyActivity();

