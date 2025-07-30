'use client'

import { useState } from 'react'
import { 
  TrophyIcon, 
  StarIcon, 
  ShieldCheckIcon,
  AcademicCapIcon,
  FireIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BoltIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Achievement {
  id: string
  title: string
  description: string
  category: 'academic' | 'social' | 'creative' | 'leadership' | 'perseverance'
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  icon: any
  earnedDate: string
  subject?: string
  points: number
  requirements: string[]
  isRecent?: boolean
}

export default function AchievementsPage() {
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Maestro de Fracciones',
      description: 'Domina las operaciones con fracciones con 95% de precisión',
      category: 'academic',
      level: 'gold',
      icon: TrophyIcon,
      earnedDate: '2024-02-08',
      subject: 'Matemáticas',
      points: 500,
      requirements: [
        'Completar 10 ejercicios de fracciones',
        'Obtener 95% de precisión o más',
        'Sin errores en suma y resta'
      ],
      isRecent: true
    },
    {
      id: '2',
      title: 'Escritor Creativo',
      description: 'Crea textos originales con excelente estructura narrativa',
      category: 'creative',
      level: 'silver',
      icon: StarIcon,
      earnedDate: '2024-02-07',
      subject: 'Lenguaje',
      points: 300,
      requirements: [
        'Escribir 5 cuentos cortos',
        'Usar vocabulario variado',
        'Estructura narrativa clara'
      ],
      isRecent: true
    },
    {
      id: '3',
      title: 'Científico Curioso',
      description: 'Realiza experimentos con método científico',
      category: 'academic',
      level: 'silver',
      icon: ShieldCheckIcon,
      earnedDate: '2024-02-05',
      subject: 'Ciencias',
      points: 350,
      requirements: [
        'Completar 3 experimentos',
        'Formular hipótesis correctas',
        'Registrar observaciones detalladas'
      ]
    },
    {
      id: '4',
      title: 'Racha Imparable',
      description: '15 días consecutivos de actividad en la plataforma',
      category: 'perseverance',
      level: 'gold',
      icon: FireIcon,
      earnedDate: '2024-02-03',
      points: 750,
      requirements: [
        'Actividad diaria por 15 días',
        'Completar al menos 1 actividad por día',
        'Sin faltas de asistencia'
      ]
    },
    {
      id: '5',
      title: 'Colaborador Ejemplar',
      description: 'Ayuda a compañeros y participa activamente en grupo',
      category: 'social',
      level: 'gold',
      icon: HeartIcon,
      earnedDate: '2024-01-28',
      points: 400,
      requirements: [
        'Participar en 5 trabajos grupales',
        'Recibir reconocimiento de profesores',
        'Ayudar a compañeros con dificultades'
      ]
    },
    {
      id: '6',
      title: 'Velocidad Mental',
      description: 'Responde correctamente en menos de 10 segundos',
      category: 'academic',
      level: 'bronze',
      icon: BoltIcon,
      earnedDate: '2024-01-25',
      subject: 'Matemáticas',
      points: 200,
      requirements: [
        'Responder 20 preguntas en menos de 10 segundos',
        'Mantener 80% de precisión',
        'En juegos de matemáticas'
      ]
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  )

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800'
      case 'social': return 'bg-green-100 text-green-800'
      case 'creative': return 'bg-purple-100 text-purple-800'
      case 'leadership': return 'bg-orange-100 text-orange-800'
      case 'perseverance': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'academic': return 'Académico'
      case 'social': return 'Social'
      case 'creative': return 'Creativo'
      case 'leadership': return 'Liderazgo'
      case 'perseverance': return 'Perseverancia'
      default: return 'Otro'
    }
  }

  const getLevelName = (level: string) => {
    switch (level) {
      case 'bronze': return 'Bronce'
      case 'silver': return 'Plata'
      case 'gold': return 'Oro'
      case 'platinum': return 'Platino'
      default: return level
    }
  }

  const totalPoints = achievements.reduce((acc, achievement) => acc + achievement.points, 0)
  const recentAchievements = achievements.filter(a => a.isRecent).length
  const goldAchievements = achievements.filter(a => a.level === 'gold').length

  const categories = [
    { key: 'all', name: 'Todos', count: achievements.length },
    { key: 'academic', name: 'Académico', count: achievements.filter(a => a.category === 'academic').length },
    { key: 'social', name: 'Social', count: achievements.filter(a => a.category === 'social').length },
    { key: 'creative', name: 'Creativo', count: achievements.filter(a => a.category === 'creative').length },
    { key: 'leadership', name: 'Liderazgo', count: achievements.filter(a => a.category === 'leadership').length },
    { key: 'perseverance', name: 'Perseverancia', count: achievements.filter(a => a.category === 'perseverance').length }
  ]

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Logros y Medallas</h1>
        <p className="page-subtitle">
          Reconocimientos obtenidos por el excelente desempeño académico y personal
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="stats-grid mb-8">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Logros</p>
              <p className="text-2xl font-bold text-gray-900">
                {achievements.length}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Puntos Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPoints.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Medallas de Oro</p>
              <p className="text-2xl font-bold text-gray-900">
                {goldAchievements}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recientes</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentAchievements}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Logros recientes destacados */}
      {recentAchievements > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🌟 Logros Recientes
          </h2>
          <div className="grid-responsive-1 md:grid-cols-2 gap-4">
            {achievements.filter(a => a.isRecent).map(achievement => {
              const IconComponent = achievement.icon
              return (
                <div key={achievement.id} className="card border-2 border-yellow-200 bg-yellow-50">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${getLevelColor(achievement.level)}`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(achievement.level)}`}>
                            {getLevelName(achievement.level)}
                          </span>
                          <span className="text-sm font-medium text-yellow-700">
                            +{achievement.points} puntos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Galería de logros */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Galería de Logros
        </h2>
        <div className="grid-responsive-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => {
            const IconComponent = achievement.icon
            return (
              <div key={achievement.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full ${getLevelColor(achievement.level)} border-2 mb-4`}>
                      <IconComponent className="h-12 w-12" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {achievement.description}
                    </p>
                    
                    <div className="flex justify-center space-x-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(achievement.level)}`}>
                        {getLevelName(achievement.level)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                        {getCategoryName(achievement.category)}
                      </span>
                    </div>
                    
                    {achievement.subject && (
                      <div className="text-sm text-gray-500 mb-2">
                        📚 {achievement.subject}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-500 mb-4">
                      📅 {new Date(achievement.earnedDate).toLocaleDateString()}
                    </div>
                    
                    <div className="text-center">
                      <span className="text-lg font-bold text-primary-600">
                        {achievement.points} puntos
                      </span>
                    </div>
                  </div>
                  
                  {/* Requisitos */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Requisitos completados:
                    </h4>
                    <ul className="space-y-1">
                      {achievement.requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-2 text-xs text-gray-600">
                          <CheckCircleIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron logros en esta categoría</p>
        </div>
      )}

      {/* Progreso hacia próximos logros */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Próximos Logros
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Analista Experto</h3>
                <p className="text-sm text-gray-600">Completa 5 análisis de textos literarios</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <span className="text-sm text-gray-500">3/5</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-blue-600">600 puntos</div>
                <div className="text-xs text-gray-500">Plata</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <AcademicCapIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Mentor Solidario</h3>
                <p className="text-sm text-gray-600">Ayuda a 10 compañeros en sus tareas</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }} />
                  </div>
                  <span className="text-sm text-gray-500">7/10</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">800 puntos</div>
                <div className="text-xs text-gray-500">Oro</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 