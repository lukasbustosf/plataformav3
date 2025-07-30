'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function TeacherAssignmentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')

  const subjects = ['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés']
  const classes = ['8° A', '8° B', '7° A', '7° B']

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Resolución de Ecuaciones Lineales',
      subject: 'Matemáticas',
      class: '8° A',
      type: 'homework',
      description: 'Resolver los ejercicios del capítulo 5, problemas 1-20',
      dueDate: '2024-01-25T23:59:00Z',
      assignedDate: '2024-01-20T10:00:00Z',
      status: 'active',
      totalStudents: 25,
      submitted: 18,
      graded: 12,
      averageGrade: 6.4,
      attachments: ['ejercicios_cap5.pdf', 'rubrica_evaluacion.pdf'],
      instructions: 'Resuelve cada ejercicio mostrando todos los pasos. Usa lápiz y papel, toma fotos claras de tu trabajo.',
      points: 50
    },
    {
      id: 2,
      title: 'Ensayo sobre la Independencia de Chile',
      subject: 'Historia',
      class: '8° B',
      type: 'project',
      description: 'Ensayo argumentativo de 800 palabras sobre las causas de la independencia',
      dueDate: '2024-01-28T23:59:00Z',
      assignedDate: '2024-01-15T09:00:00Z',
      status: 'active',
      totalStudents: 23,
      submitted: 8,
      graded: 3,
      averageGrade: 6.8,
      attachments: ['instrucciones_ensayo.pdf', 'fuentes_recomendadas.pdf'],
      instructions: 'Mínimo 800 palabras, formato APA, incluir al menos 3 fuentes bibliográficas.',
      points: 100
    },
    {
      id: 3,
      title: 'Experimento de Densidad',
      subject: 'Ciencias',
      class: '7° A',
      type: 'lab',
      description: 'Informe de laboratorio sobre experimento de densidad de diferentes materiales',
      dueDate: '2024-01-22T14:00:00Z',
      assignedDate: '2024-01-18T11:00:00Z',
      status: 'overdue',
      totalStudents: 28,
      submitted: 25,
      graded: 25,
      averageGrade: 6.2,
      attachments: ['protocolo_lab.pdf', 'plantilla_informe.docx'],
      instructions: 'Completar el informe usando la plantilla proporcionada. Incluir datos, cálculos y conclusiones.',
      points: 75
    }
  ]

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || assignment.subject === selectedSubject
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus
    const matchesClass = selectedClass === 'all' || assignment.class === selectedClass
    
    return matchesSearch && matchesSubject && matchesStatus && matchesClass
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-700 bg-blue-100'
      case 'overdue': return 'text-red-700 bg-red-100'
      case 'completed': return 'text-green-700 bg-green-100'
      case 'draft': return 'text-yellow-700 bg-yellow-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'overdue': return 'Vencido'
      case 'completed': return 'Completado'
      case 'draft': return 'Borrador'
      default: return status
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'text-purple-700 bg-purple-100'
      case 'project': return 'text-orange-700 bg-orange-100'
      case 'lab': return 'text-green-700 bg-green-100'
      case 'quiz': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'homework': return 'Tarea'
      case 'project': return 'Proyecto'
      case 'lab': return 'Laboratorio'
      case 'quiz': return 'Evaluación'
      default: return type
    }
  }

  const handleCreateAssignment = () => {
    router.push('/teacher/assignments/create')
  }

  const handleViewAssignment = (assignmentId: number) => {
    router.push(`/teacher/assignments/${assignmentId}`)
  }

  const handleEditAssignment = (assignmentId: number) => {
    router.push(`/teacher/assignments/${assignmentId}/edit`)
  }

  const handleGradeAssignment = (assignmentId: number) => {
    router.push(`/teacher/assignments/${assignmentId}/grade`)
  }

  const handleDeleteAssignment = (assignmentId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      toast.success('Tarea eliminada exitosamente')
    }
  }

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
    pendingGrading: assignments.reduce((acc, a) => acc + (a.submitted - a.graded), 0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tareas y Proyectos</h1>
            <p className="text-gray-600">Gestiona las tareas y proyectos de tus estudiantes</p>
          </div>
          <Button
            onClick={handleCreateAssignment}
            leftIcon={<PlusIcon className="h-4 w-4" />}
          >
            Nueva Tarea
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Tareas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Por Calificar</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingGrading}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input"
            >
              <option value="all">Todas las asignaturas</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input"
            >
              <option value="all">Todas las clases</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="overdue">Vencidas</option>
              <option value="completed">Completadas</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                        {getTypeLabel(assignment.type)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {getStatusLabel(assignment.status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {assignment.subject} • {assignment.class}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Vence: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {assignment.points} puntos
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{assignment.description}</p>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-blue-900">{assignment.totalStudents}</div>
                    <div className="text-sm text-blue-600">Estudiantes</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-green-900">{assignment.submitted}</div>
                    <div className="text-sm text-green-600">Entregadas</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-purple-900">{assignment.graded}</div>
                    <div className="text-sm text-purple-600">Calificadas</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-bold text-orange-900">
                      {assignment.averageGrade ? assignment.averageGrade.toFixed(1) : '-'}
                    </div>
                    <div className="text-sm text-orange-600">Promedio</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso de entrega</span>
                    <span>{Math.round((assignment.submitted / assignment.totalStudents) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(assignment.submitted / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    {assignment.attachments.map((attachment, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        📎 {attachment}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAssignment(assignment.id)}
                      leftIcon={<EyeIcon className="h-4 w-4" />}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGradeAssignment(assignment.id)}
                      leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                    >
                      Calificar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAssignment(assignment.id)}
                      leftIcon={<PencilIcon className="h-4 w-4" />}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No se encontraron tareas</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSubject !== 'all' || selectedClass !== 'all' || selectedStatus !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda.'
                : 'Comienza creando tu primera tarea.'}
            </p>
            <Button
              onClick={handleCreateAssignment}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Crear Primera Tarea
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 