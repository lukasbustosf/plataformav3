// Configuración global para Jest
const { jest } = require('@jest/globals');

// Configurar timeout global para tests largos
jest.setTimeout(30000);

// Mock global de console para tests silenciosos si es necesario
global.originalConsole = global.console;

// Configurar mocks globales para Supabase
global.mockSupabase = {
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

// Helper functions para tests
global.createMockUser = (role = 'docente', schoolId = 1) => ({
  id: 1,
  email: `test-${role}@edu21.test`,
  role: role,
  school_id: schoolId,
  name: `Test ${role}`
});

global.createMockActivity = (overrides = {}) => ({
  id: 1,
  title: 'Actividad Test',
  description: 'Descripción de prueba',
  age_range: '4-5',
  estimated_duration: 30,
  category: 'logica_matematica',
  oa_alignment: 'OA.01',
  bloom_level: 'aplicar',
  methodology: 'montessori',
  materials_needed: [1],
  ...overrides
});

global.createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Producto Test',
  description: 'Descripción de prueba',
  category: 'logica_matematica',
  target_ages: ['4-5'],
  methodology: 'montessori',
  status: 'disponible',
  ...overrides
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

// Configurar variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-supabase-key'; 