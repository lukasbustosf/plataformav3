'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/ui/statsGrid'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CpuChipIcon,
  ClockIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// Types
interface ServiceData {
  service: string
  usage: number
  unit: string
  cost: number
  requests: number
}

interface SchoolData {
  id: number
  name: string
  budget: number
  used: number
  percent: number
  status: string
  requests: number
  lastActivity: string
}

// Mock data for AI costs
const mockAICosts = {
  currentMonth: {
    total: 89750,
    budget: 120000,
    percentUsed: 74.8,
    projected: 102500
  },
  breakdown: [
    {
      service: 'GPT-4o Mini',
      usage: 45230000,
      unit: 'tokens',
      cost: 52340,
      requests: 2834
    },
    {
      service: 'Google TTS',
      usage: 1840000,
      unit: 'characters',
      cost: 21850,
      requests: 1245
    },
    {
      service: 'WebSocket Edge',
      usage: 125000,
      unit: 'messages',
      cost: 15560,
      requests: 8923
    }
  ],
  schools: [
    {
      id: 1,
      name: 'Colegio San Patricio',
      budget: 35000,
      used: 28450,
      percent: 81.3,
      status: 'warning',
      requests: 1845,
      lastActivity: '2025-01-21T10:30:00Z'
    },
    {
      id: 2,
      name: 'Instituto María Montessori',
      budget: 42000,
      used: 31200,
      percent: 74.3,
      status: 'healthy',
      requests: 2156,
      lastActivity: '2025-01-21T11:15:00Z'
    }
  ],
  history: [
    { month: 'Ene 2025', budget: 120000, used: 89750, requests: 12823 },
    { month: 'Dic 2024', budget: 115000, used: 98420, requests: 11956 },
    { month: 'Nov 2024', budget: 110000, used: 87650, requests: 10234 },
    { month: 'Oct 2024', budget: 105000, used: 76890, requests: 9458 }
  ]
}

