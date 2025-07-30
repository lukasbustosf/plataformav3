'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UsersIcon, 
  ClockIcon, 
  PlayIcon, 
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  SpeakerWaveIcon,
  EyeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function StudentGameLobbyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, fullName } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [gameSession, setGameSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const gameId = params.id
  const joinCode = searchParams.get('code')

  // Fetch game session data from API
  useEffect(() => {
    const fetchGameSession = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/game/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const session = data.session || data
          
          // Format the session data for the UI
          const formattedSession = {
            id: session.session_id,
            title: session.title || session.quizzes?.title || 'Juego Demo',
            teacher: session.hosts?.first_name ? `${session.hosts.first_name} ${session.hosts.last_name}` : 'Profesor Demo',
            subject: getSubjectFromTitle(session.title || session.quizzes?.title || ''),
            format: session.format,
            formatName: formatName(session.format),
            formatIcon: getFormatIcon(session.format),
            joinCode: session.join_code || joinCode,
            maxPlayers: session.settings_json?.max_players || 30,
            timeLimit: session.settings_json?.time_limit || 30,
            settings: {
              show_correct_answers: session.settings_json?.show_correct_answers || true,
              allow_hints: session.settings_json?.allow_hints || false,
              accessibility_mode: session.settings_json?.accessibility_mode || true,
              tts_enabled: session.settings_json?.tts_enabled || true
            },
            status: session.status || 'waiting'
          }
          
          setGameSession(formattedSession)
          setIsConnected(true)
          toast.success(`Te has unido al juego "${formattedSession.title}"`)
        } else {
          toast.error('No se pudo cargar el juego')
          router.push('/student/games')
        }
      } catch (error) {
        console.error('Error fetching game session:', error)
        toast.error('Error al conectar con el juego')
        router.push('/student/games')
      } finally {
        setLoading(false)
      }
    }

    fetchGameSession()
  }, [gameId, joinCode, router])

  // Helper functions
  const getSubjectFromTitle = (title: string) => {
    if (title.includes('Matemática') || title.includes('Math')) return 'Matemáticas'
    if (title.includes('Lenguaje') || title.includes('Language')) return 'Lenguaje'
    if (title.includes('Ciencias') || title.includes('Science')) return 'Ciencias'
    if (title.includes('Historia') || title.includes('History')) return 'Historia'
    return 'Educación'
  }

  const formatName = (format: string) => {
    const formats: { [key: string]: string } = {
      'trivia_lightning': 'Trivia Lightning',
      'color_match': 'Color Match',
      'board_race': 'Board Race',
      'memory_flip': 'Memory Flip',
      'drag_drop_sorting': 'Drag & Drop'
    }
    return formats[format] || format.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getFormatIcon = (format: string) => {
    const icons: { [key: string]: string } = {
      'trivia_lightning': '⚡',
      'color_match': '🎨',
      'board_race': '🏁',
      'memory_flip': '🧠',
      'drag_drop_sorting': '🎯'
    }
    return icons[format] || '🎮'
  }

  // Mock participants data
  const [participants, setParticipants] = useState<any[]>([])

  // Initialize participants when gameSession is loaded
  useEffect(() => {
    if (gameSession) {
      setParticipants([
        { id: user?.user_id || 'current-user', name: fullName || 'Tú', isHost: false, isReady: true, isCurrentUser: true },
        { id: '2', name: 'Ana García', isHost: false, isReady: true, isCurrentUser: false },
        { id: '3', name: 'Carlos López', isHost: false, isReady: false, isCurrentUser: false },
        { id: '4', name: 'María Torres', isHost: false, isReady: true, isCurrentUser: false },
        { id: 'teacher', name: gameSession.teacher, isHost: true, isReady: true, isCurrentUser: false }
      ])
    }
  }, [gameSession, user?.user_id, fullName])

  // Remove the old connection simulation effect since we now fetch real data

  // Simulate countdown when game starts
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setGameStarted(true)
      // Redirect to actual game
      router.push(`/student/games/${gameId}/play`)
    }
  }, [countdown, gameId, router])

  const handleLeaveGame = () => {
    toast.success('Has salido del juego')
    router.push('/student/games')
  }

  const handleToggleReady = () => {
    setParticipants(prev => 
      prev.map(p => 
        p.isCurrentUser ? { ...p, isReady: !p.isReady } : p
      )
    )
  }

  const simulateGameStart = () => {
    setCountdown(5)
    toast.success('¡El juego comenzará en 5 segundos!')
  }

  if (loading || !gameSession) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Cargando juego...</h2>
            <p className="text-gray-600">Espera un momento mientras cargamos los datos del juego</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-3xl">{gameSession.formatIcon}</div>
                <div>
                  <h1 className="text-2xl font-bold">{gameSession.title}</h1>
                  <p className="opacity-90">{gameSession.teacher} • {gameSession.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <span>📝 {gameSession.formatName}</span>
                <span>⏱️ {gameSession.timeLimit}s por pregunta</span>
                <span>👥 Máx. {gameSession.maxPlayers} jugadores</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Código de Sala</div>
              <div className="text-2xl font-mono font-bold">{gameSession.joinCode}</div>
            </div>
          </div>
        </div>

        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¡El juego comenzará en...</h2>
              <div className="text-6xl font-bold text-purple-600 mb-4">{countdown}</div>
              <p className="text-gray-600">¡Prepárate!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participants Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Participantes ({participants.length}/{gameSession?.maxPlayers || 0})
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {participants.slice(0, 3).map((participant, index) => (
                        <div
                          key={participant.id}
                          className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 border-2 border-white"
                        >
                          {participant.name.charAt(0)}
                        </div>
                      ))}
                      {participants.length > 3 && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 border-2 border-white">
                          +{participants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        participant.isCurrentUser 
                          ? 'border-purple-200 bg-purple-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          participant.isHost 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : participant.isCurrentUser
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{participant.name}</span>
                            {participant.isHost && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Anfitrión
                              </span>
                            )}
                            {participant.isCurrentUser && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                Tú
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {participant.isReady ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircleIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">Listo</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-gray-400">
                            <ClockIcon className="h-4 w-4" />
                            <span className="text-sm">Esperando...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {gameSession && participants.length < gameSession.maxPlayers && (
                  <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
                    <UsersIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Esperando más jugadores...</p>
                    <p className="text-xs">Comparte el código: <strong>{gameSession.joinCode}</strong></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Game Info & Controls */}
          <div className="space-y-6">
            {/* Game Settings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Configuración del Juego</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Tiempo por pregunta</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{gameSession.timeLimit}s</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Mostrar respuestas</span>
                    </div>
                    <span className={`text-sm font-medium ${gameSession.settings.show_correct_answers ? 'text-green-600' : 'text-red-600'}`}>
                      {gameSession.settings.show_correct_answers ? 'Sí' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SpeakerWaveIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Audio (TTS)</span>
                    </div>
                    <span className={`text-sm font-medium ${gameSession.settings.tts_enabled ? 'text-green-600' : 'text-red-600'}`}>
                      {gameSession.settings.tts_enabled ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cog6ToothIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Accesibilidad</span>
                    </div>
                    <span className={`text-sm font-medium ${gameSession.settings.accessibility_mode ? 'text-green-600' : 'text-red-600'}`}>
                      {gameSession.settings.accessibility_mode ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Controles</h3>
              </div>
              <div className="p-6 space-y-4">
                <Button
                  onClick={handleToggleReady}
                  variant={participants.find(p => p.isCurrentUser)?.isReady ? "secondary" : "primary"}
                  className="w-full"
                  leftIcon={<CheckCircleIcon className="h-4 w-4" />}
                >
                  {participants.find(p => p.isCurrentUser)?.isReady ? 'Listo ✓' : 'Marcar como Listo'}
                </Button>

                {/* Demo button to simulate game start */}
                <Button
                  onClick={simulateGameStart}
                  variant="game"
                  className="w-full"
                  leftIcon={<PlayIcon className="h-4 w-4" />}
                >
                  [Demo] Iniciar Juego
                </Button>

                <Button
                  onClick={handleLeaveGame}
                  variant="outline"
                  className="w-full"
                  leftIcon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                >
                  Salir del Juego
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">¿Cómo jugar?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Espera a que el profesor inicie el juego</li>
                <li>• Responde las preguntas lo más rápido posible</li>
                <li>• Ganarás más puntos por respuestas rápidas y correctas</li>
                <li>• ¡Que tengas suerte! 🍀</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 