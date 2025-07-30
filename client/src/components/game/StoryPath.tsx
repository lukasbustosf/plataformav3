'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpenIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'

interface StoryNode {
  id: string
  title: string
  content: string
  choices: Choice[]
  isEnding?: boolean
  illustration?: string
  audio_url?: string
  points?: number
}

interface Choice {
  id: string
  text: string
  nextNodeId: string
  consequence?: string
  points: number
}

interface StoryPathProps {
  story: {
    title: string
    description: string
    nodes: StoryNode[]
    startNodeId: string
  }
  onComplete: (result: { score: number; path: string[]; timeSpent: number }) => void
  onExit: () => void
  timeLimit?: number
  enableAudio?: boolean
}

export function StoryPath({ 
  story, 
  onComplete, 
  onExit, 
  timeLimit = 1200, // 20 minutes default
  enableAudio = true 
}: StoryPathProps) {
  const [currentNodeId, setCurrentNodeId] = useState(story.startNodeId)
  const [visitedNodes, setVisitedNodes] = useState<string[]>([story.startNodeId])
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)

  const currentNode = story.nodes.find(node => node.id === currentNodeId)

  // Anunciar inicio de historia con TTS
  useEffect(() => {
    if (enableAudio && currentNode && visitedNodes.length === 1) {
      ttsService.speakInstructions('story_path', `Historia interactiva: ${story.title}. Lee cada capítulo y elige tu camino para determinar el final de la historia.`)
    }
  }, [story.title, enableAudio, currentNode, visitedNodes.length])

  useEffect(() => {
    if (gameEnded) return

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1
        if (newTime >= timeLimit) {
          handleGameEnd('timeout')
          return prev
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit, gameEnded])

  const handleChoice = (choice: Choice) => {
    const newScore = score + choice.points
    setScore(newScore)
    
    const newPath = [...visitedNodes, choice.nextNodeId]
    setVisitedNodes(newPath)
    setCurrentNodeId(choice.nextNodeId)

    // Anunciar decisión con TTS
    if (enableAudio) {
      ttsService.speak(`Has elegido: ${choice.text}. Ganaste ${choice.points} puntos.`, { 
        rate: 1.0, 
        volume: 0.8 
      })
    }

    const nextNode = story.nodes.find(node => node.id === choice.nextNodeId)
    if (nextNode?.isEnding) {
      handleGameEnd('completed', newScore, newPath)
    }
  }

  const handleGameEnd = (reason: 'completed' | 'timeout', finalScore = score, finalPath = visitedNodes) => {
    setGameEnded(true)
    
    // Anunciar final con TTS
    if (enableAudio) {
      const message = reason === 'completed' 
        ? `¡Historia completada! Obtuviste ${finalScore} puntos visitando ${finalPath.length} capítulos.`
        : 'Tiempo agotado. Historia finalizada.'
      ttsService.speak(message, { 
        rate: 1.0, 
        pitch: reason === 'completed' ? 1.2 : 0.8 
      })
    }
    
    onComplete({
      score: finalScore,
      path: finalPath,
      timeSpent: timeElapsed
    })
  }

  // Reemplazar playAudio con TTS para narración
  const speakStoryContent = () => {
    if (!enableAudio || !currentNode) return
    
    setIsPlaying(true)
    const fullContent = `${currentNode.title}. ${currentNode.content}`
    ttsService.speak(fullContent, { 
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

  const getProgressPercentage = () => {
    return Math.min((visitedNodes.length / story.nodes.length) * 100, 100)
  }

  if (!currentNode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Historia no encontrada</h2>
          <Button onClick={onExit} variant="outline">
            Salir
          </Button>
        </div>
      </div>
    )
  }

  if (gameEnded) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Historia Completada!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{score}</div>
              <div className="text-sm text-blue-800">Puntos Obtenidos</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{visitedNodes.length}</div>
              <div className="text-sm text-purple-800">Capítulos Visitados</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-green-800">Tiempo Total</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={onExit} className="w-full">
              Finalizar Juego
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpenIcon className="h-8 w-8 text-white" />
              <div className="text-white">
                <h1 className="text-xl font-bold">{story.title}</h1>
                <div className="text-sm opacity-90">
                  Capítulo {visitedNodes.length} • {score} puntos
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TTSControls position="inline" />
              
              <div className="text-white text-right">
                <div className="text-sm opacity-90">Tiempo</div>
                <div className="font-mono text-lg">
                  {formatTime(timeLimit - timeElapsed)}
                </div>
              </div>
              
              <Button 
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
              >
                Historia
              </Button>
              
              <Button 
                onClick={onExit}
                variant="outline"
                size="sm"
              >
                Salir
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white bg-opacity-20 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Story Content */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
              {currentNode.illustration && (
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <img 
                    src={currentNode.illustration} 
                    alt={currentNode.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {currentNode.title}
                  </h2>
                  
                  <div className="flex items-center space-x-3">
                    <TTSButton 
                      text={`${currentNode.title}. ${currentNode.content}`}
                      type="instruction"
                      gameType="story_path"
                      size="md"
                    />
                    
                    {(currentNode.audio_url || enableAudio) && (
                      <Button
                        onClick={speakStoryContent}
                        disabled={isPlaying}
                        variant="outline"
                        size="sm"
                      >
                        <SpeakerWaveIcon className="h-4 w-4 mr-2" />
                        {isPlaying ? 'Reproduciendo...' : 'Escuchar'}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                  {currentNode.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Choices */}
                {!currentNode.isEnding && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        ¿Qué decides hacer?
                      </h3>
                      <TTSButton 
                        text={`Tienes ${currentNode.choices.length} opciones: ${currentNode.choices.map((c, i) => `Opción ${String.fromCharCode(65 + i)}: ${c.text}`).join('. ')}`}
                        type="instruction"
                        gameType="story_path"
                        size="sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {currentNode.choices.map((choice, index) => (
                        <motion.button
                          key={choice.id}
                          onClick={() => handleChoice(choice)}
                          className="text-left p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-lg font-semibold text-gray-900">
                                  {choice.text}
                                </span>
                                <TTSButton 
                                  text={`Opción ${String.fromCharCode(65 + index)}: ${choice.text}${choice.consequence ? `. ${choice.consequence}` : ''}. Vale ${choice.points} puntos.`}
                                  type="instruction"
                                  gameType="story_path"
                                  size="sm"
                                />
                              </div>
                              
                              {choice.consequence && (
                                <p className="text-sm text-gray-600 ml-11">
                                  {choice.consequence}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-blue-600">
                                +{choice.points} pts
                              </span>
                              <ArrowRightIcon className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {currentNode.isEnding && (
                  <div className="text-center">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-900 mb-2">
                        ¡Fin de la Historia!
                      </h3>
                      <p className="text-green-700">
                        Has completado esta rama de la historia.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => handleGameEnd('completed')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Ver Resultados
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Camino Recorrido</h3>
                <TTSButton 
                  text={`Camino recorrido en la historia: ${visitedNodes.map((nodeId, i) => {
                    const node = story.nodes.find(n => n.id === nodeId)
                    return `Capítulo ${i + 1}: ${node?.title || 'Desconocido'}`
                  }).join('. ')}`}
                  type="instruction"
                  gameType="story_path"
                  size="sm"
                />
              </div>
              <div className="space-y-3">
                {visitedNodes.map((nodeId, index) => {
                  const node = story.nodes.find(n => n.id === nodeId)
                  return (
                    <div key={nodeId} className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span className="text-sm">{node?.title}</span>
                    </div>
                  )
                })}
              </div>
              
              <Button 
                onClick={() => setShowHistory(false)}
                className="w-full mt-4"
                variant="outline"
              >
                Cerrar
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 