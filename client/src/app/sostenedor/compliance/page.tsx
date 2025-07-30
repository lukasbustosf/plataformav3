'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ScaleIcon
} from '@heroicons/react/24/outline'

export default function SostenedorCompliance() {
  const { user } = useAuth()

  // Mock compliance data
  const complianceOverview = {
    totalRequirements: 156,
    compliant: 142,
    pending: 8,
    nonCompliant: 6,
    complianceRate: 91.0
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cumplimiento Normativo 🛡️</h1>
            <p className="text-gray-600 mt-1">
              Monitoreo del cumplimiento regulatorio y normativo de la red educativa
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export compliance report */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Reporte de Cumplimiento
            </Button>
            <Button
              onClick={() => {/* Schedule audit */}}
            >
              <DocumentCheckIcon className="h-4 w-4 mr-2" />
              Programar Auditoría
            </Button>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ScaleIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Requisitos</p>
                <p className="text-2xl font-bold text-gray-900">{complianceOverview.totalRequirements}</p>
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
                <p className="text-sm font-medium text-gray-500">Cumpliendo</p>
                <p className="text-2xl font-bold text-green-600">{complianceOverview.compliant}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{complianceOverview.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">No Cumple</p>
                <p className="text-2xl font-bold text-red-600">{complianceOverview.nonCompliant}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Tasa Cumplimiento</p>
                <p className="text-2xl font-bold text-purple-600">{complianceOverview.complianceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Cumplimiento por Categoría Normativa
          </h2>
          
          {/* Compliance Categories */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium text-gray-900">MINEDUC - Normativas Educacionales</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  95% Cumplimiento
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Cumpliendo</div>
                  <div className="font-bold text-green-600">38/40</div>
                </div>
                <div>
                  <div className="text-gray-500">Pendientes</div>
                  <div className="font-medium text-yellow-600">2</div>
                </div>
                <div>
                  <div className="text-gray-500">Críticos</div>
                  <div className="font-medium text-red-600">0</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Últimas actualizaciones: Plan de Estudios 2024, Evaluación Docente
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-purple-500 mr-2" />
                  <h3 className="font-medium text-gray-900">RGPD - Protección de Datos</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  88% Cumplimiento
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Cumpliendo</div>
                  <div className="font-bold text-green-600">22/25</div>
                </div>
                <div>
                  <div className="text-gray-500">Pendientes</div>
                  <div className="font-medium text-yellow-600">2</div>
                </div>
                <div>
                  <div className="text-gray-500">Críticos</div>
                  <div className="font-medium text-red-600">1</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Pendiente: Auditoría de retención de datos, Consentimiento parental
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 mr-2" />
                  <h3 className="font-medium text-gray-900">Seguridad Laboral</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  92% Cumplimiento
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Cumpliendo</div>
                  <div className="font-bold text-green-600">35/38</div>
                </div>
                <div>
                  <div className="text-gray-500">Pendientes</div>
                  <div className="font-medium text-yellow-600">3</div>
                </div>
                <div>
                  <div className="text-gray-500">Críticos</div>
                  <div className="font-medium text-red-600">0</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Próxima inspección: Marzo 2025, Capacitación primeros auxilios
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <DocumentCheckIcon className="h-5 w-5 text-indigo-500 mr-2" />
                  <h3 className="font-medium text-gray-900">Normativas Financieras</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  85% Cumplimiento
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Cumpliendo</div>
                  <div className="font-bold text-green-600">47/55</div>
                </div>
                <div>
                  <div className="text-gray-500">Pendientes</div>
                  <div className="font-medium text-yellow-600">3</div>
                </div>
                <div>
                  <div className="text-gray-500">Críticos</div>
                  <div className="font-medium text-red-600">5</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Crítico: Auditoría contable pendiente, Declaraciones tributarias
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Requeridas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <div className="font-medium text-red-900">Auditoría Contable Anual</div>
                    <div className="text-sm text-red-700">Vence: 31 de Enero 2025</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Programar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <div className="font-medium text-yellow-900">Renovación Licencia Funcionamiento</div>
                    <div className="text-sm text-yellow-700">Vence: 15 de Febrero 2025</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Iniciar Trámite
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <div className="font-medium text-blue-900">Actualización Políticas RGPD</div>
                    <div className="text-sm text-blue-700">Recomendado: Enero 2025</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Revisar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
