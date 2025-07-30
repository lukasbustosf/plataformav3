// Variables de entorno específicas para testing
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test-jwt-secret-for-lab-module';
process.env.SUPABASE_URL = 'https://test-lab-module.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-supabase-anon-key-lab';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-supabase-service-key-lab';

// Configuraciones de testing específicas
process.env.TEST_MODE = 'true';
process.env.DISABLE_LOGGING = 'true';
process.env.MOCK_FILE_UPLOADS = 'true';

// Base de datos de prueba
process.env.TEST_DB_NAME = 'edu21_lab_test';

// Configuración de archivos de prueba
process.env.TEST_UPLOAD_DIR = './test-uploads';
process.env.MAX_FILE_SIZE = '5MB';

// Timeouts para tests
process.env.TEST_TIMEOUT = '30000';
process.env.API_TIMEOUT = '10000';

console.log('🧪 Variables de entorno de testing configuradas para módulo de laboratorios'); 