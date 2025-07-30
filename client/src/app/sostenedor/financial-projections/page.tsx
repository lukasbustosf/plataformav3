'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  ChartBarIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function SostenedorFinancialProjections() {
  const { user } = useAuth()

  // Mock financial projection data
  const overallProjections = {
    currentRevenue: 1800000000,
    projectedRevenue: 2267481600,
    growth: 25.9,
    timeframe: '3 años'
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
            <h1 className="text-2xl font-bold text-gray-900">Proyecciones Financieras 📊</h1>
            <p className="text-gray-600 mt-1">
              Análisis predictivo y planificación financiera estratégica
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export projections */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar Proyecciones
            </Button>
            <Button
              onClick={() => {/* Create custom scenario */}}
            >
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Crear Escenario
            </Button>
          </div>
        </div>

        {/* Projections Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ingresos Actuales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(overallProjections.currentRevenue)}</p>
                <p className="text-xs text-blue-600">Base 2024</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Proyección {overallProjections.timeframe}</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(overallProjections.projectedRevenue)}</p>
                <p className="text-xs text-green-600">Escenario base</p>
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
                <p className="text-sm font-medium text-gray-500">Crecimiento Esperado</p>
                <p className="text-2xl font-bold text-purple-600">{overallProjections.growth}%</p>
                <p className="text-xs text-purple-600">Total acumulado</p>
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
                <p className="text-sm font-medium text-gray-500">Horizonte</p>
                <p className="text-2xl font-bold text-yellow-600">{overallProjections.timeframe}</p>
                <p className="text-xs text-yellow-600">Planificación</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Análisis de Escenarios Financieros
          </h2>
          
          {/* Scenario Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Optimistic Scenario */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-green-900">Escenario Optimista</h3>
                <span className="text-sm text-green-600">+35% crecimiento</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Ingresos 2027</span>
                  <span className="font-bold text-green-900">{formatCurrency(2430000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Margen</span>
                  <span className="font-medium text-green-900">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">ROI</span>
                  <span className="font-medium text-green-900">65%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-green-600">
                Supuestos: Expansión agresiva, alta adopción IA
              </div>
            </div>

            {/* Base Scenario */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-blue-900">Escenario Base</h3>
                <span className="text-sm text-blue-600">+26% crecimiento</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Ingresos 2027</span>
                  <span className="font-bold text-blue-900">{formatCurrency(overallProjections.projectedRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Margen</span>
                  <span className="font-medium text-blue-900">24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">ROI</span>
                  <span className="font-medium text-blue-900">51%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                Supuestos: Crecimiento moderado, adopción gradual
              </div>
            </div>

            {/* Conservative Scenario */}
            <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-yellow-900">Escenario Conservador</h3>
                <span className="text-sm text-yellow-600">+18% crecimiento</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-700">Ingresos 2027</span>
                  <span className="font-bold text-yellow-900">{formatCurrency(2124000000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-700">Margen</span>
                  <span className="font-medium text-yellow-900">21%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-yellow-700">ROI</span>
                  <span className="font-medium text-yellow-900">38%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-yellow-600">
                Supuestos: Crecimiento lento, resistencia al cambio
              </div>
            </div>
          </div>

          {/* Revenue Projections by Year */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Proyección de Ingresos por Año</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Año
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conservador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Optimista
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variación Base
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1800000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1800000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1800000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Base</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2025</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1890000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1980000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2070000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+10%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2026</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1985000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2138000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2295000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2027</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2124000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2267000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2430000000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Assumptions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Supuestos Clave</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Factores de Crecimiento</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Expansión a 3 nuevos colegios por año</li>
                  <li>• Adopción IA: 15% anual incremento</li>
                  <li>• Retención estudiantes: 95%+</li>
                  <li>• Incremento mensualidades: 4% anual</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Riesgos Considerados</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Competencia mercado educativo</li>
                  <li>• Cambios regulatorios MINEDUC</li>
                  <li>• Fluctuaciones económicas</li>
                  <li>• Costos tecnología emergente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
