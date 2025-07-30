'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import toast from 'react-hot-toast'
import { 
  SparklesIcon,
  PlayIcon,
  AcademicCapIcon,
  CogIcon,
  PuzzlePieceIcon,
  StarIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import OASelector from '@/components/ui/OASelector'
import QuestionBankSelector from '@/components/evaluation/QuestionBankSelector' // New import
import type { BloomLevel, GameFormat } from '@/types'

// Configuración de engines disponibles
const GAME_TEMPLATES = [
  {
    id: 'FarmCountingGameOA1Analyze',
    name: 'Granja: Conteo y Análisis',
    description: 'Juego de conteo y análisis de patrones con temática de granja.',
    subject: 'Matemáticas',
    icon: '🐄',
    color: 'green',
  },
  // Add other game templates here as they are created
  // {
  //   id: 'Oa1MatAplicarGame',
  //   name: 'Matemáticas: Aplicar Conceptos',
  //   description: 'Juego para aplicar conceptos matemáticos básicos.',
  //   subject: 'Matemáticas',
  //   icon: '📐',
  //   color: 'blue',
  // },
];

// Configuración de skins disponibles
const SKINS = [
  {
    id: 'granja',
    name: 'Granja Feliz',
    description: 'Ambiente rural con animales y cultivos',
    icon: '🐄',
    color: 'yellow',
    preview: 'bg-yellow-100 border-yellow-300'
  },
  {
    id: 'espacio',
    name: 'Aventura Espacial',
    description: 'Exploración del cosmos y planetas',
    icon: '🚀',
    color: 'blue',
    preview: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'oceano',
    name: 'Océano Profundo',
    description: 'Vida marina y ecosistemas acuáticos',
    icon: '🐙',
    color: 'cyan',
    preview: 'bg-cyan-100 border-cyan-300'
  },
  {
    id: 'bosque',
    name: 'Bosque Encantado',
    description: 'Naturaleza y animales del bosque',
    icon: '🌲',
    color: 'green',
    preview: 'bg-green-100 border-green-300'
  }
]

const SUBJECTS = [
  'Matemáticas',
  'Lenguaje',
  'Ciencias Naturales',
  'Historia',
  'Inglés'
]

const GRADES = [
  '1º Básico', '2º Básico', '3º Básico', '4º Básico', '5º Básico', '6º Básico',
  '7º Básico', '8º Básico', '1º Medio', '2º Medio', '3º Medio', '4º Medio'
]

const BLOOM_LEVELS: BloomLevel[] = [
  'Recordar', 'Comprender', 'Aplicar', 'Analizar', 'Evaluar', 'Crear'
]

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil', description: 'Conceptos básicos y reconocimiento' },
  { value: 'medium', label: 'Medio', description: 'Aplicación y comprensión' },
  { value: 'hard', label: 'Difícil', description: 'Análisis y evaluación' }
]

// Función para convertir grado frontend a código backend
const mapGradeToCode = (gradeLevel: string): string => {
  const gradeNumber = gradeLevel.replace(/[^0-9]/g, '')
  const isBásico = gradeLevel.includes('Básico')
  const isMedio = gradeLevel.includes('Medio')
  
  if (isBásico) {
    return `${gradeNumber}B`
  } else if (isMedio) {
    return `${gradeNumber}M`
  }
  
  return gradeNumber // fallback
}

interface GameEvaluationCreatorProps {
  onSuccess?: (evaluationId: string) => void
  onCancel?: () => void
  initialData?: any
}

