'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Confetti from 'react-confetti'
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ClockIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/store/auth'
import { useGameWebSocket } from '@/lib/websocket'
import { announceToScreenReader, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import TTSControls, { TTSButton, useTTS } from '@/components/ui/ttsControls'
import { speakQuestion, speakFeedback } from '@/lib/ttsService'
import type { GameSession, Question, GameParticipant, GameComponentProps } from '@/types'

interface TriviaLightningProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
  showHints?: boolean
}

// 🎨 SKIN INTEGRATION - Function to get skin styling
function getSkinStyling(appliedSkin: any) {
  if (!appliedSkin) {
    return {
      containerClass: 'bg-gradient-to-br from-blue-600 to-purple-700',
      questionClass: 'bg-white/90 text-gray-900',
      buttonClass: 'bg-blue-500 hover:bg-blue-600',
      accentColor: '#3B82F6',
      feedback: {
        correct: '¡Correcto!',
        incorrect: 'Incorrecto'
      }
    }
  }

  const { theme, elements, engine_config } = appliedSkin

  return {
    containerClass: `bg-gradient-to-br from-orange-600 to-yellow-700`,
    questionClass: 'bg-orange-50/95 text-orange-900 border-2 border-orange-200',
    buttonClass: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700',
    accentColor: theme.accent_color || '#F59E0B',
    primaryColor: theme.primary_color || '#F59E0B',
    farmElements: elements.counters || ['🐄', '🐷', '🐔', '🐑', '🐰'],
    feedback: {
      correct: '¡Excelente! Muy bien contado!',
      incorrect: 'Vamos a intentar de nuevo'
    },
    farmTheme: true
  }
}

// 🐄 FARM FEEDBACK Function to create farm-themed feedback
function getFarmFeedback(isCorrect: boolean, farmContext: any, appliedSkin: any) {
  if (!farmContext || !appliedSkin) {
    return isCorrect ? '¡Correcto!' : 'Incorrecto'
  }

  if (isCorrect) {
    const animalSound = farmContext.animal_sound || 'muy bien'
    return `¡Excelente! ${farmContext.narrative || 'Muy bien contado'} - ${animalSound}!`
  } else {
    return 'Vamos a contar de nuevo juntos'
  }
}

