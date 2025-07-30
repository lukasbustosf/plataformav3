'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

export default function AttendancePatternsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('month')
  const [selectedClass, setSelectedClass] = useState('all')

  const classes = ['Todas las clases', '8° A', '8° B', '7° A', '7° B']

  // Mock attendance patterns data
  const patternsData = {
    overview: {
      totalStudents: 156,
      averageAttendance: 87.3,
      chronicAbsentees: 8,
      perfectAttendance: 23,
      trends: {
        thisMonth: 87.3,
        lastMonth: 89.1,
        change: -1.8
      }
    },
    dailyPatterns: [
      { day: 'Lunes', attendance: 92.1, absences: 12, late: 3 },
      { day: 'Martes', attendance: 89.4, absences: 16, late: 2 },
      { day: 'Miércoles', attendance: 88.7, absences: 17, late: 4 },
      { day: 'Jueves', attendance: 85.2, absences: 23, late: 6 },
      { day: 'Viernes', attendance: 83.1, absences: 26, late: 8 }
    ],
    monthlyTrends: [
      { month: 'Enero', attendance: 91.2 },
      { month: 'Febrero', attendance: 89.8 },
      { month: 'Marzo', attendance: 88.5 },
      { month: 'Abril', attendance: 87.3 },
      { month: 'Mayo', attendance: 86.1 }
    ],
    riskStudents: [
      {
        id: 1,
        name: 'Carlos Ruiz Mendoza',
        class: '7° B',
        attendanceRate: 65.2,
        absenceDays: 18,
        pattern: 'Frecuentes ausencias los viernes',
        risk: 'high'
      },
      {
        id: 2,
        name: 'Sofía Herrera Castro',
        class: '8° A',
        attendanceRate: 72.8,
        absenceDays: 14,
        pattern: 'Tardanzas matutinas recurrentes',
        risk: 'medium'
      },
      {
        id: 3,
        name: 'Pedro Martínez Soto',
        class: '8° B',
        attendanceRate: 78.5,
        absenceDays: 11,
        pattern: 'Ausencias después de feriados',
        risk: 'medium'
      }
    ],
    classComparison: [
      { class: '7° A', attendance: 91.2, students: 28, absences: 15 },
      { class: '7° B', attendance: 85.7, students: 30, absences: 26 },
      { class: '8° A', attendance: 89.1, students: 32, absences: 21 },
      { class: '8° B', attendance: 87.4, students: 29, absences: 22 }
    ]
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-700 bg-red-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'low': return 'text-green-700 bg-green-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'Alto Riesgo'
      case 'medium': return 'Riesgo Medio'
      case 'low': return 'Bajo Riesgo'
      default: return risk
    }
  }

  const exportReport = () => {
    toast.success('Exportando reporte de patrones de asistencia...')
  }

  const contactGuardian = (studentName: string) => {
    toast.success(`Iniciando contacto con apoderado de ${studentName}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patrones de Asistencia</h1>
            <p className="text-gray-600">Análisis y tendencias de asistencia estudiantil</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={exportReport}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Exportar Reporte
            </Button>
            <Button
              onClick={() => router.push('/teacher/attendance')}
            >
              Volver a Asistencia
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período de tiempo
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
              >
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
                <option value="quarter">Último trimestre</option>
                <option value="year">Último año</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clase
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input"
              >
                {classes.map((cls, index) => (
                  <option key={index} value={cls === 'Todas las clases' ? 'all' : cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                className="w-full"
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{patternsData.overview.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Asistencia Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{patternsData.overview.averageAttendance}%</p>
                <div className="flex items-center text-sm text-red-600">
                  <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                  {patternsData.overview.trends.change}%
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ausentismo Crónico</p>
                <p className="text-2xl font-bold text-gray-900">{patternsData.overview.chronicAbsentees}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Asistencia Perfecta</p>
                <p className="text-2xl font-bold text-gray-900">{patternsData.overview.perfectAttendance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patrones Diarios</h3>
            <div className="space-y-4">
              {patternsData.dailyPatterns.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{day.day}</span>
                      <span className="text-sm font-bold text-gray-900">{day.attendance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          day.attendance >= 90 ? 'bg-green-500' :
                          day.attendance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${day.attendance}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{day.absences} ausencias</span>
                      <span>{day.late} tardanzas</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Comparison */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparación por Clase</h3>
            <div className="space-y-4">
              {patternsData.classComparison.map((cls, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{cls.class}</span>
                    <span className="text-lg font-bold text-gray-900">{cls.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        cls.attendance >= 90 ? 'bg-green-500' :
                        cls.attendance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${cls.attendance}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{cls.students} estudiantes</span>
                    <span>{cls.absences} ausencias totales</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Students */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Estudiantes en Riesgo ({patternsData.riskStudents.length})
            </h3>
            <Button
              variant="outline"
              onClick={() => router.push('/teacher/students?filter=risk')}
            >
              Ver Todos
            </Button>
          </div>

          <div className="space-y-4">
            {patternsData.riskStudents.map((student) => (
              <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{student.attendanceRate}%</p>
                        <p className="text-sm text-gray-600">{student.absenceDays} días ausente</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 mb-2">{student.pattern}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(student.risk)}`}>
                          {getRiskLabel(student.risk)}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => contactGuardian(student.name)}
                      >
                        Contactar Apoderado
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia Mensual</h3>
          <div className="space-y-3">
            {patternsData.monthlyTrends.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-20">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        month.attendance >= 90 ? 'bg-green-500' :
                        month.attendance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${month.attendance}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 w-12 text-right">
                  {month.attendance}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 