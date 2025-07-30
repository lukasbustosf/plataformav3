'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { StatsGrid } from '@/components/ui/statsGrid'
import { 
  PlayIcon, 
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  UserIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

export default function StudentDashboard() {
  const { user, fullName } = useAuth()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Mock data for dashboard
  const stats = {
    gamesPlayed: 24,
    averageScore: 87.5,
    achievementsUnlocked: 12,
    streak: 7,
    hoursStudied: 15.5,
    assignmentsCompleted: 18,
    totalAssignments: 22,
    upcomingTests: 3
  }

  // Convert stats to StatsGrid format
  const dashboardStats = [
    {
      id: 'games',
      label: 'Juegos Jugados',
      value: stats.gamesPlayed,
      icon: <PlayIcon className="h-5 w-5" />,
      color: 'green' as const,
      change: { value: 12, type: 'increase' as const, period: 'semana pasada' }
    },
    {
      id: 'score',
      label: 'Promedio',
      value: `${stats.averageScore}%`,
      icon: <TrophyIcon className="h-5 w-5" />,
      color: 'blue' as const,
      change: { value: 5.2, type: 'increase' as const, period: 'mes pasado' }
    },
    {
      id: 'achievements',
      label: 'Logros',
      value: stats.achievementsUnlocked,
      icon: <StarIcon className="h-5 w-5" />,
      color: 'yellow' as const,
      change: { value: 3, type: 'increase' as const, period: 'esta semana' }
    },
    {
      id: 'streak',
      label: 'Racha Actual',
      value: `${stats.streak} días`,
      icon: <FireIcon className="h-5 w-5" />,
      color: 'red' as const
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'game',
      title: 'Trivia de Matemáticas - Fracciones',
      score: 92,
      timestamp: '2024-01-19T14:30:00Z',
      subject: 'Matemáticas',
      icon: '🎯'
    },
    {
      id: 2,
      type: 'assignment',
      title: 'Ensayo sobre la Independencia de Chile',
      status: 'submitted',
      timestamp: '2024-01-19T10:15:00Z',
      subject: 'Historia',
      icon: '📝'
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Maestro de las Fracciones',
      description: 'Completaste 10 actividades de fracciones consecutivas',
      timestamp: '2024-01-18T16:45:00Z',
      icon: '🏆'
    },
    {
      id: 4,
      type: 'grade',
      title: 'Evaluación de Ciencias - Sistema Solar',
      grade: 6.8,
      timestamp: '2024-01-18T09:20:00Z',
      subject: 'Ciencias',
      icon: '⭐'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Evaluación de Matemáticas',
      subject: 'Matemáticas',
      date: '2024-01-25T10:00:00Z',
      type: 'test'
    },
    {
      id: 2,
      title: 'Entrega Proyecto de Historia',
      subject: 'Historia',
      date: '2024-01-23T23:59:00Z',
      type: 'assignment'
    },
    {
      id: 3,
      title: 'Experimento de Química',
      subject: 'Ciencias',
      date: '2024-01-26T14:00:00Z',
      type: 'lab'
    }
  ]

  const availableGames = [
    {
      id: 1,
      title: 'Quiz Rápido de Historia',
      subject: 'Historia',
      difficulty: 'Medio',
      players: 12,
      timeLimit: 15,
      isActive: true
    },
    {
      id: 2,
      title: 'Desafío de Vocabulario en Inglés',
      subject: 'Inglés',
      difficulty: 'Fácil',
      players: 8,
      timeLimit: 20,
      isActive: true
    }
  ]

  const achievements = [
    { name: 'Racha de 7 días', icon: '🔥', unlocked: true },
    { name: 'Maestro de Matemáticas', icon: '🧮', unlocked: true },
    { name: 'Explorador de Ciencias', icon: '🔬', unlocked: true },
    { name: 'Escritor Experto', icon: '✍️', unlocked: false },
    { name: 'Políglota', icon: '🌍', unlocked: false },
    { name: 'Historiador', icon: '📚', unlocked: false }
  ]

  const quickActions = [
    {
      title: 'Jugar Ahora',
      description: 'Únete a un juego activo',
      icon: <PlayIcon className="h-6 w-6" />,
      color: 'bg-green-500',
      action: () => router.push('/student/games')
    },
    {
      title: 'Ver Tareas',
      description: 'Revisa tus asignaciones',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'bg-blue-500',
      action: () => router.push('/student/assignments')
    },
    {
      title: 'Mi Progreso',
      description: 'Analiza tu rendimiento',
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'bg-purple-500',
      action: () => router.push('/student/progress')
    },
    {
      title: 'Materiales',
      description: 'Accede a recursos de estudio',
      icon: <BookOpenIcon className="h-6 w-6" />,
      color: 'bg-orange-500',
      action: () => router.push('/student/materials')
    }
  ]

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'test': return '📝'
      case 'assignment': return '📋'
      case 'lab': return '🔬'
      default: return '📅'
    }
  }

  const getDaysUntil = (dateString: string) => {
    const eventDate = new Date(dateString)
    const now = new Date()
    const diffTime = eventDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Mañana'
    if (diffDays < 0) return 'Vencido'
    return `En ${diffDays} días`
  }

  return (
    <DashboardLayout>
      <div className="section-spacing">
        {/* Welcome Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-mobile text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="page-title text-white">¡Hola, {fullName}! 👋</h1>
              <p className="page-subtitle text-white/90 mt-2">
                ¡Bienvenido de vuelta! Tienes {availableGames.length} juegos activos esperándote.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:text-right gap-4">
              <div className="flex items-center text-yellow-300">
                <FireIcon className="h-5 w-5 mr-1" />
                <span className="font-bold">{stats.streak} días</span>
              </div>
              <span className="text-mobile-sm text-white/80">Racha actual</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Responsive */}
        <StatsGrid stats={dashboardStats} className="animate-fade-in" />

        {/* Quick Actions - Mobile First Grid */}
        <div className="card-responsive p-mobile">
          <h2 className="page-title mb-4">Acciones Rápidas</h2>
          <div className="grid-responsive-2 gap-mobile">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group hover:shadow-md touch-manipulation"
              >
                <div className="flex items-start space-x-3">
                  <div className={`${action.color} p-2 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-mobile-sm font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-mobile-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout for larger screens */}
        <div className="grid-responsive-1 lg:grid-cols-2 gap-mobile">
          {/* Recent Activities */}
          <div className="card-responsive p-mobile">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="page-title">Actividad Reciente</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/student/progress')}
                className="btn-responsive"
              >
                Ver Todo
              </Button>
            </div>
            <div className="space-y-3">
              {recentActivities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="text-2xl sm:text-xl flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-mobile-sm font-medium text-gray-900 truncate">{activity.title}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1">
                      <span className="text-mobile-xs text-gray-600">{activity.subject}</span>
                      {activity.score && (
                        <span className="text-mobile-xs font-semibold text-green-600">
                          {activity.score}%
                        </span>
                      )}
                      {activity.grade && (
                        <span className="text-mobile-xs font-semibold text-blue-600">
                          Nota: {activity.grade}
                        </span>
                      )}
                    </div>
                    <p className="text-mobile-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card-responsive p-mobile">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="page-title">Próximos Eventos</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/student/calendar')}
                className="btn-responsive"
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Ver Calendario
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="text-2xl sm:text-xl flex-shrink-0">{getEventTypeIcon(event.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-mobile-sm font-medium text-gray-900 truncate">{event.title}</h4>
                    <p className="text-mobile-xs text-gray-600">{event.subject}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-mobile-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('es-CL')}
                      </span>
                      <span className={`text-mobile-xs px-2 py-1 rounded-full ${
                        getDaysUntil(event.date) === 'Hoy' ? 'bg-red-100 text-red-800' :
                        getDaysUntil(event.date) === 'Mañana' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getDaysUntil(event.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Games - Full Width */}
        <div className="card-responsive p-mobile">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="page-title">Juegos Activos</h2>
            <Button 
              onClick={() => router.push('/student/games')}
              className="btn-responsive"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Ver Todos los Juegos
            </Button>
          </div>
          <div className="grid-responsive-1 sm:grid-cols-2 gap-mobile">
            {availableGames.map((game) => (
              <div key={game.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-mobile-sm font-semibold text-gray-900">{game.title}</h3>
                    <p className="text-mobile-xs text-gray-600">{game.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-mobile-xs ${
                      game.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                      game.difficulty === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-4 text-mobile-xs text-gray-600">
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {game.players} jugadores
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {game.timeLimit} min
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => router.push(`/student/games/${game.id}`)}
                    className="btn-responsive w-full sm:w-auto"
                  >
                    Unirse
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements - Mobile Optimized */}
        <div className="card-responsive p-mobile">
          <h2 className="page-title mb-4">Logros</h2>
          <div className="grid-responsive-3 sm:grid-cols-4 lg:grid-cols-6 gap-mobile">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`text-center p-3 rounded-lg border transition-all ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <p className={`text-mobile-xs font-medium ${
                  achievement.unlocked ? 'text-green-800' : 'text-gray-600'
                }`}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 