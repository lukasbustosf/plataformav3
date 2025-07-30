import { useState } from 'react'
import { 
  ClockIcon,
  PlayIcon,
  BookOpenIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import { formatDate, formatTimeAgo, cn } from '@/lib/utils'

interface ActivityItem {
  id: string
  type: 'quiz_created' | 'game_played' | 'class_taught' | 'student_joined' | 'achievement' | 'quiz_completed'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'warning' | 'error'
  metadata?: {
    score?: number
    duration?: number
    participants?: number
    subject?: string
  }
}

interface RecentActivityProps {
  limit?: number
  showAll?: boolean
  className?: string
}

export function RecentActivity({ limit = 10, showAll = false, className }: RecentActivityProps) {
  const [viewMode, setViewMode] = useState<'recent' | 'all'>('recent')

  // Mock data - in real app this would come from API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'game_played',
      title: 'Juego Trivia Lightning completado',
      description: 'Matemática 6° Básico - "Fracciones y Decimales"',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'success',
      metadata: {
        participants: 28,
        duration: 15,
        score: 85
      }
    },
    {
      id: '2',
      type: 'quiz_created',
      title: 'Nuevo quiz creado',
      description: 'Historia 7° Básico - "Civilizaciones Precolombinas"',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'success',
      metadata: {
        subject: 'Historia'
      }
    },
    {
      id: '3',
      type: 'achievement',
      title: '¡Nuevo logro desbloqueado!',
      description: 'Creador de Contenido - Has creado 10 quizzes',
      timestamp: '2024-01-15T08:45:00Z',
      status: 'success'
    },
    {
      id: '4',
      type: 'class_taught',
      title: 'Clase finalizada',
      description: 'Lenguaje 5° Básico - "Comprensión Lectora"',
      timestamp: '2024-01-14T11:30:00Z',
      status: 'success',
      metadata: {
        participants: 32,
        duration: 45
      }
    },
    {
      id: '5',
      type: 'quiz_completed',
      title: 'Quiz AI generado',
      description: 'Ciencias 8° Básico - "Sistema Solar"',
      timestamp: '2024-01-14T10:00:00Z',
      status: 'success',
      metadata: {
        subject: 'Ciencias'
      }
    }
  ]

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconClasses = "h-5 w-5"
    
    switch (type) {
      case 'quiz_created':
        return <BookOpenIcon className={iconClasses} />
      case 'game_played':
        return <PlayIcon className={iconClasses} />
      case 'class_taught':
        return <UsersIcon className={iconClasses} />
      case 'student_joined':
        return <UsersIcon className={iconClasses} />
      case 'achievement':
        return <TrophyIcon className={iconClasses} />
      case 'quiz_completed':
        return <SparklesIcon className={iconClasses} />
      default:
        return <ClockIcon className={iconClasses} />
    }
  }

  const getActivityColor = (type: ActivityItem['type'], status?: string) => {
    if (status === 'error') return 'text-red-500 bg-red-50'
    if (status === 'warning') return 'text-yellow-500 bg-yellow-50'
    
    switch (type) {
      case 'quiz_created':
        return 'text-blue-500 bg-blue-50'
      case 'game_played':
        return 'text-green-500 bg-green-50'
      case 'class_taught':
        return 'text-purple-500 bg-purple-50'
      case 'student_joined':
        return 'text-indigo-500 bg-indigo-50'
      case 'achievement':
        return 'text-yellow-500 bg-yellow-50'
      case 'quiz_completed':
        return 'text-purple-500 bg-purple-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Hace unos momentos'
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`
    
    return formatDate(timestamp)
  }

  const displayedActivities = showAll ? activities : activities.slice(0, limit)

  return (
    <div className={cn("card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
        
        {!showAll && activities.length > limit && (
          <button
            onClick={() => setViewMode(viewMode === 'recent' ? 'all' : 'recent')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {viewMode === 'recent' ? 'Ver todo' : 'Ver menos'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                getActivityColor(activity.type, activity.status)
              )}>
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    
                    {/* Metadata */}
                    {activity.metadata && (
                      <div className="flex items-center space-x-4 mt-2">
                        {activity.metadata.participants && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <UsersIcon className="h-3 w-3" />
                            <span>{activity.metadata.participants} participantes</span>
                          </div>
                        )}
                        
                        {activity.metadata.duration && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3" />
                            <span>{activity.metadata.duration} min</span>
                          </div>
                        )}
                        
                        {activity.metadata.score && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <TrophyIcon className="h-3 w-3" />
                            <span>{activity.metadata.score}% promedio</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0 ml-2">
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay actividad reciente</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tu actividad aparecerá aquí cuando crees quizzes o juegues
            </p>
          </div>
        )}
      </div>

      {/* Load more button for extensive lists */}
      {viewMode === 'all' && activities.length > 20 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Cargar más actividades
          </button>
        </div>
      )}
    </div>
  )
} 