import { useState } from 'react'
import { 
  UsersIcon, 
  ClockIcon, 
  CalendarIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { formatDate, formatTimeAgo, cn } from '@/lib/utils'
import type { Class } from '@/types'

interface ClassCardProps {
  classData: Class
  onViewDetails: () => void
  onTakeAttendance: () => void
  onStartLesson?: () => void
  showActions?: boolean
  className?: string
}

export function ClassCard({
  classData,
  onViewDetails,
  onTakeAttendance,
  onStartLesson,
  showActions = true,
  className
}: ClassCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  const getNextClass = () => {
    // This would typically come from a schedule API
    return {
      day: 'Lunes',
      time: '08:30',
      room: 'Sala 101'
    }
  }

  const nextClass = getNextClass()
  const studentCount = classData.students?.length || 0
  const attendanceRate = 95 // Mock attendance rate

  return (
    <div
      className={cn(
        'card p-6 transition-all duration-200 hover:shadow-md',
        isHovered && 'transform hover:-translate-y-0.5',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <AcademicCapIcon className="h-5 w-5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {classData.grade_levels?.grade_name || classData.grade_code}
            </span>
            {classData.subjects && (
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full',
                getSubjectColor(classData.subjects.subject_name)
              )}>
                {classData.subjects.subject_name}
              </span>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {classData.class_name}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <UsersIcon className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{studentCount}</p>
            <p className="text-xs text-gray-500">Estudiantes</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{attendanceRate}%</p>
            <p className="text-xs text-gray-500">Asistencia</p>
          </div>
        </div>
      </div>

      {/* Next Class Info */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">Próxima clase</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {nextClass.day} {nextClass.time}
            </p>
            <p className="text-xs text-gray-500">{nextClass.room}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
          Actividad Reciente
        </h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Última clase</span>
            <span className="text-gray-900 font-medium">Ayer 10:30</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Último quiz</span>
            <span className="text-gray-900 font-medium">Hace 3 días</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<EyeIcon className="h-4 w-4" />}
            onClick={onViewDetails}
            className="flex-1"
          >
            Ver Detalles
          </Button>
          
          <Button
            size="sm"
            variant="primary"
            leftIcon={<ClipboardDocumentCheckIcon className="h-4 w-4" />}
            onClick={onTakeAttendance}
            className="flex-1"
          >
            Asistencia
          </Button>
        </div>
      )}
    </div>
  )
} 