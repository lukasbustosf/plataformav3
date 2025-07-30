'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<any>({
    title: 'Quiz de Matemáticas - Álgebra Básica',
    description: 'Evaluación de conocimientos sobre ecuaciones lineales',
    subject: 'Matemáticas',
    timeLimit: 30,
    attempts: 1,
    randomizeQuestions: false,
    showResults: true,
    questions: [
      {
        id: 1,
        question: '¿Cuál es el resultado de 2x + 5 = 11?',
        type: 'multiple-choice',
        options: ['x = 3', 'x = 4', 'x = 6', 'x = 8'],
        correctAnswer: 0,
        points: 2
      },
      {
        id: 2,
        question: 'Resuelve la ecuación: 3x - 7 = 14',
        type: 'open-ended',
        correctAnswer: 'x = 7',
        points: 3
      }
    ]
  })

  const handleSave = () => {
    if (!formData.title || formData.questions.length === 0) {
      toast.error('Por favor completa el título y agrega al menos una pregunta')
      return
    }

    toast.success('Quiz actualizado exitosamente')
    router.push('/teacher/quiz')
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    }
    setFormData((prev: any) => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
  }

  const handleRemoveQuestion = (questionId: number) => {
    setFormData((prev: any) => ({
      ...prev,
      questions: prev.questions.filter((q: any) => q.id !== questionId)
    }))
  }

  const handleQuestionChange = (questionId: number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }))
  }

  const handleOptionChange = (questionId: number, optionIndex: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => 
        q.id === questionId 
          ? { ...q, options: q.options.map((opt: any, i: number) => i === optionIndex ? value : opt) }
          : q
      )
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Quiz</h1>
            <p className="text-gray-600">Modifica las preguntas y configuración del quiz</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => router.push('/teacher/quiz')} leftIcon={<XMarkIcon className="h-4 w-4" />}>
              Cancelar
            </Button>
            <Button onClick={handleSave} leftIcon={<CheckIcon className="h-4 w-4" />}>
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Preguntas ({formData.questions.length})</h3>
                <Button onClick={handleAddQuestion} leftIcon={<PlusIcon className="h-4 w-4" />}>
                  Agregar Pregunta
                </Button>
              </div>

              <div className="space-y-6">
                {formData.questions.map((question: any, index: number) => (
                  <div key={question.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Pregunta {index + 1}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveQuestion(question.id)}
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                      >
                        Eliminar
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enunciado de la pregunta
                      </label>
                      <textarea
                        value={question.question}
                        onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
                        placeholder="Escribe tu pregunta aquí..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de pregunta
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="multiple-choice">Opción múltiple</option>
                          <option value="open-ended">Respuesta abierta</option>
                          <option value="true-false">Verdadero/Falso</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Puntos
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {question.type === 'multiple-choice' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Opciones de respuesta
                        </label>
                        <div className="space-y-2">
                          {question.options?.map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optionIndex}
                                onChange={() => handleQuestionChange(question.id, 'correctAnswer', optionIndex)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
                                placeholder={`Opción ${optionIndex + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Selecciona la opción correcta
                        </p>
                      </div>
                    )}

                    {question.type === 'open-ended' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Respuesta correcta
                        </label>
                        <input
                          type="text"
                          value={question.correctAnswer}
                          onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                          placeholder="Escribe la respuesta correcta..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Quiz</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo límite (minutos)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intentos permitidos
                  </label>
                  <select
                    value={formData.attempts}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, attempts: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 intento</option>
                    <option value={2}>2 intentos</option>
                    <option value={3}>3 intentos</option>
                    <option value={-1}>Ilimitados</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
              
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.randomizeQuestions}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, randomizeQuestions: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Aleatorizar preguntas</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.showResults}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, showResults: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Mostrar resultados al finalizar</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 