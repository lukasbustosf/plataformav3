'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  QuestionMarkCircleIcon,
  EyeIcon,
  StarIcon,
  TrophyIcon,
  SpeakerWaveIcon,
  ClockIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface RevealStage {
  id: string
  clue: string
  revealPercentage: number
  pointCost: number
  audio_url?: string
}

interface MysteryItem {
  id: string
  name: string
  description: string
  image_url: string
  category: string
  hints: string[]
  stages: RevealStage[]
}

interface MysteryBoxRevealProps {
  items: MysteryItem[]
  initialPoints?: number
  timeLimit?: number
  onComplete: (result: { score: number; itemsGuessed: number; timeSpent: number }) => void
  onExit: () => void
  enableAudio?: boolean
}

export function MysteryBoxReveal({ 
  items,
  initialPoints = 1000,
  timeLimit = 900, // 15 minutes
  onComplete, 
  onExit,
  enableAudio = true 
}: MysteryBoxRevealProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [revealedStages, setRevealedStages] = useState<Set<string>>(new Set())
  const [points, setPoints] = useState(initialPoints)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [userGuess, setUserGuess] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [itemsGuessed, setItemsGuessed] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [confettiVisible, setConfettiVisible] = useState(false)

  const currentItem = items[currentItemIndex]
  const maxRevealPercentage = Math.max(
    0,
    ...Array.from(revealedStages)
      .map(stageId => currentItem.stages.find(s => s.id === stageId)?.revealPercentage || 0)
  )

  // Timer
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

  // Auto-end if no more items
  useEffect(() => {
    if (currentItemIndex >= items.length) {
      endGame()
    }
  }, [currentItemIndex, items.length])

  const revealStage = (stage: RevealStage) => {
    if (points < stage.pointCost || revealedStages.has(stage.id)) return

    setPoints(prev => prev - stage.pointCost)
    setRevealedStages(prev => {
      const newSet = new Set(prev)
      newSet.add(stage.id)
      return newSet
    })
  }

  const useHint = () => {
    if (hintsUsed >= currentItem.hints.length || points < 50) return

    setPoints(prev => prev - 50)
    setHintsUsed(prev => prev + 1)
  }

  const submitGuess = () => {
    if (!userGuess.trim()) return

    const correct = userGuess.toLowerCase().trim() === currentItem.name.toLowerCase().trim()
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      // Bonus points for correct guess
      const bonusPoints = 200 + (100 - maxRevealPercentage) * 2 // More points for less revealed
      setPoints(prev => prev + bonusPoints)
      setItemsGuessed(prev => prev + 1)
      setConfettiVisible(true)
      
      setTimeout(() => setConfettiVisible(false), 3000)
      setTimeout(() => nextItem(), 3000)
    } else {
      setTimeout(() => {
        setShowResult(false)
        setIsCorrect(null)
        setUserGuess('')
      }, 2000)
    }
  }

  const skipItem = () => {
    nextItem()
  }

  const nextItem = () => {
    setCurrentItemIndex(prev => prev + 1)
    setRevealedStages(new Set())
    setUserGuess('')
    setShowResult(false)
    setIsCorrect(null)
    setHintsUsed(0)
  }

  const endGame = () => {
    setGameEnded(true)
    
    onComplete({
      score: points,
      itemsGuessed,
      timeSpent: timeElapsed
    })
  }

  const playAudio = (stage: RevealStage) => {
    if (!enableAudio || !stage.audio_url) return
    
    setIsPlaying(true)
    const audio = new Audio(stage.audio_url)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(() => setIsPlaying(false))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameEnded) {
    const accuracy = items.length > 0 ? (itemsGuessed / items.length) * 100 : 0

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Misterio Revelado!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{points}</div>
              <div className="text-sm text-blue-800">Puntos Finales</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{itemsGuessed}/{items.length}</div>
              <div className="text-sm text-green-800">Adivinados</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-purple-800">Precisión</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Tiempo total: {formatTime(timeElapsed)}
            </p>
          </div>

          <Button onClick={onExit} className="w-full">
            Finalizar Juego
          </Button>
        </div>
      </motion.div>
    )
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No hay más elementos por revelar</h2>
          <Button onClick={onExit} variant="outline">
            Salir
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4">
      {/* Confetti Effect */}
      <AnimatePresence>
        {confettiVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: 3,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GiftIcon className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-xl font-bold">Caja Misteriosa</h1>
              <div className="text-sm opacity-90">
                Objeto {currentItemIndex + 1}/{items.length} • {points} puntos • {formatTime(timeLimit - timeElapsed)}
              </div>
            </div>
          </div>

          <Button onClick={onExit} variant="outline" size="sm">
            Salir
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-white bg-opacity-20 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentItemIndex + 1) / items.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mystery Box */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¿Qué hay en la caja?
              </h2>
              <p className="text-gray-600">Categoría: {currentItem.category}</p>
            </div>

            {/* Mystery Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden mb-6 mx-auto max-w-md">
              <div 
                className="absolute inset-0 bg-black"
                style={{
                  clipPath: `polygon(0% 0%, ${maxRevealPercentage}% 0%, ${maxRevealPercentage}% ${maxRevealPercentage}%, 0% ${maxRevealPercentage}%)`
                }}
              />
              <img 
                src={currentItem.image_url} 
                alt="Mystery Item"
                className="w-full h-full object-cover"
              />
              
              {maxRevealPercentage === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <QuestionMarkCircleIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {maxRevealPercentage}% revelado
              </div>
            </div>

            {/* Guess Input */}
            {!showResult && (
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitGuess()}
                    className="w-full text-lg text-center border-2 border-purple-300 rounded-lg p-4 focus:border-purple-500 focus:outline-none"
                    placeholder="¿Qué es este objeto?"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={submitGuess}
                    disabled={!userGuess.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Adivinar
                  </Button>
                  
                  <Button 
                    onClick={skipItem}
                    variant="outline"
                    className="flex-1"
                  >
                    Saltar
                  </Button>
                </div>
              </div>
            )}

            {/* Result */}
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
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    isCorrect ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {isCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😔'}
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-2">
                    <strong>{currentItem.name}</strong>
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    {currentItem.description}
                  </p>
                  
                  {isCorrect && (
                    <p className="text-sm text-green-700 mt-2">
                      +{200 + (100 - maxRevealPercentage) * 2} puntos por acierto
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Controls & Info */}
        <div className="space-y-6">
          {/* Reveal Controls */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <EyeIcon className="h-5 w-5 mr-2" />
              Revelar Pistas
            </h3>
            
            <div className="space-y-3">
              {currentItem.stages.map((stage) => (
                <div key={stage.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {stage.clue}
                    </span>
                    <div className="flex items-center space-x-2">
                      {enableAudio && stage.audio_url && (
                        <Button
                          onClick={() => playAudio(stage)}
                          disabled={isPlaying}
                          variant="outline"
                          size="sm"
                        >
                          <SpeakerWaveIcon className="h-3 w-3" />
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => revealStage(stage)}
                        disabled={points < stage.pointCost || revealedStages.has(stage.id)}
                        variant={revealedStages.has(stage.id) ? "outline" : "primary"}
                        size="sm"
                      >
                        {revealedStages.has(stage.id) ? '✓' : `${stage.pointCost} pts`}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Revela {stage.revealPercentage}% de la imagen
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hints */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Pistas Extras</h3>
            
            <div className="space-y-3">
              {currentItem.hints.slice(0, hintsUsed).map((hint, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">{hint}</p>
                </div>
              ))}
              
              {hintsUsed < currentItem.hints.length && (
                <Button
                  onClick={useHint}
                  disabled={points < 50}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Usar Pista Extra (50 pts)
                </Button>
              )}
              
              {hintsUsed >= currentItem.hints.length && (
                <p className="text-sm text-gray-500 text-center">
                  No hay más pistas disponibles
                </p>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Puntos:</span>
                <span className="font-bold text-blue-600">{points}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Adivinados:</span>
                <span className="font-bold text-green-600">{itemsGuessed}/{items.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo:</span>
                <span className="font-bold text-orange-600">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 