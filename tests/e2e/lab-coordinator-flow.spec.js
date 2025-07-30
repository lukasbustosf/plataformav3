const { test, expect } = require('@playwright/test');

test.describe('Módulo Laboratorios - Flujo Coordinador PIE', () => {
  let page;
  let context;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    
    // Login como coordinador PIE
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', 'test-coordinador@edu21.test');
    await page.fill('[data-testid="password-input"]', 'test123');
    await page.click('[data-testid="login-button"]');
    
    // Esperar que el login sea exitoso
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('debería navegar al módulo de laboratorios desde el dashboard', async () => {
    // Ir al dashboard principal
    await page.goto('/teacher/dashboard');
    
    // Buscar y hacer click en el módulo de laboratorios
    await page.click('[data-testid="lab-module-card"]');
    
    // Verificar que llegamos a la página de laboratorios
    await expect(page).toHaveURL(/\/lab/);
    await expect(page.locator('h1')).toContainText('Laboratorios Móviles');
  });

  test('debería mostrar catálogo de productos disponibles', async () => {
    await page.goto('/lab/products');
    
    // Verificar que se muestran productos
    await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();
    
    // Debería mostrar al menos un producto de prueba
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount({ min: 1 });
    
    // Verificar que aparece el producto de bloques lógicos
    await expect(page.locator('text=Bloques Lógicos Test')).toBeVisible();
  });

  test('debería filtrar productos por categoría', async () => {
    await page.goto('/lab/products');
    
    // Usar filtro de categoría
    await page.selectOption('[data-testid="category-filter"]', 'logica_matematica');
    await page.click('[data-testid="apply-filters-button"]');
    
    // Esperar que se aplique el filtro
    await page.waitForTimeout(1000);
    
    // Verificar que solo se muestran productos de lógica matemática
    const productCards = page.locator('[data-testid="product-card"]');
    const count = await productCards.count();
    
    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);
      await expect(card.locator('[data-testid="product-category"]')).toContainText('Lógica Matemática');
    }
  });

  test('debería crear un nuevo producto como coordinador', async () => {
    await page.goto('/lab/products');
    
    // Click en botón de crear producto
    await page.click('[data-testid="create-product-button"]');
    
    // Llenar formulario de producto
    await page.fill('[data-testid="product-name-input"]', 'Tangram Educativo E2E');
    await page.fill('[data-testid="product-description-input"]', 'Set de tangram para desarrollo espacial creado en test E2E');
    await page.selectOption('[data-testid="product-category-select"]', 'logica_matematica');
    await page.selectOption('[data-testid="product-methodology-select"]', 'montessori');
    
    // Seleccionar edades objetivo
    await page.check('[data-testid="age-4-5-checkbox"]');
    await page.check('[data-testid="age-5-6-checkbox"]');
    
    // Guardar producto
    await page.click('[data-testid="save-product-button"]');
    
    // Verificar que se creó exitosamente
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Producto creado exitosamente');
    
    // Verificar que aparece en la lista
    await expect(page.locator('text=Tangram Educativo E2E')).toBeVisible();
  });

  test('debería mostrar catálogo de actividades disponibles', async () => {
    await page.goto('/lab/activities');
    
    // Verificar que se muestran actividades
    await expect(page.locator('[data-testid="activities-grid"]')).toBeVisible();
    
    // Debería mostrar al menos una actividad de prueba
    await expect(page.locator('[data-testid="activity-card"]')).toHaveCount({ min: 1 });
    
    // Verificar que aparece la actividad de clasificación
    await expect(page.locator('text=Clasificación con Bloques Test')).toBeVisible();
  });

  test('debería filtrar actividades por edad y nivel Bloom', async () => {
    await page.goto('/lab/activities');
    
    // Aplicar filtros
    await page.selectOption('[data-testid="age-range-filter"]', '4-5');
    await page.selectOption('[data-testid="bloom-level-filter"]', 'aplicar');
    await page.click('[data-testid="apply-filters-button"]');
    
    // Esperar que se aplique el filtro
    await page.waitForTimeout(1000);
    
    // Verificar que las actividades mostradas cumplen los criterios
    const activityCards = page.locator('[data-testid="activity-card"]');
    const count = await activityCards.count();
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const card = activityCards.nth(i);
        await expect(card.locator('[data-testid="activity-age-range"]')).toContainText('4-5');
        await expect(card.locator('[data-testid="activity-bloom-level"]')).toContainText('Aplicar');
      }
    }
  });

  test('debería crear una nueva actividad como coordinador', async () => {
    await page.goto('/lab/activities');
    
    // Click en botón de crear actividad
    await page.click('[data-testid="create-activity-button"]');
    
    // Llenar formulario básico
    await page.fill('[data-testid="activity-title-input"]', 'Construcción con Bloques E2E');
    await page.fill('[data-testid="activity-description-input"]', 'Actividad de construcción libre con bloques lógicos creada en test E2E');
    
    await page.selectOption('[data-testid="activity-age-range-select"]', '4-5');
    await page.selectOption('[data-testid="activity-category-select"]', 'logica_matematica');
    await page.selectOption('[data-testid="activity-bloom-level-select"]', 'crear');
    await page.selectOption('[data-testid="activity-methodology-select"]', 'montessori');
    
    await page.fill('[data-testid="activity-duration-input"]', '45');
    await page.fill('[data-testid="activity-oa-input"]', 'OA.03');
    
    // Agregar instrucciones paso a paso
    await page.click('[data-testid="add-step-button"]');
    await page.fill('[data-testid="step-0-input"]', 'Presentar diferentes tipos de bloques');
    
    await page.click('[data-testid="add-step-button"]');
    await page.fill('[data-testid="step-1-input"]', 'Invitar a explorar libremente');
    
    await page.click('[data-testid="add-step-button"]');
    await page.fill('[data-testid="step-2-input"]', 'Proponer construcción de torre');
    
    // Seleccionar materiales necesarios
    await page.check('[data-testid="material-1-checkbox"]'); // Bloques lógicos
    
    // Guardar actividad
    await page.click('[data-testid="save-activity-button"]');
    
    // Verificar que se creó exitosamente
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Actividad creada exitosamente');
    
    // Verificar que aparece en la lista
    await expect(page.locator('text=Construcción con Bloques E2E')).toBeVisible();
  });

  test('debería ejecutar una actividad y registrar evidencias', async () => {
    await page.goto('/lab/activities');
    
    // Buscar actividad de prueba y hacer click en ejecutar
    const activityCard = page.locator('[data-testid="activity-card"]').first();
    await activityCard.locator('[data-testid="execute-activity-button"]').click();
    
    // Llenar formulario de ejecución
    await page.fill('[data-testid="execution-duration-input"]', '35');
    await page.fill('[data-testid="execution-observations-input"]', 'Los niños mostraron gran interés en la clasificación por colores. Test E2E ejecutado correctamente.');
    
    // Simular selección de estudiantes (checkboxes)
    await page.check('[data-testid="student-checkbox-1"]');
    await page.check('[data-testid="student-checkbox-2"]');
    
    // Especificar materiales utilizados
    await page.fill('[data-testid="material-1-quantity"]', '1');
    
    // Evaluar efectividad
    await page.click('[data-testid="effectiveness-rating-4"]');
    
    // Registrar ejecución
    await page.click('[data-testid="register-execution-button"]');
    
    // Verificar que se registró exitosamente
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Actividad registrada exitosamente');
  });

  test('debería subir evidencia fotográfica de la actividad', async () => {
    // Ir a logs de actividades
    await page.goto('/lab/activity-logs');
    
    // Buscar la última ejecución y hacer click en "Agregar evidencia"
    const lastLog = page.locator('[data-testid="activity-log-row"]').first();
    await lastLog.locator('[data-testid="add-evidence-button"]').click();
    
    // Subir archivo de evidencia (simulado)
    const fileInput = page.locator('[data-testid="evidence-file-input"]');
    
    // Crear un archivo de prueba simple
    const buffer = Buffer.from('fake-image-data-for-e2e-test', 'utf8');
    
    await fileInput.setInputFiles({
      name: 'evidencia-e2e-test.jpg',
      mimeType: 'image/jpeg',
      buffer: buffer
    });
    
    // Agregar descripción
    await page.fill('[data-testid="evidence-description-input"]', 'Evidencia fotográfica del test E2E - niños clasificando bloques');
    
    // Seleccionar tipo de evidencia
    await page.selectOption('[data-testid="evidence-type-select"]', 'foto');
    
    // Subir evidencia
    await page.click('[data-testid="upload-evidence-button"]');
    
    // Verificar que se subió exitosamente
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Evidencia subida exitosamente');
  });

  test('debería acceder al dashboard de métricas como coordinador', async () => {
    await page.goto('/lab/dashboard');
    
    // Verificar que puede ver el dashboard
    await expect(page.locator('h1')).toContainText('Dashboard de Laboratorios');
    
    // Verificar secciones del dashboard
    await expect(page.locator('[data-testid="usage-heatmap"]')).toBeVisible();
    await expect(page.locator('[data-testid="top-activities"]')).toBeVisible();
    await expect(page.locator('[data-testid="correlation-chart"]')).toBeVisible();
    
    // Verificar que se muestran métricas
    await expect(page.locator('[data-testid="total-executions-metric"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-duration-metric"]')).toBeVisible();
  });

  test('debería generar reporte de uso en formato PDF', async () => {
    await page.goto('/lab/reports');
    
    // Configurar fechas del reporte
    await page.fill('[data-testid="report-date-from"]', '2024-01-01');
    await page.fill('[data-testid="report-date-to"]', '2024-12-31');
    
    // Seleccionar escuela (si es necesario)
    if (await page.locator('[data-testid="school-select"]').isVisible()) {
      await page.selectOption('[data-testid="school-select"]', '1');
    }
    
    // Preparar para interceptar la descarga
    const downloadPromise = page.waitForEvent('download');
    
    // Generar reporte
    await page.click('[data-testid="generate-pdf-report-button"]');
    
    // Esperar y verificar la descarga
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('reporte-laboratorios');
    expect(download.suggestedFilename()).toContain('.pdf');
    
    // Verificar mensaje de éxito
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Reporte generado exitosamente');
  });

  test('debería manejar errores de validación apropiadamente', async () => {
    await page.goto('/lab/activities');
    
    // Intentar crear actividad con datos faltantes
    await page.click('[data-testid="create-activity-button"]');
    
    // Dejar campos requeridos vacíos y intentar guardar
    await page.click('[data-testid="save-activity-button"]');
    
    // Verificar que se muestran errores de validación
    await expect(page.locator('[data-testid="validation-error"]')).toContainText('requerido');
    
    // Verificar que el modal sigue abierto
    await expect(page.locator('[data-testid="create-activity-modal"]')).toBeVisible();
  });

  test('debería mostrar permisos apropiados para coordinador PIE', async () => {
    // Verificar que puede crear productos
    await page.goto('/lab/products');
    await expect(page.locator('[data-testid="create-product-button"]')).toBeVisible();
    
    // Verificar que puede crear actividades
    await page.goto('/lab/activities');
    await expect(page.locator('[data-testid="create-activity-button"]')).toBeVisible();
    
    // Verificar que puede acceder al dashboard
    await page.goto('/lab/dashboard');
    await expect(page.locator('[data-testid="usage-heatmap"]')).toBeVisible();
    
    // Verificar que NO puede acceder a configuración de sistema
    await page.goto('/lab/admin');
    await expect(page.locator('[data-testid="access-denied"]')).toBeVisible();
  });
}); 