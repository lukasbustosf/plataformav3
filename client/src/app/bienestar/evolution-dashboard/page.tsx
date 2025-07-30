'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  ChartBarIcon,
  AcademicCapIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

export default function EvolutionDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('semester')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [exportingReport, setExportingReport] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200)
  }, [])

  const handleExportReport = async () => {
    setExportingReport(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('📈 Reporte de evolución exportado - P3-C-04')
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
          <p className="text-gray-600">Analizando evolución de estudiantes...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard de Evolución</h1>
                <p className="text-gray-600">P3-C-04: Análisis de tendencias Bloom + asistencia</p>
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Filtros de Análisis</h3>
            <div className="flex space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="month">Último mes</option>
                <option value="semester">Semestre actual</option>
                <option value="year">Año completo</option>
              </select>
              
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los cursos</option>
                <option value="1">1° Básico</option>
                <option value="2">2° Básico</option>
                <option value="3">3° Básico</option>
                <option value="4">4° Básico</option>
                <option value="5">5° Básico</option>
                <option value="6">6° Básico</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
              Evolución Competencias Bloom
            </h3>
            
            <div className="space-y-4">
              {[
                { level: 'Recordar', current: 82, previous: 78, students: 45 },
                { level: 'Comprender', current: 75, previous: 73, students: 42 },
                { level: 'Aplicar', current: 68, previous: 71, students: 38 },
                { level: 'Analizar', current: 61, previous: 58, students: 35 },
                { level: 'Evaluar', current: 54, previous: 52, students: 28 },
                { level: 'Crear', current: 49, previous: 47, students: 25 }
              ].map((item) => {
                const change = item.current - item.previous
                const isImproving = change > 0
                
                return (
                  <div key={item.level} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.level}</h4>
                      <div className="flex items-center space-x-2">
                        {isImproving ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                        ) : change === 0 ? (
                          <span className="text-gray-500">→</span>
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          isImproving ? 'text-green-600' : 
                          change === 0 ? 'text-gray-600' : 'text-red-600'
                        }`}>
                          {change > 0 ? '+' : ''}{change}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">{item.current}%</span>
                      <span className="text-sm text-gray-500">{item.students} estudiantes</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.current >= 80 ? 'bg-green-500' :
                          item.current >= 60 ? 'bg-blue-500' :
                          item.current >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.current}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
              Evolución de Asistencia
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">89.2%</div>
                  <div className="text-sm text-gray-600">Promedio de asistencia</div>
                  <div className="flex items-center justify-center mt-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2.3% vs mes anterior</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">156</div>
                  <div className="text-sm text-gray-600">Estudiantes regulares</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Con alertas</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Por curso:</h4>
                {[
                  { grade: '1°A', attendance: 92, trend: 'up' },
                  { grade: '2°A', attendance: 88, trend: 'stable' },
                  { grade: '3°A', attendance: 87, trend: 'down' },
                  { grade: '4°A', attendance: 91, trend: 'up' },
                  { grade: '5°A', attendance: 85, trend: 'down' },
                  { grade: '6°A', attendance: 90, trend: 'up' }
                ].map((item) => (
                  <div key={item.grade} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{item.grade}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{item.attendance}%</span>
                      {item.trend === 'up' && <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />}
                      {item.trend === 'down' && <ArrowTrendingDownIcon className="h-3 w-3 text-red-500" />}
                      {item.trend === 'stable' && <span className="text-gray-500 text-xs">→</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Estudiantes que Requieren Atención</h3>
          
          <div className="space-y-4">
            {[
              { 
                name: 'María González', 
                grade: '3°A', 
                bloom_trend: 'declining', 
                attendance: 78, 
                alerts: ['Bajo rendimiento en Analizar', 'Asistencia irregular'],
                risk_level: 'medium'
              },
              { 
                name: 'Carlos Pérez', 
                grade: '5°A', 
                bloom_trend: 'stable', 
                attendance: 65, 
                alerts: ['Asistencia crítica', 'Dificultades en Crear'],
                risk_level: 'high'
              },
              { 
                name: 'Ana Martínez', 
                grade: '2°A', 
                bloom_trend: 'improving', 
                attendance: 82, 
                alerts: ['Mejora en Bloom pero asistencia baja'],
                risk_level: 'low'
              }
            ].map((student, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                student.risk_level === 'high' ? 'border-red-200 bg-red-50' :
                student.risk_level === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      student.risk_level === 'high' ? 'bg-red-100' :
                      student.risk_level === 'medium' ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      <UsersIcon className={`h-5 w-5 ${
                        student.risk_level === 'high' ? 'text-red-600' :
                        student.risk_level === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{student.name}</h4>
                      <p className="text-sm text-gray-600">{student.grade} • Asistencia: {student.attendance}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                      student.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {student.risk_level === 'high' ? 'Riesgo Alto' :
                       student.risk_level === 'medium' ? 'Riesgo Medio' :
                       'Riesgo Bajo'}
                    </span>
                    
                    {student.bloom_trend === 'improving' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />}
                    {student.bloom_trend === 'declining' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />}
                    {student.bloom_trend === 'stable' && <span className="text-gray-500">→</span>}
                  </div>
                </div>
                
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Alertas:</h5>
                  <div className="space-y-1">
                    {student.alerts.map((alert, alertIndex) => (
                      <div key={alertIndex} className="flex items-center text-xs text-gray-600">
                        <ExclamationTriangleIcon className="h-3 w-3 text-orange-500 mr-1" />
                        {alert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Correlación Bloom-Asistencia</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Insight Principal</h4>
                <p className="text-sm text-blue-800">
                  Estudiantes con asistencia superior al 85% muestran 23% mejor rendimiento en competencias Bloom superiores (Analizar, Evaluar, Crear).
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Asistencia 90%+</span>
                  <span className="font-medium text-green-600">Bloom promedio: 74%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Asistencia 80-90%</span>
                  <span className="font-medium text-blue-600">Bloom promedio: 68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Asistencia 80%</span>
                  <span className="font-medium text-red-600">Bloom promedio: 51%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Recomendaciones</h3>
            
            <div className="space-y-3">
              {[
                'Implementar programas de apoyo específicos para estudiantes con riesgo alto',
                'Fortalecer estrategias de enseñanza en competencias Bloom superiores',
                'Crear plan de seguimiento individual para casos de asistencia irregular',
                'Establecer reuniones semanales con apoderados de estudiantes en riesgo'
              ].map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600">💡</span>
                  <p className="text-sm text-purple-900">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 