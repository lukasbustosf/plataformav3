'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  PlayIcon, 
  UsersIcon, 
  ClockIcon, 
  TrophyIcon,
  SparklesIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function StudentGamesPage() {
  const router = useRouter()
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('available')
  const [joinCode, setJoinCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  // Mock data for available games
  const availableGames = [
    {
      id: 1,
      title: 'Trivia de Matemáticas',
      teacher: 'Prof. María González',
      format: 'trivia_lightning',
      formatName: 'Trivia Lightning',
      formatIcon: '⚡',
      players: 24,
      maxPlayers: 30,
      timeLimit: 30,
      subject: 'Matemáticas',
      difficulty: 'Medio',
      status: 'waiting',
      joinCode: 'MATH123',
      startsIn: '5 min'
    },
    {
      id: 2,
      title: 'Historia de Chile',
      teacher: 'Prof. Carlos Ruiz',
      format: 'board_race',
      formatName: 'Board Race',
      formatIcon: '🏁',
      players: 18,
      maxPlayers: 25,
      timeLimit: 45,
      subject: 'Historia',
      difficulty: 'Fácil',
      status: 'active',
      joinCode: 'HIST456',
      startsIn: 'En curso'
    }
  ]

  const gameHistory = [
    {
      id: 1,
      title: 'Quiz de Ciencias',
      format: 'color_match',
      formatName: 'Color Match',
      formatIcon: '🎨',
      score: 850,
      accuracy: 85,
      position: 3,
      totalPlayers: 22,
      playedAt: '2024-12-18',
      duration: '12 min'
    },
    {
      id: 2,
      title: 'Matemáticas Básicas',
      format: 'trivia_lightning',
      formatName: 'Trivia Lightning',
      formatIcon: '⚡',
      score: 920,
      accuracy: 92,
      position: 1,
      totalPlayers: 28,
      playedAt: '2024-12-17',
      duration: '8 min'
    },
    {
      id: 3,
      title: 'Vocabulario Inglés',
      format: 'memory_flip',
      formatName: 'Memory Flip',
      formatIcon: '🧠',
      score: 650,
      accuracy: 65,
      position: 8,
      totalPlayers: 30,
      playedAt: '2024-12-16',
      duration: '15 min'
    }
  ]

  const achievements = [
    { id: 1, name: 'Velocista', description: 'Responder 5 preguntas en menos de 10 segundos', icon: '⚡', earned: true },
    { id: 2, name: 'Perfeccionista', description: 'Obtener 100% de precisión en un juego', icon: '🎯', earned: true },
    { id: 3, name: 'Competitivo', description: 'Ganar 3 juegos consecutivos', icon: '🏆', earned: false },
    { id: 4, name: 'Persistente', description: 'Jugar 10 juegos en una semana', icon: '💪', earned: false }
  ]

  const joinGame = (gameId: string, joinCode: string) => {
    router.push(`/student/games/${gameId}/lobby?code=${joinCode}`)
  }

  const joinWithCode = async () => {
    if (!joinCode.trim()) return
    
    setIsJoining(true)
    try {
      // First, try to find the game with this code
      const response = await fetch(`http://localhost:5000/api/game/join/${joinCode.toUpperCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ student_id: user?.user_id })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/student/games/${data.game_id}/lobby?code=${joinCode.toUpperCase()}`)
      } else {
        alert('Código de juego no válido o juego no disponible')
      }
    } catch (error) {
      console.error('Error joining game:', error)
      alert('Error al unirse al juego. Inténtalo de nuevo.')
    } finally {
      setIsJoining(false)
    }
  }

  const tabs = [
    { id: 'available', name: 'Juegos Disponibles', count: availableGames.length },
    { id: 'history', name: 'Mi Historial', count: gameHistory.length },
    { id: 'achievements', name: 'Logros', count: achievements.filter(a => a.earned).length }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Centro de Juegos 🎮</h1>
          <p className="mt-2 opacity-90">
            ¡Hola {fullName}! Únete a juegos educativos divertidos y pon a prueba tus conocimientos.
          </p>
        </div>

        {/* Quick Join Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">🚀 Unirse a un Juego</h2>
              <p className="text-sm text-gray-600 mb-4">
                ¿Tienes un código de juego? Ingrésalo aquí para unirte inmediatamente.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Ingresa el código (ej: DEMO01)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && joinWithCode()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-mono text-lg tracking-wider"
                    maxLength={6}
                  />
                </div>
                <Button
                  onClick={joinWithCode}
                  disabled={!joinCode.trim() || isJoining}
                  leftIcon={<PlayIcon className="h-5 w-5" />}
                  className="px-8 py-3"
                >
                  {isJoining ? 'Uniéndose...' : 'Unirse'}
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-medium text-gray-700">Códigos Demo</div>
                  <div className="text-xs text-gray-600 mt-1">
                    DEMO01, DEMO02, DEMO03
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Juegos Jugados</p>
                <p className="text-2xl font-bold text-gray-900">{gameHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mejor Posición</p>
                <p className="text-2xl font-bold text-gray-900">1°</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Precisión Promedio</p>
                <p className="text-2xl font-bold text-gray-900">81%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Logros</p>
                <p className="text-2xl font-bold text-gray-900">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
              </div>
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
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-purple-100 text-purple-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Available Games Tab */}
            {activeTab === 'available' && (
              <div className="space-y-4">
                {availableGames.length === 0 ? (
                  <div className="text-center py-12">
                    <PlayIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay juegos disponibles</h3>
                    <p className="text-gray-600">Tus profesores publicarán juegos aquí cuando estén listos.</p>
                  </div>
                ) : (
                  availableGames.map((game) => (
                    <div key={game.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="text-2xl">{game.formatIcon}</div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{game.title}</h3>
                              <p className="text-sm text-gray-600">{game.teacher} • {game.subject}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">Formato</div>
                              <div className="font-medium">{game.formatName}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Jugadores</div>
                              <div className="font-medium">{game.players}/{game.maxPlayers}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Tiempo límite</div>
                              <div className="font-medium">{game.timeLimit}s</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Dificultad</div>
                              <div className="font-medium">{game.difficulty}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              game.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                              game.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {game.status === 'waiting' ? `Inicia en ${game.startsIn}` :
                               game.status === 'active' ? 'En curso' : 'Terminado'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Código: <span className="font-mono font-medium">{game.joinCode}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 flex flex-col space-y-2">
                          <Button
                            onClick={() => joinGame(game.id.toString(), game.joinCode)}
                            leftIcon={<PlayIcon className="h-4 w-4" />}
                            disabled={game.status === 'finished'}
                          >
                            {game.status === 'waiting' ? 'Unirse' : 'Ver Juego'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<EyeIcon className="h-3 w-3" />}
                            onClick={() => router.push(`/student/games/${game.id}`)}
                          >
                            Detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Game History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {gameHistory.map((game) => (
                  <div key={game.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{game.formatIcon}</div>
                        <div>
                          <h3 className="font-medium text-gray-900">{game.title}</h3>
                          <p className="text-sm text-gray-600">{game.formatName}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{game.playedAt}</span>
                        </div>
                        <div className="text-sm text-gray-500">Duración: {game.duration}</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{game.score}</div>
                        <div className="text-sm text-gray-600">Puntuación</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{game.accuracy}%</div>
                        <div className="text-sm text-gray-600">Precisión</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xl font-bold ${
                          game.position <= 3 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {game.position}°
                        </div>
                        <div className="text-sm text-gray-600">Posición</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{game.totalPlayers}</div>
                        <div className="text-sm text-gray-600">Participantes</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`border-2 rounded-lg p-6 ${
                    achievement.earned 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start space-x-4">
                      <div className={`text-3xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned && (
                          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ✓ Conseguido
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 