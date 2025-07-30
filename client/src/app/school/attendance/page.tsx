'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ClockIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedGrade, setSelectedGrade] = useState('8° Básico')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock attendance data
  const attendanceData = [
    {
      id: 'att-001',
      studentName: 'Ana María González',
      studentId: 'stud-001',
      rut: '12.345.678-9',
      grade: '8° Básico',
      class: '8°A',
      status: 'present',
      arrivalTime: '08:00',
      notes: ''
    },
    {
      id: 'att-002',
      studentName: 'Carlos Eduardo Ruiz',
      studentId: 'stud-002',
      rut: '11.234.567-8',
      grade: '8° Básico',
      class: '8°A',
      status: 'late',
      arrivalTime: '08:15',
      notes: 'Llegó 15 minutos tarde'
    },
    {
      id: 'att-003',
      studentName: 'María José López',
      studentId: 'stud-003',
      rut: '13.456.789-0',
      grade: '8° Básico',
      class: '8°A',
      status: 'absent',
      arrivalTime: null,
      notes: 'Justificado médico'
    },
    {
      id: 'att-004',
      studentName: 'Diego Alejandro Torres',
      studentId: 'stud-004',
      rut: '14.567.890-1',
      grade: '8° Básico',
      class: '8°A',
      status: 'present',
      arrivalTime: '07:55',
      notes: ''
    },
    {
      id: 'att-005',
      studentName: 'Sofía Isabella Morales',
      studentId: 'stud-005',
      rut: '15.678.901-2',
      grade: '8° Básico',
      class: '8°A',
      status: 'absent',
      arrivalTime: null,
      notes: 'Sin justificación'
    }
  ]

  const grades = ['5° Básico', '6° Básico', '7° Básico', '8° Básico', '1° Medio', '2° Medio', '3° Medio', '4° Medio']

  const filteredAttendance = attendanceData.filter(record => {
    const matchesGrade = record.grade === selectedGrade
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rut.includes(searchTerm)
    return matchesGrade && matchesSearch
  })

  const attendanceStats = {
    totalStudents: filteredAttendance.length,
    present: filteredAttendance.filter(r => r.status === 'present').length,
    late: filteredAttendance.filter(r => r.status === 'late').length,
    absent: filteredAttendance.filter(r => r.status === 'absent').length,
    attendanceRate: Math.round((filteredAttendance.filter(r => r.status === 'present' || r.status === 'late').length / filteredAttendance.length) * 100)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'late':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'absent':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente'
      case 'late':
        return 'Tardanza'
      case 'absent':
        return 'Ausente'
      default:
        return 'Sin registro'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportReport = (format: string) => {
    toast.success(`Generando reporte de asistencia en formato ${format.toUpperCase()}...`)
    // In real app: trigger file download
  }

  const handleMarkAttendance = (studentId: string, status: string) => {
    toast.success(`Asistencia actualizada: ${status}`)
    // In real app: API call to update attendance
  }

  const handleBulkMarkPresent = () => {
    toast.success('Marcando todos los estudiantes como presentes...')
    // In real app: batch API call
  }

  const handleMarkStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const student = attendanceData.find(s => s.studentId === studentId)
    if (student) {
      student.status = status
      if (status === 'present' && !student.arrivalTime) {
        student.arrivalTime = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      }
      toast.success(`${student.studentName} marcado como ${getStatusText(status)}`)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia 📋</h1>
                <p className="text-gray-600 mt-1">
                  Gestión y monitoreo de asistencia estudiantil diaria
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleExportReport('pdf')}
                  variant="outline"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar PDF
                </Button>
                <Button
                  onClick={handleBulkMarkPresent}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Marcar Todos Presentes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar estudiante
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Presentes</p>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tardanzas</p>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ausentes</p>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">% Asistencia</p>
                <p className="text-2xl font-bold text-purple-600">{attendanceStats.attendanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Asistencia - {selectedGrade} ({new Date(selectedDate).toLocaleDateString('es-CL')})
              </h3>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleExportReport('excel')}
                  variant="outline"
                  size="sm"
                >
                  Excel
                </Button>
                <Button
                  onClick={() => handleExportReport('csv')}
                  variant="outline"
                  size="sm"
                >
                  CSV
                </Button>
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
                    RUT
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora Llegada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                      <div className="text-sm text-gray-500">{record.class}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.rut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {record.arrivalTime || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => handleMarkAttendance(record.studentId, 'present')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Marcar Presente"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(record.studentId, 'late')}
                          className="text-yellow-600 hover:text-yellow-900 p-1"
                          title="Marcar Tardanza"
                        >
                          <ExclamationTriangleIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(record.studentId, 'absent')}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Marcar Ausente"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Resumen Semanal de Asistencia</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Gráfico de Tendencias</h3>
              <p className="mt-1 text-sm text-gray-500">
                Visualización de patrones de asistencia en desarrollo
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 