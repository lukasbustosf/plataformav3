'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon,
  ClockIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ViewColumnsIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface TimetableEntry {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  duration_minutes: number
  subject: string
  teacher_name: string
  teacher_id: string
  class_name: string
  grade: string
  room: string
  active: boolean
}

interface TimeSlot {
  start: string
  end: string
  label: string
}

export default function TimetablePage() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState('2024-S2')
  const [selectedGrade, setSelectedGrade] = useState('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null)

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  const timeSlots: TimeSlot[] = [
    { start: '08:00', end: '08:45', label: '1° Bloque' },
    { start: '08:45', end: '09:30', label: '2° Bloque' },
    { start: '09:30', end: '09:45', label: 'Recreo' },
    { start: '09:45', end: '10:30', label: '3° Bloque' },
    { start: '10:30', end: '11:15', label: '4° Bloque' },
    { start: '11:15', end: '11:30', label: 'Recreo' },
    { start: '11:30', end: '12:15', label: '5° Bloque' },
    { start: '12:15', end: '13:00', label: '6° Bloque' },
    { start: '13:00', end: '14:00', label: 'Almuerzo' },
    { start: '14:00', end: '14:45', label: '7° Bloque' },
    { start: '14:45', end: '15:30', label: '8° Bloque' },
    { start: '15:30', end: '16:15', label: '9° Bloque' },
    { start: '16:15', end: '17:00', label: '10° Bloque' }
  ]

  const grades = ['ALL', '5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio']

  // Mock timetable data
  const mockTimetable: TimetableEntry[] = [
    {
      id: 'tt-001',
      day_of_week: 1,
      start_time: '08:00',
      end_time: '09:30',
      duration_minutes: 90,
      subject: 'Matemáticas',
      teacher_name: 'María González',
      teacher_id: 'teacher-001',
      class_name: '8°A',
      grade: '8° Básico',
      room: 'Sala 201',
      active: true
    },
    {
      id: 'tt-002',
      day_of_week: 1,
      start_time: '09:45',
      end_time: '11:15',
      duration_minutes: 90,
      subject: 'Lenguaje',
      teacher_name: 'Ana López',
      teacher_id: 'teacher-002',
      class_name: '8°A',
      grade: '8° Básico',
      room: 'Sala 201',
      active: true
    },
    {
      id: 'tt-003',
      day_of_week: 2,
      start_time: '08:00',
      end_time: '09:30',
      duration_minutes: 90,
      subject: 'Ciencias',
      teacher_name: 'Carlos Ruiz',
      teacher_id: 'teacher-003',
      class_name: '8°A',
      grade: '8° Básico',
      room: 'Lab. Ciencias',
      active: true
    },
    {
      id: 'tt-004',
      day_of_week: 3,
      start_time: '14:00',
      end_time: '15:30',
      duration_minutes: 90,
      subject: 'Historia',
      teacher_name: 'Elena Vargas',
      teacher_id: 'teacher-004',
      class_name: '1°M',
      grade: '1° Medio',
      room: 'Sala 105',
      active: true
    }
  ]

  const filteredTimetable = mockTimetable.filter(entry => {
    if (selectedGrade === 'ALL') return true
    return entry.grade === selectedGrade
  })

  const getTimetableForDayAndTime = (day: number, timeSlot: TimeSlot) => {
    return filteredTimetable.find(entry => 
      entry.day_of_week === day + 1 && 
      entry.start_time === timeSlot.start
    )
  }

  const handleCreateEntry = () => {
    setSelectedEntry(null)
    setShowCreateModal(true)
  }

  const handleEditEntry = (entry: TimetableEntry) => {
    setSelectedEntry(entry)
    setShowCreateModal(true)
  }

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta entrada del horario?')) {
      toast.success('Entrada eliminada del horario')
      // In real app: API call to delete entry
    }
  }

  const handleSaveTimetableEntry = (formData: any) => {
    if (selectedEntry) {
      toast.success('Entrada del horario actualizada correctamente')
    } else {
      toast.success('Nueva entrada creada en el horario')
    }
    setShowCreateModal(false)
    setSelectedEntry(null)
  }

  const handleExportTimetable = (format: 'pdf' | 'excel') => {
    toast.success(`Exportando horario en formato ${format.toUpperCase()}...`)
  }

  const handlePrintTimetable = () => {
    toast.success('Enviando horario a impresora...')
  }

  const handleDuplicateWeek = () => {
    if (confirm('¿Deseas duplicar el horario de esta semana para la siguiente?')) {
      toast.success('Horario duplicado correctamente')
    }
  }

  const getSubjectColor = (subject: string) => {
    const colors = {
      'Matemáticas': 'bg-blue-100 text-blue-800 border-blue-200',
      'Lenguaje': 'bg-green-100 text-green-800 border-green-200',
      'Ciencias': 'bg-purple-100 text-purple-800 border-purple-200',
      'Historia': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Inglés': 'bg-pink-100 text-pink-800 border-pink-200',
      'Educación Física': 'bg-red-100 text-red-800 border-red-200',
      'Artes': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const stats = {
    totalClasses: filteredTimetable.length,
    totalHours: Math.round(filteredTimetable.reduce((sum, entry) => sum + entry.duration_minutes, 0) / 60),
    uniqueTeachers: new Set(filteredTimetable.map(entry => entry.teacher_id)).size,
    uniqueSubjects: new Set(filteredTimetable.map(entry => entry.subject)).size
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Horarios 📅</h1>
                <p className="text-gray-600 mt-1">
                  Administra los horarios de clases y distribución semanal
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  variant="outline"
                >
                  <ViewColumnsIcon className="h-5 w-5 mr-2" />
                  {viewMode === 'grid' ? 'Vista Lista' : 'Vista Grilla'}
                </Button>
                <Button
                  onClick={handleCreateEntry}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nueva Clase
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semana Académica
                </label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="2024-S1">2024 - Semestre 1</option>
                  <option value="2024-S2">2024 - Semestre 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Curso
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>
                      {grade === 'ALL' ? 'Todos los cursos' : grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2 mt-6">
                <Button
                  onClick={() => handleExportTimetable('pdf')}
                  variant="outline"
                  size="sm"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button
                  onClick={() => handleExportTimetable('excel')}
                  variant="outline"
                  size="sm"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  Excel
                </Button>
                <Button
                  onClick={handlePrintTimetable}
                  variant="outline"
                  size="sm"
                >
                  <PrinterIcon className="h-4 w-4 mr-1" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Clases:</span>
                <span className="font-medium">{stats.totalClasses}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Horas Semanales:</span>
                <span className="font-medium">{stats.totalHours}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Profesores:</span>
                <span className="font-medium">{stats.uniqueTeachers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Asignaturas:</span>
                <span className="font-medium">{stats.uniqueSubjects}</span>
              </div>
            </div>
            <Button
              onClick={handleDuplicateWeek}
              variant="outline"
              size="sm"
              className="w-full mt-4"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Duplicar Semana
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        {viewMode === 'grid' ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Horario
                    </th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <tr key={timeIndex} className={timeSlot.label.includes('Recreo') || timeSlot.label.includes('Almuerzo') ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{timeSlot.label}</span>
                          <span className="text-gray-500 text-xs">{timeSlot.start} - {timeSlot.end}</span>
                        </div>
                      </td>
                      {days.map((day, dayIndex) => {
                        const entry = getTimetableForDayAndTime(dayIndex, timeSlot)
                        return (
                          <td key={dayIndex} className="px-2 py-2 text-sm">
                            {entry ? (
                              <div className={`rounded-lg border p-3 cursor-pointer hover:shadow-md transition-shadow ${getSubjectColor(entry.subject)}`}>
                                <div className="font-medium text-sm mb-1">{entry.subject}</div>
                                <div className="text-xs opacity-90 mb-1">{entry.class_name}</div>
                                <div className="text-xs opacity-75">{entry.teacher_name}</div>
                                <div className="text-xs opacity-75">{entry.room}</div>
                                <div className="flex justify-end mt-2 space-x-1">
                                  <button
                                    onClick={() => handleEditEntry(entry)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <PencilIcon className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ) : timeSlot.label.includes('Recreo') || timeSlot.label.includes('Almuerzo') ? (
                              <div className="text-center text-gray-400 text-xs p-2">
                                {timeSlot.label}
                              </div>
                            ) : (
                              <button
                                onClick={handleCreateEntry}
                                className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
                              >
                                <PlusIcon className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lista de Clases</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profesor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sala
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTimetable.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${getSubjectColor(entry.subject).split(' ')[0]}`}></div>
                          <span className="text-sm font-medium text-gray-900">{entry.subject}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.class_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.teacher_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{days[entry.day_of_week - 1]}</div>
                          <div className="text-xs text-gray-500">
                            {entry.start_time} - {entry.end_time}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditEntry(entry)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedEntry ? 'Editar Clase' : 'Nueva Clase en Horario'}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asignatura
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Matemáticas</option>
                      <option>Lenguaje</option>
                      <option>Ciencias</option>
                      <option>Historia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curso
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>8°A</option>
                      <option>8°B</option>
                      <option>1°M</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profesor
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>María González</option>
                      <option>Carlos Ruiz</option>
                      <option>Ana López</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sala
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ej: Sala 201"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Día de la Semana
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      {days.map((day, index) => (
                        <option key={index} value={index + 1}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Inicio
                    </label>
                    <input 
                      type="time" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Término
                    </label>
                    <input 
                      type="time" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración (minutos)
                    </label>
                    <input 
                      type="number" 
                      placeholder="90"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleSaveTimetableEntry({})}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {selectedEntry ? 'Actualizar' : 'Crear'} Clase
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 