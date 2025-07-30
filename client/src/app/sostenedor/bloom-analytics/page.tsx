'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon,
  EyeIcon,
  AcademicCapIcon,
  BookOpenIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  BeakerIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  DocumentChartBarIcon,
  FunnelIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

// Enhanced Bloom level configuration with better visuals
  const bloomLevels = [
    {
      level: 'recordar',
      name: 'Recordar',
      icon: BookOpenIcon,
      color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    description: 'Reconocimiento y recuerdo de información específica'
    },
    {
      level: 'comprender',
      name: 'Comprender',
      icon: LightBulbIcon,
      color: 'green',
    gradient: 'from-green-500 to-green-600',
    description: 'Interpretación y explicación de ideas y conceptos'
    },
    {
      level: 'aplicar',
      name: 'Aplicar',
      icon: PuzzlePieceIcon,
      color: 'yellow',
    gradient: 'from-yellow-500 to-yellow-600',
    description: 'Uso de información en nuevas situaciones'
    },
    {
      level: 'analizar',
      name: 'Analizar',
      icon: BeakerIcon,
      color: 'purple',
    gradient: 'from-purple-500 to-purple-600',
    description: 'Descomposición en partes y relaciones'
    },
    {
      level: 'evaluar',
      name: 'Evaluar',
    icon: EyeIcon, 
      color: 'orange',
    gradient: 'from-orange-500 to-orange-600',
    description: 'Emisión de juicios basados en criterios'
    },
    {
      level: 'crear',
      name: 'Crear',
      icon: SparklesIcon,
      color: 'red',
    gradient: 'from-red-500 to-red-600',
    description: 'Combinación de elementos para formar algo nuevo'
  }
]

