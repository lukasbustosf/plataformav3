'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AcademicCapIcon,
  ClockIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SchoolSettings {
  // Institution Info
  institution_name: string
  institution_code: string
  rbd_code: string
  principal_name: string
  address: string
  phone: string
  email: string
  website: string
  
  // Academic Configuration
  academic_year: number
  current_semester: string
  grading_scale: 'chile_1_7' | 'chile_1_10' | 'percentage'
  passing_grade: number
  attendance_requirement: number
  
  // Schedule Configuration
  class_duration: number
  break_duration: number
  lunch_duration: number
  start_time: string
  end_time: string
  
  // Notification Settings
  email_notifications: boolean
  sms_notifications: boolean
  parent_notifications: boolean
  teacher_notifications: boolean
  
  // Security Settings
  password_policy: 'basic' | 'medium' | 'strict'
  session_timeout: number
  require_2fa: boolean
  
  // System Preferences
  language: string
  timezone: string
  date_format: string
  currency: string
}

export default function SchoolSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('institution')
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock school settings data
  const [settings, setSettings] = useState<SchoolSettings>({
    institution_name: 'Colegio San Antonio',
    institution_code: 'CSA-001',
    rbd_code: '12345-6',
    principal_name: 'Carmen Silva Rodríguez',
    address: 'Av. Providencia 1234, Providencia, Santiago',
    phone: '+56 2 2234 5678',
    email: 'contacto@colegiosanantonio.cl',
    website: 'www.colegiosanantonio.cl',
    
    academic_year: 2024,
    current_semester: '2024-2',
    grading_scale: 'chile_1_7',
    passing_grade: 4.0,
    attendance_requirement: 85,
    
    class_duration: 90,
    break_duration: 15,
    lunch_duration: 45,
    start_time: '08:00',
    end_time: '17:30',
    
    email_notifications: true,
    sms_notifications: false,
    parent_notifications: true,
    teacher_notifications: true,
    
    password_policy: 'medium',
    session_timeout: 60,
    require_2fa: false,
    
    language: 'es-CL',
    timezone: 'America/Santiago',
    date_format: 'DD/MM/YYYY',
    currency: 'CLP'
  })

  const updateSetting = (key: keyof SchoolSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Configuración guardada correctamente')
      setHasChanges(false)
      // In real app: API call to save settings
    } catch (error) {
      toast.error('Error al guardar la configuración')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportBackup = () => {
    toast.success('Generando backup de configuración...')
    // In real app: trigger backup download
  }

  const handleRestoreBackup = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast.success(`Restaurando backup desde: ${file.name}`)
        // In real app: process backup file
      }
    }
    input.click()
  }

  const handleTestNotifications = () => {
    toast.success('Enviando notificación de prueba...')
    // In real app: send test notification
  }

  const handleReset = () => {
    if (confirm('¿Estás seguro de que deseas revertir todos los cambios?')) {
      // Reset to original values
      setHasChanges(false)
      toast.success('Cambios revertidos')
    }
  }

  const tabs = [
    { id: 'institution', name: 'Institución', icon: BuildingOfficeIcon },
    { id: 'academic', name: 'Académico', icon: AcademicCapIcon },
    { id: 'schedule', name: 'Horarios', icon: ClockIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'system', name: 'Sistema', icon: CogIcon }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuración del Colegio ⚙️</h1>
                <p className="text-gray-600 mt-1">
                  Administra la configuración institucional y preferencias del sistema
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => window.location.href = '/school/ai-budget'}
                  variant="outline"
                >
                  <CpuChipIcon className="h-5 w-5 mr-2" />
                  Presupuesto IA
                </Button>
                {hasChanges && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <ArrowPathIcon className="h-5 w-5 mr-2" />
                    Revertir
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <DocumentIcon className="h-5 w-5 mr-2" />
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {hasChanges && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-400" />
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    Tienes cambios sin guardar. No olvides guardar antes de salir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Institution Tab */}
            {activeTab === 'institution' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Institucional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Institución
                      </label>
                      <input
                        type="text"
                        value={settings.institution_name}
                        onChange={(e) => updateSetting('institution_name', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Institucional
                      </label>
                      <input
                        type="text"
                        value={settings.institution_code}
                        onChange={(e) => updateSetting('institution_code', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RBD (Código MINEDUC)
                      </label>
                      <input
                        type="text"
                        value={settings.rbd_code}
                        onChange={(e) => updateSetting('rbd_code', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Director(a)
                      </label>
                      <input
                        type="text"
                        value={settings.principal_name}
                        onChange={(e) => updateSetting('principal_name', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => updateSetting('address', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => updateSetting('phone', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Institucional
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting('email', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        value={settings.website}
                        onChange={(e) => updateSetting('website', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Académica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año Académico
                      </label>
                      <input
                        type="number"
                        value={settings.academic_year}
                        onChange={(e) => updateSetting('academic_year', parseInt(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semestre Actual
                      </label>
                      <select
                        value={settings.current_semester}
                        onChange={(e) => updateSetting('current_semester', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="2024-1">2024 - Primer Semestre</option>
                        <option value="2024-2">2024 - Segundo Semestre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Escala de Notas
                      </label>
                      <select
                        value={settings.grading_scale}
                        onChange={(e) => updateSetting('grading_scale', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="chile_1_7">Chile (1.0 - 7.0)</option>
                        <option value="chile_1_10">Chile (1.0 - 10.0)</option>
                        <option value="percentage">Porcentaje (0% - 100%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nota de Aprobación
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.passing_grade}
                        onChange={(e) => updateSetting('passing_grade', parseFloat(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asistencia Mínima (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.attendance_requirement}
                        onChange={(e) => updateSetting('attendance_requirement', parseInt(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Horarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración de Clases (minutos)
                      </label>
                      <input
                        type="number"
                        value={settings.class_duration}
                        onChange={(e) => updateSetting('class_duration', parseInt(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración de Recreos (minutos)
                      </label>
                      <input
                        type="number"
                        value={settings.break_duration}
                        onChange={(e) => updateSetting('break_duration', parseInt(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duración del Almuerzo (minutos)
                      </label>
                      <input
                        type="number"
                        value={settings.lunch_duration}
                        onChange={(e) => updateSetting('lunch_duration', parseInt(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Inicio
                      </label>
                      <input
                        type="time"
                        value={settings.start_time}
                        onChange={(e) => updateSetting('start_time', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Término
                      </label>
                      <input
                        type="time"
                        value={settings.end_time}
                        onChange={(e) => updateSetting('end_time', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Notificaciones</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notificaciones por Email</h4>
                        <p className="text-sm text-gray-500">Enviar notificaciones importantes por correo electrónico</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email_notifications}
                          onChange={(e) => updateSetting('email_notifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notificaciones SMS</h4>
                        <p className="text-sm text-gray-500">Enviar alertas urgentes por mensaje de texto</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.sms_notifications}
                          onChange={(e) => updateSetting('sms_notifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notificaciones a Apoderados</h4>
                        <p className="text-sm text-gray-500">Informar a apoderados sobre calificaciones y asistencia</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.parent_notifications}
                          onChange={(e) => updateSetting('parent_notifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notificaciones a Profesores</h4>
                        <p className="text-sm text-gray-500">Alertas sobre cambios de horario y eventos importantes</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.teacher_notifications}
                          onChange={(e) => updateSetting('teacher_notifications', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Seguridad</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Política de Contraseñas
                      </label>
                      <select
                        value={settings.password_policy}
                        onChange={(e) => updateSetting('password_policy', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="basic">Básica (mínimo 6 caracteres)</option>
                        <option value="medium">Media (8+ caracteres, números y letras)</option>
                        <option value="strict">Estricta (12+ caracteres, mayús., números y símbolos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo de Sesión (minutos)
                      </label>
                      <input
                        type="number"
                        value={settings.session_timeout}
                        onChange={(e) => updateSetting('session_timeout', parseInt(e.target.value))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Autenticación de Dos Factores (2FA)</h4>
                        <p className="text-sm text-gray-500">Requerir 2FA para roles administrativos</p>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.require_2fa}
                          onChange={(e) => updateSetting('require_2fa', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias del Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Idioma
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => updateSetting('language', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="es-CL">Español (Chile)</option>
                        <option value="en-US">English (US)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zona Horaria
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => updateSetting('timezone', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="America/Santiago">Santiago, Chile</option>
                        <option value="America/Buenos_Aires">Buenos Aires, Argentina</option>
                        <option value="America/Lima">Lima, Perú</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Formato de Fecha
                      </label>
                      <select
                        value={settings.date_format}
                        onChange={(e) => updateSetting('date_format', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => updateSetting('currency', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="CLP">Peso Chileno (CLP)</option>
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Información Importante</h4>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Los cambios en la configuración académica afectarán a todas las clases activas</li>
                <li>• Las modificaciones de horario requieren notificar a profesores y estudiantes</li>
                <li>• Los cambios de seguridad entrarán en vigor en la próxima sesión de usuarios</li>
                <li>• Recuerda hacer respaldo de la configuración antes de realizar cambios importantes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Summary */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Última actualización: {new Date().toLocaleDateString('es-CL')} a las {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>
              Sistema: EDU21 v2.0 | Estado: {hasChanges ? '⚠️ Cambios pendientes' : '✅ Actualizado'}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 