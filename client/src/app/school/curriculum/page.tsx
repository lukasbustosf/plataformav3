'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// ===============================================
// P1 COMPLETE OA MANAGEMENT SYSTEM
// ===============================================

interface LearningObjective {
  oa_id: string
  oa_code: string
  oa_desc: string
  oa_short_desc?: string
  grade_code: string
  subject_id: string
  bloom_level: string
  oa_version: string
  semester?: number
  complexity_level?: number
  estimated_hours?: number
  prerequisites?: string[]
  is_transversal: boolean
  ministerial_priority: 'high' | 'normal' | 'low'
  deprecated_at?: string
  created_at: string
  updated_at: string
  grade_levels?: {
    grade_code: string
    grade_name: string
    level_type: string
  }
  subjects?: {
    subject_id: string
    subject_code: string
    subject_name: string
    subject_color?: string
  }
  coverage?: {
    total_questions: number
    total_attempts: number
    unique_students: number
    average_score: number
    last_assessed: number | null
  }
  statistics?: {
    mastery_level: string
    trend: string
    recommended_focus: string
  }
}

interface Subject {
  subject_id: string
  subject_code: string
  subject_name: string
  subject_color?: string
}

interface GradeLevel {
  grade_code: string
  grade_name: string
  level_type: string
  age_min?: number
  age_max?: number
}

interface BloomLevel {
  level: string
  order: number
  description: string
  color: string
}

