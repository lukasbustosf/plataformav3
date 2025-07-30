const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Carga los datos semilla del módulo de laboratorios
 */
async function loadLabSeedData() {
  try {
    console.log('🌱 Iniciando carga de datos semilla del módulo de laboratorios...');
    
    // Leer archivo de datos semilla
    const seedDataPath = path.join(__dirname, '../database/lab-seed-data.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    
    // Cargar productos
    console.log('📦 Cargando productos...');
    await loadProducts(seedData.products);
    
    // Cargar actividades
    console.log('🎯 Cargando actividades...');
    await loadActivities(seedData.activities);
    
    console.log('✅ Datos semilla cargados exitosamente');
    console.log(`📊 Resumen:`);
    console.log(`   - Productos: ${seedData.products.length}`);
    console.log(`   - Actividades: ${seedData.activities.length}`);
    
  } catch (error) {
    console.error('❌ Error cargando datos semilla:', error);
    process.exit(1);
  }
}

/**
 * Carga productos en la base de datos
 */
async function loadProducts(products) {
  for (const [index, product] of products.entries()) {
    try {
      // Verificar si el producto ya existe
      const { data: existing } = await supabase
        .from('lab_product')
        .select('id')
        .eq('name', product.name)
        .single();
      
      if (existing) {
        console.log(`⚠️ Producto "${product.name}" ya existe, saltando...`);
        continue;
      }
      
      // Insertar producto
      const { data, error } = await supabase
        .from('lab_product')
        .insert([{
          name: product.name,
          description: product.description,
          category: product.category,
          target_ages: product.target_ages,
          methodology: product.methodology,
          status: product.status || 'disponible',
          technical_specs: product.technical_specs || {},
          safety_considerations: product.safety_considerations || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error(`❌ Error insertando producto "${product.name}":`, error);
        continue;
      }
      
      console.log(`✅ Producto "${product.name}" cargado (ID: ${data[0].id})`);
      
      // Crear materiales asociados si existen especificaciones
      if (product.technical_specs && Object.keys(product.technical_specs).length > 0) {
        await createMaterialsForProduct(data[0].id, product);
      }
      
    } catch (error) {
      console.error(`❌ Error procesando producto ${index + 1}:`, error);
    }
  }
}

/**
 * Crea materiales específicos para un producto
 */
async function createMaterialsForProduct(productId, product) {
  try {
    // Crear material base del producto
    const materialData = {
      product_id: productId,
      name: product.name,
      quantity: 1,
      status: 'disponible',
      location: 'Laboratorio Principal',
      last_maintenance: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('lab_material')
      .insert([materialData]);
    
    if (error) {
      console.error(`⚠️ Error creando material para "${product.name}":`, error);
    } else {
      console.log(`📋 Material creado para "${product.name}"`);
    }
    
  } catch (error) {
    console.error(`❌ Error creando materiales para producto ${productId}:`, error);
  }
}

/**
 * Carga actividades en la base de datos
 */
async function loadActivities(activities) {
  for (const [index, activity] of activities.entries()) {
    try {
      // Verificar si la actividad ya existe
      const { data: existing } = await supabase
        .from('lab_activity')
        .select('id')
        .eq('title', activity.title)
        .single();
      
      if (existing) {
        console.log(`⚠️ Actividad "${activity.title}" ya existe, saltando...`);
        continue;
      }
      
      // Validar materiales necesarios
      const validatedMaterials = await validateMaterialsNeeded(activity.materials_needed || []);
      
      // Insertar actividad
      const { data, error } = await supabase
        .from('lab_activity')
        .insert([{
          title: activity.title,
          description: activity.description,
          age_range: activity.age_range,
          estimated_duration: activity.estimated_duration,
          category: activity.category,
          oa_alignment: activity.oa_alignment,
          bloom_level: activity.bloom_level,
          methodology: activity.methodology,
          step_instructions: activity.step_instructions || [],
          materials_needed: validatedMaterials,
          difficulty: activity.difficulty || 'básico',
          group_size: activity.group_size || 'pequeño',
          multimedia_resources: activity.multimedia_resources || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error(`❌ Error insertando actividad "${activity.title}":`, error);
        continue;
      }
      
      console.log(`✅ Actividad "${activity.title}" cargada (ID: ${data[0].id})`);
      
      // Inicializar métricas para la actividad
      await initializeActivityMetrics(data[0].id);
      
    } catch (error) {
      console.error(`❌ Error procesando actividad ${index + 1}:`, error);
    }
  }
}

/**
 * Valida que los materiales necesarios existan en la base de datos
 */
async function validateMaterialsNeeded(materialIds) {
  if (!Array.isArray(materialIds) || materialIds.length === 0) {
    return [];
  }
  
  try {
    // Obtener IDs de productos existentes
    const { data: products } = await supabase
      .from('lab_product')
      .select('id')
      .order('id');
    
    if (!products || products.length === 0) {
      console.log('⚠️ No hay productos en la base de datos, usando materiales vacíos');
      return [];
    }
    
    // Mapear materiales válidos
    const validMaterials = materialIds
      .filter(id => products.some(p => p.id === id))
      .slice(0, products.length); // Limitar a productos existentes
    
    return validMaterials.length > 0 ? validMaterials : [products[0].id];
    
  } catch (error) {
    console.error('⚠️ Error validando materiales:', error);
    return [];
  }
}

/**
 * Inicializa métricas básicas para una actividad
 */
async function initializeActivityMetrics(activityId) {
  try {
    const { error } = await supabase
      .from('lab_activity_metrics')
      .insert([{
        activity_id: activityId,
        total_executions: 0,
        total_participants: 0,
        average_duration: 0,
        average_effectiveness: 0,
        last_executed: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    
    if (error && !error.message.includes('duplicate key')) {
      console.error(`⚠️ Error inicializando métricas para actividad ${activityId}:`, error);
    }
    
  } catch (error) {
    console.error(`❌ Error inicializando métricas:`, error);
  }
}

/**
 * Verifica y crea el esquema si no existe
 */
async function ensureSchema() {
  try {
    console.log('🔍 Verificando esquema de base de datos...');
    
    // Verificar que las tablas existan
    const tables = ['lab_product', 'lab_material', 'lab_activity', 'lab_activity_metrics'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.error(`❌ Tabla ${table} no existe o no es accesible:`, error.message);
        console.log('💡 Asegúrate de ejecutar primero el script de esquema: lab-schema.sql');
        process.exit(1);
      }
    }
    
    console.log('✅ Esquema de base de datos verificado');
    
  } catch (error) {
    console.error('❌ Error verificando esquema:', error);
    process.exit(1);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando carga de datos semilla del Módulo III - Laboratorios Móviles');
  console.log('=' .repeat(70));
  
  await ensureSchema();
  await loadLabSeedData();
  
  console.log('=' .repeat(70));
  console.log('🎉 Proceso completado exitosamente');
  console.log('');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

module.exports = {
  loadLabSeedData,
  loadProducts,
  loadActivities
}; 