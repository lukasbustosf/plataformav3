'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  AcademicCapIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  DocumentTextIcon,
  CalendarIcon,
  ShieldExclamationIcon,
  CogIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  SpeakerWaveIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

// ===============================================
// INTERFACES & TYPES
// ===============================================

interface Notification {
  notification_id: string
  guardian_id: string
  student_id: string
  type: NotificationType
  priority: 'low' | 'medium' | 'high' | 'urgent'
  title: string
  message: string
  detailed_content?: string
  action_url?: string
  action_label?: string
  
  // Metadata
  sender_type: 'system' | 'teacher' | 'admin' | 'bienestar' | 'emergency'
  sender_id?: string
  sender_name?: string
  source_module: string
  reference_id?: string
  
  // Status & Timing
  status: 'pending' | 'delivered' | 'read' | 'acted_upon' | 'expired'
  delivery_method: DeliveryMethod[]
  scheduled_at?: string
  delivered_at?: string
  read_at?: string
  expires_at?: string
  
  // Rich Content
  attachments?: NotificationAttachment[]
  quick_actions?: QuickAction[]
  
  created_at: string
  updated_at: string
}

type NotificationType = 
  | 'academic_grade' 
  | 'academic_assignment' 
  | 'academic_feedback'
  | 'attendance_absence' 
  | 'attendance_late' 
  | 'attendance_pattern'
  | 'behavior_positive' 
  | 'behavior_concern' 
  | 'behavior_incident'
  | 'communication_message' 
  | 'communication_meeting' 
  | 'communication_request'
  | 'achievement_unlock' 
  | 'achievement_milestone' 
  | 'achievement_recognition'
  | 'announcement_general' 
  | 'announcement_class' 
  | 'announcement_urgent'
  | 'emergency_alert' 
  | 'emergency_evacuation' 
  | 'emergency_closure'
  | 'health_medication' 
  | 'health_incident' 
  | 'health_screening'
  | 'payment_due' 
  | 'payment_overdue' 
  | 'payment_receipt'
  | 'event_reminder' 
  | 'event_change' 
  | 'event_cancellation'
  | 'system_maintenance' 
  | 'system_update' 
  | 'system_outage'

type DeliveryMethod = 'push' | 'email' | 'sms' | 'in_app' | 'voice_call'

interface NotificationAttachment {
  attachment_id: string
  type: 'pdf' | 'image' | 'audio' | 'video' | 'link'
  title: string
  url: string
  file_size?: number
}

interface QuickAction {
  action_id: string
  label: string
  type: 'acknowledge' | 'reply' | 'schedule' | 'download' | 'view' | 'approve' | 'decline'
  url?: string
  api_endpoint?: string
  confirmation_required: boolean
}

interface NotificationPreferences {
  guardian_id: string
  delivery_methods: {
    [key in NotificationType]: DeliveryMethod[]
  }
  quiet_hours: {
    enabled: boolean
    start_time: string
    end_time: string
    timezone: string
    emergency_override: boolean
  }
  digest_settings: {
    enabled: boolean
    frequency: 'daily' | 'weekly'
    time: string
    types: NotificationType[]
  }
  device_tokens: {
    fcm_tokens: string[]
    email_verified: boolean
    phone_verified: boolean
  }
}

