'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  PencilIcon,
  PrinterIcon,
  ShareIcon,
  DocumentIcon,
  LinkIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  BookOpenIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function ViewLessonPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const lessonId = params.id as string

  // Lesson data (mock)
  const [lesson, setLesson] = useState({
    title: 'Introducción a las Fracciones',
    subject: 'Matemáticas',
    grade: '4° Básico',
    date: '2024-01-22',
    duration: 45,
    status: 'published',
    lastModified: '2024-01-20',
    objectives: [
      'Comprender el concepto de fracción como parte de un todo',
      'Identificar numerador y denominador en una fracción',
      'Resolver problemas simples con fracciones unitarias'
    ],
    materials: [
      'Círculos de papel de colores',
      'Pizarra digital',
      'Fichas de trabajo impresas',
      'Marcadores de pizarra'
    ],
    introduction: 'Comenzamos preguntando a los estudiantes qué saben sobre dividir una pizza en partes iguales. Utilizamos ejemplos cotidianos para introducir el concepto de fracción de manera natural y motivadora.',
    development: `Explicamos el concepto de fracción usando ejemplos concretos y materiales manipulativos. 
    
    Actividades principales:
    1. Demostración con círculos de papel divididos en diferentes partes
    2. Identificación de numerador y denominador
    3. Práctica grupal con fichas de trabajo
    4. Ejercicios individuales en el cuaderno
    
    Los estudiantes trabajan en grupos de 4 para explorar diferentes representaciones de fracciones.`,
    closure: 'Resumimos los conceptos aprendidos mediante una lluvia de ideas. Cada grupo presenta una fracción usando los materiales y explica qué representa el numerador y denominador. Resolvemos dudas finales.',
    assessment: 'Evaluación formativa a través de preguntas dirigidas durante la clase, observación directa del trabajo grupal y revisión de ejercicios en el cuaderno. Se aplicará una mini evaluación al final de la clase.',
    homework: 'Completar ejercicios del libro páginas 45-47. Buscar 3 ejemplos de fracciones en casa (comida, objetos) y dibujarlos en el cuaderno.',
    resources: [
      {
        id: 1,
        type: 'file',
        name: 'Presentación Fracciones.pptx',
        size: '2.3 MB',
        url: '#'
      },
      {
        id: 2,
        type: 'link',
        name: 'Video explicativo: ¿Qué son las fracciones?',
        url: 'https://youtube.com/watch?v=...'
      },
      {
        id: 3,
        type: 'file',
        name: 'Fichas de trabajo - Fracciones.pdf',
        size: '1.8 MB',
        url: '#'
      }
    ],
    notes: 'Esta lección funciona muy bien cuando se combina con ejemplos de comida. Los estudiantes se motivan más al hablar de pizza, chocolate, etc. Considerar traer algunos materiales reales la próxima vez.'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'Publicada'
      case 'draft': return 'Borrador'
      default: return 'Sin estado'
    }
  }

  const handleEdit = () => {
    router.push(`/teacher/lesson/${lessonId}/edit`)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    toast.success('Enlace copiado al portapapeles')
  }

  const handleDuplicate = () => {
    toast.success('Lección duplicada exitosamente')
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
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                  {getStatusLabel(lesson.status)}
                </span>
              </div>
              <p className="text-gray-600">{lesson.subject} • {lesson.grade}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              leftIcon={<PrinterIcon className="h-4 w-4" />}
            >
              Imprimir
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              leftIcon={<ShareIcon className="h-4 w-4" />}
            >
              Compartir
            </Button>
            <Button
              onClick={handleEdit}
              leftIcon={<PencilIcon className="h-4 w-4" />}
            >
              Editar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium">{new Date(lesson.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Duración</p>
                    <p className="font-medium">{lesson.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Asignatura</p>
                    <p className="font-medium">{lesson.subject}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Grado</p>
                    <p className="font-medium">{lesson.grade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos de Aprendizaje</h3>
              <ul className="space-y-2">
                {lesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Materiales Necesarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lesson.materials.map((material, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{material}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lesson Structure */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Estructura de la Clase</h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Introducción (5-10 min)</h4>
                  <p className="text-gray-700 whitespace-pre-line">{lesson.introduction}</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Desarrollo (20-30 min)</h4>
                  <p className="text-gray-700 whitespace-pre-line">{lesson.development}</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Cierre (5-10 min)</h4>
                  <p className="text-gray-700 whitespace-pre-line">{lesson.closure}</p>
                </div>
              </div>
            </div>

            {/* Assessment & Homework */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluación y Tarea</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Evaluación</h4>
                  <p className="text-gray-700 whitespace-pre-line">{lesson.assessment}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tarea para la Casa</h4>
                  <p className="text-gray-700 whitespace-pre-line">{lesson.homework}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {lesson.notes && (
              <div className="card p-6 bg-yellow-50 border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Notas del Profesor</h3>
                <p className="text-gray-700 italic">{lesson.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos</h3>
              <div className="space-y-3">
                {lesson.resources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    {resource.type === 'file' ? (
                      <DocumentIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <LinkIcon className="h-5 w-5 text-green-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{resource.name}</p>
                      {resource.size && (
                        <p className="text-xs text-gray-500">{resource.size}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleEdit}
                  leftIcon={<PencilIcon className="h-4 w-4" />}
                >
                  Editar Lección
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleDuplicate}
                >
                  Duplicar Lección
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => toast.success('Guardado en favoritos')}
                >
                  Marcar como Favorita
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push('/teacher/quiz/create')}
                >
                  Crear Quiz Relacionado
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Creado:</span>
                  <p className="font-medium">{new Date(lesson.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Última modificación:</span>
                  <p className="font-medium">{new Date(lesson.lastModified).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <p className="font-medium">{getStatusLabel(lesson.status)}</p>
                </div>
                <div>
                  <span className="text-gray-600">ID:</span>
                  <p className="font-mono text-xs">{lessonId}</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Consejos</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Revisa los objetivos antes de la clase</p>
                <p>• Prepara los materiales con anticipación</p>
                <p>• Mantén un ritmo dinámico en el desarrollo</p>
                <p>• Ajusta según las necesidades del grupo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 