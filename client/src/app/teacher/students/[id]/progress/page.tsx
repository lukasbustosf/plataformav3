'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function StudentProgressPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('month')

  const studentId = params.id as string

  // Mock student progress data
  const student = {
    id: studentId,
    name: 'María González Silva',
    email: 'maria.gonzalez@email.com',
    class: '8° A',
    avatar: null,
    enrollmentDate: '2024-03-01',
    guardian: 'Carmen Silva',
    guardianPhone: '+56 9 8765 4321',
    performance: {
      overall: 85.2,
      trend: 2.3,
      lastWeek: 87.5,
      lastMonth: 83.1
    },
    subjects: [
      {
        name: 'Matemáticas',
        grade: 6.2,
        progress: 78,
        assignments: 12,
        quizzes: 8,
        lastActivity: '2024-01-18',
        trend: 'up'
      },
      {
        name: 'Lenguaje',
        grade: 5.8,
        progress: 85,
        assignments: 10,
        quizzes: 6,
        lastActivity: '2024-01-17',
        trend: 'down'
      },
      {
        name: 'Ciencias',
        grade: 6.5,
        progress: 92,
        assignments: 8,
        quizzes: 5,
        lastActivity: '2024-01-19',
        trend: 'up'
      },
      {
        name: 'Historia',
        grade: 5.5,
        progress: 65,
        assignments: 6,
        quizzes: 4,
        lastActivity: '2024-01-15',
        trend: 'down'
      }
    ],
    attendance: {
      rate: 92.3,
      present: 36,
      absent: 3,
      late: 1,
      total: 40
    },
    recentActivities: [
      {
        type: 'quiz',
        subject: 'Matemáticas',
        title: 'Quiz: Fracciones',
        score: 85,
        date: '2024-01-18',
        status: 'completed'
      },
      {
        type: 'assignment',
        subject: 'Lenguaje',
        title: 'Ensayo: Análisis literario',
        score: 78,
        date: '2024-01-17',
        status: 'graded'
      },
      {
        type: 'game',
        subject: 'Ciencias',
        title: 'Juego: Sistema Solar',
        score: 95,
        date: '2024-01-16',
        status: 'completed'
      }
    ],
    achievements: [
      {
        title: 'Participación Activa',
        description: 'Ha participado en más del 90% de las actividades',
        icon: '🎯',
        date: '2024-01-15'
      },
      {
        title: 'Mejor Puntaje',
        description: 'Obtuvo el mejor puntaje en Ciencias esta semana',
        icon: '🏆',
        date: '2024-01-14'
      }
    ],
    areas: {
      strengths: ['Ciencias', 'Participación en clase', 'Puntualidad'],
      improvements: ['Historia', 'Tareas escritas', 'Trabajo en equipo']
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <ChartBarIcon className="h-4 w-4 text-green-500" /> : 
      <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <BookOpenIcon className="h-4 w-4 text-blue-500" />
      case 'assignment': return <AcademicCapIcon className="h-4 w-4 text-green-500" />
      case 'game': return <PlayIcon className="h-4 w-4 text-purple-500" />
      default: return <BookOpenIcon className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Volver
            </Button>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-gray-600">{student.class} • Progreso Académico</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
            </select>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rendimiento General</p>
                <p className="text-2xl font-bold text-gray-900">{student.performance.overall}%</p>
                <div className="flex items-center text-sm text-green-600">
                  <ChartBarIcon className="h-3 w-3 mr-1" />
                  +{student.performance.trend}%
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{student.attendance.rate}%</p>
                <p className="text-sm text-gray-500">{student.attendance.present}/{student.attendance.total} días</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Promedio Notas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(student.subjects.reduce((acc, s) => acc + s.grade, 0) / student.subjects.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">4 asignaturas</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Logros</p>
                <p className="text-2xl font-bold text-gray-900">{student.achievements.length}</p>
                <p className="text-sm text-gray-500">Este mes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Asignatura</h3>
          <div className="space-y-4">
            {student.subjects.map((subject, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{subject.name}</h4>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">Nota: {subject.grade}</p>
                    <p className="text-sm text-gray-600">Progreso: {subject.progress}%</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${
                      subject.progress >= 80 ? 'bg-green-500' :
                      subject.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{subject.assignments}</span> tareas
                  </div>
                  <div>
                    <span className="font-medium">{subject.quizzes}</span> quizzes
                  </div>
                  <div>
                    Última actividad: {new Date(subject.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividades Recientes</h3>
            <div className="space-y-4">
              {student.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.subject} • {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{activity.score}%</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.status === 'completed' ? 'Completado' :
                       activity.status === 'graded' ? 'Calificado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logros Recientes</h3>
            <div className="space-y-4">
              {student.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths and Areas for Improvement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              Fortalezas
            </h3>
            <div className="space-y-2">
              {student.areas.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-900">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-2" />
              Áreas de Mejora
            </h3>
            <div className="space-y-2">
              {student.areas.improvements.map((improvement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-900">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => toast.success('Enviando mensaje al apoderado...')}
          >
            Contactar Apoderado
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.success('Generando reporte...')}
          >
            Generar Reporte
          </Button>
          <Button
            onClick={() => router.push('/teacher/students')}
          >
            Volver a Estudiantes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
} 