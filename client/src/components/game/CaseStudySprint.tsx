'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SpeakerWaveIcon,
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface CaseQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  timeLimit: number
  bloomLevel: 'Comprender' | 'Aplicar' | 'Analizar' | 'Evaluar'
  points: number
  audio_url?: string
}

interface CaseStudy {
  title: string
  description: string
  context: string
  content: string
  questions: CaseQuestion[]
  totalTime: number
}

interface CaseStudySprintProps {
  caseStudy: CaseStudy
  onComplete: (result: { 
    score: number
    correctAnswers: number
    totalQuestions: number
    timeSpent: number
    answers: Array<{ questionId: string; answer: number; isCorrect: boolean; timeSpent: number }>
  }) => void
  onExit: () => void
  extendedTimeMode?: boolean
  enableAudio?: boolean
}

export function CaseStudySprint({ 
  caseStudy,
  onComplete, 
  onExit,
  extendedTimeMode = false,
  enableAudio = true 
}: CaseStudySprintProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1) // -1 means showing case study
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: number; isCorrect: boolean; timeSpent: number }>>([])
  const [questionTimeSpent, setQuestionTimeSpent] = useState(0)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const isShowingCase = currentQuestionIndex === -1
  const currentQuestion = currentQuestionIndex >= 0 ? caseStudy.questions[currentQuestionIndex] : null
  const timeMultiplier = extendedTimeMode ? 1.5 : 1.0

  // Timers
  useEffect(() => {
    if (gameEnded || showExplanation) return

    const timer = setInterval(() => {
      if (isShowingCase) {
        setTotalTimeSpent(prev => prev + 1)
      } else {
        setQuestionTimeSpent(prev => {
          const newTime = prev + 1
          const timeLimit = currentQuestion ? currentQuestion.timeLimit * timeMultiplier : 60
          
          if (newTime >= timeLimit) {
            handleTimeOut()
            return 0
          }
          return newTime
        })
        setTotalTimeSpent(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, gameEnded, showExplanation, extendedTimeMode])

  const startQuestions = () => {
    setCurrentQuestionIndex(0)
    setQuestionTimeSpent(0)
  }

  const handleTimeOut = () => {
    if (!currentQuestion) return
    
    // Auto-submit with no answer (incorrect)
    const answer = {
      questionId: currentQuestion.id,
      answer: -1, // -1 indicates timeout
      isCorrect: false,
      timeSpent: currentQuestion.timeLimit * timeMultiplier
    }
    
    setAnswers(prev => [...prev, answer])
    nextQuestion()
  }

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const submitAnswer = () => {
    if (!currentQuestion || selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const answer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect,
      timeSpent: questionTimeSpent
    }

    setAnswers(prev => [...prev, answer])
    setShowExplanation(true)
    
    setTimeout(() => {
      setShowExplanation(false)
      setSelectedAnswer(null)
      nextQuestion()
    }, 3000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex >= caseStudy.questions.length - 1) {
      endGame()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setQuestionTimeSpent(0)
    }
  }

  const endGame = () => {
    setGameEnded(true)
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const totalScore = answers.reduce((sum, answer) => {
      if (answer.isCorrect) {
        const question = caseStudy.questions.find(q => q.id === answer.questionId)
        return sum + (question?.points || 0)
      }
      return sum
    }, 0)

    onComplete({
      score: totalScore,
      correctAnswers,
      totalQuestions: caseStudy.questions.length,
      timeSpent: totalTimeSpent,
      answers
    })
  }

  const playAudio = (url?: string) => {
    if (!enableAudio || !url) return
    
    setIsPlaying(true)
    const audio = new Audio(url)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(() => setIsPlaying(false))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getBloomColor = (level: string) => {
    switch (level) {
      case 'Comprender': return 'bg-blue-100 text-blue-800'
      case 'Aplicar': return 'bg-green-100 text-green-800'
      case 'Analizar': return 'bg-yellow-100 text-yellow-800'
      case 'Evaluar': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Game completed screen
  if (gameEnded) {
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const accuracy = Math.round((correctAnswers / caseStudy.questions.length) * 100)
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Caso de Estudio Completado!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{answers.reduce((sum, a) => {
                if (a.isCorrect) {
                  const q = caseStudy.questions.find(q => q.id === a.questionId)
                  return sum + (q?.points || 0)
                }
                return sum
              }, 0)}</div>
              <div className="text-sm text-blue-800">Puntos Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}/{caseStudy.questions.length}</div>
              <div className="text-sm text-green-800">Respuestas Correctas</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
              <div className="text-sm text-purple-800">Precisión</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{formatTime(totalTimeSpent)}</div>
              <div className="text-sm text-orange-800">Tiempo Total</div>
            </div>
          </div>

          {/* Performance by Bloom Level */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Nivel de Bloom</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Comprender', 'Aplicar', 'Analizar', 'Evaluar'].map(level => {
                const levelQuestions = caseStudy.questions.filter(q => q.bloomLevel === level)
                const levelCorrect = answers.filter(a => {
                  const question = caseStudy.questions.find(q => q.id === a.questionId)
                  return question?.bloomLevel === level && a.isCorrect
                }).length
                
                if (levelQuestions.length === 0) return null
                
                return (
                  <div key={level} className={`p-3 rounded-lg ${getBloomColor(level)}`}>
                    <div className="font-semibold">{level}</div>
                    <div className="text-sm">{levelCorrect}/{levelQuestions.length}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={onExit} className="w-full">
              Finalizar Caso de Estudio
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Case study reading phase
  if (isShowingCase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600">
        {/* Header */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DocumentTextIcon className="h-8 w-8 text-white" />
                <div className="text-white">
                  <h1 className="text-xl font-bold">{caseStudy.title}</h1>
                  <div className="text-sm opacity-90">
                    {caseStudy.questions.length} preguntas • Tiempo total estimado: {Math.floor(caseStudy.totalTime / 60)} min
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-white text-right">
                  <div className="text-sm opacity-90">Tiempo leyendo</div>
                  <div className="font-mono text-lg">{formatTime(totalTimeSpent)}</div>
                </div>
                
                {extendedTimeMode && (
                  <div className="bg-orange-500 text-white px-3 py-1 rounded text-sm">
                    Tiempo Extendido
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Case Content */}
        <div className="max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{caseStudy.title}</h2>
              <p className="text-blue-100">{caseStudy.description}</p>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                    <LightBulbIcon className="h-5 w-5 mr-2" />
                    Contexto
                  </h3>
                  <p className="text-blue-800">{caseStudy.context}</p>
                </div>

                <div className="text-gray-800 leading-relaxed">
                  {caseStudy.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Léelo con atención. Una vez que inicies las preguntas, tendrás tiempo limitado.
                </span>
              </div>
              
              <Button 
                onClick={startQuestions}
                className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700"
              >
                Iniciar Preguntas ({caseStudy.questions.length})
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Question phase
  if (currentQuestion) {
    const timeLimit = currentQuestion.timeLimit * timeMultiplier
    const timePercentage = (questionTimeSpent / timeLimit) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600">
        {/* Header */}
        <div className="bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ChartBarIcon className="h-8 w-8 text-white" />
                <div className="text-white">
                  <h1 className="text-xl font-bold">Pregunta {currentQuestionIndex + 1} de {caseStudy.questions.length}</h1>
                  <div className="text-sm opacity-90">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${getBloomColor(currentQuestion.bloomLevel)}`}>
                      {currentQuestion.bloomLevel}
                    </span>
                    <span className="ml-2">{currentQuestion.points} puntos</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-white text-right">
                  <div className="text-sm opacity-90">Tiempo restante</div>
                  <div className="font-mono text-lg text-yellow-300">
                    {formatTime(timeLimit - questionTimeSpent)}
                  </div>
                </div>
                
                <div className="w-20 h-2 bg-black bg-opacity-30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      timePercentage > 80 ? 'bg-red-400' :
                      timePercentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${timePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {!showExplanation ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
              >
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex-1">
                      {currentQuestion.question}
                    </h2>
                    
                    {currentQuestion.audio_url && (
                      <Button
                        onClick={() => playAudio(currentQuestion.audio_url)}
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        disabled={isPlaying}
                      >
                        <SpeakerWaveIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    Confirmar Respuesta
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="explanation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-8"
              >
                <div className="text-center mb-6">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? '¡Correcto!' : 'Incorrecto'}
                  </h3>
                  
                  <p className="text-gray-600">
                    {selectedAnswer === currentQuestion.correctAnswer 
                      ? `+${currentQuestion.points} puntos`
                      : 'La respuesta correcta era: ' + currentQuestion.options[currentQuestion.correctAnswer]
                    }
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Explicación:</h4>
                  <p className="text-blue-800">{currentQuestion.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return null
} 