'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function ClassAttendancePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const classId = params.id as string
  const today = new Date().toISOString().split('T')[0]

  // Mock class data
  const classData = {
    id: classId,
    name: 'Matemáticas 8° A',
    grade: '8° Básico',
    subject: 'Matemáticas',
    room: 'Aula 205',
    schedule: 'Lunes 08:00 - 08:45'
  }

  // Mock students data
  const [students, setStudents] = useState([
    { id: 1, name: 'Ana García López', rut: '12.345.678-9', status: 'present', notes: '' },
    { id: 2, name: 'Carlos López Silva', rut: '12.345.679-7', status: 'present', notes: '' },
    { id: 3, name: 'María González Torres', rut: '12.345.680-0', status: 'present', notes: '' },
    { id: 4, name: 'Pedro Silva Martín', rut: '12.345.681-8', status: 'absent', notes: 'Enfermo' },
    { id: 5, name: 'Sofía Martín González', rut: '12.345.682-6', status: 'present', notes: '' },
    { id: 6, name: 'Diego Torres López', rut: '12.345.683-4', status: 'late', notes: 'Llegó 10 min tarde' },
    { id: 7, name: 'Valentina Rojas Silva', rut: '12.345.684-2', status: 'present', notes: '' },
    { id: 8, name: 'Mateo Herrera García', rut: '12.345.685-0', status: 'justified', notes: 'Cita médica' },
    { id: 9, name: 'Isabella Castro Torres', rut: '12.345.686-9', status: 'present', notes: '' },
    { id: 10, name: 'Sebastián Morales Ruiz', rut: '12.345.687-7', status: 'present', notes: '' }
  ])

  const [attendanceDate, setAttendanceDate] = useState(today)
  const [lessonTopic, setLessonTopic] = useState('')
  const [generalNotes, setGeneralNotes] = useState('')

  const updateAttendance = (studentId: number, status: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, status } 
          : student
      )
    )
  }

  const updateStudentNotes = (studentId: number, notes: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, notes } 
          : student
      )
    )
  }

  const getStatusButton = (student: any, status: string, icon: any, color: string) => {
    const isActive = student.status === status
    return (
      <button
        onClick={() => updateAttendance(student.id, status)}
        className={`p-2 rounded-lg border-2 transition-colors ${
          isActive 
            ? `${color} border-current` 
            : 'text-gray-400 border-gray-200 hover:border-gray-300'
        }`}
        title={getStatusLabel(status)}
      >
        {icon}
      </button>
    )
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Presente'
      case 'absent': return 'Ausente'
      case 'late': return 'Atraso'
      case 'justified': return 'Justificado'
      default: return 'Sin registrar'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-orange-100 text-orange-800'
      case 'justified': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    justified: students.filter(s => s.status === 'justified').length
  }

  const handleSave = async () => {
    if (!lessonTopic.trim()) {
      toast.error('Por favor ingresa el tema de la clase')
      return
    }

    try {
      toast.success('Guardando asistencia...')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Asistencia guardada exitosamente')
    } catch (error) {
      toast.error('Error al guardar la asistencia')
    }
  }

  const handleMarkAllPresent = () => {
    setStudents(prev => 
      prev.map(student => ({ ...student, status: 'present' }))
    )
    toast.success('Todos los estudiantes marcados como presentes')
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
              <h1 className="text-2xl font-bold text-gray-900">Asistencia - {classData.name}</h1>
              <p className="text-gray-600">{classData.grade} • {classData.room} • {new Date(attendanceDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push('/teacher/attendance/report')}
              leftIcon={<DocumentTextIcon className="h-4 w-4" />}
            >
              Ver Reportes
            </Button>
            <Button
              onClick={handleSave}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Guardar Asistencia
            </Button>
          </div>
        </div>

        {/* Class Info */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Clase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la Clase
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema de la Clase *
              </label>
              <input
                type="text"
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                className="input w-full"
                placeholder="Ej: Ecuaciones lineales de primer grado"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones Generales
            </label>
            <textarea
              rows={2}
              value={generalNotes}
              onChange={(e) => setGeneralNotes(e.target.value)}
              className="input w-full"
              placeholder="Observaciones sobre la clase en general..."
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="card p-4 text-center">
            <UsersIcon className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          
          <div className="card p-4 text-center">
            <CheckCircleIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
            <p className="text-sm text-gray-600">Presentes</p>
          </div>
          
          <div className="card p-4 text-center">
            <XCircleIcon className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
            <p className="text-sm text-gray-600">Ausentes</p>
          </div>
          
          <div className="card p-4 text-center">
            <ClockIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
            <p className="text-sm text-gray-600">Atrasos</p>
          </div>
          
          <div className="card p-4 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.justified}</p>
            <p className="text-sm text-gray-600">Justificados</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllPresent}
                leftIcon={<CheckCircleIcon className="h-4 w-4" />}
              >
                Todos Presentes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStudents(prev => 
                    prev.map(student => ({ ...student, status: 'absent' }))
                  )
                  toast.success('Todos los estudiantes marcados como ausentes')
                }}
                leftIcon={<XCircleIcon className="h-4 w-4" />}
              >
                Todos Ausentes
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Asistencia: {Math.round((stats.present / stats.total) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de Estudiantes</h3>
          
          <div className="space-y-4">
            {students.map((student, index) => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">RUT: {student.rut}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {getStatusLabel(student.status)}
                        </span>
                      </div>
                    </div>

                    {/* Status Buttons */}
                    <div className="flex items-center space-x-2 mb-3">
                      {getStatusButton(student, 'present', <CheckCircleIcon className="h-5 w-5" />, 'text-green-600')}
                      {getStatusButton(student, 'absent', <XCircleIcon className="h-5 w-5" />, 'text-red-600')}
                      {getStatusButton(student, 'late', <ClockIcon className="h-5 w-5" />, 'text-orange-600')}
                      {getStatusButton(student, 'justified', <ExclamationTriangleIcon className="h-5 w-5" />, 'text-blue-600')}
                    </div>

                    {/* Notes */}
                    <div>
                      <input
                        type="text"
                        value={student.notes}
                        onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                        className="input w-full text-sm"
                        placeholder="Observaciones sobre este estudiante..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="card p-4">
          <h4 className="font-medium text-gray-900 mb-3">Leyenda</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <span>Presente</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircleIcon className="h-5 w-5 text-red-600" />
              <span>Ausente</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-orange-600" />
              <span>Atraso</span>
            </div>
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-blue-600" />
              <span>Justificado</span>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => router.push(`/teacher/classes/${classId}`)}
          >
            Cancelar
          </Button>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => toast.success('Asistencia guardada como borrador')}
            >
              Guardar Borrador
            </Button>
            <Button
              onClick={handleSave}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Guardar y Finalizar
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 