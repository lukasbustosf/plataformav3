'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

export default function TeacherAttendancePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('8A')
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [studentNotes, setStudentNotes] = useState<{[key: number]: string}>({})

  const classes = ['8° A', '8° B', '7° A', '7° B']
  
  // Mock attendance data
  const students = [
    {
      id: 1,
      name: 'María González Silva',
      status: 'present',
      arrivalTime: '08:00',
      notes: ''
    },
    {
      id: 2,
      name: 'Carlos Ruiz Mendoza',
      status: 'late',
      arrivalTime: '08:15',
      notes: 'Llegó 15 minutos tarde'
    },
    {
      id: 3,
      name: 'Ana López Torres',
      status: 'present',
      arrivalTime: '07:55',
      notes: ''
    },
    {
      id: 4,
      name: 'Pedro Martínez Soto',
      status: 'absent',
      arrivalTime: '',
      notes: 'Enfermedad justificada'
    },
    {
      id: 5,
      name: 'Sofía Herrera Castro',
      status: 'present',
      arrivalTime: '08:05',
      notes: ''
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'absent':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'late':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'excused':
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Presente'
      case 'absent': return 'Ausente'
      case 'late': return 'Tardanza'
      case 'excused': return 'Justificado'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-700 bg-green-100'
      case 'absent': return 'text-red-700 bg-red-100'
      case 'late': return 'text-yellow-700 bg-yellow-100'
      case 'excused': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const updateAttendance = (studentId: number, status: string) => {
    toast.success(`Asistencia actualizada para estudiante`)
  }

  const updateStudentNote = (studentId: number, note: string) => {
    setStudentNotes(prev => ({
      ...prev,
      [studentId]: note
    }))
  }

  const saveAttendance = () => {
    toast.success('Asistencia guardada exitosamente')
  }

  const exportAttendance = () => {
    toast.success('Exportando reporte de asistencia...')
  }

  const stats = {
    totalStudents: students.length,
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    attendanceRate: Math.round((students.filter(s => s.status === 'present').length / students.length) * 100)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
            <p className="text-gray-600">Registra y gestiona la asistencia de tus estudiantes</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={exportAttendance}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Exportar
            </Button>
            <Button
              onClick={saveAttendance}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Guardar Asistencia
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clase</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="input"
              >
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                className="w-full"
              >
                Filtrar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Presentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ausentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tardanzas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">% Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Asistencia - {selectedClass} - {new Date(selectedDate).toLocaleDateString()}
              </h2>
              <div className="text-sm text-gray-500">
                {stats.present} de {stats.totalStudents} presentes ({stats.attendanceRate}%)
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora de Llegada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        <span className="mr-1">{getStatusIcon(student.status)}</span>
                        {getStatusLabel(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.arrivalTime || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <input
                        type="text"
                        value={studentNotes[student.id] || student.notes || ''}
                        onChange={(e) => updateStudentNote(student.id, e.target.value)}
                        placeholder="Agregar nota..."
                        className="input text-xs"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateAttendance(student.id, 'present')}
                          className={`p-1 rounded ${student.status === 'present' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                          title="Presente"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateAttendance(student.id, 'late')}
                          className={`p-1 rounded ${student.status === 'late' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-yellow-600'}`}
                          title="Tardanza"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateAttendance(student.id, 'absent')}
                          className={`p-1 rounded ${student.status === 'absent' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                          title="Ausente"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateAttendance(student.id, 'excused')}
                          className={`p-1 rounded ${student.status === 'excused' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                          title="Justificado"
                        >
                          <ExclamationTriangleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              onClick={() => students.forEach(s => updateAttendance(s.id, 'present'))}
              leftIcon={<CheckCircleIcon className="h-4 w-4" />}
            >
              Marcar Todos Presentes
            </Button>
            <Button
              variant="outline"
              onClick={() => students.forEach(s => updateAttendance(s.id, 'absent'))}
              leftIcon={<XCircleIcon className="h-4 w-4" />}
            >
              Marcar Todos Ausentes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/teacher/attendance/report')}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
            >
              Ver Reporte Semanal
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/teacher/attendance/patterns')}
              leftIcon={<UsersIcon className="h-4 w-4" />}
            >
              Patrones de Asistencia
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 