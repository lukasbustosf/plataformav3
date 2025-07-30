import { ReactNode } from 'react'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, UsersIcon, AcademicCapIcon, ChartBarIcon, ClockIcon, BookOpenIcon, PlayIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

interface SimpleDashboardCardProps {
  title: string
  value: string
  iconName?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'stable'
  }
  description?: string
  onClick?: () => void
  loading?: boolean
}

// Simple icon mapping to avoid React component issues
const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'users':
      return <UsersIcon className={className} />
    case 'academic':
      return <AcademicCapIcon className={className} />
    case 'chart':
      return <ChartBarIcon className={className} />
    case 'clock':
      return <ClockIcon className={className} />
    case 'book':
      return <BookOpenIcon className={className} />
    case 'play':
      return <PlayIcon className={className} />
    default:
      return <div className={cn(className, 'bg-gray-300 rounded')} />
  }
}

export function DashboardCard({ 
  title, 
  value, 
  iconName = 'users',
  color = 'blue',
  trend,
  description,
  onClick,
  loading = false
}: SimpleDashboardCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
    gray: 'bg-gray-50'
  }

  const getTrendIcon = () => {
    if (!trend) return null
    
    switch (trend.direction) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      case 'stable':
        return <MinusIcon className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getTrendColor = () => {
    if (!trend) return ''
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      case 'stable':
        return 'text-gray-600'
      default:
        return ''
    }
  }

  return (
    <div
      className={cn(
        'card p-6 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-lg hover:-translate-y-1',
        loading && 'animate-pulse'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3',
              bgColorClasses[color]
            )}>
              {getIcon(iconName, cn('h-6 w-6', colorClasses[color]))}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              
              {loading ? (
                <div className="mt-1 w-16 h-8 bg-gray-200 rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-bold text-gray-900">{value}</span>
                  
                  {trend && (
                    <span className={cn('ml-2 flex items-center text-sm font-medium', getTrendColor())}>
                      {getTrendIcon()}
                      <span className="ml-1">
                        {trend.value}%
                      </span>
                    </span>
                  )}
                </div>
              )}
              
              {description && (
                <p className="mt-2 text-xs text-gray-500">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 