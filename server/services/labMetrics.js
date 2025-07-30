/**
 * Servicio de Métricas para el Módulo de Laboratorios
 * Realiza seguimiento del rendimiento, uso y errores.
 */

class LabMetricsService {
  constructor() {
    this.metrics = {
      catalogLoadTimes: [],
      activityExecutions: 0,
      evidenceUploadErrors: 0,
      dashboardRenders: 0,
    };
  }

  trackCatalogLoadTime(duration, filterCount) {
    console.log(`[Metrics] Catalog Load Time: ${duration}ms, Filters: ${filterCount}`);
    this.metrics.catalogLoadTimes.push({ duration, filterCount });
  }

  trackActivityExecution(activityId, duration, evidenceCount) {
    console.log(`[Metrics] Activity Executed: ${activityId}, Duration: ${duration}min, Evidence: ${evidenceCount}`);
    this.metrics.activityExecutions++;
  }

  trackEvidenceUploadError(error, totalSize, mimeType) {
    console.error(`[Metrics] Evidence Upload Error: ${error.message}, Size: ${totalSize} bytes, Type: ${mimeType}`);
    this.metrics.evidenceUploadErrors++;
  }

  trackDashboardRender(widgetCount, dataPoints, renderTime) {
    console.log(`[Metrics] Dashboard Rendered: ${widgetCount} widgets, ${dataPoints} data points, Time: ${renderTime}ms`);
    this.metrics.dashboardRenders++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgCatalogLoadTime: this.metrics.catalogLoadTimes.reduce((sum, item) => sum + item.duration, 0) / (this.metrics.catalogLoadTimes.length || 1),
    };
  }
}

const labMetrics = new LabMetricsService();

module.exports = {
  labMetrics,
  LabMetricsService,
};
