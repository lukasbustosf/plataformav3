'use client'

import { useState, Fragment } from 'react'
import { useAuth } from '@/store/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ResponsiveTable } from '@/components/ui/responsiveTable'
import { Button } from '@/components/ui/button'
import { 
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { Dialog, Transition } from '@headlessui/react'

interface School {
  school_id: string
  school_name: string
  school_code: string
  director_name: string
  address: string
  phone: string
  email: string
  rut: string
  active: boolean
  created_at: string
  total_users: number
  total_teachers: number
  total_students: number
  ai_credits_used: number
  ai_credits_limit: number
  monthly_cost: number
  last_activity: string
  compliance_score: number
  uptime: number
}

export default function AdminSchoolsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data for schools
  const mockSchools: School[] = [
    {
      school_id: 'school-001',
      school_name: 'Colegio San Antonio de Padua',
      school_code: 'CSAP001',
      director_name: 'María Elena Rodríguez',
      address: 'Av. Los Carrera 1234, Santiago',
      phone: '+56 2 2890 1234',
      email: 'direccion@csap.cl',
      rut: '12.345.678-9',
      active: true,
      created_at: '2024-01-15T10:00:00Z',
      total_users: 487,
      total_teachers: 32,
      total_students: 450,
      ai_credits_used: 2340,
      ai_credits_limit: 5000,
      monthly_cost: 450000,
      last_activity: '2 minutos',
      compliance_score: 98,
      uptime: 99.8
    },
    {
      school_id: 'school-002',
      school_name: 'Escuela Básica Los Andes',
      school_code: 'EBLA002',
      director_name: 'Carlos Mendoza López',
      address: 'Calle Central 567, Valparaíso',
      phone: '+56 32 245 6789',
      email: 'contacto@losandes.cl',
      rut: '23.456.789-0',
      active: true,
      created_at: '2024-02-20T09:15:00Z',
      total_users: 298,
      total_teachers: 22,
      total_students: 275,
      ai_credits_used: 4650,
      ai_credits_limit: 5000,
      monthly_cost: 280000,
      last_activity: '15 minutos',
      compliance_score: 95,
      uptime: 99.2
    },
    {
      school_id: 'school-003',
      school_name: 'Instituto Técnico Metropolitano',
      school_code: 'ITM003',
      director_name: 'Ana Patricia Soto',
      address: 'Av. Providencia 2890, Santiago',
      phone: '+56 2 2567 8901',
      email: 'admin@itm.cl',
      rut: '34.567.890-1',
      active: true,
      created_at: '2024-03-10T11:30:00Z',
      total_users: 723,
      total_teachers: 48,
      total_students: 675,
      ai_credits_used: 1200,
      ai_credits_limit: 8000,
      monthly_cost: 720000,
      last_activity: '5 minutos',
      compliance_score: 100,
      uptime: 99.9
    },
    {
      school_id: 'school-004',
      school_name: 'Colegio Particular Villa Esperanza',
      school_code: 'CPVE004',
      director_name: 'Roberto Silva Morales',
      address: 'Los Robles 456, Concepción',
      phone: '+56 41 234 5678',
      email: 'direccion@villaesperanza.cl',
      rut: '45.678.901-2',
      active: false,
      created_at: '2023-12-05T14:00:00Z',
      total_users: 156,
      total_teachers: 15,
      total_students: 140,
      ai_credits_used: 0,
      ai_credits_limit: 3000,
      monthly_cost: 0,
      last_activity: '1 mes',
      compliance_score: 85,
      uptime: 0
    }
  ]

  const filteredSchools = mockSchools.filter(school => {
    const matchesSearch = school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.school_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.director_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && school.active) ||
                         (statusFilter === 'INACTIVE' && !school.active)
    
    return matchesSearch && matchesStatus
  })

  const handleCreateSchool = () => {
    setShowCreateModal(true)
  }

  const handleEditSchool = (school: School) => {
    toast.success('Funcionalidad de edición próximamente')
  }

  const handleDeleteSchool = (schoolId: string, schoolName: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar "${schoolName}"?`)) {
      toast.success('Escuela eliminada correctamente')
    }
  }

  const handleToggleStatus = (schoolId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    if (confirm(`¿Estás seguro de que deseas ${action} esta escuela?`)) {
      toast.success(`Escuela ${action}da correctamente`)
    }
  }

  const handleExportData = () => {
    toast.success('Exportando datos de escuelas...')
    setTimeout(() => {
      toast.success('Archivo CSV descargado correctamente')
    }, 2000)
  }

  const getStatusBadge = (active: boolean) => {
    if (active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Activa
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Inactiva
        </span>
      )
    }
  }

  const getAIUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 80) return 'text-orange-600 bg-orange-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Escuelas 🏫</h1>
              <p className="mt-2 opacity-90">
                Administra todas las instituciones educativas en la plataforma
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExportData}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                onClick={handleCreateSchool}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Nueva Escuela
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Escuelas</p>
                <p className="text-2xl font-bold text-gray-900">{mockSchools.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Escuelas Activas</p>
                <p className="text-2xl font-bold text-gray-900">{mockSchools.filter(s => s.active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{mockSchools.reduce((sum, s) => sum + s.total_users, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Créditos IA Usados</p>
                <p className="text-2xl font-bold text-gray-900">{mockSchools.reduce((sum, s) => sum + s.ai_credits_used, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar escuelas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="ACTIVE">Solo activas</option>
                  <option value="INACTIVE">Solo inactivas</option>
                </select>
              </div>

              <div className="text-sm text-gray-500">
                Mostrando {filteredSchools.length} de {mockSchools.length} escuelas
              </div>
            </div>
          </div>

          {/* Schools Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-lg font-medium text-gray-900">Escuelas Registradas</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field-mobile"
                  >
                    <option value="ALL">Todos los estados</option>
                    <option value="ACTIVE">Activas</option>
                    <option value="INACTIVE">Inactivas</option>
                  </select>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn-responsive"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Nueva Escuela
                  </Button>
                </div>
              </div>
            </div>
            
                         <ResponsiveTable
               columns={[
                 {
                   key: 'school_name',
                   label: 'Escuela',
                   render: (school_name: string, row: School) => (
                     <div>
                       <div className="text-sm font-medium text-gray-900">{school_name}</div>
                       <div className="text-sm text-gray-500">{row.school_code}</div>
                     </div>
                   )
                 },
                 {
                   key: 'director_name',
                   label: 'Director',
                   hiddenOnMobile: true,
                   render: (director_name: string, row: School) => (
                     <div>
                       <div className="text-sm text-gray-900">{director_name}</div>
                       <div className="text-sm text-gray-500">{row.email}</div>
                     </div>
                   )
                 },
                 {
                   key: 'total_users',
                   label: 'Usuarios',
                   hiddenOnMobile: true,
                   render: (total_users: number, row: School) => (
                     <div>
                       <div className="text-sm font-medium text-gray-900">{total_users}</div>
                       <div className="text-xs text-gray-500">
                         {row.total_teachers} profesores, {row.total_students} estudiantes
                       </div>
                     </div>
                   )
                 },
                 {
                   key: 'ai_credits_used',
                   label: 'IA Usage',
                   render: (ai_credits_used: number, row: School) => {
                     const percentage = Math.round((ai_credits_used / row.ai_credits_limit) * 100)
                     return (
                       <div className="flex items-center">
                         <div className="text-sm font-medium text-gray-900">
                           {ai_credits_used.toLocaleString()} / {row.ai_credits_limit.toLocaleString()}
                         </div>
                         <div className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getAIUsageColor(ai_credits_used, row.ai_credits_limit)}`}>
                           {percentage}%
                         </div>
                       </div>
                     )
                   }
                 },
                 {
                   key: 'active',
                   label: 'Estado',
                   render: (active: boolean) => getStatusBadge(active)
                 },
                 {
                   key: 'actions',
                   label: 'Acciones',
                   render: (_, row: School) => (
                     <div className="flex justify-center space-x-1">
                       <button
                         onClick={() => handleEditSchool(row)}
                         className="text-indigo-600 hover:text-indigo-900 p-1 touch-manipulation"
                         title="Editar"
                       >
                         <PencilIcon className="h-4 w-4" />
                       </button>
                       <button
                         onClick={() => handleToggleStatus(row.school_id, row.active)}
                         className={row.active ? "text-red-600 hover:text-red-900 p-1 touch-manipulation" : "text-green-600 hover:text-green-900 p-1 touch-manipulation"}
                         title={row.active ? "Desactivar" : "Activar"}
                       >
                         {row.active ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                       </button>
                       <button
                         onClick={() => handleDeleteSchool(row.school_id, row.school_name)}
                         className="text-red-600 hover:text-red-900 p-1 touch-manipulation"
                         title="Eliminar"
                       >
                         <TrashIcon className="h-4 w-4" />
                       </button>
                     </div>
                   )
                 }
               ]}
               data={filteredSchools}
               keyExtractor={(row) => row.school_id}
               searchable={true}
               searchPlaceholder="Buscar escuelas..."
               className="border-0 shadow-none"
             />
          </div>
        </div>

        {/* Create School Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nueva Escuela</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de la Escuela</label>
                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Código</label>
                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Director</label>
                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                  </div>
                </div>
                <div className="flex space-x-3 mt-6">
                  <Button
                    onClick={() => {
                      toast.success('Escuela creada correctamente')
                      setShowCreateModal(false)
                    }}
                    className="flex-1"
                  >
                    Crear Escuela
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
      </div>
    </DashboardLayout>
  )
} 