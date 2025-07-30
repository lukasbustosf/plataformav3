'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CpuChipIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function AIBudgetPage() {
  const { user } = useAuth()
  
  // Mock AI usage data
  const aiUsage = {
    totalCredits: 5000,
    usedCredits: 2340,
    remainingCredits: 2660,
    monthlyQuizzes: 156,
    costPerQuiz: 15,
    averageTokensPerQuiz: 2500
  }

  const usagePercentage = (aiUsage.usedCredits / aiUsage.totalCredits) * 100

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Presupuesto IA 🤖</h1>
                <p className="text-gray-600 mt-1">
                  Monitoreo de uso y costos de Inteligencia Artificial
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => toast.success('Exportando reporte de uso IA...')}
                  variant="outline"
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Exportar Reporte
                </Button>
                <Button
                  onClick={() => toast.success('Configurando límites de presupuesto...')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <CpuChipIcon className="h-5 w-5 mr-2" />
                  Configurar Límites
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Créditos Utilizados</p>
                <p className="text-2xl font-bold text-gray-900">{aiUsage.usedCredits.toLocaleString()}</p>
                <p className="text-xs text-gray-500">de {aiUsage.totalCredits.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={usagePercentage > 80 ? "text-red-500" : usagePercentage > 60 ? "text-yellow-500" : "text-green-500"}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${usagePercentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium">{Math.round(usagePercentage)}%</span>
                </div>
              </div>
            </div>
            {usagePercentage > 80 && (
              <div className="mt-4 flex items-center text-red-600">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                <span className="text-xs">Uso elevado - revisar límites</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Quizzes IA Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">{aiUsage.monthlyQuizzes}</p>
                <p className="text-xs text-green-600">+12% vs mes anterior</p>
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
                <p className="text-sm font-medium text-gray-500">Costo Promedio/Quiz</p>
                <p className="text-2xl font-bold text-gray-900">${aiUsage.costPerQuiz}</p>
                <p className="text-xs text-gray-500">CLP por generación</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Details */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detalles de Uso</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Distribución por Profesor</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>María González</span>
                    <span className="font-medium">45 quizzes (680 créditos)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Carlos Ruiz</span>
                    <span className="font-medium">38 quizzes (570 créditos)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ana López</span>
                    <span className="font-medium">32 quizzes (480 créditos)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Elena Vargas</span>
                    <span className="font-medium">28 quizzes (420 créditos)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Uso por Asignatura</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Matemáticas</span>
                    <span className="font-medium">62 quizzes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ciencias</span>
                    <span className="font-medium">41 quizzes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Lenguaje</span>
                    <span className="font-medium">35 quizzes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Historia</span>
                    <span className="font-medium">18 quizzes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Proyección Mensual</h4>
                  <p className="text-xs text-gray-500">
                    Al ritmo actual: ~3,120 créditos/mes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">Presupuesto restante</p>
                  <p className="text-lg font-bold text-green-600">
                    ${(aiUsage.remainingCredits * aiUsage.costPerQuiz / 100).toLocaleString()} CLP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Configuración de Alertas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Alerta 80% de uso</label>
                  <p className="text-xs text-gray-500">Notificar cuando se alcance el 80% del presupuesto</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Límite por profesor</label>
                  <p className="text-xs text-gray-500">Máximo 200 créditos/mes por profesor</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Reporte semanal</label>
                  <p className="text-xs text-gray-500">Enviar resumen de uso cada lunes</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 