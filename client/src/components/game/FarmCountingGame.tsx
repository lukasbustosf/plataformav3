'use client'

import { useState, useEffect, useCallback } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import TTSControls from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface FarmCountingGameProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface FarmAnimal {
  emoji: string
  name: string
  sound: string
  color: string
}

const FARM_ANIMALS: FarmAnimal[] = [
  { emoji: '🐄', name: 'vacas', sound: '¡Muuu!', color: 'bg-pink-100' },
  { emoji: '🐷', name: 'cerditos', sound: '¡Oink oink!', color: 'bg-pink-200' },
  { emoji: '🐔', name: 'pollitos', sound: '¡Pío pío!', color: 'bg-yellow-100' },
  { emoji: '🐑', name: 'ovejas', sound: '¡Beee!', color: 'bg-gray-100' },
  { emoji: '🐰', name: 'conejitos', sound: '¡Hop hop!', color: 'bg-green-100' }
]

export function FarmCountingGame({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 180,
  accessibility = true,
  soundEnabled = true
}: FarmCountingGameProps) {
  const [score, setScore] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [animalData, setAnimalData] = useState<FarmAnimal | null>(null)
  const [countedAnimals, setCountedAnimals] = useState<boolean[]>([])

  // Parse current question data
  const questions = session?.quizzes?.questions || []
  const currentQ = questions[questionIndex]

  useEffect(() => {
    if (currentQ) {
      // Extract animal data from question
      const animal = FARM_ANIMALS.find(a => currentQ.stem_md?.includes(a.emoji)) || FARM_ANIMALS[0]
      setAnimalData(animal)
      
      // Initialize counting array
      const count = parseInt(currentQ.correct_answer || '1')
      setCountedAnimals(new Array(count).fill(false))
      
      // Speak question
      if (audioEnabled && currentQ.stem_md) {
        speakText(currentQ.stem_md)
      }
    }
  }, [questionIndex, currentQ, audioEnabled])

  const speakText = useCallback(async (text: string) => {
    if (audioEnabled && ttsService) {
      try {
        await ttsService.speak(text)
      } catch (error) {
        console.log('TTS not available:', error)
      }
    }
  }, [audioEnabled])

  const handleAnimalClick = (index: number) => {
    if (showFeedback) return
    
    const newCounted = [...countedAnimals]
    newCounted[index] = !newCounted[index]
    setCountedAnimals(newCounted)
    
    // Play animal sound
    if (audioEnabled && animalData) {
      speakText(animalData.sound)
    }
  }

  const handleSubmitAnswer = () => {
    const countedTotal = countedAnimals.filter(Boolean).length.toString()
    const correct = countedTotal === currentQ.correct_answer
    
    setSelectedAnswer(countedTotal)
    setIsCorrect(correct)
    setShowFeedback(true)
    
    if (correct) {
      setScore(prev => prev + (currentQ.points || 10))
      speakText(`¡Muy bien! Contaste ${countedTotal} ${animalData?.name}. ${animalData?.sound}`)
    } else {
      speakText(`Vamos a contar juntos. La respuesta correcta es ${currentQ.correct_answer}`)
    }
    
    // Auto advance after 3 seconds
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(prev => prev + 1)
        setShowFeedback(false)
        setSelectedAnswer(null)
        setCountedAnimals([])
      } else {
        onGameEnd()
      }
    }, 3000)
  }

  const resetCounting = () => {
    setCountedAnimals(new Array(countedAnimals.length).fill(false))
  }

  if (!currentQ || !animalData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚜</div>
          <div className="text-xl font-bold text-green-800">Cargando la granja...</div>
        </div>
      </div>
    )
  }

  const countedTotal = countedAnimals.filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-300 to-yellow-200 relative overflow-hidden">
      {/* Farm Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 text-4xl animate-bounce">🌞</div>
        <div className="absolute top-8 right-8 text-3xl">☁️</div>
        <div className="absolute bottom-8 left-8 text-4xl">🌻</div>
        <div className="absolute bottom-12 right-12 text-3xl">🌾</div>
        <div className="absolute top-1/3 left-1/4 text-2xl">🦋</div>
        <div className="absolute top-2/3 right-1/4 text-2xl">🐝</div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🐄</div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">Granja de Conteo</h1>
              <p className="text-green-600">Pregunta {questionIndex + 1} de {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-lg font-bold text-green-800">🏆 {score} puntos</div>
              <div className="text-sm text-green-600">⏰ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</div>
            </div>
            
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
            >
              {audioEnabled ? 
                <SpeakerWaveIcon className="w-6 h-6 text-green-700" /> : 
                <SpeakerXMarkIcon className="w-6 h-6 text-green-700" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Question */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border-4 border-green-300">
          <div className="text-center">
            <div className="text-6xl mb-4">{animalData.emoji}</div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              ¿Cuántos {animalData.name} hay en la granja?
            </h2>
            <div className="text-lg text-green-600">
              Haz clic en cada {animalData.name.slice(0, -1)} para contarlos
            </div>
          </div>
        </div>

        {/* Counting Area */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border-4 border-yellow-300">
          <div className="grid grid-cols-5 gap-6 justify-items-center">
            {countedAnimals.map((counted, index) => (
              <button
                key={index}
                onClick={() => handleAnimalClick(index)}
                disabled={showFeedback}
                className={cn(
                  "text-8xl p-4 rounded-2xl transition-all duration-300 transform hover:scale-110",
                  "border-4 border-dashed",
                  counted 
                    ? "bg-green-200 border-green-400 animate-pulse" 
                    : "bg-gray-100 border-gray-300 hover:bg-yellow-100",
                  showFeedback && "cursor-not-allowed opacity-75"
                )}
              >
                {animalData.emoji}
                {counted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Counter Display */}
          <div className="text-center mt-8">
            <div className="text-6xl font-bold text-green-800 mb-4">
              {countedTotal}
            </div>
            <div className="text-xl text-green-600">
              {animalData.name} contados
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={resetCounting}
              disabled={showFeedback}
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold rounded-2xl text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Borrar todo
            </button>
            
            <button
              onClick={handleSubmitAnswer}
              disabled={showFeedback || countedTotal === 0}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✅ ¡Terminé de contar!
            </button>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={cn(
            "bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4",
            isCorrect ? "border-green-400" : "border-orange-400"
          )}>
            <div className="text-center">
              <div className="text-8xl mb-4">
                {isCorrect ? "🎉" : "🤗"}
              </div>
              <h3 className={cn(
                "text-3xl font-bold mb-4",
                isCorrect ? "text-green-800" : "text-orange-800"
              )}>
                {isCorrect ? "¡Excelente!" : "¡Sigamos intentando!"}
              </h3>
              <div className="text-xl mb-4">
                {isCorrect ? (
                  <>
                    ¡Contaste correctamente {currentQ.correct_answer} {animalData.name}! {animalData.sound}
                  </>
                ) : (
                  <>
                    Contaste {countedTotal}, pero hay {currentQ.correct_answer} {animalData.name}. 
                    ¡Sigamos practicando! {animalData.sound}
                  </>
                )}
              </div>
              <div className="text-lg text-gray-600">
                {isCorrect ? "¡Ganaste " + (currentQ.points || 10) + " puntos!" : "¡La práctica hace al maestro!"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Farm Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-600 to-green-400"></div>
    </div>
  )
} 