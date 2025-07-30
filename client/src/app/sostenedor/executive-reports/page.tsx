'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  TrophyIcon,
  BanknotesIcon,
  AcademicCapIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  EyeIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PresentationChartBarIcon,
  DocumentTextIcon,
  ChartPieIcon,
  TableCellsIcon,
  PhotoIcon,
  FilmIcon
} from '@heroicons/react/24/outline'

export default function SostenedorExecutiveReports() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  // Available report categories
  const reportCategories = [
    { id: 'financial', name: 'Financieros', icon: BanknotesIcon, color: 'green' },
    { id: 'academic', name: 'Académicos', icon: AcademicCapIcon, color: 'blue' },
    { id: 'operational', name: 'Operacionales', icon: BuildingOfficeIcon, color: 'purple' },
    { id: 'strategic', name: 'Estratégicos', icon: PresentationChartBarIcon, color: 'orange' },
    { id: 'compliance', name: 'Cumplimiento', icon: CheckCircleIcon, color: 'teal' },
    { id: 'technology', name: 'Tecnología', icon: CpuChipIcon, color: 'indigo' }
  ]

  // Executive report templates
  const reportTemplates = [
    {
      id: 1,
      name: 'Reporte Ejecutivo Mensual',
      category: 'strategic',
      description: 'Resumen ejecutivo completo con KPIs clave, tendencias y recomendaciones estratégicas',
      frequency: 'Mensual',
      lastGenerated: '2024-12-15T10:30:00',
      format: ['PDF', 'PowerPoint'],
      pages: 25,
      sections: ['Resumen Ejecutivo', 'KPIs Financieros', 'Rendimiento Académico', 'Operaciones', 'Recomendaciones'],
      status: 'ready',
      priority: 'high',
      recipients: ['CEO', 'Board of Directors', 'Regional Managers']
    },
    {
      id: 2,
      name: 'Análisis Financiero Trimestral',
      category: 'financial',
      description: 'Análisis detallado de ingresos, costos, rentabilidad y proyecciones financieras',
      frequency: 'Trimestral',
      lastGenerated: '2024-12-01T09:00:00',
      format: ['PDF', 'Excel'],
      pages: 35,
      sections: ['P&L Consolidado', 'Análisis por Colegio', 'Cash Flow', 'Presupuesto vs Real', 'Proyecciones'],
      status: 'ready',
      priority: 'high',
      recipients: ['CFO', 'Finance Team', 'Board of Directors']
    },
    {
      id: 3,
      name: 'Dashboard Académico Semanal',
      category: 'academic',
      description: 'Métricas de rendimiento académico, cobertura curricular y análisis Bloom',
      frequency: 'Semanal',
      lastGenerated: '2024-12-18T16:00:00',
      format: ['PDF', 'Dashboard'],
      pages: 15,
      sections: ['Rendimiento General', 'Análisis Bloom', 'Cobertura OA', 'Comparación Colegios'],
      status: 'ready',
      priority: 'medium',
      recipients: ['Academic Directors', 'School Principals']
    },
    {
      id: 4,
      name: 'Reporte de Cumplimiento Regulatorio',
      category: 'compliance',
      description: 'Estado de cumplimiento normativo, auditorías y certificaciones',
      frequency: 'Mensual',
      lastGenerated: '2024-12-10T14:00:00',
      format: ['PDF'],
      pages: 20,
      sections: ['Cumplimiento MINEDUC', 'Auditorías', 'Certificaciones', 'Riesgos', 'Plan de Acción'],
      status: 'pending',
      priority: 'high',
      recipients: ['Legal Team', 'Compliance Officer', 'CEO']
    },
    {
      id: 5,
      name: 'Análisis de Tecnología e IA',
      category: 'technology',
      description: 'Uso de tecnología, costos de IA, optimizaciones y roadmap tecnológico',
      frequency: 'Mensual',
      lastGenerated: '2024-12-12T11:30:00',
      format: ['PDF', 'Dashboard'],
      pages: 18,
      sections: ['Uso de IA', 'Costos Tecnológicos', 'Optimizaciones', 'Roadmap', 'ROI Tecnológico'],
      status: 'ready',
      priority: 'medium',
      recipients: ['CTO', 'IT Team', 'Finance Team']
    },
    {
      id: 6,
      name: 'Benchmarking Competitivo',
      category: 'strategic',
      description: 'Comparación con competidores, posicionamiento de mercado y oportunidades',
      frequency: 'Trimestral',
      lastGenerated: '2024-11-30T12:00:00',
      format: ['PDF', 'PowerPoint'],
      pages: 30,
      sections: ['Análisis Competitivo', 'Posicionamiento', 'Market Share', 'Oportunidades', 'Estrategias'],
      status: 'outdated',
      priority: 'medium',
      recipients: ['CEO', 'Strategy Team', 'Marketing Team']
    }
  ]

  // Recent reports generated
  const recentReports = [
    {
      id: 1,
      name: 'Reporte Ejecutivo - Diciembre 2024',
      type: 'strategic',
      generatedAt: '2024-12-19T09:00:00',
      size: '2.4 MB',
      format: 'PDF',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 2,
      name: 'Dashboard Académico - Semana 50',
      type: 'academic',
      generatedAt: '2024-12-18T16:30:00',
      size: '1.8 MB',
      format: 'PDF',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 3,
      name: 'Análisis IA - Noviembre 2024',
      type: 'technology',
      generatedAt: '2024-12-15T14:15:00',
      size: '3.1 MB',
      format: 'PDF',
      status: 'completed',
      downloadUrl: '#'
    },
    {
      id: 4,
      name: 'Reporte Financiero Q4',
      type: 'financial',
      generatedAt: '2024-12-12T10:45:00',
      size: '4.2 MB',
      format: 'Excel',
      status: 'processing',
      downloadUrl: null
    }
  ]

  // Report generation statistics
  const reportStats = {
    totalReports: 156,
    monthlyReports: 24,
    automatedReports: 89,
    manualReports: 67,
    avgGenerationTime: '3.2 min',
    totalDownloads: 1247,
    mostPopular: 'Reporte Ejecutivo Mensual'
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      financial: 'bg-green-100 text-green-800',
      academic: 'bg-blue-100 text-blue-800',
      operational: 'bg-purple-100 text-purple-800',
      strategic: 'bg-orange-100 text-orange-800',
      compliance: 'bg-teal-100 text-teal-800',
      technology: 'bg-indigo-100 text-indigo-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'outdated': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircleIcon className="h-4 w-4" />
      case 'pending': return <ClockIcon className="h-4 w-4" />
      case 'outdated': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'processing': return <PlayIcon className="h-4 w-4" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      default: return <InformationCircleIcon className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReports = reportTemplates.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes Ejecutivos 📊</h1>
            <p className="text-gray-600 mt-1">
              Genera y accede a reportes estratégicos para la toma de decisiones
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Schedule reports */}}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Programar Reportes
            </Button>
            <Button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center"
            >
              <DocumentChartBarIcon className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Report Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Reportes</p>
                <p className="text-2xl font-bold text-gray-900">{reportStats.totalReports}</p>
                <p className="text-xs text-blue-600">{reportStats.monthlyReports} este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Automatizados</p>
                <p className="text-2xl font-bold text-gray-900">{reportStats.automatedReports}</p>
                <p className="text-xs text-green-600">{((reportStats.automatedReports / reportStats.totalReports) * 100).toFixed(1)}% del total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tiempo Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{reportStats.avgGenerationTime}</p>
                <p className="text-xs text-purple-600">generación</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ArrowDownTrayIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Descargas</p>
                <p className="text-2xl font-bold text-gray-900">{reportStats.totalDownloads.toLocaleString()}</p>
                <p className="text-xs text-orange-600">total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Categorías de Reportes</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input text-sm"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último año</option>
            </select>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedCategory === 'all' 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <TableCellsIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className="text-sm font-medium text-gray-900">Todos</div>
            </button>
            {reportCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Plantillas de Reportes ({filteredReports.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(report.category)}`}>
                          {reportCategories.find(c => c.id === report.category)?.name}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-gray-500">Frecuencia</div>
                          <div className="text-sm font-medium text-gray-900">{report.frequency}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Páginas</div>
                          <div className="text-sm font-medium text-gray-900">{report.pages}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Última generación</div>
                          <div className="text-sm font-medium text-gray-900">{formatDate(report.lastGenerated)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Formatos</div>
                          <div className="flex space-x-1">
                            {report.format.map((fmt, index) => (
                              <span key={index} className="px-1 py-0.5 bg-gray-100 text-xs text-gray-600 rounded">
                                {fmt}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Secciones incluidas:</div>
                        <div className="flex flex-wrap gap-1">
                          {report.sections.slice(0, 3).map((section, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-xs text-blue-800 rounded">
                              {section}
                            </span>
                          ))}
                          {report.sections.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                              +{report.sections.length - 3} más
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Destinatarios:</div>
                        <div className="text-sm text-gray-700">{report.recipients.join(', ')}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Preview report */}}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Vista Previa
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Schedule report */}}
                      >
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Programar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {/* Generate now */}}
                        disabled={report.status === 'processing'}
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Generar Ahora
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Reportes Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tamaño
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500">{report.format}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(report.type)}`}>
                        {reportCategories.find(c => c.id === report.type)?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(report.generatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Preview */}}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        {report.downloadUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Download */}}
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 