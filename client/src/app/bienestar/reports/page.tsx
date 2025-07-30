'use client'

import { useState, Fragment } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Dialog, Transition } from '@headlessui/react'
import { 
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  EyeIcon,
  ClockIcon,
  UsersIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface WellnessReport {
  id: string
  title: string
  type: 'monthly' | 'quarterly' | 'annual' | 'custom'
  period: string
  generatedDate: string
  status: 'generated' | 'draft' | 'reviewing'
  author: string
  studentsAnalyzed: number
  interventions: number
  paiCases: number
  fileSize: string
  format: 'pdf' | 'excel' | 'word'
}

interface WellnessMetric {
  category: string
  current: number
  previous: number
  target: number
  trend: 'up' | 'down' | 'stable'
  unit: string
  description: string
}

export default function BienestarReportsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [selectedType, setSelectedType] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<WellnessReport | null>(null)

  // Mock reports data
  const reports: WellnessReport[] = [
    {
      id: 'RPT-001',
      title: 'Reporte Mensual de Bienestar - Diciembre 2024',
      type: 'monthly',
      period: 'Diciembre 2024',
      generatedDate: '2024-12-19',
      status: 'generated',
      author: 'Psic. Ana López',
      studentsAnalyzed: 680,
      interventions: 23,
      paiCases: 5,
      fileSize: '2.5 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-002',
      title: 'Análisis Trimestral de Intervenciones Q4 2024',
      type: 'quarterly',
      period: 'Q4 2024',
      generatedDate: '2024-12-15',
      status: 'generated',
      author: 'T.S. María Torres',
      studentsAnalyzed: 680,
      interventions: 78,
      paiCases: 15,
      fileSize: '5.8 MB',
      format: 'excel'
    },
    {
      id: 'RPT-003',
      title: 'Reporte de Casos PAI - Noviembre 2024',
      type: 'monthly',
      period: 'Noviembre 2024',
      generatedDate: '2024-11-30',
      status: 'generated',
      author: 'Psic. Luis Morales',
      studentsAnalyzed: 680,
      interventions: 18,
      paiCases: 4,
      fileSize: '1.8 MB',
      format: 'pdf'
    },
    {
      id: 'RPT-004',
      title: 'Análisis de Factores de Riesgo - Semestre 2',
      type: 'custom',
      period: 'Jul-Dic 2024',
      generatedDate: '2024-12-10',
      status: 'reviewing',
      author: 'T.S. Carmen Vega',
      studentsAnalyzed: 680,
      interventions: 156,
      paiCases: 28,
      fileSize: '8.2 MB',
      format: 'word'
    },
    {
      id: 'RPT-005',
      title: 'Reporte Anual de Bienestar Estudiantil 2024',
      type: 'annual',
      period: '2024',
      generatedDate: '2024-12-05',
      status: 'draft',
      author: 'Equipo Bienestar',
      studentsAnalyzed: 680,
      interventions: 324,
      paiCases: 45,
      fileSize: '12.5 MB',
      format: 'pdf'
    }
  ]

  // Mock wellness metrics
  const wellnessMetrics: WellnessMetric[] = [
    {
      category: 'Índice de Bienestar General',
      current: 82.5,
      previous: 79.8,
      target: 85.0,
      trend: 'up',
      unit: '%',
      description: 'Promedio ponderado de indicadores de bienestar estudiantil'
    },
    {
      category: 'Estudiantes en Riesgo',
      current: 23,
      previous: 28,
      target: 15,
      trend: 'down',
      unit: 'estudiantes',
      description: 'Número de estudiantes identificados con factores de riesgo'
    },
    {
      category: 'Tasa de Asistencia a Intervenciones',
      current: 88.5,
      previous: 85.2,
      target: 90.0,
      trend: 'up',
      unit: '%',
      description: 'Porcentaje de asistencia a sesiones programadas'
    },
    {
      category: 'Tiempo Promedio de Resolución PAI',
      current: 4.2,
      previous: 4.8,
      target: 3.5,
      trend: 'down',
      unit: 'meses',
      description: 'Tiempo promedio desde creación hasta resolución de casos PAI'
    },
    {
      category: 'Satisfacción Familiar',
      current: 4.6,
      previous: 4.4,
      target: 4.8,
      trend: 'up',
      unit: '/5',
      description: 'Puntuación promedio de satisfacción de las familias'
    },
    {
      category: 'Casos Críticos Resueltos',
      current: 95,
      previous: 92,
      target: 98,
      trend: 'up',
      unit: '%',
      description: 'Porcentaje de casos críticos resueltos exitosamente'
    }
  ]

  const currentStats = {
    totalStudents: 680,
    studentsAtRisk: 23,
    activeInterventions: 15,
    completedPAICases: 3,
    wellnessScore: 82.5,
    interventionSuccessRate: 88.5,
    familySatisfaction: 4.6,
    avgResponseTime: 2.1
  }

  const riskDistribution = {
    academic: 8,
    behavioral: 6,
    social: 4,
    emotional: 3,
    family: 2
  }

  const interventionTypes = {
    psychological: 9,
    academic: 4,
    social: 2,
    behavioral: 0,
    family: 0
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'ALL' || report.type === selectedType
    
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800'
      case 'reviewing': return 'bg-yellow-100 text-yellow-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generated': return 'Generado'
      case 'reviewing': return 'En Revisión'
      case 'draft': return 'Borrador'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'monthly': return 'Mensual'
      case 'quarterly': return 'Trimestral'
      case 'annual': return 'Anual'
      case 'custom': return 'Personalizado'
      default: return type
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄'
      case 'excel': return '📊'
      case 'word': return '📝'
      default: return '📄'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
      case 'stable': return <MinusIcon className="h-4 w-4 text-gray-500" />
      default: return <MinusIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string, isGoodTrend: boolean) => {
    if (trend === 'stable') return 'text-gray-600'
    if ((trend === 'up' && isGoodTrend) || (trend === 'down' && !isGoodTrend)) {
      return 'text-green-600'
    }
    return 'text-red-600'
  }

  const handleGenerateReport = () => {
    toast.success('Iniciando generación de nuevo reporte...')
  }

  const handleViewReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId)
    if (report) {
      setSelectedReport(report)
      setShowViewModal(true)
    }
  }

  const handleDownloadReport = (reportId: string, format: string) => {
    toast.success(`Descargando reporte ${reportId} en formato ${format.toUpperCase()}...`)
  }

  const handleExportDashboard = (format: string) => {
    toast.success(`Exportando dashboard en formato ${format.toUpperCase()}...`)
  }

  const handlePrintDashboard = () => {
    toast.success('Preparando dashboard para impresión...')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reportes de Bienestar 📊</h1>
                <p className="text-gray-600 mt-1">
                  Análisis y reportes de bienestar estudiantil
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handlePrintDashboard}
                  variant="outline"
                >
                  <PrinterIcon className="h-5 w-5 mr-2" />
                  Imprimir
                </Button>
                <Button
                  onClick={() => handleExportDashboard('pdf')}
                  variant="outline"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar Dashboard
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Metrics Dashboard */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Indicadores Actuales de Bienestar</h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="current-month">Mes Actual</option>
                <option value="last-month">Mes Anterior</option>
                <option value="current-quarter">Trimestre Actual</option>
                <option value="current-year">Año Actual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HeartIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Índice de Bienestar</p>
                  <p className="text-3xl font-bold">{currentStats.wellnessScore}%</p>
                  <p className="text-xs opacity-75">+2.7% vs mes anterior</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Estudiantes en Riesgo</p>
                  <p className="text-3xl font-bold">{currentStats.studentsAtRisk}</p>
                  <p className="text-xs opacity-75">-5 vs mes anterior</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Intervenciones Activas</p>
                  <p className="text-3xl font-bold">{currentStats.activeInterventions}</p>
                  <p className="text-xs opacity-75">88.5% tasa de éxito</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm opacity-90">Casos PAI Completados</p>
                  <p className="text-3xl font-bold">{currentStats.completedPAICases}</p>
                  <p className="text-xs opacity-75">Este mes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessMetrics.map((metric, index) => {
              const isGoodTrend = ['Índice de Bienestar General', 'Tasa de Asistencia a Intervenciones', 'Satisfacción Familiar', 'Casos Críticos Resueltos'].includes(metric.category)
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900">{metric.category}</h3>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.current}{metric.unit}
                    </span>
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend, isGoodTrend)}`}>
                      {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                      {Math.abs(metric.current - metric.previous)}{metric.unit}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Actual</span>
                      <span>Meta: {metric.target}{metric.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.current >= metric.target ? 'bg-green-500' :
                          metric.current >= metric.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Risk Analysis Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Factores de Riesgo</h3>
            <div className="space-y-4">
              {Object.entries(riskDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700 capitalize">
                    {type === 'academic' ? 'Académico' :
                     type === 'behavioral' ? 'Conductual' :
                     type === 'social' ? 'Social' :
                     type === 'emotional' ? 'Emocional' :
                     type === 'family' ? 'Familiar' : type}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(riskDistribution))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Intervenciones por Tipo</h3>
            <div className="space-y-4">
              {Object.entries(interventionTypes).map(([type, count]) => (
                <div key={type} className="flex items-center">
                  <div className="w-32 text-sm text-gray-700 capitalize">
                    {type === 'psychological' ? 'Psicológica' :
                     type === 'academic' ? 'Académica' :
                     type === 'social' ? 'Social' :
                     type === 'behavioral' ? 'Conductual' :
                     type === 'family' ? 'Familiar' : type}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${count > 0 ? (count / Math.max(...Object.values(interventionTypes))) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Reportes Generados</h2>
              <div className="flex space-x-4">
                <div className="flex space-x-2">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="ALL">Todos los tipos</option>
                    <option value="monthly">Mensual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="annual">Anual</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar reportes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo/Período
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datos Analizados
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Generación
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{getFormatIcon(report.format)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          <div className="text-sm text-gray-500">
                            {report.fileSize} • {report.format.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{getTypeText(report.type)}</div>
                      <div className="text-sm text-gray-500">{report.period}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{report.author}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">{report.studentsAnalyzed} estudiantes</div>
                      <div className="text-xs text-gray-500">
                        {report.interventions} intervenciones • {report.paiCases} casos PAI
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(report.generatedDate).toLocaleDateString('es-CL')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver Reporte"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report.id, report.format)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Descargar"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Report Modal */}
        <Transition.Root show={showViewModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setShowViewModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                    {selectedReport && (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                            {selectedReport.title}
                          </Dialog.Title>
                          <button
                            onClick={() => setShowViewModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Report Details */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                              Información del Reporte
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">ID:</span>
                                <span className="text-sm text-gray-900">{selectedReport.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Tipo:</span>
                                <span className="text-sm text-gray-900">{getTypeText(selectedReport.type)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Período:</span>
                                <span className="text-sm text-gray-900">{selectedReport.period}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Estado:</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(selectedReport.status)}`}>
                                  {getStatusText(selectedReport.status)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Formato:</span>
                                <span className="text-sm text-gray-900 flex items-center">
                                  <span className="mr-2">{getFormatIcon(selectedReport.format)}</span>
                                  {selectedReport.format.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Tamaño:</span>
                                <span className="text-sm text-gray-900">{selectedReport.fileSize}</span>
                              </div>
                            </div>
                          </div>

                          {/* Author and Generation */}
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              <UserIcon className="h-5 w-5 mr-2 text-green-600" />
                              Autor y Generación
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Autor:</span>
                                <span className="text-sm text-gray-900">{selectedReport.author}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Fecha de Generación:</span>
                                <span className="text-sm text-gray-900">
                                  {new Date(selectedReport.generatedDate).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Hora de Generación:</span>
                                <span className="text-sm text-gray-900">
                                  {new Date(selectedReport.generatedDate).toLocaleTimeString('es-CL')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Data Analysis Summary */}
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                            <ChartBarIcon className="h-5 w-5 mr-2 text-purple-600" />
                            Resumen de Datos Analizados
                          </h4>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{selectedReport.studentsAnalyzed}</div>
                                <div className="text-sm text-gray-600">Estudiantes Analizados</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{selectedReport.interventions}</div>
                                <div className="text-sm text-gray-600">Intervenciones Revisadas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{selectedReport.paiCases}</div>
                                <div className="text-sm text-gray-600">Casos PAI Incluidos</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Report Content Preview */}
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Contenido del Reporte</h4>
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-700 space-y-2">
                              <p><strong>Resumen Ejecutivo:</strong> Este reporte presenta un análisis detallado del bienestar estudiantil durante el período {selectedReport.period}.</p>
                              <p><strong>Metodología:</strong> Se analizaron datos de {selectedReport.studentsAnalyzed} estudiantes, incluyendo factores de riesgo, intervenciones implementadas y resultados obtenidos.</p>
                              <p><strong>Hallazgos Principales:</strong></p>
                              <ul className="ml-4 space-y-1">
                                <li>• Índice de bienestar general: 82.5% (↑ 2.7 puntos vs período anterior)</li>
                                <li>• Estudiantes en riesgo identificados: {Math.round(selectedReport.studentsAnalyzed * 0.034)}</li>
                                <li>• Tasa de éxito en intervenciones: 88.5%</li>
                                <li>• Satisfacción familiar promedio: 4.6/5</li>
                              </ul>
                              <p><strong>Recomendaciones:</strong> Se sugiere continuar con las estrategias de intervención temprana y fortalecer el trabajo colaborativo con las familias.</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end space-x-3">
                          <Button
                            onClick={() => handleDownloadReport(selectedReport.id, selectedReport.format)}
                            variant="outline"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Descargar {selectedReport.format.toUpperCase()}
                          </Button>
                          <Button
                            onClick={() => {
                              setShowViewModal(false)
                              toast.success(`Enviando reporte ${selectedReport.id} por correo...`)
                            }}
                            variant="outline"
                          >
                            📧 Enviar por Correo
                          </Button>
                          <Button
                            onClick={() => {
                              setShowViewModal(false)
                              handlePrintDashboard()
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <PrinterIcon className="h-4 w-4 mr-2" />
                            Imprimir
                          </Button>
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </DashboardLayout>
  )
} 