interface NotificationCenterProps {
  guardianId: string
  studentId: string
  isOpen: boolean
  onClose: () => void
  compact?: boolean
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function NotificationCenter({
  guardianId,
  studentId,
  isOpen,
  onClose,
  compact = false
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  
  // Filter & View State
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'urgent'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')
  
  // UI State
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set())
  
  // Real-time updates
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected')

  // ===============================================
  // LIFECYCLE & DATA LOADING
  // ===============================================

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
      loadPreferences()
      setupRealTimeUpdates()
    }
  }, [isOpen, guardianId, studentId])

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (isOpen && connectionStatus === 'connected') {
        loadNotifications(true) // Silent refresh
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen, connectionStatus])

  const loadNotifications = async (silent = false) => {
    if (!silent) setLoading(true)
    
    try {
      const params = new URLSearchParams({
        guardian_id: guardianId,
        student_id: studentId,
        date_range: dateRange,
        limit: '50'
      })

      if (activeFilter !== 'all') params.append('type', activeFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter === 'unread' ? 'pending,delivered' : 'read,acted_upon')

      const response = await fetch(`/api/guardian/notifications?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.data)
        setLastUpdate(new Date())
      } else {
        throw new Error(data.error?.message || 'Failed to load notifications')
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
      if (!silent) {
        toast.error('Error al cargar notificaciones')
      }
      setConnectionStatus('disconnected')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const loadPreferences = async () => {
    try {
      const response = await fetch(`/api/guardian/notification-preferences/${guardianId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPreferences(data.data)
      }
    } catch (error) {
      console.error('Failed to load preferences:', error)
    }
  }

  const setupRealTimeUpdates = () => {
    // Initialize FCM for real-time notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        try {
          // Firebase messaging would be initialized here
          // For now, we'll mock the functionality
          console.log('FCM would be initialized here')
          
          // Mock token generation
          const mockToken = `mock_fcm_token_${Date.now()}`
          
          if (preferences) {
            // Mock FCM token update
            console.log('Would update FCM token:', mockToken)
          }
          
          // Mock real-time message listening setup
          console.log('FCM message listener would be set up here')
          
          setConnectionStatus('connected')
        } catch (error) {
          console.error('FCM setup error:', error)
          setConnectionStatus('disconnected')
        }
      })
    }
  }

  // ===============================================
  // NOTIFICATION ACTIONS
  // ===============================================

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/guardian/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => 
            n.notification_id === notificationId 
              ? { ...n, status: 'read', read_at: new Date().toISOString() }
              : n
          )
        )
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => n.status === 'pending' || n.status === 'delivered')
        .map(n => n.notification_id)
      
      if (unreadIds.length === 0) {
        toast('No hay notificaciones sin leer')
        return
      }

      const response = await fetch('/api/guardian/notifications/mark-read-bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notification_ids: unreadIds })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => 
            unreadIds.includes(n.notification_id)
              ? { ...n, status: 'read', read_at: new Date().toISOString() }
              : n
          )
        )
        toast.success(`${unreadIds.length} notificaciones marcadas como leídas`)
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Error al marcar notificaciones como leídas')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/guardian/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.notification_id !== notificationId))
        toast.success('Notificación eliminada')
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Error al eliminar notificación')
    }
  }

  const executeQuickAction = async (notification: Notification, action: QuickAction) => {
    if (action.confirmation_required) {
      const confirmed = window.confirm(`¿Estás seguro de que deseas ${action.label.toLowerCase()}?`)
      if (!confirmed) return
    }

    try {
      let response
      
      if (action.api_endpoint) {
        response = await fetch(action.api_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            notification_id: notification.notification_id,
            action_type: action.type
          })
        })
      } else if (action.url) {
        window.open(action.url, '_blank')
        return
      }
      
      if (response) {
        const data = await response.json()
        
        if (data.success) {
          // Update notification status
          setNotifications(prev => 
            prev.map(n => 
              n.notification_id === notification.notification_id
                ? { ...n, status: 'acted_upon' }
                : n
            )
          )
          toast.success(`Acción "${action.label}" ejecutada exitosamente`)
        }
      }
    } catch (error) {
      console.error('Failed to execute quick action:', error)
      toast.error('Error al ejecutar acción')
    }
  }

  // ===============================================
  // FCM HELPER FUNCTIONS
  // ===============================================

  const updateFCMToken = async (token: string) => {
    try {
      await fetch('/api/guardian/fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          guardian_id: guardianId,
          fcm_token: token,
          device_info: {
            user_agent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language
          }
        })
      })
    } catch (error) {
      console.error('Failed to update FCM token:', error)
    }
  }

  const parseFirebaseMessage = (data: any): Notification => {
    return {
      notification_id: data.notification_id || `fcm_${Date.now()}`,
      guardian_id: guardianId,
      student_id: studentId,
      type: data.type || 'announcement_general',
      priority: data.priority || 'medium',
      title: data.title || 'Nueva notificación',
      message: data.message || '',
      detailed_content: data.detailed_content,
      action_url: data.action_url,
      action_label: data.action_label,
      sender_type: data.sender_type || 'system',
      sender_id: data.sender_id,
      sender_name: data.sender_name,
      source_module: data.source_module || 'notifications',
      reference_id: data.reference_id,
      status: 'delivered',
      delivery_method: ['push'],
      delivered_at: new Date().toISOString(),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // ===============================================
  // UI HELPER FUNCTIONS
  // ===============================================

  const getNotificationIcon = (type: NotificationType, priority: string) => {
    const baseClasses = "h-5 w-5"
    const priorityClasses = priority === 'urgent' ? 'text-red-500' : 
                           priority === 'high' ? 'text-orange-500' : 
                           'text-blue-500'
    
    const iconClass = `${baseClasses} ${priorityClasses}`
    
    switch (type) {
      case 'academic_grade':
      case 'academic_assignment':
      case 'academic_feedback':
        return <AcademicCapIcon className={iconClass} />
      case 'attendance_absence':
      case 'attendance_late':
      case 'attendance_pattern':
        return <ClockIcon className={iconClass} />
      case 'communication_message':
      case 'communication_meeting':
      case 'communication_request':
        return <ChatBubbleLeftRightIcon className={iconClass} />
      case 'achievement_unlock':
      case 'achievement_milestone':
      case 'achievement_recognition':
        return <TrophyIcon className={iconClass} />
      case 'emergency_alert':
      case 'emergency_evacuation':
      case 'emergency_closure':
        return <ShieldExclamationIcon className="h-5 w-5 text-red-600" />
      case 'behavior_concern':
      case 'behavior_incident':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'event_reminder':
      case 'event_change':
      case 'event_cancellation':
        return <CalendarIcon className={iconClass} />
      default:
        return <InformationCircleIcon className={iconClass} />
    }
  }

  const getNotificationTypeLabel = (type: NotificationType) => {
    const labels: { [key in NotificationType]: string } = {
      academic_grade: 'Calificación',
      academic_assignment: 'Tarea',
      academic_feedback: 'Retroalimentación',
      attendance_absence: 'Ausencia',
      attendance_late: 'Atraso',
      attendance_pattern: 'Patrón Asistencia',
      behavior_positive: 'Comportamiento Positivo',
      behavior_concern: 'Preocupación Comportamiento',
      behavior_incident: 'Incidente',
      communication_message: 'Mensaje',
      communication_meeting: 'Reunión',
      communication_request: 'Solicitud',
      achievement_unlock: 'Logro Desbloqueado',
      achievement_milestone: 'Hito Alcanzado',
      achievement_recognition: 'Reconocimiento',
      announcement_general: 'Anuncio General',
      announcement_class: 'Anuncio de Clase',
      announcement_urgent: 'Anuncio Urgente',
      emergency_alert: 'Alerta de Emergencia',
      emergency_evacuation: 'Evacuación',
      emergency_closure: 'Cierre de Emergencia',
      health_medication: 'Medicación',
      health_incident: 'Incidente de Salud',
      health_screening: 'Examen de Salud',
      payment_due: 'Pago Pendiente',
      payment_overdue: 'Pago Vencido',
      payment_receipt: 'Comprobante de Pago',
      event_reminder: 'Recordatorio de Evento',
      event_change: 'Cambio de Evento',
      event_cancellation: 'Cancelación de Evento',
      system_maintenance: 'Mantenimiento',
      system_update: 'Actualización',
      system_outage: 'Interrupción del Sistema'
    }
    
    return labels[type] || type
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50'
      case 'high': return 'border-l-orange-500 bg-orange-50'
      case 'medium': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-300 bg-gray-50'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora mismo'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays}d`
    
    return date.toLocaleDateString()
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter !== 'all' && notification.type !== activeFilter) return false
    if (priorityFilter !== 'all' && notification.priority !== priorityFilter) return false
    if (statusFilter === 'unread' && !['pending', 'delivered'].includes(notification.status)) return false
    if (statusFilter === 'read' && !['read', 'acted_upon'].includes(notification.status)) return false
    return true
  })

  const unreadCount = notifications.filter(n => ['pending', 'delivered'].includes(n.status)).length

  // ===============================================
  // RENDER NOTIFICATION ITEM
  // ===============================================

  const renderNotificationItem = (notification: Notification) => {
    const isUnread = ['pending', 'delivered'].includes(notification.status)
    const isExpanded = expandedNotifications.has(notification.notification_id)
    
    return (
      <motion.div
        key={notification.notification_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`border-l-4 ${getPriorityColor(notification.priority)} 
          border border-gray-200 rounded-lg mb-3 overflow-hidden
          ${isUnread ? 'shadow-md' : 'shadow-sm'}
        `}
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type, notification.priority)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h4>
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {getNotificationTypeLabel(notification.type)}
                  </span>
                </div>
                
                <p className={`mt-1 text-sm ${isUnread ? 'text-gray-800' : 'text-gray-600'}`}>
                  {notification.message}
                </p>
                
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatTimeAgo(notification.created_at)}</span>
                  {notification.sender_name && (
                    <span>• {notification.sender_name}</span>
                  )}
                  {notification.delivery_method.includes('push') && (
                    <DevicePhoneMobileIcon className="h-3 w-3" />
                  )}
                  {notification.delivery_method.includes('email') && (
                    <EnvelopeIcon className="h-3 w-3" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {notification.detailed_content && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isExpanded) {
                      setExpandedNotifications(prev => {
                        const newSet = new Set(prev)
                        newSet.delete(notification.notification_id)
                        return newSet
                      })
                    } else {
                      setExpandedNotifications(prev => {
                        const newSet = new Set(prev)
                        newSet.add(notification.notification_id)
                        return newSet
                      })
                      if (isUnread) {
                        markAsRead(notification.notification_id)
                      }
                    }
                  }}
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteNotification(notification.notification_id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick Actions */}
          {notification.quick_actions && notification.quick_actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {notification.quick_actions.map((action) => (
                <Button
                  key={action.action_id}
                  variant="outline"
                  size="sm"
                  onClick={() => executeQuickAction(notification, action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && notification.detailed_content && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 pt-3 border-t border-gray-200"
              >
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: notification.detailed_content }} />
                </div>
                
                {notification.attachments && notification.attachments.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Adjuntos:</h5>
                    <div className="space-y-2">
                      {notification.attachments.map((attachment) => (
                        <a
                          key={attachment.attachment_id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                          <span>{attachment.title}</span>
                          {attachment.file_size && (
                            <span className="text-xs text-gray-500">
                              ({(attachment.file_size / 1024 / 1024).toFixed(1)} MB)
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // ===============================================
  // MAIN RENDER
  // ===============================================

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${compact ? 'max-w-md' : 'max-w-4xl'} w-full h-full max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Centro de Notificaciones
                </h2>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas las notificaciones leídas'}
                  {connectionStatus !== 'connected' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Sin conexión
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-4 w-4 mr-1" />
                Filtros
              </Button>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Marcar todas leídas
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadNotifications()}
                disabled={loading}
              >
                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <CogIcon className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={onClose}>
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value as any)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="academic_grade">Calificaciones</option>
                      <option value="attendance_absence">Asistencia</option>
                      <option value="communication_message">Comunicaciones</option>
                      <option value="achievement_unlock">Logros</option>
                      <option value="announcement_general">Anuncios</option>
                      <option value="emergency_alert">Emergencias</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value as any)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">Todas las prioridades</option>
                      <option value="urgent">Urgente</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="unread">Sin leer</option>
                      <option value="read">Leídas</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    >
                      <option value="today">Hoy</option>
                      <option value="week">Esta semana</option>
                      <option value="month">Este mes</option>
                      <option value="all">Todo el período</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Cargando notificaciones...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
                <p className="text-gray-500">
                  {notifications.length === 0 
                    ? 'No tienes notificaciones en este momento'
                    : 'No hay notificaciones que coincidan con los filtros aplicados'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredNotifications.map(renderNotificationItem)}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredNotifications.length} de {notifications.length} notificaciones
            </span>
            <span>
              Última actualización: {formatTimeAgo(lastUpdate.toISOString())}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 