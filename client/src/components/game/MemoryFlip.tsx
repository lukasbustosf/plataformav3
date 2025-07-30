'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { announceToScreenReader, cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import { speakFeedback } from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface MemoryFlipProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface Card {
  id: number
  content: string
  type: 'question' | 'answer'
  matched: boolean
  flipped: boolean
  pairId: number
}

export function MemoryFlip({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 60,
  accessibility = true,
  soundEnabled = true
}: MemoryFlipProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting')
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  
  const gameRef = useRef<HTMLDivElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Initialize cards based on real quiz questions
  useEffect(() => {
    const initializeCards = () => {
      // Use real questions from the quiz
      const questions = session.quizzes?.questions || []
      const pairs: Array<{question: string, answer: string}> = []
      
             // Convert quiz questions to memory pairs
       questions.slice(0, 6).forEach((q) => {
         if (q.options_json && q.correct_answer) {
           pairs.push({
             question: q.stem_md,
             answer: q.correct_answer
           })
         }
       })
      
      // Fallback to demo data if no real questions available
      if (pairs.length === 0) {
        pairs.push(
          { question: '2 + 2 =', answer: '4' },
          { question: '5 × 3 =', answer: '15' },
          { question: '10 ÷ 2 =', answer: '5' },
          { question: '7 - 3 =', answer: '4' },
          { question: '6 + 4 =', answer: '10' },
          { question: '8 × 2 =', answer: '16' }
        )
      }

      const cardList: Card[] = []
      pairs.forEach((pair, index) => {
        cardList.push({
          id: index * 2,
          content: pair.question,
          type: 'question',
          matched: false,
          flipped: false,
          pairId: index
        })
        cardList.push({
          id: index * 2 + 1,
          content: pair.answer,
          type: 'answer',
          matched: false,
          flipped: false,
          pairId: index
        })
      })

      // Shuffle cards
      const shuffled = cardList.sort(() => Math.random() - 0.5)
      setCards(shuffled)
    }

    initializeCards()
    setGamePhase('playing')
  }, [session.quizzes?.questions])

  const handleCardClick = useCallback((cardId: number) => {
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    if (cards[cardId]?.matched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card flip state
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    ))

    if (accessibility) {
      const card = cards.find(c => c.id === cardId)
      announceToScreenReader(`Carta volteada: ${card?.content}`)
    }

    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1)
      
      setTimeout(() => {
        const [first, second] = newFlippedCards
        const firstCard = cards.find(c => c.id === first)
        const secondCard = cards.find(c => c.id === second)

        if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
          // Match found
          setMatchedPairs(prev => [...prev, firstCard.pairId])
          setCards(prev => prev.map(card => 
            card.pairId === firstCard.pairId 
              ? { ...card, matched: true, flipped: true }
              : card
          ))
          setScore(prev => prev + 100)
          
          if (audioEnabled) {
            playMatchSound()
          }
          
          if (accessibility) {
            announceToScreenReader('¡Pareja encontrada!')
          }

          // Check if game is complete
          if (matchedPairs.length + 1 === 6) { // 6 pairs total
            setTimeout(() => {
              setGamePhase('finished')
              if (accessibility) {
                announceToScreenReader('¡Juego completado!')
              }
              setTimeout(() => onGameEnd(), 3000)
            }, 1000)
          }
        } else {
          // No match
          setCards(prev => prev.map(card => 
            newFlippedCards.includes(card.id) 
              ? { ...card, flipped: false }
              : card
          ))
          
          if (audioEnabled) {
            playNoMatchSound()
          }
        }
        
        setFlippedCards([])
      }, 1500)
    }
  }, [flippedCards, cards, matchedPairs.length, audioEnabled, accessibility, onGameEnd])

  const playMatchSound = () => {
    if (audioEnabled) {
      speakFeedback(true, '¡Pareja encontrada!')
    }
  }

  const playNoMatchSound = () => {
    if (audioEnabled) {
      speakFeedback(false, 'No es pareja, inténtalo de nuevo')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, cardId: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick(cardId)
    }
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Juego de Memoria</h2>
          <p className="text-gray-600">Preparando las cartas...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Excelente Memoria!</h2>
          <p className="text-xl text-gray-600 mb-2">Puntuación: {score}</p>
          <p className="text-lg text-gray-600">Intentos: {attempts}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-indigo-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🧠</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Juego de Memoria</h1>
            </div>

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

          {/* Game Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Puntos:</span>
                <span className="text-lg font-bold text-indigo-600">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Intentos:</span>
                <span className="text-lg font-bold text-gray-900">{attempts}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Parejas:</span>
                <span className="text-lg font-bold text-green-600">{matchedPairs.length}/6</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Tiempo:</span>
              <span className={cn(
                'text-lg font-bold',
                timeRemaining > 30 ? 'text-green-600' : 
                timeRemaining > 15 ? 'text-yellow-600' : 'text-red-600'
              )}>
                {timeRemaining}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div 
          ref={gameRef}
          className="grid grid-cols-4 gap-4 max-w-2xl mx-auto"
          role="grid"
          aria-label="Tablero de memoria"
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              onKeyDown={(e) => handleKeyDown(e, card.id)}
              disabled={card.matched || flippedCards.includes(card.id)}
              className={cn(
                'aspect-square rounded-xl border-2 transition-all duration-300 transform',
                'flex items-center justify-center text-lg font-bold',
                'focus:outline-none focus:ring-4 focus:ring-indigo-300',
                'hover:scale-105 active:scale-95',
                card.flipped || card.matched
                  ? card.type === 'question' 
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-gradient-to-br from-indigo-400 to-purple-500 border-indigo-300 text-white hover:from-indigo-500 hover:to-purple-600',
                card.matched && 'ring-4 ring-green-300 bg-green-200'
              )}
              aria-label={
                card.flipped || card.matched 
                  ? `Carta: ${card.content}`
                  : 'Carta oculta'
              }
              role="gridcell"
            >
              {card.flipped || card.matched ? (
                <span className="text-center px-2 leading-tight">
                  {card.content}
                </span>
              ) : (
                <span className="text-2xl">?</span>
              )}
              
              {card.matched && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                  <div className="text-2xl">✓</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-2">
            Encuentra las parejas volteando las cartas
          </p>
          <p className="text-sm text-gray-500">
            {accessibility 
              ? 'Usa Enter o Espacio para voltear las cartas'
              : 'Haz clic en las cartas para voltearlas'
            }
          </p>
        </div>
      </div>
    </div>
  )
} 