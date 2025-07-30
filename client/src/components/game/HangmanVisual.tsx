'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface HangmanVisualProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface HangmanWord {
  word: string
  hint: string
  category: string
}

export function HangmanVisual({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 180,
  accessibility = true,
  soundEnabled = true
}: HangmanVisualProps) {
  const [currentWord, setCurrentWord] = useState<HangmanWord | null>(null)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([])
  const [wordDisplay, setWordDisplay] = useState<string[]>([])
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'won' | 'lost' | 'finished'>('waiting')
  const [score, setScore] = useState(0)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [showHint, setShowHint] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  const maxWrongGuesses = 6

  // Word list for hangman
  const words: HangmanWord[] = [
    { word: 'GATO', hint: 'Animal doméstico que dice miau', category: 'Animales' },
    { word: 'CASA', hint: 'Lugar donde vives', category: 'Lugares' },
    { word: 'LIBRO', hint: 'Tiene páginas para leer', category: 'Objetos' },
    { word: 'FLOR', hint: 'Planta colorida que huele bien', category: 'Naturaleza' },
    { word: 'ESCUELA', hint: 'Lugar donde aprendes', category: 'Lugares' },
    { word: 'AMIGO', hint: 'Persona que te quiere mucho', category: 'Personas' },
    { word: 'JUEGO', hint: 'Actividad divertida', category: 'Actividades' },
    { word: 'MÚSICA', hint: 'Arte de los sonidos', category: 'Arte' }
  ]

  const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')

  // Initialize game
  useEffect(() => {
    startNewWord()
    setGamePhase('playing')

    // Anunciar instrucciones al inicio
    if (accessibility) {
      ttsService.speakInstructions('hangman_visual', 'Juego del ahorcado. Adivina la palabra letra por letra. Tienes 6 intentos antes de que se complete el dibujo.')
    }
  }, [accessibility])

  const startNewWord = () => {
    const word = words[Math.floor(Math.random() * words.length)]
    setCurrentWord(word)
    setGuessedLetters([])
    setWrongGuesses([])
    setWordDisplay(word.word.split('').map(() => '_'))
    setShowHint(false)
    
    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speakQuestion(`Nueva palabra de ${word.word.length} letras en la categoría ${word.category}`)
    }
  }

  const makeGuess = useCallback((letter: string) => {
    if (!currentWord || guessedLetters.includes(letter) || gamePhase !== 'playing') {
      return
    }

    setGuessedLetters(prev => [...prev, letter])

    if (currentWord.word.includes(letter)) {
      // Correct guess
      const newDisplay = currentWord.word.split('').map((char, index) => 
        char === letter || wordDisplay[index] !== '_' ? char : '_'
      )
      setWordDisplay(newDisplay)
      
      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('¡Correcto!', { rate: 1.1, pitch: 1.2, volume: 0.8 })
      }
      
      if (accessibility) {
        const positions = currentWord.word.split('').map((char, i) => char === letter ? i + 1 : null).filter(Boolean)
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`¡Correcto! La letra ${letter} está en las posiciones ${positions.join(', ')}`)
      }

      // Check if word is complete
      if (!newDisplay.includes('_')) {
        setGamePhase('won')
        setScore(prev => prev + (10 + (maxWrongGuesses - wrongGuesses.length) * 2))
        setWordsCompleted(prev => prev + 1)
        
        if (accessibility) {
          // Reemplazar announceToScreenReader con TTS real
          ttsService.speak(`¡Ganaste! La palabra era ${currentWord.word}`, { 
            rate: 1.0, 
            pitch: 1.3, 
            volume: 1.0 
          })
        }

        setTimeout(() => {
          if (wordsCompleted >= 4) { // Complete 5 words
            setGamePhase('finished')
            if (accessibility) {
              ttsService.speak('¡Todas las palabras completadas!', { rate: 0.9, pitch: 1.2 })
            }
            setTimeout(() => onGameEnd(), 3000)
          } else {
            startNewWord()
            setGamePhase('playing')
          }
        }, 3000)
      }
    } else {
      // Wrong guess
      setWrongGuesses(prev => [...prev, letter])
      
      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('Incorrecto', { rate: 1.0, pitch: 0.8, volume: 0.8 })
      }
      
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`La letra ${letter} no está en la palabra. ${maxWrongGuesses - wrongGuesses.length - 1} intentos restantes`)
      }

      // Check if game is lost
      if (wrongGuesses.length + 1 >= maxWrongGuesses) {
        setGamePhase('lost')
        
        if (accessibility) {
          // Reemplazar announceToScreenReader con TTS real
          ttsService.speak(`Perdiste. La palabra era ${currentWord.word}`, { 
            rate: 1.0, 
            pitch: 0.8, 
            volume: 0.9 
          })
        }

        setTimeout(() => {
          if (wordsCompleted >= 2) { // Allow some losses
            setGamePhase('finished')
            setTimeout(() => onGameEnd(), 3000)
          } else {
            startNewWord()
            setGamePhase('playing')
          }
        }, 3000)
      }
    }

    onAnswer(letter)
  }, [currentWord, guessedLetters, gamePhase, wordDisplay, wrongGuesses.length, wordsCompleted, audioEnabled, accessibility, onAnswer, onGameEnd])

  // Draw hangman
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 300
    canvas.height = 350

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 3

    // Draw gallows base
    ctx.beginPath()
    ctx.moveTo(50, 320)
    ctx.lineTo(150, 320)
    ctx.stroke()

    // Draw gallows pole
    ctx.beginPath()
    ctx.moveTo(100, 320)
    ctx.lineTo(100, 50)
    ctx.stroke()

    // Draw gallows top
    ctx.beginPath()
    ctx.moveTo(100, 50)
    ctx.lineTo(200, 50)
    ctx.stroke()

    // Draw noose
    ctx.beginPath()
    ctx.moveTo(200, 50)
    ctx.lineTo(200, 80)
    ctx.stroke()

    // Draw hangman parts based on wrong guesses (child-friendly version)
    if (wrongGuesses.length >= 1) {
      // Head (smiling face)
      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(200, 100, 20, 0, 2 * Math.PI)
      ctx.stroke()
      
      // Happy face
      ctx.fillStyle = '#F59E0B'
      ctx.beginPath()
      ctx.arc(195, 95, 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(205, 95, 2, 0, 2 * Math.PI)
      ctx.fill()
    }

    if (wrongGuesses.length >= 2) {
      // Body
      ctx.strokeStyle = '#3B82F6'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(200, 120)
      ctx.lineTo(200, 200)
      ctx.stroke()
    }

    if (wrongGuesses.length >= 3) {
      // Left arm
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(200, 140)
      ctx.lineTo(170, 170)
      ctx.stroke()
    }

    if (wrongGuesses.length >= 4) {
      // Right arm
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(200, 140)
      ctx.lineTo(230, 170)
      ctx.stroke()
    }

    if (wrongGuesses.length >= 5) {
      // Left leg
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(200, 200)
      ctx.lineTo(180, 240)
      ctx.stroke()
    }

    if (wrongGuesses.length >= 6) {
      // Right leg
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(200, 200)
      ctx.lineTo(220, 240)
      ctx.stroke()
      
      // Change face to sad
      ctx.clearRect(185, 85, 30, 20)
      ctx.fillStyle = '#EF4444'
      ctx.beginPath()
      ctx.arc(195, 95, 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(205, 95, 2, 0, 2 * Math.PI)
      ctx.fill()
      
      ctx.strokeStyle = '#EF4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(200, 108, 8, 0, Math.PI)
      ctx.stroke()
    }

  }, [wrongGuesses.length])

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ahorcado Visual</h2>
          <p className="text-gray-600">Preparando las palabras...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Excelente Deducción!</h2>
          <p className="text-xl text-gray-600 mb-2">Puntuación: {score}</p>
          <p className="text-lg text-gray-600">Palabras completadas: {wordsCompleted}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-violet-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎪</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Ahorcado Visual</h1>
              {currentWord && (
                <div className="bg-violet-100 px-3 py-1 rounded-full">
                  <span className="text-violet-800 font-medium">
                    Categoría: {currentWord.category}
                  </span>
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
              
              <button
                onClick={() => setShowHint(!showHint)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showHint 
                    ? 'bg-violet-100 text-violet-700' 
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
                <span className="text-lg font-bold text-violet-600">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Palabras:</span>
                <span className="text-lg font-bold text-gray-900">{wordsCompleted}/5</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Errores:</span>
                <span className={cn(
                  'text-lg font-bold',
                  wrongGuesses.length < 3 ? 'text-green-600' :
                  wrongGuesses.length < 5 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {wrongGuesses.length}/{maxWrongGuesses}
                </span>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hangman Drawing */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900 text-center">Dibujo</h3>
              <TTSButton 
                text={`El dibujo del ahorcado tiene ${wrongGuesses.length} partes dibujadas de ${maxWrongGuesses} total`}
                type="instruction"
                gameType="hangman_visual"
                size="sm"
              />
            </div>
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                className="border-2 border-gray-200 rounded-lg"
                aria-label={`Dibujo del ahorcado con ${wrongGuesses.length} partes dibujadas`}
              />
            </div>
          </div>

          {/* Word and Letters */}
          <div className="space-y-8">
            {/* Word Display */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900 text-center">Palabra</h3>
                {currentWord && (
                  <TTSButton 
                    text={`La palabra tiene ${currentWord.word.length} letras y pertenece a la categoría ${currentWord.category}`}
                    type="instruction"
                    gameType="hangman_visual"
                    size="sm"
                  />
                )}
              </div>
              
              {showHint && currentWord && (
                <div className="bg-yellow-100 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <p className="text-yellow-800 font-medium text-center">
                      💡 {currentWord.hint}
                    </p>
                    <TTSButton 
                      text={`Pista: ${currentWord.hint}`}
                      type="instruction"
                      gameType="hangman_visual"
                      size="sm"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-2 mb-6">
                {wordDisplay.map((letter, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 border-4 border-violet-300 rounded-lg flex items-center justify-center text-2xl font-bold bg-violet-50"
                  >
                    {letter !== '_' ? letter : ''}
                  </div>
                ))}
              </div>

              {/* Game Status */}
              {gamePhase === 'won' && (
                <div className="text-center p-4 bg-green-100 rounded-lg">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-green-800 font-bold">¡Ganaste!</p>
                </div>
              )}

              {gamePhase === 'lost' && currentWord && (
                <div className="text-center p-4 bg-red-100 rounded-lg">
                  <div className="text-3xl mb-2">😔</div>
                  <p className="text-red-800 font-bold">
                    La palabra era: {currentWord.word}
                  </p>
                </div>
              )}
            </div>

            {/* Letter Keyboard */}
            {gamePhase === 'playing' && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 text-center">Letras</h3>
                  <TTSButton 
                    text={`Teclado de letras. Ya has usado: ${guessedLetters.length > 0 ? guessedLetters.join(', ') : 'ninguna'}`}
                    type="instruction"
                    gameType="hangman_visual"
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => makeGuess(letter)}
                      disabled={guessedLetters.includes(letter)}
                      className={cn(
                        'h-12 rounded-lg font-bold transition-all duration-200',
                        'focus:outline-none focus:ring-4 focus:ring-violet-300',
                        guessedLetters.includes(letter)
                          ? wrongGuesses.includes(letter)
                            ? 'bg-red-100 text-red-800 border-2 border-red-300 cursor-not-allowed'
                            : 'bg-green-100 text-green-800 border-2 border-green-300 cursor-not-allowed'
                          : 'bg-violet-100 text-violet-800 border-2 border-violet-300 hover:bg-violet-200 hover:scale-105'
                      )}
                      aria-label={`Letra ${letter}${guessedLetters.includes(letter) ? ' - ya usada' : ''}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-center gap-4 mb-2">
            <p className="text-gray-600">
              Adivina la palabra letra por letra
            </p>
            <TTSButton 
              text={`Instrucciones: Adivina la palabra letra por letra. Cuidado: ${maxWrongGuesses} errores y el juego termina. Haz clic en el botón de bombilla para ver la pista.`}
              type="instruction"
              gameType="hangman_visual"
              size="sm"
            />
          </div>
          <p className="text-sm text-gray-500">
            Cuidado: {maxWrongGuesses} errores y el juego termina • Clic en 💡 para ver la pista
          </p>
        </div>
      </div>
    </div>
  )
} 