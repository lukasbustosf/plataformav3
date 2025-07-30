'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface NumberLineRaceProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface RaceCharacter {
  id: number
  name: string
  emoji: string
  position: number
  color: string
}

interface MathProblem {
  id: number
  operation: string
  answer: number
  options: number[]
}

export function NumberLineRace({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 180,
  accessibility = true,
  soundEnabled = true
}: NumberLineRaceProps) {
  const [characters, setCharacters] = useState<RaceCharacter[]>([])
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null)
  const [userCharacter, setUserCharacter] = useState<RaceCharacter | null>(null)
  const [score, setScore] = useState(0)
  const [problemsAnswered, setProblemsAnswered] = useState(0)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'racing' | 'finished'>('waiting')
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null)
  const [raceFinished, setRaceFinished] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  const raceCharacters: RaceCharacter[] = [
    { id: 1, name: 'Pez Azul', emoji: '🐟', position: 0, color: '#3B82F6' },
    { id: 2, name: 'Tortuga Verde', emoji: '🐢', position: 0, color: '#10B981' },
    { id: 3, name: 'Conejo Rosa', emoji: '🐰', position: 0, color: '#EC4899' },
    { id: 4, name: 'Pájaro Amarillo', emoji: '🐦', position: 0, color: '#F59E0B' }
  ]

  // Initialize game
  useEffect(() => {
    const initializeRace = () => {
      // Assign random character to user
      const shuffled = [...raceCharacters]
      const userChar = shuffled[Math.floor(Math.random() * shuffled.length)]
      setUserCharacter(userChar)
      setCharacters(shuffled)
      
      generateNewProblem()
      setGamePhase('racing')
      
      // Anunciar inicio de carrera
      if (accessibility) {
        ttsService.speakInstructions('number_line_race', `¡Carrera numérica! Eres el ${userChar.name}. Resuelve operaciones para avanzar hacia la meta.`)
      }
    }

    initializeRace()
  }, [accessibility])

  const generateNewProblem = () => {
    const operations = [
      { op: '+', min: 1, max: 20 },
      { op: '-', min: 5, max: 20 },
      { op: '×', min: 2, max: 10 },
      { op: '÷', min: 2, max: 50 }
    ]
    
    const selectedOp = operations[Math.floor(Math.random() * operations.length)]
    let num1: number, num2: number, answer: number, operation: string

    switch (selectedOp.op) {
      case '+':
        num1 = Math.floor(Math.random() * selectedOp.max) + selectedOp.min
        num2 = Math.floor(Math.random() * selectedOp.max) + selectedOp.min
        answer = num1 + num2
        operation = `${num1} + ${num2}`
        break
      case '-':
        num1 = Math.floor(Math.random() * selectedOp.max) + selectedOp.min
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1
        answer = num1 - num2
        operation = `${num1} - ${num2}`
        break
      case '×':
        num1 = Math.floor(Math.random() * selectedOp.max) + selectedOp.min
        num2 = Math.floor(Math.random() * selectedOp.max) + selectedOp.min
        answer = num1 * num2
        operation = `${num1} × ${num2}`
        break
      case '÷':
        answer = Math.floor(Math.random() * selectedOp.max) + selectedOp.min
        num2 = Math.floor(Math.random() * 8) + 2
        num1 = answer * num2
        operation = `${num1} ÷ ${num2}`
        break
      default:
        num1 = 5
        num2 = 3
        answer = 8
        operation = '5 + 3'
    }

    // Generate wrong options
    const options = [answer]
    while (options.length < 4) {
      const wrongAnswer = answer + (Math.floor(Math.random() * 10) - 5)
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer)
      }
    }

    const problem: MathProblem = {
      id: Date.now(),
      operation,
      answer,
      options: options.sort(() => Math.random() - 0.5)
    }

    setCurrentProblem(problem)
    
    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speakQuestion(`Nueva operación: ${operation}. ¿Cuál es el resultado?`)
    }
  }

  const handleAnswer = useCallback((selectedAnswer: number) => {
    if (!currentProblem || !userCharacter) return

    const isCorrect = selectedAnswer === currentProblem.answer
    setLastAnswerCorrect(isCorrect)
    setProblemsAnswered(prev => prev + 1)

    if (isCorrect) {
      setScore(prev => prev + 10)
      
      // Move user character forward
      setCharacters(prev => prev.map(char => 
        char.id === userCharacter.id 
          ? { ...char, position: Math.min(char.position + 10, 100) }
          : char
      ))

      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('¡Correcto! Avanzas', { rate: 1.1, pitch: 1.2, volume: 0.8 })
      }
      
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`¡Correcto! Tu ${userCharacter.name} avanza`)
      }
    } else {
      // Move other characters forward slightly
      setCharacters(prev => prev.map(char => 
        char.id !== userCharacter.id 
          ? { ...char, position: Math.min(char.position + 3, 100) }
          : char
      ))

      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('Incorrecto', { rate: 1.0, pitch: 0.8, volume: 0.8 })
      }
      
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`Incorrecto. La respuesta era ${currentProblem.answer}`)
      }
    }

    // Check for race finish
    const winningChar = characters.find(char => char.position >= 100)
    if (winningChar || characters.some(char => char.position >= 100)) {
      setTimeout(() => {
        setRaceFinished(true)
        setGamePhase('finished')
        if (accessibility) {
          const userWon = winningChar?.id === userCharacter.id
          ttsService.speak(userWon ? '¡Ganaste la carrera!' : 'Carrera terminada', { 
            rate: 0.9, 
            pitch: userWon ? 1.3 : 1.0 
          })
        }
        setTimeout(() => onGameEnd(), 5000)
      }, 2000)
    } else {
      // Generate next problem
      setTimeout(() => {
        generateNewProblem()
        setLastAnswerCorrect(null)
      }, 2000)
    }

    onAnswer(selectedAnswer)
  }, [currentProblem, userCharacter, characters, audioEnabled, accessibility, onAnswer, onGameEnd])

  // Draw race track
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw track background
    ctx.fillStyle = '#E5E7EB'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw lanes
    const laneHeight = canvas.height / characters.length
    characters.forEach((char, index) => {
      const y = index * laneHeight
      
      // Lane background
      ctx.fillStyle = index % 2 === 0 ? '#F3F4F6' : '#E5E7EB'
      ctx.fillRect(0, y, canvas.width, laneHeight)

      // Lane border
      ctx.strokeStyle = '#D1D5DB'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, y + laneHeight)
      ctx.lineTo(canvas.width, y + laneHeight)
      ctx.stroke()

      // Character position
      const xPos = (char.position / 100) * (canvas.width - 60) + 30
      
      // Character background circle
      ctx.fillStyle = char.color
      ctx.beginPath()
      ctx.arc(xPos, y + laneHeight / 2, 20, 0, 2 * Math.PI)
      ctx.fill()

      // Character emoji (simplified - would use actual emoji rendering)
      ctx.fillStyle = 'white'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(char.emoji, xPos, y + laneHeight / 2 + 8)

      // Character name
      ctx.fillStyle = '#374151'
      ctx.font = '14px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(char.name, 10, y + laneHeight / 2 + 5)

      // Highlight user character
      if (userCharacter && char.id === userCharacter.id) {
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.arc(xPos, y + laneHeight / 2, 25, 0, 2 * Math.PI)
        ctx.stroke()
      }
    })

    // Draw finish line
    ctx.strokeStyle = '#EF4444'
    ctx.lineWidth = 4
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(canvas.width - 30, 0)
    ctx.lineTo(canvas.width - 30, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // Finish line label
    ctx.fillStyle = '#EF4444'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('META', canvas.width - 15, 20)

  }, [characters, userCharacter])

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏁</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrera en la Recta Numérica</h2>
          <p className="text-gray-600">Preparando la carrera...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    const winner = characters.find(char => char.position >= 100)
    const userWon = winner?.id === userCharacter?.id

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">{userWon ? '🏆' : '🏁'}</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {userWon ? '¡Ganaste la Carrera!' : 'Carrera Terminada'}
          </h2>
          <p className="text-xl text-gray-600 mb-2">Puntuación: {score}</p>
          <p className="text-lg text-gray-600">
            Problemas resueltos: {problemsAnswered}
          </p>
          {winner && (
            <p className="text-lg text-gray-600 mt-2">
              Ganador: {winner.name} {winner.emoji}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-cyan-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🏁</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Carrera Numérica</h1>
              {userCharacter && (
                <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <span>{userCharacter.emoji}</span>
                  <span className="text-yellow-800 font-medium">{userCharacter.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <TTSControls position="inline" />
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label={audioEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
              >
                {audioEnabled ? (
                  <SpeakerWaveIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <SpeakerXMarkIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Puntos:</span>
                <span className="text-lg font-bold text-cyan-600">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Problemas:</span>
                <span className="text-lg font-bold text-gray-900">{problemsAnswered}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Tiempo:</span>
              <span className={cn(
                'text-lg font-bold',
                timeRemaining > 60 ? 'text-green-600' : 
                timeRemaining > 30 ? 'text-yellow-600' : 'text-red-600'
              )}>
                {timeRemaining}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Race Track */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <canvas
          ref={canvasRef}
          className="w-full bg-white rounded-lg shadow-lg border-2 border-gray-200"
          style={{ height: '300px' }}
          aria-label="Pista de carrera con personajes"
        />
      </div>

      {/* Math Problem */}
      {currentProblem && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentProblem.operation} = ?
                </h2>
                <TTSButton 
                  text={`Resuelve: ${currentProblem.operation}. ¿Cuál es el resultado?`}
                  type="question"
                  gameType="number_line_race"
                  size="md"
                />
              </div>
              
              {lastAnswerCorrect !== null && (
                <div className={cn(
                  'text-lg font-semibold mb-4',
                  lastAnswerCorrect ? 'text-green-600' : 'text-red-600'
                )}>
                  {lastAnswerCorrect ? '¡Correcto! +10 puntos' : `Incorrecto. Era ${currentProblem.answer}`}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentProblem.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={lastAnswerCorrect !== null}
                  className={cn(
                    'p-4 text-2xl font-bold rounded-xl border-3 transition-all duration-200',
                    'hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300',
                    lastAnswerCorrect !== null
                      ? option === currentProblem.answer
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100 hover:border-cyan-400'
                  )}
                  aria-label={`Opción ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="text-center mt-6">
              <div className="flex items-center justify-center gap-4">
                <p className="text-gray-600">
                  Resuelve correctamente para avanzar hacia la meta
                </p>
                <TTSButton 
                  text="Resuelve las operaciones matemáticas correctamente para que tu personaje avance hacia la meta y gane la carrera."
                  type="instruction"
                  gameType="number_line_race"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 