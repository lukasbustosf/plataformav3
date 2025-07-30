'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { 
  UsersIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function SchoolDashboard() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock data for demonstration
  const schoolStats = {
    totalTeachers: 45,
    totalStudents: 680,
    totalClasses: 32,
    activeGames: 12,
    avgAttendance: 94.5,
    avgPerformance: 78.2,
    aiQuizzesThisMonth: 156,
    aiCreditsUsed: 2340,
    aiCreditsLimit: 5000
  }

  const recentActivity = [
    {
      id: 1,
      type: 'teacher_activity',
      teacher: 'Prof. María González',
      action: 'creó un nuevo quiz de Matemáticas para 8vo A',
      timestamp: '5 minutos'
    },
    {
      id: 2,
      type: 'game_session',
      teacher: 'Prof. Carlos Ruiz',
      action: 'inició una sesión de trivia con 25 estudiantes',
      timestamp: '15 minutos'
    },
    {
      id: 3,
      type: 'achievement',
      teacher: 'Prof. Ana López',
      action: 'sus estudiantes alcanzaron 95% promedio en Historia',
      timestamp: '2 horas'
    },
    {
      id: 4,
      type: 'alert',
      teacher: 'Sistema',
      action: 'recordatorio: reunión de coordinación académica mañana',
      timestamp: '1 día'
    }
  ]

  const topTeachers = [
    {
      id: 1,
      name: 'Prof. María González',
      subject: 'Matemáticas',
      quizzes: 23,
      avgScore: 87.5,
      engagement: 94
    },
    {
      id: 2,
      name: 'Prof. Carlos Ruiz',
      subject: 'Ciencias',
      quizzes: 19,
      avgScore: 82.1,
      engagement: 91
    },
    {
      id: 3,
      name: 'Prof. Ana López',
      subject: 'Historia',
      quizzes: 17,
      avgScore: 89.3,
      engagement: 88
    }
  ]

  const classPerformance = [
    { grade: '5° Básico', students: 85, avgScore: 78.5, attendance: 95.2, status: 'good' },
    { grade: '6° Básico', students: 92, avgScore: 81.2, attendance: 93.8, status: 'excellent' },
    { grade: '7° Básico', students: 88, avgScore: 75.9, attendance: 94.1, status: 'good' },
    { grade: '8° Básico', students: 90, avgScore: 73.4, attendance: 92.5, status: 'needs_attention' },
    { grade: '1° Medio', students: 95, avgScore: 79.8, attendance: 91.7, status: 'good' },
    { grade: '2° Medio', students: 87, avgScore: 77.2, attendance: 90.3, status: 'good' },
    { grade: '3° Medio', students: 82, avgScore: 81.5, attendance: 89.1, status: 'excellent' },
    { grade: '4° Medio', students: 76, avgScore: 83.7, attendance: 87.9, status: 'excellent' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Panel Directivo - Colegio San Antonio 🏫</h1>
          <p className="mt-2 opacity-90">
            Bienvenido/a, {fullName}. Monitorea el rendimiento académico y gestiona tu institución.
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{schoolStats.totalStudents}</p>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  +3.2% vs mes anterior
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profesores Activos</p>
                <p className="text-2xl font-bold text-gray-900">{schoolStats.totalTeachers}</p>
                <p className="text-xs text-green-600">100% participación</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio General</p>
                <p className="text-2xl font-bold text-gray-900">{schoolStats.avgPerformance}%</p>
                <p className="text-xs text-green-600">+2.1% este período</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asistencia Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{schoolStats.avgAttendance}%</p>
                <p className="text-xs text-green-600">Excelente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => window.location.href = '/school/timetable'}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <ClockIcon className="h-6 w-6" />
                <span className="text-sm">Gestionar Horarios</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/school/gradebook'}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <BookOpenIcon className="h-6 w-6" />
                <span className="text-sm">Libro de Notas</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/school/attendance'}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <CheckCircleIcon className="h-6 w-6" />
                <span className="text-sm">Control Asistencia</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/school/reports'}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <ChartBarIcon className="h-6 w-6" />
                <span className="text-sm">Generar Reportes</span>
              </Button>
            </div>
          </div>
        </div>

        {/* AI Usage Monitor */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Uso de Inteligencia Artificial</h2>
              <Button
                onClick={() => window.location.href = '/school/ai-budget'}
                variant="outline"
                size="sm"
              >
                Ver Detalles
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Créditos utilizados</span>
                  <span className="text-sm text-gray-600">{schoolStats.aiCreditsUsed}/{schoolStats.aiCreditsLimit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(schoolStats.aiCreditsUsed / schoolStats.aiCreditsLimit) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((schoolStats.aiCreditsUsed / schoolStats.aiCreditsLimit) * 100)}% del límite mensual
                </p>
              </div>
              <div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{schoolStats.aiQuizzesThisMonth}</div>
                  <div className="text-sm text-gray-600">Quizzes generados con IA</div>
                  <div className="text-xs text-green-600 mt-1">+45% vs mes anterior</div>
                </div>
              </div>
              <div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{schoolStats.activeGames}</div>
                  <div className="text-sm text-gray-600">Juegos activos ahora</div>
                  <div className="text-xs text-blue-600 mt-1">Pico de actividad</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance by Grade */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="text-lg font-medium text-gray-900">Rendimiento por Curso</h2>
            <Button variant="outline" size="sm" className="btn-responsive">
              <EyeIcon className="h-4 w-4 mr-2" />
              Ver detalles
            </Button>
          </div>
          <ResponsiveTable
            columns={[
              {
                key: 'grade',
                label: 'Curso',
                render: (value: string) => (
                  <div className="text-sm font-medium text-gray-900">{value}</div>
                )
              },
              {
                key: 'students',
                label: 'Estudiantes',
                hiddenOnMobile: true,
                render: (value: number) => value.toString()
              },
              {
                key: 'avgScore',
                label: 'Promedio',
                render: (value: number) => `${value}%`
              },
              {
                key: 'attendance',
                label: 'Asistencia',
                hiddenOnMobile: true,
                render: (value: number) => `${value}%`
              },
              {
                key: 'status',
                label: 'Estado',
                render: (value: string) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    value === 'excellent' ? 'bg-green-100 text-green-800' :
                    value === 'good' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {value === 'excellent' ? 'Excelente' :
                     value === 'good' ? 'Bueno' : 'Atención'}
                  </span>
                )
              }
            ]}
            data={classPerformance}
            keyExtractor={(row, index) => index.toString()}
            className="border-0 shadow-none"
          />
        </div>

        {/* Teacher Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Profesores Destacados</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-600">{teacher.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {teacher.quizzes} quizzes • {teacher.avgScore}% promedio
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TrophyIcon className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{teacher.engagement}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'achievement' ? 'bg-green-400' :
                      activity.type === 'alert' ? 'bg-yellow-400' :
                      'bg-blue-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.teacher}</span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">Hace {activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas de Dirección</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => window.location.href = '/school/users'}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <UsersIcon className="h-6 w-6" />
                <span>Gestionar Usuarios</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/school/classes'}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <AcademicCapIcon className="h-6 w-6" />
                <span>Gestión de Clases</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/school/reports'}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <ChartBarIcon className="h-6 w-6" />
                <span>Reportes Académicos</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/school/lesson-plans'}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <BookOpenIcon className="h-6 w-6" />
                <span>Planificaciones</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 