'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  PlayIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'

export default function GameDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [gameSession, setGameSession] = useState<any>(null)

  const gameId = params.id as string

  // Mock game session data
  const game = {
    id: gameId,
    title: 'Matemáticas - Fracciones',
    quizTitle: 'Operaciones con Fracciones',
    format: 'trivia_lightning',
    formatName: 'Trivia Lightning',
    status: 'waiting', // waiting, active, paused, completed
    createdAt: '2024-01-15T10:30:00Z',
    startedAt: null,
    endedAt: null,
    duration: 0,
    maxParticipants: 30,
    currentParticipants: 0,
    totalQuestions: 10,
    accessCode: 'ABC123',
    host: {
      id: user?.user_id,
      name: `${user?.first_name} ${user?.last_name}` || 'Prof. María González'
    },
    quiz: {
      id: 'quiz-123',
      title: 'Operaciones con Fracciones',
      description: 'Evaluación sobre suma, resta, multiplicación y división de fracciones',
      questionCount: 10,
      difficulty: 'medium',
      subject: 'Matemáticas',
      grade: '5° Básico'
    },
    participants: [],
    settings: {
      timePerQuestion: 30,
      showAnswers: true,
      allowLateJoin: true,
      shuffleQuestions: false,
      shuffleAnswers: true,
      showLeaderboard: true,
      publicResults: false
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting':
        return {
          label: 'Esperando jugadores',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <ClockIcon className="h-4 w-4" />
        }
      case 'active':
        return {
          label: 'En progreso',
          color: 'bg-green-100 text-green-800',
          icon: <PlayIcon className="h-4 w-4" />
        }
      case 'paused':
        return {
          label: 'Pausado',
          color: 'bg-orange-100 text-orange-800',
          icon: <PauseIcon className="h-4 w-4" />
        }
      case 'completed':
        return {
          label: 'Completado',
          color: 'bg-gray-100 text-gray-800',
          icon: <StopIcon className="h-4 w-4" />
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: <QuestionMarkCircleIcon className="h-4 w-4" />
        }
    }
  }

  const statusInfo = getStatusInfo(game.status)

  const handleStartGame = () => {
    if (game.currentParticipants === 0) {
      toast.error('Necesitas al menos un participante para comenzar')
      return
    }
    toast.success('Iniciando juego...')
    router.push(`/teacher/game/${gameId}/lobby`)
  }

  const handlePauseGame = () => {
    toast.success('Juego pausado')
    setGameSession({ ...game, status: 'paused' })
  }

  const handleStopGame = () => {
    if (confirm('¿Estás seguro de que quieres terminar el juego?')) {
      toast.success('Juego terminado')
      router.push(`/teacher/game/${gameId}/results`)
    }
  }

  const handleShareCode = () => {
    navigator.clipboard.writeText(game.accessCode)
    toast.success('Código copiado al portapapeles')
  }

  const handleDuplicateGame = () => {
    toast.success('Juego duplicado exitosamente')
    router.push('/teacher/game/create?duplicate=' + gameId)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{game.title}</h1>
            <p className="text-gray-600">{game.quiz.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>Formato: {game.formatName}</span>
              <span>•</span>
              <span>Creado: {new Date(game.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Host: {game.host.name}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="ml-2">{statusInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {game.currentParticipants}/{game.maxParticipants}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <QuestionMarkCircleIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Preguntas</p>
                <p className="text-2xl font-bold text-gray-900">{game.totalQuestions}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tiempo por pregunta</p>
                <p className="text-2xl font-bold text-gray-900">{game.settings.timePerQuestion}s</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShareIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Código de acceso</p>
                <p className="text-2xl font-bold text-gray-900 font-mono">{game.accessCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {game.status === 'waiting' && (
            <Button
              onClick={handleStartGame}
              leftIcon={<PlayIcon className="h-4 w-4" />}
              className="w-full"
              disabled={game.currentParticipants === 0}
            >
              Iniciar Juego
            </Button>
          )}

          {game.status === 'active' && (
            <>
              <Button
                variant="outline"
                onClick={handlePauseGame}
                leftIcon={<PauseIcon className="h-4 w-4" />}
                className="w-full"
              >
                Pausar
              </Button>
              <Button
                variant="outline"
                onClick={handleStopGame}
                leftIcon={<StopIcon className="h-4 w-4" />}
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
              >
                Terminar
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => router.push(`/teacher/game/${gameId}/lobby`)}
            leftIcon={<UsersIcon className="h-4 w-4" />}
            className="w-full"
          >
            Ver Lobby
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/teacher/game/${gameId}/settings`)}
            leftIcon={<Cog6ToothIcon className="h-4 w-4" />}
            className="w-full"
          >
            Configuración
          </Button>

          {game.status === 'completed' && (
            <Button
              variant="outline"
              onClick={() => router.push(`/teacher/game/${gameId}/results`)}
              leftIcon={<ChartBarIcon className="h-4 w-4" />}
              className="w-full"
            >
              Ver Resultados
            </Button>
          )}
        </div>

        {/* Access Code Section */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Código de Acceso</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Los estudiantes pueden unirse usando este código
              </p>
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold font-mono text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
                  {game.accessCode}
                </span>
                <Button
                  variant="outline"
                  onClick={handleShareCode}
                  leftIcon={<ShareIcon className="h-4 w-4" />}
                >
                  Copiar
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">URL directa:</p>
              <p className="text-sm text-blue-600 font-mono">
                edu21.app/join/{game.accessCode}
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Information */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Información del Quiz</h3>
            <Button
              variant="outline"
              onClick={() => router.push(`/teacher/quiz/${game.quiz.id}`)}
              leftIcon={<EyeIcon className="h-4 w-4" />}
            >
              Ver Quiz
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Título</p>
              <p className="text-gray-900">{game.quiz.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Descripción</p>
              <p className="text-gray-900">{game.quiz.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Asignatura</p>
              <p className="text-gray-900">{game.quiz.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Curso</p>
              <p className="text-gray-900">{game.quiz.grade}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Dificultad</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                game.quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                game.quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {game.quiz.difficulty === 'easy' ? 'Fácil' : 
                 game.quiz.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Número de preguntas</p>
              <p className="text-gray-900">{game.quiz.questionCount}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleDuplicateGame}
            leftIcon={<DocumentDuplicateIcon className="h-4 w-4" />}
          >
            Duplicar Juego
          </Button>
          <Button
            onClick={() => router.push('/teacher/games')}
          >
            Volver a Juegos
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
} 