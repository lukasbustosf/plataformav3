'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  TrophyIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ShareIcon,
  ArrowRightIcon,
  SparklesIcon,
  HeartIcon,
  BeakerIcon,
  PencilIcon,
  BookOpenIcon,
  PlayIcon,
  CalculatorIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline'
import { 
  TrophyIcon as TrophySolidIcon, 
  StarIcon as StarSolidIcon,
  FireIcon as FireSolidIcon
} from '@heroicons/react/24/solid'

interface Achievement {
  id: string
  title: string
  description: string
  category: 'academic' | 'streak' | 'participation' | 'special' | 'subject'
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  icon: string
  iconComponent?: any
  subject?: string
  unlocked: boolean
  unlockedAt?: string
  progress: number
  maxProgress: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  requirements: string[]
  nextLevel?: {
    title: string
    description: string
    requirements: string[]
  }
}

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Estudiante Estrella',
    description: 'Mantén un promedio superior a 6.5 durante un mes completo',
    category: 'academic',
    type: 'gold',
    icon: '⭐',
    iconComponent: StarSolidIcon,
    unlocked: true,
    unlockedAt: '2024-01-15T14:30:00Z',
    progress: 1,
    maxProgress: 1,
    rarity: 'rare',
    points: 500,
    requirements: ['Promedio ≥ 6.5', 'Durante 30 días consecutivos'],
    nextLevel: {
      title: 'Estudiante Superestrella',
      description: 'Mantén un promedio superior a 6.8 durante un mes completo',
      requirements: ['Promedio ≥ 6.8', 'Durante 30 días consecutivos']
    }
  },
  {
    id: '2',
    title: 'Racha de Fuego',
    description: 'Completa actividades durante 7 días seguidos',
    category: 'streak',
    type: 'diamond',
    icon: '🔥',
    iconComponent: FireSolidIcon,
    unlocked: true,
    unlockedAt: '2024-01-18T20:15:00Z',
    progress: 7,
    maxProgress: 7,
    rarity: 'epic',
    points: 750,
    requirements: ['7 días consecutivos', 'Al menos 1 actividad por día'],
    nextLevel: {
      title: 'Racha Imparable',
      description: 'Completa actividades durante 14 días seguidos',
      requirements: ['14 días consecutivos', 'Al menos 1 actividad por día']
    }
  },
  {
    id: '3',
    title: 'Maestro de Matemáticas',
    description: 'Resuelve 100 ejercicios de matemáticas correctamente',
    category: 'subject',
    type: 'platinum',
    icon: '🧮',
    iconComponent: CalculatorIcon,
    subject: 'Matemáticas',
    unlocked: true,
    unlockedAt: '2024-01-12T16:45:00Z',
    progress: 100,
    maxProgress: 100,
    rarity: 'epic',
    points: 600,
    requirements: ['100 ejercicios correctos', 'En cualquier modalidad'],
    nextLevel: {
      title: 'Genio Matemático',
      description: 'Resuelve 250 ejercicios de matemáticas correctamente',
      requirements: ['250 ejercicios correctos', 'Incluir al menos 3 temas diferentes']
    }
  },
  {
    id: '4',
    title: 'Explorador Científico',
    description: 'Completa 5 experimentos virtuales en ciencias',
    category: 'subject',
    type: 'silver',
    icon: '🔬',
    iconComponent: BeakerIcon,
    subject: 'Ciencias',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    rarity: 'common',
    points: 300,
    requirements: ['5 experimentos completos', 'Con informe de resultados']
  },
  {
    id: '5',
    title: 'Velocista del Conocimiento',
    description: 'Responde 10 preguntas correctas en menos de 30 segundos',
    category: 'special',
    type: 'gold',
    icon: '⚡',
    iconComponent: BoltIcon,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    rarity: 'rare',
    points: 400,
    requirements: ['10 respuestas correctas', 'En menos de 30 segundos', 'En un solo juego']
  },
  {
    id: '6',
    title: 'Participante Activo',
    description: 'Participa en 20 juegos educativos',
    category: 'participation',
    type: 'bronze',
    icon: '🎮',
    iconComponent: PlayIcon,
    unlocked: true,
    unlockedAt: '2024-01-10T11:20:00Z',
    progress: 23,
    maxProgress: 20,
    rarity: 'common',
    points: 200,
    requirements: ['20 juegos completados', 'En cualquier asignatura']
  },
  {
    id: '7',
    title: 'Escritor Novato',
    description: 'Completa 5 ensayos o composiciones',
    category: 'subject',
    type: 'bronze',
    icon: '✍️',
    iconComponent: PencilIcon,
    subject: 'Lenguaje',
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: 'common',
    points: 250,
    requirements: ['5 ensayos completos', 'Mínimo 200 palabras cada uno']
  },
  {
    id: '8',
    title: 'Lector Ávido',
    description: 'Lee 10 libros o artículos completos',
    category: 'subject',
    type: 'silver',
    icon: '📚',
    iconComponent: BookOpenIcon,
    subject: 'Lenguaje',
    unlocked: false,
    progress: 4,
    maxProgress: 10,
    rarity: 'common',
    points: 350,
    requirements: ['10 lecturas completas', 'Incluir comprensión de lectura']
  },
  {
    id: '9',
    title: 'Ciudadano del Mundo',
    description: 'Aprende sobre 5 países diferentes',
    category: 'subject',
    type: 'gold',
    icon: '🌍',
    iconComponent: GlobeAltIcon,
    subject: 'Historia',
    unlocked: false,
    progress: 1,
    maxProgress: 5,
    rarity: 'rare',
    points: 450,
    requirements: ['5 países estudiados', 'Incluir geografía y cultura']
  },
  {
    id: '10',
    title: 'Artista Creativo',
    description: 'Completa 8 proyectos artísticos',
    category: 'subject',
    type: 'silver',
    icon: '🎨',
    iconComponent: PaintBrushIcon,
    subject: 'Arte',
    unlocked: false,
    progress: 0,
    maxProgress: 8,
    rarity: 'common',
    points: 300,
    requirements: ['8 proyectos completos', 'En diferentes técnicas']
  }
]

