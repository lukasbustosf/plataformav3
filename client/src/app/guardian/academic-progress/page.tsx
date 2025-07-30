'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  AcademicCapIcon, 
  TrophyIcon,
  ChartBarIcon,
  CalendarIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

export default function AcademicProgress() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('semester')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [viewMode, setViewMode] = useState('summary')

  // Mock data for child's academic progress
  const childData = {
    name: 'Sofía Martínez',
    grade: '7° Básico A',
    currentGPA: 6.2,
    previousGPA: 5.9,
    rank: '5/32',
    attendance: 94.5
  }

  const subjects = [
    {
      id: 'MAT',
      name: 'Matemáticas',
      teacher: 'Prof. Carlos Pérez',
      currentGrade: 6.5,
      previousGrade: 6.2,
      trend: 'up',
      assignments: 12,
      pending: 1,
      oa_coverage: 85,
      bloom_distribution: {
        recordar: 20,
        comprender: 25,
        aplicar: 30,
        analizar: 15,
        evaluar: 8,
        crear: 2
      }
    },
    {
      id: 'LEN',
      name: 'Lenguaje',
      teacher: 'Prof. María González',
      currentGrade: 5.8,
      previousGrade: 6.0,
      trend: 'down',
      assignments: 10,
      pending: 2,
      oa_coverage: 78,
      bloom_distribution: {
        recordar: 15,
        comprender: 30,
        aplicar: 25,
        analizar: 20,
        evaluar: 8,
        crear: 2
      }
    },
    {
      id: 'CIE',
      name: 'Ciencias',
      teacher: 'Prof. Ana Rodríguez',
      currentGrade: 6.8,
      previousGrade: 6.5,
      trend: 'up',
      assignments: 8,
      pending: 0,
      oa_coverage: 92,
      bloom_distribution: {
        recordar: 18,
        comprender: 28,
        aplicar: 32,
        analizar: 15,
        evaluar: 5,
        crear: 2
      }
    },
    {
      id: 'HIS',
      name: 'Historia',
      teacher: 'Prof. Luis Fernández',
      currentGrade: 6.0,
      previousGrade: 6.0,
      trend: 'stable',
      assignments: 6,
      pending: 1,
      oa_coverage: 75,
      bloom_distribution: {
        recordar: 25,
        comprender: 30,
        aplicar: 20,
        analizar: 18,
        evaluar: 5,
        crear: 2
      }
    }
  ]

  const recentAssignments = [
    {
      id: 1,
      subject: 'Matemáticas',
      title: 'Quiz IA: Álgebra Básica',
      type: 'quiz_ia',
      date: '2024-12-15',
      grade: 6.5,
      maxGrade: 7.0,
      status: 'graded',
      feedback: 'Excelente comprensión de ecuaciones lineales. Revisar factorización.',
      bloom_level: 'Aplicar'
    },
    {
      id: 2,
      subject: 'Lenguaje',
      title: 'Ensayo: Literatura Contemporánea',
      type: 'task',
      date: '2024-12-14',
      grade: 5.8,
      maxGrade: 7.0,
      status: 'graded',
      feedback: 'Buena estructura argumentativa. Mejorar uso de conectores.',
      bloom_level: 'Crear'
    },
    {
      id: 3,
      subject: 'Ciencias',
      title: 'Laboratorio: Reacciones Químicas',
      type: 'lab',
      date: '2024-12-13',
      grade: 6.8,
      maxGrade: 7.0,
      status: 'graded',
      feedback: 'Procedimiento correcto y conclusiones acertadas.',
      bloom_level: 'Analizar'
    },
    {
      id: 4,
      subject: 'Historia',
      title: 'Trivia Game: Independencia',
      type: 'game',
      date: '2024-12-12',
      grade: 6.0,
      maxGrade: 7.0,
      status: 'graded',
      feedback: 'Participación activa en el juego colaborativo.',
      bloom_level: 'Recordar'
    },
    {
      id: 5,
      subject: 'Matemáticas',
      title: 'Examen: Geometría',
      type: 'exam',
      date: '2024-12-10',
      grade: 0,
      maxGrade: 7.0,
      status: 'pending',
      feedback: '',
      bloom_level: 'Aplicar'
    }
  ]

  const progressChart = [
    { month: 'Ago', grade: 5.8 },
    { month: 'Sep', grade: 6.0 },
    { month: 'Oct', grade: 5.9 },
    { month: 'Nov', grade: 6.1 },
    { month: 'Dic', grade: 6.2 }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      default: return <MinusIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Calificado</span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pendiente</span>
      case 'late':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Atrasado</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>
    }
  }

  const getBloomColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Recordar': 'bg-blue-100 text-blue-800',
      'Comprender': 'bg-green-100 text-green-800',
      'Aplicar': 'bg-yellow-100 text-yellow-800',
      'Analizar': 'bg-orange-100 text-orange-800',
      'Evaluar': 'bg-red-100 text-red-800',
      'Crear': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const filteredSubjects = selectedSubject === 'all' ? subjects : subjects.filter(s => s.id === selectedSubject)
  const filteredAssignments = selectedSubject === 'all' 
    ? recentAssignments 
    : recentAssignments.filter(a => subjects.find(s => s.name === a.subject)?.id === selectedSubject)

  // Button handlers
  const handleExportReport = () => {
    toast.loading('Generando reporte de progreso académico...')
    
    setTimeout(() => {
      toast.dismiss()
      toast.success('Reporte descargado exitosamente')
      
      // Simulate file download
      const element = document.createElement('a')
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
        `Reporte de Progreso Académico\n` +
        `Estudiante: ${childData.name}\n` +
        `Curso: ${childData.grade}\n` +
        `Promedio: ${childData.currentGPA}\n` +
        `Período: ${selectedPeriod}\n` +
        `Fecha: ${new Date().toLocaleDateString()}`
      )
      element.download = `progreso_academico_${childData.name.replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 2000)
  }

  const handleViewFeedback = (assignment: any) => {
    if (assignment.feedback) {
      toast.success('Mostrando retroalimentación completa')
      
      // Create modal content
      const modal = document.createElement('div')
      modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'
      modal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">${assignment.title}</h3>
          <div class="mb-4">
            <span class="text-sm font-medium text-gray-700">Calificación:</span>
            <span class="ml-2 text-lg font-bold text-blue-600">${assignment.grade}/${assignment.maxGrade}</span>
          </div>
          <div class="mb-4">
            <span class="text-sm font-medium text-gray-700">Retroalimentación:</span>
            <p class="mt-1 text-sm text-gray-600">${assignment.feedback}</p>
          </div>
          <div class="flex justify-end">
            <button onclick="this.closest('.fixed').remove()" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Cerrar
            </button>
          </div>
        </div>
      `
      document.body.appendChild(modal)
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal)
        }
      }, 10000)
    } else {
      toast.error('No hay retroalimentación disponible para esta evaluación')
    }
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    toast.success(`Período actualizado a: ${period === 'semester' ? 'Semestre' : period === 'month' ? 'Último Mes' : 'Año Completo'}`)
  }

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject)
    const subjectName = subject === 'all' ? 'Todas las Asignaturas' : subjects.find(s => s.id === subject)?.name || subject
    toast.success(`Filtro aplicado: ${subjectName}`)
  }

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode)
    toast.success(`Vista cambiada a: ${mode === 'summary' ? 'Resumen' : mode === 'detailed' ? 'Detallado' : 'Gráfico'}`)
  }

  const handlePrintReport = () => {
    toast.success('Preparando vista para impresión...')
    window.print()
  }

  const handleShareProgress = () => {
    if (navigator.share) {
      navigator.share({
        title: `Progreso Académico - ${childData.name}`,
        text: `Promedio actual: ${childData.currentGPA}, Ranking: ${childData.rank}`,
        url: window.location.href
      }).then(() => {
        toast.success('Progreso compartido exitosamente')
      }).catch(() => {
        toast.error('Error al compartir')
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Enlace copiado al portapapeles')
      }).catch(() => {
        toast.error('Error al copiar enlace')
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Progreso Académico 📊</h1>
          <p className="mt-2 opacity-90">
            Seguimiento detallado del rendimiento de {childData.name} en {childData.grade}
          </p>
        </div>

        {/* Overall Performance */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Rendimiento General</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintReport}
                >
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareProgress}
                >
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  Compartir
                </Button>
                <Button
                  size="sm"
                  onClick={handleExportReport}
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-2xl font-bold text-gray-900">{childData.currentGPA}</span>
                  {childData.currentGPA > childData.previousGPA && (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600">Promedio Actual</div>
                <div className="text-xs text-gray-500">Anterior: {childData.previousGPA}</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <TrophyIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.rank}</div>
                <div className="text-sm text-gray-600">Ranking del Curso</div>
                <div className="text-xs text-gray-500">de 32 estudiantes</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <ChartBarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(subjects.reduce((acc, s) => acc + s.oa_coverage, 0) / subjects.length)}%
                </div>
                <div className="text-sm text-gray-600">Cobertura OA</div>
                <div className="text-xs text-gray-500">Promedio general</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <CalendarIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{childData.attendance}%</div>
                <div className="text-sm text-gray-600">Asistencia</div>
                <div className="text-xs text-gray-500">Este semestre</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select
                value={selectedPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="month">Último Mes</option>
                <option value="semester">Semestre</option>
                <option value="year">Año Completo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asignatura</label>
              <select
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las Asignaturas</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vista</label>
              <select
                value={viewMode}
                onChange={(e) => handleViewModeChange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="summary">Resumen</option>
                <option value="detailed">Detallado</option>
                <option value="chart">Gráfico</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Rendimiento por Asignatura</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {filteredSubjects.map((subject) => (
                <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                      <p className="text-sm text-gray-600">{subject.teacher}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(subject.trend)}
                      <span className="text-2xl font-bold text-gray-900">{subject.currentGrade}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Cobertura OA</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${subject.oa_coverage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{subject.oa_coverage}% completado</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Evaluaciones</div>
                      <div className="text-sm text-gray-600">
                        {subject.assignments} realizadas, {subject.pending} pendientes
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Distribución Bloom</div>
                      <div className="flex space-x-1">
                        {Object.entries(subject.bloom_distribution).map(([level, percentage]) => (
                          <div
                            key={level}
                            className="h-2 bg-blue-600 rounded"
                            style={{ width: `${percentage}%` }}
                            title={`${level}: ${percentage}%`}
                          ></div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Niveles cognitivos</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Evaluaciones Recientes</h2>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel Bloom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                        <div className="text-sm text-gray-500">{assignment.subject}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(assignment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignment.status === 'graded' ? (
                        <div className="text-sm">
                          <span className={`font-bold ${
                            assignment.grade >= 6.0 ? 'text-green-600' :
                            assignment.grade >= 5.0 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {assignment.grade}
                          </span>
                          <span className="text-gray-500"> / {assignment.maxGrade}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(assignment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBloomColor(assignment.bloom_level)}`}>
                        {assignment.bloom_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {assignment.feedback && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewFeedback(assignment)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Ver Feedback
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Evolución del Promedio</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-end space-x-2">
              {progressChart.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-600 rounded-t hover:bg-blue-700 cursor-pointer transition-colors"
                    style={{ height: `${(month.grade / 7.0) * 200}px` }}
                    title={`${month.month}: ${month.grade}`}
                    onClick={() => toast.success(`${month.month}: Promedio ${month.grade}`)}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{month.month}</div>
                  <div className="text-xs font-medium text-gray-900">{month.grade}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 