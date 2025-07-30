'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  SpeakerWaveIcon,
  ArrowRightIcon,
  FireIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface DebateCard {
  id: string
  position: 'favor' | 'contra'
  argument: string
  evidence: string
  strength: number
  points: number
  audio_url?: string
}

interface DebatePlayer {
  id: string
  name: string
  team: 'A' | 'B'
  score: number
  cardsPlayed: DebateCard[]
  isActive: boolean
}

interface DebateTopic {
  title: string
  description: string
  context: string
  cards: DebateCard[]
}

interface DebateCardsProps {
  topic: DebateTopic
  players: DebatePlayer[]
  rounds?: number
  timePerTurn?: number
  onComplete: (result: { winner: DebatePlayer; finalScores: DebatePlayer[]; totalRounds: number }) => void
  onExit: () => void
  enableAudio?: boolean
}

export function DebateCards({ 
  topic,
  players: initialPlayers,
  rounds = 6,
  timePerTurn = 120, // 2 minutes per turn
  onComplete, 
  onExit,
  enableAudio = true 
}: DebateCardsProps) {
  const [players, setPlayers] = useState<DebatePlayer[]>(initialPlayers)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [availableCards, setAvailableCards] = useState<DebateCard[]>(topic.cards)
  const [selectedCard, setSelectedCard] = useState<DebateCard | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(timePerTurn)
  const [gameEnded, setGameEnded] = useState(false)
  const [showCardResult, setShowCardResult] = useState(false)
  const [lastPlayedCard, setLastPlayedCard] = useState<DebateCard | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [teamPositions, setTeamPositions] = useState<{A: 'favor' | 'contra', B: 'favor' | 'contra'}>({
    A: 'favor',
    B: 'contra'
  })

  const currentPlayer = players[currentPlayerIndex]
  const currentTeamPosition = teamPositions[currentPlayer?.team || 'A']

  // Turn timer
  useEffect(() => {
    if (gameEnded || showCardResult) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeOut()
          return timePerTurn
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentPlayerIndex, gameEnded, showCardResult])

  // Check end conditions
  useEffect(() => {
    if (currentRound > rounds) {
      endGame()
    }
  }, [currentRound, rounds])

  const handleTimeOut = () => {
    // Auto-play a random valid card if time runs out
    const validCards = getValidCardsForPlayer(currentPlayer)
    if (validCards.length > 0) {
      const randomCard = validCards[Math.floor(Math.random() * validCards.length)]
      playCard(randomCard, true) // true indicates timeout
    } else {
      nextPlayer()
    }
  }

  const getValidCardsForPlayer = (player: DebatePlayer): DebateCard[] => {
    return availableCards.filter(card => card.position === teamPositions[player.team])
  }

  const playCard = (card: DebateCard, isTimeout = false) => {
    setSelectedCard(null)
    setLastPlayedCard(card)
    setShowCardResult(true)

    // Remove card from available cards
    setAvailableCards(prev => prev.filter(c => c.id !== card.id))

    // Calculate points (reduced if timeout)
    const points = isTimeout ? Math.floor(card.points * 0.5) : card.points

    // Update player stats
    setPlayers(prev => prev.map(p => {
      if (p.id === currentPlayer.id) {
        return {
          ...p,
          score: p.score + points,
          cardsPlayed: [...p.cardsPlayed, card]
        }
      }
      return p
    }))

    // Auto-advance after showing result
    setTimeout(() => {
      setShowCardResult(false)
      setLastPlayedCard(null)
      nextPlayer()
    }, 3000)
  }

  const nextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    setTimeRemaining(timePerTurn)
    
    // If we've gone through all players, increment round
    if (nextIndex === 0) {
      setCurrentRound(prev => prev + 1)
      
      // Optionally switch positions for variety
      if (currentRound % 3 === 0) {
        setTeamPositions(prev => ({
          A: prev.A === 'favor' ? 'contra' : 'favor',
          B: prev.B === 'favor' ? 'contra' : 'favor'
        }))
      }
    }
  }

  const endGame = () => {
    setGameEnded(true)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    
    onComplete({
      winner: sortedPlayers[0],
      finalScores: sortedPlayers,
      totalRounds: currentRound - 1
    })
  }

  const playAudio = (card: DebateCard) => {
    if (!enableAudio || !card.audio_url) return
    
    setIsPlaying(true)
    const audio = new Audio(card.audio_url)
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
    audio.play().catch(() => setIsPlaying(false))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTeamScore = (team: 'A' | 'B') => {
    return players
      .filter(p => p.team === team)
      .reduce((sum, p) => sum + p.score, 0)
  }

  if (gameEnded) {
    const teamAScore = getTeamScore('A')
    const teamBScore = getTeamScore('B')
    const winningTeam = teamAScore > teamBScore ? 'A' : 'B'

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full text-center">
          <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Debate Finalizado!
          </h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Resultado del Debate</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${winningTeam === 'A' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}>
                <h4 className="font-bold text-lg mb-2">Equipo A (A Favor)</h4>
                <div className="text-2xl font-bold text-blue-600">{teamAScore} pts</div>
                {winningTeam === 'A' && <div className="text-yellow-600 mt-2">🏆 Ganador</div>}
              </div>
              
              <div className={`p-4 rounded-lg ${winningTeam === 'B' ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}`}>
                <h4 className="font-bold text-lg mb-2">Equipo B (En Contra)</h4>
                <div className="text-2xl font-bold text-purple-600">{teamBScore} pts</div>
                {winningTeam === 'B' && <div className="text-yellow-600 mt-2">🏆 Ganador</div>}
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900">Puntuaciones Individuales:</h4>
            {players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">
                      {player.name} (Equipo {player.team})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{player.score} pts</div>
                    <div className="text-sm text-gray-600">{player.cardsPlayed.length} cartas</div>
                  </div>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{currentRound - 1}</div>
              <div className="text-sm text-blue-800">Rondas Completadas</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{topic.cards.length - availableCards.length}</div>
              <div className="text-sm text-green-800">Cartas Jugadas</div>
            </div>
          </div>

          <Button onClick={onExit} className="w-full">
            Finalizar Debate
          </Button>
        </div>
      </motion.div>
    )
  }

  const validCards = getValidCardsForPlayer(currentPlayer)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-xl font-bold">{topic.title}</h1>
              <div className="text-sm opacity-90">
                Ronda {currentRound}/{rounds} • Turno de {currentPlayer?.name} (Equipo {currentPlayer?.team})
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-white text-center">
              <ClockIcon className="h-5 w-5 mx-auto mb-1" />
              <div className="text-lg font-bold">{formatTime(timeRemaining)}</div>
            </div>
            
            <Button onClick={onExit} variant="outline" size="sm">
              Salir
            </Button>
          </div>
        </div>

        {/* Turn Progress */}
        <div className="mt-4">
          <div className="bg-white bg-opacity-20 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-red-400 to-yellow-400 h-2 rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeRemaining / timePerTurn) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Debate Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Topic Context */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contexto del Debate</h2>
            <p className="text-gray-700 mb-4">{topic.description}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">{topic.context}</p>
            </div>
          </div>

          {/* Card Result Display */}
          <AnimatePresence>
            {showCardResult && lastPlayedCard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-6 shadow-2xl border-2 border-blue-300"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentPlayer.name} jugó:
                  </h3>
                </div>
                
                <div className={`p-6 rounded-lg border-2 ${
                  lastPlayedCard.position === 'favor' 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      lastPlayedCard.position === 'favor' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {lastPlayedCard.position === 'favor' ? 'A FAVOR' : 'EN CONTRA'}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      +{lastPlayedCard.points} pts
                    </span>
                  </div>
                  
                  <p className="text-gray-900 font-medium mb-2">{lastPlayedCard.argument}</p>
                  <p className="text-gray-700 text-sm">{lastPlayedCard.evidence}</p>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Fuerza del argumento:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < lastPlayedCard.strength ? 'bg-yellow-400' : 'bg-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Selection */}
          {!showCardResult && (
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Elige tu carta ({currentTeamPosition === 'favor' ? 'A Favor' : 'En Contra'})
                </h3>
                <span className="text-sm text-gray-600">
                  {validCards.length} cartas disponibles
                </span>
              </div>
              
              {validCards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No hay cartas disponibles para tu posición</p>
                  <Button onClick={() => nextPlayer()} variant="outline">
                    Pasar Turno
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {validCards.map((card) => (
                    <motion.div
                      key={card.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCard?.id === card.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCard(card)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          card.position === 'favor' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {card.position === 'favor' ? 'FAVOR' : 'CONTRA'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-600 font-bold">{card.points} pts</span>
                          {enableAudio && card.audio_url && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                playAudio(card)
                              }}
                              disabled={isPlaying}
                              variant="outline"
                              size="sm"
                            >
                              <SpeakerWaveIcon className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-900 font-medium text-sm mb-2">{card.argument}</p>
                      <p className="text-gray-600 text-xs mb-3">{card.evidence}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < card.strength ? 'bg-yellow-400' : 'bg-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        
                        {selectedCard?.id === card.id && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              playCard(card)
                            }}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Jugar Carta
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Score Panel */}
        <div className="space-y-6">
          {/* Team Scores */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Puntuaciones por Equipo
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-green-900">Equipo A</span>
                    <div className="text-xs text-green-700">
                      Posición: {teamPositions.A === 'favor' ? 'A Favor' : 'En Contra'}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{getTeamScore('A')}</span>
                </div>
              </div>
              
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-red-900">Equipo B</span>
                    <div className="text-xs text-red-700">
                      Posición: {teamPositions.B === 'favor' ? 'A Favor' : 'En Contra'}
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{getTeamScore('B')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Scores */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Jugadores</h3>
            
            <div className="space-y-3">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className={`p-3 rounded-lg border-2 transition-all ${
                    player.id === currentPlayer?.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <div className="text-xs text-gray-600">
                        Equipo {player.team} • {player.cardsPlayed.length} cartas
                      </div>
                    </div>
                    <span className="font-bold text-blue-600">{player.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ronda Actual:</span>
                <span className="font-bold">{currentRound}/{rounds}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Cartas Restantes:</span>
                <span className="font-bold">{availableCards.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Turno de:</span>
                <span className="font-bold text-blue-600">{currentPlayer?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 