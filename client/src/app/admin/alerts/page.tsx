'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ExclamationTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CogIcon,
  EyeIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  source: string
  school_name?: string
  timestamp: string
  status: 'active' | 'acknowledged' | 'resolved'
  priority: 'high' | 'medium' | 'low'
}

export default function AdminAlertsPage() {
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')

  const alerts: Alert[] = [
    {
      id: 'alert-001',
      type: 'critical',
      title: 'Presupuesto IA Excedido',
      message: 'Colegio Bilingüe International ha excedido su presupuesto mensual de IA en un 105%',
      source: 'AI Budget Monitor',
      school_name: 'Colegio Bilingüe International',
      timestamp: '2024-06-22T10:30:00Z',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'alert-002',
      type: 'warning',
      title: 'Uso de CPU Alto',
      message: 'Servidor principal reporta uso de CPU del 85% durante los últimos 15 minutos',
      source: 'System Monitor',
      timestamp: '2024-06-22T09:45:00Z',
      status: 'acknowledged',
      priority: 'medium'
    },
    {
      id: 'alert-003',
      type: 'warning',
      title: 'Intentos de Login Fallidos',
      message: '15 intentos de login fallidos desde IP 192.168.1.100 en los últimos 5 minutos',
      source: 'Security Monitor',
      timestamp: '2024-06-22T09:15:00Z',
      status: 'active',
      priority: 'high'
    },
    {
      id: 'alert-004',
      type: 'info',
      title: 'Backup Completado',
      message: 'Backup automático diario completado exitosamente. Tamaño: 2.4GB',
      source: 'Backup System',
      timestamp: '2024-06-22T03:00:00Z',
      status: 'resolved',
      priority: 'low'
    },
    {
      id: 'alert-005',
      type: 'critical',
      title: 'Base de Datos Desconectada',
      message: 'Pérdida de conexión con base de datos secundaria. Failover activado automáticamente',
      source: 'Database Monitor',
      timestamp: '2024-06-21T22:30:00Z',
      status: 'resolved',
      priority: 'high'
    },
    {
      id: 'alert-006',
      title: 'Licencia Por Vencer',
      type: 'warning',
      message: 'La licencia de Escuela Los Andes vence en 7 días',
      source: 'License Manager',
      school_name: 'Escuela Los Andes',
      timestamp: '2024-06-21T08:00:00Z',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 'alert-007',
      type: 'success',
      title: 'Actualización Completada',
      message: 'Actualización del sistema EDU21 v2.1.3 desplegada exitosamente',
      source: 'Deployment System',
      timestamp: '2024-06-20T18:00:00Z',
      status: 'resolved',
      priority: 'low'
    }
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-l-blue-500 bg-blue-50'
      case 'success':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Activa
          </span>
        )
      case 'acknowledged':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Reconocida
          </span>
        )
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Resuelta
          </span>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Alta
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Media
          </span>
        )
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Baja
          </span>
        )
      default:
        return null
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter !== 'all' && alert.status !== selectedFilter) return false
    if (selectedPriority !== 'all' && alert.priority !== selectedPriority) return false
    return true
  })

  const handleAcknowledge = (alertId: string) => {
    toast.success('Alerta reconocida correctamente')
  }

  const handleResolve = (alertId: string) => {
    toast.success('Alerta marcada como resuelta')
  }

  const handleViewDetails = (alertId: string) => {
    toast.success('Abriendo detalles de la alerta...')
  }

  const activeAlerts = alerts.filter(a => a.status === 'active').length
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && a.status === 'active').length
  const warningAlerts = alerts.filter(a => a.type === 'warning' && a.status === 'active').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Alertas y Notificaciones 🚨</h1>
              <p className="mt-2 opacity-90">
                Sistema de alertas y notificaciones del sistema
              </p>
            </div>
            <Button className="bg-white text-red-600 hover:bg-gray-100">
              <CogIcon className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <BellIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{activeAlerts}</p>
                <p className="text-xs text-gray-500">requieren atención</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Críticas</p>
                <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
                <p className="text-xs text-gray-500">prioridad alta</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Advertencias</p>
                <p className="text-2xl font-bold text-gray-900">{warningAlerts}</p>
                <p className="text-xs text-gray-500">activas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resueltas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === 'resolved' && 
                    new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
                </p>
                <p className="text-xs text-gray-500">últimas 24h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Alerts List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Todas las Alertas</h2>
                <p className="text-sm text-gray-500">Gestión y seguimiento de alertas del sistema</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="acknowledged">Reconocidas</option>
                  <option value="resolved">Resueltas</option>
                </select>
                
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todas las prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                          {getPriorityBadge(alert.priority)}
                          {getStatusBadge(alert.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <CpuChipIcon className="w-3 h-3 mr-1" />
                            {alert.source}
                          </span>
                          {alert.school_name && (
                            <span className="flex items-center">
                              <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                              {alert.school_name}
                            </span>
                          )}
                          <span className="flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewDetails(alert.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Ver detalles"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {alert.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Reconocer"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Resolver"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay alertas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron alertas con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Alert Configuration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Configuración de Alertas</h2>
            <p className="text-sm text-gray-500">Configurar umbrales y canales de notificación</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <CpuChipIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Recursos del Sistema</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  CPU &gt; 80%, Memoria &gt; 85%, Disco &gt; 90%
                </p>
                <Button
                  size="sm"
                  onClick={() => toast.success('Configurando alertas de sistema...')}
                  className="w-full"
                >
                  Configurar
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <BuildingOfficeIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Presupuestos IA</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Advertencia 80%, Crítico 95%, Excedido 100%
                </p>
                <Button
                  size="sm"
                  onClick={() => toast.success('Configurando alertas de presupuesto...')}
                  className="w-full"
                >
                  Configurar
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <ShieldCheckIcon className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Seguridad</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Logins fallidos, IPs sospechosas, accesos no autorizados
                </p>
                <Button
                  size="sm"
                  onClick={() => toast.success('Configurando alertas de seguridad...')}
                  className="w-full"
                >
                  Configurar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
