'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CpuChipIcon,
  CircleStackIcon as DatabaseIcon,
  ServerIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  threshold_warning: number
  threshold_critical: number
  last_updated: string
}

interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'degraded'
  uptime: number
  response_time: number
  last_check: string
  url?: string
}

export default function AdminSystemHealthPage() {
  const { user } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const systemMetrics: SystemMetric[] = [
    {
      name: 'CPU Usage',
      value: 34.5,
      unit: '%',
      status: 'healthy',
      threshold_warning: 70,
      threshold_critical: 85,
      last_updated: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Memory Usage',
      value: 68.2,
      unit: '%',
      status: 'healthy',
      threshold_warning: 80,
      threshold_critical: 90,
      last_updated: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Disk Usage',
      value: 45.8,
      unit: '%',
      status: 'healthy',
      threshold_warning: 80,
      threshold_critical: 90,
      last_updated: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Network I/O',
      value: 125.3,
      unit: 'MB/s',
      status: 'healthy',
      threshold_warning: 500,
      threshold_critical: 800,
      last_updated: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Database Connections',
      value: 23,
      unit: 'active',
      status: 'healthy',
      threshold_warning: 80,
      threshold_critical: 95,
      last_updated: '2024-06-22T14:30:00Z'
    },
    {
      name: 'API Response Time',
      value: 145,
      unit: 'ms',
      status: 'healthy',
      threshold_warning: 500,
      threshold_critical: 1000,
      last_updated: '2024-06-22T14:30:00Z'
    }
  ]

  const services: ServiceStatus[] = [
    {
      name: 'Web Application',
      status: 'online',
      uptime: 99.98,
      response_time: 120,
      last_check: '2024-06-22T14:30:00Z',
      url: 'https://app.edu21.cl'
    },
    {
      name: 'API Gateway',
      status: 'online',
      uptime: 99.95,
      response_time: 85,
      last_check: '2024-06-22T14:30:00Z',
      url: 'https://api.edu21.cl'
    },
    {
      name: 'Database Primary',
      status: 'online',
      uptime: 99.99,
      response_time: 15,
      last_check: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Database Replica',
      status: 'online',
      uptime: 99.97,
      response_time: 18,
      last_check: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Redis Cache',
      status: 'online',
      uptime: 99.94,
      response_time: 5,
      last_check: '2024-06-22T14:30:00Z'
    },
    {
      name: 'AI Service',
      status: 'degraded',
      uptime: 98.5,
      response_time: 850,
      last_check: '2024-06-22T14:30:00Z',
      url: 'https://ai.edu21.cl'
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: 99.92,
      response_time: 200,
      last_check: '2024-06-22T14:30:00Z'
    },
    {
      name: 'Email Service',
      status: 'online',
      uptime: 99.8,
      response_time: 300,
      last_check: '2024-06-22T14:30:00Z'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'warning':
      case 'degraded':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'critical':
      case 'offline':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      online: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      degraded: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800',
      offline: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getMetricColor = (metric: SystemMetric) => {
    if (metric.status === 'critical') return 'bg-red-500'
    if (metric.status === 'warning') return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getMetricPercentage = (metric: SystemMetric) => {
    if (metric.name.includes('Response Time')) {
      return Math.min((metric.value / metric.threshold_critical) * 100, 100)
    }
    return Math.min((metric.value / 100) * 100, 100)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    toast.loading('Actualizando métricas del sistema...')
    
    setTimeout(() => {
      setRefreshing(false)
      toast.dismiss()
      toast.success('Métricas actualizadas correctamente')
    }, 2000)
  }

  const handleRunHealthCheck = () => {
    toast.loading('Ejecutando verificación completa de salud...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Verificación de salud completada - Sistema saludable')
    }, 3000)
  }

  const handleRestartService = (serviceName: string) => {
    if (confirm(`¿Estás seguro de que quieres reiniciar el servicio "${serviceName}"?`)) {
      toast.loading(`Reiniciando ${serviceName}...`)
      setTimeout(() => {
        toast.dismiss()
        toast.success(`${serviceName} reiniciado correctamente`)
      }, 5000)
    }
  }

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Simulate metrics update
      console.log('Auto-refreshing metrics...')
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Calculate overall system health
  const healthyMetrics = systemMetrics.filter(m => m.status === 'healthy').length
  const onlineServices = services.filter(s => s.status === 'online').length
  const overallHealth = Math.round(((healthyMetrics + onlineServices) / (systemMetrics.length + services.length)) * 100)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Salud del Sistema 🏥</h1>
              <p className="mt-2 opacity-90">
                Monitoreo en tiempo real del estado y rendimiento del sistema
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm">Auto-refresh</label>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button
                onClick={handleRunHealthCheck}
                className="bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                <ShieldCheckIcon className="w-4 h-4 mr-2" />
                Health Check
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Health Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Estado General del Sistema</h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(overallHealth >= 95 ? 'healthy' : overallHealth >= 80 ? 'warning' : 'critical')}
              <span className="text-2xl font-bold text-gray-900">{overallHealth}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{healthyMetrics}/{systemMetrics.length}</div>
              <div className="text-sm text-gray-500">Métricas Saludables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{onlineServices}/{services.length}</div>
              <div className="text-sm text-gray-500">Servicios Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">99.8%</div>
              <div className="text-sm text-gray-500">Uptime (30 días)</div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Métricas del Sistema</h2>
            <p className="text-sm text-gray-500">Uso de recursos y rendimiento en tiempo real</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemMetrics.map((metric) => (
                <div key={metric.name} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <CpuChipIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900">{metric.name}</h3>
                    </div>
                    {getStatusIcon(metric.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {metric.value}{metric.unit}
                      </span>
                      {getStatusBadge(metric.status)}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getMetricColor(metric)}`}
                        style={{ width: `${getMetricPercentage(metric)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Warning: {metric.threshold_warning}{metric.unit}</span>
                      <span>Critical: {metric.threshold_critical}{metric.unit}</span>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      Actualizado: {new Date(metric.last_updated).toLocaleTimeString('es-CL')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Estado de Servicios</h2>
            <p className="text-sm text-gray-500">Monitoreo de servicios críticos y dependencias</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Respuesta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Verificación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ServerIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          {service.url && (
                            <div className="text-sm text-gray-500">{service.url}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(service.status)}
                        <span className="ml-2">{getStatusBadge(service.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{service.uptime}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            service.uptime >= 99 ? 'bg-green-500' :
                            service.uptime >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${service.uptime}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        service.response_time <= 200 ? 'text-green-600' :
                        service.response_time <= 500 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {service.response_time}ms
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(service.last_check).toLocaleTimeString('es-CL')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRestartService(service.name)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        disabled={service.status === 'offline'}
                      >
                        <ArrowPathIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toast.success(`Abriendo logs de ${service.name}...`)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ChartBarIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => toast.success('Abriendo logs del sistema...')}
              className="flex items-center justify-center"
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Ver Logs
            </Button>
            <Button
              onClick={() => toast.success('Configurando alertas...')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <BoltIcon className="w-4 h-4 mr-2" />
              Configurar Alertas
            </Button>
            <Button
              onClick={() => toast.success('Generando reporte...')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <DatabaseIcon className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
            <Button
              onClick={() => toast.success('Abriendo configuración...')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <CogIcon className="w-4 h-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
