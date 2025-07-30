'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  ChatBubbleLeftRightIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

// ===============================================
// INTERFACES & TYPES
// ===============================================

interface LessonPlanWizardData {
  // Basic Information
  basic_info: {
    lesson_title: string
    subject_id: string
    grade_code: string
    class_id: string
    lesson_date: string
    duration_minutes: number
    lesson_type: 'new_content' | 'reinforcement' | 'evaluation' | 'review'
    teaching_modality: 'presencial' | 'remote' | 'hybrid'
  }
  
  // Learning Objectives & OAs
  learning_objectives: {
    selected_oas: LearningObjective[]
    custom_objectives: string[]
    bloom_distribution: BloomDistribution
    difficulty_level: 'basic' | 'intermediate' | 'advanced'
    interdisciplinary_connections: string[]
  }
  
  // Student Context
  student_context: {
    class_size: number
    student_level: 'below_grade' | 'at_grade' | 'above_grade'
    special_needs_count: number
    learning_styles: {
      visual: number
      auditory: number
      kinesthetic: number
      reading_writing: number
    }
    prior_knowledge_assessment: 'low' | 'medium' | 'high'
    engagement_level: 'low' | 'medium' | 'high'
  }
  
  // AI-Generated Structure
  lesson_structure: {
    inicio: LessonActivity
    desarrollo: LessonActivity[]
    cierre: LessonActivity
    evaluation_strategy: EvaluationStrategy
  }
  
  // Differentiation & Adaptations
  differentiation: {
    strategies: DifferentiationStrategy[]
    materials_adaptations: MaterialAdaptation[]
    assessment_adaptations: AssessmentAdaptation[]
    technology_integration: TechnologyIntegration[]
  }
  
  // Resources & Materials
  resources: {
    required_materials: MaterialResource[]
    digital_resources: DigitalResource[]
    suggested_readings: ReadingResource[]
    extension_activities: ExtensionActivity[]
  }
  
  // Quality Assurance
  quality_metrics: {
    oa_alignment_score: number
    bloom_balance_score: number
    engagement_score: number
    differentiation_score: number
    time_allocation_score: number
    overall_quality_score: number
    improvement_suggestions: QualityRecommendation[]
  }
}

interface LearningObjective {
  oa_id: string
  oa_code: string
  oa_description: string
  bloom_level: BloomLevel
  complexity_score: number
  time_estimate_minutes: number
  subject_area: string
  transversal_skills: string[]
  prerequisites: string[]
}

interface LessonActivity {
  activity_id: string
  title: string
  description: string
  duration_minutes: number
  activity_type: ActivityType
  bloom_levels: BloomLevel[]
  learning_styles: LearningStyle[]
  materials_needed: string[]
  instructions: ActivityInstruction[]
  assessment_moments: AssessmentMoment[]
  differentiation_notes: string
  technology_used: string[]
}

interface EvaluationStrategy {
  type: 'formative' | 'summative' | 'diagnostic' | 'peer_assessment' | 'self_assessment'
  methods: string[]
  criteria: EvaluationCriteria[]
  instruments: string[]
  timing: 'beginning' | 'during' | 'end' | 'continuous'
  bloom_levels_assessed: BloomLevel[]
}

interface DifferentiationStrategy {
  strategy_id: string
  strategy_name: string
  target_group: 'low_achievers' | 'average_achievers' | 'high_achievers' | 'special_needs' | 'all'
  implementation_notes: string
  resource_requirements: string[]
  effectiveness_rating: number
}

interface MaterialAdaptation {
  adaptation_id: string
  material_type: string
  original_material: string
  adapted_version: string
  target_group: string
  adaptation_notes: string
}

interface AssessmentAdaptation {
  adaptation_id: string
  assessment_type: string
  original_method: string
  adapted_method: string
  target_group: string
  support_needed: string[]
}

interface TechnologyIntegration {
  tool_id: string
  tool_name: string
  purpose: string
  integration_level: 'basic' | 'intermediate' | 'advanced'
  technical_requirements: string[]
  accessibility_features: string[]
}

