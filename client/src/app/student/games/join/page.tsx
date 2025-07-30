'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon, UserGroupIcon, PlayIcon } from '@heroicons/react/24/outline'

function JoinGameContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [gameCode, setGameCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Pre-fill code from URL if provided
    const codeFromUrl = searchParams.get('code')
    if (codeFromUrl) {
      setGameCode(codeFromUrl.toUpperCase())
    }
  }, [searchParams])

  const handleJoinGame = async () => {
    if (!gameCode.trim()) {
      setError('Por favor ingresa un código de juego')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log(`🎮 Attempting to join game with code: ${gameCode}`)
      
      const response = await fetch(`http://localhost:5000/api/game/join/${gameCode}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer demo-token-student`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: 'demo-student-001'
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Successfully joined game:', result)
        
        // Redirect to game play page
        router.push(`/student/games/${result.game_id}/play`)
      } else {
        const errorData = await response.json()
        setError(errorData.error?.message || 'No se pudo unir al juego')
      }
    } catch (error) {
      console.error('❌ Error joining game:', error)
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinGame()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <UserGroupIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Unirse a Juego</h1>
          <p className="text-gray-600">
            Ingresa el código proporcionado por tu profesor para unirte al juego
          </p>
        </div>

        {/* Join Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Juego
              </label>
              <input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Ej: DM01, DEMO1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={6}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleJoinGame}
              disabled={loading || !gameCode.trim()}
              className="w-full py-3"
              leftIcon={loading ? undefined : <PlayIcon className="h-5 w-5" />}
            >
              {loading ? 'Uniéndose...' : 'Unirse al Juego'}
            </Button>
          </div>
        </div>

        {/* Helper Info */}
        <div className="mt-6 text-center">
          <div className="bg-white/70 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">💡 Consejos</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>• El código lo proporciona tu profesor</p>
              <p>• Generalmente son 4-6 caracteres</p>
              <p>• Asegúrate de que el juego esté activo</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/student')}
            leftIcon={<ChevronRightIcon className="h-4 w-4 rotate-180" />}
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function JoinGamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <JoinGameContent />
    </Suspense>
  )
} 