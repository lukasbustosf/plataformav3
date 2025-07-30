'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  StarIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  SparklesIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface BloomLevel {
  level: string
  description: string
  icon: any
  color: string
  score: number
  maxScore: number
  activities: number
  lastUpdate: string
  trend: 'up' | 'down' | 'stable'
  recommendations: string[]
}

interface SubjectBloomData {
  subject: string
  teacher: string
  bloomLevels: BloomLevel[]
  overallProgress: number
  strengths: string[]
  areasToImprove: string[]
}

export default function GuardianBloomProgressPage() {
  const { user, fullName } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('semester')
  const [loading, setLoading] = useState(true)

  // Mock data for child's Bloom progress
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    overallBloomScore: 76,
    trend: 'up',
    lastAssessment: '2024-12-18'
  }

  const bloomLevels: BloomLevel[] = [
    {
      level: 'Recordar',
      description: 'Recordar información y conocimientos previamente aprendidos',
      icon: BookOpenIcon,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      score: 88,
      maxScore: 100,
      activities: 45,
      lastUpdate: '2024-12-18',
      trend: 'stable',
      recommendations: ['Continuar con ejercicios de memorización', 'Usar técnicas mnemotécnicas']
    },
    {
      level: 'Comprender',
      description: 'Demostrar comprensión de hechos e ideas organizando, comparando',
      icon: LightBulbIcon,
      color: 'bg-green-100 text-green-700 border-green-300',
      score: 82,
      maxScore: 100,
      activities: 38,
      lastUpdate: '2024-12-17',
      trend: 'up',
      recommendations: ['Explicar conceptos con sus propias palabras', 'Resumir lecturas']
    },
    {
      level: 'Aplicar',
      description: 'Usar información en situaciones nuevas para resolver problemas',
      icon: PuzzlePieceIcon,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      score: 75,
      maxScore: 100,
      activities: 32,
      lastUpdate: '2024-12-16',
      trend: 'up',
      recommendations: ['Resolver más problemas prácticos', 'Aplicar fórmulas en contextos reales']
    },
    {
      level: 'Analizar',
      description: 'Examinar y fragmentar información en partes para identificar motivos',
      icon: MagnifyingGlassIcon,
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      score: 68,
      maxScore: 100,
      activities: 24,
      lastUpdate: '2024-12-15',
      trend: 'up',
      recommendations: ['Comparar y contrastar información', 'Identificar relaciones causa-efecto']
    },
    {
      level: 'Evaluar',
      description: 'Presentar y defender opiniones emitiendo juicios sobre información',
      icon: ScaleIcon,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      score: 62,
      maxScore: 100,
      activities: 18,
      lastUpdate: '2024-12-14',
      trend: 'stable',
      recommendations: ['Practicar argumentación', 'Evaluar diferentes perspectivas']
    },
    {
      level: 'Crear',
      description: 'Compilar información de diferentes formas combinando elementos',
      icon: SparklesIcon,
      color: 'bg-pink-100 text-pink-700 border-pink-300',
      score: 58,
      maxScore: 100,
      activities: 12,
      lastUpdate: '2024-12-13',
      trend: 'up',
      recommendations: ['Proyectos creativos', 'Diseñar soluciones originales']
    }
  ]

  const subjectBloomData: SubjectBloomData[] = [
    {
      subject: 'Matemáticas',
      teacher: 'Prof. Carlos Pérez',
      bloomLevels: bloomLevels.map(level => ({
        ...level,
        score: level.level === 'Aplicar' ? 85 : level.level === 'Analizar' ? 78 : level.score
      })),
      overallProgress: 78,
      strengths: ['Resolución de problemas', 'Aplicación de fórmulas'],
      areasToImprove: ['Pensamiento crítico', 'Creatividad matemática']
    },
    {
      subject: 'Lenguaje',
      teacher: 'Prof. María González',
      bloomLevels: bloomLevels.map(level => ({
        ...level,
        score: level.level === 'Crear' ? 72 : level.level === 'Evaluar' ? 68 : level.score
      })),
      overallProgress: 74,
      strengths: ['Comprensión lectora', 'Expresión escrita'],
      areasToImprove: ['Análisis literario', 'Argumentación']
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />
    }
  }

  const getProgressWidth = (score: number, maxScore: number) => {
    return `${(score / maxScore) * 100}%`
  }

  const handleExportReport = async () => {
    toast.loading('Generando reporte Bloom...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Reporte Bloom descargado exitosamente')
    }, 2000)
  }

  const RadarChart = ({ data }: { data: BloomLevel[] }) => {
    const chartSize = 240
    const center = chartSize / 2
    const radius = center - 40
    
    const angleStep = (2 * Math.PI) / data.length
    
    const points = data.map((level, index) => {
      const angle = index * angleStep - Math.PI / 2
      const scoreRadius = (level.score / 100) * radius
      const x = center + scoreRadius * Math.cos(angle)
      const y = center + scoreRadius * Math.sin(angle)
      return { x, y, level }
    })
    
    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z'
    
    return (
      <div className="flex justify-center">
        <svg width={chartSize} height={chartSize} className="max-w-full h-auto">
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
            <circle
              key={scale}
              cx={center}
              cy={center}
              r={radius * scale}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {data.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2
            const x = center + radius * Math.cos(angle)
            const y = center + radius * Math.sin(angle)
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            )
          })}
          
          {/* Data area */}
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
            />
          ))}
          
          {/* Labels */}
          {data.map((level, index) => {
            const angle = index * angleStep - Math.PI / 2
            const labelRadius = radius + 25
            const x = center + labelRadius * Math.cos(angle)
            const y = center + labelRadius * Math.sin(angle)
            return (
              <text
                key={level.level}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {level.level}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-content">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid-responsive-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="card p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Radar Bloom Personal</h1>
            <p className="page-subtitle">
              Seguimiento cognitivo de {childInfo.name} según la Taxonomía de Bloom
            </p>
          </div>
          <Button
            onClick={handleExportReport}
            className="btn-secondary btn-responsive"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid-responsive-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso General</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.overallBloomScore}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nivel Más Fuerte</p>
                <p className="text-lg font-semibold text-gray-900">Recordar</p>
                <p className="text-sm text-gray-500">88%</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Área de Mejora</p>
                <p className="text-lg font-semibold text-gray-900">Crear</p>
                <p className="text-sm text-gray-500">58%</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tendencia</p>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-green-600">Mejorando</p>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Radar Bloom General</h3>
            <RadarChart data={bloomLevels} />
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución por Nivel</h3>
            <div className="space-y-4">
              {bloomLevels.map((level) => (
                <div key={level.level}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <level.icon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{level.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">{level.score}%</span>
                      {getTrendIcon(level.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: getProgressWidth(level.score, level.maxScore) }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Bloom Levels */}
        <div className="grid-responsive-2 gap-6 mb-8">
          {bloomLevels.map((level) => (
            <div key={level.level} className={`card border-2 ${level.color}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <level.icon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">{level.level}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{level.score}%</span>
                    {getTrendIcon(level.trend)}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{level.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Actividades:</span>
                    <span className="ml-2 text-gray-600">{level.activities}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Última actualización:</span>
                    <span className="ml-2 text-gray-600">{new Date(level.lastUpdate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-2">Recomendaciones:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {level.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subject Breakdown */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Progreso por Asignatura</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {subjectBloomData.map((subject) => (
                <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{subject.subject}</h4>
                      <p className="text-sm text-gray-600">{subject.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{subject.overallProgress}%</p>
                      <p className="text-sm text-gray-500">Progreso general</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-green-700 mb-2">Fortalezas:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-green-600">
                        {subject.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700 mb-2">Áreas de mejora:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-600">
                        {subject.areasToImprove.map((area, index) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
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