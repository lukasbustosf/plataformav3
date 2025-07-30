'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  HeartIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PAICase {
  id: string
  title: string
  category: 'academic' | 'behavioral' | 'emotional' | 'social' | 'family'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'monitoring' | 'completed' | 'paused'
  createdDate: string
  expectedCompletion: string
  assignedProfessional: string
  professionalRole: string
  progressPercentage: number
  objectives: string[]
  interventions: number
  nextMeeting: string | null
  lastUpdate: string
  description: string
  guardian_involvement: 'high' | 'medium' | 'low'
  student_engagement: 'excellent' | 'good' | 'fair' | 'poor'
}

interface Intervention {
  id: string
  paiCaseId: string
  type: 'individual_session' | 'group_session' | 'family_meeting' | 'assessment' | 'follow_up'
  date: string
  duration: number
  professional: string
  summary: string
  outcome: 'very_positive' | 'positive' | 'neutral' | 'concerning'
  nextSteps: string[]
  guardian_present: boolean
  student_response: string
}

export default function GuardianSupportCasesPage() {
  const { user, fullName } = useAuth()
  const [selectedCase, setSelectedCase] = useState<PAICase | null>(null)
  const [showCaseModal, setShowCaseModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'interventions' | 'progress'>('overview')
  const [loading, setLoading] = useState(true)

  // Mock data for child's support cases
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    rut: '23.456.789-1',
    activeCases: 2,
    completedCases: 1,
    totalInterventions: 15,
    overallProgress: 78
  }

  const paiCases: PAICase[] = [
    {
      id: 'PAI-001',
      title: 'Plan de Apoyo Socioemocional',
      category: 'emotional',
      priority: 'high',
      status: 'active',
      createdDate: '2024-10-15',
      expectedCompletion: '2025-03-15',
      assignedProfessional: 'Psic. Ana López',
      professionalRole: 'Psicóloga Escolar',
      progressPercentage: 65,
      objectives: [
        'Mejorar autoestima y confianza personal',
        'Desarrollar estrategias de manejo emocional',
        'Fortalecer vínculos familiares y escolares',
        'Reducir episodios de ansiedad social'
      ],
      interventions: 12,
      nextMeeting: '2024-12-22T15:00:00Z',
      lastUpdate: '2024-12-18',
      description: 'Plan integral para apoyar el desarrollo socioemocional de Sofía, enfocado en fortalecer su autoestima y habilidades de regulación emocional.',
      guardian_involvement: 'high',
      student_engagement: 'good'
    },
    {
      id: 'PAI-002',
      title: 'Apoyo en Habilidades Sociales',
      category: 'social',
      priority: 'medium',
      status: 'monitoring',
      createdDate: '2024-11-20',
      expectedCompletion: '2025-02-20',
      assignedProfessional: 'T.S. María Torres',
      professionalRole: 'Trabajadora Social',
      progressPercentage: 45,
      objectives: [
        'Mejorar habilidades de comunicación con pares',
        'Desarrollar estrategias de resolución de conflictos',
        'Aumentar participación en actividades grupales'
      ],
      interventions: 6,
      nextMeeting: '2024-12-28T14:30:00Z',
      lastUpdate: '2024-12-17',
      description: 'Intervención focalizada en el desarrollo de habilidades sociales y mejora de las relaciones interpersonales.',
      guardian_involvement: 'medium',
      student_engagement: 'fair'
    },
    {
      id: 'PAI-003',
      title: 'Refuerzo Académico Personalizado',
      category: 'academic',
      priority: 'low',
      status: 'completed',
      createdDate: '2024-08-10',
      expectedCompletion: '2024-12-10',
      assignedProfessional: 'Prof. Carmen Vega',
      professionalRole: 'Psicopedagoga',
      progressPercentage: 100,
      objectives: [
        'Mejorar comprensión lectora',
        'Desarrollar estrategias de estudio efectivas',
        'Aumentar motivación por el aprendizaje'
      ],
      interventions: 18,
      nextMeeting: null,
      lastUpdate: '2024-12-10',
      description: 'Plan de refuerzo académico completado exitosamente con mejoras significativas en rendimiento.',
      guardian_involvement: 'high',
      student_engagement: 'excellent'
    }
  ]

  const interventions: Intervention[] = [
    {
      id: 'INT-001',
      paiCaseId: 'PAI-001',
      type: 'individual_session',
      date: '2024-12-17',
      duration: 45,
      professional: 'Psic. Ana López',
      summary: 'Sesión enfocada en técnicas de relajación y manejo de ansiedad. Sofía mostró buena receptividad y practicó ejercicios de respiración.',
      outcome: 'positive',
      nextSteps: [
        'Practicar técnicas de respiración diariamente',
        'Llevar diario emocional durante la semana',
        'Aplicar estrategias en situaciones de estrés escolar'
      ],
      guardian_present: false,
      student_response: 'Colaborativa y motivada para implementar las estrategias aprendidas'
    },
    {
      id: 'INT-002',
      paiCaseId: 'PAI-001',
      type: 'family_meeting',
      date: '2024-12-10',
      duration: 60,
      professional: 'Psic. Ana López',
      summary: 'Reunión familiar para alinear estrategias de apoyo en casa. Se establecieron rutinas de comunicación y técnicas de contención emocional.',
      outcome: 'very_positive',
      nextSteps: [
        'Implementar rutina de check-in emocional diario',
        'Crear espacio seguro para expresar emociones',
        'Reforzar logros y avances positivos'
      ],
      guardian_present: true,
      student_response: 'Se sintió escuchada y apoyada durante la sesión familiar'
    },
    {
      id: 'INT-003',
      paiCaseId: 'PAI-002',
      type: 'group_session',
      date: '2024-12-15',
      duration: 90,
      professional: 'T.S. María Torres',
      summary: 'Sesión grupal de habilidades sociales con dinámicas de role-playing y resolución colaborativa de problemas.',
      outcome: 'positive',
      nextSteps: [
        'Aplicar técnicas de comunicación asertiva',
        'Practicar escucha activa con compañeros',
        'Participar en actividad grupal voluntaria'
      ],
      guardian_present: false,
      student_response: 'Participó activamente y demostró mejoría en comunicación'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emotional':
        return <HeartIcon className="h-5 w-5" />
      case 'social':
        return <UserIcon className="h-5 w-5" />
      case 'academic':
        return <DocumentTextIcon className="h-5 w-5" />
      case 'behavioral':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'family':
        return <HeartIcon className="h-5 w-5" />
      default:
        return <DocumentTextIcon className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional':
        return 'text-pink-600 bg-pink-100'
      case 'social':
        return 'text-blue-600 bg-blue-100'
      case 'academic':
        return 'text-green-600 bg-green-100'
      case 'behavioral':
        return 'text-orange-600 bg-orange-100'
      case 'family':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-100'
      case 'monitoring':
        return 'text-yellow-700 bg-yellow-100'
      case 'completed':
        return 'text-blue-700 bg-blue-100'
      case 'paused':
        return 'text-gray-700 bg-gray-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-100'
      case 'high':
        return 'text-orange-700 bg-orange-100'
      case 'medium':
        return 'text-yellow-700 bg-yellow-100'
      case 'low':
        return 'text-green-700 bg-green-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'very_positive':
        return 'text-green-700 bg-green-100'
      case 'positive':
        return 'text-blue-700 bg-blue-100'
      case 'neutral':
        return 'text-yellow-700 bg-yellow-100'
      case 'concerning':
        return 'text-red-700 bg-red-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const handleViewCase = (caseItem: PAICase) => {
    setSelectedCase(caseItem)
    setShowCaseModal(true)
    setSelectedTab('overview')
  }

  const handleContactProfessional = (professional: string) => {
    toast.success(`Contactando con ${professional}`)
  }

  const handleScheduleMeeting = (caseId: string) => {
    toast.success('Abriendo calendario para agendar reunión')
  }

  const handleDownloadReport = (caseId: string) => {
    toast.success('Generando reporte del caso PAI')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando casos de apoyo...</p>
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
              <h1 className="text-2xl font-bold">Casos de Apoyo PAI 🤝</h1>
              <p className="mt-2 opacity-90">
                Seguimiento de Planes de Apoyo Individual para {childInfo.name}
              </p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  <div>
                    <div className="text-sm opacity-75">Casos Activos</div>
                    <div className="font-bold text-lg">{childInfo.activeCases}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5" />
                  <div>
                    <div className="text-sm opacity-75">Progreso General</div>
                    <div className="font-bold text-lg">{childInfo.overallProgress}%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => handleContactProfessional('Equipo Bienestar')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Contactar Equipo
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Casos Activos</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.activeCases}</p>
                <p className="text-xs text-gray-600">En seguimiento</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.completedCases}</p>
                <p className="text-xs text-gray-600">Con éxito</p>
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
                <p className="text-2xl font-bold text-gray-900">{childInfo.totalInterventions}</p>
                <p className="text-xs text-gray-600">Este año</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.overallProgress}%</p>
                <p className="text-xs text-gray-600">Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Cases */}
        <div className="space-y-4">
          {paiCases.map((paiCase) => (
            <div key={paiCase.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${getCategoryColor(paiCase.category)}`}>
                    {getCategoryIcon(paiCase.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{paiCase.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(paiCase.status)}`}>
                        {paiCase.status === 'active' ? 'Activo' :
                         paiCase.status === 'monitoring' ? 'Monitoreando' :
                         paiCase.status === 'completed' ? 'Completado' : 'Pausado'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(paiCase.priority)}`}>
                        {paiCase.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{paiCase.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Profesional Asignado:</span>
                        <p className="font-medium text-gray-900">{paiCase.assignedProfessional}</p>
                        <p className="text-xs text-gray-600">{paiCase.professionalRole}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Progreso:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${paiCase.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{paiCase.progressPercentage}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Intervenciones:</span>
                        <p className="font-medium text-gray-900">{paiCase.interventions} realizadas</p>
                        {paiCase.nextMeeting && (
                          <p className="text-xs text-blue-600">
                            Próxima: {new Date(paiCase.nextMeeting).toLocaleDateString('es-CL')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paiCase.objectives.slice(0, 2).map((objective, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {objective}
                        </span>
                      ))}
                      {paiCase.objectives.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{paiCase.objectives.length - 2} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => handleViewCase(paiCase)}
                    size="sm"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    Ver Detalle
                  </Button>
                  
                  <Button
                    onClick={() => handleContactProfessional(paiCase.assignedProfessional)}
                    variant="outline"
                    size="sm"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                  
                  {paiCase.status === 'active' && (
                    <Button
                      onClick={() => handleScheduleMeeting(paiCase.id)}
                      variant="outline"
                      size="sm"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Agendar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Detail Modal */}
        <ResponsiveModal
          open={showCaseModal}
          onClose={() => setShowCaseModal(false)}
          title={selectedCase ? `Detalle del Caso: ${selectedCase.title}` : 'Detalle del Caso'}
          size="xl"
          mobileFullScreen={true}
        >
          {selectedCase && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setSelectedTab('overview')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Resumen
                  </button>
                  <button
                    onClick={() => setSelectedTab('interventions')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'interventions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Intervenciones
                  </button>
                  <button
                    onClick={() => setSelectedTab('progress')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'progress'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Progreso
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {selectedTab === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ID del Caso:</span>
                          <span className="font-medium">{selectedCase.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Categoría:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(selectedCase.category)}`}>
                            {selectedCase.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Prioridad:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(selectedCase.priority)}`}>
                            {selectedCase.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Estado:</span>
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedCase.status)}`}>
                            {selectedCase.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fechas Importantes</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fecha de Inicio:</span>
                          <span>{new Date(selectedCase.createdDate).toLocaleDateString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Finalización Esperada:</span>
                          <span>{new Date(selectedCase.expectedCompletion).toLocaleDateString('es-CL')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Última Actualización:</span>
                          <span>{new Date(selectedCase.lastUpdate).toLocaleDateString('es-CL')}</span>
                        </div>
                        {selectedCase.nextMeeting && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Próxima Reunión:</span>
                            <span className="text-blue-600 font-medium">
                              {new Date(selectedCase.nextMeeting).toLocaleDateString('es-CL')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Objetivos del Plan</h4>
                    <ul className="space-y-2">
                      {selectedCase.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                      {selectedCase.description}
                    </p>
                  </div>
                </div>
              )}

              {selectedTab === 'interventions' && (
                <div className="space-y-4">
                  {interventions
                    .filter(intervention => intervention.paiCaseId === selectedCase.id)
                    .map((intervention) => (
                      <div key={intervention.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {intervention.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(intervention.date).toLocaleDateString('es-CL')} • {intervention.duration} min • {intervention.professional}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${getOutcomeColor(intervention.outcome)}`}>
                            {intervention.outcome.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{intervention.summary}</p>
                        
                        {intervention.nextSteps.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-gray-600 mb-2">Próximos Pasos:</h5>
                            <ul className="space-y-1">
                              {intervention.nextSteps.map((step, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {selectedTab === 'progress' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {selectedCase.progressPercentage}%
                    </div>
                    <p className="text-gray-600">Progreso General del Plan</p>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${selectedCase.progressPercentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{selectedCase.interventions}</div>
                      <p className="text-sm text-gray-600">Intervenciones Realizadas</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedCase.guardian_involvement === 'high' ? 'Alta' :
                         selectedCase.guardian_involvement === 'medium' ? 'Media' : 'Baja'}
                      </div>
                      <p className="text-sm text-gray-600">Participación Familiar</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedCase.student_engagement === 'excellent' ? 'Excelente' :
                         selectedCase.student_engagement === 'good' ? 'Buena' :
                         selectedCase.student_engagement === 'fair' ? 'Regular' : 'Preocupante'}
                      </div>
                      <p className="text-sm text-gray-600">Compromiso del Estudiante</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleContactProfessional(selectedCase.assignedProfessional)}
                  className="flex-1"
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Contactar {selectedCase.assignedProfessional}
                </Button>
                
                {selectedCase.status === 'active' && (
                  <Button
                    onClick={() => handleScheduleMeeting(selectedCase.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Agendar Reunión
                  </Button>
                )}
                
                <Button
                  onClick={() => handleDownloadReport(selectedCase.id)}
                  variant="outline"
                  className="flex-1"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Descargar Reporte
                </Button>
              </div>
            </div>
          )}
        </ResponsiveModal>
      </div>
    </DashboardLayout>
  )
} 