export default function CurriculumPage() {
  const { user } = useAuth()
  
  // State Management
  const [objectives, setObjectives] = useState<LearningObjective[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grades, setGrades] = useState<GradeLevel[]>([])
  const [bloomLevels, setBloomLevels] = useState<BloomLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState({
    grade: 'ALL',
    subject: 'ALL',
    bloom_level: 'ALL',
    priority: 'ALL',
    search: ''
  })
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  })
  
  // Modals and UI State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCoverageReport, setShowCoverageReport] = useState(false)
  const [selectedOA, setSelectedOA] = useState<LearningObjective | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load objectives when filters change
  useEffect(() => {
    loadObjectives()
  }, [filters, pagination.page])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Mock data for development when API is not available
      const mockSubjects: Subject[] = [
        { subject_id: 'subj-001', subject_code: 'MAT', subject_name: 'Matemática', subject_color: '#3B82F6' },
        { subject_id: 'subj-002', subject_code: 'LEN', subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' },
        { subject_id: 'subj-003', subject_code: 'CN', subject_name: 'Ciencias Naturales', subject_color: '#10B981' },
        { subject_id: 'subj-004', subject_code: 'HIS', subject_name: 'Historia, Geografía y Cs. Sociales', subject_color: '#F59E0B' },
        { subject_id: 'subj-005', subject_code: 'ING', subject_name: 'Inglés', subject_color: '#8B5CF6' },
        { subject_id: 'subj-006', subject_code: 'EDF', subject_name: 'Educación Física y Salud', subject_color: '#06B6D4' },
        { subject_id: 'subj-007', subject_code: 'ART', subject_name: 'Artes Visuales', subject_color: '#EC4899' },
        { subject_id: 'subj-008', subject_code: 'MUS', subject_name: 'Música', subject_color: '#F97316' },
        { subject_id: 'subj-009', subject_code: 'TEC', subject_name: 'Tecnología', subject_color: '#6B7280' },
        { subject_id: 'subj-010', subject_code: 'REL', subject_name: 'Religión', subject_color: '#84CC16' }
      ]

      const mockGrades: GradeLevel[] = [
        { grade_code: 'PK', grade_name: 'Pre-Kínder', level_type: 'PARVULO', age_min: 4, age_max: 5 },
        { grade_code: 'K', grade_name: 'Kínder', level_type: 'PARVULO', age_min: 5, age_max: 6 },
        { grade_code: '1B', grade_name: '1° Básico', level_type: 'BASICA', age_min: 6, age_max: 7 },
        { grade_code: '2B', grade_name: '2° Básico', level_type: 'BASICA', age_min: 7, age_max: 8 },
        { grade_code: '3B', grade_name: '3° Básico', level_type: 'BASICA', age_min: 8, age_max: 9 },
        { grade_code: '4B', grade_name: '4° Básico', level_type: 'BASICA', age_min: 9, age_max: 10 },
        { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA', age_min: 10, age_max: 11 },
        { grade_code: '6B', grade_name: '6° Básico', level_type: 'BASICA', age_min: 11, age_max: 12 },
        { grade_code: '7B', grade_name: '7° Básico', level_type: 'BASICA', age_min: 12, age_max: 13 },
        { grade_code: '8B', grade_name: '8° Básico', level_type: 'BASICA', age_min: 13, age_max: 14 },
        { grade_code: '1M', grade_name: '1° Medio', level_type: 'MEDIA', age_min: 14, age_max: 15 },
        { grade_code: '2M', grade_name: '2° Medio', level_type: 'MEDIA', age_min: 15, age_max: 16 },
        { grade_code: '3M', grade_name: '3° Medio', level_type: 'MEDIA', age_min: 16, age_max: 17 },
        { grade_code: '4M', grade_name: '4° Medio', level_type: 'MEDIA', age_min: 17, age_max: 18 }
      ]

      const mockBloomLevels: BloomLevel[] = [
        { level: 'Recordar', order: 1, description: 'Recordar información previamente aprendida', color: '#EF4444' },
        { level: 'Comprender', order: 2, description: 'Demostrar comprensión de hechos e ideas', color: '#F97316' },
        { level: 'Aplicar', order: 3, description: 'Usar información en nuevas situaciones', color: '#EAB308' },
        { level: 'Analizar', order: 4, description: 'Dividir información en partes para explorar comprensiones', color: '#22C55E' },
        { level: 'Evaluar', order: 5, description: 'Justificar una decisión o curso de acción', color: '#3B82F6' },
        { level: 'Crear', order: 6, description: 'Generar nuevas ideas, productos o formas de ver las cosas', color: '#8B5CF6' }
      ]

      try {
        // Try to load from API first
        const [subjectsRes, gradesRes, bloomRes] = await Promise.all([
          fetch('/api/curriculum/subjects', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('/api/curriculum/grades', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('/api/curriculum/bloom-levels', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ])

        const [subjectsData, gradesData, bloomData] = await Promise.all([
          subjectsRes.json(),
          gradesRes.json(),
          bloomRes.json()
        ])

        // Use API data if successful, otherwise use mock data
        setSubjects(subjectsData.success ? subjectsData.data : mockSubjects)
        setGrades(gradesData.success ? gradesData.data : mockGrades)
        setBloomLevels(bloomData.success ? bloomData.data : mockBloomLevels)

      } catch (apiError) {
        console.log('API not available, using mock data for development')
        // Use mock data when API is not available
        setSubjects(mockSubjects)
        setGrades(mockGrades)
        setBloomLevels(mockBloomLevels)
      }

    } catch (error) {
      console.error('Error loading initial data:', error)
      toast.error('Error al cargar datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const loadObjectives = async () => {
    try {
      // Mock learning objectives for development
      const mockObjectives: LearningObjective[] = [
        {
          oa_id: 'oa-001',
          oa_code: 'MAT-5B-OA01',
          oa_desc: 'Representar y describir números naturales de hasta más de 6 dígitos y menores que 1 000 millones utilizando los períodos.',
          oa_short_desc: 'Números naturales hasta 1.000 millones',
          grade_code: '5B',
          subject_id: 'subj-001',
          bloom_level: 'Comprender',
          oa_version: '2023',
          semester: 1,
          complexity_level: 2,
          estimated_hours: 8,
          prerequisites: ['4B-números-hasta-10000'],
          is_transversal: false,
          ministerial_priority: 'high',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          grade_levels: { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA' },
          subjects: { subject_id: 'subj-001', subject_code: 'MAT', subject_name: 'Matemática', subject_color: '#3B82F6' },
          coverage: { total_questions: 15, total_attempts: 45, unique_students: 12, average_score: 75.5, last_assessed: 1704067200 },
          statistics: { mastery_level: 'En desarrollo', trend: 'mejorando', recommended_focus: 'Práctica con números grandes' }
        },
        {
          oa_id: 'oa-002',
          oa_code: 'MAT-5B-OA02',
          oa_desc: 'Aplicar estrategias de cálculo mental para la multiplicación utilizando las propiedades conmutativa, asociativa y distributiva.',
          oa_short_desc: 'Cálculo mental en multiplicación',
          grade_code: '5B',
          subject_id: 'subj-001',
          bloom_level: 'Aplicar',
          oa_version: '2023',
          semester: 1,
          complexity_level: 3,
          estimated_hours: 6,
          prerequisites: ['4B-multiplicacion-basica'],
          is_transversal: false,
          ministerial_priority: 'high',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          grade_levels: { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA' },
          subjects: { subject_id: 'subj-001', subject_code: 'MAT', subject_name: 'Matemática', subject_color: '#3B82F6' },
          coverage: { total_questions: 20, total_attempts: 60, unique_students: 18, average_score: 82.3, last_assessed: 1704153600 },
          statistics: { mastery_level: 'Logrado', trend: 'estable', recommended_focus: 'Aplicación en problemas complejos' }
        },
        {
          oa_id: 'oa-003',
          oa_code: 'LEN-5B-OA01',
          oa_desc: 'Leer de manera fluida textos variados apropiados a su edad, pronunciando las palabras con precisión, respetando la prosodia indicada por todos los signos de puntuación y leyendo con entonación adecuada.',
          oa_short_desc: 'Lectura fluida con prosodia',
          grade_code: '5B',
          subject_id: 'subj-002',
          bloom_level: 'Aplicar',
          oa_version: '2023',
          semester: 1,
          complexity_level: 2,
          estimated_hours: 4,
          prerequisites: ['4B-lectura-basica'],
          is_transversal: false,
          ministerial_priority: 'high',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          grade_levels: { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA' },
          subjects: { subject_id: 'subj-002', subject_code: 'LEN', subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' },
          coverage: { total_questions: 8, total_attempts: 24, unique_students: 15, average_score: 68.7, last_assessed: 1704240000 },
          statistics: { mastery_level: 'En desarrollo', trend: 'mejorando', recommended_focus: 'Práctica de fluidez lectora' }
        },
        {
          oa_id: 'oa-004',
          oa_code: 'LEN-5B-OA02',
          oa_desc: 'Comprender textos aplicando estrategias de comprensión lectora; por ejemplo: relacionar la información del texto con sus experiencias y conocimientos.',
          oa_short_desc: 'Estrategias de comprensión lectora',
          grade_code: '5B',
          subject_id: 'subj-002',
          bloom_level: 'Comprender',
          oa_version: '2023',
          semester: 1,
          complexity_level: 3,
          estimated_hours: 6,
          prerequisites: ['4B-comprension-basica'],
          is_transversal: false,
          ministerial_priority: 'high',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          grade_levels: { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA' },
          subjects: { subject_id: 'subj-002', subject_code: 'LEN', subject_name: 'Lenguaje y Comunicación', subject_color: '#EF4444' },
          coverage: { total_questions: 12, total_attempts: 36, unique_students: 20, average_score: 79.1, last_assessed: 1704326400 },
          statistics: { mastery_level: 'Logrado', trend: 'estable', recommended_focus: 'Textos más complejos' }
        },
        {
          oa_id: 'oa-005',
          oa_code: 'CN-5B-OA01',
          oa_desc: 'Reconocer y explicar que los seres vivos están formados por una o más células y que estas se organizan en tejidos, órganos y sistemas.',
          oa_short_desc: 'Organización celular de seres vivos',
          grade_code: '5B',
          subject_id: 'subj-003',
          bloom_level: 'Comprender',
          oa_version: '2023',
          semester: 1,
          complexity_level: 2,
          estimated_hours: 4,
          prerequisites: ['4B-seres-vivos'],
          is_transversal: false,
          ministerial_priority: 'high',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          grade_levels: { grade_code: '5B', grade_name: '5° Básico', level_type: 'BASICA' },
          subjects: { subject_id: 'subj-003', subject_code: 'CN', subject_name: 'Ciencias Naturales', subject_color: '#10B981' },
          coverage: { total_questions: 10, total_attempts: 30, unique_students: 16, average_score: 72.8, last_assessed: 1704412800 },
          statistics: { mastery_level: 'En desarrollo', trend: 'mejorando', recommended_focus: 'Microscopía y observación' }
        }
      ]

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        include_coverage: 'true',
        include_statistics: 'true'
      })

      // Add filters
      if (filters.grade !== 'ALL') params.append('grade', filters.grade)
      if (filters.subject !== 'ALL') params.append('subject', filters.subject)
      if (filters.bloom_level !== 'ALL') params.append('bloom_level', filters.bloom_level)
      if (filters.priority !== 'ALL') params.append('priority', filters.priority)
      if (filters.search) params.append('search', filters.search)

      try {
        const response = await fetch(`/api/curriculum/oa?${params}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        const data = await response.json()
      
        if (data.success) {
          setObjectives(data.data)
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total,
            total_pages: data.pagination.total_pages
          }))
        } else {
          throw new Error(data.error || 'Failed to load objectives')
        }

      } catch (apiError) {
        console.log('API not available, using mock objectives for development')
        // Use mock data when API is not available
        let filteredObjectives = mockObjectives

        // Apply filters to mock data
        if (filters.grade !== 'ALL') {
          filteredObjectives = filteredObjectives.filter(oa => oa.grade_code === filters.grade)
        }
        if (filters.subject !== 'ALL') {
          filteredObjectives = filteredObjectives.filter(oa => oa.subject_id === filters.subject)
        }
        if (filters.bloom_level !== 'ALL') {
          filteredObjectives = filteredObjectives.filter(oa => oa.bloom_level === filters.bloom_level)
        }
        if (filters.priority !== 'ALL') {
          filteredObjectives = filteredObjectives.filter(oa => oa.ministerial_priority === filters.priority)
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredObjectives = filteredObjectives.filter(oa => 
            oa.oa_code.toLowerCase().includes(searchLower) ||
            oa.oa_desc.toLowerCase().includes(searchLower) ||
            (oa.oa_short_desc && oa.oa_short_desc.toLowerCase().includes(searchLower))
          )
        }

        setObjectives(filteredObjectives)
        setPagination(prev => ({
          ...prev,
          total: filteredObjectives.length,
          total_pages: Math.ceil(filteredObjectives.length / pagination.limit)
        }))
      }

    } catch (error) {
      console.error('Error loading objectives:', error)
      toast.error('Error al cargar objetivos de aprendizaje')
    }
  }

  const handleCreateOA = async (formData: any) => {
    try {
      setSaving(true)

      const response = await fetch('/api/curriculum/oa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Objetivo de aprendizaje creado correctamente')
        setShowCreateModal(false)
        loadObjectives()
      } else {
        toast.error(data.error || 'Error al crear objetivo de aprendizaje')
      }

    } catch (error) {
      console.error('Error creating OA:', error)
      toast.error('Error al crear objetivo de aprendizaje')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateOA = async (formData: any) => {
    if (!selectedOA) return

    try {
      setSaving(true)

      const response = await fetch(`/api/curriculum/oa/${selectedOA.oa_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Objetivo de aprendizaje actualizado correctamente')
        setShowEditModal(false)
        setSelectedOA(null)
        loadObjectives()
      } else {
        toast.error(data.error || 'Error al actualizar objetivo de aprendizaje')
      }

    } catch (error) {
      console.error('Error updating OA:', error)
      toast.error('Error al actualizar objetivo de aprendizaje')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteOA = async (oaId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este OA? Esta acción marcará el OA como obsoleto.')) {
      return
    }

    try {
      const response = await fetch(`/api/curriculum/oa/${oaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Objetivo de aprendizaje eliminado correctamente')
        loadObjectives()
      } else {
        toast.error(data.error || 'Error al eliminar objetivo de aprendizaje')
      }

    } catch (error) {
      console.error('Error deleting OA:', error)
      toast.error('Error al eliminar objetivo de aprendizaje')
    }
  }

  const handleGenerateCoverageReport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const params = new URLSearchParams({
        grade_code: filters.grade,
        subject_id: filters.subject,
        week_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        week_end: new Date().toISOString().split('T')[0],
        format
      })

      const response = await fetch(`/api/curriculum/coverage-report?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (format === 'json') {
        const data = await response.json()
        if (data.success) {
          setShowCoverageReport(true)
          // You could show the report data in a modal here
        }
      } else {
        // Handle file download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `oa-coverage-report.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success(`Reporte descargado en formato ${format.toUpperCase()}`)
      }

    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Error al generar reporte de cobertura')
    }
  }

  const getStatusColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBloomColor = (level: string) => {
    const bloom = bloomLevels.find(b => b.level === level)
    return bloom?.color || '#6B7280'
  }

  const getCoverageIcon = (coverage?: LearningObjective['coverage']) => {
    if (!coverage || coverage.total_attempts === 0) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
    }
    
    if (coverage.average_score >= 80) {
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />
    }
    
    return <ClockIcon className="h-4 w-4 text-yellow-500" />
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de Objetivos de Aprendizaje
            </h1>
            <p className="text-gray-600 mt-1">
              Administra el catálogo MINEDUC de OAs y monitorea cobertura curricular
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {user?.role === 'ADMIN_ESCOLAR' && (
              <>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Crear OA
                </Button>
                
                <Button
                  onClick={() => handleGenerateCoverageReport('pdf')}
                  leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
                  variant="outline"
                >
                  Reporte PDF
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total OAs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {pagination.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Con Evaluaciones
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {objectives.filter(oa => oa.coverage && oa.coverage.total_attempts > 0).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Alta Prioridad
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {objectives.filter(oa => oa.ministerial_priority === 'high').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Promedio General
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {objectives.length > 0 
                      ? Math.round(objectives.reduce((sum, oa) => sum + (oa.coverage?.average_score || 0), 0) / objectives.length)
                      : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<FunnelIcon className="h-4 w-4" />}
                variant="outline"
                size="sm"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por código o descripción..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grado
                  </label>
                  <select
                    value={filters.grade}
                    onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="ALL">Todos los grados</option>
                    {grades.map(grade => (
                      <option key={grade.grade_code} value={grade.grade_code}>
                        {grade.grade_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asignatura
                  </label>
                  <select
                    value={filters.subject}
                    onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="ALL">Todas las asignaturas</option>
                    {subjects.map(subject => (
                      <option key={subject.subject_id} value={subject.subject_id}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bloom Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel Bloom
                  </label>
                  <select
                    value={filters.bloom_level}
                    onChange={(e) => setFilters(prev => ({ ...prev, bloom_level: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="ALL">Todos los niveles</option>
                    {bloomLevels.map(level => (
                      <option key={level.level} value={level.level}>
                        {level.level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setFilters({
                      grade: 'ALL',
                      subject: 'ALL',
                      bloom_level: 'ALL',
                      priority: 'ALL',
                      search: ''
                    })
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  variant="outline"
                  size="sm"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* OA Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Objetivos de Aprendizaje ({objectives.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código OA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignatura/Grado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bloom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cobertura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {objectives.map((oa) => (
                  <tr key={oa.oa_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCoverageIcon(oa.coverage)}
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {oa.oa_code}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {oa.oa_desc}
                      </div>
                      {oa.oa_short_desc && (
                        <div className="text-xs text-gray-500 mt-1">
                          {oa.oa_short_desc}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {oa.subjects?.subject_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {oa.grade_levels?.grade_name}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: getBloomColor(oa.bloom_level) }}
                      >
                        {oa.bloom_level}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(oa.ministerial_priority)}`}>
                        {oa.ministerial_priority === 'high' ? 'Alta' : 
                         oa.ministerial_priority === 'normal' ? 'Normal' : 'Baja'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {oa.coverage ? (
                        <div>
                          <div>{oa.coverage.total_attempts} evaluaciones</div>
                          <div className="text-xs text-gray-500">
                            {oa.coverage.unique_students} estudiantes
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin datos</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {oa.coverage && oa.coverage.total_attempts > 0 ? (
                        <span className={`font-medium ${
                          oa.coverage.average_score >= 80 ? 'text-green-600' :
                          oa.coverage.average_score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {Math.round(oa.coverage.average_score)}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {user?.role === 'ADMIN_ESCOLAR' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedOA(oa)
                                setShowEditModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteOA(oa.oa_id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  variant="outline"
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.total_pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.total_pages}
                  variant="outline"
                >
                  Siguiente
                </Button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">
                      {((pagination.page - 1) * pagination.limit) + 1}
                    </span>{' '}
                    a{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium">{pagination.total}</span>{' '}
                    resultados
                  </p>
                </div>
                
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Pagination buttons */}
                    {[...Array(Math.min(pagination.total_pages, 5))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <OAFormModal
            isOpen={showCreateModal || showEditModal}
            onClose={() => {
              setShowCreateModal(false)
              setShowEditModal(false)
              setSelectedOA(null)
            }}
            onSave={showCreateModal ? handleCreateOA : handleUpdateOA}
            initialData={selectedOA}
            subjects={subjects}
            grades={grades}
            bloomLevels={bloomLevels}
            saving={saving}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

// ===============================================
// OA FORM MODAL COMPONENT
// ===============================================

interface OAFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: LearningObjective | null
  subjects: Subject[]
  grades: GradeLevel[]
  bloomLevels: BloomLevel[]
  saving: boolean
}

function OAFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  subjects, 
  grades, 
  bloomLevels, 
  saving 
}: OAFormModalProps) {
  const [formData, setFormData] = useState({
    oa_code: '',
    oa_desc: '',
    oa_short_desc: '',
    grade_code: '',
    subject_id: '',
    bloom_level: '',
    semester: 1,
    complexity_level: 3,
    estimated_hours: 4,
    prerequisites: [] as string[],
    is_transversal: false,
    ministerial_priority: 'normal'
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        oa_code: initialData.oa_code || '',
        oa_desc: initialData.oa_desc || '',
        oa_short_desc: initialData.oa_short_desc || '',
        grade_code: initialData.grade_code || '',
        subject_id: initialData.subject_id || '',
        bloom_level: initialData.bloom_level || '',
        semester: initialData.semester || 1,
        complexity_level: initialData.complexity_level || 3,
        estimated_hours: initialData.estimated_hours || 4,
        prerequisites: initialData.prerequisites || [],
        is_transversal: initialData.is_transversal || false,
        ministerial_priority: initialData.ministerial_priority || 'normal'
      })
    } else {
      setFormData({
        oa_code: '',
        oa_desc: '',
        oa_short_desc: '',
        grade_code: '',
        subject_id: '',
        bloom_level: '',
        semester: 1,
        complexity_level: 3,
        estimated_hours: 4,
        prerequisites: [],
        is_transversal: false,
        ministerial_priority: 'normal'
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {initialData ? 'Editar Objetivo de Aprendizaje' : 'Crear Nuevo Objetivo de Aprendizaje'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Código OA */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código OA *
                  </label>
                  <input
                    type="text"
                    value={formData.oa_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, oa_code: e.target.value }))}
                    placeholder="Ej: MAT-8B-OA01"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Grado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grado *
                  </label>
                  <select
                    value={formData.grade_code}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade_code: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar grado</option>
                    {grades.map(grade => (
                      <option key={grade.grade_code} value={grade.grade_code}>
                        {grade.grade_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Asignatura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignatura *
                  </label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject_id: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar asignatura</option>
                    {subjects.map(subject => (
                      <option key={subject.subject_id} value={subject.subject_id}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nivel Bloom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel Bloom *
                  </label>
                  <select
                    value={formData.bloom_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, bloom_level: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar nivel</option>
                    {bloomLevels.map(level => (
                      <option key={level.level} value={level.level}>
                        {level.level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad Ministerial
                  </label>
                  <select
                    value={formData.ministerial_priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, ministerial_priority: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="low">Baja</option>
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del OA *
                  </label>
                  <textarea
                    value={formData.oa_desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, oa_desc: e.target.value }))}
                    rows={3}
                    placeholder="Descripción detallada del objetivo de aprendizaje..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Descripción Corta */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Corta
                  </label>
                  <input
                    type="text"
                    value={formData.oa_short_desc}
                    onChange={(e) => setFormData(prev => ({ ...prev, oa_short_desc: e.target.value }))}
                    placeholder="Resumen breve del OA..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Semestre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semestre
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={1}>Primer Semestre</option>
                    <option value={2}>Segundo Semestre</option>
                  </select>
                </div>

                {/* Horas Estimadas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horas Estimadas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Transversal */}
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_transversal}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_transversal: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Objetivo Transversal (aplica a múltiples asignaturas)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto sm:ml-3"
              >
                {saving ? 'Guardando...' : (initialData ? 'Actualizar OA' : 'Crear OA')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 