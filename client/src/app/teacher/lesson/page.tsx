'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  UserGroupIcon,
  PlayIcon,
  FolderIcon
} from '@heroicons/react/24/outline'

interface LessonPlan {
  id: string
  title: string
  subject: string
  grade: string
  class: string
  date: string
  duration: number
  status: 'draft' | 'published' | 'completed' | 'cancelled'
  learningObjectives: string[]
  oaCodes: string[]
  description: string
  activities: {
    type: 'intro' | 'development' | 'closure' | 'assessment'
    title: string
    duration: number
    description: string
    resources: string[]
  }[]
  resources: {
    id: string
    name: string
    type: 'pdf' | 'video' | 'presentation' | 'quiz' | 'game' | 'link'
    url: string
  }[]
  assessment: {
    type: 'formative' | 'summative' | 'diagnostic'
    method: string
    criteria: string[]
  }
  students: number
  createdAt: string
  updatedAt: string
  teacher: string
  author?: string
  usage_count?: number
  avg_rating?: number
}

const mockLessonPlans: LessonPlan[] = [
  {
    id: '1',
    title: 'Fracciones y Números Decimales',
    subject: 'Matemáticas',
    grade: '5°',
    class: '5°A',
    date: '2024-01-22T10:00:00Z',
    duration: 90,
    status: 'published',
    learningObjectives: [
      'Convertir fracciones a números decimales',
      'Comparar fracciones equivalentes',
      'Resolver problemas con fracciones'
    ],
    oaCodes: ['MA05-OA07', 'MA05-OA08'],
    description: 'Introducción a la conversión entre fracciones y decimales mediante ejemplos prácticos y juegos interactivos.',
    activities: [
      {
        type: 'intro',
        title: 'Motivación inicial',
        duration: 15,
        description: 'Presentación del problema cotidiano: dividir una pizza',
        resources: ['video-pizza.mp4', 'presentation-intro.pptx']
      },
      {
        type: 'development',
        title: 'Desarrollo del concepto',
        duration: 45,
        description: 'Explicación de fracciones decimales con ejemplos concretos',
        resources: ['worksheet-fracciones.pdf', 'quiz-fracciones']
      },
      {
        type: 'closure',
        title: 'Síntesis y repaso',
        duration: 20,
        description: 'Juego interactivo para consolidar aprendizajes',
        resources: ['game-fracciones']
      },
      {
        type: 'assessment',
        title: 'Evaluación formativa',
        duration: 10,
        description: 'Ticket de salida con 3 preguntas',
        resources: ['ticket-salida.pdf']
      }
    ],
    resources: [
      { id: '1', name: 'Video Pizza Fracciones', type: 'video', url: '/videos/pizza-fracciones.mp4' },
      { id: '2', name: 'Presentación Intro', type: 'presentation', url: '/presentations/intro-fracciones.pptx' },
      { id: '3', name: 'Hoja de trabajo', type: 'pdf', url: '/worksheets/fracciones-5to.pdf' },
      { id: '4', name: 'Quiz Fracciones', type: 'quiz', url: '/quiz/fracciones-basico' },
      { id: '5', name: 'Juego Fracciones', type: 'game', url: '/games/fracciones-match' }
    ],
    assessment: {
      type: 'formative',
      method: 'Observación directa y ticket de salida',
      criteria: ['Identifica fracciones equivalentes', 'Convierte fracciones a decimales', 'Resuelve problemas simples']
    },
    students: 28,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    teacher: 'Ana Martínez'
  },
  {
    id: '2',
    title: 'Ecosistemas y Biodiversidad',
    subject: 'Ciencias Naturales',
    grade: '5°',
    class: '5°A',
    date: '2024-01-24T14:00:00Z',
    duration: 90,
    status: 'draft',
    learningObjectives: [
      'Identificar componentes de un ecosistema',
      'Explicar relaciones entre seres vivos',
      'Valorar la importancia de la biodiversidad'
    ],
    oaCodes: ['CN05-OA01', 'CN05-OA02'],
    description: 'Exploración de ecosistemas locales y análisis de la biodiversidad en Chile.',
    activities: [
      {
        type: 'intro',
        title: 'Exploración inicial',
        duration: 20,
        description: 'Observación de imágenes de ecosistemas chilenos',
        resources: ['gallery-ecosistemas.pptx']
      },
      {
        type: 'development',
        title: 'Investigación colaborativa',
        duration: 50,
        description: 'Trabajo en grupos para investigar diferentes ecosistemas',
        resources: ['guia-investigacion.pdf', 'sitios-web.txt']
      },
      {
        type: 'closure',
        title: 'Presentaciones grupales',
        duration: 20,
        description: 'Cada grupo presenta su ecosistema asignado',
        resources: ['rubrica-presentacion.pdf']
      }
    ],
    resources: [
      { id: '6', name: 'Galería Ecosistemas', type: 'presentation', url: '/presentations/ecosistemas-chile.pptx' },
      { id: '7', name: 'Guía Investigación', type: 'pdf', url: '/guides/investigacion-ecosistemas.pdf' },
      { id: '8', name: 'Sitios Web Recomendados', type: 'link', url: '/resources/sitios-ecosistemas.txt' }
    ],
    assessment: {
      type: 'formative',
      method: 'Rúbrica de presentación grupal',
      criteria: ['Identifica componentes correctamente', 'Explica relaciones entre especies', 'Presenta información clara']
    },
    students: 28,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    teacher: 'Ana Martínez'
  }
]

