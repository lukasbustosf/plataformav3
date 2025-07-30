'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CommandLineIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  CpuChipIcon,
  ArrowRightIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface CodeBlock {
  id: string
  type: 'function' | 'variable' | 'loop' | 'condition' | 'action'
  content: string
  params?: string[]
  color: string
  category: string
}

interface CodePuzzle {
  id: string
  title: string
  description: string
  instructions: string
  expectedOutput: string[]
  availableBlocks: CodeBlock[]
  testCases: { input: string[]; expectedOutput: string[] }[]
  maxBlocks?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  bloomLevel: 'Aplicar' | 'Analizar' | 'Crear'
  points: number
}

interface CodingPuzzleProps {
  puzzle: CodePuzzle
  onComplete: (result: { 
    solved: boolean
    attempts: number
    timeSpent: number
    score: number
    solution: CodeBlock[]
  }) => void
  onExit: () => void
  enableHints?: boolean
}

export function CodingPuzzle({ 
  puzzle,
  onComplete, 
  onExit,
  enableHints = true 
}: CodingPuzzleProps) {
  const [solution, setSolution] = useState<CodeBlock[]>([])
  const [availableBlocks, setAvailableBlocks] = useState<CodeBlock[]>(puzzle.availableBlocks)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [gameEnded, setGameEnded] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [testResults, setTestResults] = useState<boolean[]>([])
  const [draggedBlock, setDraggedBlock] = useState<CodeBlock | null>(null)
  const [dropTarget, setDropTarget] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameEnded) {
        setTimeSpent(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gameEnded])

  const addBlockToSolution = (block: CodeBlock) => {
    if (puzzle.maxBlocks && solution.length >= puzzle.maxBlocks) return
    
    setSolution(prev => [...prev, { ...block, id: `${block.id}_${Date.now()}` }])
    setOutput([])
    setTestResults([])
  }

  const removeBlockFromSolution = (index: number) => {
    setSolution(prev => prev.filter((_, i) => i !== index))
    setOutput([])
    setTestResults([])
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newSolution = [...solution]
    const [removed] = newSolution.splice(fromIndex, 1)
    newSolution.splice(toIndex, 0, removed)
    setSolution(newSolution)
    setOutput([])
    setTestResults([])
  }

  const runCode = () => {
    if (solution.length === 0) return
    
    setIsRunning(true)
    setAttempts(prev => prev + 1)
    
    // Simulate code execution
    setTimeout(() => {
      const newOutput = executeBlocks(solution)
      setOutput(newOutput)
      
      // Run test cases
      const results = puzzle.testCases.map(testCase => {
        const testOutput = executeBlocks(solution, testCase.input)
        return JSON.stringify(testOutput) === JSON.stringify(testCase.expectedOutput)
      })
      
      setTestResults(results)
      setIsRunning(false)
      
      // Check if puzzle is solved
      const solved = results.every(result => result)
      if (solved) {
        setTimeout(() => {
          setGameEnded(true)
          onComplete({
            solved: true,
            attempts,
            timeSpent,
            score: calculateScore(),
            solution
          })
        }, 2000)
      }
    }, 1500)
  }

  const executeBlocks = (blocks: CodeBlock[], input: string[] = []): string[] => {
    const output: string[] = []
    const variables: { [key: string]: any } = {}
    
    // Simple interpreter for demo purposes
    blocks.forEach(block => {
      switch (block.type) {
        case 'variable':
          if (block.content.includes('=')) {
            const [varName, value] = block.content.split('=').map(s => s.trim())
            variables[varName] = value.replace(/"/g, '')
          }
          break
        case 'action':
          if (block.content.includes('print')) {
            const match = block.content.match(/print\((.*)\)/)
            if (match) {
              let toPrint = match[1].replace(/"/g, '')
              // Replace variables
              Object.keys(variables).forEach(varName => {
                toPrint = toPrint.replace(new RegExp(varName, 'g'), variables[varName])
              })
              output.push(toPrint)
            }
          }
          break
        case 'loop':
          const loopMatch = block.content.match(/for.*in.*range\((\d+)\)/)
          if (loopMatch) {
            const iterations = parseInt(loopMatch[1])
            for (let i = 0; i < iterations; i++) {
              variables['i'] = i.toString()
            }
          }
          break
      }
    })
    
    return output
  }

  const calculateScore = (): number => {
    const baseScore = puzzle.points
    const timeBonus = Math.max(0, 300 - timeSpent) // Bonus for speed
    const attemptsBonus = Math.max(0, (10 - attempts) * 10) // Bonus for fewer attempts
    return baseScore + timeBonus + attemptsBonus
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'function': return 'bg-blue-500'
      case 'variable': return 'bg-green-500'
      case 'loop': return 'bg-purple-500'
      case 'condition': return 'bg-yellow-500'
      case 'action': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const onDragStart = (e: React.DragEvent, block: CodeBlock) => {
    setDraggedBlock(block)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDropTarget(index)
  }

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedBlock) {
      addBlockToSolution(draggedBlock)
    }
    setDraggedBlock(null)
    setDropTarget(null)
  }

  if (gameEnded) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Puzzle Resuelto!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{calculateScore()}</div>
              <div className="text-sm text-blue-800">Puntos Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{attempts}</div>
              <div className="text-sm text-green-800">Intentos</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-purple-800">Tiempo</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={onExit} className="w-full">
              Finalizar Puzzle
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CommandLineIcon className="h-8 w-8 text-white" />
              <div className="text-white">
                <h1 className="text-xl font-bold">{puzzle.title}</h1>
                <div className="text-sm opacity-90">
                  {puzzle.difficulty} • {puzzle.bloomLevel} • {puzzle.points} puntos
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <div className="text-sm opacity-90">Tiempo</div>
                <div className="font-mono text-lg">{formatTime(timeSpent)}</div>
              </div>
              
              <div className="text-white text-right">
                <div className="text-sm opacity-90">Intentos</div>
                <div className="font-mono text-lg">{attempts}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Description */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center mb-4">
              <LightBulbIcon className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Problema</h2>
            </div>
            
            <p className="text-gray-700 mb-4">{puzzle.description}</p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
              <p className="text-blue-800 text-sm">{puzzle.instructions}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Salida Esperada:</h3>
              <div className="font-mono text-sm text-green-800 bg-green-100 p-2 rounded">
                {puzzle.expectedOutput.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>

            {enableHints && (
              <Button 
                onClick={() => setShowHint(!showHint)}
                variant="outline"
                className="w-full mt-4"
              >
                {showHint ? 'Ocultar' : 'Mostrar'} Pista
              </Button>
            )}
            
            {showHint && (
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <p className="text-yellow-800 text-sm">
                  💡 Pista: Necesitas usar bloques de tipo variable y acción. 
                  Comienza definiendo una variable y luego imprime su valor.
                </p>
              </div>
            )}
          </div>

          {/* Available Blocks */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center mb-4">
              <CodeBracketIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Bloques Disponibles</h2>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, block)}
                  className={`${getBlockColor(block.type)} text-white p-3 rounded-lg cursor-grab active:cursor-grabbing shadow-lg transition-transform hover:scale-105`}
                >
                  <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
                    {block.type}
                  </div>
                  <div className="font-mono text-sm">{block.content}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Area & Output */}
          <div className="space-y-6">
            {/* Solution Builder */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CpuChipIcon className="h-6 w-6 text-purple-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Tu Solución</h2>
                </div>
                
                <div className="text-sm text-gray-500">
                  {solution.length}{puzzle.maxBlocks ? `/${puzzle.maxBlocks}` : ''} bloques
                </div>
              </div>
              
              <div 
                className="min-h-40 border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, solution.length)}
              >
                {solution.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">
                    Arrastra bloques aquí para construir tu solución
                  </div>
                ) : (
                  solution.map((block, index) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${getBlockColor(block.type)} text-white p-3 rounded-lg shadow-lg flex items-center justify-between`}
                    >
                      <div>
                        <div className="text-xs uppercase tracking-wide opacity-80">
                          {index + 1}. {block.type}
                        </div>
                        <div className="font-mono text-sm">{block.content}</div>
                      </div>
                      <button
                        onClick={() => removeBlockFromSolution(index)}
                        className="text-white hover:text-red-200 ml-2"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={runCode}
                  disabled={solution.length === 0 || isRunning}
                  className="flex-1"
                >
                  <PlayIcon className="h-4 w-4 mr-2" />
                  {isRunning ? 'Ejecutando...' : 'Ejecutar Código'}
                </Button>
              </div>
            </div>

            {/* Output */}
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salida</h3>
              
              <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg min-h-24">
                {isRunning ? (
                  <div className="animate-pulse">Ejecutando...</div>
                ) : output.length > 0 ? (
                  output.map((line, index) => (
                    <div key={index}>{line}</div>
                  ))
                ) : (
                  <div className="text-gray-500">Sin salida</div>
                )}
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Casos de Prueba:</h4>
                  <div className="space-y-2">
                    {testResults.map((passed, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {passed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`text-sm ${passed ? 'text-green-700' : 'text-red-700'}`}>
                          Caso {index + 1}: {passed ? 'Pasado' : 'Fallido'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 