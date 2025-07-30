'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  KeyIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface APIKey {
  id: string
  name: string
  key: string
  status: 'active' | 'inactive' | 'expired'
  created_at: string
  last_used: string
  permissions: string[]
  usage_count: number
  rate_limit: number
  expires_at?: string
}

interface APIEndpoint {
  id: string
  path: string
  method: string
  description: string
  status: 'active' | 'deprecated' | 'maintenance'
  usage_24h: number
  avg_response_time: number
  success_rate: number
}

export default function AdminAPIManagementPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'keys' | 'endpoints' | 'webhooks' | 'logs'>('keys')
  const [showApiKey, setShowApiKey] = useState<{[key: string]: boolean}>({})

  const apiKeys: APIKey[] = [
    {
      id: 'key-001',
      name: 'Production Integration',
      key: 'edu21_prod_1a2b3c4d5e6f7g8h9i0j',
      status: 'active',
      created_at: '2024-06-01T10:00:00Z',
      last_used: '2024-06-22T14:30:00Z',
      permissions: ['read:schools', 'write:users', 'read:analytics'],
      usage_count: 15420,
      rate_limit: 1000
    },
    {
      id: 'key-002',
      name: 'Mobile App Backend',
      key: 'edu21_mobile_9z8y7x6w5v4u3t2s1r0q',
      status: 'active',
      created_at: '2024-05-15T14:20:00Z',
      last_used: '2024-06-22T14:25:00Z',
      permissions: ['read:users', 'write:assignments', 'read:grades'],
      usage_count: 8750,
      rate_limit: 500
    },
    {
      id: 'key-003',
      name: 'Analytics Dashboard',
      key: 'edu21_analytics_p9o8i7u6y5t4r3e2w1q0',
      status: 'active',
      created_at: '2024-06-10T09:15:00Z',
      last_used: '2024-06-22T13:45:00Z',
      permissions: ['read:analytics', 'read:reports'],
      usage_count: 2340,
      rate_limit: 200
    },
    {
      id: 'key-004',
      name: 'Legacy System',
      key: 'edu21_legacy_m5n4b3v2c1x0z9a8s7d6',
      status: 'inactive',
      created_at: '2024-03-20T16:30:00Z',
      last_used: '2024-05-30T10:20:00Z',
      permissions: ['read:users'],
      usage_count: 450,
      rate_limit: 100
    }
  ]

  const apiEndpoints: APIEndpoint[] = [
    {
      id: 'endpoint-001',
      path: '/api/v1/schools',
      method: 'GET',
      description: 'Obtener lista de escuelas',
      status: 'active',
      usage_24h: 1250,
      avg_response_time: 120,
      success_rate: 99.8
    },
    {
      id: 'endpoint-002',
      path: '/api/v1/users',
      method: 'POST',
      description: 'Crear nuevo usuario',
      status: 'active',
      usage_24h: 340,
      avg_response_time: 250,
      success_rate: 98.5
    },
    {
      id: 'endpoint-003',
      path: '/api/v1/analytics/usage',
      method: 'GET',
      description: 'Obtener métricas de uso',
      status: 'active',
      usage_24h: 890,
      avg_response_time: 180,
      success_rate: 99.2
    },
    {
      id: 'endpoint-004',
      path: '/api/v1/ai/query',
      method: 'POST',
      description: 'Realizar consulta a IA',
      status: 'active',
      usage_24h: 2450,
      avg_response_time: 850,
      success_rate: 97.3
    },
    {
      id: 'endpoint-005',
      path: '/api/v1/reports/legacy',
      method: 'GET',
      description: 'Reportes sistema anterior',
      status: 'deprecated',
      usage_24h: 12,
      avg_response_time: 2500,
      success_rate: 85.0
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: ClockIcon },
      expired: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon },
      deprecated: { color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon },
      maintenance: { color: 'bg-blue-100 text-blue-800', icon: CogIcon }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getMethodBadge = (method: string) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[method as keyof typeof colors]}`}>
        {method}
      </span>
    )
  }

  const handleCreateAPIKey = () => {
    toast.success('Abriendo formulario para crear nueva API key...')
  }

  const handleToggleAPIKey = (keyId: string) => {
    setShowApiKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const handleCopyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copiada al portapapeles')
  }

  const handleRotateAPIKey = (keyId: string, keyName: string) => {
    if (confirm(`¿Estás seguro de que quieres rotar la API key "${keyName}"? La clave actual se invalidará.`)) {
      toast.success('API key rotada correctamente')
    }
  }

  const handleDeleteAPIKey = (keyId: string, keyName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la API key "${keyName}"? Esta acción no se puede deshacer.`)) {
      toast.success('API key eliminada correctamente')
    }
  }

  const handleToggleEndpoint = (endpointId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'maintenance' : 'active'
    toast.success(`Endpoint cambiado a estado: ${newStatus}`)
  }

  // Calculate summary statistics
  const totalKeys = apiKeys.length
  const activeKeys = apiKeys.filter(key => key.status === 'active').length
  const totalUsage = apiKeys.reduce((sum, key) => sum + key.usage_count, 0)
  const totalEndpoints = apiEndpoints.length
  const activeEndpoints = apiEndpoints.filter(endpoint => endpoint.status === 'active').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de APIs 🔑</h1>
              <p className="mt-2 opacity-90">
                Administración de claves API, endpoints y configuración
              </p>
            </div>
            <Button
              onClick={handleCreateAPIKey}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Nueva API Key
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <KeyIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">API Keys Activas</p>
                <p className="text-2xl font-bold text-gray-900">{activeKeys}/{totalKeys}</p>
                <p className="text-xs text-gray-500">en uso</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Endpoints</p>
                <p className="text-2xl font-bold text-gray-900">{activeEndpoints}/{totalEndpoints}</p>
                <p className="text-xs text-gray-500">disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Requests Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsage.toLocaleString()}</p>
                <p className="text-xs text-gray-500">este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BoltIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rate Limit</p>
                <p className="text-2xl font-bold text-gray-900">98.5%</p>
                <p className="text-xs text-gray-500">disponible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('keys')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'keys'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <KeyIcon className="w-5 h-5 inline mr-2" />
                API Keys ({apiKeys.length})
              </button>
              <button
                onClick={() => setActiveTab('endpoints')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'endpoints'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <GlobeAltIcon className="w-5 h-5 inline mr-2" />
                Endpoints ({apiEndpoints.length})
              </button>
              <button
                onClick={() => setActiveTab('webhooks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'webhooks'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BoltIcon className="w-5 h-5 inline mr-2" />
                Webhooks (3)
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'logs'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChartBarIcon className="w-5 h-5 inline mr-2" />
                Logs de Uso
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'keys' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          API Key
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate Limit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Uso
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {apiKeys.map((apiKey) => (
                        <tr key={apiKey.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <KeyIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                                <div className="text-sm text-gray-500">{apiKey.permissions.length} permisos</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {showApiKey[apiKey.id] ? apiKey.key : '••••••••••••••••••••'}
                              </code>
                              <button
                                onClick={() => handleToggleAPIKey(apiKey.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showApiKey[apiKey.id] ? (
                                  <EyeSlashIcon className="h-4 w-4" />
                                ) : (
                                  <EyeIcon className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleCopyAPIKey(apiKey.key)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ClipboardDocumentIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(apiKey.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{apiKey.usage_count.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">requests</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{apiKey.rate_limit}/min</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(apiKey.last_used).toLocaleDateString('es-CL')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(apiKey.last_used).toLocaleTimeString('es-CL')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleRotateAPIKey(apiKey.id, apiKey.name)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Rotar API Key"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAPIKey(apiKey.id, apiKey.name)}
                              className="text-red-600 hover:text-red-900"
                              title="Eliminar API Key"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'endpoints' && (
              <div className="space-y-6">
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
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uso 24h
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiempo Respuesta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Éxito
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {apiEndpoints.map((endpoint) => (
                        <tr key={endpoint.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{endpoint.path}</div>
                              <div className="text-sm text-gray-500">{endpoint.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getMethodBadge(endpoint.method)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(endpoint.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{endpoint.usage_24h.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">requests</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{endpoint.avg_response_time}ms</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-900">{endpoint.success_rate}%</div>
                              <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    endpoint.success_rate >= 99 ? 'bg-green-500' :
                                    endpoint.success_rate >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${endpoint.success_rate}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleToggleEndpoint(endpoint.id, endpoint.status)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {endpoint.status === 'active' ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div className="text-center py-12">
                <BoltIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Configuración de Webhooks</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configurar endpoints para recibir notificaciones automáticas.
                </p>
                <div className="mt-6">
                  <Button onClick={() => toast.success('Configurando webhooks...')}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Crear Webhook
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="text-center py-12">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Logs de Uso de API</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Monitoreo detallado del uso de endpoints y performance.
                </p>
                <div className="mt-6">
                  <Button onClick={() => toast.success('Abriendo logs detallados...')}>
                    <EyeIcon className="w-4 h-4 mr-2" />
                    Ver Logs Detallados
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
