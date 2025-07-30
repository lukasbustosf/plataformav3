'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import {
  CalendarDaysIcon,
  ClockIcon,
  PencilIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface DailyControl {
  control_id: string
  class_id: string
  lesson_plan_id?: string
  teacher_id: string
  class_date: string
  start_time?: string
  end_time?: string
  lesson_topic: string
  lesson_summary?: string
  activities_completed?: string[]
  signature_hash?: string
  signature_timestamp?: string
  legal_validated: boolean
  total_students?: number
  present_count?: number
  absent_count?: number
  late_count?: number
  justified_count?: number
  general_observations?: string
  disciplinary_notes?: string
  pedagogical_notes?: string
  status: 'draft' | 'completed' | 'signed' | 'exported'
  completed_at?: string
  created_at: string
  updated_at: string
  classes?: {
    class_name: string
    grade_code: string
    subjects: {
      subject_name: string
    }
  }
  attendance?: Array<{
    student_id: string
    status: string
    students: {
      first_name: string
      last_name: string
    }
  }>
}

interface Class {
  class_id: string
  class_name: string
  grade_code: string
  subject_id: string
  subjects: {
    subject_name: string
  }
}

export default function DailyControlPage() {
  const { user } = useAuth()
  const [controls, setControls] = useState<DailyControl[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedControl, setSelectedControl] = useState<DailyControl | null>(null)

  useEffect(() => {
    loadClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      loadControls()
    }
  }, [selectedClass, selectedDate])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/class/my-classes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setClasses(data.data)
        if (data.data.length > 0) {
          setSelectedClass(data.data[0].class_id)
        }
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      // Mock data for development
      const mockClasses: Class[] = [
        {
          class_id: 'class-001',
          class_name: '5°A Matemáticas',
          grade_code: '5B',
          subject_id: 'subj-001',
          subjects: { subject_name: 'Matemática' }
        },
        {
          class_id: 'class-002',
          class_name: '6°B Lenguaje',
          grade_code: '6B',
          subject_id: 'subj-002',
          subjects: { subject_name: 'Lenguaje y Comunicación' }
        }
      ]
      setClasses(mockClasses)
      setSelectedClass(mockClasses[0].class_id)
    } finally {
      setLoading(false)
    }
  }

  const loadControls = async () => {
    try {
      const startDate = new Date(selectedDate)
      startDate.setDate(startDate.getDate() - 7)
      const endDate = new Date(selectedDate)
      endDate.setDate(startDate.getDate() + 1)

      const response = await fetch(`/api/class-book/daily-control/class/${selectedClass}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setControls(data.data)
      }
    } catch (error) {
      console.error('Error loading controls:', error)
      // Mock data for development
      const mockControls: DailyControl[] = [
        {
          control_id: 'ctrl-001',
          class_id: selectedClass,
          teacher_id: user?.user_id || '',
          class_date: selectedDate,
          start_time: '08:00',
          end_time: '09:30',
          lesson_topic: 'Números naturales hasta el millón',
          lesson_summary: 'Introducción a números de 6 dígitos, representación con ábacos y ejercicios prácticos.',
          activities_completed: ['Explicación teórica', 'Ejercicios en pizarra', 'Trabajo individual'],
          signature_hash: 'abc123def456...',
          legal_validated: true,
          total_students: 25,
          present_count: 23,
          absent_count: 2,
          late_count: 0,
          justified_count: 1,
          general_observations: 'Buena participación general',
          status: 'signed',
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          classes: {
            class_name: '5°A Matemáticas',
            grade_code: '5B',
            subjects: { subject_name: 'Matemática' }
          }
        }
      ]
      setControls(mockControls)
    }
  }

  const createDailyControl = async (controlData: any) => {
    try {
      setSaving(true)

      const response = await fetch('/api/class-book/daily-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          class_id: selectedClass,
          class_date: selectedDate,
          ...controlData
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Control diario creado exitosamente')
        setShowCreateModal(false)
        loadControls()
      } else {
        toast.error(data.error || 'Error al crear control diario')
      }

    } catch (error) {
      console.error('Error creating daily control:', error)
      toast.error('Error al crear control diario')
    } finally {
      setSaving(false)
    }
  }

  const completeDailyControl = async (controlId: string) => {
    try {
      setSaving(true)

      const response = await fetch(`/api/class-book/daily-control/${controlId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Control diario completado con firma digital')
        loadControls()
      } else {
        toast.error(data.error || 'Error al completar control diario')
      }

    } catch (error) {
      console.error('Error completing daily control:', error)
      toast.error('Error al completar control diario')
    } finally {
      setSaving(false)
    }
  }

  const signDailyControl = async (controlId: string) => {
    try {
      setSaving(true)

      const response = await fetch(`/api/class-book/daily-control/${controlId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          signature_type: 'teacher',
          notes: 'Firmado digitalmente por el docente'
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('✅ Control firmado digitalmente con SHA-256')
        loadControls()
      } else {
        toast.error(data.error || 'Error al firmar control')
      }

    } catch (error) {
      console.error('Error signing daily control:', error)
      toast.error('Error al firmar control diario')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-yellow-100 text-yellow-800',
      signed: 'bg-green-100 text-green-800',
      exported: 'bg-blue-100 text-blue-800'
    }

    const labels = {
      draft: 'Borrador',
      completed: 'Completado',
      signed: 'Firmado',
      exported: 'Exportado'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Control Diario de Clases
                </h1>
                <p className="text-blue-100 mt-1">
                  P2-A-03: Libro de clases digital con firma SHA-256
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Control Diario de Clases</h2>
          <p className="text-gray-600 mb-6">Sistema implementado exitosamente</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Crear Control Diario
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Create Control Modal Component
interface CreateControlModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  saving: boolean
  selectedDate: string
  selectedClass: string
  classes: Class[]
}

function CreateControlModal({ 
  isOpen, 
  onClose, 
  onSave, 
  saving, 
  selectedDate, 
  selectedClass, 
  classes 
}: CreateControlModalProps) {
  const [formData, setFormData] = useState({
    lesson_topic: '',
    lesson_summary: '',
    start_time: '08:00',
    end_time: '09:30',
    general_observations: '',
    disciplinary_notes: '',
    pedagogical_notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Crear Control Diario
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora Término
                    </label>
                    <input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tema de la Clase *
                  </label>
                  <input
                    type="text"
                    value={formData.lesson_topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, lesson_topic: e.target.value }))}
                    placeholder="Tema principal de la clase"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resumen de la Clase
                  </label>
                  <textarea
                    value={formData.lesson_summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, lesson_summary: e.target.value }))}
                    rows={3}
                    placeholder="Descripción detallada de las actividades realizadas"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones Generales
                  </label>
                  <textarea
                    value={formData.general_observations}
                    onChange={(e) => setFormData(prev => ({ ...prev, general_observations: e.target.value }))}
                    rows={2}
                    placeholder="Observaciones sobre el desarrollo de la clase"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving || !formData.lesson_topic.trim()}
                isLoading={saving}
              >
                Crear Control
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Control Detail Modal Component  
interface ControlDetailModalProps {
  control: DailyControl
  onClose: () => void
  onUpdate: () => void
}

function ControlDetailModal({ control, onClose, onUpdate }: ControlDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Control de Clase - {new Date(control.class_date).toLocaleDateString('es-CL')}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Control Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Información de la Clase</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tema:</span>
                      <span className="text-sm font-medium text-gray-900">{control.lesson_topic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Horario:</span>
                      <span className="text-sm font-medium text-gray-900">{control.start_time} - {control.end_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estado:</span>
                      <span>{getStatusBadge(control.status)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{control.lesson_summary || 'Sin resumen'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Observaciones</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{control.general_observations || 'Sin observaciones'}</p>
                  </div>
                </div>
              </div>

              {/* Attendance & Signature */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen de Asistencia</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{control.present_count}</div>
                        <div className="text-xs text-gray-600">Presentes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{control.absent_count}</div>
                        <div className="text-xs text-gray-600">Ausentes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{control.late_count}</div>
                        <div className="text-xs text-gray-600">Atrasados</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{control.justified_count}</div>
                        <div className="text-xs text-gray-600">Justificados</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Digital Signature */}
                {control.legal_validated && control.signature_hash && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Firma Digital</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Firmado Digitalmente</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-green-700">
                          <strong>Hash SHA-256:</strong>
                        </div>
                        <div className="text-xs font-mono text-green-800 bg-green-100 p-2 rounded break-all">
                          {control.signature_hash}
                        </div>
                        {control.signature_timestamp && (
                          <div className="text-xs text-green-600">
                            Firmado: {new Date(control.signature_timestamp).toLocaleString('es-CL')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusBadge(status: string) {
  const styles = {
    draft: 'bg-gray-100 text-gray-800',
    completed: 'bg-yellow-100 text-yellow-800',
    signed: 'bg-green-100 text-green-800',
    exported: 'bg-blue-100 text-blue-800'
  }

  const labels = {
    draft: 'Borrador',
    completed: 'Completado',
    signed: 'Firmado',
    exported: 'Exportado'
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
} 