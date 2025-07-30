'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  CpuChipIcon,
  KeyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AIModel {
  id: string
  name: string
  provider: string
  status: 'active' | 'inactive' | 'maintenance'
  version: string
  cost_per_token: number
  max_tokens: number
  response_time_avg: number
  success_rate: number
  last_updated: string
}

interface APIConfig {
  provider: string
  endpoint: string
  status: 'connected' | 'disconnected' | 'error'
  last_check: string
  requests_today: number
  rate_limit: number
  key_expires: string
}

export default function AdminAIConfigPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('models')

  const aiModels: AIModel[] = [
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      status: 'active',
      version: '2024-06-01',
      cost_per_token: 0.00015,
      max_tokens: 128000,
      response_time_avg: 1.2,
      success_rate: 99.7,
      last_updated: '2024-06-22T10:00:00Z'
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      status: 'inactive',
      version: '2024-03-01',
      cost_per_token: 0.00025,
      max_tokens: 200000,
      response_time_avg: 0.8,
      success_rate: 99.5,
      last_updated: '2024-06-20T14:30:00Z'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      status: 'maintenance',
      version: '1.0',
      cost_per_token: 0.0005,
      max_tokens: 32000,
      response_time_avg: 1.8,
      success_rate: 98.9,
      last_updated: '2024-06-21T09:15:00Z'
    }
  ]

  const apiConfigs: APIConfig[] = [
    {
      provider: 'OpenAI',
      endpoint: 'https://api.openai.com/v1',
      status: 'connected',
      last_check: '2024-06-22T11:30:00Z',
      requests_today: 12450,
      rate_limit: 60000,
      key_expires: '2024-12-31'
    },
    {
      provider: 'Google TTS',
      endpoint: 'https://texttospeech.googleapis.com/v1',
      status: 'connected',
      last_check: '2024-06-22T11:29:00Z',
      requests_today: 3420,
      rate_limit: 100000,
      key_expires: '2024-11-15'
    },
    {
      provider: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1',
      status: 'disconnected',
      last_check: '2024-06-22T08:00:00Z',
      requests_today: 0,
      rate_limit: 50000,
      key_expires: '2025-01-20'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'connected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            {status === 'active' ? 'Activo' : 'Conectado'}
          </span>
        )
      case 'inactive':
      case 'disconnected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            {status === 'inactive' ? 'Inactivo' : 'Desconectado'}
          </span>
        )
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            Mantenimiento
          </span>
        )
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Error
          </span>
        )
      default:
        return null
    }
  }

  const handleToggleModel = (modelId: string) => {
    toast.success(`Cambiando estado del modelo ${modelId}...`)
  }

  const handleTestConnection = (provider: string) => {
    toast.loading(`Probando conexión con ${provider}...`)
    setTimeout(() => {
      toast.dismiss()
      toast.success(`Conexión con ${provider} exitosa`)
    }, 2000)
  }

  const handleRotateKey = (provider: string) => {
    if (confirm(`¿Rotar la clave API de ${provider}? Esto puede causar una breve interrupción.`)) {
      toast.success(`Rotando clave de ${provider}...`)
    }
  }

  const activeModels = aiModels.filter(m => m.status === 'active').length
  const totalRequests = apiConfigs.reduce((sum, api) => sum + api.requests_today, 0)
  const avgResponseTime = aiModels.reduce((sum, model) => sum + model.response_time_avg, 0) / aiModels.length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Configuración de IA 🤖</h1>
              <p className="mt-2 opacity-90">
                Configuración global de servicios de inteligencia artificial
              </p>
            </div>
            <Button className="bg-white text-purple-600 hover:bg-gray-100">
              <CogIcon className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </div>

        {/* AI Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Modelos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{activeModels}</p>
                <p className="text-xs text-gray-500">de {aiModels.length} disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GlobeAltIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Requests Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{totalRequests.toLocaleString()}</p>
                <p className="text-xs text-gray-500">todas las APIs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-gray-900">{avgResponseTime.toFixed(1)}s</p>
                <p className="text-xs text-gray-500">promedio</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BoltIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Éxito Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(aiModels.reduce((sum, m) => sum + m.success_rate, 0) / aiModels.length).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">todos los modelos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('models')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'models'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CpuChipIcon className="w-5 h-5 inline mr-2" />
                Modelos IA ({aiModels.length})
              </button>
              <button
                onClick={() => setActiveTab('apis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'apis'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <KeyIcon className="w-5 h-5 inline mr-2" />
                APIs y Claves ({apiConfigs.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CogIcon className="w-5 h-5 inline mr-2" />
                Configuración Global
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'models' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Modelos de IA Disponibles</h3>
                    <p className="text-sm text-gray-500">Gestión de modelos y configuración de parámetros</p>
                  </div>
                  <Button
                    onClick={() => toast.success('Agregando nuevo modelo...')}
                  >
                    <CpuChipIcon className="w-4 h-4 mr-2" />
                    Agregar Modelo
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modelo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proveedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rendimiento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Costo
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {aiModels.map((model) => (
                        <tr key={model.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CpuChipIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{model.name}</div>
                                <div className="text-sm text-gray-500">v{model.version}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{model.provider}</div>
                            <div className="text-sm text-gray-500">Max: {model.max_tokens.toLocaleString()} tokens</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(model.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{model.response_time_avg}s promedio</div>
                            <div className="text-sm text-gray-500">{model.success_rate}% éxito</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${model.cost_per_token.toFixed(5)}</div>
                            <div className="text-sm text-gray-500">por token</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => toast.success(`Configurando ${model.name}...`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Configurar"
                              >
                                <CogIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleModel(model.id)}
                                className={`${model.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                title={model.status === 'active' ? 'Desactivar' : 'Activar'}
                              >
                                {model.status === 'active' ? (
                                  <XCircleIcon className="h-4 w-4" />
                                ) : (
                                  <CheckCircleIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'apis' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Configuración de APIs</h3>
                    <p className="text-sm text-gray-500">Gestión de claves y endpoints de servicios externos</p>
                  </div>
                  <Button
                    onClick={() => toast.success('Agregando nueva API...')}
                  >
                    <KeyIcon className="w-4 h-4 mr-2" />
                    Agregar API
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {apiConfigs.map((api, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <GlobeAltIcon className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{api.provider}</h4>
                            <p className="text-sm text-gray-500">{api.endpoint}</p>
                          </div>
                        </div>
                        {getStatusBadge(api.status)}
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Requests hoy:</span>
                          <span className="text-sm font-medium text-gray-900">{api.requests_today.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Límite diario:</span>
                          <span className="text-sm font-medium text-gray-900">{api.rate_limit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Clave expira:</span>
                          <span className="text-sm font-medium text-gray-900">{new Date(api.key_expires).toLocaleDateString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Última verificación:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(api.last_check).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleTestConnection(api.provider)}
                          className="flex-1"
                        >
                          Probar Conexión
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRotateKey(api.provider)}
                          className="flex-1"
                        >
                          Rotar Clave
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Configuración Global de IA</h3>
                  <p className="text-sm text-gray-500">Parámetros generales del sistema de inteligencia artificial</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Límites y Timeouts</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Timeout por Request (segundos)</label>
                          <input
                            type="number"
                            defaultValue="30"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Máximo Tokens por Request</label>
                          <input
                            type="number"
                            defaultValue="4000"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Reintentos Automáticos</label>
                          <input
                            type="number"
                            defaultValue="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Seguridad</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Filtro de Contenido</label>
                            <p className="text-xs text-gray-500">Activar filtros de seguridad</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Log de Requests</label>
                            <p className="text-xs text-gray-500">Registrar todas las consultas</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Modo Desarrollo</label>
                            <p className="text-xs text-gray-500">Logs detallados y debugging</p>
                          </div>
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Cache y Optimización</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">TTL Cache (minutos)</label>
                          <input
                            type="number"
                            defaultValue="60"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Cache Habilitado</label>
                            <p className="text-xs text-gray-500">Cachear respuestas similares</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Compresión</label>
                            <p className="text-xs text-gray-500">Comprimir requests/responses</p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Monitoreo</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Umbral Latencia (ms)</label>
                          <input
                            type="number"
                            defaultValue="5000"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Umbral Error Rate (%)</label>
                          <input
                            type="number"
                            defaultValue="5"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => toast.success('Configuración guardada correctamente')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Guardar Configuración
                  </Button>
                  <Button
                    onClick={() => toast.success('Configuración restaurada a valores por defecto')}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Restaurar Defaults
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