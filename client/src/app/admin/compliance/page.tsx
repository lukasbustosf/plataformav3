'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  CogIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  BuildingOfficeIcon,
  KeyIcon,
  EyeIcon,
  LockClosedIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  BellIcon,
  ScaleIcon,
  DocumentCheckIcon,
  ArchiveBoxIcon,
  FlagIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface ComplianceRule {
  rule_id: string
  name: string
  description: string
  category: 'privacy' | 'security' | 'accessibility' | 'data_retention' | 'audit'
  regulation: string
  status: 'compliant' | 'warning' | 'violation' | 'pending'
  last_check: string
  next_check: string
  evidence_count: number
  responsible_role: string
  automated: boolean
}

interface ComplianceViolation {
  violation_id: string
  rule_id: string
  rule_name: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detected_at: string
  affected_schools: string[]
  status: 'open' | 'investigating' | 'resolved' | 'acknowledged'
  assigned_to: string
  due_date: string
  remediation_steps: string[]
}

interface ComplianceAudit {
  audit_id: string
  audit_type: 'periodic' | 'incident' | 'regulatory' | 'internal'
  title: string
  description: string
  start_date: string
  end_date: string
  status: 'planning' | 'active' | 'review' | 'completed'
  auditor: string
  scope: string[]
  findings_count: number
  compliance_score: number
  report_url?: string
}

interface DataRetentionPolicy {
  policy_id: string
  data_type: string
  retention_period_days: number
  archival_required: boolean
  deletion_method: string
  legal_basis: string
  last_reviewed: string
  next_review: string
  records_count: number
  upcoming_deletions: number
}

