'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon,
  StopIcon,
  TrophyIcon,
  UsersIcon,
  CubeIcon,
  CheckCircleIcon,
  XMarkIcon,
  SpeakerWaveIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'

interface Player {
  id: string
  name: string
  avatar: string
  position: number
  score: number
  color: string
  isActive: boolean
}

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  audio_url?: string
}

interface BoardSquare {
  id: number
  type: 'normal' | 'bonus' | 'challenge' | 'penalty' | 'start' | 'finish'
  title?: string
  description?: string
  points?: number
  color: string
}

interface BoardRaceProps {
  questions: Question[]
  players: Player[]
  boardSize?: number
  onComplete: (result: { winner: Player; finalScores: Player[]; timeSpent: number }) => void
  onExit: () => void
  timeLimit?: number
  enableAudio?: boolean
}

export function BoardRace({ 
  questions, 
  players: initialPlayers,
  boardSize = 30,
  onComplete, 
  onExit, 
  timeLimit = 1800, // 30 minutes
  enableAudio = true 
}: BoardRaceProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gameState, setGameState] = useState<'waiting' | 'rolling' | 'question' | 'moving' | 'finished'>('waiting')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [diceValue, setDiceValue] = useState<number>(1)
  const [isRolling, setIsRolling] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [winner, setWinner] = useState<Player | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [questionResult, setQuestionResult] = useState<'correct' | 'incorrect' | null>(null)

  // Generate board squares
  const boardSquares: BoardSquare[] = Array.from({ length: boardSize + 1 }, (_, index) => {
    if (index === 0) return { id: index, type: 'start', color: 'bg-green-500', title: 'Inicio' }
    if (index === boardSize) return { id: index, type: 'finish', color: 'bg-yellow-500', title: '¡Meta!' }
    
    const rand = Math.random()
    if (rand < 0.15) return { id: index, type: 'bonus', color: 'bg-blue-500', title: 'Bonus', points: 10 }
    if (rand < 0.25) return { id: index, type: 'challenge', color: 'bg-purple-500', title: 'Desafío' }
    if (rand < 0.35) return { id: index, type: 'penalty', color: 'bg-red-500', title: 'Penalización', points: -5 }
    
    return { id: index, type: 'normal', color: 'bg-gray-300' }
  })

  const currentPlayer = players[currentPlayerIndex] || players[0]

  // Safety check - if no players, show loading
  if (!players || players.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-900">Preparando carrera...</h2>
          <p className="text-gray-600 mt-2">Configurando jugadores y tablero</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (gameEnded) return

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1
        if (newTime >= timeLimit) {
          endGame()
          return prev
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit, gameEnded])

  const rollDice = async () => {
    setIsRolling(true)
    setGameState('rolling')
    
    // Animated dice roll
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      rollCount++
      
      if (rollCount >= 10) {
        clearInterval(rollInterval)
        const finalRoll = Math.floor(Math.random() * 6) + 1
        setDiceValue(finalRoll)
        setIsRolling(false)
        
        // Present question before moving
        presentQuestion()
      }
    }, 100)
  }

  const presentQuestion = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQuestion)
    setGameState('question')
    setQuestionResult(null)
    setShowExplanation(false)
  }

  const answerQuestion = (selectedAnswer: number) => {
    if (!currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setQuestionResult(isCorrect ? 'correct' : 'incorrect')
    
    // Update player score
    const pointsGained = isCorrect ? 10 : 0
    setPlayers(prev => prev.map(p => 
      p.id === currentPlayer.id 
        ? { ...p, score: p.score + pointsGained }
        : p
    ))

    setShowExplanation(true)

    // Usar TTS para feedback inmediato
    if (enableAudio) {
      const feedbackMessage = isCorrect ? '¡Correcto! Ganas 10 puntos' : 'Incorrecto, solo avanzas 1 casilla'
      ttsService.speak(feedbackMessage, {
        rate: 1.0,
        pitch: isCorrect ? 1.2 : 0.8,
        volume: 0.9
      })
    }

    // Auto-advance after showing explanation
    setTimeout(() => {
      if (isCorrect) {
        movePlayer(diceValue)
      } else {
        // Incorrect answer: only move 1 space instead of dice value
        movePlayer(1)
      }
    }, 3000)
  }

  const movePlayer = (spaces: number) => {
    setGameState('moving')
    
    setPlayers(prev => prev.map(p => {
      if (p.id === currentPlayer.id) {
        const newPosition = Math.min(p.position + spaces, boardSize)
        
        // Check if player reached finish
        if (newPosition >= boardSize && !winner) {
          setWinner(p)
          setTimeout(() => endGame(), 2000)
        }

        // Apply square effects
        const square = boardSquares[newPosition]
        let bonusPoints = 0
        if (square.type === 'bonus') bonusPoints = square.points || 0
        if (square.type === 'penalty') bonusPoints = square.points || 0

        return { 
          ...p, 
          position: newPosition,
          score: p.score + bonusPoints
        }
      }
      return p
    }))

    // Move to next player after animation
    setTimeout(() => {
      nextTurn()
    }, 1500)
  }

  const nextTurn = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length)
    setGameState('waiting')
    setCurrentQuestion(null)
  }

  const endGame = () => {
    setGameEnded(true)
    const sortedPlayers = [...players].sort((a, b) => {
      if (a.position !== b.position) return b.position - a.position
      return b.score - a.score
    })
    
    const gameWinner = winner || sortedPlayers[0]
    
    onComplete({
      winner: gameWinner,
      finalScores: sortedPlayers,
      timeSpent: timeElapsed
    })
  }

  const speakQuestion = () => {
    if (!enableAudio || !currentQuestion?.question) return
    
    ttsService.speakQuestion(currentQuestion.question)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSquarePosition = (squareIndex: number) => {
    const squaresPerRow = 10
    const row = Math.floor(squareIndex / squaresPerRow)
    const col = squareIndex % squaresPerRow
    
    // Snake pattern: odd rows go right-to-left
    const actualCol = row % 2 === 0 ? col : squaresPerRow - 1 - col
    
    return {
      x: actualCol * 60 + 30,
      y: row * 60 + 30
    }
  }

  if (gameEnded) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Juego Terminado!
          </h2>
          
          {winner && (
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                🏆 Ganador: {winner.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-yellow-700">Posición Final:</span>
                  <span className="font-bold ml-2">{winner.position}/{boardSize}</span>
                </div>
                <div>
                  <span className="text-yellow-700">Puntuación:</span>
                  <span className="font-bold ml-2">{winner.score} pts</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Puntuaciones Finales:</h4>
            {players
              .sort((a, b) => b.position !== a.position ? b.position - a.position : b.score - a.score)
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span style={{ color: player.color }} className="font-medium">
                      {player.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{player.score} pts</div>
                    <div className="text-sm text-gray-600">Pos: {player.position}/{boardSize}</div>
                  </div>
                </div>
              ))}
          </div>

          <Button onClick={onExit} className="w-full">
            Finalizar Juego
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CubeIcon className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-xl font-bold">Carrera del Tablero</h1>
              <div className="text-sm opacity-90">
                Turno de {currentPlayer?.name} • Tiempo: {formatTime(timeLimit - timeElapsed)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <TTSControls position="inline" />
            <Button onClick={onExit} variant="outline" size="sm">
              Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Game Board */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <div className="relative" style={{ height: '400px' }}>
              {/* Board Grid */}
              <svg width="100%" height="100%" viewBox="0 0 600 240" className="border rounded-lg bg-green-50">
                {/* Draw squares */}
                {boardSquares.map((square) => {
                  const pos = getSquarePosition(square.id)
                  return (
                    <g key={square.id}>
                      <rect
                        x={pos.x - 25}
                        y={pos.y - 25}
                        width="50"
                        height="50"
                        className={`${square.color} stroke-2 stroke-gray-600`}
                        rx="5"
                      />
                      
                      {/* Square number */}
                      <text
                        x={pos.x}
                        y={pos.y - 15}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold"
                      >
                        {square.id}
                      </text>
                      
                      {/* Special square icons */}
                      {square.type === 'start' && (
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="fill-white text-xs">
                          🏁
                        </text>
                      )}
                      {square.type === 'finish' && (
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="fill-white text-xs">
                          🏆
                        </text>
                      )}
                      {square.type === 'bonus' && (
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="fill-white text-xs">
                          ⭐
                        </text>
                      )}
                      {square.type === 'penalty' && (
                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="fill-white text-xs">
                          ⚠️
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Draw players */}
                {players.map((player, playerIndex) => {
                  const pos = getSquarePosition(player.position)
                  const offsetX = (playerIndex % 2) * 15 - 7.5
                  const offsetY = Math.floor(playerIndex / 2) * 10 - 5
                  
                  return (
                    <motion.g
                      key={player.id}
                      animate={{
                        x: pos.x + offsetX,
                        y: pos.y + offsetY
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <circle
                        cx={0}
                        cy={0}
                        r="8"
                        fill={player.color}
                        stroke="white"
                        strokeWidth="2"
                        className={player.id === currentPlayer?.id ? 'animate-pulse' : ''}
                      />
                      <text
                        x={0}
                        y={3}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold"
                      >
                        {player.name.charAt(0)}
                      </text>
                    </motion.g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Players Panel */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Jugadores
            </h3>
            
            <div className="space-y-3">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className={`p-3 rounded-lg border-2 transition-all ${
                    player.id === currentPlayer?.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{player.score} pts</div>
                      <div className="text-xs text-gray-600">Pos: {player.position}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Controles</h3>
            
            {gameState === 'waiting' && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Es el turno de <span className="font-bold" style={{ color: currentPlayer?.color }}>
                    {currentPlayer?.name}
                  </span>
                </p>
                <Button 
                  onClick={rollDice}
                  disabled={isRolling}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <CubeIcon className="h-5 w-5 mr-2" />
                  Lanzar Dado
                </Button>
              </div>
            )}

            {(gameState === 'rolling' || gameState === 'question') && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎲</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {diceValue}
                </div>
                {isRolling && (
                  <p className="text-gray-600">Lanzando dado...</p>
                )}
                {gameState === 'question' && (
                  <p className="text-gray-600">¡Responde para avanzar!</p>
                )}
              </div>
            )}

            {gameState === 'moving' && (
              <div className="text-center">
                <div className="text-4xl mb-2">🏃‍♂️</div>
                <p className="text-gray-600">
                  {currentPlayer?.name} avanza {diceValue} casillas...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Question Modal */}
      <AnimatePresence>
        {currentQuestion && gameState === 'question' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Pregunta para {currentPlayer?.name}</h3>
                <div className="flex items-center space-x-2">
                  <TTSButton 
                    text={currentQuestion.question}
                    type="question"
                    gameType="board_race"
                    size="sm"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-lg text-gray-900 flex-1">{currentQuestion.question}</p>
                </div>
                
                {!showExplanation && (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => answerQuestion(index)}
                        variant="outline"
                        className="text-left p-4 justify-start"
                      >
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {showExplanation && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${
                      questionResult === 'correct' 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {questionResult === 'correct' ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        ) : (
                          <XMarkIcon className="h-6 w-6 text-red-500" />
                        )}
                        <span className={`font-semibold ${
                          questionResult === 'correct' ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {questionResult === 'correct' ? '¡Correcto!' : 'Incorrecto'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700">
                        La respuesta correcta es: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                      </p>
                      
                      {currentQuestion.explanation && (
                        <p className="text-sm text-gray-600 mt-2">{currentQuestion.explanation}</p>
                      )}
                    </div>
                    
                    <p className="text-center text-gray-600">
                      {questionResult === 'correct' 
                        ? `Avanzas ${diceValue} casillas y ganas 10 puntos`
                        : 'Solo avanzas 1 casilla por respuesta incorrecta'
                      }
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 