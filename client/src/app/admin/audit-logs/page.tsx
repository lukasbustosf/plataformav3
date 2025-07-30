'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon,
  UserIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface AuditLog {
  id: string
  timestamp: string
  user_id: string
  user_name: string
  user_role: string
  school_name?: string
  action: string
  resource: string
  resource_id?: string
  ip_address: string
  user_agent: string
  status: 'success' | 'failure' | 'warning'
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export default function AdminAuditLogsPage() {
  const { user } = useAuth()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('today')

  const auditLogs: AuditLog[] = [
    {
      id: 'log-001',
      timestamp: '2024-06-22T14:30:00Z',
      user_id: 'user-001',
      user_name: 'Carlos Rodriguez',
      user_role: 'SUPER_ADMIN_FULL',
      action: 'USER_CREATED',
      resource: 'users',
      resource_id: 'user-123',
      ip_address: '192.168.1.100',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      details: 'Created new teacher account for María González',
      severity: 'medium',
      school_name: 'Colegio San Antonio'
    },
    {
      id: 'log-002',
      timestamp: '2024-06-22T14:25:00Z',
      user_id: 'user-002',
      user_name: 'Ana Martínez',
      user_role: 'ADMIN_ESCOLAR',
      school_name: 'Instituto Metropolitano',
      action: 'LOGIN_FAILED',
      resource: 'authentication',
      ip_address: '10.0.0.50',
      user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      status: 'failure',
      details: 'Failed login attempt - incorrect password (3rd attempt)',
      severity: 'high'
    },
    {
      id: 'log-003',
      timestamp: '2024-06-22T14:20:00Z',
      user_id: 'user-003',
      user_name: 'Sistema Automático',
      user_role: 'SYSTEM',
      action: 'BACKUP_COMPLETED',
      resource: 'system',
      resource_id: 'backup-20240622',
      ip_address: '127.0.0.1',
      user_agent: 'EDU21-System/1.0',
      status: 'success',
      details: 'Daily backup completed successfully - 2.3GB stored',
      severity: 'low'
    },
    {
      id: 'log-004',
      timestamp: '2024-06-22T14:15:00Z',
      user_id: 'user-004',
      user_name: 'Pedro Silva',
      user_role: 'PROFESOR',
      school_name: 'Escuela Los Andes',
      action: 'AI_QUERY_EXCEEDED',
      resource: 'ai_usage',
      resource_id: 'query-batch-456',
      ip_address: '172.16.0.25',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'warning',
      details: 'AI query limit exceeded - 150/100 daily queries used',
      severity: 'medium'
    },
    {
      id: 'log-005',
      timestamp: '2024-06-22T14:10:00Z',
      user_id: 'user-005',
      user_name: 'Laura García',
      user_role: 'ADMIN_ESCOLAR',
      school_name: 'Colegio Bilingüe International',
      action: 'SECURITY_POLICY_UPDATED',
      resource: 'security_policies',
      resource_id: 'policy-mfa-001',
      ip_address: '192.168.100.15',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      status: 'success',
      details: 'Updated MFA policy - enabled for all admin roles',
      severity: 'high'
    },
    {
      id: 'log-006',
      timestamp: '2024-06-22T14:05:00Z',
      user_id: 'user-006',
      user_name: 'Intruso Detectado',
      user_role: 'UNKNOWN',
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      resource: 'admin_panel',
      ip_address: '203.0.113.42',
      user_agent: 'curl/7.68.0',
      status: 'failure',
      details: 'Unauthorized access attempt to admin panel - IP blocked',
      severity: 'critical'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'failure':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[severity as keyof typeof colors]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    )
  }

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN') || action.includes('AUTH')) {
      return <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
    } else if (action.includes('USER') || action.includes('CREATED') || action.includes('UPDATED')) {
      return <UserIcon className="h-4 w-4 text-green-500" />
    } else if (action.includes('SYSTEM') || action.includes('BACKUP')) {
      return <CpuChipIcon className="h-4 w-4 text-purple-500" />
    } else if (action.includes('SECURITY') || action.includes('UNAUTHORIZED')) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
    }
    return <DocumentTextIcon className="h-4 w-4 text-gray-500" />
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = selectedFilter === 'all' || log.status === selectedFilter
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity
    const matchesSearch = searchTerm === '' || 
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSeverity && matchesSearch
  })

  const handleExportLogs = () => {
    toast.loading('Exportando logs de auditoría...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Logs exportados correctamente')
    }, 2000)
  }

  const handleViewDetails = (logId: string) => {
    toast.success(`Abriendo detalles del log ${logId}`)
  }

  const handleArchiveLogs = () => {
    if (confirm('¿Estás seguro de que quieres archivar los logs antiguos?')) {
      toast.success('Archivando logs antiguos...')
    }
  }

  // Summary statistics
  const totalLogs = auditLogs.length
  const successLogs = auditLogs.filter(log => log.status === 'success').length
  const failureLogs = auditLogs.filter(log => log.status === 'failure').length
  const criticalLogs = auditLogs.filter(log => log.severity === 'critical').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Logs de Auditoría 📋</h1>
              <p className="mt-2 opacity-90">
                Registro completo de actividades y eventos del sistema
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportLogs}
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={handleArchiveLogs}
                className="bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Archivar
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{totalLogs}</p>
                <p className="text-xs text-gray-500">últimas 24h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Exitosos</p>
                <p className="text-2xl font-bold text-gray-900">{successLogs}</p>
                <p className="text-xs text-gray-500">{Math.round((successLogs/totalLogs)*100)}% del total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Fallos</p>
                <p className="text-2xl font-bold text-gray-900">{failureLogs}</p>
                <p className="text-xs text-gray-500">requieren atención</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Críticos</p>
                <p className="text-2xl font-bold text-gray-900">{criticalLogs}</p>
                <p className="text-xs text-gray-500">alta prioridad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Registro de Auditoría</h2>
                <p className="text-sm text-gray-500">Filtrar y buscar eventos del sistema</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="success">Exitosos</option>
                  <option value="failure">Fallos</option>
                  <option value="warning">Advertencias</option>
                </select>
                
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">Todas las severidades</option>
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                  <option value="quarter">Trimestre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recurso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(log.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleDateString('es-CL')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString('es-CL')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.user_name}</div>
                          <div className="text-sm text-gray-500">{log.user_role}</div>
                          {log.school_name && (
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                              {log.school_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{log.action}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{log.details}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.resource}</div>
                      {log.resource_id && (
                        <div className="text-sm text-gray-500">{log.resource_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{log.ip_address}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{log.user_agent}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(log.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron logs</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
