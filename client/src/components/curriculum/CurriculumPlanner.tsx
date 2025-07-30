'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CalendarDaysIcon,
  AcademicCapIcon,
  MapIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  PauseIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  SparklesIcon,
  BookOpenIcon,
  UserGroupIcon,
  BoltIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import { OASelector } from './OASelector'
import toast from 'react-hot-toast'

// ===============================================
// INTERFACES & TYPES
// ===============================================

interface Unit {
  unit_id: string
  unit_number: number
  unit_title: string
  unit_description: string
  estimated_classes: number
  semester: 1 | 2
  start_week: number
  end_week: number
  oa_ids: string[]
  dependencies: string[]
  assessment_strategy: string
  key_activities: string[]
  status: 'draft' | 'planned' | 'in_progress' | 'completed' | 'delayed'
  ai_generated: boolean
  coverage_percentage: number
  bloom_distribution: BloomDistribution
}

interface BloomDistribution {
  recordar: number
  comprender: number
  aplicar: number
  analizar: number
  evaluar: number
  crear: number
}

interface LearningObjective {
  oa_id: string
  oa_code: string
  oa_desc: string
  oa_short_desc?: string
  bloom_level: string
  complexity_level: number
  estimated_hours: number
  ministerial_priority: 'high' | 'normal' | 'low'
  is_transversal: boolean
  prerequisites: string[]
  semester?: number
  subjects?: { subject_name: string; subject_code: string }
  grade_levels?: { grade_name: string }
}

interface ScopeSequence {
  scope_id: string
  school_id: string
  grade_code: string
  subject_id: string
  year: number
  total_weeks: number
  units: Unit[]
  oa_coverage: { [key: string]: number }
  bloom_progression: BloomDistribution[]
  cross_curricular_connections: CrossCurricularConnection[]
  ai_recommendations: AIRecommendation[]
  status: 'draft' | 'approved' | 'published' | 'archived'
  created_by: string
  approved_by?: string
  created_at: string
  updated_at: string
}

interface CrossCurricularConnection {
  connection_id: string
  primary_oa_id: string
  connected_oa_id: string
  connection_type: 'prerequisite' | 'reinforcement' | 'application' | 'integration'
  strength: 'weak' | 'medium' | 'strong'
  suggested_activities: string[]
}

interface AIRecommendation {
  recommendation_id: string
  type: 'sequence_optimization' | 'time_allocation' | 'bloom_balance' | 'cross_curricular' | 'assessment_strategy'
  priority: 'low' | 'medium' | 'high'
  title: string
  description: string
  rationale: string
  implementation_effort: 'low' | 'medium' | 'high'
  expected_impact: 'low' | 'medium' | 'high'
  accepted: boolean
}

