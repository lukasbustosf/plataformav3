'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Stat {
  id: string
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  icon?: ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo' | 'gray'
  href?: string
  loading?: boolean
}

interface StatsGridProps {
  stats: Stat[]
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  cardClassName?: string
  showChange?: boolean
  animated?: boolean
}

export function StatsGrid({
  stats,
  columns = 4,
  className,
  cardClassName,
  showChange = true,
  animated = true
}: StatsGridProps) {
  const getGridClasses = () => {
    switch (columns) {
      case 1:
        return 'grid-responsive-1'
      case 2:
        return 'grid-responsive-2'
      case 3:
        return 'grid-responsive-3'
      case 4:
        return 'stats-grid' // Uses 1->2->4 responsive pattern
      case 5:
        return 'grid-responsive-5'
      case 6:
        return 'grid-responsive-6'
      default:
        return 'stats-grid'
    }
  }

  const getColorClasses = (color: Stat['color'] = 'blue') => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      red: 'text-red-600 bg-red-100',
      purple: 'text-purple-600 bg-purple-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      gray: 'text-gray-600 bg-gray-100'
    }
    return colorMap[color]
  }

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return (
          <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'decrease':
        return (
          <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'neutral':
        return (
          <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      case 'neutral':
        return 'text-gray-600'
    }
  }

  const formatChange = (change: Stat['change']) => {
    if (!change) return null
    
    const sign = change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''
    return `${sign}${Math.abs(change.value)}%`
  }

  const renderStatCard = (stat: Stat, index: number) => {
    const CardComponent = stat.href ? 'a' : 'div'
    const cardProps = stat.href ? { href: stat.href } : {}

    return (
      <CardComponent
        key={stat.id}
        {...cardProps}
        className={cn(
          'stats-card transition-all duration-200',
          stat.href && 'hover:shadow-lg hover:scale-105 cursor-pointer',
          animated && 'animate-fade-in',
          cardClassName
        )}
        style={animated ? { animationDelay: `${index * 50}ms` } : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-mobile-xs font-medium text-gray-500 truncate">
              {stat.label}
            </p>
            <div className="mt-1 flex items-baseline">
              {stat.loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <p className="text-mobile-xl font-bold text-gray-900">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                  {showChange && stat.change && (
                    <div className={cn(
                      'ml-2 flex items-center text-xs font-medium',
                      getChangeColor(stat.change.type)
                    )}>
                      {getChangeIcon(stat.change.type)}
                      <span className="ml-1">{formatChange(stat.change)}</span>
                      {stat.change.period && (
                        <span className="ml-1 text-gray-500">vs {stat.change.period}</span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {stat.icon && (
            <div className={cn(
              'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg',
              getColorClasses(stat.color)
            )}>
              {stat.icon}
            </div>
          )}
        </div>
      </CardComponent>
    )
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {stats.map((stat, index) => renderStatCard(stat, index))}
    </div>
  )
}

// Convenience component for simple stats without icons
export function SimpleStatsGrid({
  stats,
  columns = 4,
  className
}: {
  stats: Array<{ label: string; value: string | number; id?: string }>
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  const mappedStats: Stat[] = stats.map((stat, index) => ({
    id: stat.id || index.toString(),
    label: stat.label,
    value: stat.value
  }))

  return (
    <StatsGrid
      stats={mappedStats}
      columns={columns}
      className={className}
      showChange={false}
      animated={false}
    />
  )
}

// Loading skeleton component
export function StatsGridSkeleton({
  count = 4,
  columns = 4,
  className
}: {
  count?: number
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}) {
  const skeletonStats: Stat[] = Array.from({ length: count }, (_, index) => ({
    id: `skeleton-${index}`,
    label: '',
    value: '',
    loading: true
  }))

  return (
    <StatsGrid
      stats={skeletonStats}
      columns={columns}
      className={className}
      showChange={false}
      animated={false}
    />
  )
} 