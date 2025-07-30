'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface PictureBingoProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface BingoCell {
  id: number
  image: string
  label: string
  called: boolean
  marked: boolean
}

export function PictureBingo({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 300,
  accessibility = true,
  soundEnabled = true
}: PictureBingoProps) {
  const [bingoCard, setBingoCard] = useState<BingoCell[]>([])
  const [calledNumbers, setCalledNumbers] = useState<number[]>([])
  const [currentCall, setCurrentCall] = useState<string>('')
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'winner' | 'finished'>('waiting')
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [hasBingo, setHasBingo] = useState(false)
  
  const gameRef = useRef<HTMLDivElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Sample images/emojis for bingo
  const imageOptions = [
    { emoji: '🍎', label: 'Manzana' },
    { emoji: '🐶', label: 'Perro' },
    { emoji: '🌞', label: 'Sol' },
    { emoji: '🌈', label: 'Arcoíris' },
    { emoji: '🎈', label: 'Globo' },
    { emoji: '⭐', label: 'Estrella' },
    { emoji: '🏠', label: 'Casa' },
    { emoji: '🚗', label: 'Auto' },
    { emoji: '🎵', label: 'Música' },
    { emoji: '📚', label: 'Libro' },
    { emoji: '🎨', label: 'Arte' },
    { emoji: '🏐', label: 'Pelota' },
    { emoji: '🌳', label: 'Árbol' },
    { emoji: '🦋', label: 'Mariposa' },
    { emoji: '🍰', label: 'Pastel' },
    { emoji: '🎭', label: 'Teatro' },
    { emoji: '🔥', label: 'Fuego' },
    { emoji: '❄️', label: 'Nieve' },
    { emoji: '🌺', label: 'Flor' },
    { emoji: '🎯', label: 'Diana' },
    { emoji: '🎪', label: 'Circo' },
    { emoji: '🎸', label: 'Guitarra' },
    { emoji: '🍕', label: 'Pizza' },
    { emoji: '🎮', label: 'Videojuego' },
    { emoji: '🏆', label: 'Trofeo' }
  ]

  // Initialize bingo card
  useEffect(() => {
    const generateCard = () => {
      const shuffled = [...imageOptions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 9) // 3x3 grid
      
      const card = selected.map((item, index) => ({
        id: index,
        image: item.emoji,
        label: item.label,
        called: false,
        marked: false
      }))
      
      setBingoCard(card)
    }
    
    generateCard()
    setGamePhase('playing')
  }, [])

  useEffect(() => {
    const handleBingoCall = (data: any) => {
      const { call, label } = data
      setCurrentCall(call)
      
      // Highlight matching cells
      setBingoCard(prev => prev.map(cell => 
        cell.label.toLowerCase() === label.toLowerCase() 
          ? { ...cell, called: true }
          : cell
      ))
      
      setCalledNumbers(prev => [...prev, data.id])
      
      if (accessibility) {
        ttsService.speakInstructions('picture_bingo', `Llamada: ${label}. Marca tu cartón si lo tienes.`)
      }
    }

    const handleGameEnd = () => {
      setGamePhase('finished')
      setTimeout(() => onGameEnd(), 5000)
    }

    gameWS.on('bingoCall', handleBingoCall)
    gameWS.on('gameEnded', handleGameEnd)

    return () => {
      gameWS.off('bingoCall', handleBingoCall)
      gameWS.off('gameEnded', handleGameEnd)
    }
  }, [gameWS, accessibility, onGameEnd])

  const handleCellClick = useCallback((cellId: number) => {
    if (gamePhase !== 'playing') return
    
    const cell = bingoCard.find(c => c.id === cellId)
    if (!cell?.called) return // Can only mark called items
    
    setBingoCard(prev => prev.map(c => 
      c.id === cellId ? { ...c, marked: !c.marked } : c
    ))
    
    if (accessibility) {
      const action = cell.marked ? 'desmarcado' : 'marcado'
      ttsService.speak(`${cell.label} ${action}`)
    }
    
    if (audioEnabled) {
      ttsService.speak(cell.marked ? 'Desmarcado' : 'Marcado', { rate: 1.2, volume: 0.6 })
    }
    
    // Check for bingo
    setTimeout(checkForBingo, 100)
  }, [bingoCard, gamePhase, accessibility, audioEnabled])

  const checkForBingo = () => {
    const marked = bingoCard.filter(cell => cell.marked)
    
    // Check rows
    for (let row = 0; row < 3; row++) {
      const rowCells = [row * 3, row * 3 + 1, row * 3 + 2]
      if (rowCells.every(id => bingoCard[id]?.marked)) {
        celebrateBingo('Línea horizontal')
        return
      }
    }
    
    // Check columns
    for (let col = 0; col < 3; col++) {
      const colCells = [col, col + 3, col + 6]
      if (colCells.every(id => bingoCard[id]?.marked)) {
        celebrateBingo('Línea vertical')
        return
      }
    }
    
    // Check diagonals
    if ([0, 4, 8].every(id => bingoCard[id]?.marked)) {
      celebrateBingo('Diagonal')
      return
    }
    
    if ([2, 4, 6].every(id => bingoCard[id]?.marked)) {
      celebrateBingo('Diagonal')
      return
    }
    
    // Full card
    if (marked.length === 9) {
      celebrateBingo('Cartón lleno')
    }
  }

  const celebrateBingo = (type: string) => {
    setHasBingo(true)
    setGamePhase('winner')
    
    if (accessibility) {
      ttsService.speak(`¡BINGO! ${type} completado`, { 
        rate: 0.8, 
        pitch: 1.3, 
        volume: 1.0 
      })
    }
    
    if (audioEnabled) {
      ttsService.speak('¡BINGO! ¡Felicitaciones!', { 
        rate: 0.9, 
        pitch: 1.4, 
        volume: 1.0 
      })
    }
    
    // Notify via normal answer mechanism
    onAnswer(`BINGO-${type}`)
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bingo de Imágenes</h2>
          <p className="text-gray-600">Esperando que el profesor inicie las llamadas...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {hasBingo ? '¡BINGO!' : '¡Juego Terminado!'}
          </h2>
          <p className="text-xl text-gray-600">
            {hasBingo ? '¡Felicitaciones!' : 'Mejor suerte la próxima vez'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-orange-500">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎯</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Bingo de Imágenes</h1>
              {currentCall && (
                <div className="bg-orange-100 px-3 py-1 rounded-full">
                  <span className="text-orange-800 font-medium">
                    Llamada: {currentCall}
                  </span>
                  <TTSButton 
                    text={`Última llamada: ${currentCall}`}
                    type="instruction"
                    gameType="picture_bingo"
                    size="sm"
                    className="ml-2"
                  />
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
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Marcados:</span>
                <span className="text-lg font-bold text-orange-600">
                  {bingoCard.filter(cell => cell.marked).length}/9
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Llamadas:</span>
                <span className="text-lg font-bold text-gray-900">{calledNumbers.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Tiempo:</span>
              <span className="text-lg font-bold text-green-600">{timeRemaining}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bingo Card */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div 
          ref={gameRef}
          className="grid grid-cols-3 gap-4 mb-8"
          role="grid"
          aria-label="Cartón de bingo"
        >
          {bingoCard.map((cell) => (
            <button
              key={cell.id}
              onClick={() => handleCellClick(cell.id)}
              disabled={!cell.called}
              className={cn(
                'aspect-square rounded-xl border-4 transition-all duration-300 transform',
                'flex flex-col items-center justify-center text-4xl font-bold',
                'focus:outline-none focus:ring-4 focus:ring-orange-300',
                'hover:scale-105 active:scale-95',
                cell.marked 
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : cell.called
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed',
                cell.called && !cell.marked && 'animate-pulse'
              )}
              aria-label={`${cell.label}${cell.called ? ' - disponible para marcar' : ''}${cell.marked ? ' - marcado' : ''}`}
              role="gridcell"
            >
              <div className="text-5xl mb-1">
                {cell.image}
              </div>
              {accessibility && (
                <div className="text-xs text-center font-medium">
                  {cell.label}
                </div>
              )}
              
              {cell.marked && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-30 rounded-xl flex items-center justify-center">
                  <div className="text-6xl text-white">✓</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <p className="text-gray-600">
              Marca las imágenes cuando sean llamadas
            </p>
            <TTSButton 
              text="Marca las imágenes cuando sean llamadas. Consigue una línea, columna o diagonal para ganar"
              type="instruction"
              gameType="picture_bingo"
              size="sm"
            />
          </div>
          <p className="text-sm text-gray-500">
            Consigue una línea, columna o diagonal para ganar
          </p>
          
          {hasBingo && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg border-2 border-green-300">
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-green-800 font-bold text-xl">¡BINGO!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 