'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  EyeIcon
} from '@heroicons/react/24/outline'

export default function StudentClassesPage() {
  const router = useRouter()
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('current')

  // Mock data for student's classes
  const currentClasses = [
    {
      id: 1,
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
      recentActivities: [
        { type: 'quiz', title: 'Ecuaciones Lineales', score: 85, date: '2024-12-18' },
        { type: 'game', title: 'Trivia Fracciones', score: 92, date: '2024-12-17' },
        { type: 'homework', title: 'Ejercicios Capítulo 5', score: 78, date: '2024-12-16' }
      ]
    },
    {
      id: 2,
      name: 'Historia de Chile',
      teacher: 'Prof. Carlos Ruiz',
      subject: 'Historia',
      grade: '8° Básico',
      schedule: 'Martes, Jueves - 14:00-15:30',
      nextClass: '2024-12-19 14:00',
      averageGrade: 7.2,
      attendance: 98,
      totalClasses: 30,
      attendedClasses: 29,
      recentActivities: [
        { type: 'project', title: 'Investigación Independencia', score: 88, date: '2024-12-18' },
        { type: 'quiz', title: 'Período Colonial', score: 75, date: '2024-12-15' }
      ]
    },
    {
      id: 3,
      name: 'Ciencias Naturales',
      teacher: 'Prof. Ana López',
      subject: 'Ciencias',
      grade: '8° Básico',
      schedule: 'Lunes, Miércoles - 15:30-17:00',
      nextClass: '2024-12-18 15:30',
      averageGrade: 6.5,
      attendance: 92,
      totalClasses: 40,
      attendedClasses: 37,
      recentActivities: [
        { type: 'lab', title: 'Experimento Densidad', score: 90, date: '2024-12-17' },
        { type: 'quiz', title: 'Sistema Solar', score: 82, date: '2024-12-14' }
      ]
    }
  ]

  const pastClasses = [
    {
      id: 4,
      name: 'Matemáticas 7° Básico',
      teacher: 'Prof. Juan Pérez',
      period: '2024 Primer Semestre',
      finalGrade: 7.1,
      attendance: 96
    },
    {
      id: 5,
      name: 'Historia Universal',
      teacher: 'Prof. Laura Martínez',
      period: '2024 Primer Semestre',
      finalGrade: 6.8,
      attendance: 94
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <DocumentTextIcon className="h-4 w-4" />
      case 'game': return <PlayIcon className="h-4 w-4" />
      case 'homework': return <BookOpenIcon className="h-4 w-4" />
      case 'project': return <ChartBarIcon className="h-4 w-4" />
      case 'lab': return <EyeIcon className="h-4 w-4" />
      default: return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 7) return 'text-green-600'
    if (grade >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const tabs = [
    { id: 'current', name: 'Clases Actuales', count: currentClasses.length },
    { id: 'past', name: 'Historial', count: pastClasses.length }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Mis Clases 📚</h1>
          <p className="mt-2 opacity-90">
            ¡Hola {fullName}! Aquí puedes ver todas tus clases, horarios y progreso académico.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Clases Actuales</p>
                <p className="text-2xl font-bold text-gray-900">{currentClasses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(currentClasses.reduce((sum, cls) => sum + cls.averageGrade, 0) / currentClasses.length).toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asistencia Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(currentClasses.reduce((sum, cls) => sum + cls.attendance, 0) / currentClasses.length)}%
                </p>
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
                <p className="text-sm font-medium text-gray-500">Próxima Clase</p>
                <p className="text-sm font-bold text-gray-900">Hoy 10:00</p>
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
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Current Classes Tab */}
            {activeTab === 'current' && (
              <div className="space-y-6">
                {currentClasses.map((classInfo) => (
                  <div key={classInfo.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{classInfo.name}</h3>
                        <p className="text-sm text-gray-600">{classInfo.teacher}</p>
                        <p className="text-sm text-gray-500">{classInfo.schedule}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Próxima clase</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(classInfo.nextClass).toLocaleDateString('es-ES', { 
                            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getGradeColor(classInfo.averageGrade)}`}>
                          {classInfo.averageGrade.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Promedio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{classInfo.attendance}%</div>
                        <div className="text-sm text-gray-600">Asistencia</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{classInfo.attendedClasses}</div>
                        <div className="text-sm text-gray-600">Clases Asistidas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{classInfo.totalClasses}</div>
                        <div className="text-sm text-gray-600">Total Clases</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Actividades Recientes</h4>
                      <div className="space-y-2">
                        {classInfo.recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-400">
                                {getActivityIcon(activity.type)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                <p className="text-xs text-gray-500">{activity.date}</p>
                              </div>
                            </div>
                            <div className={`text-sm font-medium ${getGradeColor(activity.score / 10)}`}>
                              {activity.score}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/student/classes/${classInfo.id}`)}
                      >
                        Ver Detalle
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => router.push(`/student/classes/${classInfo.id}/materials`)}
                      >
                        Material de Clase
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past Classes Tab */}
            {activeTab === 'past' && (
              <div className="space-y-4">
                {pastClasses.map((classInfo) => (
                  <div key={classInfo.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{classInfo.name}</h3>
                        <p className="text-sm text-gray-600">{classInfo.teacher}</p>
                        <p className="text-sm text-gray-500">{classInfo.period}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <div>
                          <div className="text-sm text-gray-500">Calificación Final</div>
                          <div className={`text-xl font-bold ${getGradeColor(classInfo.finalGrade)}`}>
                            {classInfo.finalGrade.toFixed(1)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Asistencia</div>
                          <div className="text-lg font-medium text-green-600">{classInfo.attendance}%</div>
                        </div>
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