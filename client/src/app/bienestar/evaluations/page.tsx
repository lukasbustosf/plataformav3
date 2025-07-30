'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ClipboardDocumentListIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarEvaluationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const evaluationStats = {
    totalEvaluations: 45,
    completedThisMonth: 12,
    pendingReview: 8,
    criticalCases: 3
  }

  const handleCreateEvaluation = () => {
    toast.success('Creando nueva evaluación psicosocial...')
  }

  const handleViewEvaluation = (id: string) => {
    toast.success(`Abriendo evaluación ${id}...`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluaciones Psicosociales</h1>
            <p className="text-gray-600">Gestión de evaluaciones integrales del bienestar estudiantil</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleCreateEvaluation} className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nueva Evaluación
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Evaluaciones</p>
                <p className="text-2xl font-bold text-blue-600">{evaluationStats.totalEvaluations}</p>
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
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{evaluationStats.completedThisMonth}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{evaluationStats.pendingReview}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Casos Críticos</p>
                <p className="text-2xl font-bold text-red-600">{evaluationStats.criticalCases}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Tools */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Herramientas de Evaluación</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-gray-900">Evaluación Integral Inicial</h3>
                <p className="text-sm text-gray-600 mt-1">Evaluación completa de factores psicosociales</p>
                <Button className="mt-3 w-full" variant="outline">Iniciar Evaluación</Button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-gray-900">Test de Riesgo Psicosocial</h3>
                <p className="text-sm text-gray-600 mt-1">Identificación temprana de factores de riesgo</p>
                <Button className="mt-3 w-full" variant="outline">Aplicar Test</Button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-gray-900">Evaluación Familiar</h3>
                <p className="text-sm text-gray-600 mt-1">Análisis del entorno familiar del estudiante</p>
                <Button className="mt-3 w-full" variant="outline">Evaluar Familia</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Evaluaciones Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Evaluación
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evaluador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { id: 'EVAL-001', student: 'María González', grade: '7°A', type: 'Integral Inicial', status: 'completed', evaluator: 'Psic. Ana López', date: '2024-12-19' },
                  { id: 'EVAL-002', student: 'Carlos Mendoza', grade: '2°B', type: 'Riesgo Psicosocial', status: 'in-progress', evaluator: 'T.S. María Torres', date: '2024-12-18' },
                  { id: 'EVAL-003', student: 'Ana Herrera', grade: '5°A', type: 'Evaluación Familiar', status: 'pending', evaluator: 'Psic. Luis Morales', date: '2024-12-17' }
                ].map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{evaluation.student}</div>
                      <div className="text-sm text-gray-600">{evaluation.grade}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{evaluation.type}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        evaluation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        evaluation.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {evaluation.status === 'completed' ? 'Completada' :
                         evaluation.status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{evaluation.evaluator}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(evaluation.date).toLocaleDateString('es-CL')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewEvaluation(evaluation.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Ver Evaluación"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 