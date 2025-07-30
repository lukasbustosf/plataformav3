'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  FaceSmileIcon,
  FaceFrownIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

export default function EmotionalDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [exportingReport, setExportingReport] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleExportReport = async () => {
    setExportingReport(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('😊 Reporte emocional exportado - P3-C-05')
    } catch (error) {
      toast.error('Error al exportar reporte')
    } finally {
      setExportingReport(false)
    }
  }

  const getEmotionalColor = (state: string) => {
    switch (state) {
      case 'happy': return 'bg-green-500'
      case 'neutral': return 'bg-yellow-500'
      case 'sad': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getEmotionalEmoji = (state: string) => {
    switch (state) {
      case 'happy': return '😊'
      case 'neutral': return '😐'
      case 'sad': return '😟'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando semáforo emocional...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-pink-100 rounded-full">
                <HeartIcon className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Semáforo Socio-Emocional</h1>
                <p className="text-gray-600">P3-C-05: Monitoreo diario del estado emocional</p>
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
            <h3 className="text-lg font-medium">Filtros</h3>
            <div className="flex space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-6xl mb-4">😊</div>
            <div className="text-3xl font-bold text-green-600 mb-2">142</div>
            <div className="text-lg font-medium text-gray-900 mb-1">Estado Positivo</div>
            <div className="text-sm text-gray-600">78% del total</div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-6xl mb-4">😐</div>
            <div className="text-3xl font-bold text-yellow-600 mb-2">28</div>
            <div className="text-lg font-medium text-gray-900 mb-1">Estado Neutro</div>
            <div className="text-sm text-gray-600">15% del total</div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-6xl mb-4">😟</div>
            <div className="text-3xl font-bold text-red-600 mb-2">12</div>
            <div className="text-lg font-medium text-gray-900 mb-1">Estado Negativo</div>
            <div className="text-sm text-gray-600">7% del total</div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
              <div className="bg-red-500 h-3 rounded-full" style={{ width: '7%' }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Por Curso</h3>
            
            <div className="space-y-4">
              {[
                { grade: '1°A', happy: 25, neutral: 3, sad: 2, total: 30 },
                { grade: '2°A', happy: 22, neutral: 5, sad: 1, total: 28 },
                { grade: '3°A', happy: 18, neutral: 4, sad: 3, total: 25 },
                { grade: '4°A', happy: 24, neutral: 4, sad: 2, total: 30 },
                { grade: '5°A', happy: 27, neutral: 6, sad: 2, total: 35 },
                { grade: '6°A', happy: 26, neutral: 6, sad: 2, total: 34 }
              ].map((item) => (
                <div key={item.grade} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{item.grade}</h4>
                    <span className="text-sm text-gray-500">{item.total} estudiantes</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-green-600">😊</span>
                      <span className="text-sm font-medium text-green-600">{item.happy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-600">😐</span>
                      <span className="text-sm font-medium text-yellow-600">{item.neutral}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-600">😟</span>
                      <span className="text-sm font-medium text-red-600">{item.sad}</span>
                    </div>
                  </div>
                  
                  <div className="flex rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(item.happy / item.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-yellow-500" 
                      style={{ width: `${(item.neutral / item.total) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(item.sad / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Estudiantes que Requieren Atención</h3>
            
            <div className="space-y-4">
              {[
                { 
                  name: 'María González', 
                  grade: '3°A', 
                  state: 'sad', 
                  days_consecutive: 3,
                  reason: 'Problemas familiares reportados',
                  action_taken: 'Derivada a psicólogo'
                },
                { 
                  name: 'Carlos Pérez', 
                  grade: '5°A', 
                  state: 'sad', 
                  days_consecutive: 2,
                  reason: 'Dificultades académicas',
                  action_taken: 'Reunión con apoderados programada'
                },
                { 
                  name: 'Ana Martínez', 
                  grade: '2°A', 
                  state: 'neutral', 
                  days_consecutive: 5,
                  reason: 'Cambio de comportamiento',
                  action_taken: 'En observación'
                }
              ].map((student, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  student.state === 'sad' ? 'border-red-200 bg-red-50' :
                  student.state === 'neutral' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getEmotionalEmoji(student.state)}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.grade}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.days_consecutive >= 3 ? 'bg-red-100 text-red-700' :
                        student.days_consecutive >= 2 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {student.days_consecutive} días consecutivos
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Motivo:</strong> {student.reason}
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <strong>Acción:</strong> {student.action_taken}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Tendencia Semanal</h3>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-500 mb-2">{day}</div>
                <div className="space-y-1">
                  <div className="text-xs text-green-600">😊 {75 + Math.floor(Math.random() * 10)}%</div>
                  <div className="text-xs text-yellow-600">😐 {15 + Math.floor(Math.random() * 5)}%</div>
                  <div className="text-xs text-red-600">😟 {5 + Math.floor(Math.random() * 5)}%</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">📊 Insight Semanal</h4>
            <p className="text-sm text-blue-800">
              Los lunes muestran mayor porcentaje de estados neutros (20%), posiblemente relacionado con la transición del fin de semana. 
              Los viernes presentan el mayor bienestar emocional (82% positivo).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Factores de Riesgo Detectados</h3>
            
            <div className="space-y-3">
              {[
                { factor: 'Problemas familiares', count: 5, severity: 'high' },
                { factor: 'Dificultades académicas', count: 3, severity: 'medium' },
                { factor: 'Conflictos entre pares', count: 2, severity: 'medium' },
                { factor: 'Cambios de comportamiento', count: 2, severity: 'low' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  item.severity === 'high' ? 'bg-red-50 border border-red-200' :
                  item.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className={`h-5 w-5 ${
                      item.severity === 'high' ? 'text-red-600' :
                      item.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <span className="text-sm font-medium text-gray-900">{item.factor}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.severity === 'high' ? 'bg-red-100 text-red-700' :
                    item.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.count} casos
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Acciones Recomendadas</h3>
            
            <div className="space-y-3">
              {[
                'Implementar círculos de conversación en 3°A (mayor concentración de casos)',
                'Programar talleres de manejo emocional para estudiantes en riesgo',
                'Coordinar reuniones con familias de estudiantes con problemas familiares',
                'Reforzar estrategias de apoyo académico en 5°A',
                'Establecer protocolo de seguimiento diario para casos críticos'
              ].map((action, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600">💡</span>
                  <p className="text-sm text-purple-900">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 