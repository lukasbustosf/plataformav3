'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/store/auth'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameSession, Question, GameParticipant, GameComponentProps } from '@/types'

interface ColorMatchProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface ColorOption {
  id: number
  color: string
  shape: string
  name: string
}

export function ColorMatch({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 30,
  accessibility = true,
  soundEnabled = true
}: ColorMatchProps) {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'question' | 'results' | 'finished'>('waiting')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalQuestions] = useState(session.quizzes?.questions?.length || 10)
  const [score, setScore] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  
  const questionRef = useRef<HTMLHeadingElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Color options with unique shapes for accessibility
  const colorOptions: ColorOption[] = [
    { id: 0, color: '#EF4444', shape: '●', name: 'Rojo Círculo' },
    { id: 1, color: '#3B82F6', shape: '■', name: 'Azul Cuadrado' },
    { id: 2, color: '#10B981', shape: '▲', name: 'Verde Triángulo' },
    { id: 3, color: '#F59E0B', shape: '♦', name: 'Amarillo Rombo' },
    { id: 4, color: '#8B5CF6', shape: '★', name: 'Morado Estrella' },
    { id: 5, color: '#EC4899', shape: '♥', name: 'Rosa Corazón' }
  ]

  // Auto-start demo mode
  useEffect(() => {
    // If we have a current question on mount, this is demo mode - auto start
    if (currentQuestion && gamePhase === 'waiting') {
      setGamePhase('question')
      
      if (accessibility && questionRef.current) {
        setTimeout(() => {
          if (questionRef.current) {
            questionRef.current.focus()
            ttsService.speakInstructions(`Pregunta ${questionNumber} de ${totalQuestions}. Selecciona el color y forma correctos.`)
          }
        }, 100)
      }
    }
  }, [currentQuestion, gamePhase, accessibility, questionNumber, totalQuestions])

  useEffect(() => {
    const handleGameQuestion = (data: any) => {
      setGamePhase('question')
      setSelectedOption(null)
      setHasAnswered(false)
      setQuestionNumber(data.questionNumber || questionNumber + 1)
      
      if (accessibility && questionRef.current) {
        questionRef.current.focus()
        ttsService.speakInstructions(`Pregunta ${questionNumber} de ${totalQuestions}. Selecciona el color y forma correctos.`)
      }
    }

    const handleGameEnd = (data: any) => {
      setGamePhase('finished')
      if (accessibility) {
        ttsService.speakFeedback('Juego de colores terminado')
      }
      setTimeout(() => onGameEnd(), 5000)
    }

    gameWS.on('gameQuestion', handleGameQuestion)
    gameWS.on('gameEnded', handleGameEnd)

    return () => {
      gameWS.off('gameQuestion', handleGameQuestion)
      gameWS.off('gameEnded', handleGameEnd)
    }
  }, [gameWS, user.user_id, questionNumber, totalQuestions, accessibility, onGameEnd])

  const handleOptionSelect = useCallback((optionIndex: number) => {
    if (hasAnswered || gamePhase !== 'question') return
    
    setSelectedOption(optionIndex)
    setHasAnswered(true)
    
    // In demo mode, skip WebSocket calls
    try {
      if (gameWS.isConnected) {
        gameWS.submitAnswer(
          currentQuestion?.question_id || '',
          optionIndex,
          timeRemaining
        )
      }
    } catch (error) {
      // Ignore WebSocket errors in demo mode
      console.log('Demo mode: Skipping WebSocket submission')
    }
    
    onAnswer(optionIndex)
    
    // Simulate score increase in demo mode
    setScore(prev => prev + 10)
    
    // Auto-progress in demo mode
    if (!gameWS.isConnected) {
      setTimeout(() => {
        if (questionNumber >= totalQuestions) {
          setGamePhase('finished')
          setTimeout(() => onGameEnd(), 3000)
        } else {
          // Reset for next question in demo
          setSelectedOption(null)
          setHasAnswered(false)
          setQuestionNumber(prev => prev + 1)
        }
      }, 1500)
    }
    
    if (accessibility) {
      const option = colorOptions[optionIndex]
      ttsService.speakFeedback(`Seleccionaste ${option.name}`)
    }

    // Reemplazar audio manual con TTS feedback
    if (audioEnabled) {
      ttsService.speakFeedback("¡Correcto!")
    }
  }, [hasAnswered, gamePhase, currentQuestion, gameWS, onAnswer, accessibility, audioEnabled, timeRemaining])

  const getProgressPercentage = (): number => {
    return ((questionNumber - 1) / totalQuestions) * 100
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Juego de Colores</h2>
          <p className="text-gray-600">Esperando que el profesor inicie el juego...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Juego Terminado!</h2>
          <p className="text-xl text-gray-600">Puntuación: {score}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-purple-500">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎨</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Juego de Colores</h1>
              <div className="text-sm text-gray-600">
                Pregunta {questionNumber} de {totalQuestions}
              </div>
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

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Puntos:</span>
              <span className="text-lg font-bold text-purple-600">{score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Tiempo:</span>
              <span className={cn(
                'text-lg font-bold',
                timeRemaining > 10 ? 'text-green-600' : 
                timeRemaining > 5 ? 'text-yellow-600' : 'text-red-600'
              )}>
                {timeRemaining}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Question */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 
              ref={questionRef}
              className="text-2xl font-bold text-gray-900"
              tabIndex={-1}
            >
              {currentQuestion?.stem_md || 'Selecciona el color y forma que coincide con la descripción'}
            </h2>
            <TTSButton 
              text={currentQuestion?.stem_md || 'Selecciona el color y forma que coincide con la descripción'}
              type="question"
            />
          </div>
        </div>

        {/* Color Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {colorOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={hasAnswered}
              className={cn(
                'relative aspect-square rounded-2xl border-4 transition-all duration-200 transform',
                'flex flex-col items-center justify-center text-white font-bold text-4xl',
                'focus:outline-none focus:ring-4 focus:ring-purple-300',
                'hover:scale-105 active:scale-95',
                hasAnswered && selectedOption === option.id
                  ? 'border-green-500 bg-green-100 scale-105'
                  : hasAnswered 
                    ? 'border-gray-300 opacity-50 cursor-not-allowed'
                    : 'border-gray-300 hover:border-purple-400',
                accessibility ? 'text-xl' : ''
              )}
              style={{ backgroundColor: hasAnswered ? 'transparent' : option.color }}
              aria-label={option.name}
            >
              <div className="text-6xl mb-2" style={{ color: option.color }}>
                {option.shape}
              </div>
              {accessibility && (
                <div className="text-sm text-gray-700 font-medium">
                  {option.name}
                </div>
              )}
              
              {hasAnswered && selectedOption === option.id && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">✓</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            {hasAnswered 
              ? '¡Respuesta enviada! Esperando siguiente pregunta...'
              : 'Toca o presiona Enter en el color y forma correctos'
            }
          </p>
        </div>
      </div>
    </div>
  )
} 