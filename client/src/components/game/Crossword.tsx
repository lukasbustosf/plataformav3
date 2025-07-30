'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PuzzlePieceIcon,
  SpeakerWaveIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ClockIcon,
  InformationCircleIcon,
  PlayIcon,
  CommandLineIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import { cn } from '@/lib/utils'

interface CrosswordClue {
  id: string
  number: number
  direction: 'across' | 'down'
  clue: string
  answer: string
  startRow: number
  startCol: number
  audio_url?: string
}

interface CrosswordCell {
  letter: string
  isBlack: boolean
  number?: number
  userLetter: string
  isCorrect?: boolean
  clueIds: string[]
}

interface CrosswordProps {
  clues: CrosswordClue[]
  gridSize?: number
  onComplete: (result: { score: number; timeSpent: number; accuracy: number }) => void
  onExit: () => void
  timeLimit?: number
  enableAudio?: boolean
  enableHints?: boolean
}

export function Crossword({ 
  clues, 
  gridSize = 15,
  onComplete, 
  onExit, 
  timeLimit = 2400, // 40 minutes
  enableAudio = true,
  enableHints = true 
}: CrosswordProps) {
  const [grid, setGrid] = useState<CrosswordCell[][]>([])
  const [selectedClue, setSelectedClue] = useState<CrosswordClue | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [completedClues, setCompletedClues] = useState<Set<string>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)
  const [actualGridSize, setActualGridSize] = useState(gridSize)
  const gridRef = useRef<HTMLDivElement>(null)

  // Calculate optimal grid size based on clues
  useEffect(() => {
    if (clues.length === 0) return

    let maxRow = 0
    let maxCol = 0

    clues.forEach(clue => {
      const endRow = clue.direction === 'down' ? clue.startRow + clue.answer.length - 1 : clue.startRow
      const endCol = clue.direction === 'across' ? clue.startCol + clue.answer.length - 1 : clue.startCol
      
      maxRow = Math.max(maxRow, endRow)
      maxCol = Math.max(maxCol, endCol)
    })

    const optimalSize = Math.max(maxRow + 1, maxCol + 1, 8) // Minimum 8x8 grid
    setActualGridSize(Math.min(optimalSize, 15)) // Cap at 15x15
  }, [clues])

  // Initialize grid
  useEffect(() => {
    const newGrid: CrosswordCell[][] = Array(actualGridSize).fill(null).map(() =>
      Array(actualGridSize).fill(null).map(() => ({
        letter: '',
        isBlack: true,
        userLetter: '',
        clueIds: []
      }))
    )

    // Place words in grid
    clues.forEach(clue => {
      const { startRow, startCol, answer, direction, id, number } = clue
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'down' ? startRow + i : startRow
        const col = direction === 'across' ? startCol + i : startCol
        
        if (row < actualGridSize && col < actualGridSize) {
          newGrid[row][col] = {
            letter: answer[i].toUpperCase(),
            isBlack: false,
            userLetter: newGrid[row][col].userLetter || '',
            number: i === 0 ? number : newGrid[row][col].number,
            clueIds: [...(newGrid[row][col].clueIds || []), id]
          }
        }
      }
    })

    setGrid(newGrid)
  }, [clues, actualGridSize])

  // Timer
  useEffect(() => {
    if (gameEnded || !gameStarted) return

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
  }, [timeLimit, gameEnded, gameStarted])

  // Check for completed words
  useEffect(() => {
    if (!grid.length || !grid[0] || grid.length !== actualGridSize || !gameStarted) return
    
    const newCompletedClues = new Set<string>()
    
    clues.forEach(clue => {
      const { startRow, startCol, answer, direction, id } = clue
      let isComplete = true
      
      for (let i = 0; i < answer.length; i++) {
        const row = direction === 'down' ? startRow + i : startRow
        const col = direction === 'across' ? startCol + i : startCol
        
        if (row < actualGridSize && col < actualGridSize && grid[row] && grid[row][col]) {
          if (grid[row][col].userLetter.toUpperCase() !== answer[i].toUpperCase()) {
            isComplete = false
            break
          }
        } else {
          isComplete = false
          break
        }
      }
      
      if (isComplete) {
        newCompletedClues.add(id)
      }
    })
    
    setCompletedClues(newCompletedClues)
    
    if (newCompletedClues.size === clues.length && newCompletedClues.size > 0) {
      setTimeout(() => endGame(), 1000)
    }
  }, [grid, clues, actualGridSize, gameStarted])

  const startGame = () => {
    setShowInstructions(false)
    setGameStarted(true)
    
    // Anunciar inicio con TTS
    if (enableAudio) {
      ttsService.speakInstructions('crossword', 'Crucigrama iniciado. Haz clic en una celda y usa las pistas para completar las palabras.')
    }
    
    if (clues.length > 0) {
      setSelectedClue(clues[0])
      const firstClue = clues[0]
      setSelectedCell({ row: firstClue.startRow, col: firstClue.startCol })
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (!grid[row] || !grid[row][col] || grid[row][col].isBlack || !gameStarted) return

    setSelectedCell({ row, col })
    
    const cellClueIds = grid[row][col].clueIds
    if (cellClueIds.length > 0) {
      const clue = clues.find(c => c.id === cellClueIds[0])
      if (clue) {
        setSelectedClue(clue)
        
        // Anunciar clue seleccionada con TTS
        if (enableAudio) {
          ttsService.speak(`${clue.number} ${clue.direction === 'across' ? 'horizontal' : 'vertical'}: ${clue.clue}`, { 
            rate: 0.9, 
            volume: 0.8 
          })
        }
      }
    }
  }

  const handleKeyInput = (key: string) => {
    if (!selectedCell || gameEnded || !gameStarted) return

    const { row, col } = selectedCell

    if (key === 'Backspace') {
      updateCell(row, col, '')
      moveToPreviousCell()
    } else if (key.match(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/)) {
      updateCell(row, col, key.toUpperCase())
      moveToNextCell()
    } else if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      navigateWithArrows(key)
    }
  }

  const navigateWithArrows = (key: string) => {
    if (!selectedCell) return

    const { row, col } = selectedCell
    let newRow = row
    let newCol = col

    switch (key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1)
        break
      case 'ArrowDown':
        newRow = Math.min(actualGridSize - 1, row + 1)
        break
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1)
        break
      case 'ArrowRight':
        newCol = Math.min(actualGridSize - 1, col + 1)
        break
    }

    if (grid[newRow] && grid[newRow][newCol] && !grid[newRow][newCol].isBlack) {
      setSelectedCell({ row: newRow, col: newCol })
      
      const cellClueIds = grid[newRow][newCol].clueIds
      if (cellClueIds.length > 0) {
        const clue = clues.find(c => c.id === cellClueIds[0])
        if (clue) {
          setSelectedClue(clue)
        }
      }
    }
  }

  const updateCell = (row: number, col: number, letter: string) => {
    setGrid(prev => prev.map((gridRow, r) =>
      gridRow.map((cell, c) => {
        if (r === row && c === col) {
          return { ...cell, userLetter: letter }
        }
        return cell
      })
    ))
  }

  const moveToNextCell = () => {
    if (!selectedCell || !selectedClue) return

    const { row, col } = selectedCell
    const { direction, startRow, startCol, answer } = selectedClue

    if (direction === 'across') {
      const nextCol = col + 1
      if (nextCol < startCol + answer.length && nextCol < actualGridSize && grid[row] && grid[row][nextCol] && !grid[row][nextCol].isBlack) {
        setSelectedCell({ row, col: nextCol })
      }
    } else {
      const nextRow = row + 1
      if (nextRow < startRow + answer.length && nextRow < actualGridSize && grid[nextRow] && grid[nextRow][col] && !grid[nextRow][col].isBlack) {
        setSelectedCell({ row: nextRow, col })
      }
    }
  }

  const moveToPreviousCell = () => {
    if (!selectedCell || !selectedClue) return

    const { row, col } = selectedCell
    const { direction } = selectedClue

    if (direction === 'across') {
      const prevCol = col - 1
      if (prevCol >= 0 && grid[row] && grid[row][prevCol] && !grid[row][prevCol].isBlack) {
        setSelectedCell({ row, col: prevCol })
      }
    } else {
      const prevRow = row - 1
      if (prevRow >= 0 && grid[prevRow] && grid[prevRow][col] && !grid[prevRow][col].isBlack) {
        setSelectedCell({ row: prevRow, col })
      }
    }
  }

  const useHint = () => {
    if (!selectedClue || hintsUsed >= 3) return
    
    const { startRow, startCol, answer, direction } = selectedClue
    const newGrid = [...grid]
    
    // Find first empty cell in the word
    for (let i = 0; i < answer.length; i++) {
      const row = direction === 'down' ? startRow + i : startRow
      const col = direction === 'across' ? startCol + i : startCol
      
      if (row < actualGridSize && col < actualGridSize && newGrid[row] && newGrid[row][col]) {
        if (!newGrid[row][col].userLetter) {
          newGrid[row][col].userLetter = answer[i].toUpperCase()
          setGrid(newGrid)
          setHintsUsed(prev => prev + 1)
          
          // Anunciar pista con TTS
          if (enableAudio) {
            ttsService.speak(`Pista usada: la letra en posición ${i + 1} es ${answer[i].toUpperCase()}`, { 
              rate: 0.9, 
              pitch: 1.1 
            })
          }
          
          break
        }
      }
    }
  }

  // Reemplazar playAudio con TTS para clues
  const speakClue = (clue: CrosswordClue) => {
    if (!enableAudio) return
    
    setIsPlaying(true)
    const clueText = `${clue.number} ${clue.direction === 'across' ? 'horizontal' : 'vertical'}: ${clue.clue}`
    ttsService.speak(clueText, { 
      rate: 0.9, 
      volume: 0.8,
      onEnd: () => setIsPlaying(false)
    })
  }

  const endGame = () => {
    setGameEnded(true)
    
    if (enableAudio) {
      const wasCompleted = completedClues.size === clues.length
      ttsService.speak(wasCompleted ? '¡Crucigrama completado!' : 'Tiempo agotado', { 
        rate: 1.0, 
        pitch: wasCompleted ? 1.3 : 0.8 
      })
    }
    
    const totalCells = clues.reduce((sum, clue) => sum + clue.answer.length, 0)
    const correctCells = grid.length ? grid.flat().filter(cell => 
      cell && !cell.isBlack && cell.userLetter && cell.userLetter === cell.letter
    ).length : 0
    
    const accuracy = totalCells > 0 ? (correctCells / totalCells) * 100 : 0
    const score = Math.max(0, Math.round(accuracy * 10 - hintsUsed * 50))

    onComplete({
      score,
      timeSpent: timeElapsed,
      accuracy
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || !gameStarted) return
      
      e.preventDefault()
      handleKeyInput(e.key)
    }

    if (gameStarted) {
      document.addEventListener('keydown', handleKeyDown)
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedCell, selectedClue, gameStarted])

  // Instructions screen
  if (showInstructions) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <PuzzlePieceIcon className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Crucigrama!</h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <p className="text-lg text-gray-600">Completa todas las palabras usando las pistas</p>
              <TTSButton 
                text="¡Crucigrama! Completa todas las palabras usando las pistas. Haz clic en comenzar juego para empezar."
                type="instruction"
                gameType="crossword"
                size="md"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-2 text-indigo-600" />
                    Cómo Jugar
                  </h3>
                  <TTSButton 
                    text="Cómo jugar: 1. Haz clic en una celda del crucigrama para seleccionarla. 2. Lee la pista que aparece en el panel derecho. 3. Escribe la respuesta letra por letra. 4. ¡Completa todas las palabras para ganar!"
                    type="instruction"
                    gameType="crossword"
                    size="sm"
                  />
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-sm font-medium mr-3 mt-0.5">1</span>
                    <span>Haz clic en una celda del crucigrama para seleccionarla</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-sm font-medium mr-3 mt-0.5">2</span>
                    <span>Lee la pista que aparece en el panel derecho</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-sm font-medium mr-3 mt-0.5">3</span>
                    <span>Escribe la respuesta letra por letra</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-1 text-sm font-medium mr-3 mt-0.5">4</span>
                    <span>¡Completa todas las palabras para ganar!</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CommandLineIcon className="h-6 w-6 mr-2 text-purple-600" />
                    Controles del Teclado
                  </h3>
                  <TTSButton 
                    text="Controles del teclado: A a Z para escribir letras, Retroceso para borrar letra, flechas para navegar por el crucigrama."
                    type="instruction"
                    gameType="crossword"
                    size="sm"
                  />
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Escribir letras</span>
                      <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">A-Z</kbd>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Borrar letra</span>
                      <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">Retroceso</kbd>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Navegar</span>
                      <div className="flex space-x-1">
                        <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">↑</kbd>
                        <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">↓</kbd>
                        <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">←</kbd>
                        <kbd className="bg-white border border-gray-300 rounded px-2 py-1 text-sm">→</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <StarIcon className="h-5 w-5 mr-2" />
                  Consejos
                </h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Las palabras se cruzan compartiendo letras</li>
                  <li>• Las celdas verdes indican palabras completadas</li>
                  <li>• Puedes usar hasta 3 pistas si necesitas ayuda</li>
                  <li>• El tiempo límite es de {Math.floor(timeLimit / 60)} minutos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button onClick={startGame} size="lg" className="px-8">
              <PlayIcon className="h-5 w-5 mr-2" />
              Comenzar Juego
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Game ended screen
  if (gameEnded) {
    const totalActiveCells = grid.length ? grid.flat().filter(cell => cell && !cell.isBlack).length : 1
    const accuracy = grid.length ? (grid.flat().filter(cell => 
      cell && !cell.isBlack && cell.userLetter && cell.userLetter === cell.letter
    ).length / totalActiveCells * 100) : 0

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Crucigrama Completado!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-blue-800">Precisión</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{completedClues.size}/{clues.length}</div>
              <div className="text-sm text-purple-800">Palabras Completas</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-green-800">Tiempo Total</div>
            </div>
          </div>

          {hintsUsed > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800">
                Usaste {hintsUsed} pista{hintsUsed > 1 ? 's' : ''}
              </p>
            </div>
          )}

          <Button onClick={onExit} className="w-full">
            Finalizar Juego
          </Button>
        </div>
      </motion.div>
    )
  }

  // Main game interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PuzzlePieceIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Crucigrama</h1>
              <div className="text-sm text-gray-600">
                {completedClues.size}/{clues.length} palabras completadas
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <TTSControls position="inline" />
              
              <div className="text-right">
                <div className="text-lg font-mono text-gray-900">
                  {formatTime(timeLimit - timeElapsed)}
                </div>
                <div className="text-sm text-gray-600">Tiempo restante</div>
              </div>

              {enableHints && hintsUsed < 3 && selectedClue && (
                <Button
                  onClick={useHint}
                  variant="outline"
                  size="sm"
                  className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                >
                  <LightBulbIcon className="h-4 w-4 mr-1" />
                  Pista ({3 - hintsUsed})
                </Button>
              )}

              <Button onClick={onExit} variant="outline" size="sm">
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Crucigrama</h2>
                <TTSButton 
                  text={`Crucigrama de ${actualGridSize} por ${actualGridSize}. ${completedClues.size} de ${clues.length} palabras completadas.`}
                  type="instruction"
                  gameType="crossword"
                  size="sm"
                />
              </div>
              
              <div 
                ref={gridRef}
                className="grid gap-1 mx-auto justify-center"
                style={{ 
                  gridTemplateColumns: `repeat(${actualGridSize}, minmax(0, 1fr))`,
                  maxWidth: `${actualGridSize * 32}px`
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={cn(
                        'w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer relative',
                        cell.isBlack 
                          ? 'bg-gray-800 cursor-not-allowed' 
                          : completedClues.has(cell.clueIds[0])
                          ? 'bg-green-100 hover:bg-green-200'
                          : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                          ? 'bg-indigo-200 border-indigo-400'
                          : 'bg-white hover:bg-gray-50'
                      )}
                    >
                      {!cell.isBlack && (
                        <>
                          {cell.number && (
                            <span className="absolute top-0 left-0 text-xs text-gray-600 leading-none">
                              {cell.number}
                            </span>
                          )}
                          <span className="text-gray-900">
                            {cell.userLetter}
                          </span>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Clues Panel */}
          <div className="space-y-6">
            {/* Selected Clue */}
            {selectedClue && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Pista Actual</h3>
                  <TTSButton 
                    text={`${selectedClue.number} ${selectedClue.direction === 'across' ? 'horizontal' : 'vertical'}: ${selectedClue.clue}`}
                    type="question"
                    gameType="crossword"
                    size="sm"
                  />
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {selectedClue.direction === 'across' ? (
                      <ArrowRightIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    ) : (
                      <ArrowUpIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    )}
                    <span className="font-bold text-indigo-900">
                      {selectedClue.number} {selectedClue.direction === 'across' ? 'Horizontal' : 'Vertical'}
                    </span>
                  </div>
                  
                  <p className="text-indigo-800 mb-3">{selectedClue.clue}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-600">
                      {selectedClue.answer.length} letras
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      {(selectedClue.audio_url || enableAudio) && (
                        <button
                          onClick={() => speakClue(selectedClue)}
                          disabled={isPlaying}
                          className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                        >
                          <SpeakerWaveIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Clues List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900">Todas las Pistas</h3>
                <TTSButton 
                  text={`Lista de todas las pistas del crucigrama. ${clues.filter(c => c.direction === 'across').length} horizontales y ${clues.filter(c => c.direction === 'down').length} verticales.`}
                  type="instruction"
                  gameType="crossword"
                  size="sm"
                />
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {['across', 'down'].map(direction => (
                  <div key={direction}>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                      {direction === 'across' ? (
                        <ArrowRightIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                      )}
                      {direction === 'across' ? 'Horizontales' : 'Verticales'}
                    </h4>
                    
                    <div className="space-y-2">
                      {clues
                        .filter(clue => clue.direction === direction)
                        .sort((a, b) => a.number - b.number)
                        .map(clue => (
                          <div
                            key={clue.id}
                            onClick={() => {
                              setSelectedClue(clue)
                              setSelectedCell({ row: clue.startRow, col: clue.startCol })
                            }}
                            className={cn(
                              'p-3 rounded border cursor-pointer transition-all',
                              completedClues.has(clue.id)
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : selectedClue?.id === clue.id
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <span className="font-medium">
                                  {clue.number}. {clue.clue}
                                </span>
                                <div className="text-sm opacity-75">
                                  ({clue.answer.length} letras)
                                </div>
                              </div>
                              
                              {completedClues.has(clue.id) && (
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 