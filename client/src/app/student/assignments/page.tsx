'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  PaperClipIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

export default function StudentAssignments() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')

  const assignments = [
    {
      id: 1,
      title: 'Ensayo sobre la Independencia de Chile',
      subject: 'Historia',
      dueDate: '2024-01-25T23:59:00Z',
      assignedDate: '2024-01-15T09:00:00Z',
      status: 'pending',
      priority: 'high',
      description: 'Escribir un ensayo de 500 palabras sobre los principales eventos de la Independencia de Chile.',
      instructions: 'El ensayo debe incluir introducción, desarrollo y conclusión. Citar al menos 3 fuentes bibliográficas.',
      attachments: [
        { name: 'Rúbrica de evaluación.pdf', size: '245 KB', type: 'pdf' },
        { name: 'Fuentes recomendadas.docx', size: '128 KB', type: 'doc' }
      ],
      submissionType: 'file',
      maxGrade: 7.0
    },
    {
      id: 2,
      title: 'Problemas de Ecuaciones Lineales',
      subject: 'Matemáticas',
      dueDate: '2024-01-22T15:30:00Z',
      assignedDate: '2024-01-18T10:00:00Z',
      status: 'submitted',
      priority: 'medium',
      description: 'Resolver los ejercicios 1-15 del capítulo 4 del libro de matemáticas.',
      submittedAt: '2024-01-21T20:15:00Z',
      grade: 6.2,
      feedback: 'Buen trabajo en general. Revisar el ejercicio 12, hay un error en los cálculos.',
      submissionType: 'file',
      maxGrade: 7.0
    },
    {
      id: 3,
      title: 'Experimento: Densidad de Líquidos',
      subject: 'Ciencias',
      dueDate: '2024-01-30T17:00:00Z',
      assignedDate: '2024-01-20T14:00:00Z',
      status: 'in_progress',
      priority: 'medium',
      description: 'Realizar experimento sobre densidad usando diferentes líquidos y registrar resultados.',
      instructions: 'Usar agua, aceite y miel. Medir densidades y crear informe con conclusiones.',
      submissionType: 'text_and_file',
      maxGrade: 7.0
    },
    {
      id: 4,
      title: 'Lectura: "El Principito" - Capítulos 1-5',
      subject: 'Lenguaje',
      dueDate: '2024-01-24T08:00:00Z',
      assignedDate: '2024-01-17T11:00:00Z',
      status: 'overdue',
      priority: 'high',
      description: 'Leer los primeros 5 capítulos y responder preguntas de comprensión.',
      submissionType: 'text',
      maxGrade: 7.0
    }
  ]

  const subjects = ['Historia', 'Matemáticas', 'Ciencias', 'Lenguaje', 'Inglés', 'Arte']

  const getStatusInfo = (status: string, dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const isOverdue = now > due && status !== 'submitted'
    
    if (isOverdue) {
      return { 
        text: 'Atrasada', 
        color: 'text-red-600 bg-red-100', 
        icon: <ExclamationTriangleIcon className="h-4 w-4" /> 
      }
    }
    
    switch (status) {
      case 'submitted':
        return { 
          text: 'Entregada', 
          color: 'text-green-600 bg-green-100', 
          icon: <CheckCircleIcon className="h-4 w-4" /> 
        }
      case 'in_progress':
        return { 
          text: 'En progreso', 
          color: 'text-yellow-600 bg-yellow-100', 
          icon: <ClockIcon className="h-4 w-4" /> 
        }
      case 'pending':
        return { 
          text: 'Pendiente', 
          color: 'text-blue-600 bg-blue-100', 
          icon: <DocumentTextIcon className="h-4 w-4" /> 
        }
      default:
        return { 
          text: 'Desconocido', 
          color: 'text-gray-600 bg-gray-100', 
          icon: <DocumentTextIcon className="h-4 w-4" /> 
        }
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Vencida'
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    return `${diffDays} días`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-500'
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pending' && (assignment.status === 'pending' || assignment.status === 'in_progress')) ||
                      (activeTab === 'submitted' && assignment.status === 'submitted') ||
                      (activeTab === 'overdue' && new Date() > new Date(assignment.dueDate) && assignment.status !== 'submitted')
    
    return matchesSearch && matchesSubject && matchesTab
  })

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    overdue: assignments.filter(a => new Date() > new Date(a.dueDate) && a.status !== 'submitted').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📚 Mis Tareas</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gestiona y entrega tus asignaciones académicas
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                leftIcon={<CalendarIcon className="h-4 w-4" />}
              >
                Ver Calendario
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Entregadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Atrasadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'pending', label: 'Pendientes' },
                { key: 'submitted', label: 'Entregadas' },
                { key: 'overdue', label: 'Atrasadas' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todas las materias</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Lista de Tareas ({filteredAssignments.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => {
                const statusInfo = getStatusInfo(assignment.status, assignment.dueDate)
                
                return (
                  <div
                    key={assignment.id}
                    className={`p-6 border-l-4 ${getPriorityColor(assignment.priority)} hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.text}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {assignment.subject}
                          </span>
                          <span className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Vence: {new Date(assignment.dueDate).toLocaleDateString()} ({getDaysUntilDue(assignment.dueDate)})
                          </span>
                          {assignment.grade && (
                            <span className="flex items-center text-green-600">
                              <span className="font-medium">Nota: {assignment.grade}</span>
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3">{assignment.description}</p>
                        
                        {assignment.attachments && assignment.attachments.length > 0 && (
                          <div className="flex items-center space-x-2 mb-3">
                            <PaperClipIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {assignment.attachments.length} archivo(s) adjunto(s)
                            </span>
                          </div>
                        )}
                        
                        {assignment.feedback && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Retroalimentación:</span> {assignment.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/student/assignments/${assignment.id}`)}
                          leftIcon={<EyeIcon className="h-4 w-4" />}
                        >
                          Ver Detalles
                        </Button>
                        
                        {assignment.status !== 'submitted' && (
                          <Button
                            size="sm"
                            leftIcon={<DocumentTextIcon className="h-4 w-4" />}
                          >
                            Entregar
                          </Button>
                        )}
                        
                        {assignment.attachments && assignment.attachments.length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                          >
                            Descargar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
                <p className="text-gray-600">
                  {activeTab === 'all' 
                    ? 'No tienes tareas asignadas actualmente.'
                    : `No hay tareas en la categoría "${activeTab}".`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 