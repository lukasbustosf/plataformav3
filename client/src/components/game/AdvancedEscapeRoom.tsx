'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  KeyIcon, 
  LockClosedIcon, 
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  SpeakerWaveIcon,
  EyeIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CalculatorIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface Puzzle {
  id: string
  title: string
  description: string
  type: 'logic' | 'code' | 'pattern' | 'cipher' | 'math'
  prompt: string
  solution: string
  hint: string
  maxAttempts: number
  timeLimit: number // seconds
  difficulty: 1 | 2 | 3 | 4 | 5
  isCompleted: boolean
  attempts: number
  room: string
}

interface GameState {
  currentRoom: string
  completedPuzzles: string[]
  totalScore: number
  timeSpent: number
  hintsUsed: number
  attempts: number
  gamePhase: 'intro' | 'playing' | 'final' | 'completed'
  finalCode: string
}

interface AdvancedEscapeRoomProps {
  playerId: string
  playerName: string
  timeLimit?: number
  onComplete: (result: { 
    success: boolean
    score: number
    timeSpent: number
    hintsUsed: number
    puzzlesSolved: number
  }) => void
  onExit: () => void
  enableAudio?: boolean
}

export function AdvancedEscapeRoom({ 
  playerId,
  playerName,
  timeLimit = 3600, // 60 minutes
  onComplete, 
  onExit,
  enableAudio = true 
}: AdvancedEscapeRoomProps) {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 'entry',
    completedPuzzles: [],
    totalScore: 0,
    timeSpent: 0,
    hintsUsed: 0,
    attempts: 0,
    gamePhase: 'intro',
    finalCode: ''
  })
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'warning', message: string } | null>(null)
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<number | null>(null)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)

  const startTimeRef = useRef(Date.now())
  const puzzleStartTimeRef = useRef(Date.now())

  // Initialize puzzles
  useEffect(() => {
    initializePuzzles()
  }, [])

  // Game timer
  useEffect(() => {
    if (gameState.gamePhase === 'completed') return

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setGameState(prev => ({ ...prev, timeSpent: elapsed }))

      if (elapsed >= timeLimit) {
        endGame(false)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit, gameState.gamePhase])

  // Auto-advance timer for hints
  useEffect(() => {
    if (currentPuzzle && !showHint && gameState.gamePhase === 'playing') {
      const timer = setTimeout(() => {
        if (currentPuzzle.attempts >= 2) {
          setAutoAdvanceTimer(180) // 3 minutes
          const countdownTimer = setInterval(() => {
            setAutoAdvanceTimer(prev => {
              if (prev && prev <= 1) {
                clearInterval(countdownTimer)
                offerSkipPuzzle()
                return null
              }
              return prev ? prev - 1 : null
            })
          }, 1000)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentPuzzle, showHint, gameState.gamePhase])

  const initializePuzzles = () => {
    const gamePuzzles: Puzzle[] = [
      {
        id: 'logic-1',
        title: 'La Secuencia Perdida',
        description: 'Encuentra el siguiente número en la secuencia',
        type: 'logic',
        prompt: '2, 6, 12, 20, 30, ?',
        solution: '42',
        hint: 'Piensa en las diferencias entre números consecutivos: +4, +6, +8, +10...',
        maxAttempts: 3,
        timeLimit: 180,
        difficulty: 1,
        isCompleted: false,
        attempts: 0,
        room: 'entry'
      },
      {
        id: 'cipher-2',
        title: 'Código César',
        description: 'Descifra el mensaje secreto',
        type: 'cipher',
        prompt: 'KROOR ZRUOG → Desplazamiento: 3',
        solution: 'HELLO WORLD',
        hint: 'Mueve cada letra 3 posiciones hacia atrás en el alfabeto',
        maxAttempts: 3,
        timeLimit: 240,
        difficulty: 2,
        isCompleted: false,
        attempts: 0,
        room: 'library'
      },
      {
        id: 'pattern-3',
        title: 'Laberinto de Patrones',
        description: 'Completa el patrón visual',
        type: 'pattern',
        prompt: '◯ ◻ ◇ ◯ ◻ ? ◯',
        solution: '◇',
        hint: 'El patrón se repite cada 3 símbolos: círculo, cuadrado, diamante',
        maxAttempts: 3,
        timeLimit: 200,
        difficulty: 3,
        isCompleted: false,
        attempts: 0,
        room: 'gallery'
      },
      {
        id: 'math-4',
        title: 'Ecuación del Tesoro',
        description: 'Resuelve la ecuación para encontrar la combinación',
        type: 'math',
        prompt: 'Si x² - 7x + 12 = 0, ¿cuáles son los valores de x? (formato: menor,mayor)',
        solution: '3,4',
        hint: 'Factoriza la ecuación: busca dos números que multiplicados den 12 y sumados den 7',
        maxAttempts: 3,
        timeLimit: 300,
        difficulty: 4,
        isCompleted: false,
        attempts: 0,
        room: 'vault'
      },
      {
        id: 'code-5',
        title: 'Algoritmo Final',
        description: 'Completa el pseudocódigo',
        type: 'code',
        prompt: 'function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(?); }',
        solution: 'n-2',
        hint: 'En Fibonacci, cada número es la suma de los dos anteriores',
        maxAttempts: 3,
        timeLimit: 360,
        difficulty: 5,
        isCompleted: false,
        attempts: 0,
        room: 'laboratory'
      }
    ]

    setPuzzles(gamePuzzles)
    setCurrentPuzzle(gamePuzzles[0])
    setGameState(prev => ({ ...prev, gamePhase: 'playing' }))
    puzzleStartTimeRef.current = Date.now()
  }

  const handleSubmit = () => {
    if (!currentPuzzle || !userInput.trim()) return

    const answer = userInput.trim().toLowerCase()
    const solution = currentPuzzle.solution.toLowerCase()
    const isCorrect = answer === solution || normalizeAnswer(answer) === normalizeAnswer(solution)

    setGameState(prev => ({ ...prev, attempts: prev.attempts + 1 }))

    setPuzzles(prev => prev.map(p => 
      p.id === currentPuzzle.id 
        ? { ...p, attempts: p.attempts + 1 }
        : p
    ))

    if (isCorrect) {
      handleCorrectAnswer()
    } else {
      handleIncorrectAnswer()
    }
  }

  const normalizeAnswer = (answer: string): string => {
    return answer.replace(/\s+/g, '').toLowerCase()
  }

  const handleCorrectAnswer = () => {
    if (!currentPuzzle) return

    const timeBonus = Math.max(0, currentPuzzle.timeLimit - Math.floor((Date.now() - puzzleStartTimeRef.current) / 1000))
    const attemptPenalty = (currentPuzzle.attempts - 1) * 50
    const puzzleScore = (currentPuzzle.difficulty * 200) + timeBonus - attemptPenalty

    setGameState(prev => ({
      ...prev,
      completedPuzzles: [...prev.completedPuzzles, currentPuzzle.id],
      totalScore: prev.totalScore + Math.max(0, puzzleScore)
    }))

    setPuzzles(prev => prev.map(p => 
      p.id === currentPuzzle.id 
        ? { ...p, isCompleted: true }
        : p
    ))

    setFeedback({ 
      type: 'success', 
      message: `¡Correcto! +${Math.max(0, puzzleScore)} puntos` 
    })

    playSuccessSound()

    setTimeout(() => {
      advanceToNextPuzzle()
    }, 2000)
  }

  const handleIncorrectAnswer = () => {
    if (!currentPuzzle) return

    if (currentPuzzle.attempts >= currentPuzzle.maxAttempts) {
      setFeedback({ 
        type: 'error', 
        message: 'Intentos agotados. Avanzando al siguiente puzzle...' 
      })
      setTimeout(() => {
        advanceToNextPuzzle()
      }, 2000)
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrecto. Te quedan ${currentPuzzle.maxAttempts - currentPuzzle.attempts} intentos` 
      })
      
      if (currentPuzzle.attempts >= 2) {
        setTimeout(() => {
          setShowHint(true)
        }, 1000)
      }
    }

    setUserInput('')
  }

  const advanceToNextPuzzle = () => {
    const currentIndex = puzzles.findIndex(p => p.id === currentPuzzle?.id)
    const nextPuzzle = puzzles[currentIndex + 1]

    if (nextPuzzle) {
      setCurrentPuzzle(nextPuzzle)
      setUserInput('')
      setShowHint(false)
      setFeedback(null)
      setAutoAdvanceTimer(null)
      
      // Change room
      setGameState(prev => ({ ...prev, currentRoom: nextPuzzle.room }))
      puzzleStartTimeRef.current = Date.now()
    } else {
      // All puzzles completed, go to final phase
      generateFinalCode()
    }
  }

  const generateFinalCode = () => {
    const completedCount = gameState.completedPuzzles.length
    const code = `EDU${completedCount}${Math.floor(gameState.totalScore / 100)}${puzzles.length}`
    
    setGameState(prev => ({ 
      ...prev, 
      gamePhase: 'final',
      finalCode: code
    }))
  }

  const handleFinalCodeSubmit = () => {
    const userCode = userInput.trim().toUpperCase()
    const correctCode = gameState.finalCode.toUpperCase()

    if (userCode === correctCode) {
      endGame(true)
    } else {
      setFeedback({ 
        type: 'error', 
        message: 'Código incorrecto. Revisa los puzzles completados.' 
      })
      setUserInput('')
    }
  }

  const endGame = (success: boolean) => {
    setGameState(prev => ({ ...prev, gamePhase: 'completed' }))
    
    const finalScore = success ? gameState.totalScore + (timeLimit - gameState.timeSpent) * 2 : gameState.totalScore
    
    onComplete({
      success,
      score: finalScore,
      timeSpent: gameState.timeSpent,
      hintsUsed: gameState.hintsUsed,
      puzzlesSolved: gameState.completedPuzzles.length
    })
  }

  const offerSkipPuzzle = () => {
    setFeedback({
      type: 'warning',
      message: 'Tiempo agotado en este puzzle. ¿Deseas continuar con el siguiente?'
    })
  }

  const skipCurrentPuzzle = () => {
    setFeedback({ 
      type: 'warning', 
      message: 'Puzzle omitido. Penalización de -100 puntos.' 
    })
    
    setGameState(prev => ({ ...prev, totalScore: Math.max(0, prev.totalScore - 100) }))
    
    setTimeout(() => {
      advanceToNextPuzzle()
    }, 1500)
  }

  const useHint = () => {
    setShowHint(true)
    setGameState(prev => ({ 
      ...prev, 
      hintsUsed: prev.hintsUsed + 1,
      totalScore: Math.max(0, prev.totalScore - 25)
    }))
    setFeedback({ 
      type: 'warning', 
      message: 'Pista activada. -25 puntos' 
    })
  }

  const playSuccessSound = () => {
    if (enableAudio) {
      setIsAudioPlaying(true)
      setTimeout(() => setIsAudioPlaying(false), 1000)
    }
  }

  const playNarration = () => {
    if (enableAudio && currentPuzzle) {
      setIsAudioPlaying(true)
      // Simulated TTS
      setTimeout(() => setIsAudioPlaying(false), 3000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentPuzzleTimeLeft = () => {
    if (!currentPuzzle) return 0
    const elapsed = Math.floor((Date.now() - puzzleStartTimeRef.current) / 1000)
    return Math.max(0, currentPuzzle.timeLimit - elapsed)
  }

  const getPuzzleIcon = (type: string) => {
    switch (type) {
      case 'logic': return <PuzzlePieceIcon className="h-5 w-5" />
      case 'cipher': return <KeyIcon className="h-5 w-5" />
      case 'pattern': return <EyeIcon className="h-5 w-5" />
      case 'math': return <CalculatorIcon className="h-5 w-5" />
      case 'code': return <CommandLineIcon className="h-5 w-5" />
      default: return <PuzzlePieceIcon className="h-5 w-5" />
    }
  }

  if (gameState.gamePhase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center max-w-2xl mx-auto p-8"
        >
          <KeyIcon className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-4xl font-bold mb-4">Advanced Escape Room</h1>
          <p className="text-xl text-gray-300 mb-8">
            Resuelve 5 puzzles lógicos progresivos para escapar del laboratorio
          </p>
          <div className="text-sm text-gray-400 space-y-2">
            <div>⏱️ Tiempo límite: {formatTime(timeLimit)}</div>
            <div>🧩 Puzzles: 5 salas diferentes</div>
            <div>💡 Pistas disponibles (-25 pts cada una)</div>
            <div>⏭️ Skip puzzle automático tras 3 min sin respuesta</div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (gameState.gamePhase === 'completed') {
    const success = gameState.completedPuzzles.length >= 3
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-center max-w-lg mx-auto p-8"
        >
          {success ? (
            <TrophyIcon className="h-16 w-16 mx-auto mb-4 text-yellow-400" />
          ) : (
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto mb-4 text-red-400" />
          )}
          
          <h2 className="text-3xl font-bold mb-4">
            {success ? '¡Escape Exitoso!' : 'Tiempo Agotado'}
          </h2>
          
          <div className="space-y-3 text-gray-300">
            <div>Puzzles resueltos: {gameState.completedPuzzles.length}/5</div>
            <div>Puntuación final: {gameState.totalScore}</div>
            <div>Tiempo usado: {formatTime(gameState.timeSpent)}</div>
            <div>Pistas usadas: {gameState.hintsUsed}</div>
          </div>

          <div className="mt-8 space-x-4">
            <Button onClick={() => initializePuzzles()} variant="outline">
              Jugar Otra Vez
            </Button>
            <Button onClick={onExit}>Salir</Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (gameState.gamePhase === 'final') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-center max-w-2xl mx-auto p-8"
        >
          <LockClosedIcon className="h-16 w-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-3xl font-bold mb-4">¡Código Final!</h2>
          <p className="text-gray-300 mb-6">
            Has completado todos los puzzles. Ingresa el código de escape:
          </p>
          
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-400 mb-4">
              Pista: EDU + [puzzles completados] + [score/100] + [total puzzles]
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ingresa el código..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded"
                onKeyPress={(e) => e.key === 'Enter' && handleFinalCodeSubmit()}
                autoFocus
              />
              <Button onClick={handleFinalCodeSubmit}>
                Verificar
              </Button>
            </div>
          </div>

          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg ${
                feedback.type === 'error' ? 'bg-red-600' : 'bg-yellow-600'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  // Main game interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-white text-xl font-bold">Advanced Escape Room</h1>
            <span className="text-sm text-gray-400">Sala: {gameState.currentRoom}</span>
          </div>
          
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5" />
              <span>{formatTime(timeLimit - gameState.timeSpent)}</span>
            </div>
            <div className="text-yellow-400">
              {gameState.totalScore} pts
            </div>
            <div className="text-green-400">
              {gameState.completedPuzzles.length}/5
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {currentPuzzle && (
          <motion.div 
            key={currentPuzzle.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-6"
          >
            {/* Puzzle Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getPuzzleIcon(currentPuzzle.type)}
                <h2 className="text-white text-xl font-bold">{currentPuzzle.title}</h2>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                  Nivel {currentPuzzle.difficulty}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={playNarration}
                  className="text-gray-400 hover:text-white"
                  aria-label="Reproducir descripción"
                >
                  <SpeakerWaveIcon className="h-5 w-5" />
                </button>
                <div className="text-sm text-gray-400">
                  ⏱️ {formatTime(getCurrentPuzzleTimeLeft())}
                </div>
              </div>
            </div>

            {/* Puzzle Content */}
            <div className="text-gray-300 mb-4">
              <p className="mb-2">{currentPuzzle.description}</p>
              <div className="bg-gray-700 p-4 rounded font-mono text-lg">
                {currentPuzzle.prompt}
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tu respuesta..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
              <Button onClick={handleSubmit} disabled={!userInput.trim()}>
                Enviar
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={useHint}
                  disabled={showHint}
                  className="flex items-center space-x-1 text-sm text-yellow-400 hover:text-yellow-300 disabled:opacity-50"
                >
                  <LightBulbIcon className="h-4 w-4" />
                  <span>Pista (-25 pts)</span>
                </button>
                
                {autoAdvanceTimer && (
                  <button
                    onClick={skipCurrentPuzzle}
                    className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300"
                  >
                    <span>Omitir ({autoAdvanceTimer}s)</span>
                  </button>
                )}
              </div>
              
              <div className="text-sm text-gray-400">
                Intentos: {currentPuzzle.attempts}/{currentPuzzle.maxAttempts}
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-yellow-900 border border-yellow-600 p-3 rounded"
              >
                <div className="flex items-center space-x-2 text-yellow-200">
                  <LightBulbIcon className="h-4 w-4" />
                  <span className="font-medium">Pista:</span>
                </div>
                <p className="text-yellow-100 mt-1">{currentPuzzle.hint}</p>
              </motion.div>
            )}

            {/* Feedback */}
            {feedback && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg ${
                  feedback.type === 'success' ? 'bg-green-600' : 
                  feedback.type === 'error' ? 'bg-red-600' : 'bg-yellow-600'
                }`}
              >
                <p className="text-white">{feedback.message}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Progreso del Escape</span>
            <span className="text-gray-400 text-sm">
              {gameState.completedPuzzles.length}/{puzzles.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(gameState.completedPuzzles.length / puzzles.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Room indicators */}
          <div className="flex justify-between mt-3 text-xs">
            {puzzles.map((puzzle, index) => (
              <div 
                key={puzzle.id}
                className={`flex items-center space-x-1 ${
                  puzzle.isCompleted ? 'text-green-400' : 
                  puzzle.id === currentPuzzle?.id ? 'text-blue-400' : 'text-gray-500'
                }`}
              >
                {puzzle.isCompleted ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <div className="h-4 w-4 border border-current rounded-full" />
                )}
                <span>{puzzle.room}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
