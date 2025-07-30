'use client'

import { useState, Fragment } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { Button } from '@/components/ui/button'
import { Dialog, Transition } from '@headlessui/react'
import { 
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  HeartIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  PhoneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface PAICase {
  id: string
  studentName: string
  studentId: string
  grade: string
  rut: string
  status: 'draft' | 'active' | 'completed' | 'suspended' | 'review'
  createdDate: string
  lastUpdated: string
  dueDate: string
  caseworker: string
  priority: 'high' | 'medium' | 'low'
  category: 'academic' | 'behavioral' | 'social' | 'emotional' | 'family' | 'medical'
  objectives: string[]
  interventions: number
  progressPercentage: number
  guardian: string
  guardianContact: string
  teacher: string
  nextReview: string
  documents: number
}

export default function BienestarPaiCasesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState<PAICase | null>(null)

  // Mock PAI cases data
  const paiCases: PAICase[] = [
    {
      id: 'PAI-001',
      studentName: 'María Fernanda González',
      studentId: 'EST-2024-001',
      grade: '7° Básico A',
      rut: '23.456.789-1',
      status: 'active',
      createdDate: '2024-10-15',
      lastUpdated: '2024-12-18',
      dueDate: '2025-03-15',
      caseworker: 'Psic. Ana López',
      priority: 'high',
      category: 'emotional',
      objectives: [
        'Mejorar autoestima y confianza personal',
        'Desarrollar estrategias de manejo emocional',
        'Fortalecer vínculos familiares'
      ],
      interventions: 15,
      progressPercentage: 65,
      guardian: 'Carmen González',
      guardianContact: '+56 9 8765 4321',
      teacher: 'Prof. Ana López',
      nextReview: '2024-12-28',
      documents: 8
    },
    {
      id: 'PAI-002',
      studentName: 'Carlos Eduardo Mendoza',
      studentId: 'EST-2024-002',
      grade: '2° Medio B',
      rut: '24.567.890-2',
      status: 'review',
      createdDate: '2024-09-20',
      lastUpdated: '2024-12-19',
      dueDate: '2025-02-20',
      caseworker: 'T.S. María Torres',
      priority: 'high',
      category: 'behavioral',
      objectives: [
        'Reducir conductas agresivas',
        'Mejorar habilidades sociales',
        'Desarrollar autocontrol'
      ],
      interventions: 22,
      progressPercentage: 45,
      guardian: 'Roberto Mendoza',
      guardianContact: '+56 9 7654 3210',
      teacher: 'Prof. Carlos Ruiz',
      nextReview: '2024-12-25',
      documents: 12
    },
    {
      id: 'PAI-003',
      studentName: 'Ana Sofía Herrera',
      studentId: 'EST-2024-003',
      grade: '5° Básico',
      rut: '22.345.678-0',
      status: 'active',
      createdDate: '2024-11-05',
      lastUpdated: '2024-12-16',
      dueDate: '2025-05-05',
      caseworker: 'Psic. Luis Morales',
      priority: 'medium',
      category: 'academic',
      objectives: [
        'Mejorar comprensión lectora',
        'Desarrollar estrategias de estudio',
        'Aumentar motivación académica'
      ],
      interventions: 8,
      progressPercentage: 75,
      guardian: 'Laura Herrera',
      guardianContact: '+56 9 6543 2109',
      teacher: 'Prof. María Torres',
      nextReview: '2024-12-30',
      documents: 5
    },
    {
      id: 'PAI-004',
      studentName: 'Diego Alejandro Silva',
      studentId: 'EST-2024-004',
      grade: '8° Básico A',
      rut: '25.678.901-3',
      status: 'completed',
      createdDate: '2024-08-10',
      lastUpdated: '2024-12-10',
      dueDate: '2024-12-10',
      caseworker: 'T.S. Carmen Vega',
      priority: 'low',
      category: 'social',
      objectives: [
        'Mejorar integración social',
        'Desarrollar habilidades comunicativas',
        'Fortalecer autoconfianza'
      ],
      interventions: 18,
      progressPercentage: 100,
      guardian: 'Patricia Silva',
      guardianContact: '+56 9 5432 1098',
      teacher: 'Prof. Luis Morales',
      nextReview: 'N/A',
      documents: 14
    },
    {
      id: 'PAI-005',
      studentName: 'Valentina Paz Rodríguez',
      studentId: 'EST-2024-005',
      grade: '1° Medio A',
      rut: '26.789.012-4',
      status: 'draft',
      createdDate: '2024-12-15',
      lastUpdated: '2024-12-19',
      dueDate: '2025-06-15',
      caseworker: 'Psic. Andrea Silva',
      priority: 'medium',
      category: 'social',
      objectives: [
        'Reducir ansiedad social',
        'Mejorar habilidades interpersonales',
        'Fortalecer autoestima'
      ],
      interventions: 0,
      progressPercentage: 5,
      guardian: 'Carmen Rodríguez',
      guardianContact: '+56 9 4321 0987',
      teacher: 'Prof. Andrea Vega',
      nextReview: '2024-12-22',
      documents: 2
    }
  ]

  const statuses = ['ALL', 'draft', 'active', 'review', 'completed', 'suspended']
  const categories = ['ALL', 'academic', 'behavioral', 'social', 'emotional', 'family', 'medical']
  const priorities = ['ALL', 'high', 'medium', 'low']

  const filteredCases = paiCases.filter(case_ => {
    const matchesSearch = case_.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          case_.guardian.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || case_.status === selectedStatus
    const matchesCategory = selectedCategory === 'ALL' || case_.category === selectedCategory
    const matchesPriority = selectedPriority === 'ALL' || case_.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const caseStats = {
    total: paiCases.length,
    active: paiCases.filter(c => c.status === 'active').length,
    review: paiCases.filter(c => c.status === 'review').length,
    completed: paiCases.filter(c => c.status === 'completed').length,
    highPriority: paiCases.filter(c => c.priority === 'high').length,
    avgProgress: Math.round(paiCases.reduce((sum, c) => sum + c.progressPercentage, 0) / paiCases.length)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'review':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />
      case 'suspended':
        return <ClockIcon className="h-5 w-5 text-red-500" />
      case 'draft':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'review': return 'En Revisión'
      case 'completed': return 'Completado'
      case 'suspended': return 'Suspendido'
      case 'draft': return 'Borrador'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'review': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return <AcademicCapIcon className="h-4 w-4" />
      case 'behavioral': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'social': return <UserIcon className="h-4 w-4" />
      case 'emotional': return <HeartIcon className="h-4 w-4" />
      default: return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const handleCreateCase = () => {
    setShowCreateModal(true)
    toast.success('Abriendo formulario de nuevo caso PAI...')
  }

  const handleViewCase = (caseId: string) => {
    const caseData = paiCases.find(c => c.id === caseId)
    if (caseData) {
      setSelectedCase(caseData)
      setShowViewModal(true)
    }
  }

  const handleEditCase = (caseId: string) => {
    toast.success(`Editando caso ${caseId}...`)
  }

  const handleDeleteCase = (caseId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este caso PAI?')) {
      toast.success('Caso PAI eliminado correctamente')
    }
  }

  const handleExportCases = (format: string) => {
    toast.success(`Exportando casos PAI en formato ${format.toUpperCase()}...`)
  }

  const handleContactGuardian = (guardianContact: string) => {
    toast.success('Iniciando contacto con apoderado...')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Casos PAI 📋</h1>
                <p className="text-gray-600 mt-1">
                  Gestión de Planes de Apoyo Individual para estudiantes
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleExportCases('pdf')}
                  variant="outline"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Exportar PDF
                </Button>
                <Button
                  onClick={handleCreateCase}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Nuevo Caso PAI
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
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'ALL' ? 'Todas las categorías' : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar caso
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por estudiante, código o apoderado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Casos</p>
                <p className="text-2xl font-bold text-gray-900">{caseStats.total}</p>
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
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-bold text-green-600">{caseStats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Revisión</p>
                <p className="text-2xl font-bold text-yellow-600">{caseStats.review}</p>
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
                <p className="text-sm font-medium text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-purple-600">{caseStats.completed}</p>
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
                <p className="text-2xl font-bold text-red-600">{caseStats.highPriority}</p>
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
                <p className="text-sm font-medium text-gray-500">Progreso Promedio</p>
                <p className="text-2xl font-bold text-indigo-600">{caseStats.avgProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* PAI Cases Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Casos PAI ({filteredCases.length})
              </h3>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleExportCases('excel')}
                  variant="outline"
                  size="sm"
                >
                  Excel
                </Button>
                <Button
                  onClick={() => handleExportCases('csv')}
                  variant="outline"
                  size="sm"
                >
                  CSV
                </Button>
              </div>
            </div>
          </div>
          
          <ResponsiveTable
            columns={[
              {
                key: 'id',
                label: 'Código/Estudiante',
                mobileLabel: 'Estudiante',
                render: (id: string, row: PAICase) => (
                  <div>
                    <div className="text-sm font-medium text-gray-900">{id}</div>
                    <div className="text-sm text-gray-600">{row.studentName}</div>
                    <div className="text-xs text-gray-500">{row.grade}</div>
                  </div>
                )
              },
              {
                key: 'category',
                label: 'Categoría',
                hiddenOnMobile: true,
                render: (category: string, row: PAICase) => (
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {getCategoryIcon(category)}
                      <span className="text-sm text-gray-900 capitalize">{category}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(row.priority)}`}>
                      {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
                    </span>
                  </div>
                )
              },
              {
                key: 'status',
                label: 'Estado',
                render: (status: string) => (
                  <div className="flex items-center justify-center space-x-2">
                    {getStatusIcon(status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                )
              },
              {
                key: 'progressPercentage',
                label: 'Progreso',
                hiddenOnMobile: true,
                render: (progress: number) => (
                  <div className="flex flex-col items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className="h-2 rounded-full bg-blue-600" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-900">{progress}%</span>
                  </div>
                )
              },
              {
                key: 'caseworker',
                label: 'Responsable',
                hiddenOnMobile: true,
                render: (caseworker: string, row: PAICase) => (
                  <div>
                    <div className="text-sm text-gray-900">{caseworker}</div>
                    <div className="text-xs text-gray-500">{row.interventions} intervenciones</div>
                  </div>
                )
              },
              {
                key: 'nextReview',
                label: 'Próxima Revisión',
                hiddenOnMobile: true,
                render: (nextReview: string) => (
                  <div className="flex items-center text-sm text-gray-900">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                    {nextReview !== 'N/A' ? 
                      new Date(nextReview).toLocaleDateString('es-CL') : 
                      'N/A'
                    }
                  </div>
                )
              },
              {
                key: 'actions',
                label: 'Acciones',
                render: (_, row: PAICase) => (
                  <div className="flex justify-center space-x-1">
                    <button
                      onClick={() => handleViewCase(row.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 touch-manipulation"
                      title="Ver Detalles"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditCase(row.id)}
                      className="text-green-600 hover:text-green-900 p-1 touch-manipulation"
                      title="Editar"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleContactGuardian(row.guardianContact)}
                      className="text-purple-600 hover:text-purple-900 p-1 touch-manipulation"
                      title="Contactar Apoderado"
                    >
                      <PhoneIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCase(row.id)}
                      className="text-red-600 hover:text-red-900 p-1 touch-manipulation"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
            data={filteredCases}
            keyExtractor={(row) => row.id}
            searchable={true}
            searchPlaceholder="Buscar casos PAI..."
            className="border-0 shadow-none"
          />
        </div>

        {/* View Case Modal */}
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                    {selectedCase && (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                            Detalles del Caso PAI - {selectedCase.id}
                          </Dialog.Title>
                          <button
                            onClick={() => setShowViewModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Student Information */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3">Información del Estudiante</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                                <span className="text-sm text-gray-900">{selectedCase.studentName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Curso:</span>
                                <span className="text-sm text-gray-900">{selectedCase.grade}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">RUT:</span>
                                <span className="text-sm text-gray-900">{selectedCase.rut}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Apoderado:</span>
                                <span className="text-sm text-gray-900">{selectedCase.guardian}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Contacto:</span>
                                <span className="text-sm text-gray-900">{selectedCase.guardianContact}</span>
                              </div>
                            </div>
                          </div>

                          {/* Case Information */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-900 mb-3">Información del Caso</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Estado:</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(selectedCase.status)}`}>
                                  {getStatusText(selectedCase.status)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                                <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(selectedCase.priority)}`}>
                                  {selectedCase.priority.charAt(0).toUpperCase() + selectedCase.priority.slice(1)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Categoría:</span>
                                <span className="text-sm text-gray-900 capitalize">{selectedCase.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Responsable:</span>
                                <span className="text-sm text-gray-900">{selectedCase.caseworker}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-500">Progreso:</span>
                                <span className="text-sm text-gray-900">{selectedCase.progressPercentage}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Objectives */}
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3">Objetivos del Plan</h4>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <ul className="space-y-2">
                              {selectedCase.objectives.map((objective, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-800">{objective}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Fecha de Creación</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {new Date(selectedCase.createdDate).toLocaleDateString('es-CL')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Última Actualización</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {new Date(selectedCase.lastUpdated).toLocaleDateString('es-CL')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-500">Próxima Revisión</div>
                            <div className="text-lg font-semibold text-gray-900">
                              {selectedCase.nextReview !== 'N/A' ? 
                                new Date(selectedCase.nextReview).toLocaleDateString('es-CL') : 
                                'N/A'
                              }
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progreso del Caso</span>
                            <span>{selectedCase.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${selectedCase.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-end space-x-3">
                          <Button
                            onClick={() => handleContactGuardian(selectedCase.guardianContact)}
                            variant="outline"
                          >
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Contactar Apoderado
                          </Button>
                          <Button
                            onClick={() => {
                              setShowViewModal(false)
                              handleEditCase(selectedCase.id)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Editar Caso
                          </Button>
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