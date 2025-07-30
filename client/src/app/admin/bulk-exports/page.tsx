'use client'

import React, { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/ui/statsGrid'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FolderArrowDownIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Types
interface Template {
  id: number
  name: string
  description: string
  type: string
  format: string
  fields: string[]
  lastUsed: string
  usageCount: number
  estimatedTime: number
}

interface ExportJob {
  id: string
  templateName: string
  status: string
  requestedBy: string
  requestedAt: string
  completedAt: string | null
  size: number | null
  downloadUrl: string | null
  expiresAt: string | null
  progress?: number
  queuePosition?: number
  error?: string
}

// Mock data for bulk exports
const mockExportData = {
  overview: {
    totalExports: 1234,
    pendingExports: 23,
    completedThisMonth: 456,
    totalSize: 2.45 // GB
  },
  templates: [
    {
      id: 1,
      name: 'Libro de Clases Completo',
      description: 'Exportación completa del libro de clases con asistencia y notas',
      type: 'academic',
      format: 'CSV',
      fields: ['estudiante', 'asistencia', 'notas', 'observaciones'],
      lastUsed: '2025-01-20T10:30:00Z',
      usageCount: 45,
      estimatedTime: 5 // minutes
    },
    {
      id: 2,
      name: 'Reportes de Evaluación',
      description: 'Todas las evaluaciones y sus resultados por período',
      type: 'evaluation',
      format: 'Excel',
      fields: ['evaluacion', 'estudiante', 'puntaje', 'fecha', 'feedback'],
      lastUsed: '2025-01-19T14:15:00Z',
      usageCount: 32,
      estimatedTime: 8
    },
    {
      id: 3,
      name: 'Datos de Usuario',
      description: 'Información de usuarios y roles del sistema',
      type: 'users',
      format: 'CSV',
      fields: ['nombre', 'email', 'rol', 'escuela', 'fecha_registro'],
      lastUsed: '2025-01-18T09:45:00Z',
      usageCount: 18,
      estimatedTime: 3
    },
    {
      id: 4,
      name: 'Costos IA',
      description: 'Análisis de consumo y costos de servicios de IA',
      type: 'ai',
      format: 'PDF',
      fields: ['servicio', 'consumo', 'costo', 'fecha', 'escuela'],
      lastUsed: '2025-01-17T16:20:00Z',
      usageCount: 12,
      estimatedTime: 4
    }
  ],
  exports: [
    {
      id: '1001',
      templateName: 'Libro de Clases Completo',
      status: 'completed',
      requestedBy: 'Ana García',
      requestedAt: '2025-01-21T08:30:00Z',
      completedAt: '2025-01-21T08:35:00Z',
      size: 2.1, // MB
      downloadUrl: '/exports/libro-clases-2025-01-21.csv',
      expiresAt: '2025-01-28T08:35:00Z'
    },
    {
      id: '1002',
      templateName: 'Reportes de Evaluación',
      status: 'processing',
      requestedBy: 'Carlos Rodriguez',
      requestedAt: '2025-01-21T09:15:00Z',
      completedAt: null,
      size: null,
      downloadUrl: null,
      expiresAt: null,
      progress: 67
    },
    {
      id: '1003',
      templateName: 'Datos de Usuario',
      status: 'pending',
      requestedBy: 'María López',
      requestedAt: '2025-01-21T10:00:00Z',
      completedAt: null,
      size: null,
      downloadUrl: null,
      expiresAt: null,
      queuePosition: 2
    },
    {
      id: '1004',
      templateName: 'Costos IA',
      status: 'failed',
      requestedBy: 'Juan Pérez',
      requestedAt: '2025-01-21T07:45:00Z',
      completedAt: null,
      size: null,
      downloadUrl: null,
      expiresAt: null,
      error: 'Timeout de conexión a base de datos'
    }
  ]
}

export default function AdminBulkExportsPage() {
  const { user } = useAuth()
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedExport, setSelectedExport] = useState<ExportJob | null>(null)
  const [exportForm, setExportForm] = useState<{
    dateRange: string
    schools: string[]
    format: string
    includeDeleted: boolean
  }>({
    dateRange: 'month',
    schools: [],
    format: 'csv',
    includeDeleted: false
  })

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) return `${Math.round(sizeInMB * 1000)} KB`
    if (sizeInMB > 1000) return `${(sizeInMB / 1000).toFixed(2)} GB`
    return `${sizeInMB.toFixed(1)} MB`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircleIcon
      case 'processing': return PlayIcon
      case 'pending': return ClockIcon
      case 'failed': return ExclamationTriangleIcon
      default: return ClockIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800'
      case 'evaluation': return 'bg-green-100 text-green-800'
      case 'users': return 'bg-purple-100 text-purple-800'
      case 'ai': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const statsData: Array<{
    id: string
    label: string
    value: string
    change: {
      value: number
      type: 'increase' | 'decrease' | 'neutral'
      period: string
    }
    icon: JSX.Element
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray'
  }> = [
    {
      id: 'total-exports',
      label: 'Exportaciones Totales',
      value: formatNumber(mockExportData.overview.totalExports),
      change: {
        value: 12.4,
        type: 'increase',
        period: 'mes anterior'
      },
      icon: <ArrowDownTrayIcon className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'pending-exports',
      label: 'En Cola',
      value: formatNumber(mockExportData.overview.pendingExports),
      change: {
        value: 8.2,
        type: 'decrease',
        period: 'últimas 24h'
      },
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'yellow'
    },
    {
      id: 'completed-month',
      label: 'Completadas (Mes)',
      value: formatNumber(mockExportData.overview.completedThisMonth),
      change: {
        value: 23.1,
        type: 'increase',
        period: 'este mes'
      },
      icon: <CheckCircleIcon className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 'total-volume',
      label: 'Volumen Total',
      value: `${mockExportData.overview.totalSize} GB`,
      change: {
        value: 15.7,
        type: 'increase',
        period: 'almacenado'
      },
      icon: <CircleStackIcon className="h-5 w-5" />,
      color: 'indigo'
    }
  ]

  const templateColumns = [
    {
      key: 'template',
      label: 'Plantilla',
      mobileLabel: 'Plantilla',
      render: (row: Template) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.name}</div>
              <div className="text-sm text-gray-500">{row.description}</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'type',
      label: 'Tipo',
      mobileLabel: 'Tipo',
      hiddenOnMobile: true,
      render: (row: Template) => {
        if (!row) return <div>-</div>
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(row.type)}`}>
            {row.type === 'academic' ? 'Académico' :
             row.type === 'evaluation' ? 'Evaluación' :
             row.type === 'users' ? 'Usuarios' :
             row.type === 'ai' ? 'IA' : row.type}
          </span>
        )
      }
    },
    {
      key: 'format',
      label: 'Formato',
      mobileLabel: 'Formato',
      render: (row: Template) => {
        if (!row) return <div>-</div>
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            {row.format}
          </span>
        )
      }
    },
    {
      key: 'usage',
      label: 'Uso',
      mobileLabel: 'Uso',
      hiddenOnMobile: true,
      render: (row: Template) => {
        if (!row) return <div>-</div>
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{row.usageCount} veces</div>
            <div className="text-gray-500">~{row.estimatedTime} min</div>
          </div>
        )
      }
    },
    {
      key: 'lastUsed',
      label: 'Último Uso',
      mobileLabel: 'Uso',
      hiddenOnMobile: true,
      render: (row: Template) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-sm text-gray-600">
            {new Date(row.lastUsed).toLocaleDateString('es-CL')}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: '',
      mobileLabel: 'Acciones',
      render: (row: Template) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedTemplate(row)
                setShowTemplateModal(true)
              }}
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedTemplate(row)
                setShowExportModal(true)
              }}
            >
              <PlayIcon className="w-4 h-4 mr-1" />
              Exportar
            </Button>
          </div>
        )
      }
    }
  ]

  const exportColumns = [
    {
      key: 'export',
      label: 'Exportación',
      mobileLabel: 'Exportación',
      render: (row: ExportJob) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {React.createElement(getStatusIcon(row.status), { className: "w-4 h-4 text-blue-600" })}
            </div>
            <div>
              <div className="font-medium text-gray-900">#{row.id}</div>
              <div className="text-sm text-gray-500">{row.templateName}</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'status',
      label: 'Estado',
      mobileLabel: 'Estado',
      render: (row: ExportJob) => {
        if (!row) return <div>-</div>
        return (
          <div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
              {row.status === 'completed' ? 'Completado' :
               row.status === 'processing' ? 'Procesando' :
               row.status === 'pending' ? 'Pendiente' :
               row.status === 'failed' ? 'Error' : row.status}
            </span>
            {row.status === 'processing' && row.progress && (
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            )}
            {row.status === 'pending' && row.queuePosition && (
              <div className="text-xs text-gray-500 mt-1">
                Posición: {row.queuePosition}
              </div>
            )}
          </div>
        )
      }
    },
    {
      key: 'requestedBy',
      label: 'Solicitado por',
      mobileLabel: 'Usuario',
      hiddenOnMobile: true,
      render: (row: ExportJob) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-sm text-gray-700">{row.requestedBy}</span>
        )
      }
    },
    {
      key: 'size',
      label: 'Tamaño',
      mobileLabel: 'Tamaño',
      hiddenOnMobile: true,
      render: (row: ExportJob) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-sm text-gray-700">
            {row.size ? formatFileSize(row.size) : '-'}
          </span>
        )
      }
    },
    {
      key: 'date',
      label: 'Fecha',
      mobileLabel: 'Fecha',
      render: (row: ExportJob) => {
        if (!row) return <div>-</div>
        return (
          <div className="text-sm">
            <div className="text-gray-900">
              {new Date(row.requestedAt).toLocaleDateString('es-CL')}
            </div>
            <div className="text-gray-500">
              {new Date(row.requestedAt).toLocaleTimeString('es-CL', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: '',
      mobileLabel: 'Acciones',
      render: (row: ExportJob) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex space-x-1">
            {row.status === 'completed' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  toast.success('📥 Descarga iniciada')
                  // Handle download
                }}
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
              </Button>
            )}
            {row.status === 'failed' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedExport(row)
                  setShowTemplateModal(true)
                }}
              >
                <EyeIcon className="w-4 h-4" />
              </Button>
            )}
            {(row.status === 'pending' || row.status === 'processing') && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  toast.success('❌ Exportación cancelada')
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const handleCreateExport = () => {
    toast.success(`📊 Exportación "${selectedTemplate?.name}" agregada a la cola`)
    setShowExportModal(false)
    setSelectedTemplate(null)
    setExportForm({
      dateRange: 'month',
      schools: [],
      format: 'csv',
      includeDeleted: false
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Exportaciones Masivas 📦</h1>
              <p className="mt-2 opacity-90 text-sm sm:text-base">
                Sistema centralizado de exportación de datos
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button 
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => setShowTemplateModal(true)}
              >
                <CogIcon className="w-4 h-4 mr-2" />
                Plantillas
              </Button>
              <Button 
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={() => {
                  toast.success('📄 Nueva plantilla creada')
                }}
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Nueva Plantilla
              </Button>
            </div>
          </div>
        </div>

        <StatsGrid stats={statsData} />

        {/* Export Queue Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card-responsive">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Cola de Exportaciones</h2>
                  <p className="text-sm text-gray-600">Estado actual de las exportaciones</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success('🔄 Cola actualizada')
                  }}
                >
                  Actualizar
                </Button>
              </div>

              <ResponsiveTable
                data={mockExportData.exports}
                columns={exportColumns}
                searchable={true}
                emptyMessage="No hay exportaciones en curso"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card-responsive">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(mockExportData.templates[0])
                    setShowExportModal(true)
                  }}
                >
                  <TableCellsIcon className="w-4 h-4 mr-2" />
                  Libro de Clases
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(mockExportData.templates[1])
                    setShowExportModal(true)
                  }}
                >
                  <ChartBarIcon className="w-4 h-4 mr-2" />
                  Reportes Evaluación
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(mockExportData.templates[2])
                    setShowExportModal(true)
                  }}
                >
                  <FolderArrowDownIcon className="w-4 h-4 mr-2" />
                  Datos de Usuario
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="card-responsive">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Sistema</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Procesador</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Activo</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Base de Datos</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Conectada</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Storage</span>
                  </div>
                  <span className="text-sm font-medium text-yellow-600">75% Usado</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Cola</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">3 en proceso</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Templates */}
        <div className="card-responsive">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Plantillas Disponibles</h2>
              <p className="text-sm text-gray-600">Plantillas predefinidas para exportación</p>
            </div>
            <div className="text-sm text-gray-500">
              {mockExportData.templates.length} plantillas configuradas
            </div>
          </div>

          <ResponsiveTable
            data={mockExportData.templates}
            columns={templateColumns}
            searchable={true}
            emptyMessage="No hay plantillas configuradas"
          />
        </div>
      </div>

      {/* Export Configuration Modal */}
      <ResponsiveModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={`Configurar Exportación - ${selectedTemplate?.name}`}
        size="md"
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900">{selectedTemplate.name}</h4>
              <p className="text-sm text-blue-700 mt-1">{selectedTemplate.description}</p>
              <div className="text-xs text-blue-600 mt-2">
                Tiempo estimado: ~{selectedTemplate.estimatedTime} minutos
              </div>
            </div>

            <div>
              <label className="form-label">Rango de Fechas</label>
              <select
                value={exportForm.dateRange}
                onChange={(e) => setExportForm(prev => ({ ...prev, dateRange: e.target.value }))}
                className="input-field-mobile"
              >
                <option value="week">Última Semana</option>
                <option value="month">Último Mes</option>
                <option value="quarter">Último Trimestre</option>
                <option value="year">Último Año</option>
                <option value="all">Todos los Datos</option>
              </select>
            </div>

            <div>
              <label className="form-label">Formato de Salida</label>
              <select
                value={exportForm.format}
                onChange={(e) => setExportForm(prev => ({ ...prev, format: e.target.value }))}
                className="input-field-mobile"
              >
                <option value="csv">CSV</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="pdf">PDF</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div>
              <label className="form-label">Escuelas (opcional)</label>
              <select
                multiple
                value={exportForm.schools}
                onChange={(e) => setExportForm(prev => ({ 
                  ...prev, 
                  schools: Array.from(e.target.selectedOptions, option => option.value)
                }))}
                className="input-field-mobile h-20"
              >
                <option value="all">Todas las Escuelas</option>
                <option value="1">Colegio San Patricio</option>
                <option value="2">Instituto María Montessori</option>
                <option value="3">Liceo Técnico Industrial</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Mantén Ctrl/Cmd presionado para seleccionar múltiples escuelas
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeDeleted"
                checked={exportForm.includeDeleted}
                onChange={(e) => setExportForm(prev => ({ ...prev, includeDeleted: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeDeleted" className="ml-2 text-sm text-gray-700">
                Incluir registros eliminados
              </label>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h5 className="font-medium text-yellow-800">Importante</h5>
                  <p className="text-yellow-700 mt-1">
                    Las exportaciones grandes pueden tomar varios minutos. 
                    Recibirás una notificación cuando esté lista para descargar.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateExport}
                className="w-full sm:w-auto"
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Iniciar Exportación
              </Button>
            </div>
          </div>
        )}
      </ResponsiveModal>

      {/* Template Details Modal */}
      <ResponsiveModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title={`Detalles - ${selectedTemplate?.name || 'Plantilla'}`}
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="stats-card">
                <div className="text-sm text-gray-600">Usos Totales</div>
                <div className="text-2xl font-bold text-blue-600">
                  {selectedTemplate.usageCount}
                </div>
                <div className="text-xs text-gray-500 mt-1">exportaciones</div>
              </div>
              <div className="stats-card">
                <div className="text-sm text-gray-600">Tiempo Estimado</div>
                <div className="text-2xl font-bold text-green-600">
                  {selectedTemplate.estimatedTime}m
                </div>
                <div className="text-xs text-gray-500 mt-1">promedio</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Campos Incluidos</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.fields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Información</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">
                    {selectedTemplate.type === 'academic' ? 'Académico' :
                     selectedTemplate.type === 'evaluation' ? 'Evaluación' :
                     selectedTemplate.type === 'users' ? 'Usuarios' :
                     selectedTemplate.type === 'ai' ? 'IA' : selectedTemplate.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Formato:</span>
                  <span className="font-medium">{selectedTemplate.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Último Uso:</span>
                  <span className="font-medium">
                    {new Date(selectedTemplate.lastUsed).toLocaleDateString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            {selectedExport?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-red-800">Error en Exportación</h5>
                    <p className="text-red-700 text-sm mt-1">{selectedExport.error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setShowTemplateModal(false)
                  setShowExportModal(true)
                }}
              >
                <PlayIcon className="w-4 h-4 mr-2" />
                Usar Plantilla
              </Button>
            </div>
          </div>
        )}
      </ResponsiveModal>
    </DashboardLayout>
  )
}
