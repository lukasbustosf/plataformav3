'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function GameControlPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  
  const gameId = params.id as string

  const [gameState, setGameState] = useState('waiting')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [sessionCode] = useState('ABC123')

  const gameData = {
    id: gameId,
    title: 'Quiz Matemáticas - Ecuaciones',
    description: 'Juego interactivo sobre ecuaciones lineales',
    questions: [
      {
        id: 1,
        text: '¿Cuál es el valor de x en la ecuación 2x + 5 = 13?',
        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
        correct: 1
      }
    ],
    settings: {
      timePerQuestion: 30,
      totalQuestions: 3,
      pointsPerCorrect: 100
    }
  }

  const [participants] = useState([
    {
      id: 1,
      name: 'Ana García',
      status: 'connected',
      score: 200,
      correctAnswers: 2,
      answered: true
    },
    {
      id: 2,
      name: 'Carlos López',
      status: 'connected',
      score: 100,
      correctAnswers: 1,
      answered: false
    }
  ])

  const handleStartGame = () => {
    setGameState('active')
    toast.success('¡Juego iniciado!')
  }

  const handlePauseGame = () => {
    setGameState('paused')
    toast.success('Juego pausado')
  }

  const connectedParticipants = participants.filter(p => p.status === 'connected').length
  const answeredCount = participants.filter(p => p.answered).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">{gameData.title}</h1>
              <p className="text-gray-600">Control de Sesión • Código: {sessionCode}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {gameState === 'waiting' && (
              <Button onClick={handleStartGame} leftIcon={<PlayIcon className="h-4 w-4" />}>
                Iniciar Juego
              </Button>
            )}
            {gameState === 'active' && (
              <Button variant="outline" onClick={handlePauseGame} leftIcon={<PauseIcon className="h-4 w-4" />}>
                Pausar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {connectedParticipants}/{participants.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Tiempo</p>
                <p className="text-2xl font-bold text-gray-900">{timeRemaining}s</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pregunta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentQuestion + 1}/{gameData.questions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Respondidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {answeredCount}/{connectedParticipants}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participantes</h3>
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{participant.name}</p>
                    <p className="text-sm text-gray-600">
                      {participant.score} puntos • {participant.correctAnswers} correctas
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {participant.answered ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-orange-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 