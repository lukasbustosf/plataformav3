'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'
import { useGameWebSocket } from '@/lib/websocket'
import { cn } from '@/lib/utils'
import TTSControls, { TTSButton } from '@/components/ui/ttsControls'
import ttsService from '@/lib/ttsService'
import type { GameComponentProps } from '@/types'

interface WordSearchProps extends GameComponentProps {
  accessibility?: boolean
  soundEnabled?: boolean
}

interface Word {
  word: string
  found: boolean
  positions: { row: number; col: number }[]
  direction: 'horizontal' | 'vertical' | 'diagonal'
}

interface Cell {
  letter: string
  highlighted: boolean
  wordId?: number
  row: number
  col: number
}

export function WordSearch({
  session,
  user,
  onAnswer,
  onGameEnd,
  currentQuestion,
  timeRemaining = 300,
  accessibility = true,
  soundEnabled = true
}: WordSearchProps) {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [words, setWords] = useState<Word[]>([])
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [gamePhase, setGamePhase] = useState<'waiting' | 'playing' | 'finished'>('waiting')
  const [audioEnabled, setAudioEnabled] = useState(soundEnabled)
  const [gridSize] = useState(12)
  
  const gridRef = useRef<HTMLDivElement>(null)
  const gameWS = useGameWebSocket(session.session_id)

  // Word list for word search
  const wordList = [
    'GATO', 'PERRO', 'CASA', 'LIBRO', 'FLOR', 'AGUA',
    'SOL', 'LUNA', 'MAR', 'CIELO', 'ÁRBOL', 'FUEGO'
  ]

  // Initialize game
  useEffect(() => {
    generateWordSearch()
    setGamePhase('playing')
    
    // Anunciar instrucciones al inicio
    if (accessibility) {
      ttsService.speakInstructions('word_search', 'Encuentra las palabras ocultas en la sopa de letras. Arrastra desde la primera letra hasta la última.')
    }
  }, [accessibility])

  const generateWordSearch = () => {
    // Select random words
    const selectedWords = wordList
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .map(word => ({
        word,
        found: false,
        positions: [],
        direction: 'horizontal' as const
      }))

    // Create empty grid
    const newGrid: Cell[][] = Array(gridSize).fill(null).map((_, row) =>
      Array(gridSize).fill(null).map((_, col) => ({
        letter: '',
        highlighted: false,
        row,
        col
      }))
    )

    // Place words in grid
    const placedWords = placeWordsInGrid(newGrid, selectedWords)
    
    // Fill empty cells with random letters
    fillEmptyCells(newGrid)
    
    setGrid(newGrid)
    setWords(placedWords)
    setFoundWords([])
    setScore(0)

    if (accessibility) {
      // Reemplazar announceToScreenReader con TTS real
      const wordsList = placedWords.map(w => w.word).join(', ')
      ttsService.speakQuestion(`Sopa de letras generada. Busca estas ${placedWords.length} palabras: ${wordsList}`)
    }
  }

  const placeWordsInGrid = (grid: Cell[][], wordList: Word[]): Word[] => {
    const placedWords: Word[] = []
    const directions = [
      { dx: 1, dy: 0, name: 'horizontal' },
      { dx: 0, dy: 1, name: 'vertical' },
      { dx: 1, dy: 1, name: 'diagonal' },
      { dx: -1, dy: 1, name: 'diagonal' }
    ]

    for (const wordObj of wordList) {
      const word = wordObj.word
      let placed = false
      let attempts = 0

      while (!placed && attempts < 50) {
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const startRow = Math.floor(Math.random() * gridSize)
        const startCol = Math.floor(Math.random() * gridSize)

        // Check if word fits
        let canPlace = true
        const positions: { row: number; col: number }[] = []

        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * direction.dy
          const col = startCol + i * direction.dx

          if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
            canPlace = false
            break
          }

          // Check if cell is empty or has same letter
          if (grid[row][col].letter !== '' && grid[row][col].letter !== word[i]) {
            canPlace = false
            break
          }

          positions.push({ row, col })
        }

        if (canPlace) {
          // Place the word
          positions.forEach((pos, i) => {
            grid[pos.row][pos.col].letter = word[i]
          })

          placedWords.push({
            ...wordObj,
            positions,
            direction: direction.name as any
          })
          placed = true
        }

        attempts++
      }
    }

    return placedWords
  }

  const fillEmptyCells = (grid: Cell[][]) => {
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (grid[row][col].letter === '') {
          grid[row][col].letter = alphabet[Math.floor(Math.random() * alphabet.length)]
        }
      }
    }
  }

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectedCells([{ row, col }])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return

    setSelectedCells(prev => {
      if (prev.length === 0) return [{ row, col }]
      
      const first = prev[0]
      
      // Calculate if it's a valid line (horizontal, vertical, or diagonal)
      const deltaRow = row - first.row
      const deltaCol = col - first.col
      
      if (deltaRow === 0) {
        // Horizontal line
        const start = Math.min(first.col, col)
        const end = Math.max(first.col, col)
        return Array.from({ length: end - start + 1 }, (_, i) => ({
          row: first.row,
          col: start + i
        }))
      } else if (deltaCol === 0) {
        // Vertical line
        const start = Math.min(first.row, row)
        const end = Math.max(first.row, row)
        return Array.from({ length: end - start + 1 }, (_, i) => ({
          row: start + i,
          col: first.col
        }))
      } else if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
        // Diagonal line
        const length = Math.abs(deltaRow) + 1
        const rowDir = deltaRow > 0 ? 1 : -1
        const colDir = deltaCol > 0 ? 1 : -1
        
        return Array.from({ length }, (_, i) => ({
          row: first.row + i * rowDir,
          col: first.col + i * colDir
        }))
      }
      
      return prev
    })
  }

  const handleCellMouseUp = () => {
    setIsSelecting(false)
    checkSelectedWord()
  }

  const checkSelectedWord = () => {
    if (selectedCells.length < 2) {
      setSelectedCells([])
      return
    }

    // Get selected word
    const selectedWord = selectedCells
      .map(pos => grid[pos.row][pos.col].letter)
      .join('')

    // Check if it matches any unfound word (forward or backward)
    const foundWord = words.find(w => 
      !w.found && (w.word === selectedWord || w.word === selectedWord.split('').reverse().join(''))
    )

    if (foundWord) {
      // Mark word as found
      setWords(prev => prev.map(w => 
        w.word === foundWord.word ? { ...w, found: true } : w
      ))

      // Highlight cells
      setGrid(prev => prev.map(row => 
        row.map(cell => {
          const isSelected = selectedCells.some(pos => pos.row === cell.row && pos.col === cell.col)
          return isSelected ? { ...cell, highlighted: true } : cell
        })
      ))

      setFoundWords(prev => [...prev, foundWord.word])
      setScore(prev => prev + 10)

      if (audioEnabled) {
        // Reemplazar audio manual con TTS feedback
        ttsService.speak(`¡Encontraste ${foundWord.word}!`, { rate: 1.1, pitch: 1.2, volume: 0.9 })
      }

      // Check if all words found
      if (foundWords.length + 1 >= words.length) {
        setTimeout(() => {
          setGamePhase('finished')
          if (accessibility) {
            ttsService.speak('¡Todas las palabras encontradas!', { rate: 0.9, pitch: 1.3 })
          }
          setTimeout(() => onGameEnd(), 3000)
        }, 1500)
      }

      onAnswer(foundWord.word)
    } else if (audioEnabled) {
      // Reemplazar audio manual con TTS feedback
      ttsService.speak('No es una palabra válida', { rate: 1.0, pitch: 0.8, volume: 0.7 })
    }

    setSelectedCells([])
  }

  if (gamePhase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sopa de Letras</h2>
          <p className="text-gray-600">Generando el puzzle...</p>
        </div>
      </div>
    )
  }

  if (gamePhase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Todas las Palabras Encontradas!</h2>
          <p className="text-xl text-gray-600 mb-2">Puntuación: {score}</p>
          <p className="text-lg text-gray-600">Palabras encontradas: {foundWords.length}/{words.length}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-4 border-indigo-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔍</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Sopa de Letras</h1>
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
                <span className="font-medium text-gray-600">Puntos:</span>
                <span className="text-lg font-bold text-indigo-600">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-600">Encontradas:</span>
                <span className="text-lg font-bold text-gray-900">{foundWords.length}/{words.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-600">Tiempo:</span>
              <span className={cn(
                'text-lg font-bold',
                timeRemaining > 120 ? 'text-green-600' : 
                timeRemaining > 60 ? 'text-yellow-600' : 'text-red-600'
              )}>
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Word Search Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900 text-center">Encuentra las palabras</h3>
                <TTSButton 
                  text="Encuentra las palabras ocultas en la sopa de letras arrastrando desde la primera letra hasta la última."
                  type="instruction"
                  gameType="word_search"
                  size="sm"
                />
              </div>
              <div 
                ref={gridRef}
                className="grid grid-cols-12 gap-1 max-w-md mx-auto select-none"
                onMouseLeave={() => {
                  setIsSelecting(false)
                  setSelectedCells([])
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleCellMouseUp}
                      className={cn(
                        'w-8 h-8 border border-gray-300 flex items-center justify-center',
                        'text-sm font-bold cursor-pointer transition-all duration-150',
                        'hover:bg-indigo-100',
                        cell.highlighted
                          ? 'bg-green-200 text-green-800 border-green-400'
                          : selectedCells.some(pos => pos.row === rowIndex && pos.col === colIndex)
                          ? 'bg-indigo-200 text-indigo-800 border-indigo-400'
                          : 'bg-white text-gray-700'
                      )}
                      aria-label={`Celda ${rowIndex + 1}, ${colIndex + 1}: ${cell.letter}`}
                    >
                      {cell.letter}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Words List */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900">Palabras a encontrar</h3>
                <TTSButton 
                  text={`Palabras que debes encontrar: ${words.map(w => w.word).join(', ')}`}
                  type="instruction"
                  gameType="word_search"
                  size="sm"
                />
              </div>
              <div className="space-y-2">
                {words.map((word, index) => (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-lg border-2 transition-all duration-200',
                      word.found
                        ? 'bg-green-100 border-green-300 text-green-800 line-through'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    )}
                  >
                    <span className="font-medium">{word.word}</span>
                    {word.found && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center justify-center gap-4 mb-2">
                <h4 className="font-bold text-indigo-900">Instrucciones</h4>
                <TTSButton 
                  text="Instrucciones: Arrastra desde la primera letra. Las palabras pueden estar en cualquier dirección. También pueden leerse al revés."
                  type="instruction"
                  gameType="word_search"
                  size="sm"
                />
              </div>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Arrastra desde la primera letra</li>
                <li>• Las palabras pueden estar en cualquier dirección</li>
                <li>• También pueden leerse al revés</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 