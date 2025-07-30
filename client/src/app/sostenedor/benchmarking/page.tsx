'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  ChartBarIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BanknotesIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PresentationChartBarIcon,
  ScaleIcon,
  GlobeAltIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function SostenedorBenchmarking() {
  const { user } = useAuth()
  const [selectedMetric, setSelectedMetric] = useState('academic')
  const [selectedComparison, setSelectedComparison] = useState('internal')
  const [selectedPeriod, setSelectedPeriod] = useState('year')

  // Benchmarking metrics categories
  const metricCategories = [
    { id: 'academic', name: 'Académico', icon: AcademicCapIcon, color: 'blue' },
    { id: 'financial', name: 'Financiero', icon: BanknotesIcon, color: 'green' },
    { id: 'operational', name: 'Operacional', icon: BuildingOfficeIcon, color: 'purple' },
    { id: 'student', name: 'Estudiantes', icon: UsersIcon, color: 'orange' },
    { id: 'teacher', name: 'Docentes', icon: StarIcon, color: 'pink' }
  ]

  // Internal school comparison data
  const internalComparison = [
    {
      school: 'Colegio San Patricio',
      region: 'Metropolitana',
      students: 850,
      academicScore: 94.2,
      financialHealth: 92.8,
      operationalEfficiency: 89.5,
      studentSatisfaction: 91.3,
      teacherRetention: 94.7,
      rank: 1,
      trend: 'up',
      improvement: 3.2,
      strengths: ['Rendimiento académico', 'Satisfacción estudiantil'],
      weaknesses: ['Eficiencia operacional']
    },
    {
      school: 'Instituto Los Andes',
      region: 'Valparaíso',
      students: 720,
      academicScore: 91.8,
      financialHealth: 88.4,
      operationalEfficiency: 91.2,
      studentSatisfaction: 89.7,
      teacherRetention: 92.1,
      rank: 2,
      trend: 'up',
      improvement: 2.8,
      strengths: ['Eficiencia operacional', 'Retención docente'],
      weaknesses: ['Salud financiera']
    },
    {
      school: 'Escuela Nueva Esperanza',
      region: 'Biobío',
      students: 650,
      academicScore: 88.4,
      financialHealth: 85.9,
      operationalEfficiency: 87.3,
      studentSatisfaction: 86.8,
      teacherRetention: 89.4,
      rank: 3,
      trend: 'stable',
      improvement: 1.2,
      strengths: ['Crecimiento sostenido'],
      weaknesses: ['Rendimiento académico', 'Satisfacción estudiantil']
    },
    {
      school: 'Colegio del Norte',
      region: 'Antofagasta',
      students: 580,
      academicScore: 85.7,
      financialHealth: 82.3,
      operationalEfficiency: 84.1,
      studentSatisfaction: 84.2,
      teacherRetention: 86.8,
      rank: 4,
      trend: 'down',
      improvement: -0.8,
      strengths: ['Potencial de crecimiento'],
      weaknesses: ['Todos los indicadores por debajo del promedio']
    }
  ]

  // External benchmarking data (vs industry)
  const externalBenchmarks = {
    academic: {
      networkAverage: 90.0,
      industryAverage: 82.5,
      topPerformer: 96.8,
      percentile: 85,
      ranking: '15/120',
      improvement: '+5.2%'
    },
    financial: {
      networkAverage: 87.4,
      industryAverage: 78.9,
      topPerformer: 94.2,
      percentile: 78,
      ranking: '28/120',
      improvement: '+3.8%'
    },
    operational: {
      networkAverage: 88.0,
      industryAverage: 81.2,
      topPerformer: 95.1,
      percentile: 72,
      ranking: '34/120',
      improvement: '+2.1%'
    },
    student: {
      networkAverage: 88.0,
      industryAverage: 79.8,
      topPerformer: 93.7,
      percentile: 80,
      ranking: '24/120',
      improvement: '+4.3%'
    },
    teacher: {
      networkAverage: 90.8,
      industryAverage: 84.3,
      topPerformer: 97.2,
      percentile: 88,
      ranking: '12/120',
      improvement: '+6.1%'
    }
  }

  // Regional comparison
  const regionalComparison = [
    {
      region: 'Metropolitana',
      schools: 1,
      avgScore: 94.2,
      regionalAvg: 85.4,
      nationalRank: 8,
      performance: 'excellent'
    },
    {
      region: 'Valparaíso',
      schools: 1,
      avgScore: 91.8,
      regionalAvg: 83.1,
      nationalRank: 15,
      performance: 'excellent'
    },
    {
      region: 'Biobío',
      schools: 1,
      avgScore: 88.4,
      regionalAvg: 81.7,
      nationalRank: 28,
      performance: 'good'
    },
    {
      region: 'Antofagasta',
      schools: 1,
      avgScore: 85.7,
      regionalAvg: 79.2,
      nationalRank: 45,
      performance: 'average'
    }
  ]

  // Key Performance Indicators comparison
  const kpiComparison = [
    {
      metric: 'Promedio SIMCE',
      network: 315,
      industry: 289,
      target: 325,
      unit: 'puntos',
      trend: 'up',
      change: '+8'
    },
    {
      metric: 'Tasa de Graduación',
      network: 96.8,
      industry: 91.2,
      target: 98.0,
      unit: '%',
      trend: 'up',
      change: '+2.1'
    },
    {
      metric: 'Ingreso a Universidad',
      network: 89.4,
      industry: 78.6,
      target: 92.0,
      unit: '%',
      trend: 'up',
      change: '+3.8'
    },
    {
      metric: 'Retención Estudiantil',
      network: 94.2,
      industry: 88.7,
      target: 96.0,
      unit: '%',
      trend: 'stable',
      change: '+0.5'
    },
    {
      metric: 'Satisfacción Familias',
      network: 88.9,
      industry: 82.1,
      target: 92.0,
      unit: '%',
      trend: 'up',
      change: '+4.2'
    },
    {
      metric: 'Costo por Estudiante',
      network: 337278,
      industry: 385420,
      target: 320000,
      unit: 'CLP',
      trend: 'down',
      change: '-12.5'
    }
  ]

  // Best practices recommendations
  const bestPractices = [
    {
      id: 1,
      category: 'Academic Excellence',
      title: 'Implementación de Metodologías Activas',
      description: 'Adoptar aprendizaje basado en proyectos y metodologías STEAM',
      impact: 'Mejora del 8-15% en rendimiento académico',
      difficulty: 'Medium',
      timeline: '6-12 meses',
      schools: ['Top 10% nacional'],
      cost: 'Medio'
    },
    {
      id: 2,
      category: 'Financial Optimization',
      title: 'Optimización de Recursos Tecnológicos',
      description: 'Consolidación de licencias y automatización de procesos',
      impact: 'Reducción de costos del 15-20%',
      difficulty: 'Low',
      timeline: '3-6 meses',
      schools: ['Líderes en eficiencia'],
      cost: 'Bajo'
    },
    {
      id: 3,
      category: 'Operational Excellence',
      title: 'Sistema de Gestión Integral',
      description: 'Implementación de ERP educativo integrado',
      impact: 'Mejora del 25% en eficiencia operacional',
      difficulty: 'High',
      timeline: '12-18 meses',
      schools: ['Top 5% operacional'],
      cost: 'Alto'
    }
  ]

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'average': return 'bg-yellow-100 text-yellow-800'
      case 'below': return 'bg-red-100 text-red-800'
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Benchmarking Estratégico 📈</h1>
            <p className="text-gray-600 mt-1">
              Compara el rendimiento de la red educativa con estándares internos y de la industria
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export benchmarking report */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar Análisis
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* Generate detailed report */}}
            >
              <PresentationChartBarIcon className="h-4 w-4 mr-2" />
              Reporte Detallado
            </Button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Métrica Principal
              </label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="input"
              >
                {metricCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Comparación
              </label>
              <select
                value={selectedComparison}
                onChange={(e) => setSelectedComparison(e.target.value)}
                className="input"
              >
                <option value="internal">Comparación Interna</option>
                <option value="external">vs Industria</option>
                <option value="regional">vs Regional</option>
                <option value="national">vs Nacional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                <option value="quarter">Último trimestre</option>
                <option value="semester">Semestre</option>
                <option value="year">Año académico</option>
                <option value="historical">Histórico (3 años)</option>
              </select>
            </div>
          </div>
        </div>

        {/* External Benchmarking Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Posicionamiento vs Industria</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {metricCategories.map((category) => {
                const data = externalBenchmarks[category.id as keyof typeof externalBenchmarks]
                const IconComponent = category.icon
                
                return (
                  <div key={category.id} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      category.color === 'blue' ? 'bg-blue-100' :
                      category.color === 'green' ? 'bg-green-100' :
                      category.color === 'purple' ? 'bg-purple-100' :
                      category.color === 'orange' ? 'bg-orange-100' :
                      'bg-pink-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        category.color === 'blue' ? 'text-blue-600' :
                        category.color === 'green' ? 'text-green-600' :
                        category.color === 'purple' ? 'text-purple-600' :
                        category.color === 'orange' ? 'text-orange-600' :
                        'text-pink-600'
                      }`} />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{category.name}</h3>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{data.percentile}°</div>
                      <div className="text-sm text-gray-600">percentil</div>
                      <div className="text-sm font-medium text-green-600">{data.improvement}</div>
                      <div className="text-xs text-gray-500">Ranking: {data.ranking}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Internal School Comparison */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Comparación entre Colegios</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ranking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colegio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Académico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Financiero
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operacional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Docentes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {internalComparison.map((school) => (
                  <tr key={school.school} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          school.rank === 1 ? 'bg-yellow-500' :
                          school.rank === 2 ? 'bg-gray-400' :
                          school.rank === 3 ? 'bg-orange-600' : 'bg-gray-300'
                        }`}>
                          {school.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{school.school}</div>
                          <div className="text-sm text-gray-500">{school.region} • {school.students} estudiantes</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${school.academicScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{school.academicScore.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${school.financialHealth}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{school.financialHealth.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${school.operationalEfficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{school.operationalEfficiency.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${school.studentSatisfaction}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{school.studentSatisfaction.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-pink-600 h-2 rounded-full"
                            style={{ width: `${school.teacherRetention}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{school.teacherRetention.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(school.trend)}
                        <span className={`ml-1 text-sm ${
                          school.improvement > 0 ? 'text-green-600' : 
                          school.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {school.improvement > 0 ? '+' : ''}{school.improvement.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* View detailed analysis */}}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KPI Comparison and Best Practices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Comparison */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">KPIs vs Industria</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {kpiComparison.map((kpi, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{kpi.metric}</h3>
                      <div className="flex items-center">
                        {getTrendIcon(kpi.trend)}
                        <span className={`ml-1 text-sm ${
                          kpi.change.startsWith('+') ? 'text-green-600' : 
                          kpi.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Nuestra Red</div>
                        <div className="font-bold text-blue-600">
                          {kpi.unit === 'CLP' ? formatCurrency(kpi.network) : `${kpi.network}${kpi.unit === '%' ? '%' : kpi.unit === 'puntos' ? '' : kpi.unit}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Industria</div>
                        <div className="font-medium text-gray-900">
                          {kpi.unit === 'CLP' ? formatCurrency(kpi.industry) : `${kpi.industry}${kpi.unit === '%' ? '%' : kpi.unit === 'puntos' ? '' : kpi.unit}`}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Meta</div>
                        <div className="font-medium text-green-600">
                          {kpi.unit === 'CLP' ? formatCurrency(kpi.target) : `${kpi.target}${kpi.unit === '%' ? '%' : kpi.unit === 'puntos' ? '' : kpi.unit}`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            kpi.network >= kpi.target ? 'bg-green-500' :
                            kpi.network >= kpi.industry ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (kpi.network / Math.max(kpi.target, kpi.industry, kpi.network)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mejores Prácticas</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {bestPractices.map((practice) => (
                  <div key={practice.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{practice.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(practice.difficulty)}`}>
                            {practice.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{practice.description}</p>
                        <div className="text-sm text-green-700 font-medium mb-2">{practice.impact}</div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div>Tiempo: {practice.timeline}</div>
                          <div>Costo: {practice.cost}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Referencia: {practice.schools.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {practice.category}
                      </span>
                      <Button size="sm" variant="outline">
                        Implementar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Regional Comparison */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Posicionamiento Regional</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regionalComparison.map((region, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="font-medium text-gray-900">{region.region}</h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(region.performance)}`}>
                      {region.performance}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nuestro Promedio</span>
                      <span className="text-sm font-bold text-blue-600">{region.avgScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Promedio Regional</span>
                      <span className="text-sm text-gray-900">{region.regionalAvg.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ranking Nacional</span>
                      <span className="text-sm font-medium text-green-600">#{region.nationalRank}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(region.avgScore / 100) * 100}%` }}
                      ></div>
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