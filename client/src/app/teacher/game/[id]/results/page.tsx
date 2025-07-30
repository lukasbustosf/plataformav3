'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  ArrowLeftIcon,
  TrophyIcon,
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  AcademicCapIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

export default function GameResultsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const gameId = params.id as string
  const [selectedTab, setSelectedTab] = useState('overview')

  // Mock game data
  const gameData = {
    id: gameId,
    title: 'Quiz de Matemáticas - Fracciones',
    format: 'Trivia Lightning',
    startTime: '2024-01-19T14:30:00Z',
    endTime: '2024-01-19T15:15:00Z',
    status: 'completed',
    totalQuestions: 15,
    totalPlayers: 24,
    completedPlayers: 22,
    averageScore: 78.5,
    averageTime: 145,
    class: '8° A',
    subject: 'Matemáticas'
  }

  const playerResults = [
    {
      id: 1,
      name: 'María González',
      score: 1350,
      correctAnswers: 13,
      totalAnswers: 15,
      accuracy: 86.7,
      timeSpent: 125,
      position: 1,
      badges: ['speed_demon', 'accuracy_ace']
    },
    {
      id: 2,
      name: 'Ana López',
      score: 1280,
      correctAnswers: 12,
      totalAnswers: 15,
      accuracy: 80.0,
      timeSpent: 138,
      position: 2,
      badges: ['consistent_player']
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      score: 1150,
      correctAnswers: 11,
      totalAnswers: 15,
      accuracy: 73.3,
      timeSpent: 156,
      position: 3,
      badges: ['participant']
    },
    {
      id: 4,
      name: 'Pedro Martínez',
      score: 980,
      correctAnswers: 9,
      totalAnswers: 15,
      accuracy: 60.0,
      timeSpent: 189,
      position: 4,
      badges: ['effort_star']
    }
  ]

  const questionAnalysis = [
    {
      id: 1,
      question: '¿Cuál es el resultado de 3/4 + 1/2?',
      correctAnswer: '5/4',
      correctCount: 18,
      incorrectCount: 4,
      accuracy: 81.8,
      averageTime: 12.5,
      difficulty: 'medium',
      commonMistakes: ['1/2', '4/6', '3/6']
    },
    {
      id: 2,
      question: 'Simplifica la fracción 12/16',
      correctAnswer: '3/4',
      correctCount: 20,
      incorrectCount: 2,
      accuracy: 90.9,
      averageTime: 8.3,
      difficulty: 'easy',
      commonMistakes: ['6/8', '12/16']
    },
    {
      id: 3,
      question: '¿Cuál es el equivalente decimal de 3/8?',
      correctAnswer: '0.375',
      correctCount: 14,
      incorrectCount: 8,
      accuracy: 63.6,
      averageTime: 18.7,
      difficulty: 'hard',
      commonMistakes: ['0.38', '0.3', '0.25']
    }
  ]

  const learningObjectives = [
    { objective: 'Sumar fracciones con diferente denominador', mastery: 85, students: 19 },
    { objective: 'Simplificar fracciones', mastery: 92, students: 20 },
    { objective: 'Convertir fracciones a decimales', mastery: 68, students: 15 },
    { objective: 'Identificar fracciones equivalentes', mastery: 76, students: 17 }
  ]

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'speed_demon': return '⚡'
      case 'accuracy_ace': return '🎯'
      case 'consistent_player': return '📈'
      case 'participant': return '🌟'
      case 'effort_star': return '💪'
      default: return '🏆'
    }
  }

  const getBadgeName = (badge: string) => {
    switch (badge) {
      case 'speed_demon': return 'Demonio de Velocidad'
      case 'accuracy_ace': return 'As de Precisión'
      case 'consistent_player': return 'Jugador Consistente'
      case 'participant': return 'Participante'
      case 'effort_star': return 'Estrella del Esfuerzo'
      default: return badge
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleExportResults = () => {
    toast.success('Exportando resultados a Excel...')
  }

  const handleShareResults = () => {
    toast.success('Enlace de resultados copiado al portapapeles')
  }

  const handlePlayAgain = () => {
    router.push(`/teacher/game/${gameId}/lobby`)
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Game Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{gameData.totalPlayers}</div>
          <div className="text-sm text-blue-600">Jugadores Totales</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <TrophyIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{gameData.averageScore.toFixed(1)}%</div>
          <div className="text-sm text-green-600">Promedio de Puntuación</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{gameData.averageTime}s</div>
          <div className="text-sm text-purple-600">Tiempo Promedio</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-6 text-center">
          <ChartBarIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{gameData.completedPlayers}</div>
          <div className="text-sm text-orange-600">Completaron el Juego</div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">🏆 Top 10 Jugadores</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {playerResults.slice(0, 10).map((player, index) => (
              <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{player.name}</div>
                    <div className="text-sm text-gray-600">
                      {player.correctAnswers}/{player.totalAnswers} correctas • {player.accuracy}% precisión
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {player.badges.map((badge, badgeIndex) => (
                      <span key={badgeIndex} className="text-lg" title={getBadgeName(badge)}>
                        {getBadgeIcon(badge)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{player.score}</div>
                  <div className="text-sm text-gray-600">{player.timeSpent}s</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Objectives Mastery */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">📚 Dominio de Objetivos de Aprendizaje</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {learningObjectives.map((objective, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{objective.objective}</span>
                  <span className="text-sm text-gray-600">{objective.students} estudiantes • {objective.mastery}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      objective.mastery >= 80 ? 'bg-green-500' : 
                      objective.mastery >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${objective.mastery}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPlayersTab = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Resultados Detallados por Estudiante</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntuación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiempo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logros
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {playerResults.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    player.position === 1 ? 'bg-yellow-500' : 
                    player.position === 2 ? 'bg-gray-400' : 
                    player.position === 3 ? 'bg-amber-600' : 'bg-blue-500'
                  }`}>
                    {player.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{player.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{player.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {player.correctAnswers}/{player.totalAnswers} ({player.accuracy}%)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{player.timeSpent}s</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-1">
                    {player.badges.map((badge, index) => (
                      <span key={index} className="text-lg" title={getBadgeName(badge)}>
                        {getBadgeIcon(badge)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderQuestionsTab = () => (
    <div className="space-y-6">
      {questionAnalysis.map((question, index) => (
        <div key={question.id} className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pregunta {index + 1}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pregunta:</h4>
                <p className="text-gray-700">{question.question}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Respuesta Correcta:</h4>
                <p className="text-green-700 font-medium">{question.correctAnswer}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-green-900">{question.correctCount}</div>
                  <div className="text-sm text-green-600">Correctas</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <XCircleIcon className="h-6 w-6 text-red-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-red-900">{question.incorrectCount}</div>
                  <div className="text-sm text-red-600">Incorrectas</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <ClockIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-900">{question.averageTime}s</div>
                  <div className="text-sm text-blue-600">Tiempo Promedio</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Errores Comunes:</h4>
                <div className="flex flex-wrap gap-2">
                  {question.commonMistakes.map((mistake, mistakeIndex) => (
                    <span key={mistakeIndex} className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      {mistake}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${question.accuracy}%` }}
                >
                  {question.accuracy}%
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: ChartBarIcon },
    { id: 'players', name: 'Jugadores', icon: UsersIcon },
    { id: 'questions', name: 'Preguntas', icon: QuestionMarkCircleIcon }
  ]

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
              <h1 className="text-2xl font-bold text-gray-900">Resultados del Juego</h1>
              <p className="text-gray-600">{gameData.title} • {gameData.class}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleShareResults}
              leftIcon={<ShareIcon className="h-4 w-4" />}
            >
              Compartir
            </Button>
            <Button
              variant="outline"
              onClick={handleExportResults}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Exportar
            </Button>
            <Button
              variant="primary"
              onClick={handlePlayAgain}
              leftIcon={<TrophyIcon className="h-4 w-4" />}
            >
              Jugar de Nuevo
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Formato:</span>
              <p className="text-gray-900">{gameData.format}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Fecha:</span>
              <p className="text-gray-900">{new Date(gameData.startTime).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Duración:</span>
              <p className="text-gray-900">
                {Math.round((new Date(gameData.endTime).getTime() - new Date(gameData.startTime).getTime()) / (1000 * 60))} min
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Estado:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                Completado
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {selectedTab === 'overview' && renderOverviewTab()}
            {selectedTab === 'players' && renderPlayersTab()}
            {selectedTab === 'questions' && renderQuestionsTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 