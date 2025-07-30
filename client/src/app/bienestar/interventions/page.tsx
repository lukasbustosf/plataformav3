'use client'

import { useState, Fragment } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { Button } from '@/components/ui/button'
import { Dialog, Transition } from '@headlessui/react'
import { 
  HeartIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Intervention {
  id: string
  studentName: string
  studentId: string
  grade: string
  type: 'psychological' | 'academic' | 'social' | 'behavioral' | 'family' | 'medical'
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  professional: string
  professionalRole: string
  startDate: string
  expectedEndDate: string
  actualEndDate?: string
  totalSessions: number
  completedSessions: number
  nextSession: string
  frequency: string
  objectives: string[]
  progress: number
  notes: string
  guardian: string
  guardianContact: string
  paiCaseId?: string
  cost: number
  location: string
  attendanceRate: number
}

export default function BienestarInterventionsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL')
  const [selectedProfessional, setSelectedProfessional] = useState<string>('ALL')
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null)

  // Mock interventions data
  const interventions: Intervention[] = [
    {
      id: 'INT-001',
      studentName: 'María Fernanda González',
      studentId: 'EST-2024-001',
      grade: '7° Básico A',
      type: 'psychological',
      status: 'active',
      priority: 'high',
      professional: 'Psic. Ana López',
      professionalRole: 'Psicóloga Educacional',
      startDate: '2024-10-15',
      expectedEndDate: '2025-03-15',
      totalSessions: 20,
      completedSessions: 12,
      nextSession: '2024-12-23',
      frequency: 'Semanal',
      objectives: [
        'Mejorar autoestima y confianza personal',
        'Desarrollar estrategias de manejo emocional',
        'Fortalecer habilidades sociales'
      ],
      progress: 65,
      notes: 'Muestra progreso significativo en manejo emocional. Familia muy colaborativa.',
      guardian: 'Carmen González',
      guardianContact: '+56 9 8765 4321',
      paiCaseId: 'PAI-001',
      cost: 45000,
      location: 'Oficina Psicología',
      attendanceRate: 92
    },
    {
      id: 'INT-002',
      studentName: 'Carlos Eduardo Mendoza',
      studentId: 'EST-2024-002',
      grade: '2° Medio B',
      type: 'behavioral',
      status: 'active',
      priority: 'high',
      professional: 'T.S. María Torres',
      professionalRole: 'Trabajadora Social',
      startDate: '2024-09-20',
      expectedEndDate: '2025-05-20',
      totalSessions: 25,
      completedSessions: 18,
      nextSession: '2024-12-24',
      frequency: 'Bisemanal',
      objectives: [
        'Reducir conductas agresivas',
        'Mejorar autocontrol',
        'Desarrollar habilidades de resolución de conflictos'
      ],
      progress: 45,
      notes: 'Avance lento pero constante. Requiere intervención familiar adicional.',
      guardian: 'Roberto Mendoza',
      guardianContact: '+56 9 7654 3210',
      paiCaseId: 'PAI-002',
      cost: 35000,
      location: 'Sala de Apoyo',
      attendanceRate: 78
    },
    {
      id: 'INT-003',
      studentName: 'Ana Sofía Herrera',
      studentId: 'EST-2024-003',
      grade: '5° Básico',
      type: 'academic',
      status: 'active',
      priority: 'medium',
      professional: 'Prof. Luis Morales',
      professionalRole: 'Profesor Diferencial',
      startDate: '2024-11-05',
      expectedEndDate: '2025-06-05',
      totalSessions: 30,
      completedSessions: 8,
      nextSession: '2024-12-26',
      frequency: 'Bisemanal',
      objectives: [
        'Mejorar comprensión lectora',
        'Desarrollar estrategias de estudio',
        'Aumentar motivación académica'
      ],
      progress: 75,
      notes: 'Excelente progreso en comprensión lectora. Muy motivada.',
      guardian: 'Laura Herrera',
      guardianContact: '+56 9 6543 2109',
      paiCaseId: 'PAI-003',
      cost: 25000,
      location: 'Aula de Apoyo',
      attendanceRate: 95
    },
    {
      id: 'INT-004',
      studentName: 'Diego Alejandro Silva',
      studentId: 'EST-2024-004',
      grade: '8° Básico A',
      type: 'social',
      status: 'completed',
      priority: 'medium',
      professional: 'T.S. Carmen Vega',
      professionalRole: 'Trabajadora Social',
      startDate: '2024-08-10',
      expectedEndDate: '2024-12-10',
      actualEndDate: '2024-12-10',
      totalSessions: 16,
      completedSessions: 16,
      nextSession: 'N/A',
      frequency: 'Semanal',
      objectives: [
        'Mejorar integración social',
        'Desarrollar habilidades comunicativas',
        'Fortalecer autoconfianza'
      ],
      progress: 100,
      notes: 'Intervención completada exitosamente. Estudiante bien integrado.',
      guardian: 'Patricia Silva',
      guardianContact: '+56 9 5432 1098',
      paiCaseId: 'PAI-004',
      cost: 30000,
      location: 'Sala de Apoyo',
      attendanceRate: 100
    },
    {
      id: 'INT-005',
      studentName: 'Valentina Paz Rodríguez',
      studentId: 'EST-2024-005',
      grade: '1° Medio A',
      type: 'psychological',
      status: 'planned',
      priority: 'medium',
      professional: 'Psic. Andrea Silva',
      professionalRole: 'Psicóloga Clínica',
      startDate: '2024-12-28',
      expectedEndDate: '2025-06-28',
      totalSessions: 15,
      completedSessions: 0,
      nextSession: '2024-12-28',
      frequency: 'Semanal',
      objectives: [
        'Reducir ansiedad social',
        'Mejorar habilidades interpersonales',
        'Fortalecer autoestima'
      ],
      progress: 0,
      notes: 'Intervención planificada. Evaluación inicial programada.',
      guardian: 'Carmen Rodríguez',
      guardianContact: '+56 9 4321 0987',
      paiCaseId: 'PAI-005',
      cost: 40000,
      location: 'Oficina Psicología',
      attendanceRate: 0
    },
    {
      id: 'INT-006',
      studentName: 'Joaquín Andrés Morales',
      studentId: 'EST-2024-006',
      grade: '6° Básico B',
      type: 'family',
      status: 'paused',
      priority: 'low',
      professional: 'T.S. Carolina Núñez',
      professionalRole: 'Trabajadora Social',
      startDate: '2024-10-01',
      expectedEndDate: '2025-04-01',
      totalSessions: 12,
      completedSessions: 6,
      nextSession: 'TBD',
      frequency: 'Quincenal',
      objectives: [
        'Fortalecer vínculos familiares',
        'Mejorar comunicación familiar',
        'Establecer rutinas en el hogar'
      ],
      progress: 30,
      notes: 'Pausada por problemas familiares. Evaluando nueva fecha de inicio.',
      guardian: 'Andrea Morales',
      guardianContact: '+56 9 3210 9876',
      cost: 35000,
      location: 'Sala de Apoyo',
      attendanceRate: 50
    }
  ]

  const types = ['ALL', 'psychological', 'academic', 'social', 'behavioral', 'family', 'medical']
  const statuses = ['ALL', 'planned', 'active', 'paused', 'completed', 'cancelled']
  const priorities = ['ALL', 'high', 'medium', 'low']
  const professionals = ['ALL', ...Array.from(new Set(interventions.map(i => i.professional)))]

  const filteredInterventions = interventions.filter(intervention => {
    const matchesSearch = intervention.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          intervention.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          intervention.professional.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'ALL' || intervention.type === selectedType
    const matchesStatus = selectedStatus === 'ALL' || intervention.status === selectedStatus
    const matchesPriority = selectedPriority === 'ALL' || intervention.priority === selectedPriority
    const matchesProfessional = selectedProfessional === 'ALL' || intervention.professional === selectedProfessional
    
    return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesProfessional
  })

  const interventionStats = {
    total: interventions.length,
    active: interventions.filter(i => i.status === 'active').length,
    planned: interventions.filter(i => i.status === 'planned').length,
    completed: interventions.filter(i => i.status === 'completed').length,
    paused: interventions.filter(i => i.status === 'paused').length,
    highPriority: interventions.filter(i => i.priority === 'high').length,
    avgProgress: Math.round(interventions.reduce((sum, i) => sum + i.progress, 0) / interventions.length),
    totalCost: interventions.reduce((sum, i) => sum + (i.cost * i.completedSessions), 0),
    avgAttendance: Math.round(interventions.reduce((sum, i) => sum + i.attendanceRate, 0) / interventions.length)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'psychological': return <HeartIcon className="h-4 w-4" />
      case 'academic': return <AcademicCapIcon className="h-4 w-4" />
      case 'social': return <UserIcon className="h-4 w-4" />
      case 'behavioral': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'family': return <UserIcon className="h-4 w-4" />
      case 'medical': return <DocumentTextIcon className="h-4 w-4" />
      default: return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'psychological': return 'Psicológica'
      case 'academic': return 'Académica'
      case 'social': return 'Social'
      case 'behavioral': return 'Conductual'
      case 'family': return 'Familiar'
      case 'medical': return 'Médica'
      default: return type
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned': return <ClockIcon className="h-4 w-4 text-blue-500" />
      case 'active': return <PlayIcon className="h-4 w-4 text-green-500" />
      case 'paused': return <PauseIcon className="h-4 w-4 text-yellow-500" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-purple-500" />
      case 'cancelled': return <StopIcon className="h-4 w-4 text-red-500" />
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planificada'
      case 'active': return 'Activa'
      case 'paused': return 'Pausada'
      case 'completed': return 'Completada'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCreateIntervention = () => {
    toast.success('Abriendo formulario de nueva intervención...')
  }

  const handleViewIntervention = (interventionId: string) => {
    const intervention = interventions.find(i => i.id === interventionId)
    if (intervention) {
      setSelectedIntervention(intervention)
      setShowViewModal(true)
    }
  }

  const handleEditIntervention = (interventionId: string) => {
    toast.success(`Editando intervención ${interventionId}...`)
  }

  const handleStartIntervention = (interventionId: string) => {
    toast.success(`Iniciando intervención ${interventionId}...`)
  }

  const handlePauseIntervention = (interventionId: string) => {
    toast.success(`Pausando intervención ${interventionId}...`)
  }

  const handleCompleteIntervention = (interventionId: string) => {
    if (confirm('¿Estás seguro de que deseas marcar esta intervención como completada?')) {
      toast.success('Intervención marcada como completada')
    }
  }

  const handleDeleteIntervention = (interventionId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta intervención?')) {
      toast.success('Intervención eliminada correctamente')
    }
  }

  const handleExportReport = (format: string) => {
    toast.success(`Exportando reporte de intervenciones en formato ${format.toUpperCase()}...`)
  }

  const handleContactProfessional = (professional: string) => {
    toast.success(`Iniciando contacto con ${professional}...`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Intervenciones 🎯</h1>
                <p className="text-gray-600 mt-1">
                  Gestión de intervenciones y programas de apoyo estudiantil
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
                  onClick={handleCreateIntervention}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nueva Intervención
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'ALL' ? 'Todos los tipos' : getTypeText(type)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority === 'ALL' ? 'Todas las prioridades' : 
                     priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesional
              </label>
              <select
                value={selectedProfessional}
                onChange={(e) => setSelectedProfessional(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {professionals.map(professional => (
                  <option key={professional} value={professional}>
                    {professional === 'ALL' ? 'Todos los profesionales' : professional}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar intervención
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por estudiante, código o profesional..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{interventionStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activas</p>
                <p className="text-2xl font-bold text-green-600">{interventionStats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Planificadas</p>
                <p className="text-2xl font-bold text-blue-600">{interventionStats.planned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold text-purple-600">{interventionStats.completed}</p>
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
                <p className="text-sm font-medium text-gray-500">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-600">{interventionStats.highPriority}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progreso Prom.</p>
                <p className="text-2xl font-bold text-indigo-600">{interventionStats.avgProgress}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asistencia Prom.</p>
                <p className="text-2xl font-bold text-emerald-600">{interventionStats.avgAttendance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Costo Total</p>
                <p className="text-2xl font-bold text-orange-600">${interventionStats.totalCost.toLocaleString('es-CL')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interventions Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Intervenciones ({filteredInterventions.length})
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
                    Código/Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo/Prioridad
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profesional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Sesión
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistencia
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInterventions.map((intervention) => (
                  <tr key={intervention.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{intervention.id}</div>
                      <div className="text-sm text-gray-600">{intervention.studentName}</div>
                      <div className="text-xs text-gray-500">{intervention.grade}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 mb-1">
                        {getTypeIcon(intervention.type)}
                        <span className="text-sm text-gray-900">{getTypeText(intervention.type)}</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(intervention.priority)}`}>
                        {intervention.priority.charAt(0).toUpperCase() + intervention.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {getStatusIcon(intervention.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(intervention.status)}`}>
                          {getStatusText(intervention.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full bg-blue-600" 
                            style={{ width: `${intervention.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-900">{intervention.progress}%</span>
                        <span className="text-xs text-gray-500">
                          {intervention.completedSessions}/{intervention.totalSessions} sesiones
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{intervention.professional}</div>
                      <div className="text-xs text-gray-500">{intervention.professionalRole}</div>
                      <div className="text-xs text-gray-500">{intervention.frequency}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {intervention.nextSession !== 'N/A' && intervention.nextSession !== 'TBD' ? 
                          new Date(intervention.nextSession).toLocaleDateString('es-CL') : 
                          intervention.nextSession
                        }
                      </div>
                      <div className="text-xs text-gray-500">{intervention.location}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">{intervention.attendanceRate}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mx-auto">
                        <div 
                          className={`h-1.5 rounded-full ${
                            intervention.attendanceRate >= 90 ? 'bg-green-500' :
                            intervention.attendanceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${intervention.attendanceRate}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-1">
                        <button
                          onClick={() => handleViewIntervention(intervention.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver Detalles"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditIntervention(intervention.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {intervention.status === 'planned' && (
                          <button
                            onClick={() => handleStartIntervention(intervention.id)}
                            className="text-emerald-600 hover:text-emerald-900 p-1"
                            title="Iniciar"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        {intervention.status === 'active' && (
                          <button
                            onClick={() => handlePauseIntervention(intervention.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Pausar"
                          >
                            <PauseIcon className="h-4 w-4" />
                          </button>
                        )}
                        {(intervention.status === 'active' || intervention.status === 'paused') && (
                          <button
                            onClick={() => handleCompleteIntervention(intervention.id)}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Completar"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteIntervention(intervention.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Intervention Modal */}
        <Transition.Root show={showViewModal} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={setShowViewModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                    {selectedIntervention && (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                            Detalles de la Intervención - {selectedIntervention.id}
                          </Dialog.Title>
                          <button
                            onClick={() => setShowViewModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Student Information */}
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                              Información del Estudiante
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.studentName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">ID:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.studentId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Curso:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.grade}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Apoderado:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.guardian}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Contacto:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.guardianContact}</span>
                              </div>
                              {selectedIntervention.paiCaseId && (
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium text-gray-500">Caso PAI:</span>
                                  <span className="text-sm text-blue-600 font-medium">{selectedIntervention.paiCaseId}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Intervention Details */}
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              {getTypeIcon(selectedIntervention.type)}
                              <span className="ml-2">Detalles de la Intervención</span>
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Tipo:</span>
                                <span className="text-sm text-gray-900">{getTypeText(selectedIntervention.type)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Estado:</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(selectedIntervention.status)}`}>
                                  {getStatusText(selectedIntervention.status)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(selectedIntervention.priority)}`}>
                                  {selectedIntervention.priority.charAt(0).toUpperCase() + selectedIntervention.priority.slice(1)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Frecuencia:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.frequency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Ubicación:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.location}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Costo:</span>
                                <span className="text-sm text-gray-900">${selectedIntervention.cost.toLocaleString('es-CL')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Professional Information */}
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-600" />
                              Profesional Responsable
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.professional}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Cargo:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.professionalRole}</span>
                              </div>
                              <div className="pt-2">
                                <Button
                                  onClick={() => handleContactProfessional(selectedIntervention.professional)}
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <PhoneIcon className="h-4 w-4 mr-2" />
                                  Contactar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline and Sessions */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              <CalendarIcon className="h-5 w-5 mr-2 text-gray-600" />
                              Cronograma
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Fecha de Inicio:</span>
                                <span className="text-sm text-gray-900">
                                  {new Date(selectedIntervention.startDate).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Fecha Esperada de Término:</span>
                                <span className="text-sm text-gray-900">
                                  {new Date(selectedIntervention.expectedEndDate).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                              {selectedIntervention.actualEndDate && (
                                <div className="flex justify-between">
                                  <span className="text-sm font-medium text-gray-500">Fecha Real de Término:</span>
                                  <span className="text-sm text-green-600 font-medium">
                                    {new Date(selectedIntervention.actualEndDate).toLocaleDateString('es-CL')}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Próxima Sesión:</span>
                                <span className="text-sm text-gray-900">{selectedIntervention.nextSession}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                              <ChartBarIcon className="h-5 w-5 mr-2 text-gray-600" />
                              Progreso y Sesiones
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Progreso General</span>
                                  <span>{selectedIntervention.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div 
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${selectedIntervention.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Sesiones Completadas:</span>
                                <span className="text-sm text-gray-900">
                                  {selectedIntervention.completedSessions}/{selectedIntervention.totalSessions}
                                </span>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                  <span>Asistencia</span>
                                  <span>{selectedIntervention.attendanceRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      selectedIntervention.attendanceRate >= 90 ? 'bg-green-500' :
                                      selectedIntervention.attendanceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${selectedIntervention.attendanceRate}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Objectives */}
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                            <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                            Objetivos de la Intervención
                          </h4>
                          <div className="bg-green-50 rounded-lg p-4">
                            <ul className="space-y-2">
                              {selectedIntervention.objectives.map((objective, index) => (
                                <li key={index} className="flex items-start">
                                  <ArrowRightIcon className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-800">{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Notas y Observaciones</h4>
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-sm text-gray-800">{selectedIntervention.notes}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end space-x-3">
                          <Button
                            onClick={() => {
                              setShowViewModal(false)
                              handleEditIntervention(selectedIntervention.id)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Editar Intervención
                          </Button>
                          {selectedIntervention.status === 'planned' && (
                            <Button
                              onClick={() => {
                                setShowViewModal(false)
                                handleStartIntervention(selectedIntervention.id)
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <PlayIcon className="h-4 w-4 mr-2" />
                              Iniciar Intervención
                            </Button>
                          )}
                          {selectedIntervention.status === 'active' && (
                            <Button
                              onClick={() => {
                                setShowViewModal(false)
                                handleCompleteIntervention(selectedIntervention.id)
                              }}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-2" />
                              Completar Intervención
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </DashboardLayout>
  )
}