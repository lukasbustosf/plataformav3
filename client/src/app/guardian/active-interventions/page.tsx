'use client'

import { useState } from 'react'
import { 
  HeartIcon, 
  CalendarDaysIcon, 
  DocumentTextIcon,
  UserIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface Intervention {
  id: string
  type: 'psychological' | 'academic' | 'social' | 'behavioral'
  title: string
  description: string
  status: 'active' | 'completed' | 'paused'
  priority: 'low' | 'medium' | 'high'
  professional: {
    name: string
    role: string
    contact: string
  }
  startDate: string
  nextSession: string
  progress: number
  goals: string[]
  notes: string
}

export default function ActiveInterventionsPage() {
  const [interventions] = useState<Intervention[]>([
    {
      id: '1',
      type: 'psychological',
      title: 'Apoyo Emocional - Ansiedad Escolar',
      description: 'Sesiones de apoyo psicológico para manejo de ansiedad ante evaluaciones',
      status: 'active',
      priority: 'high',
      professional: {
        name: 'Dra. María González',
        role: 'Psicóloga Escolar',
        contact: 'maria.gonzalez@colegio.cl'
      },
      startDate: '2024-01-15',
      nextSession: '2024-02-15',
      progress: 65,
      goals: [
        'Reducir niveles de ansiedad ante evaluaciones',
        'Desarrollar técnicas de relajación',
        'Mejorar autoestima académica'
      ],
      notes: 'Progreso favorable, implementando técnicas de respiración'
    },
    {
      id: '2',
      type: 'academic',
      title: 'Refuerzo Matemáticas',
      description: 'Apoyo académico personalizado en matemáticas',
      status: 'active',
      priority: 'medium',
      professional: {
        name: 'Prof. Carlos Rodríguez',
        role: 'Profesor de Matemáticas',
        contact: 'carlos.rodriguez@colegio.cl'
      },
      startDate: '2024-01-20',
      nextSession: '2024-02-10',
      progress: 40,
      goals: [
        'Mejorar comprensión de fracciones',
        'Desarrollar estrategias de resolución de problemas',
        'Aumentar confianza en matemáticas'
      ],
      notes: 'Necesita más práctica en operaciones básicas'
    }
  ])

  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'psychological': return HeartIcon
      case 'academic': return DocumentTextIcon
      case 'social': return UserIcon
      case 'behavioral': return ExclamationTriangleIcon
      default: return DocumentTextIcon
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Intervenciones Activas</h1>
        <p className="page-subtitle">
          Seguimiento de apoyos e intervenciones en curso para el desarrollo integral
        </p>
      </div>

      <div className="grid-responsive-1 lg:grid-cols-3 gap-6">
        {/* Lista de Intervenciones */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Intervenciones en Curso
              </h2>
              
              <div className="space-y-4">
                {interventions.map((intervention) => {
                  const TypeIcon = getTypeIcon(intervention.type)
                  
                  return (
                    <div 
                      key={intervention.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedIntervention?.id === intervention.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedIntervention(intervention)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <TypeIcon className="h-6 w-6 text-primary-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {intervention.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {intervention.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                                {intervention.status === 'active' ? 'Activa' : 
                                 intervention.status === 'completed' ? 'Completada' : 'Pausada'}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(intervention.priority)}`}>
                                {intervention.priority === 'high' ? 'Alta' : 
                                 intervention.priority === 'medium' ? 'Media' : 'Baja'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Progreso: {intervention.progress}%
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${intervention.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Detalles */}
        <div className="lg:col-span-1">
          {selectedIntervention ? (
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalles de la Intervención
                </h3>
                
                <div className="space-y-4">
                  {/* Profesional a cargo */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Profesional a Cargo
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedIntervention.professional.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedIntervention.professional.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800">
                          <PhoneIcon className="h-4 w-4" />
                          <span>Llamar</span>
                        </button>
                        <button className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-800">
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Mensaje</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Próxima sesión */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Próxima Sesión
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>{new Date(selectedIntervention.nextSession).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Objetivos */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Objetivos de la Intervención
                    </h4>
                    <ul className="space-y-2">
                      {selectedIntervention.goals.map((goal, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Notas del profesional */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Notas del Profesional
                    </h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {selectedIntervention.notes}
                      </p>
                    </div>
                  </div>

                  {/* Progreso visual */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Progreso General
                    </h4>
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-green-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center"
                        style={{ width: `${selectedIntervention.progress}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {selectedIntervention.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="p-6 text-center">
                <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Selecciona una intervención para ver los detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas resumen */}
      <div className="mt-8">
        <div className="stats-grid">
          <div className="stats-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Intervenciones Activas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interventions.filter(i => i.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(interventions.reduce((acc, i) => acc + i.progress, 0) / interventions.length)}%
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Próximas Sesiones</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 