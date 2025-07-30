'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  BanknotesIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

export default function SostenedorOperationalCosts() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock operational costs data
  const totalCosts = {
    monthly: 125000000, // CLP
    budgetUtilization: 78.3
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
            <h1 className="text-2xl font-bold text-gray-900">Costos Operacionales 💰</h1>
            <p className="text-gray-600 mt-1">
              Gestión y control de gastos operacionales de la red educativa
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export costs report */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button
              onClick={() => {/* Generate budget analysis */}}
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Análisis Presupuestario
            </Button>
          </div>
        </div>

        {/* Cost Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BanknotesIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Costos Mensuales</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCosts.monthly)}</p>
                <p className="text-xs text-red-600">+5.2% vs mes anterior</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Utilización Presupuesto</p>
                <p className="text-2xl font-bold text-gray-900">{totalCosts.budgetUtilization}%</p>
                <p className="text-xs text-yellow-600">Dentro del rango objetivo</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Análisis de Costos Operacionales por Categoría
          </h2>
          
          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Personal</h3>
                <UsersIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(78500000)}</div>
              <div className="text-sm text-gray-600">62.8% del total</div>
              <div className="text-xs text-red-600 mt-1">+3.2% vs mes anterior</div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Infraestructura</h3>
                <BuildingOfficeIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(28300000)}</div>
              <div className="text-sm text-gray-600">22.6% del total</div>
              <div className="text-xs text-green-600 mt-1">-1.5% vs mes anterior</div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Tecnología</h3>
                <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(18200000)}</div>
              <div className="text-sm text-gray-600">14.6% del total</div>
              <div className="text-xs text-yellow-600 mt-1">+2.8% vs mes anterior</div>
            </div>
          </div>

          {/* Cost by School */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Colegio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo por Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eficiencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">Colegio San Patricio</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(45200000)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(532000)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Excelente
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">-2.1%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">Instituto Los Andes</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(38700000)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(595000)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Buena
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">+1.8%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
