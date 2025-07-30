'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

export default function AttendanceReportPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [reportType, setReportType] = useState('summary')

  const classes = [
    { id: 'all', name: 'Todas las clases' },
    { id: '8a', name: '8° A' },
    { id: '8b', name: '8° B' },
    { id: '7a', name: '7° A' },
    { id: '7b', name: '7° B' }
  ]

  const reportData = {
    period: 'Semana del 15-19 Enero 2024',
    summary: {
      totalStudents: 120,
      averageAttendance: 94.2,
      totalAbsences: 28,
      totalLates: 15,
      perfectAttendance: 85
    },
    classData: [
      {
        className: '8° A',
        students: 30,
        attendance: 96.7,
        absences: 4,
        lates: 2,
        perfectAttendance: 24
      },
      {
        className: '8° B',
        students: 28,
        attendance: 92.9,
        absences: 8,
        lates: 5,
        perfectAttendance: 20
      },
      {
        className: '7° A',
        students: 32,
        attendance: 93.8,
        absences: 10,
        lates: 4,
        perfectAttendance: 22
      },
      {
        className: '7° B',
        students: 30,
        attendance: 93.3,
        absences: 6,
        lates: 4,
        perfectAttendance: 19
      }
    ],
    trends: {
      weeklyComparison: [
        { week: 'Sem 1', attendance: 95.2 },
        { week: 'Sem 2', attendance: 94.8 },
        { week: 'Sem 3', attendance: 93.5 },
        { week: 'Sem 4', attendance: 94.2 }
      ]
    },
    alertStudents: [
      {
        name: 'Ana Martínez',
        class: '8° B',
        absences: 4,
        consecutiveAbsences: 2,
        attendanceRate: 78.5
      },
      {
        name: 'Carlos López',
        class: '7° A', 
        absences: 3,
        consecutiveAbsences: 3,
        attendanceRate: 80.2
      }
    ]
  }

  const generateReport = () => {
    toast.success('Generando reporte de asistencia...')
    // Simulate report generation
    setTimeout(() => {
      toast.success('Reporte generado exitosamente')
    }, 2000)
  }

  const printReport = () => {
    window.print()
  }

  const exportToExcel = () => {
    toast.success('Exportando a Excel...')
  }

  const exportToPDF = () => {
    toast.success('Exportando a PDF...')
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
              <h1 className="text-2xl font-bold text-gray-900">Reporte de Asistencia</h1>
              <p className="text-gray-600">Análisis detallado de asistencia estudiantil</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={printReport}
              leftIcon={<PrinterIcon className="h-4 w-4" />}
            >
              Imprimir
            </Button>
            <Button
              onClick={generateReport}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Reporte</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clase
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input w-full"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input w-full"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="summary"
                  checked={reportType === 'summary'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-2"
                />
                Resumen
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="detailed"
                  checked={reportType === 'detailed'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-2"
                />
                Detallado
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="alerts"
                  checked={reportType === 'alerts'}
                  onChange={(e) => setReportType(e.target.value)}
                  className="mr-2"
                />
                Solo Alertas
              </label>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalStudents}</p>
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
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.averageAttendance}%</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Ausencias</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalAbsences}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Atrasos</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalLates}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Asistencia Perfecta</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.summary.perfectAttendance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asistencia por Clase</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Asistencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ausencias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atrasos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia Perfecta
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.classData.map((classItem, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {classItem.className}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classItem.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          classItem.attendance >= 95 ? 'bg-green-100 text-green-800' :
                          classItem.attendance >= 90 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {classItem.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classItem.absences}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classItem.lates}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {classItem.perfectAttendance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        {reportData.alertStudents.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              Estudiantes en Riesgo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.alertStudents.map((student, index) => (
                <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <span className="text-sm text-gray-600">{student.class}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-red-600">{student.absences}</span>
                      <br />
                      <span className="text-gray-600">Ausencias</span>
                    </div>
                    <div>
                      <span className="font-medium text-red-600">{student.consecutiveAbsences}</span>
                      <br />
                      <span className="text-gray-600">Consecutivas</span>
                    </div>
                    <div>
                      <span className="font-medium text-red-600">{student.attendanceRate}%</span>
                      <br />
                      <span className="text-gray-600">Asistencia</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trends Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Asistencia</h3>
          <div className="h-64 flex items-end justify-center space-x-8 border-b border-gray-200">
            {reportData.trends.weeklyComparison.map((week, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-16 rounded-t"
                  style={{ height: `${(week.attendance / 100) * 200}px` }}
                ></div>
                <div className="mt-2 text-sm text-gray-600">{week.week}</div>
                <div className="text-xs text-gray-500">{week.attendance}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Exportación</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={exportToPDF}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              className="w-full"
            >
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              onClick={exportToExcel}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              className="w-full"
            >
              Exportar Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success('Enviando por email...')}
              leftIcon={<CalendarIcon className="h-4 w-4" />}
              className="w-full"
            >
              Enviar por Email
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 