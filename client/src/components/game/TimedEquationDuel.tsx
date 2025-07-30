'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CalculatorIcon,
  ClockIcon,
  TrophyIcon,
  BoltIcon,
  CheckCircleIcon,
  XMarkIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface Player {
  id: string
  name: string
  score: number
  streak: number
  totalCorrect: number
  totalAttempts: number
  averageTime: number
}

interface Equation {
  id: string
  problem: string
  answer: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeLimit: number
  audio_url?: string
}

interface TimedEquationDuelProps {
  players: Player[]
  equations: Equation[]
  roundDuration?: number
  onComplete: (result: { winner: Player; finalScores: Player[]; totalRounds: number }) => void
  onExit: () => void
  enableAudio?: boolean
}

export function TimedEquationDuel({ 
  players: initialPlayers,
  equations,
  roundDuration = 300, // 5 minutes
  onComplete, 
  onExit,
  enableAudio = true 
}: TimedEquationDuelProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [equationStartTime, setEquationStartTime] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [roundNumber, setRoundNumber] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentPlayer = players[currentPlayerIndex]

  // Start new equation
  useEffect(() => {
    if (!gameEnded && !currentEquation) {
      presentNewEquation()
    }
  }, [currentEquation, gameEnded])

  // Game timer
  useEffect(() => {
    if (gameEnded) return

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1
        if (newTime >= roundDuration) {
          endGame()
          return prev
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [roundDuration, gameEnded])

  // Equation timer
  useEffect(() => {
    if (!currentEquation || showResult || gameEnded) return

    const timer = setInterval(() => {
      const elapsed = Date.now() - equationStartTime
      if (elapsed >= currentEquation.timeLimit * 1000) {
        handleTimeout()
      }
    }, 100)

    return () => clearInterval(timer)
  }, [currentEquation, equationStartTime, showResult, gameEnded])

  const presentNewEquation = () => {
    const playerDifficulty = getDifficultyForPlayer(currentPlayer)
    let availableEquations = equations.filter(eq => 
      eq.difficulty === playerDifficulty
    )
    
    // If no equations match the player's difficulty, try fallback options
    if (availableEquations.length === 0) {
      console.log(`No equations found for difficulty ${playerDifficulty}, trying fallbacks...`)
      
      // Try easy first (most accessible)
      if (playerDifficulty !== 'easy') {
        availableEquations = equations.filter(eq => eq.difficulty === 'easy')
      }
      
      // Then try medium
      if (availableEquations.length === 0 && playerDifficulty !== 'medium') {
        availableEquations = equations.filter(eq => eq.difficulty === 'medium')
      }
      
      // Then try hard
      if (availableEquations.length === 0 && playerDifficulty !== 'hard') {
        availableEquations = equations.filter(eq => eq.difficulty === 'hard')
      }
      
      // If still no equations, use any available equation
      if (availableEquations.length === 0) {
        availableEquations = [...equations]
      }
      
      // If there are still no equations at all, end the game
      if (availableEquations.length === 0) {
        console.error('No equations available at all!')
        endGame()
        return
      }
    }

    const randomEquation = availableEquations[Math.floor(Math.random() * availableEquations.length)]
    console.log(`Selected equation: ${randomEquation.problem} (difficulty: ${randomEquation.difficulty})`)
    
    setCurrentEquation(randomEquation)
    setEquationStartTime(Date.now())
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(null)
  }

  const getDifficultyForPlayer = (player: Player): 'easy' | 'medium' | 'hard' => {
    const accuracy = player.totalAttempts > 0 ? player.totalCorrect / player.totalAttempts : 0.5
    
    if (accuracy >= 0.8 && player.streak >= 3) return 'hard'
    if (accuracy >= 0.6 || player.streak >= 2) return 'medium'
    return 'easy'
  }

  const handleSubmit = () => {
    if (!currentEquation || !userAnswer.trim()) return

    const responseTime = Date.now() - equationStartTime
    const userAnswerNum = parseFloat(userAnswer.trim())
    const correct = Math.abs(userAnswerNum - currentEquation.answer) < 0.01

    setIsCorrect(correct)
    setShowResult(true)

    // Update player stats
    setPlayers(prev => prev.map(player => {
      if (player.id === currentPlayer.id) {
        const newTotalAttempts = player.totalAttempts + 1
        const newTotalCorrect = player.totalCorrect + (correct ? 1 : 0)
        const newStreak = correct ? player.streak + 1 : 0
        
        let points = 0
        if (correct) {
          // Points based on difficulty and speed
          const basePoints = { easy: 10, medium: 20, hard: 40 }[currentEquation.difficulty]
          const timeBonus = Math.max(0, Math.round((currentEquation.timeLimit * 1000 - responseTime) / 100))
          const streakBonus = newStreak >= 3 ? newStreak * 5 : 0
          points = basePoints + timeBonus + streakBonus
        }

        return {
          ...player,
          score: player.score + points,
          streak: newStreak,
          totalCorrect: newTotalCorrect,
          totalAttempts: newTotalAttempts,
          averageTime: (player.averageTime * player.totalAttempts + responseTime) / newTotalAttempts
        }
      }
      return player
    }))

    // Auto-advance after showing result
    setTimeout(() => {
      nextPlayer()
    }, 2000)
  }

  const handleTimeout = () => {
    setIsCorrect(false)
    setShowResult(true)

    // Update player stats for timeout
    setPlayers(prev => prev.map(player => {
      if (player.id === currentPlayer.id) {
        return {
          ...player,
          totalAttempts: player.totalAttempts + 1,
          streak: 0
        }
      }
      return player
    }))

    setTimeout(() => {
      nextPlayer()
    }, 1500)
  }

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    
    if (nextIndex === 0) {
      setRoundNumber(prev => prev + 1)
    }
    
    setCurrentEquation(null)
  }

  const endGame = () => {
    setGameEnded(true)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    
    onComplete({
      winner: sortedPlayers[0],
      finalScores: sortedPlayers,
      totalRounds: roundNumber
    })
  }

  const playAudio = () => {
    if (!enableAudio || !currentEquation?.audio_url) return
    
    setIsPlaying(true)
    const audio = new Audio(currentEquation.audio_url)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(() => setIsPlaying(false))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getEquationTimeLeft = () => {
    if (!currentEquation) return 0
    const elapsed = Date.now() - equationStartTime
    return Math.max(0, currentEquation.timeLimit * 1000 - elapsed) / 1000
  }

  if (gameEnded) {
    const winner = players.reduce((prev, current) => 
      current.score > prev.score ? current : prev
    )

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Duelo Terminado!
          </h2>
          
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-yellow-900 mb-2">
              🏆 Ganador: {winner.name}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-yellow-700">Puntuación:</span>
                <span className="font-bold ml-2">{winner.score} pts</span>
              </div>
              <div>
                <span className="text-yellow-700">Precisión:</span>
                <span className="font-bold ml-2">
                  {Math.round((winner.totalCorrect / Math.max(1, winner.totalAttempts)) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Resultados Finales:</h4>
            {players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{player.score} pts</div>
                    <div className="text-sm text-gray-600">
                      {player.totalCorrect}/{player.totalAttempts} correctas
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-blue-800">Tiempo Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{roundNumber}</div>
              <div className="text-sm text-green-800">Rondas Jugadas</div>
            </div>
          </div>

          <Button onClick={onExit} className="w-full">
            Finalizar Duelo
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-pink-600 p-4">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CalculatorIcon className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-xl font-bold">Duelo de Ecuaciones</h1>
              <div className="text-sm opacity-90">
                Turno de {currentPlayer?.name} • Ronda {roundNumber} • {formatTime(roundDuration - timeElapsed)}
              </div>
            </div>
          </div>

          <Button onClick={onExit} variant="outline" size="sm">
            Salir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            {currentEquation && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Resuelve la ecuación:
                    </h2>
                    {enableAudio && currentEquation.audio_url && (
                      <Button
                        onClick={playAudio}
                        disabled={isPlaying}
                        variant="outline"
                        size="sm"
                      >
                        <SpeakerWaveIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-4xl font-mono font-bold text-blue-600 mb-6 p-6 bg-blue-50 rounded-lg">
                    {currentEquation.problem}
                  </div>

                  {/* Timer */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <ClockIcon className="h-5 w-5 text-orange-500" />
                      <span className="text-lg font-bold text-orange-600">
                        {Math.ceil(getEquationTimeLeft())}s
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-green-500 to-red-500 h-3 rounded-full"
                        initial={{ width: "100%" }}
                        animate={{ width: `${(getEquationTimeLeft() / currentEquation.timeLimit) * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </div>

                {!showResult && (
                  <div className="space-y-6">
                    <div>
                      <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                        className="text-3xl font-mono text-center border-2 border-blue-300 rounded-lg p-4 w-64 focus:border-blue-500 focus:outline-none"
                        placeholder="?"
                        autoFocus
                        step="any"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                    >
                      <BoltIcon className="h-5 w-5 mr-2" />
                      Confirmar
                    </Button>
                  </div>
                )}

                {showResult && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-6 rounded-lg ${
                      isCorrect 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {isCorrect ? (
                        <CheckCircleIcon className="h-8 w-8 text-green-500" />
                      ) : (
                        <XMarkIcon className="h-8 w-8 text-red-500" />
                      )}
                      <span className={`text-2xl font-bold ${
                        isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                      </span>
                    </div>
                    
                    <p className="text-lg text-gray-700 mb-2">
                      Respuesta correcta: <strong>{currentEquation.answer}</strong>
                    </p>
                    
                    {isCorrect && currentPlayer.streak > 0 && (
                      <p className="text-sm text-green-700">
                        ¡Racha de {currentPlayer.streak}! 🔥
                      </p>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Scoreboard */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Puntuaciones</h3>
            
            <div className="space-y-3">
              {players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
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
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">{player.score} pts</div>
                        <div className="text-xs text-gray-600">
                          {player.totalCorrect}/{player.totalAttempts} 
                          {player.streak > 0 && ` • ${player.streak}🔥`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Difficulty Info */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dificultad Actual:</span>
                <span className={`font-bold capitalize ${
                  getDifficultyForPlayer(currentPlayer) === 'hard' ? 'text-red-600' :
                  getDifficultyForPlayer(currentPlayer) === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getDifficultyForPlayer(currentPlayer)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Racha Actual:</span>
                <span className="font-bold text-orange-600">
                  {currentPlayer.streak} {currentPlayer.streak > 0 && '🔥'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Precisión:</span>
                <span className="font-bold text-blue-600">
                  {Math.round((currentPlayer.totalCorrect / Math.max(1, currentPlayer.totalAttempts)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 