interface MaterialResource {
  resource_id: string
  name: string
  type: 'physical' | 'digital' | 'printable'
  description: string
  required: boolean
  alternatives: string[]
}

interface DigitalResource {
  resource_id: string
  name: string
  url: string
  type: 'video' | 'interactive' | 'document' | 'simulation'
  access_requirements: string[]
  duration_minutes?: number
}

interface ReadingResource {
  resource_id: string
  title: string
  author: string
  type: 'book' | 'article' | 'webpage' | 'academic_paper'
  reading_level: string
  estimated_time_minutes: number
}

interface ExtensionActivity {
  activity_id: string
  title: string
  description: string
  target_group: 'advanced_students' | 'early_finishers' | 'enrichment'
  estimated_time: number
  materials_needed: string[]
}

interface EvaluationCriteria {
  criteria_id: string
  name: string
  description: string
  performance_levels: string[]
  weight_percentage: number
}

interface ActivityInstruction {
  step_number: number
  instruction: string
  timing_minutes: number
  materials_used: string[]
  interaction_type: 'individual' | 'pairs' | 'groups' | 'whole_class'
}

interface AssessmentMoment {
  moment_id: string
  timing: string
  method: string
  purpose: string
  feedback_type: 'immediate' | 'delayed' | 'peer' | 'self'
}

interface QualityRecommendation {
  category: 'time_management' | 'bloom_balance' | 'engagement' | 'differentiation' | 'assessment'
  priority: 'low' | 'medium' | 'high'
  suggestion: string
  implementation_effort: 'easy' | 'moderate' | 'complex'
  expected_impact: 'low' | 'medium' | 'high'
}

type BloomLevel = 'recordar' | 'comprender' | 'aplicar' | 'analizar' | 'evaluar' | 'crear'
type ActivityType = 'exposition' | 'discussion' | 'exercise' | 'experiment' | 'presentation' | 'game' | 'reflection'
type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing'

interface BloomDistribution {
  recordar: number
  comprender: number
  aplicar: number
  analizar: number
  evaluar: number
  crear: number
}

interface LessonPlanWizardProps {
  classId: string
  className: string
  gradeCode: string
  subjectId: string
  onComplete: (lessonPlan: LessonPlanWizardData) => void
  onClose: () => void
}

// ===============================================
// WIZARD STEPS CONFIGURATION
// ===============================================

