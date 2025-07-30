'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PlayIcon, 
  UsersIcon, 
  ClockIcon, 
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function StudentGameDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('details')

  // Mock data for the specific game
  const gameData = {
    id: id,
    title: 'Trivia Matemáticas: Ecuaciones Lineales',
    teacher: 'Prof. María González',
    subject: 'Matemáticas',
    formatName: 'Trivia Lightning',
    formatIcon: '⚡',
    description: 'Pon a prueba tus conocimientos sobre ecuaciones lineales en este divertido trivia.',
    status: 'waiting',
    joinCode: 'MATH123',
    maxPlayers: 30,
    currentPlayers: 24,
    timeLimit: 30,
    difficulty: 'Intermedio',
    startsIn: '5 minutos',
    duration: '20 minutos',
    totalQuestions: 15,
    pointsPerQuestion: 100,
    topics: [
      'Resolución de ecuaciones lineales',
      'Sistemas de ecuaciones',
      'Aplicaciones en problemas reales',
      'Gráficas de funciones lineales'
    ]
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'waiting':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <ClockIcon className="h-4 w-4" />,
          text: `Inicia en ${gameData.startsIn}`,
          canJoin: true
        }
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <PlayIcon className="h-4 w-4" />,
          text: 'En curso',
          canJoin: true
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <InformationCircleIcon className="h-4 w-4" />,
          text: 'Terminado',
          canJoin: false
        }
    }
  }

  const statusInfo = getStatusInfo(gameData.status)

  const handleJoinGame = () => {
    router.push(`/student/games/${id}/lobby`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800'
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800'
      case 'Difícil': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const tabs = [
    { id: 'details', name: 'Detalles' },
    { id: 'topics', name: 'Temas' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{gameData.formatIcon}</div>
              <div>
                <h1 className="text-3xl font-bold">{gameData.title}</h1>
                <p className="mt-2 opacity-90">{gameData.teacher} • {gameData.subject}</p>
                <p className="text-sm opacity-75">{gameData.formatName}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="font-medium">{statusInfo.text}</span>
            </div>
          </div>
          <p className="mt-4 opacity-90 max-w-3xl">{gameData.description}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Jugadores</p>
                <p className="text-2xl font-bold text-gray-900">{gameData.currentPlayers}/{gameData.maxPlayers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Duración</p>
                <p className="text-2xl font-bold text-gray-900">{gameData.duration}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Preguntas</p>
                <p className="text-2xl font-bold text-gray-900">{gameData.totalQuestions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Puntos Máx.</p>
                <p className="text-2xl font-bold text-gray-900">{gameData.totalQuestions * gameData.pointsPerQuestion}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Actions */}
        {statusInfo.canJoin && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">¿Listo para jugar?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Código de acceso: <span className="font-mono font-bold text-purple-600">{gameData.joinCode}</span>
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleJoinGame}
                  leftIcon={<PlayIcon className="h-5 w-5" />}
                  size="lg"
                >
                  Unirse al Juego
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Juego</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dificultad:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(gameData.difficulty)}`}>
                        {gameData.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo por pregunta:</span>
                      <span className="font-medium">{gameData.timeLimit}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Puntos por pregunta:</span>
                      <span className="font-medium">{gameData.pointsPerQuestion}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Topics Tab */}
            {activeTab === 'topics' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Temas a Evaluar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gameData.topics.map((topic, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-sm font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 