'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  AcademicCapIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface ArgumentNode {
  id: string
  type: 'claim' | 'evidence' | 'warrant' | 'counterargument' | 'rebuttal'
  content: string
  position: { x: number; y: number }
  isCorrect?: boolean
  category: string
  strength: 'weak' | 'medium' | 'strong'
}

interface Connection {
  id: string
  fromNodeId: string
  toNodeId: string
  type: 'supports' | 'refutes' | 'leads_to' | 'caused_by'
  isCorrect?: boolean
  strength: number
}

interface ArgumentMapChallenge {
  id: string
  title: string
  description: string
  context: string
  mainClaim: string
  nodes: ArgumentNode[]
  correctConnections: Connection[]
  timeLimit: number
  hints: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  bloomLevel: 'Analizar' | 'Evaluar' | 'Crear'
  points: number
}

interface ArgumentMapProps {
  challenge: ArgumentMapChallenge
  onComplete: (result: { 
    score: number
    correctConnections: number
    totalConnections: number
    timeSpent: number
    accuracy: number
  }) => void
  onExit: () => void
  enableHints?: boolean
}

export function ArgumentMap({ 
  challenge,
  onComplete, 
  onExit,
  enableHints = true 
}: ArgumentMapProps) {
  const [nodes, setNodes] = useState<ArgumentNode[]>(challenge.nodes)
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<ArgumentNode | null>(null)
  const [connectionMode, setConnectionMode] = useState<Connection['type'] | null>(null)
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [timeSpent, setTimeSpent] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (gameEnded) return

    const timer = setInterval(() => {
      setTimeSpent(prev => {
        const newTime = prev + 1
        if (newTime >= challenge.timeLimit) {
          handleTimeOut()
          return prev
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameEnded, challenge.timeLimit])

  const handleNodeClick = (node: ArgumentNode) => {
    if (connectionMode && selectedNode && selectedNode.id !== node.id) {
      // Create connection
      const newConnection: Connection = {
        id: `${selectedNode.id}-${node.id}-${Date.now()}`,
        fromNodeId: selectedNode.id,
        toNodeId: node.id,
        type: connectionMode,
        strength: 1
      }
      
      setConnections(prev => [...prev, newConnection])
      setSelectedNode(null)
      setConnectionMode(null)
    } else {
      setSelectedNode(selectedNode?.id === node.id ? null : node)
    }
  }

  const removeConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId))
  }

  const checkArgument = () => {
    const correctCount = connections.filter(userConnection => {
      return challenge.correctConnections.some(correctConnection => 
        correctConnection.fromNodeId === userConnection.fromNodeId &&
        correctConnection.toNodeId === userConnection.toNodeId &&
        correctConnection.type === userConnection.type
      )
    }).length

    const accuracy = connections.length > 0 ? (correctCount / connections.length) * 100 : 0
    const score = calculateScore(correctCount, accuracy)

    setGameEnded(true)
    onComplete({
      score,
      correctConnections: correctCount,
      totalConnections: connections.length,
      timeSpent,
      accuracy
    })
  }

  const handleTimeOut = () => {
    setGameEnded(true)
    onComplete({
      score: 0,
      correctConnections: 0,
      totalConnections: connections.length,
      timeSpent: challenge.timeLimit,
      accuracy: 0
    })
  }

  const calculateScore = (correctCount: number, accuracy: number): number => {
    const baseScore = challenge.points
    const connectionBonus = correctCount * 50
    const accuracyBonus = accuracy * 10
    const timeBonus = Math.max(0, challenge.timeLimit - timeSpent)
    const hintsBonus = Math.max(0, (challenge.hints.length - hintsUsed) * 30)
    
    return Math.round(baseScore + connectionBonus + accuracyBonus + timeBonus + hintsBonus)
  }

  const showNextHint = () => {
    if (hintsUsed < challenge.hints.length) {
      setCurrentHint(challenge.hints[hintsUsed])
      setHintsUsed(prev => prev + 1)
      setShowHint(true)
      setTimeout(() => setShowHint(false), 6000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'claim': return 'bg-blue-500'
      case 'evidence': return 'bg-green-500'
      case 'warrant': return 'bg-yellow-500'
      case 'counterargument': return 'bg-red-500'
      case 'rebuttal': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'supports': return 'stroke-green-500'
      case 'refutes': return 'stroke-red-500'
      case 'leads_to': return 'stroke-blue-500'
      case 'caused_by': return 'stroke-orange-500'
      default: return 'stroke-gray-500'
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  if (gameEnded) {
    const correctCount = connections.filter(userConnection => {
      return challenge.correctConnections.some(correctConnection => 
        correctConnection.fromNodeId === userConnection.fromNodeId &&
        correctConnection.toNodeId === userConnection.toNodeId &&
        correctConnection.type === userConnection.type
      )
    }).length

    const accuracy = connections.length > 0 ? (correctCount / connections.length) * 100 : 0

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Mapa de Argumentos Completado!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{calculateScore(correctCount, accuracy)}</div>
              <div className="text-sm text-blue-800">Puntos Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{correctCount}/{challenge.correctConnections.length}</div>
              <div className="text-sm text-green-800">Conexiones Correctas</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{Math.round(accuracy)}%</div>
              <div className="text-sm text-purple-800">Precisión</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={onExit} className="w-full">
              Finalizar Mapa
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
              <LinkIcon className="h-8 w-8 text-white" />
              <div className="text-white">
                <h1 className="text-xl font-bold">{challenge.title}</h1>
                <div className="text-sm opacity-90">
                  {challenge.difficulty} • {challenge.subject} • {challenge.bloomLevel}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <div className="text-sm opacity-90">Tiempo restante</div>
                <div className="font-mono text-lg text-yellow-300">
                  {formatTime(challenge.timeLimit - timeSpent)}
                </div>
              </div>
              
              {enableHints && hintsUsed < challenge.hints.length && (
                <Button 
                  onClick={showNextHint}
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                >
                  💡 Pista ({challenge.hints.length - hintsUsed})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hint Display */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-yellow-400 text-yellow-900 p-4 mx-4 mt-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center">
              <span className="mr-2">💡</span>
              <span className="font-medium">Pista: {currentHint}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6">
        {/* Challenge Description */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center mb-4">
            <AcademicCapIcon className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Desafío: Mapeo de Argumentos</h2>
          </div>
          
          <p className="text-gray-700 mb-4">{challenge.description}</p>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-purple-900 mb-2">Contexto:</h3>
            <p className="text-purple-800 text-sm">{challenge.context}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Afirmación Principal:</h3>
            <p className="text-blue-800 font-medium">{challenge.mainClaim}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Herramientas</h3>
            
            {/* Zoom Controls */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Zoom</h4>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                  variant="outline"
                  size="sm"
                >
                  <MagnifyingGlassMinusIcon className="h-4 w-4" />
                </Button>
                <span className="flex items-center px-2 text-sm font-mono">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                  variant="outline"
                  size="sm"
                >
                  <MagnifyingGlassPlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Connection Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Tipo de Conexión</h4>
              <div className="space-y-2">
                {[
                  { type: 'supports', label: 'Apoya', color: 'green' },
                  { type: 'refutes', label: 'Refuta', color: 'red' },
                  { type: 'leads_to', label: 'Lleva a', color: 'blue' },
                  { type: 'caused_by', label: 'Causado por', color: 'orange' }
                ].map(({ type, label, color }) => (
                  <button
                    key={type}
                    onClick={() => setConnectionMode(connectionMode === type ? null : type as Connection['type'])}
                    className={`w-full p-2 text-left rounded border transition-all ${
                      connectionMode === type
                        ? `border-${color}-500 bg-${color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-${color}-500 inline-block mr-2`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-sm text-gray-600 space-y-2">
              <p>1. Selecciona un tipo de conexión</p>
              <p>2. Haz clic en el nodo origen</p>
              <p>3. Haz clic en el nodo destino</p>
              <p>4. Arrastra para mover la vista</p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={checkArgument}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              Verificar Argumentos ({connections.length})
            </Button>
          </div>

          {/* Argument Map Canvas */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="h-96 lg:h-[600px] relative bg-gray-50">
              <svg
                className="absolute inset-0 w-full h-full cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Render connections */}
                {connections.map((connection) => {
                  const fromNode = nodes.find(n => n.id === connection.fromNodeId)
                  const toNode = nodes.find(n => n.id === connection.toNodeId)
                  
                  if (!fromNode || !toNode) return null
                  
                  const fromX = (fromNode.position.x + panOffset.x) * zoom + 50
                  const fromY = (fromNode.position.y + panOffset.y) * zoom + 25
                  const toX = (toNode.position.x + panOffset.x) * zoom + 50
                  const toY = (toNode.position.y + panOffset.y) * zoom + 25
                  
                  return (
                    <g key={connection.id}>
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        className={`${getConnectionColor(connection.type)} stroke-2`}
                        markerEnd="url(#arrowhead)"
                      />
                      {/* Connection label */}
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 5}
                        className="text-xs fill-gray-600 text-center"
                        textAnchor="middle"
                      >
                        {connection.type.replace('_', ' ')}
                      </text>
                      {/* Remove button */}
                      <circle
                        cx={(fromX + toX) / 2}
                        cy={(fromY + toY) / 2 + 10}
                        r="8"
                        className="fill-red-500 cursor-pointer hover:fill-red-600"
                        onClick={() => removeConnection(connection.id)}
                      />
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 + 14}
                        className="text-xs fill-white cursor-pointer"
                        textAnchor="middle"
                        onClick={() => removeConnection(connection.id)}
                      >
                        ×
                      </text>
                    </g>
                  )
                })}
                
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      className="fill-gray-600"
                    />
                  </marker>
                </defs>
              </svg>

              {/* Render nodes */}
              {nodes.map((node) => (
                <motion.div
                  key={node.id}
                  className={`absolute cursor-pointer ${getNodeColor(node.type)} text-white rounded-lg p-3 shadow-lg transform transition-all ${
                    selectedNode?.id === node.id ? 'ring-4 ring-yellow-400 scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    left: (node.position.x + panOffset.x) * zoom,
                    top: (node.position.y + panOffset.y) * zoom,
                    width: 120 * zoom,
                    fontSize: `${14 * zoom}px`
                  }}
                  onClick={() => handleNodeClick(node)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
                    {node.type}
                  </div>
                  <div className="font-medium text-sm leading-tight">
                    {node.content}
                  </div>
                  <div className="text-xs mt-1 opacity-75">
                    {node.category}
                  </div>
                </motion.div>
              ))}

              {/* Instructions overlay */}
              {connectionMode && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
                  <div className="text-sm font-medium">
                    Modo: {connectionMode.replace('_', ' ')}
                  </div>
                  <div className="text-xs mt-1">
                    {selectedNode ? 'Selecciona el nodo destino' : 'Selecciona el nodo origen'}
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