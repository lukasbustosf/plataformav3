const request = require('supertest');
const app = require('../app');
const { createClient } = require('@supabase/supabase-js');

// Mock de Supabase para tests
jest.mock('@supabase/supabase-js');

describe('Lab Module API Tests', () => {
  let supabaseMock;
  let authToken;

  beforeEach(() => {
    // Setup mock de Supabase
    supabaseMock = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      storage: {
        from: jest.fn().mockReturnThis(),
        upload: jest.fn(),
        getPublicUrl: jest.fn()
      },
      auth: {
        getUser: jest.fn()
      }
    };

    createClient.mockReturnValue(supabaseMock);
    
    // Token de prueba
    authToken = 'test-auth-token';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/lab/products', () => {
    it('debería retornar lista de productos', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'Bloques Lógicos',
          category: 'logica_matematica',
          status: 'disponible'
        }
      ];

      supabaseMock.select.mockResolvedValue({
        data: mockProducts,
        error: null
      });

      const response = await request(app)
        .get('/api/lab/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockProducts);
      expect(supabaseMock.from).toHaveBeenCalledWith('lab_product');
    });

    it('debería filtrar por categoría', async () => {
      const category = 'ciencias_naturales';
      
      supabaseMock.select.mockResolvedValue({
        data: [],
        error: null
      });

      await request(app)
        .get(`/api/lab/products?category=${category}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(supabaseMock.eq).toHaveBeenCalledWith('category', category);
    });

    it('debería manejar errores de base de datos', async () => {
      supabaseMock.select.mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      });

      const response = await request(app)
        .get('/api/lab/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Database error');
    });
  });

  describe('POST /api/lab/products', () => {
    it('debería crear un nuevo producto', async () => {
      const newProduct = {
        name: 'Microscopio Infantil',
        description: 'Microscopio adaptado para párvulos',
        category: 'ciencias_naturales',
        target_ages: ['4-5', '5-6'],
        methodology: 'observacion_directa'
      };

      const mockCreatedProduct = { id: 1, ...newProduct };

      supabaseMock.insert.mockResolvedValue({
        data: [mockCreatedProduct],
        error: null
      });

      const response = await request(app)
        .post('/api/lab/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newProduct.name);
      expect(supabaseMock.insert).toHaveBeenCalledWith(newProduct);
    });

    it('debería validar datos requeridos', async () => {
      const invalidProduct = {
        description: 'Producto sin nombre'
      };

      const response = await request(app)
        .post('/api/lab/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProduct)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requerido');
    });
  });

  describe('GET /api/lab/activities', () => {
    it('debería retornar actividades con filtros', async () => {
      const mockActivities = [
        {
          id: 1,
          title: 'Conteo con Bloques',
          age_range: '4-5',
          oa_alignment: 'OA.01',
          bloom_level: 'aplicar'
        }
      ];

      supabaseMock.select.mockResolvedValue({
        data: mockActivities,
        error: null
      });

      const response = await request(app)
        .get('/api/lab/activities?age_range=4-5&bloom_level=aplicar')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockActivities);
    });

    it('debería aplicar paginación', async () => {
      supabaseMock.select.mockResolvedValue({
        data: [],
        error: null
      });

      await request(app)
        .get('/api/lab/activities?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(supabaseMock.range).toHaveBeenCalledWith(10, 19);
    });
  });

  describe('POST /api/lab/activities/execute', () => {
    it('debería registrar ejecución de actividad', async () => {
      const executionData = {
        activity_id: 1,
        student_ids: [101, 102],
        materials_used: [{ id: 1, quantity: 10 }],
        duration_minutes: 45,
        observations: 'Actividad completada exitosamente'
      };

      const mockLog = { id: 1, ...executionData };

      supabaseMock.insert.mockResolvedValue({
        data: [mockLog],
        error: null
      });

      const response = await request(app)
        .post('/api/lab/activities/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .send(executionData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(supabaseMock.insert).toHaveBeenCalled();
    });

    it('debería actualizar métricas automáticamente', async () => {
      const executionData = {
        activity_id: 1,
        student_ids: [101],
        materials_used: [],
        duration_minutes: 30
      };

      supabaseMock.insert.mockResolvedValue({
        data: [{ id: 1 }],
        error: null
      });

      await request(app)
        .post('/api/lab/activities/execute')
        .set('Authorization', `Bearer ${authToken}`)
        .send(executionData)
        .expect(201);

      // Verificar que se llamó para actualizar métricas
      expect(supabaseMock.from).toHaveBeenCalledWith('lab_activity_metrics');
    });
  });

  describe('GET /api/lab/dashboard/heatmap', () => {
    it('debería generar mapa de calor de uso', async () => {
      const mockHeatmapData = [
        {
          material_id: 1,
          material_name: 'Bloques Lógicos',
          total_uses: 15,
          avg_duration: 35.5
        }
      ];

      supabaseMock.select.mockResolvedValue({
        data: mockHeatmapData,
        error: null
      });

      const response = await request(app)
        .get('/api/lab/dashboard/heatmap?school_id=1&date_from=2024-01-01')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockHeatmapData);
    });
  });

  describe('GET /api/lab/dashboard/correlation', () => {
    it('debería calcular correlación uso-progreso OA', async () => {
      const mockCorrelationData = [
        { oa_code: 'OA.01', usage_frequency: 10, progress_average: 0.75 },
        { oa_code: 'OA.02', usage_frequency: 8, progress_average: 0.68 }
      ];

      supabaseMock.select.mockResolvedValue({
        data: mockCorrelationData,
        error: null
      });

      const response = await request(app)
        .get('/api/lab/dashboard/correlation?school_id=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.correlation_coefficient).toBeDefined();
      expect(typeof response.body.correlation_coefficient).toBe('number');
    });

    it('debería manejar casos con datos insuficientes', async () => {
      supabaseMock.select.mockResolvedValue({
        data: [], // Sin datos
        error: null
      });

      const response = await request(app)
        .get('/api/lab/dashboard/correlation?school_id=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.correlation_coefficient).toBe(null);
      expect(response.body.message).toContain('insuficientes');
    });
  });

  describe('Tests de funciones auxiliares', () => {
    describe('calculatePearsonCorrelation', () => {
      // Necesitamos importar la función si está exportada
      const { calculatePearsonCorrelation } = require('../utils/math-utils');

      it('debería calcular correlación positiva perfecta', () => {
        const x = [1, 2, 3, 4, 5];
        const y = [2, 4, 6, 8, 10];
        
        const correlation = calculatePearsonCorrelation(x, y);
        expect(correlation).toBeCloseTo(1.0, 2);
      });

      it('debería calcular correlación negativa perfecta', () => {
        const x = [1, 2, 3, 4, 5];
        const y = [10, 8, 6, 4, 2];
        
        const correlation = calculatePearsonCorrelation(x, y);
        expect(correlation).toBeCloseTo(-1.0, 2);
      });

      it('debería manejar arrays de diferentes longitudes', () => {
        const x = [1, 2, 3];
        const y = [1, 2];
        
        expect(() => calculatePearsonCorrelation(x, y)).toThrow();
      });

      it('debería manejar arrays vacíos', () => {
        const x = [];
        const y = [];
        
        const correlation = calculatePearsonCorrelation(x, y);
        expect(correlation).toBeNull();
      });
    });
  });

  describe('Tests de autenticación y autorización', () => {
    it('debería rechazar requests sin token', async () => {
      await request(app)
        .get('/api/lab/products')
        .expect(401);
    });

    it('debería rechazar tokens inválidos', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' }
      });

      await request(app)
        .get('/api/lab/products')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('Tests de manejo de archivos', () => {
    it('debería subir evidencia correctamente', async () => {
      const mockFileUrl = 'https://storage.url/evidence/test.jpg';
      
      supabaseMock.storage.upload.mockResolvedValue({
        data: { path: 'evidence/test.jpg' },
        error: null
      });

      supabaseMock.storage.getPublicUrl.mockReturnValue({
        data: { publicUrl: mockFileUrl }
      });

      supabaseMock.insert.mockResolvedValue({
        data: [{ id: 1 }],
        error: null
      });

      const response = await request(app)
        .post('/api/lab/evidence')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('fake image data'), 'test.jpg')
        .field('activity_log_id', '1')
        .field('evidence_type', 'foto')
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.file_url).toBe(mockFileUrl);
    });

    it('debería validar tipos de archivo', async () => {
      const response = await request(app)
        .post('/api/lab/evidence')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('fake data'), 'test.txt')
        .field('activity_log_id', '1')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('tipo de archivo');
    });
  });
});

// Tests de utilidades específicas del módulo
describe('Lab Utils Tests', () => {
  describe('Data validation', () => {
    const { validateActivityData, validateProductData } = require('../utils/lab-validation');

    it('debería validar datos de actividad correctos', () => {
      const validActivity = {
        title: 'Actividad de Prueba',
        description: 'Descripción válida',
        age_range: '4-5',
        estimated_duration: 30,
        materials_needed: [1, 2],
        oa_alignment: 'OA.01',
        bloom_level: 'aplicar'
      };

      const result = validateActivityData(validActivity);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('debería detectar errores en datos de actividad', () => {
      const invalidActivity = {
        title: '', // Título vacío
        age_range: 'invalid', // Rango inválido
        estimated_duration: -5, // Duración negativa
        bloom_level: 'invalid_level' // Nivel Bloom inválido
      };

      const result = validateActivityData(invalidActivity);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Permission helpers', () => {
    const { checkLabPermissions } = require('../utils/lab-permissions');

    it('debería validar permisos de coordinador PIE', () => {
      const user = { role: 'coordinador_pie' };
      
      expect(checkLabPermissions(user, 'create_activity')).toBe(true);
      expect(checkLabPermissions(user, 'manage_materials')).toBe(true);
      expect(checkLabPermissions(user, 'admin_settings')).toBe(false);
    });

    it('debería validar permisos de docente', () => {
      const user = { role: 'docente' };
      
      expect(checkLabPermissions(user, 'execute_activity')).toBe(true);
      expect(checkLabPermissions(user, 'view_reports')).toBe(true);
      expect(checkLabPermissions(user, 'create_activity')).toBe(false);
    });
  });
}); 