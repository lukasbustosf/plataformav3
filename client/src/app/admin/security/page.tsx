'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  KeyIcon,
  LockClosedIcon,
  ClockIcon,
  UserIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  CogIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface SecurityEvent {
  id: string
  timestamp: string
  event_type: string
  user_email: string
  user_role: string
  school_name: string
  ip_address: string
  user_agent: string
  action: string
  resource: string
  success: boolean
  details?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface MFAPolicy {
  role: string
  required: boolean
  grace_period_days: number
  backup_codes: boolean
}

export default function AdminSecurityPage() {
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState('logs')
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [showPolicyModal, setShowPolicyModal] = useState(false)

  // Mock security events data
  const securityEvents: SecurityEvent[] = [
    {
      id: 'evt-001',
      timestamp: '2024-06-20T15:30:25Z',
      event_type: 'failed_login',
      user_email: 'admin@losandes.cl',
      user_role: 'ADMIN_ESCOLAR',
      school_name: 'Escuela Los Andes',
      ip_address: '190.45.67.89',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      action: 'LOGIN_ATTEMPT',
      resource: '/login',
      success: false,
      details: 'Contraseña incorrecta - 3er intento',
      severity: 'high'
    },
    {
      id: 'evt-002',
      timestamp: '2024-06-20T15:28:15Z',
      event_type: 'mfa_disabled',
      user_email: 'pedro.silva@csap.cl',
      user_role: 'TEACHER',
      school_name: 'Colegio San Antonio',
      ip_address: '201.45.123.45',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      action: 'DISABLE_MFA',
      resource: '/settings/security',
      success: true,
      details: 'Usuario desactivó autenticación de dos factores',
      severity: 'medium'
    },
    {
      id: 'evt-003',
      timestamp: '2024-06-20T15:25:30Z',
      event_type: 'data_export',
      user_email: 'maria.rodriguez@csap.cl',
      user_role: 'ADMIN_ESCOLAR',
      school_name: 'Colegio San Antonio',
      ip_address: '190.45.67.123',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      action: 'EXPORT_GRADES',
      resource: '/reports/grades/export',
      success: true,
      details: 'Exportación de notas del curso 7°A',
      severity: 'low'
    },
    {
      id: 'evt-004',
      timestamp: '2024-06-20T15:20:45Z',
      event_type: 'privilege_escalation',
      user_email: 'super@edu21.cl',
      user_role: 'SUPER_ADMIN_FULL',
      school_name: 'Sistema Global',
      ip_address: '200.45.67.234',
      user_agent: 'Mozilla/5.0 (Ubuntu; Linux x86_64)',
      action: 'IMPERSONATE_USER',
      resource: '/admin/impersonate',
      success: true,
      details: 'Impersonación de usuario carlos.mendoza@losandes.cl',
      severity: 'critical'
    },
    {
      id: 'evt-005',
      timestamp: '2024-06-20T15:15:20Z',
      event_type: 'password_reset',
      user_email: 'lucia.torres@losandes.cl',
      user_role: 'BIENESTAR_ESCOLAR',
      school_name: 'Escuela Los Andes',
      ip_address: '190.45.67.89',
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)',
      action: 'REQUEST_PASSWORD_RESET',
      resource: '/forgot-password',
      success: true,
      details: 'Solicitud de reseteo de contraseña',
      severity: 'low'
    },
    {
      id: 'evt-006',
      timestamp: '2024-06-20T15:10:30Z',
      event_type: 'api_key_rotation',
      user_email: 'super@edu21.cl',
      user_role: 'SUPER_ADMIN_FULL',
      school_name: 'Sistema Global',
      ip_address: '200.45.67.234',
      user_agent: 'Mozilla/5.0 (Ubuntu; Linux x86_64)',
      action: 'ROTATE_API_KEY',
      resource: '/admin/api-keys',
      success: true,
      details: 'Rotación de clave API de OpenAI',
      severity: 'medium'
    }
  ]

  // Mock MFA policies
  const [mfaPolicies, setMfaPolicies] = useState<MFAPolicy[]>([
    { role: 'SUPER_ADMIN_FULL', required: true, grace_period_days: 0, backup_codes: true },
    { role: 'ADMIN_ESCOLAR', required: true, grace_period_days: 7, backup_codes: true },
    { role: 'BIENESTAR_ESCOLAR', required: false, grace_period_days: 30, backup_codes: false },
    { role: 'TEACHER', required: false, grace_period_days: 30, backup_codes: false },
    { role: 'SOSTENEDOR', required: true, grace_period_days: 3, backup_codes: true }
  ])

  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch = event.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.details?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter
    const matchesEventType = eventTypeFilter === 'all' || event.event_type === eventTypeFilter
    
    // Date filtering would be implemented here
    return matchesSearch && matchesSeverity && matchesEventType
  })

  const handleExportLogs = () => {
    toast.success('Exportando logs de auditoría...')
    setTimeout(() => {
      toast.success('Archivo de logs descargado correctamente')
    }, 2000)
  }

  const handleUpdateMFAPolicy = (role: string, field: keyof MFAPolicy, value: any) => {
    setMfaPolicies(prev => prev.map(policy => 
      policy.role === role ? { ...policy, [field]: value } : policy
    ))
    toast.success('Política MFA actualizada')
  }

  const handleForceMFASetup = (role: string) => {
    if (confirm(`¿Forzar configuración de MFA para todos los usuarios con rol ${role}?`)) {
      toast.success(`Configuración MFA forzada para ${role}`)
    }
  }

  const handleViewEventDetails = (event: SecurityEvent) => {
    toast.success(`Mostrando detalles del evento ${event.id}`)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ExclamationTriangleIcon className="w-3 h-3" />
      case 'high': return <ExclamationTriangleIcon className="w-3 h-3" />
      case 'medium': return <BellIcon className="w-3 h-3" />
      case 'low': return <CheckCircleIcon className="w-3 h-3" />
      default: return <CheckCircleIcon className="w-3 h-3" />
    }
  }

  const getEventTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'failed_login': 'Login Fallido',
      'mfa_disabled': 'MFA Desactivado',
      'data_export': 'Exportación de Datos',
      'privilege_escalation': 'Escalación de Privilegios',
      'password_reset': 'Reset de Contraseña',
      'api_key_rotation': 'Rotación de API Key'
    }
    return labels[type] || type
  }

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      'SUPER_ADMIN_FULL': 'Super Admin',
      'ADMIN_ESCOLAR': 'Director/UTP',
      'BIENESTAR_ESCOLAR': 'Bienestar',
      'TEACHER': 'Profesor',
      'SOSTENEDOR': 'Sostenedor'
    }
    return labels[role] || role
  }

  const systemMetrics = {
    total_events_today: securityEvents.length,
    critical_events: securityEvents.filter(e => e.severity === 'critical').length,
    failed_logins: securityEvents.filter(e => e.event_type === 'failed_login').length,
    mfa_compliance: Math.round((mfaPolicies.filter(p => p.required).length / mfaPolicies.length) * 100),
    unique_ips: new Set(securityEvents.map(e => e.ip_address)).size,
    suspicious_activity: securityEvents.filter(e => e.severity === 'high' || e.severity === 'critical').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Seguridad & Logs 🛡️</h1>
              <p className="mt-2 opacity-90">
                Monitoreo de seguridad, auditoría de eventos y políticas de acceso
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportLogs}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar Logs
              </Button>
              <Button
                onClick={() => setShowPolicyModal(true)}
                className="bg-white text-red-600 hover:bg-gray-100"
              >
                <CogIcon className="w-4 h-4 mr-2" />
                Configurar Políticas
              </Button>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Eventos Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.total_events_today}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Críticos</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.critical_events}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <LockClosedIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Login Fallidos</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.failed_logins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">MFA Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.mfa_compliance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ComputerDesktopIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">IPs Únicas</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.unique_ips}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BellIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Actividad Sospechosa</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.suspicious_activity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setSelectedTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'logs'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Logs de Auditoría
              </button>
              <button
                onClick={() => setSelectedTab('mfa')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'mfa'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Políticas MFA
              </button>
              <button
                onClick={() => setSelectedTab('monitoring')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'monitoring'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Monitoreo
              </button>
            </nav>
          </div>

          {/* Audit Logs Tab */}
          {selectedTab === 'logs' && (
            <div>
              {/* Filters */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar en logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">Todas las severidades</option>
                      <option value="critical">Crítico</option>
                      <option value="high">Alto</option>
                      <option value="medium">Medio</option>
                      <option value="low">Bajo</option>
                    </select>

                    <select
                      value={eventTypeFilter}
                      onChange={(e) => setEventTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="all">Todos los tipos</option>
                      <option value="failed_login">Login Fallido</option>
                      <option value="mfa_disabled">MFA Desactivado</option>
                      <option value="data_export">Exportación de Datos</option>
                      <option value="privilege_escalation">Escalación de Privilegios</option>
                      <option value="password_reset">Reset de Contraseña</option>
                      <option value="api_key_rotation">Rotación de API Key</option>
                    </select>

                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="today">Hoy</option>
                      <option value="week">Esta semana</option>
                      <option value="month">Este mes</option>
                      <option value="quarter">Este trimestre</option>
                    </select>

                    <div className="text-sm text-gray-500">
                      {filteredEvents.length} eventos
                    </div>
                  </div>
                </div>
              </div>

              {/* Events Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP / Ubicación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resultado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severidad
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(event.timestamp).toLocaleString('es-CL')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getEventTypeLabel(event.event_type)}
                            </div>
                            <div className="text-sm text-gray-500">{event.action}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{event.user_email}</div>
                            <div className="text-sm text-gray-500">{getRoleLabel(event.user_role)} • {event.school_name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{event.ip_address}</div>
                            <div className="text-xs text-gray-500">{event.user_agent.substring(0, 50)}...</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {event.success ? <CheckCircleIcon className="w-3 h-3 mr-1" /> : <XCircleIcon className="w-3 h-3 mr-1" />}
                            {event.success ? 'Exitoso' : 'Fallido'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {getSeverityIcon(event.severity)}
                            <span className="ml-1 capitalize">{event.severity}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewEventDetails(event)}
                            className="text-red-600 hover:text-red-900"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MFA Policies Tab */}
          {selectedTab === 'mfa' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Políticas de Autenticación Multifactor</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Configuración de Seguridad
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Los cambios en las políticas MFA afectarán a todos los usuarios con los roles especificados.
                            Se recomienda notificar a los usuarios antes de hacer cambios obligatorios.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          MFA Requerido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período de Gracia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Códigos de Respaldo
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mfaPolicies.map((policy) => (
                        <tr key={policy.role}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {getRoleLabel(policy.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleUpdateMFAPolicy(policy.role, 'required', !policy.required)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                policy.required ? 'bg-red-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                policy.required ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={policy.grace_period_days}
                              onChange={(e) => handleUpdateMFAPolicy(policy.role, 'grace_period_days', parseInt(e.target.value))}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1"
                            >
                              <option value="0">Inmediato</option>
                              <option value="3">3 días</option>
                              <option value="7">7 días</option>
                              <option value="14">14 días</option>
                              <option value="30">30 días</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleUpdateMFAPolicy(policy.role, 'backup_codes', !policy.backup_codes)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                policy.backup_codes ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                policy.backup_codes ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleForceMFASetup(policy.role)}
                              className="text-red-600 hover:text-red-900"
                              title="Forzar configuración MFA"
                            >
                              <KeyIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Monitoring Tab */}
          {selectedTab === 'monitoring' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Alertas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Intentos de login fallidos</div>
                        <div className="text-xs text-gray-500">Alerta después de 3 intentos</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Acceso desde IP desconocida</div>
                        <div className="text-xs text-gray-500">Notificar al usuario y admin</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Exportación masiva de datos</div>
                        <div className="text-xs text-gray-500">Más de 1000 registros</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Cambios en configuración crítica</div>
                        <div className="text-xs text-gray-500">Políticas MFA, permisos, etc.</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Retención de Logs</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logs de auditoría</label>
                      <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="30">30 días</option>
                        <option value="90">90 días</option>
                        <option value="180">6 meses</option>
                        <option value="365">1 año</option>
                        <option value="1095">3 años</option>
                        <option value="1825">5 años</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logs de acceso</label>
                      <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="7">7 días</option>
                        <option value="30">30 días</option>
                        <option value="90">90 días</option>
                        <option value="180">6 meses</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Logs de errores</label>
                      <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                        <option value="30">30 días</option>
                        <option value="90">90 días</option>
                        <option value="180">6 meses</option>
                        <option value="365">1 año</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => toast.success('Configuración de retención actualizada')}
                        variant="outline"
                        className="w-full"
                      >
                        Guardar Configuración
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 