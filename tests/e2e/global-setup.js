const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('🔧 Configurando entorno para tests E2E del módulo de laboratorios...');
  
  // Crear browser para setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Esperar a que los servicios estén disponibles
    console.log('⏳ Esperando servicios...');
    
    // Verificar que el cliente esté disponible
    await page.goto(config.baseURL, { waitUntil: 'networkidle' });
    console.log('✅ Cliente frontend disponible');
    
    // Verificar que la API esté disponible
    const apiResponse = await page.request.get(`http://localhost:5000/api/health`);
    if (apiResponse.ok()) {
      console.log('✅ API backend disponible');
    } else {
      console.log('⚠️ API backend no responde, continuando...');
    }
    
    // Crear usuario de prueba para tests
    const testUser = {
      email: 'test-coordinador@edu21.test',
      password: 'test123',
      role: 'coordinador_pie',
      name: 'Coordinador Test',
      school_id: 1
    };
    
    try {
      const createUserResponse = await page.request.post(`http://localhost:5000/api/auth/register`, {
        data: testUser
      });
      
      if (createUserResponse.ok()) {
        console.log('✅ Usuario de prueba creado');
      } else {
        console.log('⚠️ Usuario de prueba ya existe o error en creación');
      }
    } catch (error) {
      console.log('⚠️ Error creando usuario de prueba:', error.message);
    }
    
    // Preparar datos de prueba básicos
    await setupTestData(page);
    
    console.log('✅ Setup global completado');
    
  } catch (error) {
    console.error('❌ Error en setup global:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function setupTestData(page) {
  console.log('📊 Configurando datos de prueba...');
  
  try {
    // Primero hacer login como admin para crear datos
    const loginResponse = await page.request.post(`http://localhost:5000/api/auth/login`, {
      data: {
        email: 'admin@edu21.test',
        password: 'admin123'
      }
    });
    
    if (!loginResponse.ok()) {
      console.log('⚠️ No se pudo hacer login como admin, saltando creación de datos');
      return;
    }
    
    const loginData = await loginResponse.json();
    const authToken = loginData.token;
    
    // Crear productos de prueba
    const testProducts = [
      {
        name: 'Bloques Lógicos Test',
        description: 'Set de bloques para desarrollo lógico-matemático',
        category: 'logica_matematica',
        target_ages: ['4-5', '5-6'],
        methodology: 'montessori',
        status: 'disponible'
      },
      {
        name: 'Microscopio Infantil Test',
        description: 'Microscopio adaptado para párvulos',
        category: 'ciencias_naturales',
        target_ages: ['5-6', '6-7'],
        methodology: 'observacion_directa',
        status: 'disponible'
      }
    ];
    
    for (const product of testProducts) {
      try {
        await page.request.post(`http://localhost:5000/api/lab/products`, {
          data: product,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.log('⚠️ Error creando producto de prueba:', error.message);
      }
    }
    
    // Crear actividades de prueba
    const testActivities = [
      {
        title: 'Clasificación con Bloques Test',
        description: 'Actividad para clasificar bloques por color y forma',
        age_range: '4-5',
        estimated_duration: 30,
        category: 'logica_matematica',
        oa_alignment: 'OA.01',
        bloom_level: 'aplicar',
        methodology: 'montessori',
        materials_needed: [1], // ID del primer producto
        step_instructions: [
          'Presentar los bloques a los niños',
          'Explicar las características (color, forma, tamaño)',
          'Pedir que clasifiquen por color',
          'Luego clasificar por forma',
          'Combinar criterios de clasificación'
        ]
      }
    ];
    
    for (const activity of testActivities) {
      try {
        await page.request.post(`http://localhost:5000/api/lab/activities`, {
          data: activity,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.log('⚠️ Error creando actividad de prueba:', error.message);
      }
    }
    
    console.log('✅ Datos de prueba configurados');
    
  } catch (error) {
    console.log('⚠️ Error configurando datos de prueba:', error.message);
  }
}

module.exports = globalSetup; 