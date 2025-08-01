const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Crea materiales de prueba para el laboratorio
 */
async function createTestMaterials() {
  try {
    console.log('🔧 Creando materiales de prueba...');
    
    // Primero crear un producto de prueba
    const { data: product, error: productError } = await supabase
      .from('lab_product')
      .insert([{
        name: 'Kit de Laboratorio Básico',
        description: 'Kit básico para experimentos de párvulos',
        category: 'ciencias_naturales',
        target_ages: ['3-4', '4-5', '5-6'],
        methodology: 'experimentacion',
        status: 'disponible',
        technical_specs: {
          material: 'Plástico no tóxico',
          piezas: 12,
          peso: '500g'
        },
        safety_considerations: [
          'Sin partes pequeñas',
          'Material no tóxico',
          'Bordes redondeados'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (productError) {
      console.error('❌ Error creando producto:', productError);
      return;
    }
    
    console.log('✅ Producto creado:', product[0].id);
    
    // Crear materiales asociados
    const materials = [
      {
        lab_product_id: product[0].id,
        name: 'MEDIOS DE TRANSPORTE',
        internal_code: 'medios-transporte-puzzle',
        specifications: {},
        quantity_per_kit: 1,
        status: 'active'
      },
      {
        lab_product_id: product[0].id,
        name: 'MEMORICE EL ANIMAL',
        internal_code: 'PARVULAB-M05',
        specifications: {},
        quantity_per_kit: 9,
        status: 'active'
      },
      {
        lab_product_id: product[0].id,
        name: 'PUZZLE ANIMALES',
        internal_code: 'puzzle-animales',
        specifications: {
          piezas: 24,
          dificultad: 'básico'
        },
        quantity_per_kit: 1,
        status: 'active'
      },
      {
        lab_product_id: product[0].id,
        name: 'BLOQUES LÓGICOS',
        internal_code: 'PARVULAB-M06',
        specifications: {
          formas: ['círculo', 'cuadrado', 'triángulo'],
          colores: ['rojo', 'azul', 'amarillo']
        },
        quantity_per_kit: 9,
        status: 'active'
      }
    ];
    
    for (const material of materials) {
      const { error } = await supabase
        .from('lab_material')
        .insert([{
          ...material,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error(`❌ Error creando material "${material.name}":`, error);
      } else {
        console.log(`✅ Material creado: ${material.name}`);
      }
    }
    
    console.log('🎉 Materiales de prueba creados exitosamente');
    
  } catch (error) {
    console.error('❌ Error creando materiales de prueba:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createTestMaterials().then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Script falló:', error);
    process.exit(1);
  });
}

module.exports = { createTestMaterials }; 