'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { 
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  AcademicCapIcon,
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

type UserRole = 'TEACHER' | 'STUDENT' | 'GUARDIAN' | 'ADMIN_ESCOLAR' | 'BIENESTAR_ESCOLAR'

interface SchoolUser {
  user_id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  active: boolean
  created_at: string
  last_login?: string
  phone?: string
  rut?: string
  subjects?: string[]
  classes?: string[]
}

export default function SchoolUsersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | 'ALL'>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SchoolUser | null>(null)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Mock data for demonstration
  const mockUsers: SchoolUser[] = [
    {
      user_id: 'teacher-001',
      email: 'maria.gonzalez@colegio.cl',
      first_name: 'María',
      last_name: 'González',
      role: 'TEACHER',
      active: true,
      created_at: '2024-01-15T10:00:00Z',
      last_login: '2024-06-20T14:30:00Z',
      phone: '+56 9 8765 4321',
      rut: '12.345.678-9',
      subjects: ['Matemáticas', 'Física'],
      classes: ['8°A', '1°M']
    },
    {
      user_id: 'teacher-002', 
      email: 'carlos.ruiz@colegio.cl',
      first_name: 'Carlos',
      last_name: 'Ruiz',
      role: 'TEACHER',
      active: true,
      created_at: '2024-02-10T09:00:00Z',
      last_login: '2024-06-20T16:45:00Z',
      phone: '+56 9 7654 3210',
      rut: '13.456.789-0',
      subjects: ['Ciencias Naturales', 'Biología'],
      classes: ['7°B', '2°M']
    },
    {
      user_id: 'student-001',
      email: 'diego.martinez@estudiante.cl',
      first_name: 'Diego',
      last_name: 'Martínez',
      role: 'STUDENT',
      active: true,
      created_at: '2024-03-01T08:00:00Z',
      last_login: '2024-06-20T13:20:00Z',
      phone: '+56 9 6543 2109',
      rut: '20.123.456-7',
      classes: ['8°A']
    },
    {
      user_id: 'guardian-001',
      email: 'patricia.morales@apoderado.cl',
      first_name: 'Patricia',
      last_name: 'Morales',
      role: 'GUARDIAN',
      active: true,
      created_at: '2024-03-05T11:30:00Z',
      last_login: '2024-06-19T20:15:00Z',
      phone: '+56 9 5432 1098',
      rut: '14.567.890-1'
    },
    {
      user_id: 'bienestar-001',
      email: 'ana.lopez@colegio.cl',
      first_name: 'Ana',
      last_name: 'López',
      role: 'BIENESTAR_ESCOLAR',
      active: true,
      created_at: '2024-01-20T12:00:00Z',
      last_login: '2024-06-20T15:10:00Z',
      phone: '+56 9 4321 0987',
      rut: '15.678.901-2'
    },
    {
      user_id: 'teacher-003',
      email: 'elena.vargas@colegio.cl',
      first_name: 'Elena',
      last_name: 'Vargas',
      role: 'TEACHER',
      active: false,
      created_at: '2023-08-15T14:00:00Z',
      last_login: '2024-05-30T10:20:00Z',
      phone: '+56 9 3210 9876',
      rut: '16.789.012-3',
      subjects: ['Historia', 'Educación Cívica'],
      classes: ['6°A', '7°A']
    }
  ]

  const roleLabels = {
    TEACHER: 'Profesor',
    STUDENT: 'Estudiante', 
    GUARDIAN: 'Apoderado',
    ADMIN_ESCOLAR: 'Admin Escolar',
    BIENESTAR_ESCOLAR: 'Bienestar'
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'TEACHER': return <AcademicCapIcon className="h-5 w-5" />
      case 'STUDENT': return <UserCircleIcon className="h-5 w-5" />
      case 'GUARDIAN': return <UsersIcon className="h-5 w-5" />
      case 'ADMIN_ESCOLAR': return <ShieldCheckIcon className="h-5 w-5" />
      case 'BIENESTAR_ESCOLAR': return <ShieldCheckIcon className="h-5 w-5" />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'TEACHER': return 'bg-green-100 text-green-800'
      case 'STUDENT': return 'bg-blue-100 text-blue-800' 
      case 'GUARDIAN': return 'bg-purple-100 text-purple-800'
      case 'ADMIN_ESCOLAR': return 'bg-red-100 text-red-800'
      case 'BIENESTAR_ESCOLAR': return 'bg-pink-100 text-pink-800'
    }
  }

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.rut?.includes(searchTerm)
    
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'ALL' || 
                         (selectedStatus === 'ACTIVE' && user.active) ||
                         (selectedStatus === 'INACTIVE' && !user.active)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = () => {
    setShowCreateModal(true)
  }

  const handleEditUser = (user: SchoolUser) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      toast.success('Usuario eliminado correctamente')
      // In real app, call API to delete user
    }
  }

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    if (confirm(`¿Estás seguro de que deseas ${action} este usuario?`)) {
      toast.success(`Usuario ${action}do correctamente`)
      // In real app, call API to toggle user status
    }
  }

  const handleResetPassword = (userId: string) => {
    if (confirm('¿Estás seguro de que deseas restablecer la contraseña de este usuario?')) {
      toast.success('Contraseña restablecida. Se ha enviado un correo con las instrucciones.')
      // In real app, call API to reset password
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Selecciona al menos un usuario')
      return
    }

    const userCount = selectedUsers.length
    if (confirm(`¿Estás seguro de que deseas ${action} ${userCount} usuario(s)?`)) {
      toast.success(`${action} aplicada a ${userCount} usuario(s)`)
      setSelectedUsers([])
      setShowBulkActions(false)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.user_id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios 👥</h1>
                <p className="text-gray-600 mt-1">
                  Administra profesores, estudiantes y apoderados del colegio
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleCreateUser}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockUsers.filter(u => u.role === 'TEACHER').length}</div>
              <div className="text-sm text-gray-600">Profesores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockUsers.filter(u => u.role === 'STUDENT').length}</div>
              <div className="text-sm text-gray-600">Estudiantes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockUsers.filter(u => u.role === 'GUARDIAN').length}</div>
              <div className="text-sm text-gray-600">Apoderados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{mockUsers.filter(u => u.active).length}</div>
              <div className="text-sm text-gray-600">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{mockUsers.filter(u => !u.active).length}</div>
              <div className="text-sm text-gray-600">Inactivos</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar usuario
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre, email o RUT..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | 'ALL')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="ALL">Todos los roles</option>
                <option value="TEACHER">Profesores</option>
                <option value="STUDENT">Estudiantes</option>
                <option value="GUARDIAN">Apoderados</option>
                <option value="ADMIN_ESCOLAR">Admin Escolar</option>
                <option value="BIENESTAR_ESCOLAR">Bienestar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Activos</option>
                <option value="INACTIVE">Inactivos</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <Button 
                onClick={() => setShowBulkActions(!showBulkActions)}
                variant="outline"
                className="flex-1"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Acciones masivas
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedUsers.length} usuario(s) seleccionado(s)
                  </span>
                  <button
                    onClick={toggleAllUsers}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedUsers.length === filteredUsers.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                  </button>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('activar')}
                  >
                    Activar
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('desactivar')}
                  >
                    Desactivar
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('eliminar')}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {showBulkActions && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleAllUsers}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último acceso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-gray-50">
                    {showBulkActions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.user_id)}
                          onChange={() => toggleUserSelection(user.user_id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.rut && (
                            <div className="text-xs text-gray-400">RUT: {user.rut}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{roleLabels[user.role]}</span>
                      </div>
                      {user.subjects && user.subjects.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {user.subjects.join(', ')}
                        </div>
                      )}
                      {user.classes && user.classes.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Cursos: {user.classes.join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone && (
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {user.phone}
                        </div>
                      )}
                      <div className="flex items-center mt-1">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-[150px]">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircleIcon className="h-4 w-4 mr-1" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? (
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(user.last_login).toLocaleDateString('es-CL')}
                        </div>
                      ) : (
                        <span className="text-gray-400">Nunca</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar usuario"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.user_id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Restablecer contraseña"
                        >
                          <KeyIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.user_id, user.active)}
                          className={`${user.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          {user.active ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar usuario"
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
              <p className="mt-1 text-sm text-gray-500">
                Intenta ajustar los filtros o crear un nuevo usuario.
              </p>
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredUsers.length} de {mockUsers.length} usuarios
            </span>
            <span>
              Última actualización: {new Date().toLocaleDateString('es-CL')} a las {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Create User Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Usuario</h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de creación de usuarios en desarrollo.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Placeholder */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Editar Usuario: {selectedUser.first_name} {selectedUser.last_name}
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de edición de usuarios en desarrollo.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 