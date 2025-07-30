'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

export default function BenchmarkingPage() {
  const [loading, setLoading] = useState(true)
  const [exportingReport, setExportingReport] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500)
  }, [])

  const handleExportReport = async () => {
    setExportingReport(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('📊 Reporte de benchmarking exportado - P3-D-02')
    } catch (error) {
      toast.error('Error al exportar reporte')
    } finally {
      setExportingReport(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando benchmarks inter-escuela...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Benchmarking Inter-Escuela</h1>
                <p className="text-gray-600">P3-D-02: Comparación anónima de rendimiento nacional</p>
                <div className="flex items-center space-x-2 mt-2">
                  <EyeSlashIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Datos anonimizados por privacidad</span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleExportReport}
              isLoading={exportingReport}
              leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Exportar Reporte
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Tu Colegio vs Promedios Nacionales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { metric: 'Rendimiento General', your_score: 78, percentile: 65, national: 75 },
              { metric: 'Asistencia', your_score: 92, percentile: 75, national: 88 },
              { metric: 'Competencia Bloom', your_score: 72, percentile: 60, national: 68 },
              { metric: 'Engagement IA', your_score: 85, percentile: 90, national: 72 }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    item.percentile >= 75 ? 'text-green-600 bg-green-100' :
                    item.percentile >= 50 ? 'text-blue-600 bg-blue-100' :
                    'text-yellow-600 bg-yellow-100'
                  }`}>
                    Percentil {item.percentile}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{item.your_score}%</div>
                <div className="text-sm text-gray-600 mb-2">{item.metric}</div>
                
                <div className="text-xs text-gray-500">
                  Nacional: {item.national}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Ranking Nacional (Rendimiento General)</h3>
          
          <div className="space-y-3">
            {[
              { code: 'TU COLEGIO', score: 78, rank: 45, isYours: true },
              { code: 'SCH-001', score: 95, rank: 1, isYours: false },
              { code: 'SCH-002', score: 92, rank: 2, isYours: false },
              { code: 'SCH-003', score: 89, rank: 3, isYours: false },
              { code: 'SCH-015', score: 82, rank: 15, isYours: false },
              { code: 'SCH-032', score: 80, rank: 32, isYours: false },
              { code: 'SCH-067', score: 75, rank: 67, isYours: false },
              { code: 'SCH-089', score: 72, rank: 89, isYours: false }
            ].map((school, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  school.isYours ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    school.rank <= 3 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {school.rank}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{school.code}</div>
                    <div className="text-sm text-gray-600">
                      {school.isYours ? 'Tu colegio' : 'Colegio anónimo'}
                    </div>
                  </div>
                </div>
                
                <div className="text-lg font-bold text-gray-900">{school.score}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Insights del Análisis</h3>
            <div className="space-y-3">
              {[
                'Tu colegio está en el percentil 65 de rendimiento general',
                'El engagement con IA está en el top 10% nacional',
                'La asistencia está por sobre el promedio regional',
                'Hay oportunidades de mejora en competencias Bloom'
              ].map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-blue-600">📊</span>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Recomendaciones</h3>
            <div className="space-y-3">
              {[
                'Implementar programas de refuerzo en habilidades de análisis',
                'Aprovechar el alto engagement IA para fortalecer áreas débiles',
                'Mantener las buenas prácticas de asistencia',
                'Considerar intercambio de experiencias con colegios líderes'
              ].map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-green-600">💡</span>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 