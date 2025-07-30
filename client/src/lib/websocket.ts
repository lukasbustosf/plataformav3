import { io, Socket } from 'socket.io-client'
import { getStorageItem } from './utils'
import type { 
  GameSession, 
  GameParticipant, 
  Question, 
  WSGameJoin, 
  WSGameStart, 
  WSGameAnswer, 
  WSGameLeaderboard, 
  WSGameEnd 
} from '@/types'

// Deshabilitar WebSocket en desarrollo
const DISABLE_WEBSOCKET = process.env.NODE_ENV === 'development'

class WebSocketService {
  private socket: Socket | null = null
  private isConnected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private eventListeners: Map<string, Function[]> = new Map()
  private healthCheckInterval: NodeJS.Timeout | null = null
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected'

  constructor() {
    if (!DISABLE_WEBSOCKET) {
      this.connect()
    } else {
      console.log('WebSocket deshabilitado en modo desarrollo')
      this.isConnected = false
      this.connectionState = 'disconnected'
    }
  }

  private connect() {
    if (DISABLE_WEBSOCKET) {
      console.log('WebSocket connection skipped - disabled in development')
      return
    }

    try {
      const token = getStorageItem('auth_token', null)
      
      this.connectionState = 'connecting'
      this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:5000', {
        auth: {
          token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        forceNew: false,
        autoConnect: true
      })

      this.setupEventListeners()
      this.startHealthCheck()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.connectionState = 'error'
    }
  }

  private setupEventListeners() {
    if (!this.socket || DISABLE_WEBSOCKET) return

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id)
      this.isConnected = true
      this.connectionState = 'connected'
      this.reconnectAttempts = 0
      this.emit('connected', { 
        timestamp: new Date().toISOString(),
        socketId: this.socket?.id 
      })
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      this.isConnected = false
      this.connectionState = 'disconnected'
      this.emit('disconnected', { reason })
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.reconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.isConnected = false
      this.connectionState = 'error'
      this.emit('connectionError', { error: error.message })
      this.reconnect()
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
      this.emit('socketError', { error: error.message })
    })

    // Enhanced game-specific events with proper error handling
    this.socket.on('game:joined', (data) => {
      console.log('Game joined:', data)
      this.emit('gameJoined', data)
    })

    this.socket.on('game:reconnected', (data) => {
      console.log('Game reconnected:', data)
      this.emit('gameReconnected', data)
    })

    this.socket.on('game:error', (data) => {
      console.error('Game error:', data)
      this.emit('gameError', data)
    })

    this.socket.on('game:warning', (data) => {
      console.warn('Game warning:', data)
      this.emit('gameWarning', data)
    })

    this.socket.on('game:participant_updated', (data) => {
      this.emit('participantUpdated', data)
    })

    this.socket.on('game:participant_left', (data) => {
      this.emit('participantLeft', data)
    })

    this.socket.on('game:participant_disconnected', (data) => {
      this.emit('participantDisconnected', data)
    })

    this.socket.on('game:participant_answered', (data) => {
      this.emit('participantAnswered', data)
    })

    this.socket.on('game:started', (data) => {
      console.log('Game started:', data)
      this.emit('gameStarted', data)
    })

    this.socket.on('game:question', (data) => {
      console.log('New question:', data)
      this.emit('gameQuestion', data)
    })

    this.socket.on('game:answer_recorded', (data) => {
      this.emit('answerRecorded', data)
    })

    this.socket.on('game:leaderboard', (data) => {
      this.emit('gameLeaderboard', data)
    })

    this.socket.on('game:ended', (data) => {
      console.log('Game ended:', data)
      this.emit('gameEnded', data)
    })

    this.socket.on('game:paused', (data) => {
      this.emit('gamePaused', data)
    })

    this.socket.on('game:resumed', (data) => {
      this.emit('gameResumed', data)
    })

    this.socket.on('game:state_sync', (data) => {
      this.emit('gameStateSync', data)
    })

    this.socket.on('game:host_message', (data) => {
      this.emit('hostMessage', data)
    })

    this.socket.on('game:time_update', (data) => {
      this.emit('timeUpdate', data)
    })

    this.socket.on('game:realtime_event', (data) => {
      this.emit('realtimeEvent', data)
    })

    // Handle pong for health checks
    this.socket.on('pong', (data) => {
      this.emit('pong', data)
    })
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      this.connectionState = 'error'
      this.emit('maxReconnectAttemptsReached', {})
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      if (this.socket) {
        this.socket.connect()
      }
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  private startHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }

    this.healthCheckInterval = setInterval(() => {
      if (this.isConnected && this.socket) {
        this.socket.emit('ping')
      }
    }, 30000) // Health check every 30 seconds
  }

  // Enhanced event management
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback?: Function) {
    if (!this.eventListeners.has(event)) return

    if (callback) {
      const listeners = this.eventListeners.get(event)!
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    } else {
      this.eventListeners.delete(event)
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || []
    listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error)
      }
    })
  }

  // Game-specific methods with enhanced error handling and validation
  joinGame(sessionId: string, userId: string): Promise<boolean> {
    if (DISABLE_WEBSOCKET) {
      console.log('WebSocket disabled - simulating successful game join for:', sessionId)
      return Promise.resolve(true)
    }

    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'))
        return
      }

      if (!sessionId || !userId) {
        reject(new Error('Session ID and User ID are required'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Join game timeout'))
      }, 10000)

      const onJoined = () => {
        clearTimeout(timeout)
        this.off('gameJoined', onJoined)
        this.off('gameError', onError)
        resolve(true)
      }

      const onError = (error: any) => {
        clearTimeout(timeout)
        this.off('gameJoined', onJoined)
        this.off('gameError', onError)
        reject(new Error(error.message || 'Failed to join game'))
      }

      this.on('gameJoined', onJoined)
      this.on('gameError', onError)

      this.socket.emit('game:join', { session_id: sessionId, user_id: userId })
    })
  }

  leaveGame(sessionId: string, userId: string) {
    if (!this.socket || !sessionId || !userId) return

    this.socket.emit('game:leave', {
      session_id: sessionId,
      user_id: userId
    })
  }

  startGame(sessionId: string): Promise<boolean> {
    if (DISABLE_WEBSOCKET) {
      console.log('WebSocket disabled - simulating successful game start for:', sessionId)
      return Promise.resolve(true)
    }

    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Start game timeout'))
      }, 15000)

      const onStarted = () => {
        clearTimeout(timeout)
        this.off('gameStarted', onStarted)
        this.off('gameError', onError)
        resolve(true)
      }

      const onError = (error: any) => {
        clearTimeout(timeout)
        this.off('gameStarted', onStarted)
        this.off('gameError', onError)
        reject(new Error(error.message || 'Failed to start game'))
      }

      this.on('gameStarted', onStarted)
      this.on('gameError', onError)

      this.socket.emit('game:start', { session_id: sessionId })
    })
  }

  submitAnswer(
    sessionId: string, 
    questionId: string, 
    answer: string | number | any[], 
    timeTaken: number,
    additionalData?: any
  ): Promise<boolean> {
    if (DISABLE_WEBSOCKET) {
      console.log('WebSocket disabled - simulating successful answer submission for:', questionId)
      return Promise.resolve(true)
    }

    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error('Submit answer timeout'))
      }, 10000)

      const onRecorded = () => {
        clearTimeout(timeout)
        this.off('answerRecorded', onRecorded)
        this.off('gameError', onError)
        resolve(true)
      }

      const onError = (error: any) => {
        clearTimeout(timeout)
        this.off('answerRecorded', onRecorded)
        this.off('gameError', onError)
        reject(new Error(error.message || 'Failed to submit answer'))
      }

      this.on('answerRecorded', onRecorded)
      this.on('gameError', onError)

      this.socket.emit('game:answer', {
        session_id: sessionId,
        question_id: questionId,
        answer,
        time_taken: timeTaken,
        additional_data: additionalData
      })
    })
  }

  // Game action methods
  performGameAction(sessionId: string, action: string, payload?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket not connected'))
        return
      }

      const timeout = setTimeout(() => {
        reject(new Error(`Game action ${action} timeout`))
      }, 10000)

      const onSuccess = () => {
        clearTimeout(timeout)
        resolve(true)
      }

      const onError = (error: any) => {
        clearTimeout(timeout)
        reject(new Error(error.message || `Failed to perform ${action}`))
      }

      // Set up listeners based on action type
      setTimeout(onSuccess, 1000) // Most actions don't have specific success events

      this.on('gameError', onError)

      this.socket.emit('game:action', {
        session_id: sessionId,
        action,
        payload
      })
    })
  }

  pauseGame(sessionId: string) {
    return this.performGameAction(sessionId, 'pause')
  }

  resumeGame(sessionId: string) {
    return this.performGameAction(sessionId, 'resume')
  }

  skipQuestion(sessionId: string) {
    return this.performGameAction(sessionId, 'skip_question')
  }

  endGame(sessionId: string) {
    return this.performGameAction(sessionId, 'end_game')
  }

  requestHint(sessionId: string, hintType?: string) {
    return this.performGameAction(sessionId, 'hint_request', { hintType })
  }

  // Real-time event broadcasting
  broadcastRealtimeEvent(sessionId: string, eventType: string, eventData: any) {
    if (!this.socket || !this.isConnected) return

    this.socket.emit('game:realtime', {
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData
    })
  }

  // Game-specific real-time methods
  sendGameSpecificData(sessionId: string, gameFormat: string, data: any) {
    this.broadcastRealtimeEvent(sessionId, `${gameFormat}_data`, data)
  }

  sendPlayerMovement(sessionId: string, position: any) {
    this.broadcastRealtimeEvent(sessionId, 'player_movement', position)
  }

  sendChatMessage(sessionId: string, message: string) {
    this.broadcastRealtimeEvent(sessionId, 'chat_message', { message })
  }

  sendReaction(sessionId: string, reaction: string) {
    this.broadcastRealtimeEvent(sessionId, 'player_reaction', { reaction })
  }

  // Connection state methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  getConnectionState(): string {
    return this.connectionState
  }

  getSocketId(): string | undefined {
    return this.socket?.id
  }

  disconnect() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }

    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    
    this.isConnected = false
    this.connectionState = 'disconnected'
    this.eventListeners.clear()
  }

  reconnectManually() {
    this.reconnectAttempts = 0
    this.connect()
  }

  // Advanced connection methods
  waitForConnection(timeout = 10000): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve(true)
        return
      }

      const timeoutId = setTimeout(() => {
        this.off('connected', onConnected)
        reject(new Error('Connection timeout'))
      }, timeout)

      const onConnected = () => {
        clearTimeout(timeoutId)
        this.off('connected', onConnected)
        resolve(true)
      }

      this.on('connected', onConnected)
    })
  }

  // Health check and diagnostics
  performDiagnostics(): Promise<any> {
    return new Promise((resolve) => {
      const diagnostics = {
        isConnected: this.isConnected,
        connectionState: this.connectionState,
        socketId: this.socket?.id,
        reconnectAttempts: this.reconnectAttempts,
        eventListenerCount: this.eventListeners.size,
        timestamp: new Date().toISOString()
      }

      if (this.socket && this.isConnected) {
        const timeout = setTimeout(() => {
          resolve({ ...diagnostics, pingTest: 'timeout' })
        }, 5000)

        this.socket.emit('ping')
        
        const onPong = (data: any) => {
          clearTimeout(timeout)
          this.off('pong', onPong)
          resolve({ 
            ...diagnostics, 
            pingTest: 'success',
            serverTime: data.timestamp 
          })
        }

        this.on('pong', onPong)
      } else {
        resolve({ ...diagnostics, pingTest: 'not_connected' })
      }
    })
  }
}

