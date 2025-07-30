'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface DragDropSortingProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface SortItem {
  id: number
  content: string
  category: string
  originalPosition: number
  currentPosition: number
}

interface Container {
  id: string
  label: string
  color: string
  acceptedCategory: string
  items: SortItem[]
}

export function DragDropSorting({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 120,
  accessibility = true,
  soundEnabled = true
}: DragDropSortingProps) {
  const [containers, setContainers] = useState<Container[]>([])
  const [sourceItems, setSourceItems] = useState<SortItem[]>([])
  const [draggedItem, setDraggedItem] = useState<SortItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting')
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [keyboardMode, setKeyboardMode] = useState(false)
  
  const gameRef = useRef<HTMLDivElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Initialize game data - TODO: Usar datos reales del quiz
  useEffect(() => {
    const initializeGame = () => {
      // Sample sorting challenge: Animals vs Objects
      const items: SortItem[] = [
        { id: 1, content: '🐶 Perro', category: 'animal', originalPosition: 0, currentPosition: 0 },
        { id: 2, content: '🚗 Auto', category: 'object', originalPosition: 1, currentPosition: 1 },
        { id: 3, content: '🐱 Gato', category: 'animal', originalPosition: 2, currentPosition: 2 },
        { id: 4, content: '📚 Libro', category: 'object', originalPosition: 3, currentPosition: 3 },
        { id: 5, content: '🦋 Mariposa', category: 'animal', originalPosition: 4, currentPosition: 4 },
        { id: 6, content: '🏠 Casa', category: 'object', originalPosition: 5, currentPosition: 5 },
        { id: 7, content: '🐟 Pez', category: 'animal', originalPosition: 6, currentPosition: 6 },
        { id: 8, content: '✏️ Lápiz', category: 'object', originalPosition: 7, currentPosition: 7 }
      ]

      // Shuffle items
      const shuffled = [...items].sort(() => Math.random() - 0.5)
      setSourceItems(shuffled)

      const gameContainers: Container[] = [
        {
          id: 'animals',
          label: 'Animales',
          color: 'bg-green-100 border-green-300',
          acceptedCategory: 'animal',
          items: []
        },
        {
          id: 'objects',
          label: 'Objetos',
          color: 'bg-blue-100 border-blue-300',
          acceptedCategory: 'object',
          items: []
        }
      ]

      setContainers(gameContainers)
      setGamePhase('playing')
      
      // Anunciar instrucciones al inicio
      if (accessibility) {
        ttsService.speakInstructions('drag_drop_sorting', 'Arrastra cada elemento al contenedor correcto. Usa las flechas del teclado para navegar.')
      }
    }

    initializeGame()
  }, [accessibility])

  const handleDragStart = (item: SortItem) => {
    setDraggedItem(item)
    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      ttsService.speak(`Arrastrando ${item.content}`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, containerId: string) => {
    e.preventDefault()
    if (!draggedItem) return

    const container = containers.find(c => c.id === containerId)
    if (!container) return

    moveItemToContainer(draggedItem, container)
    setDraggedItem(null)
  }

  const moveItemToContainer = (item: SortItem, container: Container) => {
    // Remove item from source
    setSourceItems(prev => prev.filter(i => i.id !== item.id))
    
    // Remove item from other containers
    setContainers(prev => prev.map(c => ({
      ...c,
      items: c.items.filter(i => i.id !== item.id)
    })))

    // Add item to target container
    setContainers(prev => prev.map(c => 
      c.id === container.id 
        ? { ...c, items: [...c.items, item] }
        : c
    ))

    // Check if correct
    const isCorrect = item.category === container.acceptedCategory
    if (isCorrect) {
      setScore(prev => prev + 10)
      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('¡Correcto!', { rate: 1.1, pitch: 1.2, volume: 0.8 })
      }
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`¡Correcto! ${item.content} pertenece a ${container.label}`)
      }
    } else {
      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak('Incorrecto', { rate: 1.0, pitch: 0.8, volume: 0.8 })
      }
      if (accessibility) {
        // Reemplazar announceToScreenReader con TTS real
        ttsService.speak(`Incorrecto. ${item.content} no pertenece a ${container.label}`)
      }
    }

    // Check if game is complete
    if (sourceItems.length === 1) { // Will be 0 after this move
      setTimeout(() => {
        setGamePhase('finished')
        if (accessibility) {
          ttsService.speak('¡Clasificación completada!', { rate: 0.9, pitch: 1.1 })
        }
        setTimeout(() => onGameEnd(), 3000)
      }, 1000)
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, item: SortItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (selectedItem === item.id) {
        setSelectedItem(null)
        setKeyboardMode(false)
      } else {
        setSelectedItem(item.id)
        setKeyboardMode(true)
        if (accessibility) {
          // Reemplazar announceToScreenReader con TTS real
          ttsService.speak(`${item.content} seleccionado. Usa las flechas para mover o Enter para colocar`)
        }
      }
    } else if (e.key === 'ArrowUp' && selectedItem === item.id) {
      e.preventDefault()
      const container = containers[0]
      moveItemToContainer(item, container)
      setSelectedItem(null)
      setKeyboardMode(false)
    } else if (e.key === 'ArrowDown' && selectedItem === item.id) {
      e.preventDefault()
      const container = containers[1]
      moveItemToContainer(item, container)
      setSelectedItem(null)
      setKeyboardMode(false)
    }
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ordenar y Clasificar</h2>
          <p className="text-gray-600">Preparando los elementos...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Excelente Clasificación!</h2>
          <p className="text-xl text-gray-600">Puntuación: {score}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-emerald-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📦</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Ordenar y Clasificar</h1>
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
                onClick={() => setKeyboardMode(!keyboardMode)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  keyboardMode 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                )}
                aria-label="Modo teclado"
              >
                ⌨️
              </button>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Puntos:</span>
                <span className="text-lg font-bold text-emerald-600">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Restantes:</span>
                <span className="text-lg font-bold text-gray-900">{sourceItems.length}</span>
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
        {/* Instructions with TTS */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4">
            <p className="text-gray-700 text-lg">
              Arrastra cada elemento al contenedor correcto
            </p>
            <TTSButton 
              text="Arrastra cada elemento al contenedor correcto. Usa las flechas del teclado para navegar por accesibilidad."
              type="instruction"
              gameType="drag_drop_sorting"
              size="sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Source Items */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Elementos para clasificar</h3>
            <div className="space-y-3">
              {sourceItems.map((item) => (
                <div
                  key={item.id}
                  draggable={!keyboardMode}
                  onDragStart={() => handleDragStart(item)}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  tabIndex={0}
                  className={cn(
                    'p-4 rounded-lg border-2 cursor-move transition-all duration-200',
                    'focus:outline-none focus:ring-4 focus:ring-emerald-300',
                    'hover:shadow-md active:scale-95',
                    selectedItem === item.id 
                      ? 'border-emerald-500 bg-emerald-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-emerald-400'
                  )}
                  role="button"
                  aria-label={`${item.content}${selectedItem === item.id ? ' - seleccionado' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">{item.content}</span>
                    {keyboardMode && selectedItem === item.id && (
                      <div className="flex flex-col space-y-1">
                        <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
                        <ArrowDownIcon className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drop Containers */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {containers.map((container) => (
              <div
                key={container.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, container.id)}
                className={cn(
                  'min-h-96 p-6 rounded-xl border-4 border-dashed transition-all duration-200',
                  container.color,
                  'hover:border-solid'
                )}
                role="region"
                aria-label={`Contenedor: ${container.label}`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {container.label}
                </h3>
                
                <div className="space-y-3">
                  {container.items.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        'p-3 rounded-lg border-2 transition-all duration-200',
                        item.category === container.acceptedCategory
                          ? 'border-green-500 bg-green-100 text-green-800'
                          : 'border-red-500 bg-red-100 text-red-800'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.content}</span>
                        <span className="text-2xl">
                          {item.category === container.acceptedCategory ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {container.items.length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="text-4xl mb-2">📋</div>
                    <p>Arrastra elementos aquí</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard Instructions */}
        {keyboardMode && (
          <div className="mt-6 p-4 bg-emerald-100 rounded-lg border border-emerald-300">
            <h4 className="font-bold text-emerald-900 mb-2">Modo Teclado Activo</h4>
            <p className="text-emerald-800 text-sm">
              Enter/Espacio: Seleccionar • ⬆️: Mover arriba • ⬇️: Mover abajo
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 