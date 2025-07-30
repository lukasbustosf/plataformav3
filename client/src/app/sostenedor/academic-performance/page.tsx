'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  AcademicCapIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  UsersIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CalendarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { ResponsiveTable } from '@/components/ui/responsiveTable'

export default function SostenedorAcademicPerformance() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('semester')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')

  // Mock academic performance data
  const networkPerformance = {
    overallAverage: 7.8,
    passRate: 89.3,
    excellenceRate: 23.4,
    improvementRate: 12.1
  }

  const schoolPerformance = [
    {
      id: 1,
      name: 'Colegio San Patricio',
      average: 8.2,
      passRate: 94.1,
      excellenceRate: 31.2,
      trend: 'up',
      students: 850,
      subjects: [
        { name: 'Matemáticas', average: 8.0, trend: 'up' },
        { name: 'Lenguaje', average: 8.3, trend: 'up' },
        { name: 'Ciencias', average: 8.1, trend: 'stable' },
        { name: 'Historia', average: 8.4, trend: 'up' }
      ]
    },
    {
      id: 2,
      name: 'Instituto Los Andes',
      average: 7.6,
      passRate: 87.8,
      excellenceRate: 19.3,
      trend: 'up',
      students: 650,
      subjects: [
        { name: 'Matemáticas', average: 7.4, trend: 'up' },
        { name: 'Lenguaje', average: 7.8, trend: 'stable' },
        { name: 'Ciencias', average: 7.5, trend: 'up' },
        { name: 'Historia', average: 7.7, trend: 'up' }
      ]
    },
    {
      id: 3,
      name: 'Liceo Técnico Norte',
      average: 7.4,
      passRate: 85.2,
      excellenceRate: 15.8,
      trend: 'stable',
      students: 720,
      subjects: [
        { name: 'Matemáticas', average: 7.2, trend: 'stable' },
        { name: 'Lenguaje', average: 7.6, trend: 'up' },
        { name: 'Ciencias', average: 7.3, trend: 'stable' },
        { name: 'Historia', average: 7.5, trend: 'up' }
      ]
    },
    {
      id: 4,
      name: 'Colegio del Valle',
      average: 7.0,
      passRate: 81.4,
      excellenceRate: 12.1,
      trend: 'down',
      students: 580,
      subjects: [
        { name: 'Matemáticas', average: 6.8, trend: 'down' },
        { name: 'Lenguaje', average: 7.2, trend: 'stable' },
        { name: 'Ciencias', average: 6.9, trend: 'down' },
        { name: 'Historia', average: 7.1, trend: 'stable' }
      ]
    }
  ]

  const subjectComparison = [
    { subject: 'Matemáticas', networkAverage: 7.35, nationalAverage: 6.8, rank: 'Superior' },
    { subject: 'Lenguaje', networkAverage: 7.73, nationalAverage: 7.1, rank: 'Superior' },
    { subject: 'Ciencias', networkAverage: 7.45, nationalAverage: 6.9, rank: 'Superior' },
    { subject: 'Historia', networkAverage: 7.68, nationalAverage: 7.0, rank: 'Superior' },
    { subject: 'Inglés', networkAverage: 7.12, nationalAverage: 6.5, rank: 'Superior' },
    { subject: 'Educación Física', networkAverage: 8.21, nationalAverage: 7.8, rank: 'Superior' }
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

  const getPerformanceColor = (average: number) => {
    if (average >= 8.0) return 'text-green-600'
    if (average >= 7.0) return 'text-blue-600'
    if (average >= 6.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Superior': return 'bg-green-100 text-green-800'
      case 'Bueno': return 'bg-blue-100 text-blue-800'
      case 'Regular': return 'bg-yellow-100 text-yellow-800'
      case 'Deficiente': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rendimiento Académico 📊</h1>
            <p className="text-gray-600 mt-1">
              Análisis del desempeño educativo de toda la red de colegios
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export report */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar Informe
            </Button>
            <Button
              onClick={() => {/* Generate detailed report */}}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Informe Detallado
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                <option value="month">Último mes</option>
                <option value="quarter">Trimestre actual</option>
                <option value="semester">Semestre actual</option>
                <option value="year">Año académico</option>
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
                Asignatura
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input"
              >
                <option value="all">Todas las asignaturas</option>
                <option value="math">Matemáticas</option>
                <option value="language">Lenguaje</option>
                <option value="science">Ciencias</option>
                <option value="history">Historia</option>
                <option value="english">Inglés</option>
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
                Configurar
              </Button>
            </div>
          </div>
        </div>

        {/* Network Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{networkPerformance.overallAverage}</p>
                <p className="text-xs text-green-600">+0.3 vs período anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa de Aprobación</p>
                <p className="text-2xl font-bold text-gray-900">{networkPerformance.passRate}%</p>
                <p className="text-xs text-green-600">+2.1% vs período anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Excelencia Académica</p>
                <p className="text-2xl font-bold text-gray-900">{networkPerformance.excellenceRate}%</p>
                <p className="text-xs text-green-600">+1.8% vs período anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa de Mejora</p>
                <p className="text-2xl font-bold text-gray-900">{networkPerformance.improvementRate}%</p>
                <p className="text-xs text-green-600">Estudiantes en progreso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance by School Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="page-header-mobile px-6 py-4 border-b border-gray-200">
            <h2 className="page-title-mobile">Comparación de Rendimiento por Colegio</h2>
          </div>
          <ResponsiveTable
            columns={[
              {
                key: 'name',
                label: 'Colegio',
                render: (name: string, row: any) => (
                  <div>
                    <div className="text-sm font-medium text-gray-900">{name}</div>
                    <div className="text-sm text-gray-500">{row.students} estudiantes</div>
                  </div>
                )
              },
              {
                key: 'average',
                label: 'Promedio General',
                render: (avg: number) => (
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{avg}</div>
                    <div className="text-xs text-gray-500">sobre 7.0</div>
                  </div>
                )
              },
              {
                key: 'approval',
                label: 'Tasa Aprobación',
                hiddenOnMobile: true,
                render: (rate: number) => `${rate}%`
              },
              {
                key: 'excellence',
                label: 'Excelencia',
                hiddenOnMobile: true,
                render: (exc: number) => `${exc}%`
              },
              {
                key: 'trend',
                label: 'Tendencia',
                render: (trend: string) => (
                  <div className={`flex items-center justify-center ${
                    trend.includes('+') ? 'text-green-600' : 
                    trend.includes('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trend.includes('+') ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : trend.includes('-') ? (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    ) : null}
                    <span className="text-sm font-medium">{trend}</span>
                  </div>
                )
              },
              {
                key: 'actions',
                label: 'Acciones',
                render: (_, row: any) => (
                  <div className="flex justify-center space-x-1">
                    <button
                      onClick={() => alert(`Ver detalles de ${row.name}`)}
                      className="icon-button-sm text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => alert(`Generar reporte de ${row.name}`)}
                      className="icon-button-sm text-green-600 hover:text-green-900"
                      title="Generar reporte"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
            data={schoolPerformance}
            keyExtractor={(row, index) => index.toString()}
            searchable={true}
            searchPlaceholder="Buscar colegio..."
            className="border-0 shadow-none"
          />
        </div>

        {/* Subject Comparison vs National Average */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Comparación por Asignatura vs Promedio Nacional
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
                    Promedio Nacional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diferencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clasificación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjectComparison.map((subject) => (
                  <tr key={subject.subject} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{subject.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-bold ${getPerformanceColor(subject.networkAverage)}`}>
                        {subject.networkAverage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{subject.nationalAverage}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        +{(subject.networkAverage - subject.nationalAverage).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(subject.rank)}`}>
                        {subject.rank}
                      </span>
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