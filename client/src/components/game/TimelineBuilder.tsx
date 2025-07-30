'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SpeakerWaveIcon,
  CalendarDaysIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  year: number
  category: string
  importance: 'low' | 'medium' | 'high'
  imageUrl?: string
  audio_url?: string
}

interface TimelineChallenge {
  id: string
  title: string
  description: string
  context: string
  events: TimelineEvent[]
  correctOrder: string[]
  timeLimit: number
  hints: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  bloomLevel: 'Comprender' | 'Analizar' | 'Crear'
  points: number
}

interface TimelineBuilderProps {
  challenge: TimelineChallenge
  onComplete: (result: { 
    score: number
    correctOrder: boolean
    timeSpent: number
    attempts: number
    hintsUsed: number
  }) => void
  onExit: () => void
  enableHints?: boolean
  enableAudio?: boolean
}

export function TimelineBuilder({ 
  challenge,
  onComplete, 
  onExit,
  enableHints = true,
  enableAudio = true 
}: TimelineBuilderProps) {
  const [userOrder, setUserOrder] = useState<string[]>([])
  const [availableEvents, setAvailableEvents] = useState<TimelineEvent[]>(
    challenge.events.sort(() => Math.random() - 0.5) // Shuffle events
  )
  const [timeSpent, setTimeSpent] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const [draggedEvent, setDraggedEvent] = useState<TimelineEvent | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Anunciar instrucciones al inicio
  useEffect(() => {
    if (enableAudio) {
      ttsService.speakInstructions('timeline_builder', `Desafío de cronología: ${challenge.title}. Arrastra los eventos del más antiguo al más reciente para construir la línea de tiempo correcta.`)
    }
  }, [challenge.title, enableAudio])

  useEffect(() => {
    if (gameEnded) return

    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1
        if (newTime >= challenge.timeLimit) {
          handleTimeOut()
          return prev
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameEnded, challenge.timeLimit])

  const addEventToTimeline = (event: TimelineEvent, position?: number) => {
    const insertPos = position !== undefined ? position : userOrder.length
    const newOrder = [...userOrder]
    newOrder.splice(insertPos, 0, event.id)
    setUserOrder(newOrder)
    setAvailableEvents(prev => prev.filter(e => e.id !== event.id))

    // Feedback de accesibilidad con TTS
    if (enableAudio) {
      ttsService.speak(`${event.title} agregado a la línea de tiempo en posición ${insertPos + 1}`, { volume: 0.7 })
    }
  }

  const removeEventFromTimeline = (eventId: string, index: number) => {
    const event = challenge.events.find(e => e.id === eventId)
    if (event) {
      setUserOrder(prev => prev.filter((_, i) => i !== index))
      setAvailableEvents(prev => [...prev, event])

      // Feedback de accesibilidad con TTS
      if (enableAudio) {
        ttsService.speak(`${event.title} removido de la línea de tiempo`, { volume: 0.7 })
      }
    }
  }

  const moveEventInTimeline = (fromIndex: number, toIndex: number) => {
    const newOrder = [...userOrder]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setUserOrder(newOrder)
  }

  const checkOrder = () => {
    setAttempts(prev => prev + 1)
    const correct = JSON.stringify(userOrder) === JSON.stringify(challenge.correctOrder)
    setIsCorrect(correct)
    setShowResult(true)

    // Feedback con TTS
    if (enableAudio) {
      if (correct) {
        ttsService.speak('¡Perfecto! Has ordenado correctamente todos los eventos', { 
          rate: 1.0, 
          pitch: 1.3, 
          volume: 1.0 
        })
      } else {
        ttsService.speak('Orden incorrecto. Algunos eventos no están en el orden correcto. ¡Sigue intentando!', { 
          rate: 1.0, 
          pitch: 0.9, 
          volume: 0.9 
        })
      }
    }

    if (correct) {
      setTimeout(() => {
        setGameEnded(true)
        onComplete({
          score: calculateScore(),
          correctOrder: true,
          timeSpent,
          attempts,
          hintsUsed
        })
      }, 3000)
    } else {
      setTimeout(() => {
        setShowResult(false)
      }, 3000)
    }
  }

  const handleTimeOut = () => {
    setGameEnded(true)
    if (enableAudio) {
      ttsService.speak('Tiempo agotado', { rate: 1.0, pitch: 0.8 })
    }
    onComplete({
      score: 0,
      correctOrder: false,
      timeSpent: challenge.timeLimit,
      attempts,
      hintsUsed
    })
  }

  const calculateScore = (): number => {
    const baseScore = challenge.points
    const timeBonus = Math.max(0, challenge.timeLimit - timeSpent)
    const attemptsBonus = Math.max(0, (10 - attempts) * 50)
    const hintsBonus = Math.max(0, (challenge.hints.length - hintsUsed) * 20)
    return baseScore + timeBonus + attemptsBonus + hintsBonus
  }

  const showNextHint = () => {
    if (hintsUsed < challenge.hints.length) {
      setCurrentHint(challenge.hints[hintsUsed])
      setHintsUsed(prev => prev + 1)
      setShowHint(true)

      // Leer pista con TTS
      if (enableAudio) {
        ttsService.speak(`Pista: ${challenge.hints[hintsUsed]}`, { rate: 0.9 })
      }

      setTimeout(() => setShowHint(false), 5000)
    }
  }

  // Reemplazar playAudio con TTS para descripciones de eventos
  const speakEventDetails = (event: TimelineEvent) => {
    if (!enableAudio) return
    
    setIsPlaying(true)
    const fullDescription = `${event.title}, ${event.date}. ${event.description}`
    ttsService.speak(fullDescription, { 
      rate: 0.9, 
      volume: 0.8,
      onEnd: () => setIsPlaying(false)
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'politics': 'bg-red-500',
      'science': 'bg-blue-500',
      'culture': 'bg-purple-500',
      'economy': 'bg-green-500',
      'war': 'bg-gray-700',
      'technology': 'bg-indigo-500',
      'social': 'bg-yellow-500',
      'default': 'bg-gray-500'
    }
    return colors[category.toLowerCase()] || colors.default
  }

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high': return '⭐⭐⭐'
      case 'medium': return '⭐⭐'
      case 'low': return '⭐'
      default: return ''
    }
  }

  const onDragStart = (e: React.DragEvent, event: TimelineEvent) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget(index)
  }

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedEvent) {
      addEventToTimeline(draggedEvent, index)
    }
    setDraggedEvent(null)
    setDropTarget(null)
  }

  if (gameEnded) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          {isCorrect ? (
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {isCorrect ? '¡Línea de Tiempo Completada!' : 'Tiempo Agotado'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{calculateScore()}</div>
              <div className="text-sm text-blue-800">Puntos Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{attempts}</div>
              <div className="text-sm text-green-800">Intentos</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-purple-800">Tiempo</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={onExit} className="w-full">
              Finalizar Timeline
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <div className="flex items-center text-orange-100 text-sm mt-1">
                  <span className="mr-4">Dificultad: {challenge.difficulty}</span>
                  <span className="mr-4">Materia: {challenge.subject}</span>
                  <span>Nivel: {challenge.bloomLevel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TTSControls position="inline" />
              
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(challenge.timeLimit - timeSpent)}</div>
                <div className="text-orange-200 text-sm">Tiempo restante</div>
              </div>

              <Button
                onClick={onExit}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-orange-600"
              >
                Salir
              </Button>

              {enableHints && hintsUsed < challenge.hints.length && (
                <Button
                  onClick={showNextHint}
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-orange-600"
                >
                  💡 Pista ({challenge.hints.length - hintsUsed})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-yellow-400 text-yellow-900 p-4 mx-4 mt-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2">💡</span>
                <span className="font-medium">Pista: {currentHint}</span>
              </div>
              <TTSButton 
                text={`Pista: ${currentHint}`}
                type="instruction"
                gameType="timeline_builder"
                size="sm"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6">
        {/* Challenge Description */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AcademicCapIcon className="h-6 w-6 text-orange-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Desafío</h2>
            </div>
            <TTSButton 
              text={`Desafío: ${challenge.description}. Contexto: ${challenge.context}`}
              type="instruction"
              gameType="timeline_builder"
              size="md"
            />
          </div>
          
          <p className="text-gray-700 mb-4">{challenge.description}</p>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">Contexto:</h3>
            <p className="text-orange-800 text-sm">{challenge.context}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Events */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Eventos Disponibles ({availableEvents.length})
              </h2>
              <TTSButton 
                text={`Eventos disponibles para organizar: ${availableEvents.map(e => `${e.title}, ${e.date}`).join('. ')}`}
                type="instruction"
                gameType="timeline_builder"
                size="sm"
              />
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableEvents.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, event)}
                  className="border border-gray-200 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all transform hover:scale-102"
                  onClick={() => addEventToTimeline(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${getCategoryColor(event.category)}`} />
                        <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                        <span className="ml-2 text-xs">{getImportanceIcon(event.importance)}</span>
                      </div>
                      
                      <p className="text-gray-600 text-xs mb-2">{event.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-blue-600">{event.date}</span>
                        <div className="flex items-center space-x-2">
                          <TTSButton 
                            text={`${event.title}, ${event.date}. ${event.description}`}
                            type="instruction"
                            gameType="timeline_builder"
                            size="sm"
                          />
                          {(event.audio_url || enableAudio) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                speakEventDetails(event)
                              }}
                              className="text-blue-500 hover:text-blue-700"
                              disabled={isPlaying}
                            >
                              <SpeakerWaveIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Builder */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tu Línea de Tiempo ({userOrder.length}/{challenge.events.length})
              </h2>
              
              <div className="flex items-center space-x-2">
                <TTSButton 
                  text={userOrder.length > 0 ? `Tu línea de tiempo actual: ${userOrder.map((id, i) => {
                    const evt = challenge.events.find(e => e.id === id)
                    return evt ? `${i + 1}. ${evt.title}, ${evt.date}` : ''
                  }).join('. ')}` : 'La línea de tiempo está vacía. Arrastra eventos aquí.'}
                  type="instruction"
                  gameType="timeline_builder"
                  size="sm"
                />
                
                <Button
                  onClick={checkOrder}
                  disabled={userOrder.length !== challenge.events.length}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  Verificar Orden
                </Button>
              </div>
            </div>
            
            <div 
              className="min-h-96 border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3 overflow-y-auto"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, userOrder.length)}
            >
              {userOrder.length === 0 ? (
                <div className="text-gray-500 text-center py-20">
                  Arrastra eventos aquí para construir la línea de tiempo
                  <br />
                  <span className="text-sm">Del más antiguo al más reciente</span>
                </div>
              ) : (
                userOrder.map((eventId, index) => {
                  const event = challenge.events.find(e => e.id === eventId)
                  if (!event) return null
                  
                  return (
                    <motion.div
                      key={`${eventId}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                            {index + 1}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getCategoryColor(event.category)}`} />
                              <h3 className="font-semibold text-gray-900 text-sm">{event.title}</h3>
                              <span className="ml-2 text-xs">{getImportanceIcon(event.importance)}</span>
                            </div>
                            
                            <p className="text-gray-600 text-xs mb-1">{event.description}</p>
                            <span className="text-sm font-mono text-blue-600">{event.date}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => removeEventFromTimeline(eventId, index)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                      
                      {index < userOrder.length - 1 && (
                        <div className="absolute left-7 -bottom-3 w-0.5 h-6 bg-blue-300" />
                      )}
                    </motion.div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              {isCorrect ? (
                <>
                  <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Perfecto!</h3>
                  <p className="text-gray-600">Has ordenado correctamente todos los eventos</p>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Orden Incorrecto</h3>
                  <p className="text-gray-600">Algunos eventos no están en el orden correcto. ¡Sigue intentando!</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 