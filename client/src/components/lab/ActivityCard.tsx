'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Star, Eye, PlayCircle, Heart, BookOpen } from 'lucide-react'

interface ActivityCardProps {
  activity: {
    id: string
    title: string
    slug: string
    description: string
    cover_image_url: string
    oa_ids: string[]
    bloom_level: string
    target_cycle: string
    duration_minutes: number
    group_size: number
    difficulty_level: number
    video_url?: string
    author: string
    is_favorite?: boolean
    lab_activity_metrics?: {
      total_executions: number
      avg_rating: number
      unique_teachers: number
    }
  }
  onFavoriteToggle?: (activityId: string, isFavorite: boolean) => Promise<void>
  onQuickRegister?: (activity: any) => void
  showActions?: boolean
}

const bloomLevelColors = {
  recordar: 'bg-slate-100 text-slate-800',
  comprender: 'bg-blue-100 text-blue-800',
  aplicar: 'bg-green-100 text-green-800',
  analizar: 'bg-yellow-100 text-yellow-800',
  evaluar: 'bg-orange-100 text-orange-800',
  crear: 'bg-red-100 text-red-800'
}

const bloomLevelIcons = {
  recordar: '🧠',
  comprender: '💡',
  aplicar: '🔧',
  analizar: '🔍',
  evaluar: '⚖️',
  crear: '🎨'
}

const cycleLevelColors = {
  PK: 'bg-pink-100 text-pink-800',
  K1: 'bg-purple-100 text-purple-800',
  K2: 'bg-indigo-100 text-indigo-800',
  '1B': 'bg-emerald-100 text-emerald-800',
  '2B': 'bg-teal-100 text-teal-800'
}

export function ActivityCard({ 
  activity, 
  onFavoriteToggle, 
  onQuickRegister,
  showActions = true 
}: ActivityCardProps) {
  const [isFavoriteLoading, setIsFavoriteLoading] = React.useState(false)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!onFavoriteToggle) return
    
    setIsFavoriteLoading(true)
    try {
      await onFavoriteToggle(activity.id, !activity.is_favorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsFavoriteLoading(false)
    }
  }

  const handleQuickRegister = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onQuickRegister) {
      onQuickRegister(activity)
    }
  }

  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < level 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  const formatOAIds = (oaIds: string[]) => {
    if (!oaIds || oaIds.length === 0) return []
    return oaIds.slice(0, 3) // Mostrar máximo 3 OA
  }

  return (
    <div className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-200 rounded-lg">
      {/* Imagen de portada */}
      <div className="relative h-48 w-full overflow-hidden">
        <Link href={`/lab/activity/${activity.slug}`}>
          {activity.cover_image_url ? (
            <Image
              src={activity.cover_image_url}
              alt={activity.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </Link>

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <span 
            className={`${cycleLevelColors[activity.target_cycle as keyof typeof cycleLevelColors] || 'bg-gray-100 text-gray-800'} text-xs font-medium px-2 py-1 rounded-full`}
          >
            {activity.target_cycle}
          </span>
          
          {activity.video_url && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
              <PlayCircle className="w-3 h-3 mr-1" />
              Video
            </span>
          )}
        </div>

        {/* Botón de favorito */}
        {showActions && onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            disabled={isFavoriteLoading}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-50"
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                activity.is_favorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>
        )}

        {/* Indicador de dificultad */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          {getDifficultyStars(activity.difficulty_level)}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-2">
          {/* Título */}
          <Link href={`/teacher/labs/activity/${activity.slug}`}>
            <h3 className="font-semibold text-lg leading-6 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {activity.title}
            </h3>
          </Link>

          {/* Nivel de Bloom */}
          <div className="flex items-center gap-2">
            <span 
              className={`${bloomLevelColors[activity.bloom_level as keyof typeof bloomLevelColors]} border-0 text-xs font-medium px-2 py-1 rounded-full`}
            >
              <span className="mr-1">
                {bloomLevelIcons[activity.bloom_level as keyof typeof bloomLevelIcons]}
              </span>
              {activity.bloom_level.charAt(0).toUpperCase() + activity.bloom_level.slice(1)}
            </span>
          </div>

          {/* OA Tags */}
          {formatOAIds(activity.oa_ids).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formatOAIds(activity.oa_ids).map((oa, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-2 py-1 rounded-full"
                >
                  {oa}
                </span>
              ))}
              {activity.oa_ids.length > 3 && (
                <span className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-2 py-1 rounded-full">
                  +{activity.oa_ids.length - 3} más
                </span>
              )}
            </div>
          )}
        </div>

        {/* Descripción */}
        {activity.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-3 mb-3">
            {activity.description}
          </p>
        )}

        {/* Metadatos */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1" title="Duración estimada">
              <Clock className="w-3 h-3" />
              <span>{activity.duration_minutes}min</span>
            </div>

            <div className="flex items-center gap-1" title="Tamaño de grupo recomendado">
              <Users className="w-3 h-3" />
              <span>{activity.group_size}</span>
            </div>
          </div>

          {/* Estadísticas de uso */}
          {activity.lab_activity_metrics && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" title="Veces ejecutada">
                <Eye className="w-3 h-3" />
                <span>{activity.lab_activity_metrics.total_executions}</span>
              </div>

              {activity.lab_activity_metrics.avg_rating > 0 && (
                <div className="flex items-center gap-1" title="Calificación promedio">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{activity.lab_activity_metrics.avg_rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones */}
        {showActions && (
          <div className="flex gap-2 w-full">
            <Link 
              href={`/teacher/labs/activity/${activity.slug}`}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver detalle
            </Link>
            
            {onQuickRegister && (
              <button 
                onClick={handleQuickRegister}
                className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                📝 Registrar
              </button>
            )}
          </div>
        )}

        {/* Autor */}
        <div className="mt-2 text-xs text-gray-400">
          por {activity.author}
        </div>
      </div>
    </div>
  )
} 