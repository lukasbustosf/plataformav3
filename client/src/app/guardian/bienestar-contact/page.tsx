'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  HeartIcon, 
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface BienestarProfessional {
  id: string
  name: string
  role: string
  specialization: string[]
  email: string
  phone: string
  availability: string
  photoUrl?: string
  isOnline: boolean
  nextAvailable: string
}

interface ContactRequest {
  id: string
  type: 'consultation' | 'urgent' | 'appointment' | 'follow_up'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  message: string
  requestedProfessional?: string
  preferredTime?: string
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  createdAt: string
  responseAt?: string
  appointmentDate?: string
}

export default function GuardianBienestarContactPage() {
  const { user, fullName } = useAuth()
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<BienestarProfessional | null>(null)
  const [contactType, setContactType] = useState<'consultation' | 'urgent' | 'appointment' | 'follow_up'>('consultation')
  const [loading, setLoading] = useState(true)

  // Mock data for child info
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    rut: '23.456.789-1'
  }

  const bienestarTeam: BienestarProfessional[] = [
    {
      id: 'prof-001',
      name: 'Psic. Ana López',
      role: 'Psicóloga Escolar',
      specialization: ['Apoyo emocional', 'Ansiedad escolar', 'Autoestima', 'Habilidades sociales'],
      email: 'ana.lopez@colegio.cl',
      phone: '+56 9 8765 4321',
      availability: 'L-V 9:00-17:00',
      isOnline: true,
      nextAvailable: '2024-12-22T10:00:00Z'
    },
    {
      id: 'prof-002',
      name: 'T.S. María Torres',
      role: 'Trabajadora Social',
      specialization: ['Contexto familiar', 'Vulnerabilidad social', 'Redes de apoyo', 'Mediación'],
      email: 'maria.torres@colegio.cl',
      phone: '+56 9 7654 3210',
      availability: 'L-V 8:30-16:30',
      isOnline: false,
      nextAvailable: '2024-12-23T14:00:00Z'
    },
    {
      id: 'prof-003',
      name: 'Prof. Carmen Vega',
      role: 'Psicopedagoga',
      specialization: ['Dificultades de aprendizaje', 'Estrategias de estudio', 'NEE', 'Evaluación cognitiva'],
      email: 'carmen.vega@colegio.cl',
      phone: '+56 9 6543 2109',
      availability: 'L-V 9:00-18:00',
      isOnline: true,
      nextAvailable: '2024-12-20T15:30:00Z'
    },
    {
      id: 'prof-004',
      name: 'Enf. Roberto Silva',
      role: 'Enfermero Escolar',
      specialization: ['Primeros auxilios', 'Medicamentos', 'Emergencias médicas', 'Salud preventiva'],
      email: 'roberto.silva@colegio.cl',
      phone: '+56 9 5432 1098',
      availability: 'L-V 8:00-16:00',
      isOnline: true,
      nextAvailable: '2024-12-20T11:00:00Z'
    }
  ]

  const contactHistory: ContactRequest[] = [
    {
      id: 'req-001',
      type: 'consultation',
      priority: 'medium',
      subject: 'Consulta sobre ansiedad antes de exámenes',
      message: 'Hola, me gustaría conversar sobre estrategias para ayudar a Sofía con la ansiedad que presenta antes de las evaluaciones.',
      requestedProfessional: 'prof-001',
      status: 'completed',
      createdAt: '2024-12-15T10:00:00Z',
      responseAt: '2024-12-15T14:30:00Z',
      appointmentDate: '2024-12-17T15:00:00Z'
    },
    {
      id: 'req-002',
      type: 'follow_up',
      priority: 'low',
      subject: 'Seguimiento técnicas de relajación',
      message: 'Quisiera hacer seguimiento de las técnicas de relajación que practicamos en casa.',
      requestedProfessional: 'prof-001',
      status: 'scheduled',
      createdAt: '2024-12-18T16:00:00Z',
      responseAt: '2024-12-18T17:15:00Z',
      appointmentDate: '2024-12-22T10:00:00Z'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleContactProfessional = (professional: BienestarProfessional) => {
    setSelectedProfessional(professional)
    setShowContactModal(true)
  }

  const handleSubmitRequest = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Solicitud enviada exitosamente')
      setShowContactModal(false)
      setSelectedProfessional(null)
    } catch (error) {
      toast.error('Error al enviar solicitud')
    }
  }

  const handleUrgentContact = () => {
    toast.success('Llamada de emergencia iniciada al equipo de bienestar')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100'
      case 'scheduled': return 'text-blue-700 bg-blue-100'
      case 'pending': return 'text-yellow-700 bg-yellow-100'
      case 'cancelled': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100'
      case 'high': return 'text-orange-700 bg-orange-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'low': return 'text-green-700 bg-green-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contacto Equipo Bienestar</h1>
              <p className="text-gray-600 mt-2">
                Comunícate con nuestro equipo de bienestar escolar para {childInfo.name}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleUrgentContact}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <ExclamationTriangleIcon className="h-4 w-4" />
                Contacto Urgente
              </Button>
              <Button
                onClick={() => setShowContactModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Nueva Consulta
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Emergency Contact */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800">Contacto de Emergencia</h3>
              <p className="text-red-700 mt-1">
                En caso de emergencia o situación que requiera atención inmediata, utiliza estos canales:
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Teléfono Emergencia</p>
                    <p className="text-red-700">+56 2 2555 0123</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">Email Urgente</p>
                    <p className="text-red-700">emergencia@colegio.cl</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bienestar Team */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Equipo de Bienestar</h2>
            <p className="text-gray-600 mt-1">Profesionales disponibles para apoyar a tu hijo/a</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bienestarTeam.map((professional) => (
                <div key={professional.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                        <p className="text-blue-600">{professional.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${professional.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                          <span className={`text-xs ${professional.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            {professional.isOnline ? 'En línea' : 'Desconectado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialization.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Disponibilidad: {professional.availability}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4" />
                      <span>Próxima cita: {new Date(professional.nextAvailable).toLocaleDateString('es-CL')}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => handleContactProfessional(professional)}
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Contactar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <EnvelopeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Historial de Contactos</h2>
            <p className="text-gray-600 mt-1">Solicitudes y consultas anteriores</p>
          </div>
          <div className="divide-y divide-gray-200">
            {contactHistory.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                        <p className="text-gray-600 mt-1">{request.message}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>Creado: {new Date(request.createdAt).toLocaleDateString('es-CL')}</span>
                          {request.appointmentDate && (
                            <span>Cita: {new Date(request.appointmentDate).toLocaleDateString('es-CL')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status === 'completed' ? 'Completado' : 
                         request.status === 'scheduled' ? 'Programado' :
                         request.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(request.priority)}`}>
                        {request.priority === 'urgent' ? 'Urgente' :
                         request.priority === 'high' ? 'Alta' :
                         request.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    {request.status === 'scheduled' && (
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Modal */}
        <ResponsiveModal
          open={showContactModal}
          onClose={() => {
            setShowContactModal(false)
            setSelectedProfessional(null)
          }}
          title="Nueva Consulta"
        >
          <div className="space-y-4">
            {selectedProfessional && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">{selectedProfessional.name}</h3>
                    <p className="text-blue-700">{selectedProfessional.role}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Consulta
              </label>
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="consultation">Consulta General</option>
                <option value="appointment">Solicitar Cita</option>
                <option value="follow_up">Seguimiento</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asunto
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe brevemente el motivo de tu consulta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Detalla tu consulta o solicitud..."
              />
            </div>

            {contactType === 'appointment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Preferida
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSubmitRequest}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Enviar Solicitud
              </Button>
              <Button
                onClick={() => setShowContactModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </ResponsiveModal>
      </div>
    </DashboardLayout>
  )
} 