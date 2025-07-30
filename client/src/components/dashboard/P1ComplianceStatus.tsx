'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserGroupIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline'

interface P1Priority {
  id: string
  title: string
  description: string
  status: 'completed' | 'in_progress' | 'pending'
  compliance_code: string
  implementation_details: string[]
  technical_notes: string
}

export default function P1ComplianceStatus() {
  const [priorities] = useState<P1Priority[]>([
    {
      id: 'daily-control',
      title: 'Control Diario de Clases - Frontend',
      description: 'Sistema digital de libro de clases con firma SHA-256 para compliance legal',
      status: 'completed',
      compliance_code: 'P2-A-03',
      implementation_details: [
        '✅ Interfaz completa para creación de controles diarios',
        '✅ Sistema de asistencia integrado',
        '✅ Firma digital automática SHA-256',
        '✅ Estados de workflow (borrador → completado → firmado)',
        '✅ Validación de compliance MINEDUC',
        '✅ Vista detallada con verificación de integridad'
      ],
      technical_notes: 'Implementado en /teacher/daily-control con backend API completo en server/routes/classBook.js'
    },
    {
      id: 'pai-signatures',
      title: 'PAI Digital Signatures',
      description: 'Firmas digitales para Planes de Apoyo Integral con límite de 5 minutos',
      status: 'completed',
      compliance_code: 'P1-C-02',
      implementation_details: [
        '✅ Wizard PAI con timer de 5 minutos',
        '✅ Generación automática de hash SHA-256',
        '✅ Validación P1-C-02 compliance en tiempo real',
        '✅ Firma digital con datos estructurados',
        '✅ Indicador visual de cumplimiento temporal',
        '✅ Persistencia de firmas en base de datos'
      ],
      technical_notes: 'Mejorado en PAIWizard.tsx con crypto.subtle API para firmas client-side'
    },
    {
      id: 'weekly-reports',
      title: 'Weekly OA/Bloom Report Generation',
      description: 'Reportes semanales de cobertura curricular con sugerencias remediales',
      status: 'completed',
      compliance_code: 'P1-ADMIN-ESC',
      implementation_details: [
        '✅ Generación de reportes semanales OA/Bloom',
        '✅ Análisis de cobertura curricular completo',
        '✅ Distribución por taxonomía de Bloom',
        '✅ Sugerencias remediales automatizadas',
        '✅ Exportación a CSV y PDF',
        '✅ Métricas de performance detalladas',
        '✅ Interfaz administrativa completa'
      ],
      technical_notes: 'Implementación completa en /admin/oa-reports con backend en server/routes/reports.js'
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'in_progress':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'pending':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const completedCount = priorities.filter(p => p.status === 'completed').length
  const completionPercentage = (completedCount / priorities.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-sm">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  P1 Compliance Status
                </h1>
                <p className="text-green-100 mt-1">
                  Critical Development Priorities - Phase 1 Completion
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {completionPercentage.toFixed(0)}%
              </div>
              <div className="text-green-100 text-sm">
                {completedCount}/{priorities.length} Complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-sm text-gray-600">{completedCount} of {priorities.length} priorities</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          🎯 Target: Complete all P1 critical priorities for legal compliance
        </div>
      </div>

      {/* Priority Cards */}
      <div className="space-y-4">
        {priorities.map((priority) => (
          <div key={priority.id} className={`rounded-lg border-2 ${getStatusColor(priority.status)} p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(priority.status)}
                <div>
                  <h3 className="text-lg font-semibold">
                    {priority.title}
                  </h3>
                  <p className="text-sm opacity-75 mt-1">
                    {priority.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                  {priority.compliance_code}
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {priority.status === 'completed' ? 'COMPLETED' : 
                   priority.status === 'in_progress' ? 'IN PROGRESS' : 'PENDING'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Implementation Details */}
              <div>
                <h4 className="text-sm font-medium mb-3">Implementation Details</h4>
                <ul className="space-y-1">
                  {priority.implementation_details.map((detail, index) => (
                    <li key={index} className="text-sm flex items-start space-x-2">
                      <span className="text-current opacity-60">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Notes */}
              <div>
                <h4 className="text-sm font-medium mb-3">Technical Implementation</h4>
                <p className="text-sm opacity-75">
                  {priority.technical_notes}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <CalendarDaysIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              🚀 Phase 1 Critical Priorities - COMPLETED
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                ✅ <strong>All critical P1 priorities have been successfully implemented:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                <li>• Daily Class Control frontend with SHA-256 digital signatures</li>
                <li>• PAI digital signatures with P1-C-02 compliance (≤5 minutes)</li>
                <li>• Weekly OA/Bloom report generation with remedial suggestions</li>
              </ul>
              <p className="mt-3 font-medium">
                🎯 <strong>Ready for Phase 2:</strong> Advanced features, performance optimization, and additional game formats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Compliance Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <DocumentTextIcon className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Legal Compliance Status
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>P2-A-03: Digital class book with SHA-256 signatures</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>P1-C-02: PAI creation under 5 minutes with digital signatures</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>P1-ADMIN-ESC: Weekly OA/Bloom reports with CSV/PDF export</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span>MINEDUC compliance ready for audit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 