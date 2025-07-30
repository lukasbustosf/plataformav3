'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  BookOpenIcon, 
  UsersIcon, 
  ClockIcon, 
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  PlayIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'

export default function StudentClassDetailPage() {
  const { id } = useParams()
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for the specific class
  const classData = {
    id: id,
    name: 'Matemáticas 8° Básico',
    teacher: 'Prof. María González',
    subject: 'Matemáticas',
    grade: '8° Básico',
    schedule: 'Lunes, Miércoles, Viernes - 10:00-11:30',
    nextClass: '2024-12-20 10:00',
    averageGrade: 6.8,
    attendance: 95,
    totalClasses: 45,
    attendedClasses: 43,
    description: 'En esta clase aprenderemos conceptos fundamentales de álgebra, geometría y estadística básica aplicados al nivel de 8° básico.',
    students: 28,
    topics: [
      'Ecuaciones Lineales',
      'Fracciones y Decimales', 
      'Geometría Básica',
      'Estadística Descriptiva',
      'Proporcionalidad'
    ]
  }

  const materials = [
    {
      id: 1,
      name: 'Guía de Ecuaciones Lineales',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-12-15',
      category: 'Guías'
    },
    {
      id: 2,
      name: 'Video: Resolución de Problemas',
      type: 'MP4',
      size: '45.2 MB',
      uploadDate: '2024-12-12',
      category: 'Videos'
    },
    {
      id: 3,
      name: 'Presentación: Fracciones',
      type: 'PPTX',
      size: '5.8 MB',
      uploadDate: '2024-12-10',
      category: 'Presentaciones'
    },
    {
      id: 4,
      name: 'Ejercicios Complementarios',
      type: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-12-08',
      category: 'Ejercicios'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'quiz',
      title: 'Quiz: Ecuaciones Lineales',
      date: '2024-12-18',
      score: 85,
      total: 100,
      status: 'completed'
    },
    {
      id: 2,
      type: 'game',
      title: 'Trivia Fracciones',
      date: '2024-12-17',
      score: 92,
      total: 100,
      status: 'completed'
    },
    {
      id: 3,
      type: 'homework',
      title: 'Tarea: Ejercicios Capítulo 5',
      date: '2024-12-16',
      score: 78,
      total: 100,
      status: 'graded'
    },
    {
      id: 4,
      type: 'assignment',
      title: 'Proyecto: Aplicaciones de Álgebra',
      dueDate: '2024-12-22',
      status: 'pending'
    }
  ]

  const upcomingClasses = [
    {
      date: '2024-12-20',
      time: '10:00-11:30',
      topic: 'Sistemas de Ecuaciones',
      type: 'Clase Teórica'
    },
    {
      date: '2024-12-22',
      time: '10:00-11:30',
      topic: 'Ejercicios Prácticos',
      type: 'Clase Práctica'
    },
    {
      date: '2024-12-27',
      time: '10:00-11:30',
      topic: 'Evaluación Formativa',
      type: 'Evaluación'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <DocumentTextIcon className="h-4 w-4" />
      case 'game': return <PlayIcon className="h-4 w-4" />
      case 'homework': return <BookOpenIcon className="h-4 w-4" />
      case 'assignment': return <ClipboardDocumentListIcon className="h-4 w-4" />
      default: return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 70) return 'text-green-600'
    if (grade >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return '📄'
      case 'MP4': return '🎥'
      case 'PPTX': return '📊'
      default: return '📁'
    }
  }

  const tabs = [
    { id: 'overview', name: 'Resumen' },
    { id: 'materials', name: 'Materiales' },
    { id: 'activities', name: 'Actividades' },
    { id: 'schedule', name: 'Horario' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{classData.name}</h1>
              <p className="mt-2 opacity-90">{classData.teacher}</p>
              <p className="text-sm opacity-75">{classData.schedule}</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Próxima clase</div>
              <div className="text-lg font-medium">
                {new Date(classData.nextClass).toLocaleDateString('es-ES', { 
                  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
          <p className="mt-4 opacity-90">{classData.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mi Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{classData.averageGrade}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{classData.attendance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Clases Asistidas</p>
                <p className="text-2xl font-bold text-gray-900">{classData.attendedClasses}/{classData.totalClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Compañeros</p>
                <p className="text-2xl font-bold text-gray-900">{classData.students}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Topics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Temas del Curso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classData.topics.map((topic, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-3" />
                        <span className="text-sm font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Actividades Recientes</h3>
                  <div className="space-y-3">
                    {recentActivities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.date || `Vence: ${activity.dueDate}`}</p>
                          </div>
                        </div>
                        {activity.score && (
                          <div className={`text-sm font-medium ${getGradeColor(activity.score)}`}>
                            {activity.score}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Material de Clase</h3>
                {materials.map((material) => (
                  <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getFileIcon(material.type)}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{material.name}</h4>
                          <p className="text-sm text-gray-600">{material.category} • {material.size} • {material.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" leftIcon={<EyeIcon className="h-4 w-4" />}>
                          Ver
                        </Button>
                        <Button size="sm" leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}>
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Todas las Actividades</h3>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">
                            {activity.date ? `Realizado: ${activity.date}` : `Vence: ${activity.dueDate}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {activity.score && (
                          <div className={`text-lg font-medium ${getGradeColor(activity.score)}`}>
                            {activity.score}/{activity.total}
                          </div>
                        )}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status === 'completed' ? 'Completado' :
                           activity.status === 'graded' ? 'Calificado' : 'Pendiente'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Próximas Clases</h3>
                {upcomingClasses.map((classSession, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{classSession.topic}</h4>
                          <p className="text-sm text-gray-600">{classSession.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {new Date(classSession.date).toLocaleDateString('es-ES', { 
                            weekday: 'long', month: 'long', day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-600">{classSession.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 