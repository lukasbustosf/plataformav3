'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { announceToScreenReader, cn } from '@/lib/utils'
import type { GameComponentProps } from '@/types'

interface EscapeRoomMiniProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface Puzzle {
  id: number
  type: 'code' | 'pattern' | 'math' | 'riddle'
  question: string
  solution: string | number
  hint?: string
  completed: boolean
}

interface Room {
  id: number
  name: string
  description: string
  puzzles: Puzzle[]
  unlocked: boolean
  completed: boolean
}

export function EscapeRoomMini({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 600, // 10 minutes
  accessibility = true,
  soundEnabled = true
}: EscapeRoomMiniProps) {
  const [currentRoom, setCurrentRoom] = useState(0)
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [userInput, setUserInput] = useState('')
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'escaped' | 'trapped'>('waiting')
  const [score, setScore] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [showHint, setShowHint] = useState(false)
  const [atmosphere, setAtmosphere] = useState('🔦') // Changes based on progress
  
  const inputRef = useRef<HTMLInputElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Escape room configuration
  const escapeRooms: Room[] = [
    {
      id: 1,
      name: 'Biblioteca Misteriosa',
      description: 'Libros antiguos guardan secretos...',
      unlocked: true,
      completed: false,
      puzzles: [
        {
          id: 1,
          type: 'math',
          question: 'En el estante hay 24 libros. Si tomas 1/3, ¿cuántos libros tienes?',
          solution: 8,
          hint: 'Un tercio de 24 es...',
          completed: false
        },
        {
          id: 2,
          type: 'riddle',
          question: 'Tengo páginas pero no soy un libro, tengo hojas pero no soy un árbol. ¿Qué soy?',
          solution: 'CUADERNO',
          hint: 'Lo usas para escribir en la escuela',
          completed: false
        }
      ]
    },
    {
      id: 2,
      name: 'Laboratorio Secreto',
      description: 'Experimentos extraños llenan el aire...',
      unlocked: false,
      completed: false,
      puzzles: [
        {
          id: 3,
          type: 'pattern',
          question: 'Completa la secuencia: 2, 4, 8, 16, ?',
          solution: 32,
          hint: 'Cada número se multiplica por 2',
          completed: false
        },
        {
          id: 4,
          type: 'code',
          question: 'El código es el número de letras en "CIENCIA"',
          solution: 7,
          hint: 'Cuenta letra por letra',
          completed: false
        }
      ]
    },
    {
      id: 3,
      name: 'Cámara Final',
      description: 'La salida está cerca... pero vigilada',
      unlocked: false,
      completed: false,
      puzzles: [
        {
          id: 5,
          type: 'math',
          question: 'La puerta se abre cuando: 5 × 6 + 3 × 4 = ?',
          solution: 42,
          hint: 'Recuerda el orden de operaciones',
          completed: false
        }
      ]
    }
  ]

  // Initialize game
  useEffect(() => {
    setRooms(escapeRooms)
    setCurrentPuzzle(escapeRooms[0].puzzles[0])
    setGamePhase('playing')
    
    if (accessibility) {
      announceToScreenReader('Bienvenido al Escape Room Mini. Tienes 10 minutos para escapar.')
    }
  }, [])

  // Update atmosphere based on time remaining
  useEffect(() => {
    if (timeRemaining > 480) setAtmosphere('🔦') // Bright
    else if (timeRemaining > 300) setAtmosphere('🕯️') // Dimming
    else if (timeRemaining > 120) setAtmosphere('⚡') // Urgent
    else setAtmosphere('💀') // Critical
  }, [timeRemaining])

  // Check for game end conditions
  useEffect(() => {
    if (timeRemaining <= 0 && gamePhase === 'playing') {
      setGamePhase('trapped')
      setTimeout(() => onGameEnd(), 3000)
    }
  }, [timeRemaining, gamePhase, onGameEnd])

  const submitAnswer = useCallback(() => {
    if (!currentPuzzle || !userInput.trim()) return

    const answer = currentPuzzle.type === 'riddle' || currentPuzzle.type === 'code' 
      ? userInput.toUpperCase().trim()
      : parseInt(userInput.trim())

    const isCorrect = answer === currentPuzzle.solution

    if (isCorrect) {
      // Mark puzzle as completed
      setRooms(prev => prev.map(room => ({
        ...room,
        puzzles: room.puzzles.map(puzzle => 
          puzzle.id === currentPuzzle.id ? { ...puzzle, completed: true } : puzzle
        )
      })))

      setScore(prev => prev + (50 - hintsUsed * 10))
      
      if (audioEnabled) {
        playSuccessSound()
      }

      if (accessibility) {
        announceToScreenReader(`¡Correcto! Puzzle resuelto. Puntos ganados: ${50 - hintsUsed * 10}`)
      }

      // Check if current room is completed
      const updatedRoom = rooms[currentRoom]
      const allPuzzlesCompleted = updatedRoom.puzzles.every(p => 
        p.id === currentPuzzle.id || p.completed
      )

      if (allPuzzlesCompleted) {
        // Room completed, unlock next room
        setTimeout(() => {
          if (currentRoom < rooms.length - 1) {
            setRooms(prev => prev.map((room, index) => 
              index === currentRoom + 1 ? { ...room, unlocked: true } : room
            ))
            setCurrentRoom(currentRoom + 1)
            setCurrentPuzzle(rooms[currentRoom + 1].puzzles[0])
            
            if (accessibility) {
              announceToScreenReader(`Sala completada. Avanzando a: ${rooms[currentRoom + 1].name}`)
            }
          } else {
            // All rooms completed - escaped!
            setGamePhase('escaped')
            setTimeout(() => onGameEnd(), 5000)
          }
        }, 2000)
      } else {
        // Move to next puzzle in current room
        const nextPuzzle = updatedRoom.puzzles.find(p => !p.completed && p.id !== currentPuzzle.id)
        if (nextPuzzle) {
          setTimeout(() => {
            setCurrentPuzzle(nextPuzzle)
          }, 1500)
        }
      }
    } else {
      if (audioEnabled) {
        playErrorSound()
      }
      
      if (accessibility) {
        announceToScreenReader('Respuesta incorrecta. Inténtalo de nuevo.')
      }
    }

    setUserInput('')
    setShowHint(false)
    onAnswer(answer)
  }, [currentPuzzle, userInput, hintsUsed, audioEnabled, accessibility, rooms, currentRoom, onAnswer, onGameEnd])

  const useHint = () => {
    setShowHint(true)
    setHintsUsed(prev => prev + 1)
    
    if (accessibility && currentPuzzle?.hint) {
      announceToScreenReader(`Pista: ${currentPuzzle.hint}`)
    }
  }

  const playSuccessSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Play unlock sound
      const frequencies = [523, 659, 784] // C, E, G chord
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = freq
        oscillator.type = 'sine'
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.5)
        
        oscillator.start(audioContext.currentTime + index * 0.1)
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.5)
      })
    }
  }

  const playErrorSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 220
      oscillator.type = 'sawtooth'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    }
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔓</div>
          <h2 className="text-2xl font-bold mb-2">Escape Room Mini</h2>
          <p className="text-gray-300">Preparando la aventura...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'escaped') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-emerald-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">¡ESCAPASTE!</h2>
          <p className="text-xl mb-2">Puntuación: {score}</p>
          <p className="text-lg">Tiempo restante: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</p>
          <p className="text-md text-green-200 mt-2">Pistas utilizadas: {hintsUsed}</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'trapped') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold mb-2">¡TIEMPO AGOTADO!</h2>
          <p className="text-xl mb-2">Quedaste atrapado...</p>
          <p className="text-lg">Puntuación: {score}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b-4 border-orange-500">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔓</span>
              </div>
              <h1 className="text-xl font-bold text-white">Escape Room Mini</h1>
              <div className="text-2xl">{atmosphere}</div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-label={audioEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              >
                {audioEnabled ? (
                  <SpeakerWaveIcon className="h-5 w-5 text-gray-300" />
                ) : (
                  <SpeakerXMarkIcon className="h-5 w-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-300">Puntos:</span>
                <span className="text-lg font-bold text-orange-400">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-300">Sala:</span>
                <span className="text-lg font-bold text-white">{currentRoom + 1}/{rooms.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-300">Pistas:</span>
                <span className="text-lg font-bold text-yellow-400">{hintsUsed}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-300">Tiempo:</span>
              <span className={cn(
                'text-lg font-bold',
                timeRemaining > 300 ? 'text-green-400' : 
                timeRemaining > 120 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Room Progress */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Progreso de Escape</h3>
          <div className="flex items-center space-x-4">
            {rooms.map((room, index) => (
              <div key={room.id} className="flex items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2',
                  room.completed 
                    ? 'bg-green-600 border-green-500 text-white'
                    : room.unlocked
                    ? 'bg-orange-600 border-orange-500 text-white'
                    : 'bg-gray-600 border-gray-500 text-gray-400'
                )}>
                  {room.completed ? <LockOpenIcon className="h-5 w-5" /> : 
                   room.unlocked ? (index + 1) : <LockClosedIcon className="h-5 w-5" />}
                </div>
                {index < rooms.length - 1 && (
                  <div className={cn(
                    'w-8 h-1 mx-2',
                    room.completed ? 'bg-green-500' : 'bg-gray-600'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Room */}
        {rooms[currentRoom] && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {rooms[currentRoom].name}
              </h2>
              <p className="text-gray-300">{rooms[currentRoom].description}</p>
            </div>

            {/* Current Puzzle */}
            {currentPuzzle && (
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-orange-400">
                      Puzzle #{currentPuzzle.id}
                    </h3>
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      {
                        'code': 'bg-blue-600 text-blue-100',
                        'pattern': 'bg-purple-600 text-purple-100',
                        'math': 'bg-green-600 text-green-100',
                        'riddle': 'bg-yellow-600 text-yellow-100'
                      }[currentPuzzle.type]
                    )}>
                      {currentPuzzle.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-white text-lg mb-4">
                    {currentPuzzle.question}
                  </p>

                  {showHint && currentPuzzle.hint && (
                    <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-4">
                      <p className="text-yellow-200">
                        💡 Pista: {currentPuzzle.hint}
                      </p>
                    </div>
                  )}
                </div>

                {/* Answer Input */}
                <div className="flex items-center space-x-4">
                  <input
                    ref={inputRef}
                    type={currentPuzzle.type === 'math' || currentPuzzle.type === 'pattern' || currentPuzzle.type === 'code' ? 'number' : 'text'}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitAnswer()}
                    placeholder="Tu respuesta..."
                    className="flex-1 px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label="Campo de respuesta"
                  />
                  
                  <button
                    onClick={submitAnswer}
                    disabled={!userInput.trim()}
                    className={cn(
                      'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                      userInput.trim()
                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Enviar
                  </button>
                  
                  {!showHint && currentPuzzle.hint && (
                    <button
                      onClick={useHint}
                      className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                    >
                      💡 Pista
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="text-center bg-gray-800 p-4 rounded-lg shadow-sm">
          <p className="text-gray-300 mb-2">
            Resuelve todos los puzzles para escapar antes de que se acabe el tiempo
          </p>
          <p className="text-sm text-gray-400">
            Las pistas reducen tu puntuación • Usa las teclas para navegar más rápido
          </p>
        </div>
      </div>
    </div>
  )
} 