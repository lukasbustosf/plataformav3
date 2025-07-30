'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { 
  BellIcon, 
  ExclamationTriangleIcon, 
  AcademicCapIcon,
  HeartIcon,
  CalendarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
  FunnelIcon,
  EnvelopeOpenIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'academic' | 'pai_case' | 'bienestar' | 'attendance' | 'emergency' | 'exam' | 'task' | 'achievement'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  studentName: string
  sender: string
  timestamp: string
  read: boolean
  requiresAction: boolean
  actionType?: 'response_required' | 'meeting_request' | 'document_review' | 'emergency_contact'
  relatedLink?: string
  metadata?: any
}

export default function GuardianNotificationsPage() {
  const { user, fullName } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'priority' | 'unread'>('newest')
  const [loading, setLoading] = useState(true)

  // Mock notifications data
  useEffect(() => {
    setTimeout(() => {
      setNotifications([
        {
          id: 'NOT-001',
          type: 'pai_case',
          priority: 'high',
          title: 'Nuevo Plan de Apoyo Individual (PAI)',
          message: 'Se ha creado un nuevo Plan de Apoyo Individual para Sofía. Se requiere reunión con apoderados para establecer objetivos.',
          studentName: 'Sofía Martínez',
          sender: 'Psic. Ana López - Equipo Bienestar',
          timestamp: '2024-12-19T10:30:00Z',
          read: false,
          requiresAction: true,
          actionType: 'meeting_request',
          relatedLink: '/guardian/support-cases/PAI-001',
          metadata: { meetingDate: '2024-12-22', caseId: 'PAI-001' }
        },
        {
          id: 'NOT-002',
          type: 'exam',
          priority: 'medium',
          title: 'Examen de Matemáticas Programado',
          message: 'Se ha programado un examen de matemáticas para mañana. Temas: Álgebra y ecuaciones lineales.',
          studentName: 'Sofía Martínez',
          sender: 'Prof. Carlos Pérez - Matemáticas',
          timestamp: '2024-12-18T16:45:00Z',
          read: false,
          requiresAction: false,
          relatedLink: '/guardian/academic-progress'
        },
        {
          id: 'NOT-003',
          type: 'attendance',
          priority: 'medium',
          title: 'Llegada Tardía Registrada',
          message: 'Sofía llegó 20 minutos tarde a clases hoy. Favor coordinar para evitar retrasos futuros.',
          studentName: 'Sofía Martínez',
          sender: 'Inspectoría General',
          timestamp: '2024-12-18T08:45:00Z',
          read: true,
          requiresAction: false,
          relatedLink: '/guardian/attendance'
        },
        {
          id: 'NOT-004',
          type: 'achievement',
          priority: 'low',
          title: '¡Logro Desbloqueado!',
          message: 'Sofía ha completado el desafío "Matemático del Mes" con excelente desempeño.',
          studentName: 'Sofía Martínez',
          sender: 'Sistema EDU21',
          timestamp: '2024-12-17T14:30:00Z',
          read: true,
          requiresAction: false,
          relatedLink: '/guardian/achievements'
        },
        {
          id: 'NOT-005',
          type: 'bienestar',
          priority: 'high',
          title: 'Seguimiento Estado Emocional',
          message: 'Se ha detectado un cambio en el estado emocional de Sofía. Se recomienda agendar cita con psicólogo.',
          studentName: 'Sofía Martínez',
          sender: 'Equipo Bienestar Escolar',
          timestamp: '2024-12-17T11:15:00Z',
          read: false,
          requiresAction: true,
          actionType: 'meeting_request',
          relatedLink: '/guardian/appointments'
        },
        {
          id: 'NOT-006',
          type: 'task',
          priority: 'medium',
          title: 'Nueva Tarea Asignada',
          message: 'Se ha asignado una nueva tarea de Lenguaje: "Ensayo sobre literatura contemporánea". Fecha límite: 25 de diciembre.',
          studentName: 'Sofía Martínez',
          sender: 'Prof. María González - Lenguaje',
          timestamp: '2024-12-16T13:20:00Z',
          read: true,
          requiresAction: false,
          relatedLink: '/guardian/academic-progress'
        },
        {
          id: 'NOT-007',
          type: 'emergency',
          priority: 'critical',
          title: 'Protocolo de Crisis Activado',
          message: 'Se ha activado protocolo de apoyo emocional. Su hija está segura y recibiendo atención del equipo especializado.',
          studentName: 'Sofía Martínez',
          sender: 'Dirección Académica',
          timestamp: '2024-12-15T09:00:00Z',
          read: true,
          requiresAction: true,
          actionType: 'emergency_contact',
          relatedLink: '/guardian/emergency-contact'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return <AcademicCapIcon className="h-5 w-5" />
      case 'pai_case':
        return <DocumentTextIcon className="h-5 w-5" />
      case 'bienestar':
        return <HeartIcon className="h-5 w-5" />
      case 'attendance':
        return <ClockIcon className="h-5 w-5" />
      case 'emergency':
        return <ExclamationTriangleIcon className="h-5 w-5" />
      case 'exam':
        return <AcademicCapIcon className="h-5 w-5" />
      case 'task':
        return <DocumentTextIcon className="h-5 w-5" />
      case 'achievement':
        return <CheckCircleIcon className="h-5 w-5" />
      default:
        return <BellIcon className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'text-blue-600 bg-blue-100'
      case 'pai_case':
        return 'text-purple-600 bg-purple-100'
      case 'bienestar':
        return 'text-pink-600 bg-pink-100'
      case 'attendance':
        return 'text-yellow-600 bg-yellow-100'
      case 'emergency':
        return 'text-red-600 bg-red-100'
      case 'exam':
        return 'text-indigo-600 bg-indigo-100'
      case 'task':
        return 'text-teal-600 bg-teal-100'
      case 'achievement':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `Hace ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Hace ${diffInDays} días`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'high_priority') return ['high', 'critical'].includes(notification.priority)
    if (filter === 'action_required') return notification.requiresAction
    if (filter !== 'all') return notification.type === filter
    return true
  })

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    if (sortBy === 'unread') {
      if (a.read !== b.read) return a.read ? 1 : -1
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    toast.success('Todas las notificaciones marcadas como leídas')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
    toast.success('Notificación eliminada')
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setSelectedNotification(notification)
    setShowDetailModal(true)
  }

  const handleActionClick = (notification: Notification) => {
    switch (notification.actionType) {
      case 'meeting_request':
        toast.success('Redirigiendo a agendar reunión...')
        break
      case 'emergency_contact':
        toast.success('Contactando con equipo de emergencia...')
        break
      case 'document_review':
        toast.success('Abriendo documentos para revisión...')
        break
      case 'response_required':
        toast.success('Abriendo formulario de respuesta...')
        break
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const actionRequiredCount = notifications.filter(n => n.requiresAction && !n.read).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando notificaciones...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">Centro de Notificaciones 🔔</h1>
          <p className="mt-2 opacity-90">Mantente al día con el progreso y bienestar de tu hija/o</p>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    {notification.sender} • {notification.studentName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
} 