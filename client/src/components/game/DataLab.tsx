'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon,
  TableCellsIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  ArrowPathIcon,
  EyeIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface DataPoint {
  [key: string]: string | number
}

interface DataColumn {
  id: string
  name: string
  type: 'string' | 'number' | 'date'
  values: (string | number)[]
}

interface Question {
  id: string
  question: string
  type: 'chart-analysis' | 'data-insight' | 'correlation' | 'prediction'
  options?: string[]
  correctAnswer: number | string
  explanation: string
  points: number
  chartType?: 'bar' | 'line' | 'pie' | 'scatter'
  requiredColumns?: string[]
}

interface Dataset {
  name: string
  description: string
  columns: DataColumn[]
  data: DataPoint[]
  context: string
}

interface DataLabProps {
  dataset: Dataset
  questions: Question[]
  onComplete: (result: { 
    score: number
    correctAnswers: number
    totalQuestions: number
    timeSpent: number
    insights: string[]
  }) => void
  onExit: () => void
  enableHints?: boolean
}

export function DataLab({ 
  dataset,
  questions,
  onComplete, 
  onExit,
  enableHints = true 
}: DataLabProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; answer: string | number; isCorrect: boolean }>>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar')
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [dataView, setDataView] = useState<'table' | 'chart'>('table')
  const [insights, setInsights] = useState<string[]>([])

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameEnded) {
        setTimeSpent(prev => prev + 1)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gameEnded])

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const answer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect
    }

    setAnswers(prev => [...prev, answer])
    setShowExplanation(true)

    setTimeout(() => {
      setShowExplanation(false)
      setSelectedAnswer(null)
      nextQuestion()
    }, 3000)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      endGame()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const endGame = () => {
    setGameEnded(true)
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const totalScore = answers.reduce((sum, answer) => {
      if (answer.isCorrect) {
        const question = questions.find(q => q.id === answer.questionId)
        return sum + (question?.points || 0)
      }
      return sum
    }, 0)

    onComplete({
      score: totalScore,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      insights
    })
  }

  const generateChart = (type: string, columns: string[]) => {
    if (columns.length === 0) return null

    const chartData = dataset.data.slice(0, 10) // Limit for display

    switch (type) {
      case 'bar':
        return (
          <div className="w-full h-64 flex items-end justify-around bg-gray-50 border rounded p-4">
            {chartData.map((point, index) => {
              const value = typeof point[columns[0]] === 'number' ? point[columns[0]] as number : 0
              const maxValue = Math.max(...dataset.data.map(d => typeof d[columns[0]] === 'number' ? d[columns[0]] as number : 0))
              const height = (value / maxValue) * 200
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="bg-blue-500 w-8 mb-2 transition-all duration-1000"
                    style={{ height: `${height}px` }}
                  />
                  <span className="text-xs text-gray-600 transform -rotate-45 origin-left">
                    {point[dataset.columns[0].id]?.toString().slice(0, 8)}
                  </span>
                </div>
              )
            })}
          </div>
        )
      
      case 'line':
        return (
          <div className="w-full h-64 bg-gray-50 border rounded p-4 relative">
            <svg className="w-full h-full">
              <polyline
                points={chartData.map((point, index) => {
                  const value = typeof point[columns[0]] === 'number' ? point[columns[0]] as number : 0
                  const maxValue = Math.max(...dataset.data.map(d => typeof d[columns[0]] === 'number' ? d[columns[0]] as number : 0))
                  const x = (index / (chartData.length - 1)) * 300
                  const y = 200 - (value / maxValue) * 180
                  return `${x},${y}`
                }).join(' ')}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
              />
            </svg>
          </div>
        )
      
      case 'pie':
        const values = chartData.slice(0, 5).map(point => typeof point[columns[0]] === 'number' ? point[columns[0]] as number : 0)
        const total = values.reduce((sum, val) => sum + val, 0)
        let cumulativeAngle = 0
        
        return (
          <div className="w-64 h-64 mx-auto">
            <svg className="w-full h-full">
              {values.map((value, index) => {
                const angle = (value / total) * 360
                const startAngle = cumulativeAngle
                const endAngle = cumulativeAngle + angle
                cumulativeAngle += angle
                
                const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
                
                return (
                  <path
                    key={index}
                    d={`M 128 128 L ${128 + 100 * Math.cos((startAngle - 90) * Math.PI / 180)} ${128 + 100 * Math.sin((startAngle - 90) * Math.PI / 180)} A 100 100 0 ${angle > 180 ? 1 : 0} 1 ${128 + 100 * Math.cos((endAngle - 90) * Math.PI / 180)} ${128 + 100 * Math.sin((endAngle - 90) * Math.PI / 180)} Z`}
                    fill={colors[index % colors.length]}
                  />
                )
              })}
            </svg>
          </div>
        )
      
      default:
        return <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded">
          <span className="text-gray-500">Selecciona columnas para ver el gráfico</span>
        </div>
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (gameEnded) {
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const accuracy = Math.round((correctAnswers / questions.length) * 100)
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Análisis Completado!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{answers.reduce((sum, a) => {
                if (a.isCorrect) {
                  const q = questions.find(q => q.id === a.questionId)
                  return sum + (q?.points || 0)
                }
                return sum
              }, 0)}</div>
              <div className="text-sm text-blue-800">Puntos Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}/{questions.length}</div>
              <div className="text-sm text-green-800">Respuestas Correctas</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
              <div className="text-sm text-purple-800">Tiempo Total</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={onExit} className="w-full">
              Finalizar Laboratorio
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChartBarIcon className="h-8 w-8 text-white" />
              <div className="text-white">
                <h1 className="text-xl font-bold">Data Lab - {dataset.name}</h1>
                <div className="text-sm opacity-90">
                  Pregunta {currentQuestionIndex + 1} de {questions.length} • {formatTime(timeSpent)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setDataView(dataView === 'table' ? 'chart' : 'table')}
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                {dataView === 'table' ? <ChartBarIcon className="h-4 w-4" /> : <TableCellsIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Visualization */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Visualización de Datos</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Vista:</span>
                <Button
                  onClick={() => setDataView('table')}
                  variant={dataView === 'table' ? 'primary' : 'outline'}
                  size="sm"
                >
                  Tabla
                </Button>
                <Button
                  onClick={() => setDataView('chart')}
                  variant={dataView === 'chart' ? 'primary' : 'outline'}
                  size="sm"
                >
                  Gráfico
                </Button>
              </div>
            </div>

            {dataView === 'table' ? (
              <div className="overflow-auto max-h-96 border rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {dataset.columns.map((column) => (
                        <th key={column.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataset.data.slice(0, 10).map((row, index) => (
                      <tr key={index}>
                        {dataset.columns.map((column) => (
                          <td key={column.id} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {row[column.id]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Chart Type Selector */}
                <div className="flex space-x-2">
                  {(['bar', 'line', 'pie', 'scatter'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => setActiveChart(type)}
                      variant={activeChart === type ? 'primary' : 'outline'}
                      size="sm"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>

                {/* Column Selector */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Columnas a visualizar:</span>
                  <div className="flex flex-wrap gap-2">
                    {dataset.columns.filter(col => col.type === 'number').map((column) => (
                      <button
                        key={column.id}
                        onClick={() => {
                          setSelectedColumns(prev => 
                            prev.includes(column.id) 
                              ? prev.filter(c => c !== column.id)
                              : [...prev, column.id]
                          )
                        }}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedColumns.includes(column.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {column.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Display */}
                <div className="mt-4">
                  {generateChart(activeChart, selectedColumns)}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Contexto:</strong> {dataset.context}
              </p>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <AnimatePresence mode="wait">
              {!showExplanation ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-6 w-6 text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pregunta {currentQuestionIndex + 1}
                    </h3>
                  </div>

                  <p className="text-gray-700 mb-6">{currentQuestion.question}</p>

                  {currentQuestion.options ? (
                    <div className="space-y-3 mb-6">
                      {currentQuestion.options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedAnswer(index)}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            selectedAnswer === index
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                              selectedAnswer === index
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAnswer === index && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="text-gray-900">{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-6">
                      <input
                        type="text"
                        value={selectedAnswer?.toString() || ''}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      Confirmar Respuesta
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="explanation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  {answers[answers.length - 1]?.isCorrect ? (
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  ) : (
                    <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {answers[answers.length - 1]?.isCorrect ? '¡Correcto!' : 'Incorrecto'}
                  </h3>
                  
                  <div className="bg-blue-50 p-4 rounded-lg text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Explicación:</h4>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
} 