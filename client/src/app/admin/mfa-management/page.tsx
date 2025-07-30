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
  UsersIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  LockClosedIcon,
  LockOpenIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface MFAUser {
  user_id: string
  email: string
  full_name: string
  role: string
  school_name: string
  mfa_enabled: boolean
  mfa_methods: string[]
  backup_codes_remaining: number
  last_mfa_login: string
  mfa_failures_count: number
  is_locked: boolean
  device_count: number
  devices: {
    device_id: string
    device_name: string
    device_type: 'mobile' | 'desktop' | 'authenticator'
    registered_at: string
    last_used: string
    is_trusted: boolean
  }[]
}

interface MFAPolicy {
  policy_id: string
  name: string
  description: string
  is_active: boolean
  roles_required: string[]
  methods_allowed: string[]
  backup_codes_count: number
  session_timeout_minutes: number
  max_failures_before_lock: number
  require_device_registration: boolean
  trusted_device_duration_days: number
}

interface MFAStats {
  total_users: number
  mfa_enabled_users: number
  mfa_adoption_rate: number
  failed_attempts_24h: number
  locked_accounts: number
  active_sessions: number
  method_breakdown: {
    totp: number
    sms: number
    email: number
    backup_codes: number
  }
}

export default function AdminMFAManagementPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('last_login')
  const [selectedUser, setSelectedUser] = useState<MFAUser | null>(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)

  // Mock MFA users data
  const mockMFAUsers: MFAUser[] = [
    {
      user_id: '1',
      email: 'maria.gonzalez@colegiosanfrancisco.cl',
      full_name: 'María González Silva',
      role: 'TEACHER',
      school_name: 'Colegio San Francisco',
      mfa_enabled: true,
      mfa_methods: ['totp', 'backup_codes'],
      backup_codes_remaining: 8,
      last_mfa_login: '2025-06-23T14:30:00Z',
      mfa_failures_count: 0,
      is_locked: false,
      device_count: 2,
      devices: [
        {
          device_id: 'dev-1',
          device_name: 'iPhone 14',
          device_type: 'mobile',
          registered_at: '2025-05-15T10:00:00Z',
          last_used: '2025-06-23T14:30:00Z',
          is_trusted: true
        },
        {
          device_id: 'dev-2',
          device_name: 'Google Authenticator',
          device_type: 'authenticator',
          registered_at: '2025-05-15T10:05:00Z',
          last_used: '2025-06-23T14:30:00Z',
          is_trusted: true
        }
      ]
    },
    {
      user_id: '2',
      email: 'admin@losandes.edu.cl',
      full_name: 'Carlos Ruiz Mendoza',
      role: 'ADMIN_ESCOLAR',
      school_name: 'Instituto Comercial Los Andes',
      mfa_enabled: true,
      mfa_methods: ['totp', 'sms', 'backup_codes'],
      backup_codes_remaining: 5,
      last_mfa_login: '2025-06-23T16:15:00Z',
      mfa_failures_count: 0,
      is_locked: false,
      device_count: 3,
      devices: [
        {
          device_id: 'dev-3',
          device_name: 'Samsung Galaxy S23',
          device_type: 'mobile',
          registered_at: '2025-04-20T09:00:00Z',
          last_used: '2025-06-23T16:15:00Z',
          is_trusted: true
        },
        {
          device_id: 'dev-4',
          device_name: 'Microsoft Authenticator',
          device_type: 'authenticator',
          registered_at: '2025-04-20T09:05:00Z',
          last_used: '2025-06-23T16:15:00Z',
          is_trusted: true
        },
        {
          device_id: 'dev-5',
          device_name: 'MacBook Pro',
          device_type: 'desktop',
          registered_at: '2025-04-25T11:30:00Z',
          last_used: '2025-06-22T18:45:00Z',
          is_trusted: false
        }
      ]
    },
    {
      user_id: '3',
      email: 'pedro.martinez@valleverde.cl',
      full_name: 'Pedro Martínez López',
      role: 'TEACHER',
      school_name: 'Escuela Rural Valle Verde',
      mfa_enabled: false,
      mfa_methods: [],
      backup_codes_remaining: 0,
      last_mfa_login: '',
      mfa_failures_count: 0,
      is_locked: false,
      device_count: 0,
      devices: []
    },
    {
      user_id: '4',
      email: 'ana.ramirez@liceo-tecnico.cl',
      full_name: 'Ana Ramírez Torres',
      role: 'TEACHER',
      school_name: 'Liceo Técnico Industrial',
      mfa_enabled: true,
      mfa_methods: ['email', 'backup_codes'],
      backup_codes_remaining: 3,
      last_mfa_login: '2025-06-22T08:20:00Z',
      mfa_failures_count: 2,
      is_locked: false,
      device_count: 1,
      devices: [
        {
          device_id: 'dev-6',
          device_name: 'Windows PC',
          device_type: 'desktop',
          registered_at: '2025-06-01T14:00:00Z',
          last_used: '2025-06-22T08:20:00Z',
          is_trusted: false
        }
      ]
    },
    {
      user_id: '5',
      email: 'sofia.herrera@colegiosanfrancisco.cl',
      full_name: 'Sofía Herrera Campos',
      role: 'BIENESTAR_ESCOLAR',
      school_name: 'Colegio San Francisco',
      mfa_enabled: true,
      mfa_methods: ['totp'],
      backup_codes_remaining: 10,
      last_mfa_login: '2025-06-21T10:45:00Z',
      mfa_failures_count: 5,
      is_locked: true,
      device_count: 1,
      devices: [
        {
          device_id: 'dev-7',
          device_name: 'Google Authenticator',
          device_type: 'authenticator',
          registered_at: '2025-05-30T16:20:00Z',
          last_used: '2025-06-21T10:45:00Z',
          is_trusted: true
        }
      ]
    }
  ]

  // Mock MFA policies
  const mockPolicies: MFAPolicy[] = [
    {
      policy_id: 'policy-1',
      name: 'Administradores - Máxima Seguridad',
      description: 'Política estricta para roles administrativos con MFA obligatorio',
      is_active: true,
      roles_required: ['SUPER_ADMIN_FULL', 'ADMIN_ESCOLAR'],
      methods_allowed: ['totp', 'sms', 'backup_codes'],
      backup_codes_count: 10,
      session_timeout_minutes: 480,
      max_failures_before_lock: 3,
      require_device_registration: true,
      trusted_device_duration_days: 30
    },
    {
      policy_id: 'policy-2',
      name: 'Profesores - Estándar',
      description: 'Política estándar para profesores con MFA recomendado',
      is_active: true,
      roles_required: ['TEACHER', 'BIENESTAR_ESCOLAR'],
      methods_allowed: ['totp', 'email', 'sms', 'backup_codes'],
      backup_codes_count: 8,
      session_timeout_minutes: 720,
      max_failures_before_lock: 5,
      require_device_registration: false,
      trusted_device_duration_days: 90
    },
    {
      policy_id: 'policy-3',
      name: 'Usuarios Básicos',
      description: 'Política flexible para estudiantes y apoderados',
      is_active: false,
      roles_required: ['STUDENT', 'GUARDIAN'],
      methods_allowed: ['email', 'sms'],
      backup_codes_count: 5,
      session_timeout_minutes: 1440,
      max_failures_before_lock: 10,
      require_device_registration: false,
      trusted_device_duration_days: 180
    }
  ]

  // Mock MFA statistics
  const mfaStats: MFAStats = {
    total_users: 2847,
    mfa_enabled_users: 1923,
    mfa_adoption_rate: 67.5,
    failed_attempts_24h: 23,
    locked_accounts: 3,
    active_sessions: 456,
    method_breakdown: {
      totp: 1245,
      sms: 567,
      email: 234,
      backup_codes: 1923
    }
  }

  const getStatusColor = (mfaEnabled: boolean, isLocked: boolean) => {
    if (isLocked) return 'bg-red-100 text-red-800'
    if (mfaEnabled) return 'bg-green-100 text-green-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getStatusIcon = (mfaEnabled: boolean, isLocked: boolean) => {
    if (isLocked) return <LockClosedIcon className="w-4 h-4" />
    if (mfaEnabled) return <ShieldCheckIcon className="w-4 h-4" />
    return <ExclamationTriangleIcon className="w-4 h-4" />
  }

  const getStatusLabel = (mfaEnabled: boolean, isLocked: boolean) => {
    if (isLocked) return 'Bloqueado'
    if (mfaEnabled) return 'MFA Activo'
    return 'Sin MFA'
  }

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      'SUPER_ADMIN_FULL': 'Super Admin',
      'ADMIN_ESCOLAR': 'Admin Escolar',
      'BIENESTAR_ESCOLAR': 'Bienestar',
      'TEACHER': 'Profesor',
      'STUDENT': 'Estudiante',
      'GUARDIAN': 'Apoderado',
      'SOSTENEDOR': 'Sostenedor'
    }
    return roleLabels[role] || role
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'totp':
        return <KeyIcon className="w-4 h-4 text-blue-600" />
      case 'sms':
        return <DevicePhoneMobileIcon className="w-4 h-4 text-green-600" />
      case 'email':
        return <DocumentTextIcon className="w-4 h-4 text-purple-600" />
      case 'backup_codes':
        return <DocumentTextIcon className="w-4 h-4 text-gray-600" />
      default:
        return <ShieldCheckIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const handleEnableMFA = async (userId: string) => {
    toast.success('Proceso de habilitación MFA iniciado')
  }

  const handleDisableMFA = async (userId: string) => {
    toast.success('MFA deshabilitado para el usuario')
  }

  const handleUnlockUser = async (userId: string) => {
    toast.success('Usuario desbloqueado exitosamente')
  }

  const handleResetMFA = async (userId: string) => {
    toast.success('Configuración MFA restablecida')
  }

  const handleGenerateBackupCodes = async (userId: string) => {
    toast.success('Nuevos códigos de respaldo generados')
  }

  const handleExportMFAReport = () => {
    toast.success('Exportando reporte de MFA...')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleString('es-CL')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de MFA 🔐</h1>
              <p className="mt-2 opacity-90">
                Gestión completa de autenticación multi-factor y seguridad
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportMFAReport}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={() => setShowPolicyModal(true)}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <CogIcon className="w-4 h-4 mr-2" />
                Políticas
              </Button>
            </div>
          </div>
        </div>

        {/* MFA Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{mfaStats.total_users.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">MFA Habilitado</p>
                <p className="text-2xl font-bold text-gray-900">{mfaStats.mfa_enabled_users.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Adopción</p>
                <p className="text-2xl font-bold text-gray-900">{mfaStats.mfa_adoption_rate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fallos 24h</p>
                <p className="text-2xl font-bold text-gray-900">{mfaStats.failed_attempts_24h}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <LockClosedIcon className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bloqueados</p>
                <p className="text-2xl font-bold text-gray-900">{mfaStats.locked_accounts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sesiones Activas</p>
                <p className="text-2xl font-bold text-gray-900">{mfaStats.active_sessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MFA Method Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Métodos MFA</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <KeyIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mfaStats.method_breakdown.totp.toLocaleString()}</p>
              <p className="text-sm text-gray-600">TOTP / Authenticator</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mfaStats.method_breakdown.sms.toLocaleString()}</p>
              <p className="text-sm text-gray-600">SMS</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mfaStats.method_breakdown.email.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Email</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2">
                <DocumentTextIcon className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mfaStats.method_breakdown.backup_codes.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Códigos Respaldo</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Todos los roles</option>
                <option value="SUPER_ADMIN_FULL">Super Admin</option>
                <option value="ADMIN_ESCOLAR">Admin Escolar</option>
                <option value="TEACHER">Profesores</option>
                <option value="BIENESTAR_ESCOLAR">Bienestar</option>
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="enabled">MFA Habilitado</option>
                <option value="disabled">Sin MFA</option>
                <option value="locked">Bloqueados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Usuarios y Estado MFA</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado MFA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métodos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fallos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockMFAUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{getRoleLabel(user.role)} - {user.school_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.mfa_enabled, user.is_locked)}`}>
                        {getStatusIcon(user.mfa_enabled, user.is_locked)}
                        <span className="ml-1">{getStatusLabel(user.mfa_enabled, user.is_locked)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {user.mfa_methods.map((method, index) => (
                          <span key={index} title={method} className="inline-flex">
                            {getMethodIcon(method)}
                          </span>
                        ))}
                        {user.mfa_methods.length === 0 && (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </div>
                      {user.backup_codes_remaining > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {user.backup_codes_remaining} códigos
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.device_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(user.last_mfa_login)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${user.mfa_failures_count > 3 ? 'text-red-600' : user.mfa_failures_count > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {user.mfa_failures_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => setSelectedUser(user)}
                          variant="outline"
                          size="sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        {user.is_locked ? (
                          <Button
                            onClick={() => handleUnlockUser(user.user_id)}
                            variant="outline"
                            size="sm"
                          >
                            <LockOpenIcon className="w-4 h-4" />
                          </Button>
                        ) : user.mfa_enabled ? (
                          <Button
                            onClick={() => handleResetMFA(user.user_id)}
                            variant="outline"
                            size="sm"
                          >
                            <CogIcon className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEnableMFA(user.user_id)}
                            variant="outline"
                            size="sm"
                          >
                            <ShieldCheckIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MFA Policies */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Políticas de MFA</h3>
            <Button onClick={() => setShowPolicyModal(true)}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nueva Política
            </Button>
          </div>

          <div className="space-y-4">
            {mockPolicies.map((policy) => (
              <div key={policy.policy_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{policy.name}</h4>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {policy.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <PencilIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Roles aplicables:</span>
                    <p className="text-gray-600">{policy.roles_required.map(getRoleLabel).join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Métodos permitidos:</span>
                    <p className="text-gray-600">{policy.methods_allowed.join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Timeout sesión:</span>
                    <p className="text-gray-600">{policy.session_timeout_minutes} min</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Máx. fallos:</span>
                    <p className="text-gray-600">{policy.max_failures_before_lock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
