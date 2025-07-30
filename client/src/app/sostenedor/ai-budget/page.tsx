'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  CpuChipIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  CloudIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function SostenedorAIBudget() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)

  // Overall AI budget data
  const overallBudget = {
    totalBudget: 50000000, // CLP monthly
    totalSpent: 43500000, // CLP monthly
    totalRemaining: 6500000, // CLP monthly
    utilizationRate: 87.0,
    projectedSpend: 48200000, // CLP monthly
    savingsFromOptimization: 2300000, // CLP monthly
    averageCostPerToken: 0.0015, // CLP
    totalTokensUsed: 29000000,
    totalTokensLimit: 33333333
  }

  // School-specific AI budgets
  const schoolBudgets = [
    {
      id: 1,
      school: 'Colegio San Patricio',
      region: 'Metropolitana',
      monthlyBudget: 15000000,
      spent: 13250000,
      remaining: 1750000,
      utilization: 88.3,
      tokensUsed: 8833333,
      tokensLimit: 10000000,
      trend: 'increasing',
      status: 'warning',
      lastOptimized: '2024-12-10',
      aiFeatures: ['quiz_generation', 'tts', 'analytics', 'predictive'],
      alertThreshold: 85,
      projectedOverrun: 450000
    },
    {
      id: 2,
      school: 'Instituto Los Andes',
      region: 'Valparaíso',
      monthlyBudget: 12000000,
      spent: 9800000,
      remaining: 2200000,
      utilization: 81.7,
      tokensUsed: 6533333,
      tokensLimit: 8000000,
      trend: 'stable',
      status: 'healthy',
      lastOptimized: '2024-12-05',
      aiFeatures: ['quiz_generation', 'tts', 'analytics'],
      alertThreshold: 80,
      projectedOverrun: 0
    },
    {
      id: 3,
      school: 'Escuela Nueva Esperanza',
      region: 'Biobío',
      monthlyBudget: 10000000,
      spent: 8900000,
      remaining: 1100000,
      utilization: 89.0,
      tokensUsed: 5933333,
      tokensLimit: 6666667,
      trend: 'increasing',
      status: 'critical',
      lastOptimized: '2024-11-28',
      aiFeatures: ['quiz_generation', 'tts'],
      alertThreshold: 85,
      projectedOverrun: 800000
    },
    {
      id: 4,
      school: 'Colegio del Norte',
      region: 'Antofagasta',
      monthlyBudget: 8000000,
      spent: 5200000,
      remaining: 2800000,
      utilization: 65.0,
      tokensUsed: 3466667,
      tokensLimit: 5333333,
      trend: 'stable',
      status: 'healthy',
      lastOptimized: '2024-12-01',
      aiFeatures: ['quiz_generation'],
      alertThreshold: 75,
      projectedOverrun: 0
    }
  ]

  // AI usage by feature
  const aiUsageByFeature = {
    quiz_generation: { cost: 18500000, percentage: 42.5, trend: 'up' },
    tts_generation: { cost: 12300000, percentage: 28.3, trend: 'stable' },
    analytics: { cost: 8900000, percentage: 20.5, trend: 'up' },
    predictive: { cost: 3800000, percentage: 8.7, trend: 'up' }
  }

  // Budget alerts
  const budgetAlerts = [
    {
      id: 1,
      school: 'Escuela Nueva Esperanza',
      type: 'budget_exceeded',
      severity: 'high',
      message: 'Presupuesto IA al 89% - Proyección de sobrecosto',
      amount: 800000,
      timestamp: '2024-12-19T09:30:00',
      action: 'Revisar límites'
    },
    {
      id: 2,
      school: 'Colegio San Patricio',
      type: 'high_usage',
      severity: 'medium',
      message: 'Uso intensivo de generación de quizzes',
      amount: 450000,
      timestamp: '2024-12-19T08:15:00',
      action: 'Optimizar uso'
    },
    {
      id: 3,
      school: 'Instituto Los Andes',
      type: 'optimization_available',
      severity: 'low',
      message: 'Oportunidad de optimización detectada',
      amount: 150000,
      timestamp: '2024-12-18T16:45:00',
      action: 'Aplicar optimización'
    }
  ]

  // Cost optimization recommendations
  const optimizationRecommendations = [
    {
      id: 1,
      title: 'Optimizar generación de quizzes',
      description: 'Reducir tokens por pregunta usando plantillas más eficientes',
      potentialSavings: 1200000,
      effort: 'low',
      impact: 'high',
      schools: ['Colegio San Patricio', 'Escuela Nueva Esperanza']
    },
    {
      id: 2,
      title: 'Implementar cache de TTS',
      description: 'Reutilizar audios generados para contenido repetitivo',
      potentialSavings: 800000,
      effort: 'medium',
      impact: 'medium',
      schools: ['Instituto Los Andes', 'Colegio San Patricio']
    },
    {
      id: 3,
      title: 'Ajustar límites por escuela',
      description: 'Redistribuir presupuesto según uso real histórico',
      potentialSavings: 500000,
      effort: 'low',
      impact: 'medium',
      schools: ['Colegio del Norte']
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircleIcon className="h-4 w-4" />
      case 'warning': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'critical': return <XCircleIcon className="h-4 w-4" />
      default: return <InformationCircleIcon className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
      case 'decreasing': return <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full" />
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-purple-100 text-purple-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Presupuesto IA 🤖</h1>
            <p className="text-gray-600 mt-1">
              Controla y optimiza el gasto en inteligencia artificial de toda la red
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAlertModal(true)}
            >
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              Configurar Alertas
            </Button>
            <Button
              onClick={() => setShowBudgetModal(true)}
              className="flex items-center"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Ajustar Presupuestos
            </Button>
          </div>
        </div>

        {/* Overall Budget Overview */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-medium opacity-90">Presupuesto Total</h3>
              <p className="text-3xl font-bold">{formatCurrency(overallBudget.totalBudget)}</p>
              <p className="text-sm opacity-75">Mensual</p>
            </div>
            <div>
              <h3 className="text-lg font-medium opacity-90">Gastado</h3>
              <p className="text-3xl font-bold">{formatCurrency(overallBudget.totalSpent)}</p>
              <p className="text-sm opacity-75">{overallBudget.utilizationRate}% utilizado</p>
            </div>
            <div>
              <h3 className="text-lg font-medium opacity-90">Disponible</h3>
              <p className="text-3xl font-bold">{formatCurrency(overallBudget.totalRemaining)}</p>
              <p className="text-sm opacity-75">Restante</p>
            </div>
            <div>
              <h3 className="text-lg font-medium opacity-90">Proyección</h3>
              <p className="text-3xl font-bold">{formatCurrency(overallBudget.projectedSpend)}</p>
              <p className="text-sm opacity-75">Fin de mes</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-75">Utilización del presupuesto</span>
              <span className="text-sm font-medium">{overallBudget.utilizationRate}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full"
                style={{ width: `${overallBudget.utilizationRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Alertas de Presupuesto</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {budgetAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{alert.school}</h4>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(alert.amount)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Usage by Feature */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Gasto por Funcionalidad IA</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(aiUsageByFeature).map(([feature, data]) => (
                <div key={feature} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {feature.replace('_', ' ')}
                    </h3>
                    {getTrendIcon(data.trend)}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.cost)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {data.percentage}% del total
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Budget Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Presupuesto por Colegio</h2>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input text-sm"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colegio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presupuesto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gastado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilización
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
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
                {schoolBudgets.map((budget) => (
                  <tr key={budget.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{budget.school}</div>
                          <div className="text-sm text-gray-500">{budget.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(budget.monthlyBudget)}
                      </div>
                      <div className="text-sm text-gray-500">mensual</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(budget.spent)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Disponible: {formatCurrency(budget.remaining)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              budget.utilization > 85 ? 'bg-red-500' :
                              budget.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${budget.utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{budget.utilization.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(budget.tokensUsed / 1000000).toFixed(1)}M / {(budget.tokensLimit / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-500">tokens</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTrendIcon(budget.trend)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                        {getStatusIcon(budget.status)}
                        <span className="ml-1 capitalize">{budget.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* View details */}}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Edit budget */}}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Optimize */}}
                        >
                          <LightBulbIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Optimization Recommendations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recomendaciones de Optimización</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {optimizationRecommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                        <h3 className="font-medium text-gray-900">{rec.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium text-green-700">
                            Ahorro: {formatCurrency(rec.potentialSavings)}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(rec.effort)}`}>
                          Esfuerzo: {rec.effort}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                          Impacto: {rec.impact}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Colegios afectados: {rec.schools.join(', ')}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                      <Button size="sm">
                        Implementar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 