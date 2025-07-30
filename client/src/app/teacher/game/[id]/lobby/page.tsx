'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { 
  PlayIcon,
  StopIcon,
  Cog6ToothIcon,
  UsersIcon,
  ClockIcon,
  ShareIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { formatTimeAgo, getGameFormatDisplayName } from '@/lib/utils'
import type { GameParticipant } from '@/types'

export default function TeacherGameLobbyPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string
  const { user } = useAuth()
  
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isStarting, setIsStarting] = useState(false)

  // Fetch game session details
  const { data: gameSession, isLoading, refetch } = useQuery(
    ['game-session', sessionId],
    () => api.getGameSession(sessionId),
    {
      enabled: !!sessionId,
      refetchInterval: 2000 // Refresh every 2 seconds
    }
  )

  const participants = gameSession?.participants || []
  // Since GameParticipant doesn't have ready status, we'll assume all joined participants are ready
  const readyCount = participants.length
  const allReady = participants.length > 0

  const gameCode = (gameSession as any)?.join_code || sessionId.slice(-6).toUpperCase()

  const handleStartGame = async () => {
    console.log('🚀 INICIANDO JUEGO - Función handleStartGame')
    console.log('📝 Session ID:', sessionId)
    console.log('👥 Participants:', participants.length)
    
    // Allow demo games and gamified evaluations to start without participants
    const isGamifiedEvaluation = sessionId.startsWith('game_')
    console.log('🎮 Es evaluación gamificada?', isGamifiedEvaluation)
    
    if (participants.length === 0 && !sessionId.includes('demo') && !isGamifiedEvaluation) {
      console.log('❌ NO PERMITIDO - No hay participantes')
      toast.error('No hay participantes en el lobby')
      return
    }

    console.log('✅ PERMITIDO - Iniciando countdown...')
    setIsStarting(true)
    setCountdown(3)

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          return null
        }
        return prev - 1
      })
    }, 1000)

    try {
      // Wait for countdown
      console.log('⏰ Esperando countdown de 3 segundos...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('⏰ Countdown completado')
      
      // Start the game
      console.log('📡 LLAMANDO api.startGameSession con ID:', sessionId)
      const result = await api.startGameSession(sessionId)
      console.log('✅ RESPUESTA del servidor:', result)
      
      toast.success('¡Juego iniciado!')
      console.log('🎯 REDIRIGIENDO a control:', `/teacher/game/${sessionId}/control`)
      router.push(`/teacher/game/${sessionId}/control`)
    } catch (error: any) {
      console.error('❌ ERROR completo:', error)
      console.error('❌ ERROR message:', error?.message)
      console.error('❌ ERROR response:', error?.response?.data)
      console.error('❌ ERROR stack:', error?.stack)
      toast.error('Error al iniciar el juego')
      setIsStarting(false)
      setCountdown(null)
    }
  }

  const handleCancelGame = async () => {
    if (!confirm('¿Estás seguro de que quieres cancelar este juego?')) return

    try {
      // Use endGameSession to finish the game
      await api.endGameSession(sessionId)
      toast.success('Juego cancelado')
      router.push('/teacher/dashboard')
    } catch (error) {
      toast.error('Error al cancelar el juego')
    }
  }

  const copyJoinCode = () => {
    navigator.clipboard.writeText(gameCode)
    toast.success('Código copiado al portapapeles')
  }

  const shareGame = () => {
    const shareUrl = `${window.location.origin}/student/games/${sessionId}/join`
    
    if (navigator.share) {
      navigator.share({
        title: 'Únete al juego',
        text: `¡Únete a mi juego! Código: ${gameCode}`,
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  const removeParticipant = async (participantId: string) => {
    try {
      // For now, just show a message that this feature is not implemented
      toast('Función de remover participantes será implementada próximamente', {
        icon: 'ℹ️',
      })
    } catch (error) {
      toast.error('Error al eliminar participante')
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!gameSession) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Juego no encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            El juego que buscas no existe o ha sido eliminado
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push('/teacher/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lobby del Juego
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {gameSession.quizzes?.title} - {getGameFormatDisplayName(gameSession.format)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                leftIcon={<Cog6ToothIcon className="h-4 w-4" />}
                onClick={() => router.push(`/teacher/game/${sessionId}/settings`)}
              >
                Configurar
              </Button>
              <Button
                variant="outline"
                leftIcon={<EyeIcon className="h-4 w-4" />}
                onClick={() => router.push('/teacher/reports')}
              >
                Ver Reportes
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Info & Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Status */}
            <div className="card p-6">
              <div className="text-center">
                {countdown !== null ? (
                  <div>
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                      {countdown}
                    </div>
                    <p className="text-lg text-gray-600">El juego comenzará en...</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {gameCode}
                    </div>
                    <p className="text-lg text-gray-600 mb-4">
                      Código del juego
                    </p>
                    <div className="flex justify-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ShareIcon className="h-4 w-4" />}
                        onClick={copyJoinCode}
                      >
                        Copiar Código
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ShareIcon className="h-4 w-4" />}
                        onClick={shareGame}
                      >
                        Compartir
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Game Controls */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Controles del Juego</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Estado</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Esperando jugadores</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Participantes</h3>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-4 w-4 text-gray-500" />
                                         <span className="text-sm text-gray-600">
                       {participants.length} / {gameSession.settings_json?.max_players || 30}
                     </span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Listos</h3>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {readyCount} / {participants.length}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Tiempo límite</h3>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                                         <span className="text-sm text-gray-600">
                       {gameSession.settings_json?.time_limit || 30}s por pregunta
                     </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <Button
                  variant="outline"
                  leftIcon={<StopIcon className="h-4 w-4" />}
                  onClick={handleCancelGame}
                  disabled={isStarting}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  Cancelar Juego
                </Button>
                
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<PlayIcon className="h-4 w-4" />}
                  onClick={() => {
                    console.log('🔴 BOTÓN CLICKEADO - onClick ejecutado')
                    console.log('🔴 isStarting:', isStarting)
                    console.log('🔴 participants.length:', participants.length)
                    console.log('🔴 sessionId:', sessionId)
                    console.log('🔴 sessionId.includes("demo"):', sessionId.includes('demo'))
                    console.log('🔴 sessionId.startsWith("game_"):', sessionId.startsWith('game_'))
                    console.log('🔴 disabled condition:', isStarting || (participants.length === 0 && !sessionId.includes('demo') && !sessionId.startsWith('game_')))
                    handleStartGame()
                  }}
                  disabled={isStarting || (participants.length === 0 && !sessionId.includes('demo') && !sessionId.startsWith('game_'))}
                  className="px-8"
                >
                  {isStarting ? 'Iniciando...' : 'Iniciar Juego'}
                </Button>
              </div>

              {participants.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">
                        Participantes conectados
                      </h4>
                      <p className="text-sm text-green-700">
                        {participants.length} estudiante{participants.length !== 1 ? 's' : ''} conectado{participants.length !== 1 ? 's' : ''} y listo{participants.length !== 1 ? 's' : ''} para jugar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {participants.length === 0 && sessionId.includes('demo') && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <PlayIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">
                        Juego Demo Listo
                      </h4>
                      <p className="text-sm text-blue-700">
                        Este es un juego demo y puede iniciarse sin participantes. Los estudiantes podrán unirse durante el juego.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {participants.length === 0 && sessionId.startsWith('game_') && !sessionId.includes('demo') && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <PlayIcon className="h-5 w-5 text-green-400 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">
                        Evaluación Gamificada Lista
                      </h4>
                      <p className="text-sm text-green-700">
                        Esta evaluación gamificada puede iniciarse para modo de prueba sin estudiantes. También pueden unirse durante el juego.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants List */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Participantes ({participants.length})
            </h2>
            
            {participants.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No hay participantes
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Los estudiantes se unirán usando el código del juego
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {participants.map((participant: GameParticipant & { user?: { first_name: string; last_name: string } }) => (
                  <div
                    key={participant.user_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(participant.user?.first_name || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {participant.user?.first_name} {participant.user?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Se unió {formatTimeAgo(participant.joined_at)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Conectado</span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeParticipant(participant.user_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            Instrucciones para los estudiantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h3 className="font-medium mb-2">Para unirse al juego:</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>Ir a la página de juegos estudiantiles</li>
                <li>Hacer clic en "Unirse a juego"</li>
                                 <li>Ingresar el código: <strong className="font-mono">{gameCode}</strong></li>
                <li>Hacer clic en "Estoy listo" cuando estén preparados</li>
              </ol>
            </div>
            <div>
              <h3 className="font-medium mb-2">Durante el juego:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Responder las preguntas lo más rápido posible</li>
                <li>Las respuestas correctas y rápidas dan más puntos</li>
                <li>Ver el ranking en tiempo real</li>
                <li>¡Divertirse aprendiendo!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 