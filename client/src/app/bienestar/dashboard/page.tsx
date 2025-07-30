'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  HeartIcon, 
  ShieldExclamationIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UsersIcon,
  ChartBarIcon,
  BellIcon,
  EyeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function BienestarDashboard() {
  const { user, fullName } = useAuth()

  const wellnessStats = {
    totalStudents: 680,
    studentsAtRisk: 23,
    attendanceAlerts: 12,
    behaviorIncidents: 8,
    wellnessScore: 82.5,
    interventionsActive: 15
  }

  const alerts = [
    {
      id: 1,
      student: 'María García - 7° A',
      type: 'Asistencia',
      severity: 'high',
      description: 'Ausente 5 días consecutivos sin justificación',
      timestamp: '2 horas'
    },
    {
      id: 2,
      student: 'Carlos Mendoza - 2° Medio',
      type: 'Comportamiento',
      severity: 'medium',
      description: 'Múltiples reportes de agresividad en recreos',
      timestamp: '1 día'
    },
    {
      id: 3,
      student: 'Ana Rodríguez - 5° Básico',
      type: 'Académico',
      severity: 'medium',
      description: 'Rendimiento bajó significativamente en últimas semanas',
      timestamp: '3 días'
    }
  ]

  const interventions = [
    {
      id: 1,
      student: 'Pedro López',
      type: 'Psicológica',
      progress: 75,
      nextSession: '2024-12-21',
      professional: 'Psic. Laura Martínez'
    },
    {
      id: 2,
      student: 'Sofía Herrera',
      type: 'Académica',
      progress: 60,
      nextSession: '2024-12-20',
      professional: 'Prof. Juan Torres'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold">Bienestar Escolar 💚</h1>
          <p className="mt-2 opacity-90">
            {fullName}, monitorea el bienestar integral de nuestros estudiantes.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Índice Bienestar</p>
                <p className="text-2xl font-bold text-gray-900">{wellnessStats.wellnessScore}%</p>
                <p className="text-xs text-green-600">+2.3% este mes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ShieldExclamationIcon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Estudiantes en Riesgo</p>
                <p className="text-2xl font-bold text-gray-900">{wellnessStats.studentsAtRisk}</p>
                <p className="text-xs text-red-600">Requiere atención</p>
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
                <p className="text-sm font-medium text-gray-500">Alertas Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">{wellnessStats.attendanceAlerts}</p>
                <p className="text-xs text-yellow-600">Seguimiento activo</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Intervenciones Activas</p>
                <p className="text-2xl font-bold text-gray-900">{wellnessStats.interventionsActive}</p>
                <p className="text-xs text-blue-600">En progreso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Alertas Prioritarias</h2>
            <BellIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{alert.student}</span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          alert.type === 'Asistencia' ? 'bg-red-100 text-red-800' :
                          alert.type === 'Comportamiento' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Hace {alert.timestamp}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Interventions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Intervenciones en Curso</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {interventions.map((intervention) => (
                <div key={intervention.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{intervention.student}</h3>
                      <p className="text-sm text-gray-600">Intervención {intervention.type}</p>
                    </div>
                    <span className="text-sm text-gray-900">{intervention.progress}% completado</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${intervention.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Profesional: {intervention.professional}</span>
                    <span>Próxima sesión: {intervention.nextSession}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <BellIcon className="h-6 w-6" />
            <span>Nueva Alerta</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <PhoneIcon className="h-6 w-6" />
            <span>Contactar Familia</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <ChartBarIcon className="h-6 w-6" />
            <span>Reportes</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center space-y-2"
          >
            <HeartIcon className="h-6 w-6" />
            <span>Evaluación Bienestar</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
} 