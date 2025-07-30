'use client'

import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'

import { 
  UsersIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

export default function SostenedorUsers() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock data for demonstration
  const networkUsers = [
    {
      id: 1,
      name: 'María González Pérez',
      email: 'maria.gonzalez@sanpatricio.edu.cl',
      role: 'ADMIN_ESCOLAR',
      school: 'Colegio San Patricio',
      status: 'active',
      lastLogin: '2024-12-19T08:30:00',
      createdAt: '2024-01-15T10:00:00',
      phone: '+56 9 8765 4321',
      region: 'Metropolitana'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez Silva',
      email: 'carlos.rodriguez@losandes.edu.cl',
      role: 'ADMIN_ESCOLAR',
      school: 'Instituto Los Andes',
      status: 'active',
      lastLogin: '2024-12-19T07:45:00',
      createdAt: '2024-02-01T09:00:00',
      phone: '+56 9 7654 3210',
      region: 'Valparaíso'
    }
  ]

  const networkStats = {
    totalUsers: 1247,
    activeUsers: 1156,
    newUsersThisMonth: 18,
    loginRate: 92.7
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN_ESCOLAR': return 'bg-purple-100 text-purple-800'
      case 'TEACHER': return 'bg-blue-100 text-blue-800'
      case 'BIENESTAR_ESCOLAR': return 'bg-green-100 text-green-800'
      case 'STUDENT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN_ESCOLAR': return 'Director/UTP'
      case 'TEACHER': return 'Profesor'
      case 'BIENESTAR_ESCOLAR': return 'Bienestar'
      case 'STUDENT': return 'Estudiante'
      default: return role
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios de Red 👥</h1>
            <p className="text-gray-600 mt-1">
              Administra usuarios de todos los colegios de la red educativa
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {/* Export functionality */}}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button
              onClick={() => {/* Create user */}}
              className="flex items-center"
            >
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-blue-600">+{networkStats.newUsersThisMonth} este mes</p>
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
                <p className="text-sm font-medium text-gray-500">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{networkStats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">{networkStats.loginRate}% tasa de login</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Profesores</p>
                <p className="text-2xl font-bold text-gray-900">845</p>
                <p className="text-xs text-purple-600">67.8% del personal</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-yellow-600">Requieren activación</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar usuarios
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nombre, email o colegio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="input"
              >
                <option value="all">Todos los roles</option>
                <option value="ADMIN_ESCOLAR">Director/UTP</option>
                <option value="TEACHER">Profesor</option>
                <option value="BIENESTAR_ESCOLAR">Bienestar</option>
                <option value="STUDENT">Estudiante</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colegio
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="input"
              >
                <option value="all">Todos los colegios</option>
                <option value="san-patricio">Colegio San Patricio</option>
                <option value="los-andes">Instituto Los Andes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Usuarios de la Red ({networkUsers.length})
            </h2>
          </div>

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
                    Colegio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {networkUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <EnvelopeIcon className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.school}</div>
                          <div className="text-sm text-gray-500">{user.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        <span className="capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* View user details */}}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {/* Edit user */}}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 