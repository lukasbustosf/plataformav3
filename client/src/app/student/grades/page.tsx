'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  PrinterIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

export default function StudentGrades() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('semester_1')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [viewMode, setViewMode] = useState('overview') // overview, detailed, trends

  const periods = [
    { id: 'semester_1', name: 'Primer Semestre 2024' },
    { id: 'semester_2', name: 'Segundo Semestre 2024' },
    { id: 'year', name: 'Año Completo 2024' }
  ]

  const subjects = [
    {
      id: 'mathematics',
      name: 'Matemáticas',
      teacher: 'Prof. García',
      currentGrade: 6.2,
      previousGrade: 5.8,
      trend: 'up',
      evaluations: [
        { name: 'Evaluación 1: Álgebra', grade: 6.5, date: '2024-01-15', weight: 30 },
        { name: 'Evaluación 2: Geometría', grade: 5.8, date: '2024-01-28', weight: 30 },
        { name: 'Tareas y Ejercicios', grade: 6.3, date: '2024-02-01', weight: 40 }
      ],
      attendance: 95,
      participation: 'Excelente'
    },
    {
      id: 'history',
      name: 'Historia',
      teacher: 'Prof. Rodríguez',
      currentGrade: 6.8,
      previousGrade: 6.9,
      trend: 'down',
      evaluations: [
        { name: 'Ensayo: Independencia', grade: 6.7, date: '2024-01-20', weight: 40 },
        { name: 'Prueba: Colonia', grade: 7.0, date: '2024-02-05', weight: 35 },
        { name: 'Participación en clase', grade: 6.5, date: '2024-02-01', weight: 25 }
      ],
      attendance: 98,
      participation: 'Muy Buena'
    },
    {
      id: 'science',
      name: 'Ciencias Naturales',
      teacher: 'Prof. Martínez',
      currentGrade: 6.4,
      previousGrade: 6.1,
      trend: 'up',
      evaluations: [
        { name: 'Laboratorio: Densidad', grade: 6.8, date: '2024-01-25', weight: 30 },
        { name: 'Prueba: Sistema Solar', grade: 6.2, date: '2024-02-08', weight: 40 },
        { name: 'Proyecto: Ecosistemas', grade: 6.1, date: '2024-02-01', weight: 30 }
      ],
      attendance: 92,
      participation: 'Buena'
    },
    {
      id: 'language',
      name: 'Lenguaje y Comunicación',
      teacher: 'Prof. Silva',
      currentGrade: 6.6,
      previousGrade: 6.4,
      trend: 'up',
      evaluations: [
        { name: 'Comprensión Lectora', grade: 6.8, date: '2024-01-18', weight: 35 },
        { name: 'Ensayo Argumentativo', grade: 6.3, date: '2024-02-02', weight: 40 },
        { name: 'Exposición Oral', grade: 6.7, date: '2024-02-10', weight: 25 }
      ],
      attendance: 100,
      participation: 'Excelente'
    },
    {
      id: 'english',
      name: 'Inglés',
      teacher: 'Prof. Brown',
      currentGrade: 5.9,
      previousGrade: 6.2,
      trend: 'down',
      evaluations: [
        { name: 'Vocabulary Test', grade: 6.1, date: '2024-01-22', weight: 30 },
        { name: 'Grammar Exam', grade: 5.5, date: '2024-02-05', weight: 40 },
        { name: 'Speaking Practice', grade: 6.2, date: '2024-02-01', weight: 30 }
      ],
      attendance: 88,
      participation: 'Regular'
    },
    {
      id: 'pe',
      name: 'Educación Física',
      teacher: 'Prof. López',
      currentGrade: 6.9,
      previousGrade: 6.8,
      trend: 'up',
      evaluations: [
        { name: 'Condición Física', grade: 7.0, date: '2024-01-30', weight: 40 },
        { name: 'Deportes de Equipo', grade: 6.8, date: '2024-02-06', weight: 35 },
        { name: 'Actitud y Esfuerzo', grade: 7.0, date: '2024-02-01', weight: 25 }
      ],
      attendance: 96,
      participation: 'Excelente'
    }
  ]

  const overallStats = {
    gpa: 6.4,
    previousGpa: 6.3,
    ranking: 8,
    totalStudents: 32,
    attendanceRate: 95.2,
    improvingSubjects: subjects.filter(s => s.trend === 'up').length,
    decliningSubjects: subjects.filter(s => s.trend === 'down').length
  }

  const monthlyTrends = [
    { month: 'Enero', gpa: 6.1 },
    { month: 'Febrero', gpa: 6.4 },
    { month: 'Marzo', gpa: 6.3 },
    { month: 'Abril', gpa: 6.5 }
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    } else if (trend === 'down') {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    }
    return null
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 6.0) return 'text-green-600'
    if (grade >= 5.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeBadgeColor = (grade: number) => {
    if (grade >= 6.0) return 'bg-green-100 text-green-800'
    if (grade >= 5.0) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getParticipationColor = (participation: string) => {
    switch (participation) {
      case 'Excelente': return 'text-green-600'
      case 'Muy Buena': return 'text-blue-600'
      case 'Buena': return 'text-yellow-600'
      case 'Regular': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const filteredSubjects = selectedSubject === 'all' 
    ? subjects 
    : subjects.filter(s => s.id === selectedSubject)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Mis Calificaciones</h1>
              <p className="mt-1 text-sm text-gray-600">
                Revisa tu rendimiento académico y progreso por materia
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                leftIcon={<PrinterIcon className="h-4 w-4" />}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
              >
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Period Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id}>{period.name}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'overview', label: 'Resumen' },
                { key: 'detailed', label: 'Detallado' },
                { key: 'trends', label: 'Tendencias' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === mode.key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Promedio General</p>
                <p className={`text-2xl font-bold ${getGradeColor(overallStats.gpa)}`}>
                  {overallStats.gpa}
                </p>
                <div className="flex items-center">
                  {overallStats.gpa > overallStats.previousGpa ? (
                    <ArrowTrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className="text-xs text-gray-600">
                    vs {overallStats.previousGpa} anterior
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Posición en Curso</p>
                <p className="text-2xl font-bold text-gray-900">#{overallStats.ranking}</p>
                <p className="text-xs text-gray-600">de {overallStats.totalStudents} estudiantes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.attendanceRate}%</p>
                <p className="text-xs text-green-600">Excelente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Materias</p>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 text-sm">↗ {overallStats.improvingSubjects}</span>
                  <span className="text-red-600 text-sm">↘ {overallStats.decliningSubjects}</span>
                </div>
                <p className="text-xs text-gray-600">mejorando/bajando</p>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'overview' && (
          /* Subjects Overview */
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Resumen por Materia</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {subjects.map((subject) => (
                <div key={subject.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeBadgeColor(subject.currentGrade)}`}>
                          {subject.currentGrade}
                        </span>
                        {getTrendIcon(subject.trend)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Profesor:</span> {subject.teacher}
                        </div>
                        <div>
                          <span className="font-medium">Asistencia:</span> {subject.attendance}%
                        </div>
                        <div>
                          <span className="font-medium">Participación:</span> 
                          <span className={`ml-1 ${getParticipationColor(subject.participation)}`}>
                            {subject.participation}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Evaluaciones:</span> {subject.evaluations.length}
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progreso</span>
                          <span>{subject.currentGrade}/7.0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${subject.currentGrade >= 6.0 ? 'bg-green-500' : subject.currentGrade >= 5.0 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(subject.currentGrade / 7.0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {setSelectedSubject(subject.id); setViewMode('detailed')}}
                        leftIcon={<EyeIcon className="h-4 w-4" />}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'detailed' && (
          /* Detailed View */
          <div className="space-y-6">
            {/* Subject Selector */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Materia:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Todas las materias</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedSubject('all')}
                >
                  Ver Todas
                </Button>
              </div>
            </div>

            {/* Detailed Evaluations */}
            {filteredSubjects.map((subject) => (
              <div key={subject.id} className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">{subject.name}</h2>
                      <p className="text-sm text-gray-600">Profesor: {subject.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getGradeColor(subject.currentGrade)}`}>
                        {subject.currentGrade}
                      </p>
                      <p className="text-sm text-gray-600">Promedio actual</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">Evaluaciones</h3>
                  <div className="space-y-3">
                    {subject.evaluations.map((evaluation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{evaluation.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>Fecha: {new Date(evaluation.date).toLocaleDateString()}</span>
                            <span>Ponderación: {evaluation.weight}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${getGradeColor(evaluation.grade)}`}>
                            {evaluation.grade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'trends' && (
          /* Trends View */
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Tendencias de Rendimiento</h2>
              
              {/* Monthly Trends */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-900 mb-4">Promedio Mensual</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {monthlyTrends.map((trend, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{trend.month}</p>
                      <p className={`text-xl font-bold ${getGradeColor(trend.gpa)}`}>
                        {trend.gpa}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Trends */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Tendencia por Materia</h3>
                <div className="space-y-3">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900">{subject.name}</span>
                        <span className={`text-sm ${getGradeColor(subject.currentGrade)}`}>
                          {subject.currentGrade}
                        </span>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Anterior: {subject.previousGrade}</span>
                        <span>•</span>
                        <span className={subject.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                          {subject.trend === 'up' ? '+' : ''}{(subject.currentGrade - subject.previousGrade).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 