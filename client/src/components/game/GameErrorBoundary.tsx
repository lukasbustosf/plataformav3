'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface Props {
  children: ReactNode
  gameFormat?: string
  sessionId?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onRetry?: () => void
  onNavigateHome?: () => void
  fallbackComponent?: React.ComponentType<any>
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
  retryCount: number
  showDetails: boolean
}

interface ErrorReport {
  timestamp: string
  errorId: string
  gameFormat?: string
  sessionId?: string
  error: {
    name: string
    message: string
    stack?: string
  }
  errorInfo: {
    componentStack: string
  }
  userAgent: string
  url: string
  retryCount: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  context: any
}

export class GameErrorBoundary extends Component<Props, State> {
  private maxRetries = 3
  private errorReportingEnabled = process.env.NODE_ENV === 'production'

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
      retryCount: 0,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: new Date().getTime().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game Error Boundary caught an error:', {
      error,
      errorInfo,
      gameFormat: this.props.gameFormat,
      sessionId: this.props.sessionId,
      errorId: this.state.errorId
    })

    this.setState({
      error,
      errorInfo
    })

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error for analytics and monitoring
    this.logError(error, errorInfo)
  }

  private generateErrorId(): string {
    return new Date().getTime().toString(36) + Math.random().toString(36).substr(2)
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    const severity = this.getErrorSeverity()
    const context = this.gatherErrorContext()
    
    const errorReport: ErrorReport = {
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      gameFormat: this.props.gameFormat,
      sessionId: this.props.sessionId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack || 'No component stack available'
      },
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      retryCount: this.state.retryCount,
      severity,
      context
    }

    // Console logging for development
    console.error('Game Error Report:', errorReport)

    // Send to error tracking service in production
    if (this.errorReportingEnabled) {
      this.sendErrorReport(errorReport)
    }

    // Store locally for debugging
    this.storeErrorLocally(errorReport)
  }

  private gatherErrorContext(): any {
    const context: any = {}
    
    try {
      // Gather browser and environment info
      if (typeof window !== 'undefined') {
        context.viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        }
        context.screen = {
          width: window.screen.width,
          height: window.screen.height,
          orientation: window.screen.orientation?.type
        }
        context.connection = (navigator as any)?.connection ? {
          effectiveType: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
          rtt: (navigator as any).connection.rtt
        } : null
        context.memory = (performance as any)?.memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
        } : null
      }

      // Game-specific context
      if (this.props.gameFormat) {
        context.gameFormat = this.props.gameFormat
        context.gameCategory = this.getGameCategory(this.props.gameFormat)
      }

      // Session context
      if (this.props.sessionId) {
        context.sessionId = this.props.sessionId
      }
    } catch (contextError) {
      context.contextGatheringError = contextError instanceof Error ? contextError.message : 'Unknown context error'
    }

    return context
  }

  private sendErrorReport(errorReport: ErrorReport) {
    // In production, send to error tracking service
    // This would be integrated with services like Sentry, LogRocket, etc.
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport)
      }).catch(err => {
        console.warn('Failed to send error report:', err)
      })
    } catch (err) {
      console.warn('Error reporting failed:', err)
    }
  }

  private storeErrorLocally(errorReport: ErrorReport) {
    try {
      const existingErrors = JSON.parse(localStorage.getItem('game_errors') || '[]')
      existingErrors.push(errorReport)
      
      // Keep only last 10 errors to prevent storage bloat
      const recentErrors = existingErrors.slice(-10)
      localStorage.setItem('game_errors', JSON.stringify(recentErrors))
    } catch (err) {
      console.warn('Failed to store error locally:', err)
    }
  }

  private handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      console.warn('Max retry attempts reached for game error')
      return
    }

    const newRetryCount = this.state.retryCount + 1
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId(),
      retryCount: newRetryCount,
      showDetails: false
    })

    // Call optional retry handler
    if (this.props.onRetry) {
      this.props.onRetry()
    }

    // Log retry attempt
    console.info(`Game error recovery attempt ${newRetryCount}/${this.maxRetries}`)
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private handleNavigateHome = () => {
    if (this.props.onNavigateHome) {
      this.props.onNavigateHome()
    } else if (typeof window !== 'undefined') {
      window.location.href = '/student/games'
    }
  }

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  private getErrorSeverity(): 'low' | 'medium' | 'high' | 'critical' {
    const { error } = this.state
    
    if (!error) return 'low'

    // Critical errors that affect core functionality
    if (error.name === 'ChunkLoadError' || 
        error.message.includes('Loading chunk') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')) {
      return 'critical'
    }

    // High severity errors
    if (error.name === 'TypeError' && 
        (error.message.includes('Cannot read') || 
         error.message.includes('Cannot access') ||
         error.message.includes('is not a function'))) {
      return 'high'
    }

    // Medium severity errors
    if (error.name === 'ReferenceError' || 
        error.name === 'SyntaxError' ||
        error.name === 'RangeError') {
      return 'medium'
    }

    return 'low'
  }

  private getGameCategory(gameFormat: string): string {
    const gameCategories: { [key: string]: string } = {
      // Basic games (G-01 to G-09)
      'trivia_lightning': 'basic',
      'color_match': 'basic',
      'memory_flip': 'basic',
      'picture_bingo': 'basic',
      'drag_drop_sorting': 'basic',
      'number_line_race': 'basic',
      'word_builder': 'basic',
      'word_search': 'basic',
      'hangman_visual': 'basic',
      
      // Advanced games (G-10 to G-16)
      'escape_room_mini': 'advanced',
      'story_path': 'advanced',
      'board_race': 'advanced',
      'crossword': 'advanced',
      'word_search_duel': 'advanced',
      'timed_equation_duel': 'advanced',
      'mystery_box_reveal': 'advanced',
      
      // Expert games (G-17 to G-24)
      'debate_cards': 'expert',
      'simulation_tycoon': 'expert',
      'case_study_sprint': 'expert',
      'coding_puzzle': 'expert',
      'data_lab': 'expert',
      'timeline_builder': 'expert',
      'argument_map': 'expert',
      'advanced_escape_room': 'expert'
    }
    
    return gameCategories[gameFormat] || 'unknown'
  }

  private getErrorMessage(): string {
    const severity = this.getErrorSeverity()
    const { gameFormat } = this.props
    const gameCategory = gameFormat ? this.getGameCategory(gameFormat) : null

    const gameDisplayName = gameFormat ? this.getGameDisplayName(gameFormat) : 'el juego'

    switch (severity) {
      case 'critical':
        return `Parece que hay un problema con la conexión o carga de ${gameDisplayName}. Por favor, verifica tu conexión a internet y recarga la página.`
      case 'high':
        return `Ocurrió un error inesperado en ${gameDisplayName}. Esto puede ser un problema temporal del navegador.`
      case 'medium':
        return `Hubo un problema técnico menor con ${gameDisplayName}. Puedes intentar nuevamente o cambiar de juego.`
      default:
        return `Algo salió mal con ${gameDisplayName}, pero debería ser fácil de resolver. Intenta nuevamente.`
    }
  }

  private getGameDisplayName(gameFormat: string): string {
    const gameNames: { [key: string]: string } = {
      'trivia_lightning': 'Trivia Lightning',
      'color_match': 'Color Match',
      'memory_flip': 'Memory Flip',
      'picture_bingo': 'Picture Bingo',
      'drag_drop_sorting': 'Drag & Drop Sorting',
      'number_line_race': 'Número-Línea Race',
      'word_builder': 'Word Builder',
      'word_search': 'Sopa de Letras',
      'hangman_visual': 'Hangman Visual',
      'escape_room_mini': 'Escape Room Mini',
      'story_path': 'Story Path',
      'board_race': 'Board Race',
      'crossword': 'Crossword',
      'word_search_duel': 'Word Search Duel',
      'timed_equation_duel': 'Timed Equation Duel',
      'mystery_box_reveal': 'Mystery Box Reveal',
      'debate_cards': 'Debate Cards',
      'simulation_tycoon': 'Simulation Tycoon',
      'case_study_sprint': 'Case Study Sprint',
      'coding_puzzle': 'Coding Puzzle',
      'data_lab': 'Data Lab',
      'timeline_builder': 'Timeline Builder',
      'argument_map': 'Argument Map',
      'advanced_escape_room': 'Advanced Escape Room'
    }
    
    return gameNames[gameFormat] || gameFormat
  }

  private getRecoveryOptions(): Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary' | 'outline'
    icon?: React.ComponentType<any>
    disabled?: boolean
  }> {
    const severity = this.getErrorSeverity()
    const canRetry = this.state.retryCount < this.maxRetries
    const options = []

    // Primary recovery option
    if (canRetry && severity !== 'critical') {
      options.push({
        label: `Intentar Nuevamente ${this.state.retryCount > 0 ? `(${this.state.retryCount}/${this.maxRetries})` : ''}`,
        action: this.handleRetry,
        variant: 'primary' as const,
        icon: ArrowPathIcon
      })
    }

    // Reload page for critical errors or when retries exhausted
    if (severity === 'critical' || !canRetry) {
      options.push({
        label: 'Recargar Página',
        action: this.handleReload,
        variant: 'primary' as const,
        icon: ArrowPathIcon
      })
    }

    // Navigate to games list
    options.push({
      label: 'Volver a Juegos',
      action: this.handleNavigateHome,
      variant: 'outline' as const,
      icon: HomeIcon
    })

    return options
  }

  private getSeverityColor(severity: string): string {
    switch (severity) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-blue-600'
    }
  }

  private getSeverityBg(severity: string): string {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'high': return 'bg-orange-50 border-orange-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      default: return 'bg-blue-50 border-blue-200'
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    // If custom fallback component is provided
    if (this.props.fallbackComponent) {
      const FallbackComponent = this.props.fallbackComponent
      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />
    }

    const severity = this.getErrorSeverity()
    const errorMessage = this.getErrorMessage()
    const recoveryOptions = this.getRecoveryOptions()

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
          {/* Error Icon and Header */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${this.getSeverityBg(severity)}`}>
              <ExclamationTriangleIcon className={`h-8 w-8 ${this.getSeverityColor(severity)}`} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Oops! Algo salió mal
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              {errorMessage}
            </p>
          </div>

          {/* Error Details Toggle */}
          <div className="mb-6">
            <Button
              onClick={this.toggleDetails}
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center space-x-2"
            >
              <InformationCircleIcon className="h-4 w-4" />
              <span>
                {this.state.showDetails ? 'Ocultar' : 'Ver'} Detalles Técnicos
              </span>
            </Button>

            {this.state.showDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700">
                <div className="space-y-2">
                  <div><strong>Error ID:</strong> {this.state.errorId}</div>
                  <div><strong>Severidad:</strong> {severity.toUpperCase()}</div>
                  {this.props.gameFormat && (
                    <div><strong>Juego:</strong> {this.getGameDisplayName(this.props.gameFormat)}</div>
                  )}
                  {this.props.sessionId && (
                    <div><strong>Sesión:</strong> {this.props.sessionId}</div>
                  )}
                  <div><strong>Tipo:</strong> {this.state.error?.name}</div>
                  <div><strong>Mensaje:</strong> {this.state.error?.message}</div>
                  <div><strong>Intentos:</strong> {this.state.retryCount}/{this.maxRetries}</div>
                </div>
              </div>
            )}
          </div>

          {/* Recovery Options */}
          <div className="space-y-3">
            {recoveryOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <Button
                  key={index}
                  onClick={option.action}
                  variant={option.variant}
                  disabled={option.disabled}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                  <span>{option.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Si el problema persiste, contacta al soporte técnico con el ID: <code className="font-mono bg-gray-100 px-1 rounded">{this.state.errorId}</code>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

// Higher-order component to wrap games with error boundaries
export function withGameErrorBoundary<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  gameFormat?: string
) {
  const WithErrorBoundaryComponent = (props: T & { sessionId?: string; onNavigateHome?: () => void }) => {
    return (
      <GameErrorBoundary 
        gameFormat={gameFormat}
        sessionId={props.sessionId}
        onNavigateHome={props.onNavigateHome}
        onError={(error, errorInfo) => {
          console.error(`Error in ${gameFormat || 'unknown game'}:`, error, errorInfo)
        }}
      >
        <WrappedComponent {...props} />
      </GameErrorBoundary>
    )
  }

  WithErrorBoundaryComponent.displayName = `withGameErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`
  
  return WithErrorBoundaryComponent
}

export default GameErrorBoundary 