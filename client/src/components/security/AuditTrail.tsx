'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

interface AuditEvent {
  event_id: string
  timestamp: string
  event_type: AuditEventType
  user_id: string
  user_name: string
  user_role: string
  resource_type: string
  resource_id: string
  action: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  school_id: string
  session_id: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  compliance_flag: boolean
  hash_signature: string
  metadata: Record<string, any>
}

type AuditEventType = 
  | 'user_login'
  | 'user_logout'
  | 'user_failed_login'
  | 'evaluation_created'
  | 'evaluation_launched'
  | 'evaluation_submitted'
  | 'quiz_generated_ai'
  | 'lockdown_activated'
  | 'lockdown_violation'
  | 'grade_modified'
  | 'student_impersonated'
  | 'data_exported'
  | 'permission_changed'
  | 'system_config_changed'
  | 'pai_created'
  | 'pai_signed'
  | 'support_case_created'
  | 'ai_budget_exceeded'
  | 'security_violation'
  | 'data_breach_attempt'

interface AuditTrailProps {
  schoolId: string
  userId?: string
  showAll?: boolean
  autoRefresh?: boolean
  compactView?: boolean
}

export default function AuditTrail({
  schoolId,
  userId,
  showAll = false,
  autoRefresh = true,
  compactView = false
}: AuditTrailProps) {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState<AuditEventType | 'all'>('all')
  const [riskLevelFilter, setRiskLevelFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week')
  const [userFilter, setUserFilter] = useState('')
  
  // Export
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadAuditEvents()
    
    if (autoRefresh) {
      const interval = setInterval(loadAuditEvents, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [schoolId, userId, eventTypeFilter, riskLevelFilter, dateRange, userFilter])

  const loadAuditEvents = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      const mockEvents: AuditEvent[] = [
        {
          event_id: 'evt_001',
          timestamp: new Date().toISOString(),
          event_type: 'lockdown_activated',
          user_id: 'usr_teacher_001',
          user_name: 'María González',
          user_role: 'TEACHER',
          resource_type: 'evaluation',
          resource_id: 'eval_001',
          action: 'Activar modo seguro para examen sumativo',
          details: {
            evaluation_title: 'Examen Matemáticas Unidad 3',
            lockdown_level: 'strict',
            duration_minutes: 90
          },
          ip_address: '192.168.1.105',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          school_id: schoolId,
          session_id: 'sess_' + Math.random().toString(36).substr(2, 9),
          risk_level: 'medium',
          compliance_flag: true,
          hash_signature: 'sha256_' + Math.random().toString(36).substr(2, 16),
          metadata: {}
        },
        {
          event_id: 'evt_002',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          event_type: 'security_violation',
          user_id: 'usr_student_001',
          user_name: 'Carlos Rodríguez',
          user_role: 'STUDENT',
          resource_type: 'evaluation',
          resource_id: 'eval_001',
          action: 'Intento de cambio de pestaña durante examen',
          details: {
            violation_type: 'tab_switch',
            attempts: 3,
            auto_submit_triggered: false
          },
          ip_address: '192.168.1.112',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          school_id: schoolId,
          session_id: 'sess_' + Math.random().toString(36).substr(2, 9),
          risk_level: 'high',
          compliance_flag: true,
          hash_signature: 'sha256_' + Math.random().toString(36).substr(2, 16),
          metadata: {}
        }
      ]

      setEvents(mockEvents)
    } catch (error) {
      console.error('Failed to load audit events:', error)
      toast.error('Error al cargar el registro de auditoría')
    } finally {
      setLoading(false)
    }
  }

  const exportAuditLog = async (format: 'csv' | 'pdf' | 'json') => {
    setExporting(true)
    try {
      // Mock export functionality
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Registro de auditoría exportado en formato ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Error al exportar registro de auditoría')
    } finally {
      setExporting(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getEventIcon = (eventType: AuditEventType, riskLevel: string) => {
    const riskColor = riskLevel === 'critical' ? 'text-red-600' :
                     riskLevel === 'high' ? 'text-orange-600' :
                     riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'

    switch (eventType) {
      case 'user_login':
      case 'user_logout':
        return <UserIcon className={`h-4 w-4 ${riskColor}`} />
      case 'lockdown_activated':
      case 'security_violation':
        return <ShieldCheckIcon className={`h-4 w-4 ${riskColor}`} />
      case 'evaluation_created':
      case 'evaluation_launched':
        return <DocumentTextIcon className={`h-4 w-4 ${riskColor}`} />
      case 'data_exported':
        return <ArrowDownTrayIcon className={`h-4 w-4 ${riskColor}`} />
      default:
        return <ClockIcon className={`h-4 w-4 ${riskColor}`} />
    }
  }

  const getEventTypeLabel = (eventType: AuditEventType) => {
    const labels: Record<AuditEventType, string> = {
      user_login: 'Inicio de sesión',
      user_logout: 'Cierre de sesión',
      user_failed_login: 'Fallo de autenticación',
      evaluation_created: 'Evaluación creada',
      evaluation_launched: 'Evaluación lanzada',
      evaluation_submitted: 'Evaluación enviada',
      quiz_generated_ai: 'Quiz generado con IA',
      lockdown_activated: 'Modo seguro activado',
      lockdown_violation: 'Violación de seguridad',
      grade_modified: 'Calificación modificada',
      student_impersonated: 'Estudiante suplantado',
      data_exported: 'Datos exportados',
      permission_changed: 'Permisos modificados',
      system_config_changed: 'Configuración cambiada',
      pai_created: 'PAI creado',
      pai_signed: 'PAI firmado',
      support_case_created: 'Caso de soporte creado',
      ai_budget_exceeded: 'Presupuesto IA excedido',
      security_violation: 'Violación de seguridad',
      data_breach_attempt: 'Intento de brecha de datos'
    }
    return labels[eventType] || eventType
  }

  const getRiskBadge = (riskLevel: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    
    const labels = {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto',
      critical: 'Crítico'
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[riskLevel as keyof typeof colors]}`}>
        {labels[riskLevel as keyof typeof labels]}
      </span>
    )
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando registro de auditoría...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Registro de Auditoría 📋</h2>
          <p className="text-gray-600">Trazabilidad completa de acciones del sistema (P1 Compliance)</p>
        </div>
        
        {!compactView && (
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => exportAuditLog('csv')}
              disabled={exporting}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => exportAuditLog('pdf')}
              disabled={exporting}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Eventos de Auditoría ({filteredEvents.length})
            </h3>
            {autoRefresh && (
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Actualización automática cada 30s
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay eventos de auditoría
              </h3>
              <p className="text-gray-600">
                El sistema registrará automáticamente todas las acciones críticas
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <motion.div
                key={event.event_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getEventIcon(event.event_type, event.risk_level)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-medium text-gray-900">
                          {getEventTypeLabel(event.event_type)}
                        </p>
                        {getRiskBadge(event.risk_level)}
                        {event.compliance_flag && (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {event.user_name} ({event.user_role}) • {event.action}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{formatTimestamp(event.timestamp)}</span>
                        <span>IP: {event.ip_address}</span>
                        <span>Hash: {event.hash_signature}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalle del Evento de Auditoría
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de evento</label>
                  <p className="text-sm text-gray-900">{getEventTypeLabel(selectedEvent.event_type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nivel de riesgo</label>
                  <div className="mt-1">{getRiskBadge(selectedEvent.risk_level)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Usuario</label>
                  <p className="text-sm text-gray-900">{selectedEvent.user_name} ({selectedEvent.user_role})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">{formatTimestamp(selectedEvent.timestamp)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Hash de integridad (SHA-256)</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                  {selectedEvent.hash_signature}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Detalles técnicos</label>
                <pre className="text-xs text-gray-900 bg-gray-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(selectedEvent.details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 