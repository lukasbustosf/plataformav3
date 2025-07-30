'use client'

import { useState } from 'react'
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Appointment {
  id: string
  title: string
  type: 'presencial' | 'virtual' | 'telefonica'
  professional: {
    name: string
    role: string
    department: string
  }
  date: string
  time: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  location?: string
  meetingLink?: string
  notes?: string
  reason: string
}

export default function AppointmentsPage() {
  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      title: 'Evaluación Psicológica Trimestral',
      type: 'presencial',
      professional: {
        name: 'Dra. María González',
        role: 'Psicóloga Escolar',
        department: 'Bienestar Estudiantil'
      },
      date: '2024-02-15',
      time: '10:00',
      duration: 60,
      status: 'scheduled',
      location: 'Oficina de Psicología - Piso 2',
      reason: 'Seguimiento del programa de apoyo emocional',
      notes: 'Traer informes de tareas completadas'
    },
    {
      id: '2',
      title: 'Reunión de Progreso Académico',
      type: 'virtual',
      professional: {
        name: 'Prof. Carlos Rodríguez',
        role: 'Profesor Jefe',
        department: 'Área Académica'
      },
      date: '2024-02-20',
      time: '16:00',
      duration: 45,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      reason: 'Revisión de calificaciones del primer trimestre'
    },
    {
      id: '3',
      title: 'Consulta Nutricional',
      type: 'presencial',
      professional: {
        name: 'Nut. Ana López',
        role: 'Nutricionista',
        department: 'Salud Escolar'
      },
      date: '2024-02-10',
      time: '14:30',
      duration: 30,
      status: 'completed',
      location: 'Enfermería Escolar',
      reason: 'Evaluación de plan alimentario'
    }
  ])

  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual': return VideoCameraIcon
      case 'telefonica': return PhoneIcon
      case 'presencial': return MapPinIcon
      default: return CalendarDaysIcon
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircleIcon
      case 'cancelled': return ExclamationTriangleIcon
      default: return ClockIcon
    }
  }

  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled')
  const completedAppointments = appointments.filter(apt => apt.status === 'completed')

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Citas y Evaluaciones</h1>
            <p className="page-subtitle">
              Gestiona las citas con profesionales del establecimiento
            </p>
          </div>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Solicitar Cita
          </button>
        </div>
      </div>

      {/* Filtros y vista */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setSelectedView('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setSelectedView('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendario
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          {upcomingAppointments.length} citas próximas
        </div>
      </div>

      {/* Próximas citas */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Próximas Citas
        </h2>
        <div className="grid-responsive-1 md:grid-cols-2 gap-4">
          {upcomingAppointments.map((appointment) => {
            const TypeIcon = getTypeIcon(appointment.type)
            const StatusIcon = getStatusIcon(appointment.status)
            
            return (
              <div key={appointment.id} className="card">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <TypeIcon className="h-6 w-6 text-primary-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {appointment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {appointment.reason}
                        </p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <UserIcon className="h-4 w-4" />
                            <span>{appointment.professional.name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{appointment.professional.role}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CalendarDaysIcon className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                            <span className="text-gray-400">•</span>
                            <ClockIcon className="h-4 w-4" />
                            <span>{appointment.time}</span>
                            <span className="text-gray-400">•</span>
                            <span>{appointment.duration} min</span>
                          </div>
                          
                          {appointment.location && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{appointment.location}</span>
                            </div>
                          )}
                          
                          {appointment.meetingLink && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <VideoCameraIcon className="h-4 w-4" />
                              <a 
                                href={appointment.meetingLink} 
                                className="text-primary-600 hover:text-primary-800"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Unirse a la reunión
                              </a>
                            </div>
                          )}
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-3 p-2 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>Nota:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        Programada
                      </span>
                      
                      <div className="flex space-x-1">
                        <button className="text-sm text-primary-600 hover:text-primary-800">
                          Reagendar
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-sm text-red-600 hover:text-red-800">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Historial de citas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Historial de Citas
        </h2>
        <div className="card">
          <div className="overflow-hidden">
            <table className="table-responsive">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.reason}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.professional.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.professional.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Completada
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="mt-8">
        <div className="stats-grid">
          <div className="stats-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date)
                    const now = new Date()
                    return aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedAppointments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingAppointments.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 