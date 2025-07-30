/**
 * Calcula el coeficiente de correlación de Pearson entre dos arrays
 * @param {number[]} x - Primera variable
 * @param {number[]} y - Segunda variable
 * @returns {number|null} - Coeficiente de correlación (-1 a 1) o null si no es calculable
 */
function calculatePearsonCorrelation(x, y) {
  // Validaciones básicas
  if (!Array.isArray(x) || !Array.isArray(y)) {
    throw new Error('Ambos parámetros deben ser arrays');
  }
  
  if (x.length === 0 || y.length === 0) {
    return null;
  }
  
  if (x.length !== y.length) {
    throw new Error('Los arrays deben tener la misma longitud');
  }
  
  const n = x.length;
  
  // Calcular medias
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calcular numerador y denominadores
  let numerator = 0;
  let sumSquaredDeviationsX = 0;
  let sumSquaredDeviationsY = 0;
  
  for (let i = 0; i < n; i++) {
    const deviationX = x[i] - meanX;
    const deviationY = y[i] - meanY;
    
    numerator += deviationX * deviationY;
    sumSquaredDeviationsX += deviationX * deviationX;
    sumSquaredDeviationsY += deviationY * deviationY;
  }
  
  // Evitar división por cero
  const denominator = Math.sqrt(sumSquaredDeviationsX * sumSquaredDeviationsY);
  if (denominator === 0) {
    return null;
  }
  
  return numerator / denominator;
}

/**
 * Calcula estadísticas descriptivas básicas
 * @param {number[]} data - Array de números
 * @returns {object} - Objeto con estadísticas
 */
function calculateDescriptiveStats(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;
  
  // Mediana
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2
    : sorted[Math.floor(n/2)];
  
  // Desviación estándar
  const squaredDifferences = data.map(val => Math.pow(val - mean, 2));
  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / n;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    count: n,
    sum,
    mean,
    median,
    min: Math.min(...data),
    max: Math.max(...data),
    variance,
    standardDeviation,
    range: Math.max(...data) - Math.min(...data)
  };
}

/**
 * Calcula percentiles de un dataset
 * @param {number[]} data - Array de números
 * @param {number} percentile - Percentil a calcular (0-100)
 * @returns {number} - Valor del percentil
 */
function calculatePercentile(data, percentile) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }
  
  if (percentile < 0 || percentile > 100) {
    throw new Error('El percentil debe estar entre 0 y 100');
  }
  
  const sorted = [...data].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  } else {
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }
}

/**
 * Calcula la tendencia lineal usando regresión simple
 * @param {number[]} x - Variable independiente
 * @param {number[]} y - Variable dependiente
 * @returns {object} - Coeficientes de la regresión
 */
function calculateLinearTrend(x, y) {
  if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length) {
    throw new Error('Arrays inválidos para regresión');
  }
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return {
    slope,
    intercept,
    equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
    rSquared: Math.pow(calculatePearsonCorrelation(x, y), 2)
  };
}

/**
 * Normaliza un array de valores a un rango 0-1
 * @param {number[]} data - Array de números
 * @returns {number[]} - Array normalizado
 */
function normalizeData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  if (range === 0) {
    return data.map(() => 0.5); // Todos los valores son iguales
  }
  
  return data.map(val => (val - min) / range);
}

/**
 * Calcula la significancia estadística de una correlación
 * @param {number} correlation - Coeficiente de correlación
 * @param {number} n - Tamaño de la muestra
 * @returns {object} - Información sobre significancia
 */
function calculateCorrelationSignificance(correlation, n) {
  if (n < 3) {
    return { significant: false, pValue: null, message: 'Muestra muy pequeña' };
  }
  
  // Transformación de Fisher
  const zr = 0.5 * Math.log((1 + correlation) / (1 - correlation));
  const standardError = 1 / Math.sqrt(n - 3);
  const zScore = zr / standardError;
  
  // Aproximación del p-value (bilateral)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  return {
    correlation,
    zScore,
    pValue,
    significant: pValue < 0.05,
    confidence: pValue < 0.01 ? 'alta' : pValue < 0.05 ? 'moderada' : 'baja',
    interpretation: getCorrelationInterpretation(correlation)
  };
}

/**
 * Aproximación de la función de distribución normal acumulativa
 * @param {number} z - Valor z
 * @returns {number} - Probabilidad acumulativa
 */
function normalCDF(z) {
  // Aproximación de Abramowitz y Stegun
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return z > 0 ? 1 - prob : prob;
}

/**
 * Interpreta el valor de correlación
 * @param {number} correlation - Coeficiente de correlación
 * @returns {string} - Interpretación textual
 */
function getCorrelationInterpretation(correlation) {
  const abs = Math.abs(correlation);
  const direction = correlation > 0 ? 'positiva' : 'negativa';
  
  if (abs < 0.1) return `Correlación ${direction} muy débil`;
  if (abs < 0.3) return `Correlación ${direction} débil`;
  if (abs < 0.5) return `Correlación ${direction} moderada`;
  if (abs < 0.7) return `Correlación ${direction} fuerte`;
  if (abs < 0.9) return `Correlación ${direction} muy fuerte`;
  return `Correlación ${direction} casi perfecta`;
}

module.exports = {
  calculatePearsonCorrelation,
  calculateDescriptiveStats,
  calculatePercentile,
  calculateLinearTrend,
  normalizeData,
  calculateCorrelationSignificance,
  getCorrelationInterpretation
}; 