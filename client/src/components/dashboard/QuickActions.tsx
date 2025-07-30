import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface QuickAction {
  icon: ReactNode
  label: string
  description: string
  onClick: () => void
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  disabled?: boolean
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  className?: string
}

export function QuickActions({ actions, title = "Acciones Rápidas", className }: QuickActionsProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
    green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700',
    red: 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700',
    gray: 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
  }

  const iconColorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    gray: 'text-gray-500'
  }

  return (
    <div className={cn("card p-6", className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              'p-4 rounded-lg border-2 transition-all duration-200 text-left',
              'hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
              colorClasses[action.color],
              action.disabled && 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none'
            )}
          >
            <div className="flex items-start space-x-3">
              <div className={cn('flex-shrink-0', iconColorClasses[action.color])}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{action.label}</h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 