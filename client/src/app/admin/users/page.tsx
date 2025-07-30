'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  UserPlusIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  LockClosedIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface GlobalUser {
  user_id: string
  email: string
  first_name: string
  last_name: string
  role: string
  school_name: string
  school_id: string
  active: boolean
  mfa_enabled: boolean
  last_login: string
  created_at: string
  login_attempts: number
  is_locked: boolean
  phone?: string
  rut?: string
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [schoolFilter, setSchoolFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedUser, setSelectedUser] = useState<GlobalUser | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showMfaModal, setShowMfaModal] = useState(false)

  // Mock data for global users
  const mockUsers: GlobalUser[] = [
    {
      user_id: 'user-001',
      email: 'maria.rodriguez@csap.cl',
      first_name: 'María Elena',
      last_name: 'Rodríguez',
      role: 'ADMIN_ESCOLAR',
      school_name: 'Colegio San Antonio de Padua',
      school_id: 'school-001',
      active: true,
      mfa_enabled: true,
      last_login: '2024-06-20T14:30:00Z',
      created_at: '2024-01-15T10:00:00Z',
      login_attempts: 0,
      is_locked: false,
      phone: '+56 9 8765 4321',
      rut: '12.345.678-9'
    },
    {
      user_id: 'user-002',
      email: 'carlos.mendoza@losandes.cl',
      first_name: 'Carlos',
      last_name: 'Mendoza López',
      role: 'ADMIN_ESCOLAR',
      school_name: 'Escuela Básica Los Andes',
      school_id: 'school-002',
      active: true,
      mfa_enabled: false,
      last_login: '2024-06-19T16:45:00Z',
      created_at: '2024-02-20T09:15:00Z',
      login_attempts: 1,
      is_locked: false,
      phone: '+56 9 7654 3210',
      rut: '23.456.789-0'
    },
    {
      user_id: 'user-003',
      email: 'ana.soto@itm.cl',
      first_name: 'Ana Patricia',
      last_name: 'Soto',
      role: 'ADMIN_ESCOLAR',
      school_name: 'Instituto Técnico Metropolitano',
      school_id: 'school-003',
      active: true,
      mfa_enabled: true,
      last_login: '2024-06-20T13:20:00Z',
      created_at: '2024-03-10T11:30:00Z',
      login_attempts: 0,
      is_locked: false,
      phone: '+56 9 6543 2109',
      rut: '34.567.890-1'
    },
    {
      user_id: 'user-004',
      email: 'pedro.silva@csap.cl',
      first_name: 'Pedro',
      last_name: 'Silva',
      role: 'TEACHER',
      school_name: 'Colegio San Antonio de Padua',
      school_id: 'school-001',
      active: true,
      mfa_enabled: false,
      last_login: '2024-06-20T08:15:00Z',
      created_at: '2024-01-20T14:00:00Z',
      login_attempts: 0,
      is_locked: false,
      phone: '+56 9 5432 1098',
      rut: '45.678.901-2'
    },
    {
      user_id: 'user-005',
      email: 'lucia.torres@losandes.cl',
      first_name: 'Lucía',
      last_name: 'Torres',
      role: 'BIENESTAR_ESCOLAR',
      school_name: 'Escuela Básica Los Andes',
      school_id: 'school-002',
      active: false,
      mfa_enabled: false,
      last_login: '2024-05-30T10:20:00Z',
      created_at: '2024-02-25T16:30:00Z',
      login_attempts: 5,
      is_locked: true,
      phone: '+56 9 4321 0987',
      rut: '56.789.012-3'
    },
    {
      user_id: 'user-006',
      email: 'super@edu21.cl',
      first_name: 'Sistema',
      last_name: 'Administrador',
      role: 'SUPER_ADMIN_FULL',
      school_name: 'Sistema Global',
      school_id: 'global',
      active: true,
      mfa_enabled: true,
      last_login: '2024-06-20T15:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      login_attempts: 0,
      is_locked: false,
      rut: '11.111.111-1'
    }
  ]

  const schools = [
    { id: 'school-001', name: 'Colegio San Antonio de Padua' },
    { id: 'school-002', name: 'Escuela Básica Los Andes' },
    { id: 'school-003', name: 'Instituto Técnico Metropolitano' },
    { id: 'global', name: 'Sistema Global' }
  ]

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.rut?.includes(searchTerm)
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    const matchesSchool = schoolFilter === 'ALL' || user.school_id === schoolFilter
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && user.active) ||
                         (statusFilter === 'INACTIVE' && !user.active) ||
                         (statusFilter === 'LOCKED' && user.is_locked) ||
                         (statusFilter === 'MFA_DISABLED' && !user.mfa_enabled)
    
    return matchesSearch && matchesRole && matchesSchool && matchesStatus
  })

  const handleCreateUser = () => {
    setShowCreateModal(true)
  }

  const handleEditUser = (user: GlobalUser) => {
    setSelectedUser(user)
    toast.success('Editando usuario: ' + user.email)
  }

  const handleDeleteUser = (userId: string, email: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el usuario "${email}"?`)) {
      toast.success('Usuario eliminado correctamente')
    }
  }

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    if (confirm(`¿Estás seguro de que deseas ${action} este usuario?`)) {
      toast.success(`Usuario ${action}do correctamente`)
    }
  }

  const handleUnlockUser = (userId: string, email: string) => {
    if (confirm(`¿Deseas desbloquear el usuario "${email}"?`)) {
      toast.success('Usuario desbloqueado correctamente')
    }
  }

  const handleToggleMFA = (user: GlobalUser) => {
    setSelectedUser(user)
    setShowMfaModal(true)
  }

  const handleImpersonateUser = (user: GlobalUser) => {
    if (confirm(`¿Deseas impersonar al usuario "${user.email}"? Esta acción será auditada.`)) {
      toast.success(`Impersonando a ${user.email} (solo lectura)`)
      // Here would implement impersonation logic
    }
  }

  const handleResetPassword = (user: GlobalUser) => {
    if (confirm(`¿Deseas generar una nueva contraseña para "${user.email}"?`)) {
      toast.success('Nueva contraseña generada y enviada por email')
    }
  }

  const handleExportUsers = () => {
    toast.success('Exportando datos de usuarios...')
    setTimeout(() => {
      toast.success('Archivo CSV descargado correctamente')
    }, 2000)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN_FULL': return <ShieldCheckIcon className="h-4 w-4" />
      case 'ADMIN_ESCOLAR': return <BuildingOfficeIcon className="h-4 w-4" />
      case 'TEACHER': return <AcademicCapIcon className="h-4 w-4" />
      case 'BIENESTAR_ESCOLAR': return <UserCircleIcon className="h-4 w-4" />
      case 'STUDENT': return <UserCircleIcon className="h-4 w-4" />
      case 'GUARDIAN': return <UsersIcon className="h-4 w-4" />
      case 'SOSTENEDOR': return <BuildingOfficeIcon className="h-4 w-4" />
      default: return <UserCircleIcon className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN_FULL': return 'bg-red-100 text-red-800'
      case 'ADMIN_ESCOLAR': return 'bg-purple-100 text-purple-800'
      case 'TEACHER': return 'bg-blue-100 text-blue-800'
      case 'BIENESTAR_ESCOLAR': return 'bg-green-100 text-green-800'
      case 'STUDENT': return 'bg-cyan-100 text-cyan-800'
      case 'GUARDIAN': return 'bg-orange-100 text-orange-800'
      case 'SOSTENEDOR': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: { [key: string]: string } = {
      'SUPER_ADMIN_FULL': 'Super Admin',
      'ADMIN_ESCOLAR': 'Director/UTP',
      'TEACHER': 'Profesor',
      'BIENESTAR_ESCOLAR': 'Bienestar',
      'STUDENT': 'Estudiante',
      'GUARDIAN': 'Apoderado',
      'SOSTENEDOR': 'Sostenedor'
    }
    return labels[role] || role
  }

  const getStatusBadge = (user: GlobalUser) => {
    if (user.is_locked) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <LockClosedIcon className="w-3 h-3 mr-1" />
          Bloqueado
        </span>
      )
    } else if (user.active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Activo
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Inactivo
        </span>
      )
    }
  }

  const getMfaBadge = (enabled: boolean) => {
    if (enabled) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          <ShieldCheckIcon className="w-3 h-3 mr-1" />
          MFA
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
          <KeyIcon className="w-3 h-3 mr-1" />
          Sin MFA
        </span>
      )
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión Global de Usuarios 👥</h1>
              <p className="mt-2 opacity-90">
                Administra usuarios de todas las escuelas y configura políticas de seguridad
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportUsers}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                onClick={handleCreateUser}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.filter(u => u.active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Con MFA</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.filter(u => u.mfa_enabled).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <LockClosedIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Bloqueados</p>
                <p className="text-2xl font-bold text-gray-900">{mockUsers.filter(u => u.is_locked).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email, RUT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">Todos los roles</option>
                  <option value="SUPER_ADMIN_FULL">Super Admin</option>
                  <option value="ADMIN_ESCOLAR">Director/UTP</option>
                  <option value="TEACHER">Profesor</option>
                  <option value="BIENESTAR_ESCOLAR">Bienestar</option>
                  <option value="STUDENT">Estudiante</option>
                  <option value="GUARDIAN">Apoderado</option>
                  <option value="SOSTENEDOR">Sostenedor</option>
                </select>

                <select
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">Todas las escuelas</option>
                  {schools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="ACTIVE">Solo activos</option>
                  <option value="INACTIVE">Solo inactivos</option>
                  <option value="LOCKED">Solo bloqueados</option>
                  <option value="MFA_DISABLED">Sin MFA</option>
                </select>

                <div className="text-sm text-gray-500">
                  {filteredUsers.length} de {mockUsers.length} usuarios
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Escuela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado / MFA
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.rut && <div className="text-xs text-gray-400">{user.rut}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{getRoleLabel(user.role)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.school_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {getStatusBadge(user)}
                        {getMfaBadge(user.mfa_enabled)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.last_login).toLocaleDateString('es-CL')}
                      <div className="text-xs">
                        {user.login_attempts > 0 && `${user.login_attempts} intentos fallidos`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleImpersonateUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Impersonar usuario"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleMFA(user)}
                          className="text-purple-600 hover:text-purple-900"
                          title={user.mfa_enabled ? "Desactivar MFA" : "Activar MFA"}
                        >
                          <KeyIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user)}
                          className="text-orange-600 hover:text-orange-900"
                          title="Resetear contraseña"
                        >
                          <LockClosedIcon className="h-4 w-4" />
                        </button>
                        {user.is_locked && (
                          <button
                            onClick={() => handleUnlockUser(user.user_id, user.email)}
                            className="text-green-600 hover:text-green-900"
                            title="Desbloquear usuario"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleUserStatus(user.user_id, user.active)}
                          className={user.active ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                          title={user.active ? "Desactivar" : "Activar"}
                        >
                          {user.active ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id, user.email)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Usuario</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Apellido</label>
                      <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option value="TEACHER">Profesor</option>
                      <option value="ADMIN_ESCOLAR">Director/UTP</option>
                      <option value="BIENESTAR_ESCOLAR">Bienestar</option>
                      <option value="STUDENT">Estudiante</option>
                      <option value="GUARDIAN">Apoderado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Escuela</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      {schools.filter(s => s.id !== 'global').map(school => (
                        <option key={school.id} value={school.id}>{school.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => {
                      toast.success('Usuario creado correctamente')
                      setShowCreateModal(false)
                    }}
                    className="flex-1"
                  >
                    Crear Usuario
                  </Button>
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MFA Configuration Modal */}
        {showMfaModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Configurar MFA - {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    Estado actual: {selectedUser.mfa_enabled ? 'MFA Activado' : 'MFA Desactivado'}
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="mfa" value="enable" className="mr-2" />
                      Activar MFA con Google Authenticator
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="mfa" value="sms" className="mr-2" />
                      Activar MFA con SMS
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="mfa" value="disable" className="mr-2" />
                      Desactivar MFA
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => {
                      toast.success('Configuración MFA actualizada')
                      setShowMfaModal(false)
                      setSelectedUser(null)
                    }}
                    className="flex-1"
                  >
                    Guardar
                  </Button>
                  <Button
                    onClick={() => {
                      setShowMfaModal(false)
                      setSelectedUser(null)
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 