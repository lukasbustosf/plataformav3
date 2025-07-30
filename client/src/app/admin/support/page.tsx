'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  TagIcon,
  UserIcon,
  CalendarDaysIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'pedagogical' | 'billing' | 'feature_request' | 'bug_report'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdBy: string
  assignedTo: string
  school: string
  createdAt: string
  updatedAt: string
  responses: number
}

interface SupportStats {
  totalTickets: number
  openTickets: number
  avgResponseTime: string
  satisfactionRate: number
}

export default function AdminSupportPage() {
  const { user } = useAuth()
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const [supportTickets] = useState<SupportTicket[]>([
    {
      id: 'TICK-001',
      title: 'Error al generar quiz con IA',
      description: 'Los estudiantes no pueden ver los quiz generados con IA. Aparece error 500.',
      category: 'technical',
      priority: 'high',
      status: 'in_progress',
      createdBy: 'María González',
      assignedTo: 'Carlos Support',
      school: 'Colegio San Patricio',
      createdAt: '2024-01-19T10:30:00Z',
      updatedAt: '2024-01-19T14:45:00Z',
      responses: 3
    },
    {
      id: 'TICK-002',
      title: 'Consulta sobre implementación de Bloom Radar',
      description: 'Necesitamos orientación sobre cómo implementar el nuevo Bloom Radar en nuestras clases.',
      category: 'pedagogical',
      priority: 'medium',
      status: 'open',
      createdBy: 'Roberto Silva',
      assignedTo: 'Ana Pedagogy',
      school: 'Liceo Técnico Industrial',
      createdAt: '2024-01-19T09:15:00Z',
      updatedAt: '2024-01-19T09:15:00Z',
      responses: 0
    },
    {
      id: 'TICK-003',
      title: 'Solicitud de nuevos formatos de juego',
      description: 'Nos gustaría solicitar un formato de juego tipo escape room virtual.',
      category: 'feature_request',
      priority: 'low',
      status: 'open',
      createdBy: 'Carmen López',
      assignedTo: 'Diego Product',
      school: 'Escuela Básica Los Aromos',
      createdAt: '2024-01-18T16:20:00Z',
      updatedAt: '2024-01-18T16:20:00Z',
      responses: 1
    },
    {
      id: 'TICK-004',
      title: 'Problema con facturación',
      description: 'No hemos recibido la factura de enero y necesitamos el documento para contabilidad.',
      category: 'billing',
      priority: 'medium',
      status: 'resolved',
      createdBy: 'Luis Admin',
      assignedTo: 'Sofia Billing',
      school: 'Instituto Los Andes',
      createdAt: '2024-01-17T11:00:00Z',
      updatedAt: '2024-01-19T13:30:00Z',
      responses: 5
    },
    {
      id: 'TICK-005',
      title: 'Bug en sistema de asistencia',
      description: 'La asistencia no se está guardando correctamente en algunos cursos.',
      category: 'bug_report',
      priority: 'urgent',
      status: 'in_progress',
      createdBy: 'Patricia Director',
      assignedTo: 'Miguel Tech',
      school: 'Colegio Santa María',
      createdAt: '2024-01-19T08:00:00Z',
      updatedAt: '2024-01-19T15:00:00Z',
      responses: 8
    }
  ])

  const [supportStats] = useState<SupportStats>({
    totalTickets: 248,
    openTickets: 32,
    avgResponseTime: '2.4 horas',
    satisfactionRate: 94.2
  })

  const getCategoryInfo = (category: string) => {
    const categories = {
      technical: { label: 'Técnico', color: 'bg-red-100 text-red-800', icon: CogIcon },
      pedagogical: { label: 'Pedagógico', color: 'bg-blue-100 text-blue-800', icon: DocumentTextIcon },
      billing: { label: 'Facturación', color: 'bg-green-100 text-green-800', icon: ChartBarIcon },
      feature_request: { label: 'Nueva Funcionalidad', color: 'bg-purple-100 text-purple-800', icon: PlusIcon },
      bug_report: { label: 'Reporte de Bug', color: 'bg-orange-100 text-orange-800', icon: ExclamationTriangleIcon }
    }
    return categories[category as keyof typeof categories] || categories.technical
  }

  const getPriorityInfo = (priority: string) => {
    const priorities = {
      low: { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
      medium: { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
      high: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Urgente', color: 'bg-red-100 text-red-800' }
    }
    return priorities[priority as keyof typeof priorities] || priorities.medium
  }

  const getStatusInfo = (status: string) => {
    const statuses = {
      open: { label: 'Abierto', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      in_progress: { label: 'En Progreso', color: 'bg-yellow-100 text-yellow-800', icon: ArrowPathIcon },
      resolved: { label: 'Resuelto', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      closed: { label: 'Cerrado', color: 'bg-gray-100 text-gray-800', icon: XMarkIcon }
    }
    return statuses[status as keyof typeof statuses] || statuses.open
  }

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateTicket = () => {
    setShowCreateModal(true)
  }

  const handleAssignTicket = (ticketId: string, assignee: string) => {
    toast.success(`Ticket ${ticketId} asignado a ${assignee}`)
  }

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    toast.success(`Estado del ticket ${ticketId} actualizado a ${newStatus}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Sistema de Soporte Técnico</h1>
              <p className="mt-2 opacity-90">
                Gestión centralizada de tickets y soporte a usuarios
              </p>
            </div>
            <Button 
              onClick={handleCreateTicket}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Nuevo Ticket
            </Button>
          </div>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-semibold text-gray-900">{supportStats.totalTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tickets Abiertos</p>
                <p className="text-2xl font-semibold text-gray-900">{supportStats.openTickets}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tiempo Respuesta</p>
                <p className="text-2xl font-semibold text-gray-900">{supportStats.avgResponseTime}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Satisfacción</p>
                <p className="text-2xl font-semibold text-gray-900">{supportStats.satisfactionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tickets de Soporte</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const categoryInfo = getCategoryInfo(ticket.category)
                const priorityInfo = getPriorityInfo(ticket.priority)
                const statusInfo = getStatusInfo(ticket.status)
                const CategoryIcon = categoryInfo.icon
                const StatusIcon = statusInfo.icon
                
                return (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                            <span className="text-sm font-mono text-gray-500">#{ticket.id}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                              {priorityInfo.label}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                              {categoryInfo.label}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Escuela</p>
                              <p className="font-medium">{ticket.school}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Creado por</p>
                              <p className="font-medium">{ticket.createdBy}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Asignado a</p>
                              <p className="font-medium">{ticket.assignedTo}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Respuestas</p>
                              <p className="font-medium">{ticket.responses}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PhoneIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Soporte Telefónico</h3>
                <p className="text-sm text-gray-600">+56 2 2345 6789</p>
                <p className="text-xs text-gray-500">Lun-Vie 9:00-18:00</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <EnvelopeIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Email de Soporte</h3>
                <p className="text-sm text-gray-600">soporte@edu21.cl</p>
                <p className="text-xs text-gray-500">Respuesta en 24hrs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Chat en Vivo</h3>
                <p className="text-sm text-gray-600">Disponible ahora</p>
                <p className="text-xs text-gray-500">Respuesta inmediata</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Ticket #{selectedTicket.id} - {selectedTicket.title}
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Información del Ticket</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Estado:</span> {getStatusInfo(selectedTicket.status).label}</p>
                      <p><span className="font-medium">Prioridad:</span> {getPriorityInfo(selectedTicket.priority).label}</p>
                      <p><span className="font-medium">Categoría:</span> {getCategoryInfo(selectedTicket.category).label}</p>
                      <p><span className="font-medium">Escuela:</span> {selectedTicket.school}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Asignación</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Creado por:</span> {selectedTicket.createdBy}</p>
                      <p><span className="font-medium">Asignado a:</span> {selectedTicket.assignedTo}</p>
                      <p><span className="font-medium">Creado:</span> {new Date(selectedTicket.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Actualizado:</span> {new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Descripción</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Conversación ({selectedTicket.responses} respuestas)</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="bg-white rounded-lg p-3 border-l-4 border-blue-500">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{selectedTicket.createdBy}</span>
                        <span className="text-xs text-gray-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700">{selectedTicket.description}</p>
                    </div>
                    
                    {selectedTicket.responses > 0 && (
                      <div className="bg-white rounded-lg p-3 border-l-4 border-green-500">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{selectedTicket.assignedTo}</span>
                          <span className="text-xs text-gray-500">{new Date(selectedTicket.updatedAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Hemos recibido tu reporte y estamos investigando el problema. 
                          Te mantendremos informado del progreso.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between p-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}>
                    Marcar En Progreso
                  </Button>
                  <Button variant="outline" onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}>
                    Marcar Resuelto
                  </Button>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                    Cerrar
                  </Button>
                  <Button>
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Responder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full m-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Crear Nuevo Ticket</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título del Ticket</label>
                    <input type="text" className="input w-full" placeholder="Describe brevemente el problema..." />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Categoría</label>
                      <select className="input w-full">
                        <option value="technical">Técnico</option>
                        <option value="pedagogical">Pedagógico</option>
                        <option value="billing">Facturación</option>
                        <option value="feature_request">Nueva Funcionalidad</option>
                        <option value="bug_report">Reporte de Bug</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prioridad</label>
                      <select className="input w-full">
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea className="input w-full h-32" placeholder="Describe el problema en detalle..."></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Escuela</label>
                    <select className="input w-full">
                      <option>Colegio San Patricio</option>
                      <option>Liceo Técnico Industrial</option>
                      <option>Escuela Básica Los Aromos</option>
                      <option>Instituto Los Andes</option>
                    </select>
                  </div>
                </form>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  toast.success('Ticket creado exitosamente')
                  setShowCreateModal(false)
                }}>
                  Crear Ticket
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
