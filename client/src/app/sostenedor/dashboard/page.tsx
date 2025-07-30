'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  BuildingOfficeIcon,
  ChartBarIcon,
  BanknotesIcon,
  TrophyIcon,
  UsersIcon,
  AcademicCapIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  PlayIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

export default function SostenedorDashboard() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedRegion, setSelectedRegion] = useState('all')

  // Executive KPIs
  const executiveKPIs = {
    totalSchools: 12,
    activeSchools: 11,
    totalStudents: 8450,
    totalTeachers: 324,
    totalRevenue: 2850000000, // CLP
    monthlyGrowth: 8.5,
    studentRetention: 94.2,
    teacherSatisfaction: 87.3,
    aiUsageOptimization: 78.5,
    operationalEfficiency: 91.2
  }

  // Financial Overview
  const financialData = {
    totalBudget: 3200000000, // CLP
    aiSpending: 145000000,
    operationalCosts: 2100000000,
    profitMargin: 23.4,
    revenueGrowth: 12.8,
    costPerStudent: 337278,
    aiROI: 340, // %
    budgetUtilization: 89.1
  }

  // Academic Performance
  const academicMetrics = {
    averageGPA: 6.4,
    bloomCoverage: {
      recordar: 95.2,
      comprender: 87.8,
      aplicar: 82.1,
      analizar: 74.5,
      evaluar: 68.9,
      crear: 61.3
    },
    standardizedTestScores: 78.5,
    graduationRate: 96.8,
    universityAcceptance: 89.4,
    nationalRanking: 15
  }

  // School Performance Rankings
  const schoolRankings = [
    {
      id: 1,
      name: 'Colegio San Patricio',
      region: 'Metropolitana',
      students: 850,
      performance: 94.2,
      aiUsage: 89.5,
      revenue: 425000000,
      trend: 'up',
      status: 'excellent'
    },
    {
      id: 2,
      name: 'Instituto Los Andes',
      region: 'Valparaíso',
      students: 720,
      performance: 91.8,
      aiUsage: 92.1,
      revenue: 380000000,
      trend: 'up',
      status: 'excellent'
    },
    {
      id: 3,
      name: 'Escuela Nueva Esperanza',
      region: 'Biobío',
      students: 650,
      performance: 88.4,
      aiUsage: 76.3,
      revenue: 290000000,
      trend: 'stable',
      status: 'good'
    },
    {
      id: 4,
      name: 'Colegio del Norte',
      region: 'Antofagasta',
      students: 580,
      performance: 85.7,
      aiUsage: 68.9,
      revenue: 245000000,
      trend: 'down',
      status: 'attention'
    }
  ]

  // Recent Alerts and Notifications
  const executiveAlerts = [
    {
      id: 1,
      type: 'financial',
      severity: 'high',
      title: 'Presupuesto IA al 85% en Colegio San Patricio',
      description: 'Se recomienda revisar asignación presupuestaria para Q4',
      timestamp: '2 horas',
      action: 'Ver Detalles'
    },
    {
      id: 2,
      type: 'performance',
      severity: 'medium',
      title: 'Mejora en ranking nacional',
      description: 'Red educativa subió 3 posiciones en ranking MINEDUC',
      timestamp: '1 día',
      action: 'Ver Reporte'
    },
    {
      id: 3,
      type: 'operational',
      severity: 'low',
      title: 'Nueva integración completada',
      description: 'Sistema de reportes automáticos implementado exitosamente',
      timestamp: '3 días',
      action: 'Revisar'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'attention': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Executive Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Ejecutivo 🏢</h1>
              <p className="mt-2 opacity-90">
                Bienvenido {fullName} - Panel de control estratégico de la red educativa
              </p>
              <div className="mt-3 flex items-center space-x-6 text-sm opacity-75">
                <span>{executiveKPIs.totalSchools} colegios en la red</span>
                <span>{executiveKPIs.totalStudents.toLocaleString()} estudiantes</span>
                <span>{executiveKPIs.totalTeachers} profesores</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPercentage(executiveKPIs.monthlyGrowth)}</div>
              <div className="text-sm opacity-75">Crecimiento mensual</div>
            </div>
          </div>
        </div>

        {/* Period and Region Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filtros de Análisis</h2>
            <div className="flex space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input text-sm"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="input text-sm"
              >
                <option value="all">Todas las regiones</option>
                <option value="metropolitana">Metropolitana</option>
                <option value="valparaiso">Valparaíso</option>
                <option value="biobio">Biobío</option>
                <option value="antofagasta">Antofagasta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Executive KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Financial Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(executiveKPIs.totalRevenue)}</p>
                <div className="flex items-center text-sm text-green-600">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  +{formatPercentage(financialData.revenueGrowth)}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Excellence */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio Red</p>
                <p className="text-2xl font-bold text-gray-900">{academicMetrics.averageGPA}</p>
                <p className="text-xs text-blue-600">Ranking Nacional #{academicMetrics.nationalRanking}</p>
              </div>
            </div>
          </div>

          {/* AI Optimization */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Optimización IA</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(executiveKPIs.aiUsageOptimization)}</p>
                <p className="text-xs text-purple-600">ROI: {financialData.aiROI}%</p>
              </div>
            </div>
          </div>

          {/* Operational Efficiency */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Eficiencia Operacional</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(executiveKPIs.operationalEfficiency)}</p>
                <p className="text-xs text-orange-600">Retención: {formatPercentage(executiveKPIs.studentRetention)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* School Performance Rankings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Rendimiento por Colegio</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/sostenedor/schools'}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Ver Todos
              </Button>
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
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uso IA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schoolRankings.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500">{school.region}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${school.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{formatPercentage(school.performance)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${school.aiUsage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{formatPercentage(school.aiUsage)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(school.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTrendIcon(school.trend)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(school.status)}`}>
                        {school.status === 'excellent' ? 'Excelente' :
                         school.status === 'good' ? 'Bueno' :
                         school.status === 'attention' ? 'Atención' : 'Crítico'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Alerts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Executive Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Alertas Ejecutivas</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {executiveAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'high' ? 'bg-red-500' :
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                        <Button variant="outline" size="sm">
                          {alert.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Acciones Estratégicas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/sostenedor/executive-reports'}
                >
                  <DocumentChartBarIcon className="h-6 w-6" />
                  <span className="text-sm">Reporte Ejecutivo</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/sostenedor/ai-budget'}
                >
                  <CpuChipIcon className="h-6 w-6" />
                  <span className="text-sm">Presupuesto IA</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/sostenedor/benchmarking'}
                >
                  <ChartBarIcon className="h-6 w-6" />
                  <span className="text-sm">Benchmarking</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => window.location.href = '/sostenedor/financial-projections'}
                >
                  <ArrowTrendingUpIcon className="h-6 w-6" />
                  <span className="text-sm">Proyecciones</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bloom Taxonomy Coverage Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Cobertura Curricular Bloom - Red Educativa</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(academicMetrics.bloomCoverage).map(([level, percentage]) => (
                <div key={level} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-700">{percentage.toFixed(0)}%</span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">{level}</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
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