'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import {
  DocumentArrowDownIcon,
  ChartBarIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline'

export default function BloomRadarPage() {
  const [loading, setLoading] = useState(true)
  const [exportingPDF, setExportingPDF] = useState(false)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleExportPDF = async () => {
    setExportingPDF(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('📊 Radar Bloom exportado como PDF - P3-S-02')
    } catch (error) {
      toast.error('Error al exportar PDF')
    } finally {
      setExportingPDF(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analizando tu progreso Bloom...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mi Radar Bloom</h1>
                <p className="text-gray-600">P3-S-02: Análisis personal de habilidades</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    🌟 Competente
                  </span>
                  <span className="text-sm text-gray-500">Puntaje: 78/100</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<SpeakerWaveIcon className="h-4 w-4" />}
              >
                Audio ON
              </Button>
              
              <Button
                onClick={handleExportPDF}
                isLoading={exportingPDF}
                leftIcon={<DocumentArrowDownIcon className="h-4 w-4" />}
              >
                Exportar PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Radar de Habilidades Bloom</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { level: 'Recordar', score: 85, color: 'green', topics: ['Tabla de multiplicar', 'Capitales'] },
              { level: 'Comprender', score: 78, color: 'blue', topics: ['Comprensión lectora', 'Experimentos'] },
              { level: 'Aplicar', score: 72, color: 'yellow', topics: ['Problemas matemáticos', 'Fórmulas'] },
              { level: 'Analizar', score: 65, color: 'orange', topics: ['Análisis de textos', 'Comparaciones'] },
              { level: 'Evaluar', score: 58, color: 'red', topics: ['Evaluar argumentos', 'Crítica'] },
              { level: 'Crear', score: 62, color: 'purple', topics: ['Escritura creativa', 'Diseño'] }
            ].map((item) => (
              <div key={item.level} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{item.level}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.score >= 80 ? 'bg-green-100 text-green-600' :
                    item.score >= 70 ? 'bg-blue-100 text-blue-600' :
                    item.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {item.score >= 80 ? 'Alto' : item.score >= 60 ? 'Medio' : 'Bajo'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Puntaje:</span>
                    <span className="font-medium">{item.score}/100</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        item.score >= 80 ? 'bg-green-500' :
                        item.score >= 70 ? 'bg-blue-500' :
                        item.score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-1">Temas recientes:</p>
                    {item.topics.map((topic, index) => (
                      <p key={index} className="text-xs text-gray-700">• {topic}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fortalezas y Mejoras</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2">🌟 Fortaleza Principal</h4>
                <p className="text-gray-900 font-medium">Recordar (85 puntos)</p>
                <p className="text-sm text-gray-600">Excelente memorización y recuperación de información</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2">📈 Áreas de Mejora</h4>
                <ul className="space-y-1">
                  <li className="text-gray-700">• Evaluar: Desarrollo de pensamiento crítico</li>
                  <li className="text-gray-700">• Crear: Fomento de la creatividad</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recomendaciones</h3>
            
            <div className="space-y-3">
              {[
                'Practicar más actividades de evaluación crítica',
                'Participar en proyectos creativos',
                'Fortalecer habilidades de análisis',
                'Continuar excelente trabajo en memorización'
              ].map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">💡</span>
                  <p className="text-sm text-blue-900">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 