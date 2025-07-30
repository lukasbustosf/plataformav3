'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  PencilIcon,
  PlusIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const classId = params.id as string

  // Mock class data
  const classData = {
    id: classId,
    name: 'Matemáticas 8° A',
    grade: '8° Básico',
    subject: 'Matemáticas',
    schedule: [
      { day: 'Lunes', time: '08:00 - 08:45' },
      { day: 'Miércoles', time: '10:30 - 11:15' },
      { day: 'Viernes', time: '09:00 - 09:45' }
    ],
    room: 'Aula 205',
    students: 28,
    description: 'Curso de matemáticas para 8° básico enfocado en álgebra, geometría y estadística.',
    currentUnit: 'Ecuaciones lineales',
    nextClass: '2024-01-22 08:00',
    stats: {
      attendance: 94.2,
      averageGrade: 6.1,
      completedLessons: 15,
      totalLessons: 20,
      activeAssignments: 3,
      pendingGrades: 8
    },
    recentStudents: [
      { id: 1, name: 'Ana García', avatar: null, attendance: 96, grade: 6.8, status: 'excellent' },
      { id: 2, name: 'Carlos López', avatar: null, attendance: 89, grade: 5.9, status: 'good' },
      { id: 3, name: 'María González', avatar: null, attendance: 92, grade: 6.5, status: 'excellent' },
      { id: 4, name: 'Pedro Silva', avatar: null, attendance: 85, grade: 5.2, status: 'attention' },
      { id: 5, name: 'Sofía Martín', avatar: null, attendance: 98, grade: 6.9, status: 'excellent' }
    ],
    recentLessons: [
      {
        id: 1,
        title: 'Introducción a Ecuaciones',
        date: '2024-01-19',
        status: 'completed',
        attendance: 26
      },
      {
        id: 2,
        title: 'Resolución de Ecuaciones Simples',
        date: '2024-01-17',
        status: 'completed',
        attendance: 28
      },
      {
        id: 3,
        title: 'Sistemas de Ecuaciones',
        date: '2024-01-22',
        status: 'scheduled',
        attendance: null
      }
    ],
    assignments: [
      {
        id: 1,
        title: 'Ejercicios de Ecuaciones',
        dueDate: '2024-01-25',
        submitted: 18,
        total: 28,
        status: 'active'
      },
      {
        id: 2,
        title: 'Quiz - Álgebra Básica',
        dueDate: '2024-01-30',
        submitted: 0,
        total: 28,
        status: 'pending'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-blue-100 text-blue-800'
      case 'attention': return 'bg-yellow-100 text-yellow-800'
      case 'concern': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente'
      case 'good': return 'Bueno'
      case 'attention': return 'Atención'
      case 'concern': return 'Preocupante'
      default: return 'Sin datos'
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-gray-600">{classData.grade} • {classData.room}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/teacher/classes/${classId}/attendance`)}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
            >
              Tomar Asistencia
            </Button>
            <Button
              onClick={() => router.push(`/teacher/classes/${classId}/edit`)}
              leftIcon={<PencilIcon className="h-4 w-4" />}
            >
              Editar Clase
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{classData.students}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{classData.stats.attendance}%</p>
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
                <p className="text-2xl font-bold text-gray-900">{classData.stats.averageGrade}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classData.stats.completedLessons}/{classData.stats.totalLessons}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Overview */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Clase</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Detalles Generales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Asignatura:</span>
                      <span className="font-medium">{classData.subject}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grado:</span>
                      <span className="font-medium">{classData.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aula:</span>
                      <span className="font-medium">{classData.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unidad Actual:</span>
                      <span className="font-medium">{classData.currentUnit}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Horarios</h4>
                  <div className="space-y-2">
                    {classData.schedule.map((schedule, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{schedule.day}:</span>
                        <span className="font-medium">{schedule.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700">{classData.description}</p>
              </div>
            </div>

            {/* Recent Lessons */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Clases Recientes</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/teacher/lesson/create')}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Nueva Clase
                </Button>
              </div>
              
              <div className="space-y-3">
                {classData.recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(lesson.date).toLocaleDateString()}
                          {lesson.attendance && ` • ${lesson.attendance} estudiantes`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                        lesson.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lesson.status === 'completed' ? 'Completada' :
                         lesson.status === 'scheduled' ? 'Programada' : 'Borrador'}
                      </span>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignments */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tareas y Evaluaciones</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/teacher/assignments/create')}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Nueva Tarea
                </Button>
              </div>
              
              <div className="space-y-3">
                {classData.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-sm text-gray-600">
                          Entrega: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right text-sm">
                        <p className="font-medium">{assignment.submitted}/{assignment.total}</p>
                        <p className="text-gray-600">entregadas</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(`/teacher/classes/${classId}/attendance`)}
                  leftIcon={<CalendarIcon className="h-4 w-4" />}
                >
                  Tomar Asistencia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/teacher/quiz/create')}
                  leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                >
                  Crear Quiz
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/teacher/game/create')}
                  leftIcon={<PlayIcon className="h-4 w-4" />}
                >
                  Crear Juego
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/teacher/lesson/create')}
                  leftIcon={<BookOpenIcon className="h-4 w-4" />}
                >
                  Planificar Clase
                </Button>
              </div>
            </div>

            {/* Recent Students */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudiantes Destacados</h3>
              <div className="space-y-3">
                {classData.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-600">
                          {student.attendance}% asistencia • Nota {student.grade}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {getStatusLabel(student.status)}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => router.push('/teacher/students')}
              >
                Ver Todos los Estudiantes
              </Button>
            </div>

            {/* Next Class */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próxima Clase</h3>
              <div className="text-center py-4">
                <CalendarIcon className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900">
                  {new Date(classData.nextClass).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(classData.nextClass).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-600 mt-2">{classData.room}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => toast.success('Recordatorio configurado')}
              >
                Configurar Recordatorio
              </Button>
            </div>

            {/* Analytics */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tareas pendientes:</span>
                  <span className="font-medium">{classData.stats.activeAssignments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Por calificar:</span>
                  <span className="font-medium">{classData.stats.pendingGrades}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progreso del curso:</span>
                  <span className="font-medium">
                    {Math.round((classData.stats.completedLessons / classData.stats.totalLessons) * 100)}%
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => router.push('/teacher/analytics')}
                leftIcon={<ChartBarIcon className="h-4 w-4" />}
              >
                Ver Análisis Completo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 