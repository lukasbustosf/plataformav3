'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UsersIcon,
  EyeIcon,
  PencilIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  BookOpenIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

interface Student {
  id: string
  name: string
  email: string
  rut: string
  class: string
  grade: string
  averageGrade: number
  attendance: number
  lastActivity: string
  status: 'active' | 'at_risk' | 'excellent' | 'needs_attention'
  totalAssignments: number
  completedAssignments: number
  gamesPlayed: number
  achievements: number
  lastLogin: string
  guardian: {
    name: string
    email: string
    phone: string
  }
}

export default function TeacherStudentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Debug auth state - no redirects since we're always authenticated as teacher
  useEffect(() => {
    console.log('=== TEACHER STUDENTS PAGE LOAD ===')
    console.log('Auth state:', { isAuthenticated, isLoading, userRole: user?.role, userEmail: user?.email })
    console.log('User object:', user)
  }, [isAuthenticated, isLoading, user])

  // Fetch classes
  const { data: classesData } = useQuery(
    ['teacher-classes'],
    () => api.getClasses(),
    { enabled: !!user?.user_id }
  )

  const classes = classesData?.classes || []

  // Mock students data
  const mockStudents: Student[] = [
    {
      id: '1',
      name: 'Ana García López',
      email: 'ana.garcia@colegio.cl',
      rut: '12.345.678-9',
      class: '5°A',
      grade: '5°',
      averageGrade: 6.5,
      attendance: 95,
      lastActivity: '2024-01-19T14:30:00Z',
      status: 'excellent',
      totalAssignments: 15,
      completedAssignments: 14,
      gamesPlayed: 23,
      achievements: 8,
      lastLogin: '2024-01-19T08:15:00Z',
      guardian: {
        name: 'María López',
        email: 'maria.lopez@email.com',
        phone: '+56 9 8765 4321'
      }
    },
    {
      id: '2',
      name: 'Carlos Martín Ruiz',
      email: 'carlos.martin@colegio.cl',
      rut: '11.234.567-8',
      class: '5°A',
      grade: '5°',
      averageGrade: 4.2,
      attendance: 78,
      lastActivity: '2024-01-17T16:45:00Z',
      status: 'at_risk',
      totalAssignments: 15,
      completedAssignments: 8,
      gamesPlayed: 5,
      achievements: 2,
      lastLogin: '2024-01-17T09:30:00Z',
      guardian: {
        name: 'Pedro Ruiz',
        email: 'pedro.ruiz@email.com',
        phone: '+56 9 7654 3210'
      }
    },
    {
      id: '3',
      name: 'Sofía Hernández Silva',
      email: 'sofia.hernandez@colegio.cl',
      rut: '13.456.789-0',
      class: '5°A',
      grade: '5°',
      averageGrade: 5.8,
      attendance: 88,
      lastActivity: '2024-01-19T11:20:00Z',
      status: 'active',
      totalAssignments: 15,
      completedAssignments: 12,
      gamesPlayed: 18,
      achievements: 5,
      lastLogin: '2024-01-19T07:45:00Z',
      guardian: {
        name: 'Carmen Silva',
        email: 'carmen.silva@email.com',
        phone: '+56 9 6543 2109'
      }
    },
    {
      id: '4',
      name: 'Diego Morales Torres',
      email: 'diego.morales@colegio.cl',
      rut: '14.567.890-1',
      class: '5°B',
      grade: '5°',
      averageGrade: 6.8,
      attendance: 92,
      lastActivity: '2024-01-19T13:15:00Z',
      status: 'excellent',
      totalAssignments: 15,
      completedAssignments: 15,
      gamesPlayed: 31,
      achievements: 12,
      lastLogin: '2024-01-19T08:00:00Z',
      guardian: {
        name: 'Luis Torres',
        email: 'luis.torres@email.com',
        phone: '+56 9 5432 1098'
      }
    }
  ]

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rut.includes(searchTerm)
    const matchesClass = selectedClass === 'all' || student.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus
    
    return matchesSearch && matchesClass && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'at_risk': return 'bg-red-100 text-red-800'
      case 'needs_attention': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircleIcon className="h-4 w-4" />
      case 'active': return <ClockIcon className="h-4 w-4" />
      case 'at_risk': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'needs_attention': return <ExclamationTriangleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente'
      case 'active': return 'Activo'
      case 'at_risk': return 'En Riesgo'
      case 'needs_attention': return 'Necesita Atención'
      default: return 'Activo'
    }
  }

  const handleViewProgress = (studentId: string) => {
    router.push(`/teacher/students/${studentId}/progress`)
  }

  const handleSendMessage = (studentId: string) => {
    router.push(`/teacher/messages/compose?student=${studentId}`)
  }

  const handleExportData = () => {
    toast.success('Exportando datos de estudiantes...')
  }

  const handleBulkAction = (action: string) => {
    if (selectedStudents.length === 0) {
      toast.error('Selecciona al menos un estudiante')
      return
    }
    
    switch (action) {
      case 'message':
        router.push(`/teacher/messages/compose?students=${selectedStudents.join(',')}`)
        break
      case 'assignment':
        router.push(`/teacher/assignments/create?students=${selectedStudents.join(',')}`)
        break
      default:
        toast.success(`Acción ${action} aplicada a ${selectedStudents.length} estudiantes`)
    }
  }

  const stats = {
    total: mockStudents.length,
    excellent: mockStudents.filter(s => s.status === 'excellent').length,
    active: mockStudents.filter(s => s.status === 'active').length,
    atRisk: mockStudents.filter(s => s.status === 'at_risk').length,
    averageGrade: mockStudents.reduce((acc, s) => acc + s.averageGrade, 0) / mockStudents.length,
    averageAttendance: mockStudents.reduce((acc, s) => acc + s.attendance, 0) / mockStudents.length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Estudiantes</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona y monitorea el progreso de tus estudiantes
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="outline"
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
              onClick={handleExportData}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => router.push('/teacher/students/add')}
            >
              Agregar Estudiante
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Excelentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.excellent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">En Riesgo</p>
                <p className="text-2xl font-bold text-gray-900">{stats.atRisk}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageGrade.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageAttendance.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o RUT..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
              </Button>
              
              {selectedStudents.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('message')}
                  >
                    Enviar Mensaje ({selectedStudents.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('assignment')}
                  >
                    Asignar Tarea ({selectedStudents.length})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clase</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todas las clases</option>
                  {classes.map(cls => (
                    <option key={cls.class_id} value={cls.class_name}>
                      {cls.class_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="excellent">Excelente</option>
                  <option value="active">Activo</option>
                  <option value="at_risk">En Riesgo</option>
                  <option value="needs_attention">Necesita Atención</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(filteredStudents.map(s => s.id))
                        } else {
                          setSelectedStudents([])
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id])
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {student.name.split(' ').map(name => name[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                          <div className="text-xs text-gray-400">{student.rut}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.averageGrade.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">Escala 1-7</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.attendance}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-green-600 h-1.5 rounded-full"
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1">{getStatusText(student.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">Tareas: {student.completedAssignments}/{student.totalAssignments}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Juegos: {student.gamesPlayed}</span>
                          <span className="text-xs text-gray-500">Logros: {student.achievements}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<EyeIcon className="h-3 w-3" />}
                        onClick={() => handleViewProgress(student.id)}
                      >
                        Ver Progreso
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ChatBubbleLeftRightIcon className="h-3 w-3" />}
                        onClick={() => handleSendMessage(student.id)}
                      >
                        Mensaje
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron estudiantes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles del Estudiante
                </h3>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {selectedStudent.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedStudent.email}</p>
                      <p><span className="font-medium">Teléfono:</span> {selectedStudent.phone}</p>
                      <p><span className="font-medium">Clase:</span> {selectedStudent.class}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Apoderado</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nombre:</span> {selectedStudent.guardian.name}</p>
                      <p><span className="font-medium">Teléfono:</span> {selectedStudent.guardian.phone}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/teacher/messages/compose?student=${selectedStudent.id}`)}
                        className="mt-2"
                      >
                        Contactar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-900">{selectedStudent.averageGrade}</div>
                    <div className="text-sm text-blue-600">Promedio General</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-900">{selectedStudent.attendance}%</div>
                    <div className="text-sm text-green-600">Asistencia</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-900">
                      {Math.round((selectedStudent.completedAssignments / selectedStudent.totalAssignments) * 100)}%
                    </div>
                    <div className="text-sm text-purple-600">Actividades</div>
                  </div>
                </div>

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Fortalezas</h4>
                    <div className="space-y-1">
                      {/* Add student strengths rendering logic here */}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Áreas de Mejora</h4>
                    <div className="space-y-1">
                      {/* Add student weaknesses rendering logic here */}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    onClick={() => router.push(`/teacher/students/${selectedStudent.id}/progress`)}
                    leftIcon={<ChartBarIcon className="h-4 w-4" />}
                  >
                    Ver Progreso Completo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 