export function TriviaLightning({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 30,
  showHints = true,
  accessibility = true,
  soundEnabled = true
}: TriviaLightningProps) {
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [participants, setParticipants] = useState<GameParticipant[]>([])
  const [showResults, setShowResults] = useState(false)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'question' | 'results' | 'finished'>('waiting')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [totalQuestions] = useState(session.quizzes?.questions?.length || 10)
  const [showConfetti, setShowConfetti] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [startTime, setStartTime] = useState<number | null>(null)
  
  const timerRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLHeadingElement>(null)
  
  const gameWS = useGameWebSocket(session.session_id)

  // 🎨 GET APPLIED SKIN
  const appliedSkin = session.applied_skin
  const skinStyling = getSkinStyling(appliedSkin)
  
  console.log('🎨 Applied Skin:', appliedSkin)
  console.log('🎨 Skin Styling:', skinStyling)

  // Auto-start demo mode
  useEffect(() => {
    // If we have a current question on mount, this is demo mode - auto start
    if (currentQuestion && gamePhase === 'waiting') {
      setGamePhase('question')
      setStartTime(Date.now())
      
      if (accessibility && questionRef.current) {
        setTimeout(() => {
          if (questionRef.current) {
            questionRef.current.focus()
            announceToScreenReader(`Pregunta ${questionNumber} de ${totalQuestions}`)
          }
        }, 100)
      }
    }
  }, [currentQuestion, gamePhase, accessibility, questionNumber, totalQuestions])

  // WebSocket event handlers
  useEffect(() => {
    const handleGameQuestion = (data: any) => {
      setGamePhase('question')
      setSelectedAnswer(null)
      setHasAnswered(false)
      setShowResults(false)
      setStartTime(Date.now())
      setQuestionNumber(data.questionNumber || questionNumber + 1)
      
      if (accessibility && questionRef.current) {
        questionRef.current.focus()
        announceToScreenReader(`Pregunta ${questionNumber} de ${totalQuestions}`)
      }
    }

    const handleGameAnswer = (data: any) => {
      // Update live results or participant feedback
      if (data.isCorrect && data.userId === user.user_id) {
        playSuccessSound()
        setScore(prev => prev + calculatePoints(data.timeElapsed))
        setStreak(prev => prev + 1)
      } else if (data.userId === user.user_id) {
        playErrorSound()
        setStreak(0)
      }
    }

    const handleLeaderboard = (data: any) => {
      setParticipants(data.participants || [])
      setGamePhase('results')
      setShowResults(true)
      
      // Show confetti for top performers
      const userRank = data.participants.findIndex((p: any) => p.user_id === user.user_id)
      if (userRank <= 2) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
      
      if (accessibility) {
        const userParticipant = data.participants.find((p: any) => p.user_id === user.user_id)
        if (userParticipant) {
          announceToScreenReader(`Tu puntuación: ${userParticipant.score} puntos. Posición: ${userRank + 1}`)
        }
      }
    }

    const handleGameEnd = (data: any) => {
      setGamePhase('finished')
      setParticipants(data.final_scores || [])
      
      if (accessibility) {
        announceToScreenReader('Juego terminado. Ver resultados finales.')
      }
      
      // Auto redirect after showing results
      setTimeout(() => {
        onGameEnd()
      }, 10000)
    }

    gameWS.on('gameQuestion', handleGameQuestion)
    gameWS.on('gameAnswer', handleGameAnswer)
    gameWS.on('gameLeaderboard', handleLeaderboard)
    gameWS.on('gameEnded', handleGameEnd)

    return () => {
      gameWS.off('gameQuestion', handleGameQuestion)
      gameWS.off('gameAnswer', handleGameAnswer)
      gameWS.off('gameLeaderboard', handleLeaderboard)
      gameWS.off('gameEnded', handleGameEnd)
    }
  }, [gameWS, user.user_id, questionNumber, totalQuestions, accessibility, onGameEnd])

  const calculatePoints = (timeElapsed: number): number => {
    const basePoints = 100
    const timeBonus = Math.max(0, (30 - timeElapsed) * 2)
    const streakBonus = streak * 10
    return Math.round(basePoints + timeBonus + streakBonus)
  }

  const playSuccessSound = () => {
    if (audioEnabled) {
      // 🎨 Use farm feedback with skin applied
      const farmContext = currentQuestion?.farm_context
      const feedback = getFarmFeedback(true, farmContext, appliedSkin)
      speakFeedback(true, feedback)
    }
  }

  const playErrorSound = () => {
    if (audioEnabled) {
      // 🎨 Use farm feedback with skin applied
      const farmContext = currentQuestion?.farm_context
      const feedback = getFarmFeedback(false, farmContext, appliedSkin)
      speakFeedback(false, feedback)
    }
  }

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (hasAnswered || gamePhase !== 'question') return
    
    setSelectedAnswer(answerIndex)
    setHasAnswered(true)
    
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 30
    
    // In demo mode, skip WebSocket calls
    try {
      if (gameWS.isConnected) {
        gameWS.submitAnswer(
          currentQuestion?.question_id || '',
          answerIndex,
          timeElapsed
        )
      }
    } catch (error) {
      // Ignore WebSocket errors in demo mode
      console.log('Demo mode: Skipping WebSocket submission')
    }
    
    // Call parent handler
    onAnswer(answerIndex)
    
    // Simulate instant feedback in demo mode
    const isCorrect = answerIndex === (currentQuestion?.correct_answer ?? 0)
    if (isCorrect) {
      playSuccessSound()
      setScore(prev => prev + calculatePoints(timeElapsed))
      setStreak(prev => prev + 1)
    } else {
      playErrorSound()
      setStreak(0)
    }
    
    // Auto-progress in demo mode
    if (!gameWS.isConnected) {
      setTimeout(() => {
        if (questionNumber >= totalQuestions) {
          setGamePhase('finished')
          setTimeout(() => onGameEnd(), 3000)
        } else {
          // Reset for next question in demo
          setSelectedAnswer(null)
          setHasAnswered(false)
          setQuestionNumber(prev => prev + 1)
          setStartTime(Date.now())
        }
      }, 2000)
    }
    
    if (accessibility) {
      announceToScreenReader(`Respuesta seleccionada: opción ${answerIndex + 1}`)
    }
  }, [hasAnswered, gamePhase, startTime, currentQuestion, gameWS, onAnswer, accessibility])

  const getProgressPercentage = (): number => {
    return ((questionNumber - 1) / totalQuestions) * 100
  }

  const getTimeProgressPercentage = (): number => {
    return (timeRemaining / 30) * 100
  }

  if (!currentQuestion && gamePhase === 'question') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Cargando pregunta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      appliedSkin?.skin_name === "🐄 Granja 1° Básico" 
        ? "bg-gradient-to-br from-orange-100 via-yellow-50 to-green-100" 
        : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
    )}>
      {/* 🐄 FARM BACKGROUND EFFECTS */}
      {appliedSkin?.skin_name === "🐄 Granja 1° Básico" ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce">🐄</div>
          <div className="absolute top-20 right-20 text-3xl opacity-20 animate-bounce delay-1000">🐔</div>
          <div className="absolute bottom-20 left-1/3 text-4xl opacity-20 animate-bounce delay-2000">🐷</div>
          <div className="absolute bottom-10 right-10 text-3xl opacity-20 animate-bounce delay-3000">🐑</div>
          <div className="absolute top-1/2 left-20 text-2xl opacity-20 animate-bounce delay-4000">🌾</div>
          <div className="absolute top-1/3 right-1/3 text-2xl opacity-20 animate-bounce delay-5000">🌻</div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-32 bg-gradient-to-b from-yellow-400 to-transparent opacity-20 animate-pulse" />
          <div className="absolute top-20 right-20 w-2 h-24 bg-gradient-to-b from-blue-400 to-transparent opacity-20 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-2 h-28 bg-gradient-to-b from-purple-400 to-transparent opacity-20 animate-pulse delay-2000" />
        </div>
      )}

      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      {/* Header with Progress */}
      <div className={cn(
        "shadow-sm border-b-4",
        appliedSkin?.skin_name === "🐄 Granja 1° Básico" 
          ? "bg-orange-50 border-orange-400" 
          : "bg-white border-primary-500"
      )}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Game Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  appliedSkin?.skin_name === "🐄 Granja 1° Básico" 
                    ? "bg-orange-500" 
                    : "bg-primary-500"
                )}>
                  <span className="text-white font-bold">
                    {appliedSkin?.skin_name === "🐄 Granja 1° Básico" ? "🐄" : "⚡"}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {appliedSkin?.skin_name === "🐄 Granja 1° Básico" 
                    ? "Conteo en la Granja" 
                    : "Trivia Lightning"
                  }
                </h1>
              </div>
              
              <div className="text-sm text-gray-600">
                Pregunta {questionNumber} de {totalQuestions}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {/* TTS Controls */}
              <TTSControls
                gameType="trivia_lightning"
                currentQuestion={currentQuestion?.stem_md}
                instructions="Responde la pregunta contando los animales"
                position="inline"
                showAdvancedControls={false}
                className="!relative !bottom-auto !right-auto !shadow-sm !border !p-2"
              />
              
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
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className={cn(
                "h-3 rounded-full transition-all duration-1000 ease-out",
                appliedSkin?.skin_name === "🐄 Granja 1° Básico" 
                  ? "bg-gradient-to-r from-orange-400 to-yellow-400" 
                  : "bg-gradient-to-r from-primary-400 to-purple-400"
              )}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Tiempo restante</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className={cn(
                  "w-16 h-3 rounded-full",
                  timeRemaining > 15 
                    ? (appliedSkin?.skin_name === "🐄 Granja 1° Básico" ? "bg-green-200" : "bg-green-200")
                    : timeRemaining > 5 
                    ? "bg-yellow-200" 
                    : "bg-red-200"
                )}
              >
                <div 
                  className={cn(
                    "h-3 rounded-full transition-all duration-1000",
                    timeRemaining > 15 
                      ? (appliedSkin?.skin_name === "🐄 Granja 1° Básico" ? "bg-green-500" : "bg-green-500")
                      : timeRemaining > 5 
                      ? "bg-yellow-500" 
                      : "bg-red-500"
                  )}
                  style={{ width: `${getTimeProgressPercentage()}%` }}
                />
              </div>
              <span className={cn(
                "text-lg font-bold",
                timeRemaining <= 5 ? "text-red-600 animate-pulse" : "text-gray-700"
              )}>
                {timeRemaining}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Score Display */}
          <div className="mb-6 flex items-center justify-center space-x-6">
            <div className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-full shadow-lg",
              appliedSkin?.skin_name === "🐄 Granja 1° Básico" 
                ? "bg-orange-100 text-orange-800" 
                : "bg-primary-100 text-primary-800"
            )}>
              <TrophyIcon className="h-5 w-5" />
              <span className="font-bold">{score} puntos</span>
            </div>
            
            {streak > 0 && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full shadow-lg">
                <FireIcon className="h-5 w-5" />
                <span className="font-bold">{streak} seguidas</span>
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className={cn(
            "shadow-xl rounded-2xl p-8 mb-8 border-4",
            appliedSkin?.skin_name === "🐄 Granja 1° Básico"
              ? "bg-orange-50 border-orange-200"
              : "bg-white border-primary-200"
          )}>
            {/* 🐄 FARM VISUAL */}
            {currentQuestion?.farm_context?.visual && appliedSkin?.skin_name === "🐄 Granja 1° Básico" && (
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 leading-relaxed">
                  {currentQuestion.farm_context.visual}
                </div>
                <p className="text-orange-700 text-lg italic">
                  {currentQuestion.farm_context.narrative}
                </p>
              </div>
            )}

            <h2 
              ref={questionRef}
              className="text-3xl font-bold text-center mb-8 text-gray-800"
              tabIndex={-1}
            >
              {currentQuestion?.stem_md?.replace(/^🐔|🐄|🐷|🐑|🐰/, '')}
            </h2>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion?.options_json?.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={hasAnswered}
                  className={cn(
                    "relative p-6 rounded-xl text-xl font-bold transition-all duration-300 transform border-3",
                    hasAnswered && selectedAnswer === index && index === (currentQuestion?.correct_answer ?? 0)
                      ? appliedSkin?.skin_name === "🐄 Granja 1° Básico"
                        ? "bg-green-200 border-green-400 text-green-800 scale-105 shadow-2xl"
                        : "bg-green-200 border-green-400 text-green-800 scale-105 shadow-2xl"
                      : hasAnswered && selectedAnswer === index
                      ? "bg-red-200 border-red-400 text-red-800"
                      : hasAnswered
                      ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                      : appliedSkin?.skin_name === "🐄 Granja 1° Básico"
                      ? "bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200 hover:border-orange-400 hover:scale-105 hover:shadow-lg"
                      : "bg-primary-100 border-primary-300 text-primary-800 hover:bg-primary-200 hover:border-primary-400 hover:scale-105 hover:shadow-lg"
                  )}
                  aria-pressed={selectedAnswer === index}
                  aria-describedby={`option-${index}-description`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-4xl font-bold">{option}</span>
                    {appliedSkin?.skin_name === "🐄 Granja 1° Básico" && (
                      <span className="text-2xl">
                        {skinStyling.farmElements[index % skinStyling.farmElements.length]}
                      </span>
                    )}
                  </div>
                  
                  {/* Feedback Animation */}
                  {hasAnswered && selectedAnswer === index && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={cn(
                        "text-4xl animate-bounce",
                        index === (currentQuestion?.correct_answer ?? 0) ? "text-green-600" : "text-red-600"
                      )}>
                        {index === (currentQuestion?.correct_answer ?? 0) ? "✅" : "❌"}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Farm Context Explanation */}
            {hasAnswered && currentQuestion?.farm_context && appliedSkin?.skin_name === "🐄 Granja 1° Básico" && (
              <div className="mt-6 p-4 bg-orange-100 rounded-lg border-2 border-orange-200">
                <p className="text-center text-orange-800 font-medium">
                  {selectedAnswer === (currentQuestion?.correct_answer ?? 0) 
                    ? `¡Excelente! ${currentQuestion.explanation} - ${currentQuestion.farm_context.animal_sound}!`
                    : "Vamos a contar de nuevo juntos"
                  }
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {gamePhase === 'finished' && (
              <Button
                onClick={onGameEnd}
                className={cn(
                  "px-8 py-3 text-lg font-bold rounded-xl",
                  appliedSkin?.skin_name === "🐄 Granja 1° Básico"
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-primary-500 hover:bg-primary-600"
                )}
              >
                Ver Resultados 🏆
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 