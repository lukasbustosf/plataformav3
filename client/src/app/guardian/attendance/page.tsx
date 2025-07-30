'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { 
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartPieIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState('2024-12')
  const [selectedView, setSelectedView] = useState('calendar')

  // Mock data for child's attendance
  const childData = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    currentAttendance: 94.5,
    totalDays: 180,
    presentDays: 170,
    absentDays: 7,
    lateDays: 3,
    justifiedAbsences: 5,
    unjustifiedAbsences: 2
  }

  const attendanceStats = {
    thisMonth: {
      percentage: 96.2,
      present: 25,
      absent: 1,
      late: 0,
      totalDays: 26
    },
    lastMonth: {
      percentage: 92.3,
      present: 24,
      absent: 2,
      late: 1,
      totalDays: 27
    },
    semester: {
      percentage: 94.5,
      present: 170,
      absent: 7,
      late: 3,
      totalDays: 180
    }
  }

  const monthlyAttendance = [
    { month: 'Ago', percentage: 95.2 },
    { month: 'Sep', percentage: 93.8 },
    { month: 'Oct', percentage: 96.4 },
    { month: 'Nov', percentage: 92.3 },
    { month: 'Dic', percentage: 96.2 }
  ]

  const dailyAttendance = [
    { date: '2024-12-16', status: 'present', time: '08:00', subject: 'Matemáticas' },
    { date: '2024-12-15', status: 'present', time: '08:00', subject: 'Lenguaje' },
    { date: '2024-12-14', status: 'present', time: '08:00', subject: 'Ciencias' },
    { date: '2024-12-13', status: 'late', time: '08:15', subject: 'Historia', reason: 'Transporte público' },
    { date: '2024-12-12', status: 'present', time: '08:00', subject: 'Matemáticas' },
    { date: '2024-12-11', status: 'absent', time: '-', subject: '-', reason: 'Enfermedad', justified: true },
    { date: '2024-12-10', status: 'present', time: '08:00', subject: 'Ed. Física' },
    { date: '2024-12-09', status: 'present', time: '08:00', subject: 'Arte' },
    { date: '2024-12-08', status: 'present', time: '08:00', subject: 'Inglés' },
    { date: '2024-12-07', status: 'present', time: '08:00', subject: 'Matemáticas' },
    { date: '2024-12-06', status: 'present', time: '08:00', subject: 'Lenguaje' },
    { date: '2024-12-05', status: 'present', time: '08:00', subject: 'Ciencias' },
    { date: '2024-12-04', status: 'present', time: '08:00', subject: 'Historia' },
    { date: '2024-12-03', status: 'present', time: '08:00', subject: 'Matemáticas' },
    { date: '2024-12-02', status: 'present', time: '08:00', subject: 'Tecnología' }
  ]

  const attendanceAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Asistencia Baja en Matemáticas',
      message: 'Sofía ha faltado 2 veces este mes a matemáticas',
      severity: 'medium',
      date: '2024-12-16'
    },
    {
      id: 2,
      type: 'info',
      title: 'Mejora en Puntualidad',
      message: 'No ha llegado tarde en las últimas 2 semanas',
      severity: 'low',
      date: '2024-12-10'
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
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Presente'
      case 'absent': return 'Ausente'
      case 'late': return 'Tarde'
      default: return '-'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic': return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      case 'attendance': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'announcement': return <ExclamationTriangleIcon className="h-5 w-5 text-purple-500" />
      case 'achievement': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      default: return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  // Button handlers
  const handleExportReport = () => {
    toast.loading('Generando reporte de asistencia...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Reporte de asistencia descargado exitosamente')
      
      // Simulate file download
      const csvContent = [
        'Fecha,Estado,Hora,Primera Clase,Observaciones',
        ...dailyAttendance.map(record => 
          `${record.date},${getStatusText(record.status)},${record.time},${record.subject},"${record.reason || ''}"`
        )
      ].join('\n')
      
      const element = document.createElement('a')
      element.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
      element.download = `asistencia_${childData.name.replace(' ', '_')}_${selectedMonth}.csv`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 2000)
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
    const monthNames: { [key: string]: string } = {
      '2024-12': 'Diciembre 2024',
      '2024-11': 'Noviembre 2024',
      '2024-10': 'Octubre 2024',
      '2024-09': 'Septiembre 2024',
      '2024-08': 'Agosto 2024'
    }
    toast.success(`Mostrando asistencia de: ${monthNames[month]}`)
  }

  const handleViewChange = (view: string) => {
    setSelectedView(view)
    const viewNames: { [key: string]: string } = {
      calendar: 'Vista Calendario',
      table: 'Vista Tabla',
      chart: 'Vista Gráfico'
    }
    toast.success(`Cambiado a: ${viewNames[view]}`)
  }

  const handleJustifyAbsence = (date: string) => {
    toast.success('Redirigiendo a formulario de justificación de ausencia...')
    
    // Simulate justification process
    setTimeout(() => {
      toast.success('Solicitud de justificación enviada correctamente')
    }, 1500)
  }

  const handleViewPattern = (pattern: string) => {
    toast.success(`Analizando patrón de asistencia: ${pattern}`)
    
    // Show pattern analysis
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Análisis de Patrón: ${pattern}</h3>
        <div class="mb-4">
          <p class="text-sm text-gray-600">
            ${pattern === 'día' ? 'Los lunes muestran menor asistencia (96%) comparado con otros días.' : 
              'Matemáticas tiene la menor asistencia (92%) entre todas las asignaturas.'}
          </p>
        </div>
        <div class="flex justify-end">
          <button onclick="this.closest('.fixed').remove()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Cerrar
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }, 8000)
  }

  const handleSendNotification = () => {
    toast.loading('Configurando notificaciones de asistencia...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Notificaciones de asistencia activadas correctamente')
    }, 1500)
  }

  const handleRequestMeeting = () => {
    toast.success('Abriendo formulario de solicitud de reunión...')
    
    // Simulate meeting request
    setTimeout(() => {
      toast.success('Solicitud de reunión enviada al profesor jefe')
    }, 1000)
  }

  const filteredAttendance = dailyAttendance.filter(record => 
    record.date.startsWith(selectedMonth)
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Control de Asistencia 📅</h1>
          <p className="mt-2 opacity-90">
            Seguimiento de asistencia y puntualidad de {childData.name} en {childData.grade}
          </p>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Resumen de Asistencia</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendNotification}
                >
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Configurar Alertas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestMeeting}
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Solicitar Reunión
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.currentAttendance}%</div>
                <div className="text-sm text-gray-600">Asistencia General</div>
                <div className="text-xs text-gray-500">{childData.presentDays}/{childData.totalDays} días</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.absentDays}</div>
                <div className="text-sm text-gray-600">Días Ausente</div>
                <div className="text-xs text-gray-500">{childData.justifiedAbsences} justificadas</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.lateDays}</div>
                <div className="text-sm text-gray-600">Atrasos</div>
                <div className="text-xs text-gray-500">Este semestre</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{attendanceStats.thisMonth.percentage}%</div>
                <div className="text-sm text-gray-600">Este Mes</div>
                <div className="text-xs text-gray-500">{attendanceStats.thisMonth.present}/{attendanceStats.thisMonth.totalDays} días</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="2024-12">Diciembre 2024</option>
                  <option value="2024-11">Noviembre 2024</option>
                  <option value="2024-10">Octubre 2024</option>
                  <option value="2024-09">Septiembre 2024</option>
                  <option value="2024-08">Agosto 2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
                <select
                  value={selectedView}
                  onChange={(e) => handleViewChange(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="calendar">Vista Calendario</option>
                  <option value="table">Vista Tabla</option>
                  <option value="chart">Vista Gráfico</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={handleExportReport}
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Attendance Alerts */}
        {attendanceAlerts.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Alertas de Asistencia</h2>
            </div>
            <div className="p-6 space-y-4">
              {attendanceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{alert.date}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success('Alerta marcada como vista')}
                    >
                      Marcar como Vista
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Trends */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tendencia Mensual</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end space-x-4">
              {monthlyAttendance.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-600 rounded-t hover:bg-green-700 cursor-pointer transition-colors"
                    style={{ height: `${(month.percentage / 100) * 200}px` }}
                    title={`${month.month}: ${month.percentage}%`}
                    onClick={() => toast.success(`${month.month}: ${month.percentage}% de asistencia`)}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                  <div className="text-xs font-medium text-gray-900">{month.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Record */}
        <div className="bg-white shadow rounded-lg">
          <div className="page-header-mobile px-6 py-4 border-b border-gray-200">
            <h2 className="page-title-mobile">Registro Diario</h2>
            <div className="filters-mobile">
              <select className="input-field-mobile">
                <option>Último mes</option>
                <option>Últimos 3 meses</option>
                <option>Todo el año</option>
              </select>
            </div>
          </div>
          
          <ResponsiveTable
            columns={[
              {
                key: 'date',
                label: 'Fecha',
                render: (date: string) => (
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(date).toLocaleDateString('es-CL', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                )
              },
              {
                key: 'status',
                label: 'Estado',
                                render: (status: string) => {
                   const config: Record<string, any> = {
                     present: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircleIcon, label: 'Presente' },
                     late: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: ClockIcon, label: 'Atraso' },
                     absent: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircleIcon, label: 'Ausente' },
                     justified: { bg: 'bg-blue-100', text: 'text-blue-800', icon: DocumentTextIcon, label: 'Justificado' }
                   }
                                      const statusConfig = config[status] || config.absent
                   
                   const Icon = statusConfig.icon
                   return (
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                       <Icon className="h-3 w-3 mr-1" />
                       {statusConfig.label}
                     </span>
                   )
                }
              },
              {
                key: 'arrivalTime',
                label: 'Hora Llegada',
                hiddenOnMobile: true,
                render: (time: string) => time || 'N/A'
              },
              {
                key: 'firstClass',
                label: 'Primera Clase',
                hiddenOnMobile: true
              },
              {
                key: 'observations',
                label: 'Observaciones',
                hiddenOnMobile: true,
                render: (obs: string) => obs || '-'
              },
              {
                key: 'actions',
                label: 'Acciones',
                render: (_, row: any) => (
                  <div className="flex justify-center">
                    <button
                      onClick={() => alert(`Ver detalles de ${row.date}`)}
                      className="icon-button-sm text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
            data={filteredAttendance}
            keyExtractor={(row) => row.date}
            searchable={false}
            className="border-0 shadow-none"
          />
        </div>

        {/* Attendance Patterns */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Patrones de Asistencia</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Por Día de la Semana</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPattern('día')}
                  >
                    Ver Análisis
                  </Button>
                </div>
                <div className="space-y-2">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, index) => {
                    const percentages = [96, 94, 98, 92, 95]
                    const percentage = percentages[index]
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full cursor-pointer hover:bg-green-700" 
                              style={{ width: `${percentage}%` }}
                              onClick={() => toast.success(`${day}: ${percentage}% de asistencia`)}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Por Asignatura</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewPattern('asignatura')}
                  >
                    Ver Análisis
                  </Button>
                </div>
                <div className="space-y-2">
                  {['Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés'].map((subject, index) => {
                    const percentages = [92, 96, 98, 94, 97]
                    const percentage = percentages[index]
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{subject}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full cursor-pointer hover:bg-green-700" 
                              style={{ width: `${percentage}%` }}
                              onClick={() => toast.success(`${subject}: ${percentage}% de asistencia`)}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
