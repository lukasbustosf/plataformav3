'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon, 
  SparklesIcon, 
  BookOpenIcon, 
  TrashIcon,
  EyeIcon,
  CheckIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import { useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'

const quizSchema = yup.object({
  title: yup.string().required('El título es requerido'),
  description: yup.string(),
  mode: yup.string().oneOf(['manual', 'ai']).required(),
  questions: yup.array().of(
    yup.object({
      stem_md: yup.string().required('La pregunta es requerida'),
      type: yup.string().required('El tipo es requerido'),
      options: yup.array().when('type', (type: any, schema: any) => {
        if (type === 'multiple_choice') {
          return schema.min(2, 'Se requieren al menos 2 opciones')
        }
        return schema
      }),
      correct_answer: yup.mixed().required('La respuesta correcta es requerida'),
      explanation: yup.string(),
      difficulty: yup.number().min(1).max(5).required(),
      bloom_level: yup.string()
    })
  ).min(1, 'Se requiere al menos una pregunta')
})

function CreateQuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isAIMode, setIsAIMode] = useState(searchParams.get('mode') === 'ai')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      mode: isAIMode ? 'ai' : 'manual',
      questions: isAIMode ? [] : [{
        stem_md: '',
        type: 'multiple_choice',
        options: ['', ''],
        correct_answer: 0,
        explanation: '',
        difficulty: 3,
        bloom_level: 'Comprender'
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions'
  })

  const questionTypes = [
    { value: 'multiple_choice', label: 'Selección Múltiple' },
    { value: 'true_false', label: 'Verdadero/Falso' },
    { value: 'short_answer', label: 'Respuesta Corta' },
    { value: 'essay', label: 'Ensayo' }
  ]

  const bloomLevels = [
    'Recordar',
    'Comprender', 
    'Aplicar',
    'Analizar',
    'Evaluar',
    'Crear'
  ]

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Por favor, describe el tema del quiz')
      return
    }

    setIsGenerating(true)
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const generatedQuestions = [
        {
          stem_md: '¿Cuál es la fórmula del teorema de Pitágoras?',
          type: 'multiple_choice',
          options: ['a² + b² = c²', 'a² - b² = c²', 'a + b = c', 'a × b = c²'],
          correct_answer: 0,
          explanation: 'El teorema de Pitágoras establece que en un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.',
          difficulty: 2,
          bloom_level: 'Recordar'
        },
        {
          stem_md: 'Si un triángulo tiene catetos de 3 y 4 unidades, ¿cuál es la longitud de la hipotenusa?',
          type: 'short_answer',
          options: [],
          correct_answer: '5',
          explanation: 'Aplicando el teorema de Pitágoras: √(3² + 4²) = √(9 + 16) = √25 = 5',
          difficulty: 3,
          bloom_level: 'Aplicar'
        }
      ]

      setValue('questions', generatedQuestions)
      toast.success('Quiz generado exitosamente con IA')
    } catch (error) {
      toast.error('Error al generar el quiz')
    } finally {
      setIsGenerating(false)
    }
  }

  const addQuestion = () => {
    append({
      stem_md: '',
      type: 'multiple_choice',
      options: ['', ''],
      correct_answer: 0,
      explanation: '',
      difficulty: 3,
      bloom_level: 'Comprender'
    })
  }

  const addOption = (questionIndex: number) => {
    const currentOptions = watch(`questions.${questionIndex}.options`) || []
    setValue(`questions.${questionIndex}.options`, [...currentOptions, ''])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = watch(`questions.${questionIndex}.options`) || []
    if (currentOptions.length > 2) {
      const newOptions = currentOptions.filter((_, i) => i !== optionIndex)
      setValue(`questions.${questionIndex}.options`, newOptions)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      console.log('Quiz data:', data)
      toast.success('Quiz creado exitosamente')
      router.push('/teacher/dashboard')
    } catch (error) {
      toast.error('Error al crear el quiz')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAIMode ? 'Crear Quiz con IA' : 'Crear Quiz Manual'}
            </h1>
            <p className="text-gray-600">
              {isAIMode ? 'Genera automáticamente preguntas usando inteligencia artificial' : 'Crea preguntas paso a paso manualmente'}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant={!isAIMode ? 'primary' : 'outline'}
              onClick={() => setIsAIMode(false)}
              leftIcon={<BookOpenIcon className="h-4 w-4" />}
            >
              Manual
            </Button>
            <Button
              variant={isAIMode ? 'primary' : 'outline'}
              onClick={() => setIsAIMode(true)}
              leftIcon={<SparklesIcon className="h-4 w-4" />}
            >
              IA
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Quiz *
                </label>
                <input
                  {...register('title')}
                  className="input-field"
                  placeholder="Ej: Quiz de Matemáticas - Teorema de Pitágoras"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="input-field"
                  placeholder="Descripción opcional del quiz..."
                />
              </div>
            </div>
          </div>

          {/* AI Generation */}
          {isAIMode && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Generación con IA</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe el tema y nivel del quiz
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={4}
                    className="input-field"
                    placeholder="Ej: Crear un quiz de nivel básico sobre el teorema de Pitágoras para estudiantes de 8vo básico. Incluir 5 preguntas: 3 de selección múltiple sobre la fórmula y conceptos, y 2 de aplicación práctica con problemas simples."
                  />
                </div>
                <Button
                  type="button"
                  onClick={generateWithAI}
                  disabled={isGenerating}
                  leftIcon={<SparklesIcon className="h-4 w-4" />}
                >
                  {isGenerating ? 'Generando...' : 'Generar Quiz con IA'}
                </Button>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Preguntas</h2>
              {!isAIMode && (
                <Button
                  type="button"
                  onClick={addQuestion}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                  variant="outline"
                >
                  Agregar Pregunta
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Pregunta {index + 1}</h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="outline"
                        size="sm"
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pregunta *
                      </label>
                      <textarea
                        {...register(`questions.${index}.stem_md`)}
                        rows={2}
                        className="input-field"
                        placeholder="Escribe tu pregunta aquí..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Pregunta
                      </label>
                      <select
                        {...register(`questions.${index}.type`)}
                        className="input-field"
                      >
                        {questionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Bloom
                      </label>
                      <select
                        {...register(`questions.${index}.bloom_level`)}
                        className="input-field"
                      >
                        {bloomLevels.map(level => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dificultad (1-5)
                      </label>
                      <select
                        {...register(`questions.${index}.difficulty`)}
                        className="input-field"
                      >
                        {[1,2,3,4,5].map(level => (
                          <option key={level} value={level}>
                            {level} - {level === 1 ? 'Muy Fácil' : level === 2 ? 'Fácil' : level === 3 ? 'Medio' : level === 4 ? 'Difícil' : 'Muy Difícil'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Options for multiple choice */}
                  {watch(`questions.${index}.type`) === 'multiple_choice' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opciones
                      </label>
                      <div className="space-y-2">
                        {watch(`questions.${index}.options`)?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              value={optionIndex}
                              {...register(`questions.${index}.correct_answer`)}
                              className="text-primary-600"
                            />
                            <input
                              {...register(`questions.${index}.options.${optionIndex}`)}
                              className="input-field flex-1"
                              placeholder={`Opción ${optionIndex + 1}`}
                            />
                            {(watch(`questions.${index}.options`) || []).length > 2 && (
                              <Button
                                type="button"
                                onClick={() => removeOption(index, optionIndex)}
                                variant="outline"
                                size="sm"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => addOption(index)}
                          variant="outline"
                          size="sm"
                          leftIcon={<PlusIcon className="h-4 w-4" />}
                        >
                          Agregar Opción
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* True/False */}
                  {watch(`questions.${index}.type`) === 'true_false' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Respuesta Correcta
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="true"
                            {...register(`questions.${index}.correct_answer`)}
                            className="text-primary-600 mr-2"
                          />
                          Verdadero
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="false"
                            {...register(`questions.${index}.correct_answer`)}
                            className="text-primary-600 mr-2"
                          />
                          Falso
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Short answer */}
                  {watch(`questions.${index}.type`) === 'short_answer' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Respuesta Correcta
                      </label>
                      <input
                        {...register(`questions.${index}.correct_answer`)}
                        className="input-field"
                        placeholder="Respuesta esperada..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explicación (Opcional)
                    </label>
                    <textarea
                      {...register(`questions.${index}.explanation`)}
                      rows={2}
                      className="input-field"
                      placeholder="Explica por qué esta es la respuesta correcta..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              leftIcon={<EyeIcon className="h-4 w-4" />}
            >
              Vista Previa
            </Button>
            <Button
              type="submit"
              leftIcon={<CheckIcon className="h-4 w-4" />}
            >
              Guardar Quiz
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default function CreateQuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateQuizContent />
    </Suspense>
  )
} 