interface CurriculumPlannerProps {
  classId: string
  gradeCode: string
  subjectId: string
  year?: number
  onClose: () => void
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function CurriculumPlanner({
  classId,
  gradeCode,
  subjectId,
  year = new Date().getFullYear(),
  onClose
}: CurriculumPlannerProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Data State
  const [scopeSequence, setScopeSequence] = useState<ScopeSequence | null>(null)
  const [availableOAs, setAvailableOAs] = useState<LearningObjective[]>([])
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [previousYearData, setPreviousYearData] = useState<ScopeSequence[]>([])

  // Form State
  const [unitForm, setUnitForm] = useState({
    unit_title: '',
    unit_description: '',
    estimated_classes: 8,
    semester: 1 as 1 | 2,
    oa_ids: [] as string[],
    assessment_strategy: '',
    key_activities: [] as string[]
  })

  // Filter & View State
  const [viewMode, setViewMode] = useState<'timeline' | 'units' | 'analytics'>('timeline')
  const [filterSemester, setFilterSemester] = useState<1 | 2 | 'all'>('all')
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set())

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: MapIcon },
    { id: 'units', label: 'Planificación por Unidades', icon: BookOpenIcon },
    { id: 'sequence', label: 'Secuencia & Tiempo', icon: ClockIcon },
    { id: 'analytics', label: 'Cobertura & Analítica', icon: ChartBarIcon },
    { id: 'connections', label: 'Conexiones Transversales', icon: UserGroupIcon },
    { id: 'ai_assist', label: 'Asistente IA', icon: SparklesIcon }
  ]

  // ===============================================
  // LIFECYCLE & DATA LOADING
  // ===============================================

  useEffect(() => {
    loadInitialData()
  }, [gradeCode, subjectId, year])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadScopeSequence(),
        loadAvailableOAs(),
        loadPreviousYearData()
      ])
    } catch (error) {
      console.error('Failed to load initial data:', error)
      toast.error('Error al cargar datos del planificador')
    } finally {
      setLoading(false)
    }
  }

  const loadScopeSequence = async () => {
    try {
      const response = await fetch(
        `/api/curriculum/scope-sequence?grade=${gradeCode}&subject=${subjectId}&year=${year}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      )
      const data = await response.json()
      
      if (data.success && data.data) {
        setScopeSequence(data.data)
      } else {
        // Create new scope sequence
        setScopeSequence(createEmptyScopeSequence())
      }
    } catch (error) {
      console.error('Failed to load scope sequence:', error)
      setScopeSequence(createEmptyScopeSequence())
    }
  }

  const loadAvailableOAs = async () => {
    try {
      const response = await fetch(
        `/api/curriculum/oa?grade=${gradeCode}&subject=${subjectId}`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      )
      const data = await response.json()
      
      if (data.success) {
        setAvailableOAs(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load OAs:', error)
    }
  }

  const loadPreviousYearData = async () => {
    try {
      const response = await fetch(
        `/api/curriculum/scope-sequence/history?grade=${gradeCode}&subject=${subjectId}&years=3`,
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }
      )
      const data = await response.json()
      
      if (data.success) {
        setPreviousYearData(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load previous year data:', error)
    }
  }

  const createEmptyScopeSequence = (): ScopeSequence => ({
    scope_id: '',
    school_id: '',
    grade_code: gradeCode,
    subject_id: subjectId,
    year: year,
    total_weeks: 40,
    units: [],
    oa_coverage: {},
    bloom_progression: [],
    cross_curricular_connections: [],
    ai_recommendations: [],
    status: 'draft',
    created_by: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })

  // ===============================================
  // AI GENERATION FUNCTIONS
  // ===============================================

  const generateWithAI = async (type: 'full_curriculum' | 'optimize_sequence' | 'balance_bloom' | 'suggest_connections') => {
    setGenerating(true)
    
    try {
      const response = await fetch('/api/ai/curriculum/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type,
          grade_code: gradeCode,
          subject_id: subjectId,
          year: year,
          available_oas: availableOAs.map(oa => oa.oa_id),
          current_scope: scopeSequence,
          constraints: {
            total_weeks: 40,
            classes_per_week: 4,
            semester_break_week: 20
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        switch (type) {
          case 'full_curriculum':
            setScopeSequence(data.data.scope_sequence)
            toast.success('✨ Currículo generado exitosamente con IA')
            break
          case 'optimize_sequence':
            updateScopeSequence(data.data.optimized_sequence)
            toast.success('🔄 Secuencia optimizada con IA')
            break
          case 'balance_bloom':
            updateBloomDistribution(data.data.balanced_distribution)
            toast.success('⚖️ Distribución Bloom balanceada')
            break
          case 'suggest_connections':
            addCrossCurricularConnections(data.data.connections)
            toast.success('🔗 Conexiones transversales sugeridas')
            break
        }
      } else {
        throw new Error(data.error?.message || 'AI generation failed')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      toast.error('Error en la generación con IA')
    } finally {
      setGenerating(false)
    }
  }

  // ===============================================
  // CRUD OPERATIONS
  // ===============================================

  const saveUnit = async (unit: Partial<Unit>) => {
    if (!scopeSequence) return

    const newUnit: Unit = {
      unit_id: unit.unit_id || `unit_${Date.now()}`,
      unit_number: unit.unit_number || scopeSequence.units.length + 1,
      unit_title: unit.unit_title || '',
      unit_description: unit.unit_description || '',
      estimated_classes: unit.estimated_classes || 8,
      semester: unit.semester || 1,
      start_week: unit.start_week || 1,
      end_week: unit.end_week || 8,
      oa_ids: unit.oa_ids || [],
      dependencies: unit.dependencies || [],
      assessment_strategy: unit.assessment_strategy || '',
      key_activities: unit.key_activities || [],
      status: unit.status || 'draft',
      ai_generated: unit.ai_generated || false,
      coverage_percentage: calculateUnitCoverage(unit.oa_ids || []),
      bloom_distribution: calculateBloomDistribution(unit.oa_ids || [])
    }

    const updatedUnits = unit.unit_id 
      ? scopeSequence.units.map(u => u.unit_id === unit.unit_id ? newUnit : u)
      : [...scopeSequence.units, newUnit]

    const updatedScope: ScopeSequence = {
      ...scopeSequence,
      units: updatedUnits,
      updated_at: new Date().toISOString()
    }

    setScopeSequence(updatedScope)
    toast.success(`Unidad ${unit.unit_id ? 'actualizada' : 'creada'} exitosamente`)
  }

  const deleteUnit = async (unitId: string) => {
    if (!scopeSequence) return

    const updatedUnits = scopeSequence.units.filter(u => u.unit_id !== unitId)
    
    setScopeSequence({
      ...scopeSequence,
      units: updatedUnits,
      updated_at: new Date().toISOString()
    })
    
    toast.success('Unidad eliminada exitosamente')
  }

  const saveScopeSequence = async () => {
    if (!scopeSequence) return

    setSaving(true)
    
    try {
      const response = await fetch('/api/curriculum/scope-sequence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(scopeSequence)
      })

      const data = await response.json()

      if (data.success) {
        setScopeSequence(data.data)
        toast.success('Planificación curricular guardada exitosamente')
      } else {
        throw new Error(data.error?.message || 'Save failed')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Error al guardar la planificación')
    } finally {
      setSaving(false)
    }
  }

  // ===============================================
  // CALCULATION HELPERS
  // ===============================================

  const calculateUnitCoverage = (oaIds: string[]): number => {
    if (oaIds.length === 0) return 0
    const totalOAs = availableOAs.length
    return totalOAs > 0 ? Math.round((oaIds.length / totalOAs) * 100) : 0
  }

  const calculateBloomDistribution = (oaIds: string[]): BloomDistribution => {
    const selectedOAs = availableOAs.filter(oa => oaIds.includes(oa.oa_id))
    const total = selectedOAs.length
    
    if (total === 0) {
      return { recordar: 0, comprender: 0, aplicar: 0, analizar: 0, evaluar: 0, crear: 0 }
    }

    const distribution = selectedOAs.reduce((acc, oa) => {
      const level = oa.bloom_level.toLowerCase()
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {} as any)

    return {
      recordar: Math.round((distribution.recordar || 0) / total * 100),
      comprender: Math.round((distribution.comprender || 0) / total * 100),
      aplicar: Math.round((distribution.aplicar || 0) / total * 100),
      analizar: Math.round((distribution.analizar || 0) / total * 100),
      evaluar: Math.round((distribution.evaluar || 0) / total * 100),
      crear: Math.round((distribution.crear || 0) / total * 100)
    }
  }

  const updateScopeSequence = (updates: Partial<ScopeSequence>) => {
    if (!scopeSequence) return
    setScopeSequence({ ...scopeSequence, ...updates })
  }

  const updateBloomDistribution = (distribution: BloomDistribution[]) => {
    if (!scopeSequence) return
    setScopeSequence({ ...scopeSequence, bloom_progression: distribution })
  }

  const addCrossCurricularConnections = (connections: CrossCurricularConnection[]) => {
    if (!scopeSequence) return
    setScopeSequence({
      ...scopeSequence,
      cross_curricular_connections: [...scopeSequence.cross_curricular_connections, ...connections]
    })
  }

  // ===============================================
  // IMPORT/EXPORT FUNCTIONS
  // ===============================================

  const importFromPreviousYear = async (sourceYear: number) => {
    try {
      const response = await fetch('/api/curriculum/scope-sequence/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          source_year: sourceYear,
          target_year: year,
          grade_code: gradeCode,
          subject_id: subjectId,
          import_options: {
            units: true,
            sequence: true,
            activities: true,
            assessments: false // Don't import specific assessments
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setScopeSequence(data.data.imported_scope)
        toast.success(`Planificación importada desde ${sourceYear}`)
        setShowImportDialog(false)
      } else {
        throw new Error(data.error?.message || 'Import failed')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Error al importar planificación anterior')
    }
  }

  const exportToCSV = () => {
    if (!scopeSequence) return

    const csvData = [
      ['Unidad', 'Título', 'Semestre', 'Semanas', 'Clases', 'OAs', 'Estado', 'Cobertura %'],
      ...scopeSequence.units.map(unit => [
        unit.unit_number.toString(),
        unit.unit_title,
        unit.semester.toString(),
        `${unit.start_week}-${unit.end_week}`,
        unit.estimated_classes.toString(),
        unit.oa_ids.length.toString(),
        unit.status,
        unit.coverage_percentage.toString()
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `planificacion_curricular_${gradeCode}_${year}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    toast.success('Planificación exportada a CSV')
  }

  // ===============================================
  // RENDER FUNCTIONS
  // ===============================================

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <BookOpenIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Total Unidades</p>
              <p className="text-2xl font-bold text-blue-900">{scopeSequence?.units.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">OAs Cubiertos</p>
              <p className="text-2xl font-bold text-green-900">
                {scopeSequence ? Object.keys(scopeSequence.oa_coverage).length : 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-900">Semanas Total</p>
              <p className="text-2xl font-bold text-yellow-900">{scopeSequence?.total_weeks || 40}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">IA Sugerencias</p>
              <p className="text-2xl font-bold text-purple-900">
                {scopeSequence?.ai_recommendations.filter(r => !r.accepted).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => setShowAIDialog(true)}
            disabled={generating}
          >
            <SparklesIcon className="h-6 w-6" />
            <span className="text-sm">Generar con IA</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => setShowImportDialog(true)}
          >
            <DocumentTextIcon className="h-6 w-6" />
            <span className="text-sm">Importar Anterior</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={exportToCSV}
          >
            <ClipboardDocumentListIcon className="h-6 w-6" />
            <span className="text-sm">Exportar CSV</span>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center space-y-2"
            onClick={() => setActiveTab('analytics')}
          >
            <ChartBarIcon className="h-6 w-6" />
            <span className="text-sm">Ver Analítica</span>
          </Button>
        </div>
      </div>

      {/* Unit Timeline */}
      {scopeSequence && scopeSequence.units.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cronograma de Unidades</h3>
          <div className="space-y-4">
            {scopeSequence.units.map((unit, index) => (
              <div key={unit.unit_id} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-900">U{unit.unit_number}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{unit.unit_title}</h4>
                  <p className="text-xs text-gray-500">
                    Semana {unit.start_week}-{unit.end_week} • {unit.estimated_classes} clases • Semestre {unit.semester}
                  </p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${unit.coverage_percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    unit.status === 'completed' ? 'bg-green-100 text-green-800' :
                    unit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    unit.status === 'delayed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {unit.status === 'completed' ? 'Completado' :
                     unit.status === 'in_progress' ? 'En Progreso' :
                     unit.status === 'delayed' ? 'Retrasado' :
                     'Planificado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium text-gray-900">Cargando Planificador...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Planificador Curricular - {gradeCode}
              </h2>
              <p className="text-sm text-gray-600">
                Año {year} • {availableOAs.length} OAs disponibles
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {scopeSequence && (
                <Button
                  onClick={saveScopeSequence}
                  disabled={saving}
                  size="sm"
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <DocumentCheckIcon className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={onClose} size="sm">
                Cerrar
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-4">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverviewTab()}
              {/* Other tabs would be implemented here */}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* AI Generation Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Asistente IA Curricular</h3>
            <div className="space-y-4">
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => generateWithAI('full_curriculum')}
                disabled={generating}
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generar Currículo Completo
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => generateWithAI('optimize_sequence')}
                disabled={generating}
              >
                <BoltIcon className="h-4 w-4 mr-2" />
                Optimizar Secuencia
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => generateWithAI('balance_bloom')}
                disabled={generating}
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Balancear Niveles Bloom
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => generateWithAI('suggest_connections')}
                disabled={generating}
              >
                <UserGroupIcon className="h-4 w-4 mr-2" />
                Sugerir Conexiones Transversales
              </Button>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAIDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Importar Planificación Anterior</h3>
            <div className="space-y-4">
              {previousYearData.map((yearData) => (
                <div key={yearData.year} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Año {yearData.year}</h4>
                      <p className="text-sm text-gray-600">
                        {yearData.units.length} unidades • {Object.keys(yearData.oa_coverage).length} OAs
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => importFromPreviousYear(yearData.year)}
                    >
                      Importar
                    </Button>
                  </div>
                </div>
              ))}
              {previousYearData.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay planificaciones anteriores disponibles
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 