'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface Team {
  id: string
  name: string
  color: string
  members: string[]
  score: number
  foundWords: string[]
}

interface WordPosition {
  word: string
  startRow: number
  startCol: number
  direction: 'horizontal' | 'vertical' | 'diagonal'
  isFound: boolean
  foundBy?: string
}

interface WordSearchDuelProps {
  words: string[]
  teams: Team[]
  gridSize?: number
  timeLimit?: number
  onComplete: (result: { winner: Team; finalScores: Team[]; timeSpent: number }) => void
  onExit: () => void
}

export function WordSearchDuel({ 
  words, 
  teams: initialTeams,
  gridSize = 15, 
  timeLimit = 600, // 10 minutes
  onComplete, 
  onExit 
}: WordSearchDuelProps) {
  const [grid, setGrid] = useState<string[][]>([])
  const [teams, setTeams] = useState<Team[]>(initialTeams)
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([])
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [winner, setWinner] = useState<Team | null>(null)
  const [currentTeam, setCurrentTeam] = useState(0)
  const [isSelecting, setIsSelecting] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Generate grid and place words
  useEffect(() => {
    const newGrid = generateGrid()
    const positions = placeWords(newGrid, words)
    setGrid(newGrid)
    setWordPositions(positions)
  }, [words, gridSize])

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

  // Check for game end
  useEffect(() => {
    const allWordsFound = wordPositions.every(pos => pos.isFound)
    if (allWordsFound && wordPositions.length > 0) {
      setTimeout(() => endGame(), 1000)
    }
  }, [wordPositions])

  const generateGrid = (): string[][] => {
    const newGrid: string[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => 
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    )
    return newGrid
  }

  const placeWords = (grid: string[][], wordsToPlace: string[]): WordPosition[] => {
    const positions: WordPosition[] = []
    const directions: Array<'horizontal' | 'vertical' | 'diagonal'> = ['horizontal', 'vertical', 'diagonal']

    wordsToPlace.forEach(word => {
      let placed = false
      let attempts = 0

      while (!placed && attempts < 50) {
        const direction = directions[Math.floor(Math.random() * directions.length)]
        const startRow = Math.floor(Math.random() * gridSize)
        const startCol = Math.floor(Math.random() * gridSize)

        if (canPlaceWord(grid, word, startRow, startCol, direction)) {
          placeWordInGrid(grid, word, startRow, startCol, direction)
          positions.push({
            word: word.toUpperCase(),
            startRow,
            startCol,
            direction,
            isFound: false
          })
          placed = true
        }
        attempts++
      }
    })

    return positions
  }

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: string): boolean => {
    const { deltaRow, deltaCol } = getDeltas(direction)
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * deltaRow
      const newCol = col + i * deltaCol
      
      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false
      }
    }
    return true
  }

  const placeWordInGrid = (grid: string[][], word: string, row: number, col: number, direction: string) => {
    const { deltaRow, deltaCol } = getDeltas(direction)
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * deltaRow
      const newCol = col + i * deltaCol
      grid[newRow][newCol] = word[i].toUpperCase()
    }
  }

  const getDeltas = (direction: string) => {
    switch (direction) {
      case 'horizontal': return { deltaRow: 0, deltaCol: 1 }
      case 'vertical': return { deltaRow: 1, deltaCol: 0 }
      case 'diagonal': return { deltaRow: 1, deltaCol: 1 }
      default: return { deltaRow: 0, deltaCol: 1 }
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameEnded) return

    if (!isSelecting) {
      setIsSelecting(true)
      setSelectedCells([{ row, col }])
    } else {
      const newSelection = [...selectedCells, { row, col }]
      setSelectedCells(newSelection)
      
      // Check if selection forms a valid word
      checkWordSelection(newSelection)
    }
  }

  const checkWordSelection = (selection: {row: number, col: number}[]) => {
    const selectedWord = getWordFromSelection(selection)
    
    const foundPosition = wordPositions.find(pos => 
      pos.word === selectedWord && !pos.isFound && isValidSelection(selection, pos)
    )

    if (foundPosition) {
      // Word found!
      markWordAsFound(foundPosition, teams[currentTeam].id)
    }

    // Reset selection
    setIsSelecting(false)
    setSelectedCells([])
  }

  const getWordFromSelection = (selection: {row: number, col: number}[]): string => {
    return selection.map(cell => grid[cell.row][cell.col]).join('')
  }

  const isValidSelection = (selection: {row: number, col: number}[], position: WordPosition): boolean => {
    if (selection.length !== position.word.length) return false

    const { deltaRow, deltaCol } = getDeltas(position.direction)
    
    for (let i = 0; i < position.word.length; i++) {
      const expectedRow = position.startRow + i * deltaRow
      const expectedCol = position.startCol + i * deltaCol
      
      if (selection[i].row !== expectedRow || selection[i].col !== expectedCol) {
        return false
      }
    }
    
    return true
  }

  const markWordAsFound = (position: WordPosition, teamId: string) => {
    // Update word positions
    setWordPositions(prev => prev.map(pos => 
      pos === position ? { ...pos, isFound: true, foundBy: teamId } : pos
    ))

    // Update team score
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            score: team.score + position.word.length * 10,
            foundWords: [...team.foundWords, position.word]
          }
        : team
    ))

    // Switch to next team
    setCurrentTeam(prev => (prev + 1) % teams.length)
  }

  const endGame = () => {
    setGameEnded(true)
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
    const gameWinner = sortedTeams[0]
    setWinner(gameWinner)
    
    onComplete({
      winner: gameWinner,
      finalScores: sortedTeams,
      timeSpent: timeElapsed
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCellStyle = (row: number, col: number) => {
    const isSelected = selectedCells.some(cell => cell.row === row && cell.col === col)
    const foundWord = wordPositions.find(pos => {
      if (!pos.isFound) return false
      
      const { deltaRow, deltaCol } = getDeltas(pos.direction)
      for (let i = 0; i < pos.word.length; i++) {
        const wordRow = pos.startRow + i * deltaRow
        const wordCol = pos.startCol + i * deltaCol
        if (wordRow === row && wordCol === col) {
          return true
        }
      }
      return false
    })

    let className = 'w-8 h-8 border border-gray-300 flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 '
    
    if (isSelected) {
      className += 'bg-blue-500 text-white border-blue-600 '
    } else if (foundWord) {
      const team = teams.find(t => t.id === foundWord.foundBy)
      className += `border-2 text-white `
      className += team ? `bg-${team.color}-500 border-${team.color}-600 ` : 'bg-green-500 border-green-600 '
    } else {
      className += 'bg-white hover:bg-gray-100 '
    }

    return className
  }

  if (gameEnded) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Duelo Terminado!
          </h2>
          
          {winner && (
            <div className="bg-yellow-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">
                🏆 Equipo Ganador: {winner.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-yellow-700">Puntuación Final:</span>
                  <span className="font-bold ml-2">{winner.score} pts</span>
                </div>
                <div>
                  <span className="text-yellow-700">Palabras Encontradas:</span>
                  <span className="font-bold ml-2">{winner.foundWords.length}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Puntuaciones Finales:</h4>
            {teams
              .sort((a, b) => b.score - a.score)
              .map((team, index) => (
                <div key={team.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium" style={{ color: team.color }}>
                      {team.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{team.score} pts</div>
                    <div className="text-sm text-gray-600">{team.foundWords.length} palabras</div>
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-blue-800">Tiempo Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {wordPositions.filter(pos => pos.isFound).length}/{wordPositions.length}
              </div>
              <div className="text-sm text-green-800">Palabras Encontradas</div>
            </div>
          </div>

          <Button onClick={onExit} className="w-full">
            Finalizar Duelo
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MagnifyingGlassIcon className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-xl font-bold">Duelo de Búsqueda de Palabras</h1>
              <div className="text-sm opacity-90">
                Turno de {teams[currentTeam]?.name} • {formatTime(timeLimit - timeElapsed)}
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
              animate={{ width: `${(timeElapsed / timeLimit) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Word Search Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-2xl">
            <div 
              ref={gridRef}
              className="grid gap-1 mx-auto mb-4"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: '600px'
              }}
            >
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellStyle(rowIndex, colIndex)}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>

            {isSelecting && (
              <div className="text-center text-sm text-gray-600">
                Seleccionando palabra... Haz clic para completar la selección
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Teams Panel */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Equipos
            </h3>
            
            <div className="space-y-3">
              {teams.map((team, index) => (
                <div 
                  key={team.id} 
                  className={`p-3 rounded-lg border-2 transition-all ${
                    index === currentTeam 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{team.score} pts</div>
                      <div className="text-xs text-gray-600">
                        {team.foundWords.length} palabras
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Words to Find */}
          <div className="bg-white rounded-xl p-6 shadow-xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Palabras por Encontrar</h3>
            
            <div className="space-y-2">
              {wordPositions.map((position, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded-lg border ${
                    position.isFound 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${position.isFound ? 'line-through' : ''}`}>
                      {position.word}
                    </span>
                    {position.isFound && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {position.isFound && position.foundBy && (
                    <div className="text-xs text-green-600 mt-1">
                      Encontrada por: {teams.find(t => t.id === position.foundBy)?.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 