export default function SostenedorBloomAnalytics() {
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparative'>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [animateCharts, setAnimateCharts] = useState(false)

  useEffect(() => {
    // Trigger chart animations on mount
    const timer = setTimeout(() => setAnimateCharts(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Enhanced network-wide Bloom coverage data with trends
  const networkBloomData = {
    recordar: { coverage: 94.2, improvement: 2.1, target: 95.0, status: 'good', trend: [89.1, 91.3, 92.8, 94.2], students: 2845 },
    comprender: { coverage: 89.7, improvement: 1.8, target: 90.0, status: 'good', trend: [85.2, 87.1, 88.9, 89.7], students: 2698 },
    aplicar: { coverage: 84.3, improvement: 3.2, target: 85.0, status: 'good', trend: [78.9, 81.1, 82.8, 84.3], students: 2532 },
    analizar: { coverage: 76.8, improvement: 4.1, target: 80.0, status: 'warning', trend: [70.2, 73.1, 75.9, 76.8], students: 2301 },
    evaluar: { coverage: 69.2, improvement: 2.9, target: 75.0, status: 'warning', trend: [64.8, 66.9, 68.1, 69.2], students: 2076 },
    crear: { coverage: 62.4, improvement: 1.5, target: 70.0, status: 'critical', trend: [58.1, 59.8, 61.2, 62.4], students: 1872 }
  }

  // Enhanced school comparison data
  const schoolComparison = [
    {
      id: 1,
      school: 'Colegio San Patricio',
      region: 'Metropolitana',
      overallScore: 87.3,
      bloomScores: {
        recordar: 96.2, comprender: 92.1, aplicar: 88.7,
        analizar: 82.4, evaluar: 76.8, crear: 68.2
      },
      trend: 'up',
      improvement: 3.2,
      studentsAssessed: 850,
      topSubject: 'Matemáticas',
      challengeArea: 'Crear',
      performanceIndex: 92.5
    },
    {
      id: 2,
      school: 'Instituto Los Andes',
      region: 'Valparaíso',
      overallScore: 84.6,
      bloomScores: {
        recordar: 94.8, comprender: 90.2, aplicar: 86.1,
        analizar: 79.3, evaluar: 72.4, crear: 65.8
      },
      trend: 'up',
      improvement: 2.8,
      studentsAssessed: 720,
      topSubject: 'Ciencias',
      challengeArea: 'Evaluar',
      performanceIndex: 89.1
    },
    {
      id: 3,
      school: 'Escuela Nueva Esperanza',
      region: 'Biobío',
      overallScore: 81.2,
      bloomScores: {
        recordar: 91.5, comprender: 87.8, aplicar: 82.9,
        analizar: 75.1, evaluar: 68.3, crear: 61.6
      },
      trend: 'stable',
      improvement: 1.2,
      studentsAssessed: 650,
      topSubject: 'Lenguaje',
      challengeArea: 'Crear',
      performanceIndex: 85.7
    }
  ]

  // Enhanced grade level analysis
  const gradeLevelAnalysis = [
    { grade: '1° Básico', recordar: 96.5, comprender: 91.2, aplicar: 78.9, analizar: 65.4, evaluar: 58.2, crear: 52.1, totalStudents: 320 },
    { grade: '2° Básico', recordar: 95.8, comprender: 89.7, aplicar: 81.3, analizar: 68.9, evaluar: 61.5, crear: 55.3, totalStudents: 315 },
    { grade: '3° Básico', recordar: 94.9, comprender: 88.4, aplicar: 83.7, analizar: 71.2, evaluar: 64.8, crear: 58.6, totalStudents: 298 },
    { grade: '4° Básico', recordar: 93.2, comprender: 86.9, aplicar: 85.1, analizar: 74.6, evaluar: 67.9, crear: 61.4, totalStudents: 285 },
    { grade: '5° Básico', recordar: 91.7, comprender: 85.3, aplicar: 86.8, analizar: 77.8, evaluar: 70.2, crear: 64.7, totalStudents: 278 },
    { grade: '6° Básico', recordar: 90.4, comprender: 83.7, aplicar: 88.2, analizar: 80.1, evaluar: 72.6, crear: 67.9, totalStudents: 267 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'  
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelColor = (level: string) => {
    const bloom = bloomLevels.find(b => b.level === level)
    return bloom ? bloom.color : 'gray'
  }

  const BloomCard = ({ bloom, data, index }: { bloom: any, data: any, index: number }) => {
    const IconComponent = bloom.icon
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bloom.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{bloom.name}</h3>
              <p className="text-xs text-gray-500">Meta: {data.target}%</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(data.status)}`}>
              {data.status === 'good' ? '✓ Bueno' :
               data.status === 'warning' ? '⚠ Atención' : '⚡ Crítico'}
            </span>
          </div>
        </div>
        
        {/* Progress with animation */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {animateCharts ? data.coverage.toFixed(1) : '0.0'}%
            </span>
            <div className="flex items-center space-x-1">
              {data.improvement > 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${data.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.improvement > 0 ? '+' : ''}{data.improvement.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className={`h-3 rounded-full bg-gradient-to-r ${bloom.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: animateCharts ? `${data.coverage}%` : '0%' }}
              transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
        
        {/* Mini trend chart */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Tendencia (4 meses)</span>
            <span>{data.students} estudiantes</span>
          </div>
          <div className="flex items-end space-x-1 h-8">
            {data.trend.map((value: number, i: number) => (
              <motion.div
                key={i}
                className={`flex-1 bg-gradient-to-t ${bloom.gradient} rounded-sm opacity-60`}
                initial={{ height: 0 }}
                animate={{ height: animateCharts ? `${(value / 100) * 32}px` : '0px' }}
                transition={{ duration: 1, delay: (index * 0.1) + (i * 0.1) }}
              />
            ))}
          </div>
        </div>
        
        <p className="text-xs text-gray-600">{bloom.description}</p>
      </motion.div>
    )
  }

  const InteractiveChart = ({ title, data, type = 'bar' }: { title: string, data: any[], type?: 'bar' | 'line' | 'pie' }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {type === 'bar' && (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-24 text-sm text-gray-600 truncate">{item.label}</div>
              <div className="flex-1 mx-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: animateCharts ? `${item.value}%` : '0%' }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
              <div className="w-12 text-sm font-medium text-gray-900 text-right">
                {item.value.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Analíticas Bloom/OA 🎯
            </h1>
            <p className="text-gray-600 mt-2">
              Análisis detallado del desarrollo de habilidades cognitivas según taxonomía de Bloom
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
            <Button
              variant="outline"
              onClick={() => {/* Export analytics */}}
              className="action-buttons-center"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              variant="outline"
              onClick={() => {/* Generate report */}}
            >
              <DocumentChartBarIcon className="h-4 w-4 mr-2" />
              Reporte
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow rounded-xl p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                Escuela
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las escuelas</option>
                <option value="1">Colegio San Patricio</option>
                <option value="2">Instituto Los Andes</option>
                <option value="3">Escuela Nueva Esperanza</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserGroupIcon className="h-4 w-4 inline mr-1" />
                Nivel
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los niveles</option>
                <option value="basica">Educación Básica</option>
                <option value="media">Educación Media</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ChartPieIcon className="h-4 w-4 inline mr-1" />
                Vista
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overview">Resumen</option>
                <option value="detailed">Detallado</option>
                <option value="comparative">Comparativo</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Bloom Coverage Cards */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              Cobertura Bloom - Red Educativa
            </h2>
            <div className="text-sm text-gray-500">
              {Object.values(networkBloomData).reduce((sum, level) => sum + level.students, 0).toLocaleString()} estudiantes evaluados
        </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bloomLevels.map((bloom, index) => {
                const data = networkBloomData[bloom.level as keyof typeof networkBloomData]
                return (
                <BloomCard key={bloom.level} bloom={bloom} data={data} index={index} />
              )
            })}
          </div>
        </div>

        {/* Enhanced School Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow rounded-xl"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Comparación por Escuela</h2>
              <Button variant="outline" size="sm">
                <EyeIcon className="h-4 w-4 mr-2" />
                Ver todos
                      </Button>
            </div>
          </div>

            <div className="p-6">
            <ResponsiveTable
              columns={[
                {
                  key: 'school',
                  label: 'Escuela',
                  render: (value: string, row: any) => (
                    <div>
                      <div className="font-medium text-gray-900">{value}</div>
                      <div className="text-sm text-gray-500">{row.region}</div>
                        </div>
                  )
                },
                {
                  key: 'overallScore',
                  label: 'Puntaje General',
                  render: (value: number) => (
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">{value}%</span>
                    </div>
                  )
                },
                {
                  key: 'improvement',
                  label: 'Mejora',
                  render: (value: number, row: any) => (
                    <div className="flex items-center space-x-1">
                      {row.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`font-medium ${value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {value > 0 ? '+' : ''}{value}%
                          </span>
                    </div>
                  )
                },
                {
                  key: 'studentsAssessed',
                  label: 'Estudiantes',
                  hiddenOnMobile: true,
                  render: (value: number) => value.toLocaleString()
                },
                {
                  key: 'challengeArea',
                  label: 'Área de Mejora',
                  hiddenOnMobile: true,
                  render: (value: string) => (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {value}
                    </span>
                  )
                }
              ]}
              data={schoolComparison}
            />
          </div>
        </motion.div>

        {/* Enhanced Grade Level Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white shadow rounded-xl"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Análisis por Nivel de Grado</h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <ResponsiveTable
                columns={[
                  { key: 'grade', label: 'Nivel' },
                  ...bloomLevels.map(bloom => ({
                    key: bloom.level,
                    label: bloom.name,
                    hiddenOnMobile: bloom.level === 'evaluar' || bloom.level === 'crear',
                    render: (value: number) => (
                      <div className="text-center">
                        <span className="font-medium">{value.toFixed(1)}%</span>
                      </div>
                    )
                  }))
                ]}
                data={gradeLevelAnalysis}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 