'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  DocumentIcon,
  PlayIcon,
  LinkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function EditLessonPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const lessonId = params.id as string

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    date: '',
    duration: 45,
    objectives: [''],
    materials: [''],
    introduction: '',
    development: '',
    closure: '',
    assessment: '',
    homework: '',
    resources: [] as any[]
  })

  // Load lesson data (mock)
  useEffect(() => {
    // Simulate loading lesson data
    const lessonData = {
      title: 'Introducción a las Fracciones',
      subject: 'Matemáticas',
      grade: '4° Básico',
      date: '2024-01-22',
      duration: 45,
      objectives: [
        'Comprender el concepto de fracción como parte de un todo',
        'Identificar numerador y denominador en una fracción'
      ],
      materials: [
        'Círculos de papel',
        'Pizarra digital',
        'Fichas de trabajo'
      ],
      introduction: 'Comenzamos preguntando a los estudiantes qué saben sobre dividir una pizza en partes iguales.',
      development: 'Explicamos el concepto de fracción usando ejemplos concretos. Los estudiantes practican con círculos de papel divididos en diferentes partes.',
      closure: 'Resumimos los conceptos aprendidos y resolvemos dudas.',
      assessment: 'Evaluación formativa a través de preguntas dirigidas y observación directa.',
      homework: 'Completar ejercicios del libro páginas 45-47.',
      resources: [
        {
          id: 1,
          type: 'file',
          name: 'Presentación Fracciones.pptx',
          size: '2.3 MB'
        },
        {
          id: 2,
          type: 'link',
          name: 'Video explicativo',
          url: 'https://youtube.com/watch?v=...'
        }
      ]
    }
    setFormData(lessonData)
  }, [lessonId])

  const subjects = [
    'Matemáticas', 'Lenguaje', 'Ciencias', 'Historia', 'Inglés',
    'Educación Física', 'Artes', 'Música', 'Tecnología'
  ]

  const grades = [
    '1º Básico', '2º Básico', '3º Básico', '4º Básico', '5º Básico', '6º Básico',
    '7º Básico', '8º Básico', '1º Medio', '2º Medio', '3º Medio', '4º Medio'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.subject || !formData.grade) {
      toast.error('Por favor completa los campos obligatorios')
      return
    }

    try {
      toast.success('Guardando lección...')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Lección actualizada exitosamente')
      router.push('/teacher/lesson')
    } catch (error) {
      toast.error('Error al actualizar la lección')
    }
  }

  const handleCancel = () => {
    router.push('/teacher/lesson')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Lección</h1>
              <p className="text-gray-600">Modifica los detalles de tu planificación</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave} leftIcon={<PlusIcon className="h-4 w-4" />}>
              Guardar Cambios
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Lección *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="input w-full"
                    placeholder="Ej: Introducción a las Fracciones"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asignatura *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Seleccionar asignatura</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grado *
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="input w-full"
                  >
                    <option value="">Seleccionar grado</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    className="input w-32"
                    min="15"
                    max="180"
                    step="15"
                  />
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos de Aprendizaje</h3>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      className="input flex-1"
                      placeholder="Describe el objetivo de aprendizaje"
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('objectives', index)}
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                      >
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('objectives')}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Agregar Objetivo
                </Button>
              </div>
            </div>

            {/* Materials */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Materiales Necesarios</h3>
              <div className="space-y-3">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                      className="input flex-1"
                      placeholder="Ej: Pizarra, marcadores, fichas"
                    />
                    {formData.materials.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('materials', index)}
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                      >
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('materials')}
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                >
                  Agregar Material
                </Button>
              </div>
            </div>

            {/* Lesson Structure */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estructura de la Clase</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Introducción (5-10 min)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.introduction}
                    onChange={(e) => handleInputChange('introduction', e.target.value)}
                    className="input w-full"
                    placeholder="Describe cómo comenzarás la clase..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desarrollo (20-30 min)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.development}
                    onChange={(e) => handleInputChange('development', e.target.value)}
                    className="input w-full"
                    placeholder="Describe las actividades principales..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cierre (5-10 min)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.closure}
                    onChange={(e) => handleInputChange('closure', e.target.value)}
                    className="input w-full"
                    placeholder="Describe cómo concluirás la clase..."
                  />
                </div>
              </div>
            </div>

            {/* Assessment & Homework */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluación y Tarea</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evaluación
                  </label>
                  <textarea
                    rows={3}
                    value={formData.assessment}
                    onChange={(e) => handleInputChange('assessment', e.target.value)}
                    className="input w-full"
                    placeholder="Describe cómo evaluarás el aprendizaje..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarea para la Casa
                  </label>
                  <textarea
                    rows={2}
                    value={formData.homework}
                    onChange={(e) => handleInputChange('homework', e.target.value)}
                    className="input w-full"
                    placeholder="Describe la tarea asignada..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos Adjuntos</h3>
              <div className="space-y-3">
                {formData.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {resource.type === 'file' ? (
                        <DocumentIcon className="h-5 w-5 text-blue-500" />
                      ) : (
                        <LinkIcon className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                        {resource.size && (
                          <p className="text-xs text-gray-500">{resource.size}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          resources: prev.resources.filter((_, i) => i !== index)
                        }))
                      }}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<DocumentIcon className="h-4 w-4" />}
                  >
                    Adjuntar Archivo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<LinkIcon className="h-4 w-4" />}
                  >
                    Agregar Enlace
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  leftIcon={<PlayIcon className="h-4 w-4" />}
                >
                  Vista Previa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.success('Lección duplicada')}
                >
                  Duplicar Lección
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres eliminar esta lección?')) {
                      toast.success('Lección eliminada')
                      router.push('/teacher/lesson')
                    }
                  }}
                >
                  Eliminar Lección
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Consejos</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Define objetivos claros y medibles</p>
                <p>• Incluye actividades variadas para diferentes tipos de aprendizaje</p>
                <p>• Planifica tiempo para preguntas y dudas</p>
                <p>• Considera el nivel y ritmo de tus estudiantes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 