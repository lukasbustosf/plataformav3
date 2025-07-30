'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  PencilIcon,
  CameraIcon,
  KeyIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function StudentProfile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'María José',
    lastName: 'González Pérez',
    email: 'maria.gonzalez@estudiante.edu',
    phone: '+56 9 8765 4321',
    birthDate: '2008-03-15',
    address: 'Av. Providencia 1234, Providencia',
    emergencyContact: 'Carmen Pérez (Madre)',
    emergencyPhone: '+56 9 1234 5678',
    bloodType: 'O+',
    allergies: 'Ninguna conocida',
    medications: 'Ninguna'
  })

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      grades: true,
      assignments: true,
      games: false,
      announcements: true
    },
    privacy: {
      profileVisibility: 'classmates',
      showGrades: false,
      showProgress: true
    },
    preferences: {
      language: 'es',
      theme: 'light',
      timezone: 'America/Santiago'
    }
  })

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: UserIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'privacy', name: 'Privacidad', icon: ShieldCheckIcon },
    { id: 'security', name: 'Seguridad', icon: KeyIcon }
  ]

  const academicInfo = {
    studentId: 'EST2024001',
    grade: '8° Básico',
    section: 'A',
    enrollmentDate: '2024-03-01',
    guardian: 'Carmen Pérez González',
    guardianEmail: 'carmen.perez@email.com',
    guardianPhone: '+56 9 1234 5678'
  }

  const subjects = [
    { name: 'Matemáticas', teacher: 'Prof. García', currentGrade: 6.2 },
    { name: 'Historia', teacher: 'Prof. Rodríguez', currentGrade: 6.8 },
    { name: 'Ciencias', teacher: 'Prof. Martínez', currentGrade: 6.4 },
    { name: 'Lenguaje', teacher: 'Prof. Silva', currentGrade: 6.6 },
    { name: 'Inglés', teacher: 'Prof. Brown', currentGrade: 5.9 },
    { name: 'Ed. Física', teacher: 'Prof. López', currentGrade: 6.9 }
  ]

  const handleSave = () => {
    // Here you would typically make an API call to save the profile data
    setEditMode(false)
    // Show success toast
  }

  const handleCancel = () => {
    // Reset to original data
    setEditMode(false)
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture and Basic Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50">
              <CameraIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-600">{academicInfo.grade} - Sección {academicInfo.section}</p>
                <p className="text-sm text-gray-500">ID: {academicInfo.studentId}</p>
              </div>
              <Button
                variant={editMode ? "outline" : "primary"}
                onClick={() => setEditMode(!editMode)}
                leftIcon={editMode ? <EyeIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
              >
                {editMode ? 'Ver Perfil' : 'Editar Perfil'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-gray-400" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>{new Date(profileData.birthDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span>{profileData.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
            {editMode ? (
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
            {editMode ? (
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.lastName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
            {editMode ? (
              <input
                type="date"
                value={profileData.birthDate}
                onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{new Date(profileData.birthDate).toLocaleDateString()}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            {editMode ? (
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.phone}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            {editMode ? (
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profileData.address}</p>
            )}
          </div>
        </div>
        
        {editMode && (
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de Emergencia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
            <p className="text-gray-900">{profileData.emergencyContact}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <p className="text-gray-900">{profileData.emergencyPhone}</p>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Académica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
            <p className="text-gray-900">{academicInfo.grade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sección</label>
            <p className="text-gray-900">{academicInfo.section}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Matrícula</label>
            <p className="text-gray-900">{new Date(academicInfo.enrollmentDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apoderado</label>
            <p className="text-gray-900">{academicInfo.guardian}</p>
          </div>
        </div>
      </div>

      {/* Current Subjects */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Materias Actuales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{subject.name}</p>
                <p className="text-sm text-gray-600">{subject.teacher}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                subject.currentGrade >= 6.0 ? 'bg-green-100 text-green-800' : 
                subject.currentGrade >= 5.0 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {subject.currentGrade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Preferencias de Notificaciones</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Métodos de Notificación</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Notificaciones por email</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, push: e.target.checked }
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Notificaciones push</span>
            </label>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Tipos de Notificación</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.grades}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, grades: e.target.checked }
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Nuevas calificaciones</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.assignments}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, assignments: e.target.checked }
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Nuevas tareas</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.games}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, games: e.target.checked }
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Invitaciones a juegos</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.notifications.announcements}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, announcements: e.target.checked }
                })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Anuncios importantes</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button>Guardar Preferencias</Button>
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Privacidad</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibilidad del perfil
          </label>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => setSettings({
              ...settings,
              privacy: { ...settings.privacy, profileVisibility: e.target.value }
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="private">Solo yo</option>
            <option value="classmates">Compañeros de clase</option>
            <option value="school">Toda la escuela</option>
          </select>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.privacy.showGrades}
              onChange={(e) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, showGrades: e.target.checked }
              })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">Mostrar calificaciones a compañeros</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.privacy.showProgress}
              onChange={(e) => setSettings({
                ...settings,
                privacy: { ...settings.privacy, showProgress: e.target.checked }
              })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">Mostrar progreso académico</span>
          </label>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button>Guardar Configuración</Button>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Cambiar Contraseña</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña actual
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button>Cambiar Contraseña</Button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Autenticación de Dos Factores</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-900">Activar autenticación de dos factores</p>
            <p className="text-xs text-gray-500">Agrega una capa adicional de seguridad a tu cuenta</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">👤 Mi Perfil</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}
            {activeTab === 'security' && renderSecurityTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 