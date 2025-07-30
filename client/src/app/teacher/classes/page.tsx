'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { 
  PlusIcon, 
  UsersIcon, 
  ChartBarIcon, 
  EyeIcon,
  PencilIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
  PlayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

interface LessonPlan {
  plan_id: string
  plan_date: string
  oa_ids: string[]
  objective_summary: string
  intro_md: string
  desarrollo_md: string
  cierre_md: string
  status: 'draft' | 'published' | 'completed'
}

interface Student {
  student_id: string
  first_name: string
  last_name: string
  email: string
  attendance_percentage: number
  avg_grade: number
  last_activity: string
  oa_coverage: number
  risk_level: 'low' | 'medium' | 'high'
}

export default function TeacherClassesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'lessons' | 'attendance' | 'gradebook' | 'reports'>('overview')

  // Debug auth state - no redirects since we're always authenticated as teacher
  useEffect(() => {
    console.log('=== TEACHER CLASSES PAGE LOAD ===')
    console.log('Auth state:', { isAuthenticated, isLoading, userRole: user?.role, userEmail: user?.email })
    console.log('User object:', user)
  }, [isAuthenticated, isLoading, user])

  const { data: classesData, isLoading: classesLoading } = useQuery(
    ['teacher-classes-detailed'],
    () => api.getClasses(),
    { enabled: !!user?.user_id }
  )

  const classes = classesData?.classes || []

  // Mock data for comprehensive demonstration
  const mockStudents: Student[] = [
    {
      student_id: '1',
      first_name: 'María',
      last_name: 'González',
      email: 'maria.gonzalez@email.com',
      attendance_percentage: 95.2,
      avg_grade: 6.8,
      last_activity: '2 min',
      oa_coverage: 78,
      risk_level: 'low'
    },
    {
      student_id: '2',
      first_name: 'Carlos',
      last_name: 'Ruiz',
      email: 'carlos.ruiz@email.com',
      attendance_percentage: 88.5,
      avg_grade: 6.2,
      last_activity: '1 hora',
      oa_coverage: 65,
      risk_level: 'medium'
    },
    {
      student_id: '3',
      first_name: 'Ana',
      last_name: 'López',
      email: 'ana.lopez@email.com',
      attendance_percentage: 97.1,
      avg_grade: 7.1,
      last_activity: '30 min',
      oa_coverage: 85,
      risk_level: 'low'
    },
    {
      student_id: '4',
      first_name: 'Pedro',
      last_name: 'Martínez',
      email: 'pedro.martinez@email.com',
      attendance_percentage: 82.3,
      avg_grade: 5.9,
      last_activity: '2 días',
      oa_coverage: 45,
      risk_level: 'high'
    },
    {
      student_id: '5',
      first_name: 'Sofía',
      last_name: 'Herrera',
      email: 'sofia.herrera@email.com',
      attendance_percentage: 89.7,
      avg_grade: 6.5,
      last_activity: '15 min',
      oa_coverage: 72,
      risk_level: 'medium'
    }
  ]

  const mockLessonPlans: LessonPlan[] = [
    {
      plan_id: '1',
      plan_date: '2025-06-25',
      oa_ids: ['MAT-05-OA-04', 'MAT-05-OA-05'],
      objective_summary: 'Resolver fracciones equivalentes',
      intro_md: 'Repaso de fracciones básicas mediante ejemplos cotidianos',
      desarrollo_md: 'Actividad práctica con material concreto y ejercicios graduales',
      cierre_md: 'Síntesis y evaluación formativa con quiz interactivo',
      status: 'published'
    },
    {
      plan_id: '2',
      plan_date: '2025-06-26',
      oa_ids: ['MAT-05-OA-06'],
      objective_summary: 'Operaciones con fracciones',
      intro_md: 'Conexión con clase anterior sobre fracciones equivalentes',
      desarrollo_md: 'Práctica de suma y resta de fracciones con denominadores iguales',
      cierre_md: 'Evaluación y asignación de tarea',
      status: 'draft'
    },
    {
      plan_id: '3',
      plan_date: '2025-06-23',
      oa_ids: ['MAT-05-OA-03'],
      objective_summary: 'Números decimales y fracciones',
      intro_md: 'Relación entre decimales y fracciones',
      desarrollo_md: 'Conversión entre representaciones numéricas',
      cierre_md: 'Juego de conversiones',
      status: 'completed'
    }
  ]

  const mockAttendance = [
    { date: '2025-06-23', present: 23, absent: 2, late: 0, justified: 1 },
    { date: '2025-06-24', present: 25, absent: 1, late: 1, justified: 0 },
    { date: '2025-06-25', present: 24, absent: 1, late: 2, justified: 0 },
  ]

  const mockGradebook = [
    {
      evaluation_id: '1',
      title: 'Quiz Fracciones',
      type: 'quiz',
      date: '2025-06-23',
      weight: 10,
      avg_score: 6.4,
      completed: 24,
      pending: 1
    },
    {
      evaluation_id: '2',
      title: 'Tarea Operaciones',
      type: 'task',
      date: '2025-06-24',
      weight: 15,
      avg_score: 6.8,
      completed: 25,
      pending: 0
    },
    {
      evaluation_id: '3',
      title: 'Examen Unidad 2',
      type: 'exam',
      date: '2025-06-25',
      weight: 30,
      avg_score: 6.2,
      completed: 23,
      pending: 2
    }
  ]

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'published': return 'text-blue-600 bg-blue-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const renderTabContent = () => {
    if (!selectedClass) return null

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                  onClick={() => router.push(`/teacher/lesson/create?class=${selectedClass.class_id}`)}
                  className="justify-start"
                >
                  Nueva Planificación
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                  onClick={() => setActiveTab('attendance')}
                  className="justify-start"
                >
                  Pasar Lista
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<PlayIcon className="h-4 w-4" />}
                  onClick={() => router.push('/teacher/game/create')}
                  className="justify-start"
                >
                  Crear Juego
                </Button>
              </div>
            </div>

            {/* OA Coverage */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cobertura Curricular (OA)</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Objetivos de Aprendizaje cubiertos</span>
                  <span className="text-sm font-medium text-gray-900">24/32 (75%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">18</div>
                    <div className="text-xs text-gray-500">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">6</div>
                    <div className="text-xs text-gray-500">En Progreso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-600">8</div>
                    <div className="text-xs text-gray-500">Pendientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">3.2</div>
                    <div className="text-xs text-gray-500">Promedio Bloom</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-3">
                {[
                  { type: 'quiz', description: 'Quiz de Fracciones completado por María González', time: '5 min' },
                  { type: 'game', description: 'Trivia Lightning jugado por toda la clase', time: '1 hora' },
                  { type: 'assignment', description: 'Tarea de Operaciones entregada por Carlos Ruiz', time: '2 horas' },
                  { type: 'lesson', description: 'Planificación "Números decimales" publicada', time: '1 día' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'quiz' ? 'bg-blue-500' :
                      activity.type === 'game' ? 'bg-green-500' :
                      activity.type === 'assignment' ? 'bg-orange-500' : 'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">hace {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'students':
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Estudiantes ({mockStudents.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asistencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cobertura OA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Riesgo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Actividad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockStudents.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.attendance_percentage}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.avg_grade}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.oa_coverage}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(student.risk_level)}`}>
                          {student.risk_level === 'high' ? 'Alto' : student.risk_level === 'medium' ? 'Medio' : 'Bajo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        hace {student.last_activity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/teacher/students/${student.student_id}/progress`)}
                        >
                          Ver Progreso
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'lessons':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Planificaciones de Clase</h3>
              <Button
                leftIcon={<PlusIcon className="h-4 w-4" />}
                onClick={() => router.push(`/teacher/lesson/create?class=${selectedClass.class_id}`)}
              >
                Nueva Planificación
              </Button>
            </div>

            <div className="grid gap-6">
              {mockLessonPlans.map((lesson) => (
                <div key={lesson.plan_id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{lesson.objective_summary}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lesson.status)}`}>
                          {lesson.status === 'completed' ? 'Completada' : lesson.status === 'published' ? 'Publicada' : 'Borrador'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{lesson.plan_date}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.oa_ids.map((oa) => (
                          <span key={oa} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            {oa}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div><strong>Inicio:</strong> {lesson.intro_md}</div>
                        <div><strong>Desarrollo:</strong> {lesson.desarrollo_md}</div>
                        <div><strong>Cierre:</strong> {lesson.cierre_md}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<EyeIcon className="h-4 w-4" />}
                        onClick={() => router.push(`/teacher/lesson/${lesson.plan_id}/view`)}
                      >
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<PencilIcon className="h-4 w-4" />}
                        onClick={() => router.push(`/teacher/lesson/${lesson.plan_id}/edit`)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Control de Asistencia</h3>
              <Button
                leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              >
                Exportar Registro
              </Button>
            </div>

            {/* Attendance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">92.5%</div>
                <div className="text-sm text-green-600">Asistencia Promedio</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <UsersIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">24</div>
                <div className="text-sm text-blue-600">Estudiantes Hoy</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <XCircleIcon className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-900">1</div>
                <div className="text-sm text-red-600">Ausentes Hoy</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <ClockIcon className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-900">2</div>
                <div className="text-sm text-yellow-600">Atrasos Hoy</div>
              </div>
            </div>

            {/* Daily Attendance */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900">Asistencia Diaria</h4>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {mockAttendance.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900">{day.date}</div>
                      <div className="flex space-x-6 text-sm">
                        <span className="text-green-600">Presentes: {day.present}</span>
                        <span className="text-red-600">Ausentes: {day.absent}</span>
                        <span className="text-yellow-600">Atrasos: {day.late}</span>
                        <span className="text-blue-600">Justificados: {day.justified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'gradebook':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Libro de Notas</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                  onClick={() => router.push('/teacher/assignments/create')}
                >
                  Nueva Evaluación
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
                >
                  Exportar Notas
                </Button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Peso (%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promedio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completadas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockGradebook.map((evaluation) => (
                      <tr key={evaluation.evaluation_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{evaluation.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            evaluation.type === 'exam' ? 'bg-red-100 text-red-800' :
                            evaluation.type === 'quiz' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {evaluation.type === 'exam' ? 'Examen' : evaluation.type === 'quiz' ? 'Quiz' : 'Tarea'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evaluation.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evaluation.weight}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evaluation.avg_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evaluation.completed}/{evaluation.completed + evaluation.pending}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/teacher/assignments/${evaluation.evaluation_id}/grade`)}
                          >
                            Calificar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/teacher/assignments/${evaluation.evaluation_id}`)}
                          >
                            Ver Detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'reports':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Reportes y Analíticas</h3>
            
            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <h4 className="text-lg font-medium text-gray-900">Cobertura OA</h4>
                </div>
                <p className="text-gray-600 mb-4">Reporte semanal de objetivos de aprendizaje cubiertos y análisis Bloom.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/reports')}
                  className="w-full"
                >
                  Generar Reporte
                </Button>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <UsersIcon className="h-8 w-8 text-green-500 mr-3" />
                  <h4 className="text-lg font-medium text-gray-900">Progreso Estudiantes</h4>
                </div>
                <p className="text-gray-600 mb-4">Análisis individual del progreso académico y áreas de mejora.</p>
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('students')}
                  className="w-full"
                >
                  Ver Estudiantes
                </Button>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-8 w-8 text-purple-500 mr-3" />
                  <h4 className="text-lg font-medium text-gray-900">Asistencia</h4>
                </div>
                <p className="text-gray-600 mb-4">Reportes de asistencia, patrones y alertas de ausentismo.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/attendance/report')}
                  className="w-full"
                >
                  Ver Asistencia
                </Button>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <BookOpenIcon className="h-8 w-8 text-orange-500 mr-3" />
                  <h4 className="text-lg font-medium text-gray-900">Libro de Clases</h4>
                </div>
                <p className="text-gray-600 mb-4">Exportar libro de clases digital firmado para compliance legal.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/reports')}
                  className="w-full"
                >
                  Exportar CSV
                </Button>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-indigo-500 mr-3" />
                  <h4 className="text-lg font-medium text-gray-900">Análisis Bloom</h4>
                </div>
                <p className="text-gray-600 mb-4">Niveles de pensamiento crítico desarrollados por la clase.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/analytics')}
                  className="w-full"
                >
                  Ver Análisis
                </Button>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <PlayIcon className="h-8 w-8 text-pink-500 mr-3" />
                  <h4 className="text-lg font-medium text-gray-900">Juegos y Actividades</h4>
                </div>
                <p className="text-gray-600 mb-4">Engagement y resultados de actividades gamificadas.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/teacher/games')}
                  className="w-full"
                >
                  Ver Juegos
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Clases</h1>
            <p className="text-gray-600">Gestiona tus cursos, estudiantes y planificaciones</p>
          </div>
          <Button
            onClick={() => router.push('/teacher/classes/create')}
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Nueva Clase
          </Button>
        </div>

        {classesLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando clases...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No tienes clases asignadas</h2>
            <p className="text-gray-600 mb-6">Contacta al administrador para que te asigne clases.</p>
            <Button
              onClick={() => router.push('/teacher/dashboard')}
              variant="outline"
            >
              Volver al Dashboard
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Classes List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Mis Clases ({classes.length})</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {classes.map((classItem) => (
                    <div
                      key={classItem.class_id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedClass?.class_id === classItem.class_id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}
                      onClick={() => setSelectedClass(classItem)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{classItem.class_name}</h3>
                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-gray-600">
                              {classItem.grade_levels?.grade_name} • {classItem.subjects?.subject_name}
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span className="flex items-center">
                                <UsersIcon className="h-3 w-3 mr-1" />
                                {classItem.students?.length || 25} estudiantes
                              </span>
                              <span className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {classItem.year}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${classItem.active ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-900">92.5%</div>
                          <div className="text-xs text-gray-500">Asistencia</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-900">6.4</div>
                          <div className="text-xs text-gray-500">Promedio</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Class Details */}
            <div className="lg:col-span-3">
              {selectedClass ? (
                <div className="space-y-6">
                  {/* Class Header */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{selectedClass.class_name}</h2>
                        <p className="text-gray-600">
                          {selectedClass.grade_levels?.grade_name} • {selectedClass.subjects?.subject_name}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<PencilIcon className="h-4 w-4" />}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<ChartBarIcon className="h-4 w-4" />}
                        >
                          Reportes
                        </Button>
                      </div>
                    </div>

                    {/* Class Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <UsersIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-900">{selectedClass.students?.length || 25}</div>
                        <div className="text-sm text-blue-600">Estudiantes</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <ClockIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-900">92.5%</div>
                        <div className="text-sm text-green-600">Asistencia</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <AcademicCapIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-900">6.4</div>
                        <div className="text-sm text-purple-600">Promedio</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <DocumentTextIcon className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-900">75%</div>
                        <div className="text-sm text-orange-600">Cobertura OA</div>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        {[
                          { key: 'overview', label: 'Resumen', icon: EyeIcon },
                          { key: 'students', label: 'Estudiantes', icon: UsersIcon },
                          { key: 'lessons', label: 'Planificaciones', icon: BookOpenIcon },
                          { key: 'attendance', label: 'Asistencia', icon: CheckCircleIcon },
                          { key: 'gradebook', label: 'Notas', icon: AcademicCapIcon },
                          { key: 'reports', label: 'Reportes', icon: ChartBarIcon }
                        ].map((tab) => {
                          const Icon = tab.icon
                          return (
                            <button
                              key={tab.key}
                              onClick={() => setActiveTab(tab.key as any)}
                              className={`${
                                activeTab === tab.key
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{tab.label}</span>
                            </button>
                          )
                        })}
                      </nav>
                    </div>
                  </div>

                  {/* Tab Content */}
                  {renderTabContent()}
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg p-12 text-center">
                  <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una clase</h3>
                  <p className="text-gray-600">Elige una clase de la lista para ver sus detalles y gestionar estudiantes.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 