'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  ChartBarIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  PresentationChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function SostenedorAnalytics() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedSchool, setSelectedSchool] = useState('all')

  // Mock analytics data
  const networkMetrics = {
    totalEngagement: 87.3,
    averagePerformance: 8.2,
    completionRate: 94.1,
    satisfactionScore: 4.6
  }

  const schoolPerformance = [
    { name: 'Colegio San Patricio', performance: 9.1, trend: 'up', students: 850 },
    { name: 'Instituto Los Andes', performance: 8.4, trend: 'up', students: 650 },
    { name: 'Liceo Técnico Norte', performance: 7.8, trend: 'stable', students: 720 },
    { name: 'Colegio del Valle', performance: 7.2, trend: 'down', students: 580 }
  ]

  const subjectAnalytics = [
    { subject: 'Matemáticas', average: 7.8, participation: 92, improvement: '+0.4' },
    { subject: 'Lenguaje', average: 8.1, participation: 89, improvement: '+0.2' },
    { subject: 'Ciencias', average: 7.5, participation: 85, improvement: '+0.6' },
    { subject: 'Historia', average: 7.9, participation: 88, improvement: '+0.1' }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analíticas de Red 📊</h1>
            <p className="text-gray-600 mt-1">
              Insights y métricas de rendimiento de toda la red educativa
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export analytics */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button
              onClick={() => {/* Generate custom report */}}
            >
              <PresentationChartBarIcon className="h-4 w-4 mr-2" />
              Reporte Personalizado
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colegio
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="input"
              >
                <option value="all">Todos los colegios</option>
                <option value="san-patricio">Colegio San Patricio</option>
                <option value="los-andes">Instituto Los Andes</option>
                <option value="liceo-norte">Liceo Técnico Norte</option>
                <option value="colegio-valle">Colegio del Valle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtros Avanzados
              </label>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {/* Open advanced filters */}}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Configurar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Engagement Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{networkMetrics.totalEngagement}%</p>
                <p className="text-xs text-green-600">+2.1% vs mes anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rendimiento Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{networkMetrics.averagePerformance}</p>
                <p className="text-xs text-green-600">+0.3 vs mes anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa de Completitud</p>
                <p className="text-2xl font-bold text-gray-900">{networkMetrics.completionRate}%</p>
                <p className="text-xs text-green-600">+1.8% vs mes anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Satisfacción</p>
                <p className="text-2xl font-bold text-gray-900">{networkMetrics.satisfactionScore}/5</p>
                <p className="text-xs text-green-600">+0.2 vs mes anterior</p>
              </div>
            </div>
          </div>
        </div>

        {/* School Performance Ranking */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Ranking de Rendimiento por Colegio
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colegio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schoolPerformance.map((school, index) => (
                  <tr key={school.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="text-lg font-bold">{school.performance}</span>
                        <span className="text-gray-500 ml-1">/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${getTrendColor(school.trend)}`}>
                        {getTrendIcon(school.trend)}
                        <span className="ml-1 text-sm font-medium capitalize">{school.trend}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* View school details */}}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject Analytics */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Análisis por Asignatura
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio Red
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mejora Mensual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjectAnalytics.map((subject) => (
                  <tr key={subject.subject} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{subject.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="text-lg font-bold">{subject.average}</span>
                        <span className="text-gray-500 ml-1">/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{subject.participation}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {subject.improvement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* View subject details */}}
                      >
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        Analizar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 