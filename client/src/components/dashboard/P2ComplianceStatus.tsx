'use client'

import React from 'react'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CogIcon,
  ShieldCheckIcon,
  HeartIcon,
  BellIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface P2ComplianceStatusProps {
  className?: string
}

interface P2Item {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  priority: 'high' | 'medium' | 'low'
  compliance_code: string
  implementation_notes: string
  technical_details: string
  last_updated: string
  icon: React.ReactNode
}

export function P2ComplianceStatus({ className = '' }: P2ComplianceStatusProps) {
  
  // Phase 2 Implementation Status - All P2 Priority Items
  const p2Items: P2Item[] = [
    {
      id: 'P2-T-03',
      title: 'Funcionalidad de Clonación de Juegos',
      description: 'Clonación rápida de juegos existentes con capacidad de edición inmediata',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-T-03',
      implementation_notes: 'Implementado en /teacher/quiz/page.tsx con botón de clonación y navegación automática a edición',
      technical_details: 'Endpoint /api/quiz/{id}/clone, clonación completa < 5 minutos',
      last_updated: '2024-01-22T10:30:00Z',
      icon: <DocumentDuplicateIcon className="h-5 w-5" />
    },
    {
      id: 'P2-T-08',
      title: 'Autocompletado IA para Planificaciones',
      description: 'Generación automática de esquemas de planificación usando IA',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-T-08',
      implementation_notes: 'Implementado en LessonPlanWizard.tsx con endpoint /ai/lesson-outline',
      technical_details: 'Generación progresiva de contenido con retroalimentación en tiempo real',
      last_updated: '2024-01-22T10:45:00Z',
      icon: <SparklesIcon className="h-5 w-5" />
    },
    {
      id: 'P2-T-09',
      title: 'Importación de Planificaciones Año Anterior',
      description: 'Importar y adaptar planificaciones del año escolar anterior',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-T-09',
      implementation_notes: 'Implementado en /teacher/lesson/page.tsx con modal de importación y filtros',
      technical_details: 'Filtrado por año, materia, grado y autor con selección múltiple',
      last_updated: '2024-01-22T11:00:00Z',
      icon: <ArrowDownTrayIcon className="h-5 w-5" />
    },
    {
      id: 'P2-T-04',
      title: 'Seguimiento de Respuestas en Vivo',
      description: 'Panel de seguimiento en tiempo real con avatares de participantes',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-T-04',
      implementation_notes: 'Implementado LiveParticipantPanel en /components/game/index.tsx',
      technical_details: 'WebSocket conexión para actualizaciones en tiempo real, avatares dinámicos',
      last_updated: '2024-01-22T11:15:00Z',
      icon: <EyeIcon className="h-5 w-5" />
    },
    {
      id: 'P2-A-03',
      title: 'Exportación Mejorada de Asistencia',
      description: 'Funcionalidades de exportación avanzadas para control de asistencia',
      status: 'completed',
      priority: 'medium',
      compliance_code: 'P2-A-03',
      implementation_notes: 'Implementado en /teacher/daily-control/page.tsx',
      technical_details: 'Exportación CSV, PDF y Excel con firmas digitales',
      last_updated: '2024-01-22T11:30:00Z',
      icon: <DocumentDuplicateIcon className="h-5 w-5" />
    },
    {
      id: 'P2-SA-01',
      title: 'Límites de Tokens IA por Escuela',
      description: 'Gestión de presupuestos y límites de uso de IA por institución',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-SA-01',
      implementation_notes: 'Implementado en /admin/ai-monitoring/page.tsx con sistema de alertas',
      technical_details: 'Alertas al 90%, deshabilitación automática, gestión masiva de presupuestos',
      last_updated: '2024-01-22T11:45:00Z',
      icon: <CogIcon className="h-5 w-5" />
    },
    {
      id: 'P2-SEC-01',
      title: 'Modo de Bloqueo Global',
      description: 'Sistema de bloqueo de seguridad para evaluaciones críticas',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-SEC-01',
      implementation_notes: 'Implementado en /admin/ai-monitoring/page.tsx con controles avanzados',
      technical_details: 'Mezcla de preguntas/opciones, deshabilitación IA, modo emergencia',
      last_updated: '2024-01-22T12:00:00Z',
      icon: <ShieldCheckIcon className="h-5 w-5" />
    },
    {
      id: 'P2-C-03',
      title: 'Registro de Sesiones de Apoyo',
      description: 'Gestión confidencial de sesiones de apoyo estudiantil',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-C-03',
      implementation_notes: 'Implementado en /teacher/support/page.tsx con notas privadas',
      technical_details: 'Notas confidenciales, evaluación de riesgo, seguimiento personalizado',
      last_updated: '2024-01-22T12:15:00Z',
      icon: <HeartIcon className="h-5 w-5" />
    },
    {
      id: 'P2-G-01',
      title: 'Notificaciones Push a Apoderados',
      description: 'Sistema de notificaciones automáticas para padres y apoderados',
      status: 'completed',
      priority: 'high',
      compliance_code: 'P2-G-01',
      implementation_notes: 'Implementado en /teacher/support/page.tsx con múltiples canales',
      technical_details: 'Email, SMS, push notifications con plantillas personalizables',
      last_updated: '2024-01-22T12:30:00Z',
      icon: <BellIcon className="h-5 w-5" />
    },
    {
      id: 'P2-O-04',
      title: 'Resumen Financiero Mensual',
      description: 'Análisis financiero detallado con métricas de rendimiento',
      status: 'completed',
      priority: 'medium',
      compliance_code: 'P2-O-04',
      implementation_notes: 'Implementado en /admin/financial/page.tsx con reportes automáticos',
      technical_details: 'Análisis de ingresos/gastos, métricas de crecimiento, alertas financieras',
      last_updated: '2024-01-22T12:45:00Z',
      icon: <CurrencyDollarIcon className="h-5 w-5" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case 'in_progress': return <ClockIcon className="h-4 w-4 text-yellow-600" />
      case 'pending': return <ExclamationTriangleIcon className="h-4 w-4 text-gray-600" />
      default: return <ExclamationTriangleIcon className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const completedItems = p2Items.filter(item => item.status === 'completed').length
  const totalItems = p2Items.length
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Estado de Implementación Fase 2 - P2 Priority Items
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Seguimiento completo de todas las funcionalidades P2 implementadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">{completedItems}/{totalItems} completados</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso Fase 2</span>
            <span>{completedItems} de {totalItems} items</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Completados</p>
                <p className="text-2xl font-bold text-green-900">
                  {p2Items.filter(item => item.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">En Progreso</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {p2Items.filter(item => item.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Alta Prioridad</p>
                <p className="text-2xl font-bold text-red-900">
                  {p2Items.filter(item => item.priority === 'high').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* P2 Items List */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Detalle de Implementación P2 Priority Items
          </h4>
          
          {p2Items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h5 className="text-sm font-medium text-gray-900">{item.title}</h5>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                        {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="text-xs text-gray-500 mb-2">
                      <strong>Implementación:</strong> {item.implementation_notes}
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Detalles técnicos:</strong> {item.technical_details}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">
                      {item.status === 'completed' ? 'Completado' : 
                       item.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                    </span>
                  </span>
                  <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {item.compliance_code}
                  </span>
                  <div className="text-xs text-gray-400">
                    {new Date(item.last_updated).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase 2 Summary */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-800">
                ✅ Fase 2 Completada al 100%
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Todas las funcionalidades P2 priority han sido implementadas exitosamente. 
                La plataforma EDU21 está lista para Phase 3 implementation.
              </p>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-green-600">
            <strong>Próximos pasos:</strong> Validación QA, testing de integración, 
            y preparación para Phase 3 (P3-priority items)
          </div>
        </div>
      </div>
    </div>
  )
} 