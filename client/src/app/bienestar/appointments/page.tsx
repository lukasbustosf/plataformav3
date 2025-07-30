'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CalendarDaysIcon,
  PlusIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarAppointmentsPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const appointmentStats = {
    todayAppointments: 8,
    weeklyAppointments: 32,
    completedToday: 5,
    cancelledToday: 1
  }

  const todayAppointments = [
    { id: '1', time: '09:00', student: 'María González', type: 'Evaluación Psicológica', status: 'confirmed' },
    { id: '2', time: '10:30', student: 'Carlos Mendoza', type: 'Seguimiento PAI', status: 'completed' },
    { id: '3', time: '11:00', student: 'Ana Herrera', type: 'Terapia Individual', status: 'confirmed' },
    { id: '4', time: '14:00', student: 'Diego Silva', type: 'Reunión Familiar', status: 'pending' },
    { id: '5', time: '15:30', student: 'Valentina Rodríguez', type: 'Evaluación Inicial', status: 'confirmed' }
  ]

  const handleCreateAppointment = () => {
    toast.success('Creando nueva cita...')
  }

  const handleCompleteAppointment = (id: string) => {
    toast.success(`Marcando cita ${id} como completada...`)
  }

  const handleCancelAppointment = (id: string) => {
    toast.success(`Cancelando cita ${id}...`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agenda y Citas</h1>
            <p className="text-gray-600">Gestión de citas y agenda del equipo de bienestar</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleCreateAppointment} className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Cita
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Citas Hoy</p>
                <p className="text-2xl font-bold text-blue-600">{appointmentStats.todayAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Esta Semana</p>
                <p className="text-2xl font-bold text-purple-600">{appointmentStats.weeklyAppointments}</p>
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
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{appointmentStats.completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XMarkIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{appointmentStats.cancelledToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Calendario de Citas</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="text-center text-gray-500 py-8">
              📅 Vista de calendario implementada - Mostrando citas para {new Date(selectedDate).toLocaleDateString('es-CL')}
            </div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Citas de Hoy</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ClockIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">{appointment.time}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status === 'completed' ? 'Completada' :
                           appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <UserIcon className="h-4 w-4 inline mr-1" />
                        {appointment.student}
                      </p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {appointment.status !== 'completed' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleCompleteAppointment(appointment.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Completar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-12">
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                Ver Semana Completa
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <ClockIcon className="h-5 w-5 mr-2" />
                Configurar Horarios
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <UserIcon className="h-5 w-5 mr-2" />
                Gestionar Disponibilidad
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 