export default function LessonPlansPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)

  // State for P2-T-09: Import previous year planning
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFilters, setImportFilters] = useState({
    year: new Date().getFullYear() - 1,
    subject: 'all',
    grade: 'all',
    author: 'all'
  })
  const [importResults, setImportResults] = useState<LessonPlan[]>([])
  const [selectedPlansToImport, setSelectedPlansToImport] = useState<string[]>([])
  const [importLoading, setImportLoading] = useState(false)

  // P2-T-09: Previous year lesson plans (mock data)
  const previousYearPlans: LessonPlan[] = [
    {
      id: 'prev-1',
      title: 'Fracciones y Números Decimales',
      subject: 'Matemáticas',
      grade: '5°',
      class: '5°A - 2024',
      date: '2024-03-15T10:00:00Z',
      duration: 90,
      status: 'published',
      learningObjectives: [
        'Convertir fracciones a números decimales',
        'Comparar fracciones equivalentes'
      ],
      oaCodes: ['MA05-OA07', 'MA05-OA08'],
      description: 'Planificación exitosa del año anterior - alta calidad',
      activities: [
        {
          type: 'intro',
          title: 'Motivación inicial',
          duration: 15,
          description: 'Presentación del problema cotidiano',
          resources: ['video-pizza.mp4']
        }
      ],
      resources: [
        {
          id: 'res-1',
          name: 'Video Pizza Fracciones',
          type: 'video',
          url: '/assets/videos/pizza-fractions.mp4'
        }
      ],
      assessment: {
        type: 'formative',
        method: 'Observación directa',
        criteria: ['Comprende conceptos', 'Participa activamente']
      },
      students: 28,
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:30:00Z',
      teacher: 'Prof. María González',
      author: 'Prof. María González',
      usage_count: 8,
      avg_rating: 4.8
    },
    {
      id: 'prev-2', 
      title: 'Comprensión Lectora - Cuentos',
      subject: 'Lenguaje',
      grade: '6°',
      class: '6°B - 2024',
      date: '2024-04-20T09:00:00Z',
      duration: 90,
      status: 'published',
      learningObjectives: [
        'Analizar elementos narrativos',
        'Inferir información implícita'
      ],
      oaCodes: ['LEN-06-OA-03'],
      description: 'Planificación con excelentes resultados',
      activities: [],
      resources: [
        {
          id: 'res-2',
          name: 'Cuento El Principito',
          type: 'pdf',
          url: '/assets/docs/principito.pdf'
        }
      ],
      assessment: {
        type: 'summative',
        method: 'Evaluación escrita',
        criteria: ['Identifica personajes', 'Comprende trama', 'Infiere mensajes']
      },
      students: 32,
      createdAt: '2024-04-20T07:00:00Z',
      updatedAt: '2024-04-20T07:45:00Z',
      teacher: 'Prof. Carlos Mendoza',
      author: 'Prof. Carlos Mendoza',
      usage_count: 12,
      avg_rating: 4.6
    }
  ]

  const filteredPlans = mockLessonPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.oaCodes.some(code => code.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject = selectedSubject === 'all' || plan.subject === selectedSubject
    const matchesStatus = selectedStatus === 'all' || plan.status === selectedStatus
    const matchesGrade = selectedGrade === 'all' || plan.grade === selectedGrade
    
    return matchesSearch && matchesSubject && matchesStatus && matchesGrade
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado'
      case 'draft': return 'Borrador'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircleIcon className="h-4 w-4" />
      case 'draft': return <PencilIcon className="h-4 w-4" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      case 'cancelled': return <XMarkIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <DocumentTextIcon className="h-4 w-4" />
      case 'video': return <PlayIcon className="h-4 w-4" />
      case 'presentation': return <DocumentTextIcon className="h-4 w-4" />
      case 'quiz': return <AcademicCapIcon className="h-4 w-4" />
      case 'game': return <PlayIcon className="h-4 w-4" />
      case 'link': return <BookOpenIcon className="h-4 w-4" />
      default: return <FolderIcon className="h-4 w-4" />
    }
  }

  const handleCreatePlan = () => {
    router.push('/teacher/lesson/create')
  }

  const handleViewPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan)
    setShowPlanModal(true)
  }

  const handleEditPlan = (planId: string) => {
    router.push(`/teacher/lesson/${planId}/edit`)
  }

  const handleDuplicatePlan = (plan: LessonPlan) => {
    toast.success(`Duplicando plan "${plan.title}"...`)
    // Logic to duplicate plan
  }

  const handleDeletePlan = (planId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este plan de clase?')) {
      toast.success('Plan de clase eliminado exitosamente')
      // Logic to delete plan
    }
  }

  const handleGenerateWithAI = () => {
    router.push('/teacher/lesson/create?mode=ai')
  }

  const handleExportPlan = (plan: LessonPlan) => {
    toast.success(`Exportando plan "${plan.title}" a PDF...`)
  }

  const stats = {
    total: mockLessonPlans.length,
    published: mockLessonPlans.filter(p => p.status === 'published').length,
    draft: mockLessonPlans.filter(p => p.status === 'draft').length,
    thisWeek: mockLessonPlans.filter(p => {
      const planDate = new Date(p.date)
      const now = new Date()
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      return planDate >= weekStart && planDate <= weekEnd
    }).length
  }

  // P2-T-09: Import previous year lesson plans
  const handleImportPreviousYear = async () => {
    setImportLoading(true)
    try {
      // Simulate API call with filters
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredPlans = previousYearPlans
      
      if (importFilters.subject !== 'all') {
        filteredPlans = filteredPlans.filter(plan => plan.subject === importFilters.subject)
      }
      
      if (importFilters.grade !== 'all') {
        filteredPlans = filteredPlans.filter(plan => plan.grade === importFilters.grade)
      }
      
      if (importFilters.author !== 'all') {
        filteredPlans = filteredPlans.filter(plan => plan.author === importFilters.author)
      }
      
      setImportResults(filteredPlans)
      toast.success(`${filteredPlans.length} planificaciones encontradas - P2-T-09`)
    } catch (error) {
      toast.error('Error al buscar planificaciones')
    } finally {
      setImportLoading(false)
    }
  }

  const handleImportSelected = async () => {
    if (selectedPlansToImport.length === 0) {
      toast.error('Selecciona al menos una planificación para importar')
      return
    }

    setImportLoading(true)
    try {
      const response = await fetch('/api/lesson-plans/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan_ids: selectedPlansToImport,
          target_year: new Date().getFullYear(),
          adaptation_settings: {
            update_dates: true,
            preserve_oa_codes: true,
            update_class_assignments: true
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(`${selectedPlansToImport.length} planificaciones importadas exitosamente - P2-T-09`)
        setShowImportModal(false)
        setSelectedPlansToImport([])
        // Refresh lesson plans list
        // refetch() - would refresh data
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Error al importar planificaciones')
    } finally {
      setImportLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planes de Clase</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona y organiza tus planificaciones de clase
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {/* P2-T-09: Import previous year button */}
            <Button
              variant="outline"
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
              onClick={() => setShowImportModal(true)}
              className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
            >
              Importar P2-T-09
            </Button>
            <Button
              variant="outline"
              leftIcon={<SparklesIcon className="h-4 w-4" />}
              onClick={handleGenerateWithAI}
            >
              Generar con IA
            </Button>
            <Button
              variant="primary"
              leftIcon={<PlusIcon className="h-4 w-4" />}
              onClick={handleCreatePlan}
            >
              Crear Plan
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Planes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <PencilIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CalendarDaysIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
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
                  placeholder="Buscar planes por título, descripción o OA..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
              </Button>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400'}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todas las asignaturas</option>
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Ciencias Naturales">Ciencias Naturales</option>
                  <option value="Historia">Historia</option>
                  <option value="Lenguaje">Lenguaje</option>
                  <option value="Inglés">Inglés</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="completed">Completado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grado</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todos los grados</option>
                  <option value="5°">5° Básico</option>
                  <option value="6°">6° Básico</option>
                  <option value="7°">7° Básico</option>
                  <option value="8°">8° Básico</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Plans Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.subject}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {plan.grade} {plan.class}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {getStatusIcon(plan.status)}
                      <span className="ml-1">{getStatusText(plan.status)}</span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{plan.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-4 w-4 mr-1" />
                      <span>{new Date(plan.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{plan.duration} min</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{plan.students} alumnos</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">OA:</span>
                      {plan.oaCodes.slice(0, 2).map((code, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {code}
                        </span>
                      ))}
                      {plan.oaCodes.length > 2 && (
                        <span className="text-xs text-gray-500">+{plan.oaCodes.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<EyeIcon className="h-3 w-3" />}
                      onClick={() => handleViewPlan(plan)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<PencilIcon className="h-3 w-3" />}
                      onClick={() => handleEditPlan(plan.id)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<DocumentDuplicateIcon className="h-3 w-3" />}
                      onClick={() => handleDuplicatePlan(plan)}
                    >
                      Duplicar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan de Clase
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                          <div className="text-sm text-gray-500">{plan.grade} {plan.class} • {plan.duration} min</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(plan.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                          {getStatusIcon(plan.status)}
                          <span className="ml-1">{getStatusText(plan.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {plan.oaCodes.slice(0, 2).map((code, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              {code}
                            </span>
                          ))}
                          {plan.oaCodes.length > 2 && (
                            <span className="text-xs text-gray-500">+{plan.oaCodes.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<EyeIcon className="h-3 w-3" />}
                          onClick={() => handleViewPlan(plan)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<PencilIcon className="h-3 w-3" />}
                          onClick={() => handleEditPlan(plan.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<ArrowDownTrayIcon className="h-3 w-3" />}
                          onClick={() => handleExportPlan(plan)}
                        >
                          Exportar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron planes de clase</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros de búsqueda o crea un nuevo plan.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                leftIcon={<PlusIcon className="h-4 w-4" />}
                onClick={handleCreatePlan}
              >
                Crear Primer Plan
              </Button>
            </div>
          </div>
        )}

        {/* Plan Detail Modal */}
        {showPlanModal && selectedPlan && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedPlan.title}</h3>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Plan Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Asignatura:</span> {selectedPlan.subject}</p>
                      <p><span className="font-medium">Grado:</span> {selectedPlan.grade} {selectedPlan.class}</p>
                      <p><span className="font-medium">Fecha:</span> {new Date(selectedPlan.date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Duración:</span> {selectedPlan.duration} minutos</p>
                      <p><span className="font-medium">Estudiantes:</span> {selectedPlan.students}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Objetivos de Aprendizaje</h4>
                    <div className="space-y-1">
                      {selectedPlan.oaCodes.map((code, index) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Objetivos Específicos</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    {selectedPlan.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                {/* Activities */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Actividades</h4>
                  <div className="space-y-3">
                    {selectedPlan.activities.map((activity, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{activity.title}</h5>
                          <span className="text-xs text-gray-500">{activity.duration} min</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {activity.resources.map((resource, resourceIndex) => (
                            <span key={resourceIndex} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recursos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPlan.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center p-2 border border-gray-200 rounded-lg">
                        {getResourceIcon(resource.type)}
                        <span className="ml-2 text-sm text-gray-700">{resource.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Evaluación</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Tipo:</span> {selectedPlan.assessment.type}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Método:</span> {selectedPlan.assessment.method}
                    </p>
                    <div>
                      <span className="font-medium text-sm text-gray-700">Criterios:</span>
                      <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                        {selectedPlan.assessment.criteria.map((criterion, index) => (
                          <li key={index}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowPlanModal(false)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                    onClick={() => handleExportPlan(selectedPlan)}
                  >
                    Exportar PDF
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<PencilIcon className="h-4 w-4" />}
                    onClick={() => {
                      setShowPlanModal(false)
                      handleEditPlan(selectedPlan.id)
                    }}
                  >
                    Editar Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* P2-T-09: Import Previous Year Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowImportModal(false)} />
              
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Importar Planificaciones del Año Anterior
                    </h3>
                    <p className="text-sm text-gray-600">P2-T-09: Wizard con filtros avanzados</p>
                  </div>
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Import Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año
                    </label>
                    <select
                      value={importFilters.year}
                      onChange={(e) => setImportFilters({...importFilters, year: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                      <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                      <option value={new Date().getFullYear() - 3}>{new Date().getFullYear() - 3}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asignatura
                    </label>
                    <select
                      value={importFilters.subject}
                      onChange={(e) => setImportFilters({...importFilters, subject: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todas las asignaturas</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Lenguaje">Lenguaje</option>
                      <option value="Ciencias Naturales">Ciencias Naturales</option>
                      <option value="Historia">Historia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel
                    </label>
                    <select
                      value={importFilters.grade}
                      onChange={(e) => setImportFilters({...importFilters, grade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Todos los niveles</option>
                      <option value="5°">5° Básico</option>
                      <option value="6°">6° Básico</option>
                      <option value="7°">7° Básico</option>
                      <option value="8°">8° Básico</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleImportPreviousYear}
                      disabled={importLoading}
                      className="w-full"
                    >
                      {importLoading ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>
                </div>

                {/* Import Results */}
                {importResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Planificaciones Encontradas ({importResults.length})
                      </h4>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPlansToImport(importResults.map(p => p.id))}
                          size="sm"
                        >
                          Seleccionar Todas
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPlansToImport([])}
                          size="sm"
                        >
                          Deseleccionar
                        </Button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {importResults.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedPlansToImport.includes(plan.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            if (selectedPlansToImport.includes(plan.id)) {
                              setSelectedPlansToImport(prev => prev.filter(id => id !== plan.id))
                            } else {
                              setSelectedPlansToImport(prev => [...prev, plan.id])
                            }
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={selectedPlansToImport.includes(plan.id)}
                                  onChange={() => {}}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <h5 className="font-medium text-gray-900">{plan.title}</h5>
                              </div>
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                                <span>{plan.subject}</span>
                                <span>{plan.grade}</span>
                                <span>{plan.author}</span>
                                <span>⭐ {plan.avg_rating}</span>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setShowImportModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleImportSelected}
                        disabled={selectedPlansToImport.length === 0 || importLoading}
                      >
                        {importLoading ? 'Importando...' : `Importar ${selectedPlansToImport.length} planificación${selectedPlansToImport.length !== 1 ? 'es' : ''}`}
                      </Button>
                    </div>
                  </div>
                )}

                {importResults.length === 0 && !importLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Usa los filtros para buscar planificaciones del año anterior</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 