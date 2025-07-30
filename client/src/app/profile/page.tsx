'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UserCircleIcon, 
  CameraIcon, 
  AcademicCapIcon, 
  TrophyIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { getRoleDisplayName } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, fullName } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    bio: 'Apasionado por la educación y la tecnología. Me encanta crear experiencias de aprendizaje interactivas.',
    phone: '+56 9 1234 5678',
    specialties: ['Matemáticas', 'Tecnología Educativa', 'Gamificación'],
    experience: '8 años'
  })

  // Mock profile stats based on role
  const getProfileStats = () => {
    if (user?.role === 'TEACHER') {
      return [
        { label: 'Estudiantes', value: '156', icon: AcademicCapIcon, color: 'blue' },
        { label: 'Quizzes Creados', value: '24', icon: UserCircleIcon, color: 'green' },
        { label: 'Juegos Jugados', value: '89', icon: TrophyIcon, color: 'purple' },
        { label: 'Años de Experiencia', value: '8', icon: ClockIcon, color: 'orange' }
      ]
    } else if (user?.role === 'STUDENT') {
      return [
        { label: 'Juegos Jugados', value: '42', icon: TrophyIcon, color: 'blue' },
        { label: 'Promedio General', value: '6.8', icon: ChartBarIcon, color: 'green' },
        { label: 'Logros', value: '15', icon: StarIcon, color: 'purple' },
        { label: 'Días Activos', value: '124', icon: CalendarIcon, color: 'orange' }
      ]
    } else {
      return [
        { label: 'Colegios', value: '12', icon: AcademicCapIcon, color: 'blue' },
        { label: 'Usuarios', value: '1,234', icon: UserCircleIcon, color: 'green' },
        { label: 'Reportes', value: '56', icon: ChartBarIcon, color: 'purple' },
        { label: 'Meses Activo', value: '18', icon: CalendarIcon, color: 'orange' }
      ]
    }
  }

  const profileStats = getProfileStats()

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'quiz_created',
      title: 'Creaste "Quiz de Álgebra Básica"',
      timestamp: '2 horas',
      icon: '📝'
    },
    {
      id: 2,
      type: 'game_hosted',
      title: 'Iniciaste juego "Trivia de Geometría"',
      timestamp: '1 día',
      icon: '🎮'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Desbloqueaste "Maestro Innovador"',
      timestamp: '3 días',
      icon: '🏆'
    },
    {
      id: 4,
      type: 'report_viewed',
      title: 'Revisaste reporte de clase 8°A',
      timestamp: '5 días',
      icon: '📊'
    }
  ]

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast.success('Perfil actualizado exitosamente')
  }

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600'
      case 'green': return 'bg-green-100 text-green-600'
      case 'purple': return 'bg-purple-100 text-purple-600'
      case 'orange': return 'bg-orange-100 text-orange-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Mi Perfil 👤</h1>
          <p className="mt-2 opacity-90">
            Gestiona tu información personal y revisa tu actividad en EDU21
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              {/* Avatar Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50">
                    <CameraIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{fullName}</h2>
                <p className="text-gray-600">{getRoleDisplayName(user?.role || 'STUDENT')}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {user?.school_id || 'Colegio San Andrés'}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "secondary" : "primary"}
                  className="w-full"
                >
                  {isEditing ? 'Cancelar Edición' : 'Editar Perfil'}
                </Button>
                <Button variant="outline" className="w-full">
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full">
                  Configuración de Privacidad
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biografía
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="input-field"
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button onClick={handleSaveProfile}>
                      Guardar Cambios
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
                      <p className="mt-1 text-gray-900">{fullName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-gray-900">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                      <p className="mt-1 text-gray-900">{profileData.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Experiencia</label>
                      <p className="mt-1 text-gray-900">{profileData.experience}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Biografía</label>
                    <p className="mt-1 text-gray-900">{profileData.bio}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Especialidades</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {profileData.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-2 ${getStatColor(stat.color)}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">Hace {activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Toda la Actividad
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 