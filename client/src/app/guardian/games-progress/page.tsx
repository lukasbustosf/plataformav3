'use client'

import { useState } from 'react'
import { 
  TrophyIcon, 
  StarIcon, 
  PlayIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  AcademicCapIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

interface GameProgress {
  id: string
  gameName: string
  subject: string
  level: number
  maxLevel: number
  score: number
  accuracy: number
  timeSpent: number // minutes
  lastPlayed: string
  achievements: string[]
  streak: number
  bloomLevel: string
}

export default function GamesProgressPage() {
  const [gamesProgress] = useState<GameProgress[]>([
    {
      id: '1',
      gameName: 'Aventura Matemática',
      subject: 'Matemáticas',
      level: 8,
      maxLevel: 15,
      score: 2450,
      accuracy: 85,
      timeSpent: 120,
      lastPlayed: '2024-02-08',
      achievements: ['Maestro de Fracciones', 'Racha de 10', 'Velocidad Mental'],
      streak: 7,
      bloomLevel: 'Aplicar'
    },
    {
      id: '2',
      gameName: 'Exploradores del Lenguaje',
      subject: 'Lenguaje',
      level: 12,
      maxLevel: 20,
      score: 3200,
      accuracy: 92,
      timeSpent: 95,
      lastPlayed: '2024-02-07',
      achievements: ['Escritor Experto', 'Gramática Perfecta'],
      streak: 12,
      bloomLevel: 'Analizar'
    },
    {
      id: '3',
      gameName: 'Laboratorio de Ciencias',
      subject: 'Ciencias',
      level: 5,
      maxLevel: 12,
      score: 1200,
      accuracy: 78,
      timeSpent: 80,
      lastPlayed: '2024-02-06',
      achievements: ['Científico Junior'],
      streak: 3,
      bloomLevel: 'Comprender'
    }
  ])

  const totalTimeSpent = gamesProgress.reduce((acc, game) => acc + game.timeSpent, 0)
  const averageAccuracy = Math.round(gamesProgress.reduce((acc, game) => acc + game.accuracy, 0) / gamesProgress.length)
  const totalAchievements = gamesProgress.reduce((acc, game) => acc + game.achievements.length, 0)

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'matemáticas': return 'bg-blue-100 text-blue-800'
      case 'lenguaje': return 'bg-green-100 text-green-800'
      case 'ciencias': return 'bg-purple-100 text-purple-800'
      case 'historia': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBloomColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'recordar': return 'bg-red-100 text-red-800'
      case 'comprender': return 'bg-orange-100 text-orange-800'
      case 'aplicar': return 'bg-yellow-100 text-yellow-800'
      case 'analizar': return 'bg-green-100 text-green-800'
      case 'evaluar': return 'bg-blue-100 text-blue-800'
      case 'crear': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Progreso en Juegos</h1>
        <p className="page-subtitle">
          Seguimiento del aprendizaje gamificado y logros obtenidos
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="stats-grid mb-8">
        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiempo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.floor(totalTimeSpent / 60)}h {totalTimeSpent % 60}m
              </p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Precisión Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{averageAccuracy}%</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Logros Obtenidos</p>
              <p className="text-2xl font-bold text-gray-900">{totalAchievements}</p>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FireIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mejor Racha</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.max(...gamesProgress.map(g => g.streak))} días
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso por juego */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Progreso por Juego
        </h2>
        <div className="grid-responsive-1 lg:grid-cols-2 gap-6">
          {gamesProgress.map((game) => (
            <div key={game.id} className="card">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {game.gameName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubjectColor(game.subject)}`}>
                        {game.subject}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBloomColor(game.bloomLevel)}`}>
                        {game.bloomLevel}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {game.score}
                    </div>
                    <div className="text-sm text-gray-500">puntos</div>
                  </div>
                </div>

                {/* Progreso de nivel */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Nivel {game.level} de {game.maxLevel}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round((game.level / game.maxLevel) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(game.level / game.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Métricas del juego */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {game.accuracy}%
                    </div>
                    <div className="text-sm text-gray-500">Precisión</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {game.timeSpent}m
                    </div>
                    <div className="text-sm text-gray-500">Tiempo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                      <FireIcon className="h-4 w-4 text-orange-500 mr-1" />
                      {game.streak}
                    </div>
                    <div className="text-sm text-gray-500">Racha</div>
                  </div>
                </div>

                {/* Logros */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Logros Recientes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {game.achievements.map((achievement, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-100 text-yellow-800 text-xs font-medium"
                      >
                        <TrophyIcon className="h-3 w-3 mr-1" />
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Información adicional */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span>Último juego: {new Date(game.lastPlayed).toLocaleDateString()}</span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-800 font-medium">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tendencias semanales */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actividad de la Semana
        </h2>
        <div className="card">
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-gray-700 mb-2">{day}</div>
                  <div className={`h-16 rounded-lg flex items-end justify-center ${
                    index < 5 ? 'bg-primary-100' : 'bg-gray-100'
                  }`}>
                    <div 
                      className={`w-full rounded-lg ${
                        index < 5 ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                      style={{ height: `${Math.random() * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {index < 5 ? Math.floor(Math.random() * 60) + 10 : 0}m
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recomendaciones Personalizadas
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900">
                  Fortalecer Ciencias
                </h3>
                <p className="text-sm text-blue-800 mt-1">
                  Tu progreso en ciencias ha sido excelente. Te recomendamos continuar con el "Laboratorio de Ciencias Avanzado" para seguir desarrollando tus habilidades.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
              <StarIcon className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-green-900">
                  Nueva Racha Personal
                </h3>
                <p className="text-sm text-green-800 mt-1">
                  ¡Excelente! Has establecido una nueva racha personal de 12 días en Lenguaje. Mantén el ritmo para desbloquear nuevos logros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 