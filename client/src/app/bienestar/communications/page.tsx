'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ChatBubbleOvalLeftEllipsisIcon,
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarCommunicationsPage() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('messages')

  const communicationStats = {
    totalMessages: 156,
    unreadMessages: 12,
    sentToday: 8,
    emergencyAlerts: 2
  }

  const handleSendMessage = () => {
    toast.success('Enviando mensaje...')
  }

  const handleSendEmergencyAlert = () => {
    toast.success('Enviando alerta de emergencia...')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comunicaciones</h1>
            <p className="text-gray-600">Centro de comunicaciones con estudiantes, familias y equipo</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleSendEmergencyAlert} className="bg-red-600 hover:bg-red-700">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              Alerta Emergencia
            </Button>
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Mensaje
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Mensajes</p>
                <p className="text-2xl font-bold text-blue-600">{communicationStats.totalMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">No Leídos</p>
                <p className="text-2xl font-bold text-yellow-600">{communicationStats.unreadMessages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <PaperAirplaneIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Enviados Hoy</p>
                <p className="text-2xl font-bold text-green-600">{communicationStats.sentToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas</p>
                <p className="text-2xl font-bold text-red-600">{communicationStats.emergencyAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Canales de Comunicación</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center mb-3">
                  <EnvelopeIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="font-medium text-gray-900">Correo Electrónico</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Comunicación formal con familias y profesionales</p>
                <Button variant="outline" className="w-full">
                  Enviar Correo
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center mb-3">
                  <DevicePhoneMobileIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="font-medium text-gray-900">SMS/WhatsApp</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Mensajes instantáneos y notificaciones urgentes</p>
                <Button variant="outline" className="w-full">
                  Enviar SMS
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center mb-3">
                  <PhoneIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="font-medium text-gray-900">Llamada Telefónica</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Contacto directo para casos urgentes</p>
                <Button variant="outline" className="w-full">
                  Realizar Llamada
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Message Templates */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Plantillas de Mensajes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Citación a Reunión</h3>
                <p className="text-sm text-gray-600 mb-3">
                  "Estimado/a [Nombre], nos comunicamos para coordinar una reunión sobre el bienestar de [Estudiante]..."
                </p>
                <Button size="sm" variant="outline">Usar Plantilla</Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Seguimiento de Intervención</h3>
                <p className="text-sm text-gray-600 mb-3">
                  "Estimada familia, queremos informarle sobre el progreso de [Estudiante] en su proceso de intervención..."
                </p>
                <Button size="sm" variant="outline">Usar Plantilla</Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Alerta de Emergencia</h3>
                <p className="text-sm text-gray-600 mb-3">
                  "URGENTE: Necesitamos que se comunique inmediatamente con el colegio respecto a [Estudiante]..."
                </p>
                <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Usar Plantilla
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Comunicaciones Recientes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              {
                id: 1,
                type: 'email',
                recipient: 'Carmen González (Apoderada)',
                subject: 'Reunión de seguimiento - María González',
                date: '19/12/2024 14:30',
                status: 'sent'
              },
              {
                id: 2,
                type: 'sms',
                recipient: 'Roberto Mendoza',
                subject: 'Recordatorio cita psicología',
                date: '19/12/2024 10:15',
                status: 'delivered'
              },
              {
                id: 3,
                type: 'phone',
                recipient: 'Laura Herrera',
                subject: 'Llamada de seguimiento',
                date: '18/12/2024 16:45',
                status: 'completed'
              }
            ].map((communication) => (
              <div key={communication.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {communication.type === 'email' && <EnvelopeIcon className="h-6 w-6 text-blue-600" />}
                      {communication.type === 'sms' && <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />}
                      {communication.type === 'phone' && <PhoneIcon className="h-6 w-6 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{communication.subject}</h3>
                      <p className="text-sm text-gray-600">{communication.recipient}</p>
                      <p className="text-xs text-gray-500">{communication.date}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    communication.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    communication.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {communication.status === 'sent' ? 'Enviado' :
                     communication.status === 'delivered' ? 'Entregado' : 'Completado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 