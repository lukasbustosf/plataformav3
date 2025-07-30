'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  PlusIcon, 
  ArrowLeftIcon,
  AcademicCapIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function CreateClassPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    grade: '',
    year: new Date().getFullYear(),
    semester: '1',
    schedule: [
      { day: 'monday', startTime: '', endTime: '' },
      { day: 'tuesday', startTime: '', endTime: '' },
      { day: 'wednesday', startTime: '', endTime: '' },
      { day: 'thursday', startTime: '', endTime: '' },
      { day: 'friday', startTime: '', endTime: '' }
    ],
    description: '',
    maxStudents: 35,
    room: ''
  })

  const subjects = [
    'Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés',
    'Educación Física', 'Artes', 'Música', 'Tecnología', 'Religión'
  ]

  const grades = [
    '1º Básico', '2º Básico', '3º Básico', '4º Básico', '5º Básico', '6º Básico',
    '7º Básico', '8º Básico', '1º Medio', '2º Medio', '3º Medio', '4º Medio'
  ]

  const days = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleScheduleChange = (dayIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.className || !formData.subject || !formData.grade) {
        toast.error('Por favor completa todos los campos obligatorios')
        return
      }

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Clase creada exitosamente')
      router.push('/teacher/classes')
    } catch (error) {
      toast.error('Error al crear la clase')
    } finally {
      setIsLoading(false)
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
              <h1 className="text-2xl font-bold text-gray-900">Crear Nueva Clase</h1>
              <p className="text-gray-600">Configura una nueva clase para tus estudiantes</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Información Básica</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Clase *
                </label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => handleInputChange('className', e.target.value)}
                  className="input"
                  placeholder="Ej: Matemáticas 8°A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asignatura *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Selecciona una asignatura</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nivel/Grado *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Selecciona un grado</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sala/Aula
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className="input"
                  placeholder="Ej: A101, Lab 1, Gimnasio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año Académico
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="input"
                  min="2020"
                  max="2030"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semestre
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  className="input"
                >
                  <option value="1">Primer Semestre</option>
                  <option value="2">Segundo Semestre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Estudiantes
                </label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value))}
                  className="input"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="input"
                rows={3}
                placeholder="Describe los objetivos y contenidos de la clase..."
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-6">
              <ClockIcon className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Horario de Clases</h2>
            </div>

            <div className="space-y-4">
              {days.map((day, index) => (
                <div key={day.value} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-900">
                    {day.label}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Hora de inicio
                    </label>
                    <input
                      type="time"
                      value={formData.schedule[index].startTime}
                      onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Hora de término
                    </label>
                    <input
                      type="time"
                      value={formData.schedule[index].endTime}
                      onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                      className="input"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {formData.schedule[index].startTime && formData.schedule[index].endTime && (
                      `${Math.floor((new Date(`1970-01-01T${formData.schedule[index].endTime}:00`).getTime() - new Date(`1970-01-01T${formData.schedule[index].startTime}:00`).getTime()) / (1000 * 60))} min`
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<PlusIcon className="h-4 w-4" />}
            >
              Crear Clase
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
} 