'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UserCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  EyeIcon,
  SpeakerWaveIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  KeyIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, fullName } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  // Mock user settings
  const [settings, setSettings] = useState({
    profile: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: '+56 9 1234 5678',
      bio: 'Profesor de matemáticas con 10 años de experiencia en educación secundaria.'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      gameResults: true,
      studentProgress: true,
      systemUpdates: false,
      digest: 'weekly'
    },
    appearance: {
      theme: 'light',
      language: 'es-CL',
      fontSize: 'medium',
      highContrast: false,
      reduceMotion: false
    },
    privacy: {
      profileVisibility: 'school',
      showOnlineStatus: true,
      dataCollection: true,
      analytics: true
    },
    accessibility: {
      screenReader: false,
      ttsEnabled: true,
      keyboardNavigation: false,
      largeText: false,
      colorBlind: false
    }
  })

  const handleSave = (section: string) => {
    toast.success(`Configuración de ${section} guardada exitosamente`)
  }

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'appearance', name: 'Apariencia', icon: PaintBrushIcon },
    { id: 'privacy', name: 'Privacidad', icon: ShieldCheckIcon },
    { id: 'accessibility', name: 'Accesibilidad', icon: EyeIcon }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Configuración ⚙️</h1>
          <p className="mt-2 opacity-90">
            Personaliza tu experiencia en EDU21, {fullName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white shadow rounded-lg p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 bg-white shadow rounded-lg">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <UserCircleIcon className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Información del Perfil</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, firstName: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, lastName: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        profile: { ...prev.profile, phone: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, bio: e.target.value }
                    }))}
                    rows={4}
                    className="input-field"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('perfil')}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <BellIcon className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Notificaciones</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
                      <p className="text-sm text-gray-600">Recibe notificaciones importantes por correo</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Notificaciones Push</h3>
                      <p className="text-sm text-gray-600">Recibe notificaciones en tiempo real</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, pushNotifications: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Resultados de Juegos</h3>
                      <p className="text-sm text-gray-600">Notificaciones cuando finalicen juegos educativos</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.gameResults}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, gameResults: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Progreso de Estudiantes</h3>
                      <p className="text-sm text-gray-600">Actualizaciones sobre el rendimiento académico</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.studentProgress}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, studentProgress: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia del Resumen
                    </label>
                    <select
                      value={settings.notifications.digest}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, digest: e.target.value }
                      }))}
                      className="input-field max-w-xs"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('notificaciones')}>
                    Guardar Preferencias
                  </Button>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <PaintBrushIcon className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Apariencia</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tema
                    </label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: e.target.value }
                      }))}
                      className="input-field max-w-xs"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, language: e.target.value }
                      }))}
                      className="input-field max-w-xs"
                    >
                      <option value="es-CL">Español (Chile)</option>
                      <option value="es-ES">Español (España)</option>
                      <option value="en-US">English (US)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamaño de Fuente
                    </label>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, fontSize: e.target.value }
                      }))}
                      className="input-field max-w-xs"
                    >
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                      <option value="extra-large">Extra Grande</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Alto Contraste</h3>
                      <p className="text-sm text-gray-600">Mejora la visibilidad con colores más contrastantes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.appearance.highContrast}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, highContrast: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Reducir Animaciones</h3>
                      <p className="text-sm text-gray-600">Minimiza las animaciones y transiciones</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.appearance.reduceMotion}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, reduceMotion: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('apariencia')}>
                    Aplicar Cambios
                  </Button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Privacidad y Seguridad</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibilidad del Perfil
                    </label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profileVisibility: e.target.value }
                      }))}
                      className="input-field max-w-xs"
                    >
                      <option value="public">Público</option>
                      <option value="school">Solo mi escuela</option>
                      <option value="teachers">Solo profesores</option>
                      <option value="private">Privado</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Mostrar Estado en Línea</h3>
                      <p className="text-sm text-gray-600">Otros usuarios pueden ver cuando estás conectado</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.showOnlineStatus}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, showOnlineStatus: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Recopilación de Datos</h3>
                      <p className="text-sm text-gray-600">Permitir la recopilación de datos para mejorar la experiencia</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataCollection}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, dataCollection: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">Permitir análisis de uso para mejorar la plataforma</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.analytics}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, analytics: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Gestión de Datos</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Puedes solicitar una copia de tus datos o eliminar tu cuenta en cualquier momento.
                    </p>
                    <div className="space-x-3">
                      <Button variant="outline" size="sm">
                        Descargar Mis Datos
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                        Eliminar Cuenta
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('privacidad')}>
                    Guardar Configuración
                  </Button>
                </div>
              </div>
            )}

            {/* Accessibility Tab */}
            {activeTab === 'accessibility' && (
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <EyeIcon className="h-8 w-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Accesibilidad</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Lector de Pantalla</h3>
                      <p className="text-sm text-gray-600">Optimización para lectores de pantalla</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.screenReader}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, screenReader: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Texto a Voz (TTS)</h3>
                      <p className="text-sm text-gray-600">Lectura automática de contenido</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.ttsEnabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, ttsEnabled: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Navegación por Teclado</h3>
                      <p className="text-sm text-gray-600">Soporte mejorado para navegación con teclado</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.keyboardNavigation}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, keyboardNavigation: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Texto Grande</h3>
                      <p className="text-sm text-gray-600">Aumenta el tamaño del texto en toda la plataforma</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.largeText}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, largeText: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Soporte para Daltonismo</h3>
                      <p className="text-sm text-gray-600">Paleta de colores adaptada para daltonismo</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.colorBlind}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, colorBlind: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Recursos de Accesibilidad</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      EDU21 cumple con las pautas WCAG 2.1 AA para garantizar una experiencia accesible para todos.
                    </p>
                    <Button variant="outline" size="sm">
                      Ver Guía de Accesibilidad
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => handleSave('accesibilidad')}>
                    Aplicar Configuración
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 