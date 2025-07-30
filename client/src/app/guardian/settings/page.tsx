'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  CogIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

export default function SettingsPage() {
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Juan Carlos',
      lastName: 'Martínez Silva',
      email: 'juan.martinez@email.com',
      phone: '+56 9 8765 4321',
      address: 'Av. Las Flores 1234, Santiago',
      emergencyContact: 'María Silva - +56 9 8765 4322',
      relationship: 'Padre'
    },
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      gradeAlerts: true,
      attendanceAlerts: true,
      behaviorAlerts: true,
      assignmentReminders: true,
      meetingNotifications: true,
      emergencyAlerts: true,
      frequency: 'immediate'
    },
    privacy: {
      profileVisibility: 'school_only',
      shareProgress: true,
      allowPhotos: true,
      dataRetention: 'required',
      communicationPreference: 'email'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordStrength: 'medium'
    }
  })

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev as any)[category],
        [setting]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    toast.loading('Guardando configuración...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Configuración guardada exitosamente')
      
      // Show confirmation details
      setTimeout(() => {
        toast('✅ Todos los cambios han sido aplicados', {
          duration: 3000
        })
      }, 500)
    }, 1500)
  }

  const handleChangePassword = () => {
    toast.success('Abriendo formulario de cambio de contraseña...')
    
    // Create password change modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
            <input type="password" class="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
            <input type="password" class="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
            <input type="password" class="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button onclick="this.closest('.fixed').remove()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
          <button onclick="this.closest('.fixed').remove(); window.dispatchEvent(new CustomEvent('passwordChanged'))" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Cambiar Contraseña
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    
    // Listen for password change event
    window.addEventListener('passwordChanged', () => {
      toast.success('Contraseña cambiada exitosamente')
    }, { once: true })
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }, 30000)
  }

  const handleExportData = () => {
    toast.loading('Preparando exportación de datos...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Datos exportados exitosamente')
      
      // Simulate file download
      const element = document.createElement('a')
      element.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(
        JSON.stringify({
          profile: settings.profile,
          exported_at: new Date().toISOString(),
          data_type: 'guardian_data'
        }, null, 2)
      )
      element.download = `datos_apoderado_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      
      // Show additional info
      setTimeout(() => {
        toast('📥 Archivo descargado a tu carpeta de descargas', {
          duration: 3000
        })
      }, 1000)
    }, 3000)
  }

  const handleDeleteAccount = () => {
    toast.error('⚠️ Acción crítica: Eliminación de cuenta')
    
    // Create confirmation modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 class="text-lg font-medium text-red-900 mb-4">⚠️ Confirmar Eliminación</h3>
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-3">
            ¿Está seguro que desea solicitar la eliminación de su cuenta? 
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-xs text-red-700">
              • Esta acción no se puede deshacer<br/>
              • Se procesará en 7 días hábiles<br/>
              • Perderá acceso a todos los reportes
            </p>
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
          <button onclick="this.closest('.fixed').remove(); window.dispatchEvent(new CustomEvent('accountDeleted'))" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
            Confirmar Eliminación
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    
    // Listen for deletion confirmation
    window.addEventListener('accountDeleted', () => {
      toast.error('Solicitud de eliminación enviada. Se procesará en 7 días hábiles.')
      setTimeout(() => {
        toast('📧 Recibirás un email de confirmación en breve', {
          duration: 4000
        })
      }, 1000)
    }, { once: true })
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }, 30000)
  }

  const handleOpenUserGuide = () => {
    toast.success('Abriendo guía de usuario...')
    
    // Create user guide modal
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">📖 Guía de Usuario</h3>
        <div class="mb-4 max-h-96 overflow-y-auto">
          <div class="space-y-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-medium text-gray-900">Navegación Principal</h4>
              <p class="text-sm text-gray-600">Usa el menú lateral para acceder a diferentes secciones de la plataforma.</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h4 class="font-medium text-gray-900">Progreso Académico</h4>
              <p class="text-sm text-gray-600">Revisa las calificaciones y el rendimiento de tu hijo/a en tiempo real.</p>
            </div>
            <div class="border-l-4 border-yellow-500 pl-4">
              <h4 class="font-medium text-gray-900">Comunicación</h4>
              <p class="text-sm text-gray-600">Envía mensajes a los profesores y recibe notificaciones importantes.</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h4 class="font-medium text-gray-900">Reportes</h4>
              <p class="text-sm text-gray-600">Descarga reportes oficiales y certificados cuando los necesites.</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button onclick="this.closest('.fixed').remove()" class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Cerrar Guía
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal)
      }
    }, 60000)
  }

  const notificationTypes = [
    { key: 'gradeAlerts', label: 'Nuevas calificaciones', description: 'Recibir notificación cuando se registren nuevas notas' },
    { key: 'attendanceAlerts', label: 'Alertas de asistencia', description: 'Notificaciones sobre ausencias o atrasos' },
    { key: 'behaviorAlerts', label: 'Reportes de conducta', description: 'Avisos sobre incidentes o reconocimientos' },
    { key: 'assignmentReminders', label: 'Recordatorios de tareas', description: 'Recordatorios de fechas límite de entrega' },
    { key: 'meetingNotifications', label: 'Reuniones y eventos', description: 'Notificaciones de reuniones de apoderados y eventos escolares' },
    { key: 'emergencyAlerts', label: 'Alertas de emergencia', description: 'Notificaciones urgentes de seguridad o emergencias' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Configuración ⚙️</h1>
          <p className="mt-2 opacity-90">
            Gestiona tu perfil, notificaciones y preferencias de privacidad
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'profile'
                    ? 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserIcon className="h-5 w-5 inline mr-2" />
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'notifications'
                    ? 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BellIcon className="h-5 w-5 inline mr-2" />
                Notificaciones
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'privacy'
                    ? 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
                Privacidad
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'security'
                    ? 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <KeyIcon className="h-5 w-5 inline mr-2" />
                Seguridad
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Información Personal</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={settings.profile.firstName}
                    onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={settings.profile.lastName}
                    onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={settings.profile.address}
                    onChange={(e) => handleSettingChange('profile', 'address', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto de Emergencia
                  </label>
                  <input
                    type="text"
                    value={settings.profile.emergencyContact}
                    onChange={(e) => handleSettingChange('profile', 'emergencyContact', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relación con el Estudiante
                  </label>
                  <select
                    value={settings.profile.relationship}
                    onChange={(e) => handleSettingChange('profile', 'relationship', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Tutor Legal">Tutor Legal</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Preferencias de Notificaciones</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Notification Channels */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Canales de Notificación</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Email</span>
                        <p className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailEnabled}
                        onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Notificaciones Push</span>
                        <p className="text-sm text-gray-600">Notificaciones en tiempo real en la aplicación</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushEnabled}
                        onChange={(e) => handleSettingChange('notifications', 'pushEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">SMS</span>
                        <p className="text-sm text-gray-600">Mensajes de texto para alertas urgentes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsEnabled}
                        onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Tipos de Notificaciones</h3>
                <div className="space-y-4">
                  {notificationTypes.map((type) => (
                    <div key={type.key} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(settings.notifications as any)[type.key]}
                          onChange={(e) => handleSettingChange('notifications', type.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Frecuencia de Notificaciones</h3>
                <select
                  value={settings.notifications.frequency}
                  onChange={(e) => handleSettingChange('notifications', 'frequency', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="immediate">Inmediato</option>
                  <option value="daily">Resumen Diario</option>
                  <option value="weekly">Resumen Semanal</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Configuración de Privacidad</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibilidad del Perfil
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="school_only">Solo Colegio</option>
                    <option value="teachers_only">Solo Profesores</option>
                    <option value="private">Privado</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-1">Controla quién puede ver tu información de perfil</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Compartir Progreso Académico</span>
                    <p className="text-sm text-gray-600">Permitir que los profesores vean el progreso completo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.shareProgress}
                      onChange={(e) => handleSettingChange('privacy', 'shareProgress', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Permitir Fotografías</span>
                    <p className="text-sm text-gray-600">Autorizar el uso de fotografías en actividades escolares</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowPhotos}
                      onChange={(e) => handleSettingChange('privacy', 'allowPhotos', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retención de Datos
                  </label>
                  <select
                    value={settings.privacy.dataRetention}
                    onChange={(e) => handleSettingChange('privacy', 'dataRetention', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="required">Solo lo Requerido</option>
                    <option value="extended">Retención Extendida</option>
                    <option value="minimal">Mínimo Necesario</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-1">Controla por cuánto tiempo se mantienen tus datos</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Gestión de Datos</h3>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                  >
                    Exportar Mis Datos
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Solicitar Eliminación
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Configuración de Seguridad</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Contraseña</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">Cambiar Contraseña</span>
                      <p className="text-sm text-gray-600">Última actualización hace 45 días</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleChangePassword}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Autenticación de Dos Factores</h3>
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">2FA</span>
                      <p className="text-sm text-gray-600">
                        {settings.security.twoFactor ? 'Activado' : 'Desactivado'} - Seguridad adicional para tu cuenta
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactor}
                        onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Sesión (minutos)
                  </label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={120}>2 horas</option>
                  </select>
                  <p className="text-sm text-gray-600 mt-1">Cierre automático de sesión por inactividad</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Alertas de Inicio de Sesión</span>
                    <p className="text-sm text-gray-600">Recibir notificación cuando alguien acceda a tu cuenta</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-500 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900">¿Necesitas Ayuda?</h3>
              <p className="text-blue-700 mt-1">
                Si tienes problemas con tu configuración o necesitas asistencia técnica, 
                contacta al soporte técnico del colegio.
              </p>
              <div className="mt-3 flex space-x-3">
                <Button
                  size="sm"
                  onClick={() => window.location.href = 'mailto:soporte@colegio.cl'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Contactar Soporte
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleOpenUserGuide}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Ver Guía de Usuario
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
