'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  BanknotesIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  CalendarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  BellIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AIBudgetData {
  budget_id: string
  school_id: string
  school_name: string
  sostenedor_name: string
  period: string
  budget_clp: number
  used_clp: number
  remaining_clp: number
  usage_percentage: number
  status: 'active' | 'warning' | 'exceeded' | 'paused'
  created_at: string
  last_updated: string
  services_breakdown: {
    quiz_generation: number
    tts_audio: number
    analytics: number
    translations: number
    other: number
  }
  monthly_trend: {
    month: string
    usage: number
    budget: number
  }[]
  alerts: {
    type: 'warning' | 'critical' | 'info'
    message: string
    date: string
  }[]
  auto_alerts: boolean
  alert_threshold: number
}

interface AIServiceCosts {
  service_name: string
  unit_cost_clp: number
  monthly_usage: number
  total_cost_clp: number
  description: string
}

export default function AdminAIBudgetsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('2025-06')
  const [sortBy, setSortBy] = useState('usage_percentage')
  const [selectedBudget, setSelectedBudget] = useState<AIBudgetData | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Mock AI budget data for demonstration
  const mockBudgets: AIBudgetData[] = [
    {
      budget_id: 'budget-001',
      school_id: 'school-001',
      school_name: 'Colegio San Francisco',
      sostenedor_name: 'Fundación Educacional San Francisco',
      period: '2025-06',
      budget_clp: 150000,
      used_clp: 134500,
      remaining_clp: 15500,
      usage_percentage: 89.7,
      status: 'warning',
      created_at: '2025-06-01T00:00:00Z',
      last_updated: '2025-06-23T15:30:00Z',
      services_breakdown: {
        quiz_generation: 89000,
        tts_audio: 23000,
        analytics: 15000,
        translations: 4500,
        other: 3000
      },
      monthly_trend: [
        { month: '2025-03', usage: 45000, budget: 120000 },
        { month: '2025-04', usage: 67000, budget: 130000 },
        { month: '2025-05', usage: 78000, budget: 140000 },
        { month: '2025-06', usage: 134500, budget: 150000 }
      ],
      alerts: [
        { type: 'warning', message: 'Uso excede 80% del presupuesto mensual', date: '2025-06-20' },
        { type: 'info', message: 'Generación de quizzes IA aumentó 15% esta semana', date: '2025-06-18' }
      ],
      auto_alerts: true,
      alert_threshold: 80
    },
    {
      budget_id: 'budget-002',
      school_id: 'school-002',
      school_name: 'Instituto Comercial Los Andes',
      sostenedor_name: 'Corporación Educacional Los Andes',
      period: '2025-06',
      budget_clp: 500000,
      used_clp: 298000,
      remaining_clp: 202000,
      usage_percentage: 59.6,
      status: 'active',
      created_at: '2025-06-01T00:00:00Z',
      last_updated: '2025-06-23T14:45:00Z',
      services_breakdown: {
        quiz_generation: 178000,
        tts_audio: 67000,
        analytics: 34000,
        translations: 12000,
        other: 7000
      },
      monthly_trend: [
        { month: '2025-03', usage: 198000, budget: 450000 },
        { month: '2025-04', usage: 234000, budget: 480000 },
        { month: '2025-05', usage: 267000, budget: 490000 },
        { month: '2025-06', usage: 298000, budget: 500000 }
      ],
      alerts: [
        { type: 'info', message: 'Presupuesto aumentado para cubrir crecimiento esperado', date: '2025-06-15' }
      ],
      auto_alerts: true,
      alert_threshold: 85
    },
    {
      budget_id: 'budget-003',
      school_id: 'school-003',
      school_name: 'Escuela Rural Valle Verde',
      sostenedor_name: 'Municipalidad de Valle Verde',
      period: '2025-06',
      budget_clp: 25000,
      used_clp: 28500,
      remaining_clp: -3500,
      usage_percentage: 114.0,
      status: 'exceeded',
      created_at: '2025-06-01T00:00:00Z',
      last_updated: '2025-06-23T16:20:00Z',
      services_breakdown: {
        quiz_generation: 18000,
        tts_audio: 6500,
        analytics: 2000,
        translations: 1500,
        other: 500
      },
      monthly_trend: [
        { month: '2025-03', usage: 8000, budget: 20000 },
        { month: '2025-04', usage: 12000, budget: 22000 },
        { month: '2025-05', usage: 19000, budget: 24000 },
        { month: '2025-06', usage: 28500, budget: 25000 }
      ],
      alerts: [
        { type: 'critical', message: 'Presupuesto excedido en $3.500 - Servicios pausados automáticamente', date: '2025-06-22' },
        { type: 'warning', message: 'Uso aumentó 300% comparado al mes anterior', date: '2025-06-20' }
      ],
      auto_alerts: true,
      alert_threshold: 90
    },
    {
      budget_id: 'budget-004',
      school_id: 'school-004',
      school_name: 'Liceo Técnico Industrial',
      sostenedor_name: 'Fundación Técnica Nacional',
      period: '2025-06',
      budget_clp: 320000,
      used_clp: 156000,
      remaining_clp: 164000,
      usage_percentage: 48.8,
      status: 'active',
      created_at: '2025-06-01T00:00:00Z',
      last_updated: '2025-06-23T13:15:00Z',
      services_breakdown: {
        quiz_generation: 89000,
        tts_audio: 34000,
        analytics: 21000,
        translations: 8000,
        other: 4000
      },
      monthly_trend: [
        { month: '2025-03', usage: 134000, budget: 300000 },
        { month: '2025-04', usage: 145000, budget: 310000 },
        { month: '2025-05', usage: 142000, budget: 315000 },
        { month: '2025-06', usage: 156000, budget: 320000 }
      ],
      alerts: [],
      auto_alerts: true,
      alert_threshold: 75
    }
  ]

  // Mock AI service costs data
  const aiServiceCosts: AIServiceCosts[] = [
    {
      service_name: 'Generación Quiz IA (GPT-4o mini)',
      unit_cost_clp: 45,
      monthly_usage: 7850,
      total_cost_clp: 353250,
      description: 'Por quiz generado con IA'
    },
    {
      service_name: 'Text-to-Speech (Google Cloud)',
      unit_cost_clp: 8,
      monthly_usage: 16240,
      total_cost_clp: 129920,
      description: 'Por minuto de audio generado'
    },
    {
      service_name: 'Analytics Avanzados (IA)',
      unit_cost_clp: 12,
      monthly_usage: 5920,
      total_cost_clp: 71040,
      description: 'Por reporte de análisis'
    },
    {
      service_name: 'Traducciones Automáticas',
      unit_cost_clp: 2,
      monthly_usage: 12800,
      total_cost_clp: 25600,
      description: 'Por 1000 caracteres traducidos'
    },
    {
      service_name: 'Reconocimiento de Voz',
      unit_cost_clp: 15,
      monthly_usage: 1450,
      total_cost_clp: 21750,
      description: 'Por minuto de audio procesado'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'exceeded': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="w-4 h-4" />
      case 'warning': return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'exceeded': return <XCircleIcon className="w-4 h-4" />
      case 'paused': return <ClockIcon className="w-4 h-4" />
      default: return <CheckCircleIcon className="w-4 h-4" />
    }
  }

  const getBudgetStats = () => {
    const totalBudget = mockBudgets.reduce((sum, b) => sum + b.budget_clp, 0)
    const totalUsed = mockBudgets.reduce((sum, b) => sum + b.used_clp, 0)
    const avgUsage = totalUsed / totalBudget * 100
    const schoolsOverBudget = mockBudgets.filter(b => b.status === 'exceeded').length
    const schoolsWarning = mockBudgets.filter(b => b.status === 'warning').length

    return {
      totalBudget,
      totalUsed,
      avgUsage,
      schoolsOverBudget,
      schoolsWarning,
      totalSchools: mockBudgets.length
    }
  }

  const handleCreateBudget = () => {
    setShowCreateModal(true)
  }

  const handleEditBudget = (budget: AIBudgetData) => {
    setSelectedBudget(budget)
    toast.success(`Editando presupuesto de ${budget.school_name}`)
  }

  const handlePauseBudget = async (budgetId: string) => {
    toast.success('Presupuesto pausado - Servicios IA deshabilitados')
  }

  const handleActivateBudget = async (budgetId: string) => {
    toast.success('Presupuesto reactivado - Servicios IA habilitados')
  }

  const handleExportBudgets = () => {
    toast.success('Exportando presupuestos a Excel...')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const stats = getBudgetStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Presupuestos de IA 💰</h1>
              <p className="mt-2 opacity-90">
                Gestión y monitoreo de presupuestos de IA por escuela - {periodFilter}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportBudgets}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={handleCreateBudget}
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nuevo Presupuesto
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BanknotesIcon className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBudget)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CpuChipIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uso Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalUsed)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgUsage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Alerta</p>
                <p className="text-2xl font-bold text-gray-900">{stats.schoolsWarning}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircleIcon className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Excedidas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.schoolsOverBudget}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar escuela..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="warning">En alerta</option>
                <option value="exceeded">Excedidos</option>
                <option value="paused">Pausados</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="2025-06">Junio 2025</option>
                <option value="2025-05">Mayo 2025</option>
                <option value="2025-04">Abril 2025</option>
                <option value="2025-03">Marzo 2025</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                variant="outline"
              >
                {viewMode === 'grid' ? 'Vista Tabla' : 'Vista Tarjetas'}
              </Button>
            </div>
          </div>
        </div>

        {/* Budget Cards/Table */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockBudgets.map((budget) => (
              <div key={budget.budget_id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{budget.school_name}</h3>
                      <p className="text-sm text-gray-600">{budget.sostenedor_name}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                      {getStatusIcon(budget.status)}
                      <span className="ml-1">
                        {budget.status === 'active' && 'Activo'}
                        {budget.status === 'warning' && 'Alerta'}
                        {budget.status === 'exceeded' && 'Excedido'}
                        {budget.status === 'paused' && 'Pausado'}
                      </span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Uso del presupuesto</span>
                        <span className="text-sm font-bold text-gray-900">{budget.usage_percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getUsageBarColor(budget.usage_percentage)}`}
                          style={{ width: `${Math.min(budget.usage_percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Presupuesto</p>
                        <p className="font-semibold">{formatCurrency(budget.budget_clp)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Usado</p>
                        <p className="font-semibold">{formatCurrency(budget.used_clp)}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Restante</p>
                      <p className={`font-semibold ${budget.remaining_clp < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(budget.remaining_clp)}
                      </p>
                    </div>

                    {budget.alerts.length > 0 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex">
                          <BellIcon className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <div className="ml-2">
                            <p className="text-sm font-medium text-yellow-800">Alertas Activas</p>
                            <p className="text-xs text-yellow-700">{budget.alerts.length} alerta(s)</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button
                      onClick={() => handleEditBudget(budget)}
                      className="flex-1"
                      variant="outline"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => budget.status === 'paused' ? handleActivateBudget(budget.budget_id) : handlePauseBudget(budget.budget_id)}
                      variant="outline"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table view
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Escuela
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presupuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uso %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alertas
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockBudgets.map((budget) => (
                    <tr key={budget.budget_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{budget.school_name}</div>
                          <div className="text-sm text-gray-500">{budget.sostenedor_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(budget.budget_clp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(budget.used_clp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${getUsageBarColor(budget.usage_percentage)}`}
                              style={{ width: `${Math.min(budget.usage_percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {budget.usage_percentage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                          {getStatusIcon(budget.status)}
                          <span className="ml-1">
                            {budget.status === 'active' && 'Activo'}
                            {budget.status === 'warning' && 'Alerta'}
                            {budget.status === 'exceeded' && 'Excedido'}
                            {budget.status === 'paused' && 'Pausado'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {budget.alerts.length > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <BellIcon className="w-3 h-3 mr-1" />
                              {budget.alerts.length}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleEditBudget(budget)}
                            variant="outline"
                            size="sm"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => budget.status === 'paused' ? handleActivateBudget(budget.budget_id) : handlePauseBudget(budget.budget_id)}
                            variant="outline"
                            size="sm"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Service Costs Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Costos por Servicio de IA - Resumen Global</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Unitario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso Mensual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % del Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {aiServiceCosts.map((service, index) => {
                  const totalCosts = aiServiceCosts.reduce((sum, s) => sum + s.total_cost_clp, 0)
                  const percentage = (service.total_cost_clp / totalCosts * 100).toFixed(1)
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.service_name}</div>
                          <div className="text-sm text-gray-500">{service.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(service.unit_cost_clp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.monthly_usage.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(service.total_cost_clp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-900">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 