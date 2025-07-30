'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  ChartBarIcon,
  ArrowDownTrayIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function SostenedorROIAnalysis() {
  const { user } = useAuth()

  // Mock ROI data
  const overallROI = {
    totalInvestment: 450000000, // CLP
    totalReturn: 680000000,
    netROI: 51.1,
    paybackPeriod: 2.3 // years
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análisis ROI 📈</h1>
            <p className="text-gray-600 mt-1">
              Retorno de inversión de iniciativas educativas y tecnológicas
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export ROI report */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar Análisis
            </Button>
            <Button
              onClick={() => {/* Generate ROI projection */}}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Proyección ROI
            </Button>
          </div>
        </div>

        {/* ROI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrophyIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">ROI General</p>
                <p className="text-2xl font-bold text-green-600">{overallROI.netROI}%</p>
                <p className="text-xs text-green-600">Objetivo: 40%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inversión Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(overallROI.totalInvestment)}</p>
                <p className="text-xs text-blue-600">Últimos 12 meses</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Retorno Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(overallROI.totalReturn)}</p>
                <p className="text-xs text-purple-600">Valor generado</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Payback Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{overallROI.paybackPeriod}</p>
                <p className="text-xs text-yellow-600">años</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Análisis ROI por Iniciativa
          </h2>
          
          {/* ROI by Initiative */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Implementación IA Educativa</h3>
                  <p className="text-sm text-gray-600">Generación automática de contenido y evaluaciones</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ROI: 127%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Inversión</div>
                  <div className="font-bold text-red-600">{formatCurrency(85000000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Retorno</div>
                  <div className="font-bold text-green-600">{formatCurrency(192950000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Payback</div>
                  <div className="font-medium text-gray-900">1.8 años</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Ahorro en tiempo docente: 45%, Mejora en resultados: 23%
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Plataforma Digital Integrada</h3>
                  <p className="text-sm text-gray-600">Sistema unificado de gestión educativa</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ROI: 89%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Inversión</div>
                  <div className="font-bold text-red-600">{formatCurrency(145000000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Retorno</div>
                  <div className="font-bold text-green-600">{formatCurrency(274050000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Payback</div>
                  <div className="font-medium text-gray-900">2.1 años</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Reducción costos administrativos: 35%, Mejora eficiencia: 28%
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Capacitación Docente Digital</h3>
                  <p className="text-sm text-gray-600">Programa de formación en tecnologías educativas</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ROI: 45%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Inversión</div>
                  <div className="font-bold text-red-600">{formatCurrency(28000000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Retorno</div>
                  <div className="font-bold text-green-600">{formatCurrency(40600000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Payback</div>
                  <div className="font-medium text-gray-900">3.2 años</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Mejora satisfacción docente: 31%, Reducción rotación: 18%
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">Infraestructura Tecnológica</h3>
                  <p className="text-sm text-gray-600">Modernización de equipos y conectividad</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ROI: 34%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Inversión</div>
                  <div className="font-bold text-red-600">{formatCurrency(192000000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Retorno</div>
                  <div className="font-bold text-green-600">{formatCurrency(257280000)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Payback</div>
                  <div className="font-medium text-gray-900">4.5 años</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Reducción costos mantenimiento: 22%, Mejora productividad: 15%
              </div>
            </div>
          </div>

          {/* ROI Projections */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Proyecciones a 5 Años</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-gray-600">ROI Proyectado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(1250000000)}</div>
                  <div className="text-sm text-gray-600">Valor Acumulado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.8</div>
                  <div className="text-sm text-gray-600">Payback Promedio (años)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
