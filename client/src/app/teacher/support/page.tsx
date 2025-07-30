'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  HeartIcon,
  PhoneIcon,
  EnvelopeIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface SupportSession {
  id: string
  student_id: string
  student_name: string
  student_grade: string
  session_date: string
  session_duration: number
  session_type: 'academic' | 'behavioral' | 'emotional' | 'family' | 'health'
  priority_level: 'low' | 'medium' | 'high' | 'urgent'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  
  // P2-C-03: Private notes and confidential information
  private_notes: string
  confidential_observations: string
  intervention_plan: string
  follow_up_required: boolean
  next_session_date?: string
  
  // P2-G-01: Guardian notification settings
  guardian_notification: {
    notify_guardian: boolean
    guardian_email: string
    guardian_phone: string
    notification_sent: boolean
    notification_type: 'email' | 'sms' | 'both'
    message_template: string
  }
  
  // Additional tracking
  previous_sessions: number
  risk_assessment: 'none' | 'low' | 'medium' | 'high'
  counselor_assigned: string
  created_by: string
  created_at: string
  updated_at: string
}

export default function SupportSessionsPage() {
  const [sessions, setSessions] = useState<SupportSession[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  // P2-C-03: New session form data
  const [newSession, setNewSession] = useState({
    student_id: '',
    student_name: '',
    student_grade: '',
    session_date: '',
    session_duration: 45,
    session_type: 'academic' as const,
    priority_level: 'medium' as const,
    private_notes: '',
    confidential_observations: '',
    intervention_plan: '',
    follow_up_required: false,
    next_session_date: '',
    guardian_notification: {
      notify_guardian: false,
      guardian_email: '',
      guardian_phone: '',
      notification_sent: false,
      notification_type: 'email' as const,
      message_template: ''
    },
    risk_assessment: 'none' as const
  })

  // Mock data for support sessions
  const mockSessions: SupportSession[] = [
    {
      id: 'sup-1',
      student_id: 'std-001',
      student_name: 'María González',
      student_grade: '5°A',
      session_date: new Date().toISOString(),
      session_duration: 45,
      session_type: 'emotional',
      priority_level: 'high',
      status: 'scheduled',
      private_notes: 'Estudiante muestra signos de ansiedad ante evaluaciones. Requiere apoyo emocional y técnicas de relajación.',
      confidential_observations: 'Situación familiar compleja - padres en proceso de separación. Afecta rendimiento académico.',
      intervention_plan: 'Sesiones semanales de apoyo emocional, coordinación con psicólogo escolar, seguimiento académico personalizado.',
      follow_up_required: true,
      next_session_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      guardian_notification: {
        notify_guardian: true,
        guardian_email: 'mama.maria@email.com',
        guardian_phone: '+56987654321',
        notification_sent: false,
        notification_type: 'both',
        message_template: 'Estimada Sra. González, queremos informarle que hemos programado una sesión de apoyo para María el {date} a las {time}. El objetivo es brindarle herramientas para manejar la ansiedad escolar.'
      },
      previous_sessions: 2,
      risk_assessment: 'medium',
      counselor_assigned: 'Ana Martínez',
      created_by: 'teacher-001',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sup-2',
      student_id: 'std-002',
      student_name: 'Carlos Rodríguez',
      student_grade: '5°B',
      session_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      session_duration: 30,
      session_type: 'behavioral',
      priority_level: 'medium',
      status: 'scheduled',
      private_notes: 'Problemas de conducta en el aula. Dificultad para seguir instrucciones y respetar turnos.',
      confidential_observations: 'Posible TDAH no diagnosticado. Familia colaborativa pero con poca información sobre el trastorno.',
      intervention_plan: 'Estrategias de manejo conductual, derivación a especialista, apoyo familiar con técnicas de crianza positiva.',
      follow_up_required: true,
      next_session_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      guardian_notification: {
        notify_guardian: true,
        guardian_email: 'carlos.papa@email.com',
        guardian_phone: '+56912345678',
        notification_sent: true,
        notification_type: 'email',
        message_template: 'Estimado Sr. Rodríguez, hemos programado una sesión de apoyo conductual para Carlos. Queremos trabajar juntos para mejorar su experiencia escolar.'
      },
      previous_sessions: 0,
      risk_assessment: 'low',
      counselor_assigned: 'Pedro Silva',
      created_by: 'teacher-002',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    setSessions(mockSessions)
  }, [])

  // P2-C-03: Create new support session
  const handleCreateSession = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/support/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newSession,
          created_by: 'current-teacher-id', // Replace with actual teacher ID
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'scheduled',
          previous_sessions: 0
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Sesión de apoyo creada exitosamente - P2-C-03')
        setShowCreateModal(false)
        
        // P2-G-01: Send guardian notification if enabled
        if (newSession.guardian_notification.notify_guardian) {
          await handleSendGuardianNotification(data.session_id, newSession.guardian_notification)
        }
        
        // Reset form
        setNewSession({
          student_id: '',
          student_name: '',
          student_grade: '',
          session_date: '',
          session_duration: 45,
          session_type: 'academic',
          priority_level: 'medium',
          private_notes: '',
          confidential_observations: '',
          intervention_plan: '',
          follow_up_required: false,
          next_session_date: '',
          guardian_notification: {
            notify_guardian: false,
            guardian_email: '',
            guardian_phone: '',
            notification_sent: false,
            notification_type: 'email',
            message_template: ''
          },
          risk_assessment: 'none'
        })
        
        // Refresh sessions list
        // fetchSessions()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error al crear sesión de apoyo')
      console.error('Create session error:', error)
    } finally {
      setLoading(false)
    }
  }

  // P2-G-01: Send guardian notification
  const handleSendGuardianNotification = async (sessionId: string, notificationData: any) => {
    try {
      const response = await fetch('/api/notifications/guardian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          notification_type: notificationData.notification_type,
          guardian_email: notificationData.guardian_email,
          guardian_phone: notificationData.guardian_phone,
          message: notificationData.message_template,
          priority: 'support_session'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Notificación enviada al apoderado - P2-G-01')
      } else {
        toast.error('Sesión creada pero error al enviar notificación')
      }
    } catch (error) {
      console.error('Guardian notification error:', error)
      toast.error('Sesión creada pero error al enviar notificación')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <DocumentTextIcon className="h-5 w-5" />
      case 'behavioral': return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'emotional': return <HeartIcon className="h-5 w-5" />
      case 'family': return <UserIcon className="h-5 w-5" />
      case 'health': return <CheckCircleIcon className="h-5 w-5" />
      default: return <DocumentTextIcon className="h-5 w-5" />
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.private_notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || session.session_type === filterType
    const matchesPriority = filterPriority === 'all' || session.priority_level === filterPriority
    
    return matchesSearch && matchesType && matchesPriority
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sesiones de Apoyo - P2-C-03</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestión confidencial de sesiones de apoyo estudiantil con notificaciones automáticas
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Crear Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sesiones Programadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Alta Prioridad</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.priority_level === 'high' || s.priority_level === 'urgent').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BellIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notificaciones Enviadas - P2-G-01</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.guardian_notification.notification_sent).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Seguimiento Requerido</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.follow_up_required).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por estudiante o notas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="academic">Académico</option>
                <option value="behavioral">Conductual</option>
                <option value="emotional">Emocional</option>
                <option value="family">Familiar</option>
                <option value="health">Salud</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Sesiones de Apoyo ({filteredSessions.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedSession(session)
                  setShowDetailModal(true)
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center">
                        {getTypeIcon(session.session_type)}
                        <span className="ml-2 text-lg font-medium text-gray-900">
                          {session.student_name}
                        </span>
                      </div>
                      
                      <span className="text-sm text-gray-500">
                        {session.student_grade}
                      </span>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(session.priority_level)}`}>
                        {session.priority_level === 'urgent' ? 'Urgente' :
                         session.priority_level === 'high' ? 'Alta' :
                         session.priority_level === 'medium' ? 'Media' : 'Baja'}
                      </span>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status === 'scheduled' ? 'Programada' :
                         session.status === 'in_progress' ? 'En progreso' :
                         session.status === 'completed' ? 'Completada' : 'Cancelada'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(session.session_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {session.session_duration} min
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        {session.counselor_assigned}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 mb-2">
                      <div className="flex items-center">
                        <EyeSlashIcon className="h-4 w-4 mr-1 text-red-500" />
                        <span className="font-medium">Nota confidencial P2-C-03:</span>
                      </div>
                      <p className="mt-1 line-clamp-2">{session.private_notes}</p>
                    </div>
                    
                    {session.follow_up_required && (
                      <div className="flex items-center text-sm text-orange-600">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Requiere seguimiento
                        {session.next_session_date && (
                          <span className="ml-2">
                            - Próxima: {new Date(session.next_session_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {session.guardian_notification.notify_guardian && (
                      <div className="flex items-center text-sm">
                        {session.guardian_notification.notification_sent ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Notificado P2-G-01
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600">
                            <BellIcon className="h-4 w-4 mr-1" />
                            Pendiente P2-G-01
                          </div>
                        )}
                      </div>
                    )}
                    
                    {session.risk_assessment !== 'none' && (
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        session.risk_assessment === 'high' ? 'bg-red-100 text-red-800' :
                        session.risk_assessment === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        Riesgo: {session.risk_assessment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredSessions.length === 0 && (
              <div className="p-12 text-center">
                <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay sesiones de apoyo</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando una nueva sesión de apoyo estudiantil.
                </p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    leftIcon={<PlusIcon className="h-4 w-4" />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Crear Primera Sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 