'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ChartBarIcon, 
  TrophyIcon, 
  ClockIcon, 
  StarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  BookOpenIcon,
  PlayIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

export default function StudentProgressPage() {
  const { user, fullName } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('current')

  // Mock progress data
  const progressData = {
    overall: {
      gpa: 6.8,
      previousGpa: 6.5,
      attendance: 95,
      previousAttendance: 92,
      completedActivities: 48,
      totalActivities: 52,
      rank: 12,
      totalStudents: 45
    },
    subjects: [
      {
        name: 'Matemáticas',
        currentGrade: 6.8,
        previousGrade: 6.5,
        trend: 'up',
        activities: 15,
        completedActivities: 14,
        lastActivity: 'Quiz Ecuaciones Lineales',
        lastScore: 85,
        strengths: ['Álgebra', 'Geometría'],
        improvements: ['Estadística']
      },
      {
        name: 'Historia',
        currentGrade: 7.2,
        previousGrade: 7.0,
        trend: 'up',
        activities: 12,
        completedActivities: 12,
        lastActivity: 'Proyecto Independencia',
        lastScore: 88,
        strengths: ['Historia de Chile', 'Análisis'],
        improvements: ['Cronología']
      },
      {
        name: 'Ciencias',
        currentGrade: 6.5,
        previousGrade: 6.8,
        trend: 'down',
        activities: 18,
        completedActivities: 16,
        lastActivity: 'Experimento Densidad',
        lastScore: 90,
        strengths: ['Experimentos', 'Observación'],
        improvements: ['Teoría', 'Cálculos']
      },
      {
        name: 'Lenguaje',
        currentGrade: 7.0,
        previousGrade: 6.9,
        trend: 'up',
        activities: 14,
        completedActivities: 13,
        lastActivity: 'Ensayo Argumentativo',
        lastScore: 78,
        strengths: ['Comprensión Lectora'],
        improvements: ['Redacción', 'Ortografía']
      }
    ],
    achievements: [
      { id: 1, name: 'Estudiante Constante', description: '30 días consecutivos con actividades', icon: '🔥', earned: true, date: '2024-12-15' },
      { id: 2, name: 'Matemático Experto', description: '90% promedio en matemáticas', icon: '🧮', earned: true, date: '2024-12-10' },
      { id: 3, name: 'Participación Activa', description: '95% asistencia mensual', icon: '✋', earned: true, date: '2024-12-08' },
      { id: 4, name: 'Excelencia Académica', description: 'Promedio 7.0 o superior', icon: '🌟', earned: false, progress: 85 },
      { id: 5, name: 'Líder de Equipo', description: 'Liderar 3 proyectos grupales', icon: '👥', earned: false, progress: 60 }
    ],
    weeklyActivity: [
      { day: 'Lun', activities: 4, completed: 4 },
      { day: 'Mar', activities: 3, completed: 2 },
      { day: 'Mié', activities: 5, completed: 5 },
      { day: 'Jue', activities: 2, completed: 2 },
      { day: 'Vie', activities: 3, completed: 3 },
      { day: 'Sáb', activities: 1, completed: 0 },
      { day: 'Dom', activities: 0, completed: 0 }
    ]
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    if (trend === 'down') return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    return null
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 7) return 'text-green-600'
    if (grade >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Mi Progreso 📊</h1>
          <p className="mt-2 opacity-90">
            ¡Hola {fullName}! Aquí puedes seguir tu evolución académica y logros.
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Promedio General</p>
                <p className={`text-2xl font-bold ${getGradeColor(progressData.overall.gpa)}`}>
                  {progressData.overall.gpa.toFixed(1)}
                </p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">
                    +{(progressData.overall.gpa - progressData.overall.previousGpa).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Asistencia</p>
                <p className="text-2xl font-bold text-green-600">{progressData.overall.attendance}%</p>
                <div className="flex items-center mt-1">
                  <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">
                    +{progressData.overall.attendance - progressData.overall.previousAttendance}%
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Actividades Completadas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {progressData.overall.completedActivities}/{progressData.overall.totalActivities}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${(progressData.overall.completedActivities / progressData.overall.totalActivities) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ranking en Curso</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {progressData.overall.rank}° de {progressData.overall.totalStudents}
                </p>
                <p className="text-xs text-gray-500 mt-1">Top 27%</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Progreso por Asignatura</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {progressData.subjects.map((subject, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                      {getTrendIcon(subject.trend)}
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                        {subject.currentGrade.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.trend === 'up' ? '+' : ''}{(subject.currentGrade - subject.previousGrade).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Actividades</div>
                      <div className="font-medium">
                        {subject.completedActivities}/{subject.activities} completadas
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(subject.completedActivities / subject.activities) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Última Actividad</div>
                      <div className="font-medium">{subject.lastActivity}</div>
                      <div className="text-sm text-green-600">{subject.lastScore}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estado</div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subject.currentGrade >= 7 ? 'bg-green-100 text-green-800' :
                        subject.currentGrade >= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {subject.currentGrade >= 7 ? 'Excelente' :
                         subject.currentGrade >= 6 ? 'Satisfactorio' : 'Necesita Mejora'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Fortalezas</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.strengths.map((strength, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Áreas de Mejora</div>
                      <div className="flex flex-wrap gap-1">
                        {subject.improvements.map((improvement, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {improvement}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Activity & Achievements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Actividad Semanal</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {progressData.weeklyActivity.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-medium text-gray-900 w-12">{day.day}</div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: day.activities > 0 ? `${(day.completed / day.activities) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-16 text-right">
                      {day.completed}/{day.activities}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Logros</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {progressData.achievements.map((achievement) => (
                  <div key={achievement.id} className={`border-2 rounded-lg p-4 ${
                    achievement.earned 
                      ? 'border-yellow-200 bg-yellow-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`text-2xl ${achievement.earned ? 'grayscale-0' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          achievement.earned ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned ? (
                          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ✓ Conseguido el {achievement.date}
                          </div>
                        ) : (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progreso</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 