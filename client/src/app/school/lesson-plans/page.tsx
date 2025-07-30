'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  AcademicCapIcon,
  UserIcon,
  DocumentArrowDownIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function LessonPlansPage() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState('2024-W47')
  const [selectedSubject, setSelectedSubject] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock lesson plans data
  const lessonPlans = [
    {
      id: 'plan-001',
      title: 'Álgebra Básica - Ecuaciones Lineales',
      teacher: 'María González',
      subject: 'Matemáticas',
      grade: '8° Básico',
      class: '8°A',
      date: '2024-11-18',
      duration: '90 min',
      status: 'approved',
      submittedDate: '2024-11-15',
      objectives: 'Resolver ecuaciones lineales con una incógnita',
      activities: 'Explicación teórica, ejercicios prácticos, evaluación formativa',
      resources: 'Libro de texto, calculadora, pizarra digital',
      assessment: 'Quiz al final de la clase'
    },
    {
      id: 'plan-002',
      title: 'Comprensión Lectora - Textos Narrativos',
      teacher: 'Ana López',
      subject: 'Lenguaje',
      grade: '8° Básico',
      class: '8°B',
      date: '2024-11-19',
      duration: '90 min',
      status: 'pending',
      submittedDate: '2024-11-16',
      objectives: 'Identificar elementos narrativos en cuentos cortos',
      activities: 'Lectura dirigida, análisis grupal, presentación oral',
      resources: 'Libro de cuentos, fichas de trabajo',
      assessment: 'Evaluación oral participativa'
    },
    {
      id: 'plan-003',
      title: 'Ecosistemas - Cadenas Alimentarias',
      teacher: 'Carlos Ruiz',
      subject: 'Ciencias',
      grade: '7° Básico',
      class: '7°A',
      date: '2024-11-20',
      duration: '90 min',
      status: 'revision',
      submittedDate: '2024-11-17',
      objectives: 'Comprender las relaciones tróficas en ecosistemas',
      activities: 'Video educativo, experimento, trabajo en equipo',
      resources: 'Material audiovisual, microscopio, muestras biológicas',
      assessment: 'Informe de laboratorio'
    },
    {
      id: 'plan-004',
      title: 'Historia de Chile - Independencia',
      teacher: 'Elena Vargas',
      subject: 'Historia',
      grade: '1° Medio',
      class: '1°M',
      date: '2024-11-21',
      duration: '90 min',
      status: 'draft',
      submittedDate: null,
      objectives: 'Analizar causas y consecuencias de la Independencia de Chile',
      activities: 'Clase magistral, análisis de fuentes primarias, debate',
      resources: 'Documentos históricos, línea de tiempo, mapas',
      assessment: 'Ensayo reflexivo'
    },
    {
      id: 'plan-005',
      title: 'Inglés Conversacional - Past Tense',
      teacher: 'Roberto Silva',
      subject: 'Inglés',
      grade: '2° Medio',
      class: '2°M',
      date: '2024-11-22',
      duration: '90 min',
      status: 'approved',
      submittedDate: '2024-11-18',
      objectives: 'Practice using past tense in conversation',
      activities: 'Speaking exercises, role-play, listening comprehension',
      resources: 'Audio materials, conversation cards, whiteboard',
      assessment: 'Oral evaluation'
    }
  ]

  const subjects = ['ALL', 'Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés', 'Educación Física']
  const statuses = ['ALL', 'draft', 'pending', 'revision', 'approved', 'rejected']

  const filteredPlans = lessonPlans.filter(plan => {
    const matchesSubject = selectedSubject === 'ALL' || plan.subject === selectedSubject
    const matchesStatus = selectedStatus === 'ALL' || plan.status === selectedStatus
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.grade.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSubject && matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'revision':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'draft':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobada'
      case 'pending':
        return 'Pendiente'
      case 'revision':
        return 'En Revisión'
      case 'rejected':
        return 'Rechazada'
      case 'draft':
        return 'Borrador'
      default:
        return 'Sin Estado'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'revision':
        return 'bg-orange-100 text-orange-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const planStats = {
    total: filteredPlans.length,
    approved: filteredPlans.filter(p => p.status === 'approved').length,
    pending: filteredPlans.filter(p => p.status === 'pending').length,
    needsRevision: filteredPlans.filter(p => p.status === 'revision').length,
    approvalRate: Math.round((filteredPlans.filter(p => p.status === 'approved').length / filteredPlans.length) * 100) || 0
  }

  const handleViewPlan = (planId: string) => {
    toast.success('Abriendo planificación en detalle...')
    // In real app: navigate to detail view
  }

  const handleApprovePlan = (planId: string) => {
    const plan = lessonPlans.find(p => p.id === planId)
    if (plan) {
      plan.status = 'approved'
      toast.success(`Planificación "${plan.title}" aprobada correctamente`)
    }
  }

  const handleRequestRevision = (planId: string) => {
    const plan = lessonPlans.find(p => p.id === planId)
    if (plan) {
      plan.status = 'revision'
      toast.success(`Solicitud de revisión enviada para "${plan.title}"`)
    }
  }

  const handleRejectPlan = (planId: string) => {
    const plan = lessonPlans.find(p => p.id === planId)
    if (plan && confirm('¿Estás seguro de que deseas rechazar esta planificación?')) {
      plan.status = 'rejected'
      toast.success(`Planificación "${plan.title}" rechazada`)
    }
  }

  const handleExportReport = (format: string) => {
    toast.success(`Exportando reporte de planificaciones en formato ${format.toUpperCase()}...`)
    // In real app: generate and download report
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planificaciones de Clase 📝</h1>
                <p className="text-gray-600 mt-1">
                  Gestión y supervisión de planificaciones docentes
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleExportReport('pdf')}
                  variant="outline"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar PDF
                </Button>
                <Button
                  onClick={() => toast.success('Funcionalidad próximamente...')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Supervisar Todas
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semana
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="2024-W47">Semana 47 (18-22 Nov)</option>
                <option value="2024-W46">Semana 46 (11-15 Nov)</option>
                <option value="2024-W45">Semana 45 (4-8 Nov)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignatura
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'ALL' ? 'Todas las asignaturas' : subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'ALL' ? 'Todos los estados' : getStatusText(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar planificación
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título, profesor o curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Planificaciones</p>
                <p className="text-2xl font-bold text-gray-900">{planStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">{planStats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{planStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Revisión</p>
                <p className="text-2xl font-bold text-orange-600">{planStats.needsRevision}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">% Aprobación</p>
                <p className="text-2xl font-bold text-purple-600">{planStats.approvalRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Plans Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Planificaciones de la Semana {selectedWeek.split('-')[1]}
              </h3>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleExportReport('excel')}
                  variant="outline"
                  size="sm"
                >
                  Excel
                </Button>
                <Button
                  onClick={() => handleExportReport('csv')}
                  variant="outline"
                  size="sm"
                >
                  CSV
                </Button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Duración
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                      <div className="text-sm text-gray-500">{plan.grade} - {plan.class}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Objetivo: {plan.objectives}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{plan.teacher}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {plan.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(plan.date).toLocaleDateString('es-CL')}
                      </div>
                      <div className="text-sm text-gray-500">{plan.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getStatusIcon(plan.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                          {getStatusText(plan.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => handleViewPlan(plan.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver Detalles"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {plan.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprovePlan(plan.id)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Aprobar"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRequestRevision(plan.id)}
                              className="text-orange-600 hover:text-orange-900 p-1"
                              title="Solicitar Revisión"
                            >
                              <ExclamationTriangleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submission Reminders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recordatorios de Entrega</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Sistema de Recordatorios</h3>
              <p className="mt-1 text-sm text-gray-500">
                Notificaciones automáticas para docentes próximamente
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 