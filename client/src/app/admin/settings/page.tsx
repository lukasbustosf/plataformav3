'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  ServerIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CircleStackIcon as DatabaseIcon,
  CloudIcon,
  LockClosedIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKeys, setShowApiKeys] = useState(false)

  const [settings, setSettings] = useState({
    general: {
      platformName: 'EDU21',
      maintenanceMode: false,
      registrationEnabled: true,
      defaultLanguage: 'es-CL',
      timezone: 'America/Santiago',
      maxFileUploadSize: 50, // MB
      sessionTimeout: 30, // minutes
      passwordComplexity: 'medium'
    },
    ai: {
      openaiApiKey: 'sk-proj-***************************',
      openaiModel: 'gpt-4o-mini',
      globalTokenLimit: 100000,
      defaultSchoolLimit: 5000,
      aiFeatureEnabled: true,
      autoTranslation: true,
      contentModeration: true,
      tokensPerMinuteLimit: 1000
    },
    security: {
      mfaRequired: false,
      sessionSecurity: 'strict',
      ipWhitelist: false,
      auditLogging: true,
      bruteForceProtection: true,
      passwordResetLimit: 5,
      lockoutDuration: 30, // minutes
      sslRequired: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      maintenanceNotifications: true,
      securityAlerts: true,
      budgetAlerts: true,
      systemHealthAlerts: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      cloudBackup: true,
      backupCompression: true,
      encryptBackups: true
    },
    integration: {
      googleTtsEnabled: true,
      supabaseUrl: 'https://*****.supabase.co',
      supabaseKey: 'eyJ***************************',
      webhooksEnabled: true,
      analyticsEnabled: true,
      errorReporting: true
    }
  })

  const handleSettingUpdate = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [key]: value
      }
    }))
    toast.success('Configuración actualizada')
  }

  const handleSaveSettings = () => {
    toast.success('Configuración guardada correctamente')
  }

  const handleTestApiKey = (service: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Probando conexión con ${service}...`,
        success: `Conexión con ${service} exitosa`,
        error: `Error al conectar con ${service}`
      }
    )
  }

  const handleRotateApiKey = (service: string) => {
    if (confirm(`¿Estás seguro de que deseas rotar la clave API de ${service}? Esto puede causar interrupciones temporales.`)) {
      toast.success(`Clave API de ${service} rotada correctamente`)
    }
  }

  const handleMaintenanceMode = () => {
    const newMode = !settings.general.maintenanceMode
    handleSettingUpdate('general', 'maintenanceMode', newMode)
    if (newMode) {
      toast.success('Modo de mantenimiento activado - Sistema en solo lectura')
    } else {
      toast.success('Modo de mantenimiento desactivado - Sistema operativo')
    }
  }

  const handleBackupNow = () => {
    if (confirm('¿Iniciar backup manual del sistema?')) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 5000)),
        {
          loading: 'Creando backup del sistema...',
          success: 'Backup completado correctamente',
          error: 'Error al crear backup'
        }
      )
    }
  }

  const handleSystemRestart = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar el sistema? Esto causará una interrupción temporal del servicio.')) {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 3000)),
        {
          loading: 'Reiniciando sistema...',
          success: 'Sistema reiniciado correctamente',
          error: 'Error al reiniciar sistema'
        }
      )
    }
  }

  const systemStatus = {
    uptime: '99.8%',
    lastBackup: '2024-06-20 02:00 AM',
    dbConnections: 45,
    memoryUsage: 67,
    cpuUsage: 23,
    diskSpace: 78,
    apiStatus: 'operational',
    lastUpdate: '2024-06-15'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Configuración Global ⚙️</h1>
              <p className="mt-2 opacity-90">
                Configuración del sistema, APIs, seguridad y mantenimiento
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleBackupNow}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <DatabaseIcon className="w-4 h-4 mr-2" />
                Backup Manual
              </Button>
              <Button
                onClick={handleMaintenanceMode}
                className={`${settings.general.maintenanceMode ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'} text-white border-white/30`}
              >
                <BoltIcon className="w-4 h-4 mr-2" />
                {settings.general.maintenanceMode ? 'Desactivar Mantenimiento' : 'Modo Mantenimiento'}
              </Button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.uptime}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ServerIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">CPU Usage</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.cpuUsage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DatabaseIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">DB Connections</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.dbConnections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <CloudIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Disk Space</p>
                <p className="text-2xl font-bold text-gray-900">{systemStatus.diskSpace}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'general', name: 'General', icon: CogIcon },
                { id: 'ai', name: 'Configuración IA', icon: CpuChipIcon },
                { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
                { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
                { id: 'backup', name: 'Backup', icon: DatabaseIcon },
                { id: 'integration', name: 'Integraciones', icon: GlobeAltIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-gray-500 text-gray-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración General</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre de la Plataforma</label>
                      <input
                        type="text"
                        value={settings.general.platformName}
                        onChange={(e) => handleSettingUpdate('general', 'platformName', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Idioma por Defecto</label>
                      <select
                        value={settings.general.defaultLanguage}
                        onChange={(e) => handleSettingUpdate('general', 'defaultLanguage', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="es-CL">Español (Chile)</option>
                        <option value="es-ES">Español (España)</option>
                        <option value="en-US">English (US)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Zona Horaria</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingUpdate('general', 'timezone', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="America/Santiago">America/Santiago</option>
                        <option value="America/Buenos_Aires">America/Buenos_Aires</option>
                        <option value="America/Lima">America/Lima</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tamaño Máximo de Archivo (MB)</label>
                      <input
                        type="number"
                        value={settings.general.maxFileUploadSize}
                        onChange={(e) => handleSettingUpdate('general', 'maxFileUploadSize', parseInt(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Timeout de Sesión (minutos)</label>
                      <input
                        type="number"
                        value={settings.general.sessionTimeout}
                        onChange={(e) => handleSettingUpdate('general', 'sessionTimeout', parseInt(e.target.value))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Complejidad de Contraseña</label>
                      <select
                        value={settings.general.passwordComplexity}
                        onChange={(e) => handleSettingUpdate('general', 'passwordComplexity', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="low">Baja (8 caracteres)</option>
                        <option value="medium">Media (8 char + números)</option>
                        <option value="high">Alta (12 char + símbolos)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Registro de Nuevos Usuarios</div>
                        <div className="text-xs text-gray-500">Permitir que nuevos usuarios se registren</div>
                      </div>
                      <button
                        onClick={() => handleSettingUpdate('general', 'registrationEnabled', !settings.general.registrationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.general.registrationEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.general.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Settings */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de IA</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Configuración Sensible
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>Los cambios en esta sección afectan a todas las escuelas y funciones de IA.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type={showApiKeys ? "text" : "password"}
                            value={settings.ai.openaiApiKey}
                            onChange={(e) => handleSettingUpdate('ai', 'openaiApiKey', e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md"
                          />
                          <button
                            onClick={() => setShowApiKeys(!showApiKeys)}
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50"
                          >
                            {showApiKeys ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                          </button>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <Button
                            onClick={() => handleTestApiKey('OpenAI')}
                            variant="outline"
                            size="sm"
                          >
                            Probar Conexión
                          </Button>
                          <Button
                            onClick={() => handleRotateApiKey('OpenAI')}
                            variant="outline"
                            size="sm"
                          >
                            Rotar Clave
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Modelo de OpenAI</label>
                        <select
                          value={settings.ai.openaiModel}
                          onChange={(e) => handleSettingUpdate('ai', 'openaiModel', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="gpt-4o-mini">GPT-4o Mini</option>
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Límite Global de Tokens</label>
                        <input
                          type="number"
                          value={settings.ai.globalTokenLimit}
                          onChange={(e) => handleSettingUpdate('ai', 'globalTokenLimit', parseInt(e.target.value))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Límite por Escuela (Tokens)</label>
                        <input
                          type="number"
                          value={settings.ai.defaultSchoolLimit}
                          onChange={(e) => handleSettingUpdate('ai', 'defaultSchoolLimit', parseInt(e.target.value))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tokens por Minuto</label>
                        <input
                          type="number"
                          value={settings.ai.tokensPerMinuteLimit}
                          onChange={(e) => handleSettingUpdate('ai', 'tokensPerMinuteLimit', parseInt(e.target.value))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Funciones de IA Habilitadas</div>
                          <div className="text-xs text-gray-500">Activar/desactivar todas las funciones de IA globalmente</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('ai', 'aiFeatureEnabled', !settings.ai.aiFeatureEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.ai.aiFeatureEnabled ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.ai.aiFeatureEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Traducción Automática</div>
                          <div className="text-xs text-gray-500">Traducir automáticamente contenido generado por IA</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('ai', 'autoTranslation', !settings.ai.autoTranslation)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.ai.autoTranslation ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.ai.autoTranslation ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Moderación de Contenido</div>
                          <div className="text-xs text-gray-500">Filtrar contenido inapropiado generado por IA</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('ai', 'contentModeration', !settings.ai.contentModeration)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.ai.contentModeration ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.ai.contentModeration ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seguridad de Sesión</label>
                        <select
                          value={settings.security.sessionSecurity}
                          onChange={(e) => handleSettingUpdate('security', 'sessionSecurity', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                          <option value="normal">Normal</option>
                          <option value="strict">Estricta</option>
                          <option value="paranoid">Paranoica</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Límite de Reset de Contraseña</label>
                        <input
                          type="number"
                          value={settings.security.passwordResetLimit}
                          onChange={(e) => handleSettingUpdate('security', 'passwordResetLimit', parseInt(e.target.value))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duración de Bloqueo (minutos)</label>
                        <input
                          type="number"
                          value={settings.security.lockoutDuration}
                          onChange={(e) => handleSettingUpdate('security', 'lockoutDuration', parseInt(e.target.value))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">MFA Requerido Globalmente</div>
                          <div className="text-xs text-gray-500">Forzar MFA para todos los usuarios</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('security', 'mfaRequired', !settings.security.mfaRequired)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.security.mfaRequired ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security.mfaRequired ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Lista Blanca de IPs</div>
                          <div className="text-xs text-gray-500">Restringir acceso a IPs específicas</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('security', 'ipWhitelist', !settings.security.ipWhitelist)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.security.ipWhitelist ? 'bg-orange-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security.ipWhitelist ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Logs de Auditoría</div>
                          <div className="text-xs text-gray-500">Registrar todas las acciones del sistema</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('security', 'auditLogging', !settings.security.auditLogging)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.security.auditLogging ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security.auditLogging ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Protección Fuerza Bruta</div>
                          <div className="text-xs text-gray-500">Bloquear IPs con intentos fallidos</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('security', 'bruteForceProtection', !settings.security.bruteForceProtection)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.security.bruteForceProtection ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security.bruteForceProtection ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">SSL Requerido</div>
                          <div className="text-xs text-gray-500">Forzar conexiones HTTPS</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('security', 'sslRequired', !settings.security.sslRequired)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.security.sslRequired ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.security.sslRequired ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email SMTP</label>
                        <input
                          type="email"
                          placeholder="smtp.gmail.com"
                          className="input-field-mobile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Puerto SMTP</label>
                        <input
                          type="number"
                          placeholder="587"
                          className="input-field-mobile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Usuario SMTP</label>
                        <input
                          type="email"
                          placeholder="notificaciones@edu21.cl"
                          className="input-field-mobile"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña SMTP</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="input-field-mobile"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Notificaciones por Email</div>
                          <div className="text-xs text-gray-500">Activar envío automático de emails</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Notificaciones SMS</div>
                          <div className="text-xs text-gray-500">Alertas vía mensaje de texto</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'smsNotifications', !settings.notifications.smsNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.smsNotifications ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Notificaciones Push</div>
                          <div className="text-xs text-gray-500">Notificaciones en tiempo real en navegador</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'pushNotifications', !settings.notifications.pushNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.pushNotifications ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Alertas de Mantenimiento</div>
                          <div className="text-xs text-gray-500">Notificar sobre mantenimientos programados</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'maintenanceNotifications', !settings.notifications.maintenanceNotifications)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.maintenanceNotifications ? 'bg-yellow-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.maintenanceNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Alertas de Seguridad</div>
                          <div className="text-xs text-gray-500">Notificar intentos de acceso sospechosos</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'securityAlerts', !settings.notifications.securityAlerts)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.securityAlerts ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.securityAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Alertas de Presupuesto</div>
                          <div className="text-xs text-gray-500">Avisar cuando se superen límites de presupuesto IA</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'budgetAlerts', !settings.notifications.budgetAlerts)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.budgetAlerts ? 'bg-orange-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.budgetAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Alertas de Sistema</div>
                          <div className="text-xs text-gray-500">Notificar sobre rendimiento y salud del sistema</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('notifications', 'systemHealthAlerts', !settings.notifications.systemHealthAlerts)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.notifications.systemHealthAlerts ? 'bg-teal-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications.systemHealthAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <BellIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                        <div className="text-sm">
                          <h5 className="font-medium text-blue-800">Configuración de Plantillas</h5>
                          <p className="text-blue-700 mt-1">
                            Puedes personalizar las plantillas de email y los tipos de notificaciones desde 
                            la sección de comunicaciones.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Backup</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de Backup</label>
                        <select
                          value={settings.backup.backupFrequency}
                          onChange={(e) => handleSettingUpdate('backup', 'backupFrequency', e.target.value)}
                          className="input-field-mobile"
                        >
                          <option value="hourly">Cada Hora</option>
                          <option value="daily">Diario</option>
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Retención (días)</label>
                        <input
                          type="number"
                          value={settings.backup.retentionDays}
                          onChange={(e) => handleSettingUpdate('backup', 'retentionDays', parseInt(e.target.value))}
                          className="input-field-mobile"
                          min="1"
                          max="365"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación de Backup</label>
                        <input
                          type="text"
                          placeholder="/backups/edu21/"
                          className="input-field-mobile"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Backup Automático</div>
                          <div className="text-xs text-gray-500">Activar backups programados automáticamente</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('backup', 'autoBackup', !settings.backup.autoBackup)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.backup.autoBackup ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Backup en la Nube</div>
                          <div className="text-xs text-gray-500">Sincronizar backups con almacenamiento en la nube</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('backup', 'cloudBackup', !settings.backup.cloudBackup)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.backup.cloudBackup ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.backup.cloudBackup ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Compresión</div>
                          <div className="text-xs text-gray-500">Comprimir archivos de backup para ahorrar espacio</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('backup', 'backupCompression', !settings.backup.backupCompression)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.backup.backupCompression ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.backup.backupCompression ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Encriptación</div>
                          <div className="text-xs text-gray-500">Encriptar archivos de backup para mayor seguridad</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('backup', 'encryptBackups', !settings.backup.encryptBackups)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.backup.encryptBackups ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.backup.encryptBackups ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                          <div className="text-sm">
                            <div className="font-medium text-green-800">Último Backup</div>
                            <div className="text-green-700">Hoy 02:00 AM - Exitoso</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
                          <div className="text-sm">
                            <div className="font-medium text-blue-800">Próximo Backup</div>
                            <div className="text-blue-700">Mañana 02:00 AM</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button onClick={handleBackupNow}>
                        <DatabaseIcon className="w-4 h-4 mr-2" />
                        Backup Manual Ahora
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => toast.success('🗂️ Lista de backups mostrada')}
                      >
                        Ver Backups Disponibles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Settings */}
            {activeTab === 'integration' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Integraciones Externas</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Google Text-to-Speech</h4>
                            <p className="text-sm text-gray-600">Síntesis de voz para funciones de accesibilidad</p>
                          </div>
                          <button
                            onClick={() => handleSettingUpdate('integration', 'googleTtsEnabled', !settings.integration.googleTtsEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.integration.googleTtsEnabled ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.integration.googleTtsEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                            <input
                              type="password"
                              placeholder="••••••••••••••••••••••••••••••••"
                              className="input-field-mobile"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                            <select className="input-field-mobile">
                              <option value="us">Estados Unidos</option>
                              <option value="eu">Europa</option>
                              <option value="asia">Asia</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestApiKey('Google TTS')}
                          >
                            Probar Conexión
                          </Button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Supabase</h4>
                            <p className="text-sm text-gray-600">Base de datos y autenticación backend</p>
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Conectado
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Proyecto</label>
                            <input
                              type="url"
                              value={settings.integration.supabaseUrl}
                              onChange={(e) => handleSettingUpdate('integration', 'supabaseUrl', e.target.value)}
                              className="input-field-mobile"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Anon Key</label>
                            <input
                              type="password"
                              placeholder="••••••••••••••••••••••••••••••••"
                              className="input-field-mobile"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleTestApiKey('Supabase')}
                          >
                            Probar Conexión
                          </Button>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">Webhooks</h4>
                            <p className="text-sm text-gray-600">Notificaciones automáticas a sistemas externos</p>
                          </div>
                          <button
                            onClick={() => handleSettingUpdate('integration', 'webhooksEnabled', !settings.integration.webhooksEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.integration.webhooksEnabled ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.integration.webhooksEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL de Webhook</label>
                            <input
                              type="url"
                              placeholder="https://api.escuela.cl/webhooks/edu21"
                              className="input-field-mobile"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Eventos</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                <span className="text-sm text-gray-700">Nuevos usuarios</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" defaultChecked />
                                <span className="text-sm text-gray-700">Evaluaciones completadas</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-700">Alertas de presupuesto</span>
                              </label>
                              <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-700">Errores del sistema</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Analytics</div>
                          <div className="text-xs text-gray-500">Recopilar métricas de uso y rendimiento</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('integration', 'analyticsEnabled', !settings.integration.analyticsEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.integration.analyticsEnabled ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.integration.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Reporte de Errores</div>
                          <div className="text-xs text-gray-500">Enviar automáticamente reportes de errores para debugging</div>
                        </div>
                        <button
                          onClick={() => handleSettingUpdate('integration', 'errorReporting', !settings.integration.errorReporting)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.integration.errorReporting ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.integration.errorReporting ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
                        <div className="text-sm">
                          <h5 className="font-medium text-yellow-800">Importante</h5>
                          <p className="text-yellow-700 mt-1">
                            Los cambios en las integraciones pueden afectar el funcionamiento del sistema. 
                            Asegúrate de probar las conexiones antes de guardar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-between">
              <Button
                onClick={handleSystemRestart}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Reiniciar Sistema
              </Button>
              <Button onClick={handleSaveSettings}>
                Guardar Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
