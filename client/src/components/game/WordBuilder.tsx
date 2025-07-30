'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface WordBuilderProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface Letter {
  id: number
  letter: string
  position: number | null
  isCorrect: boolean
}

interface WordChallenge {
  word: string
  image: string
  hint: string
  scrambledLetters: Letter[]
}

export function WordBuilder({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 120,
  accessibility = true,
  soundEnabled = true
}: WordBuilderProps) {
  const [currentWord, setCurrentWord] = useState<WordChallenge | null>(null)
  const [userWord, setUserWord] = useState<(Letter | null)[]>([])
  const [availableLetters, setAvailableLetters] = useState<Letter[]>([])
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null)
  const [score, setScore] = useState(0)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'building' | 'finished'>('waiting')
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [showHint, setShowHint] = useState(false)
  
  const gameRef = useRef<HTMLDivElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Word challenges for different levels
  const wordChallenges = [
    { word: 'GATO', image: '🐱', hint: 'Animal doméstico que dice miau' },
    { word: 'CASA', image: '🏠', hint: 'Lugar donde vives' },
    { word: 'SOL', image: '🌞', hint: 'Estrella que nos da luz' },
    { word: 'FLOR', image: '🌸', hint: 'Planta colorida que huele bien' },
    { word: 'ÁRBOL', image: '🌳', hint: 'Planta grande con hojas' },
    { word: 'AGUA', image: '💧', hint: 'Líquido transparente que bebemos' },
    { word: 'LUNA', image: '🌙', hint: 'Se ve en el cielo de noche' },
    { word: 'LIBRO', image: '📚', hint: 'Tiene páginas para leer' }
  ]

  // Initialize game
  useEffect(() => {
    generateNewWord()
    setGamePhase('building')
    
    // Anunciar instrucciones al inicio
    if (accessibility) {
      ttsService.speakInstructions('word_builder', 'Arrastra las letras para formar la palabra que corresponde a la imagen. Usa la pista si necesitas ayuda.')
    }
  }, [accessibility])

  const generateNewWord = () => {
    const challenge = wordChallenges[Math.floor(Math.random() * wordChallenges.length)]
    const letters = challenge.word.split('').map((letter, index) => ({
      id: index,
      letter,
      position: null,
      isCorrect: false
    }))

    // Shuffle letters
    const scrambled = [...letters].sort(() => Math.random() - 0.5)
    
    setCurrentWord({
      ...challenge,
      scrambledLetters: scrambled
    })
    setAvailableLetters(scrambled)
    setUserWord(new Array(challenge.word.length).fill(null))
    setShowHint(false)

    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speakQuestion(`Nueva palabra para formar: ${challenge.hint}`)
    }
  }

  const handleDragStart = (letter: Letter) => {
    setDraggedLetter(letter)
    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speak(`Arrastrando letra ${letter.letter}`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault()
    if (!draggedLetter) return

    placeLetter(draggedLetter, targetPosition)
    setDraggedLetter(null)
  }

  const placeLetter = (letter: Letter, position: number) => {
    // Remove letter from current position
    setUserWord(prev => prev.map((l, i) => l?.id === letter.id ? null : l))
    
    // Place letter in new position
    setUserWord(prev => prev.map((l, i) => i === position ? letter : l))
    
    // Update letter's position
    setAvailableLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, position } : l)
    )

    if (audioEnabled) {
      // Reemplazar audio manual con TTS feedback
      ttsService.speak(letter.letter, { rate: 1.2, volume: 0.6 })
    }

    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speak(`Letra ${letter.letter} colocada en posición ${position + 1}`)
    }

    // Check if word is complete
    const newWord = [...userWord]
    newWord[position] = letter
    
    if (newWord.every(l => l !== null)) {
      const formedWord = newWord.map(l => l!.letter).join('')
      checkWord(formedWord)
    }
  }

  const removeLetter = (position: number) => {
    const letter = userWord[position]
    if (!letter) return

    setUserWord(prev => prev.map((l, i) => i === position ? null : l))
    setAvailableLetters(prev => 
      prev.map(l => l.id === letter.id ? { ...l, position: null } : l)
    )

    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speak(`Letra ${letter.letter} devuelta a las opciones`)
    }
  }

  const checkWord = (formedWord: string) => {
    if (!currentWord) return

    const isCorrect = formedWord === currentWord.word
    
    if (isCorrect) {
      setScore(prev => prev + 10)
      setWordsCompleted(prev => prev + 1)
      
      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('¡Correcto!', { rate: 1.1, pitch: 1.3, volume: 0.9 })
      }
      
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`¡Correcto! Formaste la palabra ${formedWord}`)
      }

      // Generate next word after delay
      setTimeout(() => {
        if (wordsCompleted >= 4) { // Complete 5 words total
          setGamePhase('finished')
          if (accessibility) {
            ttsService.speak('¡Todas las palabras completadas!', { rate: 0.9, pitch: 1.2 })
          }
          setTimeout(() => onGameEnd(), 3000)
        } else {
          generateNewWord()
        }
      }, 2000)
    } else {
      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('No es correcto', { rate: 1.0, pitch: 0.8, volume: 0.8 })
      }
      
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`La palabra ${formedWord} no es correcta. Inténtalo de nuevo.`)
      }
    }

    onAnswer(formedWord)
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Constructor de Palabras</h2>
          <p className="text-gray-600">Preparando las letras...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Excelente Construcción!</h2>
          <p className="text-xl text-gray-600 mb-2">Puntuación: {score}</p>
          <p className="text-lg text-gray-600">Palabras completadas: {wordsCompleted}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-amber-500">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Constructor de Palabras</h1>
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
              
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showHint 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                )}
                aria-label="Mostrar pista"
              >
                💡
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Puntos:</span>
                <span className="text-lg font-bold text-amber-600">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Palabras:</span>
                <span className="text-lg font-bold text-gray-900">{wordsCompleted}/5</span>
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

      {/* Game Area */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentWord && (
          <>
            {/* Word Challenge */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{currentWord.image}</div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <TTSButton 
                    text={`Forma la palabra que representa esta imagen: ${currentWord.hint}`}
                    type="instruction"
                    gameType="word_builder"
                    size="md"
                  />
                </div>
                {showHint && (
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-lg text-gray-600">{currentWord.hint}</p>
                    <TTSButton 
                      text={currentWord.hint}
                      type="instruction"
                      gameType="word_builder"
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Word Slots */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {userWord.map((letter, index) => (
                    <div
                      key={index}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onClick={() => letter && removeLetter(index)}
                      className={cn(
                        'w-16 h-16 border-4 border-dashed rounded-xl transition-all duration-200',
                        'flex items-center justify-center text-2xl font-bold cursor-pointer',
                        letter 
                          ? 'border-amber-500 bg-amber-100 text-amber-800 hover:bg-amber-200'
                          : 'border-gray-300 bg-gray-50 hover:border-amber-400'
                      )}
                      role="button"
                      tabIndex={0}
                      aria-label={letter ? `Letra ${letter.letter} en posición ${index + 1}. Clic para quitar` : `Espacio vacío ${index + 1}`}
                    >
                      {letter ? letter.letter : ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Letters */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Letras disponibles:</h3>
                <div className="flex justify-center flex-wrap gap-3">
                  {availableLetters
                    .filter(letter => letter.position === null)
                    .map((letter) => (
                      <div
                        key={letter.id}
                        draggable
                        onDragStart={() => handleDragStart(letter)}
                        onClick={() => {
                          // Encontrar primera posición vacía
                          const emptyIndex = userWord.findIndex(l => l === null)
                          if (emptyIndex !== -1) {
                            placeLetter(letter, emptyIndex)
                          }
                        }}
                        className={cn(
                          'w-14 h-14 border-3 border-amber-400 rounded-lg transition-all duration-200',
                          'flex items-center justify-center text-xl font-bold cursor-move',
                          'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:scale-110',
                          'focus:outline-none focus:ring-4 focus:ring-amber-300',
                          'active:scale-95 shadow-md hover:shadow-lg'
                        )}
                        role="button"
                        tabIndex={0}
                        aria-label={`Letra ${letter.letter} disponible para arrastrar`}
                      >
                        {letter.letter}
                      </div>
                    ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mt-8">
                <div className="flex items-center justify-center gap-4">
                  <p className="text-gray-600">
                    Arrastra las letras a los espacios para formar la palabra
                  </p>
                  <TTSButton 
                    text="Arrastra las letras a los espacios para formar la palabra que corresponde a la imagen. También puedes hacer clic en las letras para colocarlas automáticamente."
                    type="instruction"
                    gameType="word_builder"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 