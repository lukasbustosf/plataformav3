'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Class {
  class_id: string
  name: string
  grade: string
  subject: string
  teacher_name: string
  teacher_id: string
  student_count: number
  schedule: string
  room: string
  year: number
  semester: string
  active: boolean
  avg_attendance: number
  avg_grade: number
  total_lessons: number
  completed_lessons: number
}

export default function SchoolClassesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL')
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [selectedSemester, setSelectedSemester] = useState<string>('2024-2')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  // Mock data for demonstration
  const mockClasses: Class[] = [
    {
      class_id: 'class-001',
      name: '8°A - Matemáticas',
      grade: '8° Básico',
      subject: 'Matemáticas',
      teacher_name: 'María González',
      teacher_id: 'teacher-001',
      student_count: 32,
      schedule: 'Lun, Mié, Vie 08:00-09:30',
      room: 'Sala 201',
      year: 2024,
      semester: '2024-2',
      active: true,
      avg_attendance: 94.5,
      avg_grade: 78.2,
      total_lessons: 45,
      completed_lessons: 38
    },
    {
      class_id: 'class-002',
      name: '7°B - Ciencias Naturales',
      grade: '7° Básico',
      subject: 'Ciencias Naturales',
      teacher_name: 'Carlos Ruiz',
      teacher_id: 'teacher-002',
      student_count: 28,
      schedule: 'Mar, Jue 10:00-11:30',
      room: 'Lab. Ciencias',
      year: 2024,
      semester: '2024-2',
      active: true,
      avg_attendance: 92.8,
      avg_grade: 82.1,
      total_lessons: 40,
      completed_lessons: 34
    },
    {
      class_id: 'class-003',
      name: '1°M - Historia',
      grade: '1° Medio',
      subject: 'Historia',
      teacher_name: 'Elena Vargas',
      teacher_id: 'teacher-003',
      student_count: 35,
      schedule: 'Lun, Mié 14:00-15:30',
      room: 'Sala 105',
      year: 2024,
      semester: '2024-2',
      active: true,
      avg_attendance: 89.1,
      avg_grade: 75.9,
      total_lessons: 42,
      completed_lessons: 35
    },
    {
      class_id: 'class-004',
      name: '6°A - Lenguaje',
      grade: '6° Básico',
      subject: 'Lenguaje y Comunicación',
      teacher_name: 'Ana López',
      teacher_id: 'teacher-004',
      student_count: 30,
      schedule: 'Lun-Vie 09:45-10:30',
      room: 'Sala 103',
      year: 2024,
      semester: '2024-2',
      active: true,
      avg_attendance: 96.2,
      avg_grade: 84.7,
      total_lessons: 60,
      completed_lessons: 52
    },
    {
      class_id: 'class-005',
      name: '2°M - Física',
      grade: '2° Medio',
      subject: 'Física',
      teacher_name: 'Roberto Silva',
      teacher_id: 'teacher-005',
      student_count: 26,
      schedule: 'Mar, Jue 11:45-13:15',
      room: 'Lab. Física',
      year: 2024,
      semester: '2024-2',
      active: false,
      avg_attendance: 87.3,
      avg_grade: 71.8,
      total_lessons: 38,
      completed_lessons: 25
    }
  ]

  const grades = ['ALL', '5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio']
  const subjects = ['ALL', 'Matemáticas', 'Lenguaje y Comunicación', 'Ciencias Naturales', 'Historia', 'Física', 'Química', 'Biología', 'Inglés']

  const filteredClasses = mockClasses.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.room.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGrade = selectedGrade === 'ALL' || cls.grade === selectedGrade
    const matchesSubject = selectedSubject === 'ALL' || cls.subject === selectedSubject
    
    return matchesSearch && matchesGrade && matchesSubject
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'text-green-600'
    if (attendance >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 80) return 'text-green-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleCreateClass = () => {
    setShowCreateModal(true)
  }

  const handleEditClass = (cls: Class) => {
    setSelectedClass(cls)
    setShowEditModal(true)
  }

  const handleDeleteClass = (classId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta clase?')) {
      toast.success('Clase eliminada correctamente')
    }
  }

  const handleToggleClassStatus = (classId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    if (confirm(`¿Estás seguro de que deseas ${action} esta clase?`)) {
      toast.success(`Clase ${action}da correctamente`)
    }
  }

  const handleViewDetails = (cls: Class) => {
    toast.success(`Abriendo detalles de ${cls.name}`)
    // In real app, navigate to class details page
  }

  const activeClasses = mockClasses.filter(c => c.active).length
  const totalStudents = mockClasses.reduce((sum, c) => sum + c.student_count, 0)
  const avgAttendance = mockClasses.reduce((sum, c) => sum + c.avg_attendance, 0) / mockClasses.length
  const avgGrade = mockClasses.reduce((sum, c) => sum + c.avg_grade, 0) / mockClasses.length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Clases 📚</h1>
                <p className="text-gray-600 mt-1">
                  Administra las clases, horarios y asignaciones de profesores
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleCreateClass}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nueva Clase
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeClasses}</div>
              <div className="text-sm text-gray-600">Clases Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
              <div className="text-sm text-gray-600">Total Estudiantes</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getAttendanceColor(avgAttendance)}`}>
                {avgAttendance.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Asistencia Promedio</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getGradeColor(avgGrade)}`}>
                {avgGrade.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Nota Promedio</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar clase
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre, profesor o sala..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por grado
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>
                    {grade === 'ALL' ? 'Todos los grados' : grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por materia
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'ALL' ? 'Todas las materias' : subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semestre
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="2024-2">2024 - Segundo Semestre</option>
                <option value="2024-1">2024 - Primer Semestre</option>
                <option value="2023-2">2023 - Segundo Semestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.class_id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BookOpenIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500">{cls.grade}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {cls.active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Inactiva
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">{cls.teacher_name}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    <span>{cls.student_count} estudiantes</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{cls.schedule}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{cls.room}</span>
                  </div>
                </div>

                {/* Progress and Stats */}
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progreso del curso</span>
                      <span className="font-medium">{cls.completed_lessons}/{cls.total_lessons}</span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor((cls.completed_lessons / cls.total_lessons) * 100)}`}
                        style={{ width: `${(cls.completed_lessons / cls.total_lessons) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Asistencia</span>
                      <div className={`font-semibold ${getAttendanceColor(cls.avg_attendance)}`}>
                        {cls.avg_attendance.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Nota promedio</span>
                      <div className={`font-semibold ${getGradeColor(cls.avg_grade)}`}>
                        {cls.avg_grade.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewDetails(cls)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Ver detalles
                  </Button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClass(cls)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar clase"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.class_id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar clase"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clases</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o crear una nueva clase.
              </p>
            </div>
          </div>
        )}

        {/* Results summary */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredClasses.length} de {mockClasses.length} clases
            </span>
            <span>
              Semestre actual: {selectedSemester}
            </span>
          </div>
        </div>
      </div>

      {/* Create Class Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nueva Clase</h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de creación de clases en desarrollo.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal - Placeholder */}
      {showEditModal && selectedClass && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Editar Clase: {selectedClass.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de edición de clases en desarrollo.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedClass(null)
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 