'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import {
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface BloomLevel {
  level: string
  count: number
  percentage: number
  avg_score: number
}

interface OACoverage {
  oa_code: string
  oa_title: string
  bloom_level: string
  coverage_status: 'covered' | 'partial' | 'not_covered'
  student_count: number
  avg_score: number
  priority: 'high' | 'medium' | 'low'
}

interface WeeklyReport {
  report_metadata: {
    class_id: string
    class_name: string
    grade_code: string
    subject: string
    teacher: string
    period: { start_date: string; end_date: string }
    generated_at: string
    p1_compliant: boolean
  }
  summary_statistics: {
    total_students: number
    total_evaluations: number
    avg_class_performance: number
    oas_evaluated: number
    oas_total: number
    oa_coverage_percentage: number
  }
  oa_coverage: OACoverage[]
  bloom_analysis: Record<string, BloomLevel>
  remedial_suggestions: Array<{
    type: string
    priority: string
    description: string
    recommended_actions: string[]
  }>
}

export default function OAReportsPage() {
  const [classes, setClasses] = useState<any[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [weekStart, setWeekStart] = useState(getWeekStart())
  const [weekEnd, setWeekEnd] = useState(getWeekEnd())
  const [reports, setReports] = useState<WeeklyReport[]>([])
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      const response = await fetch('/api/class/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (data.success) {
        setClasses(data.data)
        if (data.data.length > 0) {
          setSelectedClass(data.data[0].class_id)
        }
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      // Mock data for development
      const mockClasses = [
        {
          class_id: 'class-001',
          class_name: '5°A Matemáticas',
          grade_code: '5B',
          subjects: { subject_name: 'Matemática' }
        },
        {
          class_id: 'class-002', 
          class_name: '6°B Lenguaje',
          grade_code: '6B',
          subjects: { subject_name: 'Lenguaje y Comunicación' }
        }
      ]
      setClasses(mockClasses)
      setSelectedClass(mockClasses[0].class_id)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyReport = async (format: 'json' | 'csv' | 'pdf' = 'json') => {
    if (!selectedClass) {
      toast.error('Selecciona una clase')
      return
    }

    try {
      setGenerating(true)

      const response = await fetch(`/api/reports/weekly/oa-bloom/${selectedClass}?start_date=${weekStart}&end_date=${weekEnd}&format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (format === 'json') {
        const data = await response.json()
        
        if (data.success) {
          setReports([data.data])
          toast.success('✅ Reporte P1-ADMIN-ESC generado exitosamente')
        } else {
          throw new Error(data.error || 'Error al generar reporte')
        }
      } else {
        // Handle file download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `reporte-oa-bloom-${weekStart}.${format}`
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success(`📄 Reporte ${format.toUpperCase()} descargado`)
      }

    } catch (error: any) {
      console.error('Error generating report:', error)
      toast.error('❌ Error al generar reporte: ' + error.message)
      
      // Mock data for development
      if (format === 'json') {
        const mockReport: WeeklyReport = {
          report_metadata: {
            class_id: selectedClass,
            class_name: '5°A Matemáticas',
            grade_code: '5B',
            subject: 'Matemática',
            teacher: 'María González',
            period: { start_date: weekStart, end_date: weekEnd },
            generated_at: new Date().toISOString(),
            p1_compliant: true
          },
          summary_statistics: {
            total_students: 25,
            total_evaluations: 8,
            avg_class_performance: 78.5,
            oas_evaluated: 12,
            oas_total: 18,
            oa_coverage_percentage: 66.7
          },
          oa_coverage: [
            {
              oa_code: 'MA05-OA01',
              oa_title: 'Representar y describir números hasta 100.000',
              bloom_level: 'Recordar',
              coverage_status: 'covered',
              student_count: 25,
              avg_score: 82.3,
              priority: 'high'
            },
            {
              oa_code: 'MA05-OA02',
              oa_title: 'Aplicar estrategias de cálculo mental',
              bloom_level: 'Aplicar',
              coverage_status: 'partial',
              student_count: 15,
              avg_score: 75.8,
              priority: 'high'
            },
            {
              oa_code: 'MA05-OA03',
              oa_title: 'Resolver problemas con números naturales',
              bloom_level: 'Analizar',
              coverage_status: 'not_covered',
              student_count: 0,
              avg_score: 0,
              priority: 'high'
            }
          ],
          bloom_analysis: {
            recordar: { level: 'Recordar', count: 45, percentage: 35, avg_score: 82.3 },
            comprender: { level: 'Comprender', count: 38, percentage: 30, avg_score: 78.9 },
            aplicar: { level: 'Aplicar', count: 25, percentage: 20, avg_score: 74.2 },
            analizar: { level: 'Analizar', count: 15, percentage: 12, avg_score: 69.8 },
            evaluar: { level: 'Evaluar', count: 3, percentage: 2, avg_score: 65.4 },
            crear: { level: 'Crear', count: 2, percentage: 1, avg_score: 62.1 }
          },
          remedial_suggestions: [
            {
              type: 'uncovered_high_priority_oas',
              priority: 'high',
              description: 'Existen 6 OAs de alta prioridad sin evaluar esta semana',
              recommended_actions: [
                'Planificar evaluaciones para MA05-OA03, MA05-OA05',
                'Crear actividades de refuerzo específicas',
                'Considerar evaluación formativa rápida'
              ]
            },
            {
              type: 'low_bloom_performance',
              priority: 'medium',
              description: 'Rendimiento bajo en niveles Bloom superiores (Analizar: 69.8%)',
              recommended_actions: [
                'Implementar preguntas de análisis graduales',
                'Usar estrategias de pensamiento crítico',
                'Reforzar habilidades de razonamiento'
              ]
            }
          ]
        }
        setReports([mockReport])
        toast.success('✅ Reporte demo generado')
      }
    } finally {
      setGenerating(false)
    }
  }

  const getOAStatusColor = (status: string) => {
    switch (status) {
      case 'covered': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'not_covered': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-sm">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Reportes Semanales OA/Bloom
                </h1>
                <p className="text-indigo-100 mt-1">
                  P1-ADMIN-ESC: Análisis de cobertura curricular y remediales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clase
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {classes.map(cls => (
                  <option key={cls.class_id} value={cls.class_id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semana Inicio
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semana Fin
              </label>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-end space-x-2">
              <Button
                onClick={() => generateWeeklyReport()}
                isLoading={generating}
                className="flex-1"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Generar
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={() => generateWeeklyReport('csv')}
              variant="outline"
              size="sm"
              disabled={generating}
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button
              onClick={() => generateWeeklyReport('pdf')}
              variant="outline"
              size="sm"
              disabled={generating}
            >
              <DocumentTextIcon className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Reports Display */}
        {reports.map((report, index) => (
          <div key={index} className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resumen Ejecutivo
                </h2>
                <div className="flex items-center space-x-2">
                  {report.report_metadata.p1_compliant && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      <CheckCircleIcon className="h-3 w-3" />
                      <span>P1 Compliant</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">
                    {new Date(report.report_metadata.generated_at).toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {report.summary_statistics.oa_coverage_percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-700">Cobertura OA</div>
                  <div className="text-xs text-blue-600">
                    {report.summary_statistics.oas_evaluated}/{report.summary_statistics.oas_total} OAs
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {report.summary_statistics.avg_class_performance.toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-700">Rendimiento Promedio</div>
                  <div className="text-xs text-green-600">
                    {report.summary_statistics.total_students} estudiantes
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(report.bloom_analysis).length}
                  </div>
                  <div className="text-sm text-purple-700">Niveles Bloom</div>
                  <div className="text-xs text-purple-600">evaluados</div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {report.remedial_suggestions.length}
                  </div>
                  <div className="text-sm text-orange-700">Remediales</div>
                  <div className="text-xs text-orange-600">sugeridos</div>
                </div>
              </div>
            </div>

            {/* OA Coverage */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Cobertura de Objetivos de Aprendizaje</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código OA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bloom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rendimiento
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {report.oa_coverage.map((oa) => (
                      <tr key={oa.oa_code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {oa.oa_code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {oa.oa_title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {oa.bloom_level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOAStatusColor(oa.coverage_status)}`}>
                            {oa.coverage_status === 'covered' ? 'Cubierto' : 
                             oa.coverage_status === 'partial' ? 'Parcial' : 'Sin cubrir'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(oa.priority)}`}>
                            {oa.priority === 'high' ? 'Alta' : oa.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {oa.coverage_status !== 'not_covered' ? `${oa.avg_score.toFixed(1)}%` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bloom Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Análisis por Taxonomía de Bloom</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(report.bloom_analysis).map((bloom) => (
                    <div key={bloom.level} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{bloom.level}</h4>
                        <span className="text-sm text-gray-600">{bloom.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${bloom.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{bloom.count} preguntas</span>
                        <span>{bloom.avg_score.toFixed(1)}% prom.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Remedial Suggestions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Sugerencias Remediales</h3>
              </div>
              <div className="p-6 space-y-4">
                {report.remedial_suggestions.map((suggestion, idx) => (
                  <div key={idx} className={`border-l-4 pl-4 py-3 ${
                    suggestion.priority === 'high' ? 'border-red-400 bg-red-50' :
                    suggestion.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                    'border-green-400 bg-green-50'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <ExclamationTriangleIcon className={`h-5 w-5 mt-0.5 ${
                        suggestion.priority === 'high' ? 'text-red-500' :
                        suggestion.priority === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          suggestion.priority === 'high' ? 'text-red-800' :
                          suggestion.priority === 'medium' ? 'text-yellow-800' :
                          'text-green-800'
                        }`}>
                          {suggestion.description}
                        </h4>
                        <ul className={`mt-2 text-sm ${
                          suggestion.priority === 'high' ? 'text-red-700' :
                          suggestion.priority === 'medium' ? 'text-yellow-700' :
                          'text-green-700'
                        } space-y-1`}>
                          {suggestion.recommended_actions.map((action, actionIdx) => (
                            <li key={actionIdx} className="flex items-start space-x-2">
                              <span className="text-current">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* P1 Compliance Notice */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AcademicCapIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-indigo-800">
                Cumplimiento P1-ADMIN-ESC
              </h3>
              <p className="text-sm text-indigo-700 mt-1">
                Reportes semanales de cobertura OA y análisis Bloom con sugerencias remediales automatizadas. 
                Exportación disponible en CSV y PDF para cumplir normativas MINEDUC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper functions
function getWeekStart(): string {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1))
  return startOfWeek.toISOString().split('T')[0]
}

function getWeekEnd(): string {
  const now = new Date()
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 7))
  return endOfWeek.toISOString().split('T')[0]
} 