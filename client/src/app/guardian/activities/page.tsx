'use client'

import { useState } from 'react'
import { 
  DocumentTextIcon, 
  PlayIcon, 
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  title: string
  type: 'assignment' | 'game' | 'reading' | 'project' | 'quiz'
  subject: string
  status: 'completed' | 'in-progress' | 'pending'
  score?: number
  maxScore?: number
  completedDate: string
  timeSpent: number // minutes
  teacher: string
  description: string
  bloomLevel: string
}

export default function ActivitiesPage() {
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Resolución de Ecuaciones Lineales',
      type: 'assignment',
      subject: 'Matemáticas',
      status: 'completed',
      score: 18,
      maxScore: 20,
      completedDate: '2024-02-08',
      timeSpent: 45,
      teacher: 'Prof. Carlos Rodríguez',
      description: 'Ejercicios prácticos sobre resolución de ecuaciones de primer grado',
      bloomLevel: 'Aplicar'
    },
    {
      id: '2',
      title: 'Aventura Matemática - Nivel 8',
      type: 'game',
      subject: 'Matemáticas',
      status: 'completed',
      score: 850,
      maxScore: 1000,
      completedDate: '2024-02-08',
      timeSpent: 25,
      teacher: 'Prof. Carlos Rodríguez',
      description: 'Juego interactivo sobre fracciones y decimales',
      bloomLevel: 'Aplicar'
    },
    {
      id: '3',
      title: 'Análisis del Poema "La Araucana"',
      type: 'assignment',
      subject: 'Lenguaje',
      status: 'completed',
      score: 16,
      maxScore: 18,
      completedDate: '2024-02-07',
      timeSpent: 60,
      teacher: 'Prof. María Silva',
      description: 'Análisis literario y contextualización histórica',
      bloomLevel: 'Analizar'
    },
    {
      id: '4',
      title: 'Lectura: "El Principito" - Capítulos 1-5',
      type: 'reading',
      subject: 'Lenguaje',
      status: 'completed',
      completedDate: '2024-02-06',
      timeSpent: 90,
      teacher: 'Prof. María Silva',
      description: 'Lectura comprensiva y reflexión personal',
      bloomLevel: 'Comprender'
    },
    {
      id: '5',
      title: 'Experimento: Estados de la Materia',
      type: 'project',
      subject: 'Ciencias',
      status: 'in-progress',
      completedDate: '2024-02-10',
      timeSpent: 120,
      teacher: 'Prof. Ana Martínez',
      description: 'Observación y registro de cambios de estado',
      bloomLevel: 'Analizar'
    }
  ])

  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  const filteredActivities = activities.filter(activity => {
    const statusFilter = selectedFilter === 'all' || activity.status === selectedFilter
    const subjectFilter = selectedSubject === 'all' || activity.subject === selectedSubject
    return statusFilter && subjectFilter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return DocumentTextIcon
      case 'game': return PlayIcon
      case 'reading': return BookOpenIcon
      case 'project': return AcademicCapIcon
      case 'quiz': return CheckCircleIcon
      default: return DocumentTextIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-800'
      case 'game': return 'bg-purple-100 text-purple-800'
      case 'reading': return 'bg-green-100 text-green-800'
      case 'project': return 'bg-orange-100 text-orange-800'
      case 'quiz': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'matemáticas': return 'bg-blue-100 text-blue-800'
      case 'lenguaje': return 'bg-green-100 text-green-800'
      case 'ciencias': return 'bg-purple-100 text-purple-800'
      case 'historia': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBloomColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'recordar': return 'bg-red-100 text-red-800'
      case 'comprender': return 'bg-orange-100 text-orange-800'
      case 'aplicar': return 'bg-yellow-100 text-yellow-800'
      case 'analizar': return 'bg-green-100 text-green-800'
      case 'evaluar': return 'bg-blue-100 text-blue-800'
      case 'crear': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const completedActivities = activities.filter(a => a.status === 'completed')
  const totalTimeSpent = activities.reduce((acc, activity) => acc + activity.timeSpent, 0)
  const averageScore = completedActivities.filter(a => a.score).reduce((acc, activity) => {
    if (activity.score && activity.maxScore) {
      return acc + (activity.score / activity.maxScore * 100)
    }
    return acc
  }, 0) / completedActivities.filter(a => a.score).length

  const subjects = Array.from(new Set(activities.map(a => a.subject)))

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Actividades Realizadas</h1>
        <p className="page-subtitle">
          Historial completo de tareas, juegos y proyectos completados
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="stats-grid mb-8">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actividades Completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedActivities.length}
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
              <p className="text-sm font-medium text-gray-600">Tiempo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio General</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(averageScore || 0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                {activities.filter(a => {
                  const activityDate = new Date(a.completedDate)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return activityDate >= weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Estado:</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">Todos</option>
            <option value="completed">Completadas</option>
            <option value="in-progress">En Progreso</option>
            <option value="pending">Pendientes</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Asignatura:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">Todas</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-500">
          {filteredActivities.length} actividades
        </div>
      </div>

      {/* Lista de actividades */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => {
          const TypeIcon = getTypeIcon(activity.type)
          
          return (
            <div key={activity.id} className="card">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <TypeIcon className="h-8 w-8 text-primary-600 mt-1" />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                        
                        {activity.score && activity.maxScore && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">
                              {activity.score}/{activity.maxScore}
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round((activity.score / activity.maxScore) * 100)}%
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type === 'assignment' ? 'Tarea' :
                           activity.type === 'game' ? 'Juego' :
                           activity.type === 'reading' ? 'Lectura' :
                           activity.type === 'project' ? 'Proyecto' : 'Quiz'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(activity.subject)}`}>
                          {activity.subject}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status === 'completed' ? 'Completada' :
                           activity.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBloomColor(activity.bloomLevel)}`}>
                          {activity.bloomLevel}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <CalendarDaysIcon className="h-4 w-4" />
                            <span>{new Date(activity.completedDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="h-4 w-4" />
                            <span>{activity.timeSpent} min</span>
                          </div>
                          
                          <div>
                            <span className="font-medium">Prof:</span> {activity.teacher}
                          </div>
                        </div>
                        
                        <button className="text-primary-600 hover:text-primary-800 font-medium text-sm">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron actividades con los filtros seleccionados</p>
        </div>
      )}

      {/* Análisis por asignatura */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Rendimiento por Asignatura
        </h2>
        <div className="grid-responsive-1 md:grid-cols-3 gap-4">
          {subjects.map(subject => {
            const subjectActivities = activities.filter(a => a.subject === subject && a.status === 'completed')
            const subjectAverage = subjectActivities.filter(a => a.score).reduce((acc, activity) => {
              if (activity.score && activity.maxScore) {
                return acc + (activity.score / activity.maxScore * 100)
              }
              return acc
            }, 0) / subjectActivities.filter(a => a.score).length
            
            return (
              <div key={subject} className="card">
                <div className="p-6">
                  <h3 className="font-medium text-gray-900 mb-2">{subject}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actividades:</span>
                      <span className="font-medium">{subjectActivities.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Promedio:</span>
                      <span className="font-medium">{Math.round(subjectAverage || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${subjectAverage || 0}%` }}
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
  )
} 