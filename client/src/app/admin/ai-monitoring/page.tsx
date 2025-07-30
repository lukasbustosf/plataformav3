'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CpuChipIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  StopIcon,
  PlayIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AIUsageData {
  school_id: string
  school_name: string
  tokens_used: number
  tokens_limit: number
  monthly_cost_clp: number
  avg_response_time: number
  success_rate: number
  last_activity: string
  status: 'active' | 'warning' | 'critical' | 'disabled'
  monthly_queries: number
  ai_features_enabled: boolean
}

export default function AdminAiMonitoringPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [globalLockdownMode, setGlobalLockdownMode] = useState(false)

  // P2-SA-01: Enhanced AI Budget Management
  const [budgetModalOpen, setBudgetModalOpen] = useState(false)
  const [selectedSchoolForBudget, setSelectedSchoolForBudget] = useState<string | null>(null)
  const [bulkBudgetSettings, setBulkBudgetSettings] = useState({
    tokens_per_month: 50000,
    cost_limit_clp: 30000,
    alert_threshold: 90, // P2-SA-01: 90% threshold
    auto_disable: true
  })

  // P2-SEC-01: Global Lockdown Mode
  const [lockdownSettings, setLockdownSettings] = useState({
    global_lockdown: false,
    shuffle_questions: true,
    shuffle_options: true,
    disable_ai_generation: false,
    emergency_mode: false,
    lockdown_reason: '',
    scheduled_end: ''
  })

  // Mock AI usage data
  const aiUsageData: AIUsageData[] = [
    {
      school_id: 'school-001',
      school_name: 'Colegio San Antonio de Padua',
      tokens_used: 47500,
      tokens_limit: 50000,
      monthly_cost_clp: 28500,
      avg_response_time: 850,
      success_rate: 98.5,
      last_activity: '2 minutos',
      status: 'critical',
      monthly_queries: 1250,
      ai_features_enabled: true
    },
    {
      school_id: 'school-002',
      school_name: 'Escuela Básica Los Andes',
      tokens_used: 31200,
      tokens_limit: 40000,
      monthly_cost_clp: 18720,
      avg_response_time: 720,
      success_rate: 99.2,
      last_activity: '5 minutos',
      status: 'warning',
      monthly_queries: 890,
      ai_features_enabled: true
    },
    {
      school_id: 'school-003',
      school_name: 'Instituto Técnico Metropolitano',
      tokens_used: 52800,
      tokens_limit: 80000,
      monthly_cost_clp: 31680,
      avg_response_time: 950,
      success_rate: 97.8,
      last_activity: '1 minuto',
      status: 'active',
      monthly_queries: 1680,
      ai_features_enabled: true
    },
    {
      school_id: 'school-004',
      school_name: 'Colegio Villa Esperanza',
      tokens_used: 0,
      tokens_limit: 30000,
      monthly_cost_clp: 0,
      avg_response_time: 0,
      success_rate: 0,
      last_activity: 'Nunca',
      status: 'disabled',
      monthly_queries: 0,
      ai_features_enabled: false
    }
  ]

  const globalMetrics = {
    total_tokens_used: aiUsageData.reduce((sum, school) => sum + school.tokens_used, 0),
    total_tokens_limit: aiUsageData.reduce((sum, school) => sum + school.tokens_limit, 0),
    total_monthly_cost: aiUsageData.reduce((sum, school) => sum + school.monthly_cost_clp, 0),
    avg_response_time: Math.round(aiUsageData.filter(s => s.avg_response_time > 0).reduce((sum, school) => sum + school.avg_response_time, 0) / aiUsageData.filter(s => s.avg_response_time > 0).length),
    total_queries: aiUsageData.reduce((sum, school) => sum + school.monthly_queries, 0),
    schools_with_ai: aiUsageData.filter(s => s.ai_features_enabled).length
  }

  const recentActivity = [
    {
      id: 1,
      type: 'budget_alert',
      message: 'Colegio San Antonio alcanzó 95% del presupuesto IA',
      timestamp: '5 min',
      severity: 'critical'
    },
    {
      id: 2,
      type: 'performance',
      message: 'Tiempo de respuesta promedio mejoró 12%',
      timestamp: '1 hora',
      severity: 'success'
    },
    {
      id: 3,
      type: 'quota_increase',
      message: 'Instituto Metropolitano solicitó aumento de cuota',
      timestamp: '2 horas',
      severity: 'info'
    },
    {
      id: 4,
      type: 'api_error',
      message: 'Error temporal en API de OpenAI resuelto',
      timestamp: '3 horas',
      severity: 'warning'
    }
  ]

  const handleSetBudget = (schoolId: string, schoolName: string) => {
    setSelectedSchool(schoolId)
    setShowBudgetModal(true)
  }

  const handleToggleAIFeatures = (schoolId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    if (confirm(`¿Deseas ${action} las funciones de IA para esta escuela?`)) {
      toast.success(`Funciones de IA ${action}das correctamente`)
    }
  }

  const handleGlobalLockdown = async () => {
    try {
      const response = await fetch('/api/admin/security/lockdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: globalLockdownMode ? 'deactivate' : 'activate',
          settings: lockdownSettings,
          reason: lockdownSettings.lockdown_reason || 'Activación manual por administrador'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setGlobalLockdownMode(!globalLockdownMode)
        setLockdownSettings(prev => ({ ...prev, global_lockdown: !globalLockdownMode }))
        toast.success(`Modo lockdown ${!globalLockdownMode ? 'activado' : 'desactivado'} - P2-SEC-01`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error al cambiar modo lockdown')
      console.error('Lockdown error:', error)
    }
  }

  const handleResetQuota = (schoolId: string, schoolName: string) => {
    if (confirm(`¿Resetear la cuota de tokens de IA para ${schoolName}?`)) {
      toast.success('Cuota reseteada correctamente')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      case 'disabled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-3 h-3" />
      case 'warning': return <ExclamationTriangleIcon className="w-3 h-3" />
      case 'critical': return <XCircleIcon className="w-3 h-3" />
      case 'disabled': return <StopIcon className="w-3 h-3" />
      default: return <CheckCircleIcon className="w-3 h-3" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Operativo'
      case 'warning': return 'Advertencia'
      case 'critical': return 'Crítico'
      case 'disabled': return 'Deshabilitado'
      default: return 'Desconocido'
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    if (percentage >= 60) return 'bg-blue-500'
    return 'bg-green-500'
  }

  // P2-SA-01: Update school budget limits
  const handleUpdateSchoolBudget = async (schoolId: string, budgetSettings: any) => {
    try {
      const response = await fetch(`/api/admin/ai/budget/${schoolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          monthly_tokens_limit: budgetSettings.tokens_per_month,
          monthly_cost_limit_clp: budgetSettings.cost_limit_clp,
          alert_threshold_percent: budgetSettings.alert_threshold,
          auto_disable_on_limit: budgetSettings.auto_disable
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Límites de tokens actualizados - P2-SA-01')
        setBudgetModalOpen(false)
        // Refresh data
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error al actualizar límites')
      console.error('Budget update error:', error)
    }
  }

  // P2-SA-01: Bulk budget assignment
  const handleBulkBudgetUpdate = async () => {
    try {
      const response = await fetch('/api/admin/ai/budget/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          schools: aiUsageData.map(school => school.school_id),
          budget_settings: bulkBudgetSettings
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(`Límites aplicados a ${data.updated_count} escuelas - P2-SA-01`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error en actualización masiva')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Monitoreo de IA 🤖</h1>
              <p className="mt-2 opacity-90">
                Supervisa el uso de tokens, presupuestos y rendimiento de IA en todas las escuelas
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleGlobalLockdown}
                className={`${globalLockdownMode ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'} text-white border-white/30`}
              >
                {globalLockdownMode ? <StopIcon className="w-4 h-4 mr-2" /> : <BoltIcon className="w-4 h-4 mr-2" />}
                {globalLockdownMode ? 'Desactivar Lockdown' : 'Modo Lockdown Global'}
              </Button>
              <Button
                onClick={() => setShowBudgetModal(true)}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                Configurar Presupuestos
              </Button>
            </div>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tokens Usados</p>
                <p className="text-lg font-bold text-gray-900">{globalMetrics.total_tokens_used.toLocaleString()}</p>
                <p className="text-xs text-gray-500">de {globalMetrics.total_tokens_limit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Costo Mensual</p>
                <p className="text-lg font-bold text-gray-900">${globalMetrics.total_monthly_cost.toLocaleString()}</p>
                <p className="text-xs text-gray-500">CLP</p>
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
                <p className="text-lg font-bold text-gray-900">{globalMetrics.avg_response_time}ms</p>
                <p className="text-xs text-green-600">↓ 12% vs anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas</p>
                <p className="text-lg font-bold text-gray-900">{globalMetrics.total_queries.toLocaleString()}</p>
                <p className="text-xs text-gray-500">este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Escuelas con IA</p>
                <p className="text-lg font-bold text-gray-900">{globalMetrics.schools_with_ai}</p>
                <p className="text-xs text-gray-500">de {aiUsageData.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas</p>
                <p className="text-lg font-bold text-gray-900">
                  {aiUsageData.filter(s => s.status === 'critical' || s.status === 'warning').length}
                </p>
                <p className="text-xs text-red-600">Requieren atención</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage by School */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Uso de IA por Escuela</h2>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="quarter">Este trimestre</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Escuela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso de Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Mensual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aiUsageData.map((school) => {
                  const usagePercentage = getUsagePercentage(school.tokens_used, school.tokens_limit)
                  return (
                    <tr key={school.school_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{school.school_name}</div>
                          <div className="text-sm text-gray-500">
                            {school.monthly_queries} consultas • {school.last_activity}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {school.tokens_used.toLocaleString()} / {school.tokens_limit.toLocaleString()}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${getUsageColor(usagePercentage)}`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{usagePercentage}% utilizado</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${school.monthly_cost_clp.toLocaleString()} CLP
                        </div>
                        <div className="text-xs text-gray-500">
                          ~${Math.round(school.monthly_cost_clp * 0.001)} USD
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {school.avg_response_time > 0 ? `${school.avg_response_time}ms` : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {school.success_rate > 0 ? `${school.success_rate}% éxito` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                          {getStatusIcon(school.status)}
                          <span className="ml-1">{getStatusLabel(school.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleSetBudget(school.school_id, school.school_name)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Configurar presupuesto"
                          >
                            <CurrencyDollarIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleResetQuota(school.school_id, school.school_name)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Resetear cuota"
                          >
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleAIFeatures(school.school_id, school.ai_features_enabled)}
                            className={school.ai_features_enabled ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            title={school.ai_features_enabled ? "Desactivar IA" : "Activar IA"}
                          >
                            {school.ai_features_enabled ? <StopIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6 space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.severity === 'critical' ? 'bg-red-500' :
                    activity.severity === 'warning' ? 'bg-yellow-500' :
                    activity.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">{activity.message}</div>
                    <div className="text-xs text-gray-500">hace {activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Configuración Global</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Modo Lockdown Global</div>
                  <div className="text-xs text-gray-500">Desactiva temporalmente todas las funciones IA</div>
                </div>
                <button
                  onClick={handleGlobalLockdown}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    globalLockdownMode ? 'bg-red-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    globalLockdownMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Límites Globales</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Tokens por minuto:</span>
                    <span>10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeout de respuesta:</span>
                    <span>30 segundos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reintentos automáticos:</span>
                    <span>3</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button
                  onClick={() => toast.success('Configuración avanzada próximamente')}
                  variant="outline"
                  className="w-full"
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                  Configuración Avanzada
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced P2-SA-01 Budget Management Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Gestión de Presupuestos IA - P2-SA-01</h2>
              <Button
                variant="outline"
                onClick={() => setBudgetModalOpen(true)}
                className="bg-blue-50 text-blue-600 border-blue-200"
              >
                <CogIcon className="h-4 w-4 mr-2" />
                Configurar Límites
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-full">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-800">Escuelas Dentro del Límite</p>
                    <p className="text-2xl font-bold text-green-900">
                      {aiUsageData.filter(school => school.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-500 rounded-full">
                    <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-800">Alerta 90% - P2-SA-01</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {aiUsageData.filter(school => school.status === 'warning').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <div className="p-2 bg-red-500 rounded-full">
                    <XCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-red-800">Límite Excedido</p>
                    <p className="text-2xl font-bold text-red-900">
                      {aiUsageData.filter(school => school.status === 'critical').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* School Budget Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Escuela
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uso de Tokens
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Costo Mensual
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
                  {aiUsageData.map((school) => (
                    <tr key={school.school_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{school.school_name}</div>
                        <div className="text-sm text-gray-500">ID: {school.school_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  school.status === 'critical' ? 'bg-red-500' :
                                  school.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${(school.tokens_used / school.tokens_limit) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-sm text-gray-900">
                            {school.tokens_used.toLocaleString()} / {school.tokens_limit.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {((school.tokens_used / school.tokens_limit) * 100).toFixed(1)}% utilizado
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${school.monthly_cost_clp.toLocaleString()} CLP
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          school.status === 'active' ? 'bg-green-100 text-green-800' :
                          school.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          school.status === 'critical' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {school.status === 'active' ? 'Normal' :
                           school.status === 'warning' ? 'Alerta 90%' :
                           school.status === 'critical' ? 'Límite Excedido' :
                           'Deshabilitado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSchoolForBudget(school.school_id)
                            setBudgetModalOpen(true)
                          }}
                        >
                          Ajustar Límites
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Enhanced P2-SEC-01 Global Security Controls */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Controles de Seguridad Global - P2-SEC-01</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Global Lockdown Control */}
            <div className="flex items-center justify-between p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
              <div>
                <div className="text-lg font-medium text-red-900">Modo Lockdown Global</div>
                <div className="text-sm text-red-700">
                  Desactiva temporalmente funciones IA y activa medidas de seguridad estrictas
                </div>
                {lockdownSettings.global_lockdown && (
                  <div className="mt-2 text-sm text-red-600">
                    🔒 ACTIVO - Todas las evaluaciones en modo seguro
                  </div>
                )}
              </div>
              <button
                onClick={handleGlobalLockdown}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  globalLockdownMode ? 'bg-red-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  globalLockdownMode ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Lockdown Settings */}
            {globalLockdownMode && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-gray-900">Configuración de Lockdown Activa</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lockdownSettings.shuffle_questions}
                      onChange={(e) => setLockdownSettings(prev => ({ ...prev, shuffle_questions: e.target.checked }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Mezclar orden de preguntas
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lockdownSettings.shuffle_options}
                      onChange={(e) => setLockdownSettings(prev => ({ ...prev, shuffle_options: e.target.checked }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Mezclar opciones de respuesta
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lockdownSettings.disable_ai_generation}
                      onChange={(e) => setLockdownSettings(prev => ({ ...prev, disable_ai_generation: e.target.checked }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Deshabilitar generación IA
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={lockdownSettings.emergency_mode}
                      onChange={(e) => setLockdownSettings(prev => ({ ...prev, emergency_mode: e.target.checked }))}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Modo de emergencia
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón del lockdown
                  </label>
                  <input
                    type="text"
                    value={lockdownSettings.lockdown_reason}
                    onChange={(e) => setLockdownSettings(prev => ({ ...prev, lockdown_reason: e.target.value }))}
                    placeholder="Ej: Sospecha de fraude académico"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Finalización programada (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={lockdownSettings.scheduled_end}
                    onChange={(e) => setLockdownSettings(prev => ({ ...prev, scheduled_end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            )}

            {/* Security Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">245</div>
                <div className="text-sm text-blue-700">Evaluaciones activas</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-900">12</div>
                <div className="text-sm text-yellow-700">Alertas de seguridad</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-900">99.8%</div>
                <div className="text-sm text-green-700">Tasa de integridad</div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Configuration Modal */}
        {showBudgetModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configurar Presupuesto IA</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Escuela</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="all">Todas las escuelas</option>
                      {aiUsageData.map(school => (
                        <option key={school.school_id} value={school.school_id}>
                          {school.school_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Límite de Tokens Mensuales</label>
                    <input 
                      type="number" 
                      defaultValue="50000"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Presupuesto Mensual (CLP)</label>
                    <input 
                      type="number" 
                      defaultValue="30000"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alertas (%)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number" 
                        placeholder="80" 
                        className="border border-gray-300 rounded-md px-3 py-2"
                      />
                      <input 
                        type="number" 
                        placeholder="95" 
                        className="border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Advertencia y crítico</div>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => {
                      toast.success('Presupuesto configurado correctamente')
                      setShowBudgetModal(false)
                    }}
                    className="flex-1"
                  >
                    Guardar
                  </Button>
                  <Button
                    onClick={() => setShowBudgetModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 