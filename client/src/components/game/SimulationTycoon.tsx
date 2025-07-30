'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface SimulationEvent {
  id: string
  title: string
  description: string
  choices: EventChoice[]
  impact: KPIImpact
  probability?: number
}

interface EventChoice {
  id: string
  text: string
  cost: number
  impact: KPIImpact
  consequences?: string
}

interface KPIImpact {
  revenue?: number
  costs?: number
  satisfaction?: number
  reputation?: number
  efficiency?: number
}

interface GameState {
  turn: number
  revenue: number
  costs: number
  satisfaction: number
  reputation: number
  efficiency: number
  cash: number
  events: SimulationEvent[]
  completedEvents: string[]
}

interface SimulationTycoonProps {
  scenario: {
    title: string
    description: string
    initialState: Partial<GameState>
    events: SimulationEvent[]
    objectives: {
      target: string
      value: number
      turns: number
    }
  }
  onComplete: (result: { score: number; finalState: GameState; objectiveMet: boolean }) => void
  onExit: () => void
  maxTurns?: number
}

export function SimulationTycoon({ 
  scenario, 
  onComplete, 
  onExit, 
  maxTurns = 12 
}: SimulationTycoonProps) {
  const [gameState, setGameState] = useState<GameState>({
    turn: 1,
    revenue: 1000,
    costs: 800,
    satisfaction: 70,
    reputation: 60,
    efficiency: 50,
    cash: 5000,
    events: scenario.events,
    completedEvents: [],
    ...scenario.initialState
  })

  const [currentEvent, setCurrentEvent] = useState<SimulationEvent | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [showKPIs, setShowKPIs] = useState(true)
  const [turnHistory, setTurnHistory] = useState<GameState[]>([])

  // Calculate current profit
  const currentProfit = gameState.revenue - gameState.costs

  // Check if objectives are met
  const objectiveMet = () => {
    const { target, value } = scenario.objectives
    switch (target) {
      case 'profit':
        return currentProfit >= value
      case 'revenue':
        return gameState.revenue >= value
      case 'satisfaction':
        return gameState.satisfaction >= value
      case 'reputation':
        return gameState.reputation >= value
      default:
        return false
    }
  }

  // Generate random event for the turn
  useEffect(() => {
    if (gameState.turn <= maxTurns && !gameEnded && !currentEvent) {
      const availableEvents = gameState.events.filter(
        event => !gameState.completedEvents.includes(event.id)
      )
      
      if (availableEvents.length > 0) {
        const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)]
        setCurrentEvent(randomEvent)
      } else {
        // No more events, auto-advance turn
        setTimeout(() => nextTurn(), 1000)
      }
    }
  }, [gameState.turn, currentEvent, gameEnded])

  // Check end conditions
  useEffect(() => {
    if (gameState.turn > maxTurns || gameState.cash <= 0) {
      endGame()
    }
  }, [gameState.turn, gameState.cash])

  const makeChoice = (choice: EventChoice) => {
    if (!currentEvent) return

    // Apply choice effects
    const newState = { ...gameState }
    
    // Apply costs
    newState.cash = Math.max(0, newState.cash - choice.cost)
    
    // Apply KPI impacts
    if (choice.impact.revenue) {
      newState.revenue = Math.max(0, newState.revenue + choice.impact.revenue)
    }
    if (choice.impact.costs) {
      newState.costs = Math.max(0, newState.costs + choice.impact.costs)
    }
    if (choice.impact.satisfaction) {
      newState.satisfaction = Math.max(0, Math.min(100, newState.satisfaction + choice.impact.satisfaction))
    }
    if (choice.impact.reputation) {
      newState.reputation = Math.max(0, Math.min(100, newState.reputation + choice.impact.reputation))
    }
    if (choice.impact.efficiency) {
      newState.efficiency = Math.max(0, Math.min(100, newState.efficiency + choice.impact.efficiency))
    }

    // Mark event as completed
    newState.completedEvents = [...newState.completedEvents, currentEvent.id]
    
    setGameState(newState)
    setTurnHistory(prev => [...prev, newState])
    setCurrentEvent(null)
    
    // Advance to next turn after showing results
    setTimeout(() => nextTurn(), 2000)
  }

  const nextTurn = () => {
    if (gameState.turn >= maxTurns) {
      endGame()
      return
    }

    setGameState(prev => ({
      ...prev,
      turn: prev.turn + 1,
      // Add turn-based revenue
      cash: prev.cash + (prev.revenue - prev.costs)
    }))
  }

  const endGame = () => {
    setGameEnded(true)
    
    const finalScore = calculateScore()
    const objMet = objectiveMet()
    
    onComplete({
      score: finalScore,
      finalState: gameState,
      objectiveMet: objMet
    })
  }

  const calculateScore = () => {
    let score = 0
    
    // Base score from profit
    score += Math.max(0, currentProfit * 2)
    
    // Bonus for high KPIs
    score += gameState.satisfaction * 5
    score += gameState.reputation * 3
    score += gameState.efficiency * 2
    
    // Bonus for meeting objectives
    if (objectiveMet()) {
      score += 1000
    }
    
    // Penalty for running out of cash
    if (gameState.cash <= 0) {
      score = Math.max(0, score - 500)
    }
    
    return Math.round(score)
  }

  const getKPIColor = (value: number, isPositive: boolean = true) => {
    if (isPositive) {
      if (value >= 80) return 'text-green-600'
      if (value >= 60) return 'text-yellow-600'
      return 'text-red-600'
    } else {
      if (value <= 20) return 'text-green-600'
      if (value <= 40) return 'text-yellow-600'
      return 'text-red-600'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP',
      minimumFractionDigits: 0 
    }).format(amount)
  }

  if (gameEnded) {
    const finalScore = calculateScore()
    const objMet = objectiveMet()

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
          <div className="text-center mb-8">
            <TrophyIcon className={`h-16 w-16 mx-auto mb-4 ${objMet ? 'text-yellow-500' : 'text-gray-400'}`} />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {objMet ? '¡Objetivo Cumplido!' : 'Simulación Terminada'}
            </h2>
            <p className="text-lg text-gray-600">
              {scenario.title} - Turno {gameState.turn}/{maxTurns}
            </p>
          </div>

          {/* Final KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(currentProfit)}</div>
              <div className="text-sm text-blue-800">Ganancia Final</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(gameState.cash)}</div>
              <div className="text-sm text-green-800">Efectivo</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{gameState.satisfaction}%</div>
              <div className="text-sm text-purple-800">Satisfacción</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{gameState.reputation}%</div>
              <div className="text-sm text-yellow-800">Reputación</div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{gameState.efficiency}%</div>
              <div className="text-sm text-indigo-800">Eficiencia</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{finalScore}</div>
              <div className="text-sm text-orange-800">Puntuación</div>
            </div>
          </div>

          {/* Objective Status */}
          <div className={`p-4 rounded-lg mb-6 ${
            objMet ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-semibold mb-2 ${objMet ? 'text-green-900' : 'text-red-900'}`}>
              Objetivo: {scenario.objectives.target} ≥ {scenario.objectives.value}
            </h3>
            <p className={`text-sm ${objMet ? 'text-green-700' : 'text-red-700'}`}>
              {objMet ? '✓ Objetivo alcanzado exitosamente' : '✗ Objetivo no cumplido'}
            </p>
          </div>

          <Button onClick={onExit} className="w-full">
            Finalizar Simulación
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-xl font-bold">{scenario.title}</h1>
              <div className="text-sm opacity-90">
                Turno {gameState.turn}/{maxTurns} • Ganancia: {formatCurrency(currentProfit)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowKPIs(!showKPIs)}
              variant="outline"
              size="sm"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              KPIs
            </Button>
            
            <Button onClick={onExit} variant="outline" size="sm">
              Salir
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-white bg-opacity-20 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-yellow-400 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(gameState.turn / maxTurns) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Event */}
          <AnimatePresence mode="wait">
            {currentEvent && (
              <motion.div
                key={currentEvent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-6 shadow-2xl"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentEvent.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {currentEvent.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">¿Qué decides hacer?</h4>
                  {currentEvent.choices.map((choice, index) => (
                    <motion.button
                      key={choice.id}
                      onClick={() => makeChoice(choice)}
                      className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {choice.text}
                            </span>
                          </div>
                          
                          {choice.consequences && (
                            <p className="text-sm text-gray-600 ml-11">
                              {choice.consequences}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">
                            Costo: {formatCurrency(choice.cost)}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scenario Description */}
          {!currentEvent && (
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-3">Descripción del Escenario</h3>
              <p className="text-gray-700 mb-4">{scenario.description}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Objetivo:</h4>
                <p className="text-blue-800">
                  Alcanzar {scenario.objectives.target} de {scenario.objectives.value} 
                  en {scenario.objectives.turns} turnos
                </p>
              </div>
            </div>
          )}
        </div>

        {/* KPI Dashboard */}
        <div className="space-y-6">
          {showKPIs && (
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2" />
                Indicadores KPI
              </h3>
              
              <div className="space-y-4">
                {/* Financial KPIs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Efectivo</span>
                    <span className={`font-bold ${getKPIColor(gameState.cash / 1000)}`}>
                      {formatCurrency(gameState.cash)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Ingresos</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(gameState.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Costos</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(gameState.costs)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4 pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Ganancia</span>
                    <span className={`font-bold ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(currentProfit)}
                    </span>
                  </div>
                </div>

                {/* Performance KPIs */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Satisfacción</span>
                      <span className={`font-bold ${getKPIColor(gameState.satisfaction)}`}>
                        {gameState.satisfaction}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.satisfaction}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Reputación</span>
                      <span className={`font-bold ${getKPIColor(gameState.reputation)}`}>
                        {gameState.reputation}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.reputation}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Eficiencia</span>
                      <span className={`font-bold ${getKPIColor(gameState.efficiency)}`}>
                        {gameState.efficiency}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${gameState.efficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Turn History */}
          <div className="bg-white rounded-xl p-6 shadow-xl max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Historial</h3>
            <div className="space-y-2">
              {turnHistory.slice(-5).map((state, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Turno {state.turn}</span>
                  <span className={`text-sm font-bold ${
                    (state.revenue - state.costs) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(state.revenue - state.costs)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 