export default function AdminCompliancePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'rules' | 'violations' | 'audits' | 'retention'>('overview')
  const [selectedViolation, setSelectedViolation] = useState<ComplianceViolation | null>(null)
  const [timeRange, setTimeRange] = useState('30d')

  // Mock compliance rules data
  const complianceRules: ComplianceRule[] = [
    {
      rule_id: 'rule-001',
      name: 'Cifrado de Datos en Tránsito',
      description: 'Todos los datos deben ser transmitidos usando HTTPS/TLS 1.2+',
      category: 'security',
      regulation: 'Ley 19.628 Protección Datos Personales',
      status: 'compliant',
      last_check: '2025-06-23T14:00:00Z',
      next_check: '2025-06-24T14:00:00Z',
      evidence_count: 15,
      responsible_role: 'DevOps',
      automated: true
    },
    {
      rule_id: 'rule-002',
      name: 'Retención de Logs de Acceso',
      description: 'Logs de acceso deben conservarse por mínimo 1 año',
      category: 'audit',
      regulation: 'Superintendencia de Educación',
      status: 'compliant',
      last_check: '2025-06-23T10:30:00Z',
      next_check: '2025-06-30T10:30:00Z',
      evidence_count: 8,
      responsible_role: 'Administrador Sistema',
      automated: true
    },
    {
      rule_id: 'rule-003',
      name: 'Accesibilidad WCAG 2.2 AA',
      description: 'Interfaz debe cumplir estándares WCAG 2.2 nivel AA',
      category: 'accessibility',
      regulation: 'Ley 20.422 Inclusión Social',
      status: 'warning',
      last_check: '2025-06-20T16:00:00Z',
      next_check: '2025-06-27T16:00:00Z',
      evidence_count: 23,
      responsible_role: 'Frontend Team',
      automated: false
    },
    {
      rule_id: 'rule-004',
      name: 'Consentimiento Datos Menores',
      description: 'Consentimiento parental requerido para datos de menores de 14 años',
      category: 'privacy',
      regulation: 'Ley 19.628 y Código Civil',
      status: 'violation',
      last_check: '2025-06-22T09:15:00Z',
      next_check: '2025-06-29T09:15:00Z',
      evidence_count: 3,
      responsible_role: 'Legal',
      automated: false
    },
    {
      rule_id: 'rule-005',
      name: 'Backup y Recuperación',
      description: 'Respaldos diarios con pruebas de recuperación mensuales',
      category: 'data_retention',
      regulation: 'Política Interna ISO 27001',
      status: 'compliant',
      last_check: '2025-06-23T02:00:00Z',
      next_check: '2025-06-24T02:00:00Z',
      evidence_count: 30,
      responsible_role: 'DevOps',
      automated: true
    }
  ]

  // Mock violations data
  const complianceViolations: ComplianceViolation[] = [
    {
      violation_id: 'viol-001',
      rule_id: 'rule-004',
      rule_name: 'Consentimiento Datos Menores',
      severity: 'critical',
      description: 'Se detectaron 127 registros de estudiantes menores de 14 años sin consentimiento parental documentado',
      detected_at: '2025-06-22T09:15:00Z',
      affected_schools: ['Colegio San Francisco', 'Escuela Rural Valle Verde'],
      status: 'investigating',
      assigned_to: 'María José Delgado - Legal',
      due_date: '2025-06-29T23:59:59Z',
      remediation_steps: [
        'Identificar todos los registros afectados',
        'Contactar apoderados para obtener consentimiento',
        'Documentar proceso de consentimiento',
        'Implementar validación automática en registro'
      ]
    },
    {
      violation_id: 'viol-002',
      rule_id: 'rule-003',
      rule_name: 'Accesibilidad WCAG 2.2 AA',
      severity: 'medium',
      description: 'Contraste insuficiente detectado en 8 componentes de la interfaz de juegos',
      detected_at: '2025-06-20T16:00:00Z',
      affected_schools: ['Todas las escuelas'],
      status: 'open',
      assigned_to: 'Carlos Rivera - Frontend',
      due_date: '2025-07-05T23:59:59Z',
      remediation_steps: [
        'Auditar paleta de colores actual',
        'Ajustar colores para cumplir ratio 4.5:1',
        'Actualizar componentes afectados',
        'Realizar testing de accesibilidad'
      ]
    },
    {
      violation_id: 'viol-003',
      rule_id: 'rule-002',
      rule_name: 'Retención de Logs de Acceso',
      severity: 'low',
      description: 'Logs de acceso de Enero 2024 programados para eliminación automática en 30 días',
      detected_at: '2025-06-21T08:00:00Z',
      affected_schools: ['Todas las escuelas'],
      status: 'acknowledged',
      assigned_to: 'Pedro Morales - DevOps',
      due_date: '2025-07-21T23:59:59Z',
      remediation_steps: [
        'Verificar política de retención vigente',
        'Mover logs a archivo de largo plazo',
        'Actualizar configuración de retención'
      ]
    }
  ]

  // Mock audit data
  const complianceAudits: ComplianceAudit[] = [
    {
      audit_id: 'audit-001',
      audit_type: 'regulatory',
      title: 'Auditoría Superintendencia de Educación 2025',
      description: 'Revisión anual de cumplimiento de normativas educacionales y protección de datos',
      start_date: '2025-07-01T00:00:00Z',
      end_date: '2025-07-15T23:59:59Z',
      status: 'planning',
      auditor: 'Superintendencia de Educación',
      scope: ['Protección datos estudiantes', 'Seguridad sistemas', 'Accesibilidad'],
      findings_count: 0,
      compliance_score: 0,
      report_url: undefined
    },
    {
      audit_id: 'audit-002',
      audit_type: 'internal',
      title: 'Auditoría Interna Q2 2025',
      description: 'Revisión trimestral de políticas internas y procedimientos',
      start_date: '2025-06-01T00:00:00Z',
      end_date: '2025-06-15T23:59:59Z',
      status: 'completed',
      auditor: 'Auditoría Interna EDU21',
      scope: ['Controles acceso', 'Backup/Recovery', 'Logs auditoria'],
      findings_count: 4,
      compliance_score: 87.5,
      report_url: '/reports/audit-002-q2-2025.pdf'
    },
    {
      audit_id: 'audit-003',
      audit_type: 'incident',
      title: 'Investigación Incidente Acceso No Autorizado',
      description: 'Análisis de intento de acceso no autorizado detectado el 18 de Junio',
      start_date: '2025-06-19T00:00:00Z',
      end_date: '2025-06-25T23:59:59Z',
      status: 'review',
      auditor: 'Equipo Seguridad',
      scope: ['Logs acceso', 'Controles MFA', 'Monitoreo tiempo real'],
      findings_count: 2,
      compliance_score: 92.3,
      report_url: undefined
    }
  ]

  // Mock data retention policies
  const retentionPolicies: DataRetentionPolicy[] = [
    {
      policy_id: 'ret-001',
      data_type: 'Registros de Estudiantes',
      retention_period_days: 2555, // ~7 años
      archival_required: true,
      deletion_method: 'Secure Deletion + Certificate',
      legal_basis: 'Ley General de Educación',
      last_reviewed: '2025-01-15T00:00:00Z',
      next_review: '2026-01-15T00:00:00Z',
      records_count: 45670,
      upcoming_deletions: 1204
    },
    {
      policy_id: 'ret-002',
      data_type: 'Logs de Sistema',
      retention_period_days: 365,
      archival_required: false,
      deletion_method: 'Automated Deletion',
      legal_basis: 'Política Interna ISO 27001',
      last_reviewed: '2025-06-01T00:00:00Z',
      next_review: '2025-12-01T00:00:00Z',
      records_count: 2847291,
      upcoming_deletions: 89234
    },
    {
      policy_id: 'ret-003',
      data_type: 'Evaluaciones y Calificaciones',
      retention_period_days: 1825, // 5 años
      archival_required: true,
      deletion_method: 'Archive + Secure Deletion',
      legal_basis: 'Decreto Evaluación MINEDUC',
      last_reviewed: '2025-03-10T00:00:00Z',
      next_review: '2026-03-10T00:00:00Z',
      records_count: 189432,
      upcoming_deletions: 4578
    },
    {
      policy_id: 'ret-004',
      data_type: 'Datos de Comunicación',
      retention_period_days: 730, // 2 años
      archival_required: false,
      deletion_method: 'Secure Deletion',
      legal_basis: 'Ley 19.628 Protección Datos',
      last_reviewed: '2025-04-20T00:00:00Z',
      next_review: '2025-10-20T00:00:00Z',
      records_count: 67890,
      upcoming_deletions: 2341
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'warning':
      case 'investigating':
      case 'review':
        return 'bg-yellow-100 text-yellow-800'
      case 'violation':
      case 'critical':
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'pending':
      case 'planning':
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'completed':
      case 'resolved':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'warning':
      case 'investigating':
      case 'review':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      case 'violation':
      case 'critical':
      case 'open':
        return <XCircleIcon className="w-4 h-4" />
      case 'pending':
      case 'planning':
      case 'acknowledged':
        return <ClockIcon className="w-4 h-4" />
      default:
        return <InformationCircleIcon className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy':
        return <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
      case 'security':
        return <LockClosedIcon className="w-5 h-5 text-red-600" />
      case 'accessibility':
        return <UsersIcon className="w-5 h-5 text-green-600" />
      case 'data_retention':
        return <ArchiveBoxIcon className="w-5 h-5 text-purple-600" />
      case 'audit':
        return <DocumentCheckIcon className="w-5 h-5 text-orange-600" />
      default:
        return <DocumentTextIcon className="w-5 h-5 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL')
  }

  const getComplianceStats = () => {
    const totalRules = complianceRules.length
    const compliantRules = complianceRules.filter(r => r.status === 'compliant').length
    const warningRules = complianceRules.filter(r => r.status === 'warning').length
    const violationRules = complianceRules.filter(r => r.status === 'violation').length
    const complianceRate = (compliantRules / totalRules * 100).toFixed(1)

    const openViolations = complianceViolations.filter(v => v.status === 'open').length
    const criticalViolations = complianceViolations.filter(v => v.severity === 'critical').length

    return {
      totalRules,
      compliantRules,
      warningRules,
      violationRules,
      complianceRate,
      openViolations,
      criticalViolations
    }
  }

  const handleExportComplianceReport = () => {
    toast.success('Generando reporte de compliance...')
  }

  const handleResolveViolation = (violationId: string) => {
    toast.success('Violación marcada como resuelta')
  }

  const handleScheduleAudit = () => {
    toast.success('Programando nueva auditoría...')
  }

  const stats = getComplianceStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Compliance y Legal ⚖️</h1>
              <p className="mt-2 opacity-90">
                Gestión integral de compliance, normativas y aspectos legales
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportComplianceReport}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
              <Button
                onClick={handleScheduleAudit}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Programar Auditoría
              </Button>
            </div>
          </div>
        </div>

        {/* Compliance Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ScaleIcon className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tasa de Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
                <p className="text-xs text-gray-500">{stats.compliantRules}/{stats.totalRules} reglas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Advertencia</p>
                <p className="text-2xl font-bold text-gray-900">{stats.warningRules}</p>
                <p className="text-xs text-gray-500">reglas con alertas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircleIcon className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Violaciones Abiertas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openViolations}</p>
                <p className="text-xs text-gray-500">{stats.criticalViolations} críticas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentCheckIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Auditorías Activas</p>
                <p className="text-2xl font-bold text-gray-900">{complianceAudits.filter(a => a.status === 'active' || a.status === 'review').length}</p>
                <p className="text-xs text-gray-500">en progreso</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {[
                { key: 'overview', label: 'Resumen', icon: ChartBarIcon },
                { key: 'rules', label: 'Reglas de Compliance', icon: ScaleIcon },
                { key: 'violations', label: 'Violaciones', icon: ExclamationTriangleIcon },
                { key: 'audits', label: 'Auditorías', icon: DocumentCheckIcon },
                { key: 'retention', label: 'Retención de Datos', icon: ArchiveBoxIcon }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Resumen de Compliance</h3>
                
                {/* Recent Violations */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Violaciones Recientes Críticas</h4>
                  <div className="space-y-3">
                    {complianceViolations.filter(v => v.severity === 'critical').slice(0, 3).map((violation) => (
                      <div key={violation.violation_id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                                {violation.severity.toUpperCase()}
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900">{violation.rule_name}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{violation.description}</p>
                            <div className="text-xs text-gray-500 mt-2">
                              Detectado: {formatDateTime(violation.detected_at)} | 
                              Vence: {formatDate(violation.due_date)} | 
                              Asignado a: {violation.assigned_to}
                            </div>
                          </div>
                          <Button
                            onClick={() => setSelectedViolation(violation)}
                            variant="outline"
                            size="sm"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Audits */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Próximas Auditorías</h4>
                  <div className="space-y-3">
                    {complianceAudits.filter(a => a.status === 'planning' || a.status === 'active').map((audit) => (
                      <div key={audit.audit_id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                                {getStatusIcon(audit.status)}
                                <span className="ml-1">{audit.status === 'planning' ? 'Planificada' : 'Activa'}</span>
                              </span>
                              <span className="ml-2 text-sm font-medium text-gray-900">{audit.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{audit.description}</p>
                            <div className="text-xs text-gray-500 mt-2">
                              {formatDate(audit.start_date)} - {formatDate(audit.end_date)} | 
                              Auditor: {audit.auditor}
                            </div>
                          </div>
                          <FlagIcon className="w-5 h-5 text-blue-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Reglas de Compliance</h3>
                  <Button>
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Nueva Regla
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {complianceRules.map((rule) => (
                    <div key={rule.rule_id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {getCategoryIcon(rule.category)}
                            <span className="ml-2 text-sm font-medium text-gray-900">{rule.name}</span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                              {getStatusIcon(rule.status)}
                              <span className="ml-1">
                                {rule.status === 'compliant' ? 'Conforme' : rule.status === 'warning' ? 'Advertencia' : 'Violación'}
                              </span>
                            </span>
                            {rule.automated && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Automático
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Regulación:</span> {rule.regulation}
                            </div>
                            <div>
                              <span className="font-medium">Responsable:</span> {rule.responsible_role}
                            </div>
                            <div>
                              <span className="font-medium">Última verificación:</span> {formatDateTime(rule.last_check)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <CogIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'violations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Violaciones de Compliance</h3>

                <div className="grid grid-cols-1 gap-4">
                  {complianceViolations.map((violation) => (
                    <div key={violation.violation_id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}`}>
                              {violation.severity.toUpperCase()}
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-900">{violation.rule_name}</span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                              {getStatusIcon(violation.status)}
                              <span className="ml-1">
                                {violation.status === 'open' ? 'Abierta' : violation.status === 'investigating' ? 'Investigando' : violation.status === 'resolved' ? 'Resuelta' : 'Reconocida'}
                              </span>
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{violation.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500 mb-3">
                            <div>
                              <span className="font-medium">Detectado:</span> {formatDateTime(violation.detected_at)}
                            </div>
                            <div>
                              <span className="font-medium">Vencimiento:</span> {formatDate(violation.due_date)}
                            </div>
                            <div>
                              <span className="font-medium">Asignado a:</span> {violation.assigned_to}
                            </div>
                            <div>
                              <span className="font-medium">Escuelas afectadas:</span> {violation.affected_schools.length}
                            </div>
                          </div>
                          {violation.remediation_steps.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-gray-700">Pasos de remediación:</span>
                              <ul className="text-xs text-gray-600 mt-1 ml-4">
                                {violation.remediation_steps.slice(0, 2).map((step, index) => (
                                  <li key={index} className="list-disc">{step}</li>
                                ))}
                                {violation.remediation_steps.length > 2 && (
                                  <li className="list-disc text-gray-400">+{violation.remediation_steps.length - 2} pasos más...</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setSelectedViolation(violation)}
                            variant="outline"
                            size="sm"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          {violation.status !== 'resolved' && (
                            <Button
                              onClick={() => handleResolveViolation(violation.violation_id)}
                              variant="outline"
                              size="sm"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'audits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Auditorías de Compliance</h3>
                  <Button onClick={handleScheduleAudit}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Nueva Auditoría
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {complianceAudits.map((audit) => (
                    <div key={audit.audit_id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                              {getStatusIcon(audit.status)}
                              <span className="ml-1">
                                {audit.status === 'planning' ? 'Planificada' : audit.status === 'active' ? 'Activa' : audit.status === 'review' ? 'En Revisión' : 'Completada'}
                              </span>
                            </span>
                            <span className="ml-2 text-sm font-medium text-gray-900">{audit.title}</span>
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {audit.audit_type === 'regulatory' ? 'Regulatoria' : audit.audit_type === 'internal' ? 'Interna' : audit.audit_type === 'incident' ? 'Incidente' : 'Periódica'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{audit.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500 mb-2">
                            <div>
                              <span className="font-medium">Período:</span> {formatDate(audit.start_date)} - {formatDate(audit.end_date)}
                            </div>
                            <div>
                              <span className="font-medium">Auditor:</span> {audit.auditor}
                            </div>
                            <div>
                              <span className="font-medium">Hallazgos:</span> {audit.findings_count}
                            </div>
                          </div>
                          {audit.compliance_score > 0 && (
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-gray-700">Score de Compliance:</span>
                              <div className="ml-2 flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${audit.compliance_score >= 90 ? 'bg-green-500' : audit.compliance_score >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${audit.compliance_score}%` }}
                                  />
                                </div>
                                <span className="ml-2 text-xs font-medium text-gray-900">{audit.compliance_score}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          {audit.report_url && (
                            <Button variant="outline" size="sm">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'retention' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Políticas de Retención de Datos</h3>
                  <Button>
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Nueva Política
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {retentionPolicies.map((policy) => (
                    <div key={policy.policy_id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <ArchiveBoxIcon className="w-5 h-5 text-purple-600" />
                            <span className="ml-2 text-sm font-medium text-gray-900">{policy.data_type}</span>
                            {policy.archival_required && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Archivo Requerido
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500 mb-3">
                            <div>
                              <span className="font-medium">Retención:</span> {Math.floor(policy.retention_period_days / 365)} años
                            </div>
                            <div>
                              <span className="font-medium">Base Legal:</span> {policy.legal_basis}
                            </div>
                            <div>
                              <span className="font-medium">Registros:</span> {policy.records_count.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Próximas eliminaciones:</span> {policy.upcoming_deletions.toLocaleString()}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Método eliminación:</span> {policy.deletion_method}
                            </div>
                            <div>
                              <span className="font-medium">Próxima revisión:</span> {formatDate(policy.next_review)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <CogIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
