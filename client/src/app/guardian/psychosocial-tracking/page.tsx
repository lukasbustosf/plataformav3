'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  HeartIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PsychosocialRecord {
  date: string
  socialSkills: number
  emotionalRegulation: number
  selfEsteem: number
  peerRelationships: number
  familyRelationships: number
  academicMotivation: number
  behavioralAdaptation: number
  overallWellbeing: number
  observations: string
  reportedBy: string
  interventions?: string[]
}

interface DevelopmentMilestone {
  id: string
  category: 'social' | 'emotional' | 'behavioral'
  title: string
  description: string
  targetAge: string
  status: 'achieved' | 'in_progress' | 'delayed' | 'concern'
  achievedDate?: string
  notes?: string
}

export default function GuardianPsychosocialTrackingPage() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('semester')
  const [loading, setLoading] = useState(true)

  // Mock data for child info
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    age: 12,
    currentLevel: 'Desarrollo Normal',
    riskFactors: ['Ansiedad social leve'],
    protectiveFactors: ['Apoyo familiar fuerte', 'Intereses académicos', 'Creatividad']
  }

  const psychosocialData: PsychosocialRecord[] = [
    {
      date: '2024-12-18',
      socialSkills: 75,
      emotionalRegulation: 70,
      selfEsteem: 65,
      peerRelationships: 70,
      familyRelationships: 85,
      academicMotivation: 80,
      behavioralAdaptation: 75,
      overallWellbeing: 74,
      observations: 'Mejora en habilidades sociales después de intervenciones grupales. Mantiene buena relación familiar.',
      reportedBy: 'Psic. Ana López',
      interventions: ['Taller habilidades sociales', 'Técnicas de relajación']
    },
    {
      date: '2024-11-18',
      socialSkills: 68,
      emotionalRegulation: 65,
      selfEsteem: 60,
      peerRelationships: 65,
      familyRelationships: 88,
      academicMotivation: 75,
      behavioralAdaptation: 70,
      overallWellbeing: 70,
      observations: 'Episodios de ansiedad antes de evaluaciones. Trabajo en autoestima y manejo emocional.',
      reportedBy: 'Psic. Ana López',
      interventions: ['Técnicas de manejo de ansiedad', 'Refuerzo positivo']
    },
    {
      date: '2024-10-18',
      socialSkills: 65,
      emotionalRegulation: 60,
      selfEsteem: 55,
      peerRelationships: 60,
      familyRelationships: 85,
      academicMotivation: 78,
      behavioralAdaptation: 68,
      overallWellbeing: 67,
      observations: 'Dificultades iniciales en integración grupal. Plan de apoyo socioemocional iniciado.',
      reportedBy: 'T.S. María Torres',
      interventions: ['Evaluación inicial', 'Plan de apoyo']
    }
  ]

  const developmentMilestones: DevelopmentMilestone[] = [
    {
      id: 'mil-001',
      category: 'social',
      title: 'Participación en actividades grupales',
      description: 'Capacidad de integrarse y colaborar efectivamente en actividades de grupo',
      targetAge: '12-13 años',
      status: 'in_progress',
      notes: 'Mejorando gradualmente con apoyo'
    },
    {
      id: 'mil-002',
      category: 'emotional',
      title: 'Regulación emocional ante estrés',
      description: 'Habilidad para manejar emociones intensas de forma apropiada',
      targetAge: '12-14 años',
      status: 'in_progress',
      notes: 'Aplicando técnicas aprendidas'
    },
    {
      id: 'mil-003',
      category: 'social',
      title: 'Comunicación asertiva',
      description: 'Expresar necesidades y opiniones de manera clara y respetuosa',
      targetAge: '11-13 años',
      status: 'achieved',
      achievedDate: '2024-11-15',
      notes: 'Logrado en contexto familiar y parcialmente escolar'
    },
    {
      id: 'mil-004',
      category: 'behavioral',
      title: 'Autorregulación académica',
      description: 'Gestión independiente de tareas y responsabilidades escolares',
      targetAge: '12-14 años',
      status: 'achieved',
      achievedDate: '2024-10-20',
      notes: 'Excelente organización y planificación'
    },
    {
      id: 'mil-005',
      category: 'emotional',
      title: 'Autoestima positiva estable',
      description: 'Mantener una valoración personal positiva ante desafíos',
      targetAge: '12-15 años',
      status: 'in_progress',
      notes: 'Trabajando en fortalecimiento continuo'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-green-700 bg-green-100'
      case 'in_progress': return 'text-blue-700 bg-blue-100'
      case 'delayed': return 'text-yellow-700 bg-yellow-100'
      case 'concern': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return <UserGroupIcon className="h-5 w-5 text-blue-600" />
      case 'emotional': return <HeartIcon className="h-5 w-5 text-red-600" />
      case 'behavioral': return <ChartBarIcon className="h-5 w-5 text-green-600" />
      default: return <UserIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const calculateTrend = (current: number, previous: number) => {
    const diff = current - previous
    if (diff > 5) return 'up'
    if (diff < -5) return 'down'
    return 'stable'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4 rounded-full bg-gray-400" />
    }
  }

  const handleExportReport = () => {
    toast.success('Generando reporte de desarrollo psicosocial...')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const latestRecord = psychosocialData[0]
  const previousRecord = psychosocialData[1]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seguimiento Psicosocial</h1>
              <p className="text-gray-600 mt-2">
                Desarrollo socioemocional y bienestar de {childInfo.name}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                onClick={handleExportReport}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Current Status Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado Actual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Nivel de Desarrollo</p>
                  <p className="text-lg font-semibold text-blue-900">{childInfo.currentLevel}</p>
                </div>
                <HeartIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Bienestar General</p>
                  <p className="text-lg font-semibold text-green-900">{latestRecord.overallWellbeing}%</p>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(calculateTrend(latestRecord.overallWellbeing, previousRecord.overallWellbeing))}
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Última Evaluación</p>
                  <p className="text-lg font-semibold text-purple-900">
                    {new Date(latestRecord.date).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <CalendarIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Risk and Protective Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
              Factores de Riesgo
            </h3>
            <div className="space-y-3">
              {childInfo.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-800">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-green-600" />
              Factores Protectores
            </h3>
            <div className="space-y-3">
              {childInfo.protectiveFactors.map((factor, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Psychosocial Metrics */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Métricas de Desarrollo</h2>
            <p className="text-gray-600 mt-1">Evaluación más reciente: {new Date(latestRecord.date).toLocaleDateString('es-CL')}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { key: 'socialSkills', label: 'Habilidades Sociales', value: latestRecord.socialSkills },
                { key: 'emotionalRegulation', label: 'Regulación Emocional', value: latestRecord.emotionalRegulation },
                { key: 'selfEsteem', label: 'Autoestima', value: latestRecord.selfEsteem },
                { key: 'peerRelationships', label: 'Relaciones con Pares', value: latestRecord.peerRelationships },
                { key: 'familyRelationships', label: 'Relaciones Familiares', value: latestRecord.familyRelationships },
                { key: 'academicMotivation', label: 'Motivación Académica', value: latestRecord.academicMotivation },
                { key: 'behavioralAdaptation', label: 'Adaptación Conductual', value: latestRecord.behavioralAdaptation },
                { key: 'overallWellbeing', label: 'Bienestar General', value: latestRecord.overallWellbeing }
              ].map((metric) => {
                const previousValue = previousRecord[metric.key as keyof PsychosocialRecord] as number
                const trend = calculateTrend(metric.value, previousValue)
                
                return (
                  <div key={metric.key} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                      {getTrendIcon(trend)}
                    </div>
                    <div className={`text-2xl font-bold rounded-lg py-2 px-3 ${getScoreColor(metric.value)}`}>
                      {metric.value}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {trend === 'up' ? `+${metric.value - previousValue}` : 
                       trend === 'down' ? `${metric.value - previousValue}` : 'Sin cambios'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Development Milestones */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Hitos de Desarrollo</h2>
            <p className="text-gray-600 mt-1">Progreso en habilidades esperadas para la edad</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {developmentMilestones.map((milestone) => (
                <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(milestone.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{milestone.description}</p>
                          <p className="text-gray-500 text-xs mt-2">Edad objetivo: {milestone.targetAge}</p>
                          {milestone.notes && (
                            <p className="text-gray-700 text-sm mt-2 italic">{milestone.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(milestone.status)}`}>
                            {milestone.status === 'achieved' ? 'Logrado' :
                             milestone.status === 'in_progress' ? 'En Progreso' :
                             milestone.status === 'delayed' ? 'Retrasado' : 'Preocupante'}
                          </span>
                          {milestone.achievedDate && (
                            <span className="text-xs text-gray-500">
                              {new Date(milestone.achievedDate).toLocaleDateString('es-CL')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Observations */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Observaciones Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {psychosocialData.slice(0, 3).map((record, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(record.date).toLocaleDateString('es-CL')}</span>
                      <span>•</span>
                      <UserIcon className="h-4 w-4" />
                      <span>{record.reportedBy}</span>
                    </div>
                  </div>
                  <p className="text-gray-900 mb-3">{record.observations}</p>
                  {record.interventions && record.interventions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {record.interventions.map((intervention, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {intervention}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 