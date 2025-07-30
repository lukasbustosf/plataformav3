'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  PencilIcon,
  PlayIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ChartBarIcon,
  ShareIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

// Type definition for quiz state
interface QuestionData {
  id: string
  order: number
  question: string
  type: 'multiple_choice' | 'short_answer' | 'true_false'
  options?: string[]
  correctAnswer: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

interface QuizState {
  id: string
  title: string
  description: string
  mode: 'manual' | 'ai'
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
  questionCount: number
  totalPoints: number
  created: string
  lastModified: string
  status: string
  author: string
  subject: string
  grade: string
  gameFormat?: string
  engineId?: string
  skinTheme?: string
  questions: QuestionData[]
  stats: {
    timesPlayed: number
    averageScore: number
    averageTime: number
    completionRate: number
  }
}

export default function QuizDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const quizId = params.id as string

  // Load evaluation data from backend
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/evaluation/${quizId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          
          // Transform backend data to frontend format
          const transformedQuiz: QuizState = {
            id: data.evaluation.eval_id || data.evaluation.evaluation_id,
            title: data.evaluation.title,
            description: data.evaluation.description,
            mode: data.evaluation.mode,
            difficulty: data.evaluation.engine_config?.difficulty || 'medium',
            timeLimit: data.evaluation.time_limit_minutes,
            questionCount: data.evaluation.questions?.length || data.evaluation.engine_config?.questionCount || 0,
            totalPoints: data.evaluation.total_points || (data.evaluation.questions?.length * 10) || 30,
            created: data.evaluation.created_at?.split('T')[0] || '',
            lastModified: data.evaluation.updated_at?.split('T')[0] || data.evaluation.created_at?.split('T')[0] || '',
            status: data.evaluation.status,
            author: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Sistema',
            subject: data.evaluation.classes?.subjects?.name || 'Sin especificar',
            grade: data.evaluation.classes?.grade_code || 'Sin especificar',
            gameFormat: data.evaluation.game_format,
            engineId: data.evaluation.engine_id,
            skinTheme: data.evaluation.skin_theme,
            questions: data.evaluation.questions ? data.evaluation.questions.map((q: any) => ({
              id: q.id.toString(),
              order: q.id,
              question: q.text || q.question || `Pregunta ${q.id}`, // Usar 'text' del backend mock
              type: q.type === 'multiple_choice' ? 'multiple_choice' : q.type === 'short_answer' ? 'short_answer' : 'true_false',
              options: q.options || [],
              correctAnswer: q.correct_answer || q.correctAnswer, // Usar 'correct_answer' del backend
              difficulty: data.evaluation.difficulty || 'medium',
              points: q.points || 10
            })) : [],
            stats: {
              timesPlayed: 0,
              averageScore: 0,
              averageTime: 0,
              completionRate: 0
            }
          }
          
          setQuiz(transformedQuiz)
        } else if (response.status === 404) {
          setError('Evaluación no encontrada')
        } else {
          setError('Error al cargar la evaluación')
        }
      } catch (err) {
        console.error('Error fetching evaluation:', err)
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchEvaluation()
    }
  }, [quizId, user])

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/teacher/quiz')}>
            Volver a Evaluaciones
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  // No quiz found
  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Evaluación no encontrada</h2>
          <p className="text-gray-600 mb-6">La evaluación que buscas no existe o no tienes permisos para verla.</p>
          <Button onClick={() => router.push('/teacher/quiz')}>
            Volver a Evaluaciones
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Resumen' },
    { id: 'questions', name: 'Preguntas' },
    { id: 'settings', name: 'Configuración' },
    { id: 'results', name: 'Resultados' }
  ]

  const handleEditQuiz = () => {
    router.push(`/teacher/quiz/${quizId}/edit`)
  }

  const handlePlayQuiz = async () => {
    // Check if this is a gamified evaluation
    if (quiz.gameFormat && quiz.engineId) {
      console.log(`🎮 Starting gamified evaluation: ${quiz.title}`)
      
      try {
        const response = await fetch(`/api/evaluation/gamified/${quizId}/start-game`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          const result = await response.json()
          console.log('✅ Game session created:', result)
          
          toast.success(`¡Juego creado! Código: ${result.gameSession.join_code}`)
          router.push(result.gameSession.url)
        } else {
          const errorData = await response.json()
          console.error('❌ Error creating game session:', errorData)
          toast.error(errorData.error || 'Error al crear la sesión de juego')
        }
      } catch (error) {
        console.error('❌ Error:', error)
        toast.error('Error de conexión al crear el juego')
      }
    } else {
      // Regular quiz - use existing flow
      router.push(`/teacher/game/create?quiz=${quizId}`)
    }
  }

  const handleCloneQuiz = () => {
    toast.success('Quiz clonado exitosamente')
    router.push('/teacher/quiz/create?clone=' + quizId)
  }

  const handleDeleteQuiz = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este quiz?')) {
      toast.success('Quiz eliminado exitosamente')
      router.push('/teacher/quiz')
    }
  }

  const handleShareQuiz = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Enlace copiado al portapapeles')
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Título</p>
            <p className="text-gray-900">{quiz.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Descripción</p>
            <p className="text-gray-900">{quiz.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Asignatura</p>
            <p className="text-gray-900">{quiz.subject}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Curso</p>
            <p className="text-gray-900">{quiz.grade}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Dificultad</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {quiz.difficulty === 'easy' ? 'Fácil' : 
               quiz.difficulty === 'medium' ? 'Medio' : 'Difícil'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tiempo Límite</p>
            <p className="text-gray-900">{quiz.timeLimit} minutos</p>
          </div>
          {quiz.gameFormat && quiz.engineId && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-600">Formato de Juego</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                  🎮 {quiz.gameFormat}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Engine Educativo</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {quiz.engineId}
                </span>
              </div>
              {quiz.skinTheme && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Tema Visual</p>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    🎨 {quiz.skinTheme}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Gamified Badge */}
        {quiz.gameFormat && quiz.engineId && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎮</span>
              <div>
                <h4 className="font-semibold text-purple-900">Evaluación Gamificada</h4>
                <p className="text-sm text-purple-700">
                  Esta evaluación utiliza el formato de juego <strong>{quiz.gameFormat}</strong> con el engine educativo <strong>{quiz.engineId}</strong>
                  {quiz.skinTheme && <span> y el tema visual <strong>{quiz.skinTheme}</strong></span>}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{quiz.stats.timesPlayed}</p>
            <p className="text-sm text-gray-600">Veces Jugado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{quiz.stats.averageScore}%</p>
            <p className="text-sm text-gray-600">Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{quiz.stats.averageTime}m</p>
            <p className="text-sm text-gray-600">Tiempo Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{quiz.stats.completionRate}%</p>
            <p className="text-sm text-gray-600">Completado</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderQuestions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Preguntas ({quiz.questions.length})
        </h3>
        <Button
          variant="outline"
          onClick={() => router.push(`/teacher/quiz/${quizId}/edit`)}
          leftIcon={<PencilIcon className="h-4 w-4" />}
        >
          Editar Preguntas
        </Button>
      </div>

      {quiz.questions.map((question: QuestionData, index: number) => (
        <div key={question.id} className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Pregunta {question.order}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {question.difficulty === 'easy' ? 'Fácil' : 
                   question.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                  {question.points} pts
                </span>
              </div>
              <p className="text-gray-900 font-medium">{question.question}</p>
            </div>
          </div>

          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2">
              {question.options.map((option: string, optIndex: number) => (
                <div
                  key={optIndex}
                  className={`p-3 rounded-lg border ${
                    option === question.correctAnswer
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <span className="text-sm">{String.fromCharCode(65 + optIndex)}. {option}</span>
                  {option === question.correctAnswer && (
                    <span className="ml-2 text-green-600 text-xs font-medium">✓ Correcta</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {question.type === 'short_answer' && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Respuesta correcta:</p>
              <p className="text-gray-900 font-medium">{question.correctAnswer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderSettings = () => (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Quiz</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Modo de Quiz</p>
            <p className="text-sm text-gray-600">Configuración actual del quiz</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {quiz.mode === 'manual' ? 'Manual' : 'IA'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Estado</p>
            <p className="text-sm text-gray-600">Disponibilidad para estudiantes</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            {quiz.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Tiempo Límite</p>
            <p className="text-sm text-gray-600">Duración máxima del quiz</p>
          </div>
          <span className="text-gray-900">{quiz.timeLimit} minutos</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Total de Puntos</p>
            <p className="text-sm text-gray-600">Puntuación máxima posible</p>
          </div>
          <span className="text-gray-900">{quiz.totalPoints} puntos</span>
        </div>
      </div>
    </div>
  )

  const renderResults = () => (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados y Análisis</h3>
      <div className="text-center text-gray-500 py-8">
        <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>Los resultados detallados estarán disponibles cuando los estudiantes completen el quiz.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push(`/teacher/analytics?quiz=${quizId}`)}
        >
          Ver Analíticas Completas
        </Button>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Creado: {quiz.created}</span>
              <span>•</span>
              <span>Modificado: {quiz.lastModified}</span>
              <span>•</span>
              <span>Autor: {quiz.author}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleShareQuiz}
              leftIcon={<ShareIcon className="h-4 w-4" />}
            >
              Compartir
            </Button>
            <Button
              variant="outline"
              onClick={handleCloneQuiz}
              leftIcon={<DocumentDuplicateIcon className="h-4 w-4" />}
            >
              Clonar
            </Button>
            <Button
              variant="outline"
              onClick={handleEditQuiz}
              leftIcon={<PencilIcon className="h-4 w-4" />}
            >
              Editar
            </Button>
            <Button
              variant="game"
              onClick={handlePlayQuiz}
              leftIcon={<PlayIcon className="h-4 w-4" />}
              className={quiz.gameFormat && quiz.engineId ? 
                'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 
                ''
              }
            >
              {quiz.gameFormat && quiz.engineId ? '🎮 Iniciar Juego' : 'Jugar'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteQuiz}
              leftIcon={<TrashIcon className="h-4 w-4" />}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Eliminar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'questions' && renderQuestions()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'results' && renderResults()}
      </div>
    </DashboardLayout>
  )
} 