const WIZARD_STEPS = [
  {
    id: 'basic_info',
    title: 'Información Básica',
    description: 'Configuración inicial de la clase',
    icon: BookOpenIcon,
    estimatedTime: 2
  },
  {
    id: 'objectives',
    title: 'Objetivos de Aprendizaje',
    description: 'Selección y configuración de OAs',
    icon: AcademicCapIcon,
    estimatedTime: 3
  },
  {
    id: 'student_context',
    title: 'Contexto del Curso',
    description: 'Información sobre los estudiantes',
    icon: UserGroupIcon,
    estimatedTime: 2
  },
  {
    id: 'ai_generation',
    title: 'Generación IA',
    description: 'Creación automática de la estructura',
    icon: SparklesIcon,
    estimatedTime: 1
  },
  {
    id: 'structure_review',
    title: 'Revisión de Estructura',
    description: 'Validación y ajustes de las actividades',
    icon: CheckCircleIcon,
    estimatedTime: 4
  },
  {
    id: 'differentiation',
    title: 'Diferenciación',
    description: 'Estrategias de adaptación',
    icon: AdjustmentsHorizontalIcon,
    estimatedTime: 3
  },
  {
    id: 'quality_review',
    title: 'Revisión Final',
    description: 'Validación de calidad y finalización',
    icon: ChartBarIcon,
    estimatedTime: 2
  }
]

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function LessonPlanWizard({
  classId,
  className,
  gradeCode,
  subjectId,
  onComplete,
  onClose
}: LessonPlanWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [wizardData, setWizardData] = useState<LessonPlanWizardData>(createInitialData())
  
  // Available data
  const [availableOAs, setAvailableOAs] = useState<LearningObjective[]>([])
  const [studentContextData, setStudentContextData] = useState<any>(null)
  
  // UI State
  const [showPreview, setShowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [generationProgress, setGenerationProgress] = useState(0)

  function createInitialData(): LessonPlanWizardData {
    return {
      basic_info: {
        lesson_title: '',
        subject_id: subjectId,
        grade_code: gradeCode,
        class_id: classId,
        lesson_date: new Date().toISOString().split('T')[0],
        duration_minutes: 90,
        lesson_type: 'new_content',
        teaching_modality: 'presencial'
      },
      learning_objectives: {
        selected_oas: [],
        custom_objectives: [],
        bloom_distribution: { recordar: 0, comprender: 0, aplicar: 0, analizar: 0, evaluar: 0, crear: 0 },
        difficulty_level: 'intermediate',
        interdisciplinary_connections: []
      },
      student_context: {
        class_size: 30,
        student_level: 'at_grade',
        special_needs_count: 0,
        learning_styles: { visual: 25, auditory: 25, kinesthetic: 25, reading_writing: 25 },
        prior_knowledge_assessment: 'medium',
        engagement_level: 'medium'
      },
      lesson_structure: {
        inicio: createEmptyActivity('inicio'),
        desarrollo: [],
        cierre: createEmptyActivity('cierre'),
        evaluation_strategy: createEmptyEvaluationStrategy()
      },
      differentiation: {
        strategies: [],
        materials_adaptations: [],
        assessment_adaptations: [],
        technology_integration: []
      },
      resources: {
        required_materials: [],
        digital_resources: [],
        suggested_readings: [],
        extension_activities: []
      },
      quality_metrics: {
        oa_alignment_score: 0,
        bloom_balance_score: 0,
        engagement_score: 0,
        differentiation_score: 0,
        time_allocation_score: 0,
        overall_quality_score: 0,
        improvement_suggestions: []
      }
    }
  }

  function createEmptyActivity(type: string): LessonActivity {
    return {
      activity_id: `activity_${Date.now()}`,
      title: '',
      description: '',
      duration_minutes: type === 'inicio' ? 15 : type === 'cierre' ? 10 : 30,
      activity_type: 'exposition',
      bloom_levels: [],
      learning_styles: [],
      materials_needed: [],
      instructions: [],
      assessment_moments: [],
      differentiation_notes: '',
      technology_used: []
    }
  }

  function createEmptyEvaluationStrategy(): EvaluationStrategy {
    return {
      type: 'formative',
      methods: [],
      criteria: [],
      instruments: [],
      timing: 'continuous',
      bloom_levels_assessed: []
    }
  }

  // ===============================================
  // LIFECYCLE & DATA LOADING
  // ===============================================

  useEffect(() => {
    loadInitialData()
  }, [gradeCode, subjectId])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadAvailableOAs(),
        loadStudentContext()
      ])
    } catch (error) {
      console.error('Failed to load initial data:', error)
      toast.error('Error al cargar datos iniciales')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailableOAs = async () => {
    try {
      const response = await fetch(`/api/curriculum/oa?grade=${gradeCode}&subject=${subjectId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setAvailableOAs(data.data || [])
      }
    } catch (error) {
      console.error('Failed to load OAs:', error)
    }
  }

  const loadStudentContext = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}/context`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      if (data.success) {
        setStudentContextData(data.data)
        // Update wizard data with real student context
        setWizardData(prev => ({
          ...prev,
          student_context: {
            ...prev.student_context,
            class_size: data.data.student_count || 30,
            special_needs_count: data.data.special_needs_count || 0,
            student_level: data.data.average_performance_level || 'at_grade'
          }
        }))
      }
    } catch (error) {
      console.error('Failed to load student context:', error)
    }
  }

  // ===============================================
  // AI GENERATION FUNCTIONS
  // ===============================================

  const generateLessonStructure = async () => {
    setGenerating(true)
    setGenerationProgress(0)
    
    try {
      // Simulate progressive generation steps
      const steps = [
        { progress: 20, message: 'Analizando objetivos de aprendizaje...' },
        { progress: 40, message: 'Generando actividades de inicio...' },
        { progress: 60, message: 'Creando actividades de desarrollo...' },
        { progress: 80, message: 'Diseñando cierre y evaluación...' },
        { progress: 90, message: 'Optimizando secuencia didáctica...' },
        { progress: 100, message: 'Finalizando planificación...' }
      ]

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setGenerationProgress(step.progress)
        toast.loading(step.message, { id: 'generation-progress' })
      }

      const response = await fetch('/api/ai/lesson-plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          basic_info: wizardData.basic_info,
          learning_objectives: wizardData.learning_objectives,
          student_context: wizardData.student_context,
          generation_preferences: {
            creativity_level: 'high',
            differentiation_focus: true,
            technology_integration: true,
            assessment_integration: true
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        setWizardData(prev => ({
          ...prev,
          lesson_structure: data.data.lesson_structure,
          differentiation: data.data.differentiation,
          resources: data.data.resources,
          quality_metrics: data.data.quality_metrics
        }))
        
        toast.dismiss('generation-progress')
        toast.success('¡Planificación generada exitosamente!')
      } else {
        throw new Error(data.error?.message || 'Generation failed')
      }
    } catch (error) {
      console.error('AI generation error:', error)
      toast.dismiss('generation-progress')
      toast.error('Error en la generación automática')
    } finally {
      setGenerating(false)
      setGenerationProgress(0)
    }
  }

  // ===============================================
  // P2-T-08: AI LESSON OUTLINE GENERATION
  // ===============================================

  const generateAILessonOutline = async () => {
    if (!wizardData.basic_info.lesson_title || wizardData.learning_objectives.selected_oas.length === 0) {
      toast.error('Por favor completa el título y selecciona al menos un objetivo de aprendizaje')
      return
    }

    setGenerating(true)
    setGenerationProgress(0)
    
    try {
      // P2-T-08: Progressive generation steps
      const steps = [
        { progress: 15, message: 'Conectando con IA Service...' },
        { progress: 30, message: 'Analizando objetivos de aprendizaje seleccionados...' },
        { progress: 50, message: 'Generando estructura de clase automática...' },
        { progress: 70, message: 'Creando actividades diferenciadas...' },
        { progress: 85, message: 'Integrando evaluación formativa...' },
        { progress: 95, message: 'Optimizando planificación P2-T-08...' },
        { progress: 100, message: 'Planificación IA completada' }
      ]

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 600))
        setGenerationProgress(step.progress)
        toast.loading(step.message, { id: 'ai-generation-progress' })
      }

      const response = await fetch('/api/ai/lesson-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          class_id: classId,
          lesson_topic: wizardData.basic_info.lesson_title,
          oa_codes: wizardData.learning_objectives.selected_oas,
          duration_minutes: wizardData.basic_info.duration_minutes,
          student_level: wizardData.student_context.student_level,
          special_requirements: [
            wizardData.student_context.special_needs_count > 0 ? 'NEE_support' : null,
            wizardData.student_context.prior_knowledge_assessment === 'low' ? 'basic_concepts_review' : null,
            wizardData.basic_info.teaching_modality === 'hybrid' ? 'hybrid_activities' : null
          ].filter(Boolean)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // P2-T-08: Apply AI-generated lesson structure
        const aiOutline = data.data.lesson_outline
        
        setWizardData(prev => ({
          ...prev,
          lesson_structure: {
            ...prev.lesson_structure,
            inicio: {
              ...prev.lesson_structure.inicio,
              title: aiOutline.inicio?.title || 'Motivación y Activación',
              description: aiOutline.inicio?.description || '',
              duration: aiOutline.inicio?.duration || 15,
              activities: aiOutline.inicio?.activities || [],
              resources: aiOutline.inicio?.resources || [],
              ai_generated: true
            },
            desarrollo: aiOutline.desarrollo?.map((activity: any, index: number) => ({
              id: `dev-${index + 1}`,
              title: activity.title,
              description: activity.description,
              duration: activity.duration,
              type: activity.type || 'content_delivery',
              bloom_level: activity.bloom_level || 'comprender',
              interaction_type: activity.interaction_type || 'whole_class',
              resources: activity.resources || [],
              assessment: activity.assessment || null,
              differentiation: activity.differentiation || [],
              ai_generated: true
            })) || prev.lesson_structure.desarrollo,
            cierre: {
              ...prev.lesson_structure.cierre,
              title: aiOutline.cierre?.title || 'Síntesis y Cierre',
              description: aiOutline.cierre?.description || '',
              duration: aiOutline.cierre?.duration || 15,
              activities: aiOutline.cierre?.activities || [],
              resources: aiOutline.cierre?.resources || [],
              ai_generated: true
            },
            evaluation_strategy: {
              ...prev.lesson_structure.evaluation_strategy,
              formative_assessment: aiOutline.evaluation?.formative || [],
              summative_assessment: aiOutline.evaluation?.summative || null,
              assessment_tools: aiOutline.evaluation?.tools || [],
              success_criteria: aiOutline.evaluation?.criteria || [],
              ai_generated: true
            }
          },
          quality_metrics: {
            ...prev.quality_metrics,
            oa_alignment_score: aiOutline.quality_metrics?.oa_alignment || 85,
            bloom_balance_score: aiOutline.quality_metrics?.bloom_balance || 80,
            engagement_score: aiOutline.quality_metrics?.engagement || 75,
            differentiation_score: aiOutline.quality_metrics?.differentiation || 70,
            time_allocation_score: aiOutline.quality_metrics?.time_allocation || 85,
            overall_quality_score: aiOutline.quality_metrics?.overall || 79,
            improvement_suggestions: aiOutline.quality_metrics?.suggestions || [],
            ai_generation_time: data.data.generation_time_ms,
            ai_cost_estimation: data.data.cost_estimation
          }
        }))

        toast.dismiss('ai-generation-progress')
        toast.success(`🤖 Planificación IA generada exitosamente - P2-T-08 (${data.data.generation_time_ms}ms)`)
        
        // Auto-advance to next step to review generated content
        setCurrentStep(3)
      } else {
        throw new Error(data.error || 'Error generating lesson outline')
      }
    } catch (error) {
      console.error('AI Generation error:', error)
      toast.dismiss('ai-generation-progress')
      toast.error('Error al generar planificación con IA')
    } finally {
      setGenerating(false)
      setGenerationProgress(0)
    }
  }

  // ===============================================
  // VALIDATION FUNCTIONS
  // ===============================================

  const validateCurrentStep = (): boolean => {
    const errors: string[] = []
    
    switch (currentStep) {
      case 0: // Basic Info
        if (!wizardData.basic_info.lesson_title.trim()) {
          errors.push('El título de la clase es obligatorio')
        }
        if (!wizardData.basic_info.lesson_date) {
          errors.push('La fecha de la clase es obligatoria')
        }
        if (wizardData.basic_info.duration_minutes < 30 || wizardData.basic_info.duration_minutes > 180) {
          errors.push('La duración debe estar entre 30 y 180 minutos')
        }
        break
        
      case 1: // Objectives
        if (wizardData.learning_objectives.selected_oas.length === 0) {
          errors.push('Debe seleccionar al menos un Objetivo de Aprendizaje')
        }
        break
        
      case 2: // Student Context
        if (wizardData.student_context.class_size < 1 || wizardData.student_context.class_size > 60) {
          errors.push('El tamaño de la clase debe estar entre 1 y 60 estudiantes')
        }
        break
        
      case 4: // Structure Review
        if (!wizardData.lesson_structure.inicio.title.trim()) {
          errors.push('La actividad de inicio debe tener un título')
        }
        if (wizardData.lesson_structure.desarrollo.length === 0) {
          errors.push('Debe incluir al menos una actividad de desarrollo')
        }
        if (!wizardData.lesson_structure.cierre.title.trim()) {
          errors.push('La actividad de cierre debe tener un título')
        }
        break
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  // ===============================================
  // NAVIGATION FUNCTIONS
  // ===============================================

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 2) {
        // Auto-generate after student context
        setCurrentStep(currentStep + 1)
        setTimeout(generateLessonStructure, 500)
      } else if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (validateCurrentStep()) {
      onComplete(wizardData)
    }
  }

  // ===============================================
  // RENDER STEP COMPONENTS
  // ===============================================

  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpenIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Información Básica</h3>
        <p className="text-gray-600">Configuremos los detalles fundamentales de tu clase</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la Clase *
          </label>
          <input
            type="text"
            value={wizardData.basic_info.lesson_title}
            onChange={(e) => setWizardData(prev => ({
              ...prev,
              basic_info: { ...prev.basic_info, lesson_title: e.target.value }
            }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ej: Introducción a las fracciones equivalentes"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de la Clase *
          </label>
          <input
            type="date"
            value={wizardData.basic_info.lesson_date}
            onChange={(e) => setWizardData(prev => ({
              ...prev,
              basic_info: { ...prev.basic_info, lesson_date: e.target.value }
            }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración (minutos) *
          </label>
          <select
            value={wizardData.basic_info.duration_minutes}
            onChange={(e) => setWizardData(prev => ({
              ...prev,
              basic_info: { ...prev.basic_info, duration_minutes: parseInt(e.target.value) }
            }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={45}>45 minutos</option>
            <option value={60}>60 minutos</option>
            <option value={90}>90 minutos (bloque)</option>
            <option value={120}>120 minutos</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Clase
          </label>
          <select
            value={wizardData.basic_info.lesson_type}
            onChange={(e) => setWizardData(prev => ({
              ...prev,
              basic_info: { ...prev.basic_info, lesson_type: e.target.value as any }
            }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="new_content">Contenido Nuevo</option>
            <option value="reinforcement">Reforzamiento</option>
            <option value="evaluation">Evaluación</option>
            <option value="review">Repaso</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modalidad de Enseñanza
          </label>
          <select
            value={wizardData.basic_info.teaching_modality}
            onChange={(e) => setWizardData(prev => ({
              ...prev,
              basic_info: { ...prev.basic_info, teaching_modality: e.target.value as any }
            }))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="presencial">Presencial</option>
            <option value="remote">Remoto</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>
      </div>
      
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Errores de validación</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderObjectivesStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Objetivos de Aprendizaje
        </h3>
        
        {/* P2-T-08: AI Generation Button */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={generateAILessonOutline}
            disabled={generating || wizardData.learning_objectives.selected_oas.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none hover:from-purple-700 hover:to-blue-700"
          >
            {generating ? (
              <div className="flex items-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 mr-2"
                >
                  <SparklesIcon className="h-4 w-4" />
                </motion.div>
                Generando IA... ({generationProgress}%)
              </div>
            ) : (
              <div className="flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generar con IA - P2-T-08
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Progress bar for AI generation */}
      {generating && (
        <div className="bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${generationProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Objetivos Disponibles para {gradeCode}</h4>
        <p className="text-sm text-blue-800">
          Selecciona los objetivos que se alineen con el contenido de tu clase. La IA optimizará automáticamente 
          la distribución de niveles Bloom.
        </p>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {availableOAs.map((oa) => (
          <div
            key={oa.oa_id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              wizardData.learning_objectives.selected_oas.some(selected => selected.oa_id === oa.oa_id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => {
              const isSelected = wizardData.learning_objectives.selected_oas.some(
                selected => selected.oa_id === oa.oa_id
              )
              
              if (isSelected) {
                setWizardData(prev => ({
                  ...prev,
                  learning_objectives: {
                    ...prev.learning_objectives,
                    selected_oas: prev.learning_objectives.selected_oas.filter(
                      selected => selected.oa_id !== oa.oa_id
                    )
                  }
                }))
              } else {
                setWizardData(prev => ({
                  ...prev,
                  learning_objectives: {
                    ...prev.learning_objectives,
                    selected_oas: [...prev.learning_objectives.selected_oas, oa]
                  }
                }))
              }
            }}
          >
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={wizardData.learning_objectives.selected_oas.some(
                  selected => selected.oa_id === oa.oa_id
                )}
                onChange={() => {}} // Handled by parent div onClick
                className="mt-1 h-4 w-4 text-blue-600 rounded"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-mono text-sm text-blue-600">{oa.oa_code}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {oa.bloom_level}
                  </span>
                  <span className="text-xs text-gray-500">~{oa.time_estimate_minutes} min</span>
                </div>
                <p className="text-sm text-gray-700">{oa.oa_description}</p>
                {oa.transversal_skills && oa.transversal_skills.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {oa.transversal_skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom Objectives */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Objetivos Personalizados (Opcional)</h4>
        <div className="space-y-2">
          {wizardData.learning_objectives.custom_objectives.map((objective, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...wizardData.learning_objectives.custom_objectives]
                  newObjectives[index] = e.target.value
                  setWizardData(prev => ({
                    ...prev,
                    learning_objectives: {
                      ...prev.learning_objectives,
                      custom_objectives: newObjectives
                    }
                  }))
                }}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Objetivo personalizado..."
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newObjectives = wizardData.learning_objectives.custom_objectives.filter(
                    (_, i) => i !== index
                  )
                  setWizardData(prev => ({
                    ...prev,
                    learning_objectives: {
                      ...prev.learning_objectives,
                      custom_objectives: newObjectives
                    }
                  }))
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setWizardData(prev => ({
                ...prev,
                learning_objectives: {
                  ...prev.learning_objectives,
                  custom_objectives: [...prev.learning_objectives.custom_objectives, '']
                }
              }))
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Agregar Objetivo Personalizado
          </Button>
        </div>
      </div>
      
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Errores de validación</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderAIGenerationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SparklesIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Generación con IA</h3>
        <p className="text-gray-600">
          Nuestra IA está creando una planificación optimizada basada en tus configuraciones
        </p>
      </div>
      
      {generating ? (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <span className="text-purple-900 font-medium">Generando planificación...</span>
            </div>
            
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              ></div>
            </div>
            
            <p className="text-purple-700 text-sm mt-2">
              {generationProgress}% completado
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-3">Qué está haciendo la IA:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Analizando objetivos de aprendizaje seleccionados</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>Optimizando distribución de niveles Bloom</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${generationProgress >= 40 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Creando actividades diferenciadas</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${generationProgress >= 60 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Seleccionando recursos apropiados</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className={`h-4 w-4 rounded-full ${generationProgress >= 80 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Integrando estrategias de evaluación</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">¡Planificación Generada!</h4>
          <p className="text-gray-600 mb-6">
            Tu clase ha sido estructurada automáticamente. Procede al siguiente paso para revisar y ajustar.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-900">
                {wizardData.lesson_structure.desarrollo.length + 2}
              </div>
              <div className="text-sm text-blue-700">Actividades</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <ClockIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-900">
                {wizardData.basic_info.duration_minutes}min
              </div>
              <div className="text-sm text-green-700">Duración</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-900">
                {Math.round(wizardData.quality_metrics.overall_quality_score)}%
              </div>
              <div className="text-sm text-purple-700">Calidad</div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <AdjustmentsHorizontalIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-orange-900">
                {wizardData.differentiation.strategies.length}
              </div>
              <div className="text-sm text-orange-700">Adaptaciones</div>
            </div>
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
            <span className="text-lg font-medium text-gray-900">Cargando Asistente...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Asistente IA de Planificación
              </h2>
              <p className="text-sm text-gray-600">
                {className} • {gradeCode} • Paso {currentStep + 1} de {WIZARD_STEPS.length}
              </p>
            </div>
            <Button variant="outline" onClick={onClose} size="sm">
              Cerrar
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                {WIZARD_STEPS[currentStep].title}
              </span>
              <span className="text-sm text-gray-500">
                ~{WIZARD_STEPS[currentStep].estimatedTime} min
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mt-2">
              {WIZARD_STEPS.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <step.icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && renderBasicInfoStep()}
              {currentStep === 1 && renderObjectivesStep()}
              {currentStep === 3 && renderAIGenerationStep()}
              {/* Other steps would be implemented here */}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || generating}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-sm text-gray-500">
            Tiempo estimado restante: {WIZARD_STEPS.slice(currentStep + 1).reduce((sum, step) => sum + step.estimatedTime, 0)} min
          </div>
          
          {currentStep === WIZARD_STEPS.length - 1 ? (
            <Button onClick={handleComplete} disabled={generating}>
              Finalizar Planificación
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={generating}
            >
              Siguiente
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 