// Singleton instance
const webSocketService = new WebSocketService()

export default webSocketService

// Hook for easy component usage
export const useWebSocket = () => {
  return webSocketService
}

// Game-specific hook with enhanced functionality - MODO DESARROLLO DESHABILITADO
export const useGameWebSocket = (sessionId: string) => {
  console.log('🔧 WebSocket hook llamado pero DESHABILITADO para desarrollo - Session:', sessionId)

  // Funciones dummy que no hacen nada pero mantienen la interfaz
  const joinGame = (userId: string) => {
    console.log('🔧 WebSocket.joinGame() llamado pero ignorado:', userId)
    return Promise.resolve(true)
  }

  const leaveGame = (userId: string) => {
    console.log('🔧 WebSocket.leaveGame() llamado pero ignorado:', userId)
  }

  const submitAnswer = (questionId: string, answer: string | number | any[], timeTaken: number, additionalData?: any) => {
    console.log('🔧 WebSocket.submitAnswer() llamado pero ignorado:', questionId, answer, timeTaken)
    return Promise.resolve(true)
  }

  const startGame = () => {
    console.log('🔧 WebSocket.startGame() llamado pero ignorado')
    return Promise.resolve(true)
  }

  const pauseGame = () => {
    console.log('🔧 WebSocket.pauseGame() llamado pero ignorado')
    return Promise.resolve(true)
  }

  const resumeGame = () => {
    console.log('🔧 WebSocket.resumeGame() llamado pero ignorado')
    return Promise.resolve(true)
  }

  const skipQuestion = () => {
    console.log('🔧 WebSocket.skipQuestion() llamado pero ignorado')
    return Promise.resolve(true)
  }

  const endGame = () => {
    console.log('🔧 WebSocket.endGame() llamado pero ignorado')
    return Promise.resolve(true)
  }

  const requestHint = (hintType?: string) => {
    console.log('🔧 WebSocket.requestHint() llamado pero ignorado:', hintType)
    return Promise.resolve(true)
  }

  const sendRealtimeEvent = (eventType: string, eventData: any) => {
    console.log('🔧 WebSocket.sendRealtimeEvent() llamado pero ignorado:', eventType, eventData)
  }

  const sendGameSpecific = (gameFormat: string, data: any) => {
    console.log('🔧 WebSocket.sendGameSpecific() llamado pero ignorado:', gameFormat, data)
  }

  const on = (event: string, callback: Function) => {
    console.log('🔧 WebSocket.on() llamado pero ignorado:', event)
  }

  const off = (event: string, callback?: Function) => {
    console.log('🔧 WebSocket.off() llamado pero ignorado:', event)
  }

  return {
    joinGame,
    leaveGame,
    submitAnswer,
    startGame,
    pauseGame,
    resumeGame,
    skipQuestion,
    endGame,
    requestHint,
    sendRealtimeEvent,
    sendGameSpecific,
    isConnected: false, // Siempre desconectado
    connectionState: 'disconnected',
    on,
    off
  }
} 