'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function StudentAttendance() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedSubject, setSelectedSubject] = useState('all')

  const attendanceData = [
    { date: '2024-01-22', subject: 'Matemáticas', status: 'present', arrivalTime: '08:00', notes: '' },
    { date: '2024-01-22', subject: 'Historia', status: 'present', arrivalTime: '08:50', notes: '' },
    { date: '2024-01-22', subject: 'Ciencias', status: 'late', arrivalTime: '10:15', notes: 'Llegó 15 minutos tarde' },
    { date: '2024-01-21', subject: 'Matemáticas', status: 'absent', arrivalTime: '', notes: 'Justificado - Cita médica' },
    { date: '2024-01-21', subject: 'Historia', status: 'present', arrivalTime: '08:50', notes: '' },
    { date: '2024-01-20', subject: 'Matemáticas', status: 'present', arrivalTime: '08:00', notes: '' },
    { date: '2024-01-20', subject: 'Historia', status: 'present', arrivalTime: '08:50', notes: '' },
    { date: '2024-01-20', subject: 'Ciencias', status: 'present', arrivalTime: '09:50', notes: '' }
  ]

  const subjects = ['Matemáticas', 'Historia', 'Ciencias', 'Lenguaje', 'Inglés', 'Ed. Física']

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'present':
        return { 
          icon: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
          text: 'Presente',
          color: 'text-green-600 bg-green-100'
        }
      case 'absent':
        return { 
          icon: <XCircleIcon className="h-5 w-5 text-red-600" />,
          text: 'Ausente',
          color: 'text-red-600 bg-red-100'
        }
      case 'late':
        return { 
          icon: <ClockIcon className="h-5 w-5 text-yellow-600" />,
          text: 'Atrasado',
          color: 'text-yellow-600 bg-yellow-100'
        }
      default:
        return { 
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />,
          text: 'Desconocido',
          color: 'text-gray-600 bg-gray-100'
        }
    }
  }

  const calculateStats = () => {
    const total = attendanceData.length
    const present = attendanceData.filter(d => d.status === 'present').length
    const absent = attendanceData.filter(d => d.status === 'absent').length
    const late = attendanceData.filter(d => d.status === 'late').length
    
    return {
      total,
      present,
      absent,
      late,
      attendanceRate: ((present + late) / total * 100).toFixed(1)
    }
  }

  const stats = calculateStats()

  const filteredData = selectedSubject === 'all' 
    ? attendanceData 
    : attendanceData.filter(d => d.subject === selectedSubject)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Mi Asistencia</h1>
              <p className="mt-1 text-sm text-gray-600">
                Revisa tu historial de asistencia y puntualidad
              </p>
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="semester">Este semestre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa de Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Presente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Atrasos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.late}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ausencias</p>
                <p className="text-2xl font-bold text-gray-900">{stats.absent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Materia:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas las materias</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Historial de Asistencia ({filteredData.length} registros)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Materia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora de Llegada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Observaciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((record, index) => {
                  const statusInfo = getStatusInfo(record.status)
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {statusInfo.icon}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.arrivalTime || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.notes || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && (
            <div className="p-8 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
              <p className="text-gray-600">
                No se encontraron registros de asistencia para los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 