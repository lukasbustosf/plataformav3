'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  HeartIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface EmotionalRecord {
  date: string
  mood: 'happy' | 'neutral' | 'sad' | 'angry' | 'anxious'
  score: number
  notes: string
  reportedBy: 'teacher' | 'self' | 'counselor' | 'observer'
  interventions?: string[]
}

interface PsychosocialAlert {
  id: string
  type: 'behavioral' | 'emotional' | 'social' | 'academic_impact'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  dateDetected: string
  status: 'active' | 'monitoring' | 'resolved'
  recommendedActions: string[]
  assignedProfessional?: string
}

export default function GuardianEmotionalDashboard() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [loading, setLoading] = useState(true)

  // Mock data for child's emotional tracking
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    currentMood: 'happy',
    overallWellness: 78,
    trend: 'improving',
    lastAssessment: '2024-12-18',
    riskLevel: 'low'
  }

  const emotionalRecords: EmotionalRecord[] = [
    {
      date: '2024-12-19',
      mood: 'happy',
      score: 85,
      notes: 'Participativa y alegre durante las clases. Buena interacción con compañeros.',
      reportedBy: 'teacher',
      interventions: []
    },
    {
      date: '2024-12-18',
      mood: 'neutral',
      score: 70,
      notes: 'Estado normal, algo pensativa durante el recreo.',
      reportedBy: 'observer',
      interventions: []
    },
    {
      date: '2024-12-17',
      mood: 'sad',
      score: 45,
      notes: 'Se mostró triste después de una discusión con una compañera. Se aplicó protocolo de contención.',
      reportedBy: 'counselor',
      interventions: ['Conversación individual', 'Mediación entre pares']
    },
    {
      date: '2024-12-16',
      mood: 'happy',
      score: 82,
      notes: 'Muy contenta con calificación en proyecto de ciencias.',
      reportedBy: 'teacher',
      interventions: []
    },
    {
      date: '2024-12-15',
      mood: 'anxious',
      score: 55,
      notes: 'Ansiedad antes de presentación oral. Se aplicaron técnicas de relajación.',
      reportedBy: 'counselor',
      interventions: ['Técnicas de respiración', 'Preparación adicional']
    }
  ]

  const psychosocialAlerts: PsychosocialAlert[] = [
    {
      id: 'PSY-001',
      type: 'social',
      severity: 'medium',
      title: 'Conflicto interpersonal recurrente',
      description: 'Se han observado tensiones repetidas con un grupo específico de compañeras durante los recreos.',
      dateDetected: '2024-12-17',
      status: 'monitoring',
      recommendedActions: [
        'Mediación grupal programada',
        'Seguimiento semanal de dinámicas sociales',
        'Talleres de habilidades sociales'
      ],
      assignedProfessional: 'Psic. Ana López'
    },
    {
      id: 'PSY-002',
      type: 'emotional',
      severity: 'low',
      title: 'Episodios de ansiedad ante evaluaciones',
      description: 'Presenta síntomas leves de ansiedad antes de exámenes y presentaciones orales.',
      dateDetected: '2024-12-15',
      status: 'active',
      recommendedActions: [
        'Técnicas de manejo de ansiedad',
        'Preparación gradual para presentaciones',
        'Coordinación con profesores para apoyo adicional'
      ],
      assignedProfessional: 'Psic. Ana López'
    }
  ]

  const interventionHistory = [
    {
      date: '2024-12-17',
      type: 'Mediación de conflictos',
      professional: 'Psic. Ana López',
      duration: '45 min',
      outcome: 'Positivo',
      nextSession: '2024-12-24',
      notes: 'Buena disposición para resolver diferencias. Se establecieron acuerdos de convivencia.'
    },
    {
      date: '2024-12-15',
      type: 'Técnicas de relajación',
      professional: 'Psic. Ana López',
      duration: '30 min',
      outcome: 'Muy positivo',
      nextSession: '2024-12-22',
      notes: 'Aprendió ejercicios de respiración. Los aplicó exitosamente en examen posterior.'
    },
    {
      date: '2024-12-10',
      type: 'Evaluación integral',
      professional: 'Equipo Bienestar',
      duration: '60 min',
      outcome: 'Completo',
      nextSession: '2025-01-15',
      notes: 'Evaluación semestral. Resultados dentro de parámetros normales con áreas de mejora identificadas.'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊'
      case 'neutral': return '😐'
      case 'sad': return '😢'
      case 'angry': return '😠'
      case 'anxious': return '😰'
      default: return '😐'
    }
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'text-green-600 bg-green-100'
      case 'neutral': return 'text-yellow-600 bg-yellow-100'
      case 'sad': return 'text-blue-600 bg-blue-100'
      case 'angry': return 'text-red-600 bg-red-100'
      case 'anxious': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300'
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-300'
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300'
      case 'low': return 'text-green-700 bg-green-100 border-green-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleRequestMeeting = () => {
    toast.success('Solicitud de reunión enviada al equipo de bienestar')
  }

  const handleContactProfessional = (professional: string) => {
    toast.success(`Contactando con ${professional}`)
  }

  const handleExportReport = async () => {
    toast.success('Generando reporte emocional...')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información emocional...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Dashboard Emocional 💖</h1>
              <p className="mt-2 opacity-90">
                Seguimiento del bienestar socioemocional de {childInfo.name}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <span className="text-4xl">{getMoodEmoji(childInfo.currentMood)}</span>
                  <div>
                    <div className="text-sm opacity-75">Estado actual</div>
                    <div className="font-semibold">Bienestar general: {childInfo.overallWellness}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleRequestMeeting}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Solicitar Reunión
              </Button>
              <Button
                onClick={handleExportReport}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bienestar General</p>
                <p className={`text-2xl font-bold ${getWellnessColor(childInfo.overallWellness)}`}>
                  {childInfo.overallWellness}%
                </p>
                <div className="flex items-center mt-1">
                  {childInfo.trend === 'improving' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${childInfo.trend === 'improving' ? 'text-green-600' : 'text-red-600'}`}>
                    {childInfo.trend === 'improving' ? 'Mejorando' : 'Necesita atención'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {psychosocialAlerts.filter(a => a.status === 'active').length}
                </p>
                <p className="text-xs text-gray-600">
                  {psychosocialAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length} alta prioridad
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Intervenciones</p>
                <p className="text-2xl font-bold text-gray-900">{interventionHistory.length}</p>
                <p className="text-xs text-gray-600">Este semestre</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Última Evaluación</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(childInfo.lastAssessment).toLocaleDateString('es-CL')}
                </p>
                <p className="text-xs text-gray-600">Hace 1 día</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emotional Timeline and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Emotional Records */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Registro Emocional Reciente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {emotionalRecords.slice(0, 5).map((record, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getMoodColor(record.mood)}`}>
                        <span className="text-lg">{getMoodEmoji(record.mood)}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString('es-CL')}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            Puntaje: {record.score}/100
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            record.score >= 80 ? 'bg-green-100 text-green-700' :
                            record.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {record.score >= 80 ? 'Excelente' :
                             record.score >= 60 ? 'Regular' : 'Preocupante'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          Reportado por: {record.reportedBy === 'teacher' ? 'Profesor' : 
                                          record.reportedBy === 'counselor' ? 'Consejero' :
                                          record.reportedBy === 'self' ? 'Auto-reporte' : 'Observador'}
                        </span>
                        {record.interventions && record.interventions.length > 0 && (
                          <span className="text-xs text-blue-600">
                            {record.interventions.length} intervención(es)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Psychosocial Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Alertas Psicosociales</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {psychosocialAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <span className="text-xs text-gray-500">
                            Detectado: {new Date(alert.dateDetected).toLocaleDateString('es-CL')}
                          </span>
                          {alert.assignedProfessional && (
                            <span className="text-xs text-gray-500">
                              Asignado: {alert.assignedProfessional}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.status === 'active' ? 'bg-red-100 text-red-700' :
                          alert.status === 'monitoring' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {alert.status === 'active' ? 'Activo' :
                           alert.status === 'monitoring' ? 'Monitoreando' : 'Resuelto'}
                        </span>
                        {alert.assignedProfessional && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleContactProfessional(alert.assignedProfessional!)}
                          >
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            Contactar
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {alert.recommendedActions.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">Acciones Recomendadas:</h4>
                        <ul className="space-y-1">
                          {alert.recommendedActions.map((action, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Intervention History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Historial de Intervenciones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {interventionHistory.map((intervention, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="font-medium text-gray-900">{intervention.type}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          intervention.outcome === 'Muy positivo' ? 'bg-green-100 text-green-700' :
                          intervention.outcome === 'Positivo' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {intervention.outcome}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Fecha:</span> {new Date(intervention.date).toLocaleDateString('es-CL')}
                        </div>
                        <div>
                          <span className="font-medium">Profesional:</span> {intervention.professional}
                        </div>
                        <div>
                          <span className="font-medium">Duración:</span> {intervention.duration}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{intervention.notes}</p>
                      {intervention.nextSession && (
                        <div className="mt-2 text-sm text-blue-600">
                          <CalendarIcon className="h-4 w-4 inline mr-1" />
                          Próxima sesión: {new Date(intervention.nextSession).toLocaleDateString('es-CL')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={handleRequestMeeting}
              className="flex items-center justify-center"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Solicitar Reunión
            </Button>
            <Button
              onClick={() => handleContactProfessional('Psic. Ana López')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              Contactar Psicólogo
            </Button>
            <Button
              onClick={() => toast.success('Abriendo chat con equipo bienestar')}
              variant="outline"
              className="flex items-center justify-center"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              Chat Bienestar
            </Button>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="flex items-center justify-center"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Reporte Completo
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 