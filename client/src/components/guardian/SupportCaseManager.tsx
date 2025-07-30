'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  PaperClipIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  HeartIcon,
  TruckIcon,
  ExclamationCircleIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

// ===============================================
// INTERFACES & TYPES
// ===============================================

interface SupportCase {
  case_id: string
  case_number: string
  guardian_id: string
  student_id: string
  student_name: string
  
  // Case Details
  case_type: CaseType
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  subject: string
  description: string
  
  // Status & Assignment
  status: CaseStatus
  assigned_to?: string
  assigned_name?: string
  assigned_department?: string
  escalation_level: number
  
  // Timeline
  created_at: string
  updated_at: string
  first_response_at?: string
  resolved_at?: string
  closed_at?: string
  sla_due_date?: string
  
  // Communication
  messages: CaseMessage[]
  attachments: CaseAttachment[]
  
  // Resolution
  resolution?: string
  resolution_notes?: string
  satisfaction_rating?: number
  feedback?: string
  
  // Follow-up
  follow_up_required: boolean
  follow_up_date?: string
  follow_up_notes?: string
  
  // Tags and Metadata
  tags: string[]
  impact_level: 'low' | 'medium' | 'high'
  urgency_level: 'low' | 'medium' | 'high'
  related_cases: string[]
}

type CaseType = 
  | 'academic_support'
  | 'behavioral_concern'
  | 'health_medical'
  | 'transportation'
  | 'bullying_harassment'
  | 'special_needs'
  | 'technology_access'
  | 'financial_assistance'
  | 'counseling_request'
  | 'complaint_formal'
  | 'suggestion_feedback'
  | 'emergency_urgent'
  | 'other'

type CaseStatus = 
  | 'submitted'
  | 'acknowledged'
  | 'in_review'
  | 'in_progress'
  | 'waiting_info'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened'

interface CaseMessage {
  message_id: string
  case_id: string
  sender_id: string
  sender_name: string
  sender_type: 'guardian' | 'staff' | 'system'
  message_type: 'text' | 'status_update' | 'assignment' | 'resolution'
  content: string
  is_internal: boolean
  created_at: string
  attachments: string[]
}

interface CaseAttachment {
  attachment_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  uploaded_by: string
  uploaded_at: string
  description?: string
}

interface CaseTemplate {
  template_id: string
  case_type: CaseType
  title: string
  description: string
  suggested_priority: string
  required_fields: string[]
  guidance_text: string
  estimated_resolution_time: string
}

interface SupportCaseManagerProps {
  guardianId: string
  studentId: string
  studentName: string
}

// ===============================================
// CASE TYPE CONFIGURATIONS
// ===============================================

