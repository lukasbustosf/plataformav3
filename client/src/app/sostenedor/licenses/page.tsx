'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  DocumentCheckIcon,
  CpuChipIcon,
  CloudIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function SostenedorLicenses() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // License and subscription data
  const licenseOverview = {
    totalLicenses: 1247,
    activeLicenses: 1156,
    expiringSoon: 24,
    totalCost: 145000000, // CLP monthly
    aiUsageCost: 45000000, // CLP monthly
    savingsFromBulk: 23000000, // CLP monthly
    utilizationRate: 87.3,
    renewalRate: 94.2
  }

  // Available plans
  const availablePlans = [
    {
      id: 'basic',
      name: 'EDU21 Básico',
      description: 'Gestión básica sin IA',
      pricePerUser: 2500, // CLP
      features: [
        'Gestión de clases básica',
        'Libro de notas digital',
        'Reportes estándar',
        'Soporte por email',
        'Almacenamiento 10GB'
      ],
      limitations: [
        'Sin generación IA',
        'Sin TTS',
        'Sin juegos avanzados'
      ],
      color: 'blue'
    },
    {
      id: 'professional',
      name: 'EDU21 Profesional',
      description: 'Incluye IA limitada',
      pricePerUser: 4500, // CLP
      features: [
        'Todo lo del plan Básico',
        'Generación IA limitada (500 tokens/mes)',
        'TTS básico',
        'Juegos educativos',
        'Reportes avanzados',
        'Soporte prioritario',
        'Almacenamiento 50GB'
      ],
      limitations: [
        'Límite de tokens IA',
        'Sin análisis predictivo'
      ],
      color: 'purple',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'EDU21 Enterprise',
      description: 'IA ilimitada + analíticas avanzadas',
      pricePerUser: 7500, // CLP
      features: [
        'Todo lo del plan Profesional',
        'IA ilimitada',
        'Análisis predictivo',
        'Dashboards ejecutivos',
        'API completa',
        'Soporte 24/7',
        'Almacenamiento ilimitado',
        'Integración personalizada'
      ],
      limitations: [],
      color: 'gold'
    }
  ]

  // School licenses
  const schoolLicenses = [
    {
      id: 1,
      school: 'Colegio San Patricio',
      region: 'Metropolitana',
      plan: 'enterprise',
      planName: 'EDU21 Enterprise',
      users: 125,
      monthlyCost: 937500,
      aiUsage: 89.5,
      aiCost: 245000,
      status: 'active',
      renewalDate: '2025-03-15',
      daysToRenewal: 85,
      utilization: 94.2,
      lastUpgrade: '2024-09-15'
    },
    {
      id: 2,
      school: 'Instituto Los Andes',
      region: 'Valparaíso',
      plan: 'professional',
      planName: 'EDU21 Profesional',
      users: 98,
      monthlyCost: 441000,
      aiUsage: 76.3,
      aiCost: 180000,
      status: 'active',
      renewalDate: '2025-02-28',
      daysToRenewal: 70,
      utilization: 87.8,
      lastUpgrade: '2024-08-20'
    },
    {
      id: 3,
      school: 'Escuela Nueva Esperanza',
      region: 'Biobío',
      plan: 'professional',
      planName: 'EDU21 Profesional',
      users: 87,
      monthlyCost: 391500,
      aiUsage: 68.9,
      aiCost: 145000,
      status: 'warning',
      renewalDate: '2025-01-15',
      daysToRenewal: 26,
      utilization: 82.1,
      lastUpgrade: '2024-06-10'
    },
    {
      id: 4,
      school: 'Colegio del Norte',
      region: 'Antofagasta',
      plan: 'basic',
      planName: 'EDU21 Básico',
      users: 76,
      monthlyCost: 190000,
      aiUsage: 0,
      aiCost: 0,
      status: 'upgrade_needed',
      renewalDate: '2025-04-30',
      daysToRenewal: 131,
      utilization: 65.4,
      lastUpgrade: null
    }
  ]

  // AI usage analytics
  const aiUsageData = {
    totalTokensUsed: 2450000,
    totalTokensLimit: 3000000,
    topConsumers: [
      { school: 'Colegio San Patricio', tokens: 890000, cost: 245000 },
      { school: 'Instituto Los Andes', tokens: 650000, cost: 180000 },
      { school: 'Escuela Nueva Esperanza', tokens: 520000, cost: 145000 }
    ],
    monthlyTrend: 'increasing',
    projectedOverage: 150000
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'professional': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string, daysToRenewal: number) => {
    if (status === 'warning' || daysToRenewal < 30) return 'bg-yellow-100 text-yellow-800'
    if (status === 'upgrade_needed') return 'bg-orange-100 text-orange-800'
    if (status === 'expired') return 'bg-red-100 text-red-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusIcon = (status: string, daysToRenewal: number) => {
    if (status === 'warning' || daysToRenewal < 30) return <ExclamationTriangleIcon className="h-4 w-4" />
    if (status === 'upgrade_needed') return <ArrowTrendingUpIcon className="h-4 w-4" />
    if (status === 'expired') return <XCircleIcon className="h-4 w-4" />
    return <CheckCircleIcon className="h-4 w-4" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Licencias y Planes 📋</h1>
            <p className="text-gray-600 mt-1">
              Gestiona las licencias de software y planes de suscripción de toda la red
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export licenses */}}
            >
              <DocumentCheckIcon className="h-4 w-4 mr-2" />
              Exportar Licencias
            </Button>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Gestionar Planes
            </Button>
          </div>
        </div>

        {/* License Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentCheckIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Licencias</p>
                <p className="text-2xl font-bold text-gray-900">{licenseOverview.totalLicenses.toLocaleString()}</p>
                <p className="text-xs text-blue-600">{licenseOverview.activeLicenses} activas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Costo Mensual</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(licenseOverview.totalCost)}</p>
                <p className="text-xs text-green-600">Ahorro: {formatCurrency(licenseOverview.savingsFromBulk)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Costo IA Mensual</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(licenseOverview.aiUsageCost)}</p>
                <p className="text-xs text-purple-600">{((aiUsageData.totalTokensUsed / aiUsageData.totalTokensLimit) * 100).toFixed(1)}% utilizado</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Expiran Pronto</p>
                <p className="text-2xl font-bold text-gray-900">{licenseOverview.expiringSoon}</p>
                <p className="text-xs text-yellow-600">Próximos 30 días</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Planes Disponibles</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.map((plan) => (
                <div key={plan.id} className={`relative border-2 rounded-lg p-6 ${plan.popular ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                        Más Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.pricePerUser)}</span>
                      <span className="text-gray-600">/usuario/mes</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Características:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Limitaciones:</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-500">
                            <XCircleIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    variant={plan.popular ? "primary" : "outline"}
                  >
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* School Licenses Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Licencias por Colegio</h2>
              <div className="flex space-x-2">
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="input text-sm"
                >
                  <option value="all">Todos los planes</option>
                  <option value="basic">Básico</option>
                  <option value="professional">Profesional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input text-sm"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activo</option>
                  <option value="warning">Advertencia</option>
                  <option value="upgrade_needed">Requiere Upgrade</option>
                </select>
              </div>
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
                    Plan Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Mensual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso IA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renovación
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
                {schoolLicenses.map((license) => (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{license.school}</div>
                          <div className="text-sm text-gray-500">{license.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(license.plan)}`}>
                        {license.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{license.users}</div>
                          <div className="text-sm text-gray-500">{license.utilization}% utilización</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(license.monthlyCost)}</div>
                        {license.aiCost > 0 && (
                          <div className="text-sm text-gray-500">IA: {formatCurrency(license.aiCost)}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {license.aiUsage > 0 ? (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${license.aiUsage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{license.aiUsage.toFixed(1)}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No disponible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm text-gray-900">{license.renewalDate}</div>
                          <div className="text-sm text-gray-500">{license.daysToRenewal} días</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(license.status, license.daysToRenewal)}`}>
                        {getStatusIcon(license.status, license.daysToRenewal)}
                        <span className="ml-1">
                          {license.status === 'active' && license.daysToRenewal > 30 ? 'Activo' :
                           license.status === 'warning' || license.daysToRenewal < 30 ? 'Expira Pronto' :
                           license.status === 'upgrade_needed' ? 'Upgrade Sugerido' : 'Expirado'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* View license details */}}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Edit license */}}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Upgrade plan */}}
                        >
                          <ArrowTrendingUpIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Usage Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Usage Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Uso de IA - Resumen</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tokens Utilizados</span>
                  <span className="text-sm text-gray-900">
                    {aiUsageData.totalTokensUsed.toLocaleString()} / {aiUsageData.totalTokensLimit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: `${(aiUsageData.totalTokensUsed / aiUsageData.totalTokensLimit) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {aiUsageData.projectedOverage > 0 && (
                    <div className="flex items-center text-orange-600">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Proyección de sobrecosto: {formatCurrency(aiUsageData.projectedOverage)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top AI Consumers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mayor Consumo de IA</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {aiUsageData.topConsumers.map((consumer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{consumer.school}</div>
                        <div className="text-xs text-gray-500">{consumer.tokens.toLocaleString()} tokens</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(consumer.cost)}</div>
                      <div className="text-xs text-gray-500">mensual</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 