export default function AdminAICostsPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null)
  const [budgetForm, setBudgetForm] = useState({
    monthly: 120000,
    alertThreshold: 80,
    emergencyThreshold: 95
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num)
  }

  const getStatusColor = (percent: number) => {
    if (percent >= 95) return 'text-red-600 bg-red-100'
    if (percent >= 80) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  // Calculate dynamic colors
  const budgetUsageColor = mockAICosts.currentMonth.percentUsed >= 80 ? 'yellow' : 'green'

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
      id: 'monthly-cost',
      label: 'Gasto Mensual',
      value: formatCurrency(mockAICosts.currentMonth.total),
      change: {
        value: 8.2,
        type: 'decrease',
        period: 'mes anterior'
      },
      icon: <CurrencyDollarIcon className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'budget-used',
      label: 'Presupuesto Usado',
      value: `${mockAICosts.currentMonth.percentUsed}%`,
      change: {
        value: 12.4,
        type: 'increase',
        period: 'últimos 7 días'
      },
      icon: <ChartBarIcon className="h-5 w-5" />,
      color: budgetUsageColor
    },
    {
      id: 'total-requests',
      label: 'Total Requests',
      value: formatNumber(mockAICosts.breakdown.reduce((sum, item) => sum + item.requests, 0)),
      change: {
        value: 23.1,
        type: 'increase',
        period: 'semana anterior'
      },
      icon: <BoltIcon className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'monthly-projection',
      label: 'Proyección Mensual',
      value: formatCurrency(mockAICosts.currentMonth.projected),
      change: {
        value: 3.2,
        type: 'decrease',
        period: 'estimado'
      },
      icon: <ClockIcon className="h-5 w-5" />,
      color: 'indigo'
    }
  ]

  const serviceColumns = [
    {
      key: 'service',
      label: 'Servicio',
      mobileLabel: 'Servicio',
      render: (row: ServiceData) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex items-center space-x-3">
            <CpuChipIcon className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900">{row.service}</div>
              <div className="text-sm text-gray-500">{formatNumber(row.usage)} {row.unit}</div>
            </div>
          </div>
        )
      }
    },
    {
      key: 'requests',
      label: 'Requests',
      mobileLabel: 'Req',
      hiddenOnMobile: false,
      render: (row: ServiceData) => {
        if (!row) return <div>-</div>
        return (
          <span className="text-sm font-medium text-gray-900">
            {formatNumber(row.requests)}
          </span>
        )
      }
    },
    {
      key: 'cost',
      label: 'Costo',
      mobileLabel: 'Costo',
      render: (row: ServiceData) => {
        if (!row) return <div>-</div>
        return (
          <span className="font-medium text-green-600">
            {formatCurrency(row.cost)}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: '',
      mobileLabel: 'Acciones',
      hiddenOnMobile: false,
      render: (row: ServiceData) => {
        if (!row) return <div>-</div>
        return (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedService(row)
              setShowDetailsModal(true)
            }}
          >
            <EyeIcon className="w-4 h-4" />
          </Button>
        )
      }
    }
  ]

  const schoolColumns = [
    {
      key: 'school',
      label: 'Escuela',
      mobileLabel: 'Escuela',
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">
              {formatNumber(row.requests)} requests
            </div>
          </div>
        )
      }
    },
    {
      key: 'budget',
      label: 'Presupuesto',
      mobileLabel: 'Presup.',
      hiddenOnMobile: true,
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <div className="text-sm">
            <div className="font-medium">{formatCurrency(row.budget)}</div>
            <div className="text-gray-500">mensual</div>
          </div>
        )
      }
    },
    {
      key: 'usage',
      label: 'Uso',
      mobileLabel: 'Uso',
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    row.percent >= 95 ? 'bg-red-500' : 
                    row.percent >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(row.percent, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium">{row.percent}%</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatCurrency(row.used)} / {formatCurrency(row.budget)}
            </div>
          </div>
        )
      }
    },
    {
      key: 'status',
      label: 'Estado',
      mobileLabel: 'Estado',
      hiddenOnMobile: true,
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(row.percent)}`}>
            {row.percent >= 95 ? 'Crítico' : row.percent >= 80 ? 'Alerta' : 'OK'}
          </span>
        )
      }
    },
    {
      key: 'actions',
      label: '',
      mobileLabel: 'Acciones',
      render: (row: SchoolData) => {
        if (!row) return <div>-</div>
        return (
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedSchool(row)
                setShowDetailsModal(true)
              }}
            >
              <EyeIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setBudgetForm({ 
                  monthly: row.budget, 
                  alertThreshold: 80, 
                  emergencyThreshold: 95 
                })
                setSelectedSchool(row)
                setShowBudgetModal(true)
              }}
            >
              <PencilIcon className="w-4 h-4" />
            </Button>
          </div>
        )
      }
    }
  ]

  const handleExportReport = () => {
    toast.success('📊 Reporte de costos generado correctamente')
  }

  const handleUpdateBudget = () => {
    toast.success(`💰 Presupuesto actualizado para ${selectedSchool?.name}`)
    setShowBudgetModal(false)
    setSelectedSchool(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Costos de IA 💰</h1>
              <p className="mt-2 opacity-90 text-sm sm:text-base">
                Análisis y control de gastos en servicios de Inteligencia Artificial
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button 
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => setShowBudgetModal(true)}
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                Configurar
              </Button>
              <Button 
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={handleExportReport}
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        <StatsGrid stats={statsData} />

        {/* Budget Alert */}
        {mockAICosts.currentMonth.percentUsed >= 80 && (
          <div className={`rounded-lg p-4 ${
            mockAICosts.currentMonth.percentUsed >= 95 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center">
              <ExclamationTriangleIcon className={`w-5 h-5 mr-3 ${
                mockAICosts.currentMonth.percentUsed >= 95 ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div>
                <h3 className={`text-sm font-medium ${
                  mockAICosts.currentMonth.percentUsed >= 95 ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {mockAICosts.currentMonth.percentUsed >= 95 ? 'Presupuesto Crítico' : 'Alerta de Presupuesto'}
                </h3>
                <p className={`text-xs mt-1 ${
                  mockAICosts.currentMonth.percentUsed >= 95 ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  Has usado {mockAICosts.currentMonth.percentUsed}% del presupuesto mensual. 
                  Proyección: {formatCurrency(mockAICosts.currentMonth.projected)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Service Breakdown */}
        <div className="card-responsive">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Consumo por Servicio</h2>
              <p className="text-sm text-gray-600">Desglose detallado de uso y costos</p>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input-field-mobile"
              >
                <option value="current">Mes Actual</option>
                <option value="last">Mes Anterior</option>
                <option value="quarter">Último Trimestre</option>
              </select>
            </div>
          </div>

          <ResponsiveTable
            data={mockAICosts.breakdown}
            columns={serviceColumns}
            searchable={false}
          />
        </div>

        {/* School Budgets */}
        <div className="card-responsive">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Presupuestos por Escuela</h2>
              <p className="text-sm text-gray-600">Monitoreo de gastos individuales</p>
            </div>
          </div>

          <ResponsiveTable
            data={mockAICosts.schools}
            columns={schoolColumns}
            searchable={true}
            emptyMessage="No hay escuelas configuradas"
          />
        </div>

        {/* Historical Trends */}
        <div className="card-responsive">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Tendencia Histórica</h2>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-4 gap-4 min-w-max">
              {mockAICosts.history.map((period, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-900">{period.month}</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Presupuesto:</span>
                      <span className="font-medium">{formatCurrency(period.budget)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Usado:</span>
                      <span className="font-medium text-green-600">{formatCurrency(period.used)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Requests:</span>
                      <span className="font-medium">{formatNumber(period.requests)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((period.used / period.budget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Configuration Modal */}
      <ResponsiveModal
        open={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Configurar Presupuesto"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="form-label">Presupuesto Mensual</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={budgetForm.monthly}
                onChange={(e) => setBudgetForm(prev => ({ ...prev, monthly: parseInt(e.target.value) }))}
                className="input-field-mobile pl-8"
                placeholder="120000"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Umbral de Alerta (%)</label>
            <input
              type="number"
              value={budgetForm.alertThreshold}
              onChange={(e) => setBudgetForm(prev => ({ ...prev, alertThreshold: parseInt(e.target.value) }))}
              className="input-field-mobile"
              placeholder="80"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="form-label">Umbral de Emergencia (%)</label>
            <input
              type="number"
              value={budgetForm.emergencyThreshold}
              onChange={(e) => setBudgetForm(prev => ({ ...prev, emergencyThreshold: parseInt(e.target.value) }))}
              className="input-field-mobile"
              placeholder="95"
              min="1"
              max="100"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowBudgetModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateBudget}
              className="w-full sm:w-auto"
            >
              Actualizar Presupuesto
            </Button>
          </div>
        </div>
      </ResponsiveModal>

      {/* Details Modal */}
      <ResponsiveModal
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Detalles - ${selectedSchool?.name || 'Servicio'}`}
        size="lg"
      >
        {selectedSchool && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="stats-card">
                <div className="text-sm text-gray-600">Presupuesto Mensual</div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(selectedSchool.budget)}
                </div>
              </div>
              <div className="stats-card">
                <div className="text-sm text-gray-600">Consumo Actual</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(selectedSchool.used)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-2">Uso del Presupuesto</div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    selectedSchool.percent >= 95 ? 'bg-red-500' : 
                    selectedSchool.percent >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(selectedSchool.percent, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0%</span>
                <span className="font-medium">{selectedSchool.percent}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Actividad Reciente</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Requests:</span>
                  <span className="font-medium">{formatNumber(selectedSchool.requests)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Actividad:</span>
                  <span className="font-medium">
                    {new Date(selectedSchool.lastActivity).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </ResponsiveModal>
    </DashboardLayout>
  )
}
