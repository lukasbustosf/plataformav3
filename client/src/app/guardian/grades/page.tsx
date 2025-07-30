'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { 
  TrophyIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  StarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  PlayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Grade {
  id: string
  subject: string
  title: string
  type: 'quiz_ia' | 'exam' | 'task' | 'lab' | 'presentation' | 'game'
  date: string
  grade: number
  maxGrade: number
  weight: number
  bloomLevel: string
  feedback: string
  teacher: string
  status: 'graded' | 'pending' | 'late'
}

interface SubjectSummary {
  subject: string
  teacher: string
  currentAverage: number
  previousAverage: number
  trend: 'up' | 'down' | 'stable'
  totalAssignments: number
  gradedAssignments: number
  pendingAssignments: number
  bloomDistribution: Record<string, number>
  lastUpdate: string
}

export default function GuardianGradesPage() {
  const { user, fullName } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current')
  const [showOnlyRecent, setShowOnlyRecent] = useState(false)
  const [loading, setLoading] = useState(true)

  // Mock data for child's grades
  const childInfo = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    rut: '23.456.789-1',
    overallGPA: 6.2,
    previousGPA: 6.0,
    totalSubjects: 8,
    pendingEvaluations: 3
  }

  const grades: Grade[] = [
    {
      id: 'GRA-001',
      subject: 'Matemáticas',
      title: 'Quiz IA: Álgebra Básica',
      type: 'quiz_ia',
      date: '2024-12-15',
      grade: 6.5,
      maxGrade: 7.0,
      weight: 20,
      bloomLevel: 'Aplicar',
      feedback: 'Excelente comprensión de ecuaciones lineales. Revisar factorización de trinomios.',
      teacher: 'Prof. Carlos Pérez',
      status: 'graded'
    },
    {
      id: 'GRA-002',
      subject: 'Lenguaje',
      title: 'Ensayo: Literatura Contemporánea',
      type: 'task',
      date: '2024-12-14',
      grade: 5.8,
      maxGrade: 7.0,
      weight: 30,
      bloomLevel: 'Crear',
      feedback: 'Buena estructura argumentativa. Mejorar uso de conectores y ortografía.',
      teacher: 'Prof. María González',
      status: 'graded'
    },
    {
      id: 'GRA-003',
      subject: 'Ciencias',
      title: 'Laboratorio: Reacciones Químicas',
      type: 'lab',
      date: '2024-12-13',
      grade: 6.8,
      maxGrade: 7.0,
      weight: 25,
      bloomLevel: 'Analizar',
      feedback: 'Procedimiento correcto y conclusiones acertadas. Excelente trabajo en equipo.',
      teacher: 'Prof. Ana Rodríguez',
      status: 'graded'
    },
    {
      id: 'GRA-004',
      subject: 'Historia',
      title: 'Trivia Game: Independencia',
      type: 'game',
      date: '2024-12-12',
      grade: 6.0,
      maxGrade: 7.0,
      weight: 15,
      bloomLevel: 'Recordar',
      feedback: 'Participación activa en el juego colaborativo. Buen conocimiento de fechas.',
      teacher: 'Prof. Luis Fernández',
      status: 'graded'
    },
    {
      id: 'GRA-005',
      subject: 'Matemáticas',
      title: 'Examen: Geometría',
      type: 'exam',
      date: '2024-12-10',
      grade: 0,
      maxGrade: 7.0,
      weight: 40,
      bloomLevel: 'Aplicar',
      feedback: '',
      teacher: 'Prof. Carlos Pérez',
      status: 'pending'
    },
    {
      id: 'GRA-006',
      subject: 'Inglés',
      title: 'Presentación Oral',
      type: 'presentation',
      date: '2024-12-09',
      grade: 6.3,
      maxGrade: 7.0,
      weight: 25,
      bloomLevel: 'Crear',
      feedback: 'Buena pronunciación y fluidez. Ampliar vocabulario técnico.',
      teacher: 'Prof. Jennifer Smith',
      status: 'graded'
    }
  ]

  const subjectSummaries: SubjectSummary[] = [
    {
      subject: 'Matemáticas',
      teacher: 'Prof. Carlos Pérez',
      currentAverage: 6.2,
      previousAverage: 6.0,
      trend: 'up',
      totalAssignments: 8,
      gradedAssignments: 7,
      pendingAssignments: 1,
      bloomDistribution: { Recordar: 20, Comprender: 25, Aplicar: 35, Analizar: 15, Evaluar: 5, Crear: 0 },
      lastUpdate: '2024-12-15'
    },
    {
      subject: 'Lenguaje',
      teacher: 'Prof. María González',
      currentAverage: 5.9,
      previousAverage: 6.1,
      trend: 'down',
      totalAssignments: 6,
      gradedAssignments: 5,
      pendingAssignments: 1,
      bloomDistribution: { Recordar: 10, Comprender: 30, Aplicar: 25, Analizar: 20, Evaluar: 10, Crear: 5 },
      lastUpdate: '2024-12-14'
    },
    {
      subject: 'Ciencias',
      teacher: 'Prof. Ana Rodríguez',
      currentAverage: 6.5,
      previousAverage: 6.3,
      trend: 'up',
      totalAssignments: 5,
      gradedAssignments: 5,
      pendingAssignments: 0,
      bloomDistribution: { Recordar: 15, Comprender: 25, Aplicar: 30, Analizar: 25, Evaluar: 5, Crear: 0 },
      lastUpdate: '2024-12-13'
    },
    {
      subject: 'Historia',
      teacher: 'Prof. Luis Fernández',
      currentAverage: 6.0,
      previousAverage: 6.0,
      trend: 'stable',
      totalAssignments: 4,
      gradedAssignments: 4,
      pendingAssignments: 0,
      bloomDistribution: { Recordar: 40, Comprender: 30, Aplicar: 20, Analizar: 10, Evaluar: 0, Crear: 0 },
      lastUpdate: '2024-12-12'
    }
  ]

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 85) return 'text-green-600'
    if (percentage >= 70) return 'text-blue-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz_ia':
        return <AcademicCapIcon className="h-4 w-4" />
      case 'exam':
        return <DocumentTextIcon className="h-4 w-4" />
      case 'task':
        return <DocumentTextIcon className="h-4 w-4" />
      case 'lab':
        return <StarIcon className="h-4 w-4" />
      case 'presentation':
        return <ClockIcon className="h-4 w-4" />
      case 'game':
        return <PlayIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz_ia': return 'Quiz IA'
      case 'exam': return 'Examen'
      case 'task': return 'Tarea'
      case 'lab': return 'Laboratorio'
      case 'presentation': return 'Presentación'
      case 'game': return 'Juego'
      default: return type
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const filteredGrades = grades.filter(grade => {
    if (selectedSubject !== 'ALL' && grade.subject !== selectedSubject) return false
    if (showOnlyRecent) {
      const gradeDate = new Date(grade.date)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      return gradeDate >= twoWeeksAgo
    }
    return true
  })

  const gradesColumns = [
    {
      key: 'date',
      label: 'Fecha',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('es-CL')
    },
    {
      key: 'subject',
      label: 'Asignatura',
      sortable: true
    },
    {
      key: 'title',
      label: 'Evaluación',
      render: (value: string, row: Grade) => (
        <div className="flex items-center space-x-2">
          <div className="text-blue-600">
            {getTypeIcon(row.type)}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-500">{getTypeLabel(row.type)}</div>
          </div>
        </div>
      )
    },
    {
      key: 'grade',
      label: 'Calificación',
      render: (value: number, row: Grade) => (
        <div className="text-center">
          {row.status === 'pending' ? (
            <span className="text-yellow-600 font-medium">Pendiente</span>
          ) : (
            <div>
              <span className={`text-lg font-bold ${getGradeColor(value, row.maxGrade)}`}>
                {value.toFixed(1)}
              </span>
              <span className="text-gray-500 text-sm"> / {row.maxGrade}</span>
              <div className="text-xs text-gray-500">
                ({((value / row.maxGrade) * 100).toFixed(0)}%)
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'bloomLevel',
      label: 'Nivel Bloom',
      render: (value: string) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
      hiddenOnMobile: true
    },
    {
      key: 'weight',
      label: 'Peso %',
      render: (value: number) => `${value}%`,
      hiddenOnMobile: true
    }
  ]

  const handleExportGrades = async () => {
    toast.success('Generando reporte de calificaciones...')
  }

  const handleContactTeacher = (teacher: string) => {
    toast.success(`Contactando con ${teacher}`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando calificaciones...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Calificaciones y Notas 📊</h1>
              <p className="mt-2 opacity-90">
                Seguimiento detallado del rendimiento académico de {childInfo.name}
              </p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5" />
                  <div>
                    <div className="text-sm opacity-75">Promedio General</div>
                    <div className="font-bold text-lg">{childInfo.overallGPA.toFixed(1)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {childInfo.overallGPA > childInfo.previousGPA ? (
                    <ArrowUpIcon className="h-5 w-5 text-green-300" />
                  ) : childInfo.overallGPA < childInfo.previousGPA ? (
                    <ArrowDownIcon className="h-5 w-5 text-red-300" />
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                  <div>
                    <div className="text-sm opacity-75">Tendencia</div>
                    <div className="text-sm">
                      {childInfo.overallGPA > childInfo.previousGPA ? '+' : ''}
                      {(childInfo.overallGPA - childInfo.previousGPA).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExportGrades}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Exportar Reporte
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Asignaturas</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.totalSubjects}</p>
                <p className="text-xs text-gray-600">Este semestre</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Evaluaciones</p>
                <p className="text-2xl font-bold text-gray-900">
                  {grades.filter(g => g.status === 'graded').length}
                </p>
                <p className="text-xs text-gray-600">Calificadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{childInfo.pendingEvaluations}</p>
                <p className="text-xs text-gray-600">Por calificar</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mejor Nota</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.max(...grades.filter(g => g.status === 'graded').map(g => g.grade)).toFixed(1)}
                </p>
                <p className="text-xs text-gray-600">Este período</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Resumen por Asignatura</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subjectSummaries.map((subject) => (
                <div key={subject.subject} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(subject.trend)}
                      <span className={`text-lg font-bold ${getGradeColor(subject.currentAverage, 7)}`}>
                        {subject.currentAverage.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Profesor: {subject.teacher}</span>
                      <button
                        onClick={() => handleContactTeacher(subject.teacher)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Contactar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-medium">{subject.totalAssignments}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Calificadas:</span>
                      <div className="font-medium text-green-600">{subject.gradedAssignments}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Pendientes:</span>
                      <div className="font-medium text-yellow-600">{subject.pendingAssignments}</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Última actualización: {new Date(subject.lastUpdate).toLocaleDateString('es-CL')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="ALL">Todas las asignaturas</option>
                {Array.from(new Set(grades.map(g => g.subject))).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="current">Período actual</option>
                <option value="semester">Este semestre</option>
                <option value="year">Este año</option>
              </select>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showOnlyRecent}
                  onChange={(e) => setShowOnlyRecent(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Solo últimas 2 semanas</span>
              </label>
            </div>
            
            <div className="text-sm text-gray-600">
              Mostrando {filteredGrades.length} de {grades.length} evaluaciones
            </div>
          </div>
        </div>

        {/* Grades Table */}
        <ResponsiveTable
          columns={gradesColumns}
          data={filteredGrades}
          keyExtractor={(row) => row.id}
          searchable={true}
          searchPlaceholder="Buscar evaluaciones..."
          sortable={true}
          emptyMessage="No hay evaluaciones que coincidan con los filtros seleccionados"
        />

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Retroalimentación Reciente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {grades
                .filter(g => g.status === 'graded' && g.feedback)
                .slice(0, 3)
                .map((grade) => (
                  <div key={grade.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{grade.title}</h3>
                        <p className="text-sm text-gray-600">{grade.subject} • {grade.teacher}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                          {grade.grade.toFixed(1)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {new Date(grade.date).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">
                      {grade.feedback}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 