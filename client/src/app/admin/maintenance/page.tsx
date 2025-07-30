'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ServerIcon,
  CircleStackIcon,
  CloudIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
  TrashIcon,
  BoltIcon,
  CommandLineIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface MaintenanceTask {
  id: string
  name: string
  category: 'database' | 'cache' | 'storage' | 'performance' | 'security'
  status: 'idle' | 'running' | 'completed' | 'failed'
  lastRun: string
  nextRun: string
  duration: string
  description: string
  automated: boolean
}

interface SystemHealth {
  database: { status: 'healthy' | 'warning' | 'critical', details: string }
  cache: { status: 'healthy' | 'warning' | 'critical', details: string }
  storage: { status: 'healthy' | 'warning' | 'critical', details: string }
  performance: { status: 'healthy' | 'warning' | 'critical', details: string }
}

export default function AdminMaintenancePage() {
  const { user } = useAuth()
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null)
  const [runningTask, setRunningTask] = useState<string | null>(null)

  const [maintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: 'db-optimize',
      name: 'Optimización de Base de Datos',
      category: 'database',
      status: 'idle',
      lastRun: '2024-01-19T02:00:00Z',
      nextRun: '2024-01-20T02:00:00Z',
      duration: '15 min',
      description: 'Optimiza índices y limpia registros obsoletos',
      automated: true
    },
    {
      id: 'cache-clear',
      name: 'Limpieza de Cache',
      category: 'cache',
      status: 'idle',
      lastRun: '2024-01-19T06:00:00Z',
      nextRun: '2024-01-19T18:00:00Z',
      duration: '2 min',
      description: 'Limpia cache de Redis y archivos temporales',
      automated: true
    },
    {
      id: 'storage-cleanup',
      name: 'Limpieza de Almacenamiento',
      category: 'storage',
      status: 'running',
      lastRun: '2024-01-19T10:30:00Z',
      nextRun: '2024-01-26T10:30:00Z',
      duration: '30 min',
      description: 'Elimina archivos temporales y logs antiguos',
      automated: false
    },
    {
      id: 'performance-audit',
      name: 'Auditoría de Rendimiento',
      category: 'performance',
      status: 'completed',
      lastRun: '2024-01-19T08:00:00Z',
      nextRun: '2024-01-22T08:00:00Z',
      duration: '45 min',
      description: 'Analiza métricas de rendimiento y genera reportes',
      automated: true
    },
    {
      id: 'security-scan',
      name: 'Escaneo de Seguridad',
      category: 'security',
      status: 'idle',
      lastRun: '2024-01-18T22:00:00Z',
      nextRun: '2024-01-21T22:00:00Z',
      duration: '1 hora',
      description: 'Escanea vulnerabilidades y actualiza parches',
      automated: true
    },
    {
      id: 'backup-verify',
      name: 'Verificación de Backups',
      category: 'storage',
      status: 'failed',
      lastRun: '2024-01-19T01:00:00Z',
      nextRun: '2024-01-20T01:00:00Z',
      duration: '20 min',
      description: 'Verifica integridad de backups automáticos',
      automated: true
    }
  ])

  const [systemHealth] = useState<SystemHealth>({
    database: { status: 'healthy', details: 'Todas las conexiones funcionando correctamente' },
    cache: { status: 'warning', details: 'Uso de memoria al 78% - Se recomienda limpieza' },
    storage: { status: 'healthy', details: 'Espacio disponible: 2.3TB (67% libre)' },
    performance: { status: 'healthy', details: 'Tiempo de respuesta promedio: 120ms' }
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return CircleStackIcon
      case 'cache': return ServerIcon
      case 'storage': return CloudIcon
      case 'performance': return ChartBarIcon
      case 'security': return ShieldCheckIcon
      default: return CogIcon
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'database': return 'bg-blue-100 text-blue-600'
      case 'cache': return 'bg-green-100 text-green-600'
      case 'storage': return 'bg-purple-100 text-purple-600'
      case 'performance': return 'bg-orange-100 text-orange-600'
      case 'security': return 'bg-red-100 text-red-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'idle': return { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: 'En Espera' }
      case 'running': return { color: 'bg-blue-100 text-blue-800', icon: ArrowPathIcon, label: 'Ejecutándose' }
      case 'completed': return { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Completado' }
      case 'failed': return { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon, label: 'Falló' }
      default: return { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: 'Desconocido' }
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleRunTask = async (taskId: string) => {
    setRunningTask(taskId)
    try {
      toast.success('Iniciando tarea de mantenimiento...')
      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success('Tarea de mantenimiento completada exitosamente')
    } catch (error) {
      toast.error('Error al ejecutar tarea de mantenimiento')
    } finally {
      setRunningTask(null)
    }
  }

  const handleEmergencyMaintenance = () => {
    toast.success('Modo de mantenimiento de emergencia activado')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mantenimiento del Sistema</h1>
              <p className="mt-2 opacity-90">
                Gestión y monitoreo de tareas de mantenimiento automatizadas
              </p>
            </div>
            <Button 
              onClick={handleEmergencyMaintenance}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              Mantenimiento de Emergencia
            </Button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(systemHealth).map(([key, health]) => {
            const Icon = getCategoryIcon(key)
            return (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getCategoryColor(key)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600 capitalize">{key}</p>
                      <p className={`text-lg font-semibold capitalize ${getHealthStatusColor(health.status)}`}>
                        {health.status === 'healthy' ? 'Saludable' : 
                         health.status === 'warning' ? 'Advertencia' : 'Crítico'}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{health.details}</p>
              </div>
            )
          })}
        </div>

        {/* Maintenance Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Tareas de Mantenimiento</h2>
              <div className="flex items-center space-x-3">
                <Button size="sm" variant="outline">
                  <CommandLineIcon className="w-4 h-4 mr-2" />
                  Consola Avanzada
                </Button>
                <Button size="sm">
                  <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {maintenanceTasks.map((task) => {
                const CategoryIcon = getCategoryIcon(task.category)
                const statusInfo = getStatusInfo(task.status)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(task.category)}`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </span>
                            {task.automated && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                <BoltIcon className="w-3 h-3 mr-1" />
                                Automática
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Última Ejecución</p>
                              <p className="font-medium">{new Date(task.lastRun).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Próxima Ejecución</p>
                              <p className="font-medium">{new Date(task.nextRun).toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Duración Estimada</p>
                              <p className="font-medium">{task.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTask(task)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Ver Detalles
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleRunTask(task.id)}
                          disabled={task.status === 'running' || runningTask === task.id}
                        >
                          {runningTask === task.id ? (
                            <>
                              <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                              Ejecutando...
                            </>
                          ) : (
                            <>
                              <ArrowPathIcon className="w-4 h-4 mr-1" />
                              Ejecutar Ahora
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrashIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Limpieza Profunda</h3>
                <p className="text-sm text-gray-600">Limpia logs, cache y archivos temporales</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Ejecutar Limpieza
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Análisis de Rendimiento</h3>
                <p className="text-sm text-gray-600">Genera reporte completo de métricas</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Generar Reporte
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Verificación Completa</h3>
                <p className="text-sm text-gray-600">Verifica integridad del sistema</p>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              Verificar Sistema
            </Button>
          </div>
        </div>

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles de la Tarea - {selectedTask.name}
                </h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Categoría:</span> {selectedTask.category}</p>
                      <p><span className="font-medium">Estado:</span> {getStatusInfo(selectedTask.status).label}</p>
                      <p><span className="font-medium">Automatizada:</span> {selectedTask.automated ? 'Sí' : 'No'}</p>
                      <p><span className="font-medium">Duración:</span> {selectedTask.duration}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Programación</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Última ejecución:</span> {new Date(selectedTask.lastRun).toLocaleString()}</p>
                      <p><span className="font-medium">Próxima ejecución:</span> {new Date(selectedTask.nextRun).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Descripción</h4>
                  <p className="text-sm text-gray-700">{selectedTask.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Historial de Ejecución</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>19 Ene 2024 02:00</span>
                        <span className="text-green-600">✓ Completado (14m 32s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>18 Ene 2024 02:00</span>
                        <span className="text-green-600">✓ Completado (15m 21s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>17 Ene 2024 02:00</span>
                        <span className="text-red-600">✗ Falló (timeout)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Cerrar
                </Button>
                <Button onClick={() => {
                  handleRunTask(selectedTask.id)
                  setSelectedTask(null)
                }}>
                  Ejecutar Tarea
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
