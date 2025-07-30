'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CloudArrowDownIcon,
  AcademicCapIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function SostenedorBulkExports() {
  const { user } = useAuth()

  // Mock export data
  const exportStats = {
    totalExports: 24,
    activeExports: 3,
    completedToday: 8,
    totalSize: '12.5 GB'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exportaciones Masivas 📦</h1>
            <p className="text-gray-600 mt-1">
              Gestión de exportaciones de datos a gran escala de toda la red educativa
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Open export scheduler */}}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Programar Exportación
            </Button>
            <Button
              onClick={() => {/* Create new export */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Nueva Exportación
            </Button>
          </div>
        </div>

        {/* Export Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Exportaciones</p>
                <p className="text-2xl font-bold text-gray-900">{exportStats.totalExports}</p>
                <p className="text-xs text-blue-600">Este mes</p>
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
                <p className="text-sm font-medium text-gray-500">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-600">{exportStats.activeExports}</p>
                <p className="text-xs text-yellow-600">Activas ahora</p>
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
                <p className="text-sm font-medium text-gray-500">Completadas Hoy</p>
                <p className="text-2xl font-bold text-green-600">{exportStats.completedToday}</p>
                <p className="text-xs text-green-600">Disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CloudArrowDownIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tamaño Total</p>
                <p className="text-2xl font-bold text-purple-600">{exportStats.totalSize}</p>
                <p className="text-xs text-purple-600">Datos generados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Export Templates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Plantillas de Exportación Disponibles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Reporte Académico Completo</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Notas, asistencia y evaluaciones de todos los estudiantes</p>
              <div className="text-xs text-gray-500 mb-3">
                <div>Tamaño estimado: 2.5 GB</div>
                <div>Tiempo estimado: 15-20 min</div>
              </div>
              <Button size="sm" className="w-full">Ejecutar</Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <UsersIcon className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Base de Datos de Usuarios</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Información completa de estudiantes, profesores y apoderados</p>
              <div className="text-xs text-gray-500 mb-3">
                <div>Tamaño estimado: 450 MB</div>
                <div>Tiempo estimado: 5-8 min</div>
              </div>
              <Button size="sm" className="w-full">Ejecutar</Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <CurrencyDollarIcon className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Análisis Financiero</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Estados financieros, presupuestos y proyecciones</p>
              <div className="text-xs text-gray-500 mb-3">
                <div>Tamaño estimado: 180 MB</div>
                <div>Tiempo estimado: 3-5 min</div>
              </div>
              <Button size="sm" className="w-full">Ejecutar</Button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Exportaciones Activas y Historial
          </h2>
          
          {/* Active Exports */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Exportaciones en Curso</h3>
            <div className="space-y-3">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium text-blue-900">Reporte Académico Q4 2024</span>
                  </div>
                  <span className="text-sm text-blue-600">En proceso</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-blue-700">
                  <span>65% completado</span>
                  <span>Tiempo estimado: 8 min restantes</span>
                </div>
              </div>

              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-yellow-900">Base de Datos Usuarios - Diciembre</span>
                  </div>
                  <span className="text-sm text-yellow-600">Preparando</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2 mb-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <div className="flex justify-between text-sm text-yellow-700">
                  <span>15% completado</span>
                  <span>Iniciado hace 2 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export History */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Historial de Exportaciones</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exportación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamaño
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">Análisis Financiero Noviembre</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      19 Dic 2024, 14:30
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      245 MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Completado
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">Reporte Académico Q3 2024</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      18 Dic 2024, 09:15
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      1.8 GB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Completado
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UsersIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">Base de Datos Usuarios - Noviembre</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      17 Dic 2024, 16:45
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      892 MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Completado
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline">
                        <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">Análisis de Rendimiento Octubre</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      15 Dic 2024, 11:20
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      156 MB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Error
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" variant="outline">
                        Reintentar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Schedule */}
          <div className="mt-8">
            <h3 className="text-md font-medium text-gray-900 mb-3">Exportaciones Programadas</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Reporte Mensual Automático</div>
                      <div className="text-sm text-gray-600">Cada 1° de mes a las 06:00</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">Activo</span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Backup Semanal Base de Datos</div>
                      <div className="text-sm text-gray-600">Cada domingo a las 02:00</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600">Activo</span>
                    <Button size="sm" variant="outline">Editar</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
