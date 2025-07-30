'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  QrCodeIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'
import toast from 'react-hot-toast'

interface MFASetupProps {
  userId: string
  userRole: string
  currentMFAStatus: boolean
  onMFAStatusChange: (enabled: boolean) => void
  required?: boolean
}

interface MFABackupCode {
  code: string
  used: boolean
  created_at: string
}

export default function MFASetup({
  userId,
  userRole,
  currentMFAStatus,
  onMFAStatusChange,
  required = false
}: MFASetupProps) {
  const [step, setStep] = useState<'setup' | 'qr' | 'verify' | 'backup' | 'complete'>('setup')
  const [loading, setLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<MFABackupCode[]>([])
  const [showSecret, setShowSecret] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  // P1 requirement: MFA mandatory for high-privilege roles
  const isMFARequired = required || ['SUPER_ADMIN_FULL', 'ADMIN_ESCOLAR', 'BIENESTAR_ESCOLAR'].includes(userRole)

  useEffect(() => {
    if (currentMFAStatus) {
      setStep('complete')
    }
  }, [currentMFAStatus])

  const initializeMFASetup = async () => {
    setLoading(true)
    try {
      // Mock MFA setup - replace with actual TOTP implementation
      const mockSecret = 'JBSWY3DPEHPK3PXP' // Base32 encoded secret
      const mockQRUrl = `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="white"/>
          <rect x="20" y="20" width="20" height="20" fill="black"/>
          <rect x="60" y="20" width="20" height="20" fill="black"/>
          <rect x="100" y="20" width="20" height="20" fill="black"/>
          <rect x="140" y="20" width="20" height="20" fill="black"/>
          <rect x="20" y="60" width="20" height="20" fill="black"/>
          <rect x="100" y="60" width="20" height="20" fill="black"/>
          <rect x="180" y="60" width="20" height="20" fill="black"/>
          <text x="100" y="190" text-anchor="middle" font-size="12" fill="black">EDU21 MFA QR</text>
        </svg>
      `)}`

      setSecret(mockSecret)
      setQrCodeUrl(mockQRUrl)
      setStep('qr')
    } catch (error) {
      console.error('Failed to initialize MFA setup:', error)
      toast.error('Error al inicializar configuración MFA')
    } finally {
      setLoading(false)
    }
  }

  const verifyMFACode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)
    try {
      // Mock verification - in real implementation, validate TOTP
      if (verificationCode === '123456' || verificationCode.length === 6) {
        // Generate backup codes
        const codes: MFABackupCode[] = Array.from({ length: 10 }, (_, i) => ({
          code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          used: false,
          created_at: new Date().toISOString()
        }))
        
        setBackupCodes(codes)
        setStep('backup')
        toast.success('MFA verificado correctamente')
      } else {
        toast.error('Código de verificación inválido')
      }
    } catch (error) {
      console.error('MFA verification failed:', error)
      toast.error('Error al verificar código MFA')
    } finally {
      setLoading(false)
    }
  }

  const completeMFASetup = async () => {
    setLoading(true)
    try {
      // Mock API call to enable MFA
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onMFAStatusChange(true)
      setStep('complete')
      toast.success('🔐 MFA activado correctamente')
    } catch (error) {
      console.error('Failed to complete MFA setup:', error)
      toast.error('Error al completar configuración MFA')
    } finally {
      setLoading(false)
    }
  }

  const disableMFA = async () => {
    if (!confirm('¿Estás seguro de que deseas desactivar MFA? Esto reducirá la seguridad de tu cuenta.')) {
      return
    }

    setLoading(true)
    try {
      // Mock API call to disable MFA
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onMFAStatusChange(false)
      setStep('setup')
      setQrCodeUrl('')
      setSecret('')
      setVerificationCode('')
      setBackupCodes([])
      toast.success('MFA desactivado')
    } catch (error) {
      console.error('Failed to disable MFA:', error)
      toast.error('Error al desactivar MFA')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copiado al portapapeles')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Error al copiar')
    }
  }

  const downloadBackupCodes = () => {
    const codesText = backupCodes.map(bc => bc.code).join('\n')
    const blob = new Blob([`EDU21 MFA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${codesText}`], 
                         { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edu21-mfa-backup-codes-${userId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderSetupStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Configurar Autenticación de Dos Factores
        </h3>
        <p className="text-gray-600">
          {isMFARequired 
            ? 'MFA es obligatorio para tu rol. Agrega una capa adicional de seguridad a tu cuenta.'
            : 'Agrega una capa adicional de seguridad a tu cuenta con MFA.'}
        </p>
      </div>

      {isMFARequired && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-800 text-sm font-medium">
              MFA es obligatorio para roles {userRole}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Aplicaciones recomendadas:</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <DevicePhoneMobileIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Google Authenticator</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <DevicePhoneMobileIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-medium">Microsoft Authenticator</p>
          </div>
        </div>
      </div>

      <Button 
        onClick={initializeMFASetup}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Inicializando...' : 'Comenzar Configuración'}
      </Button>
    </div>
  )

  const renderQRStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <QrCodeIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Escanea el código QR
        </h3>
        <p className="text-gray-600">
          Usa tu aplicación de autenticación para escanear este código QR
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Clave secreta manual:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSecret(!showSecret)}
          >
            {showSecret ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono">
            {showSecret ? secret : '••••••••••••••••'}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(secret)}
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Usa esta clave si no puedes escanear el código QR
        </p>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setStep('setup')}
          className="flex-1"
        >
          Volver
        </Button>
        <Button 
          onClick={() => setStep('verify')}
          className="flex-1"
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <KeyIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Verifica tu configuración
        </h3>
        <p className="text-gray-600">
          Ingresa el código de 6 dígitos que aparece en tu aplicación
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de verificación
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="input text-center text-2xl tracking-widest"
            maxLength={6}
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={() => setStep('qr')}
          className="flex-1"
        >
          Volver
        </Button>
        <Button 
          onClick={verifyMFACode}
          disabled={loading || verificationCode.length !== 6}
          className="flex-1"
        >
          {loading ? 'Verificando...' : 'Verificar'}
        </Button>
      </div>
    </div>
  )

  const renderBackupStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Guarda tus códigos de respaldo
        </h3>
        <p className="text-gray-600">
          Estos códigos te permitirán acceder si pierdes tu dispositivo MFA
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div className="text-yellow-800 text-sm">
            <p className="font-medium mb-1">¡Importante!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Guarda estos códigos en un lugar seguro</li>
              <li>Cada código solo se puede usar una vez</li>
              <li>No compartas estos códigos con nadie</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Códigos de respaldo:</h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackupCodes(!showBackupCodes)}
            >
              {showBackupCodes ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadBackupCodes}
            >
              📥 Descargar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((backup, index) => (
            <div key={index} className="bg-white p-2 rounded border">
              <code className="text-sm font-mono">
                {showBackupCodes ? backup.code : '••••••••'}
              </code>
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={completeMFASetup}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Completando...' : 'Completar Configuración'}
      </Button>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircleIcon className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          MFA Configurado Correctamente
        </h3>
        <p className="text-gray-600">
          Tu cuenta ahora está protegida con autenticación de dos factores
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 text-sm font-medium">
            Autenticación de dos factores activa
          </span>
        </div>
      </div>

      {!isMFARequired && (
        <Button 
          variant="outline"
          onClick={disableMFA}
          disabled={loading}
          className="w-full text-red-600 border-red-600 hover:bg-red-50"
        >
          {loading ? 'Desactivando...' : 'Desactivar MFA'}
        </Button>
      )}
    </div>
  )

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 'setup' && renderSetupStep()}
            {step === 'qr' && renderQRStep()}
            {step === 'verify' && renderVerifyStep()}
            {step === 'backup' && renderBackupStep()}
            {step === 'complete' && renderCompleteStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 