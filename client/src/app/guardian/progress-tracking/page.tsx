'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ActivityProgress {
  id: string
  type: 'academic' | 'game' | 'extracurricular' | 'reading' | 'project'
  title: string
  subject?: string
  progress: number
  totalActivities: number
  completedActivities: number
  averageScore: number
  timeSpent: number // in minutes
  lastActivity: string
  streak: number
  achievements: Achievement[]
  skillsImproved: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface WeeklyGoal {
  id: string
  category: string
  target: number
  current: number
  unit: string
  description: string
  deadline: string
  priority: 'low' | 'medium' | 'high'
}

export default function GuardianProgressTrackingPage() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data for child info
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    level: 'Avanzado',
    totalXP: 2580,
    weeklyXP: 180,
    overallProgress: 78
  }

  const activityProgress: ActivityProgress[] = [
    {
      id: 'prog-001',
      type: 'academic',
      title: 'Matemáticas - Álgebra Básica',
      subject: 'Matemáticas',
      progress: 85,
      totalActivities: 20,
      completedActivities: 17,
      averageScore: 88,
      timeSpent: 240,
      lastActivity: '2024-12-19',
      streak: 5,
      achievements: [
        {
          id: 'ach-001',
          title: 'Maestro de Ecuaciones',
          description: 'Resolvió 50 ecuaciones lineales correctamente',
          icon: '🧮',
          dateEarned: '2024-12-15',
          rarity: 'rare'
        }
      ],
      skillsImproved: ['Resolución de problemas', 'Pensamiento lógico']
    },
    {
      id: 'prog-002',
      type: 'game',
      title: 'Trivia Ciencias Naturales',
      subject: 'Ciencias',
      progress: 92,
      totalActivities: 15,
      completedActivities: 14,
      averageScore: 94,
      timeSpent: 180,
      lastActivity: '2024-12-18',
      streak: 8,
      achievements: [
        {
          id: 'ach-002',
          title: 'Explorador Científico',
          description: 'Completó 10 juegos de ciencias consecutivos',
          icon: '🔬',
          dateEarned: '2024-12-18',
          rarity: 'epic'
        }
      ],
      skillsImproved: ['Conocimiento científico', 'Curiosidad']
    },
    {
      id: 'prog-003',
      type: 'reading',
      title: 'Programa de Lectura Mensual',
      progress: 67,
      totalActivities: 12,
      completedActivities: 8,
      averageScore: 85,
      timeSpent: 420,
      lastActivity: '2024-12-17',
      streak: 3,
      achievements: [
        {
          id: 'ach-003',
          title: 'Devorador de Libros',
          description: 'Leyó 5 libros en un mes',
          icon: '📚',
          dateEarned: '2024-12-10',
          rarity: 'common'
        }
      ],
      skillsImproved: ['Comprensión lectora', 'Vocabulario']
    },
    {
      id: 'prog-004',
      type: 'project',
      title: 'Proyecto de Historia: Chile Colonial',
      subject: 'Historia',
      progress: 45,
      totalActivities: 8,
      completedActivities: 4,
      averageScore: 90,
      timeSpent: 300,
      lastActivity: '2024-12-16',
      streak: 2,
      achievements: [],
      skillsImproved: ['Investigación', 'Comunicación escrita']
    },
    {
      id: 'prog-005',
      type: 'extracurricular',
      title: 'Taller de Arte y Creatividad',
      progress: 80,
      totalActivities: 10,
      completedActivities: 8,
      averageScore: 92,
      timeSpent: 360,
      lastActivity: '2024-12-19',
      streak: 4,
      achievements: [
        {
          id: 'ach-004',
          title: 'Artista Emergente',
          description: 'Completó 5 proyectos artísticos',
          icon: '🎨',
          dateEarned: '2024-12-12',
          rarity: 'rare'
        }
      ],
      skillsImproved: ['Creatividad', 'Expresión artística']
    }
  ]

  const weeklyGoals: WeeklyGoal[] = [
    {
      id: 'goal-001',
      category: 'Lectura',
      target: 3,
      current: 2,
      unit: 'libros',
      description: 'Leer 3 libros esta semana',
      deadline: '2024-12-22',
      priority: 'medium'
    },
    {
      id: 'goal-002',
      category: 'Matemáticas',
      target: 20,
      current: 15,
      unit: 'ejercicios',
      description: 'Completar 20 ejercicios de álgebra',
      deadline: '2024-12-21',
      priority: 'high'
    },
    {
      id: 'goal-003',
      category: 'Juegos Educativos',
      target: 5,
      current: 8,
      unit: 'sesiones',
      description: 'Participar en 5 juegos educativos',
      deadline: '2024-12-22',
      priority: 'low'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const filteredActivities = activityProgress.filter(activity => {
    if (selectedCategory === 'all') return true
    return activity.type === selectedCategory
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600 bg-green-100'
    if (progress >= 70) return 'text-blue-600 bg-blue-100'
    if (progress >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-700 bg-purple-100 border-purple-300'
      case 'epic': return 'text-indigo-700 bg-indigo-100 border-indigo-300'
      case 'rare': return 'text-blue-700 bg-blue-100 border-blue-300'
      case 'common': return 'text-gray-700 bg-gray-100 border-gray-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'academic': return <AcademicCapIcon className="h-6 w-6 text-blue-600" />
      case 'game': return <PlayIcon className="h-6 w-6 text-green-600" />
      case 'reading': return <BookOpenIcon className="h-6 w-6 text-purple-600" />
      case 'project': return <ClockIcon className="h-6 w-6 text-orange-600" />
      case 'extracurricular': return <StarIcon className="h-6 w-6 text-pink-600" />
      default: return <ChartBarIcon className="h-6 w-6 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const handleExportReport = () => {
    toast.success('Generando reporte de progreso...')
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seguimiento de Progreso</h1>
              <p className="text-gray-600 mt-2">
                Progreso académico y actividades de {childInfo.name}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Button
                onClick={handleExportReport}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Nivel Actual</p>
                <p className="text-2xl font-semibold text-gray-900">{childInfo.level}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">XP Total</p>
                <p className="text-2xl font-semibold text-gray-900">{childInfo.totalXP}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">XP Semanal</p>
                <p className="text-2xl font-semibold text-gray-900">+{childInfo.weeklyXP}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Progreso General</p>
                <p className="text-2xl font-semibold text-gray-900">{childInfo.overallProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="semester">Este semestre</option>
                <option value="year">Este año</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas las actividades</option>
                <option value="academic">Académicas</option>
                <option value="game">Juegos</option>
                <option value="reading">Lectura</option>
                <option value="project">Proyectos</option>
                <option value="extracurricular">Extracurriculares</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Metas Semanales</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(goal.priority)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{goal.category}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      goal.current >= goal.target ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {goal.current >= goal.target ? '✓ Completada' : 'En progreso'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Progreso</span>
                    <span className="text-sm font-medium">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${goal.current >= goal.target ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Fecha límite: {new Date(goal.deadline).toLocaleDateString('es-CL')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Progress */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Progreso por Actividad ({filteredActivities.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        {activity.subject && (
                          <p className="text-blue-600 text-sm">{activity.subject}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getProgressColor(activity.progress)}`}>
                          {activity.progress}%
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Completadas:</span>
                        <p className="font-medium">{activity.completedActivities}/{activity.totalActivities}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Promedio:</span>
                        <p className="font-medium">{activity.averageScore}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tiempo total:</span>
                        <p className="font-medium">{formatTime(activity.timeSpent)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Racha:</span>
                        <p className="font-medium flex items-center gap-1">
                          🔥 {activity.streak} días
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${activity.progress}%` }}
                      ></div>
                    </div>

                    {activity.skillsImproved.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Habilidades mejoradas:</span>
                        <div className="flex flex-wrap gap-2">
                          {activity.skillsImproved.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {activity.achievements.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700 mb-2 block">Logros recientes:</span>
                        <div className="flex flex-wrap gap-2">
                          {activity.achievements.map((achievement) => (
                            <div key={achievement.id} className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${getRarityColor(achievement.rarity)}`}>
                              <span className="text-lg">{achievement.icon}</span>
                              <div>
                                <p className="font-medium text-sm">{achievement.title}</p>
                                <p className="text-xs">{new Date(achievement.dateEarned).toLocaleDateString('es-CL')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Última actividad: {new Date(activity.lastActivity).toLocaleDateString('es-CL')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 