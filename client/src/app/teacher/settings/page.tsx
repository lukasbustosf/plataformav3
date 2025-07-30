'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { 
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  ClockIcon,
  GlobeAltIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function TeacherSettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Profile settings
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '+56 9 1234 5678',
    bio: 'Profesora de Matemáticas con 10 años de experiencia en educación secundaria.',
    specialties: ['Matemáticas', 'Algebra', 'Geometría'],
    avatar: null
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newMessages: true,
    assignmentSubmissions: true,
    gameCompletions: true,
    parentCommunications: true,
    systemUpdates: false,
    weeklyReports: true,
    remindersBefore: 24 // hours
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'school', // public, school, private
    showEmail: false,
    showPhone: false,
    allowStudentMessages: true,
    allowParentMessages: true,
    shareActivityData: true
  })

  // Interface settings
  const [interfaceSettings, setInterfaceSettings] = useState({
    theme: 'light', // light, dark, auto
    language: 'es',
    timezone: 'America/Santiago',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    dashboardLayout: 'grid', // grid, list
    animationsEnabled: true
  })

  // Security settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 60 // minutes
  })

  // Academic settings
  const [academicSettings, setAcademicSettings] = useState({
    defaultGradingScale: '1-7',
    autoSaveFrequency: 5, // minutes
    defaultQuizTime: 30, // minutes
    showStudentScores: true,
    allowLateSubmissions: true,
    lateSubmissionPenalty: 10, // percentage
    defaultClassDuration: 90 // minutes
  })

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: UserIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'privacy', name: 'Privacidad', icon: ShieldCheckIcon },
    { id: 'interface', name: 'Interfaz', icon: ComputerDesktopIcon },
    { id: 'academic', name: 'Académico', icon: AcademicCapIcon },
    { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon }
  ]

  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Configuración ${section} guardada exitosamente`)
    } catch (error) {
      toast.error('Error al guardar la configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              className="input"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            className="input"
            rows={3}
          />
        </div>
      </div>

      <div className="pt-6 border-t">
        <Button
          onClick={() => handleSave('perfil')}
          isLoading={isLoading}
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Métodos de Notificación</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
              <p className="text-sm text-gray-600">Recibir notificaciones en tu correo electrónico</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
              className="h-4 w-4 text-primary-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Notificaciones Push</h4>
              <p className="text-sm text-gray-600">Notificaciones en tiempo real en el navegador</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
              className="h-4 w-4 text-primary-600 rounded"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tipos de Notificación</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Nuevos mensajes</span>
            <input
              type="checkbox"
              checked={notificationSettings.newMessages}
              onChange={(e) => setNotificationSettings({...notificationSettings, newMessages: e.target.checked})}
              className="h-4 w-4 text-primary-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Entrega de tareas</span>
            <input
              type="checkbox"
              checked={notificationSettings.assignmentSubmissions}
              onChange={(e) => setNotificationSettings({...notificationSettings, assignmentSubmissions: e.target.checked})}
              className="h-4 w-4 text-primary-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-900">Finalización de juegos</span>
            <input
              type="checkbox"
              checked={notificationSettings.gameCompletions}
              onChange={(e) => setNotificationSettings({...notificationSettings, gameCompletions: e.target.checked})}
              className="h-4 w-4 text-primary-600 rounded"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t">
        <Button
          onClick={() => handleSave('notificaciones')}
          isLoading={isLoading}
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar Contraseña</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
            <input
              type="password"
              value={securityData.newPassword}
              onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
              className="input"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad Adicional</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Autenticación de Dos Factores</h4>
            <p className="text-sm text-gray-600">Añade una capa extra de seguridad a tu cuenta</p>
          </div>
          <input
            type="checkbox"
            checked={securityData.twoFactorEnabled}
            onChange={(e) => setSecurityData({...securityData, twoFactorEnabled: e.target.checked})}
            className="h-4 w-4 text-primary-600 rounded"
          />
        </div>
      </div>

      <div className="pt-6 border-t">
        <Button
          onClick={() => handleSave('seguridad')}
          isLoading={isLoading}
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  )

  const renderAcademicTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuraciones de Evaluación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Escala de Calificación</label>
            <select
              value={academicSettings.defaultGradingScale}
              onChange={(e) => setAcademicSettings({...academicSettings, defaultGradingScale: e.target.value})}
              className="input"
            >
              <option value="1-7">1.0 - 7.0 (Chile)</option>
              <option value="0-100">0 - 100 (Porcentaje)</option>
              <option value="A-F">A - F (Letras)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de Quiz por Defecto (minutos)</label>
            <input
              type="number"
              value={academicSettings.defaultQuizTime}
              onChange={(e) => setAcademicSettings({...academicSettings, defaultQuizTime: parseInt(e.target.value)})}
              className="input"
              min="5"
              max="180"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Políticas de Entrega</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Permitir entregas tardías</h4>
              <p className="text-sm text-gray-600">Los estudiantes pueden entregar tareas después de la fecha límite</p>
            </div>
            <input
              type="checkbox"
              checked={academicSettings.allowLateSubmissions}
              onChange={(e) => setAcademicSettings({...academicSettings, allowLateSubmissions: e.target.checked})}
              className="h-4 w-4 text-primary-600 rounded"
            />
          </div>
          {academicSettings.allowLateSubmissions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Penalización por entrega tardía (%)</label>
              <input
                type="number"
                value={academicSettings.lateSubmissionPenalty}
                onChange={(e) => setAcademicSettings({...academicSettings, lateSubmissionPenalty: parseInt(e.target.value)})}
                className="input"
                min="0"
                max="100"
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-6 border-t">
        <Button
          onClick={() => handleSave('académico')}
          isLoading={isLoading}
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  )

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case 'profile':
        return renderProfileTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'security':
        return renderSecurityTab()
      case 'academic':
        return renderAcademicTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en la plataforma</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              {renderCurrentTab()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 