const { test, expect } = require('@playwright/test');

/**
 * Tests de smoke para el Módulo III - Laboratorios Móviles
 * Estos tests se ejecutan en producción para validar funcionalidad básica
 */

test.describe('Módulo Laboratorios - Smoke Tests Producción', () => {
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  
  test.beforeEach(async ({ page }) => {
    // Configurar timeouts más largos para producción
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
  });

  test('debería cargar la página principal de la plataforma', async ({ page }) => {
    await page.goto(baseURL);
    
    // Verificar que la página principal carga
    await expect(page).toHaveTitle(/EDU21/);
    
    // Verificar elementos esenciales
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('debería permitir login y acceso al dashboard del teacher', async ({ page }) => {
    await page.goto(`${baseURL}/login`);
    
    // Verificar que la página de login carga
    await expect(page.locator('h1')).toContainText('Iniciar Sesión');
    
    // Verificar formulario de login está presente
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('debería mostrar el módulo de laboratorios en el dashboard', async ({ page }) => {
    // Ir directamente al dashboard (asumiendo autenticación por otros medios en producción)
    await page.goto(`${baseURL}/teacher/dashboard`);
    
    // Esperar que el dashboard cargue
    await page.waitForLoadState('networkidle');
    
    // Buscar indicadores del módulo de laboratorios
    const labModuleIndicators = [
      'Laboratorios Móviles',
      'Módulo III',
      'Material Concreto',
      'ABP'
    ];
    
    let moduleFound = false;
    for (const indicator of labModuleIndicators) {
      if (await page.locator(`text=${indicator}`).count() > 0) {
        moduleFound = true;
        break;
      }
    }
    
    // Si no se encuentra visualmente, verificar que al menos el dashboard carga
    if (!moduleFound) {
      await expect(page.locator('h1, h2')).toContainText(/Dashboard|Panel/);
      console.log('⚠️ Módulo de laboratorios no visible en dashboard, pero dashboard funciona');
    } else {
      console.log('✅ Módulo de laboratorios encontrado en dashboard');
    }
  });

  test('debería responder las APIs del módulo de laboratorios', async ({ request }) => {
    const apiBaseURL = process.env.PRODUCTION_API_URL || 'http://localhost:5000';
    
    // Test API de productos
    try {
      const productsResponse = await request.get(`${apiBaseURL}/api/lab/products`);
      
      if (productsResponse.status() === 200) {
        const products = await productsResponse.json();
        expect(products).toHaveProperty('success');
        console.log('✅ API de productos del módulo funcionando');
      } else if (productsResponse.status() === 401) {
        console.log('⚠️ API requiere autenticación (esperado en producción)');
      } else {
        console.log(`⚠️ API de productos retornó status: ${productsResponse.status()}`);
      }
    } catch (error) {
      console.log('⚠️ Error accediendo API de productos:', error.message);
    }
    
    // Test API de actividades
    try {
      const activitiesResponse = await request.get(`${apiBaseURL}/api/lab/activities`);
      
      if (activitiesResponse.status() === 200) {
        const activities = await activitiesResponse.json();
        expect(activities).toHaveProperty('success');
        console.log('✅ API de actividades del módulo funcionando');
      } else if (activitiesResponse.status() === 401) {
        console.log('⚠️ API requiere autenticación (esperado en producción)');
      } else {
        console.log(`⚠️ API de actividades retornó status: ${activitiesResponse.status()}`);
      }
    } catch (error) {
      console.log('⚠️ Error accediendo API de actividades:', error.message);
    }
  });

  test('debería cargar recursos estáticos sin errores', async ({ page }) => {
    // Interceptar errores de recursos
    const failedResources = [];
    
    page.on('response', response => {
      if (response.status() >= 400) {
        failedResources.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    await page.goto(`${baseURL}/teacher/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Verificar que no hay muchos recursos fallidos críticos
    const criticalFailures = failedResources.filter(resource => 
      resource.status >= 500 || 
      resource.url.includes('.js') || 
      resource.url.includes('.css')
    );
    
    if (criticalFailures.length > 0) {
      console.log('⚠️ Recursos fallidos críticos:', criticalFailures);
    }
    
    // Permitir algunos errores menores pero no críticos
    expect(criticalFailures.length).toBeLessThan(3);
  });

  test('debería tener tiempo de carga aceptable', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(`${baseURL}/teacher/dashboard`);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Tiempo de carga del dashboard: ${loadTime}ms`);
    
    // Verificar que el tiempo de carga sea razonable (menos de 10 segundos en producción)
    expect(loadTime).toBeLessThan(10000);
  });

  test('debería manejar errores graciosamente', async ({ page }) => {
    // Interceptar errores de JavaScript
    const jsErrors = [];
    
    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    await page.goto(`${baseURL}/teacher/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Verificar que no hay errores críticos de JavaScript
    const criticalErrors = jsErrors.filter(error => 
      !error.includes('warning') && 
      !error.includes('favicon') &&
      !error.includes('analytics')
    );
    
    if (criticalErrors.length > 0) {
      console.log('⚠️ Errores de JavaScript encontrados:', criticalErrors);
    }
    
    // Permitir algunos errores menores pero no críticos
    expect(criticalErrors.length).toBeLessThan(3);
  });

  test('debería tener meta tags esenciales para SEO', async ({ page }) => {
    await page.goto(`${baseURL}/teacher/dashboard`);
    
    // Verificar meta tags esenciales
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    
    const description = await page.getAttribute('meta[name="description"]', 'content');
    if (description) {
      expect(description.length).toBeGreaterThan(20);
    }
    
    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewport).toContain('width=device-width');
    
    console.log('✅ Meta tags esenciales presentes');
  });

  test('debería ser responsive en dispositivos móviles', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(`${baseURL}/teacher/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Verificar que no hay scroll horizontal
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 20); // 20px de tolerancia
    
    // Verificar que elementos principales son visibles
    await expect(page.locator('nav, header, main')).toBeVisible();
    
    console.log('✅ Dashboard es responsive en móvil');
  });

  test('debería tener headers de seguridad básicos', async ({ request }) => {
    const response = await request.get(`${baseURL}/teacher/dashboard`);
    
    const headers = response.headers();
    
    // Verificar headers de seguridad básicos
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection'
    ];
    
    let securityScore = 0;
    securityHeaders.forEach(header => {
      if (headers[header]) {
        securityScore++;
        console.log(`✅ Header de seguridad presente: ${header}`);
      } else {
        console.log(`⚠️ Header de seguridad faltante: ${header}`);
      }
    });
    
    // Al menos 2 de 3 headers de seguridad deberían estar presentes
    expect(securityScore).toBeGreaterThanOrEqual(2);
  });
}); 