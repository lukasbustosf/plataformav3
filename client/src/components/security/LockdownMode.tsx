'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldExclamationIcon,
  LockClosedIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  SpeakerXMarkIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

interface LockdownConfig {
  evaluation_id: string
  lockdown_level: 'basic' | 'strict' | 'maximum'
  anti_cheat_enabled: boolean
  shuffle_questions: boolean
  shuffle_options: boolean
  disable_copy_paste: boolean
  disable_right_click: boolean
  disable_browser_navigation: boolean
  disable_tab_switching: boolean
  disable_screenshot: boolean
  force_fullscreen: boolean
  disable_print: boolean
  disable_developer_tools: boolean
  session_monitoring: boolean
  camera_proctoring: boolean
  screen_recording: boolean
  keystroke_analysis: boolean
  time_limit_strict: boolean
  auto_submit_on_violation: boolean
}

interface LockdownModeProps {
  evaluationId: string
  isActive: boolean
  config: LockdownConfig
  onActivate: (config: LockdownConfig) => void
  onDeactivate: () => void
  onViolationDetected: (violation: string) => void
}

export default function LockdownMode({
  evaluationId,
  isActive,
  config,
  onActivate,
  onDeactivate,
  onViolationDetected
}: LockdownModeProps) {
  const [violations, setViolations] = useState<string[]>([])
  const [sessionTime, setSessionTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [blockedActions, setBlockedActions] = useState<string[]>([])
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium')
  const [isInitializing, setIsInitializing] = useState(false)

  // Enhanced P1-T-07: Lockdown enforcement
  useEffect(() => {
    if (isActive) {
      setIsInitializing(true)
      initializeLockdown()
      startSessionMonitoring()
      
      // Set security level based on config
      const level = config.lockdown_level === 'maximum' ? 'high' : 
                   config.lockdown_level === 'strict' ? 'medium' : 'low'
      setSecurityLevel(level)
      
      setTimeout(() => setIsInitializing(false), 2000)
    } else {
      disableLockdown()
    }

    return () => {
      disableLockdown()
    }
  }, [isActive, config])

  const initializeLockdown = useCallback(() => {
    console.log('🔒 Initializing enhanced lockdown mode for evaluation:', evaluationId)
    
    // Progressive lockdown initialization
    const securitySteps = [
      { name: 'Deshabilitando clic derecho', action: () => document.addEventListener('contextmenu', preventRightClick) },
      { name: 'Bloqueando copiar/pegar', action: () => {
        if (config.disable_copy_paste) {
          document.addEventListener('copy', preventCopyPaste)
          document.addEventListener('paste', preventCopyPaste)
          document.addEventListener('cut', preventCopyPaste)
        }
      }},
      { name: 'Configurando atajos de teclado', action: () => document.addEventListener('keydown', handleKeyDown) },
      { name: 'Activando pantalla completa', action: () => config.force_fullscreen && requestFullscreen() },
      { name: 'Iniciando monitoreo', action: () => {
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleWindowBlur)
        window.addEventListener('focus', handleWindowFocus)
      }}
    ]

    securitySteps.forEach((step, index) => {
      setTimeout(() => {
        step.action()
        toast.success(`✅ ${step.name}`, { duration: 1000 })
      }, index * 300)
    })

    // Final confirmation
    setTimeout(() => {
      toast.success('🔒 Modo de seguridad completamente activado', {
        duration: 3000,
        icon: '🛡️'
      })
    }, securitySteps.length * 300 + 500)
  }, [config, evaluationId])

  const disableLockdown = () => {
    document.removeEventListener('contextmenu', preventRightClick)
    document.removeEventListener('copy', preventCopyPaste)
    document.removeEventListener('paste', preventCopyPaste)
    document.removeEventListener('cut', preventCopyPaste)
    document.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('beforeprint', preventPrint)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('blur', handleWindowBlur)
    window.removeEventListener('focus', handleWindowFocus)

    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  const preventRightClick = (e: Event) => {
    e.preventDefault()
    recordViolation('Intento de clic derecho bloqueado')
    return false
  }

  const preventCopyPaste = (e: Event) => {
    e.preventDefault()
    recordViolation('Intento de copiar/pegar bloqueado')
    return false
  }

  const preventPrint = (e: Event) => {
    e.preventDefault()
    recordViolation('Intento de impresión bloqueado')
    return false
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    const blockedKeys = [
      'F12',
      { ctrl: true, shift: true, key: 'I' }, // Dev tools
      { ctrl: true, shift: true, key: 'J' }, // Console
      { ctrl: true, key: 'U' }, // View source
      { ctrl: true, key: 'S' }, // Save
      { ctrl: true, key: 'A' }, // Select all
      { ctrl: true, key: 'P' }, // Print
      { alt: true, key: 'Tab' }, // Alt+Tab
      { ctrl: true, key: 'Tab' }, // Ctrl+Tab
      { key: 'F11' } // Fullscreen toggle
    ]

    for (const blocked of blockedKeys) {
      if (typeof blocked === 'string') {
        if (e.key === blocked) {
          e.preventDefault()
          recordViolation(`Tecla bloqueada: ${blocked}`)
          return false
        }
      } else {
        const match = Object.entries(blocked).every(([modifier, value]) => {
          if (modifier === 'key') return e.key === value
          if (modifier === 'ctrl') return e.ctrlKey === value
          if (modifier === 'shift') return e.shiftKey === value
          if (modifier === 'alt') return e.altKey === value
          return true
        })
        
        if (match) {
          e.preventDefault()
          recordViolation(`Combinación de teclas bloqueada`)
          return false
        }
      }
    }
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      recordViolation('Estudiante cambió de pestaña o minimizó ventana')
    }
  }

  const handleWindowBlur = () => {
    recordViolation('Ventana perdió el foco')
  }

  const handleWindowFocus = () => {
    console.log('Window regained focus')
  }

  const monitorDevTools = () => {
    // Monitor console access
    let devtools = false
    setInterval(() => {
      if (!devtools && (window.outerHeight - window.innerHeight > 200 || 
                       window.outerWidth - window.innerWidth > 200)) {
        devtools = true
        recordViolation('Herramientas de desarrollador detectadas')
      }
    }, 1000)
  }

  const requestFullscreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(() => {
        recordViolation('No se pudo activar pantalla completa')
      })
    }
  }

  const recordViolation = useCallback((violation: string) => {
    const timestamp = new Date().toISOString()
    const newViolation = `${timestamp}: ${violation}`
    const severity = getSeverityLevel(violation)
    
    setViolations(prev => [...prev, newViolation])
    setBlockedActions(prev => [...prev, violation])
    
    // Enhanced violation notifications
    toast.error(`🚨 ${violation}`, {
      duration: severity === 'critical' ? 5000 : 3000,
      style: {
        background: severity === 'critical' ? '#dc2626' : '#f59e0b',
        color: 'white',
        fontWeight: 'bold'
      }
    })
    
    onViolationDetected(violation)
    
    // Progressive response to violations
    if (violations.length >= 2 && violations.length < 5) {
      toast('⚠️ Múltiples violaciones detectadas. Por favor, sigue las instrucciones del examen.', {
        duration: 4000,
        style: {
          background: '#f59e0b',
          color: 'white',
          fontWeight: 'bold'
        }
      })
    } else if (violations.length >= 5 && config.auto_submit_on_violation) {
      toast.error('🔒 Demasiadas violaciones. Examen enviado automáticamente.')
      // Trigger auto-submit logic
    }
  }, [violations, config, onViolationDetected])

  const getSeverityLevel = (violation: string): 'low' | 'medium' | 'critical' => {
    if (violation.includes('desarrollador') || violation.includes('DevTools')) return 'critical'
    if (violation.includes('pestaña') || violation.includes('ventana')) return 'medium'
    return 'low'
  }

  const startSessionMonitoring = () => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getLockdownLevelColor = (level: string) => {
    switch (level) {
      case 'basic': return 'text-yellow-600 bg-yellow-50'
      case 'strict': return 'text-orange-600 bg-orange-50'
      case 'maximum': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getLockdownLevelText = (level: string) => {
    switch (level) {
      case 'basic': return 'Básico'
      case 'strict': return 'Estricto'
      case 'maximum': return 'Máximo'
      default: return level
    }
  }

  const getSecurityStatusColor = () => {
    switch (securityLevel) {
      case 'high': return 'bg-red-600 border-red-700'
      case 'medium': return 'bg-orange-500 border-orange-600'
      case 'low': return 'bg-yellow-500 border-yellow-600'
    }
  }

  const getSecurityStatusText = () => {
    switch (securityLevel) {
      case 'high': return 'SEGURIDAD MÁXIMA'
      case 'medium': return 'SEGURIDAD ALTA'
      case 'low': return 'SEGURIDAD BÁSICA'
    }
  }

  if (!isActive) {
    return null
  }

  return (
    <AnimatePresence>
      {/* Enhanced Main Security Banner */}
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed top-0 left-0 right-0 z-50 ${getSecurityStatusColor()} text-white shadow-2xl border-b-4`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto p-3 sm:px-6">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: isInitializing ? 360 : 0 }}
              transition={{ duration: 2, repeat: isInitializing ? Infinity : 0 }}
            >
              <ShieldExclamationIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base">
                  {isInitializing ? 'ACTIVANDO...' : getSecurityStatusText()}
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-white rounded-full"
                />
              </div>
              <div className="text-xs sm:text-sm opacity-90 mt-0.5">
                Nivel: {getLockdownLevelText(config.lockdown_level)} • 
                Evaluación ID: {evaluationId.slice(-8)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
            <motion.div 
              className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 rounded-full px-2 sm:px-3 py-1"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-mono">{formatTime(sessionTime)}</span>
            </motion.div>
            
            {violations.length > 0 && (
              <motion.div 
                className="flex items-center space-x-1 sm:space-x-2 bg-red-800 rounded-full px-2 sm:px-3 py-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <ExclamationTriangleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-bold">{violations.length}</span>
              </motion.div>
            )}
            
            {isFullscreen && (
              <div className="hidden sm:flex items-center space-x-2 bg-blue-600 rounded-full px-3 py-1">
                <ComputerDesktopIcon className="h-4 w-4" />
                <span>Completa</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar for initialization */}
        {isInitializing && (
          <motion.div
            className="h-1 bg-white bg-opacity-30 w-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2 }}
            style={{ transformOrigin: 'left' }}
          />
        )}
      </motion.div>

      {/* Enhanced Security Features Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ delay: 0.3, type: "spring", damping: 20 }}
        className="fixed top-20 right-2 sm:right-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-w-xs"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-5 w-5" />
            <h4 className="font-semibold text-sm">Funciones Activas</h4>
          </div>
        </div>
        
        <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
          {getActiveSecurityFeatures().map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${feature.active ? 'bg-green-500' : 'bg-red-500'}`} />
              <feature.icon className={`h-4 w-4 ${feature.active ? 'text-green-600' : 'text-red-500'}`} />
              <span className="text-xs text-gray-700 flex-1">{feature.name}</span>
              {feature.active && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1 h-1 bg-green-500 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Violations Log */}
      {violations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-40 bg-red-50 border-2 border-red-200 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="bg-red-600 text-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellAlertIcon className="h-5 w-5" />
                <h4 className="font-semibold text-sm">Alertas de Seguridad</h4>
              </div>
              <span className="bg-red-800 text-white text-xs px-2 py-1 rounded-full font-bold">
                {violations.length}
              </span>
            </div>
          </div>
          
          <div className="p-3">
            <div className="max-h-32 overflow-y-auto space-y-2">
              {violations.slice(-5).map((violation, index) => {
                const parts = violation.split(': ')
                const timestamp = new Date(parts[0]).toLocaleTimeString()
                const message = parts[1]
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-2 p-2 bg-red-100 rounded-lg border border-red-200"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-red-700 font-medium truncate">{message}</div>
                      <div className="text-xs text-red-500 mt-0.5">{timestamp}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            {violations.length > 5 && (
              <div className="text-center mt-2">
                <span className="text-xs text-red-600">
                  +{violations.length - 5} alertas adicionales
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile-specific security indicator */}
      <div className="sm:hidden fixed bottom-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={`w-12 h-12 rounded-full shadow-lg ${getSecurityStatusColor()} text-white flex items-center justify-center`}
          onClick={() => {/* Show security summary */}}
        >
          <LockClosedIcon className="h-6 w-6" />
        </motion.button>
      </div>
    </AnimatePresence>
  )

  // Helper function to get active security features
  function getActiveSecurityFeatures() {
    return [
      { name: 'Clic derecho', icon: NoSymbolIcon, active: true },
      { name: 'Copiar/Pegar', icon: NoSymbolIcon, active: config.disable_copy_paste },
      { name: 'Pantalla completa', icon: ComputerDesktopIcon, active: config.force_fullscreen && isFullscreen },
      { name: 'Monitoreo de pestañas', icon: EyeSlashIcon, active: config.session_monitoring },
      { name: 'Herramientas dev.', icon: NoSymbolIcon, active: config.disable_developer_tools },
      { name: 'Navegación del browser', icon: NoSymbolIcon, active: config.disable_browser_navigation }
    ]
  }
} 