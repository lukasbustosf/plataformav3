import { useState } from 'react'
import { 
  PlayIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Menu } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { formatDate, getGameFormatDisplayName, cn } from '@/lib/utils'
import type { Quiz } from '@/types'

interface QuizCardProps {
  quiz: Quiz
  onEdit: () => void
  onView: () => void
  onStartGame: () => void
  onDelete: () => void
  onDuplicate?: () => void
  showActions?: boolean
  className?: string
}

export function QuizCard({
  quiz,
  onEdit,
  onView,
  onStartGame,
  onDelete,
  onDuplicate,
  showActions = true,
  className
}: QuizCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getModeIcon = () => {
    switch (quiz.mode) {
      case 'ai':
        return <SparklesIcon className="h-4 w-4 text-purple-500" />
      case 'manual':
        return <PencilIcon className="h-4 w-4 text-blue-500" />
      default:
        return <BookOpenIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getModeLabel = () => {
    switch (quiz.mode) {
      case 'ai':
        return 'Generado con IA'
      case 'manual':
        return 'Manual'
      default:
        return 'Quiz'
    }
  }

  const getSubjectColor = (subjectName?: string) => {
    if (!subjectName) return 'bg-gray-100 text-gray-700'
    
    const colors: { [key: string]: string } = {
      'Matemática': 'bg-blue-100 text-blue-700',
      'Lenguaje': 'bg-green-100 text-green-700',
      'Historia': 'bg-orange-100 text-orange-700',
      'Ciencias': 'bg-purple-100 text-purple-700',
      'Inglés': 'bg-pink-100 text-pink-700',
      'Educación Física': 'bg-red-100 text-red-700',
      'Arte': 'bg-yellow-100 text-yellow-700'
    }

    return colors[subjectName] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div
      className={cn(
        'card p-6 transition-all duration-200 hover:shadow-lg',
        isHovered && 'transform hover:-translate-y-1',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {getModeIcon()}
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {getModeLabel()}
            </span>
            {/* Subject badge - would need to fetch from related tables */}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {quiz.title}
          </h3>
          
          {quiz.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {quiz.description}
            </p>
          )}
        </div>

        {showActions && (
          <Menu as="div" className="relative">
            <Menu.Button className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
            </Menu.Button>
            
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onView}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-sm',
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    <EyeIcon className="mr-3 h-4 w-4" />
                    Ver Detalles
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onEdit}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-sm',
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    <PencilIcon className="mr-3 h-4 w-4" />
                    Editar
                  </button>
                )}
              </Menu.Item>
              
              {onDuplicate && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onDuplicate}
                      className={cn(
                        'flex w-full items-center px-4 py-2 text-sm',
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      )}
                    >
                      <BookOpenIcon className="mr-3 h-4 w-4" />
                      Duplicar
                    </button>
                  )}
                </Menu.Item>
              )}
              
              <div className="border-t border-gray-100 my-1" />
              
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onDelete}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-sm',
                      active ? 'bg-red-50 text-red-700' : 'text-red-600'
                    )}
                  >
                    <TrashIcon className="mr-3 h-4 w-4" />
                    Eliminar
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <BookOpenIcon className="h-4 w-4" />
          <span>{quiz.questions?.length || 0} preguntas</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <ClockIcon className="h-4 w-4" />
          <span>Sin límite</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <UserGroupIcon className="h-4 w-4" />
          <span>General</span>
        </div>
      </div>

      {/* Learning Objectives */}
      {false && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {/* Learning objectives would be loaded from related tables */}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {quiz.updated_at ? `Actualizado ${formatDate(quiz.updated_at)}` : 
           quiz.created_at ? `Creado ${formatDate(quiz.created_at)}` : ''}
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<EyeIcon className="h-4 w-4" />}
            onClick={onView}
          >
            Ver
          </Button>
          
          <Button
            size="sm"
            variant="game"
            leftIcon={<PlayIcon className="h-4 w-4" />}
            onClick={onStartGame}
          >
            Jugar
          </Button>
        </div>
      </div>
    </div>
  )
} 