export default function StudentAchievementsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showAchievementModal, setShowAchievementModal] = useState(false)

  const filteredAchievements = mockAchievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory
    const matchesUnlocked = !showOnlyUnlocked || achievement.unlocked
    return matchesCategory && matchesUnlocked
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'diamond': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600'
      case 'rare': return 'text-blue-600'
      case 'epic': return 'text-purple-600'
      case 'legendary': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Común'
      case 'rare': return 'Raro'
      case 'epic': return 'Épico'
      case 'legendary': return 'Legendario'
      default: return rarity
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'academic': return 'Académico'
      case 'streak': return 'Racha'
      case 'participation': return 'Participación'
      case 'special': return 'Especial'
      case 'subject': return 'Asignatura'
      default: return category
    }
  }

  const handleViewAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setShowAchievementModal(true)
  }

  const handleShareAchievement = (achievement: Achievement) => {
    if (achievement.unlocked) {
      toast.success(`¡Compartiendo logro "${achievement.title}"!`)
    } else {
      toast.error('Solo puedes compartir logros desbloqueados')
    }
  }

  const totalPoints = mockAchievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0)

  const unlockedCount = mockAchievements.filter(a => a.unlocked).length
  const totalCount = mockAchievements.length

  const categoryStats = {
    academic: mockAchievements.filter(a => a.category === 'academic' && a.unlocked).length,
    streak: mockAchievements.filter(a => a.category === 'streak' && a.unlocked).length,
    participation: mockAchievements.filter(a => a.category === 'participation' && a.unlocked).length,
    special: mockAchievements.filter(a => a.category === 'special' && a.unlocked).length,
    subject: mockAchievements.filter(a => a.category === 'subject' && a.unlocked).length,
  }

  const currentStreak = 7 // Mock current streak
  const longestStreak = 12 // Mock longest streak

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <TrophySolidIcon className="h-8 w-8 mr-3" />
                Mis Logros y Medallas
              </h1>
              <p className="mt-2 opacity-90">
                ¡Sigue aprendiendo y desbloqueando nuevos logros!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{totalPoints}</div>
              <div className="text-sm opacity-90">Puntos totales</div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Logros Desbloqueados</p>
                <p className="text-2xl font-bold text-gray-900">{unlockedCount}/{totalCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FireIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Racha Actual</p>
                <p className="text-2xl font-bold text-gray-900">{currentStreak} días</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <BoltIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Racha Máxima</p>
                <p className="text-2xl font-bold text-gray-900">{longestStreak} días</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <StarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{categoryStats.academic}</div>
              <div className="text-sm text-gray-600">Académicos</div>
            </div>
            <div className="text-center">
              <FireIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{categoryStats.streak}</div>
              <div className="text-sm text-gray-600">Rachas</div>
            </div>
            <div className="text-center">
              <PlayIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{categoryStats.participation}</div>
              <div className="text-sm text-gray-600">Participación</div>
            </div>
            <div className="text-center">
              <SparklesIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{categoryStats.special}</div>
              <div className="text-sm text-gray-600">Especiales</div>
            </div>
            <div className="text-center">
              <BookOpenIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{categoryStats.subject}</div>
              <div className="text-sm text-gray-600">Asignaturas</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="academic">Académicos</option>
                <option value="streak">Rachas</option>
                <option value="participation">Participación</option>
                <option value="special">Especiales</option>
                <option value="subject">Asignaturas</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant={showOnlyUnlocked ? 'primary' : 'outline'}
                onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
              >
                Solo Desbloqueados
              </Button>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                achievement.unlocked ? getTypeColor(achievement.type) : 'border-gray-200 opacity-60'
              }`}
              onClick={() => handleViewAchievement(achievement)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                      <p className={`text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                        {getRarityText(achievement.rarity)} • {getCategoryText(achievement.category)}
                      </p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>

                {achievement.subject && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {achievement.subject}
                    </span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        achievement.unlocked ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{achievement.points} pts</span>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {achievement.unlocked && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<ShareIcon className="h-3 w-3" />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShareAchievement(achievement)
                      }}
                    >
                      Compartir
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron logros</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta ajustar los filtros o sigue estudiando para desbloquear más logros.
            </p>
          </div>
        )}

        {/* Achievement Detail Modal */}
        {showAchievementModal && selectedAchievement && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`text-6xl ${selectedAchievement.unlocked ? '' : 'grayscale'}`}>
                    {selectedAchievement.unlocked ? selectedAchievement.icon : '🔒'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedAchievement.title}</h3>
                    <p className={`text-sm font-medium ${getRarityColor(selectedAchievement.rarity)}`}>
                      {getRarityText(selectedAchievement.rarity)} • {getCategoryText(selectedAchievement.category)}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedAchievement.type)} mt-2`}>
                      {selectedAchievement.type.charAt(0).toUpperCase() + selectedAchievement.type.slice(1)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAchievementModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descripción</h4>
                  <p className="text-gray-600">{selectedAchievement.description}</p>
                </div>

                {selectedAchievement.subject && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Asignatura</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedAchievement.subject}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Progreso Actual</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso</span>
                    <span>{selectedAchievement.progress}/{selectedAchievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        selectedAchievement.unlocked ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${(selectedAchievement.progress / selectedAchievement.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Requisitos</h4>
                  <ul className="space-y-1">
                    {selectedAchievement.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedAchievement.nextLevel && !selectedAchievement.unlocked && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                      <ArrowRightIcon className="h-4 w-4 mr-2" />
                      Siguiente Nivel: {selectedAchievement.nextLevel.title}
                    </h4>
                    <p className="text-sm text-blue-700 mb-2">{selectedAchievement.nextLevel.description}</p>
                    <ul className="space-y-1">
                      {selectedAchievement.nextLevel.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center text-sm text-blue-600">
                          <ArrowRightIcon className="h-3 w-3 mr-2" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedAchievement.points}</div>
                    <div className="text-sm text-gray-600">Puntos</div>
                  </div>
                  {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">Desbloqueado</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setShowAchievementModal(false)}
                  >
                    Cerrar
                  </Button>
                  {selectedAchievement.unlocked && (
                    <Button
                      variant="primary"
                      leftIcon={<ShareIcon className="h-4 w-4" />}
                      onClick={() => handleShareAchievement(selectedAchievement)}
                    >
                      Compartir Logro
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 