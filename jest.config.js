module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  
  // Directorios de tests
  testMatch: [
    'server/__tests__/**/*.test.js',
    'server/__tests__/**/*.spec.js'
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/client/',
    '/tests/e2e/'
  ],
  
  // Setup y teardown
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Covertura de código
  collectCoverage: true,
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/node_modules/**',
    '!server/__tests__/**',
    '!server/uploads/**',
    '!server/*.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    // Threshold específico para módulo de laboratorios
    'server/routes/lab.js': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    'server/utils/lab-*.js': {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  
  // Transformaciones
  transform: {},
  
  // Extensiones de archivos
  moduleFileExtensions: ['js', 'json'],
  
  // Variables de entorno para tests
  setupFiles: ['<rootDir>/jest.env.js'],
  
  // Timeout para tests
  testTimeout: 30000,
  
  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'lab-unit-test-results.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}'
    }],
    ['jest-html-reporter', {
      pageTitle: 'Módulo Laboratorios - Tests Unitarios',
      outputPath: 'test-results/lab-unit-test-report.html',
      includeFailureMsg: true,
      includeSuiteFailure: true
    }]
  ],
  
  // Configuración de verbose
  verbose: true,
  
  // Detectar archivos abiertos
  detectOpenHandles: true,
  
  // Limpiar mocks automáticamente
  clearMocks: true,
  
  // Restablecer mocks entre tests
  resetMocks: false,
  
  // Restablecer modules entre tests
  resetModules: false
}; 