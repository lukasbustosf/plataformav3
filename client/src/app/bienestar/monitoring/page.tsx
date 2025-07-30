'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  EyeIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function BienestarMonitoringPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('current-week')
  const [selectedFilter, setSelectedFilter] = useState('ALL')

  const monitoringStats = {
    totalCases: 28,
    activeCases: 15,
    criticalCases: 3,
    overdueReviews: 5,
    completedThisWeek: 2,
    newAlertsToday: 7
  }

  const handleViewDetails = (type: string) => {
    toast.success(`Abriendo detalles de ${type}...`)
  }

  const handleGenerateReport = () => {
    toast.success('Generando reporte de seguimiento...')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seguimiento y Monitoreo</h1>
            <p className="text-gray-600">Control y supervisión continua de casos de bienestar estudiantil</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Generar Reporte
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="current-week">Esta Semana</option>
                <option value="current-month">Este Mes</option>
                <option value="last-30-days">Últimos 30 Días</option>
                <option value="current-semester">Semestre Actual</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-md p-2"
              >
                <option value="ALL">Todos los Casos</option>
                <option value="CRITICAL">Casos Críticos</option>
                <option value="OVERDUE">Revisiones Vencidas</option>
                <option value="NEW_ALERTS">Nuevas Alertas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <EyeIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Casos</p>
                <p className="text-2xl font-bold text-blue-600">{monitoringStats.totalCases}</p>
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
                <p className="text-sm font-medium text-gray-500">Casos Activos</p>
                <p className="text-2xl font-bold text-green-600">{monitoringStats.activeCases}</p>
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
                <p className="text-2xl font-bold text-red-600">{monitoringStats.criticalCases}</p>
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
                <p className="text-sm font-medium text-gray-500">Revisiones Vencidas</p>
                <p className="text-2xl font-bold text-yellow-600">{monitoringStats.overdueReviews}</p>
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
                <p className="text-sm font-medium text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-purple-600">{monitoringStats.completedThisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Alertas Hoy</p>
                <p className="text-2xl font-bold text-orange-600">{monitoringStats.newAlertsToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Panel */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Panel de Alertas y Notificaciones</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-red-400 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <strong>Caso Crítico:</strong> María González (7°A) - Requiere atención inmediata
                    </p>
                    <p className="text-xs text-red-600 mt-1">Hace 2 horas</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Revisión Vencida:</strong> Caso PAI-003 - Vencido hace 3 días
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Hace 3 días</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Nueva Derivación:</strong> Carlos Mendoza derivado a psicología externa
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Hace 1 día</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Seguimiento de Progreso</h3>
            <p className="text-gray-600 mb-4">Sistema de monitoreo continuo implementado exitosamente</p>
            <div className="space-y-4">
              <Button
                onClick={() => handleViewDetails('progress')}
                variant="outline"
                className="w-full justify-start"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Ver Detalles de Progreso
              </Button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Indicadores de Riesgo</h3>
            <p className="text-gray-600 mb-4">Monitoreo automático de factores de riesgo estudiantil</p>
            <div className="space-y-4">
              <Button
                onClick={() => handleViewDetails('risk-indicators')}
                variant="outline"
                className="w-full justify-start"
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                Ver Indicadores
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 