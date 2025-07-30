'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  AcademicCapIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon,
  CalendarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function GuardianDashboard() {
  const { user, fullName } = useAuth()

  // Mock data for child's information
  const childData = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    teacher: 'Prof. María González',
    avgGrade: 6.2,
    attendance: 94.5,
    lastGameScore: 85,
    pendingTasks: 3
  }

  const recentGrades = [
    { subject: 'Matemáticas', grade: 6.5, date: '15 Dic', type: 'Quiz IA' },
    { subject: 'Lenguaje', grade: 5.8, date: '14 Dic', type: 'Ensayo' },
    { subject: 'Ciencias', grade: 6.8, date: '13 Dic', type: 'Laboratorio' },
    { subject: 'Historia', grade: 6.0, date: '12 Dic', type: 'Trivia Game' }
  ]

  const notifications = [
    {
      id: 1,
      type: 'academic',
      title: 'Nueva calificación en Matemáticas',
      message: 'Sofía obtuvo un 6.5 en el quiz de álgebra',
      timestamp: '2 horas',
      read: false
    },
    {
      id: 2,
      type: 'attendance',
      title: 'Llegada tardía',
      message: 'Sofía llegó 15 minutos tarde hoy',
      timestamp: '1 día',
      read: false
    },
    {
      id: 3,
      type: 'achievement',
      title: '¡Logro desbloqueado!',
      message: 'Sofía completó el desafío "Matemático del Mes"',
      timestamp: '2 días',
      read: true
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunión de Apoderados',
      date: '2024-12-22',
      time: '19:00',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Entrega de Notas',
      date: '2024-12-20',
      time: '15:30',
      type: 'academic'
    },
    {
      id: 3,
      title: 'Obra de Teatro',
      date: '2024-12-25',
      time: '18:00',
      type: 'event'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Portal de Apoderados 👨‍👩‍👧‍👦</h1>
          <p className="mt-2 opacity-90">
            Bienvenido/a, {fullName}. Mantente al día con el progreso de {childData.name}.
          </p>
        </div>

        {/* Child Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Resumen de {childData.name}</h2>
              <span className="text-sm text-gray-500">{childData.grade}</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.avgGrade}</div>
                <div className="text-sm text-gray-600">Promedio General</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.attendance}%</div>
                <div className="text-sm text-gray-600">Asistencia</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <TrophyIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.lastGameScore}%</div>
                <div className="text-sm text-gray-600">Último Juego</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <DocumentTextIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.pendingTasks}</div>
                <div className="text-sm text-gray-600">Tareas Pendientes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Grades & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Calificaciones Recientes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{grade.subject}</div>
                      <div className="text-sm text-gray-600">{grade.type} • {grade.date}</div>
                    </div>
                    <div className={`text-lg font-bold ${
                      grade.grade >= 6.0 ? 'text-green-600' :
                      grade.grade >= 5.0 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {grade.grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Notificaciones</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}>
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'academic' ? 'bg-blue-400' :
                      notification.type === 'attendance' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{notification.title}</div>
                      <div className="text-sm text-gray-600">{notification.message}</div>
                      <div className="text-xs text-gray-500 mt-1">Hace {notification.timestamp}</div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Próximos Eventos</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{event.date}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communication Panel */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Comunicación con el Colegio</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <AcademicCapIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Profesor Jefe</div>
                    <div className="text-sm text-gray-600">{childData.teacher}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    Mensaje
                  </Button>
                  <Button variant="outline" size="sm">
                    <PhoneIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Centro de Mensajes</div>
                    <div className="text-sm text-gray-600">2 mensajes sin leer</div>
                  </div>
                </div>
                <Button variant="primary" size="sm" className="w-full">
                  Ver Mensajes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <DocumentTextIcon className="h-6 w-6" />
            <span>Solicitar Certificado</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <ClockIcon className="h-6 w-6" />
            <span>Justificar Ausencia</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <CalendarIcon className="h-6 w-6" />
            <span>Agendar Reunión</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            <span>Contactar Profesor</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
} 