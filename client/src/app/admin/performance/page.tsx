'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ChartBarIcon,
  ClockIcon,
  BoltIcon,
  UsersIcon,
  ServerIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CpuChipIcon,
  CloudIcon,
  CircleStackIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PerformanceMetric {
  metric_id: string
  name: string
  current_value: number
  previous_value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  threshold_warning: number
  threshold_critical: number
  trend: 'up' | 'down' | 'stable'
  last_updated: string
}

interface APIEndpoint {
  endpoint: string
  method: string
  avg_response_time: number
  requests_per_minute: number
  success_rate: number
  error_rate: number
  status: 'healthy' | 'degraded' | 'down'
  last_24h_requests: number
}

interface ServerHealth {
  server_name: string
  server_type: 'web' | 'database' | 'api' | 'cache'
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  network_io: number
  status: 'healthy' | 'warning' | 'critical'
  uptime_hours: number
  location: string
}

interface UserMetrics {
  total_active_users: number
  concurrent_users: number
  peak_concurrent_today: number
  sessions_last_24h: number
  avg_session_duration: number
  bounce_rate: number
  device_breakdown: {
    mobile: number
    desktop: number
    tablet: number
  }
  browser_breakdown: {
    chrome: number
    safari: number
    firefox: number
    edge: number
    other: number
  }
}

