const http = require('http');
const { performance } = require('perf_hooks');

/**
 * Script de testing de performance para el Módulo III - Laboratorios Móviles
 * Mide tiempos de respuesta de las APIs del módulo
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_ITERATIONS = parseInt(process.env.TEST_ITERATIONS) || 10;
const CONCURRENT_REQUESTS = parseInt(process.env.CONCURRENT_REQUESTS) || 5;

// Endpoints del módulo de laboratorios para testear
const LAB_ENDPOINTS = [
  '/api/lab/products',
  '/api/lab/activities',
  '/api/lab/dashboard/summary',
  '/api/health'
];

class PerformanceTester {
  constructor() {
    this.results = {
      endpoints: {},
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Infinity
      }
    };
  }

  /**
   * Realiza una petición HTTP y mide el tiempo de respuesta
   */
  async makeRequest(endpoint) {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const req = http.get(url, (res) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            endpoint,
            statusCode: res.statusCode,
            responseTime,
            success: res.statusCode >= 200 && res.statusCode < 400,
            dataSize: data.length
          });
        });
      });
      
      req.on('error', (error) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          endpoint,
          statusCode: 0,
          responseTime,
          success: false,
          error: error.message
        });
      });
      
      req.setTimeout(30000, () => {
        req.destroy();
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          endpoint,
          statusCode: 0,
          responseTime,
          success: false,
          error: 'Timeout'
        });
      });
    });
  }

  /**
   * Ejecuta tests de performance en un endpoint específico
   */
  async testEndpoint(endpoint, iterations = TEST_ITERATIONS) {
    console.log(`🧪 Testing endpoint: ${endpoint}`);
    
    const endpointResults = {
      endpoint,
      requests: [],
      summary: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: Infinity,
        successRate: 0
      }
    };

    // Ejecutar requests secuenciales
    for (let i = 0; i < iterations; i++) {
      const result = await this.makeRequest(endpoint);
      endpointResults.requests.push(result);
      
      // Actualizar estadísticas
      endpointResults.summary.totalRequests++;
      if (result.success) {
        endpointResults.summary.successfulRequests++;
      } else {
        endpointResults.summary.failedRequests++;
      }
      
      endpointResults.summary.maxResponseTime = Math.max(
        endpointResults.summary.maxResponseTime, 
        result.responseTime
      );
      endpointResults.summary.minResponseTime = Math.min(
        endpointResults.summary.minResponseTime, 
        result.responseTime
      );
    }

    // Calcular promedio de tiempo de respuesta
    const totalResponseTime = endpointResults.requests.reduce(
      (sum, req) => sum + req.responseTime, 0
    );
    endpointResults.summary.averageResponseTime = totalResponseTime / iterations;
    endpointResults.summary.successRate = 
      (endpointResults.summary.successfulRequests / iterations) * 100;

    return endpointResults;
  }

  /**
   * Ejecuta tests concurrentes para simular carga
   */
  async testConcurrentLoad(endpoint, concurrentRequests = CONCURRENT_REQUESTS) {
    console.log(`⚡ Testing concurrent load: ${endpoint} (${concurrentRequests} requests)`);
    
    const startTime = performance.now();
    const promises = [];
    
    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(this.makeRequest(endpoint));
    }
    
    const results = await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    
    return {
      endpoint,
      concurrentRequests,
      totalTime,
      successful,
      failed,
      successRate: (successful / results.length) * 100,
      requestsPerSecond: (results.length / totalTime) * 1000,
      averageResponseTime: results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    };
  }

  /**
   * Ejecuta suite completa de tests de performance
   */
  async runPerformanceTests() {
    console.log('🚀 Iniciando tests de performance del Módulo III - Laboratorios Móviles');
    console.log('=' .repeat(70));
    console.log(`API Base URL: ${API_BASE_URL}`);
    console.log(`Iteraciones por endpoint: ${TEST_ITERATIONS}`);
    console.log(`Requests concurrentes: ${CONCURRENT_REQUESTS}`);
    console.log('=' .repeat(70));

    // Tests secuenciales por endpoint
    for (const endpoint of LAB_ENDPOINTS) {
      try {
        const endpointResults = await this.testEndpoint(endpoint);
        this.results.endpoints[endpoint] = endpointResults;
        
        console.log(`✅ ${endpoint}:`);
        console.log(`   Éxito: ${endpointResults.summary.successRate.toFixed(1)}%`);
        console.log(`   Tiempo promedio: ${endpointResults.summary.averageResponseTime.toFixed(2)}ms`);
        console.log(`   Tiempo máximo: ${endpointResults.summary.maxResponseTime.toFixed(2)}ms`);
        console.log(`   Tiempo mínimo: ${endpointResults.summary.minResponseTime.toFixed(2)}ms`);
        
      } catch (error) {
        console.error(`❌ Error testing ${endpoint}:`, error.message);
      }
    }

    console.log('\n🔥 Tests de carga concurrente:');
    
    // Tests de carga concurrente
    for (const endpoint of LAB_ENDPOINTS.slice(0, 2)) { // Solo endpoints principales
      try {
        const loadResults = await this.testConcurrentLoad(endpoint);
        
        console.log(`⚡ ${endpoint}:`);
        console.log(`   ${loadResults.concurrentRequests} requests en ${loadResults.totalTime.toFixed(2)}ms`);
        console.log(`   Tasa éxito: ${loadResults.successRate.toFixed(1)}%`);
        console.log(`   Requests/segundo: ${loadResults.requestsPerSecond.toFixed(2)}`);
        console.log(`   Tiempo promedio: ${loadResults.averageResponseTime.toFixed(2)}ms`);
        
      } catch (error) {
        console.error(`❌ Error en test de carga ${endpoint}:`, error.message);
      }
    }

    // Calcular resumen general
    this.calculateOverallSummary();
    this.printSummary();
    this.evaluatePerformance();
  }

  /**
   * Calcula estadísticas generales
   */
  calculateOverallSummary() {
    let totalRequests = 0;
    let successfulRequests = 0;
    let allResponseTimes = [];
    
    Object.values(this.results.endpoints).forEach(endpoint => {
      totalRequests += endpoint.summary.totalRequests;
      successfulRequests += endpoint.summary.successfulRequests;
      
      endpoint.requests.forEach(req => {
        allResponseTimes.push(req.responseTime);
      });
    });
    
    this.results.summary = {
      totalRequests,
      successfulRequests,
      failedRequests: totalRequests - successfulRequests,
      averageResponseTime: allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length,
      maxResponseTime: Math.max(...allResponseTimes),
      minResponseTime: Math.min(...allResponseTimes),
      successRate: (successfulRequests / totalRequests) * 100
    };
  }

  /**
   * Imprime resumen de resultados
   */
  printSummary() {
    console.log('\n📊 RESUMEN GENERAL DE PERFORMANCE:');
    console.log('=' .repeat(50));
    console.log(`Total de requests: ${this.results.summary.totalRequests}`);
    console.log(`Requests exitosos: ${this.results.summary.successfulRequests}`);
    console.log(`Requests fallidos: ${this.results.summary.failedRequests}`);
    console.log(`Tasa de éxito: ${this.results.summary.successRate.toFixed(1)}%`);
    console.log(`Tiempo promedio: ${this.results.summary.averageResponseTime.toFixed(2)}ms`);
    console.log(`Tiempo máximo: ${this.results.summary.maxResponseTime.toFixed(2)}ms`);
    console.log(`Tiempo mínimo: ${this.results.summary.minResponseTime.toFixed(2)}ms`);
    console.log('=' .repeat(50));
  }

  /**
   * Evalúa la performance y da recomendaciones
   */
  evaluatePerformance() {
    console.log('\n🎯 EVALUACIÓN DE PERFORMANCE:');
    
    const { averageResponseTime, successRate } = this.results.summary;
    
    // Criterios de evaluación
    const criteria = {
      excellent: { responseTime: 100, successRate: 99 },
      good: { responseTime: 300, successRate: 95 },
      acceptable: { responseTime: 1000, successRate: 90 },
      poor: { responseTime: 3000, successRate: 80 }
    };
    
    let performanceLevel = 'crítico';
    let recommendations = [];
    
    if (averageResponseTime <= criteria.excellent.responseTime && successRate >= criteria.excellent.successRate) {
      performanceLevel = '🌟 EXCELENTE';
      recommendations.push('✅ Performance óptima del módulo de laboratorios');
    } else if (averageResponseTime <= criteria.good.responseTime && successRate >= criteria.good.successRate) {
      performanceLevel = '✅ BUENO';
      recommendations.push('✅ Performance aceptable para producción');
    } else if (averageResponseTime <= criteria.acceptable.responseTime && successRate >= criteria.acceptable.successRate) {
      performanceLevel = '⚠️ ACEPTABLE';
      recommendations.push('⚠️ Considerar optimizaciones para mejorar tiempos');
    } else if (averageResponseTime <= criteria.poor.responseTime && successRate >= criteria.poor.successRate) {
      performanceLevel = '🔶 POBRE';
      recommendations.push('🔶 Requiere optimización urgente');
      recommendations.push('🔧 Revisar queries de base de datos');
      recommendations.push('🔧 Implementar caching');
    } else {
      performanceLevel = '🔴 CRÍTICO';
      recommendations.push('🚨 Performance crítica - revisar inmediatamente');
      recommendations.push('🔧 Optimizar base de datos y queries');
      recommendations.push('🔧 Implementar caching agresivo');
      recommendations.push('🔧 Revisar arquitectura del servidor');
    }
    
    console.log(`Nivel de performance: ${performanceLevel}`);
    console.log('\nRecomendaciones:');
    recommendations.forEach(rec => console.log(`  ${rec}`));
    
    // Recomendaciones específicas por endpoint
    console.log('\n📋 Análisis por endpoint:');
    Object.entries(this.results.endpoints).forEach(([endpoint, results]) => {
      if (results.summary.averageResponseTime > 500) {
        console.log(`⚠️ ${endpoint}: Tiempo promedio alto (${results.summary.averageResponseTime.toFixed(2)}ms)`);
      }
      if (results.summary.successRate < 95) {
        console.log(`🔴 ${endpoint}: Tasa de éxito baja (${results.summary.successRate.toFixed(1)}%)`);
      }
    });
  }
}

/**
 * Función principal
 */
async function main() {
  const tester = new PerformanceTester();
  
  try {
    await tester.runPerformanceTests();
    
    // Retornar código de salida basado en performance
    const { successRate, averageResponseTime } = tester.results.summary;
    
    if (successRate < 80 || averageResponseTime > 3000) {
      console.log('\n💥 Performance crítica detectada');
      process.exit(1);
    } else if (successRate < 95 || averageResponseTime > 1000) {
      console.log('\n⚠️ Performance sub-óptima detectada');
      process.exit(0); // No fallar CI, pero advertir
    } else {
      console.log('\n🎉 Performance satisfactoria');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('💥 Error ejecutando tests de performance:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = PerformanceTester; 