const caseTypeConfig = {
  academic_support: {
    label: 'Apoyo Académico',
    icon: AcademicCapIcon,
    color: 'blue',
    description: 'Solicitudes relacionadas con rendimiento académico, tareas y evaluaciones'
  },
  behavioral_concern: {
    label: 'Preocupación Conductual',
    icon: ExclamationTriangleIcon,
    color: 'orange',
    description: 'Inquietudes sobre comportamiento o disciplina del estudiante'
  },
  health_medical: {
    label: 'Salud y Medicina',
    icon: HeartIcon,
    color: 'red',
    description: 'Temas de salud, medicamentos o necesidades médicas especiales'
  },
  transportation: {
    label: 'Transporte',
    icon: TruckIcon,
    color: 'green',
    description: 'Problemas con transporte escolar o movilización'
  },
  bullying_harassment: {
    label: 'Bullying/Acoso',
    icon: ShieldCheckIcon,
    color: 'red',
    description: 'Reportes de bullying, acoso o problemas de convivencia'
  },
  special_needs: {
    label: 'Necesidades Especiales',
    icon: HeartIcon,
    color: 'purple',
    description: 'Adaptaciones curriculares y apoyo para necesidades especiales'
  },
  technology_access: {
    label: 'Acceso Tecnológico',
    icon: ExclamationCircleIcon,
    color: 'indigo',
    description: 'Problemas con dispositivos, internet o plataformas digitales'
  },
  financial_assistance: {
    label: 'Asistencia Financiera',
    icon: ExclamationCircleIcon,
    color: 'yellow',
    description: 'Solicitudes de becas, ayudas económicas o facilidades de pago'
  },
  counseling_request: {
    label: 'Solicitud de Orientación',
    icon: ChatBubbleLeftRightIcon,
    color: 'teal',
    description: 'Solicitudes para orientación académica, vocacional o personal'
  },
  complaint_formal: {
    label: 'Queja Formal',
    icon: DocumentTextIcon,
    color: 'red',
    description: 'Quejas formales sobre servicios, personal o procedimientos'
  },
  suggestion_feedback: {
    label: 'Sugerencia/Feedback',
    icon: ExclamationCircleIcon,
    color: 'gray',
    description: 'Sugerencias para mejorar servicios o retroalimentación general'
  },
  emergency_urgent: {
    label: 'Emergencia Urgente',
    icon: ExclamationTriangleIcon,
    color: 'red',
    description: 'Situaciones urgentes que requieren atención inmediata'
  },
  other: {
    label: 'Otro',
    icon: EllipsisHorizontalIcon,
    color: 'gray',
    description: 'Otros temas no cubiertos en las categorías anteriores'
  }
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function SupportCaseManager({
  guardianId,
  studentId,
  studentName
}: SupportCaseManagerProps) {
  const [cases, setCases] = useState<SupportCase[]>([])
  const [templates, setTemplates] = useState<CaseTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  
  // UI State
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null)
  const [activeView, setActiveView] = useState<'list' | 'detail'>('list')
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<'all' | CaseStatus>('all')
  const [filterType, setFilterType] = useState<'all' | CaseType>('all')
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'urgent'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'created_at' | 'updated_at' | 'priority'>('updated_at')
  
  // Form State
  const [caseForm, setCaseForm] = useState({
    case_type: 'academic_support' as CaseType,
    category: '',
    priority: 'medium' as const,
    subject: '',
    description: '',
    impact_level: 'medium' as const,
    urgency_level: 'medium' as const,
    attachments: [] as File[],
    preferred_contact_method: 'email' as const,
    preferred_contact_time: '',
    additional_notes: ''
  })
  
  // Message State
  const [newMessage, setNewMessage] = useState('')
  const [messageAttachments, setMessageAttachments] = useState<File[]>([])

  // ===============================================
  // LIFECYCLE & DATA LOADING
  // ===============================================

  useEffect(() => {
    loadInitialData()
  }, [guardianId, studentId])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadCases(),
        loadTemplates()
      ])
    } catch (error) {
      console.error('Failed to load support data:', error)
      toast.error('Error al cargar datos de soporte')
    } finally {
      setLoading(false)
    }
  }

  const loadCases = async () => {
    try {
      const response = await fetch(`/api/guardian/support-cases?student_id=${studentId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setCases(data.data)
      }
    } catch (error) {
      console.error('Failed to load cases:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/guardian/support-case-templates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setTemplates(data.data)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  // ===============================================
  // CASE MANAGEMENT FUNCTIONS
  // ===============================================

  const createCase = async () => {
    setCreating(true)
    
    try {
      const formData = new FormData()
      formData.append('guardian_id', guardianId)
      formData.append('student_id', studentId)
      
      Object.entries(caseForm).forEach(([key, value]) => {
        if (key === 'attachments') {
          ;(value as File[]).forEach((file, index) => {
            formData.append(`attachments[${index}]`, file)
          })
        } else {
          formData.append(key, value as string)
        }
      })

      const response = await fetch('/api/guardian/support-cases', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setCases(prev => [data.data, ...prev])
        setShowCreateDialog(false)
        resetForm()
        toast.success('Caso de soporte creado exitosamente')
        
        // Show case number
        toast.success(`Número de caso: ${data.data.case_number}`)
      } else {
        throw new Error(data.error?.message || 'Failed to create case')
      }
    } catch (error) {
      console.error('Failed to create case:', error)
      toast.error('Error al crear caso de soporte')
    } finally {
      setCreating(false)
    }
  }

  const addMessage = async (caseId: string) => {
    if (!newMessage.trim()) return

    try {
      const formData = new FormData()
      formData.append('case_id', caseId)
      formData.append('content', newMessage)
      formData.append('message_type', 'text')
      
      messageAttachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      const response = await fetch('/api/guardian/support-cases/messages', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Update case with new message
        setCases(prev => 
          prev.map(c => 
            c.case_id === caseId
              ? { ...c, messages: [...c.messages, data.data] }
              : c
          )
        )
        
        setNewMessage('')
        setMessageAttachments([])
        toast.success('Mensaje añadido')
      }
    } catch (error) {
      console.error('Failed to add message:', error)
      toast.error('Error al añadir mensaje')
    }
  }

  const updateCaseStatus = async (caseId: string, newStatus: CaseStatus, notes?: string) => {
    try {
      const response = await fetch(`/api/guardian/support-cases/${caseId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus, notes })
      })

      const data = await response.json()

      if (data.success) {
        setCases(prev => 
          prev.map(c => 
            c.case_id === caseId
              ? { ...c, status: newStatus, updated_at: new Date().toISOString() }
              : c
          )
        )
        toast.success('Estado del caso actualizado')
      }
    } catch (error) {
      console.error('Failed to update case status:', error)
      toast.error('Error al actualizar estado del caso')
    }
  }

  const rateCaseResolution = async (caseId: string, rating: number, feedback: string) => {
    try {
      const response = await fetch(`/api/guardian/support-cases/${caseId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ satisfaction_rating: rating, feedback })
      })

      const data = await response.json()

      if (data.success) {
        setCases(prev => 
          prev.map(c => 
            c.case_id === caseId
              ? { ...c, satisfaction_rating: rating, feedback }
              : c
          )
        )
        toast.success('Calificación enviada')
      }
    } catch (error) {
      console.error('Failed to rate case:', error)
      toast.error('Error al enviar calificación')
    }
  }

  // ===============================================
  // UI HELPER FUNCTIONS
  // ===============================================

  const resetForm = () => {
    setCaseForm({
      case_type: 'academic_support',
      category: '',
      priority: 'medium',
      subject: '',
      description: '',
      impact_level: 'medium',
      urgency_level: 'medium',
      attachments: [],
      preferred_contact_method: 'email',
      preferred_contact_time: '',
      additional_notes: ''
    })
  }

  const getStatusColor = (status: CaseStatus) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      acknowledged: 'bg-blue-100 text-blue-800',
      in_review: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      waiting_info: 'bg-orange-100 text-orange-800',
      escalated: 'bg-red-100 text-red-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      reopened: 'bg-purple-100 text-purple-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    }
    return colors[priority as keyof typeof colors] || 'text-gray-600'
  }

  const getStatusLabel = (status: CaseStatus) => {
    const labels = {
      submitted: 'Enviado',
      acknowledged: 'Confirmado',
      in_review: 'En Revisión',
      in_progress: 'En Progreso',
      waiting_info: 'Esperando Información',
      escalated: 'Escalado',
      resolved: 'Resuelto',
      closed: 'Cerrado',
      reopened: 'Reabierto'
    }
    return labels[status] || status
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays}d`
    return date.toLocaleDateString()
  }

  // Filter and sort cases
  const filteredCases = cases
    .filter(caseItem => {
      if (filterStatus !== 'all' && caseItem.status !== filterStatus) return false
      if (filterType !== 'all' && caseItem.case_type !== filterType) return false
      if (filterPriority !== 'all' && caseItem.priority !== filterPriority) return false
      if (searchTerm && !caseItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !caseItem.case_number.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  // ===============================================
  // RENDER CASE LIST
  // ===============================================

  const renderCaseList = () => (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Casos de Soporte</h2>
            <p className="text-sm text-gray-600">Gestiona tus solicitudes de apoyo para {studentName}</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Caso
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar casos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="submitted">Enviado</option>
            <option value="in_progress">En Progreso</option>
            <option value="waiting_info">Esperando Info</option>
            <option value="resolved">Resuelto</option>
            <option value="closed">Cerrado</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los tipos</option>
            {Object.entries(caseTypeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todas las prioridades</option>
            <option value="urgent">Urgente</option>
            <option value="high">Alta</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated_at">Última actualización</option>
            <option value="created_at">Fecha de creación</option>
            <option value="priority">Prioridad</option>
          </select>
        </div>
      </div>
      
      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay casos de soporte</h3>
          <p className="text-gray-500 mb-4">
            {cases.length === 0 
              ? 'No has creado ningún caso de soporte aún'
              : 'No hay casos que coincidan con los filtros aplicados'
            }
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            Crear primer caso
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredCases.map((caseItem) => {
            const config = caseTypeConfig[caseItem.case_type]
            const IconComponent = config.icon
            
            return (
              <motion.div
                key={caseItem.case_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedCase(caseItem)
                  setActiveView('detail')
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-${config.color}-100`}>
                      <IconComponent className={`h-5 w-5 text-${config.color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{caseItem.subject}</h3>
                        <span className="text-sm text-gray-500">#{caseItem.case_number}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {caseItem.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatTimeAgo(caseItem.updated_at)}
                        </span>
                        
                        {caseItem.assigned_name && (
                          <span className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            {caseItem.assigned_name}
                          </span>
                        )}
                        
                        <span className="flex items-center">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                          {caseItem.messages.length} mensajes
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                      {getStatusLabel(caseItem.status)}
                    </span>
                    
                    <span className={`text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority.toUpperCase()}
                    </span>
                    
                    {caseItem.sla_due_date && new Date(caseItem.sla_due_date) > new Date() && (
                      <span className="text-xs text-orange-600">
                        SLA: {formatTimeAgo(caseItem.sla_due_date)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )

  // ===============================================
  // RENDER CASE DETAIL
  // ===============================================

  const renderCaseDetail = () => {
    if (!selectedCase) return null
    
    const config = caseTypeConfig[selectedCase.case_type]
    const IconComponent = config.icon
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setActiveView('list')
              setSelectedCase(null)
            }}
          >
            ← Volver a la lista
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => loadCases()}
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Actualizar
            </Button>
          </div>
        </div>
        
        {/* Case Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg bg-${config.color}-100`}>
                <IconComponent className={`h-6 w-6 text-${config.color}-600`} />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedCase.subject}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Caso #{selectedCase.case_number} • {config.label}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Creado el {new Date(selectedCase.created_at).toLocaleDateString()} para {studentName}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCase.status)}`}>
                {getStatusLabel(selectedCase.status)}
              </span>
              
              <span className={`text-sm font-medium ${getPriorityColor(selectedCase.priority)}`}>
                Prioridad: {selectedCase.priority.toUpperCase()}
              </span>
              
              {selectedCase.assigned_name && (
                <span className="text-sm text-gray-600">
                  Asignado a: {selectedCase.assigned_name}
                </span>
              )}
            </div>
          </div>
          
          {/* Case Description */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{selectedCase.description}</p>
          </div>
          
          {/* Attachments */}
          {selectedCase.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Archivos Adjuntos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCase.attachments.map((attachment) => (
                  <a
                    key={attachment.attachment_id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <PaperClipIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{attachment.file_name}</div>
                      <div className="text-xs text-gray-500">
                        {(attachment.file_size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Messages/Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Historial de Comunicaciones</h3>
          </div>
          
          <div className="p-6">
            {selectedCase.messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay mensajes aún</p>
            ) : (
              <div className="space-y-6">
                {selectedCase.messages.map((message) => (
                  <div key={message.message_id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender_type === 'guardian' ? 'bg-blue-100 text-blue-600' :
                        message.sender_type === 'staff' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {message.sender_type === 'guardian' ? '👤' :
                         message.sender_type === 'staff' ? '👨‍🏫' : '🤖'}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{message.sender_name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                        {message.content}
                      </div>
                      
                      {message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachmentId, index) => (
                            <div key={index} className="text-xs text-blue-600">
                              📎 Archivo adjunto
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add Message */}
            {selectedCase.status !== 'closed' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Añadir un mensaje o comentario..."
                    className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                  
                  <div className="flex items-center justify-between">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setMessageAttachments(Array.from(e.target.files || []))}
                      className="text-sm text-gray-500"
                    />
                    
                    <Button
                      onClick={() => addMessage(selectedCase.case_id)}
                      disabled={!newMessage.trim()}
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Resolution and Feedback */}
        {selectedCase.status === 'resolved' && !selectedCase.satisfaction_rating && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-green-900 mb-3">¿Cómo fue la resolución?</h3>
            <p className="text-sm text-green-700 mb-4">
              Tu caso ha sido marcado como resuelto. Ayúdanos a mejorar calificando la atención recibida.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-green-900 mb-2">
                  Calificación (1-5 estrellas)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        const feedback = prompt('Comentarios adicionales (opcional):') || ''
                        rateCaseResolution(selectedCase.case_id, rating, feedback)
                      }}
                      className="text-2xl text-yellow-400 hover:text-yellow-500"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ===============================================
  // CREATE CASE DIALOG
  // ===============================================

  const renderCreateDialog = () => {
    if (!showCreateDialog) return null
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Caso de Soporte</h2>
            <p className="text-sm text-gray-600">Describe tu solicitud o preocupación para {studentName}</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Case Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Caso</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(caseTypeConfig).map(([key, config]) => {
                  const IconComponent = config.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setCaseForm(prev => ({ ...prev, case_type: key as CaseType }))}
                      className={`p-3 border rounded-lg text-left hover:bg-gray-50 ${
                        caseForm.case_type === key
                          ? `border-${config.color}-500 bg-${config.color}-50`
                          : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`h-5 w-5 text-${config.color}-600`} />
                        <span className="text-sm font-medium text-gray-900">{config.label}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{config.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asunto *</label>
              <input
                type="text"
                value={caseForm.subject}
                onChange={(e) => setCaseForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Resumen breve de tu solicitud..."
                className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
              <select
                value={caseForm.priority}
                onChange={(e) => setCaseForm(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Baja - No urgente</option>
                <option value="medium">Media - Dentro de algunos días</option>
                <option value="high">Alta - Necesito respuesta pronto</option>
                <option value="urgent">Urgente - Requiere atención inmediata</option>
              </select>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción Detallada *</label>
              <textarea
                value={caseForm.description}
                onChange={(e) => setCaseForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe tu solicitud con el mayor detalle posible..."
                className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            
            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Archivos Adjuntos</label>
              <input
                type="file"
                multiple
                onChange={(e) => setCaseForm(prev => ({ ...prev, attachments: Array.from(e.target.files || []) }))}
                className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes adjuntar documentos, imágenes o archivos relevantes (máx. 10MB cada uno)
              </p>
            </div>
            
            {/* Contact Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de Contacto Preferido</label>
                <select
                  value={caseForm.preferred_contact_method}
                  onChange={(e) => setCaseForm(prev => ({ ...prev, preferred_contact_method: e.target.value as any }))}
                  className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="phone">Teléfono</option>
                  <option value="platform">Plataforma</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horario Preferido</label>
                <input
                  type="text"
                  value={caseForm.preferred_contact_time}
                  onChange={(e) => setCaseForm(prev => ({ ...prev, preferred_contact_time: e.target.value }))}
                  placeholder="Ej: Mañanas, 14:00-16:00"
                  className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Dialog Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={createCase}
              disabled={creating || !caseForm.subject || !caseForm.description}
            >
              {creating ? 'Creando...' : 'Crear Caso'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ===============================================
  // MAIN RENDER
  // ===============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando casos de soporte...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activeView === 'list' ? renderCaseList() : renderCaseDetail()}
      {renderCreateDialog()}
    </div>
  )
} 