export default function AdminPerformancePage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('24h')
  const [metricType, setMetricType] = useState('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock performance metrics data
  const performanceMetrics: PerformanceMetric[] = [
    {
      metric_id: '1',
      name: 'Tiempo de Respuesta API',
      current_value: 245,
      previous_value: 289,
      unit: 'ms',
      status: 'good',
      threshold_warning: 500,
      threshold_critical: 1000,
      trend: 'down',
      last_updated: '2025-06-23T16:45:00Z'
    },
    {
      metric_id: '2',
      name: 'Usuarios Concurrentes',
      current_value: 1847,
      previous_value: 1692,
      unit: 'usuarios',
      status: 'good',
      threshold_warning: 2000,
      threshold_critical: 2500,
      trend: 'up',
      last_updated: '2025-06-23T16:45:00Z'
    },
    {
      metric_id: '3',
      name: 'Uso CPU Promedio',
      current_value: 68,
      previous_value: 72,
      unit: '%',
      status: 'warning',
      threshold_warning: 70,
      threshold_critical: 85,
      trend: 'down',
      last_updated: '2025-06-23T16:45:00Z'
    },
    {
      metric_id: '4',
      name: 'Uso Memoria',
      current_value: 74,
      previous_value: 71,
      unit: '%',
      status: 'warning',
      threshold_warning: 75,
      threshold_critical: 90,
      trend: 'up',
      last_updated: '2025-06-23T16:45:00Z'
    },
    {
      metric_id: '5',
      name: 'Requests por Minuto',
      current_value: 12847,
      previous_value: 11293,
      unit: 'req/min',
      status: 'good',
      threshold_warning: 15000,
      threshold_critical: 20000,
      trend: 'up',
      last_updated: '2025-06-23T16:45:00Z'
    },
    {
      metric_id: '6',
      name: 'Tasa de Error',
      current_value: 0.8,
      previous_value: 1.2,
      unit: '%',
      status: 'good',
      threshold_warning: 2,
      threshold_critical: 5,
      trend: 'down',
      last_updated: '2025-06-23T16:45:00Z'
    }
  ]

  // Mock API endpoints data
  const apiEndpoints: APIEndpoint[] = [
    {
      endpoint: '/api/auth/login',
      method: 'POST',
      avg_response_time: 156,
      requests_per_minute: 234,
      success_rate: 99.2,
      error_rate: 0.8,
      status: 'healthy',
      last_24h_requests: 45670
    },
    {
      endpoint: '/api/quiz/generate',
      method: 'POST',
      avg_response_time: 2847,
      requests_per_minute: 89,
      success_rate: 97.4,
      error_rate: 2.6,
      status: 'degraded',
      last_24h_requests: 12890
    },
    {
      endpoint: '/api/game/session',
      method: 'GET',
      avg_response_time: 98,
      requests_per_minute: 567,
      success_rate: 99.8,
      error_rate: 0.2,
      status: 'healthy',
      last_24h_requests: 78920
    },
    {
      endpoint: '/api/class/attendance',
      method: 'PATCH',
      avg_response_time: 245,
      requests_per_minute: 123,
      success_rate: 98.9,
      error_rate: 1.1,
      status: 'healthy',
      last_24h_requests: 23450
    },
    {
      endpoint: '/api/curriculum/oa',
      method: 'GET',
      avg_response_time: 67,
      requests_per_minute: 445,
      success_rate: 99.9,
      error_rate: 0.1,
      status: 'healthy',
      last_24h_requests: 89340
    }
  ]

  // Mock server health data
  const serverHealth: ServerHealth[] = [
    {
      server_name: 'web-01.edu21.cl',
      server_type: 'web',
      cpu_usage: 45,
      memory_usage: 67,
      disk_usage: 34,
      network_io: 892,
      status: 'healthy',
      uptime_hours: 720,
      location: 'AWS US-East-1'
    },
    {
      server_name: 'api-01.edu21.cl',
      server_type: 'api',
      cpu_usage: 78,
      memory_usage: 82,
      disk_usage: 45,
      network_io: 1247,
      status: 'warning',
      uptime_hours: 720,
      location: 'AWS US-East-1'
    },
    {
      server_name: 'db-primary.edu21.cl',
      server_type: 'database',
      cpu_usage: 56,
      memory_usage: 74,
      disk_usage: 67,
      network_io: 567,
      status: 'healthy',
      uptime_hours: 720,
      location: 'AWS US-East-1'
    },
    {
      server_name: 'cache-01.edu21.cl',
      server_type: 'cache',
      cpu_usage: 23,
      memory_usage: 45,
      disk_usage: 12,
      network_io: 234,
      status: 'healthy',
      uptime_hours: 720,
      location: 'AWS US-East-1'
    }
  ]

  // Mock user metrics
  const userMetrics: UserMetrics = {
    total_active_users: 24567,
    concurrent_users: 1847,
    peak_concurrent_today: 2234,
    sessions_last_24h: 8945,
    avg_session_duration: 18.5,
    bounce_rate: 12.4,
    device_breakdown: {
      mobile: 45,
      desktop: 48,
      tablet: 7
    },
    browser_breakdown: {
      chrome: 67,
      safari: 18,
      firefox: 8,
      edge: 5,
      other: 2
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
        return 'text-green-600 bg-green-100'
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100'
      case 'critical':
      case 'down':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'good':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'warning':
      case 'degraded':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'critical':
      case 'down':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      default:
        return <CheckCircleIcon className="w-4 h-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
      case 'down':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
      default:
        return <span className="w-4 h-4 text-gray-400">—</span>
    }
  }

  const getServerIcon = (type: string) => {
    switch (type) {
      case 'web':
        return <GlobeAltIcon className="w-5 h-5" />
      case 'api':
        return <CloudIcon className="w-5 h-5" />
      case 'database':
        return <CircleStackIcon className="w-5 h-5" />
      case 'cache':
        return <BoltIcon className="w-5 h-5" />
      default:
        return <ServerIcon className="w-5 h-5" />
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleExportMetrics = () => {
    toast.success('Exportando métricas de rendimiento...')
  }

  const handleRefreshMetrics = () => {
    toast.success('Actualizando métricas en tiempo real...')
  }

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing metrics...')
      }, 30000) // Refresh every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rendimiento y Métricas 📊</h1>
              <p className="mt-2 opacity-90">
                Análisis en tiempo real del rendimiento de la plataforma EDU21
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`${autoRefresh ? 'bg-white/20' : 'bg-white/10'} text-white hover:bg-white/30`}
              >
                <BoltIcon className="w-4 h-4 mr-2" />
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
              <Button
                onClick={handleExportMetrics}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={handleRefreshMetrics}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="1h">Última hora</option>
                <option value="24h">Últimas 24 horas</option>
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                value={metricType}
                onChange={(e) => setMetricType(e.target.value)}
              >
                <option value="all">Todas las métricas</option>
                <option value="performance">Rendimiento</option>
                <option value="infrastructure">Infraestructura</option>
                <option value="users">Usuarios</option>
                <option value="api">APIs</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Última actualización:</span>
              <span className="text-sm font-medium text-gray-900">16:45:23</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {performanceMetrics.map((metric) => (
            <div key={metric.metric_id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {getStatusIcon(metric.status)}
                  <span className="ml-1">{metric.status === 'good' ? 'Bien' : metric.status === 'warning' ? 'Alerta' : 'Crítico'}</span>
                </span>
                {getTrendIcon(metric.trend)}
              </div>
              
              <h3 className="text-sm font-medium text-gray-700 mb-1">{metric.name}</h3>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{formatNumber(metric.current_value)}</p>
                <span className="ml-1 text-sm text-gray-500">{metric.unit}</span>
              </div>
              
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span>Anterior: {formatNumber(metric.previous_value)}</span>
                <span className="ml-2">
                  {metric.trend === 'up' && metric.current_value > metric.previous_value && (
                    <span className="text-green-600">
                      +{((metric.current_value - metric.previous_value) / metric.previous_value * 100).toFixed(1)}%
                    </span>
                  )}
                  {metric.trend === 'down' && metric.current_value < metric.previous_value && (
                    <span className="text-red-600">
                      {((metric.current_value - metric.previous_value) / metric.previous_value * 100).toFixed(1)}%
                    </span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* User Analytics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Analíticas de Usuarios</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(userMetrics.total_active_users)}</p>
              <p className="text-sm text-gray-600">Usuarios Activos</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <BoltIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(userMetrics.concurrent_users)}</p>
              <p className="text-sm text-gray-600">Concurrentes Ahora</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(userMetrics.sessions_last_24h)}</p>
              <p className="text-sm text-gray-600">Sesiones (24h)</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(userMetrics.avg_session_duration)}</p>
              <p className="text-sm text-gray-600">Duración Promedio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución por Dispositivo</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Móvil</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${userMetrics.device_breakdown.mobile}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{userMetrics.device_breakdown.mobile}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ComputerDesktopIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Desktop</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${userMetrics.device_breakdown.desktop}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{userMetrics.device_breakdown.desktop}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">Tablet</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${userMetrics.device_breakdown.tablet}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{userMetrics.device_breakdown.tablet}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Browser Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Distribución por Navegador</h4>
              <div className="space-y-3">
                {Object.entries(userMetrics.browser_breakdown).map(([browser, percentage]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">{browser}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* API Endpoints Performance */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento de APIs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Respuesta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Req/Min
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasa Éxito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h Requests
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiEndpoints.map((endpoint, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {endpoint.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {endpoint.avg_response_time}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(endpoint.requests_per_minute)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {endpoint.success_rate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(endpoint.status)}`}>
                        {getStatusIcon(endpoint.status)}
                        <span className="ml-1">
                          {endpoint.status === 'healthy' ? 'Saludable' : endpoint.status === 'degraded' ? 'Degradado' : 'Caído'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(endpoint.last_24h_requests)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Server Health */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Estado de Servidores</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {serverHealth.map((server, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {getServerIcon(server.server_type)}
                    <span className="ml-2 font-medium text-gray-900">{server.server_name}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                    {getStatusIcon(server.status)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CPU</span>
                      <span className="font-medium">{server.cpu_usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${server.cpu_usage > 80 ? 'bg-red-500' : server.cpu_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${server.cpu_usage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Memoria</span>
                      <span className="font-medium">{server.memory_usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${server.memory_usage > 80 ? 'bg-red-500' : server.memory_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${server.memory_usage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Disco</span>
                      <span className="font-medium">{server.disk_usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${server.disk_usage > 80 ? 'bg-red-500' : server.disk_usage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${server.disk_usage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <span>{Math.floor(server.uptime_hours / 24)}d {server.uptime_hours % 24}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación</span>
                    <span>{server.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