export function GameEvaluationCreator({ 
  onSuccess, 
  onCancel,
  initialData 
}: GameEvaluationCreatorProps) {
  const router = useRouter()
  const { user } = useAuth()
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class_id: '',
    subject: 'Matemáticas',
    grade_level: '1º Básico',
    difficulty: 'medium',
    question_count: 10,
    time_limit: 30,
    oa_codes: [] as string[],
    bloom_levels: ['Comprender'] as BloomLevel[],
    engine_id: 'FarmCountingGameOA1Analyze', // Now stores the game template ID
    skin_theme: 'granja',
    selectedQuestionIds: [] as string[], // New: IDs of manually selected questions
  })
  
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [availableClasses, setAvailableClasses] = useState<any[]>([])
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Load initial data
  useEffect(() => {
    fetchClasses()
    if (initialData) {
      setFormData({ ...formData, ...initialData })
    }
  }, [])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/class', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvailableClasses(data.classes || [])
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {}
    
    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) errors.title = 'El título es requerido'
        if (!formData.class_id) errors.class_id = 'Debe seleccionar una clase'
        if (formData.oa_codes.length === 0) errors.oa_codes = 'Debe seleccionar al menos un OA'
        break
      
      case 2:
        if (!formData.engine_id) errors.engine_id = 'Debe seleccionar una plantilla de juego'
        if (!formData.skin_theme) errors.skin_theme = 'Debe seleccionar un skin'
        break
      
      case 3:
        // No specific validation for step 3 yet, but can add if needed
        break;

      case 4:
        // Validation for question selection step
        // For now, it's optional to select questions, so no validation here
        break;
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      const evaluationData = {
        title: formData.title,
        description: formData.description,
        class_id: formData.class_id,
        type: 'gamified',
        game_format: formData.engine_id, // Use engine_id as game_format
        engine_id: formData.engine_id,   // Use engine_id as game_template_id
        skin_theme: formData.skin_theme,
        oa_codes: formData.oa_codes,
        bloom_levels: formData.bloom_levels,
        question_count: formData.question_count,
        time_limit_minutes: formData.time_limit,
        difficulty: formData.difficulty,
        engine_config: {
          subject: formData.subject,
          grade_level: formData.grade_level,
          difficulty: formData.difficulty
        },
        manual_question_ids: formData.selectedQuestionIds, // New: Pass selected question IDs
      }

      console.log('🎮 Creating gamified evaluation:', evaluationData)
      
      const response = await fetch('/api/evaluation/gamified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(evaluationData)
      })

      const result = await response.json()
      
      if (response.ok) {
        toast.success('¡Evaluación gamificada creada exitosamente!')
        console.log('✅ Evaluation created:', result)
        
        // 🚨 FIX: Crear automáticamente la sesión de juego
        console.log('🎮 Creating game session automatically...')
        
        try {
          const gameResponse = await fetch(`http://localhost:5000/api/evaluation/gamified/${result.evaluation.evaluation_id}/start-game`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })

          const gameResult = await gameResponse.json()
          
          if (gameResponse.ok) {
            console.log('✅ Game session created:', gameResult.gameSession)
            toast.success(`¡Juego creado! Código: ${gameResult.gameSession.join_code}`)
            
            // Navegar directamente al lobby del juego
            router.push(gameResult.gameSession.url)
          } else {
            console.error('❌ Error creating game session:', gameResult)
            toast.error('Evaluación creada pero error al crear sesión de juego')
            
            // Fallback: ir a la página de quiz donde puede crear la sesión manualmente
            if (onSuccess) {
              onSuccess(result.evaluation.evaluation_id)
            } else {
              router.push('/teacher/quiz')
            }
          }
        } catch (gameError) {
          console.error('❌ Error calling start-game:', gameError)
          toast.error('Evaluación creada pero error al crear sesión de juego')
          
          // Fallback: ir a la página de quiz
          if (onSuccess) {
            onSuccess(result.evaluation.evaluation_id)
          } else {
            router.push('/teacher/quiz')
          }
        }
      } else {
        throw new Error(result.error || 'Error al crear la evaluación')
      }
    } catch (error) {
      console.error('Error creating evaluation:', error)
      toast.error('Error al crear la evaluación gamificada')
    } finally {
      setLoading(false)
    }
  }

  const getSelectedEngine = () => GAME_TEMPLATES.find(e => e.id === formData.engine_id)
  const getSelectedSkin = () => SKINS.find(s => s.id === formData.skin_theme)
  const getSelectedClass = () => availableClasses.find(c => c.class_id === formData.class_id)

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <AcademicCapIcon className="mx-auto h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Información Básica</h2>
        <p className="text-gray-600 mt-2">
          Define los detalles principales de tu evaluación gamificada
        </p>
      </div>

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título de la Evaluación *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Evaluación de Números del 1 al 10"
        />
        {validationErrors.title && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción (Opcional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Describe brevemente los objetivos de esta evaluación..."
        />
      </div>

      {/* Clase */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Clase *
        </label>
        <select
          value={formData.class_id}
          onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar clase...</option>
          {availableClasses.map((cls) => (
            <option key={cls.class_id} value={cls.class_id}>
              {cls.class_name} - {cls.grade_code}
            </option>
          ))}
        </select>
        {validationErrors.class_id && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.class_id}</p>
        )}
      </div>

      {/* Selección de Materia y Grado */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materia
          </label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grado
          </label>
          <select
            value={formData.grade_level}
            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {GRADES.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selector de OA */}
      <div>
        <OASelector
          selectedOAs={formData.oa_codes}
          onOAChange={(oaCodes) => setFormData({ ...formData, oa_codes: oaCodes })}
          gradeCode={mapGradeToCode(formData.grade_level)}
          className="mt-4"
        />
        {validationErrors.oa_codes && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.oa_codes}</p>
        )}
      </div>

      {/* Niveles de Bloom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Niveles de Bloom Objetivo
        </label>
        <div className="grid grid-cols-3 gap-3">
          {BLOOM_LEVELS.map((level) => (
            <label key={level} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bloom_levels.includes(level)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      bloom_levels: [...formData.bloom_levels, level]
                    })
                  } else {
                    setFormData({
                      ...formData,
                      bloom_levels: formData.bloom_levels.filter(l => l !== level)
                    })
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CogIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Selección de Plantilla de Juego</h2>
        <p className="text-gray-600 mt-2">
          Elige la experiencia de juego que tus estudiantes disfrutarán
        </p>
      </div>

      {/* Selección de Plantilla de Juego */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Plantilla de Juego *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GAME_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.engine_id === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData({ ...formData, engine_id: template.id })}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                  ${template.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    template.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'}`}>
                  {template.subject}
                </span>
              </div>
            </div>
          ))}
        </div>
        {validationErrors.engine_id && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.engine_id}</p>
        )}
      </div>

      {/* Preview de formatos disponibles */}
      {/* This section is no longer relevant as the game template defines the format */}

      {/* Selección de Skin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Temática Visual (Skin) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SKINS.map((skin) => (
            <div
              key={skin.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.skin_theme === skin.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData({ ...formData, skin_theme: skin.id })}
            >
              <div className="text-center">
                <div className={`w-full h-20 ${skin.preview} rounded-lg mb-3 flex items-center justify-center text-3xl`}>
                  {skin.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{skin.name}</h3>
                <p className="text-xs text-gray-600">{skin.description}</p>
              </div>
            </div>
          ))}
        </div>
        {validationErrors.skin_theme && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.skin_theme}</p>
        )}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <SparklesIcon className="mx-auto h-16 w-16 text-purple-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Parámetros del Juego</h2>
        <p className="text-gray-600 mt-2">
          Ajusta la configuración final de tu evaluación
        </p>
      </div>

      {/* Configuración de juego */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Preguntas
          </label>
          <select
            value={formData.question_count}
            onChange={(e) => setFormData({ ...formData, question_count: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5 preguntas (rápido)</option>
            <option value={10}>10 preguntas (estándar)</option>
            <option value={15}>15 preguntas (completo)</option>
            <option value={20}>20 preguntas (extenso)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiempo Límite (minutos)
          </label>
          <select
            value={formData.time_limit}
            onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>60 minutos</option>
          </select>
        </div>
      </div>

      {/* Dificultad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Nivel de Dificultad
        </label>
        <div className="grid grid-cols-3 gap-4">
          {DIFFICULTIES.map((diff) => (
            <div
              key={diff.value}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.difficulty === diff.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData({ ...formData, difficulty: diff.value })}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{diff.label}</h3>
              <p className="text-sm text-gray-600">{diff.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Resumen de Configuración</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Título:</span>
            <span className="font-medium">{formData.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Clase:</span>
            <span className="font-medium">{getSelectedClass()?.class_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">OAs Seleccionados:</span>
            <span className="font-medium">{formData.oa_codes.length} objetivos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Plantilla de Juego:</span>
            <span className="font-medium">{getSelectedEngine()?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Temática:</span>
            <span className="font-medium">{getSelectedSkin()?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duración estimada:</span>
            <span className="font-medium">{formData.time_limit} minutos</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <PuzzlePieceIcon className="mx-auto h-16 w-16 text-orange-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Selección de Preguntas</h2>
        <p className="text-gray-600 mt-2">
          Elige preguntas de tu banco o deja que la IA genere automáticamente.
        </p>
      </div>

      {/* Question Selector Component will go here */}
      <QuestionBankSelector
        selectedQuestionIds={formData.selectedQuestionIds}
        onQuestionIdsChange={(ids) => setFormData(prev => ({ ...prev, selectedQuestionIds: ids }))}
      />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <SparklesIcon className="h-8 w-8 text-blue-500" />
              Crear Evaluación Gamificada
            </h1>
            <p className="text-gray-600 mt-2">
              Genera evaluaciones interactivas con IA para mayor engagement estudiantil
            </p>
          </div>
          {onCancel && (
            <Button
              variant="secondary"
              onClick={onCancel}
              className="shrink-0"
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${currentStep >= step 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {currentStep > step ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  step
                )}
              </div>
              {step < 4 && (
                <div className={`
                  w-24 lg:w-32 h-1 mx-2
                  ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Información Básica
          </span>
          <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Configuración
          </span>
          <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Parámetros
          </span>
          <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
            Preguntas
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-3">
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              className="flex items-center gap-2"
            >
              <PlayIcon className="h-4 w-4" />